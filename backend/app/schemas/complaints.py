from typing import List, Optional, Literal
from pydantic import BaseModel, Field

ComplaintStatusType = Literal[
    "Submitted",
    "Under Review",
    "Action Recommended",
    "In Progress",
    "Needs Inspection",
    "Resolved",
    "Rejected",
]

RiskLevelType = Literal["Low", "Medium", "High", "Critical"]

class ComplaintTimelineEntry(BaseModel):
    status: ComplaintStatusType
    timestamp: str
    note: str
    updated_by: str

class ComplaintCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=3000)
    category: str = Field(..., min_length=2, max_length=100)
    city: str = Field(..., min_length=2, max_length=100)
    locality: str = Field(..., min_length=2, max_length=150, description="Area or neighborhood")
    street_or_landmark: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_number: Optional[str] = None
    severity: int = Field(default=3, ge=1, le=5)

class ComplaintStatusUpdateRequest(BaseModel):
    status: ComplaintStatusType
    note: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: str
    ref_id: str
    title: str
    description: str
    category: str
    city: str
    area: str
    landmark: Optional[str] = None
    location_address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: int
    risk_level: RiskLevelType
    status: ComplaintStatusType
    reported_date: str
    reported_by_id: str
    reported_by_name: str
    contact_number: Optional[str] = None
    potential_downstream_impact: str
    priority_score: int
    priority_explanation: str
    recommended_action: str
    action_explanation: str
    assigned_department: str
    community_ideas_count: int = 0
    timeline: List[ComplaintTimelineEntry] = []

class ComplaintPublicResponse(BaseModel):
    id: str
    ref_id: str
    title: str
    description: str
    category: str
    city: str
    area: str
    landmark: Optional[str] = None
    location_address: str
    severity: int
    risk_level: RiskLevelType
    status: ComplaintStatusType
    reported_date: str
    community_ideas_count: int = 0
    potential_downstream_impact: str
    recommended_action: str
