import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import {
  getDatabase,
  ref,
  set,
  get,
  push,
  onChildAdded
} from "firebase/database";
import { useEffect, useRef, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDmB7ONbSbGj0H86NSrx9ddXXkDcIpFKlg",
  authDomain: "prueba-ubicomp-21-22-52357.firebaseapp.com",
  projectId: "prueba-ubicomp-21-22-52357",
  storageBucket: "prueba-ubicomp-21-22-52357.appspot.com",
  messagingSenderId: "462883885047",
  appId: "1:462883885047:web:5994a3b3d49563f91da8f2",
  databaseURL:
    "https://prueba-ubicomp-21-22-52357-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const uid = useRef(null);
  const inputRef = useRef("");
  const inputFilter = useRef("");

  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      const tasksRef = ref(db, "tasks/" + uid.current);
      onChildAdded(tasksRef, (data) => {
        let newAddedTask = {
          title: data.val().title,
          reference: data.ref._path.pieces_[0] + "/" + data.ref._path.pieces_[1] + "/" + data.ref._path.pieces_[2],
          completed: data.val().completed
        };
        console.log(data.val());
        setTaskList((oldList) => [...oldList, newAddedTask]);
      });
    }
  }, [isLoggedIn]);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      uid.current = user.uid;

      const userRef = ref(db, `/users/${user.uid}`);
      const snapshot = await get(userRef);

      const data = snapshot.val();

      if (data) {
        console.log(data);
      } else {
        await set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email
        });
      }
      setLoggedIn(true);
      setUserName(user.displayName);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  function handleOnInputNewNote(e) {
    inputRef.current = e.target.value;
  }

  function handleOnInputFilter(e) {
    inputFilter.current = e.target.value;
  }

  function handleAddTask() {
    const taskListRef = ref(db, "tasks/" + uid.current);
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
    console.log(index);
    set(ref(db, taskList[index].reference), {
      title: taskList[index].title,
      completed: true
    })
      .then(() => {
        console.log("Borrado!!!");
      })
      .catch((error) => {
        // The write failed...
      });

  }


  // remove a single task
  function removeTask(index) {
    set(ref(db, taskList[index].reference), null)
      .then(() => {
        console.log("Borrado!!!");
      })
      .catch((error) => {
        // The write failed...
      });
  }

  return (
    <div className="App">
      {isLoggedIn && (
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
      )
      }

      {
        !isLoggedIn && (
          <div id='login_container'>
            <h1>Welcome to:<br />My Notes!</h1>
            <div id='login_button'>
              <img src='https://cdn.pixabay.com/photo/2015/12/11/11/43/google-1088003_960_720.png' />
              <button onClick={signInWithGoogle}>Sign-in with Google</button>
            </div>
          </div>
        )
      }
    </div >
  );
}
