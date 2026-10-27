def test_get_work_orders(client):
    """Test retrieving scheduled infrastructure work orders."""
    resp = client.get("/api/work-orders")
    assert resp.status_code == 200
    orders = resp.json()
    assert len(orders) >= 2
    for o in orders:
        assert "road_name" in o
        assert "responsible_department" in o

def test_detect_dig_once_conflicts(client):
    """
    Test Dig-Once Coordination Engine detects overlapping excavation schedules
    on the same road segment from different departments.
    """
    resp = client.get("/api/work-orders/conflicts")
    assert resp.status_code == 200
    conflicts = resp.json()
    assert len(conflicts) >= 1
    c = conflicts[0]
    assert "BKC Central Avenue" in c["road_name"]
    assert len(c["involved_departments"]) >= 2
    assert c["overlap_days"] > 0
    assert c["estimated_duplicate_cost"] >= 100000
    assert "joint trenching" in c["recommended_coordination"].lower()
