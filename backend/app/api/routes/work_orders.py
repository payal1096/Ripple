from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_current_admin
from app.services.dig_once_service import dig_once_service
from app.schemas.all_schemas import (
    WorkOrderCreateRequest,
    WorkOrderResponse,
    DigOnceConflictResponse,
)

router = APIRouter(prefix="/work-orders", tags=["Work Orders & Dig-Once"])

@router.get("", response_model=List[WorkOrderResponse])
def get_work_orders(
    road_name: Optional[str] = Query(None, description="Filter by road or corridor"),
    area: Optional[str] = Query(None, description="Filter by area/neighborhood"),
    status: Optional[str] = Query(None, description="Filter by execution status"),
    department: Optional[str] = Query(None, description="Filter by responsible department"),
):
    """
    Retrieve planned and scheduled municipal infrastructure works.
    Includes road resurfacing, optical fiber trenching, water line repairs, and gas pipe laying.
    """
    return dig_once_service.get_all_work_orders(
        road_name=road_name,
        area=area,
        status=status,
        department=department,
    )

@router.post("", response_model=WorkOrderResponse, status_code=status.HTTP_201_CREATED)
def create_work_order(
    payload: WorkOrderCreateRequest,
    current_admin: dict = Depends(get_current_admin),
):
    """
    Schedule a new municipal utility work order.
    Requires administrative authorization.
    Persists to MongoDB work_orders collection.
    """
    return dig_once_service.create_work_order(payload)

@router.get("/conflicts", response_model=List[DigOnceConflictResponse])
def detect_dig_once_conflicts():
    """
    Dig-Once Coordination Engine:
    Detects concurrent or closely scheduled utility excavations planned on the same road segment.
    Prevents repetitive road tearing, saves budget, and mitigates commuter disruption.
    """
    return dig_once_service.detect_conflicts()
