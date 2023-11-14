from flask import *
from model.query_make import *
from model.jwt_token import *
from model.rds_pool import *
from model.s3_bucket import *
upload_system = Blueprint("upload_system", __name__)

@upload_system.route("/product/upload",methods=["POST"])
def product_upload():
	try:
		files = request.files.getlist('file')
		message_str = request.form.get('message')
		message_dict = json.loads(message_str) 
		print(type(message_dict ))
		# message = json.loads(message_str)
		owner_id =1
		product_upload_sql(message_dict,owner_id)
		print(files)
		print(message_str)
		# upload_to_s3(files)
		return jsonify({'data':True})
	except Exception as err:
		print(err)
		return jsonify({'data':False})
		