import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Lock, Unlock, Flame, Target, User, Sparkles, Code, 
  Briefcase, Award, GraduationCap, FolderGit, Github, Linkedin, 
  Globe, CheckCircle2, Brain, BookOpen, Zap, Star, ShieldAlert,
  PlayCircle, Share2, Copy, Check, Twitter, X
} from 'lucide-react';

interface Submission {
  id: string;
  problemId: string;
  status: string;
  language: string;
  difficulty: string;
  timestamp: string;
}

interface Profile {
  fullName: string;
  bio: string;
  skills: string[];
  projectsCount: number;
  github: string;
  linkedin: string;
  website: string;
  experienceCount: number;
  certificationsCount: number;
  educationCount: number;
}

export default function Achievements() {
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<'Unlocked' | 'Locked'>('Unlocked');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeShareBadge, setActiveShareBadge] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Dynamic stats loaded from APIs & localStorage
  const [profile, setProfile] = useState<Profile>({
    fullName: '',
    bio: '',
    skills: [],
    projectsCount: 0,
    github: '',
    linkedin: '',
    website: '',
    experienceCount: 0,
    certificationsCount: 0,
    educationCount: 0
  });
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch profile
        try {
          const profileRes = await fetch('/api/profile');
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData && profileData.success && profileData.profile) {
              const p = profileData.profile;
              setProfile({
                fullName: p.fullName || '',
                bio: p.bio || '',
                skills: Array.isArray(p.professional?.skills) ? p.professional.skills : [],
                projectsCount: Array.isArray(p.projects) ? p.projects.length : 0,
                github: p.github || '',
                linkedin: p.linkedin || '',
                website: p.website || '',
                experienceCount: Array.isArray(p.experience) ? p.experience.length : 0,
                certificationsCount: Array.isArray(p.certifications) ? p.certifications.length : 0,
                educationCount: Array.isArray(p.education) ? p.education.length : 0
              });
            }
          }
        } catch (e) {
          console.error('Error fetching profile:', e);
        }

        // 2. Fetch DSA Submissions
        try {
          const dsaRes = await fetch('/api/dsa/submissions');
          if (dsaRes.ok) {
            const dsaData = await dsaRes.json();
            if (dsaData && dsaData.success && Array.isArray(dsaData.submissions)) {
              setSubmissions(dsaData.submissions);
            }
          }
        } catch (e) {
          console.error('Error fetching DSA submissions:', e);
        }

        // 3. Fetch Blogs
        try {
          const blogsRes = await fetch('/api/blogs');
          if (blogsRes.ok) {
            const blogsData = await blogsRes.json();
            if (blogsData && blogsData.success && Array.isArray(blogsData.blogs)) {
              setBlogs(blogsData.blogs);
            }
          }
        } catch (e) {
          console.error('Error fetching blogs:', e);
        }

        // 4. Fetch Hackathons
        try {
          const hackathonsRes = await fetch('/api/hackathons');
          if (hackathonsRes.ok) {
            const hackathonsData = await hackathonsRes.json();
            if (hackathonsData && hackathonsData.success && Array.isArray(hackathonsData.hackathons)) {
              setHackathons(hackathonsData.hackathons);
            }
          }
        } catch (e) {
          console.error('Error fetching hackathons:', e);
        }

        // 5. Load Quizzes from localStorage
        const quizScoresRaw = localStorage.getItem('leetmaster_quiz_completed_scores');
        if (quizScoresRaw) {
          try {
            const parsed = JSON.parse(quizScoresRaw);
            if (Array.isArray(parsed)) {
              setCompletedQuizzes(parsed);
            }
          } catch (e) {
            console.error('Error parsing quiz scores', e);
          }
        }

        // 6. Load Courses from localStorage
        const coursesRaw = localStorage.getItem('leetmaster_courses_state');
        if (coursesRaw) {
          try {
            const parsed = JSON.parse(coursesRaw);
            if (Array.isArray(parsed)) {
              setCourses(parsed);
            }
          } catch (e) {
            console.error('Error parsing courses state', e);
          }
        }

      } catch (err) {
        console.error('Error loading stats for achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- STATS COMPUTATIONS ---
  const uniqueSolvedProblems = new Set(
    (submissions || [])
      .filter(s => s && s.status === 'Accepted' && s.problemId)
      .map(s => s.problemId)
  );
  const solvedCount = uniqueSolvedProblems.size;
  const quizCount = (completedQuizzes || []).length;
  
  const hasHighScoreQuiz = (completedQuizzes || []).some(q => {
    if (!q) return false;
    if (typeof q.score === 'number') return q.score >= 80;
    if (typeof q.score === 'string') {
      const parts = q.score.split('/');
      if (parts.length === 2) {
        const scoreVal = parseFloat(parts[0]);
        const totalVal = parseFloat(parts[1]);
        if (totalVal > 0) return (scoreVal / totalVal) >= 0.8;
      }
      const num = parseFloat(q.score);
      if (!isNaN(num)) return num >= 80;
    }
    return false;
  });

  const enrolledCount = (courses || []).filter(c => c && c.enrolled).length;
  const completedLessonsCount = (courses || [])
    .filter(c => c && Array.isArray(c.modules))
    .flatMap(c => c.modules || [])
    .filter(m => m && Array.isArray(m.lessons))
    .flatMap(m => m.lessons || [])
    .filter(l => l && l.completed).length;
  
  const hasGraduate = (courses || []).some(c => c && c.enrolled && c.progress === 100);
  const hasProfileText = !!(
    profile && 
    typeof profile.fullName === 'string' && 
    typeof profile.bio === 'string' && 
    profile.fullName.trim().length > 0 && 
    profile.bio.trim().length > 0
  );
  const hasGithub = !!(
    profile?.github && 
    typeof profile.github === 'string' && 
    profile.github.trim() !== '' && 
    !profile.github.includes('github.com/username')
  );
  const userBlogsCount = (blogs || []).filter(b => b && b.isUserBlog).length;
  const userHackathonsCount = (hackathons || []).filter(h => h && h.isUserHackathon).length;

  // Real-time dynamic XP calculation
  const calculatedXp = 0 // baseline XP starts strictly from zero
    + (solvedCount * 50)
    + (quizCount * 100)
    + (hasProfileText ? 100 : 0)
    + (hasGithub ? 100 : 0)
    + ((profile?.experienceCount || 0) * 150)
    + ((profile?.certificationsCount || 0) * 150)
    + (completedLessonsCount * 15)
    + (userBlogsCount * 100)
    + (userHackathonsCount * 150);

  // Level Up logic
  const currentLevel = Math.max(1, Math.floor(calculatedXp / 150) + 1);
  const nextLevelXp = currentLevel * 150;
  const currentLevelBaseXp = (currentLevel - 1) * 150;
  const levelProgress = Math.min(100, Math.round(((calculatedXp - currentLevelBaseXp) / 150) * 100));

  // Sync to localstorage so navbar/sidebar reflects the exact calculated dynamic score
  useEffect(() => {
    if (!loading) {
      const savedXp = localStorage.getItem('leetmaster_user_xp');
      if (savedXp !== calculatedXp.toString()) {
        localStorage.setItem('leetmaster_user_xp', calculatedXp.toString());
      }
    }
  }, [calculatedXp, loading]);

  // programmatically define exactly 100 high-fidelity developer badges
  const algoTemplates = [
    { name: 'FIFO Cadet', desc: 'Solved 1 DSA problem. A journey of a thousand leagues begins with a single line of code.', req: 'Submit 1 Accepted solution in the DSA track.', icon: Trophy, ribbon: 'CADET' },
    { name: 'Two Pointers Scout', desc: 'Solved 2 DSA problems. Navigating sequences from both ends with extreme precision.', req: 'Submit 2 Accepted solutions in the DSA track.', icon: Flame, ribbon: 'SCOUT' },
    { name: 'Linked List Wrangler', desc: 'Solved 3 DSA problems. Successfully chained nodes together without a single memory leak.', req: 'Submit 3 Accepted solutions in the DSA track.', icon: Code, ribbon: 'WRANGLER' },
    { name: 'Stack Operator', desc: 'Solved 4 DSA problems. Mastering FIFO and LIFO structures with utmost stability.', req: 'Submit 4 Accepted solutions in the DSA track.', icon: Target, ribbon: 'OPERATOR' },
    { name: 'Binary Marksman', desc: 'Solved 5 DSA problems. Cutting search spaces in half with absolute precision.', req: 'Submit 5 Accepted solutions in the DSA track.', icon: Target, ribbon: 'MARKSMAN' },
    { name: 'Sliding Window Master', desc: 'Solved 6 DSA problems. Dynamically resizing sub-arrays to optimize time complexity.', req: 'Submit 6 Accepted solutions in the DSA track.', icon: Zap, ribbon: 'STRATEGIST' },
    { name: 'Hash Map Sentinel', desc: 'Solved 7 DSA problems. Perfect O(1) constant-time key lookups without collision.', req: 'Submit 7 Accepted solutions in the DSA track.', icon: Award, ribbon: 'SENTINEL' },
    { name: 'Recursion Wizard', desc: 'Solved 8 DSA problems. Breaking complex paradigms down into elegant base cases.', req: 'Submit 8 Accepted solutions in the DSA track.', icon: Brain, ribbon: 'WIZARD' },
    { name: 'DFS Pathfinder', desc: 'Solved 9 DSA problems. Traversing graphs to their deepest leaf nodes first.', req: 'Submit 9 Accepted solutions in the DSA track.', icon: Sparkles, ribbon: 'PATHFINDER' },
    { name: 'BFS Grid Crawler', desc: 'Solved 10 DSA problems. Layer-by-layer exploration of dense coordinate trees.', req: 'Submit 10 Accepted solutions in the DSA track.', icon: PlayCircle, ribbon: 'CRAWLER' },
    { name: 'Heap Overlord', desc: 'Solved 11 DSA problems. Keeping priority elements at the top of the heap tree structure.', req: 'Submit 11 Accepted solutions in the DSA track.', icon: Award, ribbon: 'OVERLORD' },
    { name: 'Backtracking Pioneer', desc: 'Solved 12 DSA problems. Finding all valid permutations while pruning dead pathways.', req: 'Submit 12 Accepted solutions in the DSA track.', icon: Star, ribbon: 'PIONEER' },
    { name: 'DP Apprentice', desc: 'Solved 13 DSA problems. Storing sub-problem states to optimize complex recursion.', req: 'Submit 13 Accepted solutions in the DSA track.', icon: Brain, ribbon: 'APPRENTICE' },
    { name: 'Greedy Allocator', desc: 'Solved 14 DSA problems. Picking local optima to secure a globally sound solution.', req: 'Submit 14 Accepted solutions in the DSA track.', icon: Zap, ribbon: 'ALLOCATOR' },
    { name: 'Trie Architect', desc: 'Solved 15 DSA problems. Designing lightning-fast prefix trees for word search queries.', req: 'Submit 15 Accepted solutions in the DSA track.', icon: Code, ribbon: 'ARCHITECT' },
    { name: 'Graph General', desc: 'Solved 16 DSA problems. Modeling complex networks of nodes and directional edges.', req: 'Submit 16 Accepted solutions in the DSA track.', icon: Trophy, ribbon: 'GENERAL' },
    { name: 'Dijkstra Navigator', desc: 'Solved 17 DSA problems. Solving short-path problems on dense weighted vertices.', req: 'Submit 17 Accepted solutions in the DSA track.', icon: Globe, ribbon: 'NAVIGATOR' },
    { name: 'Topological Sorter', desc: 'Solved 18 DSA problems. Resolving dependency loops in sequential task lists.', req: 'Submit 18 Accepted solutions in the DSA track.', icon: Target, ribbon: 'SORTER' },
    { name: 'Union-Find Expert', desc: 'Solved 19 DSA problems. Grouping items and finding set equivalence dynamically.', req: 'Submit 19 Accepted solutions in the DSA track.', icon: Sparkles, ribbon: 'EXPERT' },
    { name: 'Divide & Conquer', desc: 'Solved 20 DSA problems. Splitting arrays, sorting halves, and merging elegantly.', req: 'Submit 20 Accepted solutions in the DSA track.', icon: Trophy, ribbon: 'CONQUEROR' },
    { name: 'Bitwise Ninja', desc: 'Solved 21 DSA problems. Bitwise operations, masking, and XOR wizardry.', req: 'Submit 21 Accepted solutions in the DSA track.', icon: Zap, ribbon: 'NINJA' },
    { name: 'Interval Merger', desc: 'Solved 22 DSA problems. Compacting overlapping time arrays into cohesive ranges.', req: 'Submit 22 Accepted solutions in the DSA track.', icon: Code, ribbon: 'MERGER' },
    { name: 'Matrix Rotator', desc: 'Solved 23 DSA problems. Operating in-place transformations on 2D vectors and grids.', req: 'Submit 23 Accepted solutions in the DSA track.', icon: Target, ribbon: 'ROTATOR' },
    { name: 'Knapsack Strategist', desc: 'Solved 24 DSA problems. Solving classic combinatoric optimization under strict constraints.', req: 'Submit 24 Accepted solutions in the DSA track.', icon: Brain, ribbon: 'STRATEGIST' },
    { name: 'DSA Grandmaster', desc: 'Solved 25 DSA problems. You have achieved algorithmic transcendence. Simply unmatched.', req: 'Submit 25 Accepted solutions in the DSA track.', icon: Sparkles, ribbon: 'GRANDMASTER' }
  ];

  const quizTemplates = [
    { name: 'Quiz Initiate', desc: 'Completed 1 CS assessment. Stepped into the arena of conceptual testing.', req: 'Complete 1 Quiz assessment.', icon: Brain, ribbon: 'INITIATE', countReq: 1 },
    { name: 'Two Stars Trivia', desc: 'Completed 2 CS assessments. Solidifying fundamental terms.', req: 'Complete 2 Quiz assessments.', icon: Star, ribbon: 'TRIVIA', countReq: 2 },
    { name: 'CS Scholar', desc: 'Completed 3 CS assessments. Gaining systematic clarity in computing.', req: 'Complete 3 Quiz assessments.', icon: Award, ribbon: 'SCHOLAR', countReq: 3 },
    { name: 'Quad Core Quizzer', desc: 'Completed 4 CS assessments. Running multi-threaded conceptual lookups.', req: 'Complete 4 Quiz assessments.', icon: Zap, ribbon: 'QUIZZER', countReq: 4 },
    { name: 'Trivia Enthusiast', desc: 'Completed 5 CS assessments. Showing broad computing fluency.', req: 'Complete 5 Quiz assessments.', icon: BookOpen, ribbon: 'ENTHUSIAST', countReq: 5 },
    { name: 'Quiz Challenger', desc: 'Completed 6 CS assessments. Measuring your CS knowledge.', req: 'Complete 6 Quiz assessments.', icon: Target, ribbon: 'CHALLENGER', countReq: 6 },
    { name: 'Logic Master', desc: 'Completed 7 CS assessments. Boolean logic patterns resolved.', req: 'Complete 7 Quiz assessments.', icon: Brain, ribbon: 'LOGIC', countReq: 7 },
    { name: 'Savant Mindset', desc: 'Completed 8 CS assessments. Retaining runtime facts effortlessly.', req: 'Complete 8 Quiz assessments.', icon: Trophy, ribbon: 'SAVANT', countReq: 8 },
    { name: 'Exam Crusher', desc: 'Completed 9 CS assessments. Consistent academic brilliance.', req: 'Complete 9 Quiz assessments.', icon: Award, ribbon: 'CRUSHER', countReq: 9 },
    { name: 'Quiz Overlord', desc: 'Completed 10 CS assessments. Conquered the computing quiz bank.', req: 'Complete 10 Quiz assessments.', icon: Sparkles, ribbon: 'OVERLORD', countReq: 10 },
    { name: 'HighScore Rookie', desc: 'Earned 80%+ on an assessment. First taste of perfection.', req: 'Get 80%+ on 1 quiz.', icon: Star, ribbon: 'ROOKIE', hasHigh: true, highReq: 1 },
    { name: 'Silver Intellect', desc: 'Earned 80%+ on 2 assessments. True theoretical comprehension.', req: 'Get 80%+ on 2 quizzes.', icon: Award, ribbon: 'SILVER', hasHigh: true, highReq: 2 },
    { name: 'Gold Scholar', desc: 'Earned 80%+ on 3 assessments. Outstanding grade accuracy.', req: 'Get 80%+ on 3 quizzes.', icon: Trophy, ribbon: 'GOLD', hasHigh: true, highReq: 3 },
    { name: 'Platinum Mind', desc: 'Earned 80%+ on 4 assessments. Top-tier computer science grading.', req: 'Get 80%+ on 4 quizzes.', icon: Sparkles, ribbon: 'PLATINUM', hasHigh: true, highReq: 4 },
    { name: 'Web Mastermind', desc: 'Earned 80%+ on 5 assessments. Comprehensive understanding of full stack.', req: 'Get 80%+ on 5 quizzes.', icon: Globe, ribbon: 'WEB', hasHigh: true, highReq: 5 },
    { name: 'Database Oracle', desc: 'Earned 80%+ on 6 assessments. Relational and non-relational master.', req: 'Get 80%+ on 6 quizzes.', icon: Brain, ribbon: 'ORACLE', hasHigh: true, highReq: 6 },
    { name: 'Network protocol', desc: 'Earned 80%+ on 7 assessments. Master of sockets, routers, and ports.', req: 'Get 80%+ on 7 quizzes.', icon: Zap, ribbon: 'PROTOCOL', hasHigh: true, highReq: 7 },
    { name: 'OOP Purist', desc: 'Earned 80%+ on 8 assessments. Object-oriented polymorphism master.', req: 'Get 80%+ on 8 quizzes.', icon: Code, ribbon: 'PURIST', hasHigh: true, highReq: 8 },
    { name: 'System Architect', desc: 'Earned 80%+ on 9 assessments. Scalable distributed system master.', req: 'Get 80%+ on 9 quizzes.', icon: Target, ribbon: 'ARCHITECT', hasHigh: true, highReq: 9 },
    { name: 'Perfect Champion', desc: 'Earned 80%+ on 10 assessments. The final ultimate academic shield.', req: 'Get 80%+ on 10 quizzes.', icon: Trophy, ribbon: 'CHAMPION', hasHigh: true, highReq: 10 }
  ];

  const courseTemplates = [
    { name: 'Active Enroller', desc: 'Enrolled in 1 course. Charting a direct learning pathway.', req: 'Enroll in at least 1 course.', icon: BookOpen, ribbon: 'ENROLLER', type: 'enroll', target: 1 },
    { name: 'Dual Curriculum', desc: 'Enrolled in 2 courses. Balancing multiple learning curriculums.', req: 'Enroll in at least 2 courses.', icon: BookOpen, ribbon: 'DUAL', type: 'enroll', target: 2 },
    { name: 'Polymath Learner', desc: 'Enrolled in 3 courses. Seeking comprehensive full-stack expertise.', req: 'Enroll in at least 3 courses.', icon: Award, ribbon: 'POLYMATH', type: 'enroll', target: 3 },
    { name: 'First Lecture', desc: 'Completed 1 lesson. Took your first steps in the curriculum.', req: 'Complete 1 lesson in any course.', icon: PlayCircle, ribbon: 'STUDENT', type: 'lesson', target: 1 },
    { name: 'Double Student', desc: 'Completed 2 lessons. Consuming theory and working on exercises.', req: 'Complete 2 lessons in any course.', icon: PlayCircle, ribbon: 'DOUBLE', type: 'lesson', target: 2 },
    { name: 'Trio Reader', desc: 'Completed 3 lessons. Building a healthy habit of learning.', req: 'Complete 3 lessons in any course.', icon: PlayCircle, ribbon: 'SEEKER', type: 'lesson', target: 3 },
    { name: 'Module Adept', desc: 'Completed 4 lessons. Retaining complex coding instructions.', req: 'Complete 4 lessons in any course.', icon: PlayCircle, ribbon: 'ADEPT', type: 'lesson', target: 4 },
    { name: 'Steady Progress', desc: 'Completed 5 lessons. Approaching midway milestone of studies.', req: 'Complete 5 lessons in any course.', icon: Target, ribbon: 'STEADY', type: 'lesson', target: 5 },
    { name: 'Syllabus Explorer', desc: 'Completed 6 lessons. Well-versed with initial architectures.', req: 'Complete 6 lessons in any course.', icon: PlayCircle, ribbon: 'EXPLORER', type: 'lesson', target: 6 },
    { name: 'Coding Cadet', desc: 'Completed 7 lessons. Synthesizing theoretical structures.', req: 'Complete 7 lessons in any course.', icon: Code, ribbon: 'CADET', type: 'lesson', target: 7 },
    { name: 'Intellect Builder', desc: 'Completed 8 lessons. Learning advanced programming practices.', req: 'Complete 8 lessons in any course.', icon: Brain, ribbon: 'BUILDER', type: 'lesson', target: 8 },
    { name: 'Dynamic Student', desc: 'Completed 9 lessons. Confidently moving through complex lessons.', req: 'Complete 9 lessons in any course.', icon: PlayCircle, ribbon: 'DYNAMIC', type: 'lesson', target: 9 },
    { name: 'Syllabus Crusader', desc: 'Completed 10 lessons. Double digit lessons finished.', req: 'Complete 10 lessons in any course.', icon: Trophy, ribbon: 'CRUSADER', type: 'lesson', target: 10 },
    { name: 'Knowledge Store', desc: 'Completed 11 lessons. Retaining state management and APIs.', req: 'Complete 11 lessons in any course.', icon: PlayCircle, ribbon: 'STORE', type: 'lesson', target: 11 },
    { name: 'Lecture Devotee', desc: 'Completed 12 lessons. Excellent dedication toward studies.', req: 'Complete 12 lessons in any course.', icon: Award, ribbon: 'DEVOTEE', type: 'lesson', target: 12 },
    { name: 'Study Leader', desc: 'Completed 13 lessons. Displaying top-tier commitment.', req: 'Complete 13 lessons in any course.', icon: Star, ribbon: 'LEADER', type: 'lesson', target: 13 },
    { name: 'Framework Expert', desc: 'Completed 14 lessons. Overcoming deep frontend blocks.', req: 'Complete 14 lessons in any course.', icon: Code, ribbon: 'EXPERT', type: 'lesson', target: 14 },
    { name: 'Curriculum King', desc: 'Completed 15 lessons. Finished extensive structured coursework.', req: 'Complete 15 lessons in any course.', icon: Sparkles, ribbon: 'KING', type: 'lesson', target: 15 },
    { name: 'First Graduate', desc: 'Graduated from 1 specialized course with 100% progress.', req: 'Complete 1 course with 100% progress.', icon: GraduationCap, ribbon: 'GRADUATE', type: 'grad', target: 1 },
    { name: 'Master Alumnus', desc: 'Graduated from multiple courses on LeetMaster.', req: 'Complete 2 courses with 100% progress.', icon: GraduationCap, ribbon: 'ALUMNUS', type: 'grad', target: 2 }
  ];

  const profileTemplates = [
    { name: 'Identity Forger', desc: 'Set your full name on your profile page.', req: 'Add Full Name in Profile.', icon: User, ribbon: 'IDENTITY', check: 'name' },
    { name: 'Digital Avatar', desc: 'Wrote an impressive bio introducing yourself.', req: 'Add Biography in Profile.', icon: BookOpen, ribbon: 'AVATAR', check: 'bio' },
    { name: 'Skill Displayer', desc: 'Listed your technical skills for recruiter inspection.', req: 'Add 1 or more skills.', icon: Code, ribbon: 'SKILLS', check: 'skill-1' },
    { name: 'Poly-Skilled Dev', desc: 'Listed 5 or more advanced engineering skills.', req: 'Add 5 or more skills.', icon: Sparkles, ribbon: 'POLY', check: 'skill-5' },
    { name: 'Octocat Native', desc: 'Linked your GitHub repository portfolio.', req: 'Add GitHub URL.', icon: Github, ribbon: 'OCTOCAT', check: 'github' },
    { name: 'LinkedIn Partner', desc: 'Connected your LinkedIn network page.', req: 'Add LinkedIn URL.', icon: Linkedin, ribbon: 'CONNECT', check: 'linkedin' },
    { name: 'World Wide Web', desc: 'Added your personal portfolio website.', req: 'Add Portfolio Website URL.', icon: Globe, ribbon: 'WEB', check: 'website' },
    { name: 'Real Experience', desc: 'Listed your professional industry history.', req: 'Add 1 experience item.', icon: Briefcase, ribbon: 'EXPERT', check: 'exp-1' },
    { name: 'Industry Veteran', desc: 'Showcasing multiple past professional roles.', req: 'Add 2 experience items.', icon: Briefcase, ribbon: 'VETERAN', check: 'exp-2' },
    { name: 'Certified Hero', desc: 'Verified your technology certifications.', req: 'Add 1 certification item.', icon: Award, ribbon: 'CERTIFIED', check: 'cert-1' },
    { name: 'Creds Overlord', desc: 'Accumulated multiple professional credentials.', req: 'Add 2 certification items.', icon: Trophy, ribbon: 'OVERLORD', check: 'cert-2' },
    { name: 'Academic Mind', desc: 'Added your university or bootcamp education.', req: 'Add 1 education item.', icon: GraduationCap, ribbon: 'SCHOLAR', check: 'edu-1' },
    { name: 'Dual Alumnus', desc: 'Showcasing multiple academic milestones.', req: 'Add 2 education items.', icon: GraduationCap, ribbon: 'ALUMNUS', check: 'edu-2' },
    { name: 'Perfect Portfolio', desc: 'Every portfolio link and bio field is complete.', req: 'Fill name, bio, skills, github, linkedin, website.', icon: Sparkles, ribbon: 'PERFECT', check: 'perfect' },
    { name: 'Recruiter Magnet', desc: 'Engineered an irresistible developer showcase.', req: 'Have 1+ exp, 1+ cert, 3+ skills.', icon: Target, ribbon: 'MAGNET', check: 'magnet' }
  ];

  const blogTemplates = [
    { name: 'Writer Initiate', desc: 'Published 1 engineering article sharing knowledge.', req: 'Publish 1 Blog.', icon: BookOpen, ribbon: 'INITIATE', target: 1 },
    { name: 'Opinionated Dev', desc: 'Published 2 blogs on modern software topics.', req: 'Publish 2 Blogs.', icon: Code, ribbon: 'OPINION', target: 2 },
    { name: 'Tutorial Creator', desc: 'Published 3 blogs explaining code structures.', req: 'Publish 3 Blogs.', icon: PlayCircle, ribbon: 'TUTORIAL', target: 3 },
    { name: 'System Blogger', desc: 'Published 4 blogs about microservices and architecture.', req: 'Publish 4 Blogs.', icon: Target, ribbon: 'SYSTEM', target: 4 },
    { name: 'News Champion', desc: 'Published 5 blogs keeping peers updated on tooling.', req: 'Publish 5 Blogs.', icon: Star, ribbon: 'CHAMPION', target: 5 },
    { name: 'Engineering Lead', desc: 'Published 6 blogs explaining production solutions.', req: 'Publish 6 Blogs.', icon: Award, ribbon: 'LEAD', target: 6 },
    { name: 'Senior Writer', desc: 'Published 7 blogs diving into complex computing concepts.', req: 'Publish 7 Blogs.', icon: Brain, ribbon: 'SENIOR', target: 7 },
    { name: 'Code Instructor', desc: 'Published 8 blogs teaching junior coders workflows.', req: 'Publish 8 Blogs.', icon: BookOpen, ribbon: 'TEACHER', target: 8 },
    { name: 'Dev Advocate', desc: 'Published 9 blogs reviewing popular library packages.', req: 'Publish 9 Blogs.', icon: Sparkles, ribbon: 'ADVOCATE', target: 9 },
    { name: 'Staff Journalist', desc: 'Published 10 blogs. Complete master of technical publications.', req: 'Publish 10 Blogs.', icon: Trophy, ribbon: 'JOURNALIST', target: 10 }
  ];

  const hackTemplates = [
    { name: 'Gladiator Rookie', desc: 'Created or joined 1 interactive hackathon event.', req: 'Create/Join 1 Hackathon.', icon: FolderGit, ribbon: 'ROOKIE', target: 1 },
    { name: 'MVP Prototyper', desc: 'Created or joined 2 hackathons building agile models.', req: 'Create/Join 2 Hackathons.', icon: Code, ribbon: 'MVP', target: 2 },
    { name: 'Team Coordinator', desc: 'Created or joined 3 hackathons gathering talent.', req: 'Create/Join 3 Hackathons.', icon: User, ribbon: 'LEADER', target: 3 },
    { name: 'API Jammer', desc: 'Created or joined 4 hackathons linking API systems.', req: 'Create/Join 4 Hackathons.', icon: Zap, ribbon: 'JAMMER', target: 4 },
    { name: 'Demo Day Veteran', desc: 'Created or joined 5 hackathons pitching live judges.', req: 'Create/Join 5 Hackathons.', icon: PlayCircle, ribbon: 'VETERAN', target: 5 },
    { name: 'Midnight Coder', desc: 'Created or joined 6 hackathons coding straight through.', req: 'Create/Join 6 Hackathons.', icon: Flame, ribbon: 'MIDNIGHT', target: 6 },
    { name: 'Lean Builder', desc: 'Created or joined 7 hackathons shipping core logic.', req: 'Create/Join 7 Hackathons.', icon: Target, ribbon: 'LEAN', target: 7 },
    { name: 'UI Hacker', desc: 'Created or joined 8 hackathons crafting responsive flows.', req: 'Create/Join 8 Hackathons.', icon: Sparkles, ribbon: 'STYLING', target: 8 },
    { name: 'Hackathon Host', desc: 'Created or joined 9 hackathons curating parameters.', req: 'Create/Join 9 Hackathons.', icon: Trophy, ribbon: 'HOST', target: 10 },
    { name: 'Ultimate Innovator', desc: 'Created or joined 10 hackathons. speed-coding king.', req: 'Create/Join 10 Hackathons.', icon: Sparkles, ribbon: 'INNOVATOR', target: 10 }
  ];

  // Map into structured arrays
  const algoBadges = algoTemplates.map((t, index) => {
    const target = index + 1;
    const isUnlocked = solvedCount >= target;
    return {
      id: `algo-${target}`,
      name: t.name,
      category: 'Algorithms',
      description: t.desc,
      requirement: t.req,
      reward: `+${target * 50} XP`,
      unlocked: isUnlocked,
      progressMax: target,
      progressCurrent: Math.min(target, solvedCount),
      icon: t.icon,
      color: '#10b981', // Emerald Green
      ribbonText: t.ribbon
    };
  });

  const quizBadges = quizTemplates.map((t, index) => {
    const isHighPerformance = t.hasHigh;
    const targetVal = isHighPerformance ? (t.highReq || 1) : (t.countReq || 1);
    let isUnlocked = false;
    let progressCurrent = 0;
    
    if (isHighPerformance) {
      const highScoresCount = (completedQuizzes || []).filter(q => {
        if (!q) return false;
        if (typeof q.score === 'number') return q.score >= 80;
        if (typeof q.score === 'string') {
          const parts = q.score.split('/');
          if (parts.length === 2) {
            const scoreVal = parseFloat(parts[0]);
            const totalVal = parseFloat(parts[1]);
            if (totalVal > 0) return (scoreVal / totalVal) >= 0.8;
          }
          const num = parseFloat(q.score);
          if (!isNaN(num)) return num >= 80;
        }
        return false;
      }).length;
      isUnlocked = highScoresCount >= targetVal;
      progressCurrent = highScoresCount;
    } else {
      isUnlocked = quizCount >= targetVal;
      progressCurrent = quizCount;
    }

    return {
      id: `quiz-${index + 1}`,
      name: t.name,
      category: 'Quizzes',
      description: t.desc,
      requirement: t.req,
      reward: `+${targetVal * 80} XP`,
      unlocked: isUnlocked,
      progressMax: targetVal,
      progressCurrent: Math.min(targetVal, progressCurrent),
      icon: t.icon,
      color: '#eab308', // Amber Gold
      ribbonText: t.ribbon
    };
  });

  const courseBadges = courseTemplates.map((t, index) => {
    const targetVal = t.target;
    let isUnlocked = false;
    let progressCurrent = 0;

    if (t.type === 'enroll') {
      isUnlocked = enrolledCount >= targetVal;
      progressCurrent = enrolledCount;
    } else if (t.type === 'lesson') {
      isUnlocked = completedLessonsCount >= targetVal;
      progressCurrent = completedLessonsCount;
    } else if (t.type === 'grad') {
      const fullGradCount = (courses || []).filter(c => c && c.enrolled && c.progress === 100).length;
      isUnlocked = fullGradCount >= targetVal;
      progressCurrent = fullGradCount;
    }

    return {
      id: `course-${index + 1}`,
      name: t.name,
      category: 'Courses',
      description: t.desc,
      requirement: t.req,
      reward: `+${targetVal * 60} XP`,
      unlocked: isUnlocked,
      progressMax: targetVal,
      progressCurrent: Math.min(targetVal, progressCurrent),
      icon: t.icon,
      color: '#8b5cf6', // Violet
      ribbonText: t.ribbon
    };
  });

  const profileBadges = profileTemplates.map((t, index) => {
    let isUnlocked = false;
    let progressCurrent = 0;
    let progressMax = 1;

    const hasName = !!(profile?.fullName && profile.fullName.trim() !== '');
    const hasBioVal = !!(profile?.bio && profile.bio.trim() !== '');
    const skillsCount = Array.isArray(profile?.skills) ? profile.skills.length : 0;
    const expCount = profile?.experienceCount || 0;
    const certsCount = profile?.certificationsCount || 0;
    const eduCount = profile?.educationCount || 0;

    if (t.check === 'name') {
      isUnlocked = hasName;
      progressCurrent = hasName ? 1 : 0;
    } else if (t.check === 'bio') {
      isUnlocked = hasBioVal;
      progressCurrent = hasBioVal ? 1 : 0;
    } else if (t.check === 'skill-1') {
      isUnlocked = skillsCount >= 1;
      progressCurrent = skillsCount;
      progressMax = 1;
    } else if (t.check === 'skill-5') {
      isUnlocked = skillsCount >= 5;
      progressCurrent = skillsCount;
      progressMax = 5;
    } else if (t.check === 'github') {
      isUnlocked = hasGithub;
      progressCurrent = hasGithub ? 1 : 0;
    } else if (t.check === 'linkedin') {
      const hasLinkedin = !!(profile?.linkedin && profile.linkedin.trim() !== '' && !profile.linkedin.includes('linkedin.com/username'));
      isUnlocked = hasLinkedin;
      progressCurrent = hasLinkedin ? 1 : 0;
    } else if (t.check === 'website') {
      const hasWebsite = !!(profile?.website && profile.website.trim() !== '' && !profile.website.includes('example.com'));
      isUnlocked = hasWebsite;
      progressCurrent = hasWebsite ? 1 : 0;
    } else if (t.check === 'exp-1') {
      isUnlocked = expCount >= 1;
      progressCurrent = expCount;
      progressMax = 1;
    } else if (t.check === 'exp-2') {
      isUnlocked = expCount >= 2;
      progressCurrent = expCount;
      progressMax = 2;
    } else if (t.check === 'cert-1') {
      isUnlocked = certsCount >= 1;
      progressCurrent = certsCount;
      progressMax = 1;
    } else if (t.check === 'cert-2') {
      isUnlocked = certsCount >= 2;
      progressCurrent = certsCount;
      progressMax = 2;
    } else if (t.check === 'edu-1') {
      isUnlocked = eduCount >= 1;
      progressCurrent = eduCount;
      progressMax = 1;
    } else if (t.check === 'edu-2') {
      isUnlocked = eduCount >= 2;
      progressCurrent = eduCount;
      progressMax = 2;
    } else if (t.check === 'perfect') {
      const hasLinkedin = !!(profile?.linkedin && profile.linkedin.trim() !== '');
      const hasWebsite = !!(profile?.website && profile.website.trim() !== '');
      isUnlocked = hasName && hasBioVal && skillsCount >= 1 && hasGithub && hasLinkedin && hasWebsite;
      progressCurrent = (hasName ? 1 : 0) + (hasBioVal ? 1 : 0) + (skillsCount >= 1 ? 1 : 0) + (hasGithub ? 1 : 0) + (hasLinkedin ? 1 : 0) + (hasWebsite ? 1 : 0);
      progressMax = 6;
    } else if (t.check === 'magnet') {
      isUnlocked = expCount >= 1 && certsCount >= 1 && skillsCount >= 3;
      progressCurrent = (expCount >= 1 ? 1 : 0) + (certsCount >= 1 ? 1 : 0) + (skillsCount >= 3 ? 1 : 0);
      progressMax = 3;
    }

    return {
      id: `profile-${index + 1}`,
      name: t.name,
      category: 'Profile',
      description: t.desc,
      requirement: t.req,
      reward: `+120 XP`,
      unlocked: isUnlocked,
      progressMax: progressMax,
      progressCurrent: Math.min(progressMax, progressCurrent),
      icon: t.icon,
      color: '#0ea5e9', // Sky Blue
      ribbonText: t.ribbon
    };
  });

  const blogBadges = blogTemplates.map((t, index) => {
    const targetVal = t.target;
    const isUnlocked = userBlogsCount >= targetVal;

    return {
      id: `blog-${index + 1}`,
      name: t.name,
      category: 'Blogs',
      description: t.desc,
      requirement: t.req,
      reward: `+${targetVal * 100} XP`,
      unlocked: isUnlocked,
      progressMax: targetVal,
      progressCurrent: Math.min(targetVal, userBlogsCount),
      icon: t.icon,
      color: '#ec4899', // Pink
      ribbonText: t.ribbon
    };
  });

  const hackBadges = hackTemplates.map((t, index) => {
    const targetVal = t.target;
    const isUnlocked = userHackathonsCount >= targetVal;

    return {
      id: `hackathon-${index + 1}`,
      name: t.name,
      category: 'Hackathons',
      description: t.desc,
      requirement: t.req,
      reward: `+${targetVal * 120} XP`,
      unlocked: isUnlocked,
      progressMax: targetVal,
      progressCurrent: Math.min(targetVal, userHackathonsCount),
      icon: t.icon,
      color: '#f43f5e', // Rose
      ribbonText: t.ribbon
    };
  });

  const achievementsList = [
    ...algoBadges,
    ...quizBadges,
    ...courseBadges,
    ...profileBadges,
    ...blogBadges,
    ...hackBadges
  ];

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;
  const lockedCount = achievementsList.length - unlockedCount;

  // Active badges based on Unlocked/Locked tab selection
  const activeStatusList = statusTab === 'Unlocked' 
    ? achievementsList.filter(a => a.unlocked)
    : achievementsList.filter(a => !a.unlocked);

  // Filter tabs
  const filters = [
    { name: 'All', count: activeStatusList.length },
    { name: 'Algorithms', count: activeStatusList.filter(a => a.category === 'Algorithms').length },
    { name: 'Quizzes', count: activeStatusList.filter(a => a.category === 'Quizzes').length },
    { name: 'Courses', count: activeStatusList.filter(a => a.category === 'Courses').length },
    { name: 'Profile', count: activeStatusList.filter(a => a.category === 'Profile').length },
    { name: 'Blogs & Hackathons', count: activeStatusList.filter(a => a.category === 'Blogs' || a.category === 'Hackathons').length }
  ];

  // Filtering Logic
  const filteredBadges = activeStatusList.filter(badge => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Blogs & Hackathons') return badge.category === 'Blogs' || badge.category === 'Hackathons';
    return badge.category === selectedFilter;
  });

  const handleShareBadge = (badge: any) => {
    setActiveShareBadge(badge);
    setCopied(false);
  };

  const copyShareLink = (badge: any) => {
    const text = `🏆 I unlocked the prestigious "${badge.name}" Master Badge on LeetMaster! (${badge.description}) Current Standing: ${calculatedXp} XP, Level ${currentLevel}. Join the cohort now!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Hexagon drawing function - exact replication of Kaggle hand-crafted double outlined badges
  const renderHexagonBadge = (color: string, unlocked: boolean, IconComponent: any) => {
    const strokeColor = color;
    const fillColor = unlocked ? `${color}22` : `${color}0e`;
    const borderClass = '';

    return (
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* SVG Hexagon Outline Canvas */}
        <svg 
          viewBox="0 0 100 100" 
          className={`absolute inset-0 w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${borderClass}`}
        >
          {/* Outer thick vertical hexagon path */}
          <polygon 
            points="50,4 90,27 90,73 50,96 10,73 10,27" 
            fill={fillColor} 
            stroke={strokeColor} 
            strokeWidth="3.2"
            strokeLinejoin="round"
            className="transition-all duration-300"
            opacity={unlocked ? 1 : 0.85}
          />
          {/* Inner offset path for high-fidelity hand-drawn double-outline effect */}
          <polygon 
            points="50,11 84,30.5 84,69.5 50,89 16,69.5 16,30.5" 
            fill="transparent" 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            strokeDasharray="2,3"
            strokeLinejoin="round"
            opacity={unlocked ? 0.8 : 0.65}
          />
          {/* Decorative precise circular anchor pins at vertices */}
          <circle cx="50" cy="4" r="2.2" fill={strokeColor} opacity={unlocked ? 1 : 0.85} />
          <circle cx="90" cy="27" r="2.2" fill={strokeColor} opacity={unlocked ? 1 : 0.85} />
          <circle cx="90" cy="73" r="2.2" fill={strokeColor} opacity={unlocked ? 1 : 0.85} />
          <circle cx="50" cy="96" r="2.2" fill={strokeColor} opacity={unlocked ? 1 : 0.85} />
          <circle cx="10" cy="73" r="2.2" fill={strokeColor} opacity={unlocked ? 1 : 0.85} />
          <circle cx="10" cy="27" r="2.2" fill={strokeColor} opacity={unlocked ? 1 : 0.85} />
        </svg>
        
        {/* Centered Icon inside the hexagon */}
        <div 
          className={`relative z-10 p-3 rounded-full transition-all duration-300 group-hover/badge:scale-110 flex items-center justify-center ${
            unlocked 
              ? 'scale-100' 
              : 'scale-95 opacity-85'
          }`}
          style={{ color }}
        >
          <IconComponent className="w-10 h-10 stroke-[1.65]" />
        </div>

        {/* Lock Overlay Badge */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100/5 dark:bg-stone-900/5 backdrop-blur-[0.2px] rounded-full">
            <div className="bg-white dark:bg-stone-900 p-1.5 rounded-full shadow-md border border-stone-150/50 dark:border-stone-850 scale-85 translate-y-9">
              <Lock className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500/15 border-t-[#ff6b2b] rounded-full animate-spin" />
        <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold font-mono tracking-wide">
          SYNCHRONIZING REWARDS LEDGER...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20 select-none max-w-7xl mx-auto px-1">
      
      {/* ================= HEADER HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[32px] p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ff6b2b]/5 to-transparent rounded-full pointer-events-none" />
        
        {/* Banner Details */}
        <div className="space-y-4 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6b2b]/10 text-[#ff6b2b] text-[10px] font-black uppercase tracking-widest font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>Kaggle-inspired Master Badges</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-stone-900 dark:text-white tracking-tight">
            Awards & Credentials
          </h2>
          <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl">
            Crush dsa problems, score high on CS quizzes, enroll in modules, author tech blogs, or register for hackathons to unlock prestigious, hexagon-framed master credentials with dynamic share layers.
          </p>
          
          {/* Level progress bar */}
          <div className="space-y-2 max-w-md pt-2">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span className="text-stone-400 dark:text-stone-500">LEVEL {currentLevel} PROGRESS</span>
              <span className="text-[#ff6b2b]">{calculatedXp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-3.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-200/40 dark:border-stone-800/60">
              <div 
                className="h-full bg-gradient-to-r from-[#ff804a] to-[#ff6b2b] rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-extrabold text-stone-400 font-mono">
              <span>{currentLevelBaseXp} XP</span>
              <span className="text-[#ff6b2b]">{levelProgress}% UNLOCKED</span>
              <span>{nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* Bento Stats Panel */}
        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-stone-100 dark:border-stone-800 pt-6 lg:pt-0 lg:pl-8">
          {/* Stats: XP */}
          <div className="bg-stone-50/50 dark:bg-stone-950/30 border border-stone-150/60 dark:border-stone-850 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-950/20 text-[#ff6b2b] rounded-xl shrink-0">
              <Zap className="w-5 h-5 fill-[#ff6b2b]/20" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider font-mono">Total Standing</div>
              <div className="text-xl font-black text-stone-900 dark:text-white font-mono">{calculatedXp}</div>
              <div className="text-[10px] text-[#ff6b2b] font-black">LEVEL {currentLevel}</div>
            </div>
          </div>

          {/* Stats: Unlocked */}
          <div className="bg-stone-50/50 dark:bg-stone-950/30 border border-stone-150/60 dark:border-stone-850 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl shrink-0">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider font-mono">Unlocked</div>
              <div className="text-xl font-black text-stone-900 dark:text-white font-mono">{unlockedCount} / {achievementsList.length}</div>
              <div className="text-[10px] text-emerald-500 font-black">
                {Math.round((unlockedCount / achievementsList.length) * 100)}% COMPLETE
              </div>
            </div>
          </div>

          {/* Stats: DSA solved */}
          <div className="bg-stone-50/50 dark:bg-stone-950/30 border border-stone-150/60 dark:border-stone-850 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-950/20 text-sky-500 rounded-xl shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider font-mono">DSA Solved</div>
              <div className="text-xl font-black text-stone-900 dark:text-white font-mono">{solvedCount}</div>
              <div className="text-[10px] text-sky-500 font-black">UNIQUE SOLUTIONS</div>
            </div>
          </div>

          {/* Stats: Quizzes completed */}
          <div className="bg-stone-50/50 dark:bg-stone-950/30 border border-stone-150/60 dark:border-stone-850 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-500 rounded-xl shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider font-mono">CS Assessments</div>
              <div className="text-xl font-black text-stone-900 dark:text-white font-mono">{quizCount}</div>
              <div className="text-[10px] text-yellow-500 font-black">COMPLETED</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRIMARY STATUS TABS ================= */}
      <div className="grid grid-cols-2 gap-4 border-b border-stone-100 dark:border-stone-850 pb-4">
        {/* Unlocked Tab */}
        <button
          type="button"
          onClick={() => {
            setStatusTab('Unlocked');
            setSelectedFilter('All');
          }}
          className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border text-sm font-black transition-all cursor-pointer focus:outline-none ${
            statusTab === 'Unlocked'
              ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-950/20 dark:to-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-sm scale-102 ring-2 ring-emerald-500/10'
              : 'bg-white dark:bg-stone-900 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
          }`}
        >
          <Unlock className={`w-5 h-5 ${statusTab === 'Unlocked' ? 'text-emerald-500 animate-pulse' : 'text-stone-400'}`} />
          <div className="text-left">
            <span className="block text-xs uppercase tracking-widest font-mono font-bold opacity-85">Unlocked Badges</span>
            <span className="text-lg font-black font-mono leading-none">{unlockedCount} <span className="text-xs font-semibold uppercase font-sans text-stone-400">Earned</span></span>
          </div>
        </button>

        {/* Locked Tab */}
        <button
          type="button"
          onClick={() => {
            setStatusTab('Locked');
            setSelectedFilter('All');
          }}
          className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border text-sm font-black transition-all cursor-pointer focus:outline-none ${
            statusTab === 'Locked'
              ? 'bg-gradient-to-r from-[#ff6b2b]/10 to-[#ff804a]/10 dark:from-[#ff6b2b]/15 dark:to-[#ff804a]/5 text-[#ff6b2b] border-[#ff6b2b]/30 shadow-sm scale-102 ring-2 ring-[#ff6b2b]/10'
              : 'bg-white dark:bg-stone-900 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
          }`}
        >
          <Lock className={`w-5 h-5 ${statusTab === 'Locked' ? 'text-[#ff6b2b]' : 'text-stone-400'}`} />
          <div className="text-left">
            <span className="block text-xs uppercase tracking-widest font-mono font-bold opacity-85">Locked Badges</span>
            <span className="text-lg font-black font-mono leading-none">{lockedCount} <span className="text-xs font-semibold uppercase font-sans text-stone-400">Locked</span></span>
          </div>
        </button>
      </div>

      {/* ================= FILTERS HORIZONTAL PANEL ================= */}
      <div className="flex overflow-x-auto no-scrollbar py-1 gap-2 border-b border-stone-200 dark:border-stone-850">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.name;
          return (
            <button
              key={filter.name}
              type="button"
              onClick={() => setSelectedFilter(filter.name)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 border relative flex items-center gap-2 cursor-pointer focus:outline-none ${
                isActive
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900 dark:border-white shadow-sm scale-102'
                  : 'bg-white dark:bg-stone-900 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <span>{filter.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                isActive
                  ? 'bg-stone-800 dark:bg-stone-100 text-stone-300 dark:text-stone-600'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
              }`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= BADGES INTERACTIVE GRID ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBadges.length === 0 ? (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-full py-20 text-center space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl"
            >
              <div className="w-16 h-16 bg-stone-50 dark:bg-stone-950/40 rounded-full flex items-center justify-center mx-auto border border-stone-100 dark:border-stone-800">
                <ShieldAlert className="w-7 h-7 text-stone-400 dark:text-stone-500" />
              </div>
              <h3 className="text-lg font-black text-stone-900 dark:text-white">No Matching Badges</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                We couldn't find any credentials matching your active search parameter. Change filters or complete courses, quizzes, and problem sets to earn awards!
              </p>
            </motion.div>
          ) : (
            filteredBadges.map((badge) => {
              const progressPercentage = Math.min(100, Math.round((badge.progressCurrent / badge.progressMax) * 100));
              
              return (
                <motion.div
                  layout
                  key={badge.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.02,
                    borderColor: badge.color,
                    boxShadow: `0 12px 30px -8px ${badge.color}25, 0 8px 16px -10px ${badge.color}20`
                  }}
                  transition={{ duration: 0.25 }}
                  className="group/badge bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] p-5 rounded-[24px] transition-all flex flex-col items-center justify-between min-h-[300px] relative overflow-hidden text-center border cursor-pointer"
                  style={{
                    borderColor: badge.unlocked ? `${badge.color}35` : `${badge.color}1c`,
                    boxShadow: badge.unlocked 
                      ? `0 6px 16px -4px ${badge.color}15, 0 4px 8px -5px ${badge.color}10` 
                      : `0 4px 12px -5px rgba(0,0,0,0.02)`
                  }}
                  onClick={() => badge.unlocked && handleShareBadge(badge)}
                >
                  {/* Inner Subtle Grid Pattern Overlay mirroring DSA Sheets */}
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Hexagon Shape Container */}
                  <div className="w-full relative py-2 z-10">
                    {renderHexagonBadge(badge.color, badge.unlocked, badge.icon)}
                  </div>

                  {/* Ribbon Status Pill */}
                  <div className="mt-1 relative z-10 flex flex-col items-center space-y-1">
                    <div 
                      className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
                      style={{
                        borderColor: badge.unlocked ? `${badge.color}30` : `${badge.color}1a`,
                        backgroundColor: badge.unlocked ? `${badge.color}08` : 'transparent',
                        color: badge.color
                      }}
                    >
                      {badge.unlocked ? (
                        <span>{badge.ribbonText}</span>
                      ) : (
                        <span className="flex items-center gap-1 opacity-85">
                          <Lock className="w-2 h-2" /> LOCKED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badge Text details */}
                  <div className="space-y-1.5 w-full mt-3 relative z-10">
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white leading-tight group-hover/badge:text-stone-950 dark:group-hover/badge:text-stone-100">
                      {badge.name}
                    </h4>
                    <p 
                      className="text-[9px] font-black tracking-widest uppercase"
                      style={{ color: badge.color }}
                    >
                      {badge.category}
                    </p>
                    <p className="text-[11.5px] text-stone-500 dark:text-stone-400 leading-normal line-clamp-2 px-1">
                      {badge.unlocked ? badge.description : badge.requirement}
                    </p>
                  </div>

                  {/* Dynamic Progress Indicator */}
                  <div className="w-full pt-4 mt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-col space-y-1 relative z-10">
                    <div className="flex justify-between items-center text-[10px] font-extrabold font-mono text-stone-400">
                      <span>PROGRESS</span>
                      <span style={{ color: badge.progressCurrent > 0 ? badge.color : undefined }}>
                        {badge.progressCurrent} / {badge.progressMax}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#ebd9bc]/30 dark:bg-stone-800/60 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${progressPercentage}%`,
                          backgroundColor: badge.color,
                          opacity: badge.unlocked ? 1 : 0.6
                        }}
                      />
                    </div>
                    {badge.unlocked && (
                      <div 
                        className="text-[9px] font-black tracking-wide mt-1 uppercase flex items-center justify-center gap-1"
                        style={{ color: badge.color }}
                      >
                        <CheckCircle2 className="w-3 h-3 inline" /> Click to Share
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ================= SOCIAL SHARE POPUP / MODAL ================= */}
      <AnimatePresence>
        {activeShareBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
              onClick={() => setActiveShareBadge(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md p-6 relative z-10 shadow-xl space-y-6 text-center overflow-hidden"
            >
              {/* Top Banner decoration */}
              <div 
                className="absolute top-0 inset-x-0 h-1.5" 
                style={{ backgroundColor: activeShareBadge.color }}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveShareBadge(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4 pt-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED CREDENTIAL
                </div>

                {/* Badge SVG representation in full scale */}
                <div className="py-2">
                  {renderHexagonBadge(activeShareBadge.color, true, activeShareBadge.icon)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-stone-900 dark:text-white">
                    {activeShareBadge.name}
                  </h3>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                    {activeShareBadge.category} AWARD
                  </p>
                </div>

                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed px-4">
                  {activeShareBadge.description}
                </p>

                <div className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-850 rounded-2xl flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 text-left">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-stone-400 block font-bold font-mono">EARNED REWARD</span>
                    <span className="text-stone-800 dark:text-stone-200 font-extrabold">{activeShareBadge.reward} Credentials XP</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-black font-mono">
                    VALIDATED
                  </div>
                </div>
              </div>

              {/* Share Channels */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-black text-stone-400 tracking-wider uppercase">
                  SHARE CREDENTIALS TO NETWORKS
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* LinkedIn Mock */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                    <span>LinkedIn</span>
                  </a>
                  
                  {/* Twitter Mock */}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-[#1da1f2]" />
                    <span>Twitter</span>
                  </a>
                </div>

                {/* Copy Text snippet */}
                <button
                  type="button"
                  onClick={() => copyShareLink(activeShareBadge)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-850 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer focus:outline-none"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>COPIED SNIPPET!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY SHARING SNIPPET</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
