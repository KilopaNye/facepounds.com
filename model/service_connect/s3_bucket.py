import boto3
import uuid
import os
from flask import *
from dotenv import *
from datetime import *

load_dotenv()
os.getenv
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
AWS_S3_REGION = os.getenv("AWS_S3_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_S3_REGION,
)


def upload_to_s3(files,username):
    s3 = boto3.client("s3")
    image_name=[]
    for file in files:
        try:
            filename = username +"-"+ str(uuid.uuid4()) + ".jpeg"
            image_name.append(filename)

            s3.upload_fileobj(
                file, AWS_S3_BUCKET, filename, ExtraArgs={'ContentType': "image/jpeg"}
            )
        except Exception as err:
            print(err)
            return False

    return image_name


def self_img_upload_to_s3(files):
    s3 = boto3.client("s3")
    image_name=""
    try:
        filename = str(uuid.uuid4()) + ".jpeg"
        image_name=filename
        print(files)
        s3.upload_fileobj(
            files, AWS_S3_BUCKET, filename, ExtraArgs={'ContentType': "image/jpeg"}
        )
        return image_name
    except Exception as err:
        print(err)
        return False