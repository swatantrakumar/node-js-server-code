//1.>new variable key var or const
    //var or const ko use kar ke hum variable declear karte hai const key se jab hum variable declear karte hai to usme hame declear karte time pae hi vallue assign karna parta hai jab ki var or var me nahi var or const block scope hote hai const variable  pe hum value re-assign nahi kar sakte hai jab ki var or var variable pe hum value re-assigne kar sakte hai var key ko use kar ke hum same scope re-declear kar sakte hai jabki var or const key use kar ke same variable re-declear nahi kar sakte hai var key hoisted hote hai jabki var or const key hoisted nahi hote hai.
//2.>Hoisting
    //Hoisting ek javascript ka default bihaviour hota hai esme ye hota hai ki bina variable or method declear kiye bina hum usko assign or execute nahi kar sakte hai regular function or var key variable hoisted hote hai jaise ki 
    console.log(test) // undefined print hoga jabki
    var test;
    console.log(test2) // Through Error test2 is nor declear
    var test2;
    test();
    function test(){
        console.log("Print Test call method");
    }//it is working
    test3();
    const test3 = ()=>{
        console.log("Print Test call method");
    }
    //ReferenceError: Cannot access 'test3' before initialization
    
//3.>Template Literals
    // esko hum back tick use karte hai or back tick ke becha me hum string or vaiable or method dono use kar sakte hai or variable or method ko hum doller cury baraket use karte hai ${} 
    var test = "Swatatnra";
    console.log(`Variable use as in a ${test}`); //Variable use as in a Swatatnra
    function checkLitral(){
        return "Swatantra";
    }
    console.log(`Method use as in a ${checkLitral()}`);//Method use as in a Swatantra
    console.log(`Calculation in template literals ${30 + 78 -87}`); //21
    var htmlElement = `
    <ul>
    <li>Javascript</li>
    <li>Java</li>
    <li>Html</li>
    <li>CSS</li>
    </ul>
    `;
    document.getElementById("check").innerHTML = htmlElement;
    console.log(htmlElement);
//4.>Default Parameters
    //default parameter ko hum function me use karte hai jaise ki hum koi funciton banate hai jise me hum 5 parameter dete hai or simple parameter agar function me dalte hai to wo required parameter hote hai lakin jab aap default parameter pass karte hai to wo parameter required nahi hote hai jaise ki agar aap function banaye test name ka jisme 4 parameter hai or usme 2 aapka default parameter hai to aap jab test  method kahi pe inislize karenge to us time pe aap agar 2 hi argument pass karenge to koi error nahi dega or jo aap default parameter me value pass kiye honge wo work karega aapke function me ab hum esko exmaple se dekhte hai
    function test(a,b,c=8,d=9){
        console.log(a+b+c+d) // 28
    }
    test(5,6);
    //upper ke function me c or d jo hai wo default parameter hai or esko declear karne ke liye hum assing operator  = ka use karte hai or default value dalte hai ki jab ye parameter pe ko vlaue function se nahi aayega us time pe use hoga ye.
//5.>Rest Operator
    //Rest Operator ko hum use karte hai function ke parmeter me or funciton ke last parameter me agar hum do paramter ke beach me ha starting me agar use karenge to error deta aap esko function ke last parameter me hi use kar sakte hai or ye rest parameter kahlata hai es varaiable me jitne bhi argument passed hote hai method me uske jitne bhi paremter use hote hai method me or rest argument rest parameter me store ho jate hai list ke rup me  or rest operator ko ... es se hum declear karte hai example me dekhte hai esko
    function restOperator(name,key,...arg){
        console.log(`${name} is a first key ${key} is a second key rest operator is ${arg}`); //Swatantra kymar is a first key Thakur is a second key rest operator is 8,9,0,5,sudhir
    }
    restOperator("Swatantra kymar","Thakur",8,9,0,5,"sudhir");
    
