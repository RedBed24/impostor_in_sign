from hashlib import md5

from db_connector import MongoDBConnector
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

app = FastAPI(
    on_shutdown=[lambda: MongoDBConnector().close_connection()],
)


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


@app.delete("/api/img/{img_id}")
async def delete_img(img_id: str) -> dict:
    db = MongoDBConnector.get_db()
    db.raw_images.delete_one({"_id": img_id})
    return {"status": "deleted"}


@app.put("/api/img/")
async def create_img(
    label: str = Form(...), file: UploadFile = File(...)
) -> dict[str, str]:
    db = MongoDBConnector.get_db()
    img_bytes = await file.read()
    id = md5(img_bytes).hexdigest()
    img = {"label": label, "image.bytes": img_bytes, "_id": id}
    db.raw_images.insert_one(img)
    return {"status": "inserted"}


class Label(BaseModel):
    label: str


@app.post("/api/img/{img_id}")
async def post_img(img_id: str, new_label: Label) -> dict:
    db = MongoDBConnector.get_db()
    db.raw_images.update_one({"_id": img_id}, {"$set": new_label.model_dump()})
    return {"status": "updated"}
