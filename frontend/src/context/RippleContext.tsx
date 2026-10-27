import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Complaint,
  ComplaintStatus,
  ResourceItem,
  RippleCascadeAnalysis,
  CommunityIdea,
  IdeaStatus,
  WorkOrderRecord,
  DigOnceConflictItem,
  SilentWardRecord,
  NotificationItem,
  RainfallScenario
} from '../types/ripple';
import {
  INITIAL_USER,
  INITIAL_ADMIN_USER,
  INITIAL_COMPLAINTS,
  INITIAL_RESOURCES,
  INITIAL_RIPPLE_ANALYSES,
  INITIAL_COMMUNITY_IDEAS,
  INITIAL_WORK_ORDERS,
  INITIAL_SILENT_WARDS,
  INITIAL_NOTIFICATIONS
} from '../services/initialMockData';
import { api } from '../services/api';

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface RippleContextType {
  // Connection status & loading states
  isBackendConnected: boolean;
  isLoadingInitialData: boolean;
  refreshBackendData: () => Promise<void>;

  // Authentication & Profile
  currentUser: UserProfile;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: { name: string; email: string; password?: string; city: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  toggleAdminDemo: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Complaints & Issues
  complaints: Complaint[];
  addComplaint: (data: Omit<Complaint, 'id' | 'refId' | 'status' | 'reportedDate' | 'reportedBy' | 'reportedByName' | 'communityIdeasCount' | 'timeline'>) => Complaint;
  updateComplaintStatus: (complaintId: string, newStatus: ComplaintStatus, note?: string) => void;
  getComplaintById: (id: string) => Complaint | undefined;

  // Resources
  resources: ResourceItem[];
  addResource: (data: Omit<ResourceItem, 'id' | 'resourceId'>) => ResourceItem;
  updateResource: (id: string, data: Partial<ResourceItem>) => void;
  deleteResource: (id: string) => void;

  // Community Ideas
  communityIdeas: CommunityIdea[];
  addCommunityIdea: (data: { problemId: string; title: string; explanation: string; expectedBenefit: string; tags?: string[] }) => CommunityIdea;
  updateIdeaStatus: (id: string, newStatus: IdeaStatus, adminFeedback?: string) => void;
  upvoteIdea: (id: string) => void;

  // Dig-Once Detector
  workOrders: WorkOrderRecord[];
  addWorkOrder: (data: Omit<WorkOrderRecord, 'id' | 'workId'>) => WorkOrderRecord;
  deleteWorkOrder: (id: string) => void;
  digOnceConflicts: DigOnceConflictItem[];

  // Silent Ward Detector
  silentWards: SilentWardRecord[];

  // Cascade Analyses
  rippleAnalyses: RippleCascadeAnalysis[];

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadCount: number;

  // Scenario & Weather
  currentScenario: RainfallScenario;
  setCurrentScenario: (scenario: RainfallScenario) => void;

  // Feedback Toasts
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastItem['type'], title?: string) => void;
  removeToast: (id: string) => void;

  // Reset to default sample dataset
  resetToDefaultData: () => void;
}

const RippleContext = createContext<RippleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'ripple_user_profile',
  IS_ADMIN: 'ripple_is_admin',
  COMPLAINTS: 'ripple_complaints_v1',
  RESOURCES: 'ripple_resources_v1',
  IDEAS: 'ripple_community_ideas_v1',
  WORK_ORDERS: 'ripple_work_orders_v1',
  SILENT_WARDS: 'ripple_silent_wards_v1',
  NOTIFICATIONS: 'ripple_notifications_v1',
  SCENARIO: 'ripple_rainfall_scenario'
};

