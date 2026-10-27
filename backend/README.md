# Ripple — Backend Development (Phase 2)

**Urban Resource Coordination and Predictive Management System**  
*College Problem Statement:* "To observe urban resource usage and demonstrate a very basic system for better coordination."

---

## 1. Architecture Overview

The Ripple backend is implemented using **FastAPI**, **Pydantic v2**, and Python's standard logging facility. It models urban infrastructure interdependencies, predicts cascading ripple failures, coordinates cross-departmental utility excavation (Dig-Once), audits silent/under-reported wards, and provides role-based citizen and administrative portals.

### Storage Architecture Scope (Phase 2)
> [!NOTE]
> **Database Scope for Phase 2:**
> To enable rapid independent testing and frontend iteration without requiring an external MongoDB server or daemon, Phase 2 utilizes an explicit **Development In-Memory Store** (`app/repositories/in_memory_store.py`).
>
> All data mutations are stored in memory and reset when the server restarts. Service and repository interfaces are decoupled so that MongoDB persistence can be introduced seamlessly in Phase 3 without modifying the API route contracts.

---

## 2. Quickstart & Installation

### Prerequisites
- Python 3.10+ (Tested with Python 3.14.3)
- pip

### Setup Virtual Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Backend Server
```bash
# Start Uvicorn development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Server endpoints will be live at:
- **API Base:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **ReDoc Documentation:** `http://127.0.0.1:8000/redoc`
- **Health Check:** `http://127.0.0.1:8000/api/health`

---

## 3. Pre-Seeded Demonstration Accounts

For presentation and automated testing, the following accounts are pre-seeded in the development repository:

| Role | Email | Password | Scope / Permissions |
| :--- | :--- | :--- | :--- |
| **Citizen** | `priya.sharma@example.com` | `DemoPass2026!` | Submit complaints, propose community ideas, track personal reports, view public feed |
| **Admin** | `admin.deshmukh@ripple.gov` | `DemoPass2026!` | Review idea proposals, update complaint status, schedule work orders, audit silent wards |

---

## 4. API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/signup` — Public citizen registration (strictly assigns `citizen` role; hashes password via HMAC-SHA256).
- `POST /api/auth/login` — Issues signed JWT Bearer access token.
- `GET /api/auth/me` — Protected endpoint returning caller profile without sensitive hash.
- `PATCH /api/auth/me` — Update citizen preferences and contact details.

### 📋 Complaints & Urban Issues (`/api/complaints`)
- `POST /api/complaints` — Submit a new urban problem (auto-calculates downstream risk and priority score).
- `GET /api/complaints/my` — Retrieve reports submitted by the authenticated caller.
- `GET /api/complaints/public` — Public civic feed with sensitive personal contact info redacted.
- `GET /api/complaints/{complaint_id}` — Detailed report view.
- `PATCH /api/complaints/{complaint_id}/status` — Admin-only official status updates and audit timeline appending.
- `GET /api/complaints/{complaint_id}/history` — Full audit trail of status progression.

### 💡 Community Ideas (`/api/ideas`)
- `GET /api/ideas` — Browse civic solution proposals.
- `POST /api/ideas` — Submit practical idea linked to a complaint.
- `GET /api/ideas/complaint/{complaint_id}` — View ideas attached to a specific issue.
- `GET /api/ideas/my` — View user's submitted proposals.
- `PATCH /api/ideas/{idea_id}/review` — Admin-only status review (Approve, Reject, Implementation).
- `POST /api/ideas/{idea_id}/upvote` — Upvote community suggestions.

### 🌊 Predictions & Ripple Effects (`/api/predictions`)
- `POST /api/predictions/analyze/{complaint_id}` — Algorithmic multi-step failure cascade simulation.
- `GET /api/predictions/{complaint_id}` — Retrieve cascade projection, avoidable costs, and preventive actions.
- `GET /api/priority-queue` — Urban problem queue ranked by downstream failure risk and weather sensitivity.

### 🚜 Urban Resources (`/api/resources`)
- `GET /api/resources` — Urban assets registry (drains, roads, waste nodes, potable pipelines, streetlights).
- `POST /api/resources` — Register new physical asset.
- `PATCH /api/resources/{resource_id}` — Update asset condition and inspection dates.

### 🚧 Coordination & Dig-Once (`/api/work-orders`)
- `GET /api/work-orders` — Scheduled departmental road and utility work orders.
- `POST /api/work-orders` — Schedule utility work order.
- `GET /api/work-orders/conflicts` — Dig-Once Conflict Engine detecting overlapping road excavation.

### 🔍 Equity & Silent Wards (`/api/silent-wards`)
- `GET /api/silent-wards` — Identify geographic wards with inspection gaps or low reporting density.

### 📊 Analytics & Notifications
- `GET /api/analytics/overview` — Platform summary metrics, avoidable cost estimates, and risk totals.
- `GET /api/analytics/complaints` — Category, risk level, and status breakdowns.
- `GET /api/analytics/resources` — Asset condition and department distributions.
- `GET /api/notifications` — Retrieve user notifications.
- `PATCH /api/notifications/{id}/read` — Mark notification read.
- `PATCH /api/notifications/read-all` — Mark all user notifications read.
- `GET /api/health` — Platform health check (returns `storage_mode: development_in_memory`).

---

## 5. Automated Testing

The backend includes a comprehensive `pytest` test suite covering authentication, authorization enforcement, complaint lifecycles, ripple simulations, Dig-Once detection, and test isolation.

To run all tests:
```bash
pytest -v
```

All 30 tests pass out of the box without requiring external database instances or network connectivity.
