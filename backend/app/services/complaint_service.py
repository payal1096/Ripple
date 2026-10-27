"""
COMPLAINT MANAGEMENT SERVICE (MONGODB INTEGRATED)
=================================================
Encapsulates complaint lifecycle, privacy redactions, timeline audit trail,
and ripple effect scoring.
Persists complaints and status updates to MongoDB 'complaints' in 'ripple_db'.
"""

import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from app.core.config import settings
from app.database import get_db, clean_doc, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import (
    ComplaintCreateRequest,
    ComplaintResponse,
    ComplaintPublicResponse,
    ComplaintTimelineEntry,
)
from app.services.ripple_service import ripple_service
from app.services.priority_service import priority_service


class ComplaintService:
    @staticmethod
    def create_complaint(user: Dict[str, Any], payload: ComplaintCreateRequest) -> ComplaintResponse:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
        new_id = f"CMP-{uuid.uuid4().hex[:6].upper()}"

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            comp_count = db.complaints.count_documents({}) + 1
        else:
            comp_count = len(in_memory_store.complaints) + 1

        ref_id = f"RPL-2026-{comp_count:04d}"

        # Derive scoring and cascade
        complaint_dict_stub = {
            "id": new_id,
            "title": payload.title,
            "description": payload.description,
            "category": payload.category,
            "area": payload.locality,
            "severity": payload.severity,
            "risk_level": "Critical" if payload.severity >= 5 else "High" if payload.severity == 4 else "Medium" if payload.severity == 3 else "Low",
        }

        cascade = ripple_service.analyze_complaint(complaint_dict_stub)
        scoring = priority_service.calculate_priority(complaint_dict_stub)

        location_parts = [payload.locality]
        if payload.street_or_landmark:
            location_parts.append(payload.street_or_landmark)
        location_parts.append(payload.city)
        full_address = ", ".join(location_parts)

        new_complaint = {
            "id": new_id,
            "ref_id": ref_id,
            "title": payload.title.strip(),
            "description": payload.description.strip(),
            "category": payload.category.strip(),
            "city": payload.city.strip(),
            "area": payload.locality.strip(),
            "landmark": payload.street_or_landmark.strip() if payload.street_or_landmark else None,
            "location_address": full_address,
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "severity": payload.severity,
            "risk_level": cascade.risk_level,
            "status": "Submitted",
            "reported_date": now_str,
            "reported_by_id": user["id"],
            "reported_by_name": user["name"],
            "contact_number": payload.contact_number or user.get("phone"),
            "potential_downstream_impact": " → ".join([s.title for s in cascade.steps[:3]]),
            "priority_score": scoring["priority_score"],
            "priority_explanation": scoring["priority_explanation"],
            "recommended_action": cascade.recommended_preventive_action,
            "action_explanation": cascade.explanation_of_recommendation,
            "assigned_department": cascade.coordinating_departments[0] if cascade.coordinating_departments else "Municipal Operations",
            "community_ideas_count": 0,
            "timeline": [
                {
                    "status": "Submitted",
                    "timestamp": now_str,
                    "note": "Complaint filed by citizen with location and category details.",
                    "updated_by": user["name"],
                }
            ],
        }

        notif_id = f"NOTIF-{uuid.uuid4().hex[:6].upper()}"
        new_notif = {
            "id": notif_id,
            "user_id": user["id"],
            "title": f"Complaint {ref_id} Registered",
            "message": f"Your report '{payload.title}' has been submitted and queued for municipal review.",
            "category": "complaint_status",
            "timestamp": now_str,
            "is_read": False,
            "link_to": "/my-complaints",
            "related_id": new_id,
        }

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            db.complaints.insert_one(dict(new_complaint))
            db.notifications.insert_one(dict(new_notif))
            return ComplaintResponse(**clean_doc(new_complaint))
        else:
            in_memory_store.complaints[new_id] = new_complaint
            in_memory_store.notifications[notif_id] = new_notif
            return ComplaintResponse(**new_complaint)

    @staticmethod
    def get_my_complaints(user_id: str) -> List[ComplaintResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw_docs = list(db.complaints.find({"reported_by_id": user_id}).sort("reported_date", -1))
            cleaned = clean_docs(raw_docs)
            return [ComplaintResponse(**c) for c in cleaned]
        else:
            user_comps = [
                c for c in in_memory_store.complaints.values()
                if c.get("reported_by_id") == user_id
            ]
            user_comps.sort(key=lambda x: x.get("reported_date", ""), reverse=True)
            return [ComplaintResponse(**c) for c in user_comps]

    @staticmethod
    def get_public_complaints(
        category: Optional[str] = None,
        status: Optional[str] = None,
        risk_level: Optional[str] = None,
        city: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[ComplaintPublicResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            mongo_query: Dict[str, Any] = {}
            if category:
                mongo_query["category"] = {"$regex": f"^{re.escape(category)}$", "$options": "i"}
            if status:
                mongo_query["status"] = {"$regex": f"^{re.escape(status)}$", "$options": "i"}
            if risk_level:
                mongo_query["risk_level"] = {"$regex": f"^{re.escape(risk_level)}$", "$options": "i"}
            if city:
                mongo_query["city"] = {"$regex": f"^{re.escape(city)}$", "$options": "i"}

            raw_docs = list(db.complaints.find(mongo_query).sort("reported_date", -1))
            items = clean_docs(raw_docs)
        else:
            items = list(in_memory_store.complaints.values())
            if category:
                items = [c for c in items if c.get("category", "").lower() == category.lower()]
            if status:
                items = [c for c in items if c.get("status", "").lower() == status.lower()]
            if risk_level:
                items = [c for c in items if c.get("risk_level", "").lower() == risk_level.lower()]
            if city:
                items = [c for c in items if c.get("city", "").lower() == city.lower()]

        results = []
        for c in items:
            if search:
                q = search.lower()
                text = f"{c.get('title', '')} {c.get('description', '')} {c.get('area', '')}".lower()
                if q not in text:
                    continue

            # Sensitive fields redacted
            results.append(
                ComplaintPublicResponse(
                    id=c["id"],
                    ref_id=c.get("ref_id", c["id"]),
                    title=c["title"],
                    description=c["description"],
                    category=c["category"],
                    city=c["city"],
                    area=c["area"],
                    landmark=c.get("landmark"),
                    location_address=c.get("location_address", c["area"]),
                    severity=c["severity"],
                    risk_level=c["risk_level"],
                    status=c["status"],
                    reported_date=c["reported_date"],
                    community_ideas_count=c.get("community_ideas_count", 0),
                    potential_downstream_impact=c.get("potential_downstream_impact", "Under analysis"),
                    recommended_action=c.get("recommended_action", "Scheduled for field inspection"),
                )
            )

        results.sort(key=lambda x: x.reported_date, reverse=True)
        return results

    @staticmethod
    def get_complaint_details(complaint_id: str, user: Optional[Dict[str, Any]] = None) -> Optional[ComplaintResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw = db.complaints.find_one({"$or": [{"id": complaint_id}, {"ref_id": complaint_id}]})
            c = clean_doc(raw)
        else:
            c = in_memory_store.complaints.get(complaint_id)
            if not c:
                for comp in in_memory_store.complaints.values():
                    if comp.get("ref_id") == complaint_id:
                        c = comp
                        break

        if not c:
            return None

        data = dict(c)
        is_owner = user and user.get("id") == data.get("reported_by_id")
        is_admin = user and user.get("role") == "admin"
        if not (is_owner or is_admin):
            data["contact_number"] = None
            data["latitude"] = None
            data["longitude"] = None

        return ComplaintResponse(**data)

    @staticmethod
    def update_status(
        complaint_id: str,
        new_status: str,
        note: Optional[str],
        admin_user: Dict[str, Any]
    ) -> Optional[ComplaintResponse]:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
        note_text = note or f"Status updated to '{new_status}' by administration."
        timeline_event = {
            "status": new_status,
            "timestamp": now_str,
            "note": note_text,
            "updated_by": admin_user["name"],
        }

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            c = db.complaints.find_one({"$or": [{"id": complaint_id}, {"ref_id": complaint_id}]})
            if not c:
                return None

            db.complaints.update_one(
                {"$or": [{"id": complaint_id}, {"ref_id": complaint_id}]},
                {
                    "$set": {"status": new_status},
                    "$push": {"timeline": timeline_event},
                },
            )

            # Notify reporting citizen
            citizen_id = c.get("reported_by_id")
            if citizen_id:
                notif_id = f"NOTIF-{uuid.uuid4().hex[:6].upper()}"
                db.notifications.insert_one({
                    "id": notif_id,
                    "user_id": citizen_id,
                    "title": f"Status Update: {c.get('ref_id', complaint_id)}",
                    "message": f"Your complaint '{c['title']}' has been updated to '{new_status}'.",
                    "category": "complaint_status",
                    "timestamp": now_str,
                    "is_read": False,
                    "link_to": "/my-complaints",
                    "related_id": complaint_id,
                })

            updated_raw = db.complaints.find_one({"$or": [{"id": complaint_id}, {"ref_id": complaint_id}]})
            return ComplaintResponse(**clean_doc(updated_raw))
        else:
            c = in_memory_store.complaints.get(complaint_id)
            if not c:
                return None

            c["status"] = new_status
            if "timeline" not in c:
                c["timeline"] = []
            c["timeline"].append(timeline_event)

            citizen_id = c.get("reported_by_id")
            if citizen_id:
                notif_id = f"NOTIF-{uuid.uuid4().hex[:6].upper()}"
                in_memory_store.notifications[notif_id] = {
                    "id": notif_id,
                    "user_id": citizen_id,
                    "title": f"Status Update: {c.get('ref_id', complaint_id)}",
                    "message": f"Your complaint '{c['title']}' has been updated to '{new_status}'.",
                    "category": "complaint_status",
                    "timestamp": now_str,
                    "is_read": False,
                    "link_to": "/my-complaints",
                    "related_id": complaint_id,
                }

            return ComplaintResponse(**c)


complaint_service = ComplaintService()
