from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *
user_auth_page_system = Blueprint("user_auth_page_system", __name__)

# @user_auth_page_system.route('/api/user_auth_page_system')
# def user_auth(){

# }