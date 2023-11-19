from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *
from flask_socketio import SocketIO, emit

trade_system = Blueprint("trade_system", __name__)


@trade_system.route("/api/get_order_trade/<order_uuid>",methods=["GET"])
def get_order(order_uuid):
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            data = get_pre_order_info_by_uuid(order_uuid)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"}),400
    else:
        return jsonify({'error':"尚未登入"}),500
    

