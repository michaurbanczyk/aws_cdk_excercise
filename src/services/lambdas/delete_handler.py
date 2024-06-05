import json
import os

import boto3
from lambda_types import Event
from utils import has_admin_group

dynamodb = boto3.client("dynamodb")


def delete_data(event: Event, lambda_context):
    table_name = os.environ["TABLE_NAME"]
    query_string_parameters = event.get("queryStringParameters")

    if not has_admin_group(event):
        return {"statusCode": 401, "body": json.dumps("Not authorized")}

    if query_string_parameters and query_string_parameters.get("id"):
        dynamodb_item_id = query_string_parameters.get("id")
        dynamodb.delete_item(TableName=table_name, Key={"id": {"S": dynamodb_item_id}})
        return {"statusCode": 200, "body": json.dumps(f"Item {dynamodb_item_id} deleted from dynamodb table!")}

    return {"statusCode": 400, "body": json.dumps("Please provide id and try again!")}
