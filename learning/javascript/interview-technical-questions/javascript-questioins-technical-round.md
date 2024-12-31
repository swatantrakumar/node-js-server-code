Basics
    1.>What is JavaScript, and how is it different from Java?
        Explanation: JavaScript is a scripting language used mainly for creating dynamic and interactive content on websites.
        Ex:- // JavaScript example
            document.getElementById("demo").innerHTML = "Hello, JavaScript!";
        Difference from Java: Java is a class-based, object-oriented programming language used for backend development, whereas JavaScript is used in the browser for interactivity.
    2.>Explain var, let, and const. What are the key differences?
        Explanation:
            var is function-scoped and can be redeclared.
            let is block-scoped and can be updated, but not redeclared.
            const is block-scoped and cannot be updated or redeclared.
        Ex:-
            var x = 10; // Can be redeclared
            let y = 20; // Cannot be redeclared, but can be updated
            const z = 30; // Cannot be updated or redeclared    
    3.>How do you declare a variable in JavaScript?
    4.>What are the different data types in JavaScript?
        Explanation: JavaScript has 7 basic data types:
                    String (e.g., 'Hello')
                    Number (e.g., 42)
                    BigInt (e.g., 1234567890123456789012345678901234567890n)
                    Boolean (true, false)
                    Object (e.g., {name: 'Alice'})
                    undefined (a variable not assigned a value)
                    null (represents no value)
    5.>What is the difference between == and ===?
        Explanation: == checks for equality after type coercion, while === checks for both value and type equality without      coercion.
        Example:- 
            console.log(5 == '5');  // true (type conversion happens)
            console.log(5 === '5'); // false (no type conversion)
    6.>What is hoisting in JavaScript?
        Explanation: Hoisting is JavaScript's default behavior of moving declarations to the top of their scope before code execution.
        Example:- 
            console.log(a); // undefined
            var a = 5;
    7.>Explain the typeof operator.
        Explanation: typeof is used to check the type of a variable or expression.
        Example:-
            console.log(typeof 42);      // "number"
            console.log(typeof "hello"); // "string"
    8.>What is the difference between null and undefined?
        Explanation: null is an assignment value representing no value or object, while undefined means a variable has been declared but not assigned any value.
        Example:-
            let x = null;
            let y;
            console.log(x); // null
            console.log(y); // undefined
    9.>What are JavaScript functions? How are they declared?
        Explanation: Functions are reusable blocks of code that perform a specific task. They can be declared in multiple ways:
        Function Declaration:
            function sayHello() {
                console.log("Hello");
            }
        Function Expression:
            let greet = function() {
                console.log("Hello");
            };        
    10.>What is the difference between function declaration and function expression?
        Explanation: A function declaration is hoisted, meaning it can be called before its definition, while a function expression is not hoisted and can only be called after it's defined.
        Example:-
            greet(); // Works
            function greet() {
                console.log("Hello");
            }
            // This will throw an error
            greetExpression();
            var greetExpression = function() {
                console.log("Hello");
            };
