function checkValueInArray(array){
    let object = {};
    if(array && array.length > 0){
        for (let index = 0; index < array.length; index++) {
            let value = array[index];
            let times = object[value] ? object[value]:0;            
            object[value] = times + 1;            
        }
    }
    console.log(object);
}
let test = [1, 111, 1, 1, 1, 1, 2, 2, 1, 1, 3, 1, 3, 3];
checkValueInArray(test);

function getHighestThreeNumberFromArray(array){
    let heighestNumber = [0,0,0]
    if(array && array.length > 0){
        for (let index = 0; index < array.length; index++) {
            let number = array[index];
            if(heighestNumber.length > 0){
                if(number > heighestNumber[0]){
                    heighestNumber[2] = heighestNumber[1]
                    heighestNumber[1] = heighestNumber[0]
                    heighestNumber[0] = number;
                }else if(number > heighestNumber[1]){
                  heighestNumber[2] = heighestNumber[1];
                  heighestNumber[1] = number
                }else if(number > heighestNumber[2]){
                  heighestNumber[2]= number
                }
            }
        }
    }
    console.log(heighestNumber);
}
let test2 = [34, 74, 67, 47, 99, 89,12];
getHighestThreeNumberFromArray(test2);

function createFlatArray(array,newArray=[]){    
    if(array && array.length > 0){
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(Array.isArray(element) && element.length > 0){                
                createFlatArray(element,newArray)
            }else{
                newArray.push(element);
            }            
        }
    }   
    return newArray; 
}
let array = [6,[2,[1,9],[7]],6,10,7];
let flatArray = createFlatArray(array);
console.log(flatArray);