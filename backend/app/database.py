"""
DATABASE CONFIGURATION & MONGODB INTEGRATION (PHASE 3)
======================================================
Connects Ripple backend to MongoDB database (ripple_db) using pymongo.
Provides database access, connection lifecycle hooks, automated initial data seeding,
and document sanitization.
"""

import copy
import logging
from typing import Optional, Dict, Any, List
from pymongo import MongoClient, ASCENDING
from pymongo.database import Database
from pymongo.errors import PyMongoError, ConnectionFailure, ServerSelectionTimeoutError
from fastapi import HTTPException, status

from app.core.config import settings
from app.repositories.in_memory_store import InMemoryStore

logger = logging.getLogger("ripple.database")

# Global MongoDB client and database instances
_mongo_client: Optional[MongoClient] = None
_mongo_db: Optional[Database] = None


def get_storage_mode() -> str:
    """Return active storage mode ('mongodb' or 'development_in_memory')."""
    return settings.STORAGE_MODE


def get_mongo_client() -> Optional[MongoClient]:
    """Return active MongoClient instance, or None if not connected."""
    global _mongo_client
    return _mongo_client


def ping_db() -> bool:
    """
    Test whether the MongoDB connection is alive and responding.
    Returns True if healthy, False otherwise.
    """
    global _mongo_client
    if _mongo_client is None:
        return False
    try:
        _mongo_client.admin.command("ping")
        return True
    except (ConnectionFailure, ServerSelectionTimeoutError, PyMongoError) as e:
        logger.warning(f"MongoDB ping failed: {e}")
        return False


def connect_to_mongo():
    """
    Connect to MongoDB server using settings.MONGODB_URI.
    Creates or selects database settings.MONGO_DB_NAME (ripple_db).
    Seeds initial collections if empty.
    """
    global _mongo_client, _mongo_db

    if settings.STORAGE_MODE != "mongodb":
        logger.info(f"Storage mode '{settings.STORAGE_MODE}' active. MongoDB connection skipped.")
        return

    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI} (Database: {settings.MONGO_DB_NAME})...")
    try:
        _mongo_client = MongoClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=3000,
        )
        # Verify connection with ping
        _mongo_client.admin.command("ping")
        _mongo_db = _mongo_client[settings.MONGO_DB_NAME]
        logger.info(f"Successfully connected to MongoDB database '{settings.MONGO_DB_NAME}'.")

        # Seed initial data if collections are empty
        seed_initial_data_if_empty(_mongo_db)

        # Create indexes
        ensure_indexes(_mongo_db)

    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"Failed to connect to MongoDB server: {e}")
        _mongo_client = None
        _mongo_db = None
    except Exception as e:
        logger.error(f"Unexpected error during MongoDB initialization: {e}")
        _mongo_client = None
        _mongo_db = None


def close_mongo_connection():
    """Cleanly close MongoDB client connection on shutdown."""
    global _mongo_client, _mongo_db
    if _mongo_client is not None:
        try:
            _mongo_client.close()
            logger.info("MongoDB client connection closed cleanly.")
        except Exception as e:
            logger.warning(f"Error closing MongoDB client: {e}")
        finally:
            _mongo_client = None
            _mongo_db = None


def get_db() -> Database:
    """
    Return active MongoDB database object.
    Raises HTTPException 503 if database connection is unavailable.
    """
    global _mongo_db, _mongo_client

    if settings.STORAGE_MODE != "mongodb":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server is configured for in-memory mode, get_db() called unexpectedly.",
        )

    if _mongo_db is None or _mongo_client is None:
        # Attempt reconnect once
        try:
            connect_to_mongo()
        except Exception:
            pass

    if _mongo_db is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB database connection unavailable. Ensure MongoDB server is running on localhost:27017.",
        )

    return _mongo_db


def clean_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Clean MongoDB document for Pydantic serialization:
    Removes raw ObjectId '_id' and ensures string 'id' field is present.
    """
    if doc is None:
        return None
    d = copy.deepcopy(doc)
    if "_id" in d:
        if "id" not in d or not d["id"]:
            d["id"] = str(d["_id"])
        del d["_id"]
    return d


def clean_docs(docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Clean a list of MongoDB documents."""
    return [clean_doc(d) for d in docs if d is not None]


