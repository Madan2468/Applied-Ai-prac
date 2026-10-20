import React, { useState, useEffect, useMemo } from 'react';
import appliedAiData from './data/questions.json';
import fundamentalsData from './data/fundamentals_questions.json';

import Navbar from './components/Navbar';
import SubjectSelector from './components/SubjectSelector';
import WeekSelector from './components/WeekSelector';
import QuizCard from './components/QuizCard';
import ResultsModal from './components/ResultsModal';
import StudyFlashcardMode from './components/StudyFlashcardMode';
import SearchModal from './components/SearchModal';
import QuestionNavigator from './components/QuestionNavigator';
import ExamCard from './components/ExamCard';
import ExamNavigator from './components/ExamNavigator';
import ExamSubmitModal from './components/ExamSubmitModal';
import ExamResults from './components/ExamResults';
import { shuffleArray } from './utils/shuffle';

const SUBJECT_CONFIG = {
  'applied-ai': {
    id: 'applied-ai',
    name: 'Applied Artificial Intelligence',
    shortName: 'Applied AI',
    code: 'NPTEL CS',
    data: appliedAiData,
    statsKey: 'applied_ai_stats',
    bookmarksKey: 'applied_ai_bookmarks'
  },
  'fundamentals': {
    id: 'fundamentals',
    name: 'Fundamentals of Language Acquisition',
    shortName: 'Language Acquisition',
    code: 'NOC26 HS220',
    data: fundamentalsData,
    statsKey: 'fundamentals_stats',
    bookmarksKey: 'fundamentals_bookmarks'
  }
};

// Helper to parse current URL hash
function getRouteFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash) return { subject: null, mode: 'weeks' };

  const parts = hash.split('/').filter(Boolean);
  const first = parts[0]?.toLowerCase();

  let subject = null;
  if (first === 'applied-ai' || first === 'applied_ai' || first === 'ai') {
    subject = 'applied-ai';
  } else if (
    first === 'fundamentals' || 
    first === 'fla' || 
    first === 'fundamentals-of-language-acquisition' ||
    first === 'language-acquisition'
  ) {
    subject = 'fundamentals';
  }

  const mode = parts[1] || 'weeks';
  return { subject, mode };
}

