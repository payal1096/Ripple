from typing import List, Optional, Literal
from pydantic import BaseModel, Field

IdeaStatusType = Literal[
    "Pending Review",
    "Approved",
    "Needs Revision",
    "Rejected",
    "Under Consideration",
    "Selected for Implementation",
]

class IdeaCreateRequest(BaseModel):
    complaint_id: str
    title: str = Field(..., min_length=5, max_length=200)
    explanation: str = Field(..., min_length=15, max_length=3000)
    expected_benefit: str = Field(..., min_length=10, max_length=1000)
    tags: Optional[List[str]] = Field(default_factory=list)

class IdeaReviewRequest(BaseModel):
    status: IdeaStatusType
    admin_feedback: Optional[str] = None

class CommunityIdeaResponse(BaseModel):
    id: str
    problem_id: str
    problem_title: str
    problem_category: str
    problem_city: str
    title: str
    explanation: str
    expected_benefit: str
    submitted_by: str
    submitted_by_name: str
    submitted_date: str
    status: IdeaStatusType
    admin_feedback: Optional[str] = None
    upvotes: int = 1
    tags: List[str] = []
