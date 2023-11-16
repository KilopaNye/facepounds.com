from flask import *
from model.query_make import *

product_system = Blueprint("product_system", __name__)

@product_system.route("/api/product/<productId>")
def GoProduct(productId):
	try:
		result = from_id_get_product(productId)
		if result:
			response = make_response(jsonify({"data":result}), 200)
			response.headers["Content-type"] = "application/json"
			return response
		else:
			return {
					"error": True,
					"message": "景點編號不正確"
				}, 400
	except:
			return {
				"error": True,
				"message": "伺服器內部錯誤"
			}, 500