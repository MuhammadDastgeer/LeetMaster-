import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, ThumbsUp, Calendar, User, ArrowLeft, X, 
  Sparkles, Tag, ArrowUpRight, PenSquare, Filter, BookOpen, ChevronRight, Trash2, Lock, Globe
} from 'lucide-react';
import { Blog } from '../types';
import CardInteractions from './CardInteractions';

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // New Blog form state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Web Development');
  const [newContent, setNewContent] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'public' | 'private'>('public');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Edit Blog state
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('Web Development');
  const [editContent, setEditContent] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'public' | 'private'>('public');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Selected blog full-view state
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Available categories for blogging
  const CATEGORIES = [
    'Web Development',
    'Programming Languages',
    'Database',
    'Backend/Frameworks',
    'AI & Data Science',
    'DSA (Data Structures & Algorithms)',
    'Other Topics'
  ];

  // Fetch blogs on load
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle like a blog
  const handleLike = async (blogId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.map(b => b.id === blogId ? { ...b, likes: data.likes } : b));
        if (selectedBlog && selectedBlog.id === blogId) {
          setSelectedBlog(prev => prev ? { ...prev, likes: data.likes } : null);
        }
      }
    } catch (err) {
      console.error('Failed to like blog:', err);
    }
  };

  // Handle publishing a new blog
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newCategory) return;

    try {
      setIsPublishing(true);
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          status: newStatus,
          author: 'Dastgeer', // Default profile name
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop'
        })
      });
      const data = await res.json();
      if (data.success) {
        // Prepend the new blog to our list
        setBlogs(prev => [data.blog, ...prev]);
        // Reset form & close modal
        setNewTitle('');
        setNewContent('');
        setNewCategory('Web Development');
        setNewStatus('public');
        setIsWriteModalOpen(false);
        // Switch to "My Blogs" to see the newly written blog!
        setActiveTab('my');
      }
    } catch (err) {
      console.error('Failed to publish blog:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle delete a blog
  const handleDeleteBlog = async (blogId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.filter(b => b.id !== blogId));
        if (selectedBlog && selectedBlog.id === blogId) {
          setSelectedBlog(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  // Start editing a blog
  const startEditBlog = (blog: Blog, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditCategory(blog.category);
    setEditContent(blog.content);
    setEditStatus(blog.status || 'public');
  };

  // Handle editing/updating blog
  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editTitle.trim() || !editContent.trim() || !editCategory) return;

    try {
      setIsEditing(true);
      const res = await fetch(`/api/blogs/${editingBlog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
          status: editStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(prev => prev.map(b => b.id === editingBlog.id ? data.blog : b));
        if (selectedBlog && selectedBlog.id === editingBlog.id) {
          setSelectedBlog(data.blog);
        }
        setEditingBlog(null);
      }
    } catch (err) {
      console.error('Failed to update blog:', err);
    } finally {
      setIsEditing(false);
    }
  };

  // Filtering & Sorting logic
  const filteredBlogs = blogs
    .filter(blog => {
      // Tab filter: 'my' shows blogs where isUserBlog is true
      if (activeTab === 'my' && !blog.isUserBlog) return false;
      
      // If we are on 'all' tab, do not show private posts
      if (activeTab === 'all' && blog.status === 'private') return false;

      // Category filter
      if (selectedCategory !== 'All' && blog.category !== selectedCategory) return false;

      // Search text filter (title, category, content, or author)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = blog.title.toLowerCase().includes(query);
        const matchesContent = blog.content.toLowerCase().includes(query);
        const matchesAuthor = blog.author.toLowerCase().includes(query);
        const matchesCategory = blog.category.toLowerCase().includes(query);
        return matchesTitle || matchesContent || matchesAuthor || matchesCategory;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      // Default to sorting by date / id or timestamp
      return b.id.localeCompare(a.id);
    });

  // Render text blocks cleanly
  const renderContentPreview = (content: string) => {
    // Strips out headers and bold indicators for excerpt rendering
    const plainText = content
      .replace(/[#*`_]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    return plainText;
  };

  return (
    <div className="w-full space-y-8">
      <AnimatePresence mode="wait">
        {!selectedBlog ? (
          <motion.div
            key="blog-list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Header section mirroring DSA Sheets */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 dark:border-stone-800 pb-6 gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
                  Developer Blogs
                </h1>
                <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                  Share insights, programming tricks, and full-stack learnings with your peers
                </p>
              </div>

              {/* Top-Right write button and decorative tag */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(true)}
                  className="px-5 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-full shadow-lg hover:shadow-[#ff6b2b]/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write a Blog</span>
                </button>
              </div>
            </div>

            {/* Custom 2-Tab Navigation (My Blogs vs All Blogs) */}
            <div className="flex border-b border-stone-250 dark:border-stone-800/80 p-1 bg-stone-100/50 dark:bg-stone-950/30 rounded-2xl max-w-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-stone-900 text-[#ff6b2b] shadow-sm border border-stone-200/50 dark:border-stone-800/50'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-450 dark:hover:text-stone-200'
                }`}
              >
                All Blogs
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all cursor-pointer ${
                  activeTab === 'my'
                    ? 'bg-white dark:bg-stone-900 text-[#ff6b2b] shadow-sm border border-stone-200/50 dark:border-stone-800/50'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-450 dark:hover:text-stone-200'
                }`}
              >
                My Blogs
              </button>
            </div>

            {/* Filtering Control Bar */}
            <div className="bg-stone-50 dark:bg-[#151412] border border-stone-200/70 dark:border-stone-850/80 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-extrabold text-xs tracking-wider uppercase">
                <Filter className="w-3.5 h-3.5 text-[#ff6b2b]" />
                <span>Filter & Search Posts</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search Bar */}
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search titles, contents, categories, authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all"
                  />
                </div>

                {/* Category Dropdown Filter */}
                <div className="md:col-span-4 relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-800 dark:text-stone-200 font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    ▼
                  </div>
                </div>

                {/* Sorting Select */}
                <div className="md:col-span-3 relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-800 dark:text-stone-200 font-medium transition-all appearance-none cursor-pointer"
                  >
                    <option value="latest">Sort by Latest</option>
                    <option value="popular">Sort by Most Liked</option>
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
                  Loading articles...
                </p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl bg-stone-50/50 dark:bg-stone-950/20">
                <BookOpen className="w-12 h-12 text-stone-400 dark:text-stone-600 mx-auto mb-3" />
                <h3 className="text-stone-800 dark:text-stone-200 font-extrabold text-base">No blogs found</h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 max-w-md mx-auto">
                  We couldn't find any blogs matching your active filters. Try resetting search parameters or write your first blog!
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setActiveTab('all');
                  }}
                  className="mt-4 px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Card Grid - Designing exactly like DSA Sheets cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    onClick={() => setSelectedBlog(blog)}
                    className="group relative text-left p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#ff6b2b] hover:shadow-xl cursor-pointer block focus:outline-none h-64 flex flex-col justify-between"
                  >
                    {/* Inner Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                      
                      {/* Top bar: Category, Status, Actions, and Date */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#ff6b2b] bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/20 rounded-full border border-[#ff6b2b]/15">
                              {blog.category}
                            </span>
                            {blog.isUserBlog && (
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                blog.status === 'private'
                                  ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 border border-red-500/20'
                                  : 'bg-green-500/10 text-green-500 dark:bg-green-500/20 border border-green-500/20'
                              }`}>
                                {blog.status === 'private' ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                                {blog.status === 'private' ? 'Private' : 'Public'}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {blog.isUserBlog && (
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => startEditBlog(blog, e)}
                                  className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-all hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] cursor-pointer"
                                  title="Edit Post"
                                >
                                  <PenSquare className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteBlog(blog.id, e)}
                                  className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-all hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                                  title="Delete Post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 font-mono">
                              {blog.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-black text-stone-900 dark:text-white leading-snug group-hover:text-[#ff6b2b] transition-colors line-clamp-2 mt-3.5 font-sans tracking-tight">
                          {blog.title}
                        </h3>

                        {/* Content Excerpt */}
                        <p className="text-xs font-medium text-stone-500 dark:text-stone-400 line-clamp-3 mt-2 leading-relaxed">
                          {renderContentPreview(blog.content)}
                        </p>
                      </div>

                      {/* Footer: Author info & Likes counter */}
                      <div className="flex items-end justify-between pt-4 border-t border-stone-200/50 dark:border-stone-800/50 mt-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-xs select-none flex-shrink-0">
                            {blog.author ? blog.author.trim().charAt(0).toUpperCase() : 'B'}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-stone-800 dark:text-stone-250 leading-none">
                              {blog.author}
                            </p>
                            {blog.isUserBlog && (
                              <p className="text-[9px] font-bold text-[#ff6b2b] font-mono leading-none mt-1">
                                Written by You
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Likes indicator */}
                        <button
                          type="button"
                          onClick={(e) => handleLike(blog.id, e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100/60 hover:bg-[#ff6b2b] dark:bg-orange-950/40 hover:dark:bg-[#ff6b2b] text-[#ff6b2b] hover:text-white transition-all duration-300 group/btn border border-orange-100/30 active:scale-90"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[11px] font-black font-mono">
                            {blog.likes}
                          </span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* DETAILED SINGLE BLOG ARTICLE VIEW (With Markdown-friendly visual spacing) */
          <motion.div
            key="blog-detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Back button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 rounded-2xl text-stone-600 dark:text-stone-300 text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blogs</span>
            </button>

            {/* Article Canvas */}
            <article className="bg-white dark:bg-stone-900 border border-stone-200/95 dark:border-stone-800/90 rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden space-y-6">
              <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.02] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 text-xs font-black uppercase tracking-wider text-[#ff6b2b] bg-[#ff6b2b]/10 rounded-full">
                    {selectedBlog.category}
                  </span>
                  <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedBlog.timestamp}
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white leading-tight tracking-tight font-sans">
                  {selectedBlog.title}
                </h1>

                {/* Author Card & Likes panel */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-100 dark:border-stone-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-sm select-none flex-shrink-0">
                      {selectedBlog.author ? selectedBlog.author.trim().charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-stone-900 dark:text-white leading-none">
                        {selectedBlog.author}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                        {selectedBlog.isUserBlog ? 'Guest Writer (You)' : 'LeetMaster Team'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(selectedBlog.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-100/80 dark:bg-orange-950/40 text-[#ff6b2b] rounded-2xl font-black text-xs hover:bg-[#ff6b2b] hover:text-white hover:dark:bg-[#ff6b2b] transition-all duration-300 border border-orange-150/20 active:scale-90 shadow-sm"
                    >
                      <ThumbsUp className="w-4 h-4 fill-current" />
                      <span>{selectedBlog.likes} Likes</span>
                    </button>
                  </div>
                </div>

                {/* Article Body Content (Formatted elegantly) */}
                <div className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium space-y-4 max-w-none">
                  {selectedBlog.content}
                </div>

                {/* Card Interactions: Comments & Reactions */}
                <CardInteractions itemType="blog" itemId={selectedBlog.id} />

              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE NEW BLOG POPUP MODAL */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <PenSquare className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Write a New Blog Post</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Your post will be published and added immediately to "My Blogs" and "All Blogs".
                  </p>
                </div>

                <form onSubmit={handlePublish} className="space-y-5">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      POST TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5 Common Python Gotchas to Avoid in Production"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      CATEGORY
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-800 dark:text-stone-250 font-semibold transition-all cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      VISIBILITY STATUS
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as 'public' | 'private')}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-850 dark:text-stone-200 font-semibold transition-all cursor-pointer"
                    >
                      <option value="public">🌍 Public (Visible to everyone)</option>
                      <option value="private">🔒 Private (Only visible in 'My Blogs')</option>
                    </select>
                  </div>

                  {/* Blog Body Content */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      BLOG CONTENT (Markdown Supported)
                    </label>
                    <textarea
                      required
                      rows={8}
                      placeholder="Share your technical knowledge or problem-solving approaches... Write full markdown-friendly paragraphs."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsWriteModalOpen(false)}
                      className="px-5 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPublishing}
                      className="px-6 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] disabled:bg-stone-400 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isPublishing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <span>Publish Post</span>
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

      {/* EDIT BLOG POPUP MODAL */}
      <AnimatePresence>
        {editingBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setEditingBlog(null)}
                className="absolute right-5 top-5 p-2 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200 hover:dark:bg-stone-750 transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <PenSquare className="w-5 h-5 text-[#ff6b2b]" />
                    <span>Edit Blog Post</span>
                  </h2>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                    Update the fields below to modify your blog post.
                  </p>
                </div>

                <form onSubmit={handleUpdateBlog} className="space-y-5">
                  {/* Title Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      POST TITLE
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5 Common Python Gotchas to Avoid in Production"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all font-semibold"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      CATEGORY
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-800 dark:text-stone-250 font-semibold transition-all cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      VISIBILITY STATUS
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as 'public' | 'private')}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-850 dark:text-stone-200 font-semibold transition-all cursor-pointer"
                    >
                      <option value="public">🌍 Public (Visible to everyone)</option>
                      <option value="private">🔒 Private (Only visible in 'My Blogs')</option>
                    </select>
                  </div>

                  {/* Blog Body Content */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-700 dark:text-stone-300 font-sans tracking-wide">
                      BLOG CONTENT (Markdown Supported)
                    </label>
                    <textarea
                      required
                      rows={8}
                      placeholder="Share your technical knowledge or problem-solving approaches..."
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] text-stone-900 dark:text-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingBlog(null)}
                      className="px-5 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-xs font-black rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isEditing}
                      className="px-6 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] disabled:bg-stone-400 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {isEditing ? (
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
    </div>
  );
}
