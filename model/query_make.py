from flask import *
from model.member_Auth import *
from model.service_connect.rds_pool import *
import uuid

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


def product_upload_sql(message_dict, owner_id):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO product_info(owner_id, product_name, product_price, product_amount,  owner_pre_site, county_site, product_intro) VALUE(%s,%s,%s,%s,%s,%s,%s)",
            (
                owner_id,
                message_dict["productName"],
                message_dict["price"],
                message_dict["amount"],
                message_dict["where"],
                message_dict["site"],
                message_dict["introduce"],
            ),
        )
        con.commit()
        cursor.execute("SELECT LAST_INSERT_ID()")
        product_info_id = cursor.fetchone()
        print(product_info_id["LAST_INSERT_ID()"])
        return product_info_id["LAST_INSERT_ID()"]
    except Exception as err:
        print("product_upload_sql", err)
        return False
    finally:
        cursor.close()
        con.close()


def product_upload_sql(message_dict, owner_id, images_name):
    con = cnxpool.get_connection()
    cursor = con.cursor(dictionary=True)
    try:
        cursor.execute(
            "INSERT INTO product_info(owner_id, product_name, product_price, product_amount,  owner_pre_site, county_site, product_intro) VALUE(%s,%s,%s,%s,%s,%s,%s)",
            (
                owner_id,
                message_dict["productName"],
                message_dict["price"],
                message_dict["amount"],
                message_dict["site"],
                message_dict["where"],
                message_dict["introduce"],
            ),
        )
        con.commit()

        cursor.execute("SELECT LAST_INSERT_ID()")
        product_id = cursor.fetchone()
        product_info_id = product_id["LAST_INSERT_ID()"]

        for img_name in images_name:
            cursor.execute(
                "INSERT INTO product_images(product_id, image_url) VALUE(%s, %s)",
                (product_info_id, img_name),
            )
        # image_data = [(product_info_id, img_name) for img_name in images_name]

        # # 使用 execute 插入多筆資料
        # for data in image_data:
        #     cursor.execute(
        #         "INSERT INTO product_images(product_id, image_url) VALUES (%s, %s)",
        #         data
        #     )

        if message_dict["tagResult"]:
            cursor = con.cursor(dictionary=True)
            for i in message_dict["tagResult"]:
                cursor.execute(
                    "SELECT id,tag_name FROM product_tag WHERE tag_name=%s", (i,)
                ),
                result = cursor.fetchone()
                print(result)
                if result:
                    cursor.execute(
                        "INSERT INTO product_tag_relation(product_info_id,tag_id) VALUE(%s,%s)",
                        (product_info_id, result["id"]),
                    )
                    con.commit()
                    print("標籤已存在")
                else:
                    cursor.execute("INSERT INTO product_tag(tag_name) VALUE(%s)", (i,))
                    con.commit()
                    cursor.execute("SELECT LAST_INSERT_ID()")
                    tag_id_dict = cursor.fetchone()
                    tag_id = tag_id_dict["LAST_INSERT_ID()"]
                    cursor.execute(
                        "INSERT INTO product_tag_relation(product_info_id,tag_id) VALUE(%s,%s)",
                        (
                            product_info_id,
                            tag_id,
                        ),
                    )
                    con.commit()
                    print("標簽不存在")
            cursor.close()
        return {"data": True}
    except Exception as err:
        print("product_upload_sql:", err)
        return False
    finally:
        cursor.close()
        con.close()


def get_product(param):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)

        cursor.execute("SET SESSION group_concat_max_len = 10000;")
        con.commit()
        if param["param"] == None:
            cursor.execute(
                "SELECT a.id, a.product_name, a.product_price, a.product_amount, a.county_site, b.username, GROUP_CONCAT(DISTINCT tag.tag_name)as tag, GROUP_CONCAT(c.image_url) AS image_urls FROM product_info as a JOIN members as b ON a.owner_id = b.id JOIN product_images as c ON c.product_id = a.id JOIN product_tag_relation ON a.id = product_tag_relation.product_info_id JOIN product_tag as tag ON product_tag_relation.tag_id = tag.id GROUP BY a.id",
            )
            response = cursor.fetchall()
            con.commit()
            return response
        else:
            query_values = []
            data = param["param"]
            if data["text"] != None:
                data["text"] = "%" + data["text"] + "%"
            tags = ["tag", "much", "text", "area"]
            for tag in tags:
                query_values.append(data[tag])
                query_values.append(data[tag])

            query = """
            SELECT * FROM product_info
            JOIN product_tag_relation ON product_info.id = product_tag_relation.product_info_id
            JOIN product_tag ON product_tag_relation.tag_id = product_tag.id
            WHERE 
            (product_tag.tag_name = %s OR %s IS NULL)
            AND (product_info.product_amount >= %s OR %s IS NULL)
            AND (product_info.product_name LIKE %s OR %s IS NULL)
            AND (product_info.county_site = %s OR %s IS NULL)
            """
            cursor.execute(query, query_values)
            response = cursor.fetchall()
            print(response)
            con.commit()
            if response:
                return response
            else:
                return "查詢不到相關資料"
    except Exception as err:
        print("get_product(param):", err)
        return False
    finally:
        cursor.close()
        con.close()


