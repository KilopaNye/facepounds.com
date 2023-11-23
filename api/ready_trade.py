from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

ready_trade_system = Blueprint("ready_trade_system", __name__)





@ready_trade_system.route("/api/ready_trade/get_order",methods=["GET"])
def get_pre_order():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            buyer_id=decoded_token['id']
            data = get_trade_info(buyer_id)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"})
    else:
        return jsonify({'error':"尚未登入"})