from typing import Optional
from pydantic import BaseModel

class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    service: str = "Ripple Urban Resource Coordination Platform"
    version: str = "2.0.0"
    timestamp: str
    storage_mode: str = "mongodb"
    mongo_connected: bool = True
    database: Optional[str] = "ripple_db"
    note: str = "MongoDB persistent storage connected and operational."
