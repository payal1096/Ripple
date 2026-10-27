from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class WorkOrderCreateRequest(BaseModel):
    work_title: str = Field(..., min_length=3, max_length=150)
    road_name: str = Field(..., min_length=2, max_length=150)
    area: str = Field(..., min_length=2, max_length=100)
    city: str
    start_date: str
    end_date: str
    responsible_department: str
    estimated_cost: float = 30000.0
    status: Literal["Scheduled", "In Progress", "Under Review", "Completed"] = "Scheduled"
    description: Optional[str] = None

class WorkOrderResponse(BaseModel):
    id: str
    work_id: str
    work_title: str
    road_name: str
    area: str
    city: str
    start_date: str
    end_date: str
    responsible_department: str
    status: str
    estimated_cost: float
    description: Optional[str] = None

class DigOnceConflictResponse(BaseModel):
    conflict_id: str
    road_name: str
    area: str
    overlap_start_date: str
    overlap_end_date: str
    overlap_days: int
    orders: List[WorkOrderResponse]
    involved_departments: List[str]
    estimated_duplicate_cost: int
    recommended_coordination: str
