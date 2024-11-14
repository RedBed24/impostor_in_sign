import requests


def test_valid_post_api():
    image_hash = "c88da350cc797e8fc32ad51630310205"
    requests.post(
        f"http://localhost:8000/api/img/{image_hash}", json={"label": "new_label"}
    )
    response = requests.get(f"http://localhost:8000/api/img/{image_hash}")
    assert response.json()["label"] == "new_label"


def test_valid_put_api():
    img = requests.get("https://img.ifunny.co/images/5b36864e23f5e5254ae4450e5c4733d4f98cc948352a6c6420728e4f1a17f0a7_1.jpg")

    response = requests.put(
        "http://localhost:8000/api/img/",
        files={"file": ("sus.jpg", img.content, "image/jpeg")},
        data={"label": "sus"},
    )
    assert response.json()["status"] == "inserted"

def test_valid_get_api():
    response = requests.get("http://localhost:8000/api/img/raw/a7fcfa49760c311f0ca66fdef3ace23b")
    with open("sus.jpg", "wb") as f:
        f.write(response.content)
