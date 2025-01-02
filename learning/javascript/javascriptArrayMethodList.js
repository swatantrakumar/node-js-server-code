//both method similar
some()  // this method is checking any one value is satisfied the condition 
        //It returns true if at least one element satisfies the condition
    syntex : - array.some(callback(element, index, array), thisArg);
    // Example without arg
    var numbers = [-1, -2, 3, -4];
    const hasPositive = numbers.some(num => num > 0);
    console.log(hasPositive); // true
    // Example with arg
    var fruits = ["apple", "orange", "grape"];
    var checker = {
        fruitToFind: "grape",
    };
    var foundFruit = fruits.some(function(fruit) {
        return fruit === this.fruitToFind;
    }, checker);
    console.log(foundFruit); // Output: true
every() // this mehtod is checking all value is satisfied the condition
    syntex : - array.every(callback(element, index, array), thisArg);
    //Example without arg
    var numbers = [1, 2, 3, 4, 5];
    const allPositive = numbers.every(num => num > 0);
    console.log(allPositive); // true
    //Example with arg
    var fruits = ["apple", "apple", "apple"];
    var checker = {
    fruitToCheck: "apple"
    };
    var allSameFruit = fruits.every(function(fruit) {
        return fruit === this.fruitToCheck;
    }, checker);
    console.log(allSameFruit); // true

//simmilar method
pop()  // remove or return last vlaue form array
    syntex :- array.pop();
    //Example 
    var fruits = ["apple", "banana", "cherry"];
    var removedFruit = fruits.pop();
    console.log(removedFruit); // Output: "cherry"
    console.log(fruits);       // Output: ["apple", "banana"]

shift() // rmove or return first value form array
    syntex :- array.shift();
    //Example
    var fruits = ["apple", "banana", "cherry"];
    var removedFruit = fruits.shift();
    console.log(removedFruit); // Output: "apple"
    console.log(fruits);       // Output: ["banana", "cherry"]
 
unshift() // add the value from start or return length or array
    syntex :- array.unshift(element1, element2, elementN);
    //Example
    var fruits = ["banana", "cherry"];
    var newLength = fruits.unshift("apple");
    console.log(fruits);       // Output: ["apple", "banana", "cherry"]
    console.log(newLength);    // Output: 3
push()  // add the value in this array
    snytex:- array.push(element);
    //Example
    var fruits = ["banana", "cherry"];
    var newLength = fruits.push("apple");
    console.log(fruits);       // Output: ["apple", "banana", "cherry"]
    console.log(newLength);    // Output: 3

slice() // cut value form array when pass the parameter start or end in this function
    syntex:- array.slice(start, end);
    //Example
    var fruits = ["apple", "banana", "cherry", "date", "fig"];
    var slicedFruits = fruits.slice(1, 4); // end parameter is optional if you don't pass end parameter then auto set ths last of the array or string length
    //if you don't pass any parameter in this function then cut all value in this array like a cello copy like that.
    console.log(slicedFruits); // Output: ["banana", "cherry", "date"]
    console.log(fruits);  
splice() // insert, replace or remove value in this array on passed index vlaue splice(start,deleteCount,item,item2.....itemN)
    syntex:- array.splice(start, deleteCount, item1, item2, itemN);
    //Example
    var fruits = ["apple", "banana", "cherry", "date"];
    var removedFruits = fruits.splice(1, 0,"orange"); // add the value in array after start index
    var removedFruits = fruits.splice(1, 2); // remove 2 value from srart index
    var removedFruits = fruits.splice(1, 2,"orange","tomato");// replace banana,cherry to orange,tomato
    console.log(fruits);       // Output: ["apple", "date"]
    console.log(removedFruits); // Output: ["banana", "cherry"]
    //deleteCount is optional if you don't pass deleteCount value then auto add last index or array it means remove all value form passed start index in this method.
    //return this method only removed item value array

toSpliced() // this method is used same splice()
    //splice() modifies the original array
    //toSpliced() returns a new array and leaves the original array unchanged.
    syntex:- array.toSpliced(start, deleteCount, item1, item2, itemN);
    //Example:-
    const fruits = ["apple", "banana", "cherry", "date"];
    const newFruits = fruits.toSpliced(1, 2);
    console.log(newFruits); // Output: ["apple", "date"]
    console.log(fruits);    // Output: ["apple", "banana", "cherry", "date"] (unchanged)
    //return a new array after removed value form this array 
