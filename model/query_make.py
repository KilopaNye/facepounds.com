from flask import *
from model.jwt_token import *
from model.rds_pool import *

cnxpool=connect_to_pool()

def found_user(data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT email from members WHERE email = %s",(data['email'],))
    source = cursor.fetchone()
    cursor.close()
    con.close()
    return source

def register(data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("INSERT INTO members(username, email, password) values(%s, %s, %s)",(data['name'],data['email'],data['password']))
    cursor.close()
    con.close()
    con.commit()
    return True

def get_user_info(data):
    con=cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT id,email,username,password from members WHERE email = %s and password= %s",(data['email'], data['password']))
    source = cursor.fetchone()
    cursor.close()
    con.close()
    return source