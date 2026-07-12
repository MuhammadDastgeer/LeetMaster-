import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Heart, ThumbsUp, Flame, Sparkles, Plus, Search, 
  Send, User, Clock, ChevronDown, Filter, MessageCircle, Share2, 
  Check, X, ThumbsDown, BookOpen, MessageSquareCode
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface DiscussionPost {
  id: string;
  title: string;
  category: string;
  author: string;
  avatar: string;
  role: string;
  timestamp: string;
  content: string;
  reactions: {
    thumbsUp: number;
    heart: number;
    fire: number;
    insightful: number;
  };
  userReactions: {
    thumbsUp: boolean;
    heart: boolean;
    fire: boolean;
    insightful: boolean;
  };
  comments: Comment[];
  tags: string[];
}

const DEFAULT_POSTS: DiscussionPost[] = [
  {
    id: 'post-1',
    title: 'Python vs Javascript: Best Language for Backend Development in 2026?',
    category: 'Backend Development',
    author: 'Dastgeer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop',
    role: 'Instructor',
    timestamp: '2 hours ago',
    content: 'With Node.js having amazing ecosystem and Python having superior AI/ML libraries, which one do you prefer for building scalable enterprise backend APIs? I personally lean towards FastAPI for performance and Node.js for heavy asynchronous payloads.',
    reactions: { thumbsUp: 18, heart: 12, fire: 8, insightful: 15 },
    userReactions: { thumbsUp: false, heart: false, fire: false, insightful: false },
    tags: ['Python', 'NodeJS', 'FastAPI', 'Backend'],
    comments: [
      {
        id: 'c1',
        author: 'Shivam',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
        text: 'FastAPI combined with Pydantic is a lifesaver. Hard to go back to Javascript boilerplate after using that.',
        timestamp: '1 hour ago'
      },
      {
        id: 'c2',
        author: 'Kunal',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop',
        text: 'Javascript/TypeScript for the win! Single language fullstack development speeds up startups like crazy.',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'How to practice DSA consistently without feeling burned out?',
    category: 'DSA Prep',
    author: 'Anirudh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&auto=format&fit=crop',
    role: 'Mentor',
    timestamp: '5 hours ago',
    content: "Doing 10 problems a day is a recipe for burnout. It is better to focus on 1-2 patterns (like Two Pointers, Sliding Window) deeply per week. Quality over quantity always wins interviews.",
    reactions: { thumbsUp: 34, heart: 22, fire: 19, insightful: 28 },
    userReactions: { thumbsUp: false, heart: false, fire: false, insightful: false },
    tags: ['LeetCode', 'Interview', 'Consistency', 'StudyTips'],
    comments: [
      {
        id: 'c3',
        author: 'Ayesha',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop',
        text: 'This advice changed my preparation completely. Sticking to one pattern per week made me enjoy coding again!',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Why relational SQL databases are still king over NoSQL for most SaaS apps',
    category: 'Databases',
    author: 'Riya Sharma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop',
    role: 'SDE-2 at Microsoft',
    timestamp: '1 day ago',
    content: "ACID transactions, structured schemas, and robust JOIN queries are essential for SaaS financials and permissions. Starting with MongoDB often results in writing simulated join logic in application code.",
    reactions: { thumbsUp: 29, heart: 14, fire: 10, insightful: 22 },
    userReactions: { thumbsUp: false, heart: false, fire: false, insightful: false },
    tags: ['SQL', 'PostgreSQL', 'NoSQL', 'DatabaseDesign'],
    comments: []
  }
];

const CATEGORIES = [
  'All Discussions',
  'General Discussion',
  'Backend Development',
  'Frontend Development',
  'DSA Prep',
  'Databases',
  'AI & Machine Learning',
  'Career Guidance'
];

export default function Discuss({ darkMode }: { darkMode: boolean }) {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Discussions');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General Discussion');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState('Dastgeer');
  const [userAvatar, setUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop');

  // Load posts from localStorage or seed
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('leetmaster_user_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.avatar) setUserAvatar(parsed.avatar);
      }
    } catch (e) {
      console.error(e);
    }

    const savedPosts = localStorage.getItem('leetmaster_discussions');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts(DEFAULT_POSTS);
      }
    } else {
      setPosts(DEFAULT_POSTS);
      localStorage.setItem('leetmaster_discussions', JSON.stringify(DEFAULT_POSTS));
    }
  }, []);

  const savePosts = (updatedPosts: DiscussionPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('leetmaster_discussions', JSON.stringify(updatedPosts));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      author: userName,
      avatar: userAvatar,
      role: 'Student Member',
      timestamp: 'Just now',
      content: newContent,
      reactions: { thumbsUp: 1, heart: 0, fire: 0, insightful: 0 },
      userReactions: { thumbsUp: true, heart: false, fire: false, insightful: false },
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
      comments: []
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Reset fields
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setNewCategory('General Discussion');
    setIsNewPostOpen(false);
  };

  const handleReaction = (postId: string, reactionType: keyof DiscussionPost['reactions'], e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const updated = posts.map(post => {
      if (post.id === postId) {
        const hasReacted = post.userReactions[reactionType];
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: hasReacted 
              ? Math.max(0, post.reactions[reactionType] - 1)
              : post.reactions[reactionType] + 1
          },
          userReactions: {
            ...post.userReactions,
            [reactionType]: !hasReacted
          }
        };
      }
      return post;
    });
    savePosts(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: userName,
      avatar: userAvatar,
      text: text.trim(),
      timestamp: 'Just now'
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    savePosts(updated);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Discussions' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200/60 dark:border-stone-850 p-4 sm:p-6 lg:p-8 min-h-[80vh]">
      
      {selectedPost ? (
        /* Selected Discussion Details View */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Back Action Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200/60 dark:border-stone-850">
            <button
              onClick={() => setSelectedPostId(null)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-800 shadow-sm transition-all cursor-pointer"
            >
              &larr; Back to Board
            </button>
            <div className="text-xs text-stone-400 font-mono">
              Post Details
            </div>
          </div>

          {/* Full Post Layout */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-xl p-5 sm:p-6 shadow-sm">
            {/* Header info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedPost.avatar}
                alt={selectedPost.author}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border border-stone-200 dark:border-stone-800 object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                    {selectedPost.author}
                  </span>
                  {selectedPost.role && (
                    <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[9px] font-semibold text-stone-500 dark:text-stone-400 uppercase">
                      {selectedPost.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedPost.timestamp}</span>
                  <span>•</span>
                  <span className="text-[#ff6b2b] font-medium">{selectedPost.category}</span>
                </div>
              </div>
            </div>

            {/* Title & Body */}
            <h1 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white leading-snug tracking-tight mb-4">
              {selectedPost.title}
            </h1>
            <p className="text-stone-800 dark:text-stone-250 text-sm sm:text-base whitespace-pre-line leading-relaxed mb-6">
              {selectedPost.content}
            </p>

            {/* Tags */}
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selectedPost.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-stone-50 dark:bg-stone-950 text-stone-500 dark:text-stone-400 rounded-md text-xs font-mono border border-stone-200/60 dark:border-stone-800/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reactions in Details */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-850">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mr-2">Reactions:</span>
              
              <button
                onClick={(e) => handleReaction(selectedPost.id, 'thumbsUp', e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  selectedPost.userReactions.thumbsUp
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200'
                    : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{selectedPost.reactions.thumbsUp}</span>
              </button>

              <button
                onClick={(e) => handleReaction(selectedPost.id, 'heart', e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  selectedPost.userReactions.heart
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-200'
                    : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>{selectedPost.reactions.heart}</span>
              </button>

              <button
                onClick={(e) => handleReaction(selectedPost.id, 'fire', e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  selectedPost.userReactions.fire
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200'
                    : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>{selectedPost.reactions.fire}</span>
              </button>

              <button
                onClick={(e) => handleReaction(selectedPost.id, 'insightful', e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  selectedPost.userReactions.insightful
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200'
                    : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>{selectedPost.reactions.insightful}</span>
              </button>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm sm:text-base font-black text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#ff6b2b]" />
              Discussion Comments ({selectedPost.comments.length})
            </h3>

            {/* Comments list */}
            {selectedPost.comments.length > 0 ? (
              <div className="space-y-3.5">
                {selectedPost.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 bg-stone-50 dark:bg-stone-950 p-3.5 rounded-lg border border-stone-150 dark:border-stone-850/80">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-stone-200 dark:border-stone-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-100">
                          {comment.author}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-400 text-xs sm:text-sm italic">
                No comments yet. Write a polite comment below to start the conversation!
              </div>
            )}

            {/* Comment input form */}
            <div className="flex gap-3 items-start pt-3 border-t border-stone-100 dark:border-stone-850">
              <img
                src={userAvatar}
                alt="Me"
                referrerPolicy="no-referrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-stone-200 dark:border-stone-800 mt-1"
              />
              <div className="flex-1 relative">
                <textarea
                  value={commentInputs[selectedPost.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [selectedPost.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(selectedPost.id);
                    }
                  }}
                  rows={2}
                  placeholder="Type your reply here... (Press Enter to post)"
                  className="w-full pl-3.5 pr-12 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-250 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b] resize-none"
                />
                <button
                  onClick={() => handleAddComment(selectedPost.id)}
                  className="absolute right-3.5 bottom-3.5 p-1.5 bg-[#ff6b2b] hover:bg-[#e0561a] active:scale-95 text-white rounded-md transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Discussion Board List View */
        <>
          {/* Top Welcome Panel */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-[#ff6b2b]/10 to-orange-500/5 dark:from-[#ff6b2b]/10 dark:to-[#ff6b2b]/0 p-6 rounded-2xl border border-[#ff6b2b]/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b2b]/10 text-[#ff6b2b] text-[10px] font-bold tracking-wider uppercase">
                  Community Board
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  {posts.length} Active Posts
                </span>
              </div>
              <h2 className="text-2xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
                Discuss Anything Tech
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-xl">
                Share ideas, ask programming questions, review DSA patterns, or engage in healthy discussions with other fellow coders!
              </p>
            </div>
            
            {/* Start Discussion Trigger Button */}
            <button
              onClick={() => setIsNewPostOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] active:scale-95 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Discussion</span>
            </button>
          </div>

          {/* Filter and Search Bar Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200/60 dark:border-stone-800">
            
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discussion or tags..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b]"
              />
            </div>

            {/* Category Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none scroll-smooth">
              <Filter className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 hidden md:inline" />
              <div className="flex gap-1.5 flex-nowrap">
                {CATEGORIES.slice(0, 5).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#ff6b2b] text-white shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {CATEGORIES.length > 5 && (
                  <select
                    value={CATEGORIES.includes(selectedCategory) ? selectedCategory : 'More'}
                    onChange={(e) => {
                      if (e.target.value !== 'More') {
                        setSelectedCategory(e.target.value);
                      }
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium bg-stone-50 dark:bg-stone-950 border-none focus:outline-none cursor-pointer ${
                      !CATEGORIES.slice(0, 5).includes(selectedCategory)
                        ? 'bg-[#ff6b2b] text-white'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <option value="More" disabled>More Categories</option>
                    {CATEGORIES.slice(5).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Discussion Board Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
                <MessageSquareCode className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
                <h3 className="text-stone-800 dark:text-stone-200 font-bold text-lg">No Discussions Found</h3>
                <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
                  Be the first to ask or post a discussion topic!
                </p>
                <button
                  onClick={() => setIsNewPostOpen(true)}
                  className="mt-4 px-4 py-2 bg-[#ff6b2b]/10 hover:bg-[#ff6b2b]/20 text-[#ff6b2b] rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Start New Topic
                </button>
              </div>
            ) : (
              filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  layout
                  onClick={() => setSelectedPostId(post.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 rounded-xl p-4 sm:p-5 hover:border-[#ff6b2b]/30 dark:hover:border-[#ff6b2b]/30 transition-all shadow-sm duration-150 cursor-pointer hover:shadow-md"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-800 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-100">
                            {post.author}
                          </span>
                          {post.role && (
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[9px] font-semibold text-stone-500 dark:text-stone-400 uppercase">
                              {post.role}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                          <Clock className="w-3 h-3" />
                          <span>{post.timestamp}</span>
                          <span>•</span>
                          <span className="text-[#ff6b2b] font-medium">{post.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-50 hover:text-[#ff6b2b] transition-colors leading-snug tracking-tight mb-2">
                      {post.title}
                    </h3>
                    <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-stone-50 dark:bg-stone-950 text-stone-500 dark:text-stone-400 rounded text-[10px] font-mono border border-stone-200/60 dark:border-stone-800/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Footer Actions & Reactions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100 dark:border-stone-850">
                    
                    {/* Reactions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleReaction(post.id, 'thumbsUp', e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                          post.userReactions.thumbsUp
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200'
                            : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.reactions.thumbsUp}</span>
                      </button>

                      <button
                        onClick={(e) => handleReaction(post.id, 'heart', e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                          post.userReactions.heart
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-200'
                            : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{post.reactions.heart}</span>
                      </button>

                      <button
                        onClick={(e) => handleReaction(post.id, 'fire', e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                          post.userReactions.fire
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200'
                            : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>{post.reactions.fire}</span>
                      </button>

                      <button
                        onClick={(e) => handleReaction(post.id, 'insightful', e)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                          post.userReactions.insightful
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200'
                            : 'bg-stone-50 dark:bg-stone-950 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>{post.reactions.insightful}</span>
                      </button>
                    </div>

                    {/* Open Details Action */}
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#ff6b2b] bg-[#ff6b2b]/10 group-hover:bg-[#ff6b2b]/20 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length} Comments &bull; View details</span>
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* New Post Dialog Modal */}
      <AnimatePresence>
        {isNewPostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewPostOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            />

            {/* Content box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#ff6b2b]/10 text-[#ff6b2b]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-white">Start New Discussion</h3>
                </div>
                <button
                  onClick={() => setIsNewPostOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreatePost} className="p-5 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Discussion Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Python vs Javascript: Best Language for Backend?"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                </div>

                {/* Category & Tags Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b]"
                    >
                      {CATEGORIES.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g., Python, Backend, FastAPI"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b]"
                    />
                  </div>
                </div>

                {/* Content Body */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Discussion Details</label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Elaborate your ideas, ask questions, explain code snippets..."
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b] resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-850">
                  <button
                    type="button"
                    onClick={() => setIsNewPostOpen(false)}
                    className="px-4 py-2 bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff6b2b] hover:bg-[#e0561a] text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
