# RIPPLE — Urban Resource Coordination & Management System

> **"Predict Urban Problems Before They Cascade."**
> A modern, full-stack smart-city analytics and coordination platform demonstrating how urban infrastructure assets (roads, drains, waste points, water pipelines, parking areas) are interconnected, predicting cascading failures, and prioritizing preventive municipal interventions.

---

## 1. System Overview & Core Philosophy

Cities traditionally manage urban infrastructure in isolated administrative silos. The Drainage Department cleans drains, Roads handles potholes, Water Supply repairs pipelines, and Waste Management hauls dumpsters—frequently unaware of how failures in one system trigger catastrophic collapse in another.

**Ripple** bridges this gap by modeling the municipal asset landscape as an active, directed causal dependency graph using **NetworkX**, integrated with real-time weather trigger telemetry and persistent local **MongoDB** storage.

### Core Predictive Capabilities:
1. **Cascade Prediction Engine**: Traces failure chains (e.g. *Waste Overflow* $\to$ *Grate Blockage* $\to$ *Waterlogging under Rainfall* $\to$ *Asphalt Shear Failure* $\to$ *Arterial Traffic Gridlock*). Employs a mathematically sound **Noisy-OR multi-path probability propagation model** and calculates preventable damage vs. intervention cost.
2. **Priority Queue (Dual Ranking)**: Compares traditional severity-based triage against Ripple predictive ranking, proving why a moderate-severity issue (severity 3) jumps to Rank #1 when it threatens $50,000+ in downstream damages.
3. **Dig-Once Detector**: Automatically identifies cross-department utility permits scheduled on the same road segment with overlapping execution windows (e.g., Water Department trenching right before Telecom 5G conduit laying) and calculates potential duplicate repaving savings.
4. **Silent Ward Detector**: Audits municipal sectors that have abnormally low public complaints but high infrastructure vulnerability and poor inspection coverage.
5. **Citizen Reporting & Admin Triage**: Allows residents to report infrastructure problems, receive unique tracking codes (`RPL-2026-XXXX`), and track timeline updates without exposing internal operational notes.

---

## 2. Technology Stack

### Frontend:
- **React.js 19** with **Vite** and **TypeScript**
- **Tailwind CSS** with a custom dark navy smart-city analytics theme
- **React Leaflet** & **Leaflet** with CartoDB Dark Matter / OSM tiles
- **Recharts** for municipal condition and severity distribution charts
- **Lucide React** for icons
- **Axios** for REST API communication
- **Framer Motion** for smooth transitions

### Backend:
- **Python 3.10+** (tested on Python 3.14)
- **FastAPI** for high-performance async REST APIs
- **Uvicorn** ASGI server
- **PyMongo** for MongoDB integration
- **NetworkX** for urban resource graph modeling and traversal
- **Pydantic v2** for robust request/response validation
- **PyJWT** & **Passlib/Hashlib** for secure admin token authentication

### Database:
- **MongoDB** (Local instance: `mongodb://localhost:27017`)
- **Database Name**: `ripple_urban_db`

---

## 3. Project Directory Structure

