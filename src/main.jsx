import { db, auth, provider } from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

let user = null;

function updateMessages() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

function signUp() {
  signInWithPopup(auth, provider).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
}

async function pushValueToDB() {
  let input = document.getElementById('input-send-message');
  if (input.value != "") {
    const date = new Date();
    const hour = date.getHours().toLocaleString();
    const minute = date.getMinutes().toLocaleString();

    const docRef = await addDoc(collection(db, 'message'), {
      message: input.value,
      name: user.displayName,
      timestamp: `${hour}:${minute}`
    });

    input.value = "";

    updateMessages();
  }
}

document.getElementById('btn-send-message').addEventListener('click', () => {
  pushValueToDB();
});

onAuthStateChanged(auth, (authUser) => {
  user = authUser;

  if (authUser) {
    ReactDOM.createRoot(document.getElementById('nav-buttons')).render(
      <React.StrictMode>
        <button className='button is-danger' onClick={() => signOut(auth)}>Log Out</button>
      </React.StrictMode>,
    );

    document.getElementById('input-sect').childNodes.forEach(node => {
      if (node.nodeType === 1) {
        node.removeAttribute('disabled');
      }
    });
  } else {
    ReactDOM.createRoot(document.getElementById('nav-buttons')).render(
      <React.StrictMode>
        <a className="button is-primary" onClick={signUp}>
          <strong>Sign up</strong>
        </a>
        <a className="button is-light">
          Log in
        </a>
      </React.StrictMode>,
    );

    document.getElementById('input-sect').childNodes.forEach(node => {
      if (node.nodeType === 1) {
        node.setAttribute('disabled', 'disabled');
      }
    });
  }
});

updateMessages();