from flask import *
from model.query_make import *
from model.jwt_token import *
from model.rds_pool import *
upload_system = Blueprint("upload_system", __name__)

@upload_system.route("/product/upload")
def product_upload():
	return True