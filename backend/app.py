from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from datetime import datetime
from pyngrok import ngrok  # Import Ngrok

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Store messages and rooms
rooms = {}

# Start Ngrok to expose the app publicly
ngrok.set_auth_token("2sqNNUoPtmbEGJVorBJ1WMh4M4T_6p59EEFMbJ5JG2V4WsZWc")
public_url = ngrok.connect(5000).public_url
print(f"🔥 Public URL: {public_url}")  # Print the public URL

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
        rooms[room] = []  
        emit("room_created", {"room": room}, broadcast=True)  
        update_room_list()  

@socketio.on("join")
def handle_join(data):
    username = data["username"]
    room = data["room"]
    
    if room not in rooms:
        rooms[room] = []  

    join_room(room)
    
    emit("chat_history", rooms[room], to=request.sid)
    
    message = {"username": "System", "message": f"{username} has joined the room!", "timestamp": datetime.now().isoformat()}
    rooms[room].append(message)
    send(message, to=room)
    update_room_list()  
    print(f"{username} joined room {room}")

@socketio.on("message")
def handle_message(data):
    room = data["room"]
    msg = {
        "username": data["username"],
        "message": data["message"],
        "timestamp": datetime.now().isoformat()
    }
    rooms[room].append(msg)  
    send(msg, to=room)

@socketio.on("leave")
def handle_leave(data):
    username = data["username"]
    room = data["room"]
    leave_room(room)

    message = {"username": "System", "message": f"{username} has left the room.", "timestamp": datetime.now().isoformat()}
    rooms[room].append(message)
    send(message, to=room)
    update_room_list()  
    print(f"{username} left room {room}")

def update_room_list():
    emit("update_rooms", {"rooms": list(rooms.keys())}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)
