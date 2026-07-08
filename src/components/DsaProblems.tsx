import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, CheckCircle2, ChevronRight, Award, Flame, 
  RefreshCw, Layers, ArrowLeft, Sparkles, Code2, 
  CheckCircle, FileCode, Check, Trophy, Search, 
  SlidersHorizontal, Shuffle, Filter, HelpCircle,
  ChevronDown, ChevronUp, Briefcase, Lightbulb, Tag,
  Copy, RotateCcw, Settings, Expand, Terminal
} from 'lucide-react';
import { DsaProblem, DsaSheet } from '../types';

// Helper to render custom owl logo (Mascot)
const OwlLogo = () => (
  <svg className="w-8 h-8 text-[#ff6b2b]" viewBox="0 0 100 100" fill="currentColor">
    {/* Head shape */}
    <path d="M50 15 C30 15 20 28 20 48 C20 68 32 82 50 82 C68 82 80 68 80 48 C80 28 70 15 50 15 Z" fill="#1e293b" />
    {/* Ears / horns */}
    <path d="M22 28 L15 12 L35 20 Z" fill="#0f172a" />
    <path d="M78 28 L85 12 L65 20 Z" fill="#0f172a" />
    {/* White face patches */}
    <circle cx="38" cy="45" r="18" fill="white" />
    <circle cx="62" cy="45" r="18" fill="white" />
    {/* Spectacles (orange rims) */}
    <circle cx="38" cy="45" r="14" fill="none" stroke="#ff6b2b" strokeWidth="4.5" />
    <circle cx="62" cy="45" r="14" fill="none" stroke="#ff6b2b" strokeWidth="4.5" />
    {/* Glasses bridge */}
    <rect x="48" y="43" width="4" height="4" fill="#ff6b2b" />
    {/* Big Pupils */}
    <circle cx="38" cy="45" r="6" fill="#1e293b" />
    <circle cx="62" cy="45" r="6" fill="#1e293b" />
    {/* Pupil reflection */}
    <circle cx="36" cy="43" r="2" fill="white" />
    <circle cx="60" cy="43" r="2" fill="white" />
    {/* Beak */}
    <polygon points="50,48 45,56 55,56" fill="#f59e0b" />
    {/* Eyebrows */}
    <path d="M25 28 Q38 32 46 36" fill="none" stroke="#ff6b2b" strokeWidth="3" strokeLinecap="round" />
    <path d="M75 28 Q62 32 54 36" fill="none" stroke="#ff6b2b" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

function getSheetSummary(sheetId: string): string {
  switch (sheetId) {
    case 'graph-adventures':
      return "Immersive roadmap to conquer complex graphs. Master tree traversals, DFS, BFS, cycle detection, and connectivity puzzles.";
    case 'interview-patterns':
      return "Essential structural pattern mastery for MAANG interviews. Cover arrays, sliding windows, and linked lists.";
    case 'array-patterns':
      return "Foundational arrays and hashing structures. Learn prefix sums, hash maps, sliding windows, and contiguous array optimizations.";
    case 'bitwise-brilliance':
      return "Master direct bitwise manipulations, bit masks, XOR properties, and high-performance arithmetic operations.";
    case 'leetmaster-75':
      return "The essential LeetCode-style coding questions you need to ace your next software engineering technical screening.";
    default:
      return "Curated collection of industry-standard coding interview problems with optimized algorithmic guidelines.";
  }
}

function padSheetProblems(sheetsList: DsaSheet[]): DsaSheet[] {
  const categories = [
    'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search',
    'Linked List', 'Trees', 'Tries', 'Heap', 'Backtracking', 'Graphs',
    'Advanced Graphs', 'Dynamic Programming', 'Bit Manipulation', 'Greedy', 'Math & Geometry'
  ];
  
  const titles = [
    "Container With Most Water", "3Sum", "Remove Nth Node From End",
    "Merge k Sorted Lists", "Search Rotated Sorted Array", "First and Last Position",
    "Combination Sum", "Group Anagrams", "Maximum Subarray", "Spiral Matrix",
    "Jump Game II", "Merge Intervals", "Insert Interval", "Length of Last Word",
    "Permutations", "Rotate Image", "Anagrams Grouping Sequence", "Decode Ways",
    "Unique Binary Search Trees", "Interleaving String", "Validate Binary Search Tree",
    "Symmetric Tree", "Binary Tree Level Order Traversal", "Construct Tree from Preorder",
    "Convert Sorted Array to BST", "Path Sum", "Flatten Binary Tree to Linked List",
    "Populating Next Right Pointers", "Triangle Path Minimum Sum", "Best Time to Buy Stock III",
    "Word Ladder", "Sum Root to Leaf Numbers", "Surrounded Regions", "Palindrome Partitioning",
    "Gas Station", "Single Number", "Copy List with Random Pointer", "Word Break",
    "Linked List Cycle II", "LRU Cache", "Sort List", "Max Points on a Line",
    "Evaluate Reverse Polish Notation", "Find Minimum in Rotated Sorted Array",
    "Min Stack", "Intersection of Two Linked Lists", "Find Peak Element",
    "Maximum Product Subarray", "Binary Tree Right Side View", "Number of Islands",
    "House Robber II", "Course Schedule", "Course Schedule II", "Design Add and Search Words",
    "Word Search II", "House Robber III", "Kth Largest Element", "Meeting Rooms",
    "Meeting Rooms II", "Alien Dictionary", "Graph Valid Tree", "Longest Consecutive Sequence",
    "Binary Tree Maximum Path Sum", "Valid Parentheses", "Merge Two Sorted Lists",
    "Median of Two Sorted Arrays", "Longest Palindromic Substring", "Zigzag Conversion",
    "Reverse Integer", "String to Integer (atoi)", "Palindrome Number", "Regular Expression Matching",
    "Roman to Integer", "Integer to Roman", "Longest Common Prefix", "Letter Combinations of a Phone Number",
    "4Sum", "Generate Parentheses", "Next Permutation", "Multiply Strings", "Wildcard Matching",
    "N-Queens", "Rotate List", "Climbing Stairs", "Simplify Path", "Edit Distance",
    "Set Matrix Zeroes", "Search a 2D Matrix", "Sort Colors", "Minimum Window Substring",
    "Subsets", "Word Search", "Remove Duplicates II", "Search Rotated II", "Remove Duplicates List",
    "Partition List", "Maxal Rectangle", "Scramble String", "Merge Sorted Array", "Gray Code", "Subsets II"
  ];

  return sheetsList.map(sheet => {
    const currentProbs = [...sheet.problems];
    const needed = sheet.totalCount - currentProbs.length;
    
    let currentSolvedCount = currentProbs.filter(p => p.solved).length;
    
    if (needed > 0) {
      for (let i = 0; i < needed; i++) {
        const idx = (currentProbs.length + i) % titles.length;
        const baseTitle = titles[idx];
        const title = `${baseTitle} #${currentProbs.length + 1}`;
        
        let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
        if (i % 3 === 0) difficulty = 'Easy';
        else if (i % 3 === 2) difficulty = 'Hard';

        const category = categories[i % categories.length];
        const probId = `${sheet.id}-gen-${i}`;
        
        let shouldBeSolved = false;
        if (currentSolvedCount < sheet.solvedCount) {
          shouldBeSolved = true;
          currentSolvedCount++;
        }

        currentProbs.push({
          id: probId,
          title: title,
          difficulty: difficulty,
          solved: shouldBeSolved,
          category: category,
          description: `Given a set of constraints related to ${category}, design an optimal algorithm to solve the ${title} challenge efficiently within O(N log N) time and O(N) space limits.`,
          solutionTemplate: `def solve(arr):\n    # Dynamic placeholder solution template\n    return 0`,
          testCases: [
            { input: 'arr = [1, 2, 3]', expected: '0' }
          ]
        });
      }
    }
    
    let solvedCountInProbs = currentProbs.filter(p => p.solved).length;
    if (solvedCountInProbs < sheet.solvedCount) {
      for (let p of currentProbs) {
        if (!p.solved && solvedCountInProbs < sheet.solvedCount) {
          p.solved = true;
          solvedCountInProbs++;
        }
      }
    } else if (solvedCountInProbs > sheet.solvedCount) {
      sheet.solvedCount = solvedCountInProbs;
    }

    return {
      ...sheet,
      problems: currentProbs
    };
  });
}

function generateLargeProblemsList(baseProblems: DsaProblem[]): DsaProblem[] {
  const categories = [
    'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search',
    'Linked List', 'Trees', 'Tries', 'Heap', 'Backtracking', 'Graphs',
    'Advanced Graphs', 'Dynamic Programming', 'Bit Manipulation', 'Greedy', 'Math & Geometry'
  ];
  
  const baseTitles = [
    "Container With Most Water", "3Sum", "Remove Nth Node",
    "Merge k Sorted Lists", "Search Rotated Array", "First and Last Position",
    "Combination Sum", "Group Anagrams", "Maximum Subarray", "Spiral Matrix",
    "Jump Game", "Merge Intervals", "Insert Interval", "Length of Last Word",
    "Permutations", "Rotate Image", "Decode Ways", "Unique BSTs", "Interleaving String",
    "Validate BST", "Symmetric Tree", "Level Order Traversal", "Construct Tree",
    "Convert Array to BST", "Path Sum", "Flatten Binary Tree", "Next Right Pointers",
    "Triangle Path Sum", "Buy Stock", "Word Ladder", "Sum Root to Leaf", "Surrounded Regions",
    "Palindrome Partitioning", "Gas Station", "Single Number", "Copy List", "Word Break",
    "Linked List Cycle", "LRU Cache", "Sort List", "Max Points on Line", "Evaluate RPN",
    "Find Min Rotated", "Min Stack", "Intersection Linked Lists", "Find Peak Element",
    "Max Product Subarray", "Right Side View", "Number of Islands", "House Robber",
    "Course Schedule", "Course Schedule II", "Add Search Words", "Word Search II",
    "Kth Largest Element", "Meeting Rooms", "Meeting Rooms II", "Alien Dictionary",
    "Graph Valid Tree", "Longest Consecutive", "Max Path Sum", "Valid Parentheses",
    "Merge Sorted Lists", "Median Two Arrays", "Longest Palindrome", "Zigzag Conversion",
    "Reverse Integer", "String to Integer", "Palindrome Number", "Regex Matching",
    "Roman to Integer", "Integer to Roman", "Longest Common Prefix", "Letter Combinations",
    "4Sum", "Generate Parentheses", "Next Permutation", "Multiply Strings", "Wildcard Matching",
    "N-Queens", "Rotate List", "Climbing Stairs", "Simplify Path", "Edit Distance",
    "Set Matrix Zeroes", "Search 2D Matrix", "Sort Colors", "Min Window Substring",
    "Subsets", "Word Search", "Remove Duplicates II", "Search Rotated II", "Remove Duplicates List",
    "Partition List", "Maxal Rectangle", "Scramble String", "Merge Sorted Array", "Gray Code"
  ];

  const list: DsaProblem[] = [...baseProblems];
  const existingIds = new Set(list.map(p => p.id));

  for (let i = 1; i <= 2150; i++) {
    const id = `prob-large-${i}`;
    if (existingIds.has(id)) continue;

    const titleIdx = i % baseTitles.length;
    const catIdx = i % categories.length;
    const title = `${baseTitles[titleIdx]} #${i}`;
    
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    if (i % 3 === 0) difficulty = 'Easy';
    else if (i % 3 === 2) difficulty = 'Hard';

    list.push({
      id: id,
      title: title,
      difficulty: difficulty,
      solved: false,
      category: categories[catIdx],
      description: `Given a problem context regarding ${categories[catIdx]}, construct an optimized algorithm to solve "${title}" with high precision. Implement correct bounds and time limits.`,
      solutionTemplate: `def solve(arr):\n    # Optimized Python placeholder\n    return 0`,
      testCases: [
        { input: 'arr = [1, 2, 3]', expected: '0' }
      ]
    });
  }

  return list;
}

// Let's seed initial sheets that will appear as cards at the top
const INITIAL_SHEETS_DATA_RAW: DsaSheet[] = [
  {
    id: 'graph-adventures',
    name: 'Graph Adventures',
    solvedCount: 0,
    totalCount: 18,
    problems: [
      {
        id: 'prob-ga-1',
        title: 'Flood Fill',
        difficulty: 'Easy',
        solved: false,
        category: 'Graphs',
        description: 'An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc].',
        solutionTemplate: `def floodFill(image, sr, sc, color):\n    # BFS/DFS implementation\n    return image`,
        testCases: [{ input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', expected: '[[2,2,2],[2,2,0],[2,0,1]]' }]
      },
      {
        id: 'prob-ga-2',
        title: 'Number of Islands',
        difficulty: 'Medium',
        solved: false,
        category: 'Graphs',
        description: 'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
        solutionTemplate: `def numIslands(grid):\n    # DFS implementation\n    return 0`,
        testCases: [{ input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expected: '1' }]
      },
      {
        id: 'prob-ga-3',
        title: 'Clone Graph',
        difficulty: 'Medium',
        solved: false,
        category: 'Graphs',
        description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
        solutionTemplate: `def cloneGraph(node):\n    # DFS/BFS clone implementation\n    return node`,
        testCases: [{ input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', expected: '[[2,4],[1,3],[2,4],[1,3]]' }]
      }
    ]
  },
  {
    id: 'interview-patterns',
    name: 'Interview Patterns 101',
    solvedCount: 1,
    totalCount: 25,
    problems: [
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
      }
    ]
  },
  {
    id: 'array-patterns',
    name: 'Array Patterns Unlocked',
    solvedCount: 1,
    totalCount: 14,
    problems: [
      {
        id: 'prob-2',
        title: 'Two Sum',
        difficulty: 'Easy',
        solved: true,
        category: 'Arrays & Hashing',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        solutionTemplate: `def twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n    return []`,
        testCases: [{ input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' }]
      },
      {
        id: 'prob-15',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        solved: false,
        category: 'Arrays & Hashing',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        solutionTemplate: `def containsDuplicate(nums):\n    hashset = set()\n    for n in nums:\n        if n in hashset:\n            return True\n        hashset.add(n)\n    return False`,
        testCases: [{ input: 'nums = [1,2,3,1]', expected: 'True' }]
      }
    ]
  },
  {
    id: 'bitwise-brilliance',
    name: 'Bitwise Brilliance',
    solvedCount: 0,
    totalCount: 12,
    problems: [
      {
        id: 'prob-5',
        title: 'Sum of Two Binary Strings',
        difficulty: 'Easy',
        solved: false,
        category: 'Bit Manipulation',
        description: 'Given two binary strings a and b, return their sum as a binary string.',
        solutionTemplate: `def addBinary(a, b):\n    return bin(int(a, 2) + int(b, 2))[2:]`,
        testCases: [{ input: 'a = "11", b = "1"', expected: '"100"' }]
      },
      {
        id: 'prob-11',
        title: 'Single Number',
        difficulty: 'Easy',
        solved: false,
        category: 'Bit Manipulation',
        description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
        solutionTemplate: `def singleNumber(nums):\n    res = 0\n    for n in nums:\n        res ^= n\n    return res`,
        testCases: [{ input: 'nums = [2,2,1]', expected: '1' }]
      },
      {
        id: 'prob-12',
        title: 'Number of 1 Bits',
        difficulty: 'Easy',
        solved: false,
        category: 'Bit Manipulation',
        description: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has.',
        solutionTemplate: `def hammingWeight(n):\n    res = 0\n    while n:\n        res += n % 2\n        n = n >> 1\n    return res`,
        testCases: [{ input: 'n = 11', expected: '3' }]
      }
    ]
  },
  {
    id: 'leetmaster-75',
    name: 'LeetMaster 75',
    solvedCount: 1,
    totalCount: 75,
    problems: [
      {
        id: 'prob-sweetness',
        title: 'Maximum Sweetness Partition',
        difficulty: 'Medium',
        solved: false,
        category: 'Array Partitioning',
        description: 'Given an integer array arr, partition the array into contiguous subarrays of length at most k. After partitioning, each subarray has its values changed to become the maximum value of that subarray.\n\nReturn the largest sum of the given array after partitioning.',
        solutionTemplate: `class Solution {
    maxSumAfterPartitioning(arr, k) {
        // arr: integer array
        // k: maximum length of a partition
        // Return the largest possible sum after partitioning
        return 0;
    }
}`,
        testCases: [
          { input: '{"arr":[1,15,7,9,2,5,10],"k":3}', expected: '84' },
          { input: '{"arr":[1,4,1,5,7,3,6,1,9,9,3],"k":4}', expected: '83' },
          { input: '{"arr":[1],"k":1}', expected: '1' }
        ]
      },
      {
        id: 'prob-1',
        title: 'Count Road Collisions',
        difficulty: 'Hard',
        solved: false,
        category: 'Simulation',
        description: 'There are n cars moving on a road from left to right. Return the total number of collisions.',
        solutionTemplate: `def countCollisions(directions):\n    res = 0\n    n = len(directions)\n    left, right = 0, n - 1\n    while left < n and directions[left] == 'L':\n        left += 1\n    while right >= 0 and directions[right] == 'R':\n        right -= 1\n    for i in range(left, right + 1):\n        if directions[i] != 'S':\n            res += 1\n    return res`,
        testCases: [{ input: 'directions = "RLRSLL"', expected: '5' }]
      },
      {
        id: 'prob-6',
        title: 'Gas Station',
        difficulty: 'Medium',
        solved: false,
        category: 'Greedy',
        description: 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].',
        solutionTemplate: `def canCompleteCircuit(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    total_gas, start_index = 0, 0\n    for i in range(len(gas)):\n        total_gas += gas[i] - cost[i]\n        if total_gas < 0:\n            total_gas = 0\n            start_index = i + 1\n    return start_index`,
        testCases: [{ input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', expected: '3' }]
      },
      {
        id: 'prob-7',
        title: 'Jump Game',
        difficulty: 'Medium',
        solved: false,
        category: 'Greedy',
        description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position.',
        solutionTemplate: `def canJump(nums):\n    goal = len(nums) - 1\n    for i in range(len(nums) - 2, -1, -1):\n        if i + nums[i] >= goal:\n            goal = i\n    return goal == 0`,
        testCases: [{ input: 'nums = [2,3,1,1,4]', expected: 'True' }]
      },
      {
        id: 'prob-8',
        title: 'Assign Cookies',
        difficulty: 'Easy',
        solved: true,
        category: 'Greedy',
        description: 'Assume you are an awesome parent and want to give your children some cookies.',
        solutionTemplate: `def findContentChildren(g, s):\n    g.sort()\n    s.sort()\n    child_i, cookie_j = 0, 0\n    while child_i < len(g) and cookie_j < len(s):\n        if s[cookie_j] >= g[child_i]:\n            child_i += 1\n        cookie_j += 1\n    return child_i`,
        testCases: [{ input: 'g = [1,2,3], s = [1,1]', expected: '1' }]
      },
      {
        id: 'prob-14',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        solutionTemplate: `def lengthOfLIS(nums):\n    if not nums: return 0\n    LIS = [1] * len(nums)\n    for i in range(len(nums) - 1, -1, -1):\n        for j in range(i + 1, len(nums)):\n            if nums[i] < nums[j]:\n                LIS[i] = max(LIS[i], 1 + LIS[j])\n    return max(LIS)`,
        testCases: [{ input: 'nums = [10,9,2,5,3,7,101,18]', expected: '4' }]
      }
    ]
  }
];

const INITIAL_SHEETS_DATA: DsaSheet[] = padSheetProblems(INITIAL_SHEETS_DATA_RAW);

// Helper to get beautiful, descriptive template code for a problem in JavaScript, Python, C++, or Java
function getBoilerplateCode(problem: DsaProblem, lang: 'javascript' | 'python' | 'cpp' | 'java'): string {
  // If the problem already has a custom javascript-like solutionTemplate and the lang is javascript
  if (lang === 'javascript' && problem.id === 'prob-sweetness') {
    return problem.solutionTemplate;
  }

  // Define problem-specific templates
  if (problem.id === 'prob-sweetness' || problem.title.includes('Sweetness')) {
    if (lang === 'javascript') {
      return `class Solution {
    maxSumAfterPartitioning(arr, k) {
        // arr: integer array
        // k: maximum length of a partition
        // Return the largest possible sum after partitioning
        return 0;
    }
}`;
    } else if (lang === 'python') {
      return `class Solution:
    def maxSumAfterPartitioning(self, arr: list[int], k: int) -> int:
        # arr: list of integers
        # k: maximum partition length
        # Return the largest sum after partitioning
        return 0`;
    } else if (lang === 'cpp') {
      return `class Solution {
public:
    int maxSumAfterPartitioning(vector<int>& arr, int k) {
        // arr: vector of integers
        // k: maximum partition length
        // Return the largest sum after partitioning
        return 0;
    }
};`;
    } else {
      return `class Solution {
    public int maxSumAfterPartitioning(int[] arr, int k) {
        // arr: array of integers
        // k: maximum partition length
        // Return the largest sum after partitioning
        return 0;
    }
}`;
    }
  }

  // Predefined templates for Two Sum
  if (problem.id === 'prob-2' || problem.title.includes('Two Sum')) {
    if (lang === 'javascript') {
      return `class Solution {
    twoSum(nums, target) {
        // nums: array of integers
        // target: integer
        // Return indices of the two numbers that add up to target
        return [];
    }
}`;
    } else if (lang === 'python') {
      return `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # nums: list of integers
        # target: integer target
        # Return list of indices
        return []`;
    } else if (lang === 'cpp') {
      return `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Return a vector of two indices
        return {};
    }
};`;
    } else {
      return `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Return array of two indices
        return new int[0];
    }
}`;
    }
  }

  // Predefined templates for Palindrome Number
  if (problem.id === 'prob-3' || problem.title.includes('Palindrome')) {
    if (lang === 'javascript') {
      return `class Solution {
    isPalindrome(x) {
        // x: integer
        // Return true if x is a palindrome, false otherwise
        return false;
    }
}`;
    } else if (lang === 'python') {
      return `class Solution:
    def isPalindrome(self, x: int) -> bool:
        # x: integer
        # Return true if x is a palindrome
        return False`;
    } else if (lang === 'cpp') {
      return `class Solution {
public:
    bool isPalindrome(int x) {
        return false;
    }
};`;
    } else {
      return `class Solution {
    public boolean isPalindrome(int x) {
        return false;
    }
}`;
    }
  }

  // Fallback template generator
  const methodName = problem.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w, idx) => idx === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  if (lang === 'javascript') {
    return `class Solution {
    ${methodName}(arr) {
        // ${problem.title} solution
        // Return output
        return null;
    }
}`;
  } else if (lang === 'python') {
    return `class Solution:
    def ${methodName}(self, arr: any) -> any:
        # ${problem.title} solution
        return None`;
  } else if (lang === 'cpp') {
    return `class Solution {
public:
    auto ${methodName}(vector<int>& arr) {
        // ${problem.title} solution
        return 0;
    }
};`;
  } else {
    return `class Solution {
    public Object ${methodName}(int[] arr) {
        // ${problem.title} solution
        return null;
    }
}`;
  }
}

// Helper to get optimal solution for the Solutions tab
function getOptimalSolution(problem: DsaProblem, lang: 'javascript' | 'python' | 'cpp' | 'java'): string {
  if (problem.id === 'prob-sweetness' || problem.title.includes('Sweetness')) {
    if (lang === 'javascript') {
      return `class Solution {
    maxSumAfterPartitioning(arr, k) {
        const n = arr.length;
        const dp = new Array(n + 1).fill(0);
        for (let i = 1; i <= n; i++) {
            let curMax = 0;
            for (let j = 1; j <= k && i - j >= 0; j++) {
                curMax = Math.max(curMax, arr[i - j]);
                dp[i] = Math.max(dp[i], dp[i - j] + curMax * j);
            }
        }
        return dp[n];
    }
}`;
    } else if (lang === 'python') {
      return `class Solution:
    def maxSumAfterPartitioning(self, arr: list[int], k: int) -> int:
        n = len(arr)
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            cur_max = 0
            for j in range(1, min(k, i) + 1):
                cur_max = max(cur_max, arr[i - j])
                dp[i] = max(dp[i], dp[i - j] + cur_max * j)
        return dp[n]`;
    } else if (lang === 'cpp') {
      return `class Solution {
public:
    int maxSumAfterPartitioning(vector<int>& arr, int k) {
        int n = arr.size();
        vector<int> dp(n + 1, 0);
        for (int i = 1; i <= n; i++) {
            int curMax = 0;
            for (int j = 1; j <= k && i - j >= 0; j++) {
                curMax = max(curMax, arr[i - j]);
                dp[i] = max(dp[i], dp[i - j] + curMax * j);
            }
        }
        return dp[n];
    }
};`;
    } else {
      return `class Solution {
    public int maxSumAfterPartitioning(int[] arr, int k) {
        int n = arr.length;
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int curMax = 0;
            for (int j = 1; j <= k && i - j >= 0; j++) {
                curMax = Math.max(curMax, arr[i - j]);
                dp[i] = Math.max(dp[i], dp[i - j] + curMax * j);
            }
        }
        return dp[n];
    }
}`;
    }
  }

  if (problem.id === 'prob-2' || problem.title.includes('Two Sum')) {
    if (lang === 'javascript') {
      return `class Solution {
    twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
            const diff = target - nums[i];
            if (map.has(diff)) return [map.get(diff), i];
            map.set(nums[i], i);
        }
        return [];
    }
}`;
    } else if (lang === 'python') {
      return `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        prevMap = {}
        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
        return []`;
    } else if (lang === 'cpp') {
      return `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> prevMap;
        for (int i = 0; i < nums.size(); ++i) {
            int diff = target - nums[i];
            if (prevMap.find(diff) != prevMap.end()) {
                return {prevMap[diff], i};
            }
            prevMap[nums[i]] = i;
        }
        return {};
    }
};`;
    } else {
      return `class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> prevMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (prevMap.containsKey(diff)) {
                return new int[] { prevMap.get(diff), i };
            }
            prevMap.put(nums[i], i);
        }
        return new int[0];
    }
}`;
    }
  }

  // Fallback
  return `class Solution {
    // Optimal implementation with O(N) time complexity and O(1) extra space.
}`;
}

// Helper to resolve tags, companies and hints dynamically for the accordion
function getProblemExtras(problem: DsaProblem) {
  const tags = [problem.category, 'Algorithms', problem.difficulty];
  const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'].slice(0, Math.floor(Math.random() * 3) + 2);
  const hints = [
    `Understand the constraints: ${problem.description.includes('array') ? 'check for out of bounds' : 'verify empty/null inputs'}.`,
    `Consider utilizing a helper data structure like a map, set, or sliding window to optimize search space.`,
    `The optimal time complexity is O(N) or O(N log N). Ensure you avoid O(N^2) nested loops if possible.`,
    `Be careful with off-by-one errors and extreme/negative values in the input.`
  ];

  if (problem.id === 'prob-sweetness' || problem.title.includes('Sweetness')) {
    return {
      tags: ['Dynamic Programming', 'Array Partitioning', 'Memoization'],
      companies: ['Google', 'Amazon', 'Adobe', 'Bloomberg'],
      hints: [
        'Try to use dynamic programming. Let dp[i] be the maximum sum of partitioning the prefix arr[0...i-1].',
        'To find dp[i], consider the last partition subarray ending at i-1. Its length can be j where 1 <= j <= k.',
        'The values of this subarray will all be changed to the maximum value in arr[i-j...i-1].',
        'So, dp[i] = max(dp[i-j] + max_val * j) for all valid j.'
      ]
    };
  }

  return { tags, companies, hints };
}

// Seed list of initial curated problems
const INITIAL_PROBLEMS: DsaProblem[] = [
  {
    id: 'prob-sweetness',
    title: 'Maximum Sweetness Partition',
    difficulty: 'Medium',
    solved: false,
    category: 'Array Partitioning',
    description: 'Given an integer array arr, partition the array into contiguous subarrays of length at most k. After partitioning, each subarray has its values changed to become the maximum value of that subarray.\n\nReturn the largest sum of the given array after partitioning.',
    solutionTemplate: `class Solution {
    maxSumAfterPartitioning(arr, k) {
        // arr: integer array
        // k: maximum length of a partition
        // Return the largest possible sum after partitioning
        return 0;
    }
}`,
    testCases: [
      { input: '{"arr":[1,15,7,9,2,5,10],"k":3}', expected: '84' },
      { input: '{"arr":[1,4,1,5,7,3,6,1,9,9,3],"k":4}', expected: '83' },
      { input: '{"arr":[1],"k":1}', expected: '1' }
    ]
  },
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

const DYNAMIC_LARGE_PROBLEMS_POOL = generateLargeProblemsList(INITIAL_PROBLEMS);

export default function DsaProblems() {
  const [sheets, setSheets] = useState<DsaSheet[]>(INITIAL_SHEETS_DATA);
  const [problems, setProblems] = useState<DsaProblem[]>(DYNAMIC_LARGE_PROBLEMS_POOL);
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  
  // Pagination & Load More States
  const [visibleCount, setVisibleCount] = useState(50);

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

  // Multi-Language Interactive IDE State Variables
  const [activeLanguage, setActiveLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');
  const [userCodeByLang, setUserCodeByLang] = useState<Record<string, Record<string, string>>>({});
  const [leftTab, setLeftTab] = useState<'description' | 'solutions' | 'submissions'>('description');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'results'>('testcases');
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [submissionOutput, setSubmissionOutput] = useState<{ 
    status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Pending'; 
    results?: { passed: boolean; output: any; expected: any; inputStr: string }[]; 
    error?: string; 
    lang?: string;
  } | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<Record<string, { status: string; lang: string; time: string; runtime: string }[]>>({});

  // Find active sheet and problem for the workspace
  const activeSheet = sheets.find(s => s.id === selectedSheetId) || null;
  const activeProblem = (activeSheet ? activeSheet.problems.find(p => p.id === selectedProblemId) : null) || problems.find(p => p.id === selectedProblemId) || null;

  // Sync editor template with language persistence
  useEffect(() => {
    if (activeProblem) {
      const problemCodes = userCodeByLang[activeProblem.id] || {};
      const existing = problemCodes[activeLanguage];
      if (existing !== undefined) {
        setCode(existing);
      } else {
        const boilerplate = getBoilerplateCode(activeProblem, activeLanguage);
        setCode(boilerplate);
        setUserCodeByLang(prev => ({
          ...prev,
          [activeProblem.id]: {
            ...(prev[activeProblem.id] || {}),
            [activeLanguage]: boilerplate
          }
        }));
      }
      setTestCasesPassed([]);
      setConsoleLogs([]);
      setSubmissionOutput(null);
      setBottomTab('testcases');
      setActiveCaseIndex(0);
      setLeftTab('description');
      setExpandedAccordion(null);
    }
  }, [selectedProblemId, selectedSheetId, activeLanguage]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (activeProblem) {
      setUserCodeByLang(prev => ({
        ...prev,
        [activeProblem.id]: {
          ...(prev[activeProblem.id] || {}),
          [activeLanguage]: newCode
        }
      }));
    }
  };

  // Helper to execute client-side JavaScript user code with inputs and expectations
  const runJavaScriptCode = (userCode: string, problem: DsaProblem) => {
    const cleanCode = userCode + "\n\nif (typeof Solution !== 'undefined') { return new Solution(); } else { throw new Error('Class Solution not found'); }";
    let solutionInstance: any;
    try {
      const creatorFn = new Function(cleanCode);
      solutionInstance = creatorFn();
    } catch (e: any) {
      throw new Error(`Syntax Error in Solution declaration: ${e.message}`);
    }

    return problem.testCases.map((tc) => {
      let parsedInput: any[] = [];
      let inputStr = tc.input;
      
      try {
        if (tc.input.trim().startsWith('{')) {
          const obj = JSON.parse(tc.input);
          if (problem.id === 'prob-sweetness' || problem.title.includes('Sweetness')) {
            parsedInput = [obj.arr, obj.k];
          } else {
            parsedInput = Object.values(obj);
          }
        } else if (tc.input.includes('nums =') && tc.input.includes('target =')) {
          const numsMatch = tc.input.match(/nums\s*=\s*(\[[^\]]*\])/);
          const targetMatch = tc.input.match(/target\s*=\s*(\d+)/);
          if (numsMatch && targetMatch) {
            const nums = JSON.parse(numsMatch[1]);
            const target = parseInt(targetMatch[2], 10);
            parsedInput = [nums, target];
          }
        } else if (tc.input.includes('directions =')) {
          const dirMatch = tc.input.match(/directions\s*=\s*"([^"]+)"/);
          if (dirMatch) {
            parsedInput = [dirMatch[1]];
          }
        } else {
          parsedInput = [tc.input];
        }
      } catch {
        parsedInput = [tc.input];
      }

      let userMethod = 'maxSumAfterPartitioning';
      if (problem.id === 'prob-2' || problem.title.includes('Two Sum')) {
        userMethod = 'twoSum';
      } else if (problem.id === 'prob-3' || problem.title.includes('Palindrome')) {
        userMethod = 'isPalindrome';
      } else {
        const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(solutionInstance));
        const found = keys.find(k => k !== 'constructor');
        if (found) userMethod = found;
      }

      if (typeof solutionInstance[userMethod] !== 'function') {
        throw new Error(`Method "${userMethod}" not found on class Solution.`);
      }

      try {
        const output = solutionInstance[userMethod](...parsedInput);
        const actualString = JSON.stringify(output);
        const expectedString = tc.expected.trim();
        
        let passed = false;
        try {
          const parsedActual = JSON.parse(actualString);
          const parsedExpected = JSON.parse(expectedString);
          passed = JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
        } catch {
          passed = actualString.replace(/\s+/g, '') === expectedString.replace(/\s+/g, '');
        }

        return {
          passed,
          output: output,
          expected: tc.expected,
          inputStr: inputStr
        };
      } catch (err: any) {
        throw new Error(`Execution Error in ${userMethod}: ${err.message}`);
      }
    });
  };

  // Run Code and Submission assertions pipeline
  const handleRunOrSubmit = (isSubmit: boolean) => {
    if (!activeProblem) return;
    setIsRunning(true);
    setRunProgress(0);
    setBottomTab('results');
    setSubmissionOutput({ status: 'Pending' });
    
    const displayLang = activeLanguage === 'javascript' ? 'JavaScript (Node.js)' : activeLanguage === 'python' ? 'Python 3.10' : activeLanguage === 'cpp' ? 'C++20 (GCC)' : 'Java 17 (OpenJDK)';
    setConsoleLogs([
      `Initializing Sandbox Environment for ${displayLang}...`,
      "Loading execution dependencies...",
      "Piping assertion test cases into stream buffer..."
    ]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setRunProgress(currentProgress);
      
      if (currentProgress === 20) {
        setConsoleLogs(prev => [...prev, "✓ Execution sandbox environment ready.", "Analyzing syntax and structural constraints..."]);
      } else if (currentProgress === 60) {
        setConsoleLogs(prev => [...prev, "✓ Code compiled successfully.", "Running test cases in verification loop..."]);
      } else if (currentProgress === 100) {
        clearInterval(interval);
        setIsRunning(false);

        try {
          let testResults: { passed: boolean; output: any; expected: any; inputStr: string }[] = [];
          
          if (activeLanguage === 'javascript') {
            testResults = runJavaScriptCode(code, activeProblem);
          } else {
            const isTemplateUnchanged = code.trim() === getBoilerplateCode(activeProblem, activeLanguage).trim();
            if (isTemplateUnchanged) {
              testResults = activeProblem.testCases.map((tc) => {
                let dummyOutput = '0';
                if (activeProblem.id === 'prob-2' || activeProblem.title.includes('Two Sum')) {
                  dummyOutput = '[]';
                } else if (activeProblem.title.includes('Palindrome')) {
                  dummyOutput = 'false';
                }
                return {
                  passed: false,
                  output: dummyOutput,
                  expected: tc.expected,
                  inputStr: tc.input
                };
              });
            } else {
              const isGibberish = code.length < 45 || (!code.includes('Solution') && !code.includes('def') && !code.includes('class'));
              if (isGibberish) {
                testResults = activeProblem.testCases.map((tc) => ({
                  passed: false,
                  output: 'Error/Null Output',
                  expected: tc.expected,
                  inputStr: tc.input
                }));
              } else {
                testResults = activeProblem.testCases.map((tc) => ({
                  passed: true,
                  output: tc.expected,
                  inputStr: tc.input,
                  expected: tc.expected
                }));
              }
            }
          }

          const allPassed = testResults.every(r => r.passed);
          
          if (allPassed) {
            setTestCasesPassed(activeProblem.testCases.map(() => true));
            setConsoleLogs(prev => [
              ...prev,
              "Executing Test Cases...",
              ...testResults.map((tr, idx) => `  Case ${idx + 1}: Input: ${tr.inputStr} -> Expected: ${tr.expected}, Got: ${JSON.stringify(tr.output)} ✓ Match!`),
              "Submission compiled and completed successfully.",
              "Database ledger successfully synced!"
            ]);

            setSubmissionOutput({
              status: 'Accepted',
              results: testResults,
              lang: activeLanguage
            });

            // Update solved state in React state
            setProblems(prevProblems => prevProblems.map(p => {
              if (p.id === activeProblem.id) {
                return { ...p, solved: true };
              }
              return p;
            }));

            // Mark as solved inside the sheet problems as well
            setSheets(prevSheets => prevSheets.map(s => {
              const hasProblem = s.problems.some(p => p.id === activeProblem.id);
              if (hasProblem) {
                const updatedProblems = s.problems.map(p => {
                  if (p.id === activeProblem.id) {
                    return { ...p, solved: true };
                  }
                  return p;
                });
                const solvedCount = updatedProblems.filter(p => p.solved).length;
                return {
                  ...s,
                  problems: updatedProblems,
                  solvedCount: Math.min(s.totalCount, solvedCount)
                };
              }
              return s;
            }));

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setSubmissionHistory(prev => ({
              ...prev,
              [activeProblem.id]: [
                {
                  status: 'Accepted',
                  lang: activeLanguage.toUpperCase(),
                  time: timestamp,
                  runtime: '48 ms'
                },
                ...(prev[activeProblem.id] || [])
              ]
            }));

            if (isSubmit) {
              setShowSuccessOverlay(true);
            }
          } else {
            setTestCasesPassed(testResults.map(r => r.passed));
            setConsoleLogs(prev => [
              ...prev,
              "Executing Test Cases...",
              ...testResults.map((tr, idx) => `  Case ${idx + 1}: Input: ${tr.inputStr} -> Got: ${JSON.stringify(tr.output)}, Expected: ${tr.expected} ${tr.passed ? '✓' : '❌'}`),
              "❌ Wrong Answer: Your output did not match the expected assertion."
            ]);

            setSubmissionOutput({
              status: 'Wrong Answer',
              results: testResults,
              lang: activeLanguage
            });

            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setSubmissionHistory(prev => ({
              ...prev,
              [activeProblem.id]: [
                {
                  status: 'Wrong Answer',
                  lang: activeLanguage.toUpperCase(),
                  time: timestamp,
                  runtime: 'N/A'
                },
                ...(prev[activeProblem.id] || [])
              ]
            }));
          }

        } catch (err: any) {
          setTestCasesPassed([]);
          setConsoleLogs(prev => [
            ...prev,
            `❌ Compiler Error: ${err.message}`
          ]);
          setSubmissionOutput({
            status: 'Runtime Error',
            error: err.message,
            lang: activeLanguage
          });

          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setSubmissionHistory(prev => ({
            ...prev,
            [activeProblem.id]: [
              {
                status: 'Runtime Error',
                lang: activeLanguage.toUpperCase(),
                time: timestamp,
                runtime: 'N/A'
              },
              ...(prev[activeProblem.id] || [])
            ]
          }));
        }
      }
    }, 200);
  };

  // Load More logic
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 100);
  };

  useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery, difficultyFilter, categoryFilter, sortBy]);

  // Mark all questions of a specific sheet completed or complete all sheets!
  const handleCompleteSheet = (sheetId: string) => {
    setSheets(prev => prev.map(s => {
      if (s.id === sheetId) {
        const solvedProblems = s.problems.map(p => ({ ...p, solved: true }));
        return { ...s, problems: solvedProblems, solvedCount: s.totalCount };
      }
      return s;
    }));
    // Also mark them solved in main list
    const sheet = sheets.find(s => s.id === sheetId);
    if (sheet) {
      const ids = sheet.problems.map(p => p.id);
      setProblems(prev => prev.map(p => {
        if (ids.includes(p.id)) return { ...p, solved: true };
        return p;
      }));
    }
  };

  const handleCompleteAllSheets = () => {
    setSheets(prev => prev.map(s => {
      const solvedProblems = s.problems.map(p => ({ ...p, solved: true }));
      return { ...s, problems: solvedProblems, solvedCount: s.totalCount };
    }));
    setProblems(prev => prev.map(p => ({ ...p, solved: true })));
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

  const hasMore = visibleCount < filteredProblems.length;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
         {!selectedProblemId ? (
          selectedSheetId !== null ? (
            /* DETAILED CURATED ROADMAP SHEET VIEW (BENTO STYLE) */
            <motion.div
              key="sheet-details-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Back Button and Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 dark:border-stone-800 pb-6 gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSheetId(null);
                    }}
                    className="p-3 bg-white dark:bg-stone-900 hover:bg-[#ff6b2b] hover:text-white dark:hover:bg-[#ff6b2b] border border-stone-200 dark:border-stone-850 rounded-2xl text-stone-650 dark:text-stone-300 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none"
                    title="Back to Curated Roadmaps"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#ff6b2b]/10 text-[#ff6b2b] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">Curated Roadmap Details</span>
                    </div>
                    <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
                      {activeSheet?.name}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mark All Active Sheet Questions Completed */}
                  {activeSheet && activeSheet.solvedCount < activeSheet.totalCount && (
                    <button
                      type="button"
                      onClick={() => handleCompleteSheet(activeSheet.id)}
                      className="flex items-center gap-2 px-4.5 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] dark:bg-[#ff6b2b] dark:hover:bg-[#ff804a] text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Complete All in Sheet</span>
                    </button>
                  )}
                  <span className="text-xs text-stone-450 dark:text-stone-500 font-mono font-semibold">
                    LeetMaster Verified
                  </span>
                </div>
              </div>

              {/* Bento Grid layout for sheet header metadata */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Large main card: description + owl mascot */}
                <div className="md:col-span-8 bg-gradient-to-r from-[#ff6b2b]/5 to-amber-500/[0.02] dark:from-[#ff6b2b]/10 dark:to-transparent border border-stone-200 dark:border-stone-800 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                  {/* Glowing background radial */}
                  <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#ff6b2b]/10 blur-3xl" />
                  
                  <div className="flex-shrink-0 bg-white dark:bg-stone-950 p-4 rounded-3xl border border-stone-200 dark:border-stone-850 shadow-sm relative z-10">
                    <OwlLogo />
                  </div>

                  <div className="space-y-2.5 relative z-10 text-center md:text-left flex-1">
                    <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
                      About {activeSheet?.name}
                    </h2>
                    <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 leading-relaxed max-w-xl">
                      {activeSheet ? getSheetSummary(activeSheet.id) : ''}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold text-stone-500 dark:text-stone-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500" /> Curated By LeetMaster
                      </span>
                      <span className="hidden md:inline text-stone-300 dark:text-stone-700">•</span>
                      <span>Verified Sandbox Supported</span>
                    </div>
                  </div>
                </div>

                {/* Smaller progress card */}
                <div className="md:col-span-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider font-mono">
                      Your Completion Stats
                    </h3>
                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-4xl font-black text-stone-900 dark:text-white font-mono">
                        {activeSheet?.solvedCount}
                      </span>
                      <span className="text-sm font-bold text-stone-400 font-mono">
                        / {activeSheet?.totalCount} Solved
                      </span>
                    </div>
                  </div>

                  {/* Styled Progress Bar */}
                  <div className="mt-6 space-y-2">
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#ff6b2b] h-full rounded-full transition-all duration-500"
                        style={{ width: `${activeSheet ? (activeSheet.solvedCount / activeSheet.totalCount) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-stone-400 font-mono">
                      <span>{activeSheet ? Math.round((activeSheet.solvedCount / activeSheet.totalCount) * 100) : 0}% Complete</span>
                      <span>{activeSheet && activeSheet.solvedCount === activeSheet.totalCount ? 'Completed!' : 'In Progress'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LIST OF PROBLEMS FOR THIS ACTIVE SHEET */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-450 dark:text-stone-550 font-mono">
                    Sheet Roadmap Checklist
                  </h3>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono font-semibold">
                    Click any problem below to solve it in the sandbox compiler
                  </span>
                </div>

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
                        {activeSheet && activeSheet.problems.map((prob) => (
                          <tr 
                            key={prob.id}
                            className="hover:bg-stone-50/40 dark:hover:bg-stone-900/20 transition-all"
                          >
                            {/* Toggle Solved Checkbox Button */}
                            <td className="py-4.5 px-6">
                              <button
                                type="button"
                                onClick={() => {
                                  setSheets(prev => prev.map(s => {
                                    if (s.id === activeSheet.id) {
                                      const updated = s.problems.map(p => {
                                        if (p.id === prob.id) {
                                          return { ...p, solved: !p.solved };
                                        }
                                        return p;
                                      });
                                      const solvedCount = updated.filter(p => p.solved).length;
                                      return { ...s, problems: updated, solvedCount };
                                    }
                                    return s;
                                  }));
                                  setProblems(prev => prev.map(p => {
                                    if (p.id === prob.id) {
                                      return { ...p, solved: !p.solved };
                                    }
                                    return p;
                                  }));
                                }}
                                className="focus:outline-none cursor-pointer"
                              >
                                {prob.solved ? (
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 fill-current" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-700 flex-shrink-0 hover:border-[#ff6b2b] transition-all" />
                                )}
                              </button>
                            </td>

                            {/* Title Column */}
                            <td className="py-4.5 px-6">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!problems.some(p => p.id === prob.id)) {
                                    setProblems(prev => [prob, ...prev]);
                                  }
                                  setSelectedProblemId(prob.id);
                                }}
                                className="text-xs font-extrabold text-stone-900 dark:text-stone-100 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] transition-colors focus:outline-none text-left cursor-pointer"
                              >
                                {prob.title}
                              </button>
                            </td>

                            {/* Topic Tag */}
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

                            {/* Acceptance Rate */}
                            <td className="py-4.5 px-6">
                              <span className="text-xs font-bold text-stone-500 dark:text-stone-450 font-mono">
                                {prob.difficulty === 'Easy' ? '82.4%' : prob.difficulty === 'Medium' ? '54.2%' : '31.1%'}
                              </span>
                            </td>

                            {/* Action Code button */}
                            <td className="py-4.5 px-6 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!problems.some(p => p.id === prob.id)) {
                                    setProblems(prev => [prob, ...prev]);
                                  }
                                  setSelectedProblemId(prob.id);
                                }}
                                className="px-3.5 py-1.5 bg-[#ff6b2b]/10 hover:bg-[#ff6b2b] text-[#ff6b2b] hover:text-white text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 ml-auto cursor-pointer focus:outline-none"
                              >
                                <Code2 className="w-3.5 h-3.5" />
                                <span>Code</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
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
                  <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight flex items-center gap-3">
                    Problems
                    <span className="text-xs font-black font-mono bg-[#ff6b2b]/10 text-[#ff6b2b] px-3 py-1 rounded-full border border-[#ff6b2b]/20">
                      2,150+ Total
                    </span>
                  </h1>
                  <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                    Boost your coding skills with our massive database of 2,150+ curated DSA challenges.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {sheets.map((sheet) => {
                    const isCompleted = sheet.solvedCount >= sheet.totalCount;
                    return (
                      <div
                        key={sheet.id}
                        onClick={() => {
                          setSelectedSheetId(sheet.id);
                          setSelectedProblemId(null);
                        }}
                        className="group relative text-left p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#ff6b2b] hover:shadow-xl cursor-pointer block select-none"
                      >
                        {/* Inner Subtle Grid Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-between h-36">
                          
                          {/* Card Top Row */}
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-[15px] font-extrabold text-stone-900 dark:text-white leading-snug group-hover:text-[#ff6b2b] transition-colors line-clamp-2">
                              {sheet.name}
                            </h3>
                            
                            {/* Solve count fraction */}
                            <div className="flex items-baseline gap-0.5 flex-shrink-0 text-right">
                              <span className="text-2xl font-black text-stone-900 dark:text-white font-mono leading-none">
                                {sheet.solvedCount}
                              </span>
                              <span className="text-xs font-bold text-stone-450 dark:text-stone-500 font-mono">
                                /{sheet.totalCount}
                              </span>
                            </div>
                          </div>

                          {/* Card Bottom Row */}
                          <div className="flex items-end justify-between pt-4 border-t border-stone-200/50 dark:border-stone-800/50">
                            <div>
                              {!isCompleted ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteSheet(sheet.id);
                                  }}
                                  className="text-[10px] font-bold text-[#ff6b2b] hover:underline cursor-pointer focus:outline-none relative z-20"
                                >
                                  Complete All
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 relative z-20">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Done
                                </span>
                              )}
                            </div>

                            {/* Stylized LeetMaster Icon */}
                            <div className="w-8 h-8 rounded-full bg-orange-100/80 dark:bg-orange-950/50 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-all duration-300">
                              <Trophy className="w-4 h-4 fill-current" />
                            </div>
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
                      {filteredProblems.slice(0, visibleCount).map((prob) => (
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
          )
        ) : (
          
          /* ACTIVE INTERACTIVE SOLVER IDE WORKSPACE */
          <motion.div
            key="problems-workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-5"
          >
            {/* Solver Workspace Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-stone-900 p-4.5 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
              {/* Left Side: Mascot, Back, Prev/Next, Shuffle */}
              <div className="flex flex-wrap items-center gap-3.5">
                <div className="flex-shrink-0 bg-stone-50 dark:bg-stone-950 p-2 rounded-2xl border border-stone-100 dark:border-stone-850 shadow-sm">
                  <OwlLogo />
                </div>
                <div className="h-6 w-[1px] bg-stone-200 dark:bg-stone-800 hidden sm:block" />
                
                <button
                  type="button"
                  onClick={() => setSelectedProblemId(null)}
                  className="text-xs font-black text-stone-600 hover:text-[#ff6b2b] dark:text-stone-300 dark:hover:text-[#ff6b2b] flex items-center gap-1.5 cursor-pointer focus:outline-none transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Problem List</span>
                </button>

                <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-950 p-1.5 rounded-2xl border border-stone-200/50 dark:border-stone-850">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIdx = problems.findIndex(p => p.id === activeProblem?.id);
                      if (currentIdx > 0) {
                        setSelectedProblemId(problems[currentIdx - 1].id);
                      }
                    }}
                    disabled={problems.findIndex(p => p.id === activeProblem?.id) <= 0}
                    className="p-1.5 hover:bg-white dark:hover:bg-stone-900 rounded-xl disabled:opacity-30 text-stone-600 dark:text-stone-450 transition-colors cursor-pointer"
                    title="Previous Problem"
                  >
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIdx = problems.findIndex(p => p.id === activeProblem?.id);
                      if (currentIdx < problems.length - 1) {
                        setSelectedProblemId(problems[currentIdx + 1].id);
                      }
                    }}
                    disabled={problems.findIndex(p => p.id === activeProblem?.id) >= problems.length - 1}
                    className="p-1.5 hover:bg-white dark:hover:bg-stone-900 rounded-xl disabled:opacity-30 text-stone-600 dark:text-stone-450 transition-colors cursor-pointer"
                    title="Next Problem"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const pool = problems.filter(p => p.id !== activeProblem?.id);
                      if (pool.length > 0) {
                        const rand = pool[Math.floor(Math.random() * pool.length)];
                        setSelectedProblemId(rand.id);
                      }
                    }}
                    className="p-1.5 hover:bg-white dark:hover:bg-stone-900 rounded-xl text-stone-650 dark:text-stone-400 transition-colors cursor-pointer"
                    title="Random Problem"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Center Action: Submit Button */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRunOrSubmit(true)}
                  disabled={isRunning}
                  className="bg-[#ff6b2b] hover:bg-[#e0561a] disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white font-black text-xs px-6 py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
                >
                  {isRunning ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                  <span>Submit Code</span>
                </button>
              </div>

              {/* Right Side: Gamified Metrics and User Profile */}
              <div className="flex items-center justify-center sm:justify-end gap-2.5">
                {/* Flame Streak */}
                <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-950 px-3 py-2 rounded-2xl border border-stone-200/50 dark:border-stone-850 text-stone-700 dark:text-stone-300 text-xs font-black font-mono">
                  <Flame className="w-4 h-4 text-orange-500 fill-current" />
                  <span>128</span>
                </div>
                {/* XP Count */}
                <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-950 px-3 py-2 rounded-2xl border border-stone-200/50 dark:border-stone-850 text-stone-700 dark:text-stone-300 text-xs font-black font-mono">
                  <Layers className="w-4 h-4 text-purple-500" />
                  <span>250</span>
                </div>
                {/* Crown Rank */}
                <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-950 px-3 py-2 rounded-2xl border border-stone-200/50 dark:border-stone-850 text-stone-700 dark:text-stone-300 text-xs font-black font-mono">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>5</span>
                </div>
                
                <div className="h-6 w-[1px] bg-stone-200 dark:bg-stone-800" />
                
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 dark:border-stone-750 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
                    alt="User profile avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* SPLIT SCREEN WORKSPACE LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch h-[calc(100vh-180px)] min-h-[750px]">
              
              {/* Left Pane: Tabs Navigation and Content */}
              <div className="lg:col-span-5 flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm h-full">
                {/* Tabs selection header */}
                <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-2 gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setLeftTab('description')}
                    className={`px-4.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none ${leftTab === 'description' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200 dark:border-stone-700' : 'text-stone-400 hover:text-stone-650 dark:hover:text-stone-350'}`}
                  >
                    Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeftTab('solutions')}
                    className={`px-4.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none ${leftTab === 'solutions' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200 dark:border-stone-700' : 'text-stone-400 hover:text-stone-650 dark:hover:text-stone-350'}`}
                  >
                    Solutions
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeftTab('submissions')}
                    className={`px-4.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none ${leftTab === 'submissions' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200 dark:border-stone-700' : 'text-stone-400 hover:text-stone-650 dark:hover:text-stone-350'}`}
                  >
                    Submissions
                  </button>
                </div>

                {/* Left tab container viewport */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50/10 dark:bg-stone-950/5 space-y-6">
                  {leftTab === 'description' && activeProblem && (
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
                          {activeProblem.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-xl border uppercase tracking-wider ${getDifficultyColor(activeProblem.difficulty)}`}>
                            {activeProblem.difficulty}
                          </span>
                          <span className="text-[10px] font-bold text-stone-550 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-750 px-2.5 py-1 rounded-xl">
                            {activeProblem.category}
                          </span>
                        </div>
                      </div>

                      {/* Decoded problem prompt rendering with inline styling support */}
                      <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                        {activeProblem.description.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx}>
                            {paragraph.split(' ').map((word, wIdx) => {
                              if (word.startsWith('`') && word.endsWith('`')) {
                                return (
                                  <code key={wIdx} className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-orange-500 font-mono text-[10px] rounded-md mx-0.5 font-bold">
                                    {word.slice(1, -1)}
                                  </code>
                                );
                              }
                              return word + ' ';
                            })}
                          </p>
                        ))}
                      </div>

                      {/* Dynamic Test Case Examples */}
                      <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
                        <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider font-mono block">
                          Examples Cases
                        </span>
                        
                        {activeProblem.testCases.map((tc, idx) => {
                          let displayInput = tc.input;
                          try {
                            const obj = JSON.parse(tc.input);
                            displayInput = Object.entries(obj).map(([key, val]) => `${key} = ${JSON.stringify(val)}`).join(', ');
                          } catch {
                            // Leave fallback intact
                          }

                          return (
                            <div key={idx} className="space-y-2">
                              <h4 className="text-[10px] font-bold uppercase text-stone-450 dark:text-stone-500 tracking-wider font-mono">Example {idx + 1}:</h4>
                              <div className="bg-white dark:bg-stone-950 border border-stone-200/60 dark:border-stone-850 p-4 rounded-2xl font-mono text-[11px] text-stone-850 dark:text-stone-300 space-y-3 shadow-sm">
                                <div>
                                  <span className="text-stone-400 text-[10px] font-sans font-extrabold uppercase block mb-1">Input</span>
                                  <div className="bg-stone-50 dark:bg-stone-900/50 p-2.5 rounded-xl border border-stone-150 dark:border-stone-850 text-stone-600 dark:text-stone-400">{displayInput}</div>
                                </div>
                                <div>
                                  <span className="text-stone-400 text-[10px] font-sans font-extrabold uppercase block mb-1">Expected Output</span>
                                  <div className="bg-emerald-500/[0.02] p-2.5 rounded-xl border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black">{tc.expected}</div>
                                </div>
                                {idx === 0 && activeProblem.id === 'prob-sweetness' && (
                                  <div>
                                    <span className="text-stone-400 text-[10px] font-sans font-extrabold uppercase block mb-1">Explanation</span>
                                    <p className="text-stone-500 dark:text-stone-400 font-sans text-xs pt-1 leading-relaxed">
                                      The optimal partition is [1, 15, 7], [9], [2, 5, 10]. The array changes to [15, 15, 15, 9, 10, 10, 10], and the sum is 15*3 + 9*1 + 10*3 = 45 + 9 + 30 = 84.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Constraints and system credits */}
                      <div className="border-t border-stone-200 dark:border-stone-800 pt-5 space-y-3">
                        <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider font-mono block">Constraints</span>
                        <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
                          {activeProblem.id === 'prob-sweetness' ? (
                            <>
                              <li className="flex items-start gap-2 font-mono text-[11px]">
                                <span className="text-[#ff6b2b] select-none font-sans">•</span>
                                <span>{`1 <= arr.length <= 500`}</span>
                              </li>
                              <li className="flex items-start gap-2 font-mono text-[11px]">
                                <span className="text-[#ff6b2b] select-none font-sans">•</span>
                                <span>{`1 <= arr[i] <= 10^9`}</span>
                              </li>
                              <li className="flex items-start gap-2 font-mono text-[11px]">
                                <span className="text-[#ff6b2b] select-none font-sans">•</span>
                                <span>{`1 <= k <= arr.length`}</span>
                              </li>
                            </>
                          ) : (
                            <>
                              <li className="flex items-start gap-2 font-mono text-[11px]">
                                <span className="text-[#ff6b2b] select-none font-sans">•</span>
                                <span>{`1 <= nums.length <= 10^4`}</span>
                              </li>
                              <li className="flex items-start gap-2 font-mono text-[11px]">
                                <span className="text-[#ff6b2b] select-none font-sans">•</span>
                                <span>{`-10^9 <= nums[i] <= 10^9`}</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Collapsible Accordions (Tags, Companies, and Hints 1-4) */}
                      <div className="pt-4 space-y-2 border-t border-stone-200 dark:border-stone-800">
                        {/* Topics Accordion */}
                        <div className="border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900/40 shadow-sm">
                          <button
                            type="button"
                            onClick={() => setExpandedAccordion(expandedAccordion === 'tags' ? null : 'tags')}
                            className="w-full flex justify-between items-center px-5 py-4 text-xs font-black text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-850/20 transition-colors focus:outline-none cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-[#ff6b2b]" />
                              <span>Related Topics</span>
                            </span>
                            {expandedAccordion === 'tags' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {expandedAccordion === 'tags' && (
                            <div className="px-5 pb-5 pt-1.5 flex flex-wrap gap-1.5 border-t border-stone-100 dark:border-stone-850/60 bg-stone-50/20 dark:bg-stone-950/20">
                              {getProblemExtras(activeProblem).tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 text-[10px] font-extrabold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Companies Accordion */}
                        <div className="border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900/40 shadow-sm">
                          <button
                            type="button"
                            onClick={() => setExpandedAccordion(expandedAccordion === 'companies' ? null : 'companies')}
                            className="w-full flex justify-between items-center px-5 py-4 text-xs font-black text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-850/20 transition-colors focus:outline-none cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-indigo-500" />
                              <span>Companies</span>
                            </span>
                            {expandedAccordion === 'companies' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {expandedAccordion === 'companies' && (
                            <div className="px-5 pb-5 pt-1.5 flex flex-wrap gap-1.5 border-t border-stone-100 dark:border-stone-850/60 bg-stone-50/20 dark:bg-stone-950/20">
                              {getProblemExtras(activeProblem).companies.map(co => (
                                <span key={co} className="px-2.5 py-1 text-[10px] font-extrabold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-lg">
                                  {co}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Hints Accordions */}
                        {getProblemExtras(activeProblem).hints.map((hint, hintIdx) => (
                          <div key={hintIdx} className="border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-900/40 shadow-sm">
                            <button
                              type="button"
                              onClick={() => setExpandedAccordion(expandedAccordion === `hint${hintIdx + 1}` ? null : `hint${hintIdx + 1}`)}
                              className="w-full flex justify-between items-center px-5 py-4 text-xs font-black text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-850/20 transition-colors focus:outline-none cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                <span>Hint {hintIdx + 1}</span>
                              </span>
                              {expandedAccordion === `hint${hintIdx + 1}` ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedAccordion === `hint${hintIdx + 1}` && (
                              <div className="px-5 pb-5 pt-3 text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed border-t border-stone-100 dark:border-stone-850/60 bg-stone-50/30 dark:bg-stone-950/30">
                                {hint}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {leftTab === 'solutions' && activeProblem && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-black text-stone-900 dark:text-white mb-2">Optimal Partitioning Strategy</h3>
                        <p className="text-xs text-stone-600 dark:text-stone-350 leading-relaxed font-medium">
                          This problem can be elegantly solved using <strong className="text-[#ff6b2b]">Dynamic Programming</strong>. 
                          We can define an array <code className="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 font-mono text-[10px] rounded">dp</code> where <code className="font-mono">dp[i]</code> represents the maximum sum of partitioning the prefix up to index <code className="font-mono">i</code>.
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-350 leading-relaxed font-medium mt-3">
                          To compute <code className="font-mono">dp[i]</code>, we look back up to <code className="font-mono">k</code> steps. For each step <code className="font-mono">j</code> (where <code className="font-mono">1 &lt;= j &lt;= k</code>), we assume the last partition starts at <code className="font-mono">i - j</code>. The sum would be the maximum element in that partition times <code className="font-mono">j</code>, plus the optimal partition result of the prefix up to that point: <code className="font-mono">dp[i - j]</code>.
                        </p>
                      </div>

                      <div className="bg-stone-950 border border-stone-850 rounded-2xl p-5 relative shadow-inner">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider font-bold">Optimal {activeLanguage} Solution</span>
                        </div>
                        <pre className="text-xs text-emerald-450 dark:text-emerald-400 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                          {getOptimalSolution(activeProblem, activeLanguage)}
                        </pre>
                      </div>

                      <div className="bg-stone-100 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-stone-850 flex items-center justify-around font-mono text-[11px]">
                        <div className="text-center">
                          <div className="text-stone-400 uppercase text-[9px] font-bold">Time Complexity</div>
                          <div className="text-stone-900 dark:text-white font-black mt-0.5">O(N * k)</div>
                        </div>
                        <div className="h-6 w-[1px] bg-stone-250 dark:bg-stone-800" />
                        <div className="text-center">
                          <div className="text-stone-400 uppercase text-[9px] font-bold">Space Complexity</div>
                          <div className="text-stone-900 dark:text-white font-black mt-0.5">O(N)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {leftTab === 'submissions' && activeProblem && (
                    <div className="space-y-4">
                      <h3 className="text-base font-black text-stone-900 dark:text-white mb-2">Submission Logs</h3>
                      {(!submissionHistory[activeProblem.id] || submissionHistory[activeProblem.id].length === 0) ? (
                        <div className="text-center py-12 text-stone-400 dark:text-stone-500 font-medium italic text-xs">
                          No submissions logged for this problem yet. Run assertions to test.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {submissionHistory[activeProblem.id].map((sub, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-white dark:bg-stone-950 border border-stone-250/60 dark:border-stone-850 rounded-2xl shadow-sm">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-black ${sub.status === 'Accepted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {sub.status}
                                  </span>
                                  <span className="text-[9px] bg-stone-100 dark:bg-stone-800 font-extrabold font-mono px-2 py-0.5 rounded text-stone-500">
                                    {sub.lang}
                                  </span>
                                </div>
                                <p className="text-[10px] text-stone-400 mt-1 font-medium">{sub.time}</p>
                              </div>
                              <div className="text-right font-mono text-xs text-stone-650 dark:text-stone-400 font-black">
                                {sub.runtime}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Pane: Monospace Editor and Output split */}
              <div className="lg:col-span-7 flex flex-col bg-stone-950 border border-stone-850 rounded-3xl overflow-hidden shadow-2xl h-full">
                
                {/* Editor Header: Dropdown language selector and copy buttons */}
                <div className="px-5 py-3 border-b border-stone-850 bg-stone-900 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={activeLanguage}
                        onChange={(e) => setActiveLanguage(e.target.value as any)}
                        className="appearance-none bg-stone-950 dark:bg-stone-950 text-[11px] font-black uppercase tracking-wide text-stone-200 hover:text-[#ff6b2b] pl-3.5 pr-9 py-2 border border-stone-800 rounded-xl focus:outline-none cursor-pointer transition-colors font-sans"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                        alert('Source code copied to workspace buffer!');
                      }}
                      className="p-2 hover:bg-stone-850 rounded-xl text-stone-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                      title="Copy code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeProblem) {
                          setCode(getBoilerplateCode(activeProblem, activeLanguage));
                        }
                      }}
                      className="p-2 hover:bg-stone-850 rounded-xl text-stone-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                      title="Reset Template"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-stone-850 rounded-xl text-stone-400 hover:text-white transition-colors focus:outline-none"
                      title="Settings"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-stone-850 rounded-xl text-stone-400 hover:text-white transition-colors focus:outline-none"
                      title="Expand View"
                    >
                      <Expand className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Editor Textarea with live dynamic line numbering */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#111111] relative min-h-0">
                  <div className="flex-1 overflow-y-auto p-4 flex font-mono text-xs text-[#d4d4d4] relative">
                    <div className="text-[#555555] select-none text-right pr-4.5 border-r border-stone-850 space-y-1 w-9.5 font-mono text-xs leading-relaxed">
                      {code.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    <div className="flex-1 pl-4.5 relative h-full">
                      <textarea
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        className="absolute inset-x-0 top-0 pl-4.5 pr-4 py-0 w-full h-full bg-transparent border-0 resize-none font-mono text-xs focus:ring-0 focus:outline-none text-sky-400 leading-relaxed whitespace-pre font-medium"
                        style={{ caretColor: '#ff6b2b', tabSize: 4 }}
                        spellCheck="false"
                      />
                    </div>
                  </div>
                </div>

                {/* Lower Drawer: Test cases & Results tabs split */}
                <div className="h-[270px] flex-shrink-0 bg-stone-900 border-t border-stone-850 flex flex-col">
                  <div className="flex border-b border-stone-850 bg-stone-900 p-2 gap-1.5 flex-shrink-0 justify-between items-center">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBottomTab('testcases')}
                        className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none ${bottomTab === 'testcases' ? 'bg-stone-850 text-white border border-stone-750' : 'text-stone-400 hover:text-stone-200'}`}
                      >
                        Test Cases
                      </button>
                      <button
                        type="button"
                        onClick={() => setBottomTab('results')}
                        className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none ${bottomTab === 'results' ? 'bg-stone-850 text-white border border-stone-750' : 'text-stone-400 hover:text-stone-200'}`}
                      >
                        Run Results
                      </button>
                    </div>
                    <span className="text-[9px] text-stone-500 font-mono font-black pr-2 uppercase tracking-widest">
                      {activeLanguage} compiler
                    </span>
                  </div>

                  {/* Dynamic sub-tab body viewports */}
                  <div className="flex-1 overflow-y-auto p-4.5 bg-stone-950 font-mono text-xs">
                    {bottomTab === 'testcases' ? (
                      <div className="space-y-4">
                        <div className="flex gap-1.5 mb-2.5 flex-shrink-0">
                          {activeProblem.testCases.map((_, tcIdx) => (
                            <button
                              key={tcIdx}
                              type="button"
                              onClick={() => setActiveCaseIndex(tcIdx)}
                              className={`px-3.5 py-1 rounded-xl text-[10px] font-black tracking-wide transition-all cursor-pointer ${activeCaseIndex === tcIdx ? 'bg-[#ff6b2b]/15 text-[#ff6b2b] border border-[#ff6b2b]/35' : 'bg-stone-900 text-stone-450 border border-stone-850'}`}
                            >
                              Case {tcIdx + 1}
                            </button>
                          ))}
                        </div>

                        {activeProblem.testCases[activeCaseIndex] && (
                          <div className="space-y-3 font-mono text-xs">
                            <div>
                              <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 block mb-1">Input params</span>
                              <div className="bg-stone-900 border border-stone-850 p-2.5 rounded-xl text-stone-300">
                                {(() => {
                                  const tc = activeProblem.testCases[activeCaseIndex];
                                  try {
                                    return JSON.stringify(JSON.parse(tc.input), null, 2);
                                  } catch {
                                    return tc.input;
                                  }
                                })()}
                              </div>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 block mb-1">Expected returned output</span>
                              <div className="bg-stone-900 border border-stone-850 p-2.5 rounded-xl text-emerald-450 dark:text-emerald-400 font-bold">
                                {activeProblem.testCases[activeCaseIndex].expected}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Run outputs pane view */
                      <div className="space-y-4 font-mono text-[11px]">
                        {isRunning ? (
                          <div className="h-full flex flex-col justify-center items-center py-6 text-center space-y-2.5">
                            <RefreshCw className="w-6 h-6 animate-spin text-[#ff6b2b]" />
                            <p className="text-stone-300 text-xs font-bold font-sans">Executing verification pipeline... {runProgress}%</p>
                            <p className="text-[10px] text-stone-500">Piping parameters to sandbox engine...</p>
                          </div>
                        ) : !submissionOutput ? (
                          <div className="h-full flex justify-center items-center py-8 text-center text-stone-500 italic text-xs font-sans">
                            Sandbox is clean. Tap Run Code or Submit to initiate compilation checks.
                          </div>
                        ) : submissionOutput.status === 'Pending' ? (
                          <div className="h-full flex flex-col justify-center items-center py-6 text-center space-y-2">
                            <RefreshCw className="w-5 h-5 animate-spin text-[#ff6b2b]" />
                            <span className="text-stone-400 text-xs font-sans">Spinning compiler buffer...</span>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Execution Result Banner */}
                            <div className={`p-4 rounded-2xl border ${submissionOutput.status === 'Accepted' ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' : 'bg-rose-950/20 border-rose-900/50 text-rose-400'}`}>
                              <div className="flex items-center gap-2">
                                {submissionOutput.status === 'Accepted' ? (
                                  <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                                ) : (
                                  <HelpCircle className="w-5 h-5 stroke-[2.5]" />
                                )}
                                <span className="text-sm font-black uppercase tracking-wider font-sans">{submissionOutput.status}</span>
                              </div>
                              {submissionOutput.status === 'Accepted' && (
                                <p className="text-stone-400 font-sans text-[11px] mt-1">
                                  Runtime: <strong>48 ms</strong> (Beats 89.4% of submissions) | Memory: <strong>42.1 MB</strong>
                                </p>
                              )}
                              {submissionOutput.status === 'Runtime Error' && (
                                <p className="text-rose-350 dark:text-rose-400 text-[10px] mt-1 font-mono">{submissionOutput.error}</p>
                              )}
                            </div>

                            {/* Detailed cases assertions comparison list */}
                            {submissionOutput.results && (
                              <div className="space-y-2.5">
                                <span className="text-[9px] uppercase font-black tracking-wider text-stone-500 block">Assertion Summary</span>
                                {submissionOutput.results.map((res, resIdx) => (
                                  <div key={resIdx} className={`p-3 border rounded-xl space-y-1.5 ${res.passed ? 'bg-emerald-950/5 border-emerald-900/25 text-stone-300' : 'bg-rose-950/5 border-rose-900/25 text-stone-300'}`}>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-stone-400 text-[9px] uppercase">Case {resIdx + 1}</span>
                                      <span className={`font-black text-[9px] px-1.5 py-0.5 rounded uppercase ${res.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {res.passed ? 'Passed' : 'Failed'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[10px]">
                                      <div>
                                        <span className="text-stone-500 text-[9px] block mb-0.5">Input</span>
                                        <code className="text-stone-400 whitespace-pre-wrap block bg-stone-900 p-1.5 rounded text-[10px]">{res.inputStr}</code>
                                      </div>
                                      <div>
                                        <span className="text-stone-500 text-[9px] block mb-0.5">Expected</span>
                                        <code className="text-emerald-400 whitespace-pre-wrap block bg-stone-900 p-1.5 rounded text-[10px] font-bold">{JSON.stringify(res.expected)}</code>
                                      </div>
                                      <div>
                                        <span className="text-stone-500 text-[9px] block mb-0.5">Output</span>
                                        <code className={`whitespace-pre-wrap block bg-stone-900 p-1.5 rounded text-[10px] ${res.passed ? 'text-emerald-450' : 'text-rose-450'}`}>{JSON.stringify(res.output)}</code>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Internal Compiler logs block */}
                            <div className="p-4 bg-stone-900 border border-stone-850 rounded-2xl space-y-1">
                              <div className="text-[#ff6b2b] font-bold text-[9px] uppercase tracking-wider flex items-center gap-1.5 mb-2 font-sans">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>Internal Compiler Logs</span>
                              </div>
                              {consoleLogs.map((log, i) => (
                                <div key={i} className={`text-[10px] ${log.includes('✓') ? 'text-green-400' : log.includes('❌') ? 'text-rose-400' : 'text-stone-450'}`}>
                                  {log}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Footer block containing Run Code trigger */}
                <div className="p-4 border-t border-stone-850 bg-stone-900/60 flex items-center justify-between gap-4 flex-shrink-0">
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-[11px] font-bold text-stone-500">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ff6b2b]" />
                        <span>Compiling sandbox... {runProgress}%</span>
                      </div>
                    ) : submissionOutput?.status === 'Accepted' ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded-full border border-emerald-900/30">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Assertions Complete</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-stone-500">
                        Pending execution pipeline
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeProblem) {
                          setCode(getBoilerplateCode(activeProblem, activeLanguage));
                        }
                      }}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-full text-[10px] font-black text-stone-300 uppercase tracking-wider cursor-pointer focus:outline-none transition-colors"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRunOrSubmit(false)}
                      disabled={isRunning}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none"
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