```
ripple/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entry point & CORS
│   │   ├── config.py                # Environment configuration
│   │   ├── database.py              # MongoDB connection & collection indexes
│   │   ├── schemas/                 # Pydantic data schemas
│   │   │   ├── asset_schemas.py
│   │   │   ├── issue_schemas.py
│   │   │   ├── cascade_schemas.py
│   │   │   ├── priority_schemas.py
│   │   │   ├── dig_once_schemas.py
│   │   │   ├── silent_ward_schemas.py
│   │   │   ├── report_schemas.py
│   │   │   ├── weather_schemas.py
│   │   │   └── analytics_schemas.py
│   │   ├── repositories/            # MongoDB queries and data access
│   │   │   ├── asset_repo.py
│   │   │   ├── issue_repo.py
│   │   │   ├── cascade_repo.py
│   │   │   ├── work_order_repo.py
│   │   │   ├── ward_repo.py
│   │   │   ├── inspection_repo.py
│   │   │   └── report_repo.py
│   │   ├── services/                # Graph algorithms and business logic
│   │   │   ├── graph_service.py     # NetworkX urban resource graph construction
│   │   │   ├── cascade_service.py   # Noisy-OR propagation & trigger evaluation
│   │   │   ├── priority_service.py  # Dual ranking & rank shift calculation
│   │   │   ├── dig_once_service.py  # Schedule collision detection
│   │   │   ├── silent_ward_service.py # Neglect risk scoring
│   │   │   ├── weather_service.py   # Simulation scenario telemetry
│   │   │   └── auth_service.py      # Admin credentials & JWT tokens
│   │   ├── routes/                  # REST API route handlers
│   │   └── utils/                   # Geo haversine & security helpers
│   ├── scripts/
│   │   └── seed_database.py         # Complete demonstration seed script
│   ├── tests/                       # Pytest automated test suite (11 test cases)
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Scenario selector & weather pill
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   ├── StatCard.tsx         # Metric KPI card
│   │   │   ├── ResourceMap.tsx      # Interactive Leaflet urban map
│   │   │   ├── CascadeGraphVisualizer.tsx # Graph flow diagram
│   │   │   └── DemoNotice.tsx       # Demonstration disclaimers
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx      # Public landing page
│   │   │   ├── OverviewDashboard.tsx# Main dashboard overview
│   │   │   ├── MapExplorerPage.tsx  # Interactive map exploration
│   │   │   ├── CascadeExplorerPage.tsx # Cascade prediction workspace
│   │   │   ├── PriorityQueuePage.tsx# Dual ranking comparison
│   │   │   ├── DigOncePage.tsx      # Dig-Once conflict coordinator
│   │   │   ├── SilentWardPage.tsx   # Silent ward auditor
│   │   │   ├── ReportsAnalyticsPage.tsx # Recharts reports & CSV export
│   │   │   ├── CitizenPortalPage.tsx# Citizen report & tracking portal
│   │   │   ├── AdminPortalPage.tsx  # Command triage & dispatch
│   │   │   └── SettingsPage.tsx     # System configuration
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   ├── services/
│   │   │   └── api.ts               # Axios API client
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── .env
│   └── .env.example
└── README.md
```

---

## 4. Setup and Installation Guide

### Prerequisites:
1. **Python 3.10+** (tested on Python 3.14)
2. **Node.js 18+** and **npm**
3. **MongoDB** installed and actively running on `localhost:27017`

### Step 1: Clone or Navigate to the Project
```bash
cd "C:\Users\PAYAL JAISWAL\.gemini\antigravity\scratch\ripple"
```

### Step 2: Backend Setup
1. Navigate to the backend directory and install Python dependencies:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```
2. Verify or edit `.env` configuration (default points to local MongoDB):
   ```ini
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB_NAME=ripple_urban_db
   API_HOST=127.0.0.1
   API_PORT=8000
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   JWT_SECRET=ripple_urban_super_secret_key_demo_2026
   DEFAULT_CITY=Mumbai
   DEFAULT_LAT=19.0760
   DEFAULT_LNG=72.8777
   SIMULATED_RAINFALL=moderate
   ```
3. Populate MongoDB with demonstration data:
   ```bash
   python scripts/seed_database.py
   ```
   *This seeds 14 interconnected urban assets, 6 domain causal rules, active demonstration tickets, overlapping work orders, and 5 ward profiles.*

4. Run the backend tests:
   ```bash
   python -m pytest tests -v
   ```
   *(All 11 tests covering health, cascade propagation, weather triggers, priority ranking, Dig-Once, silent wards, and report tracking will pass).*

5. Start the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   API Swagger documentation will be live at: **http://127.0.0.1:8000/docs**

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd "C:\Users\PAYAL JAISWAL\.gemini\antigravity\scratch\ripple\frontend"
   ```
