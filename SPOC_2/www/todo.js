const socket = io();

// tasks array
let todos = [];

// interface elements

// initial tasks
window.onload = load_tasks();

// backend functions
function add() {
    /* añade una nueva tarea en la primera posición de la lista
    con el texto introducido en un campo input en la interfaz;
    esto será el nombre de la tarea (propiedad title). No añade
    nada si el campo está vacío. */

    
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
            var json_data = JSON.parse(textString)

            for (let i = 0; i < json_data.length; i++) {
                todos.push(json_data[i]);
            }

            console.log(todos);

        });

}

function prueba() {

    console.log(todos);
}