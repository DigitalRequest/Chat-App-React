import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';

import { useState, useEffect } from 'react';

function Message(props) {
  const isCurrentUser = props.name === props.currentUser?.displayName;
  const alignValue = isCurrentUser ? 'right' : 'left';

  return (
    <section className={`card container p-3 m-0 has-background-grey-lighter align-${alignValue}`}>
      <label className="label">{props.message}</label>
      <section className="container">
        <label className="label is-small">{props.timeStamp} - {props.username}</label>
      </section>
    </section>
  );
}

async function getMessages() {
  const messagesCollection = collection(db, 'message');

  try {
    const querySnapshot = await getDocs(messagesCollection);

    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting documents: ', error);

    return [];
  }
}

function App({ user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const messagesData = await getMessages();
      setMessages(messagesData);
    }

    fetchMessages();
  }, []);

  console.log(messages);

  return (
    <>
      {messages.map((message, index) => (
        <Message
          key={index}
          message={message.message}
          timeStamp={message.timestamp}
          username={message.name}
          currentUser={user}
        />
      ))}
    </>
  )
}

export default App
