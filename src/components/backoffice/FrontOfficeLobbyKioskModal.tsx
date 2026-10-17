import React, { useState, useEffect } from 'react';
import { 
  RoomScheduleEvent, 
  GoldenRecordCase,
  RoomId,
  DirectorProfile
} from '../../lib/types/funeral';
import { FACILITY_ROOMS, INITIAL_DIRECTOR_PROFILES } from '../../lib/data/mockCases';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Sparkles, 
  X, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Play, 
  Pause, 
  ChevronRight, 
  Tv, 
  ShieldCheck, 
  Church, 
  HeartHandshake, 
  Flower2, 
  Share2, 
  CheckCircle2, 
  Monitor, 
  RefreshCw
} from 'lucide-react';

interface FrontOfficeLobbyKioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: RoomScheduleEvent[];
  cases: GoldenRecordCase[];
  directorProfiles?: DirectorProfile[];
  initialDate?: string;
}

type LobbyScreenMode = 'today_schedule' | 'weekly_overview' | 'memorial_tribute' | 'hardware_guide';
type LobbyTheme = 'dark_sanctuary' | 'light_alabaster';
type ScaleMode = 'standard' | 'large_tv' | 'ultra_4k';

export const FrontOfficeLobbyKioskModal: React.FC<FrontOfficeLobbyKioskModalProps> = ({
  isOpen,
  onClose,
  events,
  cases,
  directorProfiles = INITIAL_DIRECTOR_PROFILES,
  initialDate = '2026-09-22'
}) => {
  // Helper to get director info
  const getDirectorTitle = (directorName: string) => {
    const matched = directorProfiles.find(d => d.name.toLowerCase().includes(directorName.toLowerCase().split(' ')[0]));
    return matched ? `${matched.name} (${matched.title})` : directorName;
  };
  // Current Live Time & Date state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeDate, setActiveDate] = useState<string>(initialDate);
  const [screenMode, setScreenMode] = useState<LobbyScreenMode>('today_schedule');
  const [theme, setTheme] = useState<LobbyTheme>('dark_sanctuary');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('large_tv');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationIntervalSeconds, setRotationIntervalSeconds] = useState<number>(20);
  const [tributeIndex, setTributeIndex] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter today's events
  const todayEvents = events.filter((e) => e.date === activeDate);

  // Auto-hide toolbar after inactivity if fullscreen
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(hideTimer);
      if (isFullscreen) {
        hideTimer = setTimeout(() => setShowControls(false), 5000);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearTimeout(hideTimer);
    };
  }, [isFullscreen]);

  // Auto-cycle through views when autoRotate is enabled
  useEffect(() => {
    if (!autoRotate || !isOpen) return;

    const interval = setInterval(() => {
      setScreenMode((prev) => {
        if (prev === 'today_schedule') return 'memorial_tribute';
        if (prev === 'memorial_tribute') {
          // cycle to next tribute or weekly
          setTributeIndex((tPrev) => (tPrev + 1) % Math.max(1, todayEvents.length));
          return 'weekly_overview';
        }
        return 'today_schedule';
      });
    }, rotationIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [autoRotate, isOpen, rotationIntervalSeconds, events, todayEvents.length]);

  if (!isOpen) return null;

  // Helper to determine status badge
  const getEventLiveStatus = (event: RoomScheduleEvent) => {
    const nowHours = currentTime.getHours();
    const nowMinutes = currentTime.getMinutes();
    const currentMinutesOfDay = nowHours * 60 + nowMinutes;

    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (currentMinutesOfDay >= startTotal && currentMinutesOfDay <= endTotal) {
      return {
        label: 'IN PROGRESS NOW',
        colorClass: 'bg-emerald-500 text-white animate-pulse',
        badgeBg: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
        active: true
      };
    } else if (currentMinutesOfDay < startTotal) {
      const diffMinutes = startTotal - currentMinutesOfDay;
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const timeStr = hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`;
      return {
        label: `UPCOMING (${timeStr})`,
        colorClass: 'bg-amber-500 text-neutral-950',
        badgeBg: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
        active: false
      };
    } else {
      return {
        label: 'CONCLUDED',
        colorClass: 'bg-neutral-600 text-neutral-200',
        badgeBg: 'bg-neutral-900 border-neutral-700 text-neutral-400',
        active: false
      };
    }
  };

  // Helper for 12-hour format
  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  // Room helper
  const getRoom = (roomId: RoomId) => {
    return FACILITY_ROOMS.find((r) => r.id === roomId) || {
      id: roomId,
      name: roomId,
      type: 'chapel',
      capacity: 100,
      description: 'Sanctuary Facility'
    };
  };

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Scale classes
  const getScaleStyles = () => {
    switch (scaleMode) {
      case 'ultra_4k':
        return 'text-lg lg:text-xl scale-100';
      case 'large_tv':
        return 'text-base lg:text-lg scale-100';
      default:
        return 'text-sm lg:text-base scale-100';
    }
  };

  const isDark = theme === 'dark_sanctuary';

  // Get active memorial event for tribute slide
  const activeTributeEvent = todayEvents[tributeIndex % Math.max(1, todayEvents.length)] || todayEvents[0] || events[0];
  const associatedCase = cases.find((c) => c.id === activeTributeEvent?.caseId);

  return (
    <div 
      className={`fixed inset-0 z-[9999] overflow-hidden flex flex-col font-sans transition-colors duration-500 ${
        isDark 
          ? 'bg-[#090b0e] text-neutral-100 selection:bg-amber-900' 
          : 'bg-[#f7f6f2] text-neutral-900 selection:bg-red-200'
      } ${getScaleStyles()}`}
    >
      {/* BACKGROUND LUXURY AMBIENCE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-600/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[32rem] h-[32rem] rounded-full bg-red-800/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl" />
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)]' : 'bg-[radial-gradient(#d1d5db_1px,transparent_1px)]'} [background-size:24px_24px] opacity-40`} />
      </div>

      {/* TOP HEADER: DIGNIFIED SANCTUARY BAR */}
      <header 
        className={`relative z-10 px-6 py-4 flex items-center justify-between border-b backdrop-blur-md transition-all ${
          isDark 
            ? 'bg-[#0f131a]/90 border-amber-500/20 shadow-2xl' 
            : 'bg-white/90 border-neutral-300/80 shadow-md'
        }`}
      >
        {/* Left: Brand Identity & Location */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7f1d1d] via-[#800000] to-[#450a0a] text-amber-200 border-2 border-amber-400/50 shadow-lg shadow-red-950/50">
            <span className="font-serif font-black text-2xl tracking-tighter">B</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-neutral-900 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-neutral-950" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-serif text-2xl lg:text-3xl font-bold tracking-wide ${isDark ? 'text-amber-100' : 'text-neutral-900'}`}>
                Benta's Funeral Home
              </h1>
              <span className={`text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                isDark ? 'bg-amber-950/70 text-amber-300 border-amber-500/40' : 'bg-red-50 text-[#800000] border-red-200'
              }`}>
                Est. 1928 • Harlem, NYC
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs opacity-75 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                630 Saint Nicholas Avenue • Main Sanctuary
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Sanctuary Schedule Active
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Digital Clock & Weather Widget */}
        <div className="hidden md:flex items-center gap-6">
          {/* Live Clock */}
          <div className={`px-6 py-2 rounded-2xl border text-center ${
            isDark ? 'bg-black/50 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
          }`}>
            <div className="font-mono text-2xl lg:text-3xl font-bold tracking-tight text-amber-400 flex items-center justify-center gap-1.5">
              <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <p className="text-[11px] font-medium tracking-wide uppercase opacity-70">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Harlem Weather */}
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 ${
            isDark ? 'bg-black/50 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
          }`}>
            <Sun className="w-7 h-7 text-amber-400 animate-[spin_12s_linear_infinite]" />
            <div className="text-left">
              <div className="font-bold text-sm leading-tight">68°F Partly Sunny</div>
              <div className="text-[10px] opacity-70 font-light">Harlem, Manhattan</div>
            </div>
          </div>
        </div>

        {/* Right: Quick View Switchers & Exit */}
        <div className="flex items-center gap-2">
          {/* View Mode Pills */}
          <div className={`p-1 rounded-xl border flex items-center gap-1 ${
            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-200/80 border-neutral-300'
          }`}>
            <button
              onClick={() => setScreenMode('today_schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                screenMode === 'today_schedule'
                  ? isDark 
                    ? 'bg-brass-500 text-neutral-950 shadow-md' 
                    : 'bg-[#800000] text-white shadow-md'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today's Services ({todayEvents.length})</span>
            </button>

            <button
              onClick={() => setScreenMode('memorial_tribute')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                screenMode === 'memorial_tribute'
                  ? isDark 
                    ? 'bg-brass-500 text-neutral-950 shadow-md' 
                    : 'bg-[#800000] text-white shadow-md'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span>Tribute Presentation</span>
            </button>

            <button
              onClick={() => setScreenMode('weekly_overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                screenMode === 'weekly_overview'
                  ? isDark 
                    ? 'bg-brass-500 text-neutral-950 shadow-md' 
                    : 'bg-[#800000] text-white shadow-md'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Church className="w-3.5 h-3.5" />
              <span>Weekly Horizon</span>
            </button>
          </div>

          {/* Hardware Guide */}
          <button
            onClick={() => setScreenMode('hardware_guide')}
            title="Large Screen TV & Hardware Recommendations"
            className={`p-2 rounded-xl border transition ${
              screenMode === 'hardware_guide'
                ? 'bg-brass-500 text-neutral-950 border-brass-400 font-bold'
                : isDark ? 'bg-neutral-900 border-neutral-800 text-amber-300 hover:bg-neutral-800' : 'bg-white border-neutral-300 hover:bg-neutral-100'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter TV Fullscreen (F11)'}
            className={`p-2 rounded-xl border transition ${
              isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-300 hover:bg-neutral-100'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close HUD */}
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition ${
              isDark ? 'bg-red-950/60 border-red-800/80 text-red-300 hover:bg-red-900' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN SCREEN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col justify-between">
        
        {/* VIEW 1: TODAY'S SANCTUARY SCHEDULE BOARD */}
        {screenMode === 'today_schedule' && (
          <div className="space-y-6 max-w-7xl mx-auto w-full">
            {/* Section Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-amber-500/20">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight">
                    Today's Sanctuary Services & Visitations
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
                    {todayEvents.length} Service{todayEvents.length === 1 ? '' : 's'} Scheduled
                  </span>
                </div>
                <p className="text-sm opacity-75 mt-1">
                  Please proceed to the designated chapel or suite. Quiet reverence is requested throughout all sanctuaries.
                </p>
              </div>

              {/* Date Filter selector */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={activeDate}
                  onChange={(e) => setActiveDate(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none ${
                    isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-100' : 'bg-white border-neutral-300 text-neutral-900'
                  }`}
                />
                <button
                  onClick={() => setActiveDate('2026-09-22')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-brass-500/20 hover:bg-brass-500/30 text-brass-300 border border-brass-500/40"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Event Cards Grid */}
            {todayEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {todayEvents.map((evt) => {
                  const room = getRoom(evt.roomId);
                  const status = getEventLiveStatus(evt);

                  return (
                    <div
                      key={evt.id}
                      className={`relative rounded-2xl p-6 lg:p-7 border-2 transition-all duration-300 flex flex-col justify-between shadow-2xl ${
                        status.active
                          ? isDark 
                            ? 'bg-gradient-to-br from-[#1a1412] via-[#241310] to-[#12161f] border-amber-400 shadow-amber-500/10 ring-2 ring-amber-400/30'
                            : 'bg-gradient-to-br from-red-50/80 via-white to-amber-50/50 border-[#800000] shadow-red-900/10'
                          : isDark
                            ? 'bg-[#141311]/90 border-neutral-800 hover:border-neutral-700'
                            : 'bg-white border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {/* Top Row: Time & Room & Live Status */}
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          {/* Room Badge */}
                          <div className="flex items-center gap-2">
                            <span className="px-3.5 py-1.5 rounded-xl font-serif text-sm font-bold tracking-wide uppercase bg-[#7f1d1d] text-amber-100 border border-amber-400/40 shadow-sm flex items-center gap-1.5">
                              <Church className="w-4 h-4 text-amber-300" />
                              {room.name}
                            </span>
                            <span className="text-xs opacity-60 font-medium">
                              (Cap: {room.capacity} Guests)
                            </span>
                          </div>

                          {/* Live Status Pill */}
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${status.badgeBg}`}>
                            {status.active && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                            {status.label}
                          </span>
                        </div>

                        {/* Beloved Decedent Name */}
                        <div className="mt-2">
                          <span className="text-xs uppercase font-bold tracking-widest text-amber-500">In Loving Memory Of</span>
                          <h3 className={`font-serif text-3xl lg:text-4xl font-bold tracking-tight mt-0.5 leading-snug ${
                            isDark ? 'text-amber-100' : 'text-[#7f1d1d]'
                          }`}>
                            {evt.decedentName}
                          </h3>
                          <p className="text-sm font-semibold opacity-90 text-amber-400/90 mt-1">
                            {evt.title} • {evt.serviceType}
                          </p>
                        </div>
                      </div>

                      {/* Middle Details Grid */}
                      <div className={`mt-6 pt-5 border-t grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs ${
                        isDark ? 'border-neutral-800/80' : 'border-neutral-200'
                      }`}>
                        {/* Time Window */}
                        <div className="space-y-1">
                          <span className="opacity-60 uppercase font-semibold text-[10px] tracking-wider flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-500" /> Service Hours
                          </span>
                          <div className="font-bold text-sm text-amber-300 font-mono">
                            {formatTime12h(evt.startTime)} – {formatTime12h(evt.endTime)}
                          </div>
                        </div>

                        {/* Presiding Clergy */}
                        <div className="space-y-1">
                          <span className="opacity-60 uppercase font-semibold text-[10px] tracking-wider flex items-center gap-1">
                            <Church className="w-3.5 h-3.5 text-amber-500" /> Officiant
                          </span>
                          <div className="font-semibold text-xs truncate">
                            {evt.officiantName || 'Family Appointed Clergy'}
                          </div>
                        </div>

                        {/* Funeral Director */}
                        <div className="space-y-1">
                          <span className="opacity-60 uppercase font-semibold text-[10px] tracking-wider flex items-center gap-1">
                            <HeartHandshake className="w-3.5 h-3.5 text-amber-500" /> Funeral Director
                          </span>
                          <div className="font-semibold text-xs">
                            {getDirectorTitle(evt.assignedDirector)}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer: Livestream / Family Info */}
                      <div className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                        isDark ? 'border-neutral-800/60' : 'border-neutral-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          {evt.livestreamActive && (
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                              <Video className="w-3.5 h-3.5" />
                              HD Live Stream Broadcast Active
                            </span>
                          )}
                          <span className="flex items-center gap-1 opacity-70">
                            <Users className="w-3.5 h-3.5 text-amber-500" />
                            Est. {evt.estimatedGuests} Family & Guests
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setTributeIndex(todayEvents.indexOf(evt));
                              setScreenMode('memorial_tribute');
                            }}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4"
                          >
                            <span>View Memorial Screen</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`rounded-2xl p-12 text-center border-2 border-dashed ${
                isDark ? 'bg-[#141311]/60 border-neutral-800 text-neutral-400' : 'bg-white border-neutral-300 text-neutral-600'
              }`}>
                <Church className="w-16 h-16 mx-auto text-amber-500/50 mb-4" />
                <h3 className="font-serif text-2xl font-bold text-neutral-200">
                  Quiet Sanctuary Day • Private Family Arrangements
                </h3>
                <p className="text-sm max-w-md mx-auto mt-2 opacity-80">
                  No public sanctuary services scheduled for this date. Our arrangement consultation suites are open for family care.
                </p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MEMORIAL TRIBUTE & WELCOME PRESENTATION */}
        {screenMode === 'memorial_tribute' && (
          <div className="max-w-5xl mx-auto w-full my-auto">
            <div className={`relative rounded-2xl p-8 lg:p-12 border-2 shadow-2xl overflow-hidden transition-all duration-700 ${
              isDark 
                ? 'bg-gradient-to-b from-[#141822] via-[#0e1219] to-[#090b0e] border-amber-500/30' 
                : 'bg-gradient-to-b from-amber-50/50 via-white to-red-50/30 border-amber-300/80'
            }`}>
              {/* Background Cross / Motif Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Church className="w-[36rem] h-[36rem] text-amber-400" />
              </div>

              {/* Top Banner */}
              <div className="text-center space-y-2 mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500">
                  Celebration of Life & Homegoing Service
                </span>
                <h2 className={`font-serif text-4xl lg:text-6xl font-extrabold tracking-tight ${
                  isDark ? 'text-amber-100' : 'text-[#7f1d1d]'
                }`}>
                  {activeTributeEvent?.decedentName || 'Beloved Family Service'}
                </h2>
                <div className="flex items-center justify-center gap-3 text-sm font-serif italic text-amber-300/80">
                  <span>Sunrise: {associatedCase?.decedent.dateOfBirth || '1942'}</span>
                  <span>•</span>
                  <span>Sunset: {associatedCase?.decedent.dateOfDeath || '2026'}</span>
                </div>
              </div>

              {/* Center Content: Two Columns (Service Details & QR Code) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-6 border-t border-amber-500/20">
                
                {/* Left 2 Cols: Sanctuary Location & Times */}
                <div className="md:col-span-2 space-y-5">
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-black/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <div className="flex items-center gap-3 text-amber-400 font-serif font-bold text-xl mb-1">
                      <Church className="w-6 h-6 text-amber-400" />
                      <span>{getRoom(activeTributeEvent?.roomId || 'chapel_1').name}</span>
                    </div>
                    <div className="font-mono text-2xl font-bold text-amber-300">
                      {formatTime12h(activeTributeEvent?.startTime)} – {formatTime12h(activeTributeEvent?.endTime)}
                    </div>
                    <p className="text-xs opacity-75 mt-2">
                      Officiating: <strong>{activeTributeEvent?.officiantName || 'Reverend Dr. Calvin Butts'}</strong> • Music by <strong>{activeTributeEvent?.organistOrMusic || 'Sanctuary Organist'}</strong>
                    </p>
                  </div>

                  <div className="text-sm opacity-85 italic font-serif leading-relaxed px-2">
                    "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid." — John 14:27
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                      <Flower2 className="w-4 h-4" /> Floral Tributes Delivered to Parlor
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      <Video className="w-4 h-4" /> HD Livestream Available
                    </span>
                  </div>
                </div>

                {/* Right Col: Mobile Program QR Code */}
                <div className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center ${
                  isDark ? 'bg-black/60 border-amber-500/30 shadow-xl' : 'bg-white border-neutral-300 shadow-lg'
                }`}>
                  <div className="p-3 bg-white rounded-xl shadow-inner border border-neutral-300">
                    {/* Simulated Clean QR Code Graphic */}
                    <div className="w-32 h-32 bg-neutral-900 rounded-lg p-2 flex flex-col justify-between text-amber-300">
                      <div className="flex justify-between">
                        <div className="w-7 h-7 bg-amber-400 rounded-xs border-2 border-neutral-900" />
                        <div className="w-7 h-7 bg-amber-400 rounded-xs border-2 border-neutral-900" />
                      </div>
                      <div className="text-[9px] text-center font-mono font-bold tracking-widest text-white uppercase">
                        SCAN PROGRAM
                      </div>
                      <div className="flex justify-between">
                        <div className="w-7 h-7 bg-amber-400 rounded-xs border-2 border-neutral-900" />
                        <div className="w-4 h-4 bg-amber-400 rounded-xs" />
                      </div>
                    </div>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-amber-400 mt-3">
                    Mobile Memorial Program
                  </h4>
                  <p className="text-[11px] opacity-70 mt-1 max-w-[180px]">
                    Scan with phone camera to view digital obituary & sign register book
                  </p>
                </div>
              </div>

              {/* Navigation Carousel Dots */}
              {todayEvents.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-neutral-800">
                  {todayEvents.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTributeIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        tributeIndex === idx ? 'w-8 bg-brass-400' : 'w-2.5 bg-neutral-600 hover:bg-neutral-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: WEEKLY OVERVIEW HORIZON */}
        {screenMode === 'weekly_overview' && (
          <div className="space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between border-b pb-4 border-amber-500/20">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight">
                  7-Day Sanctuary & Memorial Horizon
                </h2>
                <p className="text-sm opacity-75 mt-1">
                  Upcoming services and arrangements scheduled at Benta's Funeral Home.
                </p>
              </div>
            </div>

            {/* 7-Day Horizontal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28'].map((dateStr) => {
                const dayEvts = events.filter((e) => e.date === dateStr);
                const dateObj = new Date(dateStr + 'T00:00:00');
                const isToday = dateStr === activeDate;

                return (
                  <div
                    key={dateStr}
                    onClick={() => {
                      setActiveDate(dateStr);
                      setScreenMode('today_schedule');
                    }}
                    className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                      isToday
                        ? isDark 
                          ? 'bg-amber-950/40 border-amber-400/80 shadow-lg ring-1 ring-amber-400' 
                          : 'bg-red-50 border-[#800000] shadow-md ring-1 ring-[#800000]'
                        : isDark
                          ? 'bg-[#141311]/80 border-neutral-800 hover:border-neutral-700'
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {/* Date Heading */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
                      <div>
                        <div className="font-serif font-bold text-base">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs opacity-70">
                          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      {isToday ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-neutral-950">
                          TODAY
                        </span>
                      ) : (
                        <span className="text-xs opacity-60 font-mono">
                          {dayEvts.length} Evt{dayEvts.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>

                    {/* Day Events */}
                    {dayEvts.length > 0 ? (
                      <div className="space-y-2.5">
                        {dayEvts.map((e) => (
                          <div
                            key={e.id}
                            className={`p-2.5 rounded-xl border text-xs ${
                              isDark ? 'bg-black/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                            }`}
                          >
                            <div className="font-mono text-amber-400 font-bold text-[11px]">
                              {formatTime12h(e.startTime)}
                            </div>
                            <div className="font-serif font-bold text-sm truncate mt-0.5">
                              {e.decedentName}
                            </div>
                            <div className="text-[10px] opacity-70 truncate">
                              {getRoom(e.roomId).name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs opacity-50 italic">
                        Private Facility Prep
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: HARDWARE & TV SETUP RECOMMENDATION GUIDE */}
        {screenMode === 'hardware_guide' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="border-b pb-4 border-amber-500/20">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-amber-200">
                Front Office Large Screen Display • Hardware Guide
              </h2>
              <p className="text-sm opacity-80 mt-1">
                Recommended commercial & designer display hardware for Benta's Funeral Home front reception and parlor corridors.
              </p>
            </div>

            {/* Product Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Option 1: Samsung The Frame (43" / 55" / 65") */}
              <div className={`p-6 rounded-2xl border-2 flex flex-col justify-between ${
                isDark ? 'bg-[#141311] border-amber-400/50 shadow-xl' : 'bg-white border-amber-400'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider">
                      ★ Top Aesthetic Pick
                    </span>
                    <span className="text-xs font-mono font-bold">$999 – $1,999</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-amber-100">Samsung The Frame</h3>
                  <p className="text-xs opacity-75 mt-1">43", 55", or 65" 4K QLED Matte Display</p>

                  <ul className="text-xs space-y-2 mt-4 opacity-90">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Art Mode Frame:</strong> Looks like a high-end framed museum painting when idle.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Anti-Glare Matte Glass:</strong> Zero reflection under bright reception chandelier lighting.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>One Connect Invisible Cable:</strong> Ultra-thin single clear wire for spotless flush wall mount.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] opacity-75">
                  <strong>How to deploy:</strong> Open Samsung Tizen browser to this screen URL and enable full-screen kiosk.
                </div>
              </div>

              {/* Option 2: DAKboard Wall Display Plus */}
              <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-[#141311] border-neutral-800' : 'bg-white border-neutral-300'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      Turnkey Calendar
                    </span>
                    <span className="text-xs font-mono font-bold">$399 – $799</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold">DAKboard Wall Display</h3>
                  <p className="text-xs opacity-75 mt-1">24", 27", or 32" Hardwood Bezel</p>

                  <ul className="text-xs space-y-2 mt-4 opacity-90">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Real Walnut/Oak Wood Frame:</strong> Matches traditional funeral home wood decor.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Auto On/Off Schedule:</strong> Powers down at 9 PM and turns on at 7 AM automatically.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Built-in Web Kiosk OS:</strong> Boots directly to URL without needing a remote control.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] opacity-75">
                  <strong>How to deploy:</strong> Set DAKboard Custom Screen URL to this BFH Lobby Kiosk endpoint.
                </div>
              </div>

              {/* Option 3: Mini Chromebox / Fire TV Stick 4K */}
              <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-[#141311] border-neutral-800' : 'bg-white border-neutral-300'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-wider">
                      Budget / Any TV
                    </span>
                    <span className="text-xs font-mono font-bold">$49 – $150</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold">HDMI Stick / OptiSigns</h3>
                  <p className="text-xs opacity-75 mt-1">Amazon Fire TV 4K Max or Asus Chromebox</p>

                  <ul className="text-xs space-y-2 mt-4 opacity-90">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brass-400 shrink-0 mt-0.5" />
                      <span><strong>Use Any Existing TV:</strong> Plugs into existing HDMI port on any 50"+ lobby TV.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brass-400 shrink-0 mt-0.5" />
                      <span><strong>Auto-Kiosk Launchers:</strong> Apps like OptiSigns, Yodeck, or Fully Kiosk Browser.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brass-400 shrink-0 mt-0.5" />
                      <span><strong>Remote Cloud Management:</strong> Push calendar updates from office desktop.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] opacity-75">
                  <strong>How to deploy:</strong> Install Fully Kiosk or Yodeck and set starting URL to this full-screen display.
                </div>
              </div>

            </div>

            {/* Quick URL Copy Box */}
            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-black/60 border-amber-500/30' : 'bg-neutral-100 border-neutral-300'
            }`}>
              <div className="space-y-1">
                <div className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" /> Direct TV Kiosk Web Link
                </div>
                <p className="text-xs opacity-75 font-mono">
                  {typeof window !== 'undefined' ? `${window.location.origin}/?mode=lobby-kiosk` : 'https://benta.app/?mode=lobby-kiosk'}
                </p>
              </div>

              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined') {
                    navigator.clipboard?.writeText(`${window.location.origin}/?mode=lobby-kiosk`);
                    alert('TV Kiosk Display URL copied to clipboard!');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-brass-500 hover:bg-brass-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Screen URL for TV</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* DISCREET BOTTOM CONTROL BAR (Auto-hides or stays visible) */}
      <footer 
        className={`relative z-20 px-6 py-3 border-t backdrop-blur-md flex flex-wrap items-center justify-between gap-4 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        } ${
          isDark 
            ? 'bg-[#090b0e]/95 border-neutral-800 text-neutral-300' 
            : 'bg-white/95 border-neutral-300 text-neutral-700'
        }`}
      >
        {/* Left: Auto-Rotation & Refresh Status */}
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition ${
              autoRotate 
                ? 'bg-brass-500/20 text-brass-300 border-brass-400/40' 
                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
            <span>Auto-Cycle: {autoRotate ? `ON (${rotationIntervalSeconds}s)` : 'PAUSED'}</span>
          </button>

          {autoRotate && (
            <div className="hidden sm:flex items-center gap-1">
              {[15, 20, 30, 45].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setRotationIntervalSeconds(sec)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition ${
                    rotationIntervalSeconds === sec
                      ? 'bg-brass-500 text-neutral-950 border-brass-400'
                      : 'border-neutral-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setLastRefreshed(new Date())}
            className="flex items-center gap-1 opacity-70 hover:opacity-100 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Synced: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </button>
        </div>

        {/* Center: Quick Shortcuts */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="opacity-50">Display Theme:</span>
          <button
            onClick={() => setTheme(theme === 'dark_sanctuary' ? 'light_alabaster' : 'dark_sanctuary')}
            className="px-2.5 py-1 rounded-lg border border-neutral-700 hover:border-amber-400 transition flex items-center gap-1"
          >
            {theme === 'dark_sanctuary' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Midnight Sanctuary</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Alabaster Day</span>
              </>
            )}
          </button>

          <span className="opacity-50 ml-2">TV Distance Zoom:</span>
          {(['standard', 'large_tv', 'ultra_4k'] as ScaleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setScaleMode(mode)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono uppercase font-bold border transition ${
                scaleMode === mode
                  ? 'bg-brass-500 text-neutral-950 border-brass-400'
                  : 'border-neutral-700 opacity-60 hover:opacity-100'
              }`}
            >
              {mode === 'standard' ? '100%' : mode === 'large_tv' ? '125%' : '150%'}
            </button>
          ))}
        </div>

        {/* Right: Security & Facility Info */}
        <div className="flex items-center gap-3 text-xs opacity-75">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            BFH Kiosk Engine v2.6
          </span>
        </div>
      </footer>
    </div>
  );
};