Intermediate
    11.>What are closures in JavaScript?
        Explanation: A closure is a function that remembers its lexical scope even when the function is executed outside that scope.
        Example:-
            function outer() {
                let counter = 0;
                return function inner() {
                    counter++;
                    console.log(counter);
                };
            }
            let counterFunc = outer();
            counterFunc(); // 1
            counterFunc(); // 2
    12.>Explain event delegation.
        Explanation: Event delegation involves attaching a single event listener to a parent element, which listens for events on its child elements using the event bubbling mechanism.
        Example:- document.getElementById('parent').addEventListener('click', function(event) {
                if (event.target && event.target.matches('button')) {
                    console.log('Button clicked!');
                }
            });        
    13.>How does the this keyword work in JavaScript?
        Explanation: this refers to the object from which a function was called. In global scope, it refers to the global object (window in browsers).
        function show() {
            console.log(this);
        }
        show(); // In browser: this refers to the window object
    14.>What are arrow functions, and how are they different from regular functions?
        Explanation: Arrow functions are a shorthand syntax for writing functions. They do not have their own this context, unlike regular functions.
        let regularFunction = function() {
            console.log(this);
        };
        let arrowFunction = () => {
            console.log(this);
        };
    15.>What are template literals?
        Explanation: Template literals allow embedded expressions and multi-line strings using backticks (`).
        let name = 'John';
        let greeting = `Hello, ${name}`;
        console.log(greeting); // Hello, John
    16.>What is the purpose of the map() function in JavaScript?
        Explanation: map() creates a new array by applying a function to each element of the array.
        let numbers = [1, 2, 3];
        let doubled = numbers.map(num => num * 2);
        console.log(doubled); // [2, 4, 6]
    17.>How does reduce() work in JavaScript?
        Explanation: reduce() applies a function to each element of an array (from left to right) to reduce it to a single value.
        let numbers = [1, 2, 3, 4];
        let sum = numbers.reduce((total, num) => total + num, 0);
        console.log(sum); // 10
    18.>What is the difference between call(), apply(), and bind()?
        Explanation: All three methods are used to set the this context:
        call() invokes the function immediately.
        apply() works like call(), but accepts an array of arguments.
        bind() returns a new function with the specified this context, without invoking it immediately.
        Ex:-
        function greet() {
            console.log(`Hello, ${this.name}`);
        }
        let person = { name: 'Alice' };
        greet.call(person); // Hello, Alice
        greet.apply(person); // Hello, Alice
        let boundGreet = greet.bind(person);
        boundGreet(); // Hello, Alice
    19.>How does JavaScript handle asynchronous code?
        Explanation: JavaScript handles asynchronous code via callbacks, promises, and async/await to prevent blocking the main thread.
        setTimeout(() => {
            console.log("Hello after 2 seconds");
        }, 2000);
    20.>What is the event loop, and how does it work?
        Explanation: The event loop manages the execution of asynchronous code by placing callbacks and events in the queue while the call stack is empty.
        Example: The event loop waits for an asynchronous task (e.g., setTimeout) to finish and then places the callback in the event queue when the call stack is clear.
Advanced
    21.>What is a promise in JavaScript?
        Explanation: A Promise represents the eventual completion (or failure) of an asynchronous operation.
        let promise = new Promise((resolve, reject) => {
            let success = true;
            success ? resolve('Resolved') : reject('Rejected');
        });
        promise.then(result => console.log(result)).catch(error => console.log(error));        
    22.>Explain async/await in JavaScript.
        Explanation: async and await are used for handling asynchronous code. async defines a function that returns a promise, and await pauses execution until the promise resolves.
        async function fetchData() {
            let response = await fetch('https://api.example.com');
            let data = await response.json();
            console.log(data);
        }
        fetchData();
    23.>What are generators in JavaScript?
        Explanation: Generators are functions that can be paused and resumed. They return a generator object that can be iterated over.
        function* counter() {
            let count = 0;
            while (true) {
                yield count++;
            }
        }
        let gen = counter();
        console.log(gen.next().value); // 0
        console.log(gen.next().value); // 1
    24.>What is Symbol in JavaScript, and why is it used?
        A Symbol is a unique and immutable data type introduced in ES6. It is used to create unique property keys in objects to avoid naming conflicts.
        Key Features:
            Each Symbol is guaranteed to be unique, even if they have the same description.
            They are primarily used for object properties to avoid accidental overwrites.
        const sym1 = Symbol('id');
        const sym2 = Symbol('id');
        console.log(sym1 === sym2); // false (unique)
        const user = {
            [sym1]: 123,
            name: 'John'
        };
        console.log(user[sym1]); // 123
    25.>What are JavaScript prototypes?
        A prototype is an object that other objects inherit properties and methods from. Every JavaScript object has a prototype, which allows objects to share common behavior.
        Ex:-
        function Person(name) {
            this.name = name;
        }
        Person.prototype.greet = function () {
            return `Hello, ${this.name}`;
        };
        const john = new Person('John');
        console.log(john.greet()); // "Hello, John"
        In the example, the greet method is shared among all Person instances through the prototype.
    26.>How does inheritance work in JavaScript?
        JavaScript uses prototypal inheritance, meaning objects can inherit directly from other objects using their prototypes.
        const animal = {
            speak: function () {
                console.log(`${this.name} makes a noise.`);
            }
        };
        const dog = Object.create(animal); // dog inherits from animal
        dog.name = 'Buddy';
        dog.speak(); // "Buddy makes a noise."
        In ES6, class syntax makes inheritance easier to write:
        class Animal {
            constructor(name) {
                this.name = name;
            }
            speak() {
                console.log(`${this.name} makes a noise.`);
            }
        }
        class Dog extends Animal {
            speak() {
                console.log(`${this.name} barks.`);
            }
        }
        const dog = new Dog('Buddy');
        dog.speak(); // "Buddy barks."
    27.>What are the differences between ES5 and ES6?
        Feature	                    ES5	                                    ES6
        Variable Declaration	    var only	                            let, const for block scoping
        Functions	                Regular functions	                    Arrow functions
        Classes	                    Not supported, use prototypes	        class and extends
        Modules	                    Not supported directly	                import and export
        Default                     Parameters	Not supported	            Supported
        Template Literals	        String concatenation (+)	            Backticks (```) for multiline strings
        Promises	                Not built-in	                        Built-in
        Example of ES6 Features:
            // let and const
            const x = 10;
            let y = 20;
            // Arrow Function
            const add = (a, b) => a + b;
            // Class
            class Person {
                constructor(name) {
                    this.name = name;
                }
                greet() {
                    return `Hello, ${this.name}`;
                }
            }
    28.>What is the Reflect API in JavaScript?
        The Reflect API provides a set of static methods for performing low-level operations on objects, such as creating properties or modifying them. It is often used as a more standardized way to perform operations that were previously done through functions like Object.defineProperty.
        Example:
        const obj = {};
        Reflect.set(obj, 'name', 'John');
        console.log(obj.name); // "John"
        console.log(Reflect.has(obj, 'name')); // true
        Reflect.deleteProperty(obj, 'name');
        console.log(obj.name); // undefined
    29.>What is the purpose of the WeakMap and WeakSet?
        WeakMap and WeakSet are similar to Map and Set but only store weak references to their keys. This means keys can be garbage-collected if there are no other references to them.
        Use Cases:
            To associate metadata with objects without preventing their garbage collection.
            let obj = { name: 'John' };
            const weakMap = new WeakMap();
            weakMap.set(obj, 'some value');
            console.log(weakMap.get(obj)); // "some value"
            obj = null; // The object is eligible for garbage collection.
    30.>What are modules in JavaScript?
        Modules allow you to break your code into reusable pieces, making it easier to organize, maintain, and share.
        ES6 Modules:
            Use export to expose variables or functions.
            Use import to bring them into another file.
        Example:
        math.js:
            export const add = (a, b) => a + b;
            export const subtract = (a, b) => a - b;
        main.js:
            import { add, subtract } from './math.js';
            console.log(add(2, 3)); // 5
            console.log(subtract(5, 3)); // 2