export const RippleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Auth & Role State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_ADMIN);
    return saved ? JSON.parse(saved) : false;
  });

  // 2. Complaints State
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMPLAINTS;
      }
    }
    return INITIAL_COMPLAINTS;
  });

  // 3. Resources State
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RESOURCES;
      }
    }
    return INITIAL_RESOURCES;
  });

  // 4. Community Ideas State
  const [communityIdeas, setCommunityIdeas] = useState<CommunityIdea[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMMUNITY_IDEAS;
      }
    }
    return INITIAL_COMMUNITY_IDEAS;
  });

  // 5. Work Orders (Dig-Once)
  const [workOrders, setWorkOrders] = useState<WorkOrderRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_WORK_ORDERS;
      }
    }
    return INITIAL_WORK_ORDERS;
  });

  // 6. Silent Ward records
  const [silentWards, setSilentWards] = useState<SilentWardRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SILENT_WARDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SILENT_WARDS;
      }
    }
    return INITIAL_SILENT_WARDS;
  });

  // 7. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // 8. Scenario & Toasts
  const [currentScenario, setCurrentScenario] = useState<RainfallScenario>(() => {
    return (localStorage.getItem(STORAGE_KEYS.SCENARIO) as RainfallScenario) || 'moderate';
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // 9. Backend Connection & Synchronization States
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState<boolean>(false);

  // Safe Mappers to ensure snake_case backend JSON matches camelCase frontend state
  const mapComplaintFromApi = (raw: any, existingFallback?: Complaint): Complaint => {
    return {
      id: raw.id || existingFallback?.id || '',
      refId: raw.ref_id || raw.refId || existingFallback?.refId || raw.id || '',
      title: raw.title || existingFallback?.title || '',
      description: raw.description || existingFallback?.description || '',
      category: raw.category || existingFallback?.category || 'General',
      city: raw.city || existingFallback?.city || 'Mumbai',
      area: raw.area || existingFallback?.area || '',
      landmark: raw.landmark || existingFallback?.landmark || '',
      locationAddress: raw.location_address || raw.locationAddress || existingFallback?.locationAddress || raw.area || '',
      latitude: raw.latitude ?? existingFallback?.latitude,
      longitude: raw.longitude ?? existingFallback?.longitude,
      severity: raw.severity ?? existingFallback?.severity ?? 3,
      riskLevel: raw.risk_level || raw.riskLevel || existingFallback?.riskLevel || 'Medium',
      status: raw.status || existingFallback?.status || 'Submitted',
      reportedDate: raw.reported_date || raw.reportedDate || existingFallback?.reportedDate || '',
      reportedBy: raw.reported_by_id || raw.reportedBy || existingFallback?.reportedBy || '',
      reportedByName: raw.reported_by_name || raw.reportedByName || existingFallback?.reportedByName || 'Citizen Reporter',
      contactNumber: raw.contact_number || raw.contactNumber || existingFallback?.contactNumber,
      potentialDownstreamImpact: raw.potential_downstream_impact || raw.potentialDownstreamImpact || existingFallback?.potentialDownstreamImpact || '',
      priorityScore: raw.priority_score ?? raw.priorityScore ?? existingFallback?.priorityScore ?? 50,
      priorityExplanation: raw.priority_explanation || raw.priorityExplanation || existingFallback?.priorityExplanation || '',
      recommendedAction: raw.recommended_action || raw.recommendedAction || existingFallback?.recommendedAction || '',
      actionExplanation: raw.action_explanation || raw.actionExplanation || existingFallback?.actionExplanation || '',
      assignedDepartment: raw.assigned_department || raw.assignedDepartment || existingFallback?.assignedDepartment || 'Municipal Operations',
      communityIdeasCount: raw.community_ideas_count ?? raw.communityIdeasCount ?? existingFallback?.communityIdeasCount ?? 0,
      timeline: raw.timeline || existingFallback?.timeline || [
        {
          status: raw.status || 'Submitted',
          timestamp: raw.reported_date || '',
          note: 'Report recorded in Ripple system.',
          updatedBy: raw.reported_by_name || 'System',
        },
      ],
    };
  };

  const mapResourceFromApi = (raw: any, existingFallback?: ResourceItem): ResourceItem => {
    return {
      id: raw.id || existingFallback?.id || '',
      resourceId: raw.resource_id || raw.resourceId || existingFallback?.resourceId || raw.id || '',
      name: raw.name || existingFallback?.name || '',
      category: raw.category || existingFallback?.category || 'drain',
      city: raw.city || existingFallback?.city || 'Mumbai',
      area: raw.area || existingFallback?.area || '',
      landmark: raw.landmark || existingFallback?.landmark,
      condition: raw.condition || existingFallback?.condition || 'healthy',
      lastInspection: raw.last_inspection || raw.lastInspection || existingFallback?.lastInspection || '',
      nextInspectionDue: raw.next_inspection_due || raw.nextInspectionDue || existingFallback?.nextInspectionDue || '',
      relatedComplaintsCount: raw.related_complaints_count ?? raw.relatedComplaintsCount ?? existingFallback?.relatedComplaintsCount ?? 0,
      responsibleDept: raw.responsible_dept || raw.responsibleDept || existingFallback?.responsibleDept || 'Public Works',
      operationalStatus: raw.operational_status || raw.operationalStatus || existingFallback?.operationalStatus || 'Operational',
      notes: raw.notes || existingFallback?.notes,
    };
  };

  const refreshBackendData = async () => {
    setIsLoadingInitialData(true);
    try {
      const health = await api.getHealth();
      if (health && health.status === 'healthy') {
        setIsBackendConnected(true);

        // 1. Fetch live complaints from backend
        const liveComplaints = await api.getPublicComplaints();
        if (Array.isArray(liveComplaints) && liveComplaints.length > 0) {
          setComplaints((currentComplaints) => {
            const existingMap = new Map(currentComplaints.map((c) => [c.id, c]));
            const mapped = liveComplaints.map((raw) => mapComplaintFromApi(raw, existingMap.get(raw.id)));
            // Retain any locally filed complaints that aren't yet in the public feed
            const backendIds = new Set(mapped.map((c) => c.id));
            const localOnly = currentComplaints.filter((c) => !backendIds.has(c.id));
            return [...mapped, ...localOnly];
          });
        }

        // 2. Fetch live resources from backend
        const liveResources = await api.getResources();
        if (Array.isArray(liveResources) && liveResources.length > 0) {
          setResources((currentResources) => {
            const existingMap = new Map(currentResources.map((r) => [r.id, r]));
            return liveResources.map((raw) => mapResourceFromApi(raw, existingMap.get(raw.id)));
          });
        }
      } else {
        setIsBackendConnected(false);
      }
    } catch {
      // Backend unavailable; smoothly retain demo fallback data
      setIsBackendConnected(false);
    } finally {
      setIsLoadingInitialData(false);
    }
  };

  // Mount-time synchronization hook
  useEffect(() => {
    refreshBackendData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(communityIdeas));
  }, [communityIdeas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SILENT_WARDS, JSON.stringify(silentWards));
  }, [silentWards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCENARIO, currentScenario);
  }, [currentScenario]);

  // Toast Helpers
  const showToast = (message: string, type: ToastItem['type'] = 'info', title?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
  const login = async (email: string, password?: string): Promise<{ success: boolean; message: string }> => {
    // 1. Try real backend API login
    try {
      const res = await api.login(email, password || 'DemoPass2026!');
      if (res && res.access_token) {
        localStorage.setItem('ripple_auth_token', res.access_token);
        const u = res.user;
        const loggedUser: UserProfile = {
          name: u.name,
          email: u.email,
          city: u.city,
          phone: u.phone || '',
          role: u.role,
          joinedDate: u.joined_date,
          department: u.department || (u.role === 'admin' ? 'Municipal Operations' : 'Citizen Participant'),
          preferences: {
            emailNotifications: u.preferences?.email_notifications ?? true,
            smsAlerts: u.preferences?.sms_alerts ?? false,
            highRiskAlertsOnly: u.preferences?.high_risk_alerts_only ?? false,
            compactView: u.preferences?.compact_view ?? false,
          }
        };
        setCurrentUser(loggedUser);
        setIsAdmin(u.role === 'admin');
        showToast(
          `Connected to Ripple API as ${u.name} (${u.role.toUpperCase()})`,
          'success',
          'API Authentication'
        );
        return { success: true, message: `Logged in as ${u.name}` };
      }
    } catch (err: any) {
      console.warn('Backend API login unavailable or rejected, using local state fallback', err);
      if (err?.response?.status === 401) {
        showToast('Invalid email or password', 'error', 'Login Failed');
        return { success: false, message: 'Invalid credentials' };
      }
    }

    // 2. Fallback to demonstration login if backend server is not running
    const lower = email.trim().toLowerCase();
    if (lower.includes('admin') || lower === INITIAL_ADMIN_USER.email.toLowerCase()) {
      setCurrentUser(INITIAL_ADMIN_USER);
      setIsAdmin(true);
      showToast(`Welcome back, Officer ${INITIAL_ADMIN_USER.name} (Demo Mode — Backend Offline)`, 'info', 'Demo Login');
      return { success: true, message: 'Logged in as Demonstration Administrator' };
    }

    const citizenUser: UserProfile = {
      ...INITIAL_USER,
      email: email.trim(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Citizen User'
    };
    setCurrentUser(citizenUser);
    setIsAdmin(false);
    showToast(`Welcome to Ripple, ${citizenUser.name} (Demo Mode — Backend Offline)`, 'info', 'Demo Login');
    return { success: true, message: 'Logged in as Demonstration Citizen' };
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password?: string;
    city: string;
    phone?: string;
  }): Promise<{ success: boolean; message: string }> => {
    // 1. Try real backend API signup
    try {
      const res = await api.signup(userData);
      if (res && res.access_token) {
        localStorage.setItem('ripple_auth_token', res.access_token);
        const u = res.user;
        const newUser: UserProfile = {
          name: u.name,
          email: u.email,
          city: u.city,
          phone: u.phone || '',
          role: 'citizen',
          joinedDate: u.joined_date,
          department: u.department || 'Citizen Participant',
          preferences: {
            emailNotifications: true,
            smsAlerts: false,
            highRiskAlertsOnly: false,
            compactView: false,
          }
        };
        setCurrentUser(newUser);
        setIsAdmin(false);
        showToast(`Account registered on backend for ${newUser.name}`, 'success', 'Live Account Created');
        return { success: true, message: 'Account created via Ripple API' };
      }
    } catch (err: any) {
      console.warn('Backend API signup unavailable or rejected, using local state fallback', err);
      if (err?.response?.data?.detail) {
        showToast(err.response.data.detail, 'error', 'Registration Error');
        return { success: false, message: err.response.data.detail };
      }
    }

    // 2. Fallback to demonstration signup if backend is offline
    const newUser: UserProfile = {
      name: userData.name.trim(),
      email: userData.email.trim(),
      city: userData.city.trim(),
      phone: userData.phone?.trim() || '',
      role: 'citizen',
      joinedDate: new Date().toISOString().split('T')[0],
      department: 'Citizen Community',
      preferences: {
        emailNotifications: true,
        smsAlerts: false,
        highRiskAlertsOnly: false,
        compactView: false,
      }
    };
    setCurrentUser(newUser);
    setIsAdmin(false);
    showToast(`Account registered for ${newUser.name} (Demo Mode — Backend Offline).`, 'info', 'Offline Mode');
    return { success: true, message: 'Account created in frontend demonstration store' };
  };

  const logout = () => {
    setCurrentUser({
      name: 'Guest Citizen',
      email: 'guest@ripple.demo',
      city: 'Mumbai',
      role: 'citizen',
      joinedDate: '2026-10-01'
    });
    setIsAdmin(false);
    showToast('Signed out of demonstration session', 'info');
  };

  const toggleAdminDemo = () => {
    if (isAdmin) {
      setCurrentUser(INITIAL_USER);
      setIsAdmin(false);
      showToast('Switched to Citizen Demonstration View', 'info', 'Role Changed');
    } else {
      setCurrentUser(INITIAL_ADMIN_USER);
      setIsAdmin(true);
      showToast('Switched to Municipal Administrator Operations Mode', 'warning', 'Admin Mode Activated');
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated in demonstration state', 'success');
  };

  // Complaint Operations
  const addComplaint = (
    data: Omit<Complaint, 'id' | 'refId' | 'status' | 'reportedDate' | 'reportedBy' | 'reportedByName' | 'communityIdeasCount' | 'timeline'>
  ): Complaint => {
    const nextNum = complaints.length + 101;
    const refId = `RPL-2026-${String(nextNum).padStart(4, '0')}`;
    const id = `CMP-${Date.now().toString(36).toUpperCase()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newComplaint: Complaint = {
      ...data,
      id,
      refId,
      status: 'Submitted',
      reportedDate: nowStr,
      reportedBy: currentUser.email,
      reportedByName: currentUser.name,
      communityIdeasCount: 0,
      timeline: [
        {
          status: 'Submitted',
          timestamp: nowStr,
          note: `Report submitted via Ripple online portal by ${currentUser.name}.`,
          updatedBy: currentUser.name
        }
      ]
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Add a confirmation notification
    const newNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: `Complaint Submitted (${refId})`,
      message: `Your report "${newComplaint.title}" has been registered in the demonstration queue.`,
      category: 'complaint_status',
      timestamp: nowStr,
      isRead: false,
      linkTo: '/my-complaints',
      relatedId: newComplaint.id
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Background dispatch to backend API if active
    api.createComplaint({
      title: newComplaint.title,
      description: newComplaint.description,
      category: newComplaint.category,
      city: newComplaint.city,
      locality: newComplaint.area,
      street_or_landmark: newComplaint.landmark,
      latitude: newComplaint.latitude,
      longitude: newComplaint.longitude,
      contact_number: newComplaint.contactNumber,
      severity: newComplaint.severity,
    })
      .then((created) => {
        if (created && created.id) {
          setComplaints((prev) =>
            prev.map((c) => (c.id === id ? mapComplaintFromApi(created, c) : c))
          );
        }
      })
      .catch((err) => {
        console.log('Background API complaint sync (offline fallback active):', err?.message || err);
      });

    showToast(`Complaint registered successfully! Reference ID: ${refId}`, 'success', 'Submitted');
    return newComplaint;
  };

  const updateComplaintStatus = (complaintId: string, newStatus: ComplaintStatus, note?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetRef = '';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          targetRef = c.refId;
          const updatedTimeline = [
            ...c.timeline,
            {
              status: newStatus,
              timestamp: nowStr,
              note: note || `Status updated to ${newStatus} in demonstration triage.`,
              updatedBy: currentUser.name
            }
          ];
          return {
            ...c,
            status: newStatus,
            timeline: updatedTimeline
          };
        }
        return c;
      })
    );

    // Background sync to backend API
    api.updateComplaintStatus(complaintId, newStatus, note).catch((err) => {
      console.log('Background API status update (offline fallback active):', err.message);
    });

    // Create notification
    const newNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: `Complaint Status Changed to ${newStatus}`,
      message: `Complaint ${targetRef || complaintId} is now marked as "${newStatus}".`,
      category: 'complaint_status',
      timestamp: nowStr,
      isRead: false,
      linkTo: '/complaints',
      relatedId: complaintId
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Updated ${targetRef || 'complaint'} status to ${newStatus}`, 'info', 'Status Updated');
  };

  const getComplaintById = (id: string) => {
    return complaints.find((c) => c.id === id || c.refId === id);
  };

  // Resource Operations
  const addResource = (data: Omit<ResourceItem, 'id' | 'resourceId'>): ResourceItem => {
    const num = resources.length + 1;
    const catCode = data.category.substring(0, 3).toUpperCase();
    const resourceId = `RES-${catCode}-${String(num).padStart(3, '0')}`;
    const newRes: ResourceItem = {
      ...data,
      id: 'RES-' + Date.now().toString(36).toUpperCase(),
      resourceId
    };
    setResources((prev) => [newRes, ...prev]);
    showToast(`Resource "${newRes.name}" added to registry.`, 'success');
    return newRes;
  };

  const updateResource = (id: string, data: Partial<ResourceItem>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    showToast('Resource updated in local demonstration registry.', 'info');
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    showToast('Resource removed from demonstration registry.', 'warning');
  };

  // Community Ideas Operations
  const addCommunityIdea = (data: {
    problemId: string;
    title: string;
    explanation: string;
    expectedBenefit: string;
    tags?: string[];
  }): CommunityIdea => {
    const targetComp = complaints.find((c) => c.id === data.problemId);
    const newIdea: CommunityIdea = {
      id: 'IDEA-' + Date.now().toString(36).toUpperCase(),
      problemId: data.problemId,
      problemTitle: targetComp ? targetComp.title : 'General Urban Problem',
      problemCategory: targetComp ? targetComp.category : 'Infrastructure',
      problemCity: targetComp ? targetComp.city : currentUser.city,
      title: data.title.trim(),
      explanation: data.explanation.trim(),
      expectedBenefit: data.expectedBenefit.trim(),
      submittedBy: currentUser.email,
      submittedByName: currentUser.name,
      submittedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending Review',
      upvotes: 1,
      tags: data.tags || ['Community Idea']
    };

    setCommunityIdeas((prev) => [newIdea, ...prev]);

    // Increment idea count on complaint
    if (targetComp) {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === data.problemId ? { ...c, communityIdeasCount: c.communityIdeasCount + 1 } : c
        )
      );
    }

    showToast('Your solution idea has been submitted for review!', 'success', 'Idea Submitted');

    // Background sync to backend API
    api.submitIdea({
      complaint_id: data.problemId,
      title: data.title,
      explanation: data.explanation,
      expected_benefit: data.expectedBenefit,
      tags: data.tags,
    }).catch((err) => {
      console.log('Background API idea submit sync (offline fallback active):', err.message);
    });

    return newIdea;
  };

  const updateIdeaStatus = (id: string, newStatus: IdeaStatus, adminFeedback?: string) => {
    setCommunityIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? {
              ...idea,
              status: newStatus,
              adminFeedback: adminFeedback || idea.adminFeedback
            }
          : idea
      )
    );

    // Background sync to backend API
    api.reviewIdea(id, newStatus, adminFeedback).catch((err) => {
      console.log('Background API idea review sync (offline fallback active):', err.message);
    });

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newNotif: NotificationItem = {
      id: 'NOTIF-' + Date.now(),
      title: `Idea Moderation: ${newStatus}`,
      message: `Your community suggestion has been marked as "${newStatus}".`,
      category: newStatus === 'Selected for Implementation' ? 'idea_selected' : 'idea_review',
      timestamp: nowStr,
      isRead: false,
      linkTo: '/community-ideas',
      relatedId: id
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Idea marked as "${newStatus}".`, 'info');
  };

  const upvoteIdea = (id: string) => {
    setCommunityIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea))
    );

    // Background sync to backend API
    api.upvoteIdea(id).catch((err) => {
      console.log('Background API idea upvote sync (offline fallback active):', err.message);
    });

    showToast('Upvote recorded in demonstration state!', 'success');
  };

  // Dig-Once Work Order Operations & Conflict Detection Logic
  const addWorkOrder = (data: Omit<WorkOrderRecord, 'id' | 'workId'>): WorkOrderRecord => {
    const workId = `WO-2026-${String(workOrders.length + 807).padStart(3, '0')}`;
    const newOrder: WorkOrderRecord = {
      ...data,
      id: 'WO-' + Date.now().toString(36).toUpperCase(),
      workId
    };
    setWorkOrders((prev) => [...prev, newOrder]);
    showToast(`Work order ${workId} registered for ${newOrder.roadName}`, 'success');
    return newOrder;
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders((prev) => prev.filter((w) => w.id !== id));
    showToast('Work order removed from demonstration schedule.', 'info');
  };

  // Compute Dig-Once Conflicts on identical/similar road names with overlapping date ranges
  const digOnceConflicts: DigOnceConflictItem[] = React.useMemo(() => {
    const conflicts: DigOnceConflictItem[] = [];
    const normalizedRoads: Record<string, WorkOrderRecord[]> = {};

    workOrders.forEach((wo) => {
      const roadKey = wo.roadName.trim().toLowerCase();
      if (!normalizedRoads[roadKey]) {
        normalizedRoads[roadKey] = [];
      }
      normalizedRoads[roadKey].push(wo);
    });

    let conflictIndex = 1;
    Object.entries(normalizedRoads).forEach(([roadKey, orders]) => {
      if (orders.length < 2) return;

      // Compare pairs of orders on this road
      for (let i = 0; i < orders.length; i++) {
        for (let j = i + 1; j < orders.length; j++) {
          const a = orders[i];
          const b = orders[j];

          // Check date overlap: startA <= endB and endA >= startB
          const startA = new Date(a.startDate).getTime();
          const endA = new Date(a.endDate).getTime();
          const startB = new Date(b.startDate).getTime();
          const endB = new Date(b.endDate).getTime();

          if (startA <= endB && endA >= startB) {
            const overlapStart = new Date(Math.max(startA, startB));
            const overlapEnd = new Date(Math.min(endA, endB));
            const diffDays = Math.max(1, Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);

            const departments = Array.from(new Set([a.responsibleDepartment, b.responsibleDepartment]));
            const duplicateSavings = Math.round((a.estimatedCost + b.estimatedCost) * 0.38);

            conflicts.push({
              conflictId: `DOC-CONF-${String(conflictIndex++).padStart(3, '0')}`,
              roadName: a.roadName,
              area: a.area,
              overlapStartDate: overlapStart.toISOString().split('T')[0],
              overlapEndDate: overlapEnd.toISOString().split('T')[0],
              overlapDays: diffDays,
              orders: [a, b],
              involvedDepartments: departments,
              estimatedDuplicateCost: duplicateSavings,
              recommendedCoordination: `Combine trenching windows between ${departments.join(' and ')} to excavate the road only once, avoiding repeated repaving cycles.`
            });
          }
        }
      }
    });

    return conflicts;
  }, [workOrders]);

  // Notifications Operations
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Reset to default
  const resetToDefaultData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USER);
    setIsAdmin(false);
    setComplaints(INITIAL_COMPLAINTS);
    setResources(INITIAL_RESOURCES);
    setCommunityIdeas(INITIAL_COMMUNITY_IDEAS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setSilentWards(INITIAL_SILENT_WARDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentScenario('moderate');
    showToast('Demonstration dataset reset to initial state', 'info');
  };

  return (
    <RippleContext.Provider
      value={{
        isBackendConnected,
        isLoadingInitialData,
        refreshBackendData,

        currentUser,
        isAdmin,
        login,
        signup,
        logout,
        toggleAdminDemo,
        updateProfile,

        complaints,
        addComplaint,
        updateComplaintStatus,
        getComplaintById,

        resources,
        addResource,
        updateResource,
        deleteResource,

        communityIdeas,
        addCommunityIdea,
        updateIdeaStatus,
        upvoteIdea,

        workOrders,
        addWorkOrder,
        deleteWorkOrder,
        digOnceConflicts,

        silentWards,
        rippleAnalyses: INITIAL_RIPPLE_ANALYSES,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadCount,

        currentScenario,
        setCurrentScenario,

        toasts,
        showToast,
        removeToast,

        resetToDefaultData
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-900/30'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-900/30'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-100 shadow-amber-900/30'
                : 'bg-cyan-950/90 border-cyan-500/40 text-cyan-100 shadow-cyan-900/30'
            }`}
          >
            {toast.title && <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">{toast.title}</div>}
            <div className="text-xs leading-relaxed">{toast.message}</div>
          </div>
        ))}
      </div>
    </RippleContext.Provider>
  );
};

export const useRipple = (): RippleContextType => {
  const context = useContext(RippleContext);
  if (!context) {
    throw new Error('useRipple must be used within a RippleProvider');
  }
  return context;
};
