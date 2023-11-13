from flask import *
from model.jwt_token import *
from model.rds_pool import *
from model.query_make import *

cnxpool=connect_to_pool()
member_system = Blueprint("member_system", __name__)

@member_system.route("/api/user", methods=["POST"])
def register():
	try:
		data=request.get_json()
		source = found_user(data)
		if source:
			return {
			"error": True,
			"message": "註冊失敗，重複註冊的Email或其他原因"
			}, 400
		else:
			register(data)
			return {
				"ok": True
			}, 200
	except:
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	
@member_system.route("/api/user/auth", methods=["GET"])
def userLogin():
	try:
		decoded_token=decode_jwt()
		if decoded_token:
			return {
				"data":{
					'id':decoded_token["id"],
					'name':decoded_token['username'],
					'email':decoded_token['email']
				}
			}
	except:
		return {
				"data":None
			}

@member_system.route("/api/user/auth", methods=["PUT"])
def login():
	try:
		data=request.get_json()
		source = get_user_info(data)
		if source:
			return {
				"token": jwt_make(source['id'],source['username'],source['email'])
			}
		else:
			return {
				"error": True,
				"message": "登入失敗，帳號或密碼錯誤或其他原因"
			}
	except:
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500