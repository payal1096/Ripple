from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.database import ping_db
from app.schemas.all_schemas import HealthCheckResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthCheckResponse)
def health_check():
    """
    Service health check endpoint.
    Reports operational status and verifies live connection to MongoDB (ripple_db).
    """
    is_mongo = ping_db() if settings.STORAGE_MODE == "mongodb" else False
    
    if settings.STORAGE_MODE == "mongodb":
        if is_mongo:
            status_val = "healthy"
            note_val = f"Persistent MongoDB database '{settings.MONGO_DB_NAME}' connected and operational."
        else:
            status_val = "degraded"
            note_val = f"MongoDB server unreachable at {settings.MONGODB_URI}."
    else:
        status_val = "healthy"
        note_val = "In-memory development repository active."

    return HealthCheckResponse(
        status=status_val,
        service="Ripple Urban Resource Coordination Platform",
        version="2.0.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
        storage_mode=settings.STORAGE_MODE,
        mongo_connected=is_mongo,
        database=settings.MONGO_DB_NAME if settings.STORAGE_MODE == "mongodb" else None,
        note=note_val,
    )