def seed_initial_data_if_empty(db: Database):
    """
    Seed initial platform data into ripple_db if collections are empty.
    Preserves existing collections and avoids duplicate inserts.
    """
    fresh_seed = InMemoryStore()

    # 1. Users collection
    if db.users.count_documents({}) == 0:
        logger.info("Seeding initial users into ripple_db.users...")
        users_list = [copy.deepcopy(u) for u in fresh_seed.users.values()]
        if users_list:
            db.users.insert_many(users_list)
        logger.info(f"Seeded {len(users_list)} users.")

    # 2. Complaints collection
    if db.complaints.count_documents({}) == 0:
        logger.info("Seeding initial complaints into ripple_db.complaints...")
        complaints_list = [copy.deepcopy(c) for c in fresh_seed.complaints.values()]
        if complaints_list:
            db.complaints.insert_many(complaints_list)
        logger.info(f"Seeded {len(complaints_list)} complaints.")

    # 3. Resources collection
    if db.resources.count_documents({}) == 0:
        logger.info("Seeding initial resources into ripple_db.resources...")
        resources_list = [copy.deepcopy(r) for r in fresh_seed.resources.values()]
        if resources_list:
            db.resources.insert_many(resources_list)
        logger.info(f"Seeded {len(resources_list)} resources.")

    # 4. Ideas collection
    if db.ideas.count_documents({}) == 0:
        logger.info("Seeding initial ideas into ripple_db.ideas...")
        ideas_list = [copy.deepcopy(i) for i in fresh_seed.ideas.values()]
        if ideas_list:
            db.ideas.insert_many(ideas_list)
        logger.info(f"Seeded {len(ideas_list)} community ideas.")

    # 5. Work Orders collection
    if db.work_orders.count_documents({}) == 0:
        logger.info("Seeding initial work orders into ripple_db.work_orders...")
        orders_list = [copy.deepcopy(w) for w in fresh_seed.work_orders.values()]
        if orders_list:
            db.work_orders.insert_many(orders_list)
        logger.info(f"Seeded {len(orders_list)} work orders.")

    # 6. Silent Wards collection
    if db.silent_wards.count_documents({}) == 0:
        logger.info("Seeding initial silent wards into ripple_db.silent_wards...")
        wards_list = [copy.deepcopy(s) for s in fresh_seed.silent_wards.values()]
        if wards_list:
            db.silent_wards.insert_many(wards_list)
        logger.info(f"Seeded {len(wards_list)} silent wards.")

    # 7. Notifications collection
    if db.notifications.count_documents({}) == 0:
        logger.info("Seeding initial notifications into ripple_db.notifications...")
        notifs_list = [copy.deepcopy(n) for n in fresh_seed.notifications.values()]
        if notifs_list:
            db.notifications.insert_many(notifs_list)
        logger.info(f"Seeded {len(notifs_list)} notifications.")


def ensure_indexes(db: Database):
    """Create essential MongoDB indexes for optimal performance and uniqueness."""
    try:
        db.users.create_index([("email", ASCENDING)], unique=True)
        db.users.create_index([("id", ASCENDING)], unique=True)
        db.complaints.create_index([("id", ASCENDING)], unique=True)
        db.complaints.create_index([("reported_by_id", ASCENDING)])
        db.complaints.create_index([("status", ASCENDING)])
        db.resources.create_index([("id", ASCENDING)], unique=True)
        db.resources.create_index([("resource_id", ASCENDING)])
        db.ideas.create_index([("id", ASCENDING)], unique=True)
        db.ideas.create_index([("problem_id", ASCENDING)])
        db.work_orders.create_index([("id", ASCENDING)], unique=True)
        db.silent_wards.create_index([("id", ASCENDING)], unique=True)
        db.notifications.create_index([("id", ASCENDING)], unique=True)
        db.notifications.create_index([("user_id", ASCENDING)])
    except Exception as e:
        logger.warning(f"Note on MongoDB index creation: {e}")
