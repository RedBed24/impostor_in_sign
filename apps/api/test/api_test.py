import requests


def test_get_token():
    token_response = requests.post(
        "http://localhost:8000/token",
        data={"username": "johndoe", "password": "password"},
    )
    assert (
        token_response.status_code == 200
    ), f"Token request failed: {token_response.content}"
    token = token_response.json().get("access_token")
    assert token, "No access token received"
    return token


def test_valid_put_api():
    token = test_get_token()

    img = requests.get(
        "https://img.ifunny.co/images/5b36864e23f5e5254ae4450e5c4733d4f98cc948352a6c6420728e4f1a17f0a7_1.jpg"
    )

    response = requests.put(
        "http://localhost:8000/api/img/",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("sus.jpg", img.content, "image/jpeg")},
        data={"label": "sus"},
    )
    assert "status" in response.json()
    assert response.json()["status"] == "inserted"


def test_valid_post_api():
    image_hash = "a7fcfa49760c311f0ca66fdef3ace23b"
    token = test_get_token()
    requests.post(
        f"http://localhost:8000/api/img/{image_hash}",
        headers={"Authorization": f"Bearer {token}"},
        json={"label": "susget"},
    )
    response = requests.get(f"http://localhost:8000/api/img/{image_hash}")
    assert response.json()["label"] == "susget"


def test_valid_get_raw_api():
    image_hash = "a7fcfa49760c311f0ca66fdef3ace23b"
    response = requests.get(f"http://localhost:8000/api/img/raw/{image_hash}")
    with open("sus.jpg", "wb") as f:
        f.write(response.content)


def test_valid_get_api():
    image_hash = "a7fcfa49760c311f0ca66fdef3ace23b"
    response = requests.get(f"http://localhost:8000/api/img/{image_hash}")
    assert response
    assert response.status_code == 200
    assert "label" in response.json()


def test_valid_delete_api():
    image_hash = "a7fcfa49760c311f0ca66fdef3ace23b"
    token = test_get_token()

    response = requests.delete(
        f"http://localhost:8000/api/img/{image_hash}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "deleted"
