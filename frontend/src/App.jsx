import { useState, useEffect } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    socket.on("room_created", (data) => {
      setRooms((prev) => [...prev, data.room]);
    });

    return () => {
      socket.off("message");
      socket.off("chat_history");
      socket.off("room_created");
    };
  }, []);

  const createRoom = () => {
    if (room) {
      socket.emit("create_room", { room });
    }
  };

  const joinRoom = (selectedRoom) => {
    if (username && selectedRoom) {
      setRoom(selectedRoom);
      socket.emit("join", { username, room: selectedRoom });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leave", { username, room });
    setJoined(false);
    setMessages([]);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { username, room, message });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Rooms</h2>
        <div className="create-room">
          <input 
            type="text" 
            placeholder="New Room Name" 
            onChange={(e) => setRoom(e.target.value)} 
          />
          <button onClick={createRoom}>Create</button>
        </div>
        <div className="join-room">
          <h3>Join a Room</h3>
          {rooms.map((r, i) => (
            <button key={i} onClick={() => joinRoom(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        {!joined ? (
          <div className="join-container">
            <h2>Enter Your Name</h2>
            <input 
              type="text" 
              placeholder="Username" 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
        ) : (
          <div className="chat-room">
            <h2>Room: {room}</h2>
            <button className="leave-btn" onClick={leaveRoom}>Leave Room</button>
            
            <div className="chat-box">
              {messages.map((msg, i) => (
                msg.type === "system" ? (
                  <div key={i} className="system-message">{msg.message}</div>
                ) : (
                  <div key={i} className={`message ${msg.username === username ? "sent" : "received"}`}>
                    <span className="username">{msg.username}</span>
                    <br />
                    <span className="text">{msg.message}</span>
                    <br />
                    <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                )
              ))}
            </div>

            {/* Input Section */}
            <div className="input-container">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
