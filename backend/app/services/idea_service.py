"""
COMMUNITY IDEAS SERVICE (MONGODB INTEGRATED)
============================================
Handles citizen proposals, idea moderation lifecycle, and upvoting.
Persists community ideas in MongoDB 'ideas' collection in 'ripple_db'.
"""

import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

from app.core.config import settings
from app.database import get_db, clean_doc, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import (
    IdeaCreateRequest,
    CommunityIdeaResponse,
    IdeaStatusType,
)


class IdeaService:
    @staticmethod
    def submit_idea(user: Dict[str, Any], payload: IdeaCreateRequest) -> Optional[CommunityIdeaResponse]:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
        new_id = f"IDEA-{uuid.uuid4().hex[:6].upper()}"

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            complaint_raw = db.complaints.find_one({"$or": [{"id": payload.complaint_id}, {"ref_id": payload.complaint_id}]})
            if not complaint_raw:
                return None
            complaint = clean_doc(complaint_raw)
        else:
            complaint = in_memory_store.complaints.get(payload.complaint_id)
            if not complaint:
                for c in in_memory_store.complaints.values():
                    if c.get("ref_id") == payload.complaint_id:
                        complaint = c
                        break
            if not complaint:
                return None

        new_idea = {
            "id": new_id,
            "problem_id": payload.complaint_id,
            "problem_title": complaint.get("title", "Reported Urban Issue"),
            "problem_category": complaint.get("category", "General Infrastructure"),
            "problem_city": complaint.get("city", "Mumbai"),
            "title": payload.title.strip(),
            "explanation": payload.explanation.strip(),
            "expected_benefit": payload.expected_benefit.strip(),
            "submitted_by": user["email"],
            "submitted_by_name": user["name"],
            "submitted_date": now_str,
            "status": "Pending Review",
            "admin_feedback": None,
            "upvotes": 1,
            "tags": payload.tags or [complaint.get("category", "Urban Coordination")],
        }

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            db.ideas.insert_one(dict(new_idea))
            db.complaints.update_one(
                {"$or": [{"id": payload.complaint_id}, {"ref_id": payload.complaint_id}]},
                {"$inc": {"community_ideas_count": 1}}
            )
            return CommunityIdeaResponse(**clean_doc(new_idea))
        else:
            in_memory_store.ideas[new_id] = new_idea
            complaint["community_ideas_count"] = complaint.get("community_ideas_count", 0) + 1
            return CommunityIdeaResponse(**new_idea)

    @staticmethod
    def get_public_ideas(status: Optional[str] = None, complaint_id: Optional[str] = None) -> List[CommunityIdeaResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            query: Dict[str, Any] = {}
            if status:
                query["status"] = {"$regex": f"^{re.escape(status)}$", "$options": "i"}
            if complaint_id:
                query["problem_id"] = complaint_id

            raw_docs = list(db.ideas.find(query).sort("upvotes", -1))
            return [CommunityIdeaResponse(**i) for i in clean_docs(raw_docs)]
        else:
            ideas_list = list(in_memory_store.ideas.values())
            if status:
                ideas_list = [i for i in ideas_list if i.get("status", "").lower() == status.lower()]
            if complaint_id:
                ideas_list = [i for i in ideas_list if i.get("problem_id") == complaint_id]

            ideas_list.sort(key=lambda x: x.get("upvotes", 0), reverse=True)
            return [CommunityIdeaResponse(**i) for i in ideas_list]

    @staticmethod
    def get_my_ideas(user_email: str) -> List[CommunityIdeaResponse]:
        clean_email = user_email.lower().strip()
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw_docs = list(db.ideas.find(
                {"submitted_by": {"$regex": f"^{re.escape(clean_email)}$", "$options": "i"}}
            ).sort("submitted_date", -1))
            return [CommunityIdeaResponse(**i) for i in clean_docs(raw_docs)]
        else:
            user_ideas = [
                i for i in in_memory_store.ideas.values()
                if i.get("submitted_by", "").lower() == clean_email
            ]
            user_ideas.sort(key=lambda x: x.get("submitted_date", ""), reverse=True)
            return [CommunityIdeaResponse(**i) for i in user_ideas]

    @staticmethod
    def review_idea(
        idea_id: str,
        new_status: IdeaStatusType,
        admin_feedback: Optional[str],
        admin_user: Dict[str, Any],
    ) -> Optional[CommunityIdeaResponse]:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw = db.ideas.find_one({"id": idea_id})
            if not raw:
                return None
            idea = clean_doc(raw)

            update_fields: Dict[str, Any] = {"status": new_status}
            if admin_feedback:
                update_fields["admin_feedback"] = admin_feedback.strip()

            db.ideas.update_one({"id": idea_id}, {"$set": update_fields})

            # Notify author
            author_email = idea.get("submitted_by", "").lower()
            author_user = db.users.find_one({"email": {"$regex": f"^{re.escape(author_email)}$", "$options": "i"}})
            if author_user:
                notif_id = f"NOTIF-{uuid.uuid4().hex[:6].upper()}"
                db.notifications.insert_one({
                    "id": notif_id,
                    "user_id": author_user["id"],
                    "title": f"Idea Moderation: {new_status}",
                    "message": f"Your idea '{idea['title'][:30]}' status changed to '{new_status}'.",
                    "category": "idea_review",
                    "timestamp": now_str,
                    "is_read": False,
                    "link_to": "/community-ideas",
                    "related_id": idea_id,
                })

            updated_raw = db.ideas.find_one({"id": idea_id})
            return CommunityIdeaResponse(**clean_doc(updated_raw))
        else:
            idea = in_memory_store.ideas.get(idea_id)
            if not idea:
                return None

            idea["status"] = new_status
            if admin_feedback:
                idea["admin_feedback"] = admin_feedback.strip()

            # Notify author
            author_email = idea.get("submitted_by", "").lower()
            for u in in_memory_store.users.values():
                if u["email"].lower() == author_email:
                    notif_id = f"NOTIF-{uuid.uuid4().hex[:6].upper()}"
                    in_memory_store.notifications[notif_id] = {
                        "id": notif_id,
                        "user_id": u["id"],
                        "title": f"Idea Moderation: {new_status}",
                        "message": f"Your idea '{idea['title'][:30]}' status changed to '{new_status}'.",
                        "category": "idea_review",
                        "timestamp": now_str,
                        "is_read": False,
                        "link_to": "/community-ideas",
                        "related_id": idea_id,
                    }
                    break

            return CommunityIdeaResponse(**idea)

    @staticmethod
    def upvote(idea_id: str) -> Optional[int]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            res = db.ideas.find_one_and_update(
                {"id": idea_id},
                {"$inc": {"upvotes": 1}},
                return_document=True,
            )
            if not res:
                return None
            return res.get("upvotes", 1)
        else:
            idea = in_memory_store.ideas.get(idea_id)
            if not idea:
                return None
            idea["upvotes"] = idea.get("upvotes", 0) + 1
            return idea["upvotes"]


idea_service = IdeaService()
