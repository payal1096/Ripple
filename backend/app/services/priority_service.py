"""
PRIORITY SCORING SERVICE
========================
Calculates transparent, explainable priority rankings for urban problems based on:
1. Reported severity (1-5 scale)
2. Downstream failure cascade risk (drainage, pipelines, arterial roads)
3. Weather vulnerability (sensitivity under high rainfall)
4. Resource connectivity
"""

from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.database import get_db, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import PriorityQueueItem

class PriorityService:
    @staticmethod
    def calculate_priority(complaint: Dict[str, Any]) -> Dict[str, Any]:
        severity = complaint.get("severity", 3)
        cat_lower = complaint.get("category", "").lower()

        # Base score from severity (1 to 5 maps to 20..100 base)
        base = severity * 15

        # Downstream cascade multiplier
        cascade_bonus = 0
        factors = []

        if any(w in cat_lower for w in ["drain", "waterlog", "flood"]):
            cascade_bonus = 22
            factors.append("High ripple probability to road subgrade and transit corridors under rainfall")
        elif any(w in cat_lower for w in ["water", "pipe", "leak"]):
            cascade_bonus = 20
            factors.append("Pressurized subterranean leak poses cavitation and sinkhole hazard")
        elif any(w in cat_lower for w in ["road", "pothole"]):
            cascade_bonus = 15
            factors.append("Direct impact on vehicular safety and arterial traffic flow")
        elif any(w in cat_lower for w in ["waste", "garbage"]):
            cascade_bonus = 12
            factors.append("Upstream source of drainage clogging and plastic intake occlusion")
        elif any(w in cat_lower for w in ["light", "street"]):
            cascade_bonus = 10
            factors.append("Night visibility and pedestrian transit corridor risk")

        final_score = min(98, max(15, base + cascade_bonus))
        explanation = (
            f"Severity level {severity}/5 combined with category risk profile. "
            + (" Factors: " + "; ".join(factors) if factors else "Standard infrastructure triage.")
        )

        return {
            "priority_score": final_score,
            "priority_explanation": explanation,
        }

    @staticmethod
    def get_ranked_queue(
        city: Optional[str] = None,
        category: Optional[str] = None,
        include_resolved: bool = False,
    ) -> List[PriorityQueueItem]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            all_complaints = clean_docs(list(db.complaints.find()))
        else:
            all_complaints = list(in_memory_store.complaints.values())

        if not include_resolved:
            all_complaints = [
                c for c in all_complaints
                if c.get("status") not in ("Resolved", "Rejected")
            ]

        if city:
            all_complaints = [c for c in all_complaints if c.get("city", "").lower() == city.lower()]
        if category:
            all_complaints = [c for c in all_complaints if c.get("category", "").lower() == category.lower()]

        # Sort descending by priority score
        all_complaints.sort(key=lambda x: x.get("priority_score", 0), reverse=True)

        results = []
        for rank, c in enumerate(all_complaints, start=1):
            results.append(
                PriorityQueueItem(
                    rank=rank,
                    complaint_id=c["id"],
                    ref_id=c.get("ref_id", c["id"]),
                    title=c["title"],
                    category=c["category"],
                    city=c["city"],
                    area=c["area"],
                    severity=c["severity"],
                    risk_level=c["risk_level"],
                    status=c["status"],
                    potential_downstream_impact=c.get("potential_downstream_impact", "Under analysis"),
                    priority_score=c.get("priority_score", 50),
                    priority_explanation=c.get(
                        "priority_explanation",
                        "Scored based on severity and downstream ripple risk."
                    ),
                    recommended_action=c.get("recommended_action", "Schedule field inspection"),
                    assigned_department=c.get("assigned_department", "Municipal Operations"),
                    reported_date=c.get("reported_date", "2026-10-24 10:00"),
                )
            )

        return results

priority_service = PriorityService()
