import {
  Complaint,
  ResourceItem,
  RippleCascadeAnalysis,
  CommunityIdea,
  WorkOrderRecord,
  SilentWardRecord,
  NotificationItem,
  UserProfile
} from '../types/ripple';

export const INITIAL_USER: UserProfile = {
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  city: 'Mumbai',
  phone: '+91 98201 44821',
  role: 'citizen',
  joinedDate: '2026-08-15',
  department: 'Citizen Participant',
  preferences: {
    emailNotifications: true,
    smsAlerts: false,
    highRiskAlertsOnly: false,
    compactView: false,
  }
};

export const INITIAL_ADMIN_USER: UserProfile = {
  name: 'Vikram Deshmukh',
  email: 'admin.deshmukh@ripple.gov',
  city: 'Mumbai',
  phone: '+91 98110 55290',
  role: 'admin',
  joinedDate: '2026-01-10',
  department: 'Municipal Resource Coordination Bureau',
  preferences: {
    emailNotifications: true,
    smsAlerts: true,
    highRiskAlertsOnly: true,
    compactView: false,
  }
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-001',
    refId: 'RPL-2026-0101',
    title: 'Garbage accumulation near primary stormwater drain',
    description: 'Heavy solid waste, plastic bags, and discarded packaging accumulated around the drain intake grate opposite BKC Gate 3. Inflow opening is over 60% occluded.',
    category: 'Drainage',
    city: 'Mumbai',
    area: 'Bandra Kurla Complex (BKC)',
    landmark: 'Opposite BKC Financial Gate 3',
    locationAddress: 'C-54 G Block, Bandra Kurla Complex, Mumbai',
    severity: 4,
    riskLevel: 'Critical',
    status: 'In Progress',
    reportedDate: '2026-10-24 09:15',
    reportedBy: 'priya.sharma@example.com',
    reportedByName: 'Priya Sharma',
    contactNumber: '+91 98201 44821',
    potentialDownstreamImpact: 'Storm drain blockage → Subsurface surcharge → Road surface inundation → Bitumen breakdown → Severe arterial traffic delay during rainfall.',
    priorityScore: 94,
    priorityExplanation: 'High precipitation forecast within 36 hours. Clogged storm drain will trigger ripple inundation across BKC arterial road affecting an estimated 14,000 commuters.',
    recommendedAction: 'Deploy motorized suction desilting truck and solid waste clearance crew to remove grate blockage.',
    actionExplanation: 'Immediate clearance prevents downstream road deterioration and eliminates high-risk flood pooling.',
    assignedDepartment: 'Stormwater Drainage Department (SWD)',
    relatedResourceId: 'RES-DRN-001',
    communityIdeasCount: 3,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-24 09:15',
        note: 'Reported by citizen with photo evidence via Ripple portal.',
        updatedBy: 'Priya Sharma'
      },
      {
        status: 'Under Review',
        timestamp: '2026-10-24 10:30',
        note: 'Triaged by Municipal AI Dispatch. High downstream waterlogging risk flagged.',
        updatedBy: 'Automated Ripple Engine'
      },
      {
        status: 'Action Recommended',
        timestamp: '2026-10-24 11:45',
        note: 'Preventive desilting recommended prior to scheduled weekend rains.',
        updatedBy: 'Admin Officer Deshmukh'
      },
      {
        status: 'In Progress',
        timestamp: '2026-10-25 08:00',
        note: 'SWD Maintenance Crew #4 dispatched to site with suction machinery.',
        updatedBy: 'SWD Operations Chief'
      }
    ]
  },
  {
    id: 'CMP-002',
    refId: 'RPL-2026-0102',
    title: 'High-pressure water distribution pipe fissure and seepage',
    description: 'Underground drinking water main leaking continuously onto the foundation edge of Link Road. Water pooling is undermining the road sub-base layer.',
    category: 'Water Supply',
    city: 'Mumbai',
    area: 'Andheri West',
    landmark: 'Near New Link Road Metro Station Pillar 42',
    locationAddress: 'Link Road Northbound, Andheri West, Mumbai',
    severity: 4,
    riskLevel: 'Critical',
    status: 'Action Recommended',
    reportedDate: '2026-10-25 14:20',
    reportedBy: 'kunal.mehta@example.com',
    reportedByName: 'Kunal Mehta',
    contactNumber: '+91 97654 32109',
    potentialDownstreamImpact: 'Subsoil cavitation → Roadbed collapse (sinkhole formation) → Interrupted potable water supply for 850 households.',
    priorityScore: 91,
    priorityExplanation: 'Water line pressure creates rapid subsurface erosion under asphalt. Risk of structural pavement collapse under heavy bus axle loads.',
    recommendedAction: 'Isolate feeder valve V-12, execute emergency pipeline collar joint repair, and compact gravel subgrade.',
    actionExplanation: 'Prevent catastrophic sinkhole and conserve an estimated 120,000 litres/day of treated drinking water.',
    assignedDepartment: 'Hydraulics & Water Works Department',
    relatedResourceId: 'RES-WTR-004',
    communityIdeasCount: 1,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-25 14:20',
        note: 'Citizen report of water bubbling through asphalt crack.',
        updatedBy: 'Kunal Mehta'
      },
      {
        status: 'Under Review',
        timestamp: '2026-10-25 15:10',
        note: 'Hydraulic department telemetry confirms 14% pressure drop in Sector 7 line.',
        updatedBy: 'Hydraulics Supervisory Control'
      },
      {
        status: 'Action Recommended',
        timestamp: '2026-10-25 16:30',
        note: 'Urgent coordinated repair before road sinkage worsens.',
        updatedBy: 'Admin Officer Deshmukh'
      }
    ]
  },
  {
    id: 'CMP-003',
    refId: 'RPL-2026-0103',
    title: 'Multiple sequential potholes on commercial transit corridor',
    description: 'Deep asphalt surface depressions (15-20cm deep) spanning a 45-meter stretch near the wholesale produce market. Vehicles swerving sharply to avoid damage.',
    category: 'Roads',
    city: 'Mumbai',
    area: 'Dadar West',
    landmark: 'Near Flower Market Junction',
    locationAddress: 'Senapati Bapat Marg, Dadar West, Mumbai',
    severity: 3,
    riskLevel: 'High',
    status: 'Needs Inspection',
    reportedDate: '2026-10-26 08:45',
    reportedBy: 'priya.sharma@example.com',
    reportedByName: 'Priya Sharma',
    contactNumber: '+91 98201 44821',
    potentialDownstreamImpact: 'Severe peak-hour traffic bottlenecks → Commercial delivery delays → Increased two-wheeler skid hazards.',
    priorityScore: 78,
    priorityExplanation: 'High vehicle volume area. Left unchecked, heavy axle trucks will expand potholes into complete subgrade failures within 10 days.',
    recommendedAction: 'Milling of damaged surface section and cold-mix bituminous mastic asphalt resurfacing.',
    actionExplanation: 'Immediate asphalt patching prevents vehicular suspension damage and restores traffic speed.',
    assignedDepartment: 'Roads & Traffic Infrastructure Board',
    relatedResourceId: 'RES-ROD-002',
    communityIdeasCount: 2,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-26 08:45',
        note: 'Submitted by citizen via Ripple mobile responsive interface.',
        updatedBy: 'Priya Sharma'
      },
      {
        status: 'Needs Inspection',
        timestamp: '2026-10-26 11:00',
        note: 'Marked for field engineer road-roughness and depth survey.',
        updatedBy: 'Road Maintenance Dispatcher'
      }
    ]
  },
  {
    id: 'CMP-004',
    refId: 'RPL-2026-0104',
    title: 'Overflowing municipal waste compactor bin blocking pedestrian sidewalk',
    description: 'Community waste collection point overflowed onto pedestrian walkway and into adjacent gutter. Stray cattle and dogs scattering refuse across 25 meters.',
    category: 'Waste Management',
    city: 'Mumbai',
    area: 'Kurla West',
    landmark: 'Near Station Road Auto Stand',
    locationAddress: 'Station Road, Kurla West, Mumbai',
    severity: 3,
    riskLevel: 'High',
    status: 'Submitted',
    reportedDate: '2026-10-26 16:10',
    reportedBy: 'aarav.patel@example.com',
    reportedByName: 'Aarav Patel',
    contactNumber: '+91 98223 99881',
    potentialDownstreamImpact: 'Pedestrians forced onto roadway → Secondary drain clogging as loose debris washes into roadside gullies → Vector-borne health concerns.',
    priorityScore: 75,
    priorityExplanation: 'Organic waste decay in high humidity combined with drain ingress accelerates stormwater blockages.',
    recommendedAction: 'Deploy mechanized waste compactor truck for clearance and sanitize collection perimeter.',
    actionExplanation: 'Clearing bin perimeter avoids plastic washout into the Mithi River tributary culvert.',
    assignedDepartment: 'Solid Waste Management (SWM)',
    relatedResourceId: 'RES-WST-003',
    communityIdeasCount: 4,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-26 16:10',
        note: 'Complaint registered by citizen with location coordinates.',
        updatedBy: 'Aarav Patel'
      }
    ]
  },
  {
    id: 'CMP-005',
    refId: 'RPL-2026-0105',
    title: 'Defective streetlight array creating blind corner on S.V. Road',
    description: '6 consecutive high-mast sodium lamps non-functional on an unlit 200m sharp road curve. Multiple near-misses reported between pedestrians and night buses.',
    category: 'Streetlights',
    city: 'Mumbai',
    area: 'Santacruz West',
    landmark: 'Near Milan Subway Approach Curve',
    locationAddress: 'Swami Vivekanand Road, Santacruz West, Mumbai',
    severity: 4,
    riskLevel: 'High',
    status: 'In Progress',
    reportedDate: '2026-10-23 21:00',
    reportedBy: 'rohit.verma@example.com',
    reportedByName: 'Rohit Verma',
    contactNumber: '+91 98199 11223',
    potentialDownstreamImpact: 'Elevated pedestrian fatality risk → Traffic slowdowns from erratic braking → Heightened urban vulnerability during rainy nights.',
    priorityScore: 82,
    priorityExplanation: 'Sharp curve with zero ambient illumination poses imminent life-safety risk during evening rush hours.',
    recommendedAction: 'Replace blown circuit breaker in Feeder Pillar 18 and install modern LED fixtures.',
    actionExplanation: 'Restores continuous 40-lux illumination and reduces municipal grid power consumption by 35%.',
    assignedDepartment: 'Electrical & Street Lighting Engineering',
    relatedResourceId: 'RES-LGT-005',
    communityIdeasCount: 1,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-23 21:00',
        note: 'Reported after dark by local commuter.',
        updatedBy: 'Rohit Verma'
      },
      {
        status: 'Under Review',
        timestamp: '2026-10-24 09:00',
        note: 'Confirmed trip switch fault at local feeder pillar.',
        updatedBy: 'Electrical Inspector'
      },
      {
        status: 'In Progress',
        timestamp: '2026-10-25 10:30',
        note: 'Electrical crew replacing underground cable segment and breaker.',
        updatedBy: 'Electrical Dispatch'
      }
    ]
  },
  {
    id: 'CMP-006',
    refId: 'RPL-2026-0106',
    title: 'Unauthorized heavy truck parking encroaching storm culvert cover',
    description: 'Commercial multi-axle freight carriers regularly parking directly over reinforced concrete culvert slabs, causing hairline structural cracks.',
    category: 'Parking',
    city: 'Mumbai',
    area: 'Wadala East',
    landmark: 'Truck Terminal Access Road',
    locationAddress: 'Wadala Truck Terminal Peripheral Road, Mumbai',
    severity: 2,
    riskLevel: 'Medium',
    status: 'Under Review',
    reportedDate: '2026-10-25 11:30',
    reportedBy: 'priya.sharma@example.com',
    reportedByName: 'Priya Sharma',
    contactNumber: '+91 98201 44821',
    potentialDownstreamImpact: 'Culvert slab structural fracture → Sudden roadway cave-in → Drainage obstruction during high-tide rainfall.',
    priorityScore: 68,
    priorityExplanation: 'Static load exceeds structural rating of storm box culvert. Preventive enforcement prevents costly structural replacement.',
    recommendedAction: 'Erect steel bollards along culvert embankment and establish designated parking zone 80m away.',
    actionExplanation: 'Protects critical drainage infrastructure from dead-weight stress failure.',
    assignedDepartment: 'Traffic Police & Infrastructure Enforcement',
    relatedResourceId: 'RES-PRK-006',
    communityIdeasCount: 0,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-25 11:30',
        note: 'Complaint lodged with timestamped photographs of axle loads.',
        updatedBy: 'Priya Sharma'
      },
      {
        status: 'Under Review',
        timestamp: '2026-10-26 14:00',
        note: 'Joint inspection scheduled with Traffic Police division.',
        updatedBy: 'Traffic Enforcement Liaison'
      }
    ]
  },
  {
    id: 'CMP-007',
    refId: 'RPL-2026-0107',
    title: 'Dislodged pedestrian barrier and open utility trench near school',
    description: 'Excavation safety barricades knocked over; 1.8-meter deep trench remains exposed on walking route to St. Mary High School.',
    category: 'Public Infrastructure',
    city: 'Mumbai',
    area: 'Byculla',
    landmark: 'Opposite St. Mary School Main Gate',
    locationAddress: 'Nesbit Road, Byculla, Mumbai',
    severity: 4,
    riskLevel: 'Critical',
    status: 'Resolved',
    reportedDate: '2026-10-21 07:50',
    reportedBy: 'ananya.iyer@example.com',
    reportedByName: 'Ananya Iyer',
    contactNumber: '+91 98331 77654',
    potentialDownstreamImpact: 'Severe child fall hazard → Emergency medical dispatch → Localized crowd unrest.',
    priorityScore: 96,
    priorityExplanation: 'Direct proximity to school entrance during morning drop-off hours created immediate life safety hazard.',
    recommendedAction: 'Deploy steel safety trench cover plate and install high-visibility interlocking perimeter fencing.',
    actionExplanation: 'Immediately neutralizes pedestrian fall risk while utility work is temporarily paused.',
    assignedDepartment: 'Public Works Department (PWD)',
    relatedResourceId: 'RES-INF-007',
    communityIdeasCount: 1,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-21 07:50',
        note: 'Reported by concerned parent during school transit.',
        updatedBy: 'Ananya Iyer'
      },
      {
        status: 'Under Review',
        timestamp: '2026-10-21 08:05',
        note: 'Escalated to PWD Emergency Response due to school proximity.',
        updatedBy: 'Municipal Dispatch'
      },
      {
        status: 'Action Recommended',
        timestamp: '2026-10-21 08:20',
        note: 'Emergency contractor ordered to secure site.',
        updatedBy: 'Admin Officer Deshmukh'
      },
      {
        status: 'In Progress',
        timestamp: '2026-10-21 08:50',
        note: 'Contractor on site installing rigid steel plates.',
        updatedBy: 'PWD Site Engineer'
      },
      {
        status: 'Resolved',
        timestamp: '2026-10-21 10:15',
        note: 'Trench safely plated over and surrounded by reflective interlocking barriers. Inspection passed.',
        updatedBy: 'PWD Lead Inspector'
      }
    ]
  },
  {
    id: 'CMP-008',
    refId: 'RPL-2026-0108',
    title: 'Repeated storm drain backflow into residential basements',
    description: 'During moderate evening showers, backpressure in the secondary sewer line caused foul runoff to regurgitate into basement parking.',
    category: 'Drainage',
    city: 'Pune',
    area: 'Kothrud',
    landmark: 'Near Shivaji Statue Chowk',
    locationAddress: 'Paud Road, Kothrud, Pune',
    severity: 3,
    riskLevel: 'High',
    status: 'Under Review',
    reportedDate: '2026-10-24 18:30',
    reportedBy: 'sachin.kulkarni@example.com',
    reportedByName: 'Sachin Kulkarni',
    contactNumber: '+91 94220 11988',
    potentialDownstreamImpact: 'Electrical panel inundation in basements → Structural water damage → Disease vector proliferation.',
    priorityScore: 79,
    priorityExplanation: 'Downstream silt blockage creates hydraulic head pressure forcing water back up low-elevation drains.',
    recommendedAction: 'Install non-return check valve and clear downstream main culvert blockage.',
    actionExplanation: 'Prevents wastewater backflow into 4 residential apartment complexes.',
    assignedDepartment: 'Pune Municipal Drainage Division',
    relatedResourceId: 'RES-DRN-008',
    communityIdeasCount: 1,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '2026-10-24 18:30',
        note: 'Reported by apartment association secretary.',
        updatedBy: 'Sachin Kulkarni'
      },
      {
        status: 'Under Review',
        timestamp: '2026-10-25 11:00',
        note: 'Engineering assessment team scheduled for slope gradient check.',
        updatedBy: 'Pune Drainage Engineer'
      }
    ]
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'RES-DRN-001',
    resourceId: 'RES-DRN-042',
    name: 'BKC Central Stormwater Box Culvert & Collector',
    category: 'drain',
    city: 'Mumbai',
    area: 'Bandra Kurla Complex (BKC)',
    landmark: 'G-Block Main Arterial Basin',
    condition: 'warning',
    lastInspection: '2026-09-18',
    nextInspectionDue: '2026-11-05',
    relatedComplaintsCount: 3,
    responsibleDept: 'Stormwater Drainage Department',
    operationalStatus: 'Operating at 65% capacity due to debris siltation',
    notes: 'Primary runoff conduit discharging into Mithi River tidal basin.'
  },
  {
    id: 'RES-ROD-002',
    resourceId: 'RES-ROD-104',
    name: 'Senapati Bapat Marg Commercial Corridor',
    category: 'road',
    city: 'Mumbai',
    area: 'Dadar West',
    landmark: 'Flower Market Section',
    condition: 'high_priority',
    lastInspection: '2026-10-02',
    nextInspectionDue: '2026-10-30',
    relatedComplaintsCount: 4,
    responsibleDept: 'Roads & Traffic Infrastructure Board',
    operationalStatus: 'Surface rutting and intermittent potholing',
    notes: 'Handles 42,000 PCU (Passenger Car Units) daily.'
  },
  {
    id: 'RES-WST-003',
    resourceId: 'RES-WST-019',
    name: 'Kurla Station Secondary Waste Collection Point',
    category: 'waste_point',
    city: 'Mumbai',
    area: 'Kurla West',
    landmark: 'Station Road East Corner',
    condition: 'warning',
    lastInspection: '2026-10-14',
    nextInspectionDue: '2026-10-28',
    relatedComplaintsCount: 2,
    responsibleDept: 'Solid Waste Management (SWM)',
    operationalStatus: 'Requires daily twice-mechanized clearance',
    notes: 'High pedestrian and commuter trash generation node.'
  },
  {
    id: 'RES-WTR-004',
    resourceId: 'RES-WTR-205',
    name: 'Link Road High-Pressure Potable Trunk Line (900mm)',
    category: 'water_pipeline',
    city: 'Mumbai',
    area: 'Andheri West',
    landmark: 'Metro Pillar 42 Alignment',
    condition: 'critical',
    lastInspection: '2026-08-20',
    nextInspectionDue: '2026-10-28',
    relatedComplaintsCount: 2,
    responsibleDept: 'Hydraulics & Water Works',
    operationalStatus: 'Active joint seepage detected near foundation',
    notes: 'Carries potable supply from Veravali Reservoir.'
  },
  {
    id: 'RES-LGT-005',
    resourceId: 'RES-LGT-088',
    name: 'S.V. Road Milan Subway High-Mast Lighting Grid',
    category: 'streetlight',
    city: 'Mumbai',
    area: 'Santacruz West',
    landmark: 'Milan Subway Curve',
    condition: 'warning',
    lastInspection: '2026-09-30',
    nextInspectionDue: '2026-11-15',
    relatedComplaintsCount: 1,
    responsibleDept: 'Electrical & Street Lighting',
    operationalStatus: 'Feeder pillar circuit intermittent fault',
    notes: 'Controls 14 high-efficiency luminaire fittings.'
  },
  {
    id: 'RES-PRK-006',
    resourceId: 'RES-PRK-012',
    name: 'Wadala Peripheral Commercial Vehicle Staging Bay',
    category: 'parking',
    city: 'Mumbai',
    area: 'Wadala East',
    landmark: 'Truck Terminal South Gate',
    condition: 'healthy',
    lastInspection: '2026-10-10',
    nextInspectionDue: '2026-12-01',
    relatedComplaintsCount: 1,
    responsibleDept: 'Traffic Police & Parking Authority',
    operationalStatus: 'Fully operational, enforcement required for culvert zone',
    notes: 'Designated capacity: 120 heavy commercial carriers.'
  },
  {
    id: 'RES-INF-007',
    resourceId: 'RES-INF-310',
    name: 'Nesbit Road Pedestrian Footbridge & Pathway',
    category: 'public_infrastructure',
    city: 'Mumbai',
    area: 'Byculla',
    landmark: 'St. Mary School Crossing',
    condition: 'healthy',
    lastInspection: '2026-10-21',
    nextInspectionDue: '2026-11-20',
    relatedComplaintsCount: 1,
    responsibleDept: 'Public Works Department',
    operationalStatus: 'Repaired and secured with protective barriers',
    notes: 'High school pedestrian volume during mornings and afternoons.'
  },
  {
    id: 'RES-DRN-008',
    resourceId: 'RES-DRN-112',
    name: 'Paud Road Storm Sewer Trunk Interceptor',
    category: 'drain',
    city: 'Pune',
    area: 'Kothrud',
    landmark: 'Shivaji Statue Basin',
    condition: 'warning',
    lastInspection: '2026-09-22',
    nextInspectionDue: '2026-11-01',
    relatedComplaintsCount: 2,
    responsibleDept: 'Pune Municipal Drainage Division',
    operationalStatus: 'Flow restricted during intense precipitation',
    notes: 'Connects to Mutha river basin outfall.'
  }
];

