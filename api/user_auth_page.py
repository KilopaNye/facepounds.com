from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *
user_auth_page_system = Blueprint("user_auth_page_system", __name__)

@user_auth_page_system.route('/api/user-auth-page-system/auth',methods=['POST'])
def user_auth():
    decoded_token = decode_jwt()
    if decoded_token["id"]:
        try:
            user_id=decoded_token["id"]
            file = request.files['file']
            response = detect_text_uri(file)
            if response['data']:
                user_auth_approved(user_id)
                return jsonify({"data":response}),200
            else:
                return jsonify({"error":response}),200
        except Exception as err:
            print (err)
            return jsonify({"error":True}),500
    else:
        return {"error": True, "message": "尚未登入"}, 400
