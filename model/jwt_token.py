from flask import *
from datetime import *
import jwt

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