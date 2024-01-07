from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

self_page_system = Blueprint("self_page_system", __name__)


@self_page_system.route("/api/self-page/info", methods=["PUT"])
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
    
@self_page_system.route("/api/self-page/user-info", methods=["POST"])
def just_userInfo():
    decoded_token = decode_jwt()
    if decoded_token["id"]:
        try:
            param = decoded_token["id"]
            result = get_self_info(param)
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


@self_page_system.route("/api/self-page/image", methods=["PUT"])
def change_img():
    decoded_token = decode_jwt()
    if decoded_token["id"]:
        try:
            file = request.files['file']
            result = self_img_upload_to_s3(file)
            if result:
                sql_result = user_img_update_sql(decoded_token["id"], result)
                response = make_response(jsonify({"data": sql_result}), 200)
                response.headers["Content-type"] = "application/json"
                print(result)
                return response
            else:
                return {"error": True, "message": "不正確"}, 400
        except:
            return {"error": True, "message": "伺服器內部錯誤"}, 500
    else:
        return {"error": True, "message": "尚未登入"}, 401
    
@self_page_system.route("/api/self-page/name", methods=["PUT"])
def change_name():
    decoded_token = decode_jwt()
    if decoded_token["id"]:
        try:
            new_name = request.get_json()
            print(new_name)
            result = user_name_update_sql(decoded_token["id"],new_name["newName"])
            if result:
                response = make_response(jsonify({"data": True}), 200)
                response.headers["Content-type"] = "application/json"
                print(result)
                return response
            else:
                return {"error": True, "message": "不正確"}, 400
        except Exception as err:
            print(err)
            return {"error": True, "message": "伺服器內部錯誤"}, 500
    else:
        return {"error": True, "message": "尚未登入"}, 401
    

@self_page_system.route("/api/self-page/tag", methods=["PUT"])
def change_tag():
    decoded_token = decode_jwt()
    if decoded_token["id"]:
        try:
            new_tag = request.get_json()
            print(new_tag)
            result = user_tag_update_sql(decoded_token["id"],new_tag["newTag"])
            if result:
                response = make_response(jsonify({"data": True}), 200)
                response.headers["Content-type"] = "application/json"
                print(result)
                return response
            else:
                return {"error": True, "message": "不正確"}, 400
        except Exception as err:
            print(err)
            return {"error": True, "message": "伺服器內部錯誤"}, 500
    else:
        return {"error": True, "message": "尚未登入"}, 401
    
@self_page_system.route("/api/self-page/text", methods=["PUT"])
def change_text():
    decoded_token = decode_jwt()
    if decoded_token["id"]:
        try:
            new_text = request.get_json()
            print(new_text)
            result = user_text_update_sql(decoded_token["id"],new_text["newText"])
            if result:
                response = make_response(jsonify({"data": True}), 200)
                response.headers["Content-type"] = "application/json"
                print(result)
                return response
            else:
                return {"error": True, "message": "不正確"}, 400
        except Exception as err:
            print(err)
            return {"error": True, "message": "伺服器內部錯誤"}, 500
    else:
        return {"error": True, "message": "尚未登入"}, 401