object.with() //this method is used for repalce the value passing index or value with(2,6) this is replce the value from index 2
    syntex:- updatedObject - object.with(property, value);
    //Example
    const user = {
        name: "Alice",
        age: 30,
        location: "New York",
    };    
    const updatedUser = user.with("location", "San Francisco");    //if this property is available then replace or if not then add this property in this object or return new updated object not chagned in existing object.
    console.log(updatedUser); // Output: { name: "Alice", age: 30, location: "San Francisco" }
    console.log(user);        // Output: { name: "Alice", age: 30, location: "New York" } (unchanged)
    //return a new object unchanged existing object.

///similar method
filter()  // this method is filter the data from array or return list or fiter data
    syntex:- array.filter(callback(element, index, array), thisArg);
    //Example
    //without arg
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var evenNumbers = numbers.filter(num => num % 2 === 0);
    console.log(evenNumbers); // Output: [2, 4, 6, 8]
    console.log(numbers);     // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9] (original array unchanged)
    //with arg
    var obj = { threshold: 5 };
    var numbers = [2, 3, 6, 8, 10];

    var filteredNumbers = numbers.filter(function(num) {
        return num > this.threshold;
    }, obj);

    console.log(filteredNumbers); // Output: [6, 8, 10]
    //return a new array without any changes in original array

find() // this method is filter this data form array or return fiterd first data from this fitered list.
    syntex:- array.find(callback(element, index, array), thisArg);
    //Example
    //without arg
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var firstEven = numbers.find(num => num % 2 === 0);
    console.log(firstEven); // Output: 2
    //with arg
    var obj = { threshold: 5 };
    var numbers = [2, 3, 6, 8, 10];
    var filteredNumbers = numbers.find(function(num) {
        return num > this.threshold;
    }, obj);
    console.log(filteredNumbers); // Output: 6
    //return a first value from filtered array

findIndex() // this method is filter this data form array or return fiterd first data index from this fitered list.
    syntex:- array.findIndex(callback(element, index, array), thisArg)
    //Example
    //without arg
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var indexOfFirstEven = numbers.findIndex(num => num % 2 === 0);
    console.log(indexOfFirstEven); // Output: 1 (index of number 2)
    //with arg
    var obj = { threshold: 5 };
    var numbers = [2, 3, 6, 8, 10];
    var filteredNumbers = numbers.findIndex(function(num) {
        return num > this.threshold;
    }, obj);
    console.log(filteredNumbers); // Output: 2 (index of number 6);
    //return a first value index from filtered array
    
findLast() // this method is filter this data form array or return fiterd last data from this fitered list.
    syntex:- array.findLast(callback(element,index,array),thisArg);
    //Example
    //Without args
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var lastOdd = numbers.findLast((num)=> num % 2 !== 0);
    console.log(lastOdd) // 9
    //with arg
    var obj = { age : 20 };
    var numbers = [20,25,63,56,85,69,45];
    var findLast = numbers.findLast(function(num ){
        return num > this.age;
    },obj);
    console.log(findLast); // 45
    //retun a last value from filtered array

findLastIndex() // this method is filter this data form array or return fiterd last data index from this fitered list.
    syntex:- array.findLastIndex(callback(element, index, array), thisArg)
    //Example
    //without arg
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var indexOfFirstEven = numbers.findLastIndex(num => num % 2 === 0);
    console.log(indexOfFirstEven); // Output: 7 (index of number 8)
    //with arg
    var obj = { threshold: 5 };
    var numbers = [2, 3, 6, 8, 10];
    var filteredNumbers = numbers.findLastIndex(function(num) {
        return num > this.threshold;
    }, obj);
    console.log(filteredNumbers); // Output: 4 (index of number 10);
    //return a last value index from filtered array

//similar method
flat()   // flat a array like if in a array nested array or convert all nested array in a single array use this methos
    syntex:- array.flat(depth); // depth optional default depth is 1 if you don't konw how many nsted array in this that time pass Infinity in depth position
    //Example
    var numbers = [1, 2, [3, 4], 5, [6, 7]];
    var flattenedNumbers = numbers.flat();
    console.log(flattenedNumbers); // Output: [1, 2, 3, 4, 5, 6, 7]
    //useing depth
    var numbers = [1, 2, [3, 4], 5, [6, [7,8]]];
    var flattenedNumbers = numbers.flat(2);
    console.log(flattenedNumbers); // Output: [1, 2, 3, 4, 5, 6, 7,8]
    //useing infinity
    var numbers = [1, 2, [3, 4], 5, [6, [7,[8,[9,10]]]]];
    var flattenedNumbers = numbers.flat(Infinity);
    console.log(flattenedNumbers); // Output: [1, 2, 3, 4, 5, 6, 7,8]

