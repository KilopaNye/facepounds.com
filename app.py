from flask import *
from dotenv import *
from api.product import product_system
from api.index import index_system
from api.upload import upload_system
from api.member import member_system
from api.ready_check import ready_check_system
from api.trade import trade_system
from api.ready_trade import ready_trade_system
from api.trade_finish_room import trade_finish_system
from api.self_page import self_page_system
from api.user_auth_page import user_auth_page_system
from api.trade_history import trade_history_system
from model.query_make import *
from flask_socketio import SocketIO,join_room,leave_room
from flask_cors import CORS


load_dotenv()
app = Flask(__name__, static_folder="public", static_url_path="/")
app.secret_key = "WGXaTKE7JR9MzzykHVp1O8ix7cnkx5eOb400I5gPxXJI3I8saAUWZjDLxs6056M"
wsgi_app = app.wsgi_app
CORS(app)
socketio = SocketIO(app)
# ,path='/mysocket',cors_allowed_origins="*"


# ,cors_allowed_origins='*',ping_interval=20, ping_timeout=60
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.register_blueprint(index_system)
app.register_blueprint(product_system)
app.register_blueprint(upload_system)
app.register_blueprint(member_system)
app.register_blueprint(ready_check_system)
app.register_blueprint(trade_system)
app.register_blueprint(ready_trade_system)
app.register_blueprint(trade_finish_system)
app.register_blueprint(self_page_system)
app.register_blueprint(user_auth_page_system)
app.register_blueprint(trade_history_system)

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/product/<productId>")
def product(productId):
	return render_template("product.html")

@app.route("/trade/<order_uuid>")
def trade(order_uuid):
	return render_template("trade.html")

@app.route("/upload")
def upload():
	return render_template("upload.html")

@app.route("/ready_check")
def ready_check():
	return render_template("ready_check.html")

@app.route("/ready_trade")
def ready_trade():
	return render_template("ready_trade.html")

@app.route("/member_page")
def member_page():
	return render_template("member_page.html")

@app.route("/trade_finish_room/<order_uuid>")
def talk(order_uuid):
	return render_template("trade_finish_room.html")

@app.route("/self_page")
def self_page():
	return render_template("self_page.html")

@app.route("/trade-history")
def trade_history():
	return render_template("trade_history.html")

@app.route("/user-auth-page")
def user_auth_page():
	return render_template("user_auth_page.html")








@socketio.on('connect')
def test_connect():
	print("連線了˙")
	try:
		socketio.emit('connect_response', {'message': '成功加入聊天室'})
	except Exception as err:
		print(err)
		

@socketio.on('getmessage')
def test_connect():
	print("連線了˙")
	try:
		socketio.emit('getmessage_response', {'message': '成功加入聊天室'})
	except Exception as err:
		print(err)

@socketio.on('disconnect')
def test_disconnect():
	print("斷線˙")
	try:
		room = session.pop('room', None)
		leave_room(room)
		socketio.emit('response', {'data': 'Connectesd'})
	except Exception as err:
		print(err) 

@socketio.on('message')
def handle_message(message):
	print("使用者說",message)
	socketio.emit('message-response', {'data': 'Connected'})

@socketio.on('send_message_to_room')
def handle_send_message_to_room(data):
	decoded_token = jwt.decode(
            data['token'],
            key="7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0",
            algorithms="HS256",
        )
	if decoded_token["id"]:
		username = decoded_token["username"]
		user_id = decoded_token["id"]
		timeNow = data["time"]
		room = data['room']
		message = data['message']
		socketio.emit('sendMessageResponse', {'message': message,'username':username}, room=room)
		upload_message(user_id, room, message, timeNow)

@socketio.on('join')
def on_join(info):
	decoded_token = jwt.decode(
            info['token'],
            key="7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0",
            algorithms="HS256",
        )
	if decoded_token["id"]:
		room = info['room']
		join_room(room)
		session['room'] = room
		user = decoded_token["username"]
		# username = get_username(userId)
		print("會員- "+decoded_token["username"],"連到房間囉")
		socketio.emit('join_room_announcement', {'user': user, 'room': room, }, room=room, include_self=False)

@socketio.on('leave')
def on_leave(data):
	print("已離開房間")
	username = data['username']
	room = data['room']
	leave_room(room)
	socketio.emit('leave_room_announcement', {'user': username, 'room': room}, room=room)

@socketio.on('stage_check')
def stage_check(state):
	room=state['room']
	index=state['index']
	socketio.emit('stage_response', {'index': index},room=room)

@socketio.on('stage_change')
def stage_change(state):
	room=state['room']
	index=state['index']
	socketio.emit('stage_change_response', {'index': index},room=room)

@socketio.on('info_change')
def info_change(state):
	room=state['room']
	index=state['index']
	message=state['message']
	socketio.emit('info_change_response', {'message':message,'index': index},room=room)
	res = {
	}
	if index == "amount":
		res["amount"]=state['message']
	elif index =="price":
		res["price"]=state['message']
	elif index =="site":
		res["site"]=state['message']
	elif index =="time":
		res["time"]=state['message']
	print(res)
	change_pre_order_info(room,res)

@socketio.on('peer_invite_message')
def peer_invite_message(data):
	room=data['roomId']
	socketio.emit("invite-response", {'identity':data['identity']}, room=room)

@socketio.on('order-ok')
def peer_invite(data):
	room=data['room']
	socketio.emit("order-ok-response", room=room, include_self=False)

@socketio.on('order-state-ok')
def invite_message(data):
	room=data['room']
	socketio.emit("order-state-ok-response", room=room, include_self=False)

@socketio.on('join-room')
def room_connect(data):
	print(data['id'])
	room=data['ROOM_ID']
	socketio.emit("join-response", {'message':"user-connect","userId":data['id']}, room=room, include_self=False)
    
if __name__ == '__main__':
    socketio.run(app,host="0.0.0.0",port=3000, debug=True)