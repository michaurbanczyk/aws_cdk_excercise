import requests

from lambda_types import Event


def polling_data(event: Event, lambda_context):
    request = requests.get('https://api.github.com/')

    print(request.text)

    return {
        'statusCode': request.status_code,
        'body': request.text
    }