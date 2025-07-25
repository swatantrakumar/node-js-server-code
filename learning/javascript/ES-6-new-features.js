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
        //Jab hum variable declear karne ke bad us variable ko distructuring me dalte hai to hame usko paranthesis bracket me dalna hota hai niche exmaple me jaise dala hua hai.
        var name,email;
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
//10.>Object Property Enhancement && new object methods
        //es 6 me object creation advance ho gaya hai jaise ki pahle hum object create karte the to key phir vlaue dalte the or obj ke aage bari bracket laga key usme key ka name deke koi propery add karte the object me abhi bhi wo kar sakte hai lkin kuchh or new features aa gaya hai jaise ki hum kisi variable ko direct object me rakh sakte to variable name jo hai wo object ka key ho jayega or use variable ka value us key ka value ban jayega pahle hum object ke ander koi function banate the to key ke sath collon laga ke functio key ka arrow function likhte the lakin ab direct comma laga ke function name ke sath likhe sakte hai ye sare chij mei example me de raha hu or jaise ki koi variable bana hai usme kya value aayega hame nahi pata lakin hum chahte hai ki usme jo value aaye wo hamare objec ka key bane or value aap definc kar lo uske aage to wo ye new enhancement me possible hai 
        var name = "Swatantra Kumar";
        var email = "rajswatantra9@gmail.com";
        var mobileKey = "mobileNo"
        var obj = {
            name,
            email,
            [mobileKey]:9122160962,
            getMyName(){
                return `Your name is ${this.name}`
            }
        }
        console.log(obj.getMyName()); // Your name is Swatantra kumar

        //Object.assign() 
        //es method me hum ek object me kitna bhi object ke property or value ko copy kar sakte hai jais ki hamare pass ek object hai uske obj or mere pass 2 or object hai or hum chahte hai obj object me rest jo 2 object hai uske property or value copy ho jaye 

        var obj = {name:'Swatantra',age:30};
        var obj1 = {email:"rajswatantra9@gmail.com"};
        var obj2 = {address:{at:"Barahser",po:"Barahser",ps:"Bihra"}};
        var newObj={};
        Object.assign(newObj,obj,obj1,obj2);
        obj2.mobile = 9122160962;
        console.log(newObj); 
        //output
        //{
        //     name: 'Swatantra',
        //     age: 30,
        //     email: 'rajswatantra9@gmail.com',
        //     address: { at: 'Barahser', po: 'Barahser', ps: 'Bihra' }
        //   }
        //jo kaam hum Object.assign method se kiye hai wo hum sprade operator se bhi kar sakte hai 
        var newObj = {...obj,...obj2};
        console.log(newObj);
        //outPut
        // {
        //     name: 'Swatantra',
        //     age: 30,
        //     address: { at: 'Barahser', po: 'Barahser', ps: 'Bihra' }
        //   }

        //object ko assign karen ke bad hum mobile ke add kiye hai obj2 me but wo value usme nahi aaya copy kiye objec tme but aap obj2 ko print kar ke dekhenge to woha pe add ho gaya hai.
        console.log(obj2);
        // output
        // {
        //     address: { at: 'Barahser', po: 'Barahser', ps: 'Bihra' },
        //     mobile: 9122160962
        //   }
