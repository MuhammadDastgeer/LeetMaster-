import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CommunityConsistency from './components/CommunityConsistency';
import AssignmentEvaluation from './components/AssignmentEvaluation';
import CommunityDiscuss from './components/CommunityDiscuss';
import DsaSheets from './components/DsaSheets';
import MobileContests from './components/MobileContests';
import HackathonsAI from './components/HackathonsAI';
import Dashboard from './components/Dashboard';
import CuratedSheetsLanding from './components/CuratedSheetsLanding';
import { getPresetQuizzes } from './data/quizDatabase';
import { 
  Code2, Flame, Heart, Github, Linkedin, ArrowUp, BookOpen, 
  Check, CheckCircle2, AlertCircle, Award, Sparkles, 
  ChevronRight, Users, GraduationCap, Code, Star, Trophy
} from 'lucide-react';

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Simple state to store enrolled course IDs
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  
  // Quiz interaction state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // 100 achievements progress counts state
  const [solvedCount, setSolvedCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [highScoreQuizCount, setHighScoreQuizCount] = useState(0);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [userBlogsCount, setUserBlogsCount] = useState(0);
  const [userHackathonsCount, setUserHackathonsCount] = useState(0);

  // Function to initialize/sync counts from APIs and localStorage
  const initializeCounts = async () => {
    try {
      // 1. Fetch DSA submissions
      try {
        const dsaRes = await fetch('/api/dsa/submissions');
        if (dsaRes.ok) {
          const dsaData = await dsaRes.json();
          if (dsaData && dsaData.success && Array.isArray(dsaData.submissions)) {
            const uniqueSolved = new Set(
              dsaData.submissions
                .filter((s: any) => s && s.status === 'Accepted' && s.problemId)
                .map((s: any) => s.problemId)
            );
            setSolvedCount(uniqueSolved.size);
          }
        }
      } catch (e) {
        console.error('Error fetching DSA submissions for counts:', e);
      }

      // 2. Fetch Blogs
      try {
        const blogsRes = await fetch('/api/blogs');
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          if (blogsData && blogsData.success && Array.isArray(blogsData.blogs)) {
            const myBlogs = blogsData.blogs.filter((b: any) => b && b.isUserBlog).length;
            setUserBlogsCount(myBlogs);
          }
        }
      } catch (e) {
        console.error('Error fetching blogs for counts:', e);
      }

      // 3. Fetch Hackathons
      try {
        const hackathonsRes = await fetch('/api/hackathons');
        if (hackathonsRes.ok) {
          const hackathonsData = await hackathonsRes.json();
          if (hackathonsData && hackathonsData.success && Array.isArray(hackathonsData.hackathons)) {
            const myHacks = hackathonsData.hackathons.filter((h: any) => h && h.isUserHackathon).length;
            setUserHackathonsCount(myHacks);
          }
        }
      } catch (e) {
        console.error('Error fetching hackathons for counts:', e);
      }

      // 4. Load Quizzes from localStorage
      const quizScoresRaw = localStorage.getItem('leetmaster_quiz_completed_scores');
      if (quizScoresRaw) {
        try {
          const parsed = JSON.parse(quizScoresRaw);
          if (Array.isArray(parsed)) {
            setQuizCount(parsed.length);
            const highCount = parsed.filter((q: any) => {
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
            setHighScoreQuizCount(highCount);
          } else if (parsed && typeof parsed === 'object') {
            const keys = Object.keys(parsed);
            setQuizCount(keys.length);
            const presetQuizzes = getPresetQuizzes();
            const highCount = Object.entries(parsed).filter(([id, score]) => {
              const num = parseFloat(score as any);
              const q = presetQuizzes.find((pq: any) => pq.id === id);
              const totalQuestions = q ? q.questions.length : 15;
              if (!isNaN(num)) {
                // If the score is a direct correctCount (which is small), check if ratio is >= 80%
                if (num <= totalQuestions) {
                  return (num / totalQuestions) >= 0.8;
                }
                return num >= 80;
              }
              return false;
            }).length;
            setHighScoreQuizCount(highCount);
          }
        } catch (e) {
          console.error('Error parsing quiz scores for counts:', e);
        }
      }

      // 5. Load Courses from localStorage
      const coursesRaw = localStorage.getItem('sab_tech_courses_state_v3') || localStorage.getItem('leetmaster_courses_state');
      if (coursesRaw) {
        try {
          const parsed = JSON.parse(coursesRaw);
          if (Array.isArray(parsed)) {
            const enrolled = parsed.filter((c: any) => c && c.enrolled).length;
            setEnrolledCount(enrolled);
            let lessonCount = 0;
            parsed.forEach((c: any) => {
              if (c && Array.isArray(c.modules)) {
                c.modules.forEach((m: any) => {
                  if (m && Array.isArray(m.lessons)) {
                    lessonCount += m.lessons.filter((l: any) => l && l.completed).length;
                  }
                });
              }
            });
            setCompletedLessonsCount(lessonCount);
          }
        } catch (e) {
          console.error('Error parsing courses state for counts:', e);
        }
      }
    } catch (err) {
      console.error('Error initializing counts:', err);
    }
  };

  // Sync state on path or tab change and on mount
  useEffect(() => {
    initializeCounts();
  }, [currentPath]);

  useEffect(() => {
    // Scroll behavior
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Sync effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Routing synchronization
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure landing page or other pages (excluding hackathons anchor) scroll to top on path change or mount
  useEffect(() => {
    if (currentPath !== '/hackathons') {
      window.scrollTo(0, 0);
    }
  }, [currentPath]);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);

    // Dynamic scroll routing for on-page sections
    if (path === '/hackathons') {
      document.getElementById('hackathons')?.scrollIntoView({ behavior: 'smooth' });
    } else if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock Premium Courses
  const premiumCourses = [
    {
      id: 'dsa-pro',
      title: 'LeetMaster DSA Pro Blueprint',
      duration: '12 Weeks',
      chapters: '32 Chapters',
      syllabus: [
        'Module 1: Time and Space Complexities & Master Theorem',
        'Module 2: Advanced Dynamic Programming & Subproblem Optimization',
        'Module 3: Graph Algorithms, Tarjan\'s, Segment Trees',
        'Module 4: System Design Integration of Distributed Structures'
      ],
      desc: 'The complete mathematical and algorithmic blueprint designed for cracking Tier-1 technical interviews.',
      rating: '4.9',
      level: 'Advanced'
    },
    {
      id: 'fullstack-eng',
      title: 'Fullstack Web Architecture Blueprint',
      duration: '16 Weeks',
      chapters: '48 Chapters',
      syllabus: [
        'Module 1: High-Performance Node.js Clusters & Event Loop Tuning',
        'Module 2: Advanced React 19 concurrent features & server components',
        'Module 3: Relational DBs (Postgres, Sharding) vs Key-Value caches (Redis)',
        'Module 4: CI/CD Pipelines, Docker containerization, & Kubernetes clusters'
      ],
      desc: 'Master the entire development and deployment lifecycle. Go from building scripts to hosting scalable apps.',
      rating: '4.8',
      level: 'Intermediate - Advanced'
    },
    {
      id: 'sys-design',
      title: 'Distributed System Design Masterclass',
      duration: '8 Weeks',
      chapters: '20 Chapters',
      syllabus: [
        'Module 1: Load Balancers, Reverse Proxies, and API Gateways',
        'Module 2: Message Queues, Kafka pipelines, and Async Event loops',
        'Module 3: Consistency Models, CAP Theorem, and Distributed Consensus',
        'Module 4: Caching layers, CDNs, and Horizontal auto-scalability'
      ],
      desc: 'Learn how to architect, partition, and maintain services serving hundreds of millions of users.',
      rating: '5.0',
      level: 'Advanced'
    }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which data structure operates on a Last-In-First-Out (LIFO) basis?',
      options: ['Queue', 'Stack', 'Heap', 'Binary Search Tree'],
      correct: 1
    },
    {
      id: 2,
      q: 'What is the average time complexity of lookup/search in a balanced Binary Search Tree (BST)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 1
    },
    {
      id: 3,
      q: 'Which technique is used to solve overlapping subproblems by storing calculated results?',
      options: ['Greedy Approach', 'Backtracking', 'Dynamic Programming (Memoization)', 'Divide and Conquer'],
      correct: 2
    }
  ];

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    // Save this completion to localStorage!
    try {
      const saved = localStorage.getItem('leetmaster_quiz_completed_scores');
      let scoresObj: Record<string, number> = {};
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            scoresObj = parsed;
          }
        } catch (e) {}
      }
      scoresObj['weekly_challenge_scholar'] = score;
      localStorage.setItem('leetmaster_quiz_completed_scores', JSON.stringify(scoresObj));
      
      // Sync Achievements XP
      const savedXp = localStorage.getItem('leetmaster_user_xp');
      const currentXp = savedXp ? parseInt(savedXp, 10) : 450;
      localStorage.setItem('leetmaster_user_xp', (currentXp + score * 10).toString());
    } catch (e) {
      console.error('Error saving weekly quiz score to localStorage:', e);
    }

    // Force refresh the counts
    initializeCounts();
  };

  const handleEnroll = (courseId: string) => {
    if (enrolledCourses.includes(courseId)) return;
    setEnrolledCourses(prev => [...prev, courseId]);

    // Sync with leetmaster_courses_state
    try {
      const saved = localStorage.getItem('leetmaster_courses_state');
      let coursesList: any[] = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            coursesList = parsed;
          }
        } catch (e) {}
      }

      const idMap: Record<string, string> = {
        'dsa-pro': 'dsa-cpp',
        'fullstack-eng': 'web-react-next',
        'sys-design': 'sys-design-hld'
      };

      const targetId = idMap[courseId] || courseId;

      if (coursesList.length === 0) {
        const defaultCourseIds = ['dsa-cpp', 'sys-design-hld', 'web-react-next', 'faang-interview-bootcamp'];
        coursesList = defaultCourseIds.map(id => ({
          id,
          enrolled: id === targetId,
          progress: id === targetId ? 10 : 0, // start with some progress
          modules: []
        }));
      } else {
        coursesList = coursesList.map(c => {
          if (c.id === targetId) {
            return { ...c, enrolled: true, progress: Math.max(c.progress || 0, 10) };
          }
          return c;
        });
      }
      localStorage.setItem('leetmaster_courses_state', JSON.stringify(coursesList));
    } catch (e) {
      console.error('Error saving course enrollment to localStorage:', e);
    }

    // Force refresh the counts
    initializeCounts();
  };

  const handleHackathonGradingComplete = async (name: string, track: string, repo: string) => {
    try {
      const res = await fetch('/api/hackathons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${name} Hackathon Build`,
          description: `AI Graded Project: ${name} in the ${track} track. Repository: ${repo}`,
          tags: `${track}, AI Graded`,
          prizes: "$5,000 Scholar Credits",
          deadline: "Completed",
          status: "public",
          author: 'Dastgeer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop'
        })
      });
      const data = await res.json();
      if (data.success) {
        console.log('Successfully recorded AI graded hackathon completion!');
      }
    } catch (e) {
      console.error('Error logging hackathon completion:', e);
    }
    // Refresh our counts
    initializeCounts();
  };

  const isDashboardPath = [
    '/dashboard', '/desboard', 
    '/townhall', '/town-hall', '/town-halls',
    '/discuss',
    '/blogs', '/blog',
    '/projects', '/project',
    '/peerreviews', '/peer-reviews',
    '/events', '/event',
    '/hackathons-dashboard',
    '/my-hackathons', '/myhackathons',
    '/dsa-problems', '/dsaproblems',
    '/dsa-sheets', '/dsasheets',
    '/profile', '/professional-profile',
    '/report-card', '/reportcard',
    '/quiz-tab', '/courses', '/achievements'
  ].includes(currentPath);

  if (isDashboardPath) {
    return (
      <Dashboard 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onNavigate={navigateTo}
        onBackToHome={() => navigateTo('/')}
        currentPath={currentPath}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111111] dark:bg-zinc-950 dark:text-zinc-100 antialiased selection:bg-[#ff6b2b] selection:text-white transition-colors">
      {/* Navbar Header */}
      <Navbar 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        currentPath={currentPath}
        onNavigate={navigateTo}
      />

      <main className="relative">
        
        {/* Render main single view by default */}
        <div>
          {/* Hero Section */}
          <Hero onNavigate={navigateTo} />

          {/* Community & Consistency Section */}
          <CommunityConsistency />

          {/* Assignment Evaluation Section */}
          <AssignmentEvaluation />

          {/* Community Discuss Section */}
          <CommunityDiscuss onNavigate={navigateTo} />

          {/* DSA Sheet Code Editor Section */}
          <CuratedSheetsLanding onNavigate={navigateTo} />

          {/* Mobile Mockup Contests Section */}
          <MobileContests />

          {/* Hackathon AI Grading Section */}
          <div id="hackathons">
            <HackathonsAI onGradingComplete={handleHackathonGradingComplete} />
          </div>
        </div>

        {/* ======================================================= */}
        {/* POPUP / FULLSCREEN PREMIUM PATH OVERLAYS WITH STATE ACTIONS */}
        {/* ======================================================= */}
        <AnimatePresence>
          
          {/* 1. QUIZ CHALLENGE PATH ROUTE OVERLAY (/quiz) */}
          {currentPath === '/quiz' && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] relative"
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ff6b2b] flex items-center justify-center text-white">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-sans font-black text-black dark:text-white">Weekly Scholar Challenge</h3>
                      <p className="text-xs text-gray-400 font-mono">Solve and claim rewards</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      navigateTo('/');
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors font-bold cursor-pointer text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <span className="text-sm font-black uppercase">Close (X)</span>
                  </button>
                </div>

                {!quizSubmitted ? (
                  <div className="space-y-6">
                    {quizQuestions.map((question, qIdx) => (
                      <div key={question.id} className="bg-[#fcfbf9] dark:bg-zinc-950 p-4 border border-black/10 dark:border-zinc-800 rounded-2xl">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#ff6b2b]">Question {qIdx + 1}</span>
                        <h4 className="text-sm font-bold text-black dark:text-white mt-1 mb-3">{question.q}</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {question.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[question.id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectAnswer(question.id, oIdx)}
                                className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#ff6b2b] text-white border-black' 
                                    : 'bg-white dark:bg-zinc-900 border-black/10 hover:bg-slate-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                        className="w-full bg-black dark:bg-zinc-800 text-white hover:bg-[#ff6b2b] dark:hover:bg-orange-600 font-bold text-sm py-3.5 rounded-full shadow transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-black"
                      >
                        Submit Challenge Answers
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/20 rounded-full flex items-center justify-center text-[#ff6b2b] mx-auto">
                      <Award className="w-8 h-8" />
                    </div>

                    <div>
                      <h4 className="text-2xl font-sans font-black text-black dark:text-white">Challenge Complete!</h4>
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        You scored <span className="font-bold text-[#ff6b2b]">{quizScore} / {quizQuestions.length}</span> correct answers.
                      </p>
                    </div>

                    <div className="bg-[#fcfbf9] dark:bg-zinc-950 border border-black/10 dark:border-zinc-800 rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-around">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-black">Points Gained</div>
                        <div className="text-lg font-extrabold text-green-600">+{quizScore * 10} XP</div>
                      </div>
                      <div className="w-[1px] h-8 bg-gray-200 dark:bg-zinc-800" />
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-black">Streak Counter</div>
                        <div className="text-lg font-extrabold text-black dark:text-white">128 Days</div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswers({});
                        }}
                        className="flex-1 bg-[#f2efe9] dark:bg-zinc-800 text-black dark:text-white hover:bg-black hover:text-white font-bold text-xs py-3 rounded-full transition-all cursor-pointer"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => navigateTo('/')}
                        className="flex-1 bg-[#ff6b2b] text-white hover:bg-[#e05316] font-bold text-xs py-3 rounded-full transition-all cursor-pointer"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* 2. COURSES ACADEMY PATH ROUTE OVERLAY (/courses) */}
          {currentPath === '/courses' && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] relative"
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ff6b2b] flex items-center justify-center text-white">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xl font-sans font-black text-black dark:text-white">LeetMaster Cohort Academy</h3>
                      <p className="text-xs text-gray-400 font-mono">Premium Structured Learning Curriculum</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigateTo('/')}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors font-bold cursor-pointer text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <span className="text-sm font-black uppercase">Close (X)</span>
                  </button>
                </div>

                <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2">
                  {premiumCourses.map((course) => {
                    const isEnrolled = enrolledCourses.includes(course.id);
                    return (
                      <div key={course.id} className="bg-[#fcfbf9] dark:bg-zinc-950 p-5 border border-black/10 dark:border-zinc-800 rounded-2xl flex flex-col gap-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#ff6b2b] bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded">
                              {course.level}
                            </span>
                            <h4 className="text-base font-extrabold text-black dark:text-white mt-1.5">{course.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{course.desc}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-amber-500 font-mono">★ {course.rating} Rating</span>
                            <div className="text-[10px] text-gray-400 mt-1">{course.duration} · {course.chapters}</div>
                          </div>
                        </div>

                        {/* Curriculum breakdown preview */}
                        <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-zinc-800/60 rounded-xl p-3">
                          <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider">Curriculum Preview</span>
                          <ul className="mt-2 space-y-1.5">
                            {course.syllabus.map((syll, sIdx) => (
                              <li key={sIdx} className="text-[11px] font-medium text-gray-600 dark:text-zinc-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#ff6b2b] rounded-full flex-shrink-0" />
                                <span>{syll}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action and feedback */}
                        <div className="flex items-center justify-between gap-4 pt-2">
                          <div className="text-xs text-[#ff6b2b] font-mono font-bold">
                            {isEnrolled ? (
                              <span className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled Student
                              </span>
                            ) : (
                              <span>Structured Self-Paced Access</span>
                            )}
                          </div>

                          <button
                            onClick={() => handleEnroll(course.id)}
                            disabled={isEnrolled}
                            className={`px-6 py-2.5 rounded-full font-bold text-xs transition-all shadow cursor-pointer ${
                              isEnrolled 
                                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 border border-transparent cursor-not-allowed shadow-none' 
                                : 'bg-black dark:bg-zinc-800 text-white hover:bg-[#ff6b2b] dark:hover:bg-orange-600'
                            }`}
                          >
                            {isEnrolled ? 'Successfully Enrolled' : 'Enroll Now'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* 3. STORIES TESTIMONIALS PATH ROUTE OVERLAY (/stories) */}
          {currentPath === '/stories' && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] relative"
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ff6b2b] flex items-center justify-center text-white">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <h3 className="text-xl font-sans font-black text-black dark:text-white">Elite Career Breakthroughs</h3>
                      <p className="text-xs text-gray-400 font-mono">Sourced from real peer community reviews</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigateTo('/')}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors font-bold cursor-pointer text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    <span className="text-sm font-black uppercase">Close (X)</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                  {[
                    {
                      name: 'Rohan Sharma',
                      role: 'Software Development Engineer II',
                      company: 'Razorpay',
                      text: 'LeetMaster cohorts are hands-down the best peer learning groups. Solving the DSA sheets together and getting peer reviews in voice spaces completely reshaped how I structure algorithms. Secured SDE-2 within months!',
                      avatar: 'RS',
                      label: 'Tier 1 Upgrade'
                    },
                    {
                      name: 'Kavya Nair',
                      role: 'Platform Engineer',
                      company: 'Swiggy',
                      text: 'The code execution engine, daily streaks tracker, and continuous feedback loop from fellow scholars pushed me beyond my limits. I wasn\'t coding alone, which was a huge psychological shift.',
                      avatar: 'KN',
                      label: 'System Specialist'
                    },
                    {
                      name: 'Amanpreet Singh',
                      role: 'Backend Architect',
                      company: 'Stripe',
                      text: 'The backend sharding and dynamic programming problems inside LeetMaster sheets perfectly matched actual system design rounds. A phenomenal platform that makes learning addictive.',
                      avatar: 'AS',
                      label: 'Stripe Architect'
                    }
                  ].map((story, idx) => (
                    <div key={idx} className="bg-[#fcfbf9] dark:bg-zinc-950 p-4 border border-black/10 dark:border-zinc-800 rounded-2xl">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black border border-black/10 dark:border-zinc-700 text-black dark:text-white">
                            {story.avatar}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-black dark:text-white leading-none">{story.name}</h4>
                            <p className="text-[10px] text-gray-400 leading-none mt-1">{story.role} at <span className="font-bold text-gray-600 dark:text-zinc-300">{story.company}</span></p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 rounded border border-orange-100 dark:border-orange-900/30">
                          {story.label}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-600 dark:text-zinc-300 leading-relaxed font-sans italic">
                        "{story.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

        </AnimatePresence>

      </main>

      {/* Footer block */}
      <footer className="bg-black text-white py-16 border-t-4 border-[#ff6b2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#ff6b2b] flex items-center justify-center text-white relative overflow-hidden">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-sans font-extrabold text-lg tracking-tight text-white">
                  leetmaster<span className="text-[#ff6b2b]">.</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                The peer-powered coding network. Level up your fullstack programming skills, solve curated interview sheets, and connect directly with fellow elite developers.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => navigateTo('/dsa-sheets')} className="hover:text-[#ff6b2b] transition-colors cursor-pointer text-left focus:outline-none">
                    DSA Sheets
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/hackathons-dashboard')} className="hover:text-[#ff6b2b] transition-colors cursor-pointer text-left focus:outline-none">
                    Hackathons
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/quiz-tab')} className="hover:text-[#ff6b2b] transition-colors cursor-pointer text-left focus:outline-none">
                    Weekly Quizzes
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('/discuss')} className="hover:text-[#ff6b2b] transition-colors cursor-pointer text-left focus:outline-none">
                    Discuss Board
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact/Socials */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4">Connect</h4>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-neutral-900 hover:bg-[#ff6b2b] rounded-lg transition-colors cursor-pointer" title="GitHub">
                  <Github className="w-5 h-5" />
                </button>
                <button className="p-2 bg-neutral-900 hover:bg-[#ff6b2b] rounded-lg transition-colors cursor-pointer" title="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-400 font-mono">
                Email: support@leetmaster.co
              </div>
            </div>

          </div>

          {/* Bottom Copyright info */}
          <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p className="flex items-center gap-1 font-mono">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>for coding enthusiasts.</span>
            </p>
            <p>&copy; {new Date().getFullYear()} LeetMaster. All rights reserved.</p>
          </div>

        </div>
      </footer>

      {/* Floating Scroll to top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-black hover:bg-[#ff6b2b] text-white rounded-full shadow-lg transition-all z-40 active:scale-95 cursor-pointer border border-white/10"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
