import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, Info, MessageSquare } from 'lucide-react';

export default function CommunityConsistency() {
  // Mock contribution heatmap data for "Last Seven weeks"
  // 7 rows (Sunday - Saturday), 7 columns
  const initialGrid = Array.from({ length: 7 }, (_, r) => 
    Array.from({ length: 7 }, (_, c) => {
      // randomly assign levels 0-4 for realistic initial look
      const val = (r + c) % 5;
      return val === 4 ? 3 : val; // skew slightly towards mid orange
    })
  );

  const [grid, setGrid] = useState<number[][]>(initialGrid);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number; level: number } | null>(null);
  const [streakCount, setStreakCount] = useState(127);

  const toggleCell = (r: number, c: number) => {
    const newGrid = [...grid];
    const current = newGrid[r][c];
    const next = (current + 1) % 4; // rotate 0 -> 1 -> 2 -> 3
    newGrid[r][c] = next;
    setGrid(newGrid);

    // change streak dynamically for a fun interactive punch
    if (next > 0 && current === 0) {
      setStreakCount(prev => prev + 1);
    } else if (next === 0 && current > 0) {
      setStreakCount(prev => Math.max(0, prev - 1));
    }
  };

  const getCellColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-orange-200/60 dark:bg-orange-300/20 border border-orange-300/40 hover:bg-orange-300';
      case 2: return 'bg-orange-400 dark:bg-orange-400/60 border border-orange-500/40 hover:bg-orange-500';
      case 3: return 'bg-[#ff6b2b] border border-orange-600/40 hover:bg-[#e05316]';
      default: return 'bg-[#f7f5ef] dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700';
    }
  };

  return (
    <section className="py-24 bg-[#fcfbf9] dark:bg-zinc-950 dark:text-white border-t border-b border-[#f2efe9] dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111111] dark:text-white tracking-tight">
            Community and Consistency.
          </h2>
          <p className="text-[#666] dark:text-zinc-300 text-base sm:text-lg font-medium leading-relaxed">
            Skip a day, your community pulls you back. Solve a hard one, your community celebrates.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: A community that shows up */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div className="space-y-4">
              <span className="inline-flex p-2.5 bg-black dark:bg-zinc-800 rounded-2xl text-white">
                <Users className="w-5 h-5 text-white" />
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
                A community that shows up
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed">
                Town halls with Voice Rooms. Peer reviews on every submission. The chat never goes quiet, because someone is also stuck on the same problem.
              </p>
            </div>

            {/* Interactive graphic */}
            <div className="mt-10 p-6 bg-[#fcfbf9] dark:bg-zinc-950 border border-black/5 dark:border-zinc-800 rounded-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  {/* Overlapping avatar circles */}
                  <div className="flex items-center -space-x-2.5">
                    {[
                      { bg: 'bg-indigo-500', char: 'R' },
                      { bg: 'bg-green-500', char: 'S' },
                      { bg: 'bg-pink-500', char: 'A' },
                      { bg: 'bg-yellow-500', char: 'K' },
                      { bg: 'bg-purple-500', char: 'N' }
                    ].map((item, idx) => (
                      <div key={idx} className={`w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 ${item.bg} flex items-center justify-center text-xs font-black text-white`}>
                        {item.char}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-[#ff6b2b] flex items-center justify-center text-[10px] font-black text-white">
                      +10k
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <div className="text-sm font-extrabold text-black dark:text-white">50,000+ Coders</div>
                    <div className="text-[11px] font-bold text-gray-400 dark:text-zinc-500">Hackathon - 40 Voice Rooms Live</div>
                  </div>
                </div>

                {/* Simulated live feedback speech bubbles */}
                <div className="w-full sm:w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-3 rounded-xl shadow-sm flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                    A
                  </div>
                  <div className="text-[11px] leading-tight text-gray-700 dark:text-zinc-300">
                    <span className="font-bold text-black dark:text-white block mb-0.5">Aman</span>
                    "memoize the helper, <span className="font-mono bg-orange-50 dark:bg-orange-950/20 text-[#ff6b2b] px-1 py-0.2 rounded font-bold">O(n)</span> instead"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Consistency that compounds */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div className="space-y-4">
              <span className="inline-flex p-2.5 bg-black dark:bg-zinc-800 rounded-2xl text-white">
                <Calendar className="w-5 h-5 text-white" />
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
                Consistency that compounds
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed">
                Daily streaks, gentle nudges, and a system that rewards you for showing up. We track the line, you walk it.
              </p>
            </div>

            {/* Interactive heatmap grid */}
            <div className="mt-10 p-6 bg-[#fcfbf9] dark:bg-zinc-950 border border-black/5 dark:border-zinc-800 rounded-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3 mb-4">
                <span className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">Last Seven weeks</span>
                <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
                  <span className="text-[#ff6b2b] font-black">{streakCount} day</span> streak
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                {/* Heatmap Layout */}
                <div className="grid grid-rows-7 grid-flow-col gap-1.5 p-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm">
                  {grid.map((row, r) => 
                    row.map((cell, c) => (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => toggleCell(r, c)}
                        onMouseEnter={() => setHoveredCell({ r, c, level: cell })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md cursor-pointer transition-colors duration-150 relative ${getCellColor(cell)}`}
                        title="Click to toggle level!"
                      />
                    ))
                  )}
                </div>

                {/* Heatmap Metadata & Legend */}
                <div className="mt-4 flex items-center justify-between w-full text-xs font-semibold text-gray-400 px-1">
                  <span>Less</span>
                  <div className="flex items-center gap-1 mx-2">
                    <span className="w-3 h-3 rounded bg-[#f7f5ef] dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700" />
                    <span className="w-3 h-3 rounded bg-orange-200/60" />
                    <span className="w-3 h-3 rounded bg-orange-400" />
                    <span className="w-3 h-3 rounded bg-[#ff6b2b]" />
                  </div>
                  <span>More</span>
                </div>

                {/* Interactive Tooltip helper */}
                <p className="mt-3 text-[10px] text-gray-400 font-medium flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>Interactive: Click cells to log code runs!</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
