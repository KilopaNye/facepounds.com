from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

transaction_system = Blueprint("transaction_system", __name__)


@transaction_system.route("/api/transaction/order/<order_uuid>",methods=["GET"])
def get_order(order_uuid):
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            data = get_trade_info_by_uuid(order_uuid)
            return jsonify({'data':data})
        except Exception as err:
            print("get_order(order_uuid):",err)
            return jsonify({'error':"失敗"}),400
    else:
        return jsonify({'error':"尚未登入"}),401
    

@transaction_system.route('/api/transaction/order', methods=["POST"])
def finish_trade():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
                data = request.get_json()
                response = being_finish(data['order_result'])
                if response:
                    return  jsonify({'data':"OK DONE"}),200
                else:
                    return jsonify({'error':"失敗"}),400
        except Exception as err:
            print("order-finish():",err)
            return jsonify({'error':"伺服器錯誤"}),500
    else:
        return jsonify({'error':"尚未登入"}), 401