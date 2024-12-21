isNaN()
    //syntex
    Number.isNaN(value)
    //Example
    console.log(isNaN(NaN));             // true
    console.log(isNaN("hello"));         // true (cannot be converted to a number)
    console.log(isNaN(undefined));       // true (undefined is not a number)
    console.log(isNaN("123"));           // false (can be converted to number 123)
    console.log(isNaN(123));             // false (already a number)
    console.log(isNaN(null));            // false (null coerces to 0)
    console.log(isNaN(""));             // false (empty string coerces to 0)