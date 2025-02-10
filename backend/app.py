from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Handle client connection
@socketio.on('connect')
def handle_connect():
    print("A user connected.")

# Handle joining a room
@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(f"{username} has joined the room {room}", to=room)
    print(f"{username} joined room {room}")

# Handle messages
@socketio.on('message')
def handle_message(data):
    room = data['room']
    msg = f"{data['username']}: {data['message']}"
    send(msg, to=room)

# Handle leaving a room
@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(f"{username} has left the room {room}", to=room)
    print(f"{username} left room {room}")

if __name__ == '__main__':
    socketio.run(app, debug=True)
