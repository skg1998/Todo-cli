const fs = require('fs');
const readline = require('readline');
const command = process.argv[2];
const argument = process.argv[3];

const commands = {};

commands.init = () => {
    fs.writeFileSync("todo.txt", "", {flag: "a+"});
    fs.writeFileSync("done.txt", "", {flag: "a+"});
}

//Add todo
/**
* @param  todo
* @return  Added todo: "{todo}"
* @error  "Error: Missing todo string. Nothing added!"
* @example ./todo add "the thing i need to do"
*/
commands.add = (todo) => {
    if(!todo){
        console.log(`"Error: Missing todo string. Nothing added!"`);
        return 
    }

    let filedata = fs.readFileSync('todo.txt');
    fs.writeFile('todo.txt', (filedata!="" ? `${todo}\n${filedata}` : todo), (err) => {
        if (err) throw err;
        console.log(`Added todo: "${todo}"`);
    })
}

//List of todo
/**
* @param 
* @return [1] water the plants
* @return list when there are no remaining todos error "There are no pending todos!"
* @example ./todo ls
*/
commands.ls = () =>{
    let data = fs.readFileSync('todo.txt', 'utf8').toString();
    if(!data){
        console.log(`"There are no pending todos!"`);
        return;
    }
    let lines = data.split("\n").reverse();
    for(let i=lines.length; i>0; i--){
        console.log(`[${i}] ${lines[i-1]}`);  
    }
}

//Delete todo
/**
* @param index
* @return  Deleted todo #3
* @returnerror Error: todo #5 does not exist. Nothing deleted.
* @return "Error: Missing NUMBER for deleting todo."
* @example ./todo del NUMBER
*/
commands.del = async (index) =>{
    if(!index){
        console.log("Error: Missing NUMBER for deleting todo.");
        return 
    }

    let filedata = fs.readFileSync('todo.txt').toString();
    let lines = filedata.split("\n").reverse();
    if(index > lines.length || index < 1 || filedata==""){
        console.log(`Error: todo #${index} does not exist. Nothing deleted.`);
        return;
    }

    let finalData = [];
    for(let i=lines.length; i>0; i--){
        if(index != i){
            finalData.push(lines[i-1])
        }
    }
    fs.writeFile('todo.txt', finalData.reverse().join("\n"), (err) => {
        if (err) throw err;
        console.log(`Deleted todo #${index}`);
    })
}

//Done todo
/**
* @param  index 
* @return  Marked todo #1 as done.
* @returnerror mark as done a todo which does not exist show "Error: todo #0 does not exist."
* @example ./todo done NUMBER 
*/
commands.done = async (index) =>{

    if(!index){
        console.log("Error: Missing NUMBER for marking todo as done.");
        return 
    }

    let filedata = fs.readFileSync('todo.txt').toString();
    let lines = filedata.split("\n").reverse();
    if(index > lines.length || index < 1 || filedata==""){
        console.log(`Error: todo #${index} does not exist.`);
        return;
    }

    let doneFiledata = fs.readFileSync('done.txt').toString();
    let completedData = [];
    if(doneFiledata != ""){
        completedData = doneFiledata.split("\n")
    }

    let finalData = [];
    for(let i=lines.length; i>0; i--){
        if(index != i){
            finalData.push(lines[i-1])
        }else{
            completedData.push(`x ${dateFormat()} ${lines[i-1]}`);
        }
    }
    fs.writeFile('todo.txt', finalData.reverse().join("\n"), (err) => {
        if (err) throw err;
        console.log(`Marked todo #${index} as done.`);
    })

    fs.writeFile('done.txt', completedData.join("\n"), (err) => {
        if (err) throw err;
    })
}

//Help todo
/**
* @param  
* @return list of command 
* @example ./todo help
*/
commands.help = () =>{
console.log(`
Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics
`);
}

//read-Todo-line
const readTodoLine = async () =>{
    return new Promise((resolve, reject) => {
        var Todofile = './todo.txt';
        var todoCount = 0;
        var rl = readline.createInterface({
            input: fs.createReadStream(Todofile),
            output: process.stdout,
            terminal: false
        });
        rl.on('line', function (line) {
            todoCount++; 
        });
        rl.on('close', function() {
            resolve(todoCount); 
        });
    });
}

//read-completed-todo-line
const readCompletedTodoLine = async () =>{
    return new Promise((resolve, reject) => {
        var completeTodoFile = './done.txt';
        var todoCount = 0;
        var rl = readline.createInterface({
            input: fs.createReadStream(completeTodoFile),
            output: process.stdout,
            terminal: false
        }); 
        rl.on('line', function (line) {
            todoCount++; 
        });
        rl.on('close', function() {
            resolve(todoCount); 
        });
    });
}

//simple date-format 
const dateFormat = () =>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    today = yyyy+"-"+mm+"-"+dd;
    return today
}

//Report todo
/**
* @param
* @return  dd/mm/yyyy Pending : 1 Completed : 4
* @example ./todo report
*/
commands.report = async () => {
    let filedata = fs.readFileSync('todo.txt').toString();
    let todoList = filedata.split("\n").reverse();

    let doneFiledata = fs.readFileSync('done.txt').toString();
    let completedData = doneFiledata.split("\n");

    console.log(`"${dateFormat()} Pending : ${todoList.length} Completed : ${completedData.length}"`)
}

//init the app
commands.init();

//command Manager
switch(command){
    case "add":
        commands.add(argument);
        break;
    case "ls":
        commands.ls();
        break;
    case "del":
        commands.del(argument);
        break;
    case "done":
        commands.done(argument);
        break;
    case "help":
        commands.help();
        break;
    case "report":
        commands.report();
        break; 
    default :
        commands.help();
        break;                   
}