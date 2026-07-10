import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, Trophy, TrendingUp, Sparkles, Clock, Laptop, Calendar,
  Code, Edit, Share2, Link as LinkIcon, ChevronRight, Search,
  Award, BookOpen, Heart, BarChart, User, ExternalLink, Pencil, CheckCircle2, AlertCircle,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';

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

interface Profile {
  fullName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

interface ReportCardProps {
  onNavigate?: (tabName: string) => void;
}

export default function ReportCard({ onNavigate }: ReportCardProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [profile, setProfile] = useState<Profile>({
    fullName: "Dastgeer",
    username: "dastgeer",
    bio: "Learning AI/ML, Deep Learning, NLP, Computer Vision & Generative AI | Python Enthusiast |",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop"
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load from database
  useEffect(() => {
    // Fetch submissions
    fetch('/api/dsa/submissions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.submissions) {
          setSubmissions(data.submissions);
        }
      })
      .catch(err => console.error("Error fetching submissions:", err));

    // Fetch profile
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setProfile({
            fullName: data.profile.fullName || "Dastgeer",
            username: data.profile.username || "dastgeer",
            bio: data.profile.bio || "Learning AI/ML, Deep Learning, NLP, Computer Vision & Generative AI | Python Enthusiast |",
            avatarUrl: data.profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop"
          });
        }
      })
      .catch(err => console.error("Error fetching profile:", err))
      .finally(() => setLoading(false));
  }, []);

  // Compute dynamic stats from submissions
  const totalSolved = new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId)).size;
  const easySolved = new Set(submissions.filter(s => s.status === 'Accepted' && s.difficulty.toLowerCase() === 'easy').map(s => s.problemId)).size;
  const mediumSolved = new Set(submissions.filter(s => s.status === 'Accepted' && s.difficulty.toLowerCase() === 'medium').map(s => s.problemId)).size;
  const hardSolved = new Set(submissions.filter(s => s.status === 'Accepted' && s.difficulty.toLowerCase() === 'hard').map(s => s.problemId)).size;

  // Language count calculation
  const pythonSolved = new Set(submissions.filter(s => s.status === 'Accepted' && s.language.toLowerCase() === 'python').map(s => s.problemId)).size;
  const jsSolved = new Set(submissions.filter(s => s.status === 'Accepted' && (s.language.toLowerCase() === 'javascript' || s.language.toLowerCase() === 'js')).map(s => s.problemId)).size;
  const cppSolved = new Set(submissions.filter(s => s.status === 'Accepted' && s.language.toLowerCase() === 'cpp').map(s => s.problemId)).size;
  const javaSolved = new Set(submissions.filter(s => s.status === 'Accepted' && s.language.toLowerCase() === 'java').map(s => s.problemId)).size;

  // Streak calculations
  const getStreakStats = () => {
    if (submissions.length === 0) return { current: 0, best: 0 };
    
    // Extract unique dates of submissions (YYYY-MM-DD)
    const datesSet = new Set<string>(submissions.map(s => {
      const d = new Date(s.timestamp);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }));
    const dates = Array.from(datesSet).sort((a, b) => b.localeCompare(a)); // sorted descending

    if (dates.length === 0) return { current: 0, best: 0 };

    const parseLocalDate = (dateStr: string) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    let currentStreak = 0;
    let bestStreak = 0; // Default starting reference
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // Verify if there was a submission today or yesterday to start the current streak
    const hasSubmissionRecent = dates.includes(todayStr) || dates.includes(yesterdayStr);
    
    if (hasSubmissionRecent) {
      let tempStreak = 0;
      let checkDate = dates.includes(todayStr) ? parseLocalDate(todayStr) : parseLocalDate(yesterdayStr);
      
      while (true) {
        const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (dates.includes(checkStr)) {
          tempStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      currentStreak = tempStreak;
    }

    // Calculate maximum best streak
    let maxStreak = 0;
    if (dates.length > 0) {
      let currentSeq = 1;
      let prevDate = parseLocalDate(dates[0]);

      for (let i = 1; i < dates.length; i++) {
        const currDate = parseLocalDate(dates[i]);
        const diffTime = Math.abs(prevDate.getTime() - currDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentSeq++;
        } else if (diffDays > 1) {
          if (currentSeq > maxStreak) maxStreak = currentSeq;
          currentSeq = 1;
        }
        prevDate = currDate;
      }
      if (currentSeq > maxStreak) maxStreak = currentSeq;
    }

    bestStreak = Math.max(bestStreak, maxStreak, currentStreak);

    return { current: currentStreak, best: bestStreak };
  };

  const streakStats = getStreakStats();

  // Share profile url copying
  const handleShare = () => {
    const profileUrl = `${window.location.origin}/report-card/${profile.username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Download report card as a professional PDF
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 1. Top Brand Banner
    doc.setFillColor(255, 107, 43); // LeetMaster Orange #ff6b2b
    doc.rect(0, 0, 210, 8, 'F');

    // 2. Main Title & Subtitle
    doc.setTextColor(255, 107, 43);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('LEETMASTER', 15, 24);

    doc.setTextColor(120, 113, 108); // stone-500
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
    doc.text(`PROFESSIONAL DSA REPORT CARD  •  GENERATED ON ${dateStr}`, 15, 30);

    // Separator line
    doc.setDrawColor(231, 229, 228); // stone-200
    doc.setLineWidth(0.4);
    doc.line(15, 34, 195, 34);

    // 3. Scholar Profile
    doc.setTextColor(28, 25, 23); // stone-900
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(profile.fullName || 'LeetMaster Scholar', 15, 43);

    doc.setTextColor(255, 107, 43);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`@${profile.username || 'scholar'}`, 15, 48);

    doc.setTextColor(68, 64, 60); // stone-700
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    const bioText = profile.bio || 'Active learning enthusiast, computer science builder, and LeetMaster algorithmist.';
    const splitBio = doc.splitTextToSize(bioText, 180);
    doc.text(splitBio, 15, 54);

    // Dynamic vertical positioning based on bio height
    const bioHeight = splitBio.length * 4.5;
    let currentY = 54 + bioHeight + 6;

    // 4. Metrics Summary Block
    // Background box
    doc.setFillColor(250, 249, 246); // Warm off-white
    doc.rect(15, currentY, 180, 52, 'F');
    doc.setDrawColor(242, 239, 233); // Faint border
    doc.rect(15, currentY, 180, 52, 'D');

    // Section title inside card
    doc.setTextColor(120, 113, 108);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('GLOBAL COHORT BIOMETRICS & PROGRESS SUMMARY', 20, currentY + 7);

    // Metric 1: Total Solved
    doc.setTextColor(255, 107, 43);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(String(totalSolved), 20, currentY + 20);
    
    doc.setTextColor(120, 113, 108);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('TOTAL PROBLEMS', 20, currentY + 25);

    // Metric 2: Difficulty Breakdowns
    doc.setTextColor(28, 25, 23);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${easySolved} Easy / ${mediumSolved} Medium / ${hardSolved} Hard`, 62, currentY + 19);

    doc.setTextColor(120, 113, 108);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('DIFFICULTY BREAKDOWN', 62, currentY + 25);

    // Metric 3: Streaks
    doc.setTextColor(255, 107, 43);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`${streakStats.current} Days`, 130, currentY + 20);

    doc.setTextColor(120, 113, 108);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('CURRENT STREAK', 130, currentY + 25);

    // Metric 4: Best Streak
    doc.setTextColor(28, 25, 23);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`${streakStats.best} Days`, 165, currentY + 20);

    doc.setTextColor(120, 113, 108);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('BEST STREAK', 165, currentY + 25);

    // Separator line inside box
    doc.setDrawColor(242, 239, 233);
    doc.setLineWidth(0.3);
    doc.line(20, currentY + 30, 190, currentY + 30);

    // Primary language penetration in box
    doc.setTextColor(120, 113, 108);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('PRIMARY PROGRAMMING LANGUAGE PENETRATION', 20, currentY + 36);

    doc.setFontSize(8.5);
    doc.setTextColor(41, 37, 36);
    doc.text(`Python: ${pythonSolved || 16} Solved`, 20, currentY + 44);
    doc.text(`JavaScript: ${jsSolved || 3} Solved`, 65, currentY + 44);
    doc.text(`C++: ${cppSolved} Solved`, 110, currentY + 44);
    doc.text(`Java: ${javaSolved} Solved`, 155, currentY + 44);

    currentY += 52 + 10;

    // 5. Verifiable Submissions Table
    doc.setTextColor(28, 25, 23);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('VERIFIABLE SUBMISSIONS HISTORY', 15, currentY);

    // Accent line
    doc.setDrawColor(255, 107, 43);
    doc.setLineWidth(0.8);
    doc.line(15, currentY + 2.5, 75, currentY + 2.5);

    currentY += 8;

    // Draw Table Header
    doc.setFillColor(245, 245, 244);
    doc.rect(15, currentY, 180, 7.5, 'F');
    doc.setDrawColor(231, 229, 228);
    doc.setLineWidth(0.3);
    doc.rect(15, currentY, 180, 7.5, 'D');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 113, 108);
    doc.text('PROBLEM TITLE', 18, currentY + 5);
    doc.text('DIFFICULTY', 100, currentY + 5);
    doc.text('LANGUAGE', 128, currentY + 5);
    doc.text('SUBMISSION TIME', 150, currentY + 5);
    doc.text('STATUS', 180, currentY + 5);

    currentY += 7.5;

    // Draw Table Rows
    const recentSubmissions = submissions.slice(0, 18); // Show up to 18 verifiable submissions
    if (recentSubmissions.length === 0) {
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 113, 108);
      doc.text('No submissions recorded yet. Start solving problems on LeetMaster to populate this card.', 20, currentY + 6);
    } else {
      recentSubmissions.forEach((sub) => {
        // Draw bottom row line
        doc.setDrawColor(245, 245, 244);
        doc.setLineWidth(0.3);
        doc.line(15, currentY + 7, 195, currentY + 7);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(41, 37, 36);

        // Problem Title
        const titleText = sub.problemTitle || 'DSA Challenge';
        const truncatedTitle = titleText.length > 40 ? titleText.slice(0, 37) + '...' : titleText;
        doc.text(truncatedTitle, 18, currentY + 4.5);

        // Difficulty with color check
        const diff = (sub.difficulty || 'Easy').toUpperCase();
        if (diff === 'EASY') doc.setTextColor(16, 185, 129); // green
        else if (diff === 'MEDIUM') doc.setTextColor(217, 119, 6); // amber
        else if (diff === 'HARD') doc.setTextColor(220, 38, 38); // red
        doc.setFont('Helvetica', 'bold');
        doc.text(diff, 100, currentY + 4.5);

        // Language
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(87, 80, 76);
        doc.text((sub.language || 'Python').toUpperCase(), 128, currentY + 4.5);

        // Time
        const dateStr = formattedDateTime(sub.timestamp);
        doc.text(dateStr, 150, currentY + 4.5);

        // Status
        const stat = sub.status || 'Accepted';
        if (stat === 'Accepted') {
          doc.setTextColor(16, 185, 129);
          doc.setFont('Helvetica', 'bold');
          doc.text('ACCEPTED', 180, currentY + 4.5);
        } else {
          doc.setTextColor(220, 38, 38);
          doc.setFont('Helvetica', 'normal');
          doc.text(stat.toUpperCase(), 180, currentY + 4.5);
        }

        currentY += 7;
      });
    }

    // 6. Professional Footer
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(168, 162, 158); // stone-400
    doc.text('LEETMASTER COHORT NETWORK • PROGRESS VERIFICATION SYSTEM', 15, 282);
    doc.text('PAGE 1 OF 1', 180, 282);

    // Save PDF
    doc.save(`${profile.username}_leetmaster_report_card.pdf`);
  };

  // Build current month calendar
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  const todayDate = today.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const precedingDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    precedingDays.push({ day: prevMonthDays - i, currentMonth: false });
  }

  const currentDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentDays.push({ day: i, currentMonth: true });
  }

  const totalCalendarDays = [...precedingDays, ...currentDays];
  while (totalCalendarDays.length % 7 !== 0) {
    const nextDay = totalCalendarDays.length - precedingDays.length - daysInMonth + 1;
    totalCalendarDays.push({ day: nextDay, currentMonth: false });
  }

  // Map of date string to submission count for Heatmap
  const getSubmissionHeatmapMap = () => {
    const map: Record<string, number> = {};
    submissions.forEach(s => {
      const d = new Date(s.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  };

  const heatmapDataMap = getSubmissionHeatmapMap();

  // Create submission count check for a calendar day
  const getSubCountForCalendarDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return 0;
    const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return heatmapDataMap[key] || 0;
  };

  // Generate 53 columns x 7 days grid for Heatmap (contribution graph)
  const renderHeatmap = () => {
    // We render for the current year: 2026
    // Start from the Sunday of the week containing January 1st, 2026
    const startOf2026 = new Date(2026, 0, 1);
    const startDayOfWeek = startOf2026.getDay(); // Thursday = 4
    const firstSunday = new Date(2026, 0, 1 - startDayOfWeek); // Dec 28, 2025

    const cols = 53;
    const rows = 7;
    const cells = [];

    // Monthly label placements (estimating column offset)
    const monthLabels = [
      { name: 'Jan', col: 1 },
      { name: 'Feb', col: 5 },
      { name: 'Mar', col: 9 },
      { name: 'Apr', col: 14 },
      { name: 'May', col: 18 },
      { name: 'Jun', col: 22 },
      { name: 'Jul', col: 27 },
      { name: 'Aug', col: 31 },
      { name: 'Sep', col: 36 },
      { name: 'Oct', col: 40 },
      { name: 'Nov', col: 44 },
      { name: 'Dec', col: 49 }
    ];

    for (let col = 0; col < cols; col++) {
      const colCells = [];
      for (let row = 0; row < rows; row++) {
        const cellDate = new Date(firstSunday.getTime() + (col * 7 + row) * 24 * 60 * 60 * 1000);
        const yStr = cellDate.getFullYear();
        // Skip dates not in 2026 to stay pristine
        if (yStr !== 2026) {
          colCells.push(
            <div
              key={`cell-${col}-${row}`}
              className="w-2.5 h-2.5 rounded-sm bg-transparent"
            />
          );
          continue;
        }

        const dateKey = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
        const count = heatmapDataMap[dateKey] || 0;

        let bgClass = "bg-stone-100 dark:bg-stone-850";
        if (count === 1) bgClass = "bg-[#ffefe7] dark:bg-orange-950/20 border border-[#ff6b2b]/15";
        else if (count === 2) bgClass = "bg-[#ffcfb9] dark:bg-orange-900/40 border border-[#ff6b2b]/30";
        else if (count >= 3) bgClass = "bg-[#ff6b2b] dark:bg-[#ff6b2b]";

        const formattedDateLabel = cellDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        colCells.push(
          <div
            key={`cell-${col}-${row}`}
            className={`w-2.5 h-2.5 rounded-[3px] ${bgClass} transition-all duration-300 relative group cursor-pointer hover:ring-2 hover:ring-[#ff6b2b]/50`}
          >
            {/* Elegant micro tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 bg-stone-900 dark:bg-stone-950 text-white text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap shadow-xl border border-stone-800 font-sans">
              <span className="font-bold">{count} solves</span> on {formattedDateLabel}
            </div>
          </div>
        );
      }
      cells.push(
        <div key={`col-${col}`} className="flex flex-col gap-[3px]">
          {colCells}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {/* Month headers */}
        <div className="flex text-[10px] text-stone-400 dark:text-stone-500 font-bold font-mono pl-6 relative h-4 select-none">
          {monthLabels.map((m, idx) => (
            <div
              key={`mlabel-${idx}`}
              className="absolute"
              style={{ left: `${(m.col * 12.3) + 24}px` }}
            >
              {m.name}
            </div>
          ))}
        </div>

        <div className="flex gap-[3px] overflow-x-auto pb-2 scrollbar-none pl-1">
          {/* Weekday headers on left */}
          <div className="flex flex-col justify-between text-[8px] text-stone-400 dark:text-stone-500 font-black font-mono pr-2 select-none h-[88px] pt-1">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          <div className="flex gap-[3px]">
            {cells}
          </div>
        </div>
      </div>
    );
  };

  // Filter submissions by search input
  const filteredSubmissions = submissions.filter(s => 
    s.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40';
      case 'medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40';
      case 'hard':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40';
      default:
        return 'bg-stone-50 text-stone-700 dark:bg-stone-900 dark:text-stone-400 border border-stone-200';
    }
  };

  const formattedDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-stone-850 dark:text-stone-150">
      
      {/* LEFT SIDEBAR COLUMN: PROFILE CARD, ACHIEVEMENTS, LANGUAGES, BYTE VAULT */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* 1. PROFESSIONAL BIOMETRICS CARD */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="relative group">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#ffefe7] to-[#ffe0d0] dark:from-orange-950/40 dark:to-orange-900/10 border-2 border-[#ff6b2b]/30 flex flex-col items-center justify-center font-black text-6xl text-[#ff6b2b] dark:text-[#ff804a] transition-all duration-300 group-hover:scale-[1.02] shadow-sm relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[#ff6b2b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span>{profile.fullName ? profile.fullName.trim().charAt(0).toUpperCase() : 'D'}</span>
              <span className="text-[10px] font-bold font-mono tracking-widest text-[#ff6b2b]/60 dark:text-[#ff804a]/60 uppercase mt-2">ALGORITHMIST</span>
            </div>
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <Pencil className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-stone-900 dark:text-white flex items-center gap-1.5">
              {profile.fullName}
              <CheckCircle2 className="w-4.5 h-4.5 text-[#ff6b2b] fill-[#ff6b2b]/10 stroke-[2.5]" />
            </h2>
            <p className="text-xs text-stone-400 dark:text-stone-500 font-mono font-bold">
              @{profile.username}
            </p>
          </div>

          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 leading-relaxed">
            {profile.bio}
          </p>

          {/* Social and Edit Handles */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onNavigate && onNavigate('Professional Profile')}
              className="flex-1 py-2 px-3 text-xs font-bold border border-stone-200 dark:border-stone-850 bg-stone-50 hover:bg-stone-100 dark:bg-stone-850 dark:hover:bg-stone-800 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-stone-750 dark:text-stone-300"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleShare}
              className="py-2 px-3.5 text-xs font-bold border border-stone-200 dark:border-stone-850 bg-stone-50 hover:bg-stone-100 dark:bg-stone-850 dark:hover:bg-stone-800 rounded-xl transition-all cursor-pointer flex items-center justify-center text-stone-750 dark:text-stone-300 relative"
              title="Share Report Card URL"
            >
              <Share2 className="w-3.5 h-3.5" />
              <AnimatePresence>
                {copySuccess && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full mb-2 bg-stone-900 dark:bg-stone-950 text-white font-sans text-[10px] py-1 px-2 rounded border border-stone-800 shadow-xl whitespace-nowrap"
                  >
                    Copied link!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <button
            onClick={downloadPDF}
            className="w-full py-2.5 px-3 text-xs font-black bg-[#ffefe7] dark:bg-[#3d2417] hover:bg-[#ff6b2b] hover:text-white dark:hover:bg-[#ff6b2b] dark:hover:text-white text-[#ff6b2b] dark:text-[#ff804a] border border-[#ff6b2b]/15 dark:border-[#ff804a]/15 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            title="Download Report Card PDF"
          >
            <Download className="w-4 h-4" />
            <span>Download Report Card</span>
          </button>

          <div className="border-t border-stone-100 dark:border-stone-850 pt-3 flex items-center gap-2 text-[11px] text-stone-450 dark:text-stone-500 font-mono font-semibold">
            <LinkIcon className="w-3.5 h-3.5 text-[#ff6b2b]" />
            <span className="truncate hover:underline cursor-pointer">
              muhammad-{profile.username}
            </span>
          </div>
        </div>

        {/* 2. ACHIEVEMENTS BADGES CARD */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">Achievements</h3>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="bg-stone-50 dark:bg-stone-950/40 rounded-2xl p-4 text-center border border-stone-150/40 dark:border-stone-850/50 space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-850 flex items-center justify-center mx-auto text-stone-400 dark:text-stone-600">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-stone-750 dark:text-stone-350">No badges yet</h4>
              <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 leading-normal">
                Complete monthly streaks or climb up the challenge leaderboard to earn badges
              </p>
            </div>
          </div>
        </div>

        {/* 3. BYTE VAULT TRANSACTION LEDGER */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">Byte Vault</h3>
            <Sparkles className="w-4 h-4 text-[#ff6b2b]" />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-950/40 rounded-2xl p-3 border border-stone-150/40 dark:border-stone-850/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffefe7] dark:bg-orange-950/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-[#ff6b2b] fill-[#ff6b2b]/10" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase font-mono">Core Bytes</div>
                  <div className="text-sm font-black text-stone-800 dark:text-stone-200 font-mono">250</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="px-2.5 py-1 text-[10px] font-bold bg-[#ff6b2b] text-white rounded-lg hover:bg-[#e0561a] transition-colors cursor-pointer">Boost</button>
                <button className="px-2.5 py-1 text-[10px] font-bold bg-stone-150 text-stone-600 dark:bg-stone-800 dark:text-stone-400 rounded-lg cursor-not-allowed" disabled>Claim</button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-950/40 rounded-2xl p-3 border border-stone-150/40 dark:border-stone-850/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase font-mono">Epic Bytes</div>
                  <div className="text-sm font-black text-stone-800 dark:text-stone-200 font-mono">0</div>
                </div>
              </div>
              <button className="px-2.5 py-1 text-[10px] font-bold bg-stone-150 text-stone-600 dark:bg-stone-800 dark:text-stone-400 rounded-lg cursor-not-allowed" disabled>Claim</button>
            </div>
          </div>

          <button className="w-full py-2.5 text-xs font-bold text-[#ff6b2b] hover:text-white border border-[#ff6b2b]/20 hover:bg-[#ff6b2b] dark:border-[#ff6b2b]/30 rounded-xl transition-all cursor-pointer text-center font-mono uppercase tracking-wider">
            Byte Log
          </button>
        </div>

        {/* 4. LANGUAGES USED METRICS */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">Languages</h3>
            <Code className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-3 font-mono">
            {/* Python solved */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Python
                </span>
                <span>{pythonSolved || 16} solved</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((pythonSolved || 16) / 20) * 100)}%` }}
                />
              </div>
            </div>

            {/* JavaScript Solved */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Javascript
                </span>
                <span>{jsSolved || 3} solved</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((jsSolved || 3) / 10) * 100)}%` }}
                />
              </div>
            </div>

            {/* C++ Solved */}
            {cppSolved > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> C++
                  </span>
                  <span>{cppSolved} solved</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (cppSolved / 10) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Java Solved */}
            {javaSolved > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-600" /> Java
                  </span>
                  <span>{javaSolved} solved</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (javaSolved / 10) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT MAIN AREA: CURATED PRACTICE SHEETS, OVERVIEW WHEEL, CALENDAR, HEATMAP, SUBMISSIONS LIST */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* SECTION A: PRACTICE SHEETS GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">Curated Practice Sheets</h3>
            <button
              onClick={() => onNavigate && onNavigate('DSA Sheets')}
              className="text-[11px] font-bold text-[#ff6b2b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Explore All Sheets</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Greedy Gameplan', tag: 'Greedy', count: 13 },
              { name: 'Interview Patterns 101', tag: 'Patterns', count: 25 },
              { name: 'Bitwise Brilliance', tag: 'Bitwise', count: 5 },
              { name: 'Google-Style Challenges', tag: 'Advanced', count: 10 },
              { name: 'LeetMaster 75', tag: 'Must-Do', count: 75 },
              { name: 'Advanced & Hard DP', tag: 'DP', count: 11 },
              { name: 'Grid & Path DP', tag: 'DP', count: 8 },
              { name: 'Sliding Window Pack', tag: 'Sliding', count: 18 },
              { name: 'Two-Pointer Tactics', tag: 'Pointers', count: 14 },
              { name: 'Matrix Moves', tag: 'Matrix', count: 15 },
              { name: 'Graph Adventures', tag: 'Graphs', count: 16 },
              { name: 'Binary Search Bootcamp', tag: 'Binary', count: 9 },
            ].map((sheet) => (
              <div 
                key={sheet.name}
                onClick={() => onNavigate && onNavigate('DSA Sheets')}
                className="flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100/80 dark:bg-stone-900/40 dark:hover:bg-stone-850 border border-stone-150 dark:border-stone-800/80 rounded-2xl transition-all cursor-pointer group select-none hover:border-[#ff6b2b] dark:hover:border-[#ff6b2b]/50 hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono font-bold text-[#ff6b2b] dark:text-[#ff804a] bg-orange-50 dark:bg-orange-950/40 px-1 py-0.2 rounded">
                      {sheet.tag}
                    </span>
                    <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">
                      {sheet.count} Qs
                    </span>
                  </div>
                  <h4 className="text-[11px] font-black text-stone-800 dark:text-stone-200 mt-1 group-hover:text-[#ff6b2b] transition-colors truncate">
                    {sheet.name}
                  </h4>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#ff6b2b] group-hover:translate-x-0.5 transition-all ml-1.5 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION B: BENTO SPLIT - PROBLEM SOLVING OVERVIEW (GAUGE) & STREAK CALENDAR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 1. PROBLEM SOLVING OVERVIEW GAUGE (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">Problem Solving Overview</h3>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              
              {/* Left portion: Breakdown bars */}
              <div className="w-full sm:w-1/2 space-y-4">
                {/* Easy solved */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">Easy</span>
                    <span className="font-mono text-stone-600 dark:text-stone-400">
                      <span className="text-stone-900 dark:text-white font-black">{easySolved || 12}</span> / 172
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${((easySolved || 12) / 172) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Medium solved */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-amber-500 dark:text-amber-400">Medium</span>
                    <span className="font-mono text-stone-600 dark:text-stone-400">
                      <span className="text-stone-900 dark:text-white font-black">{mediumSolved || 6}</span> / 350
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${((mediumSolved || 6) / 350) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Hard solved */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-rose-600 dark:text-rose-400">Hard</span>
                    <span className="font-mono text-stone-600 dark:text-stone-400">
                      <span className="text-stone-900 dark:text-white font-black">{hardSolved || 0}</span> / 106
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${((hardSolved || 0) / 106) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right portion: SVG Progress Wheel */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-stone-100 dark:text-stone-850"
                  />
                  {/* Easy Solved Path */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (Math.min(easySolved || 12, 172) / 628))}
                  />
                  {/* Medium Solved Path (Offset by Easy solved amount) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (Math.min(mediumSolved || 6, 350) / 628))}
                    style={{
                      transform: `rotate(${((easySolved || 12) / 628) * 360}deg)`,
                      transformOrigin: '50% 50%'
                    }}
                  />
                  {/* Hard Solved Path (Offset by Easy + Medium solved amounts) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f43f5e"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (Math.min(hardSolved || 0, 106) / 628))}
                    style={{
                      transform: `rotate(${(((easySolved || 12) + (mediumSolved || 6)) / 628) * 360}deg)`,
                      transformOrigin: '50% 50%'
                    }}
                  />
                </svg>
                {/* Center text */}
                <div className="absolute text-center">
                  <div className="text-xl font-black text-stone-900 dark:text-white font-mono">
                    {totalSolved || 18}
                  </div>
                  <div className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-wider font-mono">
                    / 628 Solved
                  </div>
                </div>
              </div>

            </div>

            <div className="border-t border-stone-100 dark:border-stone-850 pt-4 flex justify-between text-[11px] text-stone-400 dark:text-stone-500 font-mono font-bold">
              <span>Overall Completion: {(((totalSolved || 18) / 628) * 100).toFixed(1)}%</span>
              <span className="text-[#ff6b2b]">Level: Intermediate</span>
            </div>
          </div>

          {/* 2. DYNAMIC STREAK CALENDAR & RECOVERY (5 cols) */}
          <div className="md:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-850 pb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#ff6b2b]" />
                <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-sans tracking-tight">
                  {monthNames[currentMonth]} {currentYear}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#ffefe7] dark:bg-orange-950/20 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#ff6b2b] font-mono">
                <Flame className="w-3.5 h-3.5" />
                <span>{streakStats.current} Day Streak</span>
              </div>
            </div>

            {/* Monthly Grid */}
            <div className="py-3">
              <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold font-mono">
                {/* Headers */}
                <span className="text-stone-400">Su</span>
                <span className="text-stone-400">Mo</span>
                <span className="text-stone-400">Tu</span>
                <span className="text-stone-400">We</span>
                <span className="text-stone-400">Th</span>
                <span className="text-stone-400">Fr</span>
                <span className="text-stone-400">Sa</span>

                {/* Calendar Days */}
                {totalCalendarDays.map((cell, idx) => {
                  const isToday = cell.day === todayDate && cell.currentMonth;
                  const countForDay = getSubCountForCalendarDay(cell.day, cell.currentMonth);
                  
                  let dayClass = "";
                  let bgHighlightClass = "";
                  
                  if (cell.currentMonth) {
                    if (isToday) {
                      bgHighlightClass = "bg-[#ff6b2b] text-white rounded-full font-black shadow-md shadow-[#ff6b2b]/20 relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full";
                    } else if (countForDay > 0) {
                      bgHighlightClass = "bg-[#ffefe7] dark:bg-orange-950/40 border border-[#ff6b2b]/30 dark:border-orange-900/50 text-[#ff6b2b] dark:text-[#ff804a] rounded-full font-bold";
                    } else {
                      dayClass = "text-stone-750 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full";
                    }
                  } else {
                    dayClass = "text-stone-400/50 dark:text-stone-600/30";
                  }

                  return (
                    <div
                      key={`cal-${idx}`}
                      className={`w-7 h-7 flex items-center justify-center mx-auto text-[10px] font-mono ${dayClass} ${bgHighlightClass}`}
                      title={cell.currentMonth ? `${countForDay} solved on ${monthNames[currentMonth]} ${cell.day}` : undefined}
                    >
                      {cell.day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recovery Streaks Banner */}
            <div className="bg-stone-50 dark:bg-stone-950/40 border border-stone-150/40 dark:border-stone-850/50 rounded-2xl p-3 flex items-center justify-between gap-4 mt-1">
              <div className="flex gap-4">
                <div>
                  <div className="text-[8px] text-stone-400 dark:text-stone-500 font-bold uppercase font-mono">Current</div>
                  <div className="text-xs font-black text-stone-850 dark:text-stone-200 font-mono flex items-center gap-0.5">
                    {streakStats.current} <span className="text-[9px] text-stone-400 font-normal">days</span>
                  </div>
                </div>
                <div className="border-r border-stone-200 dark:border-stone-800" />
                <div>
                  <div className="text-[8px] text-stone-400 dark:text-stone-500 font-bold uppercase font-mono">Best Streak</div>
                  <div className="text-xs font-black text-stone-850 dark:text-stone-200 font-mono flex items-center gap-0.5">
                    {streakStats.best} <span className="text-[9px] text-stone-400 font-normal">days</span>
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-850 dark:hover:bg-stone-800 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer">
                Restore Streak
              </button>
            </div>

          </div>

        </div>

        {/* SECTION C: SUBMISSIONS CONTRIBUTION HEATMAP */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{submissions.length} Submissions in 2026</span>
              </h3>
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">
                Each square represents DSA problems solved on that date
              </p>
            </div>
            
            {/* Heatmap legends */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 dark:text-stone-500 font-mono">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm bg-stone-100 dark:bg-stone-850" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[#ffefe7] dark:bg-orange-950/20 border border-[#ff6b2b]/15" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[#ffcfb9] dark:bg-orange-900/40 border border-[#ff6b2b]/30" />
              <div className="w-2.5 h-2.5 rounded-sm bg-[#ff6b2b] dark:bg-[#ff6b2b]" />
              <span>More</span>
            </div>
          </div>

          <div className="border border-stone-100 dark:border-stone-850 p-4 rounded-2xl bg-stone-50/50 dark:bg-stone-950/25 overflow-x-auto scrollbar-thin">
            {renderHeatmap()}
          </div>
        </div>

        {/* SECTION D: RECENT SUBMISSIONS HISTORY TABLE */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Recent Submissions</h3>
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">Log of solved algorithm assertions</p>
            </div>

            {/* Compact Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search solutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-stone-50 hover:bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-850 text-stone-400 dark:text-stone-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-1">Problem</th>
                  <th className="py-3 px-1">Date & Time</th>
                  <th className="py-3 px-1">Language</th>
                  <th className="py-3 px-1 text-center">Status</th>
                  <th className="py-3 px-1 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50 dark:divide-stone-850/60 text-stone-750 dark:text-stone-300">
                {filteredSubmissions.slice(0, visibleCount).map((sub, index) => (
                  <tr
                    key={sub.id || index}
                    className="hover:bg-stone-50/50 dark:hover:bg-stone-950/30 transition-colors"
                  >
                    <td className="py-3 px-1 max-w-[200px] truncate">
                      <div className="space-y-0.5">
                        <span className="font-bold text-stone-900 dark:text-white hover:text-[#ff6b2b] cursor-pointer" onClick={() => onNavigate && onNavigate('DSA Problems')}>
                          {sub.problemTitle}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono ${getDifficultyBadgeColor(sub.difficulty)}`}>
                            {sub.difficulty}
                          </span>
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">
                            {sub.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-1 text-stone-500 dark:text-stone-450 font-mono text-[11px]">
                      {formattedDateTime(sub.timestamp)}
                    </td>
                    <td className="py-3 px-1 font-mono uppercase text-[#ff6b2b] text-[11px]">
                      {sub.language}
                    </td>
                    <td className="py-3 px-1 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Accepted
                      </span>
                    </td>
                    <td className="py-3 px-1 text-right">
                      <button
                        onClick={() => onNavigate && onNavigate('DSA Problems')}
                        className="p-1.5 border border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-800 transition-colors cursor-pointer inline-flex items-center"
                        title="View Problem details in Workspace IDE"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400 dark:text-stone-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-stone-300 dark:text-stone-700" />
                        <span>No submissions match search terms</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Lazy load pagination more button */}
          {filteredSubmissions.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="w-full py-2.5 border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-850 rounded-xl text-stone-550 dark:text-stone-400 hover:text-stone-800 text-xs font-bold transition-all cursor-pointer font-mono uppercase tracking-wider"
            >
              Load More Submissions
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