export const INITIAL_RIPPLE_ANALYSES: RippleCascadeAnalysis[] = [
  {
    id: 'RPL-ANL-001',
    complaintId: 'CMP-001',
    reportedProblem: 'Garbage accumulation near primary stormwater drain intake',
    affectedResource: 'RES-DRN-042 (BKC Central Stormwater Box Culvert)',
    relatedResources: [
      'BKC Financial Arterial Road (RES-ROD-101)',
      'Underground Telecom Ducts (RES-INF-212)',
      'Ground-level Electrical Transformer Plinth (RES-LGT-044)'
    ],
    riskLevel: 'Critical',
    weatherSensitivity: 'heavy',
    steps: [
      {
        step: 1,
        title: 'Surface Waste Accumulation',
        description: 'Uncollected single-use plastics and construction debris settle over the inlet grating.',
        isConfirmed: true,
        affectedDomain: 'Solid Waste / Sanitation',
        estimatedDelay: 'Confirmed Event'
      },
      {
        step: 2,
        title: 'Grate Blinding & Hydraulic Choking',
        description: 'As rainwater flows toward drain, debris forms an impermeable mat, cutting intake capacity by 75%.',
        isConfirmed: false,
        affectedDomain: 'Stormwater Hydraulics',
        estimatedDelay: '2 - 4 Hours into rainfall'
      },
      {
        step: 3,
        title: 'Street-Level Waterlogging & Ponding',
        description: 'Runoff overflows curbs, accumulating up to 35cm of standing water over 3 lanes of BKC arterial roadway.',
        isConfirmed: false,
        affectedDomain: 'Road Transportation',
        estimatedDelay: '4 - 8 Hours'
      },
      {
        step: 4,
        title: 'Bitumen Stripping & Pothole Genesis',
        description: 'Prolonged hydrostatic immersion strips bitumen binder from aggregate under heavy vehicle tyre pressure.',
        isConfirmed: false,
        affectedDomain: 'Road Structural Integrity',
        estimatedDelay: '12 - 24 Hours'
      },
      {
        step: 5,
        title: 'Gridlock & Emergency Transit Impasse',
        description: 'Severe traffic snarl extending 3.2km; delays emergency ambulances accessing Lilavati and Asian Heart hospitals.',
        isConfirmed: false,
        affectedDomain: 'Public Safety & Healthcare Logistics',
        estimatedDelay: '24+ Hours'
      }
    ],
    possibleConsequences: [
      'Severe stormwater back-ponding across BKC arterial road',
      'Accelerated asphalt degradation and multiple pothole eruptions',
      'Stranded low-chassis vehicles and high-voltage bus stalls',
      'Emergency ambulance transit delays to regional multi-specialty hospitals',
      'Potential water ingress into ground-mounted commercial utility transformers'
    ],
    recommendedPreventiveAction: 'Dispatch motorized suction desilting truck (SWD Unit) and waste clearance crew within 12 hours.',
    explanationOfRecommendation: 'A rapid $450 routine maintenance intervention eliminates upstream grate choking. This prevents an estimated $62,000 in emergency water-pumping costs, emergency road repaving, and commercial traffic delays.',
    estimatedAvoidableCost: 62000,
    actionUrgency: 'Immediate (0-12h)',
    coordinatingDepartments: ['Stormwater Drainage (SWD)', 'Solid Waste Management (SWM)', 'Traffic Police']
  },
  {
    id: 'RPL-ANL-002',
    complaintId: 'CMP-002',
    reportedProblem: 'High-pressure water distribution pipe fissure and sub-base seepage',
    affectedResource: 'RES-WTR-205 (Link Road Potable Trunk Line)',
    relatedResources: [
      'Link Road Northbound Carriageway (RES-ROD-102)',
      'Subsurface Telecom Fiber Ducts (RES-INF-118)',
      'Residential Potable Feeder Network (RES-WTR-210)'
    ],
    riskLevel: 'Critical',
    weatherSensitivity: 'moderate',
    steps: [
      {
        step: 1,
        title: 'Pressurized Pipe Joint Fracture',
        description: 'Pressurized potable line develops longitudinal seam failure discharging 120 L/min into surrounding soil.',
        isConfirmed: true,
        affectedDomain: 'Water Infrastructure',
        estimatedDelay: 'Confirmed Event'
      },
      {
        step: 2,
        title: 'Sub-base Aggregate Washout',
        description: 'Escaping high-velocity water liquefies and displaces compacted gravel bedding underneath the asphalt roadway.',
        isConfirmed: false,
        affectedDomain: 'Geotechnical & Road Subgrade',
        estimatedDelay: '6 - 18 Hours'
      },
      {
        step: 3,
        title: 'Sudden Structural Sinkhole Formation',
        description: 'Unsupported asphalt shell collapses under weight of passing BEST double-decker bus, opening a 2m wide sinkhole.',
        isConfirmed: false,
        affectedDomain: 'Road Safety & Traffic',
        estimatedDelay: '24 - 48 Hours'
      },
      {
        step: 4,
        title: 'Potable Contamination & Outage',
        description: 'Negative hydraulic pressure draws surrounding muddy runoff into fractured pipe, shutting off potable water to 850 homes.',
        isConfirmed: false,
        affectedDomain: 'Public Health & Utilities',
        estimatedDelay: '36 - 72 Hours'
      }
    ],
    possibleConsequences: [
      'Subgrade liquefaction creating abrupt road sinkhole on heavy transit corridor',
      'Damage to optical fiber conduits causing local banking/broadband disruption',
      'Drinking water supply disruption to 850 residential households in Sector 7',
      'Contamination of municipal potable supply via vacuum back-siphonage'
    ],
    recommendedPreventiveAction: 'Isolate upstream sluice valve V-12, execute emergency split-collar sleeve installation, and pressure-grout roadway subgrade.',
    explanationOfRecommendation: 'Immediate scheduled isolation avoids abrupt roadbed collapse, safeguarding transit commuters and conserving 180,000 litres of clean municipal water.',
    estimatedAvoidableCost: 95000,
    actionUrgency: 'Immediate (0-12h)',
    coordinatingDepartments: ['Hydraulics Department', 'Roads Department', 'Disaster Management Unit']
  },
  {
    id: 'RPL-ANL-003',
    complaintId: 'CMP-005',
    reportedProblem: 'Streetlight array cluster failure on unlit sharp highway curve',
    affectedResource: 'RES-LGT-088 (S.V. Road Milan Subway Lighting Grid)',
    relatedResources: [
      'S.V. Road Carriageway (RES-ROD-105)',
      'Subway Pedestrian Ramp (RES-INF-055)'
    ],
    riskLevel: 'High',
    weatherSensitivity: 'heavy',
    steps: [
      {
        step: 1,
        title: 'Feeder Pillar Circuit Breaker Trip',
        description: 'Moisture ingress causes ground fault, disabling 6 consecutive high-mast streetlights.',
        isConfirmed: true,
        affectedDomain: 'Electrical Engineering',
        estimatedDelay: 'Confirmed Event'
      },
      {
        step: 2,
        title: 'Critical Visibility Impairment',
        description: 'Ambient road surface illumination plummets from 45 lux to below 2 lux around a blind 70-degree curve.',
        isConfirmed: false,
        affectedDomain: 'Public Safety',
        estimatedDelay: 'Immediate upon nightfall'
      },
      {
        step: 3,
        title: 'Emergency Braking & Multi-Vehicle Collision',
        description: 'Vehicles rounding the curve fail to notice pedestrians or wet surface, resulting in abrupt pileups.',
        isConfirmed: false,
        affectedDomain: 'Traffic Safety & Healthcare',
        estimatedDelay: 'Nighttime peak traffic hours'
      }
    ],
    possibleConsequences: [
      'High rate of pedestrian vehicular strikes on unlit pedestrian crossing zone',
      'Secondary traffic stoppage through Milan subway connector',
      'Increased opportunistic street crime in dark transit underpass'
    ],
    recommendedPreventiveAction: 'Deploy electrical mobile service van to replace damaged moisture-corroded MCCB breaker and reseal junction box.',
    explanationOfRecommendation: 'Simple circuit restoration restores visibility, preventing accidents and emergency medical dispatches.',
    estimatedAvoidableCost: 28000,
    actionUrgency: 'Urgent (24h)',
    coordinatingDepartments: ['Electrical & Street Lighting', 'Traffic Police']
  },
  {
    id: 'RPL-ANL-004',
    complaintId: 'CMP-004',
    reportedProblem: 'Uncontrolled waste overflow near major stormwater culvert bridge',
    affectedResource: 'RES-WST-019 (Kurla Station Secondary Waste Collection Point)',
    relatedResources: [
      'Kurla Mithi River Outfall Culvert (RES-DRN-020)',
      'Pedestrian Walkway (RES-INF-089)'
    ],
    riskLevel: 'High',
    weatherSensitivity: 'heavy',
    steps: [
      {
        step: 1,
        title: 'Overflow Beyond Receptacle Capacity',
        description: 'Commercial packaging and market refuse overflows onto adjoining walkway and drainage kerb.',
        isConfirmed: true,
        affectedDomain: 'Solid Waste Management',
        estimatedDelay: 'Confirmed Event'
      },
      {
        step: 2,
        title: 'Surface Runoff Washout',
        description: 'First rainfall flushes low-density polyethylene bags into the nearby river tributary culvert mouth.',
        isConfirmed: false,
        affectedDomain: 'Drainage & Environmental',
        estimatedDelay: '2 - 6 Hours'
      },
      {
        step: 3,
        title: 'Culvert Screen Blinding & Low-Lying Ward Inundation',
        description: 'Accumulated trash creates a floating dam, causing dirty runoff to submerge 120 residential ground-floor tenements.',
        isConfirmed: false,
        affectedDomain: 'Urban Flood Management',
        estimatedDelay: '6 - 12 Hours'
      }
    ],
    possibleConsequences: [
      'Blockage of downstream Mithi River tributary gate',
      'Flood inundation of informal settlements in low-lying Kurla basin',
      'Post-flood vector disease outbreaks (leptospirosis and dengue)'
    ],
    recommendedPreventiveAction: 'Clear waste overflow with hydraulic compactor and install heavy-gauge wire debris barrier upstream of culvert mouth.',
    explanationOfRecommendation: 'Trash clearance prevents millions of rupees in public health remediation and emergency ward evacuation costs.',
    estimatedAvoidableCost: 75000,
    actionUrgency: 'Urgent (24h)',
    coordinatingDepartments: ['Solid Waste Management', 'Public Health Department', 'Stormwater Drainage']
  }
];

