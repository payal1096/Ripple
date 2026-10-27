from typing import List, Literal
from pydantic import BaseModel

class SilentWardResponse(BaseModel):
    id: str
    area_name: str
    ward_code: str
    city: str
    complaint_count: int
    recorded_inspections: int
    last_inspection_date: str
    known_outstanding_problems: int
    data_completeness: int
    population_estimate: int
    status_label: Literal[
        "Potential Inspection Gap",
        "Insufficient Reporting Data",
        "Further Assessment Recommended",
        "Normal Coverage",
    ]
    flag_reason: str
    suggested_next_step: str
    critical_assets_at_risk: List[str]
