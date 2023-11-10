from flask import *
import mysql.connector
from dotenv import *
from api.product import product_system
from api.index import index_system
from model import *

load_dotenv()
app = Flask(__name__, static_folder="public", static_url_path="/")
app.secret_key = "WGXaTKE7JR9MzzykHVp1O8ix7cnkx5eOb400I5gPxXJI3I8saAUWZjDLxs6056M"



app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.json.ensure_ascii = False
app.register_blueprint(index_system)
app.register_blueprint(product_system)

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/product")
def product():
	return render_template("product.html")

@app.route("/trade")
def trade():
	return render_template("trade.html")

@app.route("/upload")
def upload():
	return render_template("upload.html")

app.run(host="0.0.0.0", port=3000, debug=True)