flatMap()  /// this method is user combile map with flat function like first use the modify the array if modify array value in array but return only singe array not a nested array.
    syntex:- array.flatMap(callback(currentValue, index, array), thisArg);
    //Example
    const numbers = [1, 2, 3, 4];
    const flattenedSquares = numbers.flatMap((num) => [num, num * num]);
    console.log(flattenedSquares); // Output: [1, 1, 2, 4, 3, 9, 4, 16]
    //Example
    var phrases = ["hello world", "flat map example"];
    var words = phrases.flatMap(phrase => phrase.split(" "));
    console.log(words); // Output: ["hello", "world", "flat", "map", "example"]


//similar method
indexOf()  // get the index of value if passed value if exists then return index ot this value otherwise return -1.
    syntex:- array.indexOf(element, startIndex);
    //Example
    //without start index
    var fruits = ["apple", "banana", "cherry", "apple"];
    var index = fruits.indexOf("banana");
    console.log(index); // Output: 1
    //with start index
    var fruits = ["apple", "banana", "cherry", "banana", "apple"];
    var index = fruits.indexOf("banana",2);
    console.log(index); // Output: 3
    //Case Sensitivity
    const fruits = ["apple", "banana", "cherry"];
    const index = fruits.indexOf("APPLE");
    console.log(index); // Output: -1

lastIndexOf() // same to indexOf but one change find the value if value is more than one after that retur the last value index.
    syntex:-  array.lastIndexOf(element, startIndex);
    //Example
    const fruits = ["apple", "banana", "cherry", "apple"];
    const index = fruits.lastIndexOf("apple");
    console.log(index); // Output: 3
    //with start index
    var fruits = ["apple", "banana", "cherry", "apple"];
    var index = fruits.lastIndexOf("apple", 2); // Start searching from index 2
    console.log(index); // Output: 0

includes()  // check the vlaue exists or not in this array return boolean value.
    syntex:- array.includes(element, startIndex);
    //Example
    var fruits = ["apple", "banana", "cherry"];
    var containsBanana = fruits.includes("banana");
    console.log(containsBanana); // Output: true
    //with start index
    var fruits = ["apple", "banana", "cherry", "banana"];
    var containsBananaFromIndex2 = fruits.includes("banana", 2);
    console.log(containsBananaFromIndex2); // Output: true

    var sentence = "The quick brown fox";
    var containsQuick = sentence.includes("quick");
    console.log(containsQuick); // Output: true

Array.isArray() // check the passed vlaue is array or not or return boolean value.
    //example
    var fruits = ["apple", "banana", "cherry"];
    var isArray = Array.isArray(fruits);
    console.log(isArray); // Output: true
    //example 2
    var arr = new Array(5); // Creates an array with 5 empty slots
    var isArray = Array.isArray(arr);
    console.log(isArray); // Output: true

//similar method  ES6 Methods
from()  /// string to array convert
    syntex:- Array.from(arrayLike, mapFunction, thisArg);
    //Example
    var str = "hello";
    var arr = Array.from(str);
    console.log(arr); // Output: ['h', 'e', 'l', 'l', 'o']
    //with map function
    var numbers = [1, 2, 3, 4];
    var doubled = Array.from(numbers, num => num * 2);
    console.log(doubled); // Output: [2, 4, 6, 8]
    //with map or args
    var multiplier = {
        factor: 2,
        multiply(x) {
          return x * this.factor;
        }
      };
      
      var numbers = [1, 2, 3];
      var multiplied = Array.from(numbers, function(num) {
        return this.multiply(num);
      }, multiplier);
      
      console.log(multiplied); // Output: [2, 4, 6]

fromAsync() // that time convert
join()  // array to string with separator
      syntex:- array.join(separator);
      //Example
      var fruits = ["apple", "banana", "cherry"];
      var result = fruits.join();
      console.log(result); // Output: "apple,banana,cherry"
      //with separator
      var fruits = ["apple", "banana", "cherry"];
      var result = fruits.join(" - ");
      console.log(result); // Output: "apple - banana - cherry"

