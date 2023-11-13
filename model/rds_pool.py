import mysql.connector
from flask import *
from dotenv import *
import os
load_dotenv()



def connect_to_pool():
    cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    user=os.getenv("user"),
    password=os.getenv("password"),
    host=os.getenv("host"),
    database="facepounds",
    pool_name="mypool",
    pool_size=10,
    )
    return cnxpool