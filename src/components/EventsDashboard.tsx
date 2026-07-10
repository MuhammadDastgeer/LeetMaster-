import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Calendar, Clock, MapPin, Sparkles, Tag, 
  Pencil, Trash2, X, Info, Video, Users, Award, BookOpen
} from 'lucide-react';
import { Event } from '../types';
import CardInteractions from './CardInteractions';

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form fields state
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<'public' | 'private'>('public');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch all events from database
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle open Add Modal
  const openAddModal = () => {
    setTitle('');
    setDescription('');
    setDate('July 20, 2026');
    setTime('4:00 PM');
    setLocation('Google Meet (Virtual)');
    setCategory('Workshop');
    setStatus('public');
    setIsAddModalOpen(true);
  };

  // Handle open Edit Modal
  const openEditModal = (ev: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(ev);
    setTitle(ev.title);
    setDescription(ev.description);
    setDate(ev.date);
    setTime(ev.time);
    setLocation(ev.location);
    setCategory(ev.category);
    setStatus(ev.status || 'public');
  };

  // Create new Event
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date.trim() || !time.trim() || !location.trim() || !category.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          date,
          time,
          location,
          category,
          status,
          author: 'Dastgeer', // Default profile name
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop'
        })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => [data.event, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Update existing Event
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    if (!title.trim() || !description.trim() || !date.trim() || !time.trim() || !location.trim() || !category.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date, time, location, category, status })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? data.event : ev));
        setEditingEvent(null);
      }
    } catch (err) {
      console.error('Failed to update event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Event
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.filter(ev => ev.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Filtering Logic
  const displayedEvents = events.filter(ev => {
    // Tab filter
    if (activeSubTab === 'my' && !ev.isUserEvent) return false;

    // Search filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchesTitle = ev.title.toLowerCase().includes(q);
      const matchesDesc = ev.description.toLowerCase().includes(q);
      const matchesCategory = ev.category.toLowerCase().includes(q);
      const matchesLocation = ev.location.toLowerCase().includes(q);
      return matchesTitle || matchesDesc || matchesCategory || matchesLocation;
    }

    return true;
  });

  return (
    <div className="w-full space-y-8">
      
      {/* Header section with Add Event button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 dark:border-stone-800 pb-6 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
            Developer Events
          </h1>
          <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
            Join interactive live sessions, workshops, webinars, and study groups to speed up your learning
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-full shadow-lg hover:shadow-[#ff6b2b]/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-850 gap-6">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`pb-3.5 text-sm font-extrabold relative transition-all cursor-pointer ${
            activeSubTab === 'all'
              ? 'text-stone-900 dark:text-white'
              : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <span>All Events</span>
          {activeSubTab === 'all' && (
            <motion.div
              layoutId="activeSubTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff6b2b]"
            />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('my')}
          className={`pb-3.5 text-sm font-extrabold relative transition-all cursor-pointer ${
            activeSubTab === 'my'
              ? 'text-stone-900 dark:text-white'
              : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
          }`}
        >
          <span>My Events</span>
          {activeSubTab === 'my' && (
            <motion.div
              layoutId="activeSubTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff6b2b]"
            />
          )}
        </button>
      </div>

      {/* Info warning if empty in My Events */}
      {activeSubTab === 'my' && displayedEvents.length === 0 && !loading && (
        <div className="flex gap-3 bg-stone-100/60 dark:bg-stone-900/30 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-sm text-stone-600 dark:text-stone-450 items-start">
          <Info className="w-5 h-5 text-[#ff6b2b] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-stone-800 dark:text-stone-200">No events added by you yet</p>
            <p className="text-xs mt-1 text-stone-500 dark:text-stone-450">
              Click the **Add Event** button above to coordinate your own webinars, peer discussions, and Q&A code review sessions.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-stone-50 dark:bg-[#151412] border border-stone-200/70 dark:border-stone-850/80 rounded-3xl p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search events by title, description, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-medium"
          />
        </div>
      </div>

      {/* Grid of Events */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold font-mono">
            Fetching active events from local SQLite database...
          </p>
        </div>
      ) : displayedEvents.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl bg-stone-50/50 dark:bg-stone-950/20">
          <Calendar className="w-12 h-12 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
          <h3 className="text-stone-800 dark:text-stone-200 font-extrabold text-base">No events found</h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
            {activeSubTab === 'my' 
              ? 'You have not scheduled any events yet. Build one now using the "Add Event" button!'
              : 'No matching events found in the master calendar database.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="group relative p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-[#ff6b2b] hover:shadow-xl flex flex-col justify-between min-h-[300px] cursor-pointer"
            >
              {/* Subtle background graphics */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex flex-col h-full justify-between w-full space-y-4">
                
                {/* Meta details */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#ff6b2b] bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/25 rounded-full border border-[#ff6b2b]/15 w-max">
                        {ev.category}
                      </span>
                      {ev.isUserEvent && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-max ${
                          ev.status === 'private'
                            ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 border border-red-500/20'
                            : 'bg-green-500/10 text-green-500 dark:bg-green-500/20 border border-green-500/20'
                        }`}>
                          {ev.status === 'private' ? '🔒 Private' : '🌍 Public'}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 font-mono">
                      {ev.timestamp}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-stone-900 dark:text-white leading-snug group-hover:text-[#ff6b2b] transition-colors font-sans tracking-tight pt-1">
                    {ev.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                {/* Timing & Location block */}
                <div className="bg-stone-200/40 dark:bg-stone-900/40 border border-stone-200/20 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                    <Calendar className="w-4 h-4 text-[#ff6b2b] flex-shrink-0" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                    <Clock className="w-4 h-4 text-[#ff6b2b] flex-shrink-0" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                    <MapPin className="w-4 h-4 text-[#ff6b2b] flex-shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>

                {/* Footer and ownership action buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-stone-800/50">
                  
                  {/* Author Meta */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-xs select-none flex-shrink-0">
                      {ev.author ? ev.author.trim().charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-stone-800 dark:text-stone-250 leading-none">
                        {ev.author}
                      </p>
                      {ev.isUserEvent && (
                        <p className="text-[9px] font-bold text-[#ff6b2b] font-mono leading-none mt-1">
                          Organized by You
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit/Delete control keys */}
                  {ev.isUserEvent && (
                    <div className="flex items-center gap-1.5 z-25 relative">
                      <button
                        onClick={(e) => openEditModal(ev, e)}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 hover:dark:bg-stone-750 text-stone-600 dark:text-stone-300 rounded-lg border border-stone-200 dark:border-stone-700 transition-all cursor-pointer hover:text-[#ff6b2b] hover:dark:text-[#ff804a]"
                        title="Edit Event"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(ev.id, e)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 hover:dark:bg-rose-950/45 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-100/30 dark:border-rose-900/30 transition-all cursor-pointer hover:text-rose-700 hover:dark:text-rose-300"
                        title="Delete Event"
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

      {/* ADD NEW EVENT POPUP MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Schedule an Event</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Build a custom live webinar, Q&A, or mentoring class. Stored persistently in SQLite.
                  </p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      EVENT TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dynamic Programming & Advanced Tree Traversal"
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
                      rows={3}
                      placeholder="Detail the agenda, preparation materials, and expectations for the event..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        DATE
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. July 25, 2026"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>

                    {/* Time Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        TIME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5:00 PM"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        LOCATION / LINK
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Discord Stage, Zoom, Google Meet"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>

                    {/* Category Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        CATEGORY
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Workshop, Live Webinar, Study Group"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Visibility Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      VISIBILITY STATUS
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'public' | 'private')}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-850 dark:text-stone-200 font-semibold cursor-pointer"
                    >
                      <option value="public">🌍 Public (Visible to everyone)</option>
                      <option value="private">🔒 Private (Only visible in 'My Events')</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-5 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-750 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {submitting ? 'Creating...' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT EVENT POPUP MODAL */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingEvent(null)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Edit Event</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Modify the information for your event. Changes persist in SQLite database.
                  </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      EVENT TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dynamic Programming & Advanced Tree Traversal"
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
                      rows={3}
                      placeholder="Detail the agenda, preparation materials, and expectations for the event..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        DATE
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. July 25, 2026"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>

                    {/* Time Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        TIME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5:00 PM"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        LOCATION / LINK
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Discord Stage, Zoom, Google Meet"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>

                    {/* Category Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                        CATEGORY
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Workshop, Live Webinar, Study Group"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Visibility Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 tracking-wide uppercase">
                      VISIBILITY STATUS
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'public' | 'private')}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-850 dark:text-stone-200 font-semibold cursor-pointer"
                    >
                      <option value="public">🌍 Public (Visible to everyone)</option>
                      <option value="private">🔒 Private (Only visible in 'My Events')</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="px-5 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-750 text-xs font-black rounded-xl transition-all cursor-pointer"
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

      {/* DETAILED EVENT MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ff6b2b] bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/25 rounded-full border border-[#ff6b2b]/15">
                      {selectedEvent.category}
                    </span>
                    {selectedEvent.isUserEvent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100/50 dark:bg-orange-950/40 text-[#ff6b2b]">
                        {selectedEvent.status === 'private' ? '🔒 Private' : '🌍 Public'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1 font-semibold">
                    Organized by: <span className="text-[#ff6b2b]">{selectedEvent.author}</span>
                  </p>
                </div>

                {/* Timing & Location block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-200/40 dark:bg-stone-900/40 border border-stone-200/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                    <Calendar className="w-4.5 h-4.5 text-[#ff6b2b] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-normal">DATE</p>
                      <p>{selectedEvent.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                    <Clock className="w-4.5 h-4.5 text-[#ff6b2b] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-normal">TIME</p>
                      <p>{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                    <MapPin className="w-4.5 h-4.5 text-[#ff6b2b] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-normal">LOCATION</p>
                      <p className="truncate max-w-[150px]" title={selectedEvent.location}>{selectedEvent.location}</p>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-line font-medium bg-[#faf9f6] dark:bg-stone-850/40 p-4 rounded-2xl border border-stone-150 dark:border-stone-800/40">
                  {selectedEvent.description}
                </div>

                {/* Comments & Reactions Panel */}
                <CardInteractions itemType="event" itemId={selectedEvent.id} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
