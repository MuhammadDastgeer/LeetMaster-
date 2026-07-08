import { motion } from 'motion/react';
import { 
  Play, Sparkles, Award, Star, ArrowUpRight, Trophy, 
  Brain, FileText, GraduationCap, Flame, Code, Users, BookOpen, Clock, ChevronRight
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
    <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-stone-50 via-[#fcfbfa] to-stone-50 dark:from-[#0d0c0a] dark:via-[#141311] dark:to-[#0d0c0a] transition-colors duration-500">
      
      {/* Decorative premium background grid & radial light flares */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff6b2b08_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#ff6b2b0f_1px,transparent_1px)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#ff6b2b]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Main Grid: Copy on Left, Mascot & Streak/Live-Tracker on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Hero Content Section */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/20 border border-[#ff6b2b]/20 text-[#ff6b2b] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b2b]"></span>
              </span>
              <span>Peer-Powered Development Hub</span>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-sans font-black text-stone-900 dark:text-white leading-[1.1] tracking-tight"
              >
                Code together. <br />
                Accelerate <span className="text-[#ff6b2b] relative inline-block">
                  faster
                  <svg className="absolute -bottom-2.5 left-0 w-full h-2.5 text-[#ff6b2b]" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,7 C30,2 70,2 100,7" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-stone-600 dark:text-stone-350 text-base sm:text-lg font-medium max-w-2xl leading-relaxed"
              >
                LeetMaster brings together top-tier developer talent to solve DSA problems, build full-stack projects, write engineering blogs, and participate in graded live hackathons.
              </motion.p>
            </div>

            {/* Main Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => handleRedirect('/dashboard')}
                className="w-full sm:w-auto bg-stone-900 dark:bg-stone-100 dark:text-stone-900 text-stone-50 hover:bg-[#ff6b2b] dark:hover:bg-[#ff6b2b] dark:hover:text-white font-black px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-[#ff6b2b]/15 text-center flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 text-xs uppercase tracking-wider"
              >
                <span>Enter Developer Workspace</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-mono text-xs font-bold bg-stone-100/60 dark:bg-stone-900/40 px-5 py-3 rounded-full border border-stone-200/50 dark:border-stone-800/50">
                <Users className="w-4 h-4 text-[#ff6b2b]" />
                <span>3,820 Active Scholars Online</span>
              </div>
            </motion.div>
          </div>

          {/* Right Mascot & Floating Widgets */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-8 lg:py-0">
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]">
              
              {/* Outer decorative glowing ring */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#ff6b2b]/20 to-yellow-500/15 blur-2xl animate-pulse" />

              {/* Main Mascot Image Container with premium frame */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-8 rounded-full bg-white dark:bg-stone-900 border-4 border-stone-900 dark:border-stone-850 shadow-[10px_10px_0px_0px_#ff6b2b] dark:shadow-[10px_10px_0px_0px_rgba(255,107,43,0.3)] overflow-hidden flex items-center justify-center z-10 hover:rotate-2 hover:scale-[1.02] transition-all duration-300"
              >
                <img
                  src="/src/assets/images/leetmaster_mascot_1783434307641.jpg"
                  alt="LeetMaster Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* FLOATING BADGE 1: Daily Streak counter */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -top-4 -left-4 sm:left-0 bg-stone-900 dark:bg-stone-850 text-white border-2 border-[#ff6b2b]/80 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2.5 z-20 hover:-translate-y-1 transition-transform"
              >
                <div className="w-8 h-8 bg-[#ff6b2b] rounded-xl flex items-center justify-center text-white font-extrabold text-sm border border-stone-800">
                  🔥
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-stone-400 leading-none">STREAK SPEED</div>
                  <div className="text-xs font-black leading-none mt-1 text-white">127 Days Strong</div>
                </div>
              </motion.div>

              {/* FLOATING CARD 2: Quick peer reviews indicator */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 45 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-2 -right-6 bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-800 rounded-2xl p-3.5 shadow-2xl w-52 z-20 hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-1.5 mb-1.5 justify-between">
                  <span className="text-[9px] font-black tracking-widest text-[#ff6b2b] uppercase">Leaderboard</span>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="space-y-1 font-mono text-[10px] font-bold text-stone-600 dark:text-stone-350">
                  <div className="flex justify-between">
                    <span>1. Rohan S.</span>
                    <span className="text-stone-900 dark:text-white">4.8k XP</span>
                  </div>
                  <div className="flex justify-between text-[#ff6b2b]">
                    <span>2. You</span>
                    <span>3.9k XP</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* INTERACTIVE HUB PORTAL GRID (Redesigned as beautiful cards) */}
        <div className="space-y-6 pt-8 border-t border-stone-200/60 dark:border-stone-800/60">
          <div className="text-center sm:text-left">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#ff6b2b] font-mono">
              Direct Quick Access Hub
            </h2>
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400 mt-1">
              Select a core community portal below to navigate instantly
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* PORTAL 1: HACKATHONS */}
            <div
              onClick={() => handleRedirect('/hackathons-dashboard')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[180px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Hackathons Hub
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    Join live hackathons, form squads, code solutions, and get auto-graded by our system.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono">
                  Enter Hackathons &rarr;
                </span>
                <span className="text-[9px] font-bold bg-[#ff6b2b]/10 text-[#ff6b2b] px-2 py-0.5 rounded-full font-mono">
                  Live Now
                </span>
              </div>
            </div>

            {/* PORTAL 2: SCHOLAR QUIZ */}
            <div
              onClick={() => handleRedirect('/quiz-tab')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[180px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Scholar Quizzes
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    Test your memory and logic on arrays, trees, heaps, and algorithmic complexity.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono">
                  Start Quiz &rarr;
                </span>
                <span className="text-[9px] font-bold bg-[#ff6b2b]/10 text-[#ff6b2b] px-2 py-0.5 rounded-full font-mono">
                  +20 XP
                </span>
              </div>
            </div>

            {/* PORTAL 3: BLOGS */}
            <div
              onClick={() => handleRedirect('/blogs')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[180px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Developer Blogs
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    Read career roadmaps, system design blueprints, and optimization logs shared by peers.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono">
                  Read Articles &rarr;
                </span>
                <span className="text-[9px] font-bold bg-[#ff6b2b]/10 text-[#ff6b2b] px-2 py-0.5 rounded-full font-mono">
                  Updates Weekly
                </span>
              </div>
            </div>

            {/* PORTAL 4: COURSES (STAYS) */}
            <div
              onClick={() => handleRedirect('/courses')}
              className="group cursor-pointer p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-stone-900 hover:border-[#ff6b2b] hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[180px] hover:scale-[1.01]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6b2b]/5 rounded-bl-full transition-transform group-hover:scale-110" />
              
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white tracking-tight group-hover:text-[#ff6b2b] transition-colors">
                    Cohort Academy
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    Premium structured cohort curriculum to master algorithms, deployment, and systems.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-850">
                <span className="text-[10px] font-black text-[#ff6b2b] uppercase font-mono">
                  View Syllabus &rarr;
                </span>
                <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-mono">
                  Premium
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
