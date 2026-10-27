def test_submit_idea_authenticated(client, citizen_auth_headers):
    """Test citizen proposing a solution for an existing problem."""
    payload = {
        "complaint_id": "CMP-001",
        "title": "Install Smart Ultrasonic Water-Level Sensors",
        "explanation": "Mount solar-powered ultrasonic distance sensors inside the stormwater inlet. Alerts maintenance dispatch before water spills onto carriageway.",
        "expected_benefit": "Gives 4 hours advance notice of silt buildup and prevents flooding.",
        "tags": ["IoT", "Early Warning", "Drainage"],
    }
    resp = client.post("/api/ideas", json=payload, headers=citizen_auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "Pending Review"
    assert data["submitted_by"] == "priya.sharma@example.com"
    assert "IDEA-" in data["id"]

def test_submit_idea_invalid_complaint_404(client, citizen_auth_headers):
    """Test submission for non-existent complaint returns 404."""
    payload = {
        "complaint_id": "CMP-NON-EXISTENT-999",
        "title": "Some practical idea title here",
        "explanation": "This is a detailed explanation that meets the minimum length requirement.",
        "expected_benefit": "This is the expected benefit that meets minimum length.",
    }
    resp = client.post("/api/ideas", json=payload, headers=citizen_auth_headers)
    assert resp.status_code == 404
    assert "does not exist" in resp.json()["detail"]

def test_admin_review_idea(client, admin_auth_headers):
    """Test administrator approving a citizen proposal with feedback."""
    payload = {
        "status": "Selected for Implementation",
        "admin_feedback": "Approved for ward capital budget allocation under FY2026 civic improvements.",
    }
    resp = client.patch("/api/ideas/IDEA-001/review", json=payload, headers=admin_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "Selected for Implementation"
    assert "FY2026 civic improvements" in data["admin_feedback"]

def test_citizen_cannot_review_idea(client, citizen_auth_headers):
    """Verify non-admin citizens receive 403 Forbidden when trying to review ideas."""
    payload = {"status": "Approved"}
    resp = client.patch("/api/ideas/IDEA-001/review", json=payload, headers=citizen_auth_headers)
    assert resp.status_code == 403

def test_upvote_idea(client):
    """Verify community upvote increments counter."""
    resp1 = client.get("/api/ideas/complaint/CMP-001")
    target_idea = resp1.json()[0]
    target_id = target_idea["id"]
    initial_upvotes = target_idea["upvotes"]
    
    resp2 = client.post(f"/api/ideas/{target_id}/upvote")
    assert resp2.status_code == 200
    assert resp2.json()["upvotes"] == initial_upvotes + 1
