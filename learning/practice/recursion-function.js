// Array and Nested Structure Questions
// 1.>Deep Sum: Write a function that calculates the sum of all numbers in a deeply nested array.
console.log(deepSum([1, [2, [3, 4], 5], [6, [7]], 8])); // Output: 36)


// 2.>Deep Find: Write a function that searches for a specific value in a deeply nested array and returns true if found, otherwise false.
console.log(deepFind([1, [2, [3, 4], 5], [6, [7]], 8], 4)); // Output: true
console.log(deepFind([1, [2, [3, 4], 5]], 9));             // Output: false

// 3.>Flatten Object: Write a function that flattens a deeply nested object into a single-level object with dot-separated keys.
console.log(flattenObject({ a: { b: { c: 1 } }, d: 2 })) //Output: { "a.b.c": 1, "d": 2 }
// 4.>Count Nested Elements: Write a function that counts the total number of elements in a deeply nested array.
console.log(countElements([1, [2, [3, 4], 5], [6, [7]], 8])); // Output: 8
//String Questions
// 5.>Reverse String: Write a recursive function to reverse a string.
console.log(reverseString("hello")); // Output: "olleh"
// 6.>Palindrome Check: Write a recursive function to check if a string is a palindrome.
isPalindrome("racecar"); // Output: true
isPalindrome("hello");   // Output: false
// 7.>Character Count: Write a recursive function to count how many times a specific character appears in a string.
countChar("recursion", "r"); // Output: 2
// Number Questions
// 8.>Sum of Digits: Write a recursive function to calculate the sum of the digits of a number.
sumOfDigits(12345); // Output: 15
//9.>Power of a Number: Write a recursive function to calculate a power b(a raised to the power of b).
power(2, 3); // Output: 8
//10.>Fibonacci Sequence: Write a recursive function to find the nth number in the Fibonacci sequence.
fibonacci(5); // Output: 5 (sequence: 0, 1, 1, 2, 3, 5)
//Object and Tree Questions
// 11.>Count Keys in Object: Write a recursive function to count all the keys in a deeply nested object.
countKeys({ a: 1, b: { c: 2, d: { e: 3 } } }); // Output: 5
//12.>Tree Depth: Write a recursive function to find the maximum depth of a nested object.
maxDepth({ a: { b: { c: { d: 1 } } }, e: 2 }); // Output: 4
// 13.>Sum of Tree Nodes: Write a recursive function to calculate the sum of all values in a tree-like structure.
sumTree({ value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [{ value: 4, children: [] }] }] });
//General Problem-Solving Questions
//14.>Permutations: Write a recursive function to find all permutations of a given array or string.
permutations([1, 2, 3]);
// Output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
//15.>Factorial Using Tail Recursion: Implement a tail-recursive version of the factorial function for better performance on large inputs.
//16.>Tower of Hanoi: Write a recursive function to solve the Tower of Hanoi problem.
towerOfHanoi(3, "A", "C", "B"); // Output: Sequence of moves
//17.>Generate Subsets: Write a recursive function to generate all subsets (power set) of a given array.
subsets([1, 2]);// Output: [[], [1], [2], [1, 2]]
//18.>Binary Search (Recursive): Write a recursive function to perform binary search on a sorted array.
binarySearch([1, 2, 3, 4, 5], 3); // Output: 2 (index)
//19.>Nested Parentheses Check: Write a recursive function to check if a string has valid nested parentheses.
isValidParentheses("(())"); // Output: true
isValidParentheses("(()");  // Output: false
// 20.>Flatten Linked List: Write a recursive function to flatten a linked list where each node can have a "child" linked list.

//flat array
function flatArray(array){
    let flat =[];
    for(let num of array){
        if(Array.isArray(num)){
            for(let val of num){
                flat.push(val);
            }
        }else{
            flap.push(num)
        }
    }
    return flat;
}
let array = [5,6,[6,8],4,5,3,[5,4,6,7]];
let flatt = flatArray(array);
console.log(flatt);
