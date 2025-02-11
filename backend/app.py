from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Store messages and rooms
rooms = {}

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("connect")
def handle_connect():
    print("A user connected.")

@socketio.on("create_room")
def create_room(data):
    room = data["room"]
    if room not in rooms:
        rooms[room] = []  # Initialize chat history for the room
        emit("room_created", {"room": room}, broadcast=True)  # Broadcast to all clients
        update_room_list()  # Update the room list for all clients

@socketio.on("join")
def handle_join(data):
    username = data["username"]
    room = data["room"]
    
    if room not in rooms:
        rooms[room] = []  # If the room doesn't exist, create it

    join_room(room)
    
    # Send existing messages in the room to the user who joined
    emit("chat_history", rooms[room], to=request.sid)
    
    message = {"username": "System", "message": f"{username} has joined the room!", "timestamp": datetime.now().isoformat()}
    rooms[room].append(message)
    send(message, to=room)
    update_room_list()  # Update the room list when a user joins
    print(f"{username} joined room {room}")

@socketio.on("message")
def handle_message(data):
    room = data["room"]
    msg = {
        "username": data["username"],
        "message": data["message"],
        "timestamp": datetime.now().isoformat()
    }
    rooms[room].append(msg)  # Store message in room history
    send(msg, to=room)

@socketio.on("leave")
def handle_leave(data):
    username = data["username"]
    room = data["room"]
    leave_room(room)

    message = {"username": "System", "message": f"{username} has left the room.", "timestamp": datetime.now().isoformat()}
    rooms[room].append(message)
    send(message, to=room)
    update_room_list()  # Update the room list when a user leaves
    print(f"{username} left room {room}")

def update_room_list():
    emit("update_rooms", {"rooms": list(rooms.keys())}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)