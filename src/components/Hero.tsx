import { motion } from 'motion/react';
import { Play, Sparkles, Award, Star, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white via-[#fcfbf9] to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 bg-[#ff6b2b]/10 text-[#ff6b2b] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>India's Peer-Powered Tech Community</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-5xl sm:text-6xl font-sans font-extrabold text-[#111111] dark:text-white leading-[1.1] tracking-tight"
            >
              Practice never <br />
              feels lonely{' '}
              <span className="font-display italic text-[#ff6b2b] relative inline-block">
                here
                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-[#ff6b2b]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,7 C30,2 70,2 100,7" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#4a4a4a] dark:text-zinc-300 text-lg sm:text-xl font-medium max-w-xl leading-relaxed"
            >
              LeetMaster is the coding community where every problem, challenge, and milestone is better with peers who get it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <a
                href="/dsa-sheets"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('dsa-sheets')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-black dark:bg-zinc-800 text-white hover:bg-[#ff6b2b] font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#ff6b2b]/15 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="/download"
                onClick={(e) => e.preventDefault()}
                className="w-full sm:w-auto bg-[#f2efe9] dark:bg-zinc-800 text-black dark:text-white hover:bg-black hover:text-white font-bold px-8 py-4 rounded-full transition-all duration-300 text-center cursor-pointer"
              >
                Download App
              </a>
            </motion.div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-10 lg:py-0">
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]">
              
              {/* Outer decorative glowing ring */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#ff6b2b]/10 to-yellow-500/10 blur-2xl animate-pulse" />

              {/* Main Mascot Image Container */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-10 rounded-full bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 shadow-[8px_8px_0px_0px_#111111] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden flex items-center justify-center z-10 hover:rotate-3 transition-transform duration-300"
              >
                <img
                  src="/src/assets/images/leetmaster_mascot_1783434307641.jpg"
                  alt="LeetMaster Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* FLOATING BADGE 1: Current Streak */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute top-2 left-2 sm:left-6 bg-[#ff6b2b] text-white border-2 border-black dark:border-zinc-800 rounded-2xl px-3.5 py-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center gap-2 z-20 hover:-translate-y-1 transition-transform"
              >
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[#ff6b2b] font-extrabold text-sm border border-black">
                  🔥
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-orange-100 leading-none">Current streak</div>
                  <div className="text-sm font-black leading-none">127 days</div>
                </div>
              </motion.div>

              {/* FLOATING CARD 2: Weekly Leaderboard */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: -40 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-8 right-2 sm:-right-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] w-48 z-20 hover:scale-105 transition-transform"
              >
                <h4 className="text-[9px] font-black tracking-wider text-[#777] dark:text-zinc-400 uppercase border-b border-gray-100 dark:border-zinc-800 pb-1.5 mb-2 flex items-center justify-between">
                  <span>Leaderboard - This Week</span>
                  <Award className="w-3 h-3 text-[#ff6b2b]" />
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="text-yellow-500 font-extrabold text-[11px]">1</span>
                      <span className="text-[#111] dark:text-zinc-100">Anirudh</span>
                    </span>
                    <span className="font-mono text-[11px] text-gray-500 dark:text-zinc-400">4,820</span>
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="text-gray-400 font-extrabold text-[11px]">2</span>
                      <span className="text-[#111] dark:text-zinc-100">Shubham</span>
                    </span>
                    <span className="font-mono text-[11px] text-gray-500 dark:text-zinc-400">4,210</span>
                  </div>
                  <div className="flex items-center justify-between bg-orange-50/70 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-900/30 rounded p-1 font-bold text-[#ff6b2b]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-orange-500 text-[11px]">3</span>
                      <span>You</span>
                    </span>
                    <span className="font-mono text-[11px]">3,985</span>
                  </div>
                </div>
              </motion.div>

              {/* FLOATING CARD 3: Review Bubble */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 40 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-8 left-0 sm:-left-8 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] w-60 z-20 hover:-rotate-1 transition-transform"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#ff6b2b] flex items-center justify-center text-[10px] font-bold text-white font-mono">L</div>
                  <span className="text-[11px] font-bold text-black dark:text-white">LeetMaster</span>
                  <span className="text-[10px] text-gray-400">reviewed</span>
                  <span className="ml-auto text-[9px] bg-green-50 dark:bg-green-550/10 text-green-600 font-extrabold px-1 py-0.5 rounded border border-green-200 dark:border-green-900/30">+12 XP</span>
                </div>
                <p className="text-[10px] font-medium text-gray-600 dark:text-zinc-300 leading-normal italic font-mono">
                  "Clean recursion. Try memoizing the helper - we go from O(2^n) to O(n)."
                </p>
              </motion.div>

              {/* FLOATING BADGE 4: Live Quiz Ticker */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute -bottom-2 sm:bottom-2 right-4 sm:-right-4 bg-[#fffefe] dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-full px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] z-20 flex items-center gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[11px] font-black text-black dark:text-white">Live Quiz <span className="text-gray-400 font-medium">· 384 in</span></span>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
