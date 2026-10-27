import React, { useState } from 'react';
import {
  Shovel,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Building2,
  ArrowRight,
  Info,
  CheckCircle2,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { WorkOrderRecord } from '../types/ripple';

export const DigOncePage: React.FC = () => {
  const { workOrders, digOnceConflicts, addWorkOrder, deleteWorkOrder, currentUser } = useRipple();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [workTitle, setWorkTitle] = useState('');
  const [roadName, setRoadName] = useState('BKC Central Avenue');
  const [area, setArea] = useState('Bandra Kurla Complex (BKC)');
  const [city, setCity] = useState(currentUser.city || 'Mumbai');
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [responsibleDepartment, setResponsibleDepartment] = useState('Municipal Gas Utility Corporation');
  const [status, setStatus] = useState<WorkOrderRecord['status']>('Scheduled');
  const [estimatedCost, setEstimatedCost] = useState('45000');
  const [description, setDescription] = useState('Medium pressure gas distribution pipeline installation.');

  const departments = [
    'Hydraulics & Water Works',
    'Telecommunications & IT Infrastructure',
    'Stormwater Drainage Department',
    'Roads & Traffic Infrastructure',
    'Municipal Gas Utility Corporation',
    'State Electricity Transmission Corp',
    'Public Works Department'
  ];

  const roads = [
    'BKC Central Avenue',
    'Senapati Bapat Marg',
    'Paud Road',
    'Link Road Northbound',
    'Swami Vivekanand Road'
  ];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim() || !roadName.trim() || !startDate || !endDate) return;

    addWorkOrder({
      workTitle: workTitle.trim(),
      roadName: roadName.trim(),
      area: area.trim(),
      city: city.trim(),
      startDate,
      endDate,
      responsibleDepartment,
      status,
      estimatedCost: parseFloat(estimatedCost) || 30000,
      description: description.trim()
    });

    setIsModalOpen(false);
    setWorkTitle('');
  };

  const totalSavings = digOnceConflicts.reduce((sum, c) => sum + c.estimatedDuplicateCost, 0);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold mb-1">
            <Shovel className="w-4 h-4 text-amber-400" />
            <span>CROSS-AGENCY EXCAVATION COORDINATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Dig-Once Conflict Detector
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Identify overlapping road trenching schedules across gas, water, telecom, and drainage departments to prevent recurring asphalt excavation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-glow-amber flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Excavation Work Record</span>
        </button>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Conflict Algorithm Disclaimer"
        message="The Dig-Once Detector identifies overlapping date ranges and shared road corridors strictly using work records available in this demonstration dataset. It demonstrates how multi-agency coordination saves municipal funds and eliminates repeated road disruption."
      />

      {/* Conflict KPI Cards & Warning Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Total Excavation Orders
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-1">
            {workOrders.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Scheduled road-cutting permits</div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 shadow-xl">
          <div className="text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Detected Schedule Conflicts</span>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-1">
            {digOnceConflicts.length}
          </div>
          <div className="text-[11px] text-amber-200/80 mt-1">Overlapping road trenching windows</div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-xl">
          <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Coordinated Savings Potential</span>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
            ${totalSavings.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-200/80 mt-1">Avoided duplicate repaving cycles</div>
        </div>
      </div>

      {/* Detected Conflicts Section (Warning Cards) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Active Cross-Agency Digging Conflicts</span>
        </h2>

        {digOnceConflicts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No Road-Cutting Conflicts Found</h3>
            <p className="text-xs text-slate-400">
              Current demonstration work orders do not share identical road corridors with overlapping dates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digOnceConflicts.map((conflict) => (
              <div
                key={conflict.conflictId}
                className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-900/90 border border-amber-500/40 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                      {conflict.conflictId}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-1.5">
                      {conflict.roadName} ({conflict.area})
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overlap Duration</span>
                    <span className="text-sm font-mono font-bold text-amber-400">
                      {conflict.overlapDays} Days ({conflict.overlapStartDate} to {conflict.overlapEndDate})
                    </span>
                  </div>
                </div>

                {/* Conflicting orders list */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Involved Departmental Work Orders:
                  </span>
                  <div className="space-y-1.5">
                    {conflict.orders.map((o) => (
                      <div
                        key={o.id}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono text-cyan-400 font-bold">{o.workId}: </span>
                          <span className="text-slate-200 font-semibold">{o.workTitle}</span>
                          <div className="text-[10px] text-slate-400">{o.responsibleDepartment}</div>
                        </div>
                        <div className="text-right font-mono text-[11px] text-slate-400">
                          {o.startDate} → {o.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coordinated Action Box */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                      Recommended Dig-Once Coordination:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {conflict.recommendedCoordination}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase text-slate-400 block">Potential Savings</span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      ${conflict.estimatedDuplicateCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table of All Work Records */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Registered Municipal Work Orders</span>
            </h2>
            <p className="text-xs text-slate-400">
              Planned trenching, pipe replacement, and cable conduit excavation projects
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {workOrders.length} Planned Works
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Order ID & Title</th>
                <th className="py-3 px-3">Road Name & Area</th>
                <th className="py-3 px-3">Planned Start Date</th>
                <th className="py-3 px-3">Planned End Date</th>
                <th className="py-3 px-3">Responsible Department</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-mono text-[10px] text-amber-400 font-bold">{wo.workId}</div>
                    <div className="font-bold text-slate-100 max-w-xs">{wo.workTitle}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{wo.description}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-200">{wo.roadName}</div>
                    <div className="text-[10px] text-slate-400">{wo.area}, {wo.city}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300">{wo.startDate}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">{wo.endDate}</td>

                  <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                    {wo.responsibleDepartment}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                      {wo.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete work order ${wo.workId}?`)) {
                          deleteWorkOrder(wo.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Work Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Work Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/50">
                EXCAVATION SCHEDULE REGISTRATION
              </span>
              <h2 className="text-lg font-bold text-slate-100 mt-1">
                Register Planned Road Trenching Record
              </h2>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Title *</label>
                <input
                  type="text"
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  placeholder="e.g. 11kV Feeder Cable Trenching"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Road Name *</label>
                  <select
                    value={roadName}
                    onChange={(e) => setRoadName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    {roads.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Bandra Kurla Complex"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Planned Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Planned End Date *</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Responsible Department *</label>
                <select
                  value={responsibleDepartment}
                  onChange={(e) => setResponsibleDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trenching dimensions, safety permits, lane closure..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-amber"
                >
                  Register Work Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
