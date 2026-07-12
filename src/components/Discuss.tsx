import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Heart, ThumbsUp, Flame, Sparkles, Plus, Search, 
  Send, User, Clock, ChevronDown, Filter, MessageCircle, Share2, 
  Check, X, ThumbsDown, BookOpen, MessageSquareCode, Edit2, Trash2
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

const DEFAULT_POSTS: DiscussionPost[] = [];

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

  // Edit states
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('General Discussion');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  // Comment edit states
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');

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

    // Force clear any old preloaded default posts to make sure board is clean initially
    const hasBeenCleared = localStorage.getItem('leetmaster_discussions_cleared_empty_v2');
    if (!hasBeenCleared) {
      localStorage.setItem('leetmaster_discussions', '[]');
      localStorage.setItem('leetmaster_discussions_cleared_empty_v2', 'true');
      setPosts([]);
    } else {
      const savedPosts = localStorage.getItem('leetmaster_discussions');
      if (savedPosts) {
        try {
          setPosts(JSON.parse(savedPosts));
        } catch (e) {
          setPosts([]);
        }
      } else {
        setPosts([]);
      }
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
      reactions: { thumbsUp: 0, heart: 0, fire: 0, insightful: 0 },
      userReactions: { thumbsUp: false, heart: false, fire: false, insightful: false },
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

  const handleOpenEditPost = (post: DiscussionPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditCategory(post.category);
    setEditContent(post.content);
    setEditTags(post.tags.join(', '));
    setIsEditPostOpen(true);
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    const tagsArray = editTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const updated = posts.map(post => {
      if (post.id === editingPostId) {
        return {
          ...post,
          title: editTitle,
          category: editCategory,
          content: editContent,
          tags: tagsArray.length > 0 ? tagsArray : ['General']
        };
      }
      return post;
    });

    savePosts(updated);
    setIsEditPostOpen(false);
    setEditingPostId(null);
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this discussion post?')) {
      const updated = posts.filter(post => post.id !== postId);
      savePosts(updated);
      if (selectedPostId === postId) {
        setSelectedPostId(null);
      }
    }
  };

  const handleStartEditComment = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(text);
  };

  const handleUpdateComment = (postId: string, commentId: string) => {
    if (!editCommentText.trim()) return;

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId) {
              return { ...c, text: editCommentText.trim() };
            }
            return c;
          })
        };
      }
      return post;
    });

    savePosts(updated);
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const updated = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId)
          };
        }
        return post;
      });

      savePosts(updated);
    }
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
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
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

              {selectedPost.author === userName && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={(e) => handleOpenEditPost(selectedPost, e)}
                    className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-400 hover:text-[#ff6b2b] transition-colors cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeletePost(selectedPost.id, e)}
                    className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
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
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400 font-mono">
                            {comment.timestamp}
                          </span>
                          {comment.author === userName && (
                            <div className="flex items-center gap-1.5 ml-1">
                              <button
                                onClick={() => handleStartEditComment(comment.id, comment.text)}
                                className="text-stone-400 hover:text-[#ff6b2b] transition-colors p-0.5 rounded cursor-pointer"
                                title="Edit Comment"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                                className="text-stone-400 hover:text-red-500 transition-colors p-0.5 rounded cursor-pointer"
                                title="Delete Comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {editingCommentId === comment.id ? (
                        <div className="space-y-2 mt-1">
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            rows={2}
                            className="w-full p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs font-bold text-stone-850 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b] resize-none"
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditCommentText('');
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 rounded transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateComment(selectedPost.id, comment.id)}
                              className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#ff6b2b] hover:bg-[#e0561a] rounded transition-colors cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {comment.text}
                        </p>
                      )}
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

                    {post.author === userName && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => handleOpenEditPost(post, e)}
                          className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded text-stone-400 hover:text-[#ff6b2b] transition-colors cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePost(post.id, e)}
                          className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
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

      {/* Edit Post Dialog Modal */}
      <AnimatePresence>
        {isEditPostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditPostOpen(false);
                setEditingPostId(null);
              }}
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
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-white">Edit Discussion Post</h3>
                </div>
                <button
                  onClick={() => {
                    setIsEditPostOpen(false);
                    setEditingPostId(null);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdatePost} className="p-5 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Discussion Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g., Python vs Javascript: Best Language for Backend?"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b]"
                  />
                </div>

                {/* Category & Tags Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
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
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
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
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Elaborate your ideas, ask questions, explain code snippets..."
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b] resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-850">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditPostOpen(false);
                      setEditingPostId(null);
                    }}
                    className="px-4 py-2 bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff6b2b] hover:bg-[#e0561a] text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Changes
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
