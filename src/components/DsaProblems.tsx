import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, CheckCircle2, ChevronRight, Award, Flame, 
  RefreshCw, Layers, ArrowLeft, Sparkles, Code2, 
  CheckCircle, FileCode, Check, Trophy, Search, 
  SlidersHorizontal, Shuffle, Filter, HelpCircle
} from 'lucide-react';
import { DsaProblem, DsaSheet } from '../types';

// Let's seed initial sheets that will appear as cards at the top
const INITIAL_SHEETS_DATA: DsaSheet[] = [
  {
    id: 'graph-adventures',
    name: 'Graph Adventures',
    solvedCount: 0,
    totalCount: 18,
    problems: []
  },
  {
    id: 'interview-patterns',
    name: 'Interview Patterns 101',
    solvedCount: 4,
    totalCount: 25,
    problems: []
  },
  {
    id: 'array-patterns',
    name: 'Array Patterns Unlocked',
    solvedCount: 0,
    totalCount: 14,
    problems: []
  },
  {
    id: 'bitwise-brilliance',
    name: 'Bitwise Brilliance',
    solvedCount: 1,
    totalCount: 12,
    problems: []
  },
  {
    id: 'leetmaster-75',
    name: 'LeetMaster 75',
    solvedCount: 3,
    totalCount: 75,
    problems: []
  }
];

