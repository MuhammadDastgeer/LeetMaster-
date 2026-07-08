import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, CheckCircle2, ChevronRight, Award, Flame, 
  RefreshCw, Layers, ArrowLeft, Sun, Moon, Sparkles, Code2, 
  CheckCircle, FileCode, Check, Trophy, Github, Twitter,
  Linkedin, Youtube, Globe, Instagram, BookOpen
} from 'lucide-react';
import { DsaSheet, DsaProblem } from '../types';

// Let's build a highly immersive, complete dataset representing the sheets from the screenshot
const INITIAL_SHEETS: DsaSheet[] = [
  {
    id: 'greedy-gameplan',
    name: 'Greedy Gameplan',
    solvedCount: 2,
    totalCount: 13,
    problems: [
      {
        id: 'greedy-p1',
        title: 'Gas Station',
        difficulty: 'Medium',
        solved: true,
        category: 'Greedy',
        description: 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations. Given two integer arrays gas and cost, return the starting gas station index if you can travel around the circuit once in the clockwise direction, otherwise return -1.',
        solutionTemplate: `def canCompleteCircuit(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    total_gas, start_index = 0, 0\n    for i in range(len(gas)):\n        total_gas += gas[i] - cost[i]\n        if total_gas < 0:\n            total_gas = 0\n            start_index = i + 1\n    return start_index`,
        testCases: [
          { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', expected: '3' },
          { input: 'gas = [2,3,4], cost = [3,4,3]', expected: '-1' }
        ]
      },
      {
        id: 'greedy-p2',
        title: 'Jump Game',
        difficulty: 'Medium',
        solved: true,
        category: 'Greedy',
        description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
        solutionTemplate: `def canJump(nums):\n    goal = len(nums) - 1\n    for i in range(len(nums) - 2, -1, -1):\n        if i + nums[i] >= goal:\n            goal = i\n    return goal == 0`,
        testCases: [
          { input: 'nums = [2,3,1,1,4]', expected: 'True' },
          { input: 'nums = [3,2,1,0,4]', expected: 'False' }
        ]
      },
      {
        id: 'greedy-p3',
        title: 'Assign Cookies',
        difficulty: 'Easy',
        solved: false,
        category: 'Greedy',
        description: 'Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie. Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content. Your goal is to maximize the number of your content children and output the maximum number.',
        solutionTemplate: `def findContentChildren(g, s):\n    g.sort()\n    s.sort()\n    child_i, cookie_j = 0, 0\n    while child_i < len(g) and cookie_j < len(s):\n        if s[cookie_j] >= g[child_i]:\n            child_i += 1\n        cookie_j += 1\n    return child_i`,
        testCases: [
          { input: 'g = [1,2,3], s = [1,1]', expected: '1' },
          { input: 'g = [1,2], s = [1,2,3]', expected: '2' }
        ]
      }
    ]
  },
  {
    id: 'interview-patterns',
    name: 'Interview Patterns 101',
    solvedCount: 4,
    totalCount: 25,
    problems: [
      {
        id: 'ip-p1',
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
        id: 'ip-p2',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        solved: true,
        category: 'Two Pointers',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.',
        solutionTemplate: `def isPalindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum():\n            l += 1\n        while l < r and not s[r].isalnum():\n            r -= 1\n        if s[l].lower() != s[r].lower():\n            return False\n        l += 1\n        r -= 1\n    return True`,
        testCases: [
          { input: 's = "A man, a plan, a canal: Panama"', expected: 'True' },
          { input: 's = "race a car"', expected: 'False' }
        ]
      },
      {
        id: 'ip-p3',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        solved: true,
        category: 'Sliding Window',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
        solutionTemplate: `def maxProfit(prices):\n    l, r = 0, 1\n    max_p = 0\n    while r < len(prices):\n        if prices[l] < prices[r]:\n            profit = prices[r] - prices[l]\n            max_p = max(max_p, profit)\n        else:\n            l = r\n        r += 1\n    return max_p`,
        testCases: [
          { input: 'prices = [7,1,5,3,6,4]', expected: '5' },
          { input: 'prices = [7,6,4,3,1]', expected: '0' }
        ]
      },
      {
        id: 'ip-p4',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        solved: true,
        category: 'Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        solutionTemplate: `def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
        testCases: [
          { input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' }
        ]
      },
      {
        id: 'ip-p5',
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        solved: false,
        category: 'Heap',
        description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.',
        solutionTemplate: `import heapq\ndef findKthLargest(nums, k):\n    minHeap = []\n    for num in nums:\n        heapq.heappush(minHeap, num)\n        if len(minHeap) > k:\n            heapq.heappop(minHeap)\n    return minHeap[0]`,
        testCases: [
          { input: 'nums = [3,2,1,5,6,4], k = 2', expected: '5' }
        ]
      }
    ]
  },
  {
    id: 'bitwise-brilliance',
    name: 'Bitwise Brilliance',
    solvedCount: 1,
    totalCount: 12,
    problems: [
      {
        id: 'bit-p1',
        title: 'Single Number',
        difficulty: 'Easy',
        solved: true,
        category: 'Bit Manipulation',
        description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
        solutionTemplate: `def singleNumber(nums):\n    res = 0\n    for n in nums:\n        res ^= n\n    return res`,
        testCases: [
          { input: 'nums = [2,2,1]', expected: '1' },
          { input: 'nums = [4,1,2,1,2]', expected: '4' }
        ]
      },
      {
        id: 'bit-p2',
        title: 'Number of 1 Bits',
        difficulty: 'Easy',
        solved: false,
        category: 'Bit Manipulation',
        description: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).',
        solutionTemplate: `def hammingWeight(n):\n    res = 0\n    while n:\n        res += n % 2\n        n = n >> 1\n    return res`,
        testCases: [
          { input: 'n = 11', expected: '3' },
          { input: 'n = 128', expected: '1' }
        ]
      }
    ]
  },
  {
    id: 'google-style',
    name: 'Google-Style Challenges',
    solvedCount: 2,
    totalCount: 15,
    problems: [
      {
        id: 'gsc-p1',
        title: 'Unique Paths',
        difficulty: 'Medium',
        solved: true,
        category: 'Dynamic Programming',
        description: 'There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.',
        solutionTemplate: `def uniquePaths(m, n):\n    row = [1] * n\n    for i in range(m - 1):\n        newRow = [1] * n\n        for j in range(n - 2, -1, -1):\n            newRow[j] = newRow[j + 1] + row[j]\n        row = newRow\n    return row[0]`,
        testCases: [
          { input: 'm = 3, n = 7', expected: '28' },
          { input: 'm = 3, n = 2', expected: '3' }
        ]
      },
      {
        id: 'gsc-p2',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        solved: true,
        category: 'Dynamic Programming',
        description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        solutionTemplate: `def lengthOfLIS(nums):\n    if not nums: return 0\n    LIS = [1] * len(nums)\n    for i in range(len(nums) - 1, -1, -1):\n        for j in range(i + 1, len(nums)):\n            if nums[i] < nums[j]:\n                LIS[i] = max(LIS[i], 1 + LIS[j])\n    return max(LIS)`,
        testCases: [
          { input: 'nums = [10,9,2,5,3,7,101,18]', expected: '4' }
        ]
      }
    ]
  },
  {
    id: 'leetmaster-aur-dsa',
    name: 'LeetMaster Aur DSA',
    solvedCount: 0,
    totalCount: 46,
    problems: [
      {
        id: 'cad-p1',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        solved: false,
        category: 'Arrays & Hashing',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        solutionTemplate: `def containsDuplicate(nums):\n    hashset = set()\n    for n in nums:\n        if n in hashset:\n            return True\n        hashset.add(n)\n    return False`,
        testCases: [
          { input: 'nums = [1,2,3,1]', expected: 'True' },
          { input: 'nums = [1,2,3,4]', expected: 'False' }
        ]
      },
      {
        id: 'cad-p2',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        solved: false,
        category: 'Arrays & Hashing',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
        solutionTemplate: `def isAnagram(s, t):\n    if len(s) != len(t): return False\n    countS, countT = {}, {}\n    for i in range(len(s)):\n        countS[s[i]] = 1 + countS.get(s[i], 0)\n        countT[t[i]] = 1 + countT.get(t[i], 0)\n    return countS == countT`,
        testCases: [
          { input: 's = "anagram", t = "nagaram"', expected: 'True' },
          { input: 's = "rat", t = "car"', expected: 'False' }
        ]
      }
    ]
  },
  {
    id: 'leetmaster-75',
    name: 'LeetMaster 75',
    solvedCount: 3,
    totalCount: 75,
    problems: [
      {
        id: 'mj-p1',
        title: 'Merge Strings Alternately',
        difficulty: 'Easy',
        solved: true,
        category: 'Two Pointers',
        description: 'You are given two strings word1 and word2. Merge the strings by adding letters in alternating order, starting with word1. If a string is longer than the other, append the additional letters onto the end of the merged string.',
        solutionTemplate: `def mergeAlternately(word1, word2):\n    i, j = 0, 0\n    res = []\n    while i < len(word1) or j < len(word2):\n        if i < len(word1):\n            res.append(word1[i])\n            i += 1\n        if j < len(word2):\n            res.append(word2[j])\n            j += 1\n    return "".join(res)`,
        testCases: [
          { input: 'word1 = "abc", word2 = "pqr"', expected: '"apbqcr"' }
        ]
      },
      {
        id: 'mj-p2',
        title: 'Greatest Common Divisor of Strings',
        difficulty: 'Easy',
        solved: true,
        category: 'Two Pointers',
        description: 'For two strings s and t, we say "t divides s" if and only if s = t + t + t + ... + t (i.e., t is concatenated with itself one or more times). Given two strings str1 and str2, return the largest string x such that x divides both str1 and str2.',
        solutionTemplate: `def gcdOfStrings(str1, str2):\n    if str1 + str2 != str2 + str1: return ""\n    from math import gcd\n    return str1[:gcd(len(str1), len(str2))]`,
        testCases: [
          { input: 'str1 = "ABCABC", str2 = "ABC"', expected: '"ABC"' }
        ]
      },
      {
        id: 'mj-p3',
        title: 'Kids With the Greatest Number of Candies',
        difficulty: 'Easy',
        solved: true,
        category: 'Arrays',
        description: 'There are n kids with candies. You are given an integer array candies, where each candies[i] represents the number of candies the ith kid has, and an integer extraCandies, denoting the number of extra candies that you have.',
        solutionTemplate: `def kidsWithCandies(candies, extraCandies):\n    maxCandies = max(candies)\n    return [candy + extraCandies >= maxCandies for candy in candies]`,
        testCases: [
          { input: 'candies = [2,3,5,1,3], extraCandies = 3', expected: '[True,True,True,False,True]' }
        ]
      },
      {
        id: 'mj-p4',
        title: 'Can Place Flowers',
        difficulty: 'Easy',
        solved: false,
        category: 'Arrays',
        description: 'You have a long flowerbed in which some of the plots are planted, and some are not. However, flowers cannot be planted in adjacent plots. Given an integer array flowerbed containing 0s and 1s, and an integer n, return true if n new flowers can be planted without violating the rule.',
        solutionTemplate: `def canPlaceFlowers(flowerbed, n):\n    f = [0] + flowerbed + [0]\n    for i in range(1, len(f) - 1):\n        if f[i-1] == 0 and f[i] == 0 and f[i+1] == 0:\n            f[i] = 1\n            n -= 1\n    return n <= 0`,
        testCases: [
          { input: 'flowerbed = [1,0,0,0,1], n = 1', expected: 'True' },
          { input: 'flowerbed = [1,0,0,0,1], n = 2', expected: 'False' }
        ]
      }
    ]
  },
  {
    id: 'advanced-dp',
    name: 'Advanced & Hard DP',
    solvedCount: 0,
    totalCount: 11,
    problems: [
      {
        id: 'adp-p1',
        title: 'Maximum Sweetness Partition',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given an array representing sweetness of chocolates, partition them into k continuous groups to maximize the minimum sweetness a person can get.',
        solutionTemplate: `def maxSweetness(sweetness, k):\n    # TODO: Binary Search + DP greedy validation\n    return 0`,
        testCases: [{ input: 'sweetness = [1,2,3,4,5,6,7,8,9], k = 5', expected: '6' }]
      },
      {
        id: 'adp-p2',
        title: 'Equal Candy Divide Problem',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Determine if a collection of candies with different values can be partitioned into two subsets such that the sum of values in both subsets is equal.',
        solutionTemplate: `def canPartition(candies):\n    # TODO: Subset Sum DP\n    return False`,
        testCases: [{ input: 'candies = [1,5,11,5]', expected: 'True' }]
      },
      {
        id: 'adp-p3',
        title: 'Maximize Your Box Collection',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given dimensions of different types of 3D boxes, find the maximum height of a stack of boxes you can build. You can rotate boxes, but a box can only be placed on top of another if its width and depth are strictly smaller.',
        solutionTemplate: `def maxBoxStackHeight(boxes):\n    # TODO: Box stacking DP (longest increasing path)\n    return 0`,
        testCases: [{ input: 'boxes = [[4,5,6], [1,2,3], [4,5,6], [10,12,32]]', expected: '38' }]
      },
      {
        id: 'adp-p4',
        title: 'Create Maximum Number',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given two arrays of digits representing two numbers of lengths m and n, create the maximum number of length k from digits of the two arrays while preserving the relative order of digits from the same array.',
        solutionTemplate: `def maxNumber(nums1, nums2, k):\n    # TODO: Greedy + Merge DP\n    return []`,
        testCases: [{ input: 'nums1 = [3,4,6,5], nums2 = [9,1,2,5,8,3], k = 5', expected: '[9, 8, 6, 5, 3]' }]
      },
      {
        id: 'adp-p5',
        title: 'Stones Strategy Game II',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Alice and Bob play a game with piles of stones. Alice goes first. There are n piles of stones in a row. Alice or Bob can take all the stones from the first X piles. Find the maximum stones the first player can get.',
        solutionTemplate: `def stoneGameII(piles):\n    # TODO: Minimax DP with memoization\n    return 0`,
        testCases: [{ input: 'piles = [2,7,9,4,4]', expected: '10' }]
      },
      {
        id: 'adp-p6',
        title: 'Egg Drop Puzzle',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'You are given k identical eggs and a building with n floors. Find the minimum number of moves that you need to determine with certainty the highest floor from which an egg can be dropped without breaking.',
        solutionTemplate: `def superEggDrop(k, n):\n    # TODO: Egg Dropping DP optimization\n    return 0`,
        testCases: [{ input: 'k = 2, n = 6', expected: '3' }]
      },
      {
        id: 'adp-p7',
        title: 'Find the Longest Matched Parentheses',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given a string containing just the characters \'(\' and \')\', find the length of the longest valid (well-formed) parentheses substring.',
        solutionTemplate: `def longestValidParentheses(s):\n    # TODO: 1D DP for matched brackets\n    return 0`,
        testCases: [{ input: 's = ")(()())"', expected: '6' }]
      },
      {
        id: 'adp-p8',
        title: 'Longest Well-Formed Parentheses Substring',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given a parenthesized string, compute the size of the longest contiguous subsegment which forms a correct algebraic parentheses matching.',
        solutionTemplate: `def longestValidParenthesesSubstring(s):\n    # TODO: Stack-based or DP-based longest valid substring\n    return 0`,
        testCases: [{ input: 's = "()(()"', expected: '2' }]
      },
      {
        id: 'adp-p9',
        title: 'Maximum Balloon Coins',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it. If you burst the ith balloon, you will get coins equal to nums[i - 1] * nums[i] * nums[i + 1]. Find the maximum coins you can collect.',
        solutionTemplate: `def maxCoins(nums):\n    # TODO: Burst Balloons DP matrix multiplication style\n    return 0`,
        testCases: [{ input: 'nums = [3,1,5,8]', expected: '167' }]
      },
      {
        id: 'adp-p10',
        title: 'Maximum Palindrome Pieces',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of s.',
        solutionTemplate: `def minCut(s):\n    # TODO: Palindrome cuts 1D DP\n    return 0`,
        testCases: [{ input: 's = "aab"', expected: '1' }]
      },
      {
        id: 'adp-p11',
        title: 'Maximize Stock Profit with Limited Transactions',
        difficulty: 'Hard',
        solved: false,
        category: 'Dynamic Programming',
        description: 'You are given an integer k and an array prices. Find the maximum profit you can achieve by buying and selling the stock at most k times.',
        solutionTemplate: `def maxProfitWithKTransactions(prices, k):\n    # TODO: k-transactions stock trading DP\n    return 0`,
        testCases: [{ input: 'prices = [3,2,6,5,0,3], k = 2', expected: '7' }]
      }
    ]
  },
  {
    id: 'grid-path-dp',
    name: 'Grid & Path DP',
    solvedCount: 0,
    totalCount: 8,
    problems: [
      {
        id: 'gdp-p1',
        title: 'Minimum Path Sum',
        difficulty: 'Medium',
        solved: false,
        category: 'Grid DP',
        description: 'Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.',
        solutionTemplate: `def minPathSum(grid):\n    # TODO: Dynamic programming on grid`,
        testCases: [
          { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', expected: '7' }
        ]
      }
    ]
  },
  {
    id: 'string-sequence-dp',
    name: 'String & Sequence DP',
    solvedCount: 0,
    totalCount: 13,
    problems: [
      {
        id: 'ssdp-p1',
        title: 'Longest Common Subsequence',
        difficulty: 'Medium',
        solved: false,
        category: 'String DP',
        description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
        solutionTemplate: `def longestCommonSubsequence(text1, text2):\n    # TODO: 2D Sequence DP`,
        testCases: [
          { input: 'text1 = "abcde", text2 = "ace"', expected: '3' }
        ]
      }
    ]
  },
  {
    id: 'dp-essentials',
    name: 'DP Essentials',
    solvedCount: 0,
    totalCount: 13,
    problems: [
      {
        id: 'dpe-p1',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        solved: false,
        category: 'Dynamic Programming',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        solutionTemplate: `def climbStairs(n):\n    one, two = 1, 1\n    for i in range(n - 1):\n        temp = one\n        one = one + two\n        two = temp\n    return one`,
        testCases: [
          { input: 'n = 2', expected: '2' },
          { input: 'n = 3', expected: '3' }
        ]
      }
    ]
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window Pack',
    solvedCount: 0,
    totalCount: 18,
    problems: [
      {
        id: 'sw-p1',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        solved: false,
        category: 'Sliding Window',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        solutionTemplate: `def lengthOfLongestSubstring(s):\n    charSet = set()\n    l = 0\n    res = 0\n    for r in range(len(s)):\n        while s[r] in charSet:\n            charSet.remove(s[l])\n            l += 1\n        charSet.add(s[r])\n        res = max(res, r - l + 1)\n    return res`,
        testCases: [
          { input: 's = "abcabcbb"', expected: '3' }
        ]
      }
    ]
  },
  {
    id: 'hash-map',
    name: 'Hash Map Playbook',
    solvedCount: 0,
    totalCount: 15,
    problems: [
      {
        id: 'hm-p1',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        solved: false,
        category: 'Hashing',
        description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        solutionTemplate: `from collections import defaultdict\ndef groupAnagrams(strs):\n    ans = defaultdict(list)\n    for s in strs:\n        count = [0] * 26\n        for c in s:\n            count[ord(c) - ord('a')] += 1\n        ans[tuple(count)].append(s)\n    return list(ans.values())`,
        testCases: [
          { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expected: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }
        ]
      }
    ]
  },
  {
    id: 'prefix-sum',
    name: 'Prefix Sum Mastery',
    solvedCount: 0,
    totalCount: 9,
    problems: [
      {
        id: 'ps-p1',
        title: 'Subarray Sum Equals K',
        difficulty: 'Medium',
        solved: false,
        category: 'Prefix Sum',
        description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
        solutionTemplate: `def subarraySum(nums, k):\n    res = 0\n    curSum = 0\n    prefixSums = { 0: 1 }\n    for n in nums:\n        curSum += n\n        diff = curSum - k\n        res += prefixSums.get(diff, 0)\n        prefixSums[curSum] = 1 + prefixSums.get(curSum, 0)\n    return res`,
        testCases: [
          { input: 'nums = [1,1,1], k = 2', expected: '2' }
        ]
      }
    ]
  },
  {
    id: 'stack-engineering',
    name: 'Stack Engineering',
    solvedCount: 0,
    totalCount: 20,
    problems: [
      {
        id: 'se-p1',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        solved: false,
        category: 'Stack',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        solutionTemplate: `def isValid(s):\n    Map = {")": "(", "}": "{", "]": "["}\n    stack = []\n    for c in s:\n        if c in Map:\n            if stack and stack[-1] == Map[c]:\n                stack.pop()\n            else:\n                return False\n        else:\n            stack.append(c)\n    return True if not stack else False`,
        testCases: [
          { input: 's = "()[]{}"', expected: 'True' },
          { input: 's = "(]"', expected: 'False' }
        ]
      }
    ]
  },
  {
    id: 'two-pointer-tactics',
    name: 'Two-Pointer Tactics',
    solvedCount: 0,
    totalCount: 14,
    problems: [
      {
        id: 'tpt-p1',
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'Medium',
        solved: false,
        category: 'Two Pointers',
        description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.',
        solutionTemplate: `def twoSum(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        curSum = numbers[l] + numbers[r]\n        if curSum > target:\n            r -= 1\n        elif curSum < target:\n            l += 1\n        else:\n            return [l + 1, r + 1]\n    return []`,
        testCases: [
          { input: 'numbers = [2,7,11,15], target = 9', expected: '[1,2]' }
        ]
      }
    ]
  },
  {
    id: 'matrix-moves',
    name: 'Matrix Moves',
    solvedCount: 0,
    totalCount: 8,
    problems: [
      {
        id: 'mm-p1',
        title: 'Rotate Image',
        difficulty: 'Medium',
        solved: false,
        category: 'Matrix',
        description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.',
        solutionTemplate: `def rotate(matrix):\n    l, r = 0, len(matrix) - 1\n    while l < r:\n        for i in range(r - l):\n            top, bottom = l, r\n            # save top-left\n            topLeft = matrix[top][l + i]\n            # move bottom-left to top-left\n            matrix[top][l + i] = matrix[bottom - i][l]\n            # move bottom-right to bottom-left\n            matrix[bottom - i][l] = matrix[bottom][r - i]\n            # move top-right to bottom-right\n            matrix[bottom][r - i] = matrix[top + i][r]\n            # move top-left to top-right\n            matrix[top + i][r] = topLeft\n        r -= 1\n        l += 1`,
        testCases: [
          { input: 'matrix = [[1,2],[3,4]]', expected: '[[3,1],[4,2]]' }
        ]
      }
    ]
  },
  {
    id: 'graph-adventures',
    name: 'Graph Adventures',
    solvedCount: 0,
    totalCount: 18,
    problems: [
      {
        id: 'ga-p1',
        title: 'Number of Islands',
        difficulty: 'Medium',
        solved: false,
        category: 'Graphs',
        description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.',
        solutionTemplate: `def numIslands(grid):\n    # TODO: Implement BFS/DFS island traversal`,
        testCases: [
          { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', expected: '2' }
        ]
      }
    ]
  },
  {
    id: 'array-patterns',
    name: 'Array Patterns Unlocked',
    solvedCount: 0,
    totalCount: 14,
    problems: [
      {
        id: 'apu-p1',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        solved: false,
        category: 'Arrays',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
        solutionTemplate: `def productExceptSelf(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res`,
        testCases: [
          { input: 'nums = [1,2,3,4]', expected: '[24,12,8,6]' }
        ]
      }
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search Bootcamp',
    solvedCount: 1,
    totalCount: 12,
    problems: [
      {
        id: 'bsb-p1',
        title: 'Binary Search',
        difficulty: 'Easy',
        solved: true,
        category: 'Binary Search',
        description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
        solutionTemplate: `def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = l + ((r - l) // 2)\n        if nums[m] > target:\n            r = m - 1\n        elif nums[m] < target:\n            l = m + 1\n        else:\n            return m\n    return -1`,
        testCases: [
          { input: 'nums = [-1,0,3,5,9,12], target = 9', expected: '4' }
        ]
      }
    ]
  },
  {
    id: 'string-pattern',
    name: 'String Pattern Lab',
    solvedCount: 1,
    totalCount: 15,
    problems: [
      {
        id: 'spl-p1',
        title: 'Find the Index of the First Occurrence in a String',
        difficulty: 'Easy',
        solved: true,
        category: 'Strings',
        description: 'Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.',
        solutionTemplate: `def strStr(haystack, needle):\n    if needle == "": return 0\n    for i in range(len(haystack) - len(needle) + 1):\n        if haystack[i : i + len(needle)] == needle:\n            return i\n    return -1`,
        testCases: [
          { input: 'haystack = "sadbutsad", needle = "sad"', expected: '0' },
          { input: 'haystack = "leetcode", needle = "leeto"', expected: '-1' }
        ]
      }
    ]
  }
];

// Grouping structure as seen in the uploaded screenshot
const CATEGORIES = [
  {
    title: "Continue Learning",
    sheetIds: ["greedy-gameplan", "interview-patterns", "bitwise-brilliance", "google-style"]
  },
  {
    title: "Featured",
    sheetIds: ["leetmaster-aur-dsa", "leetmaster-75"]
  },
  {
    title: "Dynamic Programming",
    sheetIds: ["advanced-dp", "grid-path-dp", "string-sequence-dp", "dp-essentials"]
  },
  {
    title: "Data Structures",
    sheetIds: ["sliding-window", "hash-map", "bitwise-brilliance", "prefix-sum", "stack-engineering", "two-pointer-tactics"]
  },
  {
    title: "Advanced Patterns",
    sheetIds: ["matrix-moves", "greedy-gameplan", "graph-adventures", "array-patterns", "binary-search", "string-pattern"]
  },
  {
    title: "Cracking Coding Interview",
    sheetIds: ["leetmaster-aur-dsa", "interview-patterns", "google-style", "leetmaster-75"]
  }
];

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
    case 'advanced-dp':
      return "Hard DP problems: partitions, knapsack, egg drop, stock trading, parentheses, and game strategies.";
    case 'greedy-gameplan':
      return "Optimal decision-making at each step. Master interval scheduling, resource allocation, and profit maximization.";
    case 'interview-patterns':
      return "Essential structural pattern mastery for MAANG interviews. Cover arrays, sliding windows, and linked lists.";
    case 'bitwise-brilliance':
      return "Master direct bitwise manipulations, bit masks, XOR properties, and high-performance arithmetic operations.";
    case 'google-style':
      return "Immersive, Google-calibration algorithm puzzles featuring complex graphs, trees, and backtracking.";
    case 'leetmaster-aur-dsa':
      return "Complete beginner-to-expert structured road map covering core computer science arrays, hashing, and trees.";
    case 'leetmaster-75':
      return "The essential 75 coding questions you need to ace your next software engineering technical screening.";
    case 'grid-path-dp':
      return "Master grid path problems, dynamic programming optimizations, and triangular cost matrices.";
    case 'string-sequence-dp':
      return "Master sequence alignment, edit distance, common subsequences, and pattern matchings using DP.";
    case 'dp-essentials':
      return "Master foundational 1D and 2D dynamic programming, knapsack, coin change, and basic memoization.";
    case 'sliding-window':
      return "Master contiguous array problems, sliding window maximums, and dynamic sliding windows.";
    case 'hash-map':
      return "Master index mapping, fast hashing lookups, anagram grouping, and collision-free algorithms.";
    case 'prefix-sum':
      return "Master range sum query ranges, pivot index finders, and prefix summation mathematical techniques.";
    case 'stack-engineering':
      return "Master linear LIFO stacks, valid bracket sequences, daily temperature calculations, and monotonic stacks.";
    default:
      return "Curated collection of industry-standard coding interview problems with optimized algorithmic guidelines.";
  }
}

function getDynamicProblemForSheet(sheetId: string, index: number): {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  solutionTemplate: string;
  testCases: { input: string; expected: string; }[];
} {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Medium', 'Easy', 'Hard', 'Medium'];
  const diff = difficulties[index % difficulties.length];
  
  let title = `Algorithmic Problem ${index}`;
  let category = 'Algorithms';
  let description = `This is a curated algorithm question ${index} to master key programming interview patterns. Solve it with optimal time and space complexity.`;
  let solutionTemplate = `def solveProblem_${index}(n):\n    # TODO: Implement optimal algorithm\n    return n`;
  let testCases = [{ input: 'n = 5', expected: '5' }];

  if (sheetId === 'greedy-gameplan') {
    category = 'Greedy';
    const titles = [
      'Gas Station', 'Jump Game', 'Assign Cookies', 'Fractional Knapsack', 'Huffman Coding', 
      'Task Scheduler', 'Activity Selection', 'Minimum Spanning Tree', 'Kruskal Algorithm', 
      'Prim Algorithm', 'Dijkstra Shortest Path', 'Queue Reconstruction', 'Non-overlapping Intervals'
    ];
    title = titles[(index - 1) % titles.length] || `Greedy Strategy ${index}`;
    description = `Given a set of items or constraints, make the locally optimal choice at each stage to find the global optimum.`;
  } else if (sheetId === 'interview-patterns') {
    category = 'Patterns';
    const titles = [
      'Sliding Window Maximum', 'Subarray Product Less Than K', 'Two Sum II', '3Sum', 'Container With Most Water',
      'Longest Repeating Character Replacement', 'Minimum Window Substring', 'Search in Rotated Sorted Array',
      'Koko Eating Bananas', 'Merge k Sorted Lists', 'Copy List with Random Pointer', 'Add Two Numbers',
      'Linked List Cycle II', 'Lowest Common Ancestor of a BST', 'Binary Tree Right Side View',
      'Binary Tree Level Order Traversal', 'Serialize and Deserialize Binary Tree', 'Course Schedule',
      'Number of Islands', 'Clone Graph', 'Word Ladder', 'Pacific Atlantic Water Flow', 'Graph Valid Tree'
    ];
    title = titles[(index - 1) % titles.length] || `Interview Pattern ${index}`;
  } else if (sheetId === 'bitwise-brilliance') {
    category = 'Bit Manipulation';
    const titles = [
      'Reverse Bits', 'Missing Number', 'Sum of Two Integers', 'Counting Bits', 'XOR Queries',
      'Single Number II', 'Bitwise AND of Numbers Range', 'Power of Two', 'Subsets with Bitwise Mask'
    ];
    title = titles[(index - 1) % titles.length] || `Bit Manipulation ${index}`;
  } else if (sheetId === 'google-style') {
    category = 'Google Challenges';
    const titles = [
      'Median of Two Sorted Arrays', 'Regular Expression Matching', 'Merge Intervals', 'Insert Interval',
      'Word Search II', 'N-Queens', 'Sudoku Solver', 'Next Permutation', 'First Missing Positive',
      'Trapping Rain Water', 'Decode String', 'Evaluate Division', 'Longest Path in Directed Graph'
    ];
    title = titles[(index - 1) % titles.length] || `Google Challenge ${index}`;
  } else if (sheetId === 'leetmaster-aur-dsa') {
    category = 'DSA Foundations';
    const titles = [
      'FizzBuzz', 'Reverse String', 'Fibonacci Number', 'Valid Parentheses', 'Merge Sorted Array',
      'Binary Search', 'Invert Binary Tree', 'Diameter of Binary Tree', 'Maximum Depth of Binary Tree',
      'Same Tree', 'Subtree of Another Tree', 'Linked List Cycle', 'Merge Two Sorted Lists',
      'Remove Nth Node From End of List', 'Reorder List', 'Word Search', 'Subsets', 'Permutations',
      'Combination Sum', 'Palindrome Partitioning', 'Letter Combinations of a Phone Number'
    ];
    title = titles[(index - 1) % titles.length] || `Foundational Question ${index}`;
  } else if (sheetId === 'leetmaster-75') {
    category = 'LeetCode 75';
    title = `LeetMaster 75 - Problem ${index}`;
  } else if (sheetId === 'grid-path-dp') {
    category = 'Grid DP';
    const titles = ['Unique Paths II', 'Triangle', 'Minimum Path Sum', 'Max Path Sum in Matrix', 'Cherry Pickup', 'Dungeon Game', 'Out of Boundary Paths'];
    title = titles[(index - 1) % titles.length] || `Grid Path DP ${index}`;
  } else if (sheetId === 'string-sequence-dp') {
    category = 'Sequence DP';
    const titles = ['Longest Common Subsequence', 'Shortest Common Supersequence', 'Longest Palindromic Subsequence', 'Distinct Subsequences', 'Edit Distance', 'Wildcard Matching', 'Interleaving String'];
    title = titles[(index - 1) % titles.length] || `String Sequence DP ${index}`;
  } else if (sheetId === 'dp-essentials') {
    category = 'DP Essentials';
    const titles = ['House Robber', 'House Robber II', 'Min Cost Climbing Stairs', 'Decode Ways', 'Coin Change', 'Partition Equal Subset Sum', 'Word Break'];
    title = titles[(index - 1) % titles.length] || `DP Essential ${index}`;
  } else if (sheetId === 'sliding-window') {
    category = 'Sliding Window';
    const titles = ['Longest Substring with At Most K Distinct Characters', 'Permutation in String', 'Find All Anagrams in a String', 'Sliding Window Median', 'Minimum Operations to Reduce X to Zero'];
    title = titles[(index - 1) % titles.length] || `Sliding Window ${index}`;
  } else if (sheetId === 'hash-map') {
    category = 'Hashing';
    const titles = ['Two Sum', 'Isomorphic Strings', 'Word Pattern', 'Valid Anagram', 'Group Anagrams', 'Happy Number', 'Contains Duplicate II', 'Longest Consecutive Sequence'];
    title = titles[(index - 1) % titles.length] || `Hash Map ${index}`;
  } else if (sheetId === 'prefix-sum') {
    category = 'Prefix Sum';
    const titles = ['Range Sum Query - Immutable', 'Range Sum Query 2D - Immutable', 'Contiguous Array', 'Product of Array Except Self', 'Subarray Sums Divisible by K', 'Find Pivot Index'];
    title = titles[(index - 1) % titles.length] || `Prefix Sum ${index}`;
  } else if (sheetId === 'stack-engineering') {
    category = 'Stack';
    const titles = ['Min Stack', 'Evaluate Reverse Polish Notation', 'Generate Parentheses', 'Daily Temperatures', 'Car Fleet', 'Largest Rectangle in Histogram', 'Asteroid Collision'];
    title = titles[(index - 1) % titles.length] || `Stack Engineering ${index}`;
  }

  return {
    title,
    difficulty: diff,
    category,
    description,
    solutionTemplate,
    testCases
  };
}

export default function DsaSheets() {
  const [sheets, setSheets] = useState<DsaSheet[]>(INITIAL_SHEETS);
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  
  // Dynamically load more problems inside active sheet
  const handleLoadMoreProblems = () => {
    if (!selectedSheetId) return;
    
    const extraProblemsForSheet: DsaProblem[] = [
      {
        id: `dyn-p-${selectedSheetId}-${Date.now()}-1`,
        title: 'Reverse Words in a String',
        difficulty: 'Medium',
        solved: false,
        category: 'Strings',
        description: 'Given an input string s, reverse the order of the words.',
        solutionTemplate: `def reverseWords(s):\n    return " ".join(s.split()[::-1])`,
        testCases: [{ input: 's = "the sky is blue"', expected: '"blue is sky the"' }]
      },
      {
        id: `dyn-p-${selectedSheetId}-${Date.now()}-2`,
        title: 'Maximum Subarray (Kadane\'s)',
        difficulty: 'Medium',
        solved: false,
        category: 'Arrays',
        description: 'Given an integer array nums, find the subarray with the largest sum and return its sum.',
        solutionTemplate: `def maxSubArray(nums):\n    max_sum = nums[0]\n    cur_sum = 0\n    for n in nums:\n        cur_sum = max(n, cur_sum + n)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum`,
        testCases: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expected: '6' }]
      },
      {
        id: `dyn-p-${selectedSheetId}-${Date.now()}-3`,
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        solved: false,
        category: 'Trees',
        description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
        solutionTemplate: `def isValidBST(root):\n    # BST Validator logic\n    return True`,
        testCases: [{ input: 'root = [2,1,3]', expected: 'True' }]
      }
    ];

    setSheets(prev => prev.map(s => {
      if (s.id === selectedSheetId) {
        // Prevent duplicate loads
        const hasAlreadyLoaded = s.problems.some(p => p.id.includes('dyn-p'));
        if (hasAlreadyLoaded) return s;
        return {
          ...s,
          problems: [...s.problems, ...extraProblemsForSheet]
        };
      }
      return s;
    }));
  };

  // Complete active sheet completely
  const handleCompleteActiveSheet = () => {
    if (!selectedSheetId) return;
    setSheets(prev => prev.map(s => {
      if (s.id === selectedSheetId) {
        const solvedProblems = s.problems.map(p => ({ ...p, solved: true }));
        return {
          ...s,
          problems: solvedProblems,
          solvedCount: s.totalCount
        };
      }
      return s;
    }));
  };

  // Complete all sheets in the cards
  const handleCompleteAllSheets = () => {
    setSheets(prev => prev.map(s => {
      const solvedProblems = s.problems.map(p => ({ ...p, solved: true }));
      return {
        ...s,
        problems: solvedProblems,
        solvedCount: s.totalCount
      };
    }));
  };
  
  // Code solving state
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [testCasesPassed, setTestCasesPassed] = useState<boolean[]>([]);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Find currently active sheet and problem
  const activeSheet = sheets.find(s => s.id === selectedSheetId) || null;
  const activeProblem = activeSheet ? (activeSheet.problems.find(p => p.id === selectedProblemId) || activeSheet.problems[0]) : null;

  // Sync code whenever selected problem changes
  useEffect(() => {
    if (activeProblem) {
      setCode(activeProblem.solutionTemplate);
      setTestCasesPassed([]);
      setConsoleLogs([]);
    }
  }, [selectedProblemId, selectedSheetId]);

  const handleRunCode = () => {
    if (!activeProblem) return;
    setIsRunning(true);
    setRunProgress(0);
    setTestCasesPassed([]);
    setConsoleLogs(["Initializing Sandbox Environments...", "Loading Python 3.10 modules..."]);

    // Simulated step-by-step test runner logs
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
          const updatedSheets = sheets.map(s => {
            if (s.id === selectedSheetId) {
              const updatedProblems = s.problems.map(p => {
                if (p.id === activeProblem.id) {
                  return { ...p, solved: true };
                }
                return p;
              });
              const solvedCount = updatedProblems.filter(p => p.solved).length;
              return { ...s, problems: updatedProblems, solvedCount };
            }
            return s;
          });
          setSheets(updatedSheets);
          setShowSuccessOverlay(true);
          return 100;
        }

        // Increment intermediate progress messages
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

  const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
      case 'Medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      case 'Hard': return 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/50';
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: BEAUTIFUL SHEETS CATEGORIZED DASHBOARD (MATCHES THE SCREENSHOT) */}
        {!selectedSheetId ? (
          <motion.div
            key="sheets-dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            {/* Top Header section mirroring the exact layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-200 dark:border-stone-800 pb-6 gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-black font-sans text-stone-900 dark:text-white tracking-tight">
                  Sheets
                </h1>
                <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                  A curated collection of coding problems for structured practice
                </p>
              </div>

              {/* Decorative top-right indicators / aesthetic checkmark */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCompleteAllSheets}
                  className="px-4 py-2 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Complete All Sheets
                </button>
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 px-3.5 py-1.5 rounded-full">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400/20 animate-pulse" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Interactive Compiler Built-In</span>
                </div>
              </div>
            </div>

            {/* STACKED CATEGORIES SECTIONS */}
            <div className="space-y-12">
              {CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-5">
                  {/* Category Title Header */}
                  <h2 className="text-lg font-black text-stone-850 dark:text-stone-100 tracking-tight font-sans">
                    {cat.title}
                  </h2>

                  {/* Grid layout of custom cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {cat.sheetIds.map((id) => {
                      const sheet = sheets.find(s => s.id === id);
                      if (!sheet) return null;

                      // Check fraction solved percentage
                      const percentage = Math.round((sheet.solvedCount / sheet.totalCount) * 100);

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setSelectedSheetId(id);
                            setIsSolving(false);
                            if (sheet.problems.length > 0) {
                              setSelectedProblemId(sheet.problems[0].id);
                            }
                          }}
                          className="group relative text-left p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#ff6b2b] hover:shadow-xl cursor-pointer block focus:outline-none"
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
                                <p className="text-[11px] font-bold text-stone-450 dark:text-stone-500 font-mono tracking-wider">
                                  By LeetMaster
                                </p>
                              </div>

                              {/* Stylized LeetMaster Icon */}
                              <div className="w-8 h-8 rounded-full bg-orange-100/80 dark:bg-orange-950/50 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-all duration-300">
                                <Trophy className="w-4 h-4 fill-current" />
                              </div>
                            </div>

                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : !isSolving ? (
          /* VIEW 2: BEAUTIFUL SHEET DETAIL VIEW (MATCHES SCREENSHOT) */
          <motion.div
            key="sheet-detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 max-w-7xl mx-auto"
          >
            {activeSheet && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: Main Sheet Information & Problems Table */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Header Card */}
                  <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div className="flex items-center gap-4">
                        {/* Back Arrow Button */}
                        <button
                          onClick={() => setSelectedSheetId(null)}
                          className="p-3 bg-[#faf9f6] dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800/60 rounded-2xl text-stone-600 dark:text-stone-350 transition-all flex items-center justify-center cursor-pointer active:scale-95 focus:outline-none"
                        >
                          <ArrowLeft className="w-4.5 h-4.5" />
                        </button>
                        
                        {/* Custom LeetMaster Mascot Logo */}
                        <div className="w-12 h-12 bg-orange-100/60 dark:bg-orange-950/30 flex items-center justify-center text-[#ff6b2b] border border-orange-100 dark:border-orange-900/40 rounded-2xl shadow-inner">
                          <OwlLogo />
                        </div>
                        
                        {/* Title & Subtitle */}
                        <div>
                          <h1 className="text-2xl font-black text-stone-900 dark:text-white leading-tight font-sans tracking-tight">
                            {activeSheet.name}
                          </h1>
                          <p className="text-xs text-[#ff6b2b] font-extrabold flex items-center gap-1 mt-1 font-mono tracking-wide">
                            <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#ff6b2b]/10 text-[#ff6b2b]">✓</span>
                            Ace Coding Interview with Curated Qs
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions: Start & Share */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setIsSolving(true);
                            if (activeSheet.problems.length > 0) {
                              setSelectedProblemId(activeSheet.problems[0].id);
                            }
                          }}
                          className="px-6 py-2.5 bg-[#ff6b2b] hover:bg-[#e0561a] text-white text-xs font-black rounded-full shadow-lg hover:shadow-[#ff6b2b]/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus:outline-none"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>START</span>
                        </button>
                        
                        <button className="p-2.5 bg-[#faf9f6] hover:bg-stone-100 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-350 border border-stone-200 dark:border-stone-800/60 rounded-full transition-all flex items-center justify-center cursor-pointer focus:outline-none active:scale-95">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress Section */}
                  <div className="bg-[#fcfbf9] dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/40 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-2.5">
                      <div>
                        <p className="text-xs font-black text-stone-450 dark:text-stone-500 uppercase tracking-wider font-mono">Overall Progress</p>
                        <h4 className="text-[15px] font-black text-stone-800 dark:text-stone-200 mt-0.5">
                          Solved {activeSheet.solvedCount} of {activeSheet.totalCount} Questions
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-[#ff6b2b] font-mono">
                          {Math.round((activeSheet.solvedCount / activeSheet.totalCount) * 100)}%
                        </span>
                      </div>
                    </div>
                    {/* Beautiful Progress Bar */}
                    <div className="w-full bg-stone-200 dark:bg-stone-800/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-stone-300/40 dark:border-stone-800/40">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-[#ff6b2b] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,107,43,0.3)]" 
                        style={{ width: `${(activeSheet.solvedCount / activeSheet.totalCount) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Problems List Card */}
                  <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/80 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-850 flex justify-between items-center">
                      <h3 className="text-[15px] font-black text-stone-900 dark:text-white tracking-tight">
                        Problem Checklist
                      </h3>
                      <button
                        onClick={() => {
                          const updated = sheets.map(s => {
                            if (s.id === activeSheet.id) {
                              const problems = s.problems.map(p => ({ ...p, solved: true }));
                              return { ...s, problems, solvedCount: s.totalCount };
                            }
                            return s;
                          });
                          setSheets(updated);
                        }}
                        className="text-[10px] font-black uppercase text-[#ff6b2b] hover:text-[#e0561a] transition-colors tracking-widest font-mono"
                      >
                        Mark All Completed
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#faf9f6] dark:bg-stone-900 border-b border-stone-200 dark:border-stone-850 text-[10px] font-black uppercase text-stone-450 dark:text-stone-550 font-mono tracking-wider">
                            <th className="px-6 py-3.5 text-center w-12">#</th>
                            <th className="px-6 py-3.5 text-center w-20">Status</th>
                            <th className="px-6 py-3.5">Problem Name</th>
                            <th className="px-6 py-3.5 w-32">Difficulty</th>
                            <th className="px-6 py-3.5 text-center w-28">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-850">
                          {activeSheet.problems.map((p, idx) => {
                            const isSolved = p.solved;
                            return (
                              <tr 
                                key={p.id} 
                                className="group hover:bg-stone-50/50 dark:hover:bg-stone-850/20 transition-colors"
                              >
                                {/* Index */}
                                <td className="px-6 py-4 text-center text-xs font-black text-stone-400 dark:text-stone-550 font-mono">
                                  {idx + 1}
                                </td>
                                
                                {/* Status Icon */}
                                <td className="px-6 py-4 text-center">
                                  <button
                                    onClick={() => {
                                      const updated = sheets.map(s => {
                                        if (s.id === activeSheet.id) {
                                          const problems = s.problems.map(prob => {
                                            if (prob.id === p.id) {
                                              return { ...prob, solved: !prob.solved };
                                            }
                                            return prob;
                                          });
                                          const solvedCount = problems.filter(prob => prob.solved).length;
                                          return { ...s, problems, solvedCount };
                                        }
                                        return s;
                                      });
                                      setSheets(updated);
                                    }}
                                    className="focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full cursor-pointer inline-flex items-center justify-center"
                                  >
                                    {isSolved ? (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/20" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-700 hover:border-[#ff6b2b] transition-colors" />
                                    )}
                                  </button>
                                </td>

                                {/* Name */}
                                <td className="px-6 py-4">
                                  <div>
                                    <button
                                      onClick={() => {
                                        setSelectedProblemId(p.id);
                                        setIsSolving(true);
                                      }}
                                      className="text-sm font-black text-stone-800 hover:text-[#ff6b2b] dark:text-stone-200 dark:hover:text-[#ff6b2b] transition-colors text-left font-sans cursor-pointer focus:outline-none"
                                    >
                                      {p.title}
                                    </button>
                                    <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5 font-mono">
                                      {p.category}
                                    </p>
                                  </div>
                                </td>

                                {/* Difficulty Badge */}
                                <td className="px-6 py-4">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getDifficultyColor(p.difficulty)}`}>
                                    {p.difficulty}
                                  </span>
                                </td>

                                {/* Action button */}
                                <td className="px-6 py-4 text-center">
                                  <button
                                    onClick={() => {
                                      setSelectedProblemId(p.id);
                                      setIsSolving(true);
                                    }}
                                    className="px-3.5 py-1.5 bg-stone-100 hover:bg-[#ff6b2b] hover:text-white text-stone-700 dark:bg-stone-800 dark:hover:bg-[#ff6b2b] dark:text-stone-300 text-[10px] font-black uppercase rounded-full tracking-wider transition-all cursor-pointer active:scale-95 focus:outline-none inline-flex items-center gap-1"
                                  >
                                    <Play className="w-2.5 h-2.5 fill-current" />
                                    <span>Code</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Load More Button inside Sheet Detail */}
                    {activeSheet.problems.length < activeSheet.totalCount && (
                      <div className="p-6 border-t border-stone-100 dark:border-stone-850">
                        <button
                          onClick={handleLoadMoreProblems}
                          className="w-full py-3 border-2 border-dashed border-stone-200 dark:border-stone-800/80 hover:border-[#ff6b2b] text-stone-500 hover:text-[#ff6b2b] dark:text-stone-400 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none bg-[#faf9f6]/30 hover:bg-orange-50/10"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Load More Questions</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Summary, Author & Links */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Summary Card */}
                  <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b2b]/5 rounded-bl-full pointer-events-none" />
                    <h3 className="text-[10px] font-black uppercase text-[#ff6b2b] tracking-widest font-mono mb-2.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#ff6b2b]" />
                      <span>Summary</span>
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-350 font-medium leading-relaxed">
                      {getSheetSummary(activeSheet.id)}
                    </p>
                  </div>

                  {/* Author Card (Consistently branded LeetMaster) */}
                  <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/80 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase text-[#ff6b2b] tracking-widest font-mono mb-4">
                      Author
                    </h3>
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img 
                          src="/src/assets/images/leetmaster_mascot_1783434307641.jpg" 
                          alt="LeetMaster mascot"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          className="w-12 h-12 rounded-full border-2 border-orange-500/20 object-cover"
                        />
                        <div className="hidden w-12 h-12 bg-[#ff6b2b]/10 border-2 border-orange-500/20 rounded-full items-center justify-center text-[#ff6b2b]">
                          <Trophy className="w-5 h-5 fill-current" />
                        </div>
                        {/* Little active dot */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-stone-900 dark:text-white">
                          Team LeetMaster
                        </h4>
                        <p className="text-xs text-stone-400 dark:text-stone-500 font-semibold font-mono mt-0.5">
                          Curators of Elite Prep
                        </p>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="grid grid-cols-6 gap-2 mt-6">
                      <a href="#github" className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-850 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] text-stone-500 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800/60 transition-all flex items-center justify-center">
                        <Github className="w-4 h-4" />
                      </a>
                      <a href="#twitter" className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-850 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] text-stone-500 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800/60 transition-all flex items-center justify-center">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href="#linkedin" className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-850 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] text-stone-500 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800/60 transition-all flex items-center justify-center">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href="#youtube" className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-850 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] text-stone-500 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800/60 transition-all flex items-center justify-center">
                        <Youtube className="w-4 h-4" />
                      </a>
                      <a href="#instagram" className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-850 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] text-stone-500 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800/60 transition-all flex items-center justify-center">
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a href="#website" className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-850 hover:bg-[#ff6b2b]/10 hover:text-[#ff6b2b] text-stone-500 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800/60 transition-all flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Links Card */}
                  <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/80 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase text-[#ff6b2b] tracking-widest font-mono mb-4">
                      Links
                    </h3>
                    <a 
                      href="#course"
                      className="w-full py-3.5 bg-[#faf9f6] dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-250 hover:text-[#ff6b2b] dark:hover:text-[#ff6b2b] text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#ff6b2b] animate-bounce" />
                      <span>View Course</span>
                    </a>
                  </div>

                </div>

              </div>
            )}
          </motion.div>
        ) : (
          
          /* VIEW 3: INTERACTIVE SOLVER WORKSPACE */
          <motion.div
            key="sheets-workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Top Workspace Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50 dark:bg-stone-900/30 p-5 rounded-3xl border border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSolving(false)}
                  className="p-2.5 bg-white dark:bg-stone-900 hover:bg-[#ff6b2b] hover:text-white dark:hover:bg-[#ff6b2b] border border-stone-200 dark:border-stone-800 rounded-2xl text-stone-650 dark:text-stone-300 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none"
                  title="Back to Sheet detail"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 font-mono">Curated Sheet Workspace</span>
                  </div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-white leading-tight">
                    {activeSheet?.name}
                  </h2>
                </div>
              </div>

              {/* Progress counter pill */}
              {activeSheet && (
                <div className="flex items-center gap-4 bg-white dark:bg-stone-900 px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-stone-400 uppercase leading-none">Overall Progress</p>
                    <p className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono mt-1">
                      {activeSheet.solvedCount} of {activeSheet.totalCount} Solved
                    </p>
                  </div>
                  <div className="w-12 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ff6b2b] rounded-full transition-all duration-300"
                      style={{ width: `${(activeSheet.solvedCount / activeSheet.totalCount) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCompleteActiveSheet}
                    className="text-[10px] font-black text-[#ff6b2b] hover:underline uppercase border-l border-stone-200 dark:border-stone-850 pl-3 focus:outline-none cursor-pointer"
                  >
                    Complete All
                  </button>
                </div>
              )}
            </div>

            {/* MAIN WORKSPACE COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* SIDEBAR: Problems checklist (Column span: 4) */}
              <div className="lg:col-span-4 bg-stone-50 dark:bg-stone-900/20 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 flex flex-col h-[650px]">
                <div className="pb-3 border-b border-stone-200 dark:border-stone-800/80 mb-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-450 dark:text-stone-550 font-mono">
                    Problem Catalog
                  </span>
                  <span className="text-[10px] bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-mono font-bold">
                    {activeSheet?.problems.length || 0} Available
                  </span>
                </div>

                {/* Problems Scroll list */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                  {activeSheet?.problems.map((prob) => {
                    const isSelected = prob.id === selectedProblemId;
                    return (
                      <button
                        key={prob.id}
                        type="button"
                        onClick={() => setSelectedProblemId(prob.id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer block focus:outline-none ${
                          isSelected
                            ? 'border-[#ff6b2b] bg-[#ff6b2b]/5 shadow-sm'
                            : 'border-stone-200/70 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-750'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${getDifficultyColor(prob.difficulty)}`}>
                              {prob.difficulty}
                            </span>
                            <h4 className="text-xs font-black text-stone-900 dark:text-stone-100 leading-snug truncate mt-1.5">
                              {prob.title}
                            </h4>
                          </div>

                          {prob.solved ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                              <CheckCircle className="w-4 h-4 fill-current" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-stone-300 dark:border-stone-700 flex-shrink-0" />
                          )}
                        </div>

                        {/* Category line */}
                        <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-stone-400 dark:text-stone-500 font-mono">
                          <span>{prob.category}</span>
                          {isSelected && <span className="text-[#ff6b2b]">Active →</span>}
                        </div>
                      </button>
                    );
                  })}

                  {activeSheet && !activeSheet.problems.some(p => p.id.includes('dyn-p')) && (
                    <button
                      type="button"
                      onClick={handleLoadMoreProblems}
                      className="w-full py-2.5 bg-stone-100 hover:bg-[#ff6b2b]/15 hover:text-[#ff6b2b] text-stone-700 dark:bg-stone-850 dark:hover:bg-[#ff6b2b]/15 dark:text-stone-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-dashed border-stone-300 dark:border-stone-800 flex items-center justify-center gap-1.5 focus:outline-none mt-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Load More Questions</span>
                    </button>
                  )}
                </div>

                {/* Helpful Tip */}
                <div className="mt-4 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100/50 dark:border-orange-950/30 p-3.5 rounded-2xl flex items-start gap-2.5">
                  <Trophy className="w-4 h-4 text-[#ff6b2b] flex-shrink-0 mt-0.5 fill-current" />
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                    Write standard, clean Python solution code. Hit <strong className="text-black dark:text-white">Run Code</strong> to stream automatic execution assertions!
                  </p>
                </div>
              </div>

              {/* EDITOR WORKSPACE: Code, prompt and runner (Column span: 8) */}
              <div className="lg:col-span-8 flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl overflow-hidden shadow-sm h-[650px]">
                
                {/* Editor Header */}
                <div className="px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {activeProblem && (
                      <>
                        <span className={`text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase ${getDifficultyColor(activeProblem.difficulty)}`}>
                          {activeProblem.difficulty}
                        </span>
                        <h3 className="text-sm font-black text-stone-900 dark:text-white">
                          {activeProblem.title}
                        </h3>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-bold font-mono">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>python3</span>
                  </div>
                </div>

                {/* Problem Description Area */}
                <div className="p-5 bg-stone-50/30 dark:bg-stone-950/20 border-b border-stone-200 dark:border-stone-800/80 max-h-[160px] overflow-y-auto flex-shrink-0">
                  <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider font-mono block mb-1">
                    Problem Description
                  </span>
                  <p className="text-xs text-stone-650 dark:text-stone-300 leading-relaxed font-medium">
                    {activeProblem?.description}
                  </p>
                </div>

                {/* Code Editor Screen area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#1e1e1e] relative min-h-0">
                  {/* Lines columns and Textarea container */}
                  <div className="flex-1 overflow-y-auto p-4 flex font-mono text-xs text-[#d4d4d4] relative">
                    
                    {/* Line Numbers */}
                    <div className="text-[#858585] select-none text-right pr-4 border-r border-[#3c3c3c] space-y-1 w-8">
                      {Array.from({ length: 15 }, (_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    {/* Editor Textarea with Syntax Simulation */}
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

                  {/* Test runner real-time console log overlay drawer */}
                  <div className="h-[150px] border-t border-[#3c3c3c] bg-[#181818] p-4 font-mono text-[11px] text-stone-400 overflow-y-auto space-y-1">
                    <div className="text-[#ff6b2b] font-bold text-xs uppercase mb-1 tracking-wide flex items-center gap-1.5 font-sans">
                      <Code2 className="w-4.5 h-4.5" />
                      <span>Console Logs</span>
                    </div>
                    {consoleLogs.length === 0 ? (
                      <p className="text-stone-600 italic">No logs recorded. Compile solution to inspect outputs.</p>
                    ) : (
                      consoleLogs.map((log, i) => (
                        <div key={i} className={log.includes('✓') ? 'text-green-400' : 'text-stone-300'}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Action execution buttons footer */}
                <div className="p-4 border-t border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/40 flex items-center justify-between gap-4 flex-shrink-0">
                  
                  {/* Left Side Status */}
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ff6b2b]" />
                        <span>Compiling pipeline... {runProgress}%</span>
                      </div>
                    ) : testCasesPassed.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Success! Test cases passed</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-stone-400 dark:text-stone-500">
                        Pending submission test suite
                      </span>
                    )}
                  </div>

                  {/* Right Side Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => activeProblem && setCode(activeProblem.solutionTemplate)}
                      className="px-4 py-2 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-full text-xs font-bold text-stone-700 dark:text-stone-350 cursor-pointer focus:outline-none"
                    >
                      Reset Template
                    </button>

                    <button
                      type="button"
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer focus:outline-none ${
                        isRunning ? 'opacity-50 pointer-events-none' : ''
                      }`}
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

      {/* CONFETTI SUCCESS DIALOG */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-stone-900 border-4 border-stone-900 dark:border-stone-700 rounded-3xl p-8 max-w-sm w-full text-center shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] relative overflow-hidden"
            >
              {/* rays accent */}
              <div className="absolute inset-x-0 -top-12 h-36 bg-gradient-to-b from-[#ff6b2b]/15 to-transparent blur-xl" />

              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/50 rounded-full flex items-center justify-center text-[#ff6b2b] mx-auto mb-5 border border-orange-100 dark:border-orange-900/30">
                <Award className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
                Accepted!
              </h3>
              
              <p className="text-stone-500 dark:text-stone-400 text-sm font-medium mb-6">
                All test cases passed with flying colors. Submission synced to cohort ledger!
              </p>

              {/* Streak info card */}
              <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800/80 rounded-2xl p-4 flex items-center justify-around mb-6">
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-stone-450 dark:text-stone-500 uppercase">
                    <Flame className="w-3.5 h-3.5 text-[#ff6b2b] fill-current" />
                    <span>Streak</span>
                  </div>
                  <div className="text-lg font-black text-stone-900 dark:text-white font-mono">
                    127 Days
                  </div>
                </div>
                
                <div className="h-8 w-[1px] bg-stone-200 dark:bg-stone-800" />
                
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-black text-stone-450 dark:text-stone-500 uppercase">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>Awarded</span>
                  </div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    +27 XP
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
