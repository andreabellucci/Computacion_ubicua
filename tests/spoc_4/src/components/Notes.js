import React, { useContext } from "react";
import {
    getDatabase,
    ref,
    set,
    get,
    push,
    onChildAdded
  } from "firebase/database";

import { Context } from "./Context";

export default function Notes(props) {

    const { value1, value2, value3, value4, value5 } = useContext(Context);
    const [isLoggedIn, setLoggedIn] = value1;
    const [userName, setUserName] = value2;
    const [taskList, setTaskList] = value3;
    const inputRef = value4;
    const inputFilter = value5;

    function handleOnInputNewNote(e) {
        inputRef.current = e.target.value;
    }

    function handleOnInputFilter(e) {
        inputFilter.current = e.target.value;
    }

    function handleAddTask() {
        const taskListRef = ref(props.db, "tasks/" + props.uid.current);
        const newTaskRef = push(taskListRef, {
            title: inputRef.current,
            completed: false
        });
    }

    function filter() {

        let filter = inputFilter.current.toUpperCase();
        let p = document.getElementsByTagName('p');

        if (filter == "") {
            for (let i = 0; i < p.length; i++) {
                var id = 'task_n_' + i;
                var div_to_show = document.getElementById(id);
                div_to_show.style.display = "";
            }
        } else {
            for (let i = 0; i < p.length; i++) {

                var id = 'task_n_' + i;
                var div_to_show = document.getElementById(id);

                if (p[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    div_to_show.style.display = "";
                } else {
                    div_to_show.style.display = "none";
                }
            }
        }
    }

    // mark some task as done
    function doneTask(index) {
        set(ref(props.db, taskList[index].reference), {
            title: taskList[index].title,
            completed: !taskList[index].title
        })
            .then(() => {
                console.log("COMPLETED TASK WITH INDEX: " + index);
                setTaskList((oldList) => {
                    let newList = oldList;
                    newList[index].completed = !newList[index].completed;

                    return newList
                });
            })
            .catch((error) => {
                // The write failed...
            });
    }

    // remove a single task
    function removeTask(index) {
        set(ref(props.db, taskList[index].reference), null)
            .then(() => {
                console.log("REMOVED TASK WITH INDEX: " + index);
            })
            .catch((error) => {
                // The write failed...
            });
    }

    return (
        <div>
            {isLoggedIn &&
                <div id="app_container">
                    <h1>{userName}'s Notes</h1>

                    <div id="search_div">
                        <input type="text" id="search_filter" onInput={handleOnInputFilter} onKeyUp={filter} placeholder="search filter" />
                    </div>

                    <div id="task_list">
                        {taskList.map((el, i) => {
                            if (el.completed) {
                                return (<div className='single_task_container' id={"task_n_" + i} key={i}>
                                    <input type='checkbox' checked className='task_check' id={"task_completed_n_" + i} />
                                    <p id={"task_text_n_" + i} className='completed_p'>{el.title}</p>
                                    <button onClick={() => doneTask(i)}>done</button>
                                    <button onClick={() => removeTask(i)}>delete</button>
                                </div>);
                            } else {
                                return (<div className='single_task_container' id={"task_n_" + i} key={i}>
                                    <input type='checkbox' className='task_check' id={"task_completed_n_" + i} />
                                    <p id={"task_text_n_" + i} >{el.title}</p>
                                    <button onClick={() => doneTask(i)}>done</button>
                                    <button onClick={() => removeTask(i)}>delete</button>
                                </div>);
                            }
                        })}
                    </div>

                    <div id="input_div">
                        <input onInput={handleOnInputNewNote} type="text" id="input_task" placeholder="new task"></input>
                        <button onClick={handleAddTask} id="add_button">add task</button>
                    </div>

                </div>
            }
        </div>
    );
}