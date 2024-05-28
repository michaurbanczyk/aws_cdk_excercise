import json


def get_data(event, lambda_context):
    return {
        "statusCode": 200,
        "body": json.dumps('Hello World from get_handler lambda!')
    }
