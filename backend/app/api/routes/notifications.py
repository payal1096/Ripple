from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.services.notification_service import notification_service
from app.schemas.all_schemas import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_user_notifications(current_user: dict = Depends(get_current_user)):
    """Retrieve all notifications dispatched to the authenticated user."""
    return notification_service.get_user_notifications(current_user["id"])

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Mark an individual notification as read."""
    notif = notification_service.mark_read(notification_id, current_user["id"])
    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification '{notification_id}' not found or unauthorized.",
        )
    return notif

@router.patch("/read-all")
def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    """Mark all unread notifications for the user as read."""
    count = notification_service.mark_all_read(current_user["id"])
    return {"message": f"Marked {count} notifications as read", "updated_count": count}
