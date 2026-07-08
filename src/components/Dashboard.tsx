import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, FileText, Folder, CheckSquare, 
  Calendar, Trophy, Award, Code, FileSpreadsheet, User, 
  ClipboardList, ArrowLeft, ArrowRight, Bell, Moon, Sun,
  Check, Star, Sparkles, MessageSquare, BookOpen, PenTool,
  Plus, ExternalLink, ChevronRight, GraduationCap, Flame, AlertCircle,
  Brain
} from 'lucide-react';
import TownHalls from './TownHalls';
import ProfessionalProfile from './ProfessionalProfile';
import DsaSheets from './DsaSheets';
import DsaProblems from './DsaProblems';
import Quiz from './Quiz';
import Blogs from './Blogs';

interface DashboardProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (path: string) => void;
  onBackToHome: () => void;
  currentPath: string;
}

const pathToTab: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/desboard': 'Dashboard',
  '/townhall': 'Town Halls',
  '/town-hall': 'Town Halls',
  '/town-halls': 'Town Halls',
  '/blogs': 'Blogs',
  '/blog': 'Blogs',
  '/projects': 'Projects',
  '/project': 'Projects',
  '/peerreviews': 'Peer Reviews',
  '/peer-reviews': 'Peer Reviews',
  '/events': 'Events',
  '/event': 'Events',
  '/hackathons-dashboard': 'Hackathons',
  '/my-hackathons': 'My Hackathons',
  '/myhackathons': 'My Hackathons',
  '/dsa-problems': 'DSA Problems',
  '/dsaproblems': 'DSA Problems',
  '/dsa-sheets': 'DSA Sheets',
  '/dsasheets': 'DSA Sheets',
  '/profile': 'Professional Profile',
  '/professional-profile': 'Professional Profile',
  '/report-card': 'Report Card',
  '/reportcard': 'Report Card',
  '/quiz-tab': 'Quiz'
};

const tabToPath: Record<string, string> = {
  'Dashboard': '/dashboard',
  'Town Halls': '/town-hall',
  'Blogs': '/blogs',
  'Projects': '/projects',
  'Peer Reviews': '/peer-reviews',
  'Events': '/events',
  'Hackathons': '/hackathons-dashboard',
  'My Hackathons': '/my-hackathons',
  'DSA Problems': '/dsa-problems',
  'DSA Sheets': '/dsa-sheets',
  'Professional Profile': '/professional-profile',
  'Report Card': '/report-card',
  'Quiz': '/quiz-tab'
};

