import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, FileText, Folder, CheckSquare, 
  Calendar, Trophy, Award, Code, FileSpreadsheet, User, 
  ClipboardList, ArrowLeft, ArrowRight, Bell, Moon, Sun,
  Check, Star, Sparkles, MessageSquare, BookOpen, PenTool,
  Plus, ExternalLink, ChevronRight, GraduationCap, Flame, AlertCircle,
  Brain, BarChart2, TrendingUp, Shield, HelpCircle, Menu, X
} from 'lucide-react';
import { Blog, Project, Hackathon, Event } from '../types';
import TownHalls from './TownHalls';
import ProfessionalProfile from './ProfessionalProfile';
import DsaSheets from './DsaSheets';
import DsaProblems from './DsaProblems';
import Quiz from './Quiz';
import Blogs from './Blogs';
import HackathonsDashboard from './HackathonsDashboard';
import EventsDashboard from './EventsDashboard';
import ProjectsDashboard from './ProjectsDashboard';
import ReportCard from './ReportCard';
import Courses from './Courses';
import Achievements from './Achievements';

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
  '/quiz-tab': 'Quiz',
  '/courses': 'Courses',
  '/achievements': 'Achievements'
};

const tabToPath: Record<string, string> = {
  'Dashboard': '/dashboard',
  'Town Halls': '/town-hall',
  'Blogs': '/blogs',
  'Projects': '/projects',
  'Events': '/events',
  'Hackathons': '/hackathons-dashboard',
  'My Hackathons': '/my-hackathons',
  'DSA Problems': '/dsa-problems',
  'DSA Sheets': '/dsa-sheets',
  'Professional Profile': '/professional-profile',
  'Report Card': '/report-card',
  'Quiz': '/quiz-tab',
  'Courses': '/courses',
  'Achievements': '/achievements'
};

