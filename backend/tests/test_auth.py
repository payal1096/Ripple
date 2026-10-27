def test_signup_successful(client):
    """Test standard citizen registration."""
    payload = {
        "name": "Ananya Sen",
        "email": "ananya.sen@example.com",
        "password": "SecurePassword123!",
        "city": "Mumbai",
        "phone": "+91 98331 12345",
    }
    resp = client.post("/api/auth/signup", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "ananya.sen@example.com"
    assert data["user"]["role"] == "citizen"
    assert "hashed_password" not in data["user"]

def test_signup_duplicate_email_rejected(client):
    """Verify duplicate email registration is rejected with HTTP 400."""
    payload = {
        "name": "Duplicate Priya",
        "email": "priya.sharma@example.com",  # Already seeded
        "password": "Password123!",
        "city": "Mumbai",
    }
    resp = client.post("/api/auth/signup", json=payload)
    assert resp.status_code == 400
    assert "already exists" in resp.json()["detail"]

def test_login_successful(client):
    """Verify demo user login returns valid JWT."""
    resp = client.post(
        "/api/auth/login",
        json={"email": "priya.sharma@example.com", "password": "DemoPass2026!"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "priya.sharma@example.com"
    assert "hashed_password" not in data["user"]

def test_login_invalid_password(client):
    """Verify bad credentials return HTTP 401."""
    resp = client.post(
        "/api/auth/login",
        json={"email": "priya.sharma@example.com", "password": "WrongPassword!"},
    )
    assert resp.status_code == 401
    assert "Invalid email or password" in resp.json()["detail"]

def test_get_me_authenticated(client, citizen_auth_headers):
    """Verify /api/auth/me returns profile for authenticated user."""
    resp = client.get("/api/auth/me", headers=citizen_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "priya.sharma@example.com"
    assert data["role"] == "citizen"
    assert "hashed_password" not in data

def test_get_me_unauthenticated(client):
    """Verify /api/auth/me requires authentication."""
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401

def test_patch_me_update_preferences(client, citizen_auth_headers):
    """Verify /api/auth/me allows updating preferences."""
    payload = {
        "name": "Priya Sharma Updated",
        "preferences": {
            "email_notifications": False,
            "sms_alerts": True,
            "high_risk_alerts_only": True,
            "compact_view": True,
        },
    }
    resp = client.patch("/api/auth/me", json=payload, headers=citizen_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Priya Sharma Updated"
    assert data["preferences"]["sms_alerts"] is True
    assert data["preferences"]["email_notifications"] is False
