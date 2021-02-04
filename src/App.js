//import logo from './logo.svg';
//import './App.css';
//import React from "react";
import React, { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from './components/Todo';


const FILTER_MAP = {
    All: () => true,
    Active: task => !task.completed,
    Completed: task => task.completed
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

    const listHeadingRef = useRef(null);
    const [tasks, setTasks] = useState(props.tasks); // tasks is an array of objects
    const [filter, setFilter] = useState('All'); //SEE BELOW ***
    const prevTaskLength = usePrevious(tasks.length);

    // ANOTHER FUNCTION TO FOCUS BUT THIS TIME IT IS FOR THE DELETE BUTTON
    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    useEffect(() => {
        if (tasks.length - prevTaskLength === -1) {
            listHeadingRef.current.focus();
        }
    }, [tasks.length, prevTaskLength]);


    // HOW TO DELETE TASK
    function deleteTask(id) {
        const remainingTasks = tasks.filter(task => id !== task.id);
        setTasks(remainingTasks);
    }

    // HOW TO ADD TASK
    function addTask(name) { // add task name is a string
        const newTask = { id: "todo-" + nanoid(), name: name, completed: false }; // + nanoid() is how we get the concatnation of the random id
        setTasks([...tasks, newTask]);
        console.log(newTask); // prints the new task in console
    }

//Here, we define an updatedTasks constant that maps over the original tasks array.  If the task’s id property matches the id provided to the function, we use object spread syntax  to create a new object, and toggle the checked property of that object before returning it. If it doesn’t match, we return the original object.
    // HOW TO EDIT A TASK
    function editTask(id, newName) {
        const editedTaskList = tasks.map(task => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
                //
                return {...task, name: newName}
            }
            return task;
        });
        setTasks(editedTaskList);
    }

    function toggleTaskCompleted(id) {
        const updatedTask = tasks.map(task => {
            // if this task has the same ID as the edited task
            if (id === task.id){
                // use object spread to make a new object
                // whose `completed` prop has been inverted
                return { ...task, completed : !task.completed}
            }
            return task;
        });
        setTasks(updatedTask);
        console.log(updatedTask);
    }

    const filterList = FILTER_NAMES.map(name => (
        <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
        />  // FILTER BUTTON ARRAY
    ));

    // ITS DOING SOMETHING
    const taskList = tasks
        .filter(FILTER_MAP[filter]) // ***
        .map(task => (
        <Todo
            id={task.id}
            name={task.name}
            completed={task.completed}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            deleteTask={deleteTask}
            editTask={editTask}
        />
    ) // A task should only render if it is included in the results of applying the selected filter. Before we map over the tasks state, we should filter it (with Array.prototype.filter()) to eliminate objects we don't want to render.
);

    // (task => task.name or task.id this will return the task . designated attribute in reactDOM APP function in index.js
    /*also same thing as <Todo />*/

// KEEP TRACK OF # OF TASKS // THIS IS SOME GOOD STUFF FOR LOGIC AND SYNTAX //
    const taskNoun = taskList.length !== 1 ? 'tasks' : 'task';
    const headingText = `${taskList.length} ${taskNoun} remaining`;


    return (
    <div className="container">
        <div className="todoapp stack-large">
            <h1>TodoMatic</h1>
            <Form addTask={addTask} />
            <div className="filters btn-group stack-exception">
                {filterList}
            </div>
            <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
                {headingText}
            </h2>
            <ul
                //role="list"
                className="todo-list stack-large stack-exception"
                aria-labelledby="list-heading"
            >
                {taskList}
            </ul>
        </div>
    </div>
    );
}

export default App;










/*
<ul
    //role="list"
    className="todo-list stack-large stack-exception"
    aria-labelledby="list-heading"
>
    <Todo name="Eat" completed={true} id="todo-0"/>
    <Todo name="Sleep" completed={false} id="todo-1"/>
    <Todo name="Repeat" completed={false} id="todo-2"/>
</ul>
*/
