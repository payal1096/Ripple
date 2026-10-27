import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  MapPin,
  Compass,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ArrowRight
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { Complaint } from '../types/ripple';

export const ReportProblemPage: React.FC = () => {
  const { addComplaint, currentUser } = useRipple();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Drainage');
  const [customCategory, setCustomCategory] = useState('');
  const [city, setCity] = useState(currentUser.city || 'Mumbai');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [contactNumber, setContactNumber] = useState(currentUser.phone || '');
  const [severity, setSeverity] = useState<number>(3);

  // Geolocation State
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<Complaint | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const categories = [
    'Drainage',
    'Roads',
    'Waste Management',
    'Water Supply',
    'Parking',
    'Streetlights',
    'Public Infrastructure',
    'Other'
  ];

  const cities = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata'];

  // Geolocation Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser. Please enter location manually.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Requesting browser location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({
          lat: Number(latitude.toFixed(5)),
          lng: Number(longitude.toFixed(5)),
          accuracy: Math.round(accuracy)
        });

        // Set approximate address for display and manual editing
        const detectedAddress = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Accuracy: ±${Math.round(accuracy)}m)`;
        if (!area) {
          setArea('Detected Municipal Sector');
        }
        if (!landmark) {
          setLandmark(detectedAddress);
        }

        setLocationStatus(`Location detected with ±${Math.round(accuracy)}m accuracy. You can edit the text fields below.`);
        setIsDetectingLocation(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus('Location permission denied. You can still type your area and landmark manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus('Location information is unavailable. Please enter your location manually.');
            break;
          case error.TIMEOUT:
            setLocationStatus('Location request timed out. Please enter your location manually.');
            break;
          default:
            setLocationStatus('Unable to determine location. Manual entry is enabled.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Image Upload Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB for demonstration upload.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Please enter a problem title.');
      return;
    }
    if (!description.trim()) {
      setValidationError('Please provide a description of the observed problem.');
      return;
    }
    if (!city.trim() || !area.trim()) {
      setValidationError('Please specify both city and area/locality.');
      return;
    }

    setSubmitting(true);

    const activeCat = category === 'Other' && customCategory.trim() ? customCategory.trim() : category;

    // Estimate downstream impact & priority score based on severity
    const riskLevel = severity >= 4 ? 'Critical' : severity === 3 ? 'High' : 'Medium';
    const basePriorityScore = 50 + severity * 8 + (activeCat === 'Drainage' || activeCat === 'Water Supply' ? 12 : 5);

    const newComp = addComplaint({
      title: title.trim(),
      description: description.trim(),
      category: activeCat,
      city,
      area: area.trim(),
      landmark: landmark.trim() || 'Near community transit corridor',
      locationAddress: `${landmark.trim() ? landmark.trim() + ', ' : ''}${area.trim()}, ${city}`,
      latitude: coords?.lat,
      longitude: coords?.lng,
      accuracyMeters: coords?.accuracy,
      severity,
      riskLevel,
      contactNumber: contactNumber.trim() || undefined,
      imageUrl: imagePreview || undefined,
      potentialDownstreamImpact: `Potential downstream disruption across coupled ${activeCat.toLowerCase()} and roadway infrastructure during peak utilization.`,
      priorityScore: Math.min(99, basePriorityScore),
      priorityExplanation: `Calculated from reported severity of ${severity}/5, active municipal weather scenario, and potential downstream coupling.`,
      recommendedAction: `Schedule field inspection and preventive clearance for ${activeCat} maintenance crew.`,
      actionExplanation: 'Proactive intervention eliminates downstream failure escalation and minimizes civic disruption.',
      assignedDepartment: `${activeCat} Maintenance Division`
    });

    setSubmitting(false);
    setSubmissionSuccess(newComp);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Drainage');
    setCustomCategory('');
    setArea('');
    setLandmark('');
    setImagePreview(null);
    setCoords(null);
    setLocationStatus(null);
    setSubmissionSuccess(null);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 text-xs font-bold">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>Citizen Municipal Engagement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Report an Urban Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Notify municipal services of road defects, clogged drains, leaking water mains, or waste overflows before they trigger downstream ripple effects.
        </p>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Complaint Reporting"
        message="This form simulates citizen problem submission. Submitted reports are stored in local browser state and will appear immediately in the Priority Queue, City Problems, and My Complaints pages."
      />

      {/* Success Banner if submitted */}
      {submissionSuccess && (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-emerald-200">
                Complaint Registered Successfully!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your report has been assigned reference code{' '}
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {submissionSuccess.refId}
                </span>{' '}
                and queued for municipal priority triage.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 font-mono">
            <div><span className="text-slate-400">Title:</span> <span className="text-slate-200">{submissionSuccess.title}</span></div>
            <div><span className="text-slate-400">Category:</span> <span className="text-slate-200">{submissionSuccess.category}</span></div>
            <div><span className="text-slate-400">Initial Priority Score:</span> <span className="text-cyan-400 font-bold">{submissionSuccess.priorityScore}/100</span></div>
            <div><span className="text-slate-400">Current Status:</span> <span className="text-amber-400">{submissionSuccess.status}</span></div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/my-complaints"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all"
            >
              <span>View in My Complaints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleResetForm}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      )}

      {/* Reporting Form Card */}
      {!submissionSuccess && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Problem Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Garbage accumulation near stormwater culvert grating"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Problem Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed, including the severity, any immediate hazards, or signs of water/sewerage overflow..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 leading-relaxed"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                You can freely describe unfamiliar issues without needing to select a specific registered resource code.
              </p>
            </div>

            {/* Category & Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Resource Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Specify problem domain..."
                    className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 font-semibold">
                    Estimated Severity (1 to 5)
                  </label>
                  <span className="font-mono text-cyan-400 font-bold">Level {severity} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>1 (Minor / Nuisance)</span>
                  <span>3 (Moderate)</span>
                  <span>5 (Critical / Emergency)</span>
                </div>
              </div>
            </div>

            {/* Location Section with Geolocation Button */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Location Information</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click "Detect My Location" or type your address manually below.
                  </p>
                </div>

                {/* Detect My Location Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <Compass className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>{isDetectingLocation ? 'Detecting...' : 'Detect My Location'}</span>
                </button>
              </div>

              {locationStatus && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span>{locationStatus}</span>
                </div>
              )}

              {/* City & Area Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Area or Locality *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Bandra Kurla Complex (BKC)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Street or Landmark */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Street Address or Nearby Landmark (Editable)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite BKC Gate 3, near Bus Stop #14"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Optional Contact & Photo Upload in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Contact Number <span className="text-slate-400 text-[10px]">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 98201 00000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Used solely by municipal inspectors if directions are needed. Not displayed on public cards.
                </p>
              </div>

              {/* Optional Image Upload */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Attach Photo Evidence <span className="text-slate-400 text-[10px]">(Optional)</span>
                </label>
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer bg-slate-950/60 transition-colors">
                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-[11px] text-slate-300 font-medium">Click to upload photo</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-32">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{submitting ? 'Registering Problem in Queue...' : 'Submit Urban Complaint'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