//11.>Symbol Data type 
    //ye primitive data type es data type se hum koi value crate karte hai to to unique create hota hai or ue new key se create nahi hota hai kyo ki ye koi constructor nahi hai hum global symbol value bhi create kar sakte hai jo ki unique nahi hota hai or wo global ragistry me stor hota hai uske create karne ke liye hum symbole.for method ka use karte hai or global symble ke vlaue ko nikalne ke liye hum symbol.keyFor method ka use kart hai

    var first = Symbol("Test");
    var second = Symbol("Test");
    console.log(first == second); // false
    console.log(first === second); // false

    let name = Symbol.for("Swatantra Kumar");
    console.log(Symbol.keyFor(name)); // Swatantra Kumar
    console.log(Symbol.keyFor(first)); // undefined
    //agar hum symbol se koi objec key banate hai to hum usko itrate nahi kar payenge object me jaise ki niche ke exampme me hum kiye hai ek id name se symbol key bnaya usko objec me key pe assign kiye hai phir usko hum for loop me uske access karne ke kosis kiye to nahi hua 

    var id = Symbol("_id");
    var obj = {
        [id]:1,
        name : "Swatantra",
        email : "rajswatantra9@gmail.com"
    }

    for(let [key,value] of Object.entries(obj)){
        console.log(`${key} -> ${value}`);
    }
    //out put
    // name -> Swatantra
    // email -> rajswatantra9@gmail.com

    //Object.getOwnPropertySymbols() es method se hum symbol key ko nikal sakte hai object se jitne bhi symbol type key honge wo humko list me return karne ke mil jayege phir us key ko hum object se value nikal sakte hai

    var id = Symbol("_id");
    const api = Symbol("api");
    let obj = {
        [id]:1,
        [api] : "/test/getData",
        name : "Swatantra",
        email : "rajswatantra9@gmail.com"
    }
    console.log(Object.getOwnPropertySymbols(obj));  // [ Symbol(_id), Symbol(api) ]
    Object.getOwnPropertySymbols(obj).forEach((key)=>{
        console.log(`${key.toString()} -> ${obj[key]}`);
    })
    //output
    // Symbol(_id) -> 1
    // Symbol(api) -> /test/getData   
    
    //.description  key se hum symbole type variable se value nikal sakte hai 
    var id = Symbol("_id");
    console.log(id.description); // _id
//12.>Set or Map
        //Set => set type ke variable create karne ke liye hum new Set() se inislize karte hai or initialize ke time pe bhi hum value assing kar sakte hai array format me or single or double quote me bhi hum value pass kar skate hai to wo har ek balue char or number ko array ke tarah or unique value rakhta hai jaise ki gar hum new Set("Swatantra") 's','w','a','t','n','r' rest a or t dublicate hai to usko add nahi kiye to set ko hum unique value rakhne ke liye bhi use karte hai 
        let setlist = new Set();

        //set variable ko use karne ke liye kuchh methods bhi hai.
        //1.>add() 2.>size 3.>delete() 4.>has() 5.>clear() or 6.>sprade operator ko use kar ke hum esko plane array me bhi convert kar sakte hai

        setlist.add(2).add(3).add(4);
        console.log(setlist) //Set(3) { 2, 3, 4 }
        console.log(setlist.size) // 3
        setlist.delete(3);
        console.log(setlist);  //Set(2) { 2, 4 }
        console.log(setlist.has(2));  //true
        console.log([...setlist])  //[ 2, 4 ]
        //set list pe hum direct forEach loop chala sakte hai lakin hum espe for loop nahi chal sakte hai kyo ki loop to chala lenge lekin set se value nahi nikal payenge kyo ki set se hum square bracket se value nahi nikal sakte jaise ki hum normal array se nikal lete hai.
        //set value itration 
        //1.>for...of 2.>forEach() 3.>set.values() 4.>set.keys() 5.>set.entries()  se hum set value ko itrate kar satke hai 
        for(let val of setlist){
            console.log(val);  ////it is working but let i = 0;i<setlist.size is not working.
        }
        setlist.clear();
        console.log(setlist) // Set(0) {}

        //Map
        //map ka use hum key value paise ko store karne ke liye karte hai esme hum kisi bhi type ke key or kisi bhi type ke vlaue ko store kar sakte hai esko create karne ke liye hum new Map() se create karte hai or map me value set karne ke liye hum set method ka use karte hai map me bhi utne hi mehtod hote hai jitna ki hum se me use kiye use se 1 jayede map me hota hai jaise ki get karne kel liye hum get method ka use karethe 
        let maplist = new Map();
        //methods 
        //1.>set() 2.>size 3.>delete() 4.>has() 5.>get() 6.> or 7.>sprade operator ko use kar ke hum esko plane array me bhi convert kar sakte hai
        maplist.set(name,"swatantra Kumar").set("email","rajswatantra9@gmail.com").set("age",30);
        console.log(maplist); 
                                    //  Map(3) {
                                    //         'name' => 'swatantra Kumar',
                                    //         'email' => 'rajswatantra9@gmail.com',
                                    //         'age' => 30
                                    //     }
        console.log(maplist.size); //3
        console.log(maplist.has("age")); //true
        maplist.delete("email");
        console.log(maplist); //Map(2) { 'name' => 'swatantra Kumar', 'age' => 30 }
        maplist.clear();
        console.log(maplist); // Map(0) {}
        //map itration
        //1.>for...of 2.>forEach() 3.>map.values() 4.>map.keys() 5.>map.entries()  se hum map value ko itrate kar satke hai 
        for(let [key,value] of maplist){
            console.log(`${key} => ${value}`)
        }
        maplist.forEach((value,key)=>{
            console.log(`${key} => ${value}`)
       })
