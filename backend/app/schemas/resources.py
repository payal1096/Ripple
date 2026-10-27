from typing import Optional, Literal
from pydantic import BaseModel, Field

AssetType = Literal[
    "drain",
    "road",
    "waste_point",
    "water_pipeline",
    "parking",
    "streetlight",
    "public_infrastructure",
]

AssetConditionType = Literal["healthy", "warning", "high_priority", "critical"]

class ResourceCreateRequest(BaseModel):
    name: str = Field(..., min_length=3, max_length=150)
    category: AssetType
    city: str
    area: str
    landmark: Optional[str] = None
    condition: AssetConditionType = "healthy"
    last_inspection: Optional[str] = None
    next_inspection_due: Optional[str] = None
    responsible_dept: str
    operational_status: Optional[str] = "Fully operational"
    notes: Optional[str] = None

class ResourceUpdateRequest(BaseModel):
    name: Optional[str] = None
    condition: Optional[AssetConditionType] = None
    last_inspection: Optional[str] = None
    next_inspection_due: Optional[str] = None
    responsible_dept: Optional[str] = None
    operational_status: Optional[str] = None
    notes: Optional[str] = None

class ResourceResponse(BaseModel):
    id: str
    resource_id: str
    name: str
    category: AssetType
    city: str
    area: str
    landmark: Optional[str] = None
    condition: AssetConditionType
    last_inspection: str
    next_inspection_due: str
    related_complaints_count: int = 0
    responsible_dept: str
    operational_status: str
    notes: Optional[str] = None
