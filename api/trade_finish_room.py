from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

trade_finish_system = Blueprint("trade_finish_system", __name__)


@trade_finish_system.route("/api/get_ready_trade/<order_uuid>",methods=["GET"])
def get_order(order_uuid):
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            print(order_uuid)
            data = get_trade_info_by_uuid(order_uuid)
            print(data)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"}),400
    else:
        return jsonify({'error':"尚未登入"}),500