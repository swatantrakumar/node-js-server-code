1.>What are the different data types in JavaScript?
	Ans:->Primitive: String, Number, Boolean, Undefined, Null, Symbol, BigInt.
	Non-primitive: Object, Array, Function.

2.>What is the difference between == and ===?
	Ans:- == compares values for equality after type conversion (loose equality).
	=== compares values and types for equality (strict equality).

3.>Explain the difference between var, let, and const.
	Ans:- var: Function-scoped, hoisted but not block-scoped.
	let: Block-scoped, not hoisted, can be reassigned.
	const: Block-scoped, not hoisted, cannot be reassigned.

4.>What are truthy and falsy values in JavaScript?
	Ans:- Falsy: false, 0, "" (empty string), null, undefined, NaN.
	Truthy: Everything else, including non-empty strings, non-zero numbers, and objects.

5.>What is the difference between function declaration and function expression?
	Ans:-> Function Declaration:
		function sayHello() { console.log("Hello"); }
		Hoisted to the top of the sc

		Function Expression
		const sayHello = function () { console.log("Hello"); };
		Not hoisted.

6.>What is a closure in JavaScript?
	Ans:- A closure is a function that retains access to its outer scope even after the outer function has returned.
	Ex:- 
	function outer() { let count = 0; return function inner() { count++; return count; }; } 
	const increment = outer(); 
	console.log(increment()); // 1 
	console.log(increment()); // 2
7.>What is the difference between call, apply, and bind?
	Ans:- call: Invokes a function, allows passing arguments one by one.
	apply: Invokes a function, allows passing arguments as an array.
	bind: Returns a new function with a specified this value, does not invoke immediately.
	function greet(greeting, punctuation) { 
		console.log(`${greeting}, ${this.name}${punctuation}`); 
	} 
	const person = { name: "John" }; 
	greet.call(person, "Hello", "!"); // "Hello, John!" 
	greet.apply(person, ["Hi", "."]); // "Hi, John." 
	const boundGreet = greet.bind(person, "Hey"); 
	boundGreet("?"); // "Hey, John?"

8.>What is prototypal inheritance in JavaScript?
	Ans:- Objects can inherit properties and methods from another object using the prototype chain.
	const parent = { greet: () => console.log("Hello") };
	const child = Object.create(parent);
	child.greet(); // "Hello"

9.>What is the difference between Object.create() and new?
	Ans:- Object.create() creates a new object with the specified prototype object.
		  new creates an instance of a constructor function.

10.>What is the purpose of Object.freeze() and Object.seal()?
	Ans:-Object.freeze(): Prevents adding, removing, or changing properties.
	Object.seal(): 
	
11.>Explain the event loop in JavaScript.
	Ans:- The event loop ensures non-blocking behavior in JavaScript by handling asynchronous operations.
		It checks the call stack and pushes tasks from the task queue or microtask queue when the stack is empty.

12.>What are Promises and how do they work?
	Ans:- A Promise represents a value that may be available now, later, or never.
	States: pending, fulfilled, rejected.
	Ex:- 
	const promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve("Success"), 1000);
		});
		promise.then(console.log); // 

13.>What is async/await?
	Ans:- Syntax for handling promises in an asynchronous, readable way.
	Ex:- 
		async function fetchData() {
			const response = await fetch("https://api.example.com/data");
			const data = await response.json();
			return data;
		}

14.>What are arrow functions and how are they different from regular functions?
	Ans:- Arrow functions have a concise syntax and do not have their own this.
	Ex:- const add = (a, b) => a + b;

15.>What are template literals?
	Ans:- Template literals allow embedding expressions and multi-line strings.
	Ex: - const name = "John";
			console.log(`Hello, ${name}!`);

16.>What are the new data structures introduced in ES6?
	Ans:- Map, Set, WeakMap, WeakSet.

17.>What is destructuring in ES6?
	Ans:- Destructuring allows unpacking values from arrays or properties from objects into distinct variables.
	Example (Array)
		const [a, b] = [1, 2];
		console.log(a, b); // 1, 2
	Example (Object)
		const { name, age } = { name: "John", age: 30 };
		console.log(name, age); // John, 30

18.>What are default parameters in ES6?
	Ans:-Default parameters allow functions to initialize parameters with default values.
	 	function greet(name = "Guest") {
			return `Hello, ${name}`;
		}
		console.log(greet()); // Hello, Guest

19.>What are ES6 modules?
	Ans:- ES6 introduced import and export for modular code.
		Ex:-
		// file: math.js
		export const add = (a, b) => a + b;

		// file: main.js
		import { add } from './math.js';
		console.log(add(2, 3)); // 5

20.>What is the event loop in JavaScript?
	Ans:- The event loop handles asynchronous operations by checking the call stack and moving tasks from the task queue or microtask queue to the stack when it is empty.

21.>What are Promises, and how are they different from callbacks?
	Ans:- A Promise represents the eventual completion or failure of an asynchronous operation.
		const fetchData = new Promise((resolve, reject) => {
			setTimeout(() => resolve("Data fetched"), 1000);
		});
		fetchData.then(console.log); // Data fetched
		Difference:

		Callbacks can lead to "callback hell".
		Promises provide cleaner, chainable syntax and better error handling.

22.>What is async/await?
	Ans:- async/await allows you to write asynchronous code in a synchronous manner.
		async function getData() {
			try {
				const response = await fetch('https://api.example.com');
				const data = await response.json();
				console.log(data);
			} catch (error) {
				console.error(error);
			}
		}

23.>What are classes in JavaScript?
	Ans: - Classes are syntactic sugar over prototypes for creating objects.
		class Animal {
			constructor(name) {
				this.name = name;
			}
			speak() {
				console.log(`${this.name} makes a sound.`);
			}
		}
		const dog = new Animal("Dog");
		dog.speak(); // Dog makes a sound.

24.>What is the difference between classical inheritance and prototypal inheritance?
	Ans:- Classical inheritance (e.g., in Java): Classes inherit from other classes.
		Prototypal inheritance: Objects inherit from other objects via the prototype chain.

25.>What is the role of super in JavaScript?
	Ans:-super is used to call the parent class constructor or methods.
		Ex:-
		class Animal {
			constructor(name) {
				this.name = name;
			}
		}
		class Dog extends Animal {
			constructor(name, breed) {
				super(name);
				this.breed = breed;
			}
		}

26.>What is a Map in JavaScript?
	Ans:- A Map stores key-value pairs, where keys can be of any type.
		Ex:-const map = new Map();
			map.set('name', 'John');
			console.log(map.get('name')); // John

27.>What is the difference between Map and Object?
	Ans:-Map allows keys of any type, while Object keys are always strings or symbols.
		Map maintains the order of elements; Object does not.

28.>What is a Set?
	Ans:-A Set is a collection of unique values.
		const set = new Set([1, 2, 3, 2]);
		console.log(set); // Set { 1, 2, 3 }

29.>What is the difference between WeakMap and Map?
	Ans:- WeakMap only allows objects as keys and does not prevent garbage collection.
		  Map allows keys of any type and retains references.

30.>What is hoisting in JavaScript?
	Ans:- Hoisting moves variable and function declarations to the top of their scope.
	Ex:- console.log(a); // undefined
		var a = 10;

31.>What is the difference between synchronous and asynchronous code?
	Ans:- Synchronous: Blocks the execution of subsequent code.
		  Asynchronous: Executes code without blocking, using callbacks, Promises, or async/await.

32.>What is the difference between shallow copy and deep copy?
	Ans:- Shallow copy: Copies only the first level of an object.
		  Deep copy: Recursively copies all levels.
		Ex:- 