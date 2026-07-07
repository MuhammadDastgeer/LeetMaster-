import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, CheckCircle, Star, Sparkles, Send } from 'lucide-react';

export default function AssignmentEvaluation() {
  const [marks, setMarks] = useState(92);
  const [writing, setWriting] = useState(5);
  const [codeQuality, setCodeQuality] = useState(4);
  const [feedback, setFeedback] = useState(
    "Solid use of useEffect cleanup. Variable naming on lines 14-22 could be clearer. Markdown was crisp."
  );
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const triggerUpdateAnim = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 800);
  };

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 dark:text-white transition-colors border-b border-[#f2efe9] dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111111] dark:text-white tracking-tight">
            They evaluate your assignment.<br className="hidden sm:inline" /> You rate the evaluation.
          </h2>
          <p className="text-[#666] dark:text-zinc-300 text-base sm:text-lg font-medium leading-relaxed">
            Submit an assignment, a peer or moderator scores it on marks, writing, and code quality, then you rate how useful the evaluation was.
          </p>
        </div>

        {/* Evaluation Side-by-Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Left Panel: Provide Evaluation */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">provide evaluation</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/30">
                  pending
                </span>
              </div>

              {/* Submission Heading */}
              <div className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-4 border border-black/5 dark:border-zinc-800/60 rounded-2xl mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                  JC
                </div>
                <div>
                  <h4 className="text-sm font-black text-black dark:text-white">Jnanachand's Submission</h4>
                  <p className="text-[11px] text-[#ff6b2b] font-bold">Assignment 04: React useEffect deep-dive</p>
                </div>
                <span className="ml-auto text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-mono px-1.5 py-0.5 rounded border dark:border-zinc-700">
                  #repo
                </span>
              </div>

              {/* Interactive Sliders */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                    <span>Marks</span>
                    <span className="font-mono text-[#ff6b2b]">{marks}/100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={marks}
                    onChange={(e) => {
                      setMarks(Number(e.target.value));
                      triggerUpdateAnim();
                    }}
                    className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-[#ff6b2b]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                    <span>Writing rating</span>
                    <span className="font-mono text-[#ff6b2b]">{writing}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={writing}
                    onChange={(e) => {
                      setWriting(Number(e.target.value));
                      triggerUpdateAnim();
                    }}
                    className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-[#ff6b2b]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                    <span>Code quality</span>
                    <span className="font-mono text-[#ff6b2b]">{codeQuality}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={codeQuality}
                    onChange={(e) => {
                      setCodeQuality(Number(e.target.value));
                      triggerUpdateAnim();
                    }}
                    className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-[#ff6b2b]"
                  />
                </div>

                {/* Feedback Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">
                    Feedback (markdown)
                  </label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value);
                      triggerUpdateAnim();
                    }}
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-xs font-medium text-gray-700 dark:text-zinc-300 focus:ring-1 focus:ring-black focus:outline-none resize-none font-sans"
                    placeholder="Provide constructive feedback..."
                  />
                </div>
              </div>
            </div>

            {/* Evaluator Footer */}
            <div className="flex items-center justify-between border-t border-black/5 dark:border-zinc-800 pt-5 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ff6b2b] text-white flex items-center justify-center text-xs font-bold font-mono">
                  N
                </div>
                <div>
                  <h5 className="text-[11px] font-black leading-none text-black dark:text-white">Niraj</h5>
                  <p className="text-[9px] text-gray-400 dark:text-zinc-500 leading-none mt-1">peer-evaluator</p>
                </div>
              </div>
              <button
                onClick={triggerUpdateAnim}
                className="bg-black dark:bg-zinc-800 hover:bg-[#ff6b2b] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
              >
                <span>Save Grades</span>
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Panel: Your Evaluation */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] flex flex-col justify-between relative overflow-hidden">
            {isUpdating && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff6b2b] animate-pulse" />
            )}
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">your evaluation</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold px-2.5 py-1 rounded-full border dark:border-zinc-750">
                    received
                  </span>
                </div>
              </div>

              {/* Evaluated By */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#ff6b2b] text-white flex items-center justify-center text-xs font-bold font-mono">
                  N
                </div>
                <div>
                  <h4 className="text-xs font-black text-black dark:text-white">By Niraj</h4>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500">peer-evaluator · same cohort</p>
                </div>
              </div>

              {/* Scores display */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#fcfbf9] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/65 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Marks</div>
                  <div className="text-lg font-black text-black dark:text-white font-mono">{marks}<span className="text-xs font-medium text-gray-400">/100</span></div>
                </div>
                <div className="bg-[#fcfbf9] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/65 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Writing</div>
                  <div className="text-lg font-black text-black dark:text-white font-mono">{writing}<span className="text-xs font-medium text-gray-400">/5</span></div>
                </div>
                <div className="bg-[#fcfbf9] dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/65 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Code Quality</div>
                  <div className="text-lg font-black text-black dark:text-white font-mono">{codeQuality}<span className="text-xs font-medium text-gray-400">/5</span></div>
                </div>
              </div>

              {/* Written Feedback Display */}
              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 min-h-[80px]">
                <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Feedback review</div>
                <p className="text-xs font-medium text-slate-700 dark:text-zinc-300 leading-relaxed font-mono">
                  {feedback || "Evaluator is writing feedback..."}
                </p>
              </div>
            </div>

            {/* Rate this evaluation */}
            <div className="border-t border-black/5 dark:border-zinc-800 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h5 className="text-[11px] font-black text-black dark:text-white uppercase tracking-wider leading-none mb-1">rate this evaluation</h5>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-none">Your feedback helps improve reviewers</p>
              </div>

              {/* Star interactive selection */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <button
                    key={starIdx}
                    onClick={() => setStars(starIdx)}
                    onMouseEnter={() => setHoveredStar(starIdx)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="p-1 rounded transition-transform active:scale-95 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        starIdx <= (hoveredStar ?? stars)
                          ? 'fill-[#ff6b2b] text-[#ff6b2b]'
                          : 'text-gray-300 dark:text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Steps footer list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100 dark:border-zinc-800">
          <div>
            <div className="text-2xl font-sans font-black text-[#ff6b2b] mb-2">01</div>
            <h4 className="text-sm font-black text-[#111111] dark:text-white mb-1">Marks, writing, code quality</h4>
            <p className="text-gray-500 dark:text-zinc-400 text-xs leading-relaxed">
              Three numeric ratings plus markdown feedback. Sliders, not stars, so reviewers evaluate accurately.
            </p>
          </div>

          <div>
            <div className="text-2xl font-sans font-black text-[#ff6b2b] mb-2">02</div>
            <h4 className="text-sm font-black text-[#111111] dark:text-white mb-1">Peer or moderator</h4>
            <p className="text-gray-500 dark:text-zinc-400 text-xs leading-relaxed">
              Either a fellow cohort student or an expert moderator picks up the evaluation. Full transparency of reviewer details.
            </p>
          </div>

          <div>
            <div className="text-2xl font-sans font-black text-[#ff6b2b] mb-2">03</div>
            <h4 className="text-sm font-black text-[#111111] dark:text-white mb-1">Submitter rates back</h4>
            <p className="text-gray-500 dark:text-zinc-400 text-xs leading-relaxed">
              Was the feedback specific? Was it kind? Your rating moves the evaluator's reputation score and XP levels.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
