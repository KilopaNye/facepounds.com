from flask import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.query_make import *

index_system = Blueprint("index_system", __name__)

@index_system.route("/product/get_info" ,methods=["POST"])
def get_info():
	try:
		param = request.get_json()
		result = get_product(param)
		if result:
			response = make_response(jsonify({"data":result}), 200)
			response.headers["Content-type"] = "application/json"
			return response
		else:
			return {
					"error": True,
					"message": "不正確"
				}, 400
	except:
			return {
				"error": True,
				"message": "伺服器內部錯誤"
			}, 500