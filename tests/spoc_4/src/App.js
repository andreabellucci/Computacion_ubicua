import "./App.css";
import { useEffect, useRef, useState } from "react";
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


// COMPONENTS
import { Context } from "./components/Context";
import Notes from "./components/Notes";

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
  const [taskList, setTaskList] = useState([]);
  const uid = useRef(null);
  const inputRef = useRef("");
  const inputFilter = useRef("");



  useEffect(() => {
    if (isLoggedIn) {
      const tasksRef = ref(db, "tasks/" + uid.current);
      onChildAdded(tasksRef, (data) => {
        let newAddedTask = {
          title: data.val().title,
          reference: data.ref._path.pieces_[0] + "/" + data.ref._path.pieces_[1] + "/" + data.ref._path.pieces_[2],
          completed: data.val().completed
        };
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



  return (
    <div className="App">
      <Context.Provider value={{
        value1: [isLoggedIn, setLoggedIn],
        value2: [userName, setUserName],
        value3: [taskList, setTaskList],
        value4: inputRef,
        value5: inputFilter
      }}>
        {isLoggedIn &&
          <Notes db={db} uid={uid} listarda={taskList} />
        }
      </Context.Provider>

      {
        !isLoggedIn && (
          <div id='login_container'>
            <h1>Welcome to: <br />My Notes!</h1>
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
