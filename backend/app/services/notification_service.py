"""
NOTIFICATIONS SERVICE (MONGODB INTEGRATED)
==========================================
Dispatches and manages in-app notifications.
Users are strictly confined to their own notification records.
Persists notifications to MongoDB 'notifications' collection in 'ripple_db'.
"""

from typing import List, Optional
from pymongo import ReturnDocument

from app.core.config import settings
from app.database import get_db, clean_doc, clean_docs
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import NotificationResponse


class NotificationService:
    @staticmethod
    def get_user_notifications(user_id: str) -> List[NotificationResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw_docs = list(db.notifications.find({"user_id": user_id}).sort("timestamp", -1))
            return [NotificationResponse(**n) for n in clean_docs(raw_docs)]
        else:
            user_notifs = [
                n for n in in_memory_store.notifications.values()
                if n.get("user_id") == user_id
            ]
            user_notifs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            return [NotificationResponse(**n) for n in user_notifs]

    @staticmethod
    def mark_read(notification_id: str, user_id: str) -> Optional[NotificationResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw = db.notifications.find_one_and_update(
                {"id": notification_id, "user_id": user_id},
                {"$set": {"is_read": True}},
                return_document=ReturnDocument.AFTER,
            )
            if not raw:
                return None
            return NotificationResponse(**clean_doc(raw))
        else:
            notif = in_memory_store.notifications.get(notification_id)
            if not notif or notif.get("user_id") != user_id:
                return None
            notif["is_read"] = True
            return NotificationResponse(**notif)

    @staticmethod
    def mark_all_read(user_id: str) -> int:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            result = db.notifications.update_many(
                {"user_id": user_id, "is_read": False},
                {"$set": {"is_read": True}},
            )
            return result.modified_count
        else:
            count = 0
            for n in in_memory_store.notifications.values():
                if n.get("user_id") == user_id and not n.get("is_read"):
                    n["is_read"] = True
                    count += 1
            return count


notification_service = NotificationService()
