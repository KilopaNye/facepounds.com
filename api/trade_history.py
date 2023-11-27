from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

trade_history_system = Blueprint("trade_history_system", __name__)

@trade_history_system.route("/api/trade-history/get_order",methods=["GET"])
def get_pre_order():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            buyer_id=decoded_token['id']
            data = get_buyer_finish_info(buyer_id)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"})
    else:
        return jsonify({'error':"尚未登入"})
    
@trade_history_system.route("/api/trade-history/get_trade",methods=["GET"])
def get_pre_trade():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            seller_id=decoded_token['id']
            data = get_seller_finish_info(seller_id)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"})
    else:
        return jsonify({'error':"尚未登入"})