export const INITIAL_COMMUNITY_IDEAS: CommunityIdea[] = [
  {
    id: 'IDEA-001',
    problemId: 'CMP-001',
    problemTitle: 'Garbage accumulation near primary stormwater drain',
    problemCategory: 'Drainage',
    problemCity: 'Mumbai',
    title: 'Install Removable Perforated Silt Baskets Beneath Drain Gratings',
    explanation: 'Place modular, heavy-duty stainless-steel wire mesh catch-baskets inside the catch basin immediately below street grates. These baskets trap plastic debris, bottles, and silt while allowing free water egress. Sanitation workers can lift and empty them in 90 seconds without entering the drain.',
    expectedBenefit: 'Reduces drain clogging frequency by 80%, decreases desilting labor costs, and stops microplastics from reaching marine outfalls.',
    submittedBy: 'priya.sharma@example.com',
    submittedByName: 'Priya Sharma',
    submittedDate: '2026-10-24 14:00',
    status: 'Approved',
    adminFeedback: 'Excellent practical concept. Forwarded to SWD Chief Engineer for pilot test at 10 BKC junctions.',
    upvotes: 42,
    tags: ['Drainage', 'Plastic Prevention', 'Low Cost']
  },
  {
    id: 'IDEA-002',
    problemId: 'CMP-001',
    problemTitle: 'Garbage accumulation near primary stormwater drain',
    problemCategory: 'Drainage',
    problemCity: 'Mumbai',
    title: 'Community Smart Waste Sensors with Telegram / SMS Alerts for Shopkeepers',
    explanation: 'Mount ultrasonic bin level sensors on commercial garbage compactors around the market. When 80% full, the sensor automatically notifies the local commercial shopkeeper association and triggers a municipal pickup request before spillage begins.',
    expectedBenefit: 'Eliminates open spillage around drains and establishes shared municipal-merchant accountability.',
    submittedBy: 'rohit.verma@example.com',
    submittedByName: 'Rohit Verma',
    submittedDate: '2026-10-25 09:30',
    status: 'Selected for Implementation',
    adminFeedback: 'Selected for smart city innovation grant. Implementation planned for Q1 2027.',
    upvotes: 68,
    tags: ['IoT', 'Smart Sanitation', 'Community']
  },
  {
    id: 'IDEA-003',
    problemId: 'CMP-002',
    problemTitle: 'High-pressure water distribution pipe fissure and seepage',
    problemCategory: 'Water Supply',
    problemCity: 'Mumbai',
    title: 'Acoustic Leak Detection Sensor Nodes at High-Risk Metro Intersections',
    explanation: 'Attach passive acoustic vibration sensors to pipeline valve stems along the metro construction corridor. The sensors detect high-frequency pipe hiss from micro-fissures days before water surfaces and causes road collapse.',
    expectedBenefit: 'Detects invisible sub-surface leaks 72 hours earlier, preventing road cave-ins and saving millions of liters of potable water.',
    submittedBy: 'ananya.iyer@example.com',
    submittedByName: 'Ananya Iyer',
    submittedDate: '2026-10-25 18:20',
    status: 'Under Consideration',
    adminFeedback: 'Under engineering review with Hydraulics Instrumentation group.',
    upvotes: 31,
    tags: ['Acoustic Sensing', 'Water Conservation', 'Preventive']
  },
  {
    id: 'IDEA-004',
    problemId: 'CMP-003',
    problemTitle: 'Multiple sequential potholes on commercial transit corridor',
    problemCategory: 'Roads',
    problemCity: 'Mumbai',
    title: 'Geotextile Reinforcement Fabric Under Mastic Asphalt Resurfacing',
    explanation: 'Incorporate woven polypropylene geotextile interlayer membrane between the sub-base and surface bitumen layer. This distributes vehicle wheel load stresses, bridges subgrade moisture pockets, and prevents reflection cracking.',
    expectedBenefit: 'Extends road surface lifespan from 1 monsoon season to over 4 years in high-rainfall zones.',
    submittedBy: 'kunal.mehta@example.com',
    submittedByName: 'Kunal Mehta',
    submittedDate: '2026-10-26 12:15',
    status: 'Pending Review',
    upvotes: 19,
    tags: ['Civil Engineering', 'Road Durability']
  },
  {
    id: 'IDEA-005',
    problemId: 'CMP-005',
    problemTitle: 'Defective streetlight array creating blind corner on S.V. Road',
    problemCategory: 'Streetlights',
    problemCity: 'Mumbai',
    title: 'Solar-Powered Auxiliary Warning Studs (Cat-Eyes) Along Sharp Road Curve',
    explanation: 'Embed active solar-powered flashing LED road studs along the curb boundary of the sharp curve. Even if the overhead grid streetlights experience power failure, the ground road outline remains visible up to 500 meters.',
    expectedBenefit: 'Guarantees curve navigation safety regardless of municipal electrical grid outages.',
    submittedBy: 'priya.sharma@example.com',
    submittedByName: 'Priya Sharma',
    submittedDate: '2026-10-26 15:45',
    status: 'Approved',
    adminFeedback: 'High impact low cost safety measure. Traffic police department endorsed.',
    upvotes: 54,
    tags: ['Traffic Safety', 'Solar', 'Resilient Infrastructure']
  }
];

