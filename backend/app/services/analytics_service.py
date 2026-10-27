"""
ANALYTICS SERVICE (MONGODB INTEGRATED)
======================================
Computes operational aggregates for municipal dashboard charts.
Aggregates live counts from MongoDB collections in 'ripple_db'.
"""

from collections import Counter
from typing import Dict, Any

from app.core.config import settings
from app.database import get_db, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import AnalyticsOverviewResponse


class AnalyticsService:
    @staticmethod
    def get_overview() -> AnalyticsOverviewResponse:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            complaints = clean_docs(list(db.complaints.find()))
            note_text = f"Analytics aggregated from persistent MongoDB database ({settings.MONGO_DB_NAME})"
        else:
            complaints = list(in_memory_store.complaints.values())
            note_text = "Demonstration analytics aggregated from in-memory repository store"

        total = len(complaints)
        open_c = len([c for c in complaints if c.get("status") not in ("Resolved", "Rejected")])
        critical_c = len([c for c in complaints if c.get("risk_level") in ("Critical", "High")])
        downstream_risks = len([c for c in complaints if c.get("potential_downstream_impact")])

        total_avoidable = sum(
            (c.get("severity", 3) * 95000) for c in complaints if c.get("status") != "Resolved"
        )

        return AnalyticsOverviewResponse(
            total_complaints=total,
            open_complaints=open_c,
            critical_issues=critical_c,
            downstream_risks_identified=downstream_risks,
            preventive_actions_planned=open_c,
            estimated_avoidable_cost=max(285000, total_avoidable),
            storage_mode=settings.STORAGE_MODE,
            note=note_text,
        )

    @staticmethod
    def get_complaints_breakdown() -> Dict[str, Any]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            complaints = clean_docs(list(db.complaints.find()))
        else:
            complaints = list(in_memory_store.complaints.values())

        return {
            "total": len(complaints),
            "by_category": dict(Counter(c.get("category", "General") for c in complaints)),
            "by_risk_level": dict(Counter(c.get("risk_level", "Medium") for c in complaints)),
            "by_status": dict(Counter(c.get("status", "Submitted") for c in complaints)),
            "by_city": dict(Counter(c.get("city", "Mumbai") for c in complaints)),
        }

    @staticmethod
    def get_resources_breakdown() -> Dict[str, Any]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            resources = clean_docs(list(db.resources.find()))
        else:
            resources = list(in_memory_store.resources.values())

        return {
            "total_resources": len(resources),
            "by_condition": dict(Counter(r.get("condition", "healthy") for r in resources)),
            "by_category": dict(Counter(r.get("category", "general") for r in resources)),
            "by_department": dict(Counter(r.get("responsible_dept", "Public Works") for r in resources)),
        }


analytics_service = AnalyticsService()
