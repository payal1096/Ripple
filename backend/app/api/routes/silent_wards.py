from typing import List, Optional
from fastapi import APIRouter, Query
from app.services.silent_ward_service import silent_ward_service
from app.schemas.all_schemas import SilentWardResponse

router = APIRouter(prefix="/silent-wards", tags=["Silent Wards"])

@router.get("", response_model=List[SilentWardResponse])
def get_silent_wards(
    city: Optional[str] = Query(None, description="Filter by city"),
    status_label: Optional[str] = Query(None, description="Filter by status gap indicator"),
):
    """
    Silent Ward Analysis Engine:
    Identifies geographic municipal zones with unusually low digital complaint density
    that correlates with high population or delayed inspection cycles.
    Prevents municipal resource misallocation and promotes equitable civic maintenance.
    """
    return silent_ward_service.get_silent_wards(city=city, status_label=status_label)
