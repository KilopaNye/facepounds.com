from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *
upload_system = Blueprint("upload_system", __name__)

@upload_system.route("/api/product/upload",methods=["POST"])
def product_upload():
	try:
		decoded_token=decode_jwt()
		if decoded_token['id']:
			
			files = request.files.getlist('file')
			message_str = request.form.get('message')
			message_dict = json.loads(message_str) 
			# message = json.loads(message_str)
			owner_id = decoded_token['id']
			images_name = upload_to_s3(files,decoded_token['username'])
			product_upload_sql(message_dict,owner_id,images_name)
			
			
			# upload_to_s3(files)
			return jsonify({'data':True})
		else:
			return jsonify({'error':"尚未登入"})
	except Exception as err:
		print(err)
		return jsonify({'data':False})