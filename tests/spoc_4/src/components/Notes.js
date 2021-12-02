import React, { useContext, useEffect } from "react";
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

    // Set up the gestures
    useEffect(() => {
        // Set up the gesture features once it's logged
        // touch control block
        let start_x = 0;
        let end_x = 0;
        let start_time = 0;
        let start_hold;
        const TIME_SLIDE_THRESHOLD = 500; // Timer for Slide action
        const SPACE_THRESHOLD = 100;

        let taskListContainer = document.getElementById('task_list');

        taskListContainer.addEventListener("touchstart", function (e) {
            e.preventDefault();
            start_x = e.targetTouches[0].screenX;
            start_time = e.timeStamp;

            // if you keep your finger at the task, it will be erased two seconds after
            start_hold = setTimeout(function () {
                var target_task = e.changedTouches[0];
                // extract the index of the selected task
                var task_index = target_task.target.id.match(/\d+/)[0];
                doneTask(task_index);
            }, 2000);

        }, { passive: false });

        taskListContainer.addEventListener("touchmove", function (e) {
            e.preventDefault();
            end_x = e.changedTouches[0].screenX;
        }, { passive: false });

        taskListContainer.addEventListener("touchend", function (e) {

            // clear the timeout that activates hold action
            clearTimeout(start_hold);

            e.preventDefault();
            let end_time = e.timeStamp;

            // If this sentence is true, that means you've performed a SLIDE action
            if (end_time - start_time < TIME_SLIDE_THRESHOLD && end_x - start_x > SPACE_THRESHOLD) {
                var target_task = e.changedTouches[0];
                // extract the index of the selected task
                var task_index = target_task.target.id.match(/\d+/)[0];
                removeTask(task_index);
            }
        });
    }, []);


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
        set(ref(props.db, props.listarda[index].reference), {
            title: taskList[index].title,
            completed: !taskList[index].completed
        })
            .then(() => {
                console.log("COMPLETED TASK WITH INDEX: " + index);
                let auxTasks = [...taskList];
                auxTasks[index].completed = !auxTasks[index].completed;
                setTaskList(auxTasks);
            })
            .catch((error) => {
                // The write failed...
            });
    }

    // remove a single task
    function removeTask(index) {
        set(ref(props.db, props.listarda[index].reference), null)
            .then(() => {
                console.log("REMOVED TASK WITH INDEX: " + index);

                let auxTasks = [...taskList];
                auxTasks.splice(index, 1);
                setTaskList(auxTasks);
            })
            .catch((error) => {
                // The write failed...
            });
    }

    return (
        <div id="app_container">
            <h1>{userName}'s Notes</h1>

            <div id="search_div">
                <input type="text" id="search_filter" onInput={handleOnInputFilter} onKeyUp={filter} placeholder="search filter" />
            </div>

            <div id="task_list">
                {taskList.map((el, i) => {
                    if (el.completed) {
                        return (<div className='single_task_container' id={"task_n_" + i} key={i}>
                            <input type='checkbox' checked={true} readOnly className='task_check' id={"task_completed_n_" + i} />
                            <p id={"task_text_n_" + i} className='completed_p'>{el.title}</p>
                        </div>);
                    } else {
                        return (<div className='single_task_container' id={"task_n_" + i} key={i}>
                            <input type='checkbox' checked={false} readOnly className='task_check' id={"task_completed_n_" + i} />
                            <p id={"task_text_n_" + i} >{el.title}</p>
                        </div>);
                    }
                })}
            </div>

            <div id="input_div">
                <input onInput={handleOnInputNewNote} type="text" id="input_task" placeholder="new task"></input>
                <button onClick={handleAddTask} id="add_button">add task</button>
            </div>
        </div>
    );
}