toLocalString() /// used to convert a number or a date object into a string
    syntex:- number.toLocaleString(locales, options);
            date.toLocaleString(locales, options);
    //Example
    //Number
    var number = 1234.56;

    // Default usage
    console.log(number.toLocaleString()); //1,234.56

    // With locales and options
    console.log(number.toLocaleString('en-US', { style: 'currency', currency: 'USD' })); // $1,234.56
    console.log(number.toLocaleString('en-US', { style: 'currency', currency: 'INR' })); // ₹1,234.56
    //Date
    var date = new Date();

    // Default usage
    console.log(date.toLocaleString());  // 12/5/2024, 6:02:26 AM

    // With locales and options
    console.log(date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })); // Thursday, December 5, 2024
    // With locales and options
    console.log(date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' })); // Thursday, December 5, 2024 at 6:05 AM

toString() // 
      syntex:- value.toString([radix]);
      //Example
      //Number
    var num = 255;
    // Convert number to string
    console.log(num.toString()); 
    // Convert number to binary
    console.log(num.toString(2));
    // Convert number to octal
    console.log(num.toString(8));
    // Convert number to hexadecimal
    console.log(num.toString(16));
    //String
    var str = "Hello, World!";
    console.log(str.toString()); 
    //Array
    var arr = [1, 2, 3, 4];
    console.log(arr.toString());
    //Date
    var date = new Date();
    console.log(date.toString());

concat()  // merge the one to more array in a single array
      syntex:- array1.concat(array2, array3, arrayN);
               string1.concat(string2, string3, stringN);
    //Example
    //For Array
    var array1 = [1, 2, 3];
    var array2 = [4, 5, 6];
    var array3 = [7, 8, 9];

    // Merge two arrays
    var result1 = array1.concat(array2);
    console.log(result1);  // Output: [1, 2, 3, 4, 5, 6]

    // Merge multiple arrays
    var result2 = array1.concat(array2, array3);
    console.log(result2); // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]

    // Original arrays remain unchanged
    console.log(array1); // Output: [1, 2, 3]
    //String
    var str1 = "Hello, ";
    var str2 = "World!";
    var str3 = " Have a great day.";

    // Merge two strings
    var result1 = str1.concat(str2);
    console.log(result1); // Output: "Hello, World!"

    // Merge multiple strings
    var result2 = str1.concat(str2, str3);
    console.log(result2); // Output: "Hello, World! Have a great day."

//similar method

// both are create a array but some difference between this array if pass on value in Array(7) then create a lentht of the array but if you use of(7) method then create array with 7 value in this array
new Array()  /// create a new array with passed elements..// Array(1,2,3,4,5,6)  // [1,2,3,4,5,6]
      syntex: - new Array(element1, element2,  elementN);
      //Example
      console.log(new Array(1,2,3)) // [1,2,3]
      //Example
      const filledArray = new Array(5).fill(0);
      console.log(filledArray); // Output: [0, 0, 0, 0, 0]

      const mappedArray = new Array(5).fill(0).map((_, index) => index + 1);
      console.log(mappedArray);  // Output: [1, 2, 3, 4, 5]

of()  /// create a array with passed value in this method  ES6 Methods
      syntex:- Array.of(element1, element2,  elementN);
      //Example
      var array = Array.of(1, 2, 3, 4, 5);
      console.log(array); // Output: [1, 2, 3, 4, 5]
    //Difference Between Array.of() and new Array()
    //The Array.of() method treats single numeric arguments as elements, not a length.

//similar method
at()  // this method basically used for get the value useing index
      syntex:- arrayOrString.at(index);
      //Example
      var array = [10, 20, 30, 40, 50];

    // Accessing elements using positive indices
    console.log(array.at(0));  // Output: 10
    console.log(array.at(2));  // Output: 30

    // Accessing elements using negative indices
    console.log(array.at(-1)); // Output: 50
    console.log(array.at(-3)); // Output: 30

    // Out-of-bounds index returns undefined
    console.log(array.at(10)); // Output: undefined
    console.log(array.at(-10)); // Output: undefined

array[0] // both are similar 
//similar method
copyWithin()  // almost similar the methos this method is work for copy this valu in this array or pest ih this arrya with target position
    syntex:- array.copyWithin(target, start, end);
    //Example
    var array = [1, 2, 3, 4, 5];
    // Copy elements starting from index 0 to index 3
    array.copyWithin(3, 0);
    console.log(array); // Output: [1, 2, 3, 1, 2]
    var array = [10, 20, 30, 40, 50, 60];
    // Copy elements from index 1 to index 4 (non-inclusive) to index 0
    array.copyWithin(0, 1, 4);
    console.log(array); // Output: [20, 30, 40, 40, 50, 60]

fill()  //  ih this method pass value or this value are fill in this array when passed position start to end postion
      syntex:- array.fill(value, start, end);
      //Example
      var array = [1, 2, 3, 4, 5];
      // Fill the entire array with 0
      array.fill(0);
      console.log(array); // Output: [0, 0, 0, 0, 0]

        var array = [1, 2, 3, 4, 5];
        // Fill starting from index 2 with 7
        array.fill(7, 2);
        console.log(array); // Output: [1, 2, 7, 7, 7]
        const array = [1, 2, 3, 4, 5];
        // Fill from index 1 to 3 (end is non-inclusive) with 9
        array.fill(9, 1, 3);
        console.log(array); // Output: [1, 9, 9, 4, 5]

//similar method
entries()  // this methos also itrate this array or return liste of nestd array because of every value covert in a array keyvalue paire
        syntex:- array.entries();
        //example
        const array = ['a', 'b', 'c'];
        // Get an iterator
        const iterator = array.entries();
        // Access each key/value pair
        console.log(iterator.next().value); // Output: [0, 'a']

        const array = ['x', 'y', 'z'];
        for (const [index, value] of array.entries()) {
            console.log(`Index: ${index}, Value: ${value}`);
        }

keys()  //  // itrate this array or retrn list of keys of this array
        syntex:- array.keys();
        //Example
        const array = [10, 20, 30];

        for (const key of array.keys()) {
            console.log(key);
        }
        // Output:
        // 0
        // 1
        // 2
values()  //  itrate this array or return list of value of this array
    syntex:- array.values();
    //Example
    const array = [10, 20, 30];

    for (const key of array.values()) {
        console.log(key);
    }
    // Output:
    // 10
    // 20
    // 30

// similar method
map()  // this method is used for modify thie array vlaue or return list of data not change original array.
    syntex:- array.map(callback(currentValue, index, array), thisArg);
    //Example
    const numbers = [1, 2, 3, 4, 5];
    // Multiply each element by 2
    const doubled = numbers.map(num => num * 2);
    console.log(doubled); // Output: [2, 4, 6, 8, 10]
    console.log(numbers); // [1,2,3,4,5]
    //Example 2
    const users = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 }
      ];
      
    // Extract the names of the users
    const names = users.map(user => user.name);
    console.log(names); // Output: ['Alice', 'Bob', 'Charlie']
    const multiplier = {
        value: 3,
        multiply(num) {
            return num * this.value;
        }
    };    
    const numbers = [1, 2, 3];    
    // Use multiplier as `this` in the callback
    const tripled = numbers.map(function (num) {
        return this.multiply(num);
    }, multiplier);    
    console.log(tripled); // Output: [3, 6, 9]
    const numbers = [1, 2, 3, 4, 5];

    // Square each number and filter out those greater than 10
    const result = numbers
    .map(num => num * num)
    .filter(square => square > 10);

    console.log(result);// Output: [16, 25]

