import json


def handler(event, lambda_context):
    return {
        "statusCode": 200,
        "body": json.dumps('Hello World from Lambda!')
    }
