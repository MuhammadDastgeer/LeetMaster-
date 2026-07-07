import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, Volume2, Users, Send, Smile, Hand, PhoneOff, Mic, Sparkles } from 'lucide-react';
import { Cohort, ChatMessage, VoiceParticipant } from '../types';

// Seed initial cohort data
const INITIAL_COHORTS: Cohort[] = [
  {
    id: 'web-dev-26',
    name: 'Web Dev Cohort 26',
    channels: {
      text: ['general', 'announcements', 'react-help', 'assignments'],
      voice: [
        { name: 'LeetMaster React Live', activeCount: 14 },
        { name: 'Real Industry Journeys', activeCount: 9 },
        { name: 'Oidc Provider', activeCount: 7 },
        { name: 'Portfolio Discussion', activeCount: 5 }
      ]
    },
    messages: [
      { id: 'm1', sender: 'Shivam', avatar: 'S', time: '2m ago', text: 'ruko space me ake samjhata hoon' },
      { id: 'm2', sender: 'Aaudh', avatar: 'A', time: '1m ago', text: 'Tag anirudh sir and saam tak na pta chle toh spaces m aajana' }
    ],
    participants: [
      { id: 'v1', name: 'Riya', avatar: 'R', role: 'host', isSpeaking: true },
      { id: 'v2', name: 'Shivam', avatar: 'S', role: 'speaker', isSpeaking: false },
      { id: 'v3', name: 'Anirudh', avatar: 'AN', role: 'speaker', isSpeaking: true },
      { id: 'v4', name: 'Aman', avatar: 'AM', role: 'speaker', isSpeaking: false },
      { id: 'v5', name: 'Kunal', avatar: 'K', role: 'listener', isSpeaking: false },
      { id: 'v6', name: 'Saif', avatar: 'SA', role: 'listener', isSpeaking: false }
    ]
  },
  {
    id: 'system-design',
    name: 'System Design Cohort',
    channels: {
      text: ['general', 'microservices', 'databases', 'system-design-qa'],
      voice: [
        { name: 'Kafka Scaling Deepdive', activeCount: 18 },
        { name: 'Database Partitioning', activeCount: 12 }
      ]
    },
    messages: [
      { id: 'm1_sd', sender: 'Anirudh', avatar: 'AN', time: '10m ago', text: 'We will discuss Sharding vs Partitioning tonight.' },
      { id: 'm2_sd', sender: 'Kunal', avatar: 'K', time: '5m ago', text: 'Perfect! Looking forward to it.' }
    ],
    participants: [
      { id: 'v1_sd', name: 'Anirudh', avatar: 'AN', role: 'host', isSpeaking: true },
      { id: 'v2_sd', name: 'Rohan', avatar: 'R', role: 'speaker', isSpeaking: false },
      { id: 'v3_sd', name: 'Tushar', avatar: 'T', role: 'listener', isSpeaking: false }
    ]
  },
  {
    id: 'leet-backend',
    name: 'LeetMaster Backend',
    channels: {
      text: ['general', 'node-express', 'postgres-sql', 'redis-cache'],
      voice: [
        { name: 'WebSockets Live Session', activeCount: 22 },
        { name: 'API Design Standards', activeCount: 8 }
      ]
    },
    messages: [
      { id: 'm1_cb', sender: 'Aman', avatar: 'AM', time: '1h ago', text: 'Does anyone have trouble with Redis clusters on Docker?' },
      { id: 'm2_cb', sender: 'Shivam', avatar: 'S', time: '45m ago', text: 'I faced this, you need to expose port 6379 in your compose file' }
    ],
    participants: [
      { id: 'v1_cb', name: 'Aman', avatar: 'AM', role: 'host', isSpeaking: true },
      { id: 'v2_cb', name: 'Riya', avatar: 'R', role: 'speaker', isSpeaking: false }
    ]
  }
];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export default function TownHall() {
  const [cohorts, setCohorts] = useState<Cohort[]>(INITIAL_COHORTS);
  const [activeCohortId, setActiveCohortId] = useState('web-dev-26');
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeVoiceRoom, setActiveVoiceRoom] = useState<string | null>('LeetMaster React Live');
  const [chatInput, setChatInput] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [myHandRaised, setMyHandRaised] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const emojiIdCounter = useRef(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentCohort = cohorts.find(c => c.id === activeCohortId) || cohorts[0];

  useEffect(() => {
    // Scroll chat to bottom when cohort or channel changes
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeCohortId, currentCohort.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      avatar: 'Y',
      time: 'Just now',
      text: chatInput,
      isMe: true
    };

    // Update active cohort's message history
    const updatedCohorts = cohorts.map(c => {
      if (c.id === activeCohortId) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setCohorts(updatedCohorts);
    setChatInput('');

    // Trigger an automatic peer reply for realistic action
    setTimeout(() => {
      const peerReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Aman',
        avatar: 'AM',
        time: 'Just now',
        text: `Nice point! Check out the pins or join the "${activeVoiceRoom || 'Voice channel'}" voice call to whiteboard it.`
      };

      setCohorts(prevCohorts =>
        prevCohorts.map(c => {
          if (c.id === activeCohortId) {
            return {
              ...c,
              messages: [...c.messages, peerReply]
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  // Trigger floating reactions from the voice deck
  const spawnReaction = (emoji: string) => {
    const id = emojiIdCounter.current++;
    // spawn near the reaction deck horizontally with slight variance
    const x = Math.floor(Math.random() * 120) - 60; 
    const y = 0;
    
    setFloatingEmojis(prev => [...prev, { id, emoji, x, y }]);
    
    // clear reaction after animation ends
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  return (
    <section className="py-24 bg-[#fcfbf9] dark:bg-zinc-950 dark:text-white border-b border-[#f2efe9] dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111111] dark:text-white tracking-tight">
            Drop into a town hall.
          </h2>
          <p className="text-[#666] dark:text-zinc-300 text-base sm:text-lg font-medium leading-relaxed">
            Cohort chats that never go quiet. Live AMAs with Peers. Every cohort gets its own town hall, with rooms, threads, and voice channels.
          </p>
        </div>

        {/* Discord/Slack Style Main App Mockup */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[640px]">
          
          {/* Sidebar 1: Cohort Selector / Navigation (Col Span 3) */}
          <div className="md:col-span-3 bg-slate-50 dark:bg-zinc-950/40 border-r-2 border-black dark:border-zinc-800 flex flex-col justify-between p-4 h-full overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cohorts</h4>
                <div className="space-y-1">
                  {cohorts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCohortId(c.id);
                        setActiveChannel(c.channels.text[0]);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        c.id === activeCohortId
                          ? 'bg-black text-white dark:bg-zinc-800 shadow-sm'
                          : 'text-[#4a4a4a] dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${c.id === activeCohortId ? 'bg-[#ff6b2b]' : 'bg-gray-300'}`} />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Voice Channels</h4>
                <div className="space-y-1">
                  {currentCohort.channels.voice.map((vc) => (
                    <button
                      key={vc.name}
                      onClick={() => setActiveVoiceRoom(vc.name)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        vc.name === activeVoiceRoom
                          ? 'bg-orange-100 dark:bg-orange-950/20 text-[#ff6b2b] border border-orange-200 dark:border-orange-900/30'
                          : 'text-[#4a4a4a] dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Volume2 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{vc.name}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono text-gray-500 dark:text-zinc-400 font-medium">
                        {vc.activeCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-zinc-800 flex items-center justify-center text-white text-xs font-bold font-mono">
                Y
              </div>
              <div className="truncate flex-1">
                <h5 className="text-xs font-black text-black dark:text-white leading-none">You (Coder)</h5>
                <p className="text-[10px] text-[#ff6b2b] font-bold leading-none mt-1">Level 4 Scholar</p>
              </div>
            </div>
          </div>

          {/* Chat Panel: Central Area (Col Span 5 or 6 depending on voice room) */}
          <div className={`${activeVoiceRoom ? 'md:col-span-5' : 'md:col-span-9'} bg-white dark:bg-zinc-900 border-r-2 border-black dark:border-zinc-800 flex flex-col justify-between h-full`}>
            
            {/* Chat Header */}
            <div className="px-5 py-3 border-b-2 border-black dark:border-zinc-800 flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#ff6b2b]" />
              <div>
                <h4 className="text-xs font-black text-black dark:text-white">#{activeChannel}</h4>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-none mt-0.5">{currentCohort.name}</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {currentCohort.messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-3 ${m.isMe ? 'justify-end' : ''}`}>
                  {!m.isMe && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold font-mono text-gray-600 dark:text-zinc-400">
                      {m.avatar}
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl p-3 text-xs ${
                    m.isMe 
                      ? 'bg-black dark:bg-zinc-800 text-white rounded-tr-none' 
                      : 'bg-slate-50 dark:bg-zinc-950/40 text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className={`font-black text-[11px] ${m.isMe ? 'text-orange-200' : 'text-black dark:text-white'}`}>
                        {m.sender}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">{m.time}</span>
                    </div>
                    <p className="leading-relaxed font-medium">{m.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-black dark:border-zinc-800 bg-[#fcfbf9] dark:bg-zinc-950 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Message #${activeChannel}...`}
                className="flex-1 bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-black dark:bg-zinc-800 hover:bg-[#ff6b2b] text-white p-2 rounded-xl transition-all active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Voice Panel: Right Area (Col Span 4) */}
          <AnimatePresence>
            {activeVoiceRoom && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                className="md:col-span-4 bg-slate-50 dark:bg-zinc-950/40 flex flex-col justify-between h-full"
              >
                {/* Voice Header */}
                <div className="px-5 py-3 border-b-2 border-black dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <Volume2 className="w-4 h-4 text-[#ff6b2b]" />
                    <h4 className="text-xs font-black text-black dark:text-white truncate">{activeVoiceRoom}</h4>
                  </div>
                  <button
                    onClick={() => setActiveVoiceRoom(null)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors cursor-pointer"
                    title="Disconnect Voice"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>

                {/* Voice Participants Grid */}
                <div className="p-5 flex-1 overflow-y-auto">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                    <span>Call Members (8)</span>
                    <span className="flex items-center gap-1 bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                      <Mic className="w-3 h-3 text-green-500" />
                      <span>Live Call</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {currentCohort.participants.map((p) => (
                      <div
                        key={p.id}
                        className={`bg-white dark:bg-zinc-900 border-2 rounded-2xl p-2.5 flex flex-col items-center text-center relative transition-all duration-300 ${
                          p.isSpeaking 
                            ? 'border-[#ff6b2b] shadow-sm shadow-[#ff6b2b]/10 scale-[1.02]' 
                            : 'border-black/5 dark:border-zinc-800 hover:border-black/20 dark:hover:border-zinc-700'
                        }`}
                      >
                        {/* Speaker visual ripple aura */}
                        {p.isSpeaking && (
                          <div className="absolute inset-0 rounded-2xl border-2 border-[#ff6b2b]/50 animate-ping opacity-25 pointer-events-none" />
                        )}

                        <div className="relative mb-2">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black border border-black/10 dark:border-zinc-700">
                            {p.avatar}
                          </div>
                          
                          {/* Speak active badge dot */}
                          {p.isSpeaking && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#ff6b2b] border-2 border-white dark:border-zinc-900" />
                          )}
                        </div>

                        <span className="text-xs font-bold text-black dark:text-white leading-none truncate w-full">{p.name}</span>
                        <span className="text-[9px] text-gray-400 capitalize mt-1">{p.role}</span>
                      </div>
                    ))}

                    {/* Me (The interactive coder inside voice call) */}
                    <div
                      className={`bg-white dark:bg-zinc-900 border-2 rounded-2xl p-2.5 flex flex-col items-center text-center relative ${
                        !isMuted ? 'border-[#ff6b2b] scale-[1.02]' : 'border-black/5 dark:border-zinc-800'
                      }`}
                    >
                      <div className="relative mb-2">
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-zinc-800 text-white flex items-center justify-center text-xs font-black border border-black/10 dark:border-zinc-700">
                          Y
                        </div>
                        {!isMuted && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#ff6b2b] border-2 border-white dark:border-zinc-900" />
                        )}
                        {myHandRaised && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black border border-white p-1 rounded-full flex items-center justify-center">
                            ✋
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-black dark:text-white leading-none">You (Me)</span>
                      <span className="text-[9px] text-[#ff6b2b] font-bold mt-1">Scholar</span>
                    </div>

                  </div>
                </div>

                {/* Reaction Floating Zone */}
                <div className="relative">
                  <div className="absolute inset-x-0 bottom-16 flex justify-center pointer-events-none">
                    {floatingEmojis.map((e) => (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 1, y: 0, x: e.x, scale: 0.8 }}
                        animate={{ opacity: 0, y: -240, scale: 1.4, rotate: e.x / 2 }}
                        transition={{ duration: 1.6, ease: 'easeOut' }}
                        className="absolute text-3xl select-none z-30"
                      >
                        {e.emoji}
                      </motion.div>
                    ))}
                  </div>

                  {/* Voice Controls / Reaction Deck */}
                  <div className="p-4 border-t-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                    {/* Floating emoji reactions click selectors */}
                    <div className="flex items-center justify-around bg-slate-50 dark:bg-zinc-950 border border-black/5 dark:border-zinc-800 p-1.5 rounded-xl">
                      {['❤️', '👍', '😂', '🎉', '🔥', '😮'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => spawnReaction(emoji)}
                          className="hover:scale-125 transition-transform duration-100 text-sm cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-black dark:border-zinc-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isMuted 
                            ? 'bg-red-500 text-white border-red-500' 
                            : 'bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-black dark:text-white'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>{isMuted ? 'Muted' : 'Speaking'}</span>
                      </button>

                      <button
                        onClick={() => setMyHandRaised(!myHandRaised)}
                        className={`py-2.5 px-3.5 rounded-xl border-2 border-black dark:border-zinc-700 transition-all flex items-center justify-center cursor-pointer ${
                          myHandRaised 
                            ? 'bg-amber-400 text-black border-black' 
                            : 'bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-gray-500 dark:text-zinc-400'
                        }`}
                        title="Raise Hand"
                      >
                        <Hand className={`w-4 h-4 ${myHandRaised ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
