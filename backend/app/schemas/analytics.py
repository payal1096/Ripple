from pydantic import BaseModel

class AnalyticsOverviewResponse(BaseModel):
    total_complaints: int
    open_complaints: int
    critical_issues: int
    downstream_risks_identified: int
    preventive_actions_planned: int
    estimated_avoidable_cost: int
    storage_mode: str = "development_in_memory"
    note: str = "Demonstration analytics aggregated from development store"
