from typing import List, Optional, Literal
from pydantic import BaseModel
from app.schemas.complaints import RiskLevelType, ComplaintStatusType

class CascadeStepSchema(BaseModel):
    step: int
    title: str
    description: str
    is_confirmed: bool
    affected_domain: str
    estimated_delay: Optional[str] = None

class PredictionResponse(BaseModel):
    id: str
    complaint_id: str
    reported_problem: str
    affected_resource: str
    related_resources: List[str]
    risk_level: RiskLevelType
    weather_sensitivity: Literal["low", "moderate", "heavy"]
    steps: List[CascadeStepSchema]
    possible_consequences: List[str]
    recommended_preventive_action: str
    explanation_of_recommendation: str
    estimated_avoidable_cost: int
    action_urgency: str
    coordinating_departments: List[str]
    disclaimer: str = (
        "These projections represent rule-based simulation models. "
        "Steps designated as 'Possible' are conditional downstream risks and require field sensor validation."
    )

class PriorityQueueItem(BaseModel):
    rank: int
    complaint_id: str
    ref_id: str
    title: str
    category: str
    city: str
    area: str
    severity: int
    risk_level: RiskLevelType
    status: ComplaintStatusType
    potential_downstream_impact: str
    priority_score: int
    priority_explanation: str
    recommended_action: str
    assigned_department: str
    reported_date: str