export const INITIAL_WORK_ORDERS: WorkOrderRecord[] = [
  {
    id: 'WO-001',
    workId: 'WO-2026-801',
    workTitle: 'Potable Water Distribution Trunk Replacement',
    roadName: 'BKC Central Avenue',
    area: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    startDate: '2026-11-05',
    endDate: '2026-11-18',
    responsibleDepartment: 'Hydraulics & Water Works',
    status: 'Scheduled',
    estimatedCost: 85000,
    description: 'Trenching 450 meters along median for 600mm ductile iron water main replacement.'
  },
  {
    id: 'WO-002',
    workId: 'WO-2026-802',
    workTitle: 'Underground Telecom Fiber Cable Laying Corridor',
    roadName: 'BKC Central Avenue',
    area: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    startDate: '2026-11-12',
    endDate: '2026-11-25',
    responsibleDepartment: 'Telecommunications & IT Infrastructure',
    status: 'Scheduled',
    estimatedCost: 45000,
    description: 'Excavation of northern carriageway for multi-duct high-capacity optical fiber deployment.'
  },
  {
    id: 'WO-003',
    workId: 'WO-2026-803',
    workTitle: 'Stormwater Collector Silt Basin Construction',
    roadName: 'BKC Central Avenue',
    area: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    startDate: '2026-11-10',
    endDate: '2026-11-22',
    responsibleDepartment: 'Stormwater Drainage Department',
    status: 'Under Review',
    estimatedCost: 62000,
    description: 'Excavating concrete junction chamber to intercept road runoff prior to monsoon.'
  },
  {
    id: 'WO-004',
    workId: 'WO-2026-804',
    workTitle: 'Mastic Asphalt Resurfacing & Kerb Rebuilding',
    roadName: 'Senapati Bapat Marg',
    area: 'Dadar West',
    city: 'Mumbai',
    startDate: '2026-12-01',
    endDate: '2026-12-14',
    responsibleDepartment: 'Roads & Traffic Infrastructure',
    status: 'Scheduled',
    estimatedCost: 110000,
    description: 'Full roadway milling and hot-mix asphalt overlay spanning 1.2km corridor.'
  },
  {
    id: 'WO-005',
    workId: 'WO-2026-805',
    workTitle: 'City Gas Pipeline Network Expansion',
    roadName: 'Senapati Bapat Marg',
    area: 'Dadar West',
    city: 'Mumbai',
    startDate: '2026-12-08',
    endDate: '2026-12-20',
    responsibleDepartment: 'Municipal Gas Utility Corporation',
    status: 'Scheduled',
    estimatedCost: 55000,
    description: 'Trenching for medium-pressure natural gas distribution feeder to commercial hubs.'
  },
  {
    id: 'WO-006',
    workId: 'WO-2026-806',
    workTitle: 'High-Voltage 33kV Substation Interconnection Cable',
    roadName: 'Paud Road',
    area: 'Kothrud',
    city: 'Pune',
    startDate: '2026-11-15',
    endDate: '2026-11-30',
    responsibleDepartment: 'State Electricity Transmission Corp',
    status: 'Scheduled',
    estimatedCost: 78000,
    description: 'Laying double-circuit 33kV XLPE cables along Paud Road shoulder.'
  }
];

