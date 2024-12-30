//1.>new variable key let or const
    //let or const ko use kar ke hum variable declear karte hai const key se jab hum variable declear karte hai to usme hame declear karte time pae hi vallue assign karna parta hai jab ki var or let me nahi let or const block scope hote hai const variable  pe hum value re-assign nahi kar sakte hai jab ki var or let variable pe hum value re-assigne kar sakte hai var key ko use kar ke hum same scope re-declear kar sakte hai jabki let or const key use kar ke same variable re-declear nahi kar sakte hai var key hoisted hote hai jabki let or const key hoisted nahi hote hai.
//2.>Hoisting
    //Hoisting ek javascript ka default bihaviour hota hai esme ye hota hai ki bina variable or method declear kiye bina hum usko assign or execute nahi kar sakte hai regular function or var key variable hoisted hote hai jaise ki 
    console.log(test) // undefined print hoga jabki
    var test;
    console.log(test2) // Through Error test2 is nor declear
    let test2;
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
    let test = "Swatatnra";
    console.log(`Variable use as in a ${test}`); //Variable use as in a Swatatnra
    function checkLitral(){
        return "Swatantra";
    }
    console.log(`Method use as in a ${checkLitral()}`);//Method use as in a Swatantra
    console.log(`Calculation in template literals ${30 + 78 -87}`); //21
    let htmlElement = `
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
    let arry = [7,7,8,6,5,4,3];
    function sum(a, ...arg){  // this is rest operator
        let total = a;
        if(arg && arg.length > 0){
            arg.forEach((num)=> total += num);
        }
        return total;
    }
    sum(...arry); // this is a sparade operator
    //sparade operator ka use hum ek array me dusre array ko merge karne ke liye bhi use karte hai jaise ki
    let first = [6,7,8,8,9];
    let second = [6,8,9,...first];
    console.log(second); //[6, 8, 9, 6, 7, 8, 8, 9]
    // do or do se jayede array ko merge karne ke liye bhi use kiye jata hai jaise ki
    let fArray = [8,9];
    let sArray = [8,8];
    let tArray = [...fArray,...sArray]; // [8,9,8,8]
    //copy karne ke liye bhi hum esko use karte hai shello copy esme referenc nahi rahta jabki hum direct assign kar dete hai to reference rah jata hai
    let arr = [8,9,5];
    let arr1 = arr;
    arr1.push(7);
    console.log(arr) // [8,9,5,7]
    //jaise ki aap uper ke case me dekhe ki hum 7 add kiye hai arr1 me but wo add ho gaya hai arr variable me bhi lkin jab sprade operator ko use kar ke copy karte hai ro ye reference nahi rahta hai
    let arr2 = [8,9,5];
    let arr3 = [...arr2];
    arr3.push(7);
    console.log(arr2) // [8,9,5] 
    //string se array me convet kar sakte hai sprade operator ko use kar ke esko hum example me dekhte hai
    let str = "Swatantra";
    console.log([...str]); // ['S', 'w', 'a','t', 'a', 'n', 't', 'r', 'a']
//7.>Arrow Function
    //Arrow function jo hai wo regular function ka sort form hai arrow function ko hum anonmus function bhi kahte hai arraow function me this bind nahi hota hai aap arrow funciton me this object ke value ko acces nahi kar pata hai hum esko example se clear karte hai
    function regularFunciton(){
        console.log(`This is Regular Function ${this.name}`);
    }
    const arrowFunction = ()=>{
        console.log(`This is Arrow Function ${this.name}`);
    }
    let obj = {name:"Swatantra"};
    regularFunciton.call(obj); //This is Regular Function Swatantra
    arrowFunction.call(obj); //This is Arrow Function undefined
    //arrow function me this.name ka value undefined print hua this object ko access nahi kar paye
    //Arrow function me agar 1 parameter ho to paranthasis bracket ki jarurat nahi hoti hai or single like ka statement ho to curly bracket ka bhi jarurat nahi hoti hai signle like ka value ho to return ki ki bhi jarurat nahi hoti hai example me dekhte hai esko
    const name = name => console.log(`My name is ${name}`);
    name("Swatantra"); // My name is Swatantra
    //upper wale function me hum parameter ka jagah pe hum paranthesis bracket nahi use kiye hai or na hi return statement ye regular function se sort hota hai multi line ke code ko hum single line me likh sakte hai or arrow function ka use callback function me use karte hai example me dekhte hai
    function sum(a,b,callback){
        let total = a + b;
        callback(total);
    } 
    sum(6,8,(total)=> console.log(`Total or sum value ${total}`)); //Total or sum value 14
    //arrow function ka use hum constructors me use nahi kar sakte hai regular function ke jaise example me dekhte hai esko
    function fullName(fname,lname){
        this.fullname = `${fname} ${lname}`;
    }
    let fullNameConstructor = new fullName("Swatantra","Kumar");
    console.log(fullNameConstructor.fullname); // Swatantra Kumar

    let FuName = (fname,lname)=> this.fullname = `${fname} ${lname}`;
    let fuName = new FuName("Swatantra","Kumar");
    console.log(fuName.fullname); // TypeError: FuName is not a constructor
    //Arrow function me hum arguments key use nahi kar sakte hai regular function ke jaise example se esko samjhte hai
    function sum(){
        let total = 0;
        let listparameters = [...arguments]
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
