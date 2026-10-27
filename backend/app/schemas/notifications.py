from typing import Optional
from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    category: str
    timestamp: str
    is_read: bool
    link_to: str
    related_id: Optional[str] = None