export const INITIAL_SILENT_WARDS: SilentWardRecord[] = [
  {
    id: 'SW-001',
    areaName: 'M-East Ward (Govandi - Mankhurd)',
    wardCode: 'WARD-ME-01',
    city: 'Mumbai',
    complaintCount: 3,
    recordedInspections: 1,
    lastInspectionDate: '2026-06-12',
    knownOutstandingProblems: 14,
    dataCompleteness: 32,
    populationEstimate: 820000,
    statusLabel: 'Potential Inspection Gap',
    flagReason: 'High population density and severe aging infrastructure index, yet only 3 citizen complaints recorded in 90 days. High probability of citizen digital reporting gap and unmonitored degradation rather than pristine conditions.',
    suggestedNextStep: 'Deploy targeted municipal mobile inspection team and install public physical reporting kiosks at community health centers.',
    criticalAssetsAtRisk: ['Informal Drainage Channels', 'Secondary Water Standposts', 'Open Solid Waste Accumulation Points']
  },
  {
    id: 'SW-002',
    areaName: 'L-Ward (Kurla Industrial Belt)',
    wardCode: 'WARD-L-04',
    city: 'Mumbai',
    complaintCount: 5,
    recordedInspections: 2,
    lastInspectionDate: '2026-07-28',
    knownOutstandingProblems: 9,
    dataCompleteness: 48,
    populationEstimate: 610000,
    statusLabel: 'Insufficient Reporting Data',
    flagReason: 'Industrial effluent and high truck traffic area. Recorded inspections lag by 92 days. Sensor telemetry coverage is under 20% of designated stormwater outfalls.',
    suggestedNextStep: 'Initiate cross-department industrial environmental audit and update asset condition records in central registry.',
    criticalAssetsAtRisk: ['Industrial Outfall Sluices', 'Heavy Axle Carriageways', 'Hazardous Waste Dumpsters']
  },
  {
    id: 'SW-003',
    areaName: 'G-North (Dharavi Western Sector)',
    wardCode: 'WARD-GN-02',
    city: 'Mumbai',
    complaintCount: 4,
    recordedInspections: 1,
    lastInspectionDate: '2026-06-25',
    knownOutstandingProblems: 18,
    dataCompleteness: 38,
    populationEstimate: 750000,
    statusLabel: 'Further Assessment Recommended',
    flagReason: 'Very dense mixed commercial leather and recycling workshops with aging sub-surface drainage network. Low digital reporting density masks potential seasonal clogging risks.',
    suggestedNextStep: 'Conduct proactive foot patrol survey with hand-held sewer cameras prior to monsoon season.',
    criticalAssetsAtRisk: ['Narrow Alley Stormwater Gutters', 'Overhead Electric Wire Clusters', 'Potable Water Distribution Manifolds']
  },
  {
    id: 'SW-004',
    areaName: 'H-West Ward (Bandra West Waterfront)',
    wardCode: 'WARD-HW-01',
    city: 'Mumbai',
    complaintCount: 28,
    recordedInspections: 8,
    lastInspectionDate: '2026-10-15',
    knownOutstandingProblems: 4,
    dataCompleteness: 94,
    populationEstimate: 340000,
    statusLabel: 'Normal Coverage',
    flagReason: 'High citizen digital engagement, regular bi-weekly municipal inspections, and high asset data completeness.',
    suggestedNextStep: 'Maintain standard periodic preventive maintenance schedules.',
    criticalAssetsAtRisk: ['Seawall Stormwater Flap Gates', 'Promenade Lighting Grid']
  },
  {
    id: 'SW-005',
    areaName: 'Zone 4 (Hadapsar Industrial Perimeter)',
    wardCode: 'PUNE-Z4-03',
    city: 'Pune',
    complaintCount: 2,
    recordedInspections: 1,
    lastInspectionDate: '2026-05-18',
    knownOutstandingProblems: 11,
    dataCompleteness: 41,
    populationEstimate: 490000,
    statusLabel: 'Potential Inspection Gap',
    flagReason: 'Over 160 days since last formal municipal infrastructure inspection. Rapid warehouse expansion has added unmapped private stormwater discharge pipes.',
    suggestedNextStep: 'Schedule drone mapping flight and issue mandatory inspection notices to warehouse parks.',
    criticalAssetsAtRisk: ['Culvert Crossings', 'Industrial Arterial Bypass Road', 'Water Distribution Valves']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    title: 'Complaint Status Updated to In Progress',
    message: 'Your report RPL-2026-0101 (Garbage accumulation near BKC drain) has been assigned to Stormwater Maintenance Crew #4.',
    category: 'complaint_status',
    timestamp: '2026-10-25 08:00',
    isRead: false,
    linkTo: '/my-complaints',
    relatedId: 'CMP-001'
  },
  {
    id: 'NOTIF-002',
    title: 'Community Idea Approved by Municipal Board',
    message: 'Your idea "Install Removable Perforated Silt Baskets" for BKC drain has been approved and marked for pilot testing.',
    category: 'idea_review',
    timestamp: '2026-10-25 11:20',
    isRead: false,
    linkTo: '/community-ideas',
    relatedId: 'IDEA-001'
  },
  {
    id: 'NOTIF-003',
    title: 'Dig-Once Conflict Alert Detected',
    message: 'Coordinated excavation overlap identified on BKC Central Avenue between Hydraulics and Telecom departments.',
    category: 'dig_once_conflict',
    timestamp: '2026-10-26 09:15',
    isRead: true,
    linkTo: '/dig-once',
    relatedId: 'WO-001'
  },
  {
    id: 'NOTIF-004',
    title: 'Emergency Trench Hazard Resolved',
    message: 'Complaint RPL-2026-0107 (Open utility trench near St. Mary School) has been safely resolved with steel plating.',
    category: 'complaint_status',
    timestamp: '2026-10-21 10:15',
    isRead: true,
    linkTo: '/complaints',
    relatedId: 'CMP-007'
  },
  {
    id: 'NOTIF-005',
    title: 'Idea Selected for Implementation',
    message: 'Community idea "Smart Waste Sensors with SMS Alerts" has been approved for municipal funding allocation.',
    category: 'idea_selected',
    timestamp: '2026-10-26 14:00',
    isRead: true,
    linkTo: '/community-ideas',
    relatedId: 'IDEA-002'
  }
];
