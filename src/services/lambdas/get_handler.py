import json
import os

import boto3
from lambda_types import Event
import pandas

dynamodb = boto3.client("dynamodb")


def get_data(event: Event, lambda_context):
    table_name = os.environ["TABLE_NAME"]
    query_string_parameters = event.get("queryStringParameters")
    print(pandas.__version__)
    if query_string_parameters and query_string_parameters.get("id"):
        dynamodb_item_id = query_string_parameters.get("id")
        results = dynamodb.get_item(TableName=table_name, Key={"id": {"S": dynamodb_item_id}})
        return {"statusCode": 200, "body": json.dumps(results.get("Item"))}

    results = dynamodb.scan(TableName=table_name)

    return {"statusCode": 201, "body": json.dumps(results.get("Items"))}
