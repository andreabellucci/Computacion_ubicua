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

// backend functions
function add() {
    /* añade una nueva tarea en la primera posición de la lista
    con el texto introducido en un campo input en la interfaz;
    esto será el nombre de la tarea (propiedad title). No añade
    nada si el campo está vacío. */

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

function done(index) {
    // reverse the checked property
    todos[index].done = !todos[index].done;

    let data_string = JSON.stringify(todos);

    // update all the array data on the server side
    socket.emit("mod_task", data_string);

    update_task_list();
}

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

async function load_tasks() {
    /* Será necesario utilizar la función Fetch para recuperar
    el contenido del fichero de manera asíncrona. Se puede
    utilizar la sintaxis async/await o la sintaxis con promesas.
    El contenido del fichero se guardará en un Array de tareas
    en la aplicación. */

    const response = await fetch("tasks.json");
    const json_data = await response.json();

    for (let i = 0; i < json_data.length; i++) {
        todos.push(json_data[i]);
    }

    update_task_list();

}

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