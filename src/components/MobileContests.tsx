import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Award, Flame, MessageCircle, ArrowRight, Github, Send, SmartphoneIcon, CircleUser } from 'lucide-react';

export default function MobileContests() {
  const [timeLeft, setTimeLeft] = useState({
    days: 11,
    hours: 8,
    minutes: 52,
    seconds: 1
  });
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Live countdown timer ticking down every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowMobileDrawer(false);
      setSubmitted(false);
      setGithubUrl('');
    }, 2000);
  };

  return (
    <section className="py-24 bg-[#fcfbf9] dark:bg-zinc-950 dark:text-white border-t border-b border-[#f2efe9] dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: Text features & badges (Col Span 7) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex gap-1 bg-[#ff6b2b]/10 text-[#ff6b2b] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Lives only in the LeetMaster app</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111111] dark:text-white tracking-tight">
                Challenges, on the go.
              </h2>
              <p className="text-gray-500 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
                Time-bound contests born inside LeetMaster cohorts. Submit your build, climb the live leaderboard, and earn gold, silver, or bronze badges plus the occasional surprise swag from the team. The whole experience lives in the LeetMaster app, on iOS and Android.
              </p>
            </div>

            {/* Bullet List */}
            <div className="space-y-4">
              {[
                { icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/10', title: 'Gold, silver, bronze badges per challenge', desc: 'Settle for nothing less than a podium finish to secure exclusive digital accolades.' },
                { icon: Flame, color: 'text-red-500 bg-red-50 dark:bg-red-950/10', title: 'Daily streak counters with reminders', desc: 'Receive motivational notifications so you never break your compounding momentum.' },
                { icon: MessageCircle, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/10', title: 'Tap into a town hall for that challenge', desc: 'Instantly bounce ideas inside dedicated voice rooms with contestants in real-time.' }
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${bullet.color} border border-black/5 dark:border-zinc-800`}>
                    <bullet.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black dark:text-white">{bullet.title}</h4>
                    <p className="text-xs text-gray-400 dark:text-zinc-400 mt-0.5">{bullet.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* App download badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-black hover:bg-slate-950 text-white px-5 py-3 rounded-2xl flex items-center gap-3 border-2 border-black/10 transition-all cursor-pointer">
                <SmartphoneIcon className="w-6 h-6 text-white" />
                <div className="text-left leading-none">
                  <div className="text-[9px] uppercase font-bold text-gray-400">Download on the</div>
                  <div className="text-xs font-black">App Store</div>
                </div>
              </button>
              <button className="bg-black hover:bg-slate-950 text-white px-5 py-3 rounded-2xl flex items-center gap-3 border-2 border-black/10 transition-all cursor-pointer">
                <SmartphoneIcon className="w-6 h-6 text-[#ff6b2b]" />
                <div className="text-left leading-none">
                  <div className="text-[9px] uppercase font-bold text-gray-400">Get it on</div>
                  <div className="text-xs font-black">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT: Mobile frame mockup (Col Span 5) */}
          <div className="lg:col-span-5 flex justify-center">
            
            {/* Phone Container Box */}
            <div className="relative w-[290px] h-[570px] bg-[#111111] rounded-[48px] p-3.5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.4)] border-4 border-[#333333] hover:rotate-[-1deg] transition-transform duration-500">
              
              {/* Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-40 flex items-center justify-center">
                <div className="w-12 h-1 bg-[#252525] rounded-full mb-1" />
              </div>

              {/* Inside Screen */}
              <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative flex flex-col justify-between z-30 font-sans border border-[#222]">
                
                {/* Status Bar */}
                <div className="px-5 pt-7 pb-2 flex justify-between items-center text-[10px] font-black text-black z-35 bg-white">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px]">LTE</span>
                    <span className="w-4 h-2 bg-black rounded-sm inline-block" />
                  </div>
                </div>

                {/* Main app viewport content */}
                <div className="flex-1 overflow-y-auto px-4 pb-20 relative space-y-4 pt-1">
                  
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-red-50 text-[#ff6b2b] px-2 py-0.5 rounded font-black uppercase tracking-wider">YouTube Daily</span>
                    <span className="text-[9px] text-gray-400 font-mono">Platform</span>
                  </div>

                  {/* Active Card: Prize info */}
                  <div className="bg-[#ff6b2b] text-white rounded-2xl p-4 shadow-sm border border-black/5 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-white/10 rounded-full" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-orange-100 block mb-0.5">Prize Pool</span>
                    <h4 className="text-base font-black">Surprise Swags</h4>
                  </div>

                  {/* Dynamic Timer Widget */}
                  <div className="bg-[#fcfbf9] border-2 border-black rounded-2xl p-3.5 text-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">time remaining</div>
                    <div className="grid grid-cols-4 gap-1.5 font-mono text-[#ff6b2b]">
                      <div>
                        <div className="text-base font-black leading-none">{timeLeft.days}d</div>
                      </div>
                      <div>
                        <div className="text-base font-black leading-none">{timeLeft.hours}h</div>
                      </div>
                      <div>
                        <div className="text-base font-black leading-none">{timeLeft.minutes}m</div>
                      </div>
                      <div>
                        <div className="text-base font-black leading-none text-black animate-pulse">{timeLeft.seconds}s</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Leaderboard list inside app */}
                  <div>
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                      <span>Leaderboard</span>
                      <span className="text-[9px] text-[#ff6b2b] font-bold">Top performers</span>
                    </h5>
                    
                    <div className="space-y-1.5">
                      {[
                        { name: 'Anirudh', rank: '👑 1', xp: '4,820 XP' },
                        { name: 'Shubham', rank: '🥈 2', xp: '4,210' },
                        { name: 'Kunal', rank: '3', xp: '3,985' }
                      ].map((lead, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-black/5 p-2 rounded-xl text-xs font-semibold text-black">
                          <span className="flex items-center gap-1.5">
                            <span className="text-gray-400 font-bold w-6">{lead.rank}</span>
                            <span>{lead.name}</span>
                          </span>
                          <span className="font-mono text-gray-400 text-[11px]">{lead.xp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Trigger Action bar */}
                <div className="absolute bottom-12 inset-x-0 px-4 bg-white/90 backdrop-blur-sm pt-2 pb-1 z-35">
                  <button
                    onClick={() => setShowMobileDrawer(true)}
                    className="w-full bg-[#ff6b2b] hover:bg-black text-white font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                  >
                    <span>Submit a challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile Mockup Tab Navigation Bar */}
                <div className="border-t border-gray-100 bg-white py-2.5 px-3 flex justify-around items-center z-35">
                  {['Home', 'Challenges', 'Problems', 'Profile'].map((tab, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5 cursor-pointer">
                      <div className={`w-1.5 h-1.5 rounded-full ${idx === 1 ? 'bg-[#ff6b2b]' : 'bg-gray-300'}`} />
                      <span className={`text-[8px] font-black uppercase ${idx === 1 ? 'text-[#ff6b2b]' : 'text-gray-400'}`}>
                        {tab}
                      </span>
                    </div>
                  ))}
                </div>

                {/* SLIDE-UP MOCKUP DRAWER */}
                <AnimatePresence>
                  {showMobileDrawer && (
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="absolute inset-x-0 bottom-0 bg-white border-t-4 border-black rounded-t-[32px] p-5 z-50 flex flex-col justify-between"
                      style={{ height: '70%' }}
                    >
                      <form onSubmit={handleMobileSubmit} className="space-y-4 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-black text-black uppercase tracking-wider">Submit Challenge</h4>
                          <button
                            type="button"
                            onClick={() => setShowMobileDrawer(false)}
                            className="text-xs text-gray-400 font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Github Repository</label>
                          <div className="relative">
                            <Github className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                              type="url"
                              value={githubUrl}
                              onChange={(e) => setGithubUrl(e.target.value)}
                              required
                              placeholder="github.com/user/project"
                              className="w-full bg-slate-50 border-2 border-black rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-black/5 rounded-2xl p-3 text-[10px] text-gray-500 leading-normal">
                          By submitting, your repo enters Masterji's AI assessment pipeline immediately.
                        </div>

                        {submitted ? (
                          <div className="text-center text-xs font-bold text-green-600 py-3 flex items-center justify-center gap-1.5">
                            <Send className="w-3.5 h-3.5 animate-bounce" />
                            <span>Build Submitted!</span>
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="w-full bg-black text-white font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer mt-4"
                          >
                            <span>Send Submission</span>
                          </button>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
