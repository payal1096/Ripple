def test_get_silent_wards(client):
    """
    Test retrieval of under-reported or silent wards where low complaint volume
    masks potential deferred maintenance.
    """
    resp = client.get("/api/silent-wards")
    assert resp.status_code == 200
    wards = resp.json()
    assert len(wards) >= 3
    first = wards[0]
    assert "area_name" in first
    assert "ward_code" in first
    assert "status_label" in first
    assert "critical_assets_at_risk" in first
    assert len(first["critical_assets_at_risk"]) >= 1

def test_silent_wards_filter_by_city(client):
    """Verify city filtering on silent ward analysis."""
    resp = client.get("/api/silent-wards?city=Mumbai")
    assert resp.status_code == 200
    wards = resp.json()
    assert len(wards) >= 1
    for w in wards:
        assert w["city"] == "Mumbai"