DOM and Browser
    31.>How do you select DOM elements in JavaScript?
        You can select DOM elements using various methods provided by the document object:
        Methods:
            document.getElementById('id') – Selects an element by its id.
            document.getElementsByClassName('class') – Selects elements by their class name.
            document.getElementsByTagName('tag') – Selects elements by their tag name.
            document.querySelector('selector') – Selects the first element that matches a CSS selector.
            document.querySelectorAll('selector') – Selects all elements matching a CSS selector.
        Example:
            const element = document.getElementById('myElement');
            const buttons = document.querySelectorAll('button');
            console.log(element, buttons);
    32.>What is the difference between innerHTML and innerText?
        innerHTML: Gets or sets the HTML content of an element. It includes HTML tags.
        innerText: Gets or sets the text content of an element, ignoring HTML tags.
        Example:
            const div = document.createElement('div');
            div.innerHTML = '<b>Hello</b> World!';
            console.log(div.innerHTML); // "<b>Hello</b> World!"
            console.log(div.innerText); // "Hello World!"
    33.>How do you create an element dynamically in JavaScript?
        You can create elements dynamically using document.createElement() and append them to the DOM.
        Example:
            const newDiv = document.createElement('div');
            newDiv.textContent = 'Hello, I am a new div!';
            document.body.appendChild(newDiv);
    34.>What is the difference between event.preventDefault() and event.stopPropagation()?
        event.preventDefault(): Prevents the default action of an event (e.g., stopping a form submission).
        event.stopPropagation(): Stops the event from propagating (bubbling) up or down the DOM hierarchy.
        Ex:-
            const link = document.querySelector('a');
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevents the link from navigating.
            });
            const button = document.querySelector('button');
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Stops the click event from reaching parent elements.
            });
    35.>Explain the concept of bubbling and capturing in JavaScript.
        Bubbling: Events propagate from the target element up to its ancestors.
        Capturing: Events propagate from the ancestors down to the target element.
        Example:-
            document.body.addEventListener('click',
                () => console.log('Body clicked (capturing)'),
                true // Capturing phase
            );
            document.body.addEventListener(
            'click',
                () => console.log('Body clicked (bubbling)'),
                false // Bubbling phase
            );
    36.>What are web workers in JavaScript?
        Web workers allow you to run JavaScript in a separate thread, preventing blocking the main UI thread. They are used for computationally heavy tasks.
        Example:
            worker.js:
            self.onmessage = (e) => {
                const result = e.data * 2;
                self.postMessage(result);
            };
            main.js:
            const worker = new Worker('worker.js');
            worker.onmessage = (e) => console.log('Result:', e.data);
            worker.postMessage(10); // Sends data to the worker
    37.>What is the navigator object?
        The navigator object contains information about the browser and operating system.
        Example:
            console.log(navigator.userAgent); // Browser details
            console.log(navigator.language); // Browser language
            console.log(navigator.onLine); // Online status
    38.>What is the window object in JavaScript?
        The window object represents the browser's window. It is the global object in the browser environment.
        console.log(window.location.href); // Current URL
        console.log(window.innerWidth); // Width of the window
        alert('Hello, world!'); // A method on the window object
    39.>How can you optimize DOM manipulation in JavaScript?
        Best Practices:
            Minimize reflows and repaints:
                Use documentFragment to batch changes.
            Avoid direct DOM updates in loops:
                Collect changes and update the DOM in one go.
            Use requestAnimationFrame for animations:
                Efficiently schedule updates.
            Cache selectors:
                Avoid querying the DOM repeatedly.
        Ex:-
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 1000; i++) {
            const div = document.createElement('div');
            div.textContent = `Item ${i}`;
            fragment.appendChild(div);
        }
        document.body.appendChild(fragment);
    40.>What is the purpose of the document.createElement() method?
        The document.createElement() method is used to create new HTML elements dynamically.
        Example:
            const newButton = document.createElement('button');
            newButton.textContent = 'Click Me';
            document.body.appendChild(newButton);
Error Handling
    41.>How does error handling work in JavaScript?
        JavaScript uses try...catch blocks to handle errors gracefully instead of allowing them to crash the application. When an error occurs in the try block, the code in the catch block executes. This helps manage runtime errors effectively.
        Example:-
            try {
                const result = 10 / 0;
                console.log(result);
            } catch (error) {
                console.log('An error occurred:', error.message);
            }
    42.>What is the difference between try...catch and throw?
        try...catch: Used to handle errors. The code in the catch block runs if an error occurs in the try block.
        throw: Used to generate custom errors that can be caught by a catch block.
        Example:-
            try {
                throw new Error('Custom error message'); // Throw an error
            } catch (error) {
                console.log('Caught error:', error.message);
            }
    43.>What is an error object in JavaScript?
        An error object contains details about the error, such as its name and message. JavaScript has built-in error objects, including Error, TypeError, SyntaxError, and more.
        Example:-
            try {
                const json = JSON.parse('invalid JSON');
            } catch (error) {
                console.log('Error name:', error.name); // "SyntaxError"
                console.log('Error message:', error.message); // "Unexpected token i in JSON"
            }
    44.>How do you handle asynchronous errors in JavaScript?
        Asynchronous errors can occur in promises or async/await functions. They are handled differently:
        Using Promises:
            fetch('invalid-url')
                .then((response) => response.json())
                .catch((error) => {
                    console.log('Fetch error:', error.message);
                });
        Using async/await with try...catch:
            async function fetchData() {
                try {
                    const response = await fetch('invalid-url');
                    const data = await response.json();
                } catch (error) {
                    console.log('Async error:', error.message);
                }
            }
            fetchData();
    45.>What is the purpose of finally in a try...catch block?
        The finally block executes after the try and catch blocks, regardless of whether an error occurred. It is often used for cleanup operations like closing resources or resetting states.
        Example:-
            try {
                console.log('Trying to execute...');
                throw new Error('Something went wrong!');
            } catch (error) {
                console.log('Caught an error:', error.message);
            } finally {
                console.log('Cleaning up resources...');
            }
        Summary of Concepts:
            Feature	                        Purpose
            try...catch	                    To handle runtime errors and prevent crashes.
            throw	                        To generate custom errors.
            Error Object	                Contains details like name and message about the error.
            Asynchronous Errors	            Handled using .catch() for promises or try...catch in async/await.
            finally	                        Runs cleanup code, regardless of success or failure in the try block.

