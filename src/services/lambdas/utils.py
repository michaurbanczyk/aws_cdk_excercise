from lambda_types import Event


def has_admin_group(event: Event):
    groups = event.get("requestContext", {}).get("authorizer", {}).get("claims", {}).get("cognito:groups")
    if groups:
        return "admins" in groups
    return False