2. Install frontend packages (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
4. Open your browser and navigate to:
   **http://127.0.0.1:5173**

---

## 5. Algorithmic Methodologies

### A. Graph-Based Cascade Reasoning Engine
Each urban asset is modeled as a node $v \in V$ in a directed graph $G = (V, E)$. Causal relationships are directed edges $e = (u, v) \in E$ with attributes:
- **Baseline Probability** $P(e) \in [0, 1]$
- **Expected Time Delay** $\Delta t \text{ (hours)}$
- **Trigger Conditions** (e.g. `rainfall`, `heavy_rainfall`)

#### Weather Trigger Evaluation:
When the operator selects a weather scenario:
- `low` (2 mm/h): Rainfall-dependent edge probabilities are multiplied by $0.35\times$.
- `moderate` (20 mm/h): Baseline $1.0\times$ multiplier.
- `heavy` (65 mm/h): Precipitation surcharge multiplier of $1.45\times$ (clamped $\le 0.98$).

#### Noisy-OR Probability Combination:
For any downstream consequence node reached via multiple paths:
$$P_{\text{combined}}(v) = 1 - \prod_{\text{path } i} \left(1 - \prod_{e \in \text{path } i} P(e)\right)$$
This combines multiple causal pathways without over-counting correlated risks.

---

### B. Predictive Priority Ranking Formula
Ripple evaluates priority by expected preventable damage and leverage rather than immediate severity alone:
$$\text{Priority Score} = \max\left(0, (\text{Expected Preventable Impact} \times \text{Urgency Factor} \times \text{Confidence Factor}) - \text{Cost Penalty}\right)$$
Where:
- $\text{Expected Preventable Impact} = \sum (\text{Downstream Impact}_i \times P_i) \times 10$
- $\text{Urgency Factor} = \frac{1}{1 + \frac{\text{Delay Hours}}{24}}$
- $\text{Confidence Factor} = \text{Average evidence confidence of applicable rules}$
- $\text{Cost Penalty} = \left(\frac{\text{Intervention Cost}}{\$50,000}\right) \times 4.0$

---

### C. Dig-Once Conflict Detection
Scans planned work orders across all utility departments:
1. Matches identical `road_segment_id` (or spatial proximity within 150m).
2. Evaluates date intervals: $\max(S_1, S_2) \le \min(E_1, E_2)$.
3. Flags cross-department overlaps and calculates potential duplicate repaving costs avoided ($32,000 + 0.45 \times \min(C_1, C_2)$).

---

### D. Silent Ward Risk Scoring
Flags sectors receiving few complaints despite severe underlying neglect:
$$\text{Silent Risk} = (\text{Inspection Deficit} \times 35) + (\text{Reporting Deficit} \times \text{Vulnerability} \times 35) + (\text{Time Penalty} \times 25) + (\text{Data Deficit} \times 15)$$
A ward with 0 complaints, 21% inspection coverage, and 140 days since its last audit is classified as **High Risk**, enabling proactive field audit scheduling.

---

## 6. Default Demonstration Credentials

- **Admin Portal Access**:
  - **Username**: `admin`
  - **Password**: `ripple@2026`
  - Role: `Chief Urban Controller`

- **Sample Tracking Codes for Public Portal**:
  - `RPL-2026-K7M9Q` (Drain overflow near BKC Gate 3 — Status: In Progress)
  - `RPL-2026-B4T2W` (Water pipeline pressure drop near Dadar TT — Status: Assigned)

---

## 7. Key REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service and MongoDB status verification |
| `GET` | `/api/assets` | Filterable list of urban assets |
| `POST` | `/api/assets` | Register new urban infrastructure asset |
| `GET` | `/api/issues` | Active urban problem tickets |
| `POST` | `/api/cascade/analyze` | Execute graph cascade prediction under rainfall triggers |
| `GET` | `/api/priority/compare` | Dual ranking comparison (Severity vs. Predictive) |
| `GET` | `/api/dig-once/conflicts` | Detect overlapping excavation permits |
| `GET` | `/api/work-orders` | List and manage utility work orders |
| `GET` | `/api/silent-wards` | Transparent silent ward neglect scoring |
| `POST` | `/api/inspections` | Schedule municipal field audit |
| `POST` | `/api/public-reports` | Public citizen issue submission |
| `GET` | `/api/public-reports/track/{code}` | Track report status by reference code |
| `PATCH` | `/api/admin/reports/{id}/status`| Administrative triage and department dispatch |
| `GET` | `/api/weather` | Current weather scenario telemetry |
| `POST` | `/api/weather/scenario` | Switch rainfall scenario (low, moderate, heavy) |
| `GET` | `/api/analytics/summary` | Dashboard statistics, KPI cards, and Recharts aggregations |

---

## 8. Demonstration Notice

> **IMPORTANT**: All asset coordinates, failure chains, probabilities, and financial savings figures presented in this demonstration represent calibrated algorithmic simulation models for urban resource coordination. In real-world municipal engineering deployments, sensor telemetry and local engineering validation should be integrated.
