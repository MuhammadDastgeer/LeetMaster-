import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Heart, MessageCircle, ArrowRight, Sparkles, 
  Users, Brain, ChevronDown, Send, Clock, ThumbsUp, Flame 
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
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

interface CommunityDiscussProps {
  onNavigate: (path: string) => void;
}

export default function CommunityDiscuss({ onNavigate }: CommunityDiscussProps) {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
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

  const handleReaction = (postId: string, reactionType: keyof DiscussionPost['reactions'], e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid expanding/collapsing the post
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

  const toggleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <section className="py-20 bg-stone-50 dark:bg-zinc-950 border-t border-stone-200/60 dark:border-stone-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6b2b]/10 text-[#ff6b2b] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Community Discussions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight mb-3">
            Don't Learn Alone. <span className="text-[#ff6b2b]">Discuss & Grow</span>.
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
            Collaborate on DSA problems, share fullstack architecture insights, ask questions, or help fellow peers debug their systems.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Info & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200/60 dark:border-stone-850/80 shadow-xs">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#ff6b2b] font-bold uppercase tracking-widest">Interactive Board</span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  Discuss Forum
                </h3>
              </div>
              
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                We have completely replaced the old text channels with a fully-fledged <strong>Discuss Board</strong>. Now you can easily post new threads, comment on active discussions, filter by tags, and react with multiple emojis!
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-[#ff6b2b]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">1.2k+ Members</div>
                    <div className="text-[10px] text-stone-400">Collaborating daily</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-[#ff6b2b]">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Live Comments</div>
                    <div className="text-[10px] text-stone-400">Peer mentorship</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => onNavigate('/discuss')}
                className="group flex items-center justify-center gap-2 w-full py-3 bg-[#ff6b2b] hover:bg-[#e0561a] active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/10 transition-all duration-200 cursor-pointer"
              >
                <span>Enter Full Discuss Forum</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right panel: Live Trending Topics with Interactive Comments */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200/60 dark:border-stone-850/80 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-100 dark:border-stone-850">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#ff6b2b]" />
                Trending on Discuss Forum
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Click to expand comments</span>
            </div>

            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => {
                const isExpanded = expandedPostId === post.id;
                return (
                  <div 
                    key={post.id} 
                    className={`p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border transition-all duration-200 ${
                      isExpanded 
                        ? 'border-[#ff6b2b]/50 shadow-md ring-1 ring-[#ff6b2b]/15' 
                        : 'border-stone-200/40 dark:border-stone-850/60 hover:border-[#ff6b2b]/20 hover:bg-[#ff6b2b]/5 dark:hover:bg-[#ff6b2b]/5'
                    }`}
                  >
                    {/* Header bar */}
                    <div 
                      onClick={() => toggleExpand(post.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-orange-100/60 dark:bg-orange-950/40 text-[#ff6b2b] text-[9px] font-bold uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            Posted by <span className="font-semibold text-stone-600 dark:text-stone-300">{post.author}</span>
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#ff6b2b]' : ''}`} />
                      </div>
                      
                      <h4 className="text-xs sm:text-sm font-extrabold text-stone-800 dark:text-stone-200 transition-colors leading-snug">
                        {post.title}
                      </h4>
                    </div>

                    {/* Extended Content & Comments thread */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          {/* Post Details */}
                          <div className="mt-3 text-xs text-stone-600 dark:text-stone-400 leading-relaxed bg-white dark:bg-stone-900/40 p-3 rounded-lg border border-stone-200/40 dark:border-stone-800/40">
                            {post.content}
                          </div>

                          {/* Action reactions */}
                          <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-stone-200/40 dark:border-stone-800/40">
                            <button
                              onClick={(e) => handleReaction(post.id, 'thumbsUp', e)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] transition-colors cursor-pointer ${
                                post.userReactions.thumbsUp
                                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200'
                                  : 'bg-stone-100 dark:bg-stone-900 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{post.reactions.thumbsUp}</span>
                            </button>

                            <button
                              onClick={(e) => handleReaction(post.id, 'heart', e)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] transition-colors cursor-pointer ${
                                post.userReactions.heart
                                  ? 'bg-red-50 dark:bg-red-950/40 text-red-500 border border-red-200'
                                  : 'bg-stone-100 dark:bg-stone-900 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800'
                              }`}
                            >
                              <Heart className="w-3 h-3" />
                              <span>{post.reactions.heart}</span>
                            </button>

                            <button
                              onClick={(e) => handleReaction(post.id, 'fire', e)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] transition-colors cursor-pointer ${
                                post.userReactions.fire
                                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200'
                                  : 'bg-stone-100 dark:bg-stone-900 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800'
                              }`}
                            >
                              <Flame className="w-3 h-3" />
                              <span>{post.reactions.fire}</span>
                            </button>
                          </div>

                          {/* Comments List */}
                          <div className="mt-4 space-y-2.5">
                            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                              Comments ({post.comments.length})
                            </span>
                            
                            {post.comments.length > 0 ? (
                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {post.comments.map(comment => (
                                  <div key={comment.id} className="flex gap-2 bg-white dark:bg-stone-900/60 p-2.5 rounded-lg border border-stone-200/40 dark:border-stone-800/40">
                                    <img
                                      src={comment.avatar}
                                      alt={comment.author}
                                      referrerPolicy="no-referrer"
                                      className="w-5 h-5 rounded-full object-cover mt-0.5"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-bold text-[11px] text-stone-800 dark:text-stone-200">{comment.author}</span>
                                        <span className="text-[8px] text-stone-400">{comment.timestamp}</span>
                                      </div>
                                      <p className="text-stone-700 dark:text-stone-300 text-xs leading-relaxed">{comment.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-stone-400 italic">No comments yet. Be the first to start the conversation!</p>
                            )}

                            {/* Add Comment Input Form */}
                            <div className="flex gap-2 items-center mt-3 pt-2 border-t border-stone-200/20 dark:border-stone-800/20">
                              <img
                                src={userAvatar}
                                alt="Me"
                                referrerPolicy="no-referrer"
                                className="w-6 h-6 rounded-full object-cover border border-stone-200 dark:border-stone-800"
                              />
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={commentInputs[post.id] || ''}
                                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddComment(post.id);
                                    }
                                  }}
                                  placeholder="Write a comment..."
                                  className="w-full pl-3 pr-10 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6b2b]"
                                />
                                <button
                                  onClick={() => handleAddComment(post.id)}
                                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-[#ff6b2b] hover:text-[#e0561a] transition-colors cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Simple summary view for unexpanded posts */}
                    {!isExpanded && (
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-stone-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                          {post.reactions.heart + post.reactions.thumbsUp + post.reactions.fire}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments.length} Comments
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
