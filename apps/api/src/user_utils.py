# user_utils
from pydantic import BaseModel

import os

API_ADMIN_USER = os.getenv("API_ADMIN_USER")
API_ADMIN_PASSWORD = os.getenv("API_ADMIN_PASSWORD")

fake_users_db = {}
if API_ADMIN_USER and API_ADMIN_PASSWORD:
    fake_users_db[API_ADMIN_USER] = {"username": API_ADMIN_USER, "hashed_password": API_ADMIN_PASSWORD}

class User(BaseModel):
    username: str | None = None
    # could have other attributes like email, last time logged in, etc.

class UserInDB(User):
    hashed_password: str | None = None


def authenticate_user(username:str, password:str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


# TODO: implement a real user database
def get_user(username: str) -> UserInDB | None:
    if username in fake_users_db:
        #retrieve all info including already hashed password
        user_dict = fake_users_db[username] #simulate connection to DB
        print("DICT", user_dict) 

        return UserInDB(**user_dict)
    
def verify_password(plain_password, hashed_password):
# method to compare plain password with hashed password ON DB, in this case NO HASHING
    print("plain_password", plain_password)
    print("hashed_password", hashed_password)
    print("plain_password == hashed_password", plain_password == hashed_password)
    return plain_password == hashed_password


