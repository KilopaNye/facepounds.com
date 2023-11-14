from flask import *
from datetime import *
import jwt
from model.service_connect.rds_pool import *

cnxpool=connect_to_pool()

def jwt_make(id,member_id,email):
	payload = {
		'exp': datetime.now() + timedelta(minutes=10080),
		'username' : member_id,
		'email': email,
		'id':id
	}
	key = '7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0'
	encoded_jwt = jwt.encode(payload, key, algorithm='HS256')
	return encoded_jwt

def decode_jwt():
	data = request.headers["Authorization"]
	scheme, token = data.split()
	decoded_token = jwt.decode(
            token,
            key="7451B034BF2BD44049C4879E2CD2A5E501061F55B30BFE734F319032A137EAD0",
            algorithms="HS256",
        )
	if decoded_token["id"]:
		return decoded_token
	else:
		return False


def found_user(data):
	try:
		con=cnxpool.get_connection()
		cursor = con.cursor(dictionary=True)
		cursor.execute("SELECT email from members WHERE email = %s",(data['email'],))
		source = cursor.fetchone()
		cursor.close()
		con.close()
		return source
	except Exception as err:
		print("user",err)
		return False

def register(data):
	try:
		con=cnxpool.get_connection()
		cursor = con.cursor(dictionary=True)
		cursor.execute("INSERT INTO members(username, email, password) values(%s, %s, %s)",(data['name'],data['email'],data['password']))
		con.commit()
		cursor.close()
		con.close()
		return True
	except Exception as err:
			print("register",err)
			return False

def get_user_info(data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT id,email,username,password from members WHERE email = %s and password= %s",(data['email'], data['password']))
    source = cursor.fetchone()
    cursor.close()
    con.close()
    return source