import axios from 'axios';

// Resolve API Base URL for local development and future production deployment
// Does not invent a hosted backend URL; defaults to local loopback in dev and relative origin in production
const resolveApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000';
    }
  }
  // Production default when VITE_API_URL is omitted: use relative path for reverse proxy
  return '';
};

export const API_BASE_URL = resolveApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor to inject JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ripple_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export const api = {
  // System Health
  getHealth: async () => {
    const res = await apiClient.get('/api/health');
    return res.data;
  },

  // 1. Authentication
  signup: async (data: { name: string; email: string; password?: string; city: string; phone?: string }) => {
    const res = await apiClient.post('/api/auth/signup', {
      name: data.name,
      email: data.email,
      password: data.password || 'DemoPass2026!',
      city: data.city,
      phone: data.phone || null,
    });
    return res.data;
  },

  login: async (email: string, password: string = 'DemoPass2026!') => {
    const res = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/api/auth/me');
    return res.data;
  },

  updateMe: async (updates: { name?: string; city?: string; phone?: string; preferences?: any }) => {
    const res = await apiClient.patch('/api/auth/me', updates);
    return res.data;
  },

  // 2. Complaints
  createComplaint: async (data: {
    title: string;
    description: string;
    category: string;
    city: string;
    locality: string;
    street_or_landmark?: string;
    latitude?: number;
    longitude?: number;
    contact_number?: string;
    severity?: number;
  }) => {
    const res = await apiClient.post('/api/complaints', data);
    return res.data;
  },

  getMyComplaints: async () => {
    const res = await apiClient.get('/api/complaints/my');
    return res.data;
  },

  getPublicComplaints: async (params?: { category?: string; status?: string; risk_level?: string; city?: string; search?: string }) => {
    const res = await apiClient.get('/api/complaints/public', { params });
    return res.data;
  },

  getComplaintDetails: async (complaintId: string) => {
    const res = await apiClient.get(`/api/complaints/${complaintId}`);
    return res.data;
  },

  updateComplaintStatus: async (complaintId: string, newStatus: string, note?: string) => {
    const res = await apiClient.patch(`/api/complaints/${complaintId}/status`, {
      status: newStatus,
      note,
    });
    return res.data;
  },

  getComplaintHistory: async (complaintId: string) => {
    const res = await apiClient.get(`/api/complaints/${complaintId}/history`);
    return res.data;
  },

  // 3. Community Ideas
  getAllIdeas: async (params?: { status?: string; complaint_id?: string }) => {
    const res = await apiClient.get('/api/ideas', { params });
    return res.data;
  },

  submitIdea: async (data: {
    complaint_id: string;
    title: string;
    explanation: string;
    expected_benefit: string;
    tags?: string[];
  }) => {
    const res = await apiClient.post('/api/ideas', data);
    return res.data;
  },

  getMyIdeas: async () => {
    const res = await apiClient.get('/api/ideas/my');
    return res.data;
  },

  getIdeasForComplaint: async (complaintId: string) => {
    const res = await apiClient.get(`/api/ideas/complaint/${complaintId}`);
    return res.data;
  },

  reviewIdea: async (ideaId: string, status: string, admin_feedback?: string) => {
    const res = await apiClient.patch(`/api/ideas/${ideaId}/review`, {
      status,
      admin_feedback,
    });
    return res.data;
  },

  upvoteIdea: async (ideaId: string) => {
    const res = await apiClient.post(`/api/ideas/${ideaId}/upvote`);
    return res.data;
  },

  // 4. Predictions & Priority Queue
  analyzePrediction: async (complaintId: string) => {
    const res = await apiClient.post(`/api/predictions/analyze/${complaintId}`);
    return res.data;
  },

  getPrediction: async (complaintId: string) => {
    const res = await apiClient.get(`/api/predictions/${complaintId}`);
    return res.data;
  },

  getPriorityQueue: async (params?: { city?: string; category?: string; include_resolved?: boolean }) => {
    const res = await apiClient.get('/api/priority-queue', { params });
    return res.data;
  },

  // 5. Urban Resources
  getResources: async (params?: { category?: string; condition?: string; city?: string; search?: string }) => {
    const res = await apiClient.get('/api/resources', { params });
    return res.data;
  },

  getResourceById: async (resourceId: string) => {
    const res = await apiClient.get(`/api/resources/${resourceId}`);
    return res.data;
  },

  createResource: async (data: any) => {
    const res = await apiClient.post('/api/resources', data);
    return res.data;
  },

  updateResource: async (resourceId: string, updates: any) => {
    const res = await apiClient.patch(`/api/resources/${resourceId}`, updates);
    return res.data;
  },

  // 6. Work Orders & Dig-Once Conflicts
  getWorkOrders: async (params?: { road_name?: string; area?: string; status?: string; department?: string }) => {
    const res = await apiClient.get('/api/work-orders', { params });
    return res.data;
  },

  createWorkOrder: async (data: any) => {
    const res = await apiClient.post('/api/work-orders', data);
    return res.data;
  },

  getDigOnceConflicts: async () => {
    const res = await apiClient.get('/api/work-orders/conflicts');
    return res.data;
  },

  // 7. Silent Wards
  getSilentWards: async (params?: { city?: string; status_label?: string }) => {
    const res = await apiClient.get('/api/silent-wards', { params });
    return res.data;
  },

  // 8. Analytics & Notifications
  getAnalyticsOverview: async () => {
    const res = await apiClient.get('/api/analytics/overview');
    return res.data;
  },

  getComplaintsAnalytics: async () => {
    const res = await apiClient.get('/api/analytics/complaints');
    return res.data;
  },

  getResourcesAnalytics: async () => {
    const res = await apiClient.get('/api/analytics/resources');
    return res.data;
  },

  getNotifications: async () => {
    const res = await apiClient.get('/api/notifications');
    return res.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const res = await apiClient.patch(`/api/notifications/${notificationId}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await apiClient.patch('/api/notifications/read-all');
    return res.data;
  },

  // Legacy prototype mappings for backwards-compatibility
  loginAdmin: async (username: string, password: string = 'DemoPass2026!') => {
    return api.login(username, password);
  },
  getAssets: async (params?: any) => {
    return api.getResources(params);
  },
  getAsset: async (assetId: string) => {
    return api.getResourceById(assetId);
  },
  createAsset: async (assetData: any) => {
    return api.createResource(assetData);
  },
  updateAsset: async (assetId: string, updates: any) => {
    return api.updateResource(assetId, updates);
  },
  deleteAsset: async (_assetId: string) => {
    return true;
  },
  getIssues: async (params?: any) => {
    return api.getPublicComplaints(params);
  },
  getIssue: async (issueId: string) => {
    return api.getComplaintDetails(issueId);
  },
  createIssue: async (issueData: any) => {
    return api.createComplaint(issueData);
  },
  updateIssue: async (issueId: string, updates: any) => {
    return api.updateComplaintStatus(issueId, updates.status || 'In Progress', updates.note);
  },
  deleteIssue: async (_issueId: string) => {
    return true;
  },
  analyzeCascade: async (issueId: string, _rainfallScenario?: any, _maxDepth?: any) => {
    return api.analyzePrediction(issueId);
  },
  getRecentPredictions: async (_limit?: number) => {
    return [];
  },
  getPriorityCompare: async (_rainfallScenario?: any) => {
    return { traditional_queue: [], ripple_priority_queue: [], differences: [] };
  },
  getPriorityActions: async (_rainfallScenario?: any) => {
    return api.getPriorityQueue();
  },
  updateWorkOrder: async (_workOrderId: string, _updates: any) => {
    return {};
  },
  deleteWorkOrder: async (_workOrderId: string) => {
    return true;
  },
  scheduleInspection: async (_data: any) => {
    return {};
  },
  getInspections: async (_wardId?: string) => {
    return [];
  },
  submitPublicReport: async (data: any) => {
    return api.createComplaint({
      title: data.title,
      description: data.description,
      category: data.issue_category || 'General Infrastructure',
      city: 'Mumbai',
      locality: data.ward_id || 'Mumbai Ward',
      street_or_landmark: data.location_address,
      severity: data.severity || 3,
    });
  },
  trackReport: async (trackingCode: string) => {
    return api.getComplaintDetails(trackingCode);
  },
  getAdminReports: async (params?: any) => {
    return api.getPublicComplaints(params);
  },
  updateAdminReportStatus: async (reportId: string, updates: any) => {
    return api.updateComplaintStatus(reportId, updates.status || 'In Progress', updates.admin_notes);
  },
  getWeather: async (city?: string) => {
    return {
      city: city || 'Mumbai',
      current_rainfall_mm: 45,
      forecast_24h_mm: 85,
      alert_level: 'Heavy Rainfall Warning',
    };
  },
  setWeatherScenario: async (scenario: any, city?: string) => {
    return { scenario, city: city || 'Mumbai' };
  },
  getAnalyticsSummary: async () => {
    return api.getAnalyticsOverview();
  },
  getWards: async () => {
    return api.getSilentWards();
  },
};
