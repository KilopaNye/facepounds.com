from flask import *
from model.member_Auth import *
from model.service_connect.rds_pool import *

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
    con.commit()
    cursor.close()
    con.close()
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
        return product_info_id['LAST_INSERT_ID()']
    except Exception as err:
        print(err)
        return False
    finally:
        cursor.close()
        con.close()

def product_upload_sql(message_dict,owner_id):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    try:
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
        product_id = cursor.fetchone()
        product_info_id = product_id["LAST_INSERT_ID()"]

        if message_dict["tagResult"]:

            for i in message_dict["tagResult"]:
                cursor = con.cursor(dictionary=True)
                cursor.execute(
                    "SELECT id,tag_name FROM product_tag WHERE tag_name=%s"
                ,(i,)),
                result = cursor.fetchone()
                print(result)
                if result:
                    cursor.execute("INSERT INTO product_tag_relation(product_info_id,tag_id) VALUE(%s,%s)",(product_info_id, result["id"]))
                    con.commit()
                    print("標籤已存在")
                    cursor.close()
                else:
                    cursor.execute("INSERT INTO product_tag(tag_name) VALUE(%s)",(i,))
                    con.commit()
                    cursor.execute("SELECT LAST_INSERT_ID()")
                    tag_id_dict = cursor.fetchone()
                    tag_id = tag_id_dict ["LAST_INSERT_ID()"]
                    cursor.execute("INSERT INTO product_tag_relation(product_info_id,tag_id) VALUE(%s,%s)",(product_info_id, tag_id,))
                    con.commit()
                    print("標簽不存在")
                    cursor.close()
        return ({'data':True})
    except Exception as err:
        print("第一個錯誤", err)
        return False
    finally:
        cursor.close()
        con.close()


