from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

self_page_system = Blueprint("self_page_system", __name__)


@self_page_system.route("/api/self-page/self-info", methods=["POST"])
def userInfo():
    decoded_token = decode_jwt()
    if decoded_token["id"]:
        try:
            param = decoded_token["id"]
            result = get_self_product(param)
            if result:
                response = make_response(jsonify({"data": result}), 200)
                response.headers["Content-type"] = "application/json"
                # print(result)
                return response
            else:
                return {"error": True, "message": "不正確"}, 400
        except:
            return {"error": True, "message": "伺服器內部錯誤"}, 500
    else:
        return {"error": True, "message": "尚未登入"}, 400
