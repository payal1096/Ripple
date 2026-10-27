from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_current_user, get_current_admin
from app.services.idea_service import idea_service
from app.schemas.all_schemas import (
    IdeaCreateRequest,
    IdeaReviewRequest,
    CommunityIdeaResponse,
)

router = APIRouter(prefix="/ideas", tags=["Community Ideas"])

@router.get("", response_model=List[CommunityIdeaResponse])
def get_all_ideas(
    status: Optional[str] = Query(None, description="Filter by status"),
    complaint_id: Optional[str] = Query(None, description="Filter by complaint ID"),
):
    """List all community ideas submitted for urban improvements."""
    return idea_service.get_public_ideas(status=status, complaint_id=complaint_id)

@router.post("", response_model=CommunityIdeaResponse, status_code=status.HTTP_201_CREATED)
def submit_idea(
    payload: IdeaCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Submit a citizen proposal/idea for addressing a reported urban problem.
    - Requires authentication
    - Validates complaint exists
    - Increments complaint's idea counter
    - Enters review queue with status 'Pending Review'
    """
    idea = idea_service.submit_idea(current_user, payload)
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target complaint with ID '{payload.complaint_id}' does not exist.",
        )
    return idea

@router.get("/my", response_model=List[CommunityIdeaResponse])
def get_my_ideas(current_user: dict = Depends(get_current_user)):
    """Retrieve all ideas submitted by the currently logged-in user."""
    return idea_service.get_my_ideas(current_user["email"])

@router.get("/complaint/{complaint_id}", response_model=List[CommunityIdeaResponse])
def get_ideas_for_complaint(complaint_id: str):
    """Retrieve all ideas attached to a specific complaint."""
    return idea_service.get_public_ideas(complaint_id=complaint_id)

@router.patch("/{idea_id}/review", response_model=CommunityIdeaResponse)
def review_idea(
    idea_id: str,
    payload: IdeaReviewRequest,
    current_admin: dict = Depends(get_current_admin),
):
    """
    Administrative review of a community idea.
    - RESTRICTED TO ADMINISTRATORS
    - Supports Approved, Needs Revision, Rejected, Under Consideration, Selected for Implementation
    - Attaches administrator feedback
    - Notifies the submitting citizen
    """
    idea = idea_service.review_idea(
        idea_id=idea_id,
        new_status=payload.status,
        admin_feedback=payload.admin_feedback,
        admin_user=current_admin,
    )
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Idea with ID '{idea_id}' not found.",
        )
    return idea

@router.post("/{idea_id}/upvote")
def upvote_idea(idea_id: str):
    """Upvote an idea to indicate community support."""
    new_upvotes = idea_service.upvote(idea_id)
    if new_upvotes is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Idea with ID '{idea_id}' not found.",
        )
    return {"id": idea_id, "upvotes": new_upvotes, "message": "Upvoted successfully"}
