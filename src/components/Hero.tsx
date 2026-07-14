import { motion } from 'motion/react';
import mascotImage from '../assets/images/leetmaster_mascot_1783434307641.jpg';
import { 
  Trophy, Brain, FileText, GraduationCap, ArrowRight, Sparkles, 
  Flame, Award, Star, ShieldCheck, Users, Code, Monitor, BookOpen,
  MessageSquare
} from 'lucide-react';

interface HeroProps {
  onNavigate?: (path: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const handleRedirect = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-[#faf9f6] dark:bg-[#0c0a09] transition-colors duration-500">
      {/* Dynamic Background Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff6b2b08_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#ff6b2b0d_1px,transparent_1px)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[5%] w-[40vw] h-[40vw] bg-gradient-to-tr from-[#ff6b2b]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[5%] w-[45vw] h-[45vw] bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* TOP ROW: Split Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Copy, Value Proposition, Action Buttons */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            
            {/* Interactive Live Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/15 border border-[#ff6b2b]/15 text-[#ff6b2b] px-4.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest font-mono"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b2b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b2b]"></span>
              </span>
              <span>Next-Gen Developer Playground Active</span>
            </motion.div>

            {/* Typography Masterclass */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-sans font-black text-stone-900 dark:text-white leading-[1.1] tracking-tight"
              >
                Assemble, build, and <br />
                <span className="text-[#ff6b2b] relative inline-block">
                  conquer algorithms
                  <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-[#ff6b2b]" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,7 C30,2 70,2 100,7" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-stone-600 dark:text-stone-400 text-sm sm:text-base font-medium max-w-xl leading-relaxed"
              >
                LeetMaster brings together top-tier global developers in a shared real-time ecosystem. Solve structured DSA sheets, build production-grade projects, write technical blogs, and compete in auto-graded live coding hackathons.
              </motion.p>
            </div>

            {/* Premium CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2"
            >
              <button
                onClick={() => handleRedirect('/dashboard')}
                className="group w-full sm:w-auto bg-stone-900 hover:bg-[#ff6b2b] dark:bg-stone-50 dark:text-stone-950 dark:hover:bg-[#ff6b2b] dark:hover:text-white text-stone-50 font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-[#ff6b2b]/15 text-center flex items-center justify-center gap-3 cursor-pointer active:scale-95 text-xs uppercase tracking-widest"
              >
                <span>Enter Main Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <div className="flex items-center gap-2.5 text-stone-600 dark:text-stone-400 font-mono text-xs font-black bg-stone-100/65 dark:bg-stone-900/40 px-5 py-3.5 rounded-2xl border border-stone-200/50 dark:border-stone-850">
                <Users className="w-4 h-4 text-[#ff6b2b] animate-pulse" />
                <span>3,940 scholars online now</span>
              </div>
            </motion.div>

            {/* Features list under CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 pt-6 w-full max-w-md font-mono text-[10px] font-bold text-stone-500 uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Graded Code Sandboxes</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SQLite Local Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Auto-curated DSA Sheets</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Peer evaluation forum</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT: Mascot with Streak & Leaderboard Overlay */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-8 lg:py-0">
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
              
              {/* Spinning cosmic glowing background ring */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#ff6b2b]/20 to-amber-500/10 blur-3xl animate-pulse" />

              {/* Mascot container card */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-8 rounded-full bg-white dark:bg-stone-900 border-[3px] border-stone-900 dark:border-stone-800 shadow-[12px_12px_0px_0px_#ff6b2b] dark:shadow-[12px_12px_0px_0px_rgba(255,107,43,0.25)] overflow-hidden flex items-center justify-center z-10 hover:rotate-1 hover:scale-[1.01] transition-all duration-300"
              >
                <img
                  src={mascotImage}
                  alt="LeetMaster Scholar Mascot"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback avatar if asset is not found
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  referrerPolicy="no-referrer"
                />
                {/* Fallback Mascot Art if the image is missing */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b2b]/10 to-amber-500/10 flex flex-col items-center justify-center text-stone-400 font-bold p-6 text-center">
                  <span className="text-4xl">🦉</span>
                  <p className="text-xs font-black tracking-widest text-[#ff6b2b] uppercase font-mono mt-2">LeetMaster Mentor</p>
                </div>
              </motion.div>

              {/* FLOATING CARD 1: Flame Streak Meter */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -top-2 -left-2 bg-stone-900 dark:bg-stone-900 text-white border-2 border-[#ff6b2b]/80 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 z-20 hover:-translate-y-1 transition-transform"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-[#ff6b2b] rounded-xl flex items-center justify-center text-white font-extrabold text-base border border-stone-800 shadow">
                  🔥
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-stone-400 leading-none">STREAK PACE</div>
                  <div className="text-xs font-black leading-none mt-1.5 text-white font-mono">128 Days Unbroken</div>
                </div>
              </motion.div>

              {/* FLOATING CARD 2: Interactive leader stats board */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 40 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-4 -right-4 bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-800 rounded-2xl p-4 shadow-2xl w-56 z-20 hover:scale-[1.03] transition-all"
              >
                <div className="flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2 mb-2 justify-between">
                  <span className="text-[9px] font-black tracking-widest text-[#ff6b2b] uppercase font-mono">Elite Scholar Ranking</span>
                  <Award className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                </div>
                <div className="space-y-1.5 font-mono text-[10px] font-bold text-stone-600 dark:text-stone-400">
                  <div className="flex justify-between items-center">
                    <span>1. Rohan S.</span>
                    <span className="text-stone-900 dark:text-white px-1.5 py-0.5 rounded bg-stone-50 dark:bg-stone-850">4.8k XP</span>
                  </div>
                  <div className="flex justify-between items-center text-[#ff6b2b]">
                    <span>2. Dastgeer (You)</span>
                    <span className="text-white bg-[#ff6b2b] px-1.5 py-0.5 rounded font-black">4.1k XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>3. Kavya N.</span>
                    <span className="text-stone-900 dark:text-white px-1.5 py-0.5 rounded bg-stone-50 dark:bg-stone-850">3.8k XP</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Dynamic Navigation Portal Grid (Redesigned completely as high-end SaaS modules) */}
        <div className="space-y-6 pt-12 border-t border-stone-200/70 dark:border-stone-800/70">
          <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-[#ff6b2b] font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Direct Workspace Portals</span>
              </h2>
              <p className="text-sm font-black text-stone-500 dark:text-stone-400 mt-1">
                Select an interactive hub below to navigate and open the active workspace tab.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* HUB CARD 1: HACKATHONS */}
            <div
              onClick={() => handleRedirect('/hackathons-dashboard')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[195px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3.5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Hackathons Hub
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Participate in graded hackathons, construct custom challenges, or configure visibility status.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Enter All Hackathons</span>
                  <span>&rarr;</span>
                </span>
                <span className="text-[9px] font-bold bg-[#ff6b2b]/10 text-[#ff6b2b] px-2 py-0.5 rounded-full font-mono">
                  Live Graded
                </span>
              </div>
            </div>

            {/* HUB CARD 2: SCHOLAR QUIZ */}
            <div
              onClick={() => handleRedirect('/quiz-tab')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[195px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3.5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Scholar Quizzes
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Examine your memory on complexity bounds, tree balancing, and optimization paradigms.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Start Quiz Tab</span>
                  <span>&rarr;</span>
                </span>
                <span className="text-[9px] font-bold bg-[#ff6b2b]/10 text-[#ff6b2b] px-2 py-0.5 rounded-full font-mono">
                  +30 XP
                </span>
              </div>
            </div>

            {/* HUB CARD 3: BLOGS (REPLACED STORIES) */}
            <div
              onClick={() => handleRedirect('/blogs')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[195px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3.5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Developer Blogs
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Write peer tutorials, post micro-articles, or set public/private status on your writeups.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Read Blogs Hub</span>
                  <span>&rarr;</span>
                </span>
                <span className="text-[9px] font-bold bg-[#ff6b2b]/10 text-[#ff6b2b] px-2 py-0.5 rounded-full font-mono">
                  SaaS Feed
                </span>
              </div>
            </div>

            {/* HUB CARD 4: COMMUNITY DISCUSSION */}
            <div
              onClick={() => handleRedirect('/discuss')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[195px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3.5 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Discussion Forum
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Ask technical queries, share code blocks, ask career questions, and interact with peers.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Join Discussion</span>
                  <span>&rarr;</span>
                </span>
                <span className="text-[9px] font-bold bg-[#ff6b2b]/10 text-[#ff6b2b] px-2.5 py-0.5 rounded-full font-mono">
                  ● Active
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
