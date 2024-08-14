const Operator = require("../enum/operator");
const AccountBook = require("../model/generic/accountBook");
const CommonUtils = require("../utils/commonUtils");
const CollectionHandler = require("./collectionHandler");
const QueryCriteria = require("./queryHandler/queryCriteria");
const {ObjectId} = require('mongodb');


const commonUtil = new CommonUtils();
const collectionHandler = new CollectionHandler();

class AccountBookHandler{
    async getDailyBookSerialNumber(refCode, series, financialDay, accountBooks) {
		const transactionSerialNumber = 1;
        try {                  
            let accountBook = await this.getDailyBook(refCode, series,financialDay);
            if (accountBook) {
                transactionSerialNumber = accountBook.srNumber + 1;
                accountBook.srNumber = transactionSerialNumber;
                accountBook.updateDate = new Date();
                
                console.info(`Saving account Book with new SerialNumber ${accountBook.case_id} : ${accountBook.series} : ${accountBook.srNumber}`);
                
                // Save the updated account book
                await collectionHandler.insertDocument(accountBook);
                
                // Copy properties (assuming you have a similar utility function)
                copyProperties(accountBook, accountBooks);
            }
        } catch (error) {
            console.error('Error in getDailyBookSerialNumber:', error);     
        }
		return transactionSerialNumber;
	}
    async getDailyBook(refCode, series, financialDay) {
		let accountBook;
		const year = commonUtil.getFinancialYear(financialDay);
		const month = commonUtil.getMonth(financialDay);
		const fDay = commonUtil.getFinancialDay(financialDay);
		accountBook = await this.findByFinancialDay(refCode, series, year,month,fDay);
		if(accountBook==null){
			console.info("accountBook Could not be Retrived, hence creating new Book for {}, {}, {}, {}",  refCode,series, year,financialDay);
			accountBook = this.getNewAccountBook(refCode,series, financialDay);
		}
		return accountBook;
	}
    async findByFinancialDay(refCode, series, fYear,month,fDay) {
		let queryCriteriaList = [];
		queryCriteriaList.push(new QueryCriteria("refCode","string",Operator.EQUAL,refCode));
		queryCriteriaList.push(new QueryCriteria("series","string",Operator.EQUAL,series));
		queryCriteriaList.push(new QueryCriteria("fYear","string",Operator.EQUAL,fYear));
		queryCriteriaList.push(new QueryCriteria("month","string",Operator.EQUAL,month));
		queryCriteriaList.push(new QueryCriteria("fDay","string",Operator.EQUAL,fDay));
		let accountBook = await collectionHandler.findDocumentsWithListQueryCriteria(AccountBook, queryCriteriaList,"-srNumber,-updateDate,-createdDate");
		return accountBook; //query.order("-srNumber,-updateDate,-createdDate").get();
	}
    getNewAccountBook(refCode, series , date ) {
        if (!date) date = new Date();    
        const accountBook = new AccountBook({
            _id: new ObjectId().toString(), // Generates a new ObjectId
            refCode: refCode,
            series: series,
            fYear: commonUtil.getFinancialYear(date),
            month: commonUtil.getMonth(date),
            fDay: commonUtil.getFinancialDay(date),
            srNumber: 0,
            createdDate: new Date()
        });        
        return accountBook;
    }
}