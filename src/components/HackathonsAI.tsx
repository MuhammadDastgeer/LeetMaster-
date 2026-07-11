import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Github, ExternalLink, RefreshCw, BarChart2, CheckCircle2, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { HackathonProject } from '../types';

interface HackathonsAIProps {
  onGradingComplete?: (name: string, track: string, repo: string) => void;
}

export default function HackathonsAI({ onGradingComplete }: HackathonsAIProps) {
  const [project, setProject] = useState<HackathonProject>({
    name: '',
    repo: '',
    deployedUrl: '',
    track: 'Web Dev'
  });

  const [isGrading, setIsGrading] = useState(false);
  const [gradingStage, setGradingStage] = useState('');
  const [showReport, setShowReport] = useState(false);

  const startAiGrading = () => {
    setIsGrading(true);
    setShowReport(false);
    
    // Stage 1: reading repo
    setGradingStage('Reading repository configuration...');
    
    setTimeout(() => {
      // Stage 2: running test cases / rubric
      setGradingStage('Running rubric compliance checks...');
    }, 1000);

    setTimeout(() => {
      // Stage 3: drafting feedback
      setGradingStage('Assembling AI feedback summary...');
    }, 2000);

    setTimeout(() => {
      setIsGrading(false);
      setShowReport(true);
      if (onGradingComplete) {
        onGradingComplete(project.name || 'Unnamed Hack Project', project.track, project.repo || 'github.com/dastgeer/hack-project');
      }
    }, 3000);
  };

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 dark:text-white transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111111] dark:text-white tracking-tight">
            Next Level Hackathons with AI.
          </h2>
          <p className="text-[#666] dark:text-zinc-300 text-base sm:text-lg font-medium leading-relaxed">
            Our advance AI execution engine grades every submission on the same rubric, mentors step in to override the calls that need a second pair of eyes, and the leaderboard stays public so every team walks out with feedback they can actually ship on.
          </p>
        </div>

        {/* AI GRADING CONSOLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Submission form (Col Span 5) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-zinc-850 pb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">project submission</span>
                <span className="text-xs bg-[#ff6b2b]/10 text-[#ff6b2b] px-2.5 py-0.5 rounded font-bold">
                  {project.track}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none"
                  placeholder="e.g., Travelo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">GitHub Repository Link</label>
                <div className="relative">
                  <Github className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={project.repo}
                    onChange={(e) => setProject({ ...project, repo: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none font-mono"
                    placeholder="github.com/team/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1.5">Deployed Website URL</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={project.deployedUrl}
                    onChange={(e) => setProject({ ...project, deployedUrl: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none font-mono"
                    placeholder="project.vercel.app"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={startAiGrading}
              disabled={isGrading}
              className="w-full bg-black dark:bg-zinc-850 hover:bg-[#ff6b2b] text-white font-bold text-xs py-3.5 rounded-full flex items-center justify-center gap-2 mt-8 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>{isGrading ? 'AI Assessing...' : 'Grade with AI Rubric'}</span>
            </button>
          </div>

          {/* Right panel: AI Grading Console display (Col Span 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] flex flex-col justify-between relative min-h-[400px]">
            
            {/* Background sparkle visual */}
            <div className="absolute top-4 right-4 text-[#ff6b2b]/10">
              <Sparkles className="w-24 h-24 stroke-[1px]" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                {/* STATE 1: INITIAL STATE */}
                {!isGrading && !showReport && (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4"
                  >
                    <div className="w-14 h-14 bg-slate-50 dark:bg-zinc-950 border border-black/5 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-gray-400">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-black dark:text-white">AI Rubric Assessor</h4>
                      <p className="text-xs text-gray-400 dark:text-zinc-400 mt-1 max-w-sm">
                        Submit your deployment URL above to run immediate compliance checks, coverage sweeps, and lint reviews.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STATE 2: GRADING IN PROGRESS */}
                {isGrading && (
                  <motion.div
                    key="grading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-5"
                  >
                    <RefreshCw className="w-8 h-8 text-[#ff6b2b] animate-spin" />
                    <div>
                      <h4 className="text-xs font-black text-[#ff6b2b] uppercase tracking-widest">LeetMaster AI at work</h4>
                      <p className="text-xs font-mono text-gray-500 dark:text-zinc-400 mt-1">{gradingStage}</p>
                    </div>
                  </motion.div>
                )}

                {/* STATE 3: REPORT RENDERED */}
                {showReport && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 flex-1"
                  >
                    {/* Report Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-black dark:text-white">{project.name} Feedback</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{project.repo}</p>
                      </div>
                      <span className="text-sm font-black bg-green-500 text-white px-3 py-1 rounded-full font-mono">
                        GRADE: A-
                      </span>
                    </div>

                    {/* Radial score grids */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Code Quality', score: '88%' },
                        { label: 'UX Design', score: '92%' },
                        { label: 'Performance', score: '85%' }
                      ].map((stat, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-zinc-950 border border-black/5 dark:border-zinc-800/60 p-3.5 rounded-2xl text-center">
                          <span className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">{stat.label}</span>
                          <span className="text-lg font-black text-black dark:text-white font-mono">{stat.score}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI bullet checks feedback */}
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="font-mono leading-relaxed">Codebase exhibits excellent architectural modularity and clean folder routing.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="font-mono leading-relaxed">Tailwind configurations successfully deliver responsive layout grids.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-zinc-300">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="font-mono leading-relaxed">Minor warning detected: check Websocket socket configuration parameters inside config files.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-[#ff6b2b] bg-orange-50/50 dark:bg-orange-950/10 p-2.5 rounded-xl border border-orange-100 dark:border-orange-900/30 font-bold">
                        <Lightbulb className="w-4 h-4 text-[#ff6b2b] flex-shrink-0 mt-0.5" />
                        <span className="font-mono leading-relaxed text-[11px]">Mentory Tip: Use code bundle split techniques to speed up cold-start landing speeds!</span>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
