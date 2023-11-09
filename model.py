import mysql.connector
from flask import *
from dotenv import *
import os
load_dotenv()
cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    user=os.getenv("user"),
    password=os.getenv("password"),
    host=os.getenv("host"),
    database="board",
    pool_name="mypool",
    pool_size=5,
)