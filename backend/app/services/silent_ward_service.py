"""
SILENT WARD DETECTOR SERVICE (MONGODB INTEGRATED)
=================================================
Identifies civic zones exhibiting low digital reporting density that correlates with
extended inspection latency or high population.
Prevents municipal resource allocation bias toward vocal digital communities.
Persists and queries silent wards in MongoDB 'silent_wards' collection in 'ripple_db'.
"""

import re
from typing import List, Optional, Dict, Any

from app.core.config import settings
from app.database import get_db, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import SilentWardResponse


class SilentWardService:
    @staticmethod
    def get_silent_wards(
        city: Optional[str] = None,
        status_label: Optional[str] = None,
    ) -> List[SilentWardResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            query: Dict[str, Any] = {}
            if city:
                query["city"] = {"$regex": f"^{re.escape(city)}$", "$options": "i"}
            if status_label:
                query["status_label"] = {"$regex": f"^{re.escape(status_label)}$", "$options": "i"}

            raw_docs = list(db.silent_wards.find(query))
            wards = clean_docs(raw_docs)
        else:
            wards = list(in_memory_store.silent_wards.values())
            if city:
                wards = [w for w in wards if w.get("city", "").lower() == city.lower()]
            if status_label:
                wards = [w for w in wards if w.get("status_label", "").lower() == status_label.lower()]

        priority_order = {
            "Potential Inspection Gap": 0,
            "Further Assessment Recommended": 1,
            "Insufficient Reporting Data": 2,
            "Normal Coverage": 3,
        }
        wards.sort(key=lambda x: priority_order.get(x.get("status_label", "Normal Coverage"), 9))

        return [SilentWardResponse(**w) for w in wards]


silent_ward_service = SilentWardService()
