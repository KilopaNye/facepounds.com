from flask import *
from datetime import *
import jwt
from model.service_connect.rds_pool import *
from dotenv import *
import os
load_dotenv()
cnxpool=connect_to_pool()
jwt_key = os.getenv("jwt_key")
def jwt_make(id,member_id,email):
	payload = {
		'exp': datetime.now() + timedelta(minutes=100800),
		'username' : member_id,
		'email': email,
		'id':id
	}
	key = jwt_key
	encoded_jwt = jwt.encode(payload, key, algorithm='HS256')
	return encoded_jwt

def decode_jwt():
	data = request.headers["Authorization"]
	scheme, token = data.split()
	decoded_token = jwt.decode(
            token,
            key = jwt_key,
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



import sys
import io
from google.cloud import vision_v1
import re


def state_check(head,number):
    try:
        check_numbers = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
        id_map = {
            "A": 10,
            "B": 11,
            "C": 12,
            "D": 13,
            "E": 14,
            "F": 15,
            "G": 16,
            "H": 17,
            "I": 34,
            "J": 18,
            "K": 19,
            "M": 21,
            "N": 22,
            "O": 35,
            "P": 23,
            "Q": 24,
            "T": 27,
            "U": 28,
            "V": 29,
            "W": 32,
            "X": 30,
            "Z": 33,
            "L": 20,
            "R": 25,
            "S": 26,
            "Y": 31,
        }
        print(str(id_map[head])+number)
        original_number = str(id_map[head])+number
        # 將每個數字分別乘以對應的權重，然後相加
        result = sum(int(digit) * weight for digit, weight in zip(str(original_number), check_numbers))
        print(result)
        result = result % 10==0
        
        if result:
            print("驗證成功")
            return True
        else:
            print("驗證失敗")
            return False
    except Exception as err:
        print(err)


def detect_text_uri(file):
    try:
        client = vision_v1.ImageAnnotatorClient()
        # 圖片URL
        # image = vision_v1.types.Image()
        # image.source.image_uri = uri
        # 圖片file
        content = file.read()
        image = vision_v1.Image(content=content)
        
        response = client.text_detection(image=image)
        texts = response.text_annotations
        print("Texts:")
        print(texts[0].description)
        text = texts[0].description
        pattern = r"[A-Z][0-9]{9}"


        matches = re.findall(pattern, text)

        # 如果有匹配的結果，取第一個結果（這裡假設身份證字號只出現一次）
        if matches:
            id_number = matches[0]
            print("身份證字號:", id_number)
            number= id_number[1:]
            head=id_number[0]
            result=state_check(head,number)
            if result:
                return {"data":True, 'number':id_number, "message":"approved"}
            else:
                return {"data":False, 'number':id_number,'message':"failed"}
        else:
            print("未找到身份證字號")
            return {"data":False, 'number':"not found user's number",'message':"can not found"}
    except Exception as err:
        print("爆了",err)




