"""
RIPPLE ANALYSIS SERVICE (Rule-Based Failure Propagation Engine)
==============================================================
Models urban resource interdependencies and cascading consequences.
Core College Problem Statement:
"To observe urban resource usage and demonstrate a very basic system for better coordination."
Example:
Garbage near drain -> Drain blockage -> Waterlogging -> Road damage -> Traffic disruption.

Requirements:
- Uses complaint's actual attributes (category, severity, area, description).
- Distinguishes possible downstream consequences from confirmed events.
- Never claims predicted events will definitely occur (uses conditional language).
- Flags when information is insufficient.
"""

from typing import Dict, Any, List
from app.schemas.all_schemas import (
    PredictionResponse,
    CascadeStepSchema,
    RiskLevelType,
)

class RippleService:
    @staticmethod
    def analyze_complaint(complaint: Dict[str, Any]) -> PredictionResponse:
        comp_id = complaint.get("id", "UNKNOWN")
        category = complaint.get("category", "").lower()
        title = complaint.get("title", "")
        description = complaint.get("description", "")
        area = complaint.get("area", "Urban Ward")
        severity = complaint.get("severity", 3)
        risk_level: RiskLevelType = complaint.get("risk_level", "Medium")

        pred_id = f"PRED-{comp_id}"

        # Check for insufficient information
        is_sparse = len(description.strip()) < 15 or not area

        if is_sparse:
            return PredictionResponse(
                id=pred_id,
                complaint_id=comp_id,
                reported_problem=title,
                affected_resource="Local Municipal Asset",
                related_resources=["Adjacent Public Utility Network"],
                risk_level="Low",
                weather_sensitivity="low",
                steps=[
                    CascadeStepSchema(
                        step=1,
                        title="Insufficient Reporting Data",
                        description=f"Problem reported with limited field details in {area}. Requires preliminary municipal field survey.",
                        is_confirmed=True,
                        affected_domain="Field Operations",
                        estimated_delay="Triage Pending",
                    )
                ],
                possible_consequences=[
                    "Potential localized public inconvenience if unaddressed",
                    "Telemetry data insufficient to model downstream ripple cascade",
                ],
                recommended_preventive_action="Schedule initial engineering survey to capture full dimensional measurements.",
                explanation_of_recommendation="Insufficient field parameters to establish deterministic cascade linkages.",
                estimated_avoidable_cost=30000,
                action_urgency="Low — Collect additional field metrics",
                coordinating_departments=["Municipal Field Inspection Unit"],
                disclaimer="Projections withheld due to insufficient geographic and operational telemetry.",
            )

        # 1. Drainage / Flood / Waste near Culverts
        if any(w in category for w in ["drain", "waterlog", "flood", "sewage", "stormwater"]):
            steps = [
                CascadeStepSchema(
                    step=1,
                    title="Grate & Intake Occlusion (Observed Event)",
                    description=f"Debris or silt accumulation at {area} intake restricts stormwater throughput.",
                    is_confirmed=True,
                    affected_domain="Stormwater Drainage System",
                    estimated_delay="Current State (0h)",
                ),
                CascadeStepSchema(
                    step=2,
                    title="Catch Basin Surcharge & Surface Waterlogging (Possible)",
                    description="If precipitation exceeds remaining intake throughput, standing runoff may pool 20-35cm across adjacent carriageway.",
                    is_confirmed=False,
                    affected_domain="Urban Road Transport",
                    estimated_delay="+6 to 12 hours under heavy rainfall",
                ),
                CascadeStepSchema(
                    step=3,
                    title="Subgrade Hydraulic Erosion & Pothole Expansion (Possible)",
                    description="Standing water combined with repetitive vehicle tire hydraulic suction can strip bituminous binder from road sub-base.",
                    is_confirmed=False,
                    affected_domain="Road Infrastructure Sub-base",
                    estimated_delay="+24 to 48 hours",
                ),
                CascadeStepSchema(
                    step=4,
                    title="Arterial Corridor Bottleneck & Transit Delay (Possible)",
                    description="Subgrade breakdown and lane closure could lower average corridor speed below 10 km/h, disrupting transit schedules.",
                    is_confirmed=False,
                    affected_domain="Traffic & Emergency Logistics",
                    estimated_delay="+48 to 72 hours",
                ),
            ]
            possible_consequences = [
                "Potential carriageway inundation impacting transit bus operations",
                "Possible accelerated pavement rutting and secondary pothole coalescence",
                "Potential emergency vehicle rerouting latency",
            ]
            rec_action = "Deploy mechanized desilting vacuum truck and verify catch basin clearance before heavy rain forecast."
            explanation = (
                "Intervening at Step 1 (clearing intake grate, estimated ~$25,000) prevents potential "
                "road milling and full asphalt reconstruction (estimated ~$480,000)."
            )
            avoidable_cost = 480000
            weather_sensitivity = "heavy"
            depts = [
                "Stormwater Drainage Department",
                "Roads & Traffic Infrastructure Board",
                "Traffic Police Control",
            ]
            affected_resource = "Stormwater Box Culvert & Collector Network"
            related_resources = [
                "Surface Carriageway Bituminous Layer",
                "Subsurface Optical Fiber Ducts",
                "Local Bus Transit Corridor",
            ]

        # 2. Water Pipeline / Ruptures / Seepage
        elif any(w in category for w in ["water", "pipe", "leak", "pipeline"]):
            steps = [
                CascadeStepSchema(
                    step=1,
                    title="Pressurized Joint Seepage (Observed Event)",
                    description=f"Active pressurized potable or utility water leaking into surrounding soil bedding at {area}.",
                    is_confirmed=True,
                    affected_domain="Hydraulics & Water Works",
                    estimated_delay="Current State (0h)",
                ),
                CascadeStepSchema(
                    step=2,
                    title="Subsoil Void Cavity Formation (Possible)",
                    description="High velocity fluid escaping under continuous pressure may scour granular gravel and sand bedding.",
                    is_confirmed=False,
                    affected_domain="Geotechnical Foundation",
                    estimated_delay="+24 to 48 hours",
                ),
                CascadeStepSchema(
                    step=3,
                    title="Road Surface Depression or Sinkhole Formation (Possible)",
                    description="Unsupported asphalt crust may fracture suddenly under heavy axle commercial vehicles or buses.",
                    is_confirmed=False,
                    affected_domain="Road Transportation",
                    estimated_delay="+3 to 5 days",
                ),
                CascadeStepSchema(
                    step=4,
                    title="Drinking Water Supply Interruption & Contamination (Possible)",
                    description="Line depressurization risks back-siphoning external contaminants into distribution main during supply cycles.",
                    is_confirmed=False,
                    affected_domain="Public Health & Water Supply",
                    estimated_delay="+5 days",
                ),
            ]
            possible_consequences = [
                "Potential loss of treated drinking water volume",
                "Possible sudden carriageway void or sinkhole hazard",
                "Potential drinking water cross-contamination in adjacent wards",
            ]
            rec_action = "Isolate pressure zone valve, perform acoustic leak correlation, and execute structural clamp repair."
            explanation = "Immediate joint stabilization prevents subgrade cavern collapse and road collapse catastrophe."
            avoidable_cost = 620000
            weather_sensitivity = "moderate"
            depts = [
                "Hydraulics & Water Supply",
                "Road Infrastructure Board",
                "Public Health Sanitation",
            ]
            affected_resource = "High-Pressure Potable Trunk Line (900mm)"
            related_resources = [
                "Road Foundation Bedding",
                "Stormwater Collector Gutter",
                "Adjacent Gas Distribution Pipe",
            ]

        # 3. Roads / Potholes / Carriageway
        elif any(w in category for w in ["road", "pothole", "asphalt", "traffic"]):
            steps = [
                CascadeStepSchema(
                    step=1,
                    title="Surface Asphalt Delamination (Observed Event)",
                    description=f"Localized asphalt surface breakage and depression at {area}.",
                    is_confirmed=True,
                    affected_domain="Road Surfaces",
                    estimated_delay="Current State",
                ),
                CascadeStepSchema(
                    step=2,
                    title="Water Ingress & Base Course Softening (Possible)",
                    description="Surface precipitation trapped in depressions softens underlying stone dust and aggregate base course.",
                    is_confirmed=False,
                    affected_domain="Pavement Sub-base",
                    estimated_delay="+2 to 3 days",
                ),
                CascadeStepSchema(
                    step=3,
                    title="Structural Trenching & Vehicle Suspension Damage (Possible)",
                    description="Wheel impacts on weakened edges can expand isolated potholes into continuous hazardous depressions.",
                    is_confirmed=False,
                    affected_domain="Traffic Safety",
                    estimated_delay="+5 to 7 days",
                ),
            ]
            possible_consequences = [
                "Increased two-wheeler vehicular skid risk",
                "Traffic deceleration leading to corridor congestion",
                "Potential escalation from minor cold patching to full-depth road reconstruction",
            ]
            rec_action = "Execute cold-mix bituminous mastic patching and crack sealing within 24 hours."
            explanation = "Early cold patching seals surface micro-fractures before rainwater degrades the expensive aggregate base."
            avoidable_cost = 240000
            weather_sensitivity = "heavy"
            depts = ["Roads & Traffic Infrastructure Board", "Traffic Police Control"]
            affected_resource = "Commercial Surface Carriageway Corridor"
            related_resources = ["Municipal Bus Fleet", "Adjacent Stormwater Gullies"]

        # 4. Waste Management / Garbage
        elif any(w in category for w in ["waste", "garbage", "trash", "sanitation"]):
            steps = [
                CascadeStepSchema(
                    step=1,
                    title="Solid Waste Accumulation (Observed Event)",
                    description=f"Uncollected solid waste and plastic refuse overflow at {area}.",
                    is_confirmed=True,
                    affected_domain="Solid Waste Sanitation",
                    estimated_delay="Current State",
                ),
                CascadeStepSchema(
                    step=2,
                    title="Drain Inflow Ingress During Surface Runoff (Possible)",
                    description="Rainwater runoff sweeps loose plastic bags and packaging directly into roadside stormwater grates.",
                    is_confirmed=False,
                    affected_domain="Stormwater Drainage Network",
                    estimated_delay="+12 to 24 hours under rainfall",
                ),
                CascadeStepSchema(
                    step=3,
                    title="Subsurface Culvert Damming & Odor Hazards (Possible)",
                    description="Entrapped non-biodegradable waste forms subterranean dams, stalling drainage flow.",
                    is_confirmed=False,
                    affected_domain="Public Environmental Health",
                    estimated_delay="+48 hours",
                ),
            ]
            possible_consequences = [
                "Upstream origin for secondary culvert and stormwater blockage",
                "Pedestrian diversion into active vehicular traffic lanes",
                "Stagnant water ponding and vector breeding",
            ]
            rec_action = "Dispatch mechanized compactor truck and erect solid-waste containment barricade."
            explanation = "Prompt clearing of surface garbage eliminates the primary upstream cause of urban drain failure."
            avoidable_cost = 110000
            weather_sensitivity = "moderate"
            depts = ["Solid Waste Management (SWM)", "Public Health Department"]
            affected_resource = "Secondary Waste Collection Node"
            related_resources = ["Stormwater Intake Grate", "Pedestrian Sidewalk"]

        # 5. Default General Infrastructure
        else:
            steps = [
                CascadeStepSchema(
                    step=1,
                    title="Infrastructure Disruption (Observed Event)",
                    description=f"Operational issue recorded at {area}.",
                    is_confirmed=True,
                    affected_domain="Municipal Assets",
                    estimated_delay="Current State",
                ),
                CascadeStepSchema(
                    step=2,
                    title="Secondary Network Inconvenience (Possible)",
                    description="Unresolved problem may divert civic usage or increase wear on adjacent utilities.",
                    is_confirmed=False,
                    affected_domain="Urban Infrastructure Coordination",
                    estimated_delay="+24 to 48 hours",
                ),
                CascadeStepSchema(
                    step=3,
                    title="Compound Maintenance Escalation (Possible)",
                    description="Lack of preventive triage risks multi-agency emergency repair requests.",
                    is_confirmed=False,
                    affected_domain="Municipal Operations",
                    estimated_delay="+72 hours",
                ),
            ]
            possible_consequences = [
                "Potential progressive wear on interconnected infrastructure",
                "Increased municipal repair lead-time if left unaddressed",
            ]
            rec_action = "Perform multi-departmental field inspection and log preventive repair order."
            explanation = "Proactive coordinated mitigation prevents cascading failure across municipal networks."
            avoidable_cost = 95000
            weather_sensitivity = "low"
            depts = ["Municipal Resource Coordination Bureau"]
            affected_resource = "Municipal Civil Infrastructure Grid"
            related_resources = ["Local Public Utility Network"]

        return PredictionResponse(
            id=pred_id,
            complaint_id=comp_id,
            reported_problem=title,
            affected_resource=affected_resource,
            related_resources=related_resources,
            risk_level=risk_level,
            weather_sensitivity=weather_sensitivity,
            steps=steps,
            possible_consequences=possible_consequences,
            recommended_preventive_action=rec_action,
            explanation_of_recommendation=explanation,
            estimated_avoidable_cost=avoidable_cost,
            action_urgency="High — Schedule within 24 hours" if severity >= 4 else "Moderate — Schedule within 48 hours",
            coordinating_departments=depts,
            disclaimer=(
                "These projections represent rule-based simulation models. "
                "Steps designated as 'Possible' are conditional downstream risks and require field sensor validation."
            ),
        )

ripple_service = RippleService()
