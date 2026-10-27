import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import os
os.environ["STORAGE_MODE"] = "development_in_memory"
from app.core.config import settings
settings.STORAGE_MODE = "development_in_memory"

from app.main import app
from app.repositories.in_memory_store import in_memory_store

@pytest.fixture(autouse=True)
def reset_in_memory_store():
    """
    Ensure complete test isolation by resetting the development
    in-memory repository before every test run.
    """
    in_memory_store.reset()
    yield
    in_memory_store.reset()

@pytest.fixture(scope="session")
def client():
    """Test client instance for exercising FastAPI endpoints."""
    with TestClient(app) as c:
        yield c

@pytest.fixture
def citizen_auth_headers(client: TestClient):
    """Obtain authenticated JWT Bearer headers for the demo citizen account."""
    resp = client.post(
        "/api/auth/login",
        json={"email": "priya.sharma@example.com", "password": "DemoPass2026!"},
    )
    assert resp.status_code == 200, f"Citizen login failed: {resp.text}"
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_auth_headers(client: TestClient):
    """Obtain authenticated JWT Bearer headers for the demo admin account."""
    resp = client.post(
        "/api/auth/login",
        json={"email": "admin.deshmukh@ripple.gov", "password": "DemoPass2026!"},
    )
    assert resp.status_code == 200, f"Admin login failed: {resp.text}"
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
