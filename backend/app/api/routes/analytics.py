from typing import Dict, Any
from fastapi import APIRouter
from app.services.analytics_service import analytics_service
from app.schemas.all_schemas import AnalyticsOverviewResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview():
    """
    High-level operational metrics for urban resource coordination dashboards.
    Aggregates active complaints, downstream ripple risks, and estimated avoidable damage costs.
    """
    return analytics_service.get_overview()

@router.get("/complaints")
def get_complaints_analytics() -> Dict[str, Any]:
    """Breakdown of complaints across categories, risk levels, and operational statuses."""
    return analytics_service.get_complaints_breakdown()

@router.get("/resources")
def get_resources_analytics() -> Dict[str, Any]:
    """Breakdown of urban physical assets by condition and managing department."""
    return analytics_service.get_resources_breakdown()