Performance
    46.>What is debouncing in JavaScript?
        Debouncing is a technique to limit the rate at which a function executes. It ensures that a function is invoked only after a specified delay, and if the event is triggered again during the delay, the timer resets. It is commonly used for scenarios like search inputs or resize events.
        Example:-
            function debounce(func, delay) {
                let timer;
                return function (...args) {
                    clearTimeout(timer);
                    timer = setTimeout(() => func.apply(this, args), delay);
                };
            }
            const log = () => console.log('Debounced Event!');
            window.addEventListener('resize', debounce(log, 300));
    47.>What is throttling in JavaScript?
        Throttling ensures a function is executed at most once in a specified interval, even if the event is triggered multiple times during that interval. It’s useful for scroll or resize events.
        Example:-
            function throttle(func, interval) {
                let lastCall = 0;
                return function (...args) {
                    const now = Date.now();
                    if (now - lastCall >= interval) {
                    lastCall = now;
                    func.apply(this, args);
                    }
                };
            }
            const log = () => console.log('Throttled Event!');
            window.addEventListener('scroll', throttle(log, 300));
    48.>How can you improve JavaScript performance in a web application?
        Tips:
            Minimize DOM Manipulation: Batch changes using documentFragment.
            Debounce or Throttle Events: Use for high-frequency events.
            Lazy Loading: Load resources (like images) only when needed.
            Reduce JavaScript Payload: Minify and compress scripts.
            Optimize Loops: Use efficient algorithms and avoid redundant operations.
            Avoid Memory Leaks: Remove unused event listeners or references.
    49.>Explain lazy loading in JavaScript.
        Lazy loading is a technique where resources like images or scripts are loaded only when they are needed. This reduces the initial load time and improves performance.
        Example:
            Lazy Loading Images:
            <img data-src="image.jpg" alt="Lazy Image" class="lazy" />
            <script>
                const lazyImages = document.querySelectorAll('.lazy');
                const loadImage = (image) => {
                    image.src = image.dataset.src;
                };
                lazyImages.forEach((img) => {
                    img.addEventListener('load', () => loadImage(img));
                });
            </script>
    50.>What are memory leaks, and how can they be avoided in JavaScript?
        A memory leak occurs when memory that is no longer needed is not released, causing a gradual decrease in performance.
        Causes:
            Unused event listeners.
            Global variables.
            Retained references.
        Avoidance:
            Use WeakMap and WeakSet: Automatically removes unused references.
            Remove Event Listeners: Use removeEventListener for unused listeners.
            Scope Variables Properly: Avoid excessive use of global variables.
    51.>Object-Oriented JavaScript
        Object-Oriented Programming (OOP) in JavaScript is a programming paradigm that uses objects to model real-world entities. JavaScript supports OOP with features like classes, prototypes, and inheritance.
    52.>What are JavaScript objects?
        Objects in JavaScript are collections of key-value pairs where values can be of any type.
        Example:-
            const car = {
                brand: 'Tesla',
                model: 'Model X',
                drive: function () {
                    console.log('Driving...');
                },
            };
            console.log(car.brand); // "Tesla"
            car.drive(); // "Driving..."
    53.>How do you create objects in JavaScript?
        Methods:
            Object Literals:
                const obj = { name: 'Alice', age: 25 };
            Constructor Functions:
                function Person(name, age) {
                    this.name = name;
                    this.age = age;
                }
                const person = new Person('Bob', 30);
            Object.create():
                const proto = { greet: function () { console.log('Hello!'); } };
                const obj = Object.create(proto);
                obj.greet(); // "Hello!"
            Classes (ES6):
                class Person {
                    constructor(name, age) {
                        this.name = name;
                        this.age = age;
                    }
                }
                const person = new Person('Charlie', 35);
    54.>What is the Object.create() method?
        Object.create() creates a new object with a specified prototype.
        Example:-
            const proto = { greet: function () { console.log('Hi!'); } };
            const obj = Object.create(proto);
            obj.greet(); // "Hi!"
    55.>How does object destructuring work in JavaScript?
        Object destructuring allows you to extract properties from an object into variables.
        Example:-
            const person = { name: 'Alice', age: 25 };
            const { name, age } = person;
            console.log(name); // "Alice"
            console.log(age); // 25
    56.>What is the purpose of getters and setters in JavaScript?
        Getters: Retrieve the value of a property.
        Setters: Set or modify the value of a property.
        Example:-
            const person = {
                firstName: 'John',
                lastName: 'Doe',
                get fullName() {
                    return `${this.firstName} ${this.lastName}`;
                },
                set fullName(name) {
                    [this.firstName, this.lastName] = name.split(' ');
                },
            };
            console.log(person.fullName); // "John Doe"
            person.fullName = 'Jane Smith';
            console.log(person.firstName); // "Jane"
