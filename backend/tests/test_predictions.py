def test_prediction_analysis(client):
    """Test algorithmic ripple effect simulation for a reported urban issue."""
    resp = client.post("/api/predictions/analyze/CMP-001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["complaint_id"] == "CMP-001"
    assert data["risk_level"] in ("High", "Critical")
    assert len(data["steps"]) >= 3
    assert data["estimated_avoidable_cost"] > 0
    assert len(data["possible_consequences"]) >= 2
    assert "recommended_preventive_action" in data
    assert len(data["coordinating_departments"]) >= 2

def test_priority_queue_sorting(client):
    """Verify priority queue ranks highest downstream ripple risks first."""
    resp = client.get("/api/priority-queue")
    assert resp.status_code == 200
    queue = resp.json()
    assert len(queue) >= 3
    assert queue[0]["rank"] == 1
    # Verify sorted descending by priority score
    scores = [item["priority_score"] for item in queue]
    assert scores == sorted(scores, reverse=True)