// Seed list of initial curated problems
const INITIAL_PROBLEMS: DsaProblem[] = [
  {
    id: 'prob-1',
    title: 'Count Road Collisions',
    difficulty: 'Hard',
    solved: false,
    category: 'Simulation',
    description: 'There are n cars moving on a road from left to right. You are given a string directions, where directions[i] can be "L", "R", or "S", representing a car moving left, moving right, or staying still, respectively. Return the total number of collisions that will happen on the road.',
    solutionTemplate: `def countCollisions(directions):\n    res = 0\n    n = len(directions)\n    left, right = 0, n - 1\n    while left < n and directions[left] == 'L':\n        left += 1\n    while right >= 0 and directions[right] == 'R':\n        right -= 1\n    for i in range(left, right + 1):\n        if directions[i] != 'S':\n            res += 1\n    return res`,
    testCases: [
      { input: 'directions = "RLRSLL"', expected: '5' },
      { input: 'directions = "LLSGSR"', expected: '4' }
    ]
  },
  {
    id: 'prob-2',
    title: 'Two Sum',
    difficulty: 'Easy',
    solved: true,
    category: 'Arrays & Hashing',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    solutionTemplate: `def twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n    return []`,
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' }
    ]
  },
  {
    id: 'prob-3',
    title: 'Checking for Palindrome Numbers',
    difficulty: 'Easy',
    solved: false,
    category: 'Two Pointers',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward. For example, 121 is a palindrome while 123 is not.',
    solutionTemplate: `def isPalindrome(x):\n    if x < 0: return False\n    return str(x) == str(x)[::-1]`,
    testCases: [
      { input: 'x = 121', expected: 'True' },
      { input: 'x = -121', expected: 'False' }
    ]
  },
  {
    id: 'prob-4',
    title: 'Finding the Longest Common Starting Letters',
    difficulty: 'Easy',
    solved: false,
    category: 'Strings',
    description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    solutionTemplate: `def longestCommonPrefix(strs):\n    if not strs: return ""\n    for i in range(len(strs[0])):\n        for string in strs:\n            if i == len(string) or string[i] != strs[0][i]:\n                return strs[0][:i]\n    return strs[0]`,
    testCases: [
      { input: 'strs = ["flower","flow","flight"]', expected: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', expected: '""' }
    ]
  },
  {
    id: 'prob-5',
    title: 'Sum of Two Binary Strings',
    difficulty: 'Easy',
    solved: false,
    category: 'Bit Manipulation',
    description: 'Given two binary strings a and b, return their sum as a binary string.',
    solutionTemplate: `def addBinary(a, b):\n    return bin(int(a, 2) + int(b, 2))[2:]`,
    testCases: [
      { input: 'a = "11", b = "1"', expected: '"100"' },
      { input: 'a = "1010", b = "1011"', expected: '"10101"' }
    ]
  },
  {
    id: 'prob-6',
    title: 'Gas Station',
    difficulty: 'Medium',
    solved: false,
    category: 'Greedy',
    description: 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. Return the starting gas station index if you can travel around the circuit once in the clockwise direction, otherwise return -1.',
    solutionTemplate: `def canCompleteCircuit(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    total_gas, start_index = 0, 0\n    for i in range(len(gas)):\n        total_gas += gas[i] - cost[i]\n        if total_gas < 0:\n            total_gas = 0\n            start_index = i + 1\n    return start_index`,
    testCases: [
      { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', expected: '3' }
    ]
  },
  {
    id: 'prob-7',
    title: 'Jump Game',
    difficulty: 'Medium',
    solved: false,
    category: 'Greedy',
    description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
    solutionTemplate: `def canJump(nums):\n    goal = len(nums) - 1\n    for i in range(len(nums) - 2, -1, -1):\n        if i + nums[i] >= goal:\n            goal = i\n    return goal == 0`,
    testCases: [
      { input: 'nums = [2,3,1,1,4]', expected: 'True' }
    ]
  },
  {
    id: 'prob-8',
    title: 'Assign Cookies',
    difficulty: 'Easy',
    solved: false,
    category: 'Greedy',
    description: 'Assume you are an awesome parent and want to give your children some cookies. Each child i has a greed factor g[i] and each cookie j has a size s[j]. Your goal is to maximize the number of content children.',
    solutionTemplate: `def findContentChildren(g, s):\n    g.sort()\n    s.sort()\n    child_i, cookie_j = 0, 0\n    while child_i < len(g) and cookie_j < len(s):\n        if s[cookie_j] >= g[child_i]:\n            child_i += 1\n        cookie_j += 1\n    return child_i`,
    testCases: [
      { input: 'g = [1,2,3], s = [1,1]', expected: '1' }
    ]
  }
];

// Extra problems to be appended dynamically when "Load More" is clicked
const EXTRA_PROBLEMS: DsaProblem[] = [
  {
    id: 'prob-9',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    solved: false,
    category: 'Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    solutionTemplate: `def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
    testCases: [
      { input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' }
    ]
  },
  {
    id: 'prob-10',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    solved: false,
    category: 'Heap',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
    solutionTemplate: `import heapq\ndef findKthLargest(nums, k):\n    minHeap = []\n    for num in nums:\n        heapq.heappush(minHeap, num)\n        if len(minHeap) > k:\n            heapq.heappop(minHeap)\n    return minHeap[0]`,
    testCases: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', expected: '5' }
    ]
  },
  {
    id: 'prob-11',
    title: 'Single Number',
    difficulty: 'Easy',
    solved: false,
    category: 'Bit Manipulation',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
    solutionTemplate: `def singleNumber(nums):\n    res = 0\n    for n in nums:\n        res ^= n\n    return res`,
    testCases: [
      { input: 'nums = [2,2,1]', expected: '1' }
    ]
  },
  {
    id: 'prob-12',
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    solved: false,
    category: 'Bit Manipulation',
    description: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has.',
    solutionTemplate: `def hammingWeight(n):\n    res = 0\n    while n:\n        res += n % 2\n        n = n >> 1\n    return res`,
    testCases: [
      { input: 'n = 11', expected: '3' }
    ]
  },
  {
    id: 'prob-13',
    title: 'Unique Paths',
    difficulty: 'Medium',
    solved: false,
    category: 'Dynamic Programming',
    description: 'Given an m x n grid, return the number of unique paths the robot can take from top-left to bottom-right.',
    solutionTemplate: `def uniquePaths(m, n):\n    row = [1] * n\n    for i in range(m - 1):\n        newRow = [1] * n\n        for j in range(n - 2, -1, -1):\n            newRow[j] = newRow[j + 1] + row[j]\n        row = newRow\n    return row[0]`,
    testCases: [
      { input: 'm = 3, n = 7', expected: '28' }
    ]
  },
  {
    id: 'prob-14',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    solved: false,
    category: 'Dynamic Programming',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    solutionTemplate: `def lengthOfLIS(nums):\n    if not nums: return 0\n    LIS = [1] * len(nums)\n    for i in range(len(nums) - 1, -1, -1):\n        for j in range(i + 1, len(nums)):\n            if nums[i] < nums[j]:\n                LIS[i] = max(LIS[i], 1 + LIS[j])\n    return max(LIS)`,
    testCases: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', expected: '4' }
    ]
  },
  {
    id: 'prob-15',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    solved: false,
    category: 'Arrays & Hashing',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    solutionTemplate: `def containsDuplicate(nums):\n    hashset = set()\n    for n in nums:\n        if n in hashset:\n            return True\n        hashset.add(n)\n    return False`,
    testCases: [
      { input: 'nums = [1,2,3,1]', expected: 'True' }
    ]
  }
];

