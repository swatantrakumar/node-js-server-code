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

//find missing number form this array [3, 0, 1,5,7,9]
function findMissingNumber(list){
    let min = Math.min(...list);
    let max = Math.max(...list);
    let missingNumber= [];
    for(var i = min;i<=max;i++){
        if(!list.includes(i)){
           missingNumber.push(i); 
        }
    }
    console.log(`Origin Array = ${list}`);
    console.log(`Missing Number In This Array = ${missingNumber}`);
}


findMissingNumber([3, 0, 1,5,7,9]) 

//Useing recursion get factorial of any number
// function factorial(n){
//     if(n === 0 || n === 1){
//         return 1;
//     }
//     return n * factorial(n - 1);
// }
let factorial = factorial(6);
console.log(factorial);

//Useing normal function get factorial of any number
function factorial(n){
    let result = 1;
    for(var i=1;i<=n;i++){
        result *= i;
    }
    return result;
}


//
function printLeftTrangle(n){
    for(let i=0; i < n; i++){
        let star = "";
        for(let j=0; j < n;j++){
            if(j > (n-1)-i){
                star += "  "
            }else{
                star += "* "
            }            
        }
        console.log(star);
    }
}
printLeftTrangle(5);
//out put
// * * * * * 
// * * * *   
// * * *     
// * *       
// *  
//
function printLeftTrangle(n){
    for(let i=0; i < n; i++){
        let star = "";
        for(let j=0; j < n;j++){
            if(j < (n-1)-i){
                star += "  "
            }else{
                star += "* "
            }            
        }
        console.log(star);
    }
}
printLeftTrangle(5);
//out put
//         * 
//       * * 
//     * * * 
//   * * * * 
// * * * * * 

//In this function also second loop change only if condition less then to grater then
function printLeftTrangle(n){
    for(let i=0; i < n; i++){
        let star = "";
        for(let j=n; j > 0;j--){
            if(j > n-i){
                star += "  "
            }else{
                star += "* "
            }            
        }
        console.log(star);
    }
}
printLeftTrangle(5);
//out put
// * * * * * 
//   * * * * 
//     * * * 
//       * * 
//         *

//
function printLeftTrangle(n){
    for(let i=0; i < n; i++){
        let star = "";
        for(let j=n; j > 0;j--){
            if(j < n-i){
                star += "  "
            }else{
                star += "* "
            }            
        }
        console.log(star);
    }
}
printLeftTrangle(5);
//out put
// *         
// * *       
// * * *     
// * * * *   
// * * * * * 
//
function printPattern(n) {
    for (let i = 0; i < n; i++) {
      let line = '';
      for (let j = 0; j < 2 * n; j++) {
        if (j < n - i || j >= n + i) {
          line += '* ';
        } else {
          line += '  '; 
        }
      }
      console.log(line);      
    }
}
printPattern(5);
//Out Put
// * * * * * * * * * * 
// * * * *     * * * * 
// * * *         * * * 
// * *             * * 
// *                 * 
//
function printPattern(n) {
    for (let i = 0; i < n; i++) {
      let line = '';
      for (let j = 0; j < 2 * n; j++) {
         if (j < i + 1 || j >= 2 * n - (i + 1)) {
          line += '* ';
        } else {
          line += '  '; // Add spaces in the center
        }
      }
      console.log(line);      
    }
}
printPattern(5);
//Out Put
// *                 * 
// * *             * * 
// * * *         * * * 
// * * * *     * * * * 
// * * * * * * * * * *
//pattern for star
function printPattern(n) {
    for (let i = 0; i < n; i++) {
      let line = '';
      for (let j = 0; j < 2 * n; j++) {
        if (j < n - i || j >= n + i) {
          line += '* ';
        } else {
          line += '  '; 
        }
      }
      console.log(line);      
    }
    for (let i = 0; i < n; i++) {
      let line = '';
      for (let j = 0; j < 2 * n; j++) {
         if (j < i + 1 || j >= 2 * n - (i + 1)) {
          line += '* ';
        } else {
          line += '  '; 
        }
      }
      console.log(line);      
    }
}
printPattern(5);
//Out Put
// * * * * * * * * * * 
// * * * *     * * * * 
// * * *         * * * 
// * *             * * 
// *                 * 
// *                 * 
// * *             * * 
// * * *         * * * 
// * * * *     * * * * 
// * * * * * * * * * * 
//
