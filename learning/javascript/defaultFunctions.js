//Function method 
//1.>call()
function test(firstname,lastname){
    let fName = firstname;
    let lName = lastname;
    return `Full Name is ${fName} ${lName} address is ${this.address}`;
}
let objcall = {address:"Saharsa"};
console.log(test.call(objcall,"Swatantra","Kumar")); //Full Name is Swatantra Kumar address is Saharsa
//2.>bind()
function test(firstname,lastname){
    let fName = firstname;
    let lName = lastname;
    return `Full Name is ${fName} ${lName} address is ${this.address}`;
}
let objbind = {address:"Saharsa"};
let funBind = test.bind(objbind);
console.log(funBind("Swatantra","Kumar")); //Full Name is Swatantra Kumar address is Saharsa
//3.>apply()
function test(firstname,lastname){
    let fName = firstname;
    let lName = lastname;
    return `Full Name is ${fName} ${lName} address is ${this.address}`;
}
let objApply = {address:"Saharsa"};
console.log(test.apply(objApply,["Swatantra","Kumar"])); //Full Name is Swatantra Kumar address is Saharsa

//4.>Types of Parameter in javascript
//first explain what is parameter or what is argument
function sum(a,b){
 return a+b;
}
sum(5,7)
//in this above function sum a,b is a paremeter or 5,7 is a argument
    //a.>required parameter
        function requiredParameter(a,b){ //a,b is required parameter
            return a + b;
        }
    //b.>default parameter
    function defaultParameter(a,b,c=8){ //c is default parameter
        return a + b;
    }
    //c.>rest parameter
    function restParameter(a,b,...rest){ //...rest is rest parameter
        if(rest && rest.length){
            let total = a + b;
            rest.forEach((val)=> total += val)
            return total;
        }
    }
    //d.>Destructured parameters
    function requiredParameter({a,b}){ //{a,b} is Destructured parameter
        return a + b;
    }
    test({a:5,b:9})
    //e.>passing a function as parameters
    function requiredParameter(a,fn){ //fn is funciton parameter
        let total = a + b
        fn(total)
    }
    test(39,89,(total)=>{
        console.log(total);
    })
//5.>geting a length or parameter of a funcitoni useing length
function lengthParameter(a,b,f,g){
    return a + b + f + g;
}
console.log(lengthParameter.length) // 4
//set a property in a funcitoni like
lengthParameter.myname = "Swatantra Kumar";
console.log(lengthParameter.myname);
//get the function name use .name 
console.log(lengthParameter.name) // lengthParameter
let obj = {
    name:"Swatantra",
    age:30,
    details:function(){
        return `My name is ${this.name} or my age is ${this.age}`;
    }
}
console.log(obj.details.name) // details
let obj2 = {
    name:"Swatantra",
    age:30,
    details:function fullString(){
        return `My name is ${this.name} or my age is ${this.age}`;
    }
}
console.log(obj2.details.name) // fullString

//caller name in a function like this call form this functin
function test(){
    console.log(test.caller); // [Function: test2]
}
function test2(){
    test();
}
test2();

//6.>isFinite()
    //syntex
    isFinite(value)
    //return boolean value
        console.log(isFinite(12));  // true
        console.log(isFinite(0));  // true
        console.log(isFinite(12.3));  // true
        console.log(isFinite("Geeks")); //false
        console.log(isFinite("456"));  // true
        console.log(isFinite(-46));  //true
//7.>isNaN()
    //syntex
    isNaN( value )
    // return boolean if value is not a number then return true
    console.log(isNaN(12));  // false
    console.log(isNaN(0 / 0)); //true
    console.log(isNaN(12.3)); //false
    console.log(isNaN("Geeks"));  //true
    console.log(isNaN("13/12/2020")); //true
    console.log(isNaN(-46));  //false
    console.log(isNaN(NaN)); //true
//8.>Number()
    //syntex
    Number(object)
    let test1 = new Number(7);
    console.log(test1);//[Number: 7]
    let test2 = Number("8");
    console.log(test2); //8
//9.>Function Generator
function* generatorFunction(){
    yield "Swatantra";
    yield "Kumar";
    return "Thakur";
}
let generat = generatorFunction();
console.log(generat.next()); // { value: 'Swatantra', done: false }
console.log(generat.next()); // { value: 'Kumar', done: false }
console.log(generat.next()); // { value: 'Thakur', done: true }
console.log(generat.next()); // { value: undefined, done: true }

//10.>Currying function or nested funciton
function multiply(a){
    return function(b){
        return function(c){
            return a * b * c;
        }
    }
}
let multi = multiply(2)(3)(2);
console.log(multi);  /// 12

