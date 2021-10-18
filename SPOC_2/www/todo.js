const socket = io();

// tasks array
let todos = [];

// interface elements
let task_list = document.getElementById('task_list');
let input_task = document.getElementById('input_task');
let add_button = document.getElementById('add_button');

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

        // aquí se supone que irá la parte que escribe toda la movida

        input_task.value = ""; // clean the input data
    }

}

function remove() { }

function done() { }

function filter() { }

function load_tasks() {
    /* Será necesario utilizar la función Fetch para recuperar
    el contenido del fichero de manera asíncrona. Se puede
    utilizar la sintaxis async/await o la sintaxis con promesas.
    El contenido del fichero se guardará en un Array de tareas
    en la aplicación. */

    fetch('tasks.json')
        .then(response => response.text())
        .then(textString => {
            let json_data = JSON.parse(textString)

            for (let i = 0; i < json_data.length; i++) {
                todos.push(json_data[i]);
            }

            console.log(todos);

        });

    let completed_task = "checked";

    for (let i = 0; i < todos.length; i++) {
        let html_to_append = "<div class='single_task_container' id='task_n_" + i + "'>"
            + "<input type='checkbox' " + todos[i].done ? completed_task : "" + " id='task_completed_n_" + i + "'>"
            + "<p id='task_text_n_" + i + "'>" + todos[i].title + "</p>"
        + "</div>';"

        task_list.append(html_to_append);
    }

    // socket.emit("fetch_tasks");

}