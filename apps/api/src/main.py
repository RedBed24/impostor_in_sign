from hashlib import md5
from typing import Annotated

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from db_connector import MongoDBConnector
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.responses import Response
from pydantic import BaseModel
from .user_utils import authenticate_user
from .auth_utils import create_access_token, Token, get_current_user

app = FastAPI(
    on_shutdown=[lambda: MongoDBConnector().close_connection()],
)

@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username}
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/api/img")
async def get_imgs(limit: int = 5) -> dict:
    db = MongoDBConnector.get_db()
    imgs = list(db.raw_images.find({}).limit(limit))
    imgs = list(map(lambda x: {"label": x["label"], "id": x["_id"]}, imgs))
    return {"images": imgs}


@app.get("/api/img/{img_id}")
async def get_img(img_id: str) -> dict:
    db = MongoDBConnector.get_db()
    img = db.raw_images.find_one({"_id": img_id})
    return {"label": img["label"], "id": img["_id"]}


@app.get(
    "/api/img/raw/{img_id}",
    responses={200: {"content": {"image/jpeg": {}}}},
    response_class=Response,
)
async def get_img(img_id: str) -> dict:
    db = MongoDBConnector.get_db()
    img = db.raw_images.find_one({"_id": img_id})
    return Response(content=img["image.bytes"], media_type="image/jpeg")

@app.get("/api/img/label/{label}")
async def get_img_by_label(label: str) -> dict:
    db = MongoDBConnector.get_db()
    imgs = list(db.raw_images.find({"label": label}))
    imgs = list(map(lambda x: {"label": x["label"], "id": x["_id"]}, imgs))
    return {"images": imgs}

@app.delete("/api/img/{img_id}")
async def delete_img(img_id: str, current_user:Annotated[str, Depends(get_current_user)]) -> dict:
    db = MongoDBConnector.get_db()
    db.raw_images.delete_one({"_id": img_id})
    return {"status": "deleted"}


@app.put("/api/img/")
async def create_img(
    current_user:Annotated[str, Depends(get_current_user)],
    label: str = Form(...), file: UploadFile = File(...),
) -> dict[str, str]:
    db = MongoDBConnector.get_db()
    img_bytes = await file.read()
    id = md5(img_bytes).hexdigest()
    img = {"label": label, "image.bytes": img_bytes, "_id": id}
    result = db.raw_images.insert_one(img)
    if not result.inserted_id:
        return {"status": "failed", "message": "Insert operation failed"}
    return {"status": "inserted", "id": str(result.inserted_id)}


class Label(BaseModel):
    label: str


@app.post("/api/img/{img_id}")
async def post_img(img_id: str, new_label: Label, current_user:Annotated[str, Depends(get_current_user)]) -> dict:
    db = MongoDBConnector.get_db()
    result = db.raw_images.update_one({"_id": img_id}, {"$set": new_label.model_dump()})
    if result.matched_count == 0:
        return {"status": "not found", "message": "Document with given ID not found"}
    if result.modified_count == 0:
        return {"status": "not modified", "message": "No changes applied"}
    return {"status": "updated"}

@app.get("/iamalive")
async def iamalive() -> dict:
    return {"status": "ok"}