const socket = io();

// tasks array
let todos = [];

// interface elements
let task_list = document.getElementById('task_list');
let input_task = document.getElementById('input_task');
let add_button = document.getElementById('add_button');
let search_filter = document.getElementById('search_filter');

// initial tasks
window.onload = load_tasks();

// BACKEND FUNCTIONS
// add new tasks
function add() {

    if (input_task.value != "") {
        let new_task = {
            id: 1,
            title: input_task.value,
            done: false
        }

        todos.unshift(new_task);

        for (let i = 1; i < todos.length; i++) {
            todos[i].id = i + 1;
        }

        let data_string = JSON.stringify(todos);

        // update all the array data on the server side
        socket.emit("mod_task", data_string);

        update_task_list();

        input_task.value = ""; // clean the input data
    }

}

// remove a single task
function remove(index) {
    todos.splice(index, 1);

    for (let i = 0; i < todos.length; i++) {
        todos[i].id = i + 1;
    }

    let data_string = JSON.stringify(todos);

    // update all the array data on the server side
    socket.emit("mod_task", data_string);

    update_task_list();
}

// mark some task as done
function done(index) {
    // reverse the checked property
    todos[index].done = !todos[index].done;

    let data_string = JSON.stringify(todos);

    // update all the array data on the server side
    socket.emit("mod_task", data_string);

    update_task_list();
}

// filter the tasks 
function filter() {

    let filter = search_filter.value.toUpperCase();
    let p = document.getElementsByTagName('p');

    if (filter == "") {
        for (let i = 0; i < p.length; i++) {
            var id = 'task_n_' + i;
            var div_to_show = document.getElementById(id);
            div_to_show.style.display = "";
        }
    }

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

// load server storaged tasks
async function load_tasks() {

    const response = await fetch("tasks.json");
    const json_data = await response.json();

    for (let i = 0; i < json_data.length; i++) {
        todos.push(json_data[i]);
    }

    update_task_list();

}

// auxiliar function that finally prints the list on the page
function update_task_list() {
    let completed_task = "checked";
    let html_complete_tasks_list = ""

    for (let i = 0; i < todos.length; i++) {
        let html_to_append = "";
        if (todos[i].done) {
            html_to_append = "<div class='single_task_container' id='task_n_" + i + "' ondblclick='remove(" + i + ")'>"
                + "<input type='checkbox' " + completed_task + " id='task_completed_n_" + i + "' onclick='done(" + i + ")'>"
                + "<p id='task_text_n_" + i + "'>" + todos[i].title + "</p>"
                + "</div>";
        } else {
            html_to_append = "<div class='single_task_container' id='task_n_" + i + "' ondblclick='remove(" + i + ")'>"
                + "<input type='checkbox' id='task_completed_n_" + i + "' onclick='done(" + i + ")'>"
                + "<p id='task_text_n_" + i + "'>" + todos[i].title + "</p>"
                + "</div>";
        }

        html_complete_tasks_list += html_to_append;
    }

    // adds the events to the task list finally
    task_list.innerHTML = html_complete_tasks_list;
}


// bloque para el uso de controles táctiles

// let start_x = 0;
// let end_x = 0;
// let start_time = 0;
// const TIME_THRESHOLD = 200;
// const SPAEC_THRESHOLD = 200;

// document.addEventListener("touchstart", function (e) {
//     e.preventDefault();
//     start_x = e.targetTouches[0].screenX;
//     start_time = e.timeStamp;
// }, { passive: false });

// document.addEventListener("touchmove", function (e) {
//     e.preventDefault();
//     end_x = e.changedTouches[0].screenX;
// }, { passive: false });

// document.addEventListener("touchend", function (e) {
//     e.preventDefault();
//     end_time = e.timeStamp;
//     if (end_time - start_time < TIME_THRESHOLD && end_x - start_x > SPACE_THRESHOLD) {
//         alert("test");
//     }
// });