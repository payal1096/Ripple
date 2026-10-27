from typing import Optional, Literal
import re
from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

class UserPreferences(BaseModel):
    email_notifications: bool = True
    sms_alerts: bool = False
    high_risk_alerts_only: bool = False
    compact_view: bool = False

class UserSignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=6, max_length=128)
    city: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(EMAIL_REGEX, v):
            raise ValueError("Invalid email address format.")
        return v

class UserLoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=120)
    password: str

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(EMAIL_REGEX, v):
            raise ValueError("Invalid email address format.")
        return v

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    city: str
    phone: Optional[str] = None
    role: Literal["citizen", "admin"] = "citizen"
    joined_date: str
    department: Optional[str] = None
    preferences: UserPreferences = Field(default_factory=UserPreferences)

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
    message: str = "Authentication successful"

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    preferences: Optional[UserPreferences] = None
