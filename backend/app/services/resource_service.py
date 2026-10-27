"""
URBAN RESOURCE REGISTRY SERVICE (MONGODB INTEGRATED)
====================================================
Manages municipal infrastructure assets: drains, roads, waste points, water pipelines, streetlights.
Persists resources to MongoDB 'resources' collection in 'ripple_db'.
"""

import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from app.core.config import settings
from app.database import get_db, clean_doc, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import (
    ResourceCreateRequest,
    ResourceUpdateRequest,
    ResourceResponse,
    AssetType,
    AssetConditionType,
)


class ResourceService:
    @staticmethod
    def get_resources(
        category: Optional[AssetType] = None,
        condition: Optional[AssetConditionType] = None,
        city: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[ResourceResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            query: Dict[str, Any] = {}
            if category:
                query["category"] = category
            if condition:
                query["condition"] = condition
            if city:
                query["city"] = {"$regex": f"^{re.escape(city)}$", "$options": "i"}

            raw_docs = list(db.resources.find(query))
            items = clean_docs(raw_docs)
        else:
            items = list(in_memory_store.resources.values())
            if category:
                items = [r for r in items if r.get("category") == category]
            if condition:
                items = [r for r in items if r.get("condition") == condition]
            if city:
                items = [r for r in items if r.get("city", "").lower() == city.lower()]

        if search:
            q = search.lower()
            items = [
                r for r in items
                if q in r.get("name", "").lower() or q in r.get("area", "").lower()
            ]

        return [ResourceResponse(**r) for r in items]

    @staticmethod
    def get_by_id(resource_id: str) -> Optional[ResourceResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw = db.resources.find_one({"$or": [{"id": resource_id}, {"resource_id": resource_id}]})
            if not raw:
                return None
            return ResourceResponse(**clean_doc(raw))
        else:
            target = in_memory_store.resources.get(resource_id)
            if not target:
                for r in in_memory_store.resources.values():
                    if r.get("resource_id") == resource_id:
                        target = r
                        break
            if not target:
                return None
            return ResourceResponse(**target)

    @staticmethod
    def create_resource(payload: ResourceCreateRequest) -> ResourceResponse:
        new_uuid = f"RES-{uuid.uuid4().hex[:6].upper()}"
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            count = db.resources.count_documents({}) + 1
        else:
            count = len(in_memory_store.resources) + 1

        res_code = f"RES-{payload.category[:3].upper()}-{count:03d}"

        new_resource = {
            "id": new_uuid,
            "resource_id": res_code,
            "name": payload.name.strip(),
            "category": payload.category,
            "city": payload.city.strip(),
            "area": payload.area.strip(),
            "landmark": payload.landmark.strip() if payload.landmark else None,
            "condition": payload.condition,
            "last_inspection": payload.last_inspection or today,
            "next_inspection_due": payload.next_inspection_due or today,
            "related_complaints_count": 0,
            "responsible_dept": payload.responsible_dept.strip(),
            "operational_status": payload.operational_status or "Operational",
            "notes": payload.notes,
        }

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            db.resources.insert_one(dict(new_resource))
            return ResourceResponse(**clean_doc(new_resource))
        else:
            in_memory_store.resources[new_uuid] = new_resource
            return ResourceResponse(**new_resource)

    @staticmethod
    def update_resource(resource_id: str, payload: ResourceUpdateRequest) -> Optional[ResourceResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            updates: Dict[str, Any] = {}
            if payload.name is not None:
                updates["name"] = payload.name.strip()
            if payload.condition is not None:
                updates["condition"] = payload.condition
            if payload.last_inspection is not None:
                updates["last_inspection"] = payload.last_inspection
            if payload.next_inspection_due is not None:
                updates["next_inspection_due"] = payload.next_inspection_due
            if payload.responsible_dept is not None:
                updates["responsible_dept"] = payload.responsible_dept.strip()
            if payload.operational_status is not None:
                updates["operational_status"] = payload.operational_status.strip()
            if payload.notes is not None:
                updates["notes"] = payload.notes.strip()

            if updates:
                db.resources.update_one(
                    {"$or": [{"id": resource_id}, {"resource_id": resource_id}]},
                    {"$set": updates}
                )

            raw = db.resources.find_one({"$or": [{"id": resource_id}, {"resource_id": resource_id}]})
            if not raw:
                return None
            return ResourceResponse(**clean_doc(raw))
        else:
            target = in_memory_store.resources.get(resource_id)
            if not target:
                for r in in_memory_store.resources.values():
                    if r.get("resource_id") == resource_id:
                        target = r
                        break
            if not target:
                return None

            if payload.name is not None:
                target["name"] = payload.name.strip()
            if payload.condition is not None:
                target["condition"] = payload.condition
            if payload.last_inspection is not None:
                target["last_inspection"] = payload.last_inspection
            if payload.next_inspection_due is not None:
                target["next_inspection_due"] = payload.next_inspection_due
            if payload.responsible_dept is not None:
                target["responsible_dept"] = payload.responsible_dept.strip()
            if payload.operational_status is not None:
                target["operational_status"] = payload.operational_status.strip()
            if payload.notes is not None:
                target["notes"] = payload.notes.strip()

            return ResourceResponse(**target)


resource_service = ResourceService()
