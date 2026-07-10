import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Folder, Calendar, Lock, Unlock, Globe, 
  Github, X, ExternalLink, Code2, Sparkles, Filter, ArrowUpRight, PenSquare, Trash2
} from 'lucide-react';
import { Project } from '../types';
import CardInteractions from './CardInteractions';

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Filtering & Search states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'public' | 'private'>('all');

  // Add Project modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [codeLink, setCodeLink] = useState<string>('');
  const [deployLink, setDeployLink] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [status, setStatus] = useState<'public' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Edit Project modal states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editCodeLink, setEditCodeLink] = useState<string>('');
  const [editDeployLink, setEditDeployLink] = useState<string>('');
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editEndDate, setEditEndDate] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'public' | 'private'>('public');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch projects from DB
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle new project submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !codeLink.trim() || !startDate) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          codeLink,
          deployLink,
          startDate,
          endDate,
          status
        })
      });
      const data = await res.json();
      if (data.success) {
        // Prepend new project and close modal
        setProjects(prev => [data.project, ...prev]);
        setIsAddModalOpen(false);
        // Clear fields
        setTitle('');
        setDescription('');
        setCodeLink('');
        setDeployLink('');
        setStartDate('');
        setEndDate('');
        setStatus('public');
        // Switch tab to My Projects to see your added project
        setActiveTab('my');
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  // Pre-fill fields for editing project
  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditCodeLink(project.codeLink);
    setEditDeployLink(project.deployLink || '');
    setEditStartDate(project.startDate);
    setEditEndDate(project.endDate || '');
    setEditStatus(project.status);
  };

  // Handle project update submission
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editTitle.trim() || !editDescription.trim() || !editCodeLink.trim() || !editStartDate) {
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          codeLink: editCodeLink,
          deployLink: editDeployLink,
          startDate: editStartDate,
          endDate: editEndDate,
          status: editStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? data.project : p));
        setEditingProject(null);
      }
    } catch (err) {
      console.error('Failed to update project:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter logic:
  // "All Projects" tab: shows public projects.
  // "My Projects" tab: shows user created projects (isUserProject = true), public or private.
  const filteredProjects = projects.filter(project => {
    // Tab filtering
    if (activeTab === 'all') {
      if (project.status !== 'public') return false;
    } else {
      // 'my' tab shows ONLY current user's projects
      if (!project.isUserProject) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && project.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchAuthor = project.author.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchAuthor;
    }

    return true;
  });

  // Helper to format dates cleanly
  const formatDateRange = (start: string, end: string) => {
    if (!start) return '';
    const format = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } catch {
        return dateStr;
      }
    };
    return `${format(start)} — ${end ? format(end) : 'Present'}`;
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Header section mirroring DSA Sheets */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 dark:border-stone-800 pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
            Developer Projects
          </h1>
          <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
            Showcase your hackathon projects, ML/Kaggle models, and full-stack repositories
          </p>
        </div>

        {/* Top-Right submit button and backend tag */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-full shadow-lg hover:shadow-[#ff6b2b]/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400/20 animate-pulse" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400">SQLite Connected</span>
          </div>
        </div>
      </div>

      {/* Dual Tab Switcher: All Projects vs My Projects */}
      <div className="flex border-b border-stone-250 dark:border-stone-800/80 p-1 bg-stone-100/50 dark:bg-stone-950/30 rounded-2xl max-w-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white dark:bg-stone-900 text-[#ff6b2b] shadow-sm border border-stone-200/50 dark:border-stone-800/50'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-450 dark:hover:text-stone-200'
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'my'
              ? 'bg-white dark:bg-stone-900 text-[#ff6b2b] shadow-sm border border-stone-200/50 dark:border-stone-800/50'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-450 dark:hover:text-stone-200'
          }`}
        >
          My Projects
        </button>
      </div>

      {/* Interactive Filters Control Bar */}
      <div className="bg-stone-50 dark:bg-[#151412] border border-stone-200/70 dark:border-stone-850/80 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-extrabold text-xs tracking-wider uppercase">
          <Filter className="w-3.5 h-3.5 text-[#ff6b2b]" />
          <span>Search & Filter Projects</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search project titles, descriptions, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all"
            />
          </div>

          {/* Status Filter (Public vs Private) */}
          <div className="md:col-span-4 relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-800 dark:text-stone-200 font-medium transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Visibilities</option>
              <option value="public">Public Visibilty Only</option>
              <option value="private">Private Visibility Only</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold font-mono">
            Loading developer projects from SQLite database...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl bg-stone-50/50 dark:bg-stone-950/20">
          <Folder className="w-12 h-12 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-stone-800 dark:text-stone-200 font-extrabold text-base">No projects found</h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
            {activeTab === 'my' 
              ? "You haven't submitted any projects yet! Click 'Add Project' to showcase your first development build."
              : "No public projects found matching the active search parameters. Check back later or add yours!"}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* PROJECTS CARD GRID - styled exactly like the high-quality DSA sheet / blogs cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-[#ff6b2b] hover:shadow-xl flex flex-col justify-between min-h-[300px] cursor-pointer"
            >
              {/* Grid backdrop deco pattern */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* Card Header: Visibility status, Start-End Date */}
                  <div className="flex items-center justify-between gap-2 border-b border-stone-200/30 dark:border-stone-800/30 pb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      project.status === 'public'
                        ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/30'
                        : 'bg-amber-100/60 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/30'
                    }`}>
                      {project.status === 'public' ? (
                        <>
                          <Unlock className="w-2.5 h-2.5" />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-2.5 h-2.5" />
                          <span>Private</span>
                        </>
                      )}
                    </span>

                    <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#ff6b2b]" />
                      <span>{formatDateRange(project.startDate, project.endDate)}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-stone-900 dark:text-white leading-snug group-hover:text-[#ff6b2b] transition-colors mt-4 tracking-tight">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 leading-relaxed mt-2 line-clamp-4">
                    {project.description}
                  </p>
                </div>

                {/* Card Footer: Author Profile & Links */}
                <div className="mt-6 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-xs select-none flex-shrink-0">
                      {project.author ? project.author.trim().charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-stone-800 dark:text-stone-200 leading-none block">
                        {project.author}
                      </span>
                      {project.isUserProject && (
                        <span className="text-[9px] font-black text-[#ff6b2b] font-mono leading-none mt-0.5 block">
                          You
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Link Icon Buttons */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.isUserProject && (
                      <div className="flex items-center gap-1.5 mr-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditProject(project);
                          }}
                          className="p-2 bg-stone-100 hover:bg-stone-250 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl transition-all border border-stone-200/30 active:scale-90 cursor-pointer hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b]"
                          title="Edit Project"
                        >
                          <PenSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="p-2 bg-stone-100 hover:bg-stone-250 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl transition-all border border-stone-200/30 active:scale-90 cursor-pointer hover:text-red-500 dark:hover:text-red-400"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <a
                      href={project.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-stone-100 hover:bg-[#ff6b2b] text-stone-700 hover:text-white dark:bg-stone-850 dark:hover:bg-[#ff6b2b] dark:text-stone-300 rounded-xl transition-all border border-stone-200/30 active:scale-90"
                      title="View Code Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {project.deployLink && (
                      <a
                        href={project.deployLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-stone-100 hover:bg-[#ff6b2b] text-stone-700 hover:text-white dark:bg-stone-850 dark:hover:bg-[#ff6b2b] dark:text-stone-300 rounded-xl transition-all border border-stone-200/30 active:scale-90"
                        title="Open Live Deployment"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NEW PROJECT POPUP MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
                    <Folder className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Add Your Project Showcase</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Fill the form below to publish your project. Private projects will only be visible to you inside "My Projects".
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Distributed Consensus Visualizer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      DESCRIPTION *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Give a short overview of what this project is, what technologies you used, and what algorithmic problem it solves..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* Links Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        CODE REPOSITORY LINK (GitHub/Kaggle) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/..."
                        value={codeLink}
                        onChange={(e) => setCodeLink(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        DEPLOYMENT LINK (Live URL)
                      </label>
                      <input
                        type="url"
                        placeholder="https://my-app.vercel.app"
                        value={deployLink}
                        onChange={(e) => setDeployLink(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        START DATE *
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        END DATE (Leave empty if ongoing)
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {/* Visibility Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      VISIBILITY STATUS
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 hover:border-[#ff6b2b] transition-all flex-1">
                        <input
                          type="radio"
                          name="status"
                          value="public"
                          checked={status === 'public'}
                          onChange={() => setStatus('public')}
                          className="accent-[#ff6b2b]"
                        />
                        <div>
                          <p className="text-xs font-black text-stone-900 dark:text-white leading-none">Public</p>
                          <p className="text-[10px] text-stone-400 mt-1">Showcase on "All Projects" with global visibility</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 hover:border-[#ff6b2b] transition-all flex-1">
                        <input
                          type="radio"
                          name="status"
                          value="private"
                          checked={status === 'private'}
                          onChange={() => setStatus('private')}
                          className="accent-[#ff6b2b]"
                        />
                        <div>
                          <p className="text-xs font-black text-stone-900 dark:text-white leading-none">Private</p>
                          <p className="text-[10px] text-stone-400 mt-1">Visible only to you inside "My Projects" tab</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-5 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] disabled:bg-stone-400 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <span>Publish Project</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PROJECT POPUP MODAL */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setEditingProject(null)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
                    <Folder className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Edit Project Showcase</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Update the fields below to modify your project listing.
                  </p>
                </div>

                <form onSubmit={handleUpdateProject} className="space-y-5">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      PROJECT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Distributed Consensus Visualizer"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      DESCRIPTION *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Give a short overview..."
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* Links Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        CODE REPOSITORY LINK (GitHub/Kaggle) *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/..."
                        value={editCodeLink}
                        onChange={(e) => setEditCodeLink(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        DEPLOYMENT LINK (Live URL)
                      </label>
                      <input
                        type="url"
                        placeholder="https://my-app.vercel.app"
                        value={editDeployLink}
                        onChange={(e) => setEditDeployLink(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        START DATE *
                      </label>
                      <input
                        type="date"
                        required
                        value={editStartDate}
                        onChange={(e) => setEditStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                        END DATE (Leave empty if ongoing)
                      </label>
                      <input
                        type="date"
                        value={editEndDate}
                        onChange={(e) => setEditEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                      />
                    </div>
                  </div>

                  {/* Visibility Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      VISIBILITY STATUS
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 hover:border-[#ff6b2b] transition-all flex-1">
                        <input
                          type="radio"
                          name="editStatus"
                          value="public"
                          checked={editStatus === 'public'}
                          onChange={() => setEditStatus('public')}
                          className="accent-[#ff6b2b]"
                        />
                        <div>
                          <p className="text-xs font-black text-stone-900 dark:text-white leading-none">Public</p>
                          <p className="text-[10px] text-stone-400 mt-1">Showcase on "All Projects" with global visibility</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-2xl border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 hover:border-[#ff6b2b] transition-all flex-1">
                        <input
                          type="radio"
                          name="editStatus"
                          value="private"
                          checked={editStatus === 'private'}
                          onChange={() => setEditStatus('private')}
                          className="accent-[#ff6b2b]"
                        />
                        <div>
                          <p className="text-xs font-black text-stone-900 dark:text-white leading-none">Private</p>
                          <p className="text-[10px] text-stone-400 mt-1">Visible only to you inside "My Projects" tab</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-5 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] disabled:bg-stone-400 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED PROJECT MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedProject.status === 'public'
                        ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-100/60 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {selectedProject.status === 'public' ? 'Public Showcase' : 'Private Project'}
                    </span>
                    <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateRange(selectedProject.startDate, selectedProject.endDate)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                    {selectedProject.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 font-semibold">
                    Published by: <span className="text-[#ff6b2b]">{selectedProject.author}</span>
                  </p>
                </div>

                {/* Project Description */}
                <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-line font-medium bg-[#faf9f6] dark:bg-stone-850/40 p-4 rounded-2xl border border-stone-150 dark:border-stone-800/40">
                  {selectedProject.description}
                </div>

                {/* Resource Links */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={selectedProject.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-stone-900 text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository Code</span>
                  </a>
                  {selectedProject.deployLink && (
                    <a
                      href={selectedProject.deployLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Open Live Demo</span>
                    </a>
                  )}
                </div>

                {/* Comments & Reactions Panel */}
                <CardInteractions itemType="project" itemId={selectedProject.id} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
