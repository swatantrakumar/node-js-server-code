//String Methods
slice() 
    //syntex
    string.slice(startingIndex, endingIndex);
    //example 
    var A = 'Geeks for Geeks';
    b = A.slice(0, 5);
    d = A.slice(3, -1);
    console.log(b) // Geeks
    console.log(d); //ks for Geek
    console.log(A) // Geeks for Geeks
    //Note:- retun a cut stirng value or no any change in original string.
substring()
    //syntex
    string.substring(startIndex, endIndex);
    var A = 'Geeks for Geeks';
    b = A.substring(5, 0);
    d = A.substring(3, -1);
    console.log(b) // Geeks
    console.log(d); //Gee
    console.log(A) // Geeks for Geeks
    //Note:- retun a cut stirng value or no any change in original string.
//Both function a similar but some common difference like if you seen first function in this function first parameter is less then to second parameter if you pass then it is not working but in second funciton working properly or second difference is slice support nigative value or working properly but in second functioin nigative value convert into 0 so you see in second function pass nigative argument but cut value is 0 index.
substr() 
    //syntex
    str.substr(start , length)
    //Example
    let str = 'It is a great day.';
    let sub_str = str.substr(5);
    console.log(sub_str);  //a great day.
    sub_str = str.substr(5, -7);
    console.log(sub_str); // 
    //Note:- get any value because length not support nigative or 0 start is support both nigative or 0
    //retun a cut stirng value or no any change in original string.
    
replace()
    //syntex
    str.replace(value1, value2);
    //Example
    var string = 'GeeksForGeeks';
    var newstring = string.replace('For', 'GfG');
    console.log(newstring); // GeeksGfGGeeks
    var newstring = string.replace(/Gee/g, 'GfG');
    console.log(newstring); // GfGksForGfGks
    console.log(string);  //  GeeksForGeeks
    //Note: if value not match then return same string or no change in original string
    //withour use single or double cot use back salce from start or end of string
    //or if need find string in a original string or replace all then use back slace after g in above example like that
replaceAll()
    //syntex
    //const newString = originalString.replaceAll(regexp | substr , newSubstr | function)
    //Example
    let string = "Geeks or Geeks";
    var newString = string.replaceAll("Geek", "for");
    console.log(newString); // fors or fors
    var newString = string.replaceAll(/Geek/ig, "for");
    console.log(newString); // fors or fors
    //Note:- this function work like replce pass with regex /string/g
toUpperCase()
    //syntex
    string.toUpperCase();
    //Example
    var stri = "test";
    var b = str.toUpperCase();
    console.log(b) // TEST
toLowerCase()
    //syntex
    string.toLowerCase();
    //Example
    var stri = "SWRyt";
    var b = str.toLowerCase();
    console.log(b) // swryt
trim()
    //remove white space form start or end of stirng
    //syntex
    str.trim();
    //Example
    var s = "     GeeksforGeeks     ";
    var s1 = s.trim();
    console.log(s); //GeeksforGeeks
trimStart()  // trimLeft() work exactly
    //remove white space form start of stirng
    //syntex
    str.trimStart();
    //Example
    var s = "     GeeksforGeeks";
    var s1 = s.trimStart();
    console.log(s); //GeeksforGeeks
trimEnd() //trimRight()  work exactly
    //remove white space form start of stirng
    //syntex
    str.trimEnd();
    //Example
    var s = "GeeksforGeeks     ";
    var s1 = s.trimEnd();
    console.log(s); //GeeksforGeeks
padStart()
    //syntex
    string.padStart(targetLength, padString)
    //target length is the length of string if length of string is equal or grater then after that not add any pad value in this string when less then after that add the value in this string form start like string length is 8 or you pass the target length is 12 then add 4 pad string form start of your string.
    //Example
    exString = "Hello123";
    prepended_out = exString.padStart(12, "$");
    console.log(prepended_out) // $$$$Hello123
    prepended_out = exString.padStart(8, "$");
    console.log(prepended_out) // Hello123
padEnd()
    //similar to padStart but only difference is add the pad stirng form end of the passed string.

charAt()
    //Syntex
    str.charAt(index);
    //Example
    str = 'JavaScript is object oriented language';    
    value = str.charAt();
    value1 = str.charAt(0);
    value2 = str.charAt(4);
    console.log(value);
    console.log(value1);
    console.log(value2);
    //return a string char form passed index default index is 0 in this function nigative index is not supported in this function
at()
    //syntex
    str.at(ind)
    //Example
    str = "Swatantra Kumar Thakur"
    char = str.at(7);
    console.log(char);  // r
//above both method is similar but one difference charAt not support for nigative index but at is support nigative index
charCodeAt() 
    //Syntex
    str.charCodeAt(index)
    //Example
    str = 'GEEKS';
    value = str.charCodeAt(0);
    console.log(value); //71
codePointAt()
    //syntex
    string.codePointAt(A)
    //Example
    str = 'GEEKS';
    value = str.codePointAt(0);
    console.log(value); //71
split()
    //syntex
    str.split( separator, limit );
    //Example
    str = 'Geeks for Geeks'
    array = str.split("for");
    console.log(array);  // [ 'Geeks ', ' Geeks' ]

    str = 'It is a 5r&amp;e@@t Day.'
    array = str.split(" ");
    array1 = str.split(" ",2);
    console.log(array); // [ 'It', 'is', 'a', '5r&amp;e@@t', 'Day.' ]
    console.log(array1); //[ 'It', 'is' ]
concat()
    //syntex
    str.concat(str);
    //Example
    str1 = "Swatantra";
    str2 = " Kumar";
    str3 = str1.concat(str2);
    console.log(str3) // Swatantra Kumar
anchor()
    //syntex
    string.anchor(anchorname)
    //Example
    str = "GFG";
    console.log(str.anchor("anchorname")); //<a name="anchorname">GFG</a>
endsWith()
    //syntex
    str.endsWith(searchString, length)
    //Es function me dusra parameter jo hai wo length hai ye kya karta hai ki pahle string to utna pe cut kar leta hai phir check karta hai jo aap first parameter jo pass kiye wo end me hai ki nahi 
    //Example
    str = 'It is a great day.';
    value = str.endsWith('day.'); 
    value1 = str.endsWith('a', 7);
            // It is a 
            //esme pahle wo cut kiye phir check kiye a last me hai ki nahi to tha  to return true kiya hai.
    value2 = str.endsWith('great'); 
    //bina length ke jab hum call karte hai to jo string hota hai uske last me check karta hai first parameter ko wo hai ki nahi agar nahi to false return karta hai.
    console.log(value); //true
    console.log(value1); //true
    console.log(value2); //false
includes()
    //syntex
    string.includes(searchvalue, start)
    //Example
    str = "Welcome to GeeksforGeeks.";
    check = str.includes("Geeks");
    console.log(check); // true
    check = str.includes("com",6);
    console.log(check); // false
    //the position from which the search will begin is less than 0, the entire array will be searched. 
    check = str.includes("com",-1);
    console.log(check); // true
indexOf()
    //syntex
    str.indexOf(searchValue , index);
    //