export default function Dashboard({ darkMode, onToggleDarkMode, onNavigate, onBackToHome, currentPath }: DashboardProps) {
  const activeTab = pathToTab[currentPath] || 'Dashboard';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState("Dastgeer");

  // Close mobile sidebar on navigate
  useEffect(() => {
    setIsMobileOpen(false);
  }, [currentPath]);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<{ category: string; type: 'Public' | 'Private'; count: number } | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile && data.profile.fullName) {
          setProfileName(data.profile.fullName);
        }
      })
      .catch(err => console.error("Error fetching profile inside Dashboard:", err));
  }, []);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [resBlogs, resProjects, resHackathons, resEvents] = await Promise.all([
          fetch('/api/blogs').then(r => r.json()).catch(() => ({ success: false })),
          fetch('/api/projects').then(r => r.json()).catch(() => ({ success: false })),
          fetch('/api/hackathons').then(r => r.json()).catch(() => ({ success: false })),
          fetch('/api/events').then(r => r.json()).catch(() => ({ success: false }))
        ]);

        if (active) {
          if (resBlogs && resBlogs.success) setBlogs(resBlogs.blogs || []);
          if (resProjects && resProjects.success) setProjects(resProjects.projects || []);
          if (resHackathons && resHackathons.success) setHackathons(resHackathons.hackathons || []);
          if (resEvents && resEvents.success) setEvents(resEvents.events || []);
          setStatsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        if (active) setStatsLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [activeTab]);

  // Computed values for Projects
  const totalProjects = projects.length;
  const publicProjects = projects.filter(p => p.status === 'scheduler' || p.status === 'public').length;
  const privateProjects = projects.filter(p => p.status === 'private').length;
  const myProjects = projects.filter(p => p.isUserProject).length;

  // Computed values for Blogs
  const totalBlogs = blogs.length;
  const publicBlogs = blogs.filter(b => b.status === 'scheduler' || b.status === 'public').length;
  const privateBlogs = blogs.filter(b => b.status === 'private').length;
  const myBlogs = blogs.filter(b => b.isUserBlog).length;

  // Computed values for Hackathons
  const totalHackathons = hackathons.length;
  const publicHackathons = hackathons.filter(h => h.status === 'scheduler' || h.status === 'public').length;
  const privateHackathons = hackathons.filter(h => h.status === 'private').length;
  const myHackathons = hackathons.filter(h => h.isUserHackathon).length;

  // Sidebar navigation configuration
  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Town Halls', icon: Users, beta: true },
    { name: 'Blogs', icon: FileText },
    { name: 'Projects', icon: Folder },
    { name: 'Events', icon: Calendar },
    { name: 'Hackathons', icon: Trophy },
    { name: 'My Hackathons', icon: Award },
    { name: 'DSA Problems', icon: Code },
    { name: 'DSA Sheets', icon: FileSpreadsheet },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Quiz', icon: Brain },
    { name: 'Professional Profile', icon: User },
    { name: 'Achievements', icon: Trophy },
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
    <div className="h-screen bg-[#faf9f6] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 flex transition-colors overflow-hidden relative">
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar Layout */}
      <aside 
        className={`h-screen bg-white dark:bg-stone-900 border-r border-[#e7e5e4] dark:border-stone-800 flex flex-col justify-between transition-all duration-300 flex-shrink-0 overflow-hidden z-40
          fixed inset-y-0 left-0 md:sticky md:top-0 md:translate-x-0
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        `}
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
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto min-h-0 pr-1.5 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-800">
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
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-950 dark:hover:text-stone-50'
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
            <div className="w-9 h-9 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border-2 border-stone-200 dark:border-stone-700 group-hover:border-[#ff6b2b] text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-sm select-none transition-all flex-shrink-0">
              {profileName ? profileName.trim().charAt(0).toUpperCase() : 'D'}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h5 className="text-sm font-black text-stone-900 dark:text-stone-100 leading-none group-hover:text-[#ff6b2b]">{profileName}</h5>
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
          className="hidden md:flex absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-full shadow-md items-center justify-center text-stone-500 hover:text-black dark:hover:text-white hover:scale-105 active:scale-95 transition-all z-30 cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        </button>

      </aside>

      {/* Right Canvas Main scrollable contents */}
      <main className={`flex-1 flex flex-col h-screen ${activeTab === 'Town Halls' ? 'p-0 overflow-hidden' : 'overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10'}`}>
        
        {/* Mobile Header Top Bar (only visible on mobile/tablet) */}
        <div className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200/60 dark:border-stone-800 px-4 py-3 flex items-center justify-between flex-shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-stone-600 dark:text-stone-300 focus:outline-none"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-sans font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
              Leet<span className="text-[#ff6b2b]">Master</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#ff6b2b] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded uppercase">
              {activeTab}
            </span>
            <button 
              onClick={onToggleDarkMode}
              className="w-6 h-6 rounded-full border border-stone-800 dark:border-stone-400 overflow-hidden relative flex items-center justify-center"
              title="Toggle Theme"
            >
              <div className="absolute inset-0 bg-stone-900 dark:bg-stone-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} />
              <div className="absolute inset-0 bg-white dark:bg-stone-900" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
            </button>
          </div>
        </div>
        
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
              {statsLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-10 h-10 border-4 border-orange-500/20 border-t-[#ff6b2b] rounded-full animate-spin" />
                  <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold font-mono">
                    Loading LeetMaster Ecosystem statistics...
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* CARD 1: Projects */}
                    <div 
                      onClick={() => onNavigate('/projects')}
                      className="group cursor-pointer bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#ff6b2b] dark:hover:border-[#ff6b2b]/60 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
                      <div className="flex items-start justify-between relative z-10">
                        <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 group-hover:text-[#ff6b2b] transition-colors uppercase tracking-wider font-mono">Projects</h3>
                        <Folder className="w-5 h-5 text-stone-400 group-hover:text-[#ff6b2b] transition-colors" />
                      </div>
                      <div className="mt-4 mb-5 relative z-10">
                        <span className="text-5xl font-black font-sans text-stone-900 dark:text-white group-hover:scale-105 transition-transform inline-block">
                          {totalProjects}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 dark:border-stone-850 text-[11px] font-bold text-stone-500 dark:text-stone-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            🌍 Public
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">{publicProjects}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            🔒 Private
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">{privateProjects}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-dashed border-stone-200 dark:border-stone-800 text-[10px] text-[#ff6b2b]">
                          <span>👤 Added by you</span>
                          <span className="font-mono">{myProjects}</span>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: Blogs */}
                    <div 
                      onClick={() => onNavigate('/blogs')}
                      className="group cursor-pointer bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#ff6b2b] dark:hover:border-[#ff6b2b]/60 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
                      <div className="flex items-start justify-between relative z-10">
                        <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 group-hover:text-[#ff6b2b] transition-colors uppercase tracking-wider font-mono">Blogs</h3>
                        <PenTool className="w-5 h-5 text-stone-400 group-hover:text-[#ff6b2b] transition-colors" />
                      </div>
                      <div className="mt-4 mb-5 relative z-10">
                        <span className="text-5xl font-black font-sans text-stone-900 dark:text-white group-hover:scale-105 transition-transform inline-block">
                          {totalBlogs}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 dark:border-stone-850 text-[11px] font-bold text-stone-500 dark:text-stone-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            🌍 Public
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">{publicBlogs}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            🔒 Private
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">{privateBlogs}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-dashed border-stone-200 dark:border-stone-800 text-[10px] text-[#ff6b2b]">
                          <span>👤 Added by you</span>
                          <span className="font-mono">{myBlogs}</span>
                        </div>
                      </div>
                    </div>

                    {/* CARD 3: Hackathons */}
                    <div 
                      onClick={() => onNavigate('/hackathons-dashboard')}
                      className="group cursor-pointer bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#ff6b2b] dark:hover:border-[#ff6b2b]/60 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
                      <div className="flex items-start justify-between relative z-10">
                        <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 group-hover:text-[#ff6b2b] transition-colors uppercase tracking-wider font-mono">Hackathons</h3>
                        <Trophy className="w-5 h-5 text-stone-400 group-hover:text-[#ff6b2b] transition-colors" />
                      </div>
                      <div className="mt-4 mb-5 relative z-10">
                        <span className="text-5xl font-black font-sans text-stone-900 dark:text-white group-hover:scale-105 transition-transform inline-block">
                          {totalHackathons}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 dark:border-stone-850 text-[11px] font-bold text-stone-500 dark:text-stone-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            🌍 Public
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">{publicHackathons}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            🔒 Private
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">{privateHackathons}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-dashed border-stone-200 dark:border-stone-800 text-[10px] text-[#ff6b2b]">
                          <span>🏆 Participating</span>
                          <span className="font-mono">{myHackathons}</span>
                        </div>
                      </div>
                    </div>

                    {/* CARD 4: Courses */}
                    <div 
                      onClick={() => onNavigate('/quiz-tab')}
                      className="group cursor-pointer bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#ff6b2b] dark:hover:border-[#ff6b2b]/60 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
                      <div className="flex items-start justify-between relative z-10">
                        <h3 className="text-sm font-bold text-stone-500 dark:text-stone-400 group-hover:text-[#ff6b2b] transition-colors uppercase tracking-wider font-mono">Courses</h3>
                        <GraduationCap className="w-5 h-5 text-stone-400 group-hover:text-[#ff6b2b] transition-colors" />
                      </div>
                      <div className="mt-4 mb-5 relative z-10">
                        <span className="text-5xl font-black font-sans text-stone-900 dark:text-white group-hover:scale-105 transition-transform inline-block">
                          1
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-3 border-t border-stone-100 dark:border-stone-850 text-[11px] font-bold text-stone-500 dark:text-stone-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Completed
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">0</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Ongoing
                          </span>
                          <span className="font-mono text-stone-900 dark:text-white">1</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-dashed border-stone-200 dark:border-stone-800 text-[10px] text-stone-400">
                          <span>Scholar quiz rewards</span>
                          <span className="font-mono">+30 XP</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Project Dashboard Graph Section */}
                  <div className="bg-white dark:bg-stone-900 border border-[#e7e5e4] dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                      <div>
                        <h3 className="text-lg font-black font-sans text-stone-900 dark:text-white flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-[#ff6b2b]" />
                          <span>Ecosystem Assets Overview</span>
                        </h3>
                        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                          Dynamic distribution of community and personal resources added to the local SQLite database.
                        </p>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center gap-5 text-[11px] font-extrabold font-mono uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-[#ff6b2b]" />
                          <span className="text-stone-600 dark:text-stone-300">Public ({publicProjects + publicBlogs + publicHackathons})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-amber-500" />
                          <span className="text-stone-600 dark:text-stone-300">Private ({privateProjects + privateBlogs + privateHackathons})</span>
                        </div>
                      </div>
                    </div>

                    {/* SVG Side-by-Side Graph */}
                    <div className="relative pt-4 pb-2">
                      <div className="w-full overflow-x-auto scrollbar-none">
                        <div className="min-w-[500px]">
                          <svg className="w-full h-64 overflow-visible" viewBox="0 0 600 240" preserveAspectRatio="none">
                            {/* Horizontal Grid lines */}
                            <line x1="40" y1="20" x2="580" y2="20" stroke="currentColor" strokeWidth="1" className="text-stone-100 dark:text-stone-800/80" strokeDasharray="4 4" />
                            <line x1="40" y1="70" x2="580" y2="70" stroke="currentColor" strokeWidth="1" className="text-stone-100 dark:text-stone-800/80" strokeDasharray="4 4" />
                            <line x1="40" y1="120" x2="580" y2="120" stroke="currentColor" strokeWidth="1" className="text-stone-100 dark:text-stone-800/80" strokeDasharray="4 4" />
                            <line x1="40" y1="170" x2="580" y2="170" stroke="currentColor" strokeWidth="1" className="text-stone-100 dark:text-stone-800/80" strokeDasharray="4 4" />
                            <line x1="40" y1="220" x2="580" y2="220" stroke="currentColor" strokeWidth="1.5" className="text-stone-200 dark:text-stone-700" />

                            {/* Y-Axis Labels */}
                            {(() => {
                              const maxVal = Math.max(totalProjects, totalBlogs, totalHackathons, 4);
                              return (
                                <>
                                  <text x="30" y="24" textAnchor="end" className="text-[10px] font-bold font-mono fill-stone-400 dark:fill-stone-500">{Math.ceil(maxVal)}</text>
                                  <text x="30" y="124" textAnchor="end" className="text-[10px] font-bold font-mono fill-stone-400 dark:fill-stone-500">{Math.ceil(maxVal / 2)}</text>
                                  <text x="30" y="224" textAnchor="end" className="text-[10px] font-bold font-mono fill-stone-400 dark:fill-stone-500">0</text>
                                </>
                              );
                            })()}

                            {/* Columns data mapping */}
                            {(() => {
                              const maxVal = Math.max(totalProjects, totalBlogs, totalHackathons, 4);
                              const chartData = [
                                {
                                  category: 'Projects',
                                  label: 'Projects Dashboard',
                                  public: publicProjects,
                                  private: privateProjects,
                                  total: totalProjects,
                                  path: '/projects'
                                },
                                {
                                  category: 'Blogs',
                                  label: 'Developer Blogs',
                                  public: publicBlogs,
                                  private: privateBlogs,
                                  total: totalBlogs,
                                  path: '/blogs'
                                },
                                {
                                  category: 'Hackathons',
                                  label: 'Hackathons Hub',
                                  public: publicHackathons,
                                  private: privateHackathons,
                                  total: totalHackathons,
                                  path: '/hackathons-dashboard'
                                }
                              ];

                              return chartData.map((data, index) => {
                                const colWidth = 120;
                                const colGap = 170;
                                const startX = 70 + index * colGap;
                                
                                // Calculate pixel heights (chart area height is 200px: from y=20 to y=220)
                                const pubHeight = (data.public / maxVal) * 200 || 8; // min height of 8px so empty states render beautiful columns
                                const privHeight = (data.private / maxVal) * 200 || 8;

                                return (
                                  <g key={data.category} className="group/bar cursor-pointer" onClick={() => onNavigate(data.path)}>
                                    {/* Hover Column Background */}
                                    <rect 
                                      x={startX - 15} 
                                      y="10" 
                                      width={colWidth + 20} 
                                      height="215" 
                                      className="fill-transparent group-hover/bar:fill-stone-500/5 dark:group-hover/bar:fill-stone-800/10 transition-colors"
                                      rx="16"
                                    />

                                    {/* Category Label */}
                                    <text 
                                      x={startX + colWidth / 2 - 5} 
                                      y="238" 
                                      textAnchor="middle" 
                                      className="text-xs font-black font-sans fill-stone-500 dark:fill-stone-400 group-hover/bar:fill-[#ff6b2b] transition-colors"
                                    >
                                      {data.label}
                                    </text>

                                    {/* Public Bar */}
                                    <rect
                                      x={startX + 10}
                                      y={220 - pubHeight}
                                      width="32"
                                      height={pubHeight}
                                      fill="#ff6b2b"
                                      rx="6"
                                      className="transition-all duration-300 group-hover/bar:opacity-95"
                                      onMouseEnter={() => setHoveredBar({ category: data.label, type: 'Public', count: data.public })}
                                      onMouseLeave={() => setHoveredBar(null)}
                                    />

                                    {/* Private Bar */}
                                    <rect
                                      x={startX + 52}
                                      y={220 - privHeight}
                                      width="32"
                                      height={privHeight}
                                      fill="#f59e0b"
                                      rx="6"
                                      className="transition-all duration-300 group-hover/bar:opacity-95"
                                      onMouseEnter={() => setHoveredBar({ category: data.label, type: 'Private', count: data.private })}
                                      onMouseLeave={() => setHoveredBar(null)}
                                    />

                                    {/* Tooltip bubble inside the graph */}
                                    <g transform={`translate(${startX + colWidth / 2 - 5}, ${195 - Math.max(pubHeight, privHeight)})`}>
                                      <rect 
                                        x="-30" 
                                        y="-24" 
                                        width="60" 
                                        height="20" 
                                        rx="10" 
                                        className="fill-stone-900 dark:fill-stone-800 stroke-stone-200 dark:stroke-stone-700 opacity-0 group-hover/bar:opacity-100 transition-all duration-200"
                                      />
                                      <text 
                                        y="-10" 
                                        textAnchor="middle" 
                                        className="text-[10px] font-black font-mono fill-white opacity-0 group-hover/bar:opacity-100 transition-all duration-200"
                                      >
                                        {data.total} Total
                                      </text>
                                    </g>
                                  </g>
                                );
                              });
                            })()}
                          </svg>
                        </div>
                      </div>

                      {/* Interactive floating state summary popover */}
                      <AnimatePresence>
                        {hoveredBar && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 5 }}
                            className="absolute top-0 right-4 bg-stone-900 dark:bg-stone-950 text-white border border-stone-850 shadow-xl p-4 rounded-2xl flex flex-col gap-1 z-30 font-mono text-xs w-56"
                          >
                            <div className="flex items-center gap-1.5 border-b border-stone-850 pb-2 mb-2 justify-between">
                              <span className="text-[#ff6b2b] font-black uppercase tracking-wider text-[10px]">{hoveredBar.category}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] animate-ping" />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-stone-450 font-semibold">{hoveredBar.type} Share:</span>
                              <span className="font-extrabold text-white px-2 py-0.5 bg-stone-800 rounded font-mono">{hoveredBar.count} {hoveredBar.count === 1 ? 'item' : 'items'}</span>
                            </div>
                            <p className="text-[9px] text-[#ff6b2b] font-black uppercase tracking-wider text-right mt-2 leading-none">Click column to view &rarr;</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                    <h2 className="text-2xl font-bold font-sans text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-[#ff6b2b]" />
                      <span>Upcoming Deadlines</span>
                    </h2>
                    
                    {hackathons.length === 0 ? (
                      <div className="min-h-[160px] bg-white/40 dark:bg-stone-900/10 border border-stone-200/40 dark:border-stone-800/40 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-sm font-semibold text-stone-400 dark:text-stone-500">
                          No upcoming deadlines
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hackathons.slice(0, 3).map((hack) => (
                          <div 
                            key={hack.id}
                            onClick={() => onNavigate('/hackathons-dashboard')}
                            className="cursor-pointer group p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl flex flex-col justify-between hover:border-[#ff6b2b] dark:hover:border-[#ff6b2b]/60 transition-all shadow-sm"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold font-mono text-[#ff6b2b] uppercase tracking-wider mb-2">
                                <span>Hackathon</span>
                                <span className="bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-full">Active</span>
                              </div>
                              <h4 className="text-sm font-black text-stone-900 dark:text-stone-50 group-hover:text-[#ff6b2b] transition-colors leading-snug line-clamp-2">
                                {hack.title}
                              </h4>
                            </div>
                            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between text-xs text-stone-400 font-mono">
                              <span className="font-bold flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                {hack.deadline}
                              </span>
                              <span className="font-black text-[#ff6b2b] group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

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

          {/* Hackathons Section */}
          {activeTab === 'Hackathons' && (
            <motion.div
              key="hackathons-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <HackathonsDashboard isMyOnly={false} />
            </motion.div>
          )}

          {/* My Hackathons Section */}
          {activeTab === 'My Hackathons' && (
            <motion.div
              key="my-hackathons-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <HackathonsDashboard isMyOnly={true} />
            </motion.div>
          )}

          {/* Events Section */}
          {activeTab === 'Events' && (
            <motion.div
              key="events-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <EventsDashboard />
            </motion.div>
          )}

          {/* Projects Section */}
          {activeTab === 'Projects' && (
            <motion.div
              key="projects-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ProjectsDashboard />
            </motion.div>
          )}

          {/* Report Card Section */}
          {activeTab === 'Report Card' && (
            <motion.div
              key="report-card-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <ReportCard onNavigate={onNavigate} />
            </motion.div>
          )}

          {/* Courses Section */}
          {activeTab === 'Courses' && (
            <motion.div
              key="courses-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <Courses />
            </motion.div>
          )}

          {/* Achievements Section */}
          {activeTab === 'Achievements' && (
            <motion.div
              key="achievements-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <Achievements />
            </motion.div>
          )}

          {/* Placeholders/Sub-integrations for other Sidebar tabs */}
          {activeTab !== 'Dashboard' && activeTab !== 'Town Halls' && activeTab !== 'Professional Profile' && activeTab !== 'DSA Sheets' && activeTab !== 'DSA Problems' && activeTab !== 'Quiz' && activeTab !== 'Blogs' && activeTab !== 'Hackathons' && activeTab !== 'My Hackathons' && activeTab !== 'Events' && activeTab !== 'Projects' && activeTab !== 'Report Card' && activeTab !== 'Courses' && activeTab !== 'Achievements' && (
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
