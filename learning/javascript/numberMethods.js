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
isFinite()
    //syntex
    isFinite(value)
    //Return
    // true: If the value is a finite number.
    // false: Otherwise (if the value is Infinity, -Infinity, NaN, or not a number).
    //Example
    isFinite(10);        // true (10 is a finite number)
    isFinite(-10);       // true (-10 is a finite number)
    isFinite(0);         // true (0 is a finite number)
    isFinite(Infinity);  // false
    isFinite(-Infinity); // false
    isFinite(NaN);       // false
Number.isInteger()
    //Syntex
    Number.isInteger(value)
    // Return Value
    // true: If the value is an integer.
    // false: Otherwise (if the value is not an integer, is NaN, Infinity, -Infinity, or not of type number).
    //Example
    Number.isInteger(10);       // true (10 is an integer)
    Number.isInteger(-5);       // true (-5 is an integer)
    Number.isInteger(0);        // true (0 is an integer)
    Number.isInteger(10.5);     // false (10.5 is not an integer)
    Number.isInteger(NaN);      // false
    Number.isInteger(Infinity); // false
    Number.isInteger(-Infinity);// false
Number.isSafeInteger()
    //Syntex
    Number.isSafeInteger(value)
    // Return Value
    // true: If the value is a safe integer.
    // false: Otherwise (if the value is not an integer, is NaN, is outside the safe range, or is not of type number).
    //Example
    Number.isSafeInteger(10);           // true (10 is a safe integer)
    Number.isSafeInteger(-9007199254740991); // true (-2^53 + 1)
    Number.isSafeInteger(9007199254740991);  // true (2^53 - 1)

    Number.isSafeInteger(9007199254740992);  // false (exceeds safe range)
    Number.isSafeInteger(-9007199254740992); // false (below safe range)
    Number.isSafeInteger(10.5);              // false (not an integer)
    Number.isSafeInteger(NaN);               // false
    Number.isSafeInteger(Infinity);          // false
parseFloat()
    //Syntex
    parseFloat(string)
    //Return Value
    // A floating-point number parsed from the input string.
    // NaN if the input cannot be converted to a number.
    //Example
    parseFloat("3.14");     // 3.14
    parseFloat("10");       // 10
    parseFloat("-5.67");    // -5.67
    parseFloat("3.14abc");  // 3.14 (stops parsing at non-numeric characters)
    parseFloat("abc3.14");  // NaN (starts with non-numeric characters)
    //es method me hum number ke sath last me kuchh string bhi rahta hai to ye method usko hata ke sirf number return karta hai
parseInt()
    //Syntex
    parseInt(string, radix)
    // Return Value
    // An integer parsed from the given string.
    // NaN if the input cannot be converted to a number.
    //Example
    parseInt("42");       // 42 (default radix is 10)
    parseInt("10", 2);    // 2 (binary interpretation)
    parseInt("7F", 16);   // 127 (hexadecimal interpretation)
    parseInt("20", 8);    // 16 (octal interpretation)  
    parseInt("42px");     // 42 (stops at the first non-numeric character)
    parseInt("px42");     // NaN (starts with a non-numeric character)
    parseInt(123.45);     // 123 (coerced to string and then parsed)
    parseInt([42]);       // 42 (single-element array coerced to string)
    parseInt({});         // NaN (object cannot be parsed)
toExponential()
    //Syntex
    number.toExponential(fractionDigits)
    //fractionDigits (optional)
    // Return Value
    // A string representing the number in exponential notation.
    // Throws a RangeError if fractionDigits is out of the allowed range.
    //Example
    const largeNum = 987654321;
    largeNum.toExponential();    // "9.87654321e+8"
    largeNum.toExponential(3);   // "9.877e+8"
toFixed()
    //Syntex
    number.toFixed(digits)
    //A string representing the number with the specified number of digits after the decimal point.
    // Throws a RangeError if digits is outside the range 0–100.
    //Example
    const num = 123.456;
    num.toFixed();       // "123" (default is 0 decimal places)
    num.toFixed(2);      // "123.46" (rounded to 2 decimal places)
    num.toFixed(5);      // "123.45600" (padded with zeroes)
toLocaleString()
    //Syntex
    number.toLocaleString(locales, options)
    // Return value: The return value can be a string that represents a number.
    //Example
    // Declaring an variable a
    let a = new Number(159900);    
    // Creating an dictionary like object and
    // include currency and style
    let myObj = {
        style: "currency",
        currency: "EUR"
    }    
    console.log(a.toLocaleString("en-GB", myObj)); //€159,900.00
toPrecision()
    //Syntex
    number.toPrecision(value)
    //Return Value: The toPrecision() method in JavaScript returns a string in which the number is formatted to the specified precision.
    //Example
    num=213.45689;
    console.log(num.toPrecision(3)); // 213
    num=213.45689;
    console.log(num.toPrecision(4)); // 213.5

