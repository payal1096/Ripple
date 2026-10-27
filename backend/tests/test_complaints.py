def test_create_complaint_authenticated(client, citizen_auth_headers):
    """Test authenticated citizen creating a new complaint."""
    payload = {
        "title": "Severe road waterlogging near metro pillar 108",
        "description": "Rain runoff accumulating up to 30cm across two traffic lanes due to clogged intake.",
        "category": "Drainage",
        "city": "Mumbai",
        "locality": "Andheri West",
        "street_or_landmark": "New Link Road near Metro 108",
        "severity": 4,
    }
    resp = client.post("/api/complaints", json=payload, headers=citizen_auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == payload["title"]
    assert data["risk_level"] == "High"
    assert data["status"] == "Submitted"
    assert data["reported_by_name"] == "Priya Sharma"
    assert "ref_id" in data
    assert len(data["timeline"]) >= 1

def test_create_complaint_unauthenticated_fails(client):
    """Test unauthenticated complaint creation is rejected."""
    payload = {
        "title": "Unauthenticated report",
        "description": "Attempting to create complaint without logging in.",
        "category": "Roads",
        "city": "Mumbai",
        "locality": "Dadar",
        "severity": 2,
    }
    resp = client.post("/api/complaints", json=payload)
    assert resp.status_code == 401

def test_get_my_complaints(client, citizen_auth_headers):
    """Verify citizen can retrieve their own submitted complaints."""
    resp = client.get("/api/complaints/my", headers=citizen_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    for c in data:
        assert c["reported_by_id"] == "usr-citizen-01"

def test_get_public_complaints_redaction(client):
    """Verify public complaint feed redacts sensitive contact number and user id."""
    resp = client.get("/api/complaints/public")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1
    first = data[0]
    assert "ref_id" in first
    assert "title" in first
    # Sensitive personal information should NOT exist in public response schema
    assert "contact_number" not in first
    assert "reported_by_id" not in first

def test_admin_update_complaint_status(client, admin_auth_headers):
    """Verify admin can update complaint status and add history notes."""
    payload = {
        "status": "In Progress",
        "note": "Field engineer dispatched with desilting truck.",
    }
    resp = client.patch("/api/complaints/CMP-001/status", json=payload, headers=admin_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "In Progress"
    latest_event = data["timeline"][-1]
    assert latest_event["status"] == "In Progress"
    assert "desilting truck" in latest_event["note"]

def test_citizen_cannot_update_complaint_status(client, citizen_auth_headers):
    """Verify non-admin citizens receive 403 Forbidden when attempting status changes."""
    payload = {"status": "Resolved", "note": "Citizen trying to self-resolve"}
    resp = client.patch("/api/complaints/CMP-001/status", json=payload, headers=citizen_auth_headers)
    assert resp.status_code == 403
    assert "Administrator privileges required" in resp.json()["detail"]

def test_get_complaint_history(client):
    """Verify complaint audit history retrieval."""
    resp = client.get("/api/complaints/CMP-001/history")
    assert resp.status_code == 200
    history = resp.json()
    assert isinstance(history, list)
    assert len(history) >= 1
    assert history[0]["status"] == "Submitted"
