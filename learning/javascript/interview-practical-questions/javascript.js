var number = [4,5,1,2,8,9,6,3];
var sort = [];

for (let index = 1; index < number.length; index++) { 
    var num = number[index];   
    for (let j = 0; j < number.length - 1; j++) {        
        if(num < number[j]){
            number[index] = number[j];
            number[j] = num;
        }
    } 
      
}
console.log("Sort acc :", number)
function bubbleSort(arr) {
    let n = arr.length;
    
    // Traverse all elements in the array
    for (let i = 0; i < n - 1; i++) {
        // Last i elements are already sorted, so no need to compare them again
        for (let j = 0; j < n - 1 - i; j++) {
            // Swap if the element found is greater than the next element
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// Example usage
const numbers = [2000, 30000, 5000, 60000];
console.log(bubbleSort(numbers))

function reverseWords(input){
    let reverseString = "";
    input.split(" ").forEach((val)=>{
        const alphabets = val.match(/[a-zA-Z]/g).reverse();
        let index = 0;
        reverseString = reverseString +" "+ val.split('').map(char =>{
            if(/[a-zA-Z]/.test(char)){
               return alphabets[index++] 
            }
            return char;
        }).join("");
    })
    console.log(reverseString);    
}


function reverseWordsWithoutSymbols(input){
    let reverseString = "";
    input.split(" ").forEach((val)=>{
        reverseString = reverseString + " " + Array.from(val).reverse().join("");
    })
    console.log(reverseString)
}


reverseWordsWithoutSymbols("JavaScript is awesome"); // "tpircSavaJ si emosewa"

reverseWords("Ja@vaS$cri!pt i$s aw*es#om@"); /// "tp@irc$Sav!aJ s$i em*os#ew@a”

const string = "std*dgae(/4%dsfdkd";
const test = string.match(/[a-zA-Z]/g);
console.log("Find alphabets = " + test);