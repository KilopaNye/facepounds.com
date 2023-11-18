from flask import *
import mysql.connector
from dotenv import *
from api.product import product_system
from api.index import index_system
from api.upload import upload_system
from api.member import member_system
from api.ready_check import ready_check_system
from api.trade import trade_system
from model.query_make import *

load_dotenv()
app = Flask(__name__, static_folder="public", static_url_path="/")
app.secret_key = "WGXaTKE7JR9MzzykHVp1O8ix7cnkx5eOb400I5gPxXJI3I8saAUWZjDLxs6056M"



app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.json.ensure_ascii = False
app.register_blueprint(index_system)
app.register_blueprint(product_system)
app.register_blueprint(upload_system)
app.register_blueprint(member_system)
app.register_blueprint(ready_check_system)
app.register_blueprint(trade_system)

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

app.run(host="0.0.0.0", port=3000, debug=True)