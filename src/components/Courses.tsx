import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, PlayCircle, CheckCircle, Clock, Star, 
  Search, SlidersHorizontal, BookOpenCheck, ArrowRight, ChevronDown, 
  ChevronUp, Lock, Award, Sparkles, Code, Play, CheckCircle2, User, Trophy
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'coding' | 'quiz';
}

interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  category: 'Algorithms' | 'Web Dev' | 'System Design' | 'Interview Prep';
  description: string;
  instructor: string;
  instructorTitle: string;
  duration: string;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled: boolean;
  progress: number;
  tags: string[];
  modules: CourseModule[];
}

const INITIAL_COURSES: Course[] = [
  {
    id: 'dsa-cpp',
    title: 'Data Structures & Algorithms Mastery (C++)',
    category: 'Algorithms',
    description: 'Master recursion, trees, graphs, and dynamic programming from absolute scratch using C++ STL. Fully optimized for competitive programming and tech giant interview rounds.',
    instructor: 'Siddharth Roy',
    instructorTitle: 'Ex-Google Staff Engineer',
    duration: '42 hrs',
    rating: 4.9,
    difficulty: 'Intermediate',
    enrolled: false,
    progress: 0,
    tags: ['C++', 'DSA', 'Algorithms', 'FAANG'],
    modules: [
      {
        id: 'cpp-m1',
        title: 'Module 1: Complexity Analysis & STL Containers',
        duration: '4 hrs',
        lessons: [
          { id: 'cpp-l1', title: 'Asymptotic Notations & Math Prep', duration: '45m', completed: false, type: 'video' },
          { id: 'cpp-l2', title: 'Under the Hood: Vectors & Allocations', duration: '55m', completed: false, type: 'coding' },
          { id: 'cpp-l3', title: 'Unordered Maps vs Maps Complexity', duration: '60m', completed: false, type: 'video' },
          { id: 'cpp-l4', title: 'Interactive STL Container Quiz', duration: '20m', completed: false, type: 'quiz' }
        ]
      },
      {
        id: 'cpp-m2',
        title: 'Module 2: Advanced Dynamic Programming',
        duration: '12 hrs',
        lessons: [
          { id: 'cpp-l5', title: 'DP State Reduction and Bitmasking', duration: '75m', completed: false, type: 'video' },
          { id: 'cpp-l6', title: 'Tree DP & Rerouting Techniques', duration: '90m', completed: false, type: 'coding' },
          { id: 'cpp-l7', title: 'Digit DP for Numerical Ranges', duration: '80m', completed: false, type: 'video' }
        ]
      },
      {
        id: 'cpp-m3',
        title: 'Module 3: Graph Structures and Network Flows',
        duration: '15 hrs',
        lessons: [
          { id: 'cpp-l8', title: 'Hierarchical Dictionaries & Trie Basics', duration: '60m', completed: false, type: 'coding' },
          { id: 'cpp-l9', title: 'Tarjan\'s Bridge & SCC Algorithms', duration: '90m', completed: false, type: 'video' },
          { id: 'cpp-l10', title: 'Segment Trees with Lazy Propagation', duration: '120m', completed: false, type: 'coding' }
        ]
      }
    ]
  },
  {
    id: 'sys-design-hld',
    title: 'High-Level System Design & Microservices',
    category: 'System Design',
    description: 'Learn to architect distributed, highly-scalable, and fault-tolerant cloud infrastructures. Cover sharding, load balancers, rate limiters, CDN, and Kafka pipelines.',
    instructor: 'Alex DeBrie',
    instructorTitle: 'AWS Serverless Hero',
    duration: '28 hrs',
    rating: 4.8,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['HLD', 'Microservices', 'Kafka', 'System Design'],
    modules: [
      {
        id: 'sys-m1',
        title: 'Module 1: Vertical vs Horizontal Scalability',
        duration: '5 hrs',
        lessons: [
          { id: 'sys-l1', title: 'Consistent Hashing and Ring Routing', duration: '50m', completed: false, type: 'video' },
          { id: 'sys-l2', title: 'Caching Topologies: Write-through vs Write-back', duration: '65m', completed: false, type: 'video' },
          { id: 'sys-l3', title: 'Rate Limiter Implementations (Token Bucket)', duration: '45m', completed: false, type: 'coding' }
        ]
      },
      {
        id: 'sys-m2',
        title: 'Module 2: Databases at Scale',
        duration: '8 hrs',
        lessons: [
          { id: 'sys-l4', title: 'Replication Lag & Eventual Consistency', duration: '75m', completed: false, type: 'video' },
          { id: 'sys-l5', title: 'NoSQL Internals: LSM Trees vs B-Trees', duration: '90m', completed: false, type: 'video' }
        ]
      }
    ]
  },
  {
    id: 'web-react-next',
    title: 'Full-Stack Production Engineering (Next.js & React)',
    category: 'Web Dev',
    description: 'Build enterprise-grade full-stack web platforms using Next.js App Router, Tailwind CSS, PostgreSQL, Drizzle ORM, and secure Redis rate limiting.',
    instructor: 'Sarah Jenkins',
    instructorTitle: 'Principal Dev Advocate at Vercel',
    duration: '35 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['React', 'Next.js', 'PostgreSQL', 'Tailwind'],
    modules: [
      {
        id: 'web-m1',
        title: 'Module 1: Server Components & Hydration Engine',
        duration: '6 hrs',
        lessons: [
          { id: 'web-l1', title: 'Understanding RSC, Suspense & Streaming', duration: '55m', completed: false, type: 'video' },
          { id: 'web-l2', title: 'Dynamic Layout Routing and Interceptors', duration: '70m', completed: false, type: 'coding' },
          { id: 'web-l3', title: 'Server Actions Security Benchmarks', duration: '40m', completed: false, type: 'video' }
        ]
      },
      {
        id: 'web-m2',
        title: 'Module 2: Database Layer & Cache Management',
        duration: '10 hrs',
        lessons: [
          { id: 'web-l4', title: 'Relational Database Architectures & Indexes', duration: '60m', completed: false, type: 'video' },
          { id: 'web-l5', title: 'Drizzle Migrations & Complex Inner Joins', duration: '80m', completed: false, type: 'coding' },
          { id: 'web-l6', title: 'Redis Cache Eviction Policies & Session Store', duration: '50m', completed: false, type: 'coding' }
        ]
      }
    ]
  },
  {
    id: 'faang-interview-bootcamp',
    title: 'FAANG Interview Prep Intensive',
    category: 'Interview Prep',
    description: 'Get hired at Meta, Google, Apple, Amazon, or Netflix. A rigorous bootcamp containing mock interviews, behavior strategies, and optimal coding patterns.',
    instructor: 'Yuan Chang',
    instructorTitle: 'Former Meta Senior Bar Raiser',
    duration: '18 hrs',
    rating: 4.9,
    difficulty: 'Advanced',
    enrolled: false,
    progress: 0,
    tags: ['Interviews', 'FAANG', 'Mock Prep', 'Careers'],
    modules: [
      {
        id: 'fn-m1',
        title: 'Module 1: Demystifying the Coding Interview Round',
        duration: '4 hrs',
        lessons: [
          { id: 'fn-l1', title: 'How Interviewers Score Code Quality', duration: '40m', completed: false, type: 'video' },
          { id: 'fn-l2', title: 'The 7-Step Method to Tackle Unseen Problems', duration: '50m', completed: false, type: 'video' }
        ]
      },
      {
        id: 'fn-m2',
        title: 'Module 2: Behavioral Star Method & Negotiations',
        duration: '4 hrs',
        lessons: [
          { id: 'fn-l3', title: 'Crafting Leadership & Conflict Bio Narratives', duration: '60m', completed: false, type: 'video' },
          { id: 'fn-l4', title: 'Salary Negotiation: Secrets from a Bar Raiser', duration: '45m', completed: false, type: 'video' }
        ]
      }
    ]
  }
];

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('leetmaster_courses_state');
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
      localStorage.setItem('leetmaster_courses_state', JSON.stringify(courses));
    }
  }, [courses]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'cpp-m1': true,
    'web-m1': true
  });

  const categories = ['All', 'Algorithms', 'Web Dev', 'System Design', 'Interview Prep'];

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
  };

  // Toggle Lesson Completion
  const handleToggleLesson = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        // Toggle lesson in modules
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

        // Recalculate course overall progress
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

  return (
    <div className="space-y-8 select-none">
      
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-150/60 dark:border-stone-850/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 text-[#ff6b2b] dark:text-[#ff804a] rounded-full text-[10px] font-black uppercase tracking-wider font-mono mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Elite Cohort Curriculum
          </div>
          <h1 className="text-2xl font-sans font-black text-stone-900 dark:text-stone-50 tracking-tight">
            Developer Learning Paths
          </h1>
          <p className="text-xs text-stone-450 dark:text-stone-500 font-semibold font-mono uppercase tracking-wider mt-0.5">
            Structured syllabi curated by staff engineers with real-world project builds
          </p>
        </div>

        {/* Back to catalog button if viewing detail */}
        {activeCourseId && (
          <button
            onClick={() => setActiveCourseId(null)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-stone-200/40 dark:border-stone-800/60"
          >
            ← Back to Course Catalog
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeCourseId ? (
          <motion.div
            key="catalog-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search & Filters Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#ffefe7] border-[#ff6b2b]/30 text-[#ff6b2b]'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 dark:bg-stone-900/40 dark:border-stone-800/80 dark:text-stone-400 dark:hover:bg-stone-850'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search courses, stacks, instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-stone-50 hover:bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b2b]/20 focus:border-[#ff6b2b] transition-all"
                />
              </div>
            </div>

            {/* Courses Catalog Grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 bg-stone-50 dark:bg-stone-950/40 border border-stone-150/40 dark:border-stone-850/50 rounded-3xl space-y-3">
                <BookOpenCheck className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">No courses match your query</h3>
                <p className="text-xs text-stone-450 dark:text-stone-500">Try adjusting your filters or clearing the search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
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

                      {/* Title & Desc */}
                      <div className="space-y-1">
                        <h3 
                          onClick={() => setActiveCourseId(course.id)}
                          className="text-base font-black text-stone-850 dark:text-stone-150 tracking-tight leading-snug cursor-pointer hover:text-[#ff6b2b] dark:hover:text-orange-400 transition-colors"
                        >
                          {course.title}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-850 p-2.5 rounded-2xl">
                        <div className="w-7 h-7 rounded-full bg-[#ffefe7] text-[#ff6b2b] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-stone-700 dark:text-stone-300 truncate">{course.instructor}</p>
                          <p className="text-[9px] font-semibold text-stone-450 dark:text-stone-500 truncate">{course.instructorTitle}</p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {course.tags.map(t => (
                          <span key={t} className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-850 px-2 py-0.5 rounded-lg border border-stone-200/20">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Progress / CTA */}
                    <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between gap-4">
                      {course.enrolled ? (
                        <div className="flex-1 space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400">
                            <span>COURSE PROGRESS</span>
                            <span className="text-[#ff6b2b]">{course.progress}% COMPLETE</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-[#ff6b2b] rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase">
                          Not Enrolled Yet
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (course.enrolled) {
                            setActiveCourseId(course.id);
                          } else {
                            handleEnroll(course.id);
                          }
                        }}
                        className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                          course.enrolled
                            ? 'bg-[#ffefe7] hover:bg-[#ff6b2b] hover:text-white text-[#ff6b2b] dark:bg-[#3d2417] dark:text-[#ff804a]'
                            : 'bg-stone-900 hover:bg-[#ff6b2b] dark:bg-stone-800 dark:hover:bg-[#ff6b2b] text-white'
                        }`}
                      >
                        <span>{course.enrolled ? 'Resume Syllabus' : 'Enroll Now'}</span>
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
            key="course-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Area - Syllabus and Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Course detail header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-black text-[#ff6b2b] dark:text-[#ff804a] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeCourse.category}
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-850 px-2 py-0.5 rounded-full uppercase">
                    {activeCourse.difficulty} level
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-stone-850 dark:text-stone-100 tracking-tight leading-tight">
                  {activeCourse.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {activeCourse.description}
                </p>
              </div>

              {/* Syllabus Accordion Header */}
              <div className="border-t border-stone-150/60 dark:border-stone-850/60 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">
                    Course Syllabus & Core Modules
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-stone-400 dark:text-stone-500">
                    {activeCourse.modules.flatMap(m => m.lessons).length} Lessons total
                  </span>
                </div>

                {/* Modules map */}
                <div className="space-y-4">
                  {activeCourse.modules.map((mod) => {
                    const isExpanded = !!expandedModules[mod.id];
                    const completedInMod = mod.lessons.filter(l => l.completed).length;
                    const totalInMod = mod.lessons.length;

                    return (
                      <div 
                        key={mod.id}
                        className="border border-stone-200/80 dark:border-stone-850 rounded-2xl bg-white dark:bg-[#151412] overflow-hidden transition-all shadow-sm"
                      >
                        {/* Module header trigger */}
                        <div
                          onClick={() => toggleModule(mod.id)}
                          className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900/30 select-none"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="text-xs sm:text-sm font-black text-stone-800 dark:text-stone-200 truncate">
                              {mod.title}
                            </h4>
                            <div className="flex items-center gap-2.5 text-[10px] font-mono text-stone-400 dark:text-stone-500 font-bold">
                              <span>{mod.duration}</span>
                              <span>•</span>
                              <span className="text-[#ff6b2b]">
                                {completedInMod}/{totalInMod} Solved
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {completedInMod === totalInMod && totalInMod > 0 ? (
                              <CheckCircle2 className="w-4.5 h-4.5 text-green-500 flex-shrink-0" />
                            ) : null}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400" />
                            )}
                          </div>
                        </div>

                        {/* Lessons inside Module Accordion */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-stone-100 dark:border-stone-850 divide-y divide-stone-50 dark:divide-stone-850/60 bg-stone-50/30 dark:bg-stone-950/10"
                            >
                              {mod.lessons.map((les) => (
                                <div
                                  key={les.id}
                                  className="p-3.5 px-4 flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <button
                                      onClick={() => handleToggleLesson(activeCourse.id, mod.id, les.id)}
                                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                                        les.completed
                                          ? 'bg-green-500 border-green-500 text-white shadow-sm'
                                          : 'bg-white border-stone-250 dark:bg-stone-900 dark:border-stone-800 hover:border-[#ff6b2b]'
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

                                  <button
                                    onClick={() => handleToggleLesson(activeCourse.id, mod.id, les.id)}
                                    className="p-1.5 border border-stone-200 dark:border-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-400 hover:text-[#ff6b2b] transition-colors cursor-pointer inline-flex items-center"
                                    title={les.completed ? "Mark incomplete" : "Mark completed"}
                                  >
                                    {les.completed ? (
                                      <PlayCircle className="w-3.5 h-3.5" />
                                    ) : (
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Area - Metadata Side Panel */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Progress Panel */}
              <div className="bg-stone-50 dark:bg-[#151412] border border-stone-200/70 dark:border-stone-850/80 rounded-3xl p-5 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">
                  Syllabus Progress Stats
                </h3>

                <div className="space-y-4">
                  {/* Progress wheel or percent bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-stone-850 dark:text-stone-200">
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

                  {/* Modules complete text */}
                  <div className="border-t border-stone-200/30 dark:border-stone-800/30 pt-3 space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-stone-550 dark:text-stone-400">
                      <span>Total Syllabus Lessons:</span>
                      <span className="font-mono">{activeCourse.modules.flatMap(m => m.lessons).length}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-stone-550 dark:text-stone-400">
                      <span>Lessons Completed:</span>
                      <span className="font-mono text-green-500 font-black">
                        {activeCourse.modules.flatMap(m => m.lessons).filter(l => l.completed).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-stone-550 dark:text-stone-400">
                      <span>Course Rating:</span>
                      <span className="font-mono text-amber-500 font-black flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {activeCourse.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Completion Reward Badge if 100% */}
                {activeCourse.progress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center gap-2"
                  >
                    <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0 animate-bounce" />
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wider font-mono">Milestone Gained</h4>
                      <p className="text-[9px] font-medium opacity-90">Congratulations! You have completed all modules in this pathway.</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Instructor Bio Profile */}
              <div className="bg-stone-50/50 dark:bg-[#151412]/50 border border-stone-200/40 dark:border-stone-850/40 rounded-3xl p-5 space-y-3.5">
                <h3 className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500 font-mono">
                  Syllabus Author Bio
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ffefe7] text-[#ff6b2b] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-800 dark:text-stone-200">{activeCourse.instructor}</h4>
                      <p className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 font-mono">{activeCourse.instructorTitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Siddharth is an algorithmist with 12+ years experience lecturing advanced algorithms and optimization techniques. Author of various competitive textbooks and open-source packages.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
