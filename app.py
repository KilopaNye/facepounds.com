from flask import *
import mysql.connector
from dotenv import *
load_dotenv()

app = Flask(__name__, static_folder="public", static_url_path="/")
app.secret_key = "WGXaTKE7JR9MzzykHVp1O8ix7cnkx5eOb400I5gPxXJI3I8saAUWZjDLxs6056M"

cnxpool = mysql.connector.pooling.MySQLConnectionPool(user="admin", password="steve69988", host="mysql00.ccxw0bwh2jza.ap-northeast-1.rds.amazonaws.com", database="board",pool_name="mypool",pool_size=5)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.json.ensure_ascii = False

@app.route("/")
def index():
	return render_template("index.html")
@app.route("/product")

def index():
	return render_template("product.html")



app.run(host="0.0.0.0", port=3000, debug=True)