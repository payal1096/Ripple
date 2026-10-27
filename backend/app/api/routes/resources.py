from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_current_admin
from app.services.resource_service import resource_service
from app.schemas.all_schemas import (
    ResourceCreateRequest,
    ResourceUpdateRequest,
    ResourceResponse,
    AssetType,
    AssetConditionType,
)

router = APIRouter(prefix="/resources", tags=["Urban Resources"])

@router.get("", response_model=List[ResourceResponse])
def get_resources(
    category: Optional[AssetType] = Query(None, description="Filter by resource type"),
    condition: Optional[AssetConditionType] = Query(None, description="Filter by asset health condition"),
    city: Optional[str] = Query(None, description="Filter by city"),
    search: Optional[str] = Query(None, description="Search resource name or location"),
):
    """
    Retrieve urban physical assets and infrastructure resources.
    Tracked items include stormwater culverts, road corridors, waste compactor nodes,
    potable trunk lines, and lighting grids.
    """
    return resource_service.get_resources(
        category=category,
        condition=condition,
        city=city,
        search=search,
    )

@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource_by_id(resource_id: str):
    """Get single resource by its internal id or public resource_id."""
    res = resource_service.get_by_id(resource_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource with ID '{resource_id}' was not found.",
        )
    return res

@router.post("", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
def create_resource(
    payload: ResourceCreateRequest,
    current_admin: dict = Depends(get_current_admin),
):
    """
    Register new urban asset/infrastructure resource in the central registry.
    Requires administrator credentials.
    """
    return resource_service.create_resource(payload)

@router.patch("/{resource_id}", response_model=ResourceResponse)
def update_resource(
    resource_id: str,
    payload: ResourceUpdateRequest,
    current_admin: dict = Depends(get_current_admin),
):
    """
    Update urban resource operational status, condition, or inspection dates.
    Requires administrator credentials.
    """
    updated = resource_service.update_resource(resource_id, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource with ID '{resource_id}' not found.",
        )
    return updated
