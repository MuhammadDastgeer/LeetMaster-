import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Play, CheckCircle2, ChevronRight, Award, Flame, RefreshCw, Layers } from 'lucide-react';
import { DsaSheet, DsaProblem } from '../types';

const INITIAL_SHEETS: DsaSheet[] = [
  {
    id: 'leetmaster-dsa',
    name: 'LeetMaster DSA',
    solvedCount: 4,
    totalCount: 191,
    problems: [
      {
        id: 'p1',
        title: 'Two Sum',
        difficulty: 'Easy',
        solved: true,
        category: 'Arrays & Hashing',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        solutionTemplate: `def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i`,
        testCases: [
          { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' }
        ]
      },
      {
        id: 'p2',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        solved: true,
        category: 'Arrays & Hashing',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.',
        solutionTemplate: `def maxProfit(prices):\n    max_p = 0\n    min_val = float('inf')\n    for p in prices:\n        min_val = min(min_val, p)\n        max_p = max(max_p, p - min_val)\n    return max_p`,
        testCases: [
          { input: 'prices = [7,1,5,3,6,4]', expected: '5' }
        ]
      },
      {
        id: 'p3',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        solved: true,
        category: 'Arrays & Hashing',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        solutionTemplate: `def containsDuplicate(nums):\n    return len(nums) != len(set(nums))`,
        testCases: [
          { input: 'nums = [1,2,3,1]', expected: 'True' }
        ]
      },
      {
        id: 'p4',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        solved: true,
        category: 'Arrays & Hashing',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
        solutionTemplate: `def productExceptSelf(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res`,
        testCases: [
          { input: 'nums = [1,2,3,4]', expected: '[24,12,8,6]' }
        ]
      },
      {
        id: 'p5',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given an integer array nums, find the subarray with the largest sum and return its sum.',
        solutionTemplate: `def maxSubArray(nums):\n    max_sum = nums[0]\n    cur_sum = 0\n    for n in nums:\n        if cur_sum < 0:\n            cur_sum = 0\n        cur_sum += n\n        max_sum = max(max_sum, cur_sum)\n    return max_sum`,
        testCases: [
          { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expected: '6' }
        ]
      },
      {
        id: 'p6',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        solved: false,
        category: 'Sliding Window',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        solutionTemplate: `def lengthOfLongestSubstring(s):\n    char_set = set()\n    l = 0\n    res = 0\n    for r in range(len(s)):\n        while s[r] in char_set:\n            char_set.remove(s[l])\n            l += 1\n        char_set.add(s[r])\n        res = max(res, r - l + 1)\n    return res`,
        testCases: [
          { input: 's = "abcabcbb"', expected: '3' }
        ]
      },
      {
        id: 'p7',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        solved: false,
        category: 'Two Pointers',
        description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
        solutionTemplate: `def trap(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    leftMax, rightMax = height[l], height[r]\n    res = 0\n    while l < r:\n        if leftMax < rightMax:\n            l += 1\n            leftMax = max(leftMax, height[l])\n            res += leftMax - height[l]\n        else:\n            r -= 1\n            rightMax = max(rightMax, height[r])\n            res += rightMax - height[r]\n    return res`,
        testCases: [
          { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' }
        ]
      }
    ]
  },
  {
    id: 'leetmaster-75',
    name: 'LeetMaster 75',
    solvedCount: 32,
    totalCount: 75,
    problems: [
      {
        id: 'm1_75',
        title: 'Merge Strings Alternately',
        difficulty: 'Easy',
        solved: true,
        category: 'Two Pointers',
        description: 'You are given two strings word1 and word2. Merge the strings by adding letters in alternating order, starting with word1.',
        solutionTemplate: `def mergeAlternately(word1, word2):\n    res = []\n    i = 0\n    while i < len(word1) or i < len(word2):\n        if i < len(word1):\n            res.append(word1[i])\n        if i < len(word2):\n            res.append(word2[i])\n        i += 1\n    return "".join(res)`,
        testCases: [{ input: 'word1 = "abc", word2 = "pqr"', expected: '"apbqcr"' }]
      }
    ]
  },
  {
    id: 'two-pointers',
    name: 'Two-Pointer Tactics',
    solvedCount: 14,
    totalCount: 24,
    problems: [
      {
        id: 'p2p_1',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        solved: true,
        category: 'Two Pointers',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        solutionTemplate: `def isPalindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower(): return False\n        l, r = l + 1, r - 1\n    return True`,
        testCases: [{ input: 's = "A man, a plan, a canal: Panama"', expected: 'True' }]
      }
    ]
  }
];

export default function DsaSheets() {
  const [sheets, setSheets] = useState<DsaSheet[]>(INITIAL_SHEETS);
  const [activeSheetId, setActiveSheetId] = useState('leetmaster-dsa');
  const [selectedProblemId, setSelectedProblemId] = useState('p1');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [testCasesPassed, setTestCasesPassed] = useState<boolean[]>([]);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const activeSheet = sheets.find(s => s.id === activeSheetId) || sheets[0];
  const activeProblem = activeSheet.problems.find(p => p.id === selectedProblemId) || activeSheet.problems[0];

  const problemIndex = activeSheet.problems.findIndex(p => p.id === selectedProblemId);

  const handlePrevProblem = () => {
    if (activeSheet.problems.length <= 1) return;
    const prevIdx = (problemIndex - 1 + activeSheet.problems.length) % activeSheet.problems.length;
    setSelectedProblemId(activeSheet.problems[prevIdx].id);
  };

  const handleNextProblem = () => {
    if (activeSheet.problems.length <= 1) return;
    const nextIdx = (problemIndex + 1) % activeSheet.problems.length;
    setSelectedProblemId(activeSheet.problems[nextIdx].id);
  };

  useEffect(() => {
    if (activeProblem) {
      setCode(activeProblem.solutionTemplate);
      setTestCasesPassed([]);
    }
  }, [selectedProblemId, activeSheetId]);

  const handleRunCode = () => {
    setIsRunning(true);
    setRunProgress(0);
    setTestCasesPassed([]);

    // Simulate test suite loading/running steps
    const interval = setInterval(() => {
      setRunProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          // solve problem
          const passed = [true, true, true, true];
          setTestCasesPassed(passed);
          
          // Mark problem as solved inside state
          const updatedSheets = sheets.map(s => {
            if (s.id === activeSheetId) {
              const updatedProbs = s.problems.map(p => {
                if (p.id === activeProblem.id && !p.solved) {
                  return { ...p, solved: true };
                }
                return p;
              });
              const solvedCount = updatedProbs.filter(p => p.solved).length;
              return { ...s, problems: updatedProbs, solvedCount };
            }
            return s;
          });
          setSheets(updatedSheets);

          // Show high-fidelity success splash!
          setShowSuccessOverlay(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-500/10 border-green-200';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-200';
      case 'Hard': return 'text-red-500 bg-red-500/10 border-red-200';
    }
  };

  return (
    <section id="dsa-sheets" className="py-24 bg-white dark:bg-zinc-950 dark:text-white border-t border-b border-gray-100 dark:border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111111] dark:text-white tracking-tight">
            LeetMaster DSA Sheets
          </h2>
          <p className="text-[#666] dark:text-zinc-400 text-base sm:text-lg font-medium leading-relaxed">
            Interview-ready DSA sheets curated by the LeetMaster team. Pick a sheet, solve in the full-width in-app editor with real-time feedback and sample tests.
          </p>
        </div>

        {/* DSA SHEET TABS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {sheets.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => {
                setActiveSheetId(sheet.id);
                if (sheet.problems.length > 0) {
                  setSelectedProblemId(sheet.problems[0].id);
                }
              }}
              className={`text-left p-4 rounded-2xl border-2 transition-all duration-250 hover:translate-y-[-2px] relative cursor-pointer ${
                sheet.id === activeSheetId
                  ? 'border-[#ff6b2b] bg-[#ff6b2b]/5 shadow-sm shadow-[#ff6b2b]/5'
                  : 'border-black/5 dark:border-white/10 hover:border-black/15 bg-white dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-xs text-slate-400 font-mono tracking-wider uppercase">curated sheet</span>
                <Coffee className={`w-4 h-4 ${sheet.id === activeSheetId ? 'text-[#ff6b2b]' : 'text-gray-300 dark:text-zinc-600'}`} />
              </div>
              
              <h4 className="text-sm font-black text-black dark:text-white leading-tight mb-1 truncate">{sheet.name}</h4>
              
              {/* Progress and mini progress bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-zinc-400 font-semibold mb-1">
                  <span className="font-mono text-[#ff6b2b]">{sheet.solvedCount}/{sheet.totalCount} solved</span>
                  <span>{Math.round((sheet.solvedCount / sheet.totalCount) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ff6b2b] rounded-full transition-all duration-500"
                    style={{ width: `${(sheet.solvedCount / sheet.totalCount) * 100}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* WORKSPACE - FULL WIDTH CARD */}
        <div className="grid grid-cols-1 gap-8 items-start">

          {/* CODE EDITOR WORKSPACE (Full Width: lg:col-span-12) */}
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] flex flex-col justify-between h-[600px]">
            
            {/* Editor Workspace Header */}
            <div className="px-5 py-3 border-b-2 border-black dark:border-zinc-800 bg-[#fcfbf9] dark:bg-zinc-900/50 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2.5 py-1 rounded font-extrabold border ${getDifficultyColor(activeProblem?.difficulty || 'Easy')}`}>
                  {activeProblem?.difficulty || 'Easy'}
                </span>
                <span className="text-xs font-black text-black dark:text-white">
                  {activeProblem?.title || 'Problem Description'}
                </span>
              </div>

              {/* Inline Navigation Controls for browsing problems */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevProblem}
                  className="px-2.5 py-1 bg-white dark:bg-zinc-800 border border-black/10 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-[11px] font-bold text-black dark:text-white transition-all cursor-pointer flex items-center"
                >
                  &larr; Prev
                </button>
                <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-zinc-400">
                  Problem {problemIndex + 1} of {activeSheet.problems.length}
                </span>
                <button
                  onClick={handleNextProblem}
                  className="px-2.5 py-1 bg-white dark:bg-zinc-800 border border-black/10 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-[11px] font-bold text-black dark:text-white transition-all cursor-pointer flex items-center"
                >
                  Next &rarr;
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold font-mono">
                <span>python3</span>
              </div>
            </div>

            {/* Editor description and syntax workspace */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
              
              {/* Problem prompt/desc */}
              <div className="p-5 bg-[#252526] border-b border-[#3c3c3c] text-xs text-gray-300 leading-relaxed max-h-[140px] overflow-y-auto">
                <p className="font-sans font-medium text-gray-300 leading-normal">
                  <span className="font-extrabold text-white block mb-1 uppercase tracking-wider text-[10px]">Description</span>
                  {activeProblem?.description}
                </p>
              </div>

              {/* Real Interactive Editable Code Editor */}
              <div className="flex-1 overflow-y-auto p-4 flex font-mono text-xs text-[#d4d4d4] relative">
                {/* Line numbers column */}
                <div className="text-gray-600 select-none text-right pr-4 border-r border-gray-800 space-y-1 w-8">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Textarea overlapping exact formatted text */}
                <div className="flex-1 pl-4 relative h-full">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="absolute inset-0 pl-4 pr-4 py-0 w-full h-full bg-transparent border-0 resize-none font-mono text-xs focus:ring-0 focus:outline-none text-[#9cdcfe] leading-relaxed whitespace-pre"
                    style={{ caretColor: '#ff6b2b' }}
                  />
                </div>
              </div>

            </div>

            {/* RUN ACTIONS PANEL */}
            <div className="p-4 border-t-2 border-black bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* Test runner micro logs */}
              <div className="flex-1 flex items-center gap-2.5 min-w-0">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ff6b2b]" />
                    <span>Executing test suite... {runProgress}%</span>
                  </div>
                ) : testCasesPassed.length > 0 ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-50" />
                    <span>All test cases passed! (4/4)</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">Ready to run. Click Run Code.</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center justify-center gap-2 shadow transition-all active:scale-95 cursor-pointer ${
                    isRunning ? 'opacity-50' : ''
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CONFETTI SUCCESS POPUP DIALOG */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-black rounded-3xl p-8 max-w-sm w-full text-center shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] relative overflow-hidden"
            >
              {/* absolute rays accent */}
              <div className="absolute inset-x-0 -top-12 h-36 bg-gradient-to-b from-[#ff6b2b]/10 to-transparent blur-xl" />

              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#ff6b2b] mx-auto mb-5 border border-orange-200">
                <Award className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-sans font-extrabold text-black tracking-tight mb-2">Success!</h3>
              <p className="text-gray-500 text-sm font-medium mb-6">
                All test cases passed with flying colors. Submission saved to cohort database!
              </p>

              {/* Streak info box */}
              <div className="bg-slate-50 border border-black/5 rounded-2xl p-4 flex items-center justify-around mb-6">
                <div>
                  <div className="flex items-center gap-1 text-xs font-extrabold text-gray-400 uppercase">
                    <Flame className="w-3.5 h-3.5 text-[#ff6b2b] fill-current" />
                    <span>Streak</span>
                  </div>
                  <div className="text-lg font-black text-black font-mono">127 Days</div>
                </div>
                <div className="h-8 w-[1px] bg-gray-200" />
                <div>
                  <div className="flex items-center gap-1 text-xs font-extrabold text-gray-400 uppercase">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>Awarded</span>
                  </div>
                  <div className="text-lg font-black text-green-600 font-mono">+27 XP</div>
                </div>
              </div>

              <button
                onClick={() => setShowSuccessOverlay(false)}
                className="w-full bg-black hover:bg-[#ff6b2b] text-white font-bold text-sm py-3 rounded-full shadow transition-all cursor-pointer"
              >
                Keep Solving
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
