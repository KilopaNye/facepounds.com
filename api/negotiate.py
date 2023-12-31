from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

negotiate_system = Blueprint("negotiate_system", __name__)


@negotiate_system.route("/api/negotiate/<order_uuid>",methods=["GET"])
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

@negotiate_system.route("/api/message-history/<order_uuid>",methods=["GET"])
def get_message_load(order_uuid):
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            data = load_message(order_uuid)
            return jsonify({'data':data})
        except Exception as err:
            print(err)
            return jsonify({'error':"失敗"}),400
    else:
        return jsonify({'error':"尚未登入"}),500

@negotiate_system.route("/api/negotiate/order",methods=["POST"])
def ready_order():
    try:
        data = request.get_json()
        data=data["order_result"]
        print(data)
        response = being_order(data)
        if response:
            return  jsonify({'data':"OK DONE"}),200
        else:
            return jsonify({'error':"失敗"}),400
    except Exception as err:
        print("route trade/ready_order():"+err)
        return jsonify({'error':"伺服器錯誤"}),500


@negotiate_system.route("/api/negotiate/order",methods=["DELETE"])
def delete_order():
    try:
        data = request.get_json()
        data=data["order_result"]
        print(data)
        response = delete_pre_check_order(data)
        if response:
            return  jsonify({'data':"OK DONE"}),200
        else:
            return jsonify({'error':"失敗"}),400
    except Exception as err:
        print("route trade/ready_order():"+err)
        return jsonify({'error':"伺服器錯誤"}),500
    

@negotiate_system.route("/api/negotiate/state",methods=["PUT"])
def state_ok():
    decoded_token=decode_jwt()
    if decoded_token['id']:
        try:
            order_uuid = request.get_json()
            print(order_uuid)
            response = order_state_ok(order_uuid["order_uuid"])
            if response:
                return  jsonify({'data':"OK DONE"}),200
            else:
                return jsonify({'error':"失敗"}),400
        except Exception as err:
            print("route trade/ready_order():"+err)
            return jsonify({'error':"伺服器錯誤"}),500
    else:
        return jsonify({'error':"尚未登入"}),401