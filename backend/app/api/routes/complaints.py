from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_current_user, get_current_admin, get_optional_current_user
from app.services.complaint_service import complaint_service
from app.schemas.all_schemas import (
    ComplaintCreateRequest,
    ComplaintStatusUpdateRequest,
    ComplaintResponse,
    ComplaintPublicResponse,
    ComplaintTimelineEntry,
)

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    payload: ComplaintCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Register a new urban problem/complaint.
    - Associated with authenticated user
    - Generates unique reference code (e.g. RPL-2026-XXXX)
    - Automatically computes ripple effect cascade and priority score
    - Initializes status timeline
    """
    return complaint_service.create_complaint(current_user, payload)

@router.get("/my", response_model=List[ComplaintResponse])
def get_my_complaints(current_user: dict = Depends(get_current_user)):
    """Retrieve all complaints reported by the currently authenticated user."""
    return complaint_service.get_my_complaints(current_user["id"])

@router.get("/public", response_model=List[ComplaintPublicResponse])
def get_public_complaints(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    city: Optional[str] = Query(None, description="Filter by city"),
    search: Optional[str] = Query(None, description="Search keyword in title, area or description"),
):
    """
    Public feed of urban complaints.
    - SENSITIVE DATA REDACTED: Citizen phone numbers, exact user IDs, personal coordinates omitted.
    - Allows community exploration of problems across the city.
    """
    return complaint_service.get_public_complaints(
        category=category,
        status=status,
        risk_level=risk_level,
        city=city,
        search=search,
    )

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint_details(
    complaint_id: str,
    current_user: Optional[dict] = Depends(get_optional_current_user),
):
    """
    Retrieve full details of a specific complaint.
    Redacts personal contact info if request is from non-owner/non-admin.
    """
    comp = complaint_service.get_complaint_details(complaint_id, current_user)
    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' was not found.",
        )
    return comp

@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: str,
    payload: ComplaintStatusUpdateRequest,
    current_admin: dict = Depends(get_current_admin),
):
    """
    Update complaint lifecycle status.
    - RESTRICTED TO ADMINISTRATORS
    - Appends entry to audit timeline
    - Dispatches notification to reporting citizen
    """
    comp = complaint_service.update_status(
        complaint_id=complaint_id,
        new_status=payload.status,
        note=payload.note,
        admin_user=current_admin,
    )
    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found.",
        )
    return comp

@router.get("/{complaint_id}/history", response_model=List[ComplaintTimelineEntry])
def get_complaint_history(complaint_id: str):
    """Retrieve full audit history timeline for a complaint."""
    comp = complaint_service.get_complaint_details(complaint_id)
    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found.",
        )
    return comp.timeline
