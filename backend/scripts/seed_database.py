import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add backend to path so we can import app modules
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from pymongo import MongoClient
from app.config import settings
from app.utils.security import hash_password

def seed_database(reset: bool = True):
    print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[settings.MONGO_DB_NAME]
    print(f"Connected to database: {settings.MONGO_DB_NAME}")

    if reset:
        print("Clearing existing demonstration collections...")
        db.urban_assets.delete_many({})
        db.issues.delete_many({})
        db.cascade_rules.delete_many({})
        db.cascade_predictions.delete_many({})
        db.work_orders.delete_many({})
        db.wards.delete_many({})
        db.inspections.delete_many({})
        db.public_reports.delete_many({})
        db.users.delete_many({})

    # 1. Seed Admin User
    print("Seeding admin accounts...")
    db.users.update_one(
        {"username": "admin"},
        {"$set": {
            "username": "admin",
            "password_hash": hash_password("ripple@2026"),
            "name": "Chief Urban Controller",
            "role": "admin",
            "department": "Municipal Command",
            "email": "command@ripple.gov.in",
            "created_at": datetime.utcnow()
        }},
        upsert=True
    )

    # 2. Seed Wards
    print("Seeding municipal wards...")
    wards_data = [
        {
            "ward_id": "WARD-01",
            "name": "Bandra Kurla Urban Complex",
            "population": 65000,
            "complaint_count": 28,
            "inspection_coverage_pct": 82.0,
            "infrastructure_health_score": 84.0,
            "days_since_last_inspection": 24,
            "data_completeness_pct": 95.0,
            "total_assets_count": 42,
            "vulnerable_assets_count": 4,
            "coordinates": [72.8680, 19.0665],
            "last_inspected_at": (datetime.utcnow() - timedelta(days=24)).strftime("%Y-%m-%d")
        },
        {
            "ward_id": "WARD-02",
            "name": "Dadar Central Junction",
            "population": 95000,
            "complaint_count": 19,
            "inspection_coverage_pct": 64.0,
            "infrastructure_health_score": 68.0,
            "days_since_last_inspection": 58,
            "data_completeness_pct": 88.0,
            "total_assets_count": 56,
            "vulnerable_assets_count": 9,
            "coordinates": [72.8430, 19.0178],
            "last_inspected_at": (datetime.utcnow() - timedelta(days=58)).strftime("%Y-%m-%d")
        },
        {
            "ward_id": "WARD-03",
            "name": "Dharavi Transit Corridor",
            "population": 145000,
            "complaint_count": 3,  # Abnormally low complaints despite high population and poor infrastructure!
            "inspection_coverage_pct": 21.0,
            "infrastructure_health_score": 46.0,
            "days_since_last_inspection": 142,
            "data_completeness_pct": 52.0,
            "total_assets_count": 68,
            "vulnerable_assets_count": 27,
            "coordinates": [72.8550, 19.0400],
            "last_inspected_at": (datetime.utcnow() - timedelta(days=142)).strftime("%Y-%m-%d")
        },
        {
            "ward_id": "WARD-04",
            "name": "Bandra West Coastal Boulevard",
            "population": 72000,
            "complaint_count": 34,
            "inspection_coverage_pct": 91.0,
            "infrastructure_health_score": 92.0,
            "days_since_last_inspection": 14,
            "data_completeness_pct": 98.0,
            "total_assets_count": 38,
            "vulnerable_assets_count": 2,
            "coordinates": [72.8280, 19.0550],
            "last_inspected_at": (datetime.utcnow() - timedelta(days=14)).strftime("%Y-%m-%d")
        },
        {
            "ward_id": "WARD-05",
            "name": "Kurla Industrial Sub-basin",
            "population": 115000,
            "complaint_count": 5,  # Classic Silent Ward
            "inspection_coverage_pct": 28.0,
            "infrastructure_health_score": 51.0,
            "days_since_last_inspection": 175,
            "data_completeness_pct": 58.0,
            "total_assets_count": 50,
            "vulnerable_assets_count": 18,
            "coordinates": [72.8790, 19.0720],
            "last_inspected_at": (datetime.utcnow() - timedelta(days=175)).strftime("%Y-%m-%d")
        }
    ]
    for w in wards_data:
        db.wards.update_one({"ward_id": w["ward_id"]}, {"$set": w}, upsert=True)

    # 3. Seed Urban Assets with realistic interconnected topology
    print("Seeding urban infrastructure assets...")
    assets_data = [
        # Sector A: The Primary Demonstration Cascade Chain (BKC Junction)
        {
            "asset_id": "WASTE-BIN-01",
            "asset_type": "waste_point",
            "name": "Commercial Waste Catchment #1",
            "ward_id": "WARD-01",
            "location": {"type": "Point", "coordinates": [72.8660, 19.0655]},
            "condition": "warning",
            "severity": 3,
            "connected_assets": ["DRAIN-001"],
            "metadata": {"capacity_tons": 5.0, "current_fill_pct": 92}
        },
        {
            "asset_id": "DRAIN-001",
            "asset_type": "drain",
            "name": "BKC Arterial Box Culvert #1",
            "ward_id": "WARD-01",
            "location": {"type": "Point", "coordinates": [72.8672, 19.0660]},
            "condition": "warning",
            "severity": 3,
            "connected_assets": ["ROAD-104", "DRAIN-002"],
            "metadata": {"culvert_width_meters": 2.5, "hydraulic_load_pct": 78}
        },
        {
            "asset_id": "ROAD-104",
            "asset_type": "road",
            "name": "BKC Central Avenue (Segment R-104)",
            "ward_id": "WARD-01",
            "location": {"type": "Point", "coordinates": [72.8685, 19.0670]},
            "condition": "warning",
            "severity": 3,
            "connected_assets": ["ROAD-105", "PARK-301"],
            "metadata": {"lanes": 6, "daily_pcu_traffic": 45000, "surface_type": "bituminous"}
        },
        {
            "asset_id": "ROAD-105",
            "asset_type": "road",
            "name": "BKC Express Flyover Connector",
            "ward_id": "WARD-01",
            "location": {"type": "Point", "coordinates": [72.8710, 19.0682]},
            "condition": "healthy",
            "severity": 1,
            "connected_assets": [],
            "metadata": {"lanes": 4, "is_critical_artery": True}
        },
        {
            "asset_id": "PARK-301",
            "asset_type": "parking",
            "name": "BKC Financial District Public Parking",
            "ward_id": "WARD-01",
            "location": {"type": "Point", "coordinates": [72.8690, 19.0650]},
            "condition": "healthy",
            "severity": 1,
            "connected_assets": ["ROAD-104"],
            "metadata": {"vehicle_slots": 450, "underground_levels": 1}
        },

        # Sector B: Water Pipeline & Sub-base Erosion Chain
        {
            "asset_id": "PIPE-201",
            "asset_type": "water_pipeline",
            "name": "Dadar Main 600mm Potable Feeder",
            "ward_id": "WARD-02",
            "location": {"type": "Point", "coordinates": [72.8420, 19.0165]},
            "condition": "high_priority",
            "severity": 4,
            "connected_assets": ["ROAD-102", "DRAIN-003"],
            "metadata": {"pressure_bar": 4.5, "diameter_mm": 600, "material": "ductile_iron"}
        },
        {
            "asset_id": "ROAD-102",
            "asset_type": "road",
            "name": "Dadar TT Circle Arterial (Segment R-102)",
            "ward_id": "WARD-02",
            "location": {"type": "Point", "coordinates": [72.8435, 19.0180]},
            "condition": "warning",
            "severity": 3,
            "connected_assets": ["PARK-302"],
            "metadata": {"lanes": 4, "daily_pcu_traffic": 60000}
        },
        {
            "asset_id": "DRAIN-003",
            "asset_type": "drain",
            "name": "Dadar South Storm Drain",
            "ward_id": "WARD-02",
            "location": {"type": "Point", "coordinates": [72.8415, 19.0190]},
            "condition": "healthy",
            "severity": 1,
            "connected_assets": ["ROAD-102"],
            "metadata": {"culvert_width_meters": 1.8}
        },
        {
            "asset_id": "PARK-302",
            "asset_type": "parking",
            "name": "Dadar Station Multi-Level Facility",
            "ward_id": "WARD-02",
            "location": {"type": "Point", "coordinates": [72.8450, 19.0170]},
            "condition": "healthy",
            "severity": 1,
            "connected_assets": [],
            "metadata": {"vehicle_slots": 320}
        },

        # Sector C: Silent High-Risk Ward Assets (Dharavi / Kurla)
        {
            "asset_id": "DRAIN-002",
            "asset_type": "drain",
            "name": "Mithi Outfall Culvert D-02",
            "ward_id": "WARD-03",
            "location": {"type": "Point", "coordinates": [72.8540, 19.0390]},
            "condition": "critical",
            "severity": 5,
            "connected_assets": ["ROAD-103", "WASTE-BIN-02"],
            "metadata": {"silt_depth_cm": 65, "hydraulic_load_pct": 94}
        },
        {
            "asset_id": "ROAD-103",
            "asset_type": "road",
            "name": "90 Feet Transit Road (Segment R-103)",
            "ward_id": "WARD-03",
            "location": {"type": "Point", "coordinates": [72.8560, 19.0415]},
            "condition": "critical",
            "severity": 4,
            "connected_assets": [],
            "metadata": {"lanes": 2, "pothole_density_per_km": 14}
        },
        {
            "asset_id": "WASTE-BIN-02",
            "asset_type": "waste_point",
            "name": "Transit Yard Compactor Station",
            "ward_id": "WARD-03",
            "location": {"type": "Point", "coordinates": [72.8530, 19.0380]},
            "condition": "warning",
            "severity": 3,
            "connected_assets": ["DRAIN-002"],
            "metadata": {"capacity_tons": 8.0}
        },
        {
            "asset_id": "PIPE-202",
            "asset_type": "water_pipeline",
            "name": "Kurla East Bulk Supply Main",
            "ward_id": "WARD-05",
            "location": {"type": "Point", "coordinates": [72.8780, 19.0710]},
            "condition": "warning",
            "severity": 3,
            "connected_assets": ["ROAD-101"],
            "metadata": {"diameter_mm": 450}
        },
        {
            "asset_id": "ROAD-101",
            "asset_type": "road",
            "name": "LBS Marg Link Corridor (Segment R-101)",
            "ward_id": "WARD-05",
            "location": {"type": "Point", "coordinates": [72.8800, 19.0735]},
            "condition": "warning",
            "severity": 3,
            "connected_assets": [],
            "metadata": {"lanes": 4}
        }
    ]

    for a in assets_data:
        a["created_at"] = datetime.utcnow()
        a["updated_at"] = datetime.utcnow()
        a["data_source"] = "demo"
        db.urban_assets.update_one({"asset_id": a["asset_id"]}, {"$set": a}, upsert=True)

    # 4. Seed Causal Rules
    print("Seeding domain causal rules...")
    rules_data = [
        {
            "rule_id": "RULE-001",
            "source_type": "waste_point",
            "target_type": "drain",
            "probability": 0.78,
            "delay_hours": 24.0,
            "trigger_conditions": ["uncollected_refuse"],
            "impact_score": 6.5,
            "evidence_source": "Municipal Drainage Field Study 2024",
            "confidence": 0.85,
            "enabled": True,
            "description": "Solid waste uncollected near stormwater catch basins migrates into grates and causes culvert siltation."
        },
        {
            "rule_id": "RULE-002",
            "source_type": "drain",
            "target_type": "road",
            "probability": 0.88,
            "delay_hours": 3.0,
            "trigger_conditions": ["rainfall", "heavy_rainfall"],
            "impact_score": 8.5,
            "evidence_source": "Urban Hydrology Assessment Guidelines",
            "confidence": 0.90,
            "enabled": True,
            "description": "Drain surcharge under precipitation spills onto road pavement, inducing arterial waterlogging and sub-base weakening."
        },
        {
            "rule_id": "RULE-003",
            "source_type": "road",
            "target_type": "parking",
            "probability": 0.65,
            "delay_hours": 4.0,
            "trigger_conditions": ["flooding"],
            "impact_score": 5.5,
            "evidence_source": "Traffic Operations Data",
            "confidence": 0.80,
            "enabled": True,
            "description": "Waterlogged carriage-ways force vehicles into adjacent parking reserves and side roads, causing facility saturation."
        },
        {
            "rule_id": "RULE-004",
            "source_type": "water_pipeline",
            "target_type": "road",
            "probability": 0.72,
            "delay_hours": 48.0,
            "trigger_conditions": ["high_pressure_fissure"],
            "impact_score": 9.0,
            "evidence_source": "Subsurface Geotechnical Reports",
            "confidence": 0.88,
            "enabled": True,
            "description": "Continuous subterranean pipeline leakage washes away aggregate fines, causing sinkholes and sudden pavement collapse."
        },
        {
            "rule_id": "RULE-005",
            "source_type": "drain",
            "target_type": "drain",
            "probability": 0.75,
            "delay_hours": 6.0,
            "trigger_conditions": ["backflow_surcharge"],
            "impact_score": 7.0,
            "evidence_source": "Culvert Network Modeling",
            "confidence": 0.82,
            "enabled": True,
            "description": "Blockage in downstream outfall culvert causes hydraulic back-pressure in upstream interconnected drainage nodes."
        },
        {
            "rule_id": "RULE-006",
            "source_type": "road",
            "target_type": "road",
            "probability": 0.82,
            "delay_hours": 1.5,
            "trigger_conditions": ["traffic_diversion"],
            "impact_score": 6.0,
            "evidence_source": "Smart City Traffic Management Center",
            "confidence": 0.86,
            "enabled": True,
            "description": "Closure or severe inundation of primary arterial forces traffic diversions onto adjacent connector flyovers and corridors."
        }
    ]
    for r in rules_data:
        db.cascade_rules.update_one({"rule_id": r["rule_id"]}, {"$set": r}, upsert=True)

    # 5. Seed Active Demonstration Issues
    print("Seeding active urban issues...")
    issues_data = [
        {
            "issue_id": "ISSUE-001",
            "asset_id": "DRAIN-001",
            "issue_type": "drain_blockage",
            "title": "Severe Silt & Debris Clogging in BKC Arterial Culvert",
            "description": "Plastic accumulation and uncollected construction debris have blocked 75% of the intake grate near Central Avenue.",
            "severity": 3,
            "status": "under_review",
            "ward_id": "WARD-01",
            "department": "Stormwater Drainage",
            "data_source": "demo",
            "coordinates": [72.8672, 19.0660],
            "created_at": datetime.utcnow() - timedelta(hours=8),
            "updated_at": datetime.utcnow() - timedelta(hours=1)
        },
        {
            "issue_id": "ISSUE-002",
            "asset_id": "PIPE-201",
            "issue_type": "water_leakage",
            "title": "High-Pressure Flange Joint Seepage Near Dadar TT",
            "description": "Subsurface acoustic sensor indicates sustained 28 psi pressure drop and ground saturation beneath arterial asphalt.",
            "severity": 4,
            "status": "assigned",
            "ward_id": "WARD-02",
            "department": "Water Supply & Sewerage",
            "data_source": "demo",
            "coordinates": [72.8420, 19.0165],
            "created_at": datetime.utcnow() - timedelta(hours=14),
            "updated_at": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "issue_id": "ISSUE-003",
            "asset_id": "WASTE-BIN-01",
            "issue_type": "waste_accumulation",
            "title": "Commercial Market Refuse Overflowing Catchment",
            "description": "Multiple commercial dumpsters overflowing onto street margin within 15 meters of stormwater runoff inlet.",
            "severity": 2,
            "status": "submitted",
            "ward_id": "WARD-01",
            "department": "Solid Waste Management",
            "data_source": "demo",
            "coordinates": [72.8660, 19.0655],
            "created_at": datetime.utcnow() - timedelta(hours=4),
            "updated_at": datetime.utcnow() - timedelta(hours=4)
        },
        {
            "issue_id": "ISSUE-004",
            "asset_id": "DRAIN-002",
            "issue_type": "drain_blockage",
            "title": "Critical Outfall Choke Point at Transit Bridge",
            "description": "Silt and uncollected slag have reduced outfall capacity to less than 20% right before predicted monsoon spell.",
            "severity": 5,
            "status": "in_progress",
            "ward_id": "WARD-03",
            "department": "Stormwater Drainage",
            "data_source": "demo",
            "coordinates": [72.8540, 19.0390],
            "created_at": datetime.utcnow() - timedelta(hours=28),
            "updated_at": datetime.utcnow() - timedelta(hours=3)
        },
        {
            "issue_id": "ISSUE-005",
            "asset_id": "ROAD-103",
            "issue_type": "road_damage",
            "title": "Extensive Longitudinal Pothole Cluster & Pavement Shear",
            "description": "Over 120 meters of bituminous top coat stripped due to standing water, causing hazardous lane bottleneck.",
            "severity": 4,
            "status": "under_review",
            "ward_id": "WARD-03",
            "department": "Roads & Traffic Engineering",
            "data_source": "demo",
            "coordinates": [72.8560, 19.0415],
            "created_at": datetime.utcnow() - timedelta(hours=18),
            "updated_at": datetime.utcnow() - timedelta(hours=2)
        }
    ]
    for i in issues_data:
        db.issues.update_one({"issue_id": i["issue_id"]}, {"$set": i}, upsert=True)

    # 6. Seed Demonstration Work Orders (with deliberate Dig-Once conflict)
    print("Seeding excavation work orders...")
    work_orders_data = [
        # Conflict 1: ROAD-104 (BKC Central Avenue)
        {
            "work_order_id": "WO-2026-104A",
            "department": "Water Supply & Sewerage",
            "road_segment_id": "ROAD-104",
            "road_name": "BKC Central Avenue (Segment R-104)",
            "start_date": "2026-11-02",
            "end_date": "2026-11-06",
            "work_description": "Excavation and installation of 400mm supplementary potable water trunk pipeline.",
            "estimated_cost": 42000.0,
            "location": "BKC Junction to Diamond Bourse Cross",
            "coordinates": [72.8685, 19.0670],
            "status": "scheduled"
        },
        {
            "work_order_id": "WO-2026-104B",
            "department": "Telecom & Optical Fiber Grid",
            "road_segment_id": "ROAD-104",
            "road_name": "BKC Central Avenue (Segment R-104)",
            "start_date": "2026-11-04",
            "end_date": "2026-11-09",
            "work_description": "Micro-trenching for 5G smart-city optical fiber trunk conduit.",
            "estimated_cost": 28000.0,
            "location": "BKC Central Avenue north corridor",
            "coordinates": [72.8685, 19.0670],
            "status": "scheduled"
        },

        # Conflict 2: ROAD-102 (Dadar TT Circle)
        {
            "work_order_id": "WO-2026-102A",
            "department": "City Gas Distribution Network",
            "road_segment_id": "ROAD-102",
            "road_name": "Dadar TT Circle Arterial (Segment R-102)",
            "start_date": "2026-11-12",
            "end_date": "2026-11-18",
            "work_description": "Underground medium-pressure steel gas pipeline retrofitting and valve replacement.",
            "estimated_cost": 55000.0,
            "location": "Dadar TT flyover underpass",
            "coordinates": [72.8435, 19.0180],
            "status": "scheduled"
        },
        {
            "work_order_id": "WO-2026-102B",
            "department": "Roads & Traffic Engineering",
            "road_segment_id": "ROAD-102",
            "road_name": "Dadar TT Circle Arterial (Segment R-102)",
            "start_date": "2026-11-15",
            "end_date": "2026-11-22",
            "work_description": "Mastic asphalt resurfacing, curb realignment and storm grating reinforcement.",
            "estimated_cost": 65000.0,
            "location": "Dadar TT circle carriage-way",
            "coordinates": [72.8435, 19.0180],
            "status": "scheduled"
        },

        # Non-conflicting order (Independent road segment)
        {
            "work_order_id": "WO-2026-105A",
            "department": "Electricity Supply Board",
            "road_segment_id": "ROAD-105",
            "road_name": "BKC Express Flyover Connector",
            "start_date": "2026-11-25",
            "end_date": "2026-11-29",
            "work_description": "High-voltage underground cable pulling across utility duct.",
            "estimated_cost": 22000.0,
            "location": "BKC Connector Ramp B",
            "coordinates": [72.8710, 19.0682],
            "status": "scheduled"
        }
    ]
    for w in work_orders_data:
        w["created_at"] = datetime.utcnow()
        w["updated_at"] = datetime.utcnow()
        db.work_orders.update_one({"work_order_id": w["work_order_id"]}, {"$set": w}, upsert=True)

    # 7. Seed Public Reports
    print("Seeding demonstration citizen reports...")
    reports_data = [
        {
            "report_id": "REP-2026-001",
            "tracking_code": "RPL-2026-K7M9Q",
            "issue_category": "Drainage",
            "title": "Severe drain overflow near BKC gate 3",
            "description": "Water backing up onto pedestrian pavement even after mild showers. Odor is terrible and drain appears completely clogged.",
            "ward_id": "WARD-01",
            "location_address": "Near Gate 3, BKC Avenue, Bandra",
            "latitude": 19.0662,
            "longitude": 72.8670,
            "severity": 3,
            "status": "In Progress",
            "assigned_department": "Stormwater Drainage",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "updated_at": datetime.utcnow() - timedelta(hours=6),
            "timeline": [
                {
                    "status": "Submitted",
                    "timestamp": (datetime.utcnow() - timedelta(days=2)).isoformat(),
                    "message": "Report submitted via citizen mobile portal."
                },
                {
                    "status": "Under Review",
                    "timestamp": (datetime.utcnow() - timedelta(days=1, hours=18)).isoformat(),
                    "message": "Assigned severity Level 3 based on stormwater vulnerability model."
                },
                {
                    "status": "In Progress",
                    "timestamp": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
                    "message": "Jet-vac crew dispatched to clear subterranean culvert blockage."
                }
            ]
        },
        {
            "report_id": "REP-2026-002",
            "tracking_code": "RPL-2026-B4T2W",
            "issue_category": "Water Leakage",
            "title": "Water bubbling up through road tarmac near Dadar TT",
            "description": "Clean drinking water leaking continuously for 3 days. Soil is sinking around the leak.",
            "ward_id": "WARD-02",
            "location_address": "Corner of TT Circle near station road, Dadar",
            "latitude": 19.0175,
            "longitude": 72.8425,
            "severity": 4,
            "status": "Assigned",
            "assigned_department": "Water Supply & Sewerage",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "updated_at": datetime.utcnow() - timedelta(hours=4),
            "timeline": [
                {
                    "status": "Submitted",
                    "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat(),
                    "message": "Citizen alert received with photo attachment."
                },
                {
                    "status": "Assigned",
                    "timestamp": (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                    "message": "Forwarded to Water Division for pipe acoustic diagnostics."
                }
            ]
        }
    ]
    for rep in reports_data:
        db.public_reports.update_one({"report_id": rep["report_id"]}, {"$set": rep}, upsert=True)

    print("Database seeding completed successfully!")
    print(f"Total Assets: {db.urban_assets.count_documents({})}")
    print(f"Total Rules: {db.cascade_rules.count_documents({})}")
    print(f"Total Issues: {db.issues.count_documents({})}")
    print(f"Total Work Orders: {db.work_orders.count_documents({})}")
    print(f"Total Wards: {db.wards.count_documents({})}")
    print(f"Total Reports: {db.public_reports.count_documents({})}")

if __name__ == "__main__":
    reset_flag = "--no-reset" not in sys.argv
    seed_database(reset=reset_flag)
