# user_utils
from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str


fake_users_db = {"johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "password",
        "disabled": False,
    }}

def authenticate_user(username:str, password:str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_user(username: str):
    if username in fake_users_db:
        #retrieve all info including already hashed password
        user_dict = fake_users_db[username] #simulate connection to DB
        return UserInDB(**user_dict)
    
def verify_password(plain_password, hashed_password):
# method to compare plain password with hashed password ON DB, in this case NO HASHING
    return plain_password == hashed_password