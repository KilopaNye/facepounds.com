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

        if message_dict["tagResult"]:
            for i in message_dict["tagResult"]:
                cursor = con.cursor(dictionary=True)
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
                    cursor.close()
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

        cursor.execute(
                "SET SESSION group_concat_max_len = 10000;"
            )
        con.commit()
        if param["param"] == None:
            cursor.execute(
                "SELECT a.id, a.product_name, a.product_price, a.product_amount, a.county_site, b.username, GROUP_CONCAT(tag.tag_name)as tag, GROUP_CONCAT(c.image_url) AS image_urls FROM product_info as a JOIN members as b ON a.owner_id = b.id JOIN product_images as c ON c.product_id = a.id JOIN product_tag_relation ON a.id = product_tag_relation.product_info_id JOIN product_tag as tag ON product_tag_relation.tag_id = tag.id",
            )
            response = cursor.fetchall()
            con.commit()
            return response
        else:
            query_values = []
            data = param["param"]
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
            AND (product_info.product_amount = %s OR %s IS NULL)
            AND (product_info.product_name LIKE %s OR %s IS NULL)
            AND (product_info.county_site = %s OR %s IS NULL)
            """
            cursor.execute(query, query_values)
            response = cursor.fetchall()
            print(response)
            con.commit()
            return response
    except Exception as err:
        print("get_product(param):", err)
        return False
    finally:
        cursor.close()
        con.close()
