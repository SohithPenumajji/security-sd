from security.custom_authentication_handler import custom_authentication_failure

def authenticate_user(username, password):
    # For demonstration, using hardcoded values
    valid_username = "admin"
    valid_password = "admin123"

    if username == valid_username and password == valid_password:
        return True
    else:
        custom_authentication_failure(username)
        return False
