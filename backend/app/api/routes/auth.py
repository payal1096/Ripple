from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.services.auth_service import auth_service
from app.schemas.all_schemas import (
    UserSignupRequest,
    UserLoginRequest,
    UserProfileResponse,
    AuthResponse,
    UserProfileUpdateRequest,
    UserPreferences,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignupRequest):
    """
    Public registration endpoint.
    - Strictly creates citizen role (administrative privileges cannot be obtained via signup).
    - Hashes password securely via HMAC-SHA256 with application secret.
    - Prevents duplicate email registrations.
    """
    try:
        profile, token = auth_service.register_citizen(payload)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=profile,
        message="Account registered successfully (Development In-Memory Store)",
    )

@router.post("/login", response_model=AuthResponse)
def login(payload: UserLoginRequest):
    """
    User login endpoint.
    Validates credentials and returns signed JWT access token and sanitized profile.
    """
    result = auth_service.authenticate(payload.email, payload.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    profile, token = result
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=profile,
        message="Login successful",
    )

@router.get("/me", response_model=UserProfileResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """Retrieve profile of currently authenticated user without exposing password hashes."""
    return UserProfileResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        city=current_user["city"],
        phone=current_user.get("phone"),
        role=current_user["role"],
        joined_date=current_user.get("joined_date", "2026-01-01"),
        department=current_user.get("department"),
        preferences=UserPreferences(**current_user.get("preferences", {})),
    )

@router.patch("/me", response_model=UserProfileResponse)
def update_me(
    payload: UserProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update profile preferences or details for the authenticated user."""
    updated = auth_service.update_profile(current_user["id"], payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return updated
