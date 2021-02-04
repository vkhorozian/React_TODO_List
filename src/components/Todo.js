//import React from "react";
/*
React’s useRef hook creates an object with a single property: current.
This property can be a reference to anything we want and look that reference up later.
It’s particularly useful for referring to DOM elements.
*//*
!!! comment here !!!
*//*
useEffect() is so named because it runs after React renders a given component,
and will run any side-effects that we'd like to add to the render process,
which we can't run inside the main function body. useEffect() is useful in the current
situation because we cannot focus on an element until after the
<Todo /> component renders and React knows where our refs are
*/
import React, { useEffect, useRef, useState } from "react";



function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}



export default function Todo(props) {
    const [isEditing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');

    const editFieldRef = useRef(null);
    const editButtonRef = useRef(null);

    const wasEditing = usePrevious(isEditing); // this keep track of the Ref And useEffect when edit button is pressed

    function handleChange(e) {
        setNewName(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.editTask(props.id, newName);
        setNewName("");
        setEditing(false);
    }

    const editingTemplate = (
        <form className="stack-small" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="todo-label" htmlFor={props.id}>
                    New name for: {props.name}
                </label>
                <input
                    id={props.id}
                    className="todo-text"
                    type="text"
                    value={newName}
                    onChange={handleChange}
                    ref={editFieldRef}
                />
            </div>
            <div className="btn-group">
                <button
                    type="button"
                    className="btn todo-cancel"
                    onClick={() => setEditing(false)}
                >
                    Cancel
                    <span className="visually-hidden">renaming {props.name}</span>
                </button>
                <button type="submit" className="btn btn__primary todo-edit">
                    Save
                    <span className="visually-hidden">new name for : {props.name}</span>
                </button>
            </div>
        </form>
    );
    const viewTemplate = (
        <div className="stack-small">
            <div className="c-cb">

                <input
                    id={props.id}
                    type="checkbox"
                    defaultChecked={props.completed}
                    onChange={() => props.toggleTaskCompleted(props.id)}
                />

                <label className="todo-label" htmlFor={props.id}>
                    {props.name}
                </label>

            </div>
            <div className="btn-group">
                <button
                    type="button"
                    className="btn"
                    onClick={() => setEditing(true)}
                    ref={editButtonRef}
                >
                    Edit <span className="visually-hidden">{props.name}</span>
                </button>
                <button
                    type="button"
                    className="btn btn__danger"
                    onClick={() => props.deleteTask(props.id)}
                >
                    Delete <span className="visually-hidden">{props.name}</span>
                </button>
            </div>
        </div>
    );

/*
    useEffect(() => {
        let propsName = props.name;
        console.log(propsName);  //FIRST IN CODE, RENDER SECOND ON BROWSER
    });
    console.log("main render");  // SECOND IN CODE, RENDERS FIRST ON BROWSER
*/
    //explanation for the .focus() method... all this is so you can focus the blue box when you press on buttons to the text box
//This kind of mostly works. Head back to your browser and you’ll see that your focus moves between Edit <input> and "Edit" button as you start and end an edit. However, you may have noticed a new problem — the "Edit" button in the final <Todo /> component is focussed immediately on page load, before we even interact with the app!
// Our useEffect() hook is behaving exactly as we designed it: it runs as soon as the component renders, sees that isEditing is false, and focuses the "Edit" button. Because there are three instances of <Todo />, we see focus on the last "Edit" button.
// We need to refactor our approach so that focus changes only when isEditing changes from one value to another.
    useEffect(() => {
        if (!wasEditing && isEditing) {
            // console.log('LOG : ' + editFieldRef.current.focus());
            editFieldRef.current.focus();
        } if (wasEditing && !isEditing) {
            editButtonRef.current.focus();
        }
    }, [wasEditing, isEditing]);

    return(
        <li className="todo">{ isEditing ? editingTemplate : viewTemplate }</li>
    );
}
