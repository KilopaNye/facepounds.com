from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *


ready_check_system = Blueprint("ready_check_system", __name__)

@ready_check_system.route("/api/new_order",methods=["POST"])
def new_order():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            order_info=request.get_json("order-info")
            print(order_info)
            data=order_info["order_info"]
            buyer_id=decoded_token['id']
            pre_order_info_upload(data,buyer_id)
            return jsonify({'data':"商議訂單建立成功"})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"})
    else:
        return jsonify({'error':"尚未登入"})
    
@ready_check_system.route("/api/get_pre_order",methods=["GET"])
def get_pre_order():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            buyer_id=decoded_token['id']
            data = get_pre_order_info(buyer_id)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"})
    else:
        return jsonify({'error':"尚未登入"})
    
@ready_check_system.route("/api/get_pre_trade",methods=["GET"])
def get_pre_trade():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            seller_id=decoded_token['id']
            data = get_pre_trade_info(seller_id)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"})
    else:
        return jsonify({'error':"尚未登入"})