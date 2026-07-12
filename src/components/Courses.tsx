import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, PlayCircle, CheckCircle, Clock, Star, 
  Search, BookOpenCheck, ArrowRight, ChevronDown, ChevronUp, 
  CheckCircle2, User, Trophy, Copy, Check, ChevronRight, BookOpen as BookIcon,
  Play, Sparkles, Code
} from 'lucide-react';
import { 
  INITIAL_COURSES, COURSE_CATEGORIES, Course, Lesson, CourseModule 
} from '../data/coursesData';

export default function Courses() {
  // Use v3 namespace to reset legacy pre-enrolled localStorage states
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('sab_tech_courses_state_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading initial courses state:', e);
      }
    }
    return INITIAL_COURSES;
  });

  useEffect(() => {
    if (courses && courses.length > 0) {
      localStorage.setItem('sab_tech_courses_state_v3', JSON.stringify(courses));
    }
  }, [courses]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Auto expand first module when a course is opened
  useEffect(() => {
    if (activeCourseId) {
      const course = courses.find(c => c.id === activeCourseId);
      if (course && course.modules.length > 0) {
        setExpandedModules(prev => ({
          ...prev,
          [course.modules[0].id]: true
        }));
      }
    }
  }, [activeCourseId]);

  // Toggle Module Accordion
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Enroll in a Course
  const handleEnroll = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, enrolled: true, progress: 0 };
      }
      return c;
    }));
    
    // Automatically select the first lesson to start studying right away!
    const course = courses.find(c => c.id === courseId);
    if (course && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      setActiveCourseId(courseId);
      setActiveLessonId(course.modules[0].lessons[0].id);
    }
  };

  // Toggle Lesson Completion
  const handleToggleLesson = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const updatedModules = c.modules.map(mod => {
          if (mod.id === moduleId) {
            return {
              ...mod,
              lessons: mod.lessons.map(les => {
                if (les.id === lessonId) {
                  return { ...les, completed: !les.completed };
                }
                return les;
              })
            };
          }
          return mod;
        });

        const allLessons = updatedModules.flatMap(m => m.lessons);
        const completedCount = allLessons.filter(l => l.completed).length;
        const totalCount = allLessons.length;
        const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          ...c,
          modules: updatedModules,
          progress: newProgress
        };
      }
      return c;
    }));
  };

  // Copy Code to Clipboard
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filtering Logic
  const filteredCourses = courses.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeCourse = courses.find(c => c.id === activeCourseId);

  // Lesson traversal list inside active course
  const courseLessonsList = activeCourse 
    ? activeCourse.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id }))) 
    : [];

  const currentLessonIndex = activeCourseId && activeLessonId 
    ? courseLessonsList.findIndex(l => l.id === activeLessonId) 
    : -1;

  const activeLesson = currentLessonIndex !== -1 ? courseLessonsList[currentLessonIndex] : null;

  // Next and Previous lesson navigation helpers
  const handleNextLesson = () => {
    if (currentLessonIndex !== -1 && currentLessonIndex < courseLessonsList.length - 1) {
      setActiveLessonId(courseLessonsList[currentLessonIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex !== -1 && currentLessonIndex > 0) {
      setActiveLessonId(courseLessonsList[currentLessonIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Simple Inline Markdown and Code Formatter
  function renderLessonContent(content: string) {
    if (!content) return null;
    
    const lines = content.split('\n');
    const renderedElements: React.ReactNode[] = [];
    let codeBuffer: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let blockKey = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          const codeText = codeBuffer.join('\n');
          const currentCode = codeText;
          const isCopied = copiedText === currentCode;
          
          renderedElements.push(
            <div key={`code-${blockKey++}`} className="my-4 bg-stone-950 dark:bg-black rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-850 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
                <span className="text-[10px] font-mono text-stone-550 dark:text-stone-400 uppercase tracking-wider font-extrabold">
                  {codeLanguage || 'code'} snippet
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(currentCode)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black text-stone-600 dark:text-stone-400 hover:text-[#ff6b2b] dark:hover:text-[#ff804a] transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500 stroke-[3]" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-stone-200 leading-relaxed whitespace-pre bg-stone-950">
                <code>{currentCode}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          codeLanguage = line.slice(3).trim();
          inCodeBlock = true;
        }
      } else if (inCodeBlock) {
        codeBuffer.push(line);
      } else {
        if (line.startsWith('### ')) {
          renderedElements.push(
            <h3 key={`h3-${blockKey++}`} className="text-sm font-black text-stone-900 dark:text-stone-100 tracking-tight mt-6 mb-2 border-l-4 border-[#ff6b2b] pl-2.5">
              {line.slice(4)}
            </h3>
          );
        } else if (line.startsWith('## ')) {
          renderedElements.push(
            <h2 key={`h2-${blockKey++}`} className="text-base font-black text-stone-900 dark:text-stone-50 tracking-tight mt-6 mb-3 border-b border-stone-200 dark:border-stone-850 pb-1.5">
              {line.slice(3)}
            </h2>
          );
        } else if (line.startsWith('1. ') || line.startsWith('- ')) {
          const isOrdered = line.startsWith('1. ');
          const text = isOrdered ? line.slice(3) : line.slice(2);
          renderedElements.push(
            <div key={`li-${blockKey++}`} className="flex items-start gap-2.5 my-1.5 pl-1.5">
              <span className="text-[#ff6b2b] font-black text-xs select-none mt-1">
                {isOrdered ? '•' : '–'}
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed flex-1">
                {parseInlineHighlights(text)}
              </p>
            </div>
          );
        } else if (line.trim() === '') {
          renderedElements.push(<div key={`space-${blockKey++}`} className="h-1" />);
        } else {
          renderedElements.push(
            <p key={`p-${blockKey++}`} className="text-xs sm:text-sm text-stone-600 dark:text-stone-350 leading-relaxed my-2">
              {parseInlineHighlights(line)}
            </p>
          );
        }
      }
    }

    if (inCodeBlock && codeBuffer.length > 0) {
      renderedElements.push(
        <pre key="code-unclosed" className="p-4 bg-stone-950 text-stone-200 font-mono text-xs rounded-xl overflow-x-auto">
          {codeBuffer.join('\n')}
        </pre>
      );
    }

    return <div className="space-y-2">{renderedElements}</div>;
  }

  function parseInlineHighlights(text: string) {
    const parts = text.split('**');
    if (parts.length <= 1) return text;
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-stone-900 dark:text-white bg-orange-50/70 dark:bg-orange-950/20 px-1 rounded">{part}</strong>;
      }
      
      const codeParts = part.split('`');
      if (codeParts.length > 1) {
        return codeParts.map((sub, sIdx) => {
          if (sIdx % 2 === 1) {
            return <code key={sIdx} className="font-mono text-xs font-bold text-[#ff6b2b] dark:text-[#ff804a] bg-stone-100 dark:bg-stone-900 px-1.5 py-0.5 rounded border border-stone-200/50 dark:border-stone-800/40">{sub}</code>;
          }
          return sub;
        });
      }
      return part;
    });
  }

  return (
    <div className="space-y-8 select-none" id="courses-learning-catalog">
      
      {/* Dynamic Main Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-150/60 dark:border-stone-850/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 text-[#ff6b2b] dark:text-[#ff804a] rounded-full text-[10px] font-black uppercase tracking-wider font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5 animate-pulse" />
            Sab Technologies Roadmap
          </div>
          <h1 className="text-2xl font-sans font-black text-stone-900 dark:text-stone-50 tracking-tight">
            Comprehensive Syllabus Catalog
          </h1>
          <p className="text-xs text-stone-450 dark:text-stone-500 font-semibold font-mono uppercase tracking-wider mt-0.5">
            45 step-by-step masteries, from beginner foundations to advanced architecture
          </p>
        </div>

        {activeCourseId && (
          <button
            type="button"
            onClick={() => {
              setActiveCourseId(null);
              setActiveLessonId(null);
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-stone-200/40 dark:border-stone-800/60"
          >
            ← Back to Syllabus Catalog
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeCourseId ? (
          <motion.div
            key="catalog-list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter controls */}
            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full xl:w-auto pb-1">
                {COURSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#ffefe7] border-[#ff6b2b]/30 text-[#ff6b2b] dark:bg-stone-900 dark:border-[#ff6b2b] dark:text-[#ff804a]'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 dark:bg-stone-950/40 dark:border-stone-850 dark:text-stone-400 dark:hover:bg-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search filter */}
              <div className="relative w-full xl:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search courses, keywords, stacks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-150 placeholder-stone-400 dark:placeholder-stone-500 bg-stone-50 hover:bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b] transition-all"
                />
              </div>
            </div>

            {/* Courses grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 bg-stone-50 dark:bg-stone-950/40 border border-stone-150/40 dark:border-stone-850/50 rounded-3xl space-y-3">
                <BookOpenCheck className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">No roadmaps matched your filters</h3>
                <p className="text-xs text-stone-450 dark:text-stone-500">Try selecting "All" or adjusting your search query keyword</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    id={`course-card-${course.id}`}
                    className="bg-white dark:bg-[#151412] border border-stone-200/70 dark:border-stone-850/80 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all group hover:border-[#ff6b2b]/30"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-black text-[#ff6b2b] dark:text-[#ff804a] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {course.category}
                        </span>
                        
                        <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 dark:text-stone-500">
                          <span className="flex items-center gap-1 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {course.rating}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h3 
                          onClick={() => {
                            setActiveCourseId(course.id);
                            if (course.enrolled && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
                              setActiveLessonId(course.modules[0].lessons[0].id);
                            }
                          }}
                          className="text-base font-black text-stone-850 dark:text-stone-150 tracking-tight leading-snug cursor-pointer hover:text-[#ff6b2b] dark:hover:text-orange-400 transition-colors"
                        >
                          {course.title}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-900/40 border border-stone-100/70 dark:border-stone-850/60 p-2 rounded-2xl">
                        <div className="w-6 h-6 rounded-full bg-[#ffefe7] dark:bg-stone-800 text-[#ff6b2b] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          <User className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-stone-700 dark:text-stone-300 truncate">{course.instructor}</p>
                          <p className="text-[8px] font-semibold text-stone-450 dark:text-stone-500 truncate">{course.instructorTitle}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {course.tags.map(t => (
                          <span key={t} className="text-[8px] font-mono font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-850 px-2 py-0.5 rounded-md">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress tracker bar & Actions */}
                    <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between gap-4">
                      {course.enrolled ? (
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400">
                            <span>PROGRESS</span>
                            <span className="text-[#ff6b2b]">{course.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-[#ff6b2b] rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono font-black text-stone-400 dark:text-stone-500 uppercase tracking-wide">
                          No Enrollment yet
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (course.enrolled) {
                            setActiveCourseId(course.id);
                            if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
                              setActiveLessonId(course.modules[0].lessons[0].id);
                            }
                          } else {
                            handleEnroll(course.id);
                          }
                        }}
                        className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          course.enrolled
                            ? 'bg-[#ffefe7] hover:bg-[#ff6b2b] hover:text-white text-[#ff6b2b] dark:bg-stone-900/60 dark:text-[#ff804a] dark:hover:bg-[#ff6b2b] dark:hover:text-white border border-transparent hover:border-transparent'
                            : 'bg-stone-900 hover:bg-[#ff6b2b] dark:bg-stone-800 dark:hover:bg-[#ff6b2b] text-white'
                        }`}
                      >
                        <span>{course.enrolled ? 'Resume Study' : 'Start Path'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="syllabus-study-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Area - Syllabus and Content Selector */}
            <div className={`space-y-6 ${activeLessonId ? 'lg:col-span-5' : 'lg:col-span-8'}`}>
              
              {/* Syllabus metadata headers */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-black text-[#ff6b2b] dark:text-[#ff804a] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeCourse.category}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-850 px-2 py-0.5 rounded-full uppercase">
                    {activeCourse.difficulty} level
                  </span>
                </div>

                <h2 className="text-xl font-black text-stone-850 dark:text-stone-50 tracking-tight leading-tight">
                  {activeCourse.title}
                </h2>

                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {activeCourse.description}
                </p>
              </div>

              {/* Modules List Accordion */}
              <div className="border-t border-stone-150/60 dark:border-stone-850/60 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 dark:text-stone-500 font-mono">
                    Course Syllabus Outline
                  </h3>
                  <span className="text-[10px] font-mono font-black text-stone-400 dark:text-stone-500">
                    {courseLessonsList.length} Lessons total
                  </span>
                </div>

                <div className="space-y-3">
                  {activeCourse.modules.map((mod: CourseModule) => {
                    const isExpanded = !!expandedModules[mod.id];
                    const completedInMod = mod.lessons.filter(l => l.completed).length;
                    const totalInMod = mod.lessons.length;

                    return (
                      <div 
                        key={mod.id}
                        className="border border-stone-200/80 dark:border-stone-850 rounded-2xl bg-white dark:bg-[#151412] overflow-hidden transition-all shadow-sm"
                      >
                        <div
                          onClick={() => toggleModule(mod.id)}
                          className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900/30 select-none"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="text-xs sm:text-sm font-black text-stone-800 dark:text-stone-150 truncate">
                              {mod.title}
                            </h4>
                            <div className="flex items-center gap-2.5 text-[10px] font-mono text-stone-400 dark:text-stone-550 font-bold">
                              <span>{mod.duration}</span>
                              <span>•</span>
                              <span className="text-[#ff6b2b]">
                                {completedInMod}/{totalInMod} Completed
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {completedInMod === totalInMod && totalInMod > 0 ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : null}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400" />
                            )}
                          </div>
                        </div>

                        {/* Expandable lessons list */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="border-t border-stone-100 dark:border-stone-850 divide-y divide-stone-50 dark:divide-stone-850/60 bg-stone-50/30 dark:bg-stone-950/10"
                            >
                              {mod.lessons.map((les: Lesson) => {
                                const isLessonActive = activeLessonId === les.id;
                                return (
                                  <div
                                    key={les.id}
                                    onClick={() => {
                                      // If not enrolled, enroll first to study
                                      if (!activeCourse.enrolled) {
                                        handleEnroll(activeCourse.id);
                                      }
                                      setActiveLessonId(les.id);
                                    }}
                                    className={`p-3 px-4 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                                      isLessonActive
                                        ? 'bg-[#ffefe7]/50 dark:bg-stone-900/60 border-l-4 border-[#ff6b2b]'
                                        : 'hover:bg-stone-50/80 dark:hover:bg-stone-900/30'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {/* Complete checkbox indicator */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!activeCourse.enrolled) {
                                            handleEnroll(activeCourse.id);
                                          }
                                          handleToggleLesson(activeCourse.id, mod.id, les.id);
                                        }}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                                          les.completed
                                            ? 'bg-green-500 border-green-500 text-white shadow-sm'
                                            : 'bg-white border-stone-300 dark:bg-stone-900 dark:border-stone-800 hover:border-[#ff6b2b]'
                                        }`}
                                      >
                                        {les.completed && (
                                          <svg className="w-3.5 h-3.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </button>

                                      <div className="min-w-0">
                                        <p className={`text-xs font-bold leading-snug truncate ${
                                          les.completed 
                                            ? 'text-stone-400 dark:text-stone-500 line-through font-semibold' 
                                            : 'text-stone-750 dark:text-stone-200'
                                        }`}>
                                          {les.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-[9px] font-mono text-stone-400 dark:text-stone-500 mt-0.5 uppercase">
                                          <span className="font-extrabold text-[#ff6b2b]/80">{les.type}</span>
                                          <span>•</span>
                                          <span>{les.duration} duration</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      {isLessonActive && (
                                        <span className="text-[9px] font-mono font-bold bg-[#ff6b2b] text-white px-2 py-0.5 rounded-full uppercase scale-90">
                                          studying
                                        </span>
                                      )}
                                      <span className="text-stone-400 group-hover:text-stone-600">
                                        <ChevronRight className="w-4 h-4" />
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Area - Metadata OR Study Console panel */}
            <div className={`space-y-6 ${activeLessonId ? 'lg:col-span-7' : 'lg:col-span-4'}`}>
              
              <AnimatePresence mode="wait">
                {activeLesson ? (
                  // --- SYLLABUS LESSON STUDY CONSOLE PANEL ---
                  <motion.div
                    key={`study-panel-${activeLesson.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white dark:bg-[#151412] border border-stone-200/90 dark:border-stone-850/80 rounded-3xl p-6 shadow-sm space-y-6"
                  >
                    {/* Header console */}
                    <div className="border-b border-stone-100 dark:border-stone-850 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-mono font-black bg-orange-100 dark:bg-stone-900 text-[#ff6b2b] dark:text-[#ff804a] px-2 py-0.5 rounded">
                            ACTIVE CONSOLE
                          </span>
                          <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">
                            {activeLesson.duration}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-stone-900 dark:text-stone-50 tracking-tight leading-snug">
                          {activeLesson.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const activeModuleId = activeCourse.modules.find(m => 
                            m.lessons.some(l => l.id === activeLesson.id)
                          )?.id;
                          if (activeModuleId) {
                            handleToggleLesson(activeCourse.id, activeModuleId, activeLesson.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeLesson.completed
                            ? 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/40'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-850 dark:text-stone-350 dark:hover:bg-stone-800'
                        }`}
                      >
                        {activeLesson.completed ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Solved!</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-stone-400" />
                            <span>Mark Solved</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Rich Explanation Guide & Code blocks */}
                    <div className="space-y-4 max-h-[58vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
                      {renderLessonContent(activeLesson.content)}
                    </div>

                    {/* Footer Traversal Navigations */}
                    <div className="border-t border-stone-100 dark:border-stone-850 pt-5 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePrevLesson}
                        disabled={currentLessonIndex === 0}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 dark:text-stone-300 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        ← Prev Lesson
                      </button>

                      <span className="text-[10px] font-mono font-extrabold text-stone-400 dark:text-stone-500">
                        {currentLessonIndex + 1} / {courseLessonsList.length}
                      </span>

                      <button
                        type="button"
                        onClick={handleNextLesson}
                        disabled={currentLessonIndex === courseLessonsList.length - 1}
                        className="px-4 py-2 bg-stone-900 hover:bg-[#ff6b2b] dark:bg-stone-800 dark:hover:bg-[#ff6b2b] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Next Lesson →
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  // --- DEFAULT STATS PANEL (WHEN NO LESSON STUDIED) ---
                  <div className="space-y-6">
                    
                    {/* Course progress overview */}
                    <div className="bg-stone-50 dark:bg-[#151412] border border-stone-200/70 dark:border-stone-850/80 rounded-3xl p-5 space-y-4 shadow-sm">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">
                        Syllabus Progress Stats
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline text-stone-850 dark:text-stone-250">
                            <span className="text-2xl font-black font-mono tracking-tight">{activeCourse.progress}%</span>
                            <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase">
                              Syllabus Comp.
                            </span>
                          </div>
                          <div className="w-full h-2 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-[#ff6b2b] rounded-full transition-all duration-500"
                              style={{ width: `${activeCourse.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="border-t border-stone-200/30 dark:border-stone-800/30 pt-3 space-y-2">
                          <div className="flex justify-between text-[11px] font-bold text-stone-600 dark:text-stone-400">
                            <span>Total Syllabus Lessons:</span>
                            <span className="font-mono">{courseLessonsList.length}</span>
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-stone-600 dark:text-stone-400">
                            <span>Lessons Completed:</span>
                            <span className="font-mono text-green-500 font-black">
                              {courseLessonsList.filter(l => l.completed).length}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-stone-600 dark:text-stone-400">
                            <span>Syllabus Rating:</span>
                            <span className="font-mono text-amber-500 font-black flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {activeCourse.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Celebration card if 100% complete */}
                      {activeCourse.progress === 100 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center gap-2"
                        >
                          <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0 animate-bounce" />
                          <div>
                            <h4 className="text-[11px] font-black uppercase tracking-wider font-mono">Milestone Unlocked</h4>
                            <p className="text-[9px] font-medium opacity-90">Outstanding job! You have fully resolved every lesson in this path.</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Prompt to start learning */}
                      {!activeCourse.enrolled ? (
                        <button
                          type="button"
                          onClick={() => handleEnroll(activeCourse.id)}
                          className="w-full py-3 bg-[#ffefe7] hover:bg-[#ff6b2b] text-[#ff6b2b] hover:text-white dark:bg-stone-900 dark:text-[#ff804a] dark:hover:bg-[#ff6b2b] dark:hover:text-white transition-all text-xs font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                          <BookIcon className="w-4 h-4" />
                          <span>Enroll to Start Studying</span>
                        </button>
                      ) : (
                        <div className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-200/55 dark:border-stone-800/60 rounded-2xl text-center space-y-1.5">
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 font-black">
                            Select any lesson on the left to read theory guides & copy codes.
                          </p>
                          <p className="text-[9px] text-stone-450 dark:text-stone-500 font-bold uppercase font-mono">
                            Interactive Study Mode active
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Instructor Profile Bio */}
                    <div className="bg-stone-50/50 dark:bg-[#151412]/50 border border-stone-200/40 dark:border-stone-850/40 rounded-3xl p-5 space-y-3.5 shadow-sm">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">
                        Author & Coach Info
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#ffefe7] text-[#ff6b2b] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-stone-800 dark:text-stone-200">{activeCourse.instructor}</h4>
                            <p className="text-[10px] font-semibold text-stone-450 dark:text-stone-500 font-mono">{activeCourse.instructorTitle}</p>
                          </div>
                        </div>
                        
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                          Syllabus author focuses on structural teaching with practical examples and code snippets tailored for real-world setups.
                        </p>
                      </div>
                    </div>

                  </div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
