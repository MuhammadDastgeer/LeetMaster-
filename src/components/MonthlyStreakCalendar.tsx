import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Flame, Trophy, ChevronLeft, ChevronRight, Sparkles, 
  Check, Edit3, Award, Info, AlertCircle, Share2
} from 'lucide-react';

interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: string;
  category: string;
  language: string;
  timestamp: string;
  status: string;
}

export default function MonthlyStreakCalendar() {
  const [activityDays, setActivityDays] = useState<string[]>([]);
  const [activityNotes, setActivityNotes] = useState<Record<string, string>>({});
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // UI States
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [editingNote, setEditingNote] = useState<string>('');
  const [isSuccessAlert, setIsSuccessAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isCopying, setIsCopying] = useState<boolean>(false);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Helper to format Date object to YYYY-MM-DD
  const formatDateStr = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Helper to get number of days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Load and merge local activity and DSA submissions
  useEffect(() => {
    const fetchAndMergeActivity = async () => {
      let dsaDates: string[] = [];
      
      // 1. Fetch real DSA submissions if endpoint is available
      try {
        const res = await fetch('/api/dsa/submissions');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.submissions)) {
            dsaDates = data.submissions
              .filter((s: Submission) => s && s.status === 'Accepted')
              .map((s: Submission) => {
                const d = new Date(s.timestamp);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              });
          }
        }
      } catch (err) {
        console.error('Error fetching DSA submissions for calendar:', err);
      }

      // 2. Load custom toggled activity days from localStorage
      const localDaysRaw = localStorage.getItem('leetmaster_activity_days');
      let localDays: string[] = [];
      if (localDaysRaw) {
        try {
          const parsed = JSON.parse(localDaysRaw);
          if (Array.isArray(parsed)) {
            localDays = parsed;
          }
        } catch (e) {
          console.error('Error parsing local activity days:', e);
        }
      } else {
        // If first time, let's seed mock historical active days in the current and previous month so the calendar looks gorgeous immediately
        const seeded: string[] = [];
        const base = new Date();
        
        // Seed today
        seeded.push(formatDateStr(base));
        
        // Seed yesterday
        const d1 = new Date(base);
        d1.setDate(base.getDate() - 1);
        seeded.push(formatDateStr(d1));

        // Seed 2 days ago
        const d2 = new Date(base);
        d2.setDate(base.getDate() - 2);
        seeded.push(formatDateStr(d2));

        // Seed 4 days ago
        const d4 = new Date(base);
        d4.setDate(base.getDate() - 4);
        seeded.push(formatDateStr(d4));

        // Seed 5 days ago
        const d5 = new Date(base);
        d5.setDate(base.getDate() - 5);
        seeded.push(formatDateStr(d5));

        // Seed 6 days ago
        const d6 = new Date(base);
        d6.setDate(base.getDate() - 6);
        seeded.push(formatDateStr(d6));

        // Seed 9 days ago
        const d9 = new Date(base);
        d9.setDate(base.getDate() - 9);
        seeded.push(formatDateStr(d9));

        // Seed 10 days ago
        const d10 = new Date(base);
        d10.setDate(base.getDate() - 10);
        seeded.push(formatDateStr(d10));

        // Seed 14 days ago
        const d14 = new Date(base);
        d14.setDate(base.getDate() - 14);
        seeded.push(formatDateStr(d14));

        localDays = seeded;
        localStorage.setItem('leetmaster_activity_days', JSON.stringify(seeded));
      }

      // 3. Load user-added custom reflection notes
      const localNotesRaw = localStorage.getItem('leetmaster_activity_notes');
      let localNotes: Record<string, string> = {};
      if (localNotesRaw) {
        try {
          localNotes = JSON.parse(localNotesRaw);
        } catch (e) {
          console.error('Error parsing local activity notes:', e);
        }
      } else {
        // Seed default beautiful notes for our seeded dates
        const base = new Date();
        const baseStr = formatDateStr(base);
        
        const d1 = new Date(base);
        d1.setDate(base.getDate() - 1);
        const d1Str = formatDateStr(d1);

        const d2 = new Date(base);
        d2.setDate(base.getDate() - 2);
        const d2Str = formatDateStr(d2);

        const d4 = new Date(base);
        d4.setDate(base.getDate() - 4);
        const d4Str = formatDateStr(d4);

        localNotes = {
          [baseStr]: 'Solved Binary Search Tree & linked list questions. Synced with local cohort.',
          [d1Str]: 'Practiced 2 Medium Dynamic Programming challenges. Felt great to find the state transition!',
          [d2Str]: 'Completed the Weekly Scholar Quiz Assessment and reviewed system designs.',
          [d4Str]: 'Read engineering blogs on distributed caching structures.'
        };
        localStorage.setItem('leetmaster_activity_notes', JSON.stringify(localNotes));
      }

      // Merge both unique dates
      const mergedSet = new Set<string>([...localDays, ...dsaDates]);
      setActivityDays(Array.from(mergedSet));
      setActivityNotes(localNotes);
      setSelectedDateStr(todayStr);
      setEditingNote(localNotes[todayStr] || '');
    };

    fetchAndMergeActivity();
  }, []);

  // Save changes to local storage whenever they change
  const saveActivityToLocalStorage = (daysList: string[], notesObj: Record<string, string>) => {
    localStorage.setItem('leetmaster_activity_days', JSON.stringify(daysList));
    localStorage.setItem('leetmaster_activity_notes', JSON.stringify(notesObj));
  };

  // Toggle active/inactive state of a day
  const toggleDayActivity = (dateStr: string) => {
    let updatedDays: string[];
    const isCurrentlyActive = activityDays.includes(dateStr);
    
    if (isCurrentlyActive) {
      updatedDays = activityDays.filter(d => d !== dateStr);
      triggerAlert('Day marked as rest day 🌿');
    } else {
      updatedDays = [...activityDays, dateStr];
      triggerAlert('Day logged as study active! 🔥');
    }
    
    setActivityDays(updatedDays);
    saveActivityToLocalStorage(updatedDays, activityNotes);

    if (selectedDateStr === dateStr) {
      setEditingNote(activityNotes[dateStr] || '');
    }
  };

  // Quick Log Today
  const quickLogToday = () => {
    if (!activityDays.includes(todayStr)) {
      const updatedDays = [...activityDays, todayStr];
      setActivityDays(updatedDays);
      
      const updatedNotes = {
        ...activityNotes,
        [todayStr]: activityNotes[todayStr] || 'Manually logged active day'
      };
      setActivityNotes(updatedNotes);
      saveActivityToLocalStorage(updatedDays, updatedNotes);
      
      setSelectedDateStr(todayStr);
      setEditingNote(updatedNotes[todayStr]);
      triggerAlert('Successfully logged today as active! 🚀');
    } else {
      triggerAlert('Today is already marked as active! ✨');
    }
  };

  // Save reflection notes for selected date
  const saveNote = () => {
    if (!selectedDateStr) return;
    
    const updatedNotes = {
      ...activityNotes,
      [selectedDateStr]: editingNote
    };
    
    setActivityNotes(updatedNotes);
    
    // Also auto-ensure that if the user saves a note, that day becomes active if it isn't already
    let updatedDays = [...activityDays];
    if (!activityDays.includes(selectedDateStr)) {
      updatedDays.push(selectedDateStr);
      setActivityDays(updatedDays);
    }

    saveActivityToLocalStorage(updatedDays, updatedNotes);
    triggerAlert('Reflection note saved successfully!');
  };

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setIsSuccessAlert(true);
    setTimeout(() => {
      setIsSuccessAlert(false);
    }, 3000);
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calculate Streak stats
  const getStreaks = () => {
    if (activityDays.length === 0) return { current: 0, best: 0 };

    // Unique parsed local dates sorted descending (YYYY-MM-DD)
    const sortedDates = [...activityDays]
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a));

    const parseLocalDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    let currentStreak = 0;
    
    // Check if we have activity today or yesterday to proceed with current streak calculation
    const hasToday = sortedDates.includes(todayStr);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const hasYesterday = sortedDates.includes(yesterdayStr);

    if (hasToday || hasYesterday) {
      let checkDate = hasToday ? parseLocalDate(todayStr) : parseLocalDate(yesterdayStr);
      let tempStreak = 0;

      while (true) {
        const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (sortedDates.includes(checkStr)) {
          tempStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      currentStreak = tempStreak;
    }

    // Longest Streak calculation
    const ascDates = [...activityDays]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    let bestStreak = 0;
    if (ascDates.length > 0) {
      let tempMax = 1;
      let prevDate = parseLocalDate(ascDates[0]);

      for (let i = 1; i < ascDates.length; i++) {
        const currDate = parseLocalDate(ascDates[i]);
        const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempMax++;
        } else if (diffDays > 1) {
          if (tempMax > bestStreak) bestStreak = tempMax;
          tempMax = 1;
        }
        prevDate = currDate;
      }
      if (tempMax > bestStreak) bestStreak = tempMax;
    }

    // Ensure best is at least current
    bestStreak = Math.max(bestStreak, currentStreak);

    return { current: currentStreak, best: bestStreak };
  };

  const streakStats = getStreaks();

  const isGoalCompleted = activityDays.includes(todayStr);

  const generateShareText = () => {
    const current = streakStats.current;
    const best = streakStats.best;
    const totalDays = activityDays.length;

    const xp = localStorage.getItem('leetmaster_user_xp') || '0';

    let completedQuizzesCount = 0;
    const quizScoresRaw = localStorage.getItem('leetmaster_quiz_completed_scores');
    if (quizScoresRaw) {
      try {
        const parsed = JSON.parse(quizScoresRaw);
        completedQuizzesCount = Object.keys(parsed).length;
      } catch (e) {}
    }

    let forumPostsCount = 0;
    const discussionsRaw = localStorage.getItem('leetmaster_discussions');
    if (discussionsRaw) {
      try {
        const parsed = JSON.parse(discussionsRaw);
        if (Array.isArray(parsed)) {
          let currentUserName = 'You';
          const profileRawStr = localStorage.getItem('leetmaster_user_profile');
          if (profileRawStr) {
            try {
              const u = JSON.parse(profileRawStr);
              if (u.name) currentUserName = u.name;
            } catch (e) {}
          }
          const userPostsCount = parsed.filter(d => d && (d.author === currentUserName || d.author === 'You')).length;
          const userCommentsCount = parsed.reduce((sum, d) => {
            if (!d || !Array.isArray(d.comments)) return sum;
            const myComments = d.comments.filter((c: any) => c && (c.author === currentUserName || c.author === 'You')).length;
            return sum + myComments;
          }, 0);
          forumPostsCount = userPostsCount + userCommentsCount;
        }
      } catch (e) {}
    }

    let solvedDsaCount = 0;
    const sheetsRaw = localStorage.getItem('leetmaster_dsa_sheets_v1');
    if (sheetsRaw) {
      try {
        const parsed = JSON.parse(sheetsRaw);
        if (typeof parsed === 'object' && parsed !== null) {
          Object.values(parsed).forEach((sheet: any) => {
            if (sheet && typeof sheet === 'object') {
              Object.values(sheet).forEach((prob: any) => {
                if (prob && prob.completed) {
                  solvedDsaCount++;
                }
              });
            }
          });
        }
      } catch (e) {}
    }

    let enrolledCoursesCount = 0;
    const coursesRaw = localStorage.getItem('sab_tech_courses_state_v4') || localStorage.getItem('sab_tech_courses_state_v3') || localStorage.getItem('leetmaster_courses_state');
    if (coursesRaw) {
      try {
        const parsed = JSON.parse(coursesRaw);
        if (Array.isArray(parsed)) {
          enrolledCoursesCount = parsed.filter(c => c && c.enrolled).length;
        }
      } catch (e) {}
    }

    return `🚀 LeetMaster Daily Scholar Update! 🚀

🔥 Streak Analytics:
• Current Daily Streak: ${current} Day${current === 1 ? '' : 's'}
• Personal Best Streak: ${best} Day${best === 1 ? '' : 's'}
• Total Active Study Days: ${totalDays} Day${totalDays === 1 ? '' : 's'}

🌟 Scholarly Milestones:
• Total Experience: ${xp} XP
• Solved DSA Problems: ${solvedDsaCount}
• Completed Quizzes: ${completedQuizzesCount}
• Courses Enrolled: ${enrolledCoursesCount}
• Discussion Contributions: ${forumPostsCount}

🌿 ${monthNames[month]} Consistency: ${monthPercent}%

"Consistency is the compounding interest of self-study."
Track your growth & challenge yourself on LeetMaster! 💻✨`;
  };

  const handleShare = async () => {
    setIsCopying(true);
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      triggerAlert('Formatted scholar update copied to clipboard! 📋🚀');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      triggerAlert('Failed to copy to clipboard. Try manually selecting text!');
    } finally {
      setTimeout(() => setIsCopying(false), 2000);
    }
  };

  // Calendar render helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...

  // Adjust firstDayIndex to make Monday start index 0
  const mondayOffsetIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // List of days in current month to render
  const calendarDaysList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Total active days in current displayed month
  const activeDaysInDisplayedMonth = calendarDaysList.filter(day => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activityDays.includes(dStr);
  }).length;

  const monthPercent = daysInMonth > 0 ? Math.round((activeDaysInDisplayedMonth / daysInMonth) * 100) : 0;

  // Handle selected date change from calendar click
  const selectCalendarDate = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dStr);
    setEditingNote(activityNotes[dStr] || '');
  };

  return (
    <section id="monthly-streak-calendar" className="py-20 bg-stone-50 dark:bg-zinc-900 border-t border-b border-stone-200/60 dark:border-zinc-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff6b2b]/10 dark:bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 rounded-full text-xs font-bold text-[#ff6b2b]">
              <Flame className="w-3.5 h-3.5 fill-[#ff6b2b]" />
              <span>CONSISTENCY TRACKER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-stone-900 dark:text-white tracking-tight">
              Your Compounding Growth
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
              Every submission, quiz assessment, and lesson you complete leaves a digital footprint. Toggle days below to document self-study milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="share-streak-update-btn"
              onClick={handleShare}
              className="px-5 py-2.5 bg-stone-150 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-stone-800 dark:text-stone-100 rounded-2xl text-xs font-extrabold transition-all duration-200 hover:shadow-md flex items-center gap-2 cursor-pointer border border-stone-200/50 dark:border-zinc-700/80"
            >
              <Share2 className="w-4 h-4 text-[#ff6b2b]" />
              <span>{isCopying ? 'Copied!' : 'Share Update'}</span>
            </button>

            <button
              id="quick-log-today-btn"
              onClick={quickLogToday}
              className="px-5 py-2.5 bg-[#ff6b2b] text-white rounded-2xl text-xs font-extrabold hover:bg-[#e05316] transition-all duration-200 hover:shadow-lg flex items-center gap-2 cursor-pointer border border-transparent shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Log Today's Activity</span>
            </button>
          </div>
        </div>

        {/* ALERT BOX */}
        <AnimatePresence>
          {isSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3 text-orange-600 dark:text-orange-400 text-xs font-bold font-mono"
            >
              <Check className="w-4 h-4 text-orange-500" />
              <span>{alertMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BENTO GRID OF STATS + CALENDAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 4 COLS: STATS & REFLECTION NOTES */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* STATS CARD */}
            <div className="bg-white dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-white uppercase font-mono tracking-wider mb-4 border-b border-stone-100 dark:border-zinc-800/80 pb-2">
                Streak Analytics
              </h3>

              {/* Daily Goal Status pulsing notification indicator */}
              <div id="daily-goal-notification-indicator" className={`mb-5 p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                isGoalCompleted 
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/25 text-emerald-800 dark:text-emerald-400' 
                  : 'bg-amber-500/10 dark:bg-amber-500/5 border-amber-500/25 text-amber-800 dark:text-amber-400'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-3 w-3">
                    {isGoalCompleted ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </>
                    ) : (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold font-mono uppercase tracking-wider leading-none">Daily Goal Status</span>
                    <span className="text-xs font-bold mt-1 leading-tight">
                      {isGoalCompleted 
                        ? 'Completed! Goal Achieved 🎉' 
                        : 'Incomplete - Log today\'s activity! ⏰'
                      }
                    </span>
                  </div>
                </div>

                {isGoalCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/25 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <button 
                    id="complete-daily-goal-shortcut-btn"
                    onClick={quickLogToday}
                    className="text-[10px] font-mono font-black uppercase text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Log Today
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* CURRENT STREAK */}
                <div className="bg-stone-50 dark:bg-zinc-900 p-4 rounded-2xl border border-stone-100 dark:border-zinc-800/50 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-stone-400 dark:text-zinc-500 font-mono uppercase">Current Streak</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-stone-900 dark:text-white">{streakStats.current}</span>
                    <span className="text-xs font-extrabold text-[#ff6b2b]">days</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[#ff6b2b] font-bold">
                    <Flame className="w-3.5 h-3.5 fill-[#ff6b2b]" />
                    <span>Compounding...</span>
                  </div>
                </div>

                {/* BEST STREAK */}
                <div className="bg-stone-50 dark:bg-zinc-900 p-4 rounded-2xl border border-stone-100 dark:border-zinc-800/50 flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold text-stone-400 dark:text-zinc-500 font-mono uppercase">Longest Streak</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-stone-900 dark:text-white">{streakStats.best}</span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">days</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Personal Record</span>
                  </div>
                </div>

                {/* MONTH COMPLETED */}
                <div className="col-span-2 bg-stone-50 dark:bg-zinc-900 p-4 rounded-2xl border border-stone-100 dark:border-zinc-800/50">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-extrabold text-stone-400 dark:text-zinc-500 font-mono uppercase">
                      {monthNames[month]} Consistency
                    </span>
                    <span className="text-xs font-mono font-black text-[#ff6b2b]">{monthPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-[#ff6b2b] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${monthPercent}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-stone-400 dark:text-zinc-500 block mt-2 leading-relaxed">
                    You logged <strong className="text-stone-700 dark:text-stone-300 font-bold">{activeDaysInDisplayedMonth} active days</strong> out of {daysInMonth} total days in {monthNames[month]}.
                  </span>
                </div>
              </div>
            </div>

            {/* DAILY REFLECTIONS NOTEBOOK */}
            <div className="bg-white dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-zinc-800/80">
                <h3 className="text-sm font-extrabold text-stone-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-[#ff6b2b]" />
                  <span>Activity Journal</span>
                </h3>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-900 text-stone-500 dark:text-zinc-400">
                  {selectedDateStr}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="activity-notes-textarea" className="block text-[10px] font-extrabold text-stone-400 dark:text-zinc-500 font-mono uppercase mb-1.5">
                    Reflections & Solved Challenges
                  </label>
                  <textarea
                    id="activity-notes-textarea"
                    value={editingNote}
                    onChange={(e) => setEditingNote(e.target.value)}
                    placeholder="E.g. Completed Binary Tree traversal, optimized recursion to iteration O(1) space..."
                    className="w-full h-24 p-3 bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 placeholder-stone-400 focus:outline-none focus:border-[#ff6b2b] focus:ring-1 focus:ring-[#ff6b2b] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-medium flex items-center gap-1 leading-tight">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
                    <span>Writing a note auto-activates that day!</span>
                  </span>
                  <button
                    id="save-journal-note-btn"
                    onClick={saveNote}
                    className="px-4 py-2 bg-stone-900 dark:bg-zinc-800 hover:bg-[#ff6b2b] dark:hover:bg-[#ff6b2b] text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border border-transparent shadow-sm"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 8 COLS: CALENDAR MONTH VIEW */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-950 border border-stone-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* MONTH SWITCHER HEADER */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#ff6b2b]" />
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  {monthNames[month]} <span className="font-mono text-sm text-stone-400 dark:text-zinc-500 font-bold">{year}</span>
                </h3>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  id="calendar-prev-month-btn"
                  onClick={prevMonth}
                  className="p-2 hover:bg-stone-50 dark:hover:bg-zinc-900 border border-stone-100 dark:border-zinc-800 rounded-xl transition-colors cursor-pointer text-stone-500 dark:text-stone-400"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="calendar-next-month-btn"
                  onClick={nextMonth}
                  className="p-2 hover:bg-stone-50 dark:hover:bg-zinc-900 border border-stone-100 dark:border-zinc-800 rounded-xl transition-colors cursor-pointer text-stone-500 dark:text-stone-400"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MONTH GRID */}
            <div className="space-y-4">
              {/* Day Name Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-stone-400 dark:text-zinc-500 uppercase font-mono tracking-wider">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Days Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty Offset Days for Monday Start adjustment */}
                {Array.from({ length: mondayOffsetIndex }).map((_, idx) => (
                  <div 
                    key={`offset-${idx}`} 
                    className="aspect-square rounded-2xl bg-stone-50/50 dark:bg-zinc-900/10 border border-transparent"
                  />
                ))}

                {/* Day Blocks */}
                {calendarDaysList.map(day => {
                  const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isActive = activityDays.includes(dStr);
                  const isSelected = selectedDateStr === dStr;
                  const isDayToday = todayStr === dStr;
                  const hasNote = !!activityNotes[dStr];

                  return (
                    <button
                      key={`day-${day}`}
                      id={`calendar-day-cell-${dStr}`}
                      onClick={() => selectCalendarDate(day)}
                      onDoubleClick={() => toggleDayActivity(dStr)}
                      title="Click once to select/view journal notes. Double click to toggle active status!"
                      className={`
                        aspect-square rounded-2xl border relative flex flex-col justify-between p-2 cursor-pointer transition-all duration-200 group hover:scale-[1.04]
                        ${isActive 
                          ? 'bg-gradient-to-br from-orange-500 to-[#ff6b2b] text-white border-transparent shadow-sm' 
                          : 'bg-stone-50 hover:bg-stone-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-zinc-800'
                        }
                        ${isSelected ? 'ring-2 ring-stone-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-950' : ''}
                      `}
                    >
                      {/* Day Number */}
                      <span className={`text-xs font-black font-mono leading-none ${isActive ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                        {day}
                      </span>

                      {/* Small visual indicators (Today / Has Note) */}
                      <div className="flex items-center justify-between w-full mt-auto">
                        {isDayToday ? (
                          <span className={`text-[8px] font-mono font-black uppercase px-1 rounded-sm leading-none ${isActive ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'}`}>
                            Today
                          </span>
                        ) : (
                          <div />
                        )}

                        {hasNote && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-[#ff6b2b]'}`} title="Has reflection note" />
                        )}
                      </div>

                      {/* Floating hover toggle hint */}
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center">
                        <span className="text-[7px] font-black uppercase tracking-wider bg-white/90 text-stone-900 dark:bg-zinc-900/90 dark:text-white py-0.5 px-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap scale-90">
                          Db-Click to Toggle
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TIP FOOTER */}
            <div className="mt-8 p-4 bg-stone-50 dark:bg-zinc-900 border border-stone-100 dark:border-zinc-800/80 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#ff6b2b] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-medium">
                <strong className="text-stone-900 dark:text-white font-extrabold">Pro Tip:</strong> 
                {" "}Double-click on any day cell in the calendar grid to directly toggle its active status. This lets you manually fill in coding days when you study offline, watch lectures, or solve whiteboard design diagrams!
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
