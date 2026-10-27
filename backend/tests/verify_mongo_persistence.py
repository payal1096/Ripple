"""
MONGODB PERSISTENCE VERIFICATION SUITE
======================================
Tests live connection to MongoDB (ripple_db), verifies initial collection seeding,
submits a test complaint through the API, directly queries the MongoDB collection
to verify database persistence, and retrieves it again through the API.
"""

import sys
import os
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Force MongoDB storage mode
os.environ["STORAGE_MODE"] = "mongodb"
os.environ["MONGODB_URI"] = "mongodb://localhost:27017"
os.environ["MONGO_DB_NAME"] = "ripple_db"

import pymongo
from fastapi.testclient import TestClient
from app.core.config import settings
from app.database import connect_to_mongo, get_db, ping_db, close_mongo_connection
from app.main import app

def run_verification():
    print("=================================================================")
    print("RIPPLE - PHASE 3: LIVE MONGODB PERSISTENCE VERIFICATION")
    print(f"Target MongoDB URI: {settings.MONGODB_URI}")
    print(f"Target Database:    {settings.MONGO_DB_NAME}")
    print("=================================================================")

    # 1. Connect to MongoDB
    connect_to_mongo()
    assert ping_db() is True, "MongoDB ping failed! Ensure MongoDB server is running on localhost:27017."
    print("[OK] [1/6] Successfully connected and pinged MongoDB.")

    # 2. Inspect ripple_db directly via PyMongo
    client = pymongo.MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGO_DB_NAME]
    
    print("\n[OK] [2/6] Inspecting ripple_db collections:")
    collections = db.list_collection_names()
    print(f"  Existing collections in ripple_db: {collections}")
    for col_name in ["users", "complaints", "resources", "ideas", "work_orders", "silent_wards", "notifications"]:
        count = db[col_name].count_documents({})
        print(f"  - Collection '{col_name}': {count} documents")
        assert count > 0, f"Collection '{col_name}' should have seeded documents!"

    # 3. Test API Health Check with live MongoDB
    with TestClient(app) as test_client:
        health_resp = test_client.get("/api/health")
        assert health_resp.status_code == 200
        health_data = health_resp.json()
        print(f"\n[OK] [3/6] API Health Check response:")
        print(f"  status:          {health_data['status']}")
        print(f"  storage_mode:    {health_data['storage_mode']}")
        print(f"  mongo_connected: {health_data['mongo_connected']}")
        print(f"  database:        {health_data['database']}")
        assert health_data["mongo_connected"] is True
        assert health_data["storage_mode"] == "mongodb"
        assert health_data["database"] == "ripple_db"

        # 4. Authenticate Demo Citizen
        login_resp = test_client.post(
            "/api/auth/login",
            json={"email": "priya.sharma@example.com", "password": "DemoPass2026!"},
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        auth_data = login_resp.json()
        token = auth_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("\n[OK] [4/6] Citizen authentication verified against MongoDB:")
        print(f"  Logged in as: {auth_data['user']['name']} ({auth_data['user']['email']})")

        # 5. Insert Test Complaint via API
        test_payload = {
            "title": "Persistent High-Pressure Water Seepage on L.B.S. Marg",
            "description": "Continuous subterranean freshwater leakage surfacing through road fissures near Kurla junction. Subgrade erosion observed.",
            "category": "Water Supply",
            "city": "Mumbai",
            "locality": "Kurla West",
            "street_or_landmark": "Lal Bahadur Shastri Marg, Pillar 14",
            "severity": 4,
        }
        create_resp = test_client.post("/api/complaints", json=test_payload, headers=headers)
        assert create_resp.status_code == 201, f"Complaint creation failed: {create_resp.text}"
        created_data = create_resp.json()
        complaint_id = created_data["id"]
        ref_id = created_data["ref_id"]
        print(f"\n[OK] [5/6] Test complaint submitted via API:")
        print(f"  Complaint ID:     {complaint_id}")
        print(f"  Reference ID:     {ref_id}")
        print(f"  Title:            {created_data['title']}")
        print(f"  Risk Level:       {created_data['risk_level']}")
        print(f"  Priority Score:   {created_data['priority_score']}")

        # 6. Verify directly in MongoDB collection ripple_db.complaints
        print(f"\n[OK] [6/6] Verifying persistence in MongoDB ripple_db.complaints...")
        direct_mongo_doc = db.complaints.find_one({"id": complaint_id})
        assert direct_mongo_doc is not None, f"Document with id '{complaint_id}' was NOT found in MongoDB!"
        print(f"  Direct MongoDB document found:")
        print(f"  - _id:          {direct_mongo_doc['_id']}")
        print(f"  - id:           {direct_mongo_doc['id']}")
        print(f"  - title:        {direct_mongo_doc['title']}")
        print(f"  - category:     {direct_mongo_doc['category']}")
        print(f"  - status:       {direct_mongo_doc['status']}")
        print(f"  - reported_by:  {direct_mongo_doc['reported_by_name']}")
        print(f"  - timeline len: {len(direct_mongo_doc['timeline'])}")

        # Verify round-trip retrieval via API
        fetch_resp = test_client.get(f"/api/complaints/{complaint_id}", headers=headers)
        assert fetch_resp.status_code == 200
        fetched_data = fetch_resp.json()
        assert fetched_data["id"] == complaint_id
        assert fetched_data["title"] == test_payload["title"]
        print(f"  Round-trip retrieval via GET /api/complaints/{complaint_id} verified perfectly!")

        # Verify confirmation notification in MongoDB
        notif_doc = db.notifications.find_one({"related_id": complaint_id})
        assert notif_doc is not None, "Notification document was NOT found in MongoDB!"
        print(f"  Related notification '{notif_doc['id']}' verified in MongoDB ripple_db.notifications!")

    print("\n=================================================================")
    print("ALL MONGODB PERSISTENCE VERIFICATIONS PASSED SUCCESSFULLY (100%)!")
    print("=================================================================")

if __name__ == "__main__":
    try:
        run_verification()
    finally:
        close_mongo_connection()
