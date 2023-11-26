from flask import *
from model.query_make import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
from model.service_connect.s3_bucket import *

self_page_system= Blueprint("self_page_system", __name__)

@self_page_system.route("/api/self-page")
def userInfo():
    pass