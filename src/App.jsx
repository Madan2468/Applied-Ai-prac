import React, { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import Navbar from './components/Navbar';
import WeekSelector from './components/WeekSelector';
import QuizCard from './components/QuizCard';
import ResultsModal from './components/ResultsModal';
import StudyFlashcardMode from './components/StudyFlashcardMode';
import SearchModal from './components/SearchModal';
import QuestionNavigator from './components/QuestionNavigator';
import { shuffleArray } from './utils/shuffle';

export default function App() {
  // Navigation & Mode
  const [activeMode, setActiveMode] = useState('weeks'); // 'weeks' | 'practice' | 'all_practice' | 'flashcards' | 'results'
  const [currentWeekNum, setCurrentWeekNum] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Options & Audio
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Active quiz state
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizTitle, setQuizTitle] = useState('');

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

  // Handler: Start All Weeks Practice (Full 150 Mock Exam)
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
    setQuizTitle('All Weeks Marathon (150 MCQs)');
    setActiveMode('all_practice');
  };

  // Handler: Drill Missed Questions
  const handleDrillMissed = () => {
    let missedQs = [];
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

  // Record answer
  const handleAnswerQuestion = (ansObj) => {
    const { questionId, isCorrect } = ansObj;

    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: ansObj
    }));

    setUserStats(prev => {
      const nextAnswers = { ...prev.answers, [questionId]: ansObj };
      let newStreak = isCorrect ? prev.streak + 1 : 0;
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      {/* Navbar with Preply Header & Progress Bar */}
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
        currentProgressPercent={currentProgressPercent}
        onCloseQuiz={() => setActiveMode('weeks')}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {activeMode === 'weeks' && (
          <WeekSelector
            weeksData={questionsData}
            onSelectWeek={handleStartWeekPractice}
            onSelectAllWeeks={() => handleStartAllWeeksPractice(true)}
            onSelectStudyWeek={(wNum) => {
              setCurrentWeekNum(wNum);
              setActiveMode('flashcards');
            }}
            userStats={userStats}
            onResetStats={handleResetStats}
          />
        )}

        {(activeMode === 'practice' || activeMode === 'all_practice') && currentQuestion && (
          <div style={{ maxWidth: '750px', margin: '32px auto 0', padding: '0 20px' }}>
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

        {activeMode === 'flashcards' && (
          <StudyFlashcardMode
            weeksData={questionsData}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </main>

      {/* Search Modal */}
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