forEach()  // this methos is used for get every value or wright the operation of this value
        syntex:- array.forEach(callback(currentValue, index, array), thisArg);
        //Example
        const numbers = [1, 2, 3, 4, 5];
        // Print each number
        numbers.forEach(num => console.log(num)); //output 1 2 3 4 5
        //Example 2
        const fruits = ['apple', 'banana', 'cherry'];

        // Log each fruit with its index
        fruits.forEach((fruit, index) => {
            console.log(`Index ${index}: ${fruit}`);
        });
        // Output:
        // Index 0: apple
        // Index 1: banana
        // Index 2: cherry
        //Example with args
        const multiplier = {
            value: 3,
            multiply(num) {
              console.log(num * this.value);
            }
          };
          
        const numbers = [1, 2, 3];
        
        // Use multiplier as `this` in the callback
        numbers.forEach(function (num) {
            this.multiply(num);
        }, multiplier);
        // Output:
        // 3
        // 6
        // 9

length  /// geting the lenght for this array

// smilar method
reduce()  /// this method is used for get some of this array value basicall this is used for number list of array
        syntex:- array.reduce(callback(accumulator, currentValue, index, array), initialValue);
        //Example
        const numbers = [1, 2, 3, 4, 5];
        // Sum up the elements
        const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        console.log(sum);  // Output: 15
        // if you don't pass initialValue then automaticall pic the 0 index value form your array or that time currentValue is 1 index value
        //Example find heighest no. of this array useing reduce
        const numbers = [2,56,8,4,95,25];
        var max = numbers.reduce((accumulator,currentValue) => currentValue > accumulator ? currentValue : accumulator);
        console.log(max); // 95
        //Example 3 group or with numbers
        const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
        // Count occurrences of each fruit
        const fruitCount = fruits.reduce((accumulator, currentValue) => {
            accumulator[currentValue] = (accumulator[currentValue] || 0) + 1;
            return accumulator;
        }, {});
        console.log(fruitCount); // Output: { apple: 3, banana: 2, orange: 1 }
        const people = [
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 },
            { name: 'Charlie', age: 25 },
            { name: 'Sumit', age: 30 },
        ];
        const groupByAge = people.reduce((accumulator,obj) => {
            if(!accumulator[obj.age]){
                accumulator[obj.age] = [];
            }
            accumulator[obj.age].push(obj.name);
            return accumulator;
        },{})
        console.log(groupByAge); // { '25': [ 'Alice', 'Charlie' ], '30': [ 'Bob', 'Sumit' ] }
