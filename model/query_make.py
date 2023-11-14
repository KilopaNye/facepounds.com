from flask import *
from model.jwt_token import *
from model.rds_pool import *

cnxpool = connect_to_pool()


def found_user(data):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute("SELECT email from members WHERE email = %s", (data["email"],))
    source = cursor.fetchone()
    cursor.close()
    con.close()
    return source


def register(data):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO members(username, email, password) values(%s, %s, %s)",
        (data["name"], data["email"], data["password"]),
    )
    cursor.close()
    con.close()
    con.commit()
    return True


def get_user_info(data):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    cursor.execute(
        "SELECT id,email,username,password from members WHERE email = %s and password= %s",
        (data["email"], data["password"]),
    )
    source = cursor.fetchone()
    cursor.close()
    con.close()
    return source


def product_upload_sql(message_dict,owner_id):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO product_info(owner_id, product_name, product_price, product_amount,  owner_pre_site, county_site, product_intro) VALUE(%s,%s,%s,%s,%s,%s,%s)",
            (
                owner_id,
                message_dict['productName'],
                message_dict['price'],
                message_dict['amount'],
                message_dict['where'],
                message_dict['site'],
                message_dict['introduce'],
            ),
        )
        con.commit()
        cursor.execute("SELECT LAST_INSERT_ID()")
        product_info_id = cursor.fetchone()
        print(product_info_id['LAST_INSERT_ID()'])
        return True
    except Exception as err:
        print(err)
        return False
    finally:
        cursor.close()
        con.close()
