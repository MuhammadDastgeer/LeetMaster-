import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hash, Lock, Send, Smile, Search, Bell, BellOff, BookOpen, 
  ChevronDown, ChevronRight, MessageSquare, Flame, Sparkles, 
  Users, Check, ThumbsUp, Shield, HelpCircle, Heart, Star,
  CornerUpLeft, X, MessageCircle
} from 'lucide-react';

interface RawReaction {
  emoji: string;
  users: string[];
}

interface Message {
  id: string;
  channel: string;
  sender: string;
  avatar: string;
  isAdmin: boolean;
  timestamp: string;
  content: string;
  reactions: RawReaction[];
  parentId: string | null;
}

interface TownHallsProps {
  darkMode: boolean;
}

const EMOJI_CATEGORIES = [
  {
    name: "Smileys & Emotion",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😋", "😛", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😴", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷"]
  },
  {
    name: "Gestures & People",
    emojis: ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🧠", "👀", "👅", "👄", "💋"]
  },
  {
    name: "Hearts & Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️" ]
  },
  {
    name: "Tech & Study",
    emojis: ["💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "🎮", "🕹️", "💾", "💿", "📀", "📹", "🎥", "📞", "📟", "📠", "📺", "📻", "🎙️", "🧭", "⏱️", "⏲️", "⏰", "⏳", "🚀", "🛸", "🚨", "🔬", "🔭", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🔑", "🗝️", "🔨", "🛠️", "⚙️", "📚", "📓", "📝", "✏️", "🎓", "🏆", "🎯", "💯"]
  },
  {
    name: "Activities & Fun",
    emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🛹", "🛼", "🎿", "🏂", "🏋️", "🧘", "🚴", "🥇", "🥈", "🥉", "🏅", "🎖️", "🎫", "🎟️", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎸", "🎻"]
  }
];

