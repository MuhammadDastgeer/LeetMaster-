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
  const calculatedXp = 100 // baseline XP
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
  const currentLevel = Math.floor(calculatedXp / 150) + 1;
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

  // Achievements Definition List
  const achievementsList = [
    {
      id: 'dsa-novice',
      name: 'DSA Champion',
      category: 'Algorithms',
      description: 'Solved your very first algorithmic DSA challenge.',
      requirement: 'Submit and get 1 or more Accepted solutions in the DSA track.',
      reward: '+150 XP',
      unlocked: solvedCount >= 1,
      progressMax: 1,
      progressCurrent: solvedCount,
      icon: Trophy,
      color: '#22c55e', // Emerald Green
      ribbonText: 'CHAMPION'
    },
    {
      id: 'dsa-challenger',
      name: 'DSA Challenger',
      category: 'Algorithms',
      description: 'Demonstrated deep growth in complex algorithms & data structures.',
      requirement: 'Solve 3 or more unique DSA Problems with Accepted status.',
      reward: '+300 XP',
      unlocked: solvedCount >= 3,
      progressMax: 3,
      progressCurrent: solvedCount,
      icon: Flame,
      color: '#10b981', // Emerald Medium
      ribbonText: 'CHALLENGER'
    },
    {
      id: 'dsa-grandmaster',
      name: 'DSA Contender',
      category: 'Algorithms',
      description: 'Master of trees, arrays, dynamic programs, and graph systems.',
      requirement: 'Solve 5 or more unique DSA Problems with Accepted status.',
      reward: '+500 XP',
      unlocked: solvedCount >= 5,
      progressMax: 5,
      progressCurrent: solvedCount,
      icon: Target,
      color: '#047857', // Dark Green
      ribbonText: 'CONTENDER'
    },
    {
      id: 'quiz-initiate',
      name: 'Quiz Mastermind',
      category: 'Quizzes',
      description: 'Completed your first conceptual technology assessment.',
      requirement: 'Attempt and complete at least 1 assessment in the Quiz section.',
      reward: '+100 XP',
      unlocked: quizCount >= 1,
      progressMax: 1,
      progressCurrent: quizCount,
      icon: Brain,
      color: '#eab308', // Gold
      ribbonText: 'INITIATE'
    },
    {
      id: 'quiz-distinguished',
      name: 'Distinguished Scholar',
      category: 'Quizzes',
      description: 'Achieved academic distinction with extreme conceptual accuracy.',
      requirement: 'Obtain a high score of 80% or more on any Quiz assessment.',
      reward: '+300 XP',
      unlocked: hasHighScoreQuiz,
      progressMax: 1,
      progressCurrent: hasHighScoreQuiz ? 1 : 0,
      icon: Star,
      color: '#ca8a04', // Deep Gold
      ribbonText: 'DISTINGUISHED'
    },
    {
      id: 'quiz-conqueror',
      name: 'Quiz Conqueror',
      category: 'Quizzes',
      description: 'Crushed multiple computer science assessment exams.',
      requirement: 'Attempt and complete at least 3 technology quizzes in Quiz tab.',
      reward: '+250 XP',
      unlocked: quizCount >= 3,
      progressMax: 3,
      progressCurrent: quizCount,
      icon: Award,
      color: '#a16207', // Dark Gold
      ribbonText: 'CONQUEROR'
    },
    {
      id: 'course-enroller',
      name: 'Active Learner',
      category: 'Courses',
      description: 'Enrolled in an structured educational path on LeetMaster.',
      requirement: 'Enroll in at least 1 course inside the Courses tab.',
      reward: '+100 XP',
      unlocked: enrolledCount >= 1,
      progressMax: 1,
      progressCurrent: enrolledCount,
      icon: BookOpen,
      color: '#8b5cf6', // Violet
      ribbonText: 'ENROLLER'
    },
    {
      id: 'course-lessons',
      name: 'Knowledge Seeker',
      category: 'Courses',
      description: 'Engaged in continuous learning across core lessons.',
      requirement: 'Complete 3 or more lessons inside your enrolled courses.',
      reward: '+200 XP',
      unlocked: completedLessonsCount >= 3,
      progressMax: 3,
      progressCurrent: completedLessonsCount,
      icon: PlayCircle,
      color: '#7c3aed', // Purple
      ribbonText: 'SEEKER'
    },
    {
      id: 'course-graduate',
      name: 'Course Graduate',
      category: 'Courses',
      description: 'Completed a comprehensive specialized developer track.',
      requirement: 'Reach 100% progress on any enrolled LeetMaster course.',
      reward: '+500 XP',
      unlocked: hasGraduate,
      progressMax: 1,
      progressCurrent: hasGraduate ? 1 : 0,
      icon: GraduationCap,
      color: '#6d28d9', // Deep Purple
      ribbonText: 'GRADUATE'
    },
    {
      id: 'profile-starter',
      name: 'Profile Starter',
      category: 'Profile',
      description: 'Crafted a beautiful developer bio and presentation greeting.',
      requirement: 'Add your Full Name and Biography inside your Professional Profile.',
      reward: '+100 XP',
      unlocked: hasProfileText,
      progressMax: 1,
      progressCurrent: hasProfileText ? 1 : 0,
      icon: User,
      color: '#0ea5e9', // Sky Blue
      ribbonText: 'PROFILE STARTER'
    },
    {
      id: 'profile-github',
      name: 'Octocat Contributor',
      category: 'Profile',
      description: 'Linked your GitHub repository portfolio with LeetMaster.',
      requirement: 'Connect your personal GitHub URL in Professional Profile.',
      reward: '+150 XP',
      unlocked: hasGithub,
      progressMax: 1,
      progressCurrent: hasGithub ? 1 : 0,
      icon: Github,
      color: '#0284c7', // Sky Dark Blue
      ribbonText: 'OCTOCAT NATIVE'
    },
    {
      id: 'profile-experience',
      name: 'Industry Pioneer',
      category: 'Profile',
      description: 'Showcasing real-world industrial software experience.',
      requirement: 'Add 1 or more Experience items under Professional Profile.',
      reward: '+250 XP',
      unlocked: profile.experienceCount >= 1,
      progressMax: 1,
      progressCurrent: profile.experienceCount,
      icon: Briefcase,
      color: '#0369a1', // Deep Blue
      ribbonText: 'BUILDER'
    },
    {
      id: 'profile-certs',
      name: 'Certified Authority',
      category: 'Profile',
      description: 'Possesses verified credentials from cloud and technology leaders.',
      requirement: 'Add at least 1 Certification inside Professional Profile.',
      reward: '+200 XP',
      unlocked: profile.certificationsCount >= 1,
      progressMax: 1,
      progressCurrent: profile.certificationsCount,
      icon: Award,
      color: '#0284c7', // Sky Blue
      ribbonText: 'CERTIFIED'
    },
    {
      id: 'creative-blogs',
      name: 'Tech Journalist',
      category: 'Blogs',
      description: 'Shared technical perspectives with the developer cohort.',
      requirement: 'Publish at least 1 custom blog article inside the Blogs tab.',
      reward: '+300 XP',
      unlocked: userBlogsCount >= 1,
      progressMax: 1,
      progressCurrent: userBlogsCount,
      icon: Code,
      color: '#ec4899', // Pink
      ribbonText: 'JOURNALIST'
    },
    {
      id: 'creative-hackathons',
      name: 'Hackathon Gladiator',
      category: 'Hackathons',
      description: 'Building innovative collaborative hack solutions.',
      requirement: 'Create or join a custom Hackathon inside the Hackathons tab.',
      reward: '+400 XP',
      unlocked: userHackathonsCount >= 1,
      progressMax: 1,
      progressCurrent: userHackathonsCount,
      icon: FolderGit,
      color: '#f43f5e', // Rose
      ribbonText: 'GLADIATOR'
    },
    {
      id: 'milestone-legendary',
      name: 'Grandmaster Champion',
      category: 'Milestones',
      description: 'Reached the peak level of technical excellence and study.',
      requirement: 'Accumulate a total of 500 XP or more in LeetMaster.',
      reward: '+500 XP',
      unlocked: calculatedXp >= 500,
      progressMax: 500,
      progressCurrent: calculatedXp,
      icon: Sparkles,
      color: '#f97316', // Orange
      ribbonText: 'LEGENDARY'
    }
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
    const strokeColor = unlocked ? color : 'currentColor';
    const fillColor = unlocked ? `${color}12` : 'transparent';
    const borderClass = unlocked ? '' : 'text-stone-300 dark:text-stone-700';

    return (
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* SVG Hexagon Outline Canvas */}
        <svg 
          viewBox="0 0 100 100" 
          className={`absolute inset-0 w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] ${borderClass}`}
          style={{ color: unlocked ? undefined : '#cbd5e1' }}
        >
          {/* Outer thick vertical hexagon path */}
          <polygon 
            points="50,4 90,27 90,73 50,96 10,73 10,27" 
            fill={fillColor} 
            stroke={strokeColor} 
            strokeWidth="3.2"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
          {/* Inner offset path for high-fidelity hand-drawn double-outline effect */}
          <polygon 
            points="50,11 84,30.5 84,69.5 50,89 16,69.5 16,30.5" 
            fill="transparent" 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            strokeDasharray="2,3"
            strokeLinejoin="round"
            opacity="0.8"
          />
          {/* Decorative precise circular anchor pins at vertices */}
          <circle cx="50" cy="4" r="2.2" fill={strokeColor} />
          <circle cx="90" cy="27" r="2.2" fill={strokeColor} />
          <circle cx="90" cy="73" r="2.2" fill={strokeColor} />
          <circle cx="50" cy="96" r="2.2" fill={strokeColor} />
          <circle cx="10" cy="73" r="2.2" fill={strokeColor} />
          <circle cx="10" cy="27" r="2.2" fill={strokeColor} />
        </svg>
        
        {/* Centered Icon inside the hexagon */}
        <div 
          className={`relative z-10 p-3 rounded-full transition-all duration-300 group-hover/badge:scale-110 flex items-center justify-center ${
            unlocked 
              ? 'scale-100' 
              : 'scale-95 grayscale opacity-35'
          }`}
          style={{ color: unlocked ? color : undefined }}
        >
          <IconComponent className="w-10 h-10 stroke-[1.65]" />
        </div>

        {/* Lock Overlay Badge */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100/10 dark:bg-stone-900/10 backdrop-blur-[0.5px] rounded-full">
            <div className="bg-white dark:bg-stone-900 p-1.5 rounded-full shadow-md border border-stone-150 dark:border-stone-800 scale-90 translate-y-9">
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
                  transition={{ duration: 0.25 }}
                  className={`group/badge bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-850 hover:border-stone-300 dark:hover:border-stone-750 p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-between min-h-[290px] relative overflow-hidden text-center cursor-pointer ${
                    badge.unlocked ? 'hover:-translate-y-1' : 'opacity-80 hover:opacity-100'
                  }`}
                  onClick={() => badge.unlocked && handleShareBadge(badge)}
                >
                  {/* Hexagon Shape Container */}
                  <div className="w-full relative py-2">
                    {renderHexagonBadge(badge.color, badge.unlocked, badge.icon)}
                  </div>

                  {/* Ribbon Status Pill */}
                  <div className="mt-1 relative z-10 flex flex-col items-center space-y-1">
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-stone-150 bg-white dark:border-stone-800 dark:bg-stone-950 text-[8px] font-black uppercase tracking-widest shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                      {badge.unlocked ? (
                        <span style={{ color: badge.color }}>{badge.ribbonText}</span>
                      ) : (
                        <span className="text-stone-400 dark:text-stone-500 flex items-center gap-1">
                          <Lock className="w-2 h-2" /> LOCKED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badge Text details */}
                  <div className="space-y-1.5 w-full mt-3">
                    <h4 className="font-extrabold text-sm text-stone-900 dark:text-white leading-tight group-hover/badge:text-stone-950 dark:group-hover/badge:text-stone-100">
                      {badge.name}
                    </h4>
                    <p className="text-[10.5px] text-stone-400 dark:text-stone-500 font-bold tracking-tight uppercase">
                      {badge.category}
                    </p>
                    <p className="text-[11.5px] text-stone-500 dark:text-stone-400 leading-normal line-clamp-2 px-1">
                      {badge.unlocked ? badge.description : badge.requirement}
                    </p>
                  </div>

                  {/* Dynamic Progress Indicator */}
                  <div className="w-full pt-4 mt-3 border-t border-stone-100 dark:border-stone-850 flex flex-col space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-extrabold font-mono text-stone-400">
                      <span>PROGRESS</span>
                      <span className={badge.unlocked ? "text-emerald-500" : "text-stone-400 dark:text-stone-500"}>
                        {badge.progressCurrent} / {badge.progressMax}
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${progressPercentage}%`,
                          backgroundColor: badge.unlocked ? badge.color : '#a8a29e' 
                        }}
                      />
                    </div>
                    {badge.unlocked && (
                      <div className="text-[9px] font-black text-emerald-500/90 tracking-wide mt-1 uppercase flex items-center justify-center gap-1">
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
