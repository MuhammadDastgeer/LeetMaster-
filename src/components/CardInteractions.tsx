import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Heart, Flame, Rocket, Lightbulb, ThumbsUp, Sparkles, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  item_type: string;
  item_id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface Reaction {
  emoji: string;
  users: string[];
}

interface CardInteractionsProps {
  itemType: 'blog' | 'project' | 'event' | 'hackathon';
  itemId: string;
}

export default function CardInteractions({ itemType, itemId }: CardInteractionsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userProfile, setUserProfile] = useState<{ fullName: string; avatar: string }>({
    fullName: 'Dastgeer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default emojis for reactions
  const emojiList = ['👍', '❤️', '🔥', '🚀', '🎉', '💡'];

  useEffect(() => {
    // Fetch profile
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setUserProfile({
            fullName: data.profile.fullName || 'Dastgeer',
            avatar: data.profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop'
          });
        }
      })
      .catch((err) => console.error('Error fetching profile for interactions:', err));

    // Fetch comments & reactions
    fetchInteractions();
  }, [itemType, itemId]);

  const fetchInteractions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/interactions/${itemType}/${itemId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.comments || []);
        setReactions(data.reactions || []);
      }
    } catch (err) {
      console.error('Error fetching interactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReact = async (emoji: string) => {
    try {
      const res = await fetch(`/api/interactions/${itemType}/${itemId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, user: userProfile.fullName })
      });
      const data = await res.json();
      if (data.success) {
        setReactions(data.reactions || []);
      }
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/interactions/${itemType}/${itemId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: userProfile.fullName,
          avatar: userProfile.avatar,
          content: newComment.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Just now';
    }
  };

  return (
    <div className="border-t border-stone-200 dark:border-stone-800 pt-6 mt-8 space-y-8">
      {/* Reactions Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-widest text-[#ff6b2b] flex items-center gap-1.5 font-mono">
          <Smile className="w-4 h-4" />
          <span>Reactions & Moods</span>
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {emojiList.map((emoji) => {
            const reactEntry = reactions.find((r) => r.emoji === emoji);
            const userReacted = reactEntry ? reactEntry.users.includes(userProfile.fullName) : false;
            const count = reactEntry ? reactEntry.users.length : 0;

            return (
              <motion.button
                key={emoji}
                onClick={() => handleReact(emoji)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
                  userReacted
                    ? 'bg-orange-100/80 border-[#ff6b2b]/30 text-orange-950 dark:bg-[#ff6b2b]/20 dark:border-[#ff6b2b]/40 dark:text-orange-300 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-800 hover:border-[#ff6b2b]/30 text-stone-700 dark:text-stone-200'
                }`}
              >
                <span>{emoji}</span>
                {count > 0 && (
                  <span className={`text-xs font-black ${userReacted ? 'text-[#ff6b2b]' : 'text-stone-500 dark:text-stone-400'}`}>
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-[#ff6b2b] flex items-center gap-1.5 font-mono">
          <MessageSquare className="w-4 h-4" />
          <span>Discussion ({comments.length})</span>
        </h4>

        {isLoading ? (
          <div className="flex items-center gap-2 py-4">
            <div className="w-4 h-4 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-xs font-bold text-stone-500 font-mono">Retrieving comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/30">
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              No comments posted yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                >
                  <div className="w-8 h-8 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-xs select-none flex-shrink-0">
                    {comment.author ? comment.author.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-stone-950 dark:text-stone-50 block truncate">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono font-medium shrink-0">
                        {formatCommentTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 mt-1.5 whitespace-pre-line leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleAddComment} className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-xs select-none flex-shrink-0">
          {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts or feedback..."
            rows={1}
            disabled={isSubmitting}
            className="w-full pl-4 pr-12 py-2.5 text-xs font-semibold bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#ff6b2b] focus:border-[#ff6b2b] text-stone-950 dark:text-white placeholder-stone-500 dark:placeholder-stone-400 resize-none min-h-[44px] max-h-[120px] shadow-sm font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-orange-100 dark:bg-orange-950 hover:bg-[#ff6b2b] hover:dark:bg-[#ff6b2b] text-[#ff6b2b] dark:text-orange-300 hover:text-white hover:dark:text-white rounded-xl transition-all cursor-pointer active:scale-90 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