export default function DsaProblems() {
  const [sheets, setSheets] = useState<DsaSheet[]>(INITIAL_SHEETS_DATA);
  const [problems, setProblems] = useState<DsaProblem[]>(INITIAL_PROBLEMS);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  
  // Pagination & Load More States
  const [hasMore, setHasMore] = useState(true);
  const [extraIndex, setExtraIndex] = useState(0);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default');

  // Interactive IDE solver state
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [testCasesPassed, setTestCasesPassed] = useState<boolean[]>([]);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Find active problem for the code editor workspace
  const activeProblem = problems.find(p => p.id === selectedProblemId) || null;

  // Sync editor template
  useEffect(() => {
    if (activeProblem) {
      setCode(activeProblem.solutionTemplate);
      setTestCasesPassed([]);
      setConsoleLogs([]);
    }
  }, [selectedProblemId]);

  // Load More logic
  const handleLoadMore = () => {
    if (extraIndex >= EXTRA_PROBLEMS.length) {
      setHasMore(false);
      return;
    }

    // Append next batch of 3 extra problems
    const nextBatch = EXTRA_PROBLEMS.slice(extraIndex, extraIndex + 4);
    setProblems(prev => [...prev, ...nextBatch]);
    setExtraIndex(prev => prev + 4);

    if (extraIndex + 4 >= EXTRA_PROBLEMS.length) {
      setHasMore(false);
    }
  };

  // Mark all questions of a specific sheet completed or complete all sheets!
  const handleCompleteSheet = (sheetId: string) => {
    setSheets(prev => prev.map(s => {
      if (s.id === sheetId) {
        return { ...s, solvedCount: s.totalCount };
      }
      return s;
    }));
  };

  const handleCompleteAllSheets = () => {
    setSheets(prev => prev.map(s => ({ ...s, solvedCount: s.totalCount })));
    setProblems(prev => prev.map(p => ({ ...p, solved: true })));
  };

  // Run Code assertion compiler pipeline
  const handleRunCode = () => {
    if (!activeProblem) return;
    setIsRunning(true);
    setRunProgress(0);
    setTestCasesPassed([]);
    setConsoleLogs(["Initializing Sandbox Environments...", "Loading Python 3.10 modules..."]);

    const interval = setInterval(() => {
      setRunProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          
          // Set passed test cases
          const passed = activeProblem.testCases.map(() => true);
          setTestCasesPassed(passed);
          setConsoleLogs(prevLogs => [
            ...prevLogs,
            "Executing Test Case 1...",
            `  Input: ${activeProblem.testCases[0]?.input || ''}`,
            `  Expected: ${activeProblem.testCases[0]?.expected || ''}`,
            "  ✓ Match found!",
            "Submission compiled and completed successfully.",
            "Database entry saved to cloud ledger."
          ]);

          // Update solved state in our React state
          setProblems(prevProblems => prevProblems.map(p => {
            if (p.id === activeProblem.id) {
              return { ...p, solved: true };
            }
            return p;
          }));

          // Dynamically increment sheet counts too
          setSheets(prevSheets => prevSheets.map(s => {
            // Randomly map solved problems to sheets to simulate progress
            const max = s.totalCount;
            const updatedSolved = Math.min(max, s.solvedCount + 1);
            return { ...s, solvedCount: updatedSolved };
          }));

          setShowSuccessOverlay(true);
          return 100;
        }

        if (prev === 25) {
          setConsoleLogs(prevLogs => [...prevLogs, "✓ Sandbox ready.", "Running static syntax analyser..."]);
        } else if (prev === 50) {
          setConsoleLogs(prevLogs => [...prevLogs, "✓ Syntax checks passed.", "Piping sample input to execution buffer..."]);
        } else if (prev === 75) {
          setConsoleLogs(prevLogs => [...prevLogs, "✓ Execution complete. Running diff assertion algorithm..."]);
        }

        return prev + 25;
      });
    }, 350);
  };

  // Filter & Sort calculations
  const filteredProblems = problems.filter(prob => {
    const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prob.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || prob.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'All' || prob.category === categoryFilter;
    return matchesSearch && matchesDifficulty && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'Title') return a.title.localeCompare(b.title);
    if (sortBy === 'Difficulty') return a.difficulty.localeCompare(b.difficulty);
    return 0; // Default sorting
  });

  const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
      case 'Medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      case 'Hard': return 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/50';
    }
  };

  // Categories list
  const categories = Array.from(new Set(problems.map(p => p.category)));

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        
        {!selectedProblemId ? (
          <motion.div
            key="problems-dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Row with Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 dark:border-stone-800 pb-6 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#ff6b2b]/10 text-[#ff6b2b] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">Curated Roadmap</span>
                </div>
                <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
                  Problems
                </h1>
                <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                  Boost your coding skills with our curated problems.
                </p>
              </div>

              {/* Instant Complete All Cheat Button */}
              <button
                type="button"
                onClick={handleCompleteAllSheets}
                className="flex items-center gap-2 px-4.5 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] dark:bg-[#ff6b2b] dark:hover:bg-[#ff804a] text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Trophy className="w-4 h-4 fill-current" />
                <span>Complete All Sheets</span>
              </button>
            </div>

            {/* CURATED SHEET PROGRESS CARDS (AS SHOWN IN SCREENSHOT) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-450 dark:text-stone-550 font-mono">
                  Your DSA Curated Roadmaps
                </span>
                <span className="text-[10px] text-stone-400 font-mono font-semibold">
                  Syncs with Cohort Ledger
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {sheets.map((sheet) => {
                  const isCompleted = sheet.solvedCount >= sheet.totalCount;
                  return (
                    <div
                      key={sheet.id}
                      className={`relative p-5 rounded-2xl border bg-white dark:bg-stone-900 transition-all duration-300 flex flex-col justify-between h-32 overflow-hidden ${
                        isCompleted 
                          ? 'border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.02]' 
                          : 'border-stone-200 dark:border-stone-800/80 hover:border-[#ff6b2b] hover:shadow-md'
                      }`}
                    >
                      {/* Grid Pattern overlay */}
                      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:12px_12px]" />

                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-black text-stone-800 dark:text-stone-200 leading-snug line-clamp-2">
                            {sheet.name}
                          </h3>
                          <span className={`text-[10px] font-mono font-bold ${isCompleted ? 'text-emerald-500' : 'text-stone-400 dark:text-stone-500'}`}>
                            {sheet.solvedCount}/{sheet.totalCount}
                          </span>
                        </div>

                        {/* Interactive progress tracker action */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 font-mono uppercase">
                            By LeetMaster
                          </span>

                          {!isCompleted ? (
                            <button
                              type="button"
                              onClick={() => handleCompleteSheet(sheet.id)}
                              className="text-[9px] font-bold text-[#ff6b2b] hover:underline cursor-pointer focus:outline-none"
                            >
                              Complete All
                            </button>
                          ) : (
                            <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5">
                              <Check className="w-3 h-3 stroke-[3]" /> Done
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEARCH AND FILTERING GRID */}
            <div className="bg-stone-50 dark:bg-stone-900/20 border border-stone-200/60 dark:border-stone-800 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row gap-3.5 items-center">
                {/* Search problem input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl text-sm focus:outline-none focus:border-[#ff6b2b] dark:focus:border-[#ff6b2b] transition-all font-medium placeholder-stone-400"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {/* Difficulty selector */}
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#ff6b2b] cursor-pointer"
                  >
                    <option value="All">All Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#ff6b2b] cursor-pointer"
                  >
                    <option value="All">All Topics</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl text-xs font-bold text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#ff6b2b] cursor-pointer"
                  >
                    <option value="Default">Sort: Default</option>
                    <option value="Title">Sort: A-Z</option>
                    <option value="Difficulty">Sort: Difficulty</option>
                  </select>

                  {/* Random Pick Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const unsolved = problems.filter(p => !p.solved);
                      const pool = unsolved.length > 0 ? unsolved : problems;
                      const randomProblem = pool[Math.floor(Math.random() * pool.length)];
                      if (randomProblem) setSelectedProblemId(randomProblem.id);
                    }}
                    className="p-3 bg-white dark:bg-stone-950 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] border border-stone-200 dark:border-stone-850 rounded-2xl text-stone-550 dark:text-stone-400 transition-all cursor-pointer flex items-center justify-center focus:outline-none"
                    title="Pick Random Problem"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* PROBLEM GRID TABLE LISTING */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 text-[11px] font-black uppercase tracking-wider text-stone-450 dark:text-stone-500 font-mono">
                      <th className="py-4 px-6 w-16">Status</th>
                      <th className="py-4 px-6">Problem Title</th>
                      <th className="py-4 px-6">Topic</th>
                      <th className="py-4 px-6 w-32">Difficulty</th>
                      <th className="py-4 px-6 w-32">Acceptance</th>
                      <th className="py-4 px-6 w-24 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
                    {filteredProblems.map((prob) => (
                      <tr 
                        key={prob.id}
                        className="hover:bg-stone-50/40 dark:hover:bg-stone-900/20 transition-all"
                      >
                        {/* Status Col */}
                        <td className="py-4.5 px-6">
                          {prob.solved ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                              <CheckCircle className="w-4 h-4 fill-current" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-700 flex-shrink-0" />
                          )}
                        </td>

                        {/* Title Col */}
                        <td className="py-4.5 px-6">
                          <button
                            type="button"
                            onClick={() => setSelectedProblemId(prob.id)}
                            className="text-xs font-extrabold text-stone-900 dark:text-stone-100 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-colors focus:outline-none text-left cursor-pointer"
                          >
                            {prob.title}
                          </button>
                        </td>

                        {/* Category Tag */}
                        <td className="py-4.5 px-6">
                          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 font-mono bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md">
                            {prob.category}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="py-4.5 px-6">
                          <span className={`text-[9px] px-2.5 py-1 rounded-md font-extrabold uppercase border ${getDifficultyColor(prob.difficulty)}`}>
                            {prob.difficulty}
                          </span>
                        </td>

                        {/* Acceptance percentage mock */}
                        <td className="py-4.5 px-6">
                          <span className="text-xs font-bold text-stone-500 dark:text-stone-450 font-mono">
                            {prob.difficulty === 'Easy' ? '82.4%' : prob.difficulty === 'Medium' ? '54.2%' : '31.1%'}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-4.5 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedProblemId(prob.id)}
                            className="px-3.5 py-1.5 bg-[#ff6b2b]/10 hover:bg-[#ff6b2b] text-[#ff6b2b] hover:text-white text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 ml-auto cursor-pointer focus:outline-none"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>Code</span>
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredProblems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400 dark:text-stone-550 font-medium">
                          No matching curated problems found. Try adjustments!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATED LOAD MORE BUTTON */}
              {hasMore && (
                <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex justify-center bg-stone-50/50 dark:bg-stone-900/10">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 bg-white dark:bg-stone-950 hover:bg-stone-50 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-xs font-bold text-stone-700 dark:text-stone-300 transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:border-[#ff6b2b]"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#ff6b2b]" />
                    <span>Load More Curated Questions</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          
          /* ACTIVE INTERACTIVE SOLVER IDE WORKSPACE */
          <motion.div
            key="problems-workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Solver Workspace Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 dark:bg-stone-900/30 p-5 rounded-3xl border border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProblemId(null)}
                  className="p-2.5 bg-white dark:bg-stone-900 hover:bg-[#ff6b2b] hover:text-white dark:hover:bg-[#ff6b2b] border border-stone-200 dark:border-stone-800 rounded-2xl text-stone-650 dark:text-stone-300 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none"
                  title="Back to problems list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 font-mono">LeetMaster Interactive compiler</span>
                  </div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white leading-tight">
                    {activeProblem?.title}
                  </h2>
                </div>
              </div>

              {/* Progress counter pill */}
              <div className="flex items-center gap-3 bg-white dark:bg-stone-900 px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-800">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-stone-400 uppercase leading-none">Solving Category</p>
                  <p className="text-xs font-black text-[#ff6b2b] font-mono mt-1 uppercase">
                    {activeProblem?.category}
                  </p>
                </div>
              </div>
            </div>

            {/* SPLIT SCREEN WORKSPACE LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Pane: Description, templates & constraints */}
              <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-900/20 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 flex flex-col h-[600px] overflow-y-auto">
                <div className="pb-3.5 border-b border-stone-200 dark:border-stone-800/80 mb-5">
                  <span className={`text-[9px] px-2.5 py-1 rounded-md font-extrabold uppercase border ${activeProblem ? getDifficultyColor(activeProblem.difficulty) : ''}`}>
                    {activeProblem?.difficulty}
                  </span>
                  <h3 className="text-base font-black text-stone-900 dark:text-white mt-3.5">
                    {activeProblem?.title}
                  </h3>
                </div>

                <div className="space-y-5 flex-1">
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider font-mono block mb-1.5">
                      Problem Prompt
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {activeProblem?.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider font-mono block mb-1.5">
                      Target Assertion Test Cases
                    </span>
                    <div className="space-y-2">
                      {activeProblem?.testCases.map((tc, idx) => (
                        <div key={idx} className="p-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-xl font-mono text-[11px] text-stone-600 dark:text-stone-400 space-y-1">
                          <div><span className="text-[#ff6b2b] font-bold">Input:</span> {tc.input}</div>
                          <div><span className="text-emerald-500 font-bold">Expected:</span> {tc.expected}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100/50 dark:border-orange-950/30 p-4 rounded-2xl flex items-start gap-2.5">
                  <Trophy className="w-4 h-4 text-[#ff6b2b] flex-shrink-0 mt-0.5 fill-current" />
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                    Write valid Python code. Tap <strong className="text-black dark:text-white">Run Code</strong> to assertions compilation!
                  </p>
                </div>
              </div>

              {/* Right Pane: Monospace editor sandbox */}
              <div className="lg:col-span-7 flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl overflow-hidden shadow-sm h-[600px]">
                {/* Editor Header */}
                <div className="px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-stone-700 dark:text-stone-300">Solution Sandbox</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">python3</span>
                </div>

                {/* Textarea Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#1e1e1e] relative min-h-0">
                  <div className="flex-1 overflow-y-auto p-4 flex font-mono text-xs text-[#d4d4d4] relative">
                    <div className="text-[#858585] select-none text-right pr-4 border-r border-[#3c3c3c] space-y-1 w-8">
                      {Array.from({ length: 15 }, (_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    <div className="flex-1 pl-4 relative h-full">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="absolute inset-0 pl-4 pr-4 py-0 w-full h-full bg-transparent border-0 resize-none font-mono text-xs focus:ring-0 focus:outline-none text-[#9cdcfe] leading-relaxed whitespace-pre"
                        style={{ caretColor: '#ff6b2b' }}
                        spellCheck="false"
                      />
                    </div>
                  </div>

                  {/* Sandbox Console stream drawer */}
                  <div className="h-[140px] border-t border-[#3c3c3c] bg-[#181818] p-4 font-mono text-[11px] text-stone-450 overflow-y-auto space-y-1.5 flex-shrink-0">
                    <div className="text-[#ff6b2b] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Code2 className="w-4 h-4" />
                      <span>Execution Logs</span>
                    </div>
                    {consoleLogs.length === 0 ? (
                      <p className="text-stone-600 italic">Logs are currently empty. Execute code assertion to test constraints.</p>
                    ) : (
                      consoleLogs.map((log, i) => (
                        <div key={i} className={log.includes('✓') ? 'text-green-400 font-semibold' : 'text-stone-300'}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Editor Actions Footer */}
                <div className="p-4 border-t border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/40 flex items-center justify-between gap-4 flex-shrink-0">
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ff6b2b]" />
                        <span>Compiling sandbox pipeline... {runProgress}%</span>
                      </div>
                    ) : testCasesPassed.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Assert Complete! All Passed</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500">
                        Pending assertion pipeline run
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => activeProblem && setCode(activeProblem.solutionTemplate)}
                      className="px-4 py-2 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-full text-[10px] font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider cursor-pointer focus:outline-none"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Code</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* COMPILER ACCEPTED OVERLAY */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-stone-900 border-4 border-stone-900 dark:border-stone-700 rounded-3xl p-8 max-w-sm w-full text-center shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] relative overflow-hidden"
            >
              <div className="absolute inset-x-0 -top-12 h-36 bg-gradient-to-b from-[#ff6b2b]/15 to-transparent blur-xl" />

              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/50 rounded-full flex items-center justify-center text-[#ff6b2b] mx-auto mb-5 border border-orange-100 dark:border-orange-900/30">
                <Award className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
                Accepted!
              </h3>
              
              <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-6">
                All test cases passed perfectly. Your solution synced with your cohort streak!
              </p>

              <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 rounded-2xl p-4 flex items-center justify-around mb-6">
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-stone-450 dark:text-stone-500 uppercase">
                    <Flame className="w-3.5 h-3.5 text-[#ff6b2b] fill-current" />
                    <span>Streak</span>
                  </div>
                  <div className="text-lg font-black text-stone-900 dark:text-white font-mono">
                    128 Days
                  </div>
                </div>
                
                <div className="h-8 w-[1px] bg-stone-200 dark:bg-stone-800" />
                
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-stone-450 dark:text-stone-500 uppercase">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>Awarded</span>
                  </div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    +40 XP
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSuccessOverlay(false)}
                className="w-full bg-stone-900 hover:bg-[#ff6b2b] text-white font-bold text-sm py-3 rounded-full shadow transition-all cursor-pointer focus:outline-none"
              >
                Keep Solving
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
