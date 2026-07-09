import React from 'react';
import { motion } from 'motion/react';
import { FileSpreadsheet, ChevronRight, Layers, Brain, Code, Terminal, Sparkles } from 'lucide-react';

interface CuratedSheetsLandingProps {
  onNavigate: (path: string) => void;
}

export default function CuratedSheetsLanding({ onNavigate }: CuratedSheetsLandingProps) {
  const categories = [
    {
      title: "Data Structures Essentials",
      description: "Master foundational building blocks and basic memory layouts.",
      icon: Layers,
      color: "from-blue-500/10 to-indigo-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
      sheets: [
        "Array Patterns Unlocked",
        "Two-Pointer Tactics",
        "Sliding Window Pack",
        "Stack Engineering",
        "Matrix Moves",
        "Two Pointers"
      ]
    },
    {
      title: "Advanced Patterns",
      description: "Learn smart algorithms to solve complex interview questions.",
      icon: Brain,
      color: "from-purple-500/10 to-pink-500/10",
      textColor: "text-purple-600 dark:text-purple-400",
      sheets: [
        "Interview Patterns 101",
        "Binary Search Bootcamp",
        "Prefix Sum Mastery",
        "Hash Map Playbook",
        "Bitwise Brilliance",
        "Greedy Gameplan"
      ]
    },
    {
      title: "Dynamic Programming & Graphs",
      description: "Master optimization, recursion, and relational traversals.",
      icon: Code,
      color: "from-[#ff6b2b]/10 to-amber-500/10",
      textColor: "text-[#ff6b2b] dark:text-[#ff804a]",
      sheets: [
        "DP Essentials",
        "Grid & Path DP",
        "String & Sequence DP",
        "Advanced & Hard DP",
        "Graph Adventures",
        "Google-Style Challenges",
        "LeetMaster 75"
      ]
    }
  ];

  return (
    <section className="py-24 bg-[#faf9f6] dark:bg-zinc-950 dark:text-white border-t border-[#f2efe9] dark:border-zinc-800 transition-colors relative overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#ff6b2b]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-950/30 border border-[#ff6b2b]/20 text-[#ff6b2b] dark:text-[#ff804a] rounded-full text-xs font-black uppercase tracking-wider font-mono">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Curated Coding Sheets
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-stone-900 dark:text-white tracking-tight">
            Structure Your DSA Journey.
          </h2>
          <p className="text-stone-550 dark:text-zinc-300 text-base sm:text-lg font-medium leading-relaxed">
            Stop solving random problems. Follow our structured, peer-powered sheets curated specifically for competitive programmers and tech giants' interviews.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900/40 border border-stone-200/80 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-[#ff6b2b]/30 dark:hover:border-orange-500/20 transition-all duration-300 relative"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-stone-100 dark:border-zinc-800/80">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} ${category.textColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-stone-900 dark:text-white group-hover:text-[#ff6b2b] dark:group-hover:text-orange-400 transition-colors leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-[11px] text-stone-400 dark:text-zinc-400 font-medium mt-0.5">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Sheet Names list */}
                  <div className="space-y-2 mb-6">
                    {category.sheets.map((sheetName) => (
                      <div
                        key={sheetName}
                        onClick={() => onNavigate('/dsa-sheets')}
                        className="flex items-center justify-between p-3 bg-stone-50 hover:bg-orange-50/50 dark:bg-zinc-900/20 dark:hover:bg-orange-950/10 border border-stone-150/60 dark:border-zinc-800/50 rounded-2xl transition-all cursor-pointer group/item hover:border-[#ff6b2b]/40 dark:hover:border-orange-500/30"
                      >
                        <span className="text-[13px] font-extrabold text-stone-800 dark:text-stone-200 group-hover/item:text-[#ff6b2b] dark:group-hover/item:text-orange-400 transition-colors truncate">
                          {sheetName}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-[#ff6b2b] group-hover/item:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA for Category */}
                <button
                  onClick={() => onNavigate('/dsa-sheets')}
                  className="w-full mt-2 py-3 bg-stone-900 hover:bg-[#ff6b2b] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Path</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Global CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-orange-500 to-[#ff6b2b] dark:from-orange-600 dark:to-orange-500 text-white p-8 md:p-10 rounded-3xl shadow-lg border border-orange-600/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Subtle graphical glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black font-sans tracking-tight">Ready to Master All Sheets?</h3>
            <p className="text-white/80 text-xs md:text-sm font-medium">
              Join thousands of scholars solving challenges, building high-quality projects, writing code reviews, and securing premium tech job offers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/dsa-sheets')}
            className="px-8 py-4 bg-white text-stone-900 hover:bg-stone-50 font-black text-xs md:text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2 flex-shrink-0"
          >
            <Terminal className="w-4 h-4 text-[#ff6b2b]" />
            <span>Launch Interactive Workspace</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