reduceRight()  /// this is similar ot reduce but some of this value pattern is right to left
        syntex:- array.reduce(callback(accumulator, currentValue, index, array), initialValue);
        //Example
        var numbers = [1, 2, 3, 4, 5];

        // Reverse the array
        var reversed = numbers.reduceRight((accumulator, currentValue) => {
          accumulator.push(currentValue);
          return accumulator;
        }, []);
        console.log(reversed);// Output: [5, 4, 3, 2, 1]
        //Example
        var words = ['Hello', 'World', '!'];

        // Concatenate strings from right to left
        const sentence = words.reduceRight((accumulator, currentValue) => accumulator + ' ' + currentValue);
        console.log(sentence); // Output: "! World Hello"
//similar method
reverse()  /// this method use for revers the array vlaue last to first or first to lase
        // change the original array also
        syntex:- array.reverse()
        //example
        let numbers = [1, 2, 3, 4, 5];
        console.log("Before reverse:", numbers);  // [ 1, 2, 3, 4, 5 ]
        // Reversing the array
        var reversed = console.reverse();
        console.log("Reversed Array:", reversed); //[ 5, 4, 3, 2, 1 ]
        console.log("Origin Array:", numbers); //[ 5, 4, 3, 2, 1 ]

        //Note :- return  reversed array

toReversed()  // 
        syntex:- array.toReversed()
        //Example
        let numbers = [1, 2, 3, 4, 5];
        console.log("Original Array:", numbers);

        // Using toReversed() to reverse the array
        let reversedNumbers = numbers.toReversed();
        console.log("Reversed Array:", reversedNumbers);

        // Original array remains unchanged
        console.log("Original Array After toReversed:", numbers);

        //Returns: A new array with the elements reversed.
        //note:- Does not modify the original array.

sort()  // this method is use for sort a array value in assending or desendig order
        syntex:- array.sort([compareFunction])
        //Example
        // change the original array also
        let fruits = ["banana", "apple", "cherry", "date"];
        console.log("Before sort:", fruits); //[ 'banana', 'apple', 'cherry', 'date' ]

        fruits.sort();
        console.log("After sort:", fruits); //[ 'apple', 'banana', 'cherry', 'date' ]

        let numbers = [40, 5, 8, 100, 1];
        console.log("Before sort:", numbers); // [ 40, 5, 8, 100, 1 ]

        // Ascending order
        numbers.sort((a, b) => a - b);
        console.log("Ascending:", numbers); //[ 1, 5, 8, 40, 100 ]

        // Descending order
        numbers.sort((a, b) => b - a);
        console.log("Descending:", numbers); //[ 100, 40, 8, 5, 1 ]
toSorted()  // 
        syntex:- array.toSorted([compareFunction])
        //Example
        const fruits = ["banana", "apple", "cherry", "date"];
        console.log("Original Array:", fruits);

        // Using toSorted()
        const sortedFruits = fruits.toSorted();
        console.log("Sorted Array:", sortedFruits);

        // Original array remains unchanged
        console.log("Original Array After toSorted:", fruits);
        //Returns: A new array with the elements sorted.
        //note:- Does not modify the original array.

//similar method




