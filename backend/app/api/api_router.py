from fastapi import APIRouter
from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.complaints import router as complaints_router
from app.api.routes.ideas import router as ideas_router
from app.api.routes.resources import router as resources_router
from app.api.routes.predictions import router as predictions_router
from app.api.routes.priority_queue import router as priority_queue_router
from app.api.routes.work_orders import router as work_orders_router
from app.api.routes.silent_wards import router as silent_wards_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.notifications import router as notifications_router

api_router = APIRouter(prefix="/api")

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(complaints_router)
api_router.include_router(ideas_router)
api_router.include_router(resources_router)
api_router.include_router(predictions_router)
api_router.include_router(priority_queue_router)
api_router.include_router(work_orders_router)
api_router.include_router(silent_wards_router)
api_router.include_router(analytics_router)
api_router.include_router(notifications_router)
