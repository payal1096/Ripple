from typing import List, Optional
from fastapi import APIRouter, Query
from app.services.priority_service import priority_service
from app.schemas.all_schemas import PriorityQueueItem

router = APIRouter(prefix="/priority-queue", tags=["Priority Queue"])

@router.get("", response_model=List[PriorityQueueItem])
def get_priority_queue(
    city: Optional[str] = Query(None, description="Filter by city"),
    category: Optional[str] = Query(None, description="Filter by category"),
    include_resolved: bool = Query(False, description="Include resolved complaints"),
):
    """
    Retrieve urban problem queue prioritized by downstream failure risk,
    severity, and weather vulnerability.
    """
    return priority_service.get_ranked_queue(
        city=city,
        category=category,
        include_resolved=include_resolved,
    )
