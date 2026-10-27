from fastapi import APIRouter, HTTPException, status
from app.repositories.in_memory_store import in_memory_store
from app.services.ripple_service import ripple_service
from app.schemas.all_schemas import PredictionResponse

router = APIRouter(prefix="/predictions", tags=["Predictions & Ripple Effects"])

@router.post("/analyze/{complaint_id}", response_model=PredictionResponse)
def analyze_prediction(complaint_id: str):
    """
    Simulate algorithmic ripple-effect cascade for a specific complaint.
    Maps out step-by-step downstream consequences and calculates cost avoidance through early intervention.
    """
    complaint = in_memory_store.complaints.get(complaint_id)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target complaint with ID '{complaint_id}' was not found.",
        )
    return ripple_service.analyze_complaint(complaint)

@router.get("/{complaint_id}", response_model=PredictionResponse)
def get_prediction(complaint_id: str):
    """
    Retrieve existing or generated ripple-effect projection for a complaint.
    """
    complaint = in_memory_store.complaints.get(complaint_id)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target complaint with ID '{complaint_id}' was not found.",
        )
    return ripple_service.analyze_complaint(complaint)