function EmojiPicker({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (emoji: string) => void; 
  onClose: () => void; 
}) {
  const [search, setSearch] = useState("");
  
  return (
    <div className="flex flex-col h-full text-stone-800 dark:text-stone-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-850 mb-2 flex-shrink-0">
        <span className="text-xs font-bold text-[#ff6d2c] uppercase tracking-wider">Emoji Keyboard</span>
        <button 
          onClick={onClose}
          type="button"
          className="p-1 hover:bg-stone-100 dark:hover:bg-stone-850 rounded-full transition-colors cursor-pointer text-stone-400 hover:text-stone-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-2 flex-shrink-0">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji..."
          className="w-full pl-7 pr-3 py-1 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-700 dark:text-stone-300 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#ff6d2c]"
        />
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 select-none scrollbar-thin">
        {EMOJI_CATEGORIES.map((category) => {
          const filtered = category.emojis;
          const match = category.name.toLowerCase().includes(search.toLowerCase()) || search === "";
          const displayEmojis = match ? filtered : filtered.filter(e => e.includes(search));

          if (displayEmojis.length === 0) return null;

          return (
            <div key={category.name} className="space-y-1">
              <div className="text-[10px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-wider">
                {category.name}
              </div>
              <div className="grid grid-cols-8 gap-1">
                {displayEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onSelect(emoji)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 hover:scale-110 active:scale-95 text-base sm:text-lg transition-all cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;
    playNote(587.33, now, 0.15); // D5 note
    playNote(880.00, now + 0.08, 0.25); // A5 note
  } catch (e) {
    console.error("Audio playback error", e);
  }
};

const CURRENT_USER = "Dastgeer";
const CURRENT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop";

export default function TownHalls({ darkMode }: TownHallsProps) {
  const [activeChannel, setActiveChannel] = useState('announcements');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [spaceNotifications, setSpaceNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; sender: string; content: string } | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [showChatEmojiPicker, setShowChatEmojiPicker] = useState(false);
  const [showReactionEmojiPickerForId, setShowReactionEmojiPickerForId] = useState<string | null>(null);
  const lastMsgIdRef = useRef<string | null>(null);

  const handleToggleNotifications = () => {
    const nextVal = !spaceNotifications;
    setSpaceNotifications(nextVal);
    if (nextVal) {
      playNotificationSound();
    }
  };

  // Expanded categories toggle states
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'Getting started': true,
    'Resources Hub': true,
    'Fields Hub': true,
    'Community': true,
    'Fun zone': true
  });

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Fetch messages from Server API
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        setError(null);
      }
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setError("Failed to sync with chat engine. Retrying...");
    }
  };

  // Poll for messages every 2.5 seconds to sync in real-time across tabs/users
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  // Play sweet notification sound when new message is received and Space Notifications is ON
  useEffect(() => {
    if (messages.length > 0) {
      const latestMsg = messages[messages.length - 1];
      if (lastMsgIdRef.current && latestMsg.id !== lastMsgIdRef.current) {
        if (spaceNotifications) {
          playNotificationSound();
        }
      }
      lastMsgIdRef.current = latestMsg.id;
    }
  }, [messages, spaceNotifications]);

  // Channel Category Sections
  const categories = [
    {
      title: 'Getting started',
      channels: [
        { id: 'announcements', name: 'announcements', isPrivate: false },
        { id: 'rules', name: 'rules', isPrivate: true }
      ]
    },
    {
      title: 'Resources Hub',
      channels: [
        { id: 'books', name: 'books', isPrivate: false },
        { id: 'roadmap', name: 'roadmap', isPrivate: false },
        { id: 'blog', name: 'blog', isPrivate: false }
      ]
    },
    {
      title: 'Fields Hub',
      channels: [
        { id: 'ml', name: 'ml', isPrivate: false },
        { id: 'dl', name: 'dl', isPrivate: false },
        { id: 'cv', name: 'cv', isPrivate: false },
        { id: 'agentic-ai', name: 'agentic-ai', isPrivate: false },
        { id: 'gen-ai', name: 'gen-ai', isPrivate: false },
        { id: 'python', name: 'python', isPrivate: false },
        { id: 'dsa', name: 'dsa', isPrivate: false },
        { id: 'nlp', name: 'nlp', isPrivate: false },
        { id: 'system-design', name: 'system-design', isPrivate: false }
      ]
    },
    {
      title: 'Community',
      channels: [
        { id: 'general', name: 'general', isPrivate: false }
      ]
    },
    {
      title: 'Fun zone',
      channels: [
        { id: 'socials', name: 'socials', isPrivate: false },
        { id: 'memes', name: 'memes', isPrivate: false }
      ]
    }
  ];

  // Send a message or thread reply
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      channel: activeChannel,
      sender: CURRENT_USER,
      avatar: CURRENT_AVATAR,
      isAdmin: false,
      content: inputText,
      parentId: replyingTo ? replyingTo.id : null,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData)
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setInputText('');
        setReplyingTo(null);
        setError(null);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to deliver message. Check internet connection.");
    }
  };

  // Toggle emoji reactions with SQLite persistence
  const handleReactionClick = async (msgId: string, emoji: string) => {
    try {
      const res = await fetch(`/api/messages/${msgId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, user: CURRENT_USER })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === msgId) {
            return { ...msg, reactions: data.reactions };
          }
          return msg;
        }));
      }
    } catch (err) {
      console.error("Error reacting to message:", err);
    }
  };

  // Custom formatted reactions display
  const getFormattedReactions = (reactionsList: RawReaction[]) => {
    return reactionsList.map(r => ({
      emoji: r.emoji,
      count: r.users.length,
      userReacted: r.users.includes(CURRENT_USER)
    }));
  };

  // Format link text and tags
  const renderMessageContent = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith('http://') || word.startsWith('https://')) {
        return (
          <a 
            key={i} 
            href={word} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#ff6b2b] hover:underline break-all font-semibold"
          >
            {word}
          </a>
        );
      }
      if (word.startsWith('@everyone') || word.startsWith('@here')) {
        return (
          <span key={i} className="bg-orange-500/10 text-[#ff6b2b] px-1.5 py-0.5 rounded font-black">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  // Filter messages based on active channel and search query
  const filteredMessages = messages
    .filter(msg => msg.channel === activeChannel)
    .filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render date separators beautifully
  const renderDateSeparator = (msgIdx: number, list: Message[]) => {
    if (msgIdx === 0) {
      const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return (
        <div className="flex justify-center my-6">
          <span className="bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-stone-200/40 dark:border-stone-700/40 shadow-xs">
            {todayStr}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-white dark:bg-stone-900 overflow-hidden select-none">
      
      {/* Discord Style Sub-sidebar */}
      <div className="w-60 bg-[#fafafa] dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between flex-shrink-0">
        <div className="p-4 flex-grow overflow-y-auto min-h-0 pr-1 space-y-6">
          
          <div className="flex items-center gap-2 px-2 pb-2 border-b border-stone-200 dark:border-stone-850">
            <Users className="w-4 h-4 text-[#ff6d2c]" />
            <span className="text-xs font-extrabold text-stone-800 dark:text-stone-100 uppercase tracking-wider">Town Halls Space</span>
          </div>

          {/* Navigation channels lists */}
          <div className="space-y-5">
            {categories.map((cat, idx) => {
              const isExpanded = expandedCategories[cat.title] !== false;
              return (
                <div key={idx} className="space-y-1.5">
                  <button
                    onClick={() => toggleCategory(cat.title)}
                    className="w-full flex items-center justify-between text-stone-400 dark:text-stone-500 px-2 cursor-pointer hover:text-[#ff6d2c] dark:hover:text-[#ff6d2c] transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">{cat.title}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="space-y-0.5">
                      {cat.channels.map(chan => {
                        const isActive = activeChannel === chan.id;
                        return (
                          <button
                            key={chan.id}
                            onClick={() => {
                              setActiveChannel(chan.id);
                              setReplyingTo(null);
                            }}
                            className={`w-full flex items-center gap-2 px-2.5 py-2.5 rounded-xl font-bold text-xs transition-all text-left cursor-pointer ${
                              isActive 
                                ? 'bg-[#ff6d2c] text-white shadow-sm shadow-[#ff6d2c]/20' 
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 hover:text-stone-900 dark:hover:text-stone-100'
                            }`}
                          >
                            {chan.isPrivate ? (
                              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                            ) : (
                              <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                            )}
                            <span className="truncate">{chan.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Space Notifications Toggle */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/30 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider">Space Notifications</span>
            <button 
              onClick={handleToggleNotifications}
              className={`w-9 h-5 rounded-full p-0.5 transition-all focus:outline-none cursor-pointer ${
                spaceNotifications ? 'bg-[#ff6d2c]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-all transform ${
                spaceNotifications ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            {spaceNotifications ? <Bell className="w-3.5 h-3.5 text-[#ff6d2c]" /> : <BellOff className="w-3.5 h-3.5 text-stone-400" />}
            <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
              {spaceNotifications ? 'Live space alarms ON' : 'Get notified on app when a Space goes live.'}
            </p>
          </div>
        </div>

      </div>

      {/* Main Chat log container */}
      <div className="flex-1 flex flex-col justify-between bg-white dark:bg-stone-900 min-w-0 h-full relative">
        
        {/* Top Channel Header bar */}
        <div className="h-16 border-b border-stone-200 dark:border-stone-800 px-6 flex items-center justify-between flex-shrink-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {activeChannel === 'rules' ? (
              <Lock className="w-4 h-4 text-[#ff6d2c]" />
            ) : (
              <Hash className="w-4 h-4 text-[#ff6d2c]" />
            )}
            <span className="font-sans font-extrabold text-base text-stone-900 dark:text-white">
              {activeChannel}
            </span>
          </div>

          {/* Quick Search bar */}
          <div className="relative flex items-center gap-3">
            {error && (
              <span className="hidden md:inline text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg animate-pulse">
                {error}
              </span>
            )}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in conversation..."
                className="pl-8 pr-4 py-1.5 bg-stone-100 dark:bg-stone-950 border-0 rounded-xl text-xs text-stone-700 dark:text-stone-300 placeholder-stone-400 focus:ring-1 focus:ring-[#ff6d2c]/50 focus:outline-none w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Conversation Logs window */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-stone-300 dark:text-stone-700 animate-pulse" />
              <p className="text-sm font-semibold">No messages found</p>
              <p className="text-xs text-[#ff6d2c]">Be the first to share an update with LeetMasters!</p>
            </div>
          ) : (
            filteredMessages.map((msg, index) => {
              const formattedReactions = getFormattedReactions(msg.reactions);
              const hasParent = msg.parentId !== null;
              const parentMsg = hasParent ? messages.find(m => m.id === msg.parentId) : null;

              return (
                <div 
                  key={msg.id} 
                  className="space-y-1 group/msg relative"
                  onMouseEnter={() => setHoveredMessageId(msg.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {/* Custom Group Date Header */}
                  {renderDateSeparator(index, filteredMessages)}

                  {/* Reply Parent Box & Connector */}
                  {hasParent && parentMsg && (
                    <div className="flex items-center gap-2 pl-12 text-stone-400 dark:text-stone-500 text-xs font-semibold mb-1 relative">
                      {/* CSS connector line */}
                      <div className="absolute top-2.5 left-6 w-5 h-4 border-l-2 border-t-2 border-dashed border-stone-200 dark:border-stone-800 rounded-tl-lg" />
                      <div className="w-4 h-4 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-[9px] select-none flex-shrink-0">
                        {parentMsg.sender ? parentMsg.sender.trim().charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="font-extrabold text-stone-700 dark:text-stone-300">@{parentMsg.sender}</span>
                      <span className="truncate max-w-sm font-medium italic">"{parentMsg.content}"</span>
                    </div>
                  )}

                  {/* Main Message box */}
                  <div className="flex gap-3.5 items-start hover:bg-stone-50/50 dark:hover:bg-stone-900/20 p-2.5 rounded-2xl transition-colors relative">
                    
                    {/* Action Bar Float */}
                    {hoveredMessageId === msg.id && (
                      <div className="absolute top-2 right-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm rounded-lg py-1 px-1.5 flex items-center gap-1.5 z-20">
                        <button 
                          onClick={() => setReplyingTo({ id: msg.id, sender: msg.sender, content: msg.content })}
                          className="hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 hover:text-[#ff6d2c] p-1 rounded transition-all cursor-pointer flex items-center gap-1"
                          title="Reply to message"
                        >
                          <CornerUpLeft className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">Reply</span>
                        </button>
                        <span className="text-stone-300 dark:text-stone-700">|</span>
                        <button 
                          onClick={() => handleReactionClick(msg.id, '👍')}
                          className="hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 hover:text-amber-500 p-1 rounded transition-all cursor-pointer text-xs"
                          title="Like"
                        >
                          👍
                        </button>
                        <button 
                          onClick={() => handleReactionClick(msg.id, '🔥')}
                          className="hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 hover:text-orange-500 p-1 rounded transition-all cursor-pointer text-xs"
                          title="Flame"
                        >
                          🔥
                        </button>
                        <button 
                          onClick={() => handleReactionClick(msg.id, '❤️')}
                          className="hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 hover:text-red-500 p-1 rounded transition-all cursor-pointer text-xs"
                          title="Love"
                        >
                          ❤️
                        </button>
                        <span className="text-stone-300 dark:text-stone-700">|</span>
                        <button 
                          onClick={() => setShowReactionEmojiPickerForId(showReactionEmojiPickerForId === msg.id ? null : msg.id)}
                          className="hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 hover:text-[#ff6d2c] p-1 rounded transition-all cursor-pointer text-xs font-bold flex items-center justify-center"
                          title="Add reaction"
                        >
                          ➕
                        </button>
                      </div>
                    )}

                    {showReactionEmojiPickerForId === msg.id && (
                      <div className="absolute right-4 top-10 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl p-3 z-30 w-72 h-80 flex flex-col">
                        <EmojiPicker 
                          onSelect={(emoji) => {
                            handleReactionClick(msg.id, emoji);
                            setShowReactionEmojiPickerForId(null);
                          }}
                          onClose={() => setShowReactionEmojiPickerForId(null)}
                        />
                      </div>
                    )}

                    <div className="w-10 h-10 rounded-full bg-[#ffefe7] dark:bg-orange-950/40 border-2 border-stone-200/80 dark:border-stone-800 text-[#ff6b2b] dark:text-[#ff804a] flex items-center justify-center font-black text-sm select-none flex-shrink-0">
                      {msg.sender ? msg.sender.trim().charAt(0).toUpperCase() : 'A'}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      {msg.sender ? (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="font-extrabold text-sm text-stone-900 dark:text-white leading-none">
                            {msg.sender}
                          </span>
                          {msg.isAdmin && (
                            <span className="bg-[#fee2e2] text-[#ef4444] text-[9px] font-black px-1.5 py-0.5 rounded leading-none uppercase">
                              admin
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400 font-medium">
                            {msg.timestamp}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
                          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                            Space Guidelines
                          </span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className="bg-stone-100 dark:bg-stone-850 px-4 py-3 rounded-2xl rounded-tl-none text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-wrap">
                        {renderMessageContent(msg.content)}
                      </div>

                      {/* Reactions buttons box */}
                      {formattedReactions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {formattedReactions.map((react, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => handleReactionClick(msg.id, react.emoji)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                react.userReacted
                                  ? 'bg-orange-500/10 text-[#ff6d2c] border-[#ff6d2c]'
                                  : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                              }`}
                            >
                              <span>{react.emoji}</span>
                              <span className="font-mono text-[11px]">{react.count}</span>
                            </button>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              );
            })
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Reply Indicator Box */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="px-6 py-2 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400"
            >
              <div className="flex items-center gap-2">
                <CornerUpLeft className="w-4 h-4 text-[#ff6d2c]" />
                <span>Replying to <span className="text-[#ff6d2c] font-black">@{replyingTo.sender}</span>:</span>
                <span className="italic truncate max-w-md font-medium text-stone-400">"{replyingTo.content}"</span>
              </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-all cursor-pointer text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer actions input or read-only indicator bar */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 flex-shrink-0">
          {activeChannel === 'rules' ? (
            <div className="bg-[#faf9f6] dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-850 text-center space-y-1">
              <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#ff6d2c]" />
                Smart Students Read First.
              </h4>
              <p className="text-xs text-stone-400">This channel is read-only so you never miss what matters.</p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-stone-100 dark:bg-stone-950 rounded-2xl px-3.5 py-1.5 border border-stone-200 dark:border-stone-800 relative">
              <div className="relative flex items-center">
                <button 
                  type="button"
                  className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer transition-colors"
                  title="Add Emoji"
                  onClick={() => setShowChatEmojiPicker(!showChatEmojiPicker)}
                >
                  <Smile className="w-4.5 h-4.5" />
                </button>

                {showChatEmojiPicker && (
                  <div className="absolute bottom-12 left-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl p-3 z-50 w-72 h-80 flex flex-col">
                    <EmojiPicker 
                      onSelect={(emoji) => {
                        setInputText(prev => prev + emoji);
                      }}
                      onClose={() => setShowChatEmojiPicker(false)}
                    />
                  </div>
                )}
              </div>
              
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={replyingTo ? `Reply to @${replyingTo.sender}...` : `Message #${activeChannel}...`}
                className="flex-1 bg-transparent border-0 py-2 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-0 min-w-0 font-medium"
              />

              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-[#ff6d2c] disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
