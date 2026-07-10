import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Trophy, Calendar, User, X, Sparkles, Tag, 
  PenSquare, Trash2, Pencil, Info, Award, AlertCircle
} from 'lucide-react';
import { Hackathon } from '../types';
import CardInteractions from './CardInteractions';

interface HackathonsDashboardProps {
  isMyOnly: boolean;
}

export default function HackathonsDashboard({ isMyOnly }: HackathonsDashboardProps) {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);

  // Form fields state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [prizes, setPrizes] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [status, setStatus] = useState<'public' | 'private'>('public');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch all hackathons from database
  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hackathons');
      const data = await res.json();
      if (data.success) {
        setHackathons(data.hackathons);
      }
    } catch (err) {
      console.error('Failed to fetch hackathons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  // Handle open Add Modal
  const openAddModal = () => {
    setTitle('');
    setDescription('');
    setTags('Web Dev, React, Tailwind');
    setPrizes('$1,000 Cash Prize');
    setDeadline('August 31, 2026');
    setStatus('public');
    setIsAddModalOpen(true);
  };

  // Handle open Edit Modal
  const openEditModal = (hack: Hackathon, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHackathon(hack);
    setTitle(hack.title);
    setDescription(hack.description);
    setTags(hack.tags);
    setPrizes(hack.prizes);
    setDeadline(hack.deadline);
    setStatus(hack.status || 'public');
  };

  // Create new Hackathon
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !tags.trim() || !prizes.trim() || !deadline.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          tags,
          prizes,
          deadline,
          status,
          author: 'Dastgeer', // Default profile name
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop'
        })
      });
      const data = await res.json();
      if (data.success) {
        setHackathons(prev => [data.hackathon, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create hackathon:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update existing Hackathon
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHackathon) return;
    if (!title.trim() || !description.trim() || !tags.trim() || !prizes.trim() || !deadline.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/hackathons/${editingHackathon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags, prizes, deadline, status })
      });
      const data = await res.json();
      if (data.success) {
        setHackathons(prev => prev.map(h => h.id === editingHackathon.id ? data.hackathon : h));
        setEditingHackathon(null);
      }
    } catch (err) {
      console.error('Failed to update hackathon:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Hackathon
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this hackathon?')) return;

    try {
      const res = await fetch(`/api/hackathons/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setHackathons(prev => prev.filter(h => h.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete hackathon:', err);
    }
  };

  // Filtering & Sorting logic
  const displayedHackathons = hackathons.filter(hack => {
    // Filter by mode
    if (isMyOnly && !hack.isUserHackathon) return false;

    // Filter by search
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchesTitle = hack.title.toLowerCase().includes(q);
      const matchesDesc = hack.description.toLowerCase().includes(q);
      const matchesTags = hack.tags.toLowerCase().includes(q);
      const matchesPrizes = hack.prizes.toLowerCase().includes(q);
      const matchesAuthor = hack.author.toLowerCase().includes(q);
      return matchesTitle || matchesDesc || matchesTags || matchesPrizes || matchesAuthor;
    }

    return true;
  });

  return (
    <div className="w-full space-y-8">
      
      {/* Page Header section mirroring DSA Sheets exactly */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 dark:border-stone-800 pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
            {isMyOnly ? 'My Hackathons' : 'Developer Hackathons'}
          </h1>
          <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
            {isMyOnly 
              ? 'Manage hackathons created by you and inspect candidate project submissions'
              : 'Compete in open programming challenges, build real prototypes, and win prizes'
            }
          </p>
        </div>

        {/* Action Button & Database indicator */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {isMyOnly && (
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-full shadow-lg hover:shadow-[#ff6b2b]/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hackathon</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Warning Bar if empty in My Hackathons */}
      {isMyOnly && displayedHackathons.length === 0 && !loading && (
        <div className="flex gap-3 bg-stone-100/60 dark:bg-stone-900/30 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-sm text-stone-600 dark:text-stone-400 items-start">
          <Info className="w-5 h-5 text-[#ff6b2b] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-stone-800 dark:text-stone-200">No hackathons built yet</p>
            <p className="text-xs mt-1 text-stone-500 dark:text-stone-400">
              Click the **Add Hackathon** button on the top-right of this tab to build your own custom hackathon challenges. They will immediately become visible to other participants in the main dashboard!
            </p>
          </div>
        </div>
      )}

      {/* Search Filter Bar */}
      <div className="bg-stone-50 dark:bg-[#151412] border border-stone-200/70 dark:border-stone-800/80 rounded-3xl p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search hackathons by title, description, prizes, or technical tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Main Grid view of cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold font-mono">
            Fetching hackathons from local SQLite database...
          </p>
        </div>
      ) : displayedHackathons.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl bg-stone-50/50 dark:bg-stone-950/20">
          <Award className="w-12 h-12 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-stone-800 dark:text-stone-200 font-extrabold text-base">No hackathons found</h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
            We couldn't find any hackathons. {isMyOnly ? 'Create your first hackathon using the "Add Hackathon" button!' : 'Try resetting search query parameters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHackathons.map((hack) => (
            <div
              key={hack.id}
              onClick={() => setSelectedHackathon(hack)}
              className="group relative p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-[#ff6b2b] hover:shadow-xl flex flex-col justify-between min-h-[290px] cursor-pointer"
            >
              {/* Inner Subtle Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex flex-col h-full justify-between w-full space-y-4">
                
                {/* Top Row: Tags & Deadline */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex flex-col gap-1.5 max-w-[70%]">
                      <div className="flex flex-wrap gap-1.5">
                        {hack.tags.split(',').map((tagStr, i) => (
                          <span 
                            key={i} 
                            className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#ff6b2b] bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/25 rounded-full border border-[#ff6b2b]/15 whitespace-nowrap"
                          >
                            {tagStr.trim()}
                          </span>
                        ))}
                      </div>
                      {hack.isUserHackathon && (
                        <div className="flex">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            hack.status === 'private'
                              ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 border border-red-500/20'
                              : 'bg-green-500/10 text-green-500 dark:bg-green-500/20 border border-green-500/20'
                          }`}>
                            {hack.status === 'private' ? '🔒 Private' : '🌍 Public'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Deadline indicator with Calendar */}
                    <div className="flex items-center gap-1 text-[11px] font-bold text-stone-400 dark:text-stone-500 font-mono flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-[#ff6b2b]" />
                      <span>{hack.deadline}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-stone-900 dark:text-white leading-snug group-hover:text-[#ff6b2b] transition-colors font-sans tracking-tight pt-1">
                    {hack.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 line-clamp-3 leading-relaxed">
                    {hack.description}
                  </p>
                </div>

                {/* Prizes and Awards Badge */}
                <div className="bg-amber-100/40 dark:bg-amber-950/20 border border-amber-200/20 rounded-2xl p-3 flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-amber-500 fill-amber-500/10 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest leading-none">prizes & awards</p>
                    <p className="text-xs font-black text-stone-800 dark:text-amber-400 font-mono leading-tight">{hack.prizes}</p>
                  </div>
                </div>

                {/* Footer: User profile & Action buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-stone-800/50">
                  
                  {/* Author Meta */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-xs select-none flex-shrink-0">
                      {hack.author ? hack.author.trim().charAt(0).toUpperCase() : 'H'}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-stone-800 dark:text-stone-200 leading-none">
                        {hack.author}
                      </p>
                      {hack.isUserHackathon && (
                        <p className="text-[9px] font-bold text-[#ff6b2b] font-mono leading-none mt-1">
                          Created by You
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit/Delete controls (Only visible to the creator) */}
                  {hack.isUserHackathon && (
                    <div className="flex items-center gap-1.5 z-25 relative">
                      <button
                        onClick={(e) => openEditModal(hack, e)}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 hover:dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg border border-stone-200 dark:border-stone-700 transition-all cursor-pointer hover:text-[#ff6b2b] hover:dark:text-[#ff804a]"
                        title="Edit Hackathon"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(hack.id, e)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 hover:dark:bg-rose-950/45 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-100/30 dark:border-rose-900/30 transition-all cursor-pointer hover:text-rose-700 hover:dark:text-rose-300"
                        title="Delete Hackathon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD NEW HACKATHON POPUP MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-700 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Create a Hackathon</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Configure a brand new challenge for developers. Stored persistently in SQLite.
                  </p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      HACKATHON TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NextGen Web & GenAI Hackathon"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      DESCRIPTION
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Summarize the theme, rubrics, rules, and track details of this hackathon..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  {/* Tags (Comma-separated) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      TECHNICAL TAGS (Comma Separated)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Web Dev, React, Generative AI"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Prizes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      PRIZES & REWARDS
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $2,000 Cash Prize + Swag kits"
                      value={prizes}
                      onChange={(e) => setPrizes(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Deadline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      SUBMISSION DEADLINE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. August 15, 2026"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Visibility Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      VISIBILITY STATUS
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'public' | 'private')}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-stone-200 font-semibold cursor-pointer"
                    >
                      <option value="public">🌍 Public (Visible to everyone)</option>
                      <option value="private">🔒 Private (Only visible in 'My Hackathons')</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-5 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {submitting ? 'Creating...' : 'Create Hackathon'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT HACKATHON POPUP MODAL */}
      <AnimatePresence>
        {editingHackathon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setEditingHackathon(null)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-700 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Edit Hackathon</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Modify properties of your hackathon. Stored persistently in SQLite.
                  </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      HACKATHON TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NextGen Web & GenAI Hackathon"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      DESCRIPTION
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Summarize the theme, rubrics, rules, and track details of this hackathon..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  {/* Tags (Comma-separated) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      TECHNICAL TAGS (Comma Separated)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Web Dev, React, Generative AI"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Prizes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      PRIZES & REWARDS
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $2,000 Cash Prize + Swag kits"
                      value={prizes}
                      onChange={(e) => setPrizes(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Deadline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      SUBMISSION DEADLINE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. August 15, 2026"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Visibility Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      VISIBILITY STATUS
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'public' | 'private')}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-stone-200 font-semibold cursor-pointer"
                    >
                      <option value="public">🌍 Public (Visible to everyone)</option>
                      <option value="private">🔒 Private (Only visible in 'My Hackathons')</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingHackathon(null)}
                      className="px-5 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED HACKATHON MODAL */}
      <AnimatePresence>
        {selectedHackathon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedHackathon(null)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-700 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedHackathon.tags.split(',').map((tagStr, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ff6b2b] bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/25 rounded-full border border-[#ff6b2b]/15"
                      >
                        {tagStr.trim()}
                      </span>
                    ))}
                    {selectedHackathon.isUserHackathon && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100/50 dark:bg-orange-950/40 text-[#ff6b2b]">
                        {selectedHackathon.status === 'private' ? '🔒 Private' : '🌍 Public'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                    {selectedHackathon.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 font-semibold">
                    Posted by: <span className="text-[#ff6b2b]">{selectedHackathon.author}</span>
                  </p>
                </div>

                {/* Info Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-amber-100/40 dark:bg-amber-950/20 border border-amber-200/20 rounded-2xl p-4 flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/10 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider leading-none">prizes & awards</p>
                      <p className="text-xs font-black text-stone-800 dark:text-amber-400 font-mono mt-1">{selectedHackathon.prizes}</p>
                    </div>
                  </div>

                  <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200/20 rounded-2xl p-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#ff6b2b] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider leading-none">submission deadline</p>
                      <p className="text-xs font-black text-stone-800 dark:text-stone-300 font-mono mt-1">{selectedHackathon.deadline}</p>
                    </div>
                  </div>
                </div>

                {/* Hackathon Description */}
                <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-line font-medium bg-[#faf9f6] dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-200 dark:border-stone-800/40">
                  {selectedHackathon.description}
                </div>

                {/* Comments & Reactions Panel */}
                <CardInteractions itemType="hackathon" itemId={selectedHackathon.id} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
