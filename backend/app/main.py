import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.database import connect_to_mongo, close_mongo_connection, ping_db
from app.api.api_router import api_router
from app.api.routes.health import health_check

# Configure standard logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ripple.backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Lifespan
    logger.info("=================================================================")
    logger.info("Initializing Ripple — Urban Resource Coordination Platform")
    logger.info("Backend Phase 3: Persistent MongoDB Database Integration")
    logger.info(f"Storage Mode: {settings.STORAGE_MODE}")
    logger.info(f"MongoDB URI:  {settings.MONGODB_URI}")
    logger.info(f"Database:     {settings.MONGO_DB_NAME}")
    if settings.STORAGE_MODE == "mongodb":
        connect_to_mongo()
    logger.info("Demo Citizen Account: priya.sharma@example.com / DemoPass2026!")
    logger.info("Demo Admin Account:   admin.deshmukh@ripple.gov / DemoPass2026!")
    logger.info("=================================================================")
    yield
    # Shutdown Lifespan
    if settings.STORAGE_MODE == "mongodb":
        close_mongo_connection()
    logger.info("Ripple backend shut down cleanly.")

app = FastAPI(
    title="Ripple — Urban Resource Coordination Platform API",
    description=(
        "Backend API for Urban Resource Coordination and Predictive Management. "
        "Provides authentication, complaint logging with downstream cascade predictions, "
        "community solution reviews, Dig-Once cross-departmental coordination, "
        "and silent ward inspection gap audits."
    ),
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for modern frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Validation Exception Handler for consistent error shape
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0]["msg"] if errors else "Validation failed"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": first_error,
            "errors": errors,
            "error_code": "VALIDATION_ERROR",
        },
    )

# Include main API router with prefix /api
app.include_router(api_router)

# Health endpoint at root as well as /api/health
@app.get("/health", tags=["Health"], include_in_schema=False)
def root_health():
    return health_check()

@app.get("/", tags=["Root"])
def root():
    is_mongo = ping_db()
    return {
        "service": "Ripple — Urban Resource Coordination Platform API",
        "version": "2.0.0",
        "status": "operational",
        "storage_mode": settings.STORAGE_MODE,
        "database": settings.MONGO_DB_NAME if settings.STORAGE_MODE == "mongodb" else None,
        "mongo_connected": is_mongo,
        "documentation": "/docs",
        "health_check": "/api/health",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
