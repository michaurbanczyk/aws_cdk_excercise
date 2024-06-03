import json
import os
import uuid

import boto3
from lambda_types import Event

dynamodb = boto3.client("dynamodb")


def post_data(event: Event, lambda_context):
    table_name = os.environ["TABLE_NAME"]
    random_id = uuid.uuid4().hex
    body = json.loads(event.get("body"))

    if body and body.get("location"):
        dynamodb.put_item(TableName=table_name, Item={"id": {"S": random_id}, "location": {"S": body.get("location")}})
        return {"statusCode": 201, "body": json.dumps(f"Item {random_id} added to dynamodb table!")}

    return {"statusCode": 400, "body": json.dumps("Please provide body and try again!")}
