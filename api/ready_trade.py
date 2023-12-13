from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

ready_trade_system = Blueprint("ready_trade_system", __name__)





@ready_trade_system.route("/api/ready-trade/get-order",methods=["GET"])
def get_pre_order():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            buyer_id=decoded_token['id']
            data = get_trade_info(buyer_id)
            return jsonify({'data':data}), 200
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"}), 500
    else:
        return jsonify({'error':"尚未登入"}), 401
    
@ready_trade_system.route("/api/ready-trade/get-trade",methods=["GET"])
def get_pre_trade():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            seller_id=decoded_token['id']
            data = get_order_info(seller_id)
            return jsonify({'data':data}), 200
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"}), 500
    else:
        return jsonify({'error':"尚未登入"}),401