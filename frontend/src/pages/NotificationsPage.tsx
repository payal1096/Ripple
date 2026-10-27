import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Lightbulb,
  AlertTriangle,
  Shovel,
  Sparkles,
  Check
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { NotificationItem } from '../types/ripple';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadCount } = useRipple();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'complaints' | 'ideas'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'unread' && notif.isRead) return false;
    if (activeFilter === 'complaints' && notif.category !== 'complaint_status' && notif.category !== 'complaint_update') return false;
    if (activeFilter === 'ideas' && notif.category !== 'idea_review' && notif.category !== 'idea_selected') return false;
    return true;
  });

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'complaint_status':
      case 'complaint_update':
        return <AlertTriangle className="w-4 h-4 text-cyan-400" />;
      case 'idea_review':
      case 'idea_selected':
        return <Lightbulb className="w-4 h-4 text-emerald-400" />;
      case 'dig_once_conflict':
        return <Shovel className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>COMMUNICATION FEED & DISPATCH ALERTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time notifications for status transitions, inspector notes, and community idea moderation.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Notification Feed"
        message="Notifications are generated reactively by actions in the frontend state (such as submitting complaints, admin status transitions, or idea reviews). Click on any notification to navigate to the related record."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'unread'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setActiveFilter('complaints')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'complaints'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Complaint Updates
        </button>

        <button
          onClick={() => setActiveFilter('ideas')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'ideas'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Community Idea Reviews
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">All Caught Up!</h3>
            <p className="text-xs text-slate-400">No notifications matching the selected filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                  : 'bg-slate-900/95 border-cyan-500/30 text-slate-200 shadow-md ring-1 ring-cyan-500/20'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  notif.isRead ? 'bg-slate-800 text-slate-400' : 'bg-cyan-950 text-cyan-400'
                }`}
              >
                {getCategoryIcon(notif.category)}
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-bold ${notif.isRead ? 'text-slate-300' : 'text-slate-100'}`}>
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{notif.timestamp}</span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    to={notif.linkTo}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>View Related Page</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  {!notif.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="text-slate-400 hover:text-slate-200 text-[11px] font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
