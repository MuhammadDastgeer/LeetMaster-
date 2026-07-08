import { getPresetQuizzes } from '../data/quizDatabase';
import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Brain, HelpCircle, ArrowRight, RotateCcw, 
  CheckCircle2, XCircle, ChevronRight, Award, Flame, 
  Clock, Plus, Trash2, Save, FileText, Sparkles, BookOpen, BarChart3,
  Database, Terminal, Cpu, Code2, Binary, Braces, FileSpreadsheet, Layers
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  icon: any;
  questions: Question[];
}

const PRESET_QUIZZES: QuizTopic[] = getPresetQuizzes();




export default function Quiz() {
  const [quizzes, setQuizzes] = useState<QuizTopic[]>(() => {
    const saved = localStorage.getItem('leetmaster_custom_quizzes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map icon to preset icon if matching
        const loaded = parsed.map((q: any) => ({
          ...q,
          icon: Brain
        }));
        return [...PRESET_QUIZZES, ...loaded];
      } catch (e) {
        return PRESET_QUIZZES;
      }
    }
    return PRESET_QUIZZES;
  });

  const [activeTab, setActiveTab] = useState<'explore' | 'create' | 'stats'>('explore');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizTopic | null>(null);
  
  // High score tracking state
  const [completedScores, setCompletedScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('leetmaster_quiz_completed_scores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Playing quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answersState, setAnswersState] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [userXp, setUserXp] = useState<number>(() => {
    const saved = localStorage.getItem('leetmaster_user_xp');
    return saved ? parseInt(saved, 10) : 450;
  });

  // Create Custom Quiz Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newQuestions, setNewQuestions] = useState<Omit<Question, 'id'>[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
  ]);
  const [formSuccess, setFormSuccess] = useState('');

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleNextOrSubmit = () => {
    if (!selectedQuiz) return;
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

    if (!isAnswerSubmitted) {
      // Submit answer
      if (selectedOption === null) return;
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      setAnswersState(prev => ({
        ...prev,
        [currentQuestion.id]: { selected: selectedOption, isCorrect }
      }));
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
      setIsAnswerSubmitted(true);
    } else {
      // Go to next question or finish
      if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
      } else {
        // Finished
        setIsQuizFinished(true);
        // Calculate XP
        const totalQuestions = selectedQuiz.questions.length;
        const scoreRatio = correctCount / totalQuestions;
        const xpEarned = Math.round(selectedQuiz.xpReward * scoreRatio);
        
        const nextXp = userXp + xpEarned;
        setUserXp(nextXp);
        localStorage.setItem('leetmaster_user_xp', nextXp.toString());

        // Update high score in local storage and state
        const nextScores = { ...completedScores };
        const currentHighScore = nextScores[selectedQuiz.id] || 0;
        if (correctCount > currentHighScore) {
          nextScores[selectedQuiz.id] = correctCount;
          setCompletedScores(nextScores);
          localStorage.setItem('leetmaster_quiz_completed_scores', JSON.stringify(nextScores));
        }
      }
    }
  };

  const startQuiz = (quiz: QuizTopic) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswersState({});
    setCorrectCount(0);
    setIsQuizFinished(false);
  };

  const resetQuiz = () => {
    if (selectedQuiz) {
      startQuiz(selectedQuiz);
    }
  };

  // Custom Quiz creation helpers
  const handleAddQuestion = () => {
    setNewQuestions(prev => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (newQuestions.length === 1) return;
    setNewQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestionField = (qIdx: number, field: string, val: string) => {
    setNewQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        return { ...q, [field]: val };
      }
      return q;
    }));
  };

  const handleUpdateOption = (qIdx: number, oIdx: number, val: string) => {
    setNewQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        const nextOpts = [...q.options];
        nextOpts[oIdx] = val;
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  const handleUpdateCorrectAnswer = (qIdx: number, oIdx: number) => {
    setNewQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        return { ...q, correctAnswer: oIdx };
      }
      return q;
    }));
  };

  const handleSaveQuiz = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) {
      alert('Please fill out the quiz title and description.');
      return;
    }

    const compiledQuestions: Question[] = newQuestions.map((q, idx) => ({
      ...q,
      id: Date.now() + idx
    }));

    const newQuiz: Omit<QuizTopic, 'icon'> & { iconType: string } = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      difficulty: newDifficulty,
      xpReward: compiledQuestions.length * 50,
      questions: compiledQuestions,
      iconType: 'Brain'
    };

    // Save custom quizzes to localstorage
    const saved = localStorage.getItem('leetmaster_custom_quizzes');
    let customList = [];
    if (saved) {
      try {
        customList = JSON.parse(saved);
      } catch (e) {
        customList = [];
      }
    }
    customList.push(newQuiz);
    localStorage.setItem('leetmaster_custom_quizzes', JSON.stringify(customList));

    // Reload state
    const formattedQuiz: QuizTopic = {
      ...newQuiz,
      icon: newQuiz.category === 'Algorithms' ? Clock : newQuiz.category === 'Graphs' ? Trophy : Brain,
    };

    setQuizzes(prev => [...prev, formattedQuiz]);
    setNewTitle('');
    setNewDescription('');
    setNewQuestions([{
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
    
    setFormSuccess('Your premium DSA quiz has been built successfully!');
    setTimeout(() => setFormSuccess(''), 4000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Quiz Navigation bar inside component */}
      <div className="flex items-center justify-between bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#ff6b2b]" />
          <span className="font-extrabold text-sm text-stone-900 dark:text-white">Scholar Quiz Deck</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setSelectedQuiz(null); setActiveTab('explore'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explore' && !selectedQuiz
                ? 'bg-[#ff6b2b] text-white'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850'
            }`}
          >
            Explore Quizzes
          </button>
          <button
            onClick={() => { setSelectedQuiz(null); setActiveTab('create'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-[#ff6b2b] text-white'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850'
            }`}
          >
            Create Quiz
          </button>
          <button
            onClick={() => { setSelectedQuiz(null); setActiveTab('stats'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-[#ff6b2b] text-white'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850'
            }`}
          >
            My Stats
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-[#fff1e6] dark:bg-[#2e190e] px-3.5 py-1.5 rounded-full border border-[#ffd8bf] dark:border-amber-950">
          <Flame className="w-4 h-4 text-[#ff6b2b] animate-pulse" />
          <span className="text-xs font-extrabold text-[#ff6b2b]">{userXp} XP</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedQuiz ? (
          /* Active Playing Quiz Screen */
          <motion.div
            key="quiz-playing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto bg-white dark:bg-stone-900 border-2 border-black dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.03)]"
          >
            {!isQuizFinished ? (
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#ff6b2b]">
                      {selectedQuiz.category} · {selectedQuiz.difficulty}
                    </span>
                    <h3 className="text-lg font-black text-stone-900 dark:text-white mt-1">
                      {selectedQuiz.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="text-xs font-black text-stone-400 hover:text-stone-900 dark:hover:text-white uppercase tracking-wider"
                  >
                    Exit (X)
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 font-mono font-bold">
                    <span>QUESTION {currentQuestionIndex + 1} OF {selectedQuiz.questions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100)}% COMPLETE</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#ff6b2b] to-orange-500 transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="bg-stone-50/50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-100 dark:border-stone-850">
                  <h4 className="text-base font-extrabold text-stone-950 dark:text-stone-100 leading-relaxed">
                    {selectedQuiz.questions[currentQuestionIndex].question}
                  </h4>
                </div>

                {/* Options list */}
                <div className="grid grid-cols-1 gap-3">
                  {selectedQuiz.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrectAnswer = selectedQuiz.questions[currentQuestionIndex].correctAnswer === oIdx;
                    
                    let btnClass = 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850/60 text-stone-800 dark:text-stone-200';
                    let iconNode = null;

                    if (isSelected && !isAnswerSubmitted) {
                      btnClass = 'bg-orange-50 dark:bg-orange-950/20 border-[#ff6b2b] text-[#ff6b2b] ring-2 ring-[#ff6b2b]/10';
                    } else if (isAnswerSubmitted) {
                      if (isCorrectAnswer) {
                        btnClass = 'bg-emerald-500/10 dark:bg-emerald-950/25 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                        iconNode = <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
                      } else if (isSelected) {
                        btnClass = 'bg-rose-500/10 dark:bg-rose-950/25 border-rose-500 text-rose-600 dark:text-rose-400 font-bold';
                        iconNode = <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />;
                      } else {
                        btnClass = 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-850 opacity-40 text-stone-500';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 text-xs font-semibold transition-all flex items-center justify-between gap-3 ${btnClass} ${!isAnswerSubmitted && 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold ${
                            isSelected ? 'bg-[#ff6b2b] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {iconNode}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                      <BookOpen className="w-4 h-4 text-[#ff6b2b]" />
                      <span>Scholar Solution Insight</span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {selectedQuiz.questions[currentQuestionIndex].explanation}
                    </p>
                  </motion.div>
                )}

                {/* Next Question / Submit Button */}
                <div className="pt-4">
                  <button
                    onClick={handleNextOrSubmit}
                    disabled={selectedOption === null}
                    className="w-full bg-black dark:bg-stone-800 text-white hover:bg-[#ff6b2b] dark:hover:bg-orange-600 font-extrabold text-sm py-4 rounded-2xl shadow transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-black flex items-center justify-center gap-2"
                  >
                    <span>{!isAnswerSubmitted ? 'Submit Answer' : (currentQuestionIndex + 1 < selectedQuiz.questions.length ? 'Next Question' : 'Finish Challenge')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Finished Screen */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/20 rounded-full flex items-center justify-center text-[#ff6b2b] mx-auto shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-2xl font-black text-stone-900 dark:text-white">Challenge Complete!</h4>
                  <p className="text-sm text-stone-500 font-medium mt-1">
                    You mastered the <span className="font-bold text-stone-950 dark:text-white">{selectedQuiz.title}</span> deck.
                  </p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-md mx-auto grid grid-cols-2 gap-4">
                  <div className="text-center border-r border-stone-200 dark:border-stone-800">
                    <div className="text-[10px] text-stone-400 uppercase font-black tracking-wider">Correct Answers</div>
                    <div className="text-2xl font-black text-[#ff6b2b] mt-1">{correctCount} / {selectedQuiz.questions.length}</div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {Math.round((correctCount / selectedQuiz.questions.length) * 100)}% Accuracy
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-stone-400 uppercase font-black tracking-wider">Points Gained</div>
                    <div className="text-2xl font-black text-emerald-500 mt-1">
                      +{Math.round(selectedQuiz.xpReward * (correctCount / selectedQuiz.questions.length))} XP
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">LeetMaster XP Base</div>
                  </div>
                </div>

                {/* Detailed Performance Review Section */}
                <div className="text-left space-y-4 max-w-2xl mx-auto pt-6 border-t border-stone-100 dark:border-stone-800/85">
                  <h5 className="text-xs font-black uppercase text-[#ff6b2b] tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-4 h-4" />
                    <span>Detailed Performance Review</span>
                  </h5>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedQuiz.questions.map((q, idx) => {
                      const ansObj = answersState[q.id];
                      const isCorrect = ansObj?.isCorrect;
                      const selectedVal = ansObj?.selected;
                      return (
                        <div key={q.id} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-850 space-y-2 text-left">
                          <div className="flex items-center gap-2 justify-between">
                            <span className="text-[10px] font-black text-stone-400 font-mono">QUESTION {idx + 1} OF {selectedQuiz.questions.length}</span>
                            <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 px-2 py-0.5 rounded-full ${
                              isCorrect ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                              {isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>CORRECT</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>WRONG</span>
                                </>
                              )}
                            </span>
                          </div>
                          
                          <p className="text-xs font-bold text-stone-900 dark:text-white leading-relaxed">
                            {q.question}
                          </p>

                          <div className="text-[11px] space-y-1 bg-white dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-850/80">
                            <div className="flex items-center gap-1.5">
                              <span className="text-stone-400 dark:text-stone-550 font-semibold">Your Pick:</span>
                              <span className={`font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {selectedVal !== undefined ? `${String.fromCharCode(65 + selectedVal)}) ${q.options[selectedVal]}` : 'Unanswered'}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-stone-400 dark:text-stone-550 font-semibold">Correct Answer:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {String.fromCharCode(65 + q.correctAnswer)}) {q.options[q.correctAnswer]}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed pt-2 border-t border-stone-100 dark:border-stone-900/60 font-medium">
                            <span className="font-black text-[#ff6b2b] uppercase tracking-wider font-mono mr-1">Explanation:</span>
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white hover:bg-black hover:text-white font-bold text-xs py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="flex-1 bg-[#ff6b2b] text-white hover:bg-orange-600 font-bold text-xs py-3.5 rounded-2xl transition-all cursor-pointer"
                  >
                    Back to Selection
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : activeTab === 'explore' ? (
          /* Explore Quizzes List */
          <motion.div
            key="explore-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            <div className="text-left max-w-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-100/80 dark:bg-orange-950/20 text-[#ff6b2b] flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black text-stone-900 dark:text-white font-sans">Active Scholar Quiz Deck</h2>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                  Evaluate your technical fluency across programming frameworks, scientific data libraries, core structures, and database query mechanisms.
                </p>
              </div>
            </div>

            {/* STACKED CATEGORIES SECTIONS */}
            <div className="space-y-10">
              {[
                { id: 'Web Development', title: 'Web Development' },
                { id: 'Languages', title: 'Programming Languages' },
                { id: 'Database', title: 'Database' },
                { id: 'Backend/Frameworks', title: 'Backend / Frameworks' },
                { id: 'Other Topics', title: 'Other Topics' },
                { id: 'custom', title: 'User Published Quizzes' }
              ].map((cat, idx) => {
                // Filter quizzes for this category
                const catQuizzes = cat.id === 'custom' 
                  ? quizzes.filter(q => q.id.startsWith('custom-') || !['Web Development', 'Languages', 'Database', 'Backend/Frameworks', 'Other Topics'].includes(q.category))
                  : quizzes.filter(q => q.category === cat.id && !q.id.startsWith('custom-'));

                if (catQuizzes.length === 0) return null;

                return (
                  <div key={idx} className="space-y-4 text-left">
                    {/* Category Title Header */}
                    <div className="border-b border-stone-100 dark:border-stone-850 pb-2">
                      <h3 className="text-xs font-black text-[#ff6b2b] dark:text-orange-550 tracking-widest font-mono uppercase">
                        {cat.title}
                      </h3>
                    </div>

                    {/* Grid layout of custom cards mimicking DsaSheets.tsx */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {catQuizzes.map((quiz) => {
                        const QuizIcon = quiz.icon || Brain;
                        const scoreCount = completedScores[quiz.id];
                        const isCompleted = scoreCount !== undefined;

                        return (
                          <button
                            key={quiz.id}
                            type="button"
                            onClick={() => startQuiz(quiz)}
                            className="group relative text-left p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-br from-[#faf8f5] via-[#f7f5f0] to-[#f2eee6] dark:from-[#1e1c18] dark:via-[#191815] dark:to-[#141311] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#ff6b2b] hover:shadow-xl cursor-pointer block focus:outline-none"
                          >
                            {/* Inner Subtle Grid Pattern Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col justify-between h-40">
                              
                              {/* Card Top Row */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                    quiz.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                    quiz.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                    'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                  }`}>
                                    {quiz.difficulty}
                                  </span>
                                  <h4 className="text-[14px] font-black text-stone-900 dark:text-white leading-tight group-hover:text-[#ff6b2b] transition-colors line-clamp-1">
                                    {quiz.title}
                                  </h4>
                                  <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                                    {quiz.description}
                                  </p>
                                </div>
                                
                                {/* Score Fraction */}
                                <div className="flex flex-col items-end flex-shrink-0 text-right">
                                  {isCompleted ? (
                                    <div className="flex items-baseline gap-0.5">
                                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono leading-none">
                                        {scoreCount}
                                      </span>
                                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 font-mono">
                                        /{quiz.questions.length}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-baseline gap-0.5">
                                      <span className="text-2xl font-black text-stone-300 dark:text-stone-750 font-mono leading-none">
                                        0
                                      </span>
                                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 font-mono">
                                        /{quiz.questions.length}
                                      </span>
                                    </div>
                                  )}
                                  <span className="text-[8px] uppercase tracking-wider font-black text-stone-400 dark:text-stone-500 mt-1">
                                    {isCompleted ? 'Completed' : 'Not Started'}
                                  </span>
                                </div>
                              </div>

                              {/* Card Bottom Row */}
                              <div className="flex items-end justify-between pt-3 border-t border-[#e2dfd9] dark:border-stone-800/40">
                                <div>
                                  <p className="text-[10px] font-bold text-[#ff6b2b] dark:text-orange-550 font-mono tracking-wider">
                                    {quiz.xpReward} XP Reward
                                  </p>
                                </div>

                                {/* Icon */}
                                <div className="w-8 h-8 rounded-full bg-orange-100/80 dark:bg-orange-950/40 flex items-center justify-center text-[#ff6b2b] group-hover:bg-[#ff6b2b] group-hover:text-white transition-all duration-300">
                                  <QuizIcon className="w-4 h-4" />
                                </div>
                              </div>

                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : activeTab === 'create' ? (
          /* Create Custom Quiz Tab */
          <motion.div
            key="create-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8"
          >
            <div className="mb-6">
              <h3 className="text-lg font-black text-stone-950 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#ff6b2b]" />
                <span>Publish Premium Scholar Quiz</span>
              </h3>
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                Author your own custom questions, options, and explanations to challenge yourself and peers.
              </p>
            </div>

            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveQuiz} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Trie & Suffix Array Basics"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 px-4 py-3 rounded-2xl text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-[#ff6b2b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase">Category Tag</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 px-4 py-3 rounded-2xl text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-[#ff6b2b]"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Languages">Programming Languages</option>
                    <option value="Database">Database</option>
                    <option value="Backend/Frameworks">Backend / Frameworks</option>
                    <option value="Other Topics">Other Topics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase">Short Description</label>
                  <input
                    type="text"
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Brief outline of the technical goals of this quiz..."
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 px-4 py-3 rounded-2xl text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-[#ff6b2b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase">Difficulty Level</label>
                  <div className="flex gap-2">
                    {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setNewDifficulty(level)}
                        className={`flex-1 py-3 text-xs font-bold rounded-2xl border transition-all ${
                          newDifficulty === level
                            ? 'bg-[#ff6b2b] text-white border-[#ff6b2b]'
                            : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Questions Authoring */}
              <div className="space-y-6 pt-4 border-t border-stone-100 dark:border-stone-850">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">
                    Questions Block ({newQuestions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-xs font-extrabold text-[#ff6b2b] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                {newQuestions.map((q, qIdx) => (
                  <div 
                    key={qIdx}
                    className="bg-stone-50/50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-stone-800/80 space-y-4 relative"
                  >
                    {newQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="absolute top-4 right-4 text-stone-400 hover:text-rose-500 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-[#ff6b2b] font-mono">QUESTION {qIdx + 1}</span>
                      <input
                        type="text"
                        required
                        value={q.question}
                        onChange={(e) => handleUpdateQuestionField(qIdx, 'question', e.target.value)}
                        placeholder="Enter your technical question here..."
                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-3 rounded-2xl text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-[#ff6b2b]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Options & Selected Correct Answer
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx}
                            className={`flex items-center gap-2 p-1 bg-white dark:bg-stone-900 border rounded-2xl ${
                              q.correctAnswer === oIdx ? 'border-[#ff6b2b] ring-1 ring-[#ff6b2b]/10' : 'border-stone-200 dark:border-stone-800'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleUpdateCorrectAnswer(qIdx, oIdx)}
                              className={`w-8 h-8 rounded-xl font-mono text-[10px] font-bold transition-all flex items-center justify-center flex-shrink-0 ${
                                q.correctAnswer === oIdx ? 'bg-[#ff6b2b] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </button>
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) => handleUpdateOption(qIdx, oIdx, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                              className="w-full bg-transparent px-2 py-1 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-wider">Solution Explanation</label>
                      <textarea
                        required
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuestionField(qIdx, 'explanation', e.target.value)}
                        placeholder="Provide the core analysis or mathematical reasoning explaining why the correct choice is true..."
                        rows={2}
                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-3 rounded-2xl text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-[#ff6b2b] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-black hover:bg-[#ff6b2b] text-white font-extrabold text-xs px-8 py-4 rounded-2xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Quiz</span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Stats Panel Tab */
          <motion.div
            key="stats-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/20 text-[#ff6b2b] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-950 dark:text-white">Scholar Statistics Overview</h3>
                  <p className="text-xs text-stone-400 mt-1">Keep track of your continuous learning and grading parameters.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-850 text-center">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase">Total XP Points</span>
                  <div className="text-2xl font-black text-[#ff6b2b] mt-1">{userXp}</div>
                </div>
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-850 text-center">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase">Completed Quizzes</span>
                  <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">
                    {quizzes.filter(q => q.id.startsWith('custom-')).length + 1}
                  </div>
                </div>
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-850 text-center">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase">Accuracy Rating</span>
                  <div className="text-2xl font-black text-emerald-500 mt-1">92%</div>
                </div>
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-850 text-center">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase">Daily Streak</span>
                  <div className="text-2xl font-black text-amber-500 mt-1">128 Days</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6">
              <h4 className="text-xs font-black uppercase text-stone-400 mb-4 tracking-wider">Concept Strength Chart</h4>
              <div className="space-y-4">
                {[
                  { tag: 'Algorithms & Complexities', percent: 94 },
                  { tag: 'Dynamic Programming Primitives', percent: 80 },
                  { tag: 'Graph Traversals', percent: 88 },
                  { tag: 'System Design Principles', percent: 75 }
                ].map((concept, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                      <span>{concept.tag}</span>
                      <span className="font-mono text-[#ff6b2b]">{concept.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff6b2b] rounded-full" style={{ width: `${concept.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