Array and Strings
    57.>What are JavaScript arrays?
        JavaScript arrays are special objects used to store multiple values in a single variable. They can contain values of different types (e.g., numbers, strings, objects).
        Example:-
            const arr = [1, 'hello', { key: 'value' }, [2, 3]];
            console.log(arr[1]); // "hello"
            console.log(arr.length); // 4
    58.>Explain the difference between forEach() and map().
        Feature	              forEach()	                                         map()
        Purpose	              Executes a function for each array element           Creates a new array with the results
                              without returning a new array.	                   of applying a function to each element.
        Return Value	      undefined	                                            A new array.
        Use Case	          Side effects like logging or modifying                Transforming or creating a new array.
                              external variables.	
        Example:-
            const arr = [1, 2, 3];
            arr.forEach((num) => console.log(num * 2));
            // Logs: 2, 4, 6
            const doubled = arr.map((num) => num * 2);
            console.log(doubled); // [2, 4, 6]
    59.>How does the filter() method work in JavaScript?
        The filter() method creates a new array containing elements that satisfy a specified condition.
        Example:-
            const arr = [1, 2, 3, 4, 5];
            const evenNumbers = arr.filter((num) => num % 2 === 0);
            console.log(evenNumbers); // [2, 4]
    60.>How can you reverse a string in JavaScript?
        You can reverse a string by converting it into an array, reversing the array, and then joining it back into a string.
        Example:-
            const str = 'hello';
            const reversed = str.split('').reverse().join('');
            console.log(reversed); // "olleh"
    61.>How do you flatten an array in JavaScript?
        Flattening an array means converting a nested array into a single-level array.
        Method 1: Using flat()
            const arr = [1, [2, 3], [4, [5, 6]]];
            const flattened = arr.flat(2); // `2` is the depth level
            console.log(flattened); // [1, 2, 3, 4, 5, 6]
        Method 2: Using Recursion
            const flatten = (arr) =>
            arr.reduce(
                (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
                []
            );
            const arr = [1, [2, 3], [4, [5, 6]]];
            console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
        Method 3: Using flatMap() (ES6+)
            const arr = [1, [2, 3], [4, 5]];
            const flattened = arr.flatMap((item) => (Array.isArray(item) ? item : [item]));
            console.log(flattened); // [1, 2, 3, 4, 5]

ES6 and Beyond
    62.>What is destructuring in JavaScript?
        Destructuring in JavaScript allows you to extract values from arrays or properties from objects and assign them to variables in a concise way.
        Example:-
            const numbers = [1, 2, 3];
            const [a, b, c] = numbers;
            console.log(a, b, c); // 1 2 3
        Example with Objects:
            const person = { name: 'John', age: 30 };
            const { name, age } = person;
            console.log(name, age); // "John" 30
    63.>How do default parameters work in JavaScript?
        Default parameters allow you to assign a default value to a function parameter if no value is provided during the function call.
        Example:-
            function greet(name = 'Guest') {
                console.log(`Hello, ${name}!`);
            }
            greet(); // "Hello, Guest!"
            greet('Alice'); // "Hello, Alice!"
    64.>What is a spread operator in JavaScript?
        The spread operator (...) allows you to expand an array or object into its individual elements or properties.
        Example with Arrays:
            const arr1 = [1, 2, 3];
            const arr2 = [...arr1, 4, 5];
            console.log(arr2); // [1, 2, 3, 4, 5]
        Example with Objects:
            const obj1 = { a: 1, b: 2 };
            const obj2 = { ...obj1, c: 3 };
            console.log(obj2); // { a: 1, b: 2, c: 3 }
    65.>What is the difference between rest and spread operators?
        Both use the ... syntax but serve different purposes:
        Feature	        Rest Operator	                                Spread Operator
        Purpose	        Collects elements into an array or object.	    Expands elements of an array or object.
        Use Case	    Used in function arguments or destructuring.	Used for merging, copying, or expanding.
        Rest Example:
            function sum(...numbers) {
                return numbers.reduce((total, num) => total + num, 0);
            }
            console.log(sum(1, 2, 3)); // 6
        Spread Example:
            const arr = [1, 2, 3];
            console.log(...arr); // 1 2 3
    66.>Explain the concept of a JavaScript Set.
        A Set is a collection of unique values. It removes duplicates and allows values of any type.
        Example:-
            const set = new Set();
            set.add(1);
            set.add(2);
            set.add(1); // Duplicate, ignored
            console.log(set); // Set { 1, 2 }
            // Convert a Set to an Array
            const arr = [...set];
            console.log(arr); // [1, 2]
            // Check if a value exists
            console.log(set.has(1)); // true
            // Iterating through a Set
            set.forEach((value) => console.log(value)); // 1 2
            Key Features of Set:
                No duplicates.
                Fast lookups using has() method.
                Iteration using forEach or for...of.
Advanced Topics
    67.>What is currying in JavaScript?
        Currying is a technique in functional programming where a function takes multiple arguments one at a time instead of all at once. A curried function returns a new function for each argument until all arguments are provided.
        Example:-
            // Traditional function
            function add(a, b) {
                return a + b;
            }
            // Curried version
            function curriedAdd(a) {
                return function (b) {
                    return a + b;
                };
            }
            console.log(curriedAdd(5)(3)); // 8
            // Using ES6 Arrow Functions
            const curriedMultiply = (a) => (b) => a * b;
            console.log(curriedMultiply(2)(3)); // 6
    68.>What is the purpose of the Proxy object in JavaScript?
        A Proxy object allows you to define custom behavior for fundamental operations on objects, such as reading, writing, or function invocation.
        Use Cases:
            Validation
            Logging
            Object customization    
        Example:-
            const handler = {
                get: (target, property) => {
                    console.log(`Getting property ${property}`);
                    return target[property];
                },
                set: (target, property, value) => {
                    console.log(`Setting property ${property} to ${value}`);
                    target[property] = value;
                    return true;
                },
            };
            const obj = new Proxy({}, handler);
            obj.name = 'Alice'; // Logs: Setting property name to Alice
            console.log(obj.name); // Logs: Getting property name, then returns "Alice"
    69.>How does garbage collection work in JavaScript?
        Garbage collection in JavaScript is a process where the JavaScript engine automatically frees up memory by removing objects that are no longer reachable or in use.
        Key Points:
            Reference counting: If no references point to an object, it is eligible for garbage collection.
            Mark-and-sweep algorithm: Used to detect objects that are no longer reachable from the root (e.g., window object).
        Example:-
            let obj = { name: 'John' };
            obj = null; // The object is now eligible for garbage collection.
    70.>Explain the concept of immutability in JavaScript.
        Immutability means that an object or value cannot be changed after it is created. Instead of modifying the original, new objects or values are created.
        Benefits:
            Predictable state management.
            Avoids unintended side effects.
        Example:-
            // Mutable Object
            let obj = { name: 'John' };
            obj.name = 'Alice'; // Object modified
            // Immutable Object
            const original = { name: 'John' };
            const updated = { ...original, name: 'Alice' }; // Creates a new object
            console.log(updated); // { name: "Alice" }
            console.log(original); // { name: "John" }
    71.>What is memoization in JavaScript?
        Memoization is an optimization technique where the results of expensive function calls are stored and reused when the same inputs occur again.
        Example:-
            function memoize(fn) {
                const cache = {};
                return function (...args) {
                    const key = JSON.stringify(args);
                    if (cache[key]) {
                    console.log('Returning from cache');
                    return cache[key];
                    }
                    const result = fn(...args);
                    cache[key] = result;
                    return result;
                };
            }
            const slowFunction = (num) => {
                console.log('Computing...');
                return num * num;
            };
            const memoizedFunction = memoize(slowFunction);
            console.log(memoizedFunction(5)); // Computing... 25
            console.log(memoizedFunction(5)); // Returning from cache 25
            Advantages:
                Reduces redundant calculations.
                Improves performance for computationally expensive functions.
Frameworks and Libraries
    72.>What is Node.js, and how is it different from JavaScript in the browser?
        Node.js is a runtime environment that allows you to run JavaScript code on the server side, outside the browser. It uses the V8 engine (same as in Chrome) and adds capabilities like file system access, network operations, and server-side scripting.
        Key Differences:
        Feature	                Node.js	                                    JavaScript in Browser
        Runtime Environment	    Runs on the server.	                        Runs in the browser (client-side).
        Global Object	        global	                                    window or self
        APIs	                Includes APIs for file system, HTTP, etc.	Browser-specific APIs (DOM, BOM).
        Purpose	                Server-side programming, tools, CLI apps.	Client-side interactivity and UI.
        Example:-
        Node.js
            const fs = require('fs');
            fs.writeFileSync('example.txt', 'Hello from Node.js!');
            console.log('File created.');
        Browser:
            console.log('Hello from the browser!');
            document.body.style.backgroundColor = 'lightblue';
    73.>What is the difference between require() and import?
        Both are used to include modules in JavaScript, but they differ in syntax, functionality, and when they are used.
        Feature	        require()	                    import
        Syntax	        CommonJS syntax	                ES6 module syntax
        When Available	Built into Node.js	            ES6 standard; works in modern JS
        Loading	        Synchronous	                    Asynchronous
        Use Case	    Works in Node.js	            Works in browsers (with modules) and Node.js (with ESM)
        Example	        const fs = require('fs');	    import fs from 'fs';
        Example:
        Using require:
            const fs = require('fs');
            fs.readFileSync('example.txt');
        Using import:
            import fs from 'fs';
            fs.readFileSync('example.txt');
    74.>What is npm, and how is it used?
        npm (Node Package Manager) is a package manager for Node.js. It helps developers install, share, and manage libraries and tools for their projects.
        Common Commands:
        Command	                    Purpose
        npm init	                Initializes a new project and creates a package.json.
        npm install <pkg>	        Installs a package locally.
        npm install -g <pkg>	    Installs a package globally.
        npm uninstall <pkg>	        Removes a package.
        npm update	                Updates all installed packages.
        Example:
            npm init -y
            npm install express
        In index.js:
            const express = require('express');
            const app = express();
            app.get('/', (req, res) => res.send('Hello, World!'));
            app.listen(3000);
    75.>How do you handle asynchronous operations in Node.js?
        Asynchronous operations in Node.js can be handled using callbacks, promises, or async/await.
        Using Callbacks:
            const fs = require('fs');
            fs.readFile('example.txt', 'utf8', (err, data) => {
                if (err) return console.error(err);
                console.log(data);
            });
        Using Promises:
            const fs = require('fs').promises;
            fs.readFile('example.txt', 'utf8')
            .then(data => console.log(data))
            .catch(err => console.error(err));
        Using Async/Await:
            const fs = require('fs').promises;
            (async () => {
                try {
                    const data = await fs.readFile('example.txt', 'utf8');
                    console.log(data);
                } catch (err) {
                    console.error(err);
                }
            })();
    76.>What is the purpose of middleware in Express.js?
        Middleware in Express.js are functions that execute during the request-response cycle. They can:
        Modify the request or response object.
            End the request-response cycle.
            Pass control to the next middleware.
        Common Use Cases:
            Logging
            Authentication
            Error handling
            Serving static files
        Example:-
            const express = require('express');
            const app = express();
            // Middleware function
            app.use((req, res, next) => {
                console.log(`${req.method} ${req.url}`);
                next(); // Pass control to the next middleware
            });
            // Route handler
            app.get('/', (req, res) => res.send('Hello, Middleware!'));
            app.listen(3000, () => console.log('Server running on port 3000'));
            In this example:
                Middleware logs the request details.
                The route handler sends the response.
Testing
    77.>What are unit tests in JavaScript?
        Unit tests are tests that validate the functionality of small, isolated parts of a program (units), such as functions or methods. Their purpose is to ensure that each unit behaves as expected under various conditions.
        Example:-
            Testing a function that adds two numbers:
                function add(a, b) {
                    return a + b;
                }
            // Test
                console.assert(add(2, 3) === 5, 'Test failed: add(2, 3) should return 5');
                console.assert(add(-1, 1) === 0, 'Test failed: add(-1, 1) should return 0');        
    78.>How do you test JavaScript code?
        JavaScript code can be tested using testing frameworks and libraries like Jest, Mocha, Jasmine, or tools like Cypress for end-to-end testing.
        Steps:
            Write tests for each function or module.
            Use assertions to check expected outputs.
            Run the tests using a test runner.
        Example with Jest:
            // Function to test
            function multiply(a, b) {
                return a * b;
            }
            // Jest test
            test('multiply 2 and 3 should return 6', () => {
                expect(multiply(2, 3)).toBe(6);
            });
        Run the test with npm test.
    79.>What is the purpose of Jest?
        Jest is a JavaScript testing framework maintained by Facebook. It simplifies testing by providing:
            Assertions: Check if values meet expectations.
            Mocking: Simulate functions, modules, or APIs.
            Snapshot Testing: Test UI or objects against a stored snapshot.
            Code Coverage: Identify untested code.
        Example:-
            // Function to test
            function greet(name) {
                return `Hello, ${name}!`;
            }
            // Jest test
            test('greet function', () => {
                expect(greet('Alice')).toBe('Hello, Alice!');
            });
    80.>What is a mocking library?
        A mocking library allows you to create fake implementations of functions, modules, or APIs during tests. This is useful for isolating the code under test and avoiding dependencies on external services or complex logic.
        Example with Jest Mocks:
            // Function that depends on another module
            const fetchData = require('./fetchData');
            function getUserName(userId) {
                return fetchData(`/users/${userId}`).then(data => data.name);
            }
            // Mock fetchData in the test
            jest.mock('./fetchData', () => jest.fn());
            test('getUserName should fetch user name', async () => {
                require('./fetchData').mockResolvedValue({ name: 'Alice' });
                const name = await getUserName(1);
                expect(name).toBe('Alice');
            });
    81.>How does snapshot testing work?
        Snapshot testing is a method to ensure that the output of a function or component matches a previously recorded "snapshot." If the output changes, the test will fail, signaling a potential regression.
        Use Case:
            Snapshot testing is commonly used for React components to verify their rendered structure.
        Example:-
            import React from 'react';
            import renderer from 'react-test-renderer';
            import MyComponent from './MyComponent';
            test('MyComponent matches the snapshot', () => {
                const tree = renderer.create(<MyComponent name="Alice" />).toJSON();
                expect(tree).toMatchSnapshot();
            });
        When run for the first time, Jest saves the output to a snapshot file. On subsequent runs, Jest compares the current output to the saved snapshot. If there are differences, you can review and update the snapshot if the changes are intentional.
Best Practices
    82.>How do you write clean code in JavaScript?
        Writing clean code in JavaScript involves following best practices that make your code readable, maintainable, and efficient. Some key principles include:
        Key Practices:
            Use meaningful names: Name variables, functions, and classes in a way that clearly describes their purpose. Avoid using vague names like x or temp.
            Example:-
                // Bad
                let x = 5;
                // Good
                let userAge = 25;
            Keep functions small and focused: Each function should perform a single task and be easy to test.
            Example:-
                // Bad
                function processData(data) {
                    // fetch data, process, and display
                }
                // Good
                function fetchData() { /* fetch logic */ }
                function processData(data) { /* processing logic */ }
            Avoid magic numbers: Use constants for values that have a special meaning.
            Example:-
                // Bad
                let price = 100 * 0.15; // What is 0.15?
                // Good
                const TAX_RATE = 0.15;
                let price = 100 * TAX_RATE;
            Comment wisely: Comment only when necessary to explain complex or non-obvious logic.
            Example:-
                // Bad
                let a = 10; // Initialize variable a
                let b = 5; // Initialize variable b
                // Good
                let totalAmount = calculateTotal(price, tax); // Calculate the total with tax
            Follow consistent indentation and formatting: Ensure that your code is neatly formatted with proper indentation to improve readability.
    83.>What are the advantages of using TypeScript with JavaScript?
        TypeScript is a superset of JavaScript that adds static typing and other features. Here are its advantages:
        Static typing: TypeScript allows you to define types, which helps catch errors during development before runtime.
        Example:-
            let age: number = 30;
            age = '30'; // Error: Type 'string' is not assignable to type 'number'
        *Improved IDE support: With types, code editors can provide better autocomplete, error checking, and refactoring tools.
        *Better maintainability: As your codebase grows, TypeScript helps maintain type safety and clarity, making it easier to manage and refactor.
        *Enhanced tooling: TypeScript includes features like interfaces, enums, and decorators, which help in building more structured applications.
        *Compatibility with JavaScript: TypeScript code compiles down to JavaScript, so it works in any environment where JavaScript is supported.
    84.>What is linting, and why is it important?
        Linting is the process of analyzing code for potential errors, style violations, and other issues. Linting tools (like ESLint) provide feedback and enforce coding standards to improve code quality and consistency.
        Benefits:
            Catch common bugs early: Linting helps identify issues like unused variables, missing semicolons, or undefined variables.
            Consistent coding style: Linting ensures all developers follow the same coding conventions (e.g., indentation, naming conventions), leading to cleaner and more readable code.
            Improved collaboration: Having a consistent style reduces friction between developers working on the same codebase.
        Example:
        Using ESLint in a project:
            npm install eslint --save-dev
        Create a configuration file:
            npx eslint --init
        Now ESLint will analyze your JavaScript code for potential issues.
    85.>What are design patterns in JavaScript?
        Design patterns are proven solutions to common software design problems. They provide a standard approach to solving recurring problems in software architecture, promoting reusability, scalability, and maintainability.
        Common Design Patterns in JavaScript:
            Singleton Pattern: Ensures a class has only one instance and provides a global point of access.
            Example:-
                class Singleton {
                    constructor() {
                        if (!Singleton.instance) {
                        Singleton.instance = this;
                        }
                        return Singleton.instance;
                    }
                }
                const instance1 = new Singleton();
                const instance2 = new Singleton();
                console.log(instance1 === instance2); // true
            Module Pattern: Encapsulates logic within a module and exposes only the necessary API.
            Example:-
                const Counter = (function() {
                    let count = 0;
                    return {
                        increment: () => count++,
                        getCount: () => count
                    };
                })();
                Counter.increment();
                console.log(Counter.getCount()); // 1
            Observer Pattern: Allows objects to be notified of state changes in other objects.
            Example:-
                class Subject {
                    constructor() {
                        this.observers = [];
                    }
                    addObserver(observer) {
                        this.observers.push(observer);
                    }
                    notifyObservers() {
                        this.observers.forEach(observer => observer.update());
                    }
                }
                class Observer {
                    update() {
                        console.log('State changed');
                    }
                }
                const subject = new Subject();
                const observer = new Observer();
                subject.addObserver(observer);
                subject.notifyObservers(); // State changed
    86.>Explain the module pattern in JavaScript.
        The module pattern is a design pattern used to encapsulate code in a module, avoiding global scope pollution. It uses closures to protect the internal state and exposes only specific methods or properties.
        Benefits:
            Keeps internal data private.
            Exposes only a clean, well-defined API.
        Example:-
            const CounterModule = (function() {
                let count = 0;
                return {
                    increment: function() {
                        count++;
                    },
                    getCount: function() {
                        return count;
                    }
                };
            })();
            CounterModule.increment();
            console.log(CounterModule.getCount()); // 1
        Here, the count variable is kept private within the module, and only the increment and getCount methods are exposed. This prevents external code from modifying the count directly.
Coding Challenges
    87.>Write a function to check if a string is a palindrome.
    88.>Write a function to find the largest number in an array.
    89.>Implement a debounce function in JavaScript.
    90.>Write a function to merge two sorted arrays.
    91.>Write a function to find duplicate elements in an array.
Security
    92.>What is Cross-Site Scripting (XSS)?
    93.>What is Cross-Site Request Forgery (CSRF)?
    94.>How can you secure JavaScript applications from XSS attacks?
    95.>What is Content Security Policy (CSP)?
    96.>What is the Same-Origin Policy in JavaScript?
Miscellaneous
    97.>What is the purpose of Object.freeze()?
    98.>How does JSON.stringify() and JSON.parse() work?
    99.>What is the difference between synchronous and asynchronous code?
    100.>What is the purpose of the eval() function?
    101.>What is the difference between fetch and XMLHttpRequest?



Basics
JavaScript is a language used to make web pages interactive. It’s not related to Java.
var, let, const: Use var for old code, let for changing values, and const for fixed values.
Use var, let, or const to declare variables.
JavaScript data types include numbers, strings, objects, arrays, null, undefined, etc.
== checks values, === checks values and types.
Hoisting: Declarations move to the top before the code runs.
typeof: Checks a variable's type (e.g., typeof 5 returns "number").
null means empty, undefined means no value is assigned.
Functions are blocks of code that run when called.
Function declaration is named, while function expression is stored in a variable.
Intermediate
Closures: Functions remember their parent's variables.
Event delegation: Use one handler for multiple child elements.
this points to the object calling the function.
Arrow functions are short functions without their own this.
Template literals are strings with ${variable} placeholders.
map() transforms each array item.
reduce() combines array items into one value.
call, apply, bind: Ways to change this in functions.
JavaScript uses callbacks, promises, and async/await for async tasks.
The event loop handles tasks, ensuring non-blocking code execution.
Advanced
Promise: Handles async tasks. It has resolve and reject.
async/await: Cleaner way to handle promises.
Generators: Functions that pause and resume (yield keyword).
Symbol: Unique values, often for object keys.
Prototypes: Objects inherit properties via prototypes.
Inheritance: Child objects inherit parent properties using prototype.
ES5/ES6: ES6 added features like let, const, arrow functions.
Reflect: Modern way to interact with objects.
WeakMap, WeakSet: Store weak references for garbage collection.
Modules: Break code into reusable files (import/export).
DOM and Browser
Use querySelector or getElementById to select elements.
innerHTML gets HTML; innerText gets text only.
Use createElement to create HTML dynamically.
preventDefault stops default action, and stopPropagation stops bubbling.
Bubbling: Events go up; Capturing: Events go down.
Web workers run JavaScript in the background.
navigator: Browser info (e.g., online status).
window: Global browser object (e.g., window.alert()).
DOM optimization: Use document fragments or innerHTML.
createElement: Adds new elements to the DOM.
Error Handling
Use try...catch for handling errors.
throw: Manually trigger errors.
Error object: Gives error details (e.g., message, stack).
Use .catch for async errors.
finally: Runs code after try or catch.
Performance
Debouncing: Delay function until user stops triggering it.
Throttling: Limit function execution rate.
Optimize by minifying code, lazy loading, etc.
Lazy loading: Load images or files only when needed.
Memory leaks: Avoid keeping unused references.
Object-Oriented JavaScript
Objects hold key-value pairs ({ name: "Alice" }).
Create objects with {} or new Object().
Use Object.create() to inherit from another object.
Destructuring: Extract object/array values easily.
Getters/setters: Control access to object properties.
Array and Strings
Arrays store lists of items ([1, 2, 3]).
forEach: Loops over items; map: Creates a new array.
filter: Gets items that match a condition.
Reverse strings with .split().reverse().join().
Use .flat() to flatten arrays.
ES6 and Beyond
Destructuring: Extract parts of objects/arrays.
Default parameters set fallback values.
Spread operator (...) copies arrays/objects.
Rest operator (...) groups arguments into an array.
Set: Stores unique values.
Advanced Topics
Currying: Break a function into multiple calls.
Proxy: Intercept operations on objects.
Garbage collection clears unused memory.
Immutability: Keep data unchanged.
Memoization: Cache results of expensive functions.
Frameworks and Libraries
Node.js: Runs JavaScript outside browsers.
require: CommonJS import; import: ES6 import.
npm: Manages JavaScript packages.
Handle async with callbacks, promises, or async/await.
Middleware: Code between request and response in Express.
Testing
Unit tests test small parts of code.
Use tools like Jest, Mocha for testing.
Jest is a testing framework for JavaScript.
Mocking simulates parts of code (e.g., APIs).
Snapshot testing compares output to expected snapshots.
Best Practices
Write clean, readable code (use meaningful names).
TypeScript adds types to JavaScript for fewer bugs.
Linting: Checks code style and errors.
Design patterns solve common coding problems.
Module pattern: Encapsulates code in reusable modules.
Coding Challenges
Palindrome: Check if a string reads the same backward.
Find the largest array number with Math.max().
Implement debounce by using setTimeout to delay calls.
Merge arrays by sorting them.
Find duplicates using a set.
Security
XSS: Injects malicious scripts.
CSRF: Tricks users into unwanted actions.
Prevent XSS with escaped input and CSP.
CSP: Blocks unauthorized scripts.
Same-Origin Policy: Restricts resource sharing between domains.
Miscellaneous
Object.freeze: Makes objects unchangeable.
JSON.stringify converts objects to strings; JSON.parse does the reverse.
Synchronous code runs in order; async code doesn’t block.
Avoid eval for security reasons.
fetch: Modern API for network requests; better than XMLHttpRequest.