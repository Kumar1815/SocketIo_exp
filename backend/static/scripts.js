const socket = io();

let username = "";
let room = "";

function setUsername() {
    username = document.getElementById("usernameInput").value.trim();
    if (username) {
        document.getElementById("joinContainer").style.display = "none";
        document.getElementById("chatRoom").style.display = "block";
    }
}

function createRoom() {
    const roomName = document.getElementById("roomName").value.trim();
    if (roomName) {
        socket.emit("create_room", { room: roomName });
    }
}

function joinRoom(selectedRoom) {
    if (username && selectedRoom) {
        room = selectedRoom;
        document.getElementById("roomTitle").innerText = `Room: ${room}`;
        socket.emit("join", { username, room });
    }
}

function leaveRoom() {
    socket.emit("leave", { username, room });
    document.getElementById("messages").innerHTML = "";
    document.getElementById("chatRoom").style.display = "none";
    document.getElementById("joinContainer").style.display = "block";
}

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("message", { username, room, message });
        messageInput.value = "";
    }
}

socket.on("message", (msg) => {
    const messagesDiv = document.getElementById("messages");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.classList.add(msg.username === username ? "sent" : "received");
    msgDiv.innerHTML = `<strong>${msg.username}:</strong> ${msg.message} <br><small>${new Date(msg.timestamp).toLocaleTimeString()}</small>`;
    messagesDiv.appendChild(msgDiv);
});

socket.on("chat_history", (history) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    history.forEach((msg) => {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.classList.add(msg.username === username ? "sent" : "received");
        msgDiv.innerHTML = `<strong>${msg.username}:</strong> ${msg.message} <br><small>${new Date(msg.timestamp).toLocaleTimeString()}</small>`;
        messagesDiv.appendChild(msgDiv);
    });
});

socket.on("room_created", (data) => {
    const roomList = document.getElementById("roomList");
    const btn = document.createElement("button");
    btn.innerText = data.room;
    btn.onclick = () => joinRoom(data.room);
    roomList.appendChild(btn);
});
