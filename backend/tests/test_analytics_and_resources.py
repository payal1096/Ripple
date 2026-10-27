def test_analytics_overview(client):
    """Test platform operational statistics aggregation."""
    resp = client.get("/api/analytics/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_complaints"] >= 4
    assert data["open_complaints"] >= 3
    assert data["estimated_avoidable_cost"] > 100000
    assert data["storage_mode"] == "development_in_memory"

def test_resources_registry(client):
    """Test querying urban infrastructure physical resources."""
    resp = client.get("/api/resources")
    assert resp.status_code == 200
    resources = resp.json()
    assert len(resources) >= 4
    first = resources[0]
    assert "name" in first
    assert "condition" in first
    assert "responsible_dept" in first

def test_notifications_lifecycle(client, citizen_auth_headers):
    """Test retrieving and marking notifications as read."""
    resp = client.get("/api/notifications", headers=citizen_auth_headers)
    assert resp.status_code == 200
    notifs = resp.json()
    assert len(notifs) >= 1
    target_id = notifs[0]["id"]

    patch_resp = client.patch(f"/api/notifications/{target_id}/read", headers=citizen_auth_headers)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["is_read"] is True
