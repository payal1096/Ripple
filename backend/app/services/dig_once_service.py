"""
DIG-ONCE DETECTOR SERVICE (MONGODB INTEGRATED)
==============================================
Coordinates scheduled departmental excavations to eliminate repetitive road cuts.
Detects concurrent or overlapping road work on identical road segments and calculates
avoidable duplicate paving costs.
Persists work orders to MongoDB 'work_orders' collection in 'ripple_db'.
"""

import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.core.config import settings
from app.database import get_db, clean_doc, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import (
    WorkOrderCreateRequest,
    WorkOrderResponse,
    DigOnceConflictResponse,
)


class DigOnceService:
    @staticmethod
    def get_all_work_orders(
        road_name: Optional[str] = None,
        area: Optional[str] = None,
        status: Optional[str] = None,
        department: Optional[str] = None,
    ) -> List[WorkOrderResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            orders = clean_docs(list(db.work_orders.find()))
        else:
            orders = list(in_memory_store.work_orders.values())

        if road_name:
            orders = [o for o in orders if road_name.lower() in o.get("road_name", "").lower()]
        if area:
            orders = [o for o in orders if area.lower() in o.get("area", "").lower()]
        if status:
            orders = [o for o in orders if o.get("status", "").lower() == status.lower()]
        if department:
            orders = [o for o in orders if department.lower() in o.get("responsible_department", "").lower()]

        return [WorkOrderResponse(**o) for o in orders]

    @staticmethod
    def create_work_order(payload: WorkOrderCreateRequest) -> WorkOrderResponse:
        new_uuid = f"WO-{uuid.uuid4().hex[:6].upper()}"

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            count = db.work_orders.count_documents({}) + 101
        else:
            count = len(in_memory_store.work_orders) + 101

        work_code = f"WO-2026-{count}"

        new_order = {
            "id": new_uuid,
            "work_id": work_code,
            "work_title": payload.work_title.strip(),
            "road_name": payload.road_name.strip(),
            "area": payload.area.strip(),
            "city": payload.city.strip(),
            "start_date": payload.start_date.strip(),
            "end_date": payload.end_date.strip(),
            "responsible_department": payload.responsible_department.strip(),
            "status": payload.status,
            "estimated_cost": payload.estimated_cost,
            "description": payload.description,
        }

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            db.work_orders.insert_one(dict(new_order))
            return WorkOrderResponse(**clean_doc(new_order))
        else:
            in_memory_store.work_orders[new_uuid] = new_order
            return WorkOrderResponse(**new_order)

    @staticmethod
    def detect_conflicts() -> List[DigOnceConflictResponse]:
        """
        Scans all work order records.
        Groups by normalized road segment and identifies date overlaps.
        """
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            orders = clean_docs(list(db.work_orders.find()))
        else:
            orders = list(in_memory_store.work_orders.values())

        conflicts: List[DigOnceConflictResponse] = []

        # Group by road name
        grouped: Dict[str, List[Dict[str, Any]]] = {}
        for o in orders:
            key = o.get("road_name", "").strip().lower()
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(o)

        conflict_id_counter = 1
        for road_key, ord_list in grouped.items():
            if len(ord_list) < 2:
                continue

            for i in range(len(ord_list)):
                for j in range(i + 1, len(ord_list)):
                    o1 = ord_list[i]
                    o2 = ord_list[j]

                    dept1 = o1.get("responsible_department", "Agency A")
                    dept2 = o2.get("responsible_department", "Agency B")

                    try:
                        s1 = datetime.strptime(o1["start_date"], "%Y-%m-%d")
                        e1 = datetime.strptime(o1["end_date"], "%Y-%m-%d")
                        s2 = datetime.strptime(o2["start_date"], "%Y-%m-%d")
                        e2 = datetime.strptime(o2["end_date"], "%Y-%m-%d")
                    except Exception:
                        continue

                    overlap_start = max(s1, s2)
                    overlap_end = min(e1, e2)

                    if overlap_start <= overlap_end:
                        overlap_days = (overlap_end - overlap_start).days + 1
                        involved = list({dept1, dept2})
                        est_dup_cost = int(
                            o1.get("estimated_cost", 100000) * 0.45
                            + o2.get("estimated_cost", 100000) * 0.45
                        )

                        conflicts.append(
                            DigOnceConflictResponse(
                                conflict_id=f"CONF-2026-{conflict_id_counter:03d}",
                                road_name=o1.get("road_name", "Arterial Road"),
                                area=o1.get("area", "Urban Ward"),
                                overlap_start_date=overlap_start.strftime("%Y-%m-%d"),
                                overlap_end_date=overlap_end.strftime("%Y-%m-%d"),
                                overlap_days=overlap_days,
                                orders=[WorkOrderResponse(**o1), WorkOrderResponse(**o2)],
                                involved_departments=involved,
                                estimated_duplicate_cost=max(120000, est_dup_cost),
                                recommended_coordination=(
                                    f"Enforce Dig-Once Joint Trenching protocol between {dept1} and {dept2}. "
                                    f"Execute single coordinated excavation cycle to prevent duplicate asphalt milling and save ~${max(120000, est_dup_cost):,}."
                                ),
                            )
                        )
                        conflict_id_counter += 1

        return conflicts


dig_once_service = DigOnceService()