export default function Dashboard({ darkMode, onToggleDarkMode, onNavigate, onBackToHome, currentPath }: DashboardProps) {
  const activeTab = pathToTab[currentPath] || 'Dashboard';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Sidebar navigation configuration
  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Town Halls', icon: Users, beta: true },
    { name: 'Blogs', icon: FileText },
    { name: 'Projects', icon: Folder },
    { name: 'Peer Reviews', icon: CheckSquare },
    { name: 'Events', icon: Calendar },
    { name: 'Hackathons', icon: Trophy, beta: true },
    { name: 'My Hackathons', icon: Award, beta: true },
    { name: 'DSA Problems', icon: Code },
    { name: 'DSA Sheets', icon: FileSpreadsheet },
    { name: 'Quiz', icon: Brain, beta: true },
    { name: 'Professional Profile', icon: User },
    { name: 'Report Card', icon: ClipboardList }
  ];

  // Helper to render custom owl logo (Mascot)
  const OwlLogo = () => (
    <svg className="w-8 h-8 text-[#ff6b2b]" viewBox="0 0 100 100" fill="currentColor">
      {/* Head shape */}
      <path d="M50 15 C30 15 20 28 20 48 C20 68 32 82 50 82 C68 82 80 68 80 48 C80 28 70 15 50 15 Z" fill="#1e293b" />
      {/* Ears / horns */}
      <path d="M22 28 L15 12 L35 20 Z" fill="#0f172a" />
      <path d="M78 28 L85 12 L65 20 Z" fill="#0f172a" />
      {/* White face patches */}
      <circle cx="38" cy="45" r="18" fill="white" />
      <circle cx="62" cy="45" r="18" fill="white" />
      {/* Spectacles (orange rims) */}
      <circle cx="38" cy="45" r="14" fill="none" stroke="#ff6b2b" strokeWidth="4.5" />
      <circle cx="62" cy="45" r="14" fill="none" stroke="#ff6b2b" strokeWidth="4.5" />
      {/* Glasses bridge */}
      <rect x="48" y="43" width="4" height="4" fill="#ff6b2b" />
      {/* Big Pupils */}
      <circle cx="38" cy="45" r="6" fill="#1e293b" />
      <circle cx="62" cy="45" r="6" fill="#1e293b" />
      {/* Pupil reflection */}
      <circle cx="36" cy="43" r="2" fill="white" />
      <circle cx="60" cy="43" r="2" fill="white" />
      {/* Beak */}
      <polygon points="50,48 45,56 55,56" fill="#f59e0b" />
      {/* Eyebrows */}
      <path d="M25 28 Q38 32 46 36" fill="none" stroke="#ff6b2b" strokeWidth="3" strokeLinecap="round" />
      <path d="M75 28 Q62 32 54 36" fill="none" stroke="#ff6b2b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="h-screen bg-[#faf9f6] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 flex transition-colors overflow-hidden">
      
      {/* Left Sidebar Layout */}
      <aside 
        className={`h-screen sticky top-0 bg-white dark:bg-stone-900 border-r border-[#e7e5e4] dark:border-stone-800 flex flex-col justify-between transition-all duration-300 relative z-20 flex-shrink-0 overflow-hidden ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        
        {/* Sidebar Content wrapper */}
        <div className="flex-grow py-6 flex flex-col min-h-0 overflow-hidden">
          
          {/* Branded Logo Header */}
          <div className={`px-5 mb-8 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex-shrink-0 cursor-pointer hover:rotate-3 transition-transform" onClick={onBackToHome}>
              <OwlLogo />
            </div>
            {!isCollapsed && (
              <span className="font-sans font-extrabold text-xl tracking-tight text-slate-900 dark:text-white cursor-pointer" onClick={onBackToHome}>
                Leet<span className="text-[#ff6b2b]">Master</span>
              </span>
            )}
          </div>

          {/* Navigation Links list */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto min-h-0 pr-1.5 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-850">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(tabToPath[item.name] || '/dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all text-left group focus:outline-none cursor-pointer ${
                    isActive 
                      ? 'bg-[#fff1e6] dark:bg-[#3d2417] text-[#ff6b2b] dark:text-[#ff804a]' 
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850 hover:text-stone-950 dark:hover:text-stone-50'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#ff6b2b]' : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300'}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </div>

                  {!isCollapsed && item.beta && (
                    <span className="text-[9px] font-bold text-[#ff6b2b] bg-[#fff1e6] dark:bg-[#3d2417] px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#ff6b2b]" />
                      BETA
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* User profile capsule at the bottom */}
        <div className="p-4 border-t border-[#e7e5e4] dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between flex-shrink-0 relative">
          
          {/* Profile Dropdown Popover */}
          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute bottom-[76px] z-50 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xl ${
                  isCollapsed ? 'left-2 w-56' : 'left-4 right-4'
                }`}
              >
                <div className="space-y-4 text-left">
                  {/* Signed In Info */}
                  <div className="space-y-1">
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-stone-900 dark:text-white truncate" title="dastgeerjutt8888@gmail.com">
                      dastgeerjutt8888@gmail.com
                    </p>
                  </div>

                  {/* Navigation Options */}
                  <div className="space-y-3.5 pt-2 border-t border-stone-100 dark:border-stone-800/50">
                    {/* My Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('/professional-profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left font-semibold text-sm text-stone-700 dark:text-stone-300 hover:text-[#ff6b2b] dark:hover:text-[#ff804a] transition-colors cursor-pointer block focus:outline-none"
                    >
                      My Profile
                    </button>

                    {/* Toggle Theme */}
                    <button
                      type="button"
                      onClick={() => {
                        onToggleDarkMode();
                      }}
                      className="w-full flex items-center justify-between text-left font-semibold text-sm text-stone-700 dark:text-stone-300 hover:text-[#ff6b2b] dark:hover:text-[#ff804a] transition-colors cursor-pointer focus:outline-none"
                    >
                      <span>Toggle theme</span>
                      {/* Theme visual icon mimicking screenshot exactly */}
                      <div className="w-5 h-5 rounded-full border border-stone-800 dark:border-stone-400 overflow-hidden relative flex items-center justify-center flex-shrink-0">
                        <div className="absolute inset-0 bg-stone-900 dark:bg-stone-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} />
                        <div className="absolute inset-0 bg-white dark:bg-stone-900" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
                      </div>
                    </button>

                    {/* Log Out */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onBackToHome();
                      }}
                      className="w-full text-left font-semibold text-sm text-stone-700 dark:text-stone-300 hover:text-red-500 transition-colors cursor-pointer block focus:outline-none"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 min-w-0 text-left focus:outline-none hover:opacity-80 transition-all cursor-pointer group"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop" 
              alt="Dastgeer" 
              className="w-9 h-9 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#ff6b2b]"
            />
            {!isCollapsed && (
              <div className="truncate">
                <h5 className="text-sm font-black text-stone-900 dark:text-stone-100 leading-none group-hover:text-[#ff6b2b]">Dastgeer</h5>
                <p className="text-[10px] text-[#ff6b2b] font-bold mt-1">Scholar Member</p>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <button 
              onClick={onBackToHome}
              className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-all cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Interactive toggle collar button sitting on the border */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-full shadow-md flex items-center justify-center text-stone-500 hover:text-black dark:hover:text-white hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        </button>

      </aside>

      {/* Right Canvas Main scrollable contents */}
      <main className={`flex-1 flex flex-col h-screen ${activeTab === 'Town Halls' ? 'p-0 overflow-hidden' : 'overflow-y-auto p-6 md:p-8 lg:p-10'}`}>
        
        {/* Dynamic header row with Title, Notice Board & Split theme toggle */}
        {activeTab !== 'Town Halls' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 dark:border-stone-850 pb-6 mb-8 flex-shrink-0">
            <div>
              <h1 className="text-3xl font-extrabold font-sans text-stone-900 dark:text-white tracking-tight">
                {activeTab}
              </h1>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mt-1">
                {activeTab === 'Dashboard' 
                  ? 'Overview of your progress and upcoming deadlines.'
                  : `Interactive space for managing ${activeTab.toLowerCase()}.`
                }
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              {/* Notice Board Button */}
              <button className="bg-[#e7e5e4] dark:bg-stone-800 hover:bg-[#d6d3d1] dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer">
                Notice Board
              </button>

              {/* Split Yin-Yang Styled Dark Mode Toggle Circle */}
              <button 
                onClick={onToggleDarkMode}
                className="w-7 h-7 rounded-full border-2 border-stone-800 dark:border-stone-400 cursor-pointer overflow-hidden relative flex items-center justify-center transition-transform hover:scale-105"
                title="Toggle Theme"
              >
                <div className="absolute inset-0 bg-stone-900 dark:bg-stone-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} />
                <div className="absolute inset-0 bg-white dark:bg-stone-900" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
              </button>
            </div>
          </div>
        )}

        {/* Tab specific screens */}
        <AnimatePresence mode="wait">
          {activeTab === 'Dashboard' && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Stat cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* CARD 1: Peer Reviews */}
                <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">Peer Reviews</h3>
                    <Star className="w-5 h-5 text-stone-400 dark:text-stone-500 fill-stone-400 dark:fill-stone-500" />
                  </div>
                  <div className="mt-4 mb-5">
                    <span className="text-5xl font-black font-sans text-stone-900 dark:text-white">0</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      0 Total
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      0 Pending
                    </span>
                  </div>
                </div>

                {/* CARD 2: Projects */}
                <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">Projects</h3>
                    <div className="grid grid-cols-2 gap-0.5 w-5 h-5 text-stone-400 dark:text-stone-500">
                      <div className="border border-current rounded-sm" />
                      <div className="border border-current rounded-sm" />
                      <div className="border border-current rounded-sm" />
                      <div className="border border-current rounded-sm" />
                    </div>
                  </div>
                  <div className="mt-4 mb-5">
                    <span className="text-5xl font-black font-sans text-stone-900 dark:text-white">0</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      0 Total
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      0 Pending
                    </span>
                  </div>
                </div>

                {/* CARD 3: Blogs */}
                <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">Blogs</h3>
                    <PenTool className="w-5 h-5 text-stone-400 dark:text-stone-500" />
                  </div>
                  <div className="mt-4 mb-5">
                    <span className="text-5xl font-black font-sans text-stone-900 dark:text-white">0</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      0 Total
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      0 Pending
                    </span>
                  </div>
                </div>

                {/* CARD 4: Courses */}
                <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">Courses</h3>
                    <Award className="w-5 h-5 text-stone-400 dark:text-stone-500" />
                  </div>
                  <div className="mt-4 mb-5">
                    <span className="text-5xl font-black font-sans text-stone-900 dark:text-white">1</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      0 Completed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      1 Ongoing
                    </span>
                  </div>
                </div>

              </div>

              {/* Status Rating Row Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="bg-[#e6f4ea] text-[#137333] dark:bg-[#13301a] dark:text-[#81c995] text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="font-mono">0</span> Marks Earned
                </span>
                
                <span className="bg-[#e8f0fe] text-[#1a73e8] dark:bg-[#1a2e4c] dark:text-[#8ab4f8] text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="font-mono">0</span> Peer Evaluations
                </span>
                
                <span className="bg-[#fce8e6] text-[#c5221f] dark:bg-[#3c1e1d] dark:text-[#f28b82] text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="font-mono">0</span> Penalty Marks
                </span>
                
                <span className="bg-[#f3e8fd] text-[#a069df] dark:bg-[#2c1c3f] dark:text-[#c58af9] text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="font-mono">0.0/5</span> Code Quality Rating
                </span>
                
                <span className="bg-[#fef3e0] text-[#e08900] dark:bg-[#3d2716] dark:text-[#fdd663] text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="font-mono">0.0/5</span> Writing Rating
                </span>
                
                <span className="bg-[#f1f3f4] text-[#5f6368] dark:bg-stone-800 dark:text-stone-300 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span className="font-mono">0.0/5</span> Evaluation Rating
                </span>
              </div>

              {/* Upcoming Deadlines Container */}
              <div className="pt-8">
                <h2 className="text-2xl font-bold font-sans text-stone-800 dark:text-stone-100 mb-6">
                  Upcoming Deadlines
                </h2>
                
                <div className="min-h-[220px] bg-white/40 dark:bg-stone-900/10 border border-stone-200/40 dark:border-stone-800/40 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-sm font-semibold text-stone-400 dark:text-stone-500">
                    No upcoming deadlines
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* Town Halls Section */}
          {activeTab === 'Town Halls' && (
            <motion.div
              key="town-halls-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <TownHalls darkMode={darkMode} />
            </motion.div>
          )}

          {/* Professional Profile Section */}
          {activeTab === 'Professional Profile' && (
            <motion.div
              key="professional-profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ProfessionalProfile />
            </motion.div>
          )}

          {/* DSA Sheets Section */}
          {activeTab === 'DSA Sheets' && (
            <motion.div
              key="dsa-sheets-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <DsaSheets />
            </motion.div>
          )}

          {/* DSA Problems Section */}
          {activeTab === 'DSA Problems' && (
            <motion.div
              key="dsa-problems-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <DsaProblems />
            </motion.div>
          )}

          {/* Quiz Section */}
          {activeTab === 'Quiz' && (
            <motion.div
              key="quiz-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <Quiz />
            </motion.div>
          )}

          {/* Blogs Section */}
          {activeTab === 'Blogs' && (
            <motion.div
              key="blogs-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <Blogs />
            </motion.div>
          )}

          {/* Placeholders/Sub-integrations for other Sidebar tabs */}
          {activeTab !== 'Dashboard' && activeTab !== 'Town Halls' && activeTab !== 'Professional Profile' && activeTab !== 'DSA Sheets' && activeTab !== 'DSA Problems' && activeTab !== 'Quiz' && (
            <motion.div
              key="fallback-tabs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#ff6b2b]/10 text-[#ff6b2b] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">{activeTab} Section</h3>
                  <p className="text-xs text-stone-400">Integrated beautifully with LeetMaster's peer infrastructure</p>
                </div>
              </div>

              <p className="text-sm font-medium text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl mb-6">
                You are currently viewing the custom <span className="font-semibold text-black dark:text-white">#{activeTab.toLowerCase()}</span> workspace. This feature synchronizes your ratings, peer reviews, and deadlines automatically with the LeetMaster database engine.
              </p>

              <div className="bg-[#faf9f6] dark:bg-stone-950 rounded-2xl p-6 border border-stone-100 dark:border-stone-850 flex flex-col items-center justify-center text-center py-12">
                <Flame className="w-10 h-10 text-[#ff6b2b] mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">Peer synchronization active</h4>
                <p className="text-xs text-stone-400 max-w-sm">Every action is tracked for your daily scholar streak. Complete peer reviews to gain extra marks.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}
