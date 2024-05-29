from typing import TypedDict


class Event(TypedDict):
    resource: str
    path: str
    httpMethod: str
    headers: dict
    body: str
    queryStringParameters: dict