//6>Spread Operator
    //es operator ko hum use kate hai array ke value ko sparade karne ke liye jaise ki hamare pass ek array hai usko as a argument pass karna hai to hum sprade operator use karte hai (...) 
    var arry = [7,7,8,6,5,4,3];
    function sum(a, ...arg){  // this is rest operator
        var total = a;
        if(arg && arg.length > 0){
            arg.forEach((num)=> total += num);
        }
        return total;
    }
    sum(...arry); // this is a sparade operator
    //sparade operator ka use hum ek array me dusre array ko merge karne ke liye bhi use karte hai jaise ki
    var first = [6,7,8,8,9];
    var second = [6,8,9,...first];
    console.log(second); //[6, 8, 9, 6, 7, 8, 8, 9]
    // do or do se jayede array ko merge karne ke liye bhi use kiye jata hai jaise ki
    var fArray = [8,9];
    var sArray = [8,8];
    var tArray = [...fArray,...sArray]; // [8,9,8,8]
    //copy karne ke liye bhi hum esko use karte hai shello copy esme referenc nahi rahta jabki hum direct assign kar dete hai to reference rah jata hai
    var arr = [8,9,5];
    var arr1 = arr;
    arr1.push(7);
    console.log(arr) // [8,9,5,7]
    //jaise ki aap uper ke case me dekhe ki hum 7 add kiye hai arr1 me but wo add ho gaya hai arr variable me bhi lkin jab sprade operator ko use kar ke copy karte hai ro ye reference nahi rahta hai
    var arr2 = [8,9,5];
    var arr3 = [...arr2];
    arr3.push(7);
    console.log(arr2) // [8,9,5] 
    //string se array me convet kar sakte hai sprade operator ko use kar ke esko hum example me dekhte hai
    var str = "Swatantra";
    console.log([...str]); // ['S', 'w', 'a','t', 'a', 'n', 't', 'r', 'a']
//7.>Arrow Function
    //Arrow function jo hai wo regular function ka sort form hai arrow function ko hum anonmus function bhi kahte hai arraow function me this bind nahi hota hai aap arrow funciton me this object ke value ko acces nahi kar pata hai hum esko example se clear karte hai
    function regularFunciton(){
        console.log(`This is Regular Function ${this.name}`);
    }
    const arrowFunction = ()=>{
        console.log(`This is Arrow Function ${this.name}`);
    }
    var obj = {name:"Swatantra"};
    regularFunciton.call(obj); //This is Regular Function Swatantra
    arrowFunction.call(obj); //This is Arrow Function undefined
    //arrow function me this.name ka value undefined print hua this object ko access nahi kar paye
    //Arrow function me agar 1 parameter ho to paranthasis bracket ki jarurat nahi hoti hai or single like ka statement ho to curly bracket ka bhi jarurat nahi hoti hai signle like ka value ho to return ki ki bhi jarurat nahi hoti hai example me dekhte hai esko
    const nameVal = name => console.log(`My name is ${name}`);
    nameVal("Swatantra"); // My name is Swatantra
    //upper wale function me hum parameter ka jagah pe hum paranthesis bracket nahi use kiye hai or na hi return statement ye regular function se sort hota hai multi line ke code ko hum single line me likh sakte hai or arrow function ka use callback function me use karte hai example me dekhte hai
    function sum(a,b,callback){
        var total = a + b;
        callback(total);
    } 
    sum(6,8,(total)=> console.log(`Total or sum value ${total}`)); //Total or sum value 14
    //arrow function ka use hum constructors me use nahi kar sakte hai regular function ke jaise example me dekhte hai esko
    function fullName(fname,lname){
        this.fullname = `${fname} ${lname}`;
    }
    var fullNameConstructor = new fullName("Swatantra","Kumar");
    console.log(fullNameConstructor.fullname); // Swatantra Kumar

    var FuName = (fname,lname)=> this.fullname = `${fname} ${lname}`;
    var fuName = new FuName("Swatantra","Kumar");
    console.log(fuName.fullname); // TypeError: FuName is not a constructor
    //Arrow function me hum arguments key use nahi kar sakte hai regular function ke jaise example se esko samjhte hai
    function sum(){
        var total = 0;
        var listparameters = [...arguments]
        if(listparameters && Array.isArray(listparameters) && listparameters.length > 0){
            listparameters.forEach((num)=>{
                total += num; 
            })
        }
        return total;
    }
    console.log(sum(2,5,6,7,8,5,6)); // 39
    //above function me hum arguments ko hum array me convert kiye hai extuly arguments key ek object hota hai original array nahi hota hai to esko hum convert kiye hai niche esko arrow function me dekhte hai
    sum = ()=>{
        console.log(arguments); // through some error or undefined
    }
    console.log(sum(2,5,6,7,8,5,6));
//8.>for ..... of loop
    //for of ko hum array ke liye use karte hai for of me direct array ke element ko use kar sakte hai jab ki for -- in me hame index milte hai phir array se index ke help se element ko nikalna parata tha lakin ab for -- of me direct elemenet nikal sakte hai exmample me dekhte hai
    var array = [4,6,6,6,7,8,8];
    for (const element of array) {
        console.log(element);  // yaha pe apko direct value milenge array ke jaise ki 4 6 6 6 7 8 8
    }
    //for --- of ka use hum object ke liye bhi karte hai but object ke liye Object.entries(object) aise use karna hota hai or [key,value] aise use karna hota hai direct key or value dono mil jata hai for -- of me example me dekhte hai esko
    var forofobj = {name:"Swatantra",email:"rajswatantra9@gmail.com",age:30,mobile:9122160962};
    for (const [key,value] of Object.entries(forofobj)) {
        console.log(`${key} : ${value}`);
    }
    //for --of ka use hum string ke bhi every charactor ko use karne ke liye karte hai jsie ki hum example me dekthe hai
    var string = "Swatantra Kumar";
    for (const ch of string) {
        console.log(ch);
    }