def from_id_get_product(productId):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)

        cursor.execute("SET SESSION group_concat_max_len = 10000;")
        con.commit()
        cursor.execute(
            "SELECT a.owner_pre_site, a.id, a.product_name, a.product_price, a.product_amount, a.product_intro, a.county_site, b.username,b.id as user_id, b.userImg,  GROUP_CONCAT(DISTINCT tag.tag_name)as tag, GROUP_CONCAT(DISTINCT c.image_url) AS image_urls FROM product_info as a JOIN members as b ON a.owner_id = b.id JOIN product_images as c ON c.product_id = a.id JOIN product_tag_relation ON a.id = product_tag_relation.product_info_id JOIN product_tag as tag ON product_tag_relation.tag_id = tag.id WHERE a.id = %s GROUP BY a.id",
            (productId,),
        )
        response = cursor.fetchone()
        con.commit()
        return response
    except Exception as err:
        print("get_product(param):", err)
        return False
    finally:
        cursor.close()
        con.close()


def pre_order_info_upload(data, buyer_id):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        order_uuid = str(uuid.uuid4())
        param = [
            order_uuid,
            data["seller_id"],
            buyer_id,
            data["product_id"],
            data["productAmount"],
            data["productRemark"],
            data["order_time"],
            data["total_price"],
        ]

        cursor.execute(
            "INSERT INTO pre_order_info(order_uuid, seller_id, buyer_id, product_id, order_amount, remark_message, order_time, total_price) VALUES(%s, %s, %s, %s, %s, %s, %s, %s )",
            param,
        )
        con.commit()
        return True
    # except Exception as err:
    #     print("get_product(param):", err)
    #     return False
    finally:
        cursor.close()
        con.close()


def get_pre_order_info(buyer_id):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)

        cursor.execute(
            "SELECT  members.username, img.image_url, pre.*, a.owner_pre_site, a.id, a.product_name, a.product_price, a.product_amount FROM pre_order_info as pre JOIN product_info as a ON pre.product_id = a.id JOIN product_images as img ON img.product_id = a.id JOIN members ON members.id = a.owner_id  WHERE pre.buyer_id = %s GROUP BY a.id",
            (buyer_id,),
        )
        response = cursor.fetchall()
        return response
    except Exception as err:
        print("get_pre_order_info(buyer_id):", err)
        return False
    finally:
        cursor.close()
        con.close()


def get_pre_trade_info(seller_id):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)

        cursor.execute(
            "SELECT  members.username, img.image_url, pre.*, a.owner_pre_site, a.id, a.product_name, a.product_price, a.product_amount FROM pre_order_info as pre JOIN product_info as a ON pre.product_id = a.id JOIN product_images as img ON img.product_id = a.id JOIN members ON members.id = a.owner_id  WHERE pre.seller_id = %s GROUP BY a.id",
            (seller_id,),
        )
        response = cursor.fetchall()
        return response
    except Exception as err:
        print("get_pre_order_info(buyer_id):", err)
        return False
    finally:
        cursor.close()
        con.close()


def get_pre_order_info_by_uuid(order_uuid):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)

        cursor.execute(
            "SELECT members.username, GROUP_CONCAT(DISTINCT img.image_url) as image_url, pre.*, a.owner_pre_site, a.id, a.product_name, a.product_price, a.product_amount FROM pre_order_info as pre JOIN product_info as a ON pre.product_id = a.id JOIN product_images as img ON img.product_id = a.id JOIN members ON members.id = a.owner_id  WHERE pre.order_uuid = %s GROUP BY a.id",
            (order_uuid,),
        )
        response = cursor.fetchone()
        return response
    except Exception as err:
        print("get_pre_order_info(buyer_id):", err)
        return False
    finally:
        cursor.close()
        con.close()


def get_username(user_id):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)

        cursor.execute("SELECT username as user FROM members WHERE id = %s", (user_id,))
        response = cursor.fetchone()
        return response
    except Exception as err:
        print("get_username:(user_id)", err)
        return False
    finally:
        cursor.close()
        con.close()


def upload_message(user_id, room_uuid, message, timeNow):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO chat_messages(room_uuid, send_id, message, upload_time) VALUE(%s, %s, %s, %s)",(
                room_uuid, user_id, message, timeNow,
            )
        )
        con.commit()
        return True
    except Exception as err:
        print("upload_message(user_id, room_uuid, message, timeNow)", err)
        return False
    finally:
        cursor.close()
        con.close()

def load_message(room_uuid):
    try:
        con = cnxpool.get_connection()
        cursor = con.cursor(dictionary=True)
        cursor.execute(
            "SELECT a.id as index_id,members.username, a.message, a.upload_time FROM chat_messages as a JOIN members ON members.id = a.send_id WHERE a.room_uuid =%s",(
                room_uuid,
            )
        )
        response = cursor.fetchall()
        con.commit()
        return response
    except Exception as err:
        print("load_message(room_uuid)", err)
        return False
    finally:
        cursor.close()
        con.close()
