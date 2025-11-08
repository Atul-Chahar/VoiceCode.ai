
export const rawCurriculumData = {
  "course": {
    "id": "javascript-complete",
    "name": "Complete JavaScript (Browser, Node, TS)",
    "description": "From absolute beginner to advanced full-stack developer. Covers standard JS, Node.js backend, and TypeScript.",
    "modules": [
      {
        "id": "js-module-1",
        "title": "Module 1: JS Fundamentals",
        "lessons": [
          {
            "id": "js-vars-101",
            "title": "Variables (let, const, var) & Scope",
            "objectives": [
              "Understand variables as labeled containers for data",
              "Distinguish between let (reassignable) and const (immutable binding)",
              "Understand basic block scope vs global scope",
              "Know why 'var' and hoisting can be confusing"
            ],
            "prerequisites": [],
            "timeEstimateMin": 25,
            "content": {
              "explanations": [
                "Think of variables like labeled moving boxes. You write a label (the variable name) on the box and put something inside (the value).",
                "'const' is like a museum display case. Once you put an item in and lock it, you can't swap it out for a different item later.",
                "'let' is like an open cardboard box. You can take the old item out and put a new one in whenever you want.",
                "Scope is like rooms in a house. A variable created inside a specific room (like inside an 'if' block) usually can't be seen from the hallway outside."
              ],
              "demos": [
                {
                  "code": "let userAge = 25;\nuserAge = 26; // Okay! Swapped contents of the 'let' box.\n\nconst birthYear = 1998;\n// birthYear = 1999; // Error! Cannot unlock a 'const' display case.\n\nif (true) {\n  // This variable only exists inside this 'room' (block)\n  let blockScoped = \"Visible only here\";\n  console.log(blockScoped);\n}\n// console.log(blockScoped); // Error: The variable doesn't exist out here in the hallway.",
                  "explainByLine": true
                }
              ],
              "oralQuestions": [
                {
                  "type": "recall",
                  "prompt": "If you want to create a box that you NEVER want to swap the contents of, which keyword do you use?"
                },
                {
                  "type": "apply",
                  "prompt": "I declared a variable inside an 'if' statement block. Can I use that same variable later outside of that block? Why or why not?"
                }
              ],
              "debugging": [
                {
                  "buggyCode": "const currentTemp = 72;\ncurrentTemp = 75; // Error here\nconsole.log(currentTemp);",
                  "hints": [
                    "Read the error: 'Assignment to constant variable'.",
                    "You used 'const', which is like our locked museum case.",
                    "If the temperature needs to change, we need an open box. Try 'let'."
                  ],
                  "solution": "let currentTemp = 72;\ncurrentTemp = 75;\nconsole.log(currentTemp);"
                }
              ],
              "exercises": [
                {
                  "prompt": "Declare a 'const' variable named 'myName' with your name string, and a 'let' variable named 'myAge' with your age number.",
                  "tests": ["typeof myName === 'string'", "typeof myAge === 'number'"]
                }
              ],
              "assessment": {
                "questions": [
                  {
                    "type": "mcq",
                    "prompt": "Which declaration represents a value that can be changed later?",
                    "choices": ["const", "let", "immutable"],
                    "answer": "let"
                  }
                ],
                "passCriteria": { "minCorrect": 1 }
              }
            },
            "memoryUpdates": {
              "conceptsMastered": ["const vs let", "scope basics"],
              "mistakeWatchlist": ["const reassignment", "scope access errors"]
            },
            "nextLesson": "js-types-101"
          },
          {
            "id": "js-types-101",
            "title": "Types, Coercion & Equality",
            "objectives": [
              "Identify primitives: string, number, boolean, null, undefined",
              "Use 'typeof' to inspect values",
              "Understand coercion and why === is preferred over =="
            ],
            "prerequisites": ["js-vars-101"],
            "timeEstimateMin": 30,
            "content": {
              "explanations": [
                "In the real world, data comes in different forms: text on paper, numbers on a calculator, or a light switch (on/off). JavaScript is the same.",
                "A 'String' is just text. A 'Number' is for math. A 'Boolean' is just a true/false light switch.",
                "Sometimes JS tries to be helpful and combine incompatible types, like adding the word 'apple' to the number 5. This is called 'coercion', and it often causes bugs.",
                "Always use the triple equals (===). It's like asking 'Are these EXACTLY identical twins?' whereas double equals (==) just asks 'Do these look kind of similar?'"
              ],
              "demos": [
                {
                  "code": "let num = 5;\nlet str = \"5\";\n\n// Double equals is lenient (bad for precision)\nconsole.log(num == str);  // true (JS converts the string \"5\" to number 5 to help)\n\n// Triple equals is strict (good!)\nconsole.log(num === str); // false (One is a number, one is text. Not identical.)\n\nconsole.log(10 + \"20\"); // \"1020\" -> It glued them together as text instead of adding!"
                }
              ],
              "oralQuestions": [
                { "type": "predict", "prompt": "If I have the number 10 and I add the string '20' to it, what will JavaScript likely do?" },
                { "type": "recall", "prompt": "Why do we prefer triple equals (===) over double equals (==)?" }
              ],
              "debugging": [
                 {
                  "buggyCode": "let userLevel = \"1\"; // It came from a text input\nif (userLevel === 1) {\n  console.log(\"Level 1 access granted!\");\n} else {\n  console.log(\"Access denied.\");\n}\n// Why is access denied even though it looks like 1?",
                  "hints": ["Check the quotes around userLevel's value. Is it a number or a string?", "=== checks strictly. Is a text \"1\" identical to the number 1?", "Try changing the variable to be a real number, or compare against a string."],
                  "solution": "let userLevel = 1; // Changed to number\nif (userLevel === 1) {\n  console.log(\"Level 1 access granted!\");\n} else {\n  console.log(\"Access denied.\");\n}"
                 }
              ],
              "exercises": [],
              "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": {
              "conceptsMastered": ["primitives", "strict equality", "coercion awareness"],
              "mistakeWatchlist": ["using == instead of ==="]
            },
             "nextLesson": "js-strings-101"
          },
          {
            "id": "js-strings-101",
            "title": "Strings, Numbers, & Templates",
            "objectives": [
              "Manipulate strings and numbers",
              "Understand NaN (Not a Number) and Infinity",
              "Master template literals for combining text and variables"
            ],
            "prerequisites": ["js-types-101"],
            "timeEstimateMin": 25,
            "content": {
              "explanations": [
                "Template literals (using backticks `) are like 'Mad Libs' or fill-in-the-blanks forms. You write standard text, but leave labeled slots ${} for data to be dropped in later.",
                "NaN stands for 'Not a Number'. It's what you get when you ask a calculator to do something impossible, like 'divide apple by 7'."
              ],
              "demos": [
                {
                  "code": "const name = \"Kai\";\nconst score = 100;\n\n// Old way (messy gluing)\nconsole.log(\"Player \" + name + \" has score: \" + score);\n\n// Template literal way (fill-in-the-blanks)\nconsole.log(`Player ${name} has score: ${score}`);\n\n// Impossible math\nlet result = \"taco\" * 10;\nconsole.log(result); // NaN (Not a Number)"
                }
              ],
              "oralQuestions": [],
              "debugging": [],
              "exercises": [],
              "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["template literals"], "mistakeWatchlist": [] },
            "nextLesson": "js-conditionals-101"
          }
        ]
      },
      {
        "id": "js-module-2",
        "title": "Module 2: Control Flow & Functions",
        "lessons": [
          {
            "id": "js-conditionals-101",
            "title": "Control Flow: if, else, switch, loops",
            "objectives": [
              "Use if/else for decision making",
              "Use for and while loops for repetition",
              "Understand for...of (arrays) vs for...in (objects)"
            ],
            "prerequisites": ["js-module-1"],
            "timeEstimateMin": 35,
            "content": {
              "explanations": [
                "Code usually runs top-to-bottom. Conditionals are forks in the road: 'If it's raining, take umbrella path, else take sunny path.'",
                "Loops are for repeating chores. 'While there are still dishes in the sink, keep washing.'",
                "'for...of' is a special loop perfect for going through a list of items one by one."
              ],
              "demos": [
                {
                  "code": "const weather = \"rainy\";\n\nif (weather === \"rainy\") {\n  console.log(\"Take umbrella\");\n} else {\n  console.log(\"Wear sunglasses\");\n}\n\nconst todoList = ['Learn JS', 'Build App', 'Profit'];\n// Loop through the list\nfor (const task of todoList) {\n  console.log(`Next task: ${task}`);\n}"
                }
              ],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["loops", "conditionals"], "mistakeWatchlist": [] },
            "nextLesson": "js-functions-101"
          },
          {
            "id": "js-functions-101",
            "title": "Functions, Arrows & 'this'",
            "objectives": [
              "Declare functions in standard and arrow syntax",
              "Understand parameters, return values, and closures",
              "Intro to 'this' binding differences"
            ],
            "prerequisites": ["js-conditionals-101"],
            "timeEstimateMin": 40,
            "content": {
              "explanations": [
                "A Function is a reusable recipe. It lists ingredients it needs (parameters), does cooking steps (the code body), and serves up a finished dish (return value).",
                "Closures are like a backpack. When a function leaves the place it was created, it takes a backpack containing all the variables that were around it at the time.",
                "Arrow functions `() => {}` are just a shorter way to write recipes, often used for quick, small tasks."
              ],
              "demos": [
                {
                  "code": "// Standard recipe (function)\nfunction makeSandwich(filling) {\n  return `A delicious ${filling} sandwich`;\n}\n\n// Quick arrow recipe\nconst quickLunch = (food) => `Eating ${food} quickly!`;\n\nconsole.log(makeSandwich(\"turkey\"));\nconsole.log(quickLunch(\"pizza\"));"
                }
              ],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["arrow functions", "closures"], "mistakeWatchlist": [] },
            "nextLesson": "js-arrays-objects-101"
          }
        ]
      },
      {
        "id": "js-module-3",
        "title": "Module 3: Data Structures",
        "lessons": [
          {
            "id": "js-arrays-objects-101",
            "title": "Arrays, Maps, Sets & Objects",
            "objectives": ["Master array methods (map, filter)", "Understand Objects as key-value pairs", "Know when to use Maps or Sets"],
            "prerequisites": ["js-module-2"],
            "timeEstimateMin": 45,
            "content": {
              "explanations": ["Arrays are ordered lists, like a numbered to-do list.", "Objects are like physical things. A 'car' object has properties: color is red, wheels is 4.", "Sets are unique lists—like a guest list where you can't invite the same person twice."],
              "demos": [{ "code": "const car = { color: 'red', wheels: 4 };\nconsole.log(`My car is ${car.color}`);\n\nconst guests = new Set();\nguests.add(\"Neo\");\nguests.add(\"Trinity\");\nguests.add(\"Neo\"); // Won't add him twice!\nconsole.log(guests.size); // 2", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["array methods", "Sets"], "mistakeWatchlist": [] },
            "nextLesson": "js-destructuring-json-101"
          },
          {
            "id": "js-destructuring-json-101",
            "title": "Destructuring, Spread & JSON",
            "objectives": ["Unpack data with destructuring", "Use spread (...) to copy/merge", "Parse and stringify JSON"],
            "prerequisites": ["js-arrays-objects-101"],
            "timeEstimateMin": 35,
            "content": {
              "explanations": ["Destructuring is like unpacking a suitcase. Instead of taking items out one by one, you dump them all straight into the drawers you want.", "JSON is just a text format for sending data, like packing your object into a standardized shipping box."],
              "demos": [{ "code": "const suitcase = { shirt: 'blue', pants: 'jeans' };\n// Unpacking directly into variables\nconst { shirt, pants } = suitcase;\nconsole.log(\"I am wearing a\", shirt, \"shirt\");", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["destructuring", "JSON"], "mistakeWatchlist": [] },
            "nextLesson": "js-oop-101"
          }
        ]
      },
      {
        "id": "js-module-4",
        "title": "Module 4: Prototypes & OOP",
        "lessons": [
          {
            "id": "js-oop-101",
            "title": "Prototypes, Classes & Inheritance",
            "objectives": ["Understand JavaScript's prototype chain", "Use 'class', 'extends', and 'super'", "Concept of encapsulation"],
            "prerequisites": ["js-module-3"],
            "timeEstimateMin": 45,
            "content": {
              "explanations": ["Classes are blueprints. A 'Dog' class isn't a real dog, it's the instructions for making one. When you say 'new Dog()', you actually build a real dog from that blueprint.", "Inheritance is like genetics. A 'Poodle' class can inherit all regular 'Dog' traits, but add its own specific curly hair trait."],
              "demos": [{ "code": "class Dog {\n  constructor(name) { this.name = name; }\n  bark() { console.log(\"Woof!\"); }\n}\n\nconst fido = new Dog(\"Fido\"); // Built a real dog from blueprint\nfido.bark();", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["classes", "inheritance"], "mistakeWatchlist": [] },
            "nextLesson": "js-async-promises-101"
          }
        ]
      },
      {
        "id": "js-module-5",
        "title": "Module 5: Async JS",
        "lessons": [
          {
            "id": "js-async-promises-101",
            "title": "Event Loop, Callbacks & Promises",
            "objectives": ["Understand the Event Loop conceptually", "Move from callbacks to Promises to avoid 'callback hell'"],
            "prerequisites": ["js-functions-101"],
            "timeEstimateMin": 40,
            "content": {
              "explanations": ["Imagine a restaurant. You (the main thread) place an order with the kitchen (API). You don't just stand there waiting; you go back to your table and talk (Event Loop keeps running).", "A Promise is literally like the buzzer they give you. It guarantees that eventually it will either buzz (success!) or break (error)."],
              "demos": [{ "code": "console.log(\"Ordering food...\");\n// The kitchen takes time\nsetTimeout(() => console.log(\"Food is ready! (Buzzer goes off)\"), 2000);\nconsole.log(\"Going back to table to talk...\");", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["event loop concept"], "mistakeWatchlist": [] },
            "nextLesson": "js-async-await-101"
          },
          {
            "id": "js-async-await-101",
            "title": "Async/Await, Fetch & Error Handling",
            "objectives": ["Use async/await for readable async code", "Fetch data from APIs", "Handle errors with try/catch"],
            "prerequisites": ["js-async-promises-101"],
            "timeEstimateMin": 45,
            "content": {
              "explanations": ["async/await is just a cleaner way to handle those restaurant buzzers. Instead of attaching complicated notes to them (.then()), you just say 'await' - which means 'pause this specific task until the buzzer goes off'."],
              "demos": [{ "code": "async function getLunch() {\n  console.log(\"Waiting for food...\");\n  // await pauses JUST this function, not the whole app\n  // const food = await fetch('/api/lunch'); \n  console.log(\"Got it!\");\n}", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["async/await", "try/catch"], "mistakeWatchlist": ["forgetting await"] },
            "nextLesson": "js-dom-101"
          }
        ]
      },
      {
        "id": "js-module-6",
        "title": "Module 6: DOM & Browser APIs",
        "lessons": [
          {
            "id": "js-dom-101",
            "title": "DOM, Events & Manipulation",
            "objectives": ["Select and modify HTML elements", "Listen to events like 'click' or 'submit'"],
            "prerequisites": ["js-module-1"],
            "timeEstimateMin": 40,
            "content": {
              "explanations": ["The DOM is like a puppet skeleton for your website. JavaScript is the puppeteer that pulls the strings to make elements move, change color, or disappear."],
              "demos": [{ "code": "// const btn = document.querySelector('#myButton');\n// btn.textContent = \"Don't click me!\";\n// btn.addEventListener('click', () => alert('Ouch!'));", "explainByLine": false }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["DOM selection", "event listeners"], "mistakeWatchlist": [] },
            "nextLesson": "js-storage-canvas-101"
          },
          {
            "id": "js-storage-canvas-101",
            "title": "localStorage, Forms & Canvas",
            "objectives": ["Persist data with localStorage", "Handle form inputs", "Basic drawing on Canvas"],
            "prerequisites": ["js-dom-101"],
            "timeEstimateMin": 35,
            "content": {
              "explanations": ["localStorage is like a small locker in the user's browser. You can leave things there and they'll still be there when the user comes back tomorrow."],
              "demos": [{ "code": "localStorage.setItem('theme', 'dark mode');\n// Later...\nconst savedTheme = localStorage.getItem('theme');", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["localStorage"], "mistakeWatchlist": [] },
            "nextLesson": "js-modules-tooling-101"
          }
        ]
      },
      {
        "id": "js-module-7",
        "title": "Module 7: Modules & Tooling",
        "lessons": [
          {
            "id": "js-modules-tooling-101",
            "title": "ES Modules, NPM & Bundlers",
            "objectives": ["Use import/export to structure code", "Understand role of NPM, Webpack/Vite", "Basics of linting (ESLint) and testing (Jest)"],
            "prerequisites": ["js-module-5"],
            "timeEstimateMin": 40,
            "content": {
              "explanations": ["Imagine building a whole house with just one giant blueprint. It's messy. Modules let you have separate blueprints for plumbing, electrical, etc., and 'import' them where needed."],
              "demos": [{ "code": "// mathUtils.js\nexport const add = (a,b) => a+b;\n\n// main.js\nimport { add } from './mathUtils.js';\nconsole.log(add(2,2));", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["ES modules"], "mistakeWatchlist": [] },
            "nextLesson": "js-node-fs-101"
          }
        ]
      },
      {
        "id": "js-module-8",
        "title": "Module 8: Node.js",
        "lessons": [
          {
            "id": "js-node-fs-101",
            "title": "Node Runtime & File System",
            "objectives": ["Run JS on the server", "Read/Write files with 'fs'", "Understand env variables"],
            "prerequisites": ["js-async-await-101", "js-modules-tooling-101"],
            "timeEstimateMin": 40,
            "content": {
              "explanations": ["Normally JS lives in the browser cage. Node.js lets it out of the cage to run on your actual computer or server, meaning it can finally touch files and listen to network ports directly."],
              "demos": [{ "code": "import fs from 'fs/promises';\n// Writing a real file to disk!\n// await fs.writeFile('secret_diary.txt', 'Today I learned Node.');", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["Node.js basics", "fs module"], "mistakeWatchlist": [] },
            "nextLesson": "js-node-express-101"
          },
           {
            "id": "js-node-express-101",
            "title": "HTTP & Express Basics",
            "objectives": ["Create a basic HTTP server", "Use Express for routing", "Async patterns in backend"],
            "prerequisites": ["js-node-fs-101"],
            "timeEstimateMin": 45,
            "content": {
              "explanations": ["Express is like a receptionist for your server. It looks at incoming requests (like someone asking for the home page '/'), and directs them to the right code to handle it."],
              "demos": [{ "code": "// const express = require('express');\n// const app = express();\n// app.get('/hello', (req, res) => res.send('Hi there!'));", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["Express basics"], "mistakeWatchlist": [] },
            "nextLesson": "js-security-perf-101"
          }
        ]
      },
      {
        "id": "js-module-9",
        "title": "Module 9: Security & Performance",
        "lessons": [
          {
            "id": "js-security-perf-101",
            "title": "Web Security (XSS/CSRF) & Performance",
            "objectives": ["Identify XSS and CSRF vulnerabilities", "Basic performance profiling", "Avoid memory leaks"],
            "prerequisites": ["js-module-6", "js-module-8"],
            "timeEstimateMin": 40,
            "content": {
              "explanations": ["Security rule #1: Never trust what the user types. XSS is like letting a stranger write on your restaurant's menu board—they might write something dangerous that tricks other customers."],
              "demos": [],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["basic web security"], "mistakeWatchlist": [] },
            "nextLesson": "ts-primer-101"
          }
        ]
      },
      {
        "id": "js-module-10",
        "title": "Module 10: TypeScript Primer",
        "lessons": [
          {
            "id": "ts-primer-101",
            "title": "TypeScript Basics & Migration",
            "objectives": ["Define basic types (string, number, boolean)", "Use interfaces and generics", "Understand tsconfig.json"],
            "prerequisites": ["js-module-7"],
            "timeEstimateMin": 50,
            "content": {
              "explanations": ["Standard JS is like writing a document with no spell-checker. TypeScript adds a super-powerful spell-checker that doesn't just check spelling, but checks if your code even makes sense before you try to run it."],
              "demos": [{ "code": "let age: number = 25;\n// age = \"twenty-five\"; // TypeScript yells at you here instantly!\n\ninterface Hero {\n  name: string;\n  powerLevel: number;\n}", "explainByLine": true }],
              "oralQuestions": [], "debugging": [], "exercises": [], "assessment": { "questions": [], "passCriteria": { "minCorrect": 0 } }
            },
            "memoryUpdates": { "conceptsMastered": ["TypeScript basics", "interfaces"], "mistakeWatchlist": [] },
            "nextLesson": null
          }
        ]
      }
    ]
  }
};
