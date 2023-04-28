import './App.css';
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Pusher from "pusher-js"
import { useEffect, useState } from 'react';
import axios from "./axios";

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync")
      .then(response => {
        setMessages(response.data)
      })
  }, [])

  useEffect(() => {

    var pusher = new Pusher('adf158c5d5eeb8b2202b', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessages) => {
      setMessages([...messages, newMessages]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }

  }, [messages])

  console.log(messages);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />

        <Chat messages={messages} />
      </div>

    </div>
  );
}

export default App;