export default function App() {
  const initialRoute = useMemo(() => getRouteFromHash(), []);

  // Active Subject: null (Home Hub) | 'applied-ai' | 'fundamentals'
  const [activeSubject, setActiveSubject] = useState(initialRoute.subject);

  // Active Mode: 'weeks' | 'practice' | 'all_practice' | 'exam' | 'exam_results' | 'flashcards' | 'results'
  const [activeMode, setActiveMode] = useState(initialRoute.mode);

  const [currentWeekNum, setCurrentWeekNum] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Options & Audio
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Active quiz / practice state
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizTitle, setQuizTitle] = useState('');

  // Active exam state
  const [examAnswers, setExamAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(() => new Set());
  const [examTimerSeconds, setExamTimerSeconds] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [examScope, setExamScope] = useState('week'); // 'week' | 'overall'

  // Persisted Stats & Bookmarks for Applied AI
  const [appliedAiStats, setAppliedAiStats] = useState(() => {
    const saved = localStorage.getItem('applied_ai_stats');
    return saved ? JSON.parse(saved) : { answers: {}, streak: 0 };
  });

  const [appliedAiBookmarks, setAppliedAiBookmarks] = useState(() => {
    const saved = localStorage.getItem('applied_ai_bookmarks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persisted Stats & Bookmarks for Fundamentals of Language Acquisition
  const [fundamentalsStats, setFundamentalsStats] = useState(() => {
    const saved = localStorage.getItem('fundamentals_stats');
    return saved ? JSON.parse(saved) : { answers: {}, streak: 0 };
  });

  const [fundamentalsBookmarks, setFundamentalsBookmarks] = useState(() => {
    const saved = localStorage.getItem('fundamentals_bookmarks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync Applied AI persistence
  useEffect(() => {
    localStorage.setItem('applied_ai_stats', JSON.stringify(appliedAiStats));
  }, [appliedAiStats]);

  useEffect(() => {
    localStorage.setItem('applied_ai_bookmarks', JSON.stringify([...appliedAiBookmarks]));
  }, [appliedAiBookmarks]);

  // Sync Fundamentals persistence
  useEffect(() => {
    localStorage.setItem('fundamentals_stats', JSON.stringify(fundamentalsStats));
  }, [fundamentalsStats]);

  useEffect(() => {
    localStorage.setItem('fundamentals_bookmarks', JSON.stringify([...fundamentalsBookmarks]));
  }, [fundamentalsBookmarks]);

  // Sync browser URL Hash with back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const { subject, mode } = getRouteFromHash();
      setActiveSubject(subject);
      if (subject) {
        if (mode === 'weeks' || mode === 'flashcards') {
          setActiveMode(mode);
        }
      } else {
        setActiveMode('weeks');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash helper
  const navigateTo = (subject, mode = 'weeks') => {
    if (!subject) {
      window.location.hash = '#/';
      setActiveSubject(null);
      setActiveMode('weeks');
    } else {
      window.location.hash = `#/${subject}/${mode}`;
      setActiveSubject(subject);
      setActiveMode(mode);
    }
  };

  // Exam timer interval
  useEffect(() => {
    let timer = null;
    if (activeMode === 'exam') {
      timer = setInterval(() => {
        setExamTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeMode]);

  // Current active subject data and configs
  const currentConfig = activeSubject ? SUBJECT_CONFIG[activeSubject] : null;
  const currentQuestionsData = currentConfig ? currentConfig.data : [];

  // Active stats & bookmarks reference for current subject
  const currentStats = activeSubject === 'fundamentals' ? fundamentalsStats : appliedAiStats;
  const setCurrentStats = activeSubject === 'fundamentals' ? setFundamentalsStats : setAppliedAiStats;

  const currentBookmarks = activeSubject === 'fundamentals' ? fundamentalsBookmarks : appliedAiBookmarks;
  const setCurrentBookmarks = activeSubject === 'fundamentals' ? setFundamentalsBookmarks : setAppliedAiBookmarks;

  // Handler: Start Single Week Practice
  const handleStartWeekPractice = (weekNum) => {
    if (!currentQuestionsData) return;
    const weekObj = currentQuestionsData.find(w => w.week === weekNum);
    if (!weekObj) return;

    setCurrentWeekNum(weekNum);
    setActiveQuestions(weekObj.questions);
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizTitle(weekObj.title);
    setActiveMode('practice');
    if (activeSubject) {
      window.location.hash = `#/${activeSubject}/practice`;
    }
  };

  // Handler: Start All Weeks Practice (Marathon)
  const handleStartAllWeeksPractice = (doShuffleQuestions = false, subjectOverride = null) => {
    const targetSubj = subjectOverride || activeSubject || 'applied-ai';
    const conf = SUBJECT_CONFIG[targetSubj];
    if (!conf) return;

    let allQs = [];
    conf.data.forEach(w => {
      w.questions.forEach(q => {
        allQs.push({
          ...q,
          weekNum: w.week,
          weekTitle: w.title
        });
      });
    });

    if (doShuffleQuestions) {
      allQs = shuffleArray(allQs);
    }

    if (subjectOverride && subjectOverride !== activeSubject) {
      setActiveSubject(subjectOverride);
    }

    setActiveQuestions(allQs);
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizTitle(`All 12 Weeks Practice Marathon • ${conf.shortName} (${allQs.length} MCQs)`);
    setActiveMode('all_practice');
    window.location.hash = `#/${targetSubj}/all_practice`;
  };

  // Handler: Start Single Week Exam Mode
  const handleStartWeekExam = (weekNum) => {
    if (!currentQuestionsData) return;
    const weekObj = currentQuestionsData.find(w => w.week === weekNum);
    if (!weekObj) return;

    const formattedQs = weekObj.questions.map(q => ({
      ...q,
      weekNum: weekObj.week,
      weekTitle: weekObj.title
    }));

    setCurrentWeekNum(weekNum);
    setActiveQuestions(formattedQs);
    setExamAnswers({});
    setMarkedForReview(new Set());
    setCurrentQuestionIndex(0);
    setExamTimerSeconds(0);
    setExamScope('week');
    setQuizTitle(`Week ${weekNum} Exam: ${weekObj.title.replace(/^Week \d+:\s*/, '')}`);
    setActiveMode('exam');
    if (activeSubject) {
      window.location.hash = `#/${activeSubject}/exam`;
    }
  };

  // Handler: Start Overall Exam (Full 12 Weeks Mock Exam)
  const handleStartAllWeeksExam = (doShuffleQuestions = false, subjectOverride = null) => {
    const targetSubj = subjectOverride || activeSubject || 'applied-ai';
    const conf = SUBJECT_CONFIG[targetSubj];
    if (!conf) return;

    let allQs = [];
    conf.data.forEach(w => {
      w.questions.forEach(q => {
        allQs.push({
          ...q,
          weekNum: w.week,
          weekTitle: w.title
        });
      });
    });

    if (doShuffleQuestions) {
      allQs = shuffleArray(allQs);
    }

    if (subjectOverride && subjectOverride !== activeSubject) {
      setActiveSubject(subjectOverride);
    }

    setActiveQuestions(allQs);
    setExamAnswers({});
    setMarkedForReview(new Set());
    setCurrentQuestionIndex(0);
    setExamTimerSeconds(0);
    setExamScope('overall');
    setQuizTitle(`Full 12-Week Comprehensive Mock Exam • ${conf.shortName} (${allQs.length} MCQs)`);
    setActiveMode('exam');
    window.location.hash = `#/${targetSubj}/exam`;
  };

  // Exam Option Handlers
  const handleSelectExamOption = (qId, selectedKey) => {
    setExamAnswers(prev => ({
      ...prev,
      [qId]: selectedKey
    }));
  };

  const handleClearExamOption = (qId) => {
    setExamAnswers(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleToggleMarkForReview = (qId) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleConfirmSubmitExam = () => {
    setIsSubmitModalOpen(false);

    // Record stats into active subject's userStats
    setCurrentStats(prev => {
      const nextAnswers = { ...prev.answers };
      let newStreak = prev.streak || 0;

      activeQuestions.forEach(q => {
        const userChoice = examAnswers[q.id];
        if (userChoice) {
          const isCorrect = userChoice === q.correct;
          nextAnswers[q.id] = {
            questionId: q.id,
            selectedKey: userChoice,
            isCorrect,
            correctKey: q.correct
          };
          if (isCorrect) newStreak++;
          else newStreak = 0;
        }
      });

      return {
        ...prev,
        answers: nextAnswers,
        streak: Math.max(prev.streak || 0, newStreak)
      };
    });

    setActiveMode('exam_results');
  };

  // Drill Missed Questions
  const handleDrillMissed = (customMissedList = null) => {
    let missedQs = [];

    if (customMissedList && customMissedList.length > 0) {
      missedQs = customMissedList;
    } else if (currentQuestionsData) {
      currentQuestionsData.forEach(w => {
        w.questions.forEach(q => {
          const record = currentStats.answers[q.id];
          if (record && !record.isCorrect) {
            missedQs.push({
              ...q,
              weekNum: w.week,
              weekTitle: w.title
            });
          }
        });
      });
    }

    if (missedQs.length === 0) {
      alert("No missed questions recorded yet for this course!");
      return;
    }

    setActiveQuestions(missedQs);
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizTitle(`Missed Questions Drill (${missedQs.length} MCQs)`);
    setActiveMode('practice');
  };

  // Practice record answer
  const handleAnswerQuestion = (ansObj) => {
    const { questionId, isCorrect } = ansObj;

    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: ansObj
    }));

    setCurrentStats(prev => {
      const nextAnswers = { ...prev.answers, [questionId]: ansObj };
      let newStreak = isCorrect ? (prev.streak || 0) + 1 : 0;
      return {
        ...prev,
        answers: nextAnswers,
        streak: Math.max(prev.streak || 0, newStreak)
      };
    });
  };

  // Toggle Bookmark
  const handleToggleBookmark = (qId) => {
    setCurrentBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset all progress and accuracy stats for this subject?")) {
      setCurrentStats({ answers: {}, streak: 0 });
      if (currentConfig) {
        localStorage.removeItem(currentConfig.statsKey);
      }
    }
  };

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentProgressPercent = activeQuestions.length > 0 
    ? Math.round(((currentQuestionIndex + 1) / activeQuestions.length) * 100) 
    : 0;

  const answeredExamCount = Object.keys(examAnswers).filter(k => Boolean(examAnswers[k])).length;
  const examMins = Math.floor(examTimerSeconds / 60);
  const examSecs = examTimerSeconds % 60;
  const timeTakenFormatted = `${examMins}m ${examSecs < 10 ? '0' : ''}${examSecs}s`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      {/* Top Navbar */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={(mode) => {
          if (mode === 'all_practice') handleStartAllWeeksPractice(true);
          else {
            setActiveMode(mode);
            if (activeSubject) window.location.hash = `#/${activeSubject}/${mode}`;
          }
        }}
        shuffleOptions={shuffleOptions}
        setShuffleOptions={setShuffleOptions}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentIndex={currentQuestionIndex}
        totalQuestions={activeQuestions.length}
        currentProgressPercent={currentProgressPercent}
        onCloseQuiz={() => {
          setActiveMode('weeks');
          if (activeSubject) window.location.hash = `#/${activeSubject}`;
        }}
        onStartExam={() => handleStartAllWeeksExam(true)}
        examTimerSeconds={examTimerSeconds}
        onSubmitExam={() => setIsSubmitModalOpen(true)}
        subjectId={activeSubject || 'applied-ai'}
        subjectName={currentConfig ? currentConfig.shortName : 'NPTEL Prep'}
        onNavigateHome={() => navigateTo(null)}
        onSwitchSubject={(subjId) => navigateTo(subjId, 'weeks')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* VIEW 0: HOME PAGE - SUBJECT SELECTION HUB */}
        {!activeSubject && (
          <SubjectSelector
            onSelectSubject={(subjId, initialAction) => {
              if (initialAction === 'all_practice') {
                handleStartAllWeeksPractice(true, subjId);
              } else if (initialAction === 'exam') {
                handleStartAllWeeksExam(true, subjId);
              } else {
                navigateTo(subjId, 'weeks');
              }
            }}
            appliedAiStats={appliedAiStats}
            appliedAiBookmarks={appliedAiBookmarks}
            fundamentalsStats={fundamentalsStats}
            fundamentalsBookmarks={fundamentalsBookmarks}
            appliedAiTotal={168}
            fundamentalsTotal={300}
          />
        )}

        {/* VIEW 1: WEEK SELECTOR FOR ACTIVE SUBJECT */}
        {activeSubject && activeMode === 'weeks' && (
          <WeekSelector
            weeksData={currentQuestionsData}
            onSelectWeek={handleStartWeekPractice}
            onSelectAllWeeks={() => handleStartAllWeeksPractice(true)}
            onSelectWeekExam={handleStartWeekExam}
            onSelectAllWeeksExam={() => handleStartAllWeeksExam(true)}
            onSelectStudyWeek={(wNum) => {
              setCurrentWeekNum(wNum);
              setActiveMode('flashcards');
              window.location.hash = `#/${activeSubject}/flashcards`;
            }}
            userStats={currentStats}
            onResetStats={handleResetStats}
            subjectId={activeSubject}
            subjectName={currentConfig.name}
            subjectCode={currentConfig.code}
            onBackToSubjects={() => navigateTo(null)}
          />
        )}

        {/* VIEW 2: PRACTICE MODE (INSTANT FEEDBACK) */}
        {activeSubject && (activeMode === 'practice' || activeMode === 'all_practice') && currentQuestion && (
          <div style={{ maxWidth: '760px', margin: '32px auto 0', padding: '0 20px' }}>
            <QuestionNavigator
              questions={activeQuestions}
              currentIndex={currentQuestionIndex}
              onSelectIndex={(idx) => setCurrentQuestionIndex(idx)}
              userAnswers={quizAnswers}
              isOpen={isNavOpen}
              setIsOpen={setIsNavOpen}
            />
            <QuizCard
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={activeQuestions.length}
              onNext={() => {
                if (currentQuestionIndex < activeQuestions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  setActiveMode('results');
                }
              }}
              onPrev={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                }
              }}
              onAnswer={handleAnswerQuestion}
              userAnswerRecord={quizAnswers[currentQuestion.id]}
              shuffleOptions={shuffleOptions}
              isBookmarked={currentBookmarks.has(currentQuestion.id)}
              onToggleBookmark={handleToggleBookmark}
              weekTitle={quizTitle || `Week ${currentWeekNum}`}
            />
          </div>
        )}

        {/* VIEW 3: EXAM MODE (ANSWERS HIDDEN UNTIL SUBMISSION) */}
        {activeSubject && activeMode === 'exam' && currentQuestion && (
          <div style={{ maxWidth: '780px', margin: '32px auto 0', padding: '0 20px' }}>
            <ExamNavigator
              questions={activeQuestions}
              currentIndex={currentQuestionIndex}
              onSelectIndex={(idx) => setCurrentQuestionIndex(idx)}
              examAnswers={examAnswers}
              markedForReview={markedForReview}
              isOpen={isNavOpen}
              setIsOpen={setIsNavOpen}
              onSubmitExam={() => setIsSubmitModalOpen(true)}
            />
            <ExamCard
              question={currentQuestion}
              currentIndex={currentQuestionIndex}
              totalQuestions={activeQuestions.length}
              onNext={() => {
                if (currentQuestionIndex < activeQuestions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  setIsSubmitModalOpen(true);
                }
              }}
              onPrev={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                }
              }}
              onSelectOption={handleSelectExamOption}
              onClearOption={handleClearExamOption}
              selectedOptionKey={examAnswers[currentQuestion.id]}
              isMarkedForReview={markedForReview.has(currentQuestion.id)}
              onToggleMarkForReview={handleToggleMarkForReview}
              shuffleOptions={shuffleOptions}
              isBookmarked={currentBookmarks.has(currentQuestion.id)}
              onToggleBookmark={handleToggleBookmark}
              weekTitle={quizTitle}
              onSubmitExam={() => setIsSubmitModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 4: EXAM RESULTS (WEEK-WISE & OVERALL BREAKDOWN WITH EXPLANATIONS) */}
        {activeSubject && activeMode === 'exam_results' && (
          <ExamResults
            questions={activeQuestions}
            examAnswers={examAnswers}
            totalTimeSeconds={examTimerSeconds}
            onRetakeExam={() => {
              setExamAnswers({});
              setMarkedForReview(new Set());
              setCurrentQuestionIndex(0);
              setExamTimerSeconds(0);
              setActiveMode('exam');
            }}
            onDrillMissed={() => {
              const missed = activeQuestions.filter(q => examAnswers[q.id] !== q.correct);
              handleDrillMissed(missed);
            }}
            onBackToWeeks={() => {
              setActiveMode('weeks');
              window.location.hash = `#/${activeSubject}`;
            }}
            examTitle={quizTitle}
            bookmarks={currentBookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* VIEW 5: PRACTICE RESULTS */}
        {activeSubject && activeMode === 'results' && (
          <ResultsModal
            questions={activeQuestions}
            userAnswers={quizAnswers}
            onRetake={() => {
              setQuizAnswers({});
              setCurrentQuestionIndex(0);
              setActiveMode('practice');
            }}
            onRetakeMissed={handleDrillMissed}
            onBackToWeeks={() => {
              setActiveMode('weeks');
              window.location.hash = `#/${activeSubject}`;
            }}
            quizTitle={quizTitle}
          />
        )}

        {/* VIEW 6: STUDY FLASHCARD MODE */}
        {activeSubject && activeMode === 'flashcards' && (
          <StudyFlashcardMode
            weeksData={currentQuestionsData}
            bookmarks={currentBookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </main>

      {/* EXAM SUBMIT CONFIRMATION MODAL */}
      <ExamSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmitExam}
        totalQuestions={activeQuestions.length}
        answeredCount={answeredExamCount}
        markedCount={markedForReview.size}
        timeTakenFormatted={timeTakenFormatted}
        examTitle={quizTitle}
      />

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        weeksData={currentQuestionsData.length > 0 ? currentQuestionsData : appliedAiData}
        onSelectQuestion={(q) => {
          setActiveQuestions([q]);
          setQuizAnswers({});
          setCurrentQuestionIndex(0);
          setQuizTitle(`Question Search Result (Week ${q.weekNum})`);
          setActiveMode('practice');
        }}
      />
    </div>
  );
}