//9.>Distructuring
    //Array Distructuring
    //pahle hame agar kisi array ke value ko use karna hota tha to hame array ke index pe se value ko nikal ke kisi variable pe assign karna parta tha lakin es 6 me new feature aaya hai distructuring esme hum direct variable me array se value ko assign kar sakte hai wo bhi 1 line me exmapme me dkhte hai
    var disArray = [5,6,7,8];
    var [a,b,c] = disArray;
    console.log(a,b,c); // 5 6 7  kebal 3 value ko nikala array ke starting point se agar ahme use aary ke sirf do hi value ko nikalna hota to sirf hum a or b hi distruct karte left side me ab hame kya hai array ke last vlau ko use karna hai or hame pata hai kitne value hai to hum use karte 
    var [,,,d] = disArray;
    console.log(d); // 8
    //array distructuring ko hum value swaping ke liye bhi use kar sakte hai examplem me dekhte hai
    var x = 89;         var p = 65;
    var y = 87;         var q = 55;
    var [x,y] = [y,x]   [p,q] = [q,p]
    console.log(x,y) // 87 89   console.log(p,q) // 55 65
    //distructureing me defalut value ko bhi use kar skate hai example se dekhte hai
    var [x,y,z=78] = disArray;
    console.log(x,y,z) // 5 6 7
    //lakin us array me koi tisra value nahi hota phir
    var [x,y,z,w,c=98] = disArray;
    console.log(c) // 98
    //rest operator bhi hum use kar sakte hai array distructuring me example se dekhte hai
    var [x,...args] = disArray;
    console.log(args); //[ 6, 7, 8 ] ye ek rest parameter ke tarah kam karta hai esko hum last varaibal ke tarh hi use kar sakte hai
    //agar kisi function me hum array return karte hai to us se bhi hum esko array distructuring me use kar sakte hai example me dekhte hsi
    function getArray(){
        return [5,7,8,9];
    }
    var [a,b] = getArray();
    console.log(a,b) // 5 7
    //array distructuring ko hum parameter me bhi declear kar sakte hai agar aap koi array pass kar rahe kisi function ke argument me or hame function me 2 hi value ko use karna hai arary se to hum array distructuring se use kar sakte hai 
    function sum([a,b]){
        return a + b;
    }
    var arrayVal = [8,9,0,6,5];
    console.log(sum(arrayVal)); // 17
    //Object distructuring 
    //esme sab kuchh array distructuring jaise hi hota ha bus jaha pe hum big bracket use karte hai waha pe curly bracket use karenge or hum array distructuring me value ke accordig variable pass kare the lakin object me aisa nahi or array me hum varaible name kuchh bhi rakh sakte the lakin object me aisa nahi object me hame key ko bhi variable bana na hota hai esko example se dekhte hai
    var object = {name:"Swatantra Kumar",email:"rajswatantra9@gmail.com",age:30,mobile:9122160962};
    var {name,age} = object;
    console.log(name,age); // Swatantra kumar 30
    //jaisa ki hame extra comma nahi lagana para 3 number ke value ke liye waise or hame yaha pe key ke object ko hi variable bana na para 
    //object distructurin ko bhi hum parameter me use kar sakte hi or kisi function se hame object return mil raha ho waha pe bhi object distructuring use kar sakte hai
    function sum({name,age}){
        return `${name}   ${age}`;
    }
    console.log(sum(object)); // Swatantra Kumar 30
    //yaha pe bhi hame object ke key hi pass karne hote hai
    let name,email;
    ({name,email} = object);
    console.log(name,email); //Swatantra Kumar rajswatantra9@gmail.com
    //Lakin agar hame variable name dusra rakhna hai jo object key hai usko use nahi karna hi kahi apne function me to hum esko kaise karenge
    var {name:sName,age:sAge} = object;
    console.log(sName,sAge) // Swatantra Kumar 30
    //ab aap object me bhi kuchh bhi variable ka name rakh sakte hai object distructuring me
    //function me bhi chahe to hum parameter name dusra rakh sakte hai 
    function sum({name:a,age:b,address:ad="Barahsher"}){
        return `${a}   ${b} ${ad}`;
    }
    console.log(sum(object)); // Swatantra Kumar   30 Barahsher
    //hum default value bhi assign kar sakte hai object distructuring me
    //nested object ko hum kaise distructuring me use karenge
    object['address'] = {};
    object['address']['at'] = "Barahsher";
    object['address']['ps'] = "Bihra";
    var {address:{at:AT,ps:PoliceStation}} = object;
    console.log(AT,PoliceStation) // Barahsher Bihra
