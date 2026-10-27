export type AssetType =
  | 'drain'
  | 'road'
  | 'waste_point'
  | 'water_pipeline'
  | 'parking'
  | 'streetlight'
  | 'public_infrastructure';

export type AssetCondition = 'healthy' | 'warning' | 'high_priority' | 'critical';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Action Recommended'
  | 'In Progress'
  | 'Needs Inspection'
  | 'Resolved'
  | 'Rejected';

export type IdeaStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Needs Revision'
  | 'Rejected'
  | 'Under Consideration'
  | 'Selected for Implementation';

export type RainfallScenario = 'low' | 'moderate' | 'heavy';

export interface UserProfile {
  name: string;
  email: string;
  city: string;
  phone?: string;
  role: 'citizen' | 'admin';
  avatar?: string;
  joinedDate: string;
  department?: string;
  preferences?: {
    emailNotifications: boolean;
    smsAlerts: boolean;
    highRiskAlertsOnly: boolean;
    compactView: boolean;
  };
}

export interface ComplaintTimelineEntry {
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  refId: string; // e.g. RPL-2026-0101
  title: string;
  description: string;
  category: string;
  city: string;
  area: string;
  landmark: string;
  locationAddress: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  severity: number; // 1 to 5
  riskLevel: RiskLevel;
  status: ComplaintStatus;
  reportedDate: string;
  reportedBy: string;
  reportedByName: string;
  contactNumber?: string;
  imageUrl?: string;
  potentialDownstreamImpact: string;
  priorityScore: number; // 1 - 100
  priorityExplanation: string;
  recommendedAction: string;
  actionExplanation: string;
  assignedDepartment: string;
  relatedResourceId?: string;
  communityIdeasCount: number;
  timeline: ComplaintTimelineEntry[];
}

export interface ResourceItem {
  id: string;
  resourceId: string; // e.g. RES-DRN-042
  name: string;
  category: AssetType;
  city: string;
  area: string;
  landmark?: string;
  condition: AssetCondition;
  lastInspection: string;
  nextInspectionDue: string;
  relatedComplaintsCount: number;
  responsibleDept: string;
  operationalStatus: string;
  notes?: string;
}

export interface CascadeStep {
  step: number;
  title: string;
  description: string;
  isConfirmed: boolean; // confirmed vs possible consequence
  affectedDomain: string;
  estimatedDelay?: string;
}

export interface RippleCascadeAnalysis {
  id: string;
  complaintId?: string;
  reportedProblem: string;
  affectedResource: string;
  relatedResources: string[];
  riskLevel: RiskLevel;
  weatherSensitivity: RainfallScenario;
  steps: CascadeStep[];
  possibleConsequences: string[];
  recommendedPreventiveAction: string;
  explanationOfRecommendation: string;
  estimatedAvoidableCost: number;
  actionUrgency: 'Immediate (0-12h)' | 'Urgent (24h)' | 'Scheduled (48h)' | 'Routine';
  coordinatingDepartments: string[];
}

export interface CommunityIdea {
  id: string;
  problemId: string;
  problemTitle: string;
  problemCategory: string;
  problemCity: string;
  title: string;
  explanation: string;
  expectedBenefit: string;
  submittedBy: string;
  submittedByName: string;
  submittedDate: string;
  status: IdeaStatus;
  adminFeedback?: string;
  upvotes: number;
  tags?: string[];
}

export interface WorkOrderRecord {
  id: string;
  workId: string; // e.g. WO-2026-904
  workTitle: string;
  roadName: string;
  area: string;
  city: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  responsibleDepartment: string;
  status: 'Scheduled' | 'In Progress' | 'Under Review' | 'Completed';
  estimatedCost: number;
  description: string;
}

export interface DigOnceConflictItem {
  conflictId: string;
  roadName: string;
  area: string;
  overlapStartDate: string;
  overlapEndDate: string;
  overlapDays: number;
  orders: WorkOrderRecord[];
  involvedDepartments: string[];
  estimatedDuplicateCost: number;
  recommendedCoordination: string;
}

export interface SilentWardRecord {
  id: string;
  areaName: string;
  wardCode: string;
  city: string;
  complaintCount: number;
  recordedInspections: number;
  lastInspectionDate: string;
  knownOutstandingProblems: number;
  dataCompleteness: number; // percentage
  populationEstimate: number;
  statusLabel: 'Potential Inspection Gap' | 'Insufficient Reporting Data' | 'Further Assessment Recommended' | 'Normal Coverage';
  flagReason: string;
  suggestedNextStep: string;
  criticalAssetsAtRisk: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'complaint_status' | 'complaint_update' | 'idea_review' | 'idea_selected' | 'dig_once_conflict';
  timestamp: string;
  isRead: boolean;
  linkTo: string;
  relatedId?: string;
}
