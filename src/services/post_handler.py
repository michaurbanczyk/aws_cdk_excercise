import json


def post_data(event, lambda_context):
    return {
        "statusCode": 200,
        "body": json.dumps('Hello World from post_handler lambda!')
    }