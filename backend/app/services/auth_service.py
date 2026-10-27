"""
AUTHENTICATION SERVICE (MONGODB INTEGRATED)
===========================================
Handles secure user registration, salted HMAC-SHA256 password hashing,
credential verification, and JWT access token issuance.
Persists users to MongoDB 'users' collection in 'ripple_db'.
"""

import re
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple

from app.core.config import settings
from app.core.security import hash_password, verify_password, create_access_token
from app.database import get_db, clean_doc
from app.repositories.in_memory_store import in_memory_store
from app.schemas.all_schemas import (
    UserSignupRequest,
    UserProfileResponse,
    UserPreferences,
    UserProfileUpdateRequest,
)


class AuthService:
    @staticmethod
    def register_citizen(payload: UserSignupRequest) -> Tuple[UserProfileResponse, str]:
        email_clean = payload.email.lower().strip()

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            existing = db.users.find_one(
                {"email": {"$regex": f"^{re.escape(email_clean)}$", "$options": "i"}}
            )
            if existing:
                raise ValueError("A user with this email address already exists.")
        else:
            for existing in in_memory_store.users.values():
                if existing["email"].lower() == email_clean:
                    raise ValueError("A user with this email address already exists.")

        new_id = f"usr-{uuid.uuid4().hex[:8]}"
        now_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        new_user = {
            "id": new_id,
            "name": payload.name.strip(),
            "email": email_clean,
            "hashed_password": hash_password(payload.password),
            "city": payload.city.strip(),
            "phone": payload.phone.strip() if payload.phone else None,
            "role": "citizen",  # Public registration strictly assigns citizen role
            "joined_date": now_date,
            "department": "Citizen Participant",
            "preferences": {
                "email_notifications": True,
                "sms_alerts": False,
                "high_risk_alerts_only": False,
                "compact_view": False,
            },
        }

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            db.users.insert_one(dict(new_user))
        else:
            in_memory_store.users[new_id] = new_user

        token = create_access_token(
            data={"sub": new_id, "email": new_user["email"], "role": new_user["role"]}
        )

        profile = UserProfileResponse(
            id=new_user["id"],
            name=new_user["name"],
            email=new_user["email"],
            city=new_user["city"],
            phone=new_user["phone"],
            role=new_user["role"],
            joined_date=new_user["joined_date"],
            department=new_user["department"],
            preferences=UserPreferences(**new_user["preferences"]),
        )

        return profile, token

    @staticmethod
    def authenticate(email: str, password: str) -> Optional[Tuple[UserProfileResponse, str]]:
        email_clean = email.lower().strip()
        user_record = None

        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw = db.users.find_one(
                {"email": {"$regex": f"^{re.escape(email_clean)}$", "$options": "i"}}
            )
            user_record = clean_doc(raw)
        else:
            for u in in_memory_store.users.values():
                if u["email"].lower() == email_clean:
                    user_record = u
                    break

        if not user_record or not verify_password(password, user_record.get("hashed_password", "")):
            return None

        token = create_access_token(
            data={
                "sub": user_record["id"],
                "email": user_record["email"],
                "role": user_record["role"],
            }
        )

        profile = UserProfileResponse(
            id=user_record["id"],
            name=user_record["name"],
            email=user_record["email"],
            city=user_record["city"],
            phone=user_record.get("phone"),
            role=user_record["role"],
            joined_date=user_record.get("joined_date", "2026-01-01"),
            department=user_record.get("department"),
            preferences=UserPreferences(**user_record.get("preferences", {})),
        )

        return profile, token

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            raw = db.users.find_one({"id": user_id})
            return clean_doc(raw)
        else:
            return in_memory_store.users.get(user_id)

    @staticmethod
    def update_profile(user_id: str, payload: UserProfileUpdateRequest) -> Optional[UserProfileResponse]:
        if settings.STORAGE_MODE == "mongodb":
            db = get_db()
            updates: Dict[str, Any] = {}
            if payload.name is not None:
                updates["name"] = payload.name.strip()
            if payload.city is not None:
                updates["city"] = payload.city.strip()
            if payload.phone is not None:
                updates["phone"] = payload.phone.strip()
            if payload.preferences is not None:
                updates["preferences"] = payload.preferences.model_dump()

            if updates:
                db.users.update_one({"id": user_id}, {"$set": updates})

            raw = db.users.find_one({"id": user_id})
            user_record = clean_doc(raw)
        else:
            user_record = in_memory_store.users.get(user_id)
            if not user_record:
                return None
            if payload.name is not None:
                user_record["name"] = payload.name.strip()
            if payload.city is not None:
                user_record["city"] = payload.city.strip()
            if payload.phone is not None:
                user_record["phone"] = payload.phone.strip()
            if payload.preferences is not None:
                user_record["preferences"] = payload.preferences.model_dump()

        if not user_record:
            return None

        return UserProfileResponse(
            id=user_record["id"],
            name=user_record["name"],
            email=user_record["email"],
            city=user_record["city"],
            phone=user_record.get("phone"),
            role=user_record["role"],
            joined_date=user_record.get("joined_date", "2026-01-01"),
            department=user_record.get("department"),
            preferences=UserPreferences(**user_record.get("preferences", {})),
        )


auth_service = AuthService()
