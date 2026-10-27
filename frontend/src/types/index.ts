export type AssetType = 'road' | 'drain' | 'waste_point' | 'water_pipeline' | 'parking';
export type AssetCondition = 'healthy' | 'warning' | 'high_priority' | 'critical';
export type RainfallScenario = 'low' | 'moderate' | 'heavy';
export type IssueStatus = 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

export interface LocationGeoJSON {
  type: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface UrbanAsset {
  id?: string;
  asset_id: string;
  asset_type: AssetType;
  name: string;
  ward_id: string;
  location: LocationGeoJSON;
  condition: AssetCondition;
  severity: number;
  connected_assets: string[];
  metadata?: Record<string, any>;
  last_inspected_at?: string;
  data_source: string;
  created_at?: string;
}

export interface UrbanIssue {
  id?: string;
  issue_id: string;
  asset_id: string;
  issue_type: string;
  title: string;
  description: string;
  severity: number;
  ward_id: string;
  department?: string;
  status: IssueStatus;
  admin_notes?: string;
  coordinates?: [number, number];
  cascade_analyzed?: boolean;
  last_cascade_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DownstreamImpactNode {
  asset_id: string;
  asset_name: string;
  asset_type: AssetType;
  predicted_issue: string;
  probability: number;
  delay_hours: number;
  cumulative_delay_hours: number;
  impact_score: number;
  path: string[];
  trigger_factors: string[];
  preventable_damage_estimate: number;
  coordinates?: [number, number];
}

export interface InterventionRecommendation {
  intervention_id: string;
  target_asset_id: string;
  target_asset_name: string;
  action_name: string;
  department: string;
  estimated_cost: number;
  prevented_damage: number;
  benefit_cost_ratio: number;
  urgency: string;
  priority_rank: number;
  rationale: string;
}

export interface CascadePrediction {
  prediction_id: string;
  root_issue_id: string;
  root_asset_id: string;
  root_title: string;
  root_issue_type: string;
  rainfall_scenario: RainfallScenario;
  downstream_nodes: DownstreamImpactNode[];
  total_cascade_risk_score: number;
  potential_damage_prevented: number;
  total_intervention_cost: number;
  interventions: InterventionRecommendation[];
  simulation_timestamp: string;
  graph_nodes_count: number;
  graph_edges_count: number;
  critical_path: string[];
}

export interface PriorityActionItem {
  rank: number;
  issue_id: string;
  asset_id: string;
  asset_name: string;
  asset_type: AssetType;
  title: string;
  location_name: string;
  ward_id: string;
  current_severity: number;
  predictive_priority_score: number;
  expected_preventable_damage: number;
  estimated_intervention_cost: number;
  urgency_factor: number;
  confidence_factor: number;
  affected_assets_count: number;
  downstream_threat: string;
  time_sensitivity: string;
  recommended_action: string;
  department: string;
  status: string;
  coordinates?: [number, number];
}

export interface PriorityShiftHighlight {
  issue_id: string;
  title: string;
  severity_rank: number;
  predictive_rank: number;
  rank_delta: number;
  explanation: string;
}

export interface PriorityComparison {
  rainfall_scenario: RainfallScenario;
  severity_ranking: PriorityActionItem[];
  predictive_ranking: PriorityActionItem[];
  highlighted_shifts: PriorityShiftHighlight[];
  formula_documentation: string;
  total_potential_damage_preventable: number;
  total_preventive_cost: number;
}

export interface WorkOrder {
  id?: string;
  work_order_id: string;
  department: string;
  road_segment_id: string;
  road_name: string;
  start_date: string;
  end_date: string;
  work_description: string;
  estimated_cost: number;
  location: string;
  coordinates?: [number, number];
  status: string;
}

export interface DigOnceConflict {
  conflict_id: string;
  road_segment_id: string;
  road_name: string;
  departments: string[];
  work_order_ids: string[];
  conflicting_orders: WorkOrder[];
  overlap_start_date: string;
  overlap_end_date: string;
  overlap_days: number;
  estimated_duplicate_cost: number;
  potential_savings: number;
  coordination_plan: string;
  recommended_action: string;
}

export interface DigOnceSummary {
  total_work_orders: number;
  total_conflicts_detected: number;
  total_potential_savings: number;
  total_duplicate_excavation_avoided: number;
  departments_involved: string[];
  conflicts: DigOnceConflict[];
}

export interface Ward {
  id?: string;
  ward_id: string;
  name: string;
  population: number;
  complaint_count: number;
  inspection_coverage_pct: number;
  infrastructure_health_score: number;
  days_since_last_inspection: number;
  data_completeness_pct: number;
  total_assets_count: number;
  vulnerable_assets_count: number;
  coordinates?: [number, number];
  silent_ward_risk_score: number;
  neglect_status: 'high_risk' | 'moderate_risk' | 'healthy' | 'inspected';
  risk_reasons: string[];
  recommended_action: string;
  last_inspected_at?: string;
}

export interface SilentWardAnalysis {
  total_wards_analyzed: number;
  high_risk_silent_wards_count: number;
  total_population_at_risk: number;
  wards: Ward[];
  scoring_methodology: string;
}

export interface Inspection {
  id?: string;
  inspection_id: string;
  ward_id: string;
  ward_name?: string;
  scheduled_date: string;
  inspector_name: string;
  target_asset_types: string[];
  priority_level: string;
  status: string;
  notes?: string;
  created_at?: string;
}

export interface PublicReport {
  id?: string;
  report_id: string;
  tracking_code: string;
  issue_category: string;
  title: string;
  description: string;
  ward_id: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  severity: number;
  status: string;
  assigned_department?: string;
  admin_notes?: string;
  created_at: string;
  timeline?: { status: string; timestamp: string; message: string }[];
}

export interface WeatherData {
  city: string;
  scenario: RainfallScenario;
  rainfall_intensity_label: string;
  rainfall_mm_per_hour: number;
  temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  condition_description: string;
  is_simulated: boolean;
  last_updated: string;
  forecast_summary: string;
}

export interface SummaryMetric {
  label: string;
  value: any;
  unit?: string;
  trend_pct?: number;
  trend_direction?: 'up' | 'down' | 'neutral';
  status: 'normal' | 'warning' | 'danger' | 'success';
  description: string;
}

export interface ResourceHealthBreakdown {
  category: string;
  total: number;
  healthy: number;
  warning: number;
  high_priority: number;
  critical: number;
}

export interface AnalyticsSummary {
  active_issues_count: number;
  predicted_cascades_count: number;
  high_priority_actions_count: number;
  estimated_preventable_costs: number;
  department_coordination_conflicts: number;
  wards_requiring_attention: number;
  total_assets_tracked: number;
  metrics: SummaryMetric[];
  issues_by_category: { category: string; count: number }[];
  issues_by_severity: { severity: string; count: number; level: number }[];
  issues_by_ward: { ward: string; count: number }[];
  resource_health: ResourceHealthBreakdown[];
  cascade_prediction_history: any[];
  coordination_savings_summary: any;
}
