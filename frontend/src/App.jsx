import { useState, useEffect } from "react";
import socket from "./socket";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // Listen for incoming messages only once
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup function to prevent multiple listeners
    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join", { username, room });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leave", { username, room });
    setJoined(false);
    setMessages([]); // Clear messages on leave
  };

  const sendMessage = () => {
    if (message) {
      socket.emit("message", { username, room, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {!joined ? (
        <div>
          <h2>Join a Chat Room</h2>
          <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Room: {room}</h2>
          <button onClick={leaveRoom}>Leave Room</button>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
          <input type="text" placeholder="Type message..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