//13.>weakSet or weakMap 
       //ye dono set or map ke tarh nahi hai kyo ki aap esme primitive data nahi store kar skte hai only array or object hi sotre kar sakte hai or sare method esme work bhi nahi karte hai jsie ki set me sirf add(),delete(),has() yahi method work karte hai or map me set(),get(),has() or delete() methods work karte hai dono me se kisi ko bhi aap itrate nahi kar sakte hai kisi bhi itrator se like for or foreach.
       //weakset or weakmap me object weakly referenced होते हैं  or ye dono garbage collection ko support karta hai grabage collection ek process hai javascript me, jo jab hum koi reference weakset or weakmap me value dalte hai use karne ke liye phir hum use value ko delete kar dete hai uske bad lkin weakset or weakmap ke us value ko delete nahi karte hai to garbage collection usko hata dete hai memory ko free kar dete hai automatically esliye esko weakliy refrenced kahte hai or esliey esko hum itrate nahi kar sakte hai.
       //weakset or weakmap se hum memory leak se bachte hai memory leak kya hota hai ki hum unused object memory me rah jata hai or kabhi release nahi hote hai lkin weakset or weakmap ye insure karte hai ki jab object ki jarurat nahi hote hai to ye usko memory se delete kar dete hai.
       //weakset or weakmap me hum secure data rakh sakte hai lakin usko globally accessable nahi banate hai.
        let tempObjects = new WeakSet();
        let obj = { data: 123 };
        tempObjects.add(obj);
        console.log(tempObjects.has(obj)); // true
        obj = null; // Object is garbage collected.
        //jsie ki obj ka use hum weakset me kiye or niche us object ko null kar diye but ye obj hamare weakset me hai lkin uska use nahi hai ab to garbage collection esko delete kar dega automatically jis se hame esko memory management nahi karna parta hai or hum memory leak se bach jate hai.
//14.>Array Methods
    //1.>
    of()  /// create a array with passed value in this method  ES6 Methods
    syntex:- Array.of(element1, element2,  elementN);
    //Example
    var array = Array.of(1, 2, 3, 4, 5);
    console.log(array); // Output: [1, 2, 3, 4, 5]
    //Difference Between Array.of() and new Array()
    //The Array.of() method treats single numeric arguments as elements, not a length.

    //2.>
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

      //3.>
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

        //4.>
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

        //5.>
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

        ///6.>
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

        //7.>
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
//15.>String Methods
    //1.>
    repeat()
    //syntex
    string.repeat(count);
    //Example
    str = "forGeeks";
    repeatCount = str.repeat(2);
    console.log(repeatCount); //forGeeksforGeeks
    str = "gfg";
    // Repeating the string 2.9 times i.e, 2 times
    // because 2.9 converted into 2
    repeatCount = str.repeat(2.9);
    console.log(repeatCount);///gfggfg

    //2.>
    startsWith()
    //syntex
    str.startsWith( searchString , position )
    //Example
    str = 'Geeks for Geeks';
    value = str.startsWith('Gee');
    console.log(value); //true
    str = 'Geeks for Geeks';
    value = str.startsWith('For',6); //for Geeks   after cut 6 char from start
    console.log(value); //true

    //3.>
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
    
    //4.>
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

//16.>Number methods
        //1.>
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
        
        //2.>
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

        //3.>
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

        //4.>
        Math.trunc()
            //syntex
            Math.trunc(value)
            //Example
            console.log(Math.trunc(15.56));  // 15
            console.log(Math.trunc(-15.56)); // -15
            console.log(Math.trunc(0.236)); // 0

        //5.>
        Math.sign()
            //syntex
            Math.sign(number)
            //Example
            console.log(Math.sign(2)); // 1
            console.log(Math.sign(-2)); //-1
            console.log(Math.sign(0)); // 0
            console.log(Math.sign(-0)); // -0
            console.log(Math.sign(haa)); // NaN
//17.>Classes
        
