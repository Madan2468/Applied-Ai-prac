import React, { useState, useEffect, useRef } from 'react';
import questionsData from './data/questions.json';
import Navbar from './components/Navbar';
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

export default function App() {
  // Navigation & Mode
  // 'weeks' | 'practice' | 'all_practice' | 'exam' | 'exam_results' | 'flashcards' | 'results'
  const [activeMode, setActiveMode] = useState('weeks');
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
  const [examAnswers, setExamAnswers] = useState({}); // { [qId]: selectedKey }
  const [markedForReview, setMarkedForReview] = useState(() => new Set());
  const [examTimerSeconds, setExamTimerSeconds] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [examScope, setExamScope] = useState('week'); // 'week' | 'overall'

  // Persisted Stats & Bookmarks
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('applied_ai_stats');
    return saved ? JSON.parse(saved) : { answers: {}, streak: 0 };
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('applied_ai_bookmarks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Persist stats
  useEffect(() => {
    localStorage.setItem('applied_ai_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('applied_ai_bookmarks', JSON.stringify([...bookmarks]));
  }, [bookmarks]);

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

  // Handler: Start Single Week Practice
  const handleStartWeekPractice = (weekNum) => {
    const weekObj = questionsData.find(w => w.week === weekNum);
    if (!weekObj) return;

    setCurrentWeekNum(weekNum);
    setActiveQuestions(weekObj.questions);
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizTitle(weekObj.title);
    setActiveMode('practice');
  };

  // Handler: Start All Weeks Practice (Instant feedback marathon)
  const handleStartAllWeeksPractice = (doShuffleQuestions = false) => {
    let allQs = [];
    questionsData.forEach(w => {
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

    setActiveQuestions(allQs);
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizTitle(`All 12 Weeks Practice Marathon (${allQs.length} MCQs)`);
    setActiveMode('all_practice');
  };

  // Handler: Start Single Week Exam Mode
  const handleStartWeekExam = (weekNum) => {
    const weekObj = questionsData.find(w => w.week === weekNum);
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
  };

  // Handler: Start Overall Exam (Full 12 Weeks Mock Exam)
  const handleStartAllWeeksExam = (doShuffleQuestions = false) => {
    let allQs = [];
    questionsData.forEach(w => {
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

    setActiveQuestions(allQs);
    setExamAnswers({});
    setMarkedForReview(new Set());
    setCurrentQuestionIndex(0);
    setExamTimerSeconds(0);
    setExamScope('overall');
    setQuizTitle(`Full 12-Week Comprehensive Mock Exam (${allQs.length} MCQs)`);
    setActiveMode('exam');
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

    // Record stats from the exam into userStats
    setUserStats(prev => {
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

  // Handler: Drill Missed Questions
  const handleDrillMissed = (customMissedList = null) => {
    let missedQs = [];

    if (customMissedList && customMissedList.length > 0) {
      missedQs = customMissedList;
    } else {
      questionsData.forEach(w => {
        w.questions.forEach(q => {
          const record = userStats.answers[q.id];
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
      alert("No missed questions recorded yet!");
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

    setUserStats(prev => {
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
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleResetStats = () => {
    setUserStats({ answers: {}, streak: 0 });
    localStorage.removeItem('applied_ai_stats');
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
      {/* Navbar with Header & Progress Bar */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={(mode) => {
          if (mode === 'all_practice') handleStartAllWeeksPractice(true);
          else setActiveMode(mode);
        }}
        shuffleOptions={shuffleOptions}
        setShuffleOptions={setShuffleOptions}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentIndex={currentQuestionIndex}
        totalQuestions={activeQuestions.length}
        currentProgressPercent={currentProgressPercent}
        onCloseQuiz={() => setActiveMode('weeks')}
        onStartExam={() => handleStartAllWeeksExam(true)}
        examTimerSeconds={examTimerSeconds}
        onSubmitExam={() => setIsSubmitModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* VIEW: WEEK SELECTOR (HOME) */}
        {activeMode === 'weeks' && (
          <WeekSelector
            weeksData={questionsData}
            onSelectWeek={handleStartWeekPractice}
            onSelectAllWeeks={() => handleStartAllWeeksPractice(true)}
            onSelectWeekExam={handleStartWeekExam}
            onSelectAllWeeksExam={() => handleStartAllWeeksExam(true)}
            onSelectStudyWeek={(wNum) => {
              setCurrentWeekNum(wNum);
              setActiveMode('flashcards');
            }}
            userStats={userStats}
            onResetStats={handleResetStats}
          />
        )}

        {/* VIEW: PRACTICE MODE (INSTANT FEEDBACK) */}
        {(activeMode === 'practice' || activeMode === 'all_practice') && currentQuestion && (
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
              isBookmarked={bookmarks.has(currentQuestion.id)}
              onToggleBookmark={handleToggleBookmark}
              weekTitle={quizTitle || `Week ${currentWeekNum}`}
            />
          </div>
        )}

        {/* VIEW: EXAM MODE (ANSWERS HIDDEN UNTIL SUBMISSION) */}
        {activeMode === 'exam' && currentQuestion && (
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
              isBookmarked={bookmarks.has(currentQuestion.id)}
              onToggleBookmark={handleToggleBookmark}
              weekTitle={quizTitle}
              onSubmitExam={() => setIsSubmitModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW: EXAM RESULTS (WEEK-WISE & OVERALL BREAKDOWN WITH EXPLANATIONS) */}
        {activeMode === 'exam_results' && (
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
            onBackToWeeks={() => setActiveMode('weeks')}
            examTitle={quizTitle}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* VIEW: PRACTICE RESULTS */}
        {activeMode === 'results' && (
          <ResultsModal
            questions={activeQuestions}
            userAnswers={quizAnswers}
            onRetake={() => {
              setQuizAnswers({});
              setCurrentQuestionIndex(0);
              setActiveMode('practice');
            }}
            onRetakeMissed={handleDrillMissed}
            onBackToWeeks={() => setActiveMode('weeks')}
            quizTitle={quizTitle}
          />
        )}

        {/* VIEW: STUDY FLASHCARD MODE */}
        {activeMode === 'flashcards' && (
          <StudyFlashcardMode
            weeksData={questionsData}
            bookmarks={bookmarks}
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
        weeksData={questionsData}
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
