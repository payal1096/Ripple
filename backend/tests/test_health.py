def test_health_check(client):
    """Test health check returns operational status without requiring MongoDB."""
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["storage_mode"] == "development_in_memory"
    assert data["mongo_connected"] is False
    assert "Ripple" in data["service"]

def test_root_endpoint(client):
    """Test root index returns documentation link and storage mode."""
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "operational"
    assert data["documentation"] == "/docs"
    assert data["storage_mode"] == "development_in_memory"
