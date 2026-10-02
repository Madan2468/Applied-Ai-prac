import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight,
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Lightbulb,
  Check,
  AlertCircle
} from 'lucide-react';
import { prepareQuestionOptions } from '../utils/shuffle';
import { soundManager } from '../utils/audio';

export default function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  onNext,
  onPrev,
  onAnswer,
  userAnswerRecord,
  shuffleOptions,
  isBookmarked,
  onToggleBookmark,
  weekTitle
}) {
  const [selectedOptionKey, setSelectedOptionKey] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const autoAdvanceTimerRef = useRef(null);

  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  useEffect(() => {
    setTimerSeconds(0);
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);

    clearAutoAdvance();

    return () => {
      clearInterval(interval);
      clearAutoAdvance();
    };
  }, [question.id]);

  useEffect(() => {
    if (userAnswerRecord) {
      setSelectedOptionKey(userAnswerRecord.selectedKey);
      setShowExplanation(true);
    } else {
      setSelectedOptionKey(null);
      setShowExplanation(false);
    }
  }, [question.id, userAnswerRecord]);

  const processedOptions = useMemo(() => {
    return prepareQuestionOptions(question, shuffleOptions);
  }, [question, shuffleOptions]);

  const isAnswered = selectedOptionKey !== null || userAnswerRecord !== undefined;
  const currentRecord = userAnswerRecord || (selectedOptionKey ? {
    selectedKey: selectedOptionKey,
    isCorrect: selectedOptionKey === question.correct
  } : null);

  const handleSelectOption = (optItem) => {
    if (isAnswered) return;

    clearAutoAdvance();

    const isCorrect = optItem.originalKey === question.correct;
    setSelectedOptionKey(optItem.originalKey);
    setShowExplanation(true);

    if (isCorrect) {
      soundManager.playCorrect();
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.65 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    } else {
      soundManager.playIncorrect();
    }

    onAnswer({
      questionId: question.id,
      selectedKey: optItem.originalKey,
      displayLabel: optItem.displayLabel,
      isCorrect,
      correctKey: question.correct,
      timeTaken: timerSeconds
    });

    // Automatically move to the next question after a brief feedback pause
    autoAdvanceTimerRef.current = setTimeout(() => {
      onNext();
    }, 1200);
  };

  const correctOptionInDisplay = useMemo(() => {
    return processedOptions.find(opt => opt.originalKey === question.correct);
  }, [processedOptions, question.correct]);

  const correctDisplayLabel = correctOptionInDisplay ? correctOptionInDisplay.displayLabel : question.correct;

  return (
    <div key={question.id} className="seed-quiz-container animate-fade-in">
      {/* Sub-header meta bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <span style={{
          fontSize: '0.84rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--color-sage-dark)'
        }}>
          {weekTitle || 'Applied AI MCQ'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => onToggleBookmark(question.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: isBookmarked ? '#d97706' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.84rem',
              fontWeight: 600,
              transition: 'transform 0.2s ease'
            }}
          >
            {isBookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={15} /> {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* QUESTION TITLE */}
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '2.15rem',
        fontWeight: 500,
        color: 'var(--color-forest)',
        lineHeight: 1.35,
        letterSpacing: '-0.02em',
        marginBottom: '8px'
      }}>
        {question.question}
      </h2>

      <p style={{
        fontSize: '1rem',
        color: 'var(--text-muted)',
        marginBottom: '32px'
      }}>
        Select the correct answer choice.
      </p>

      {/* STAGGERED PILL OPTIONS WITH DISPLAY LABELS AND RIGHT BADGE INDICATOR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
        {processedOptions.map((opt, idx) => {
          const selectedKey = currentRecord ? currentRecord.selectedKey : selectedOptionKey;
          const isThisSelected = selectedKey === opt.originalKey;
          const isCorrectAnswer = opt.originalKey === question.correct;

          let pillClass = "seed-option-pill";
          if (isAnswered) {
            if (isThisSelected) {
              pillClass += isCorrectAnswer ? " state-correct" : " state-wrong";
            } else if (isCorrectAnswer) {
              pillClass += " state-correct-hint";
            }
          }

          return (
            <button
              key={`${question.id}_${opt.originalKey}`}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={pillClass}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isThisSelected ? (isCorrectAnswer ? 'var(--color-correct-border)' : 'var(--color-wrong-border)') : 'var(--bg-sage-light)',
                color: isThisSelected ? '#fff' : 'var(--color-forest)',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginRight: '14px',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}>
                {opt.displayLabel}
              </span>

              <span style={{ flex: 1, paddingRight: '12px' }}>
                {opt.text}
              </span>

              {/* Radio Indicator & Pop-in Badges */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {isAnswered ? (
                  <>
                    {isThisSelected && isCorrectAnswer && (
                      <div className="seed-badge-correct">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}

                    {isThisSelected && !isCorrectAnswer && (
                      <div className="seed-badge-wrong">
                        <AlertCircle size={16} strokeWidth={2.5} />
                      </div>
                    )}

                    {!isThisSelected && isCorrectAnswer && (
                      <div className="seed-badge-correct">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="seed-pill-radio" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* SEED "DID YOU KNOW?" EXPLANATION CARD WITH ANIMATION */}
      {showExplanation && (
        <div className="seed-did-you-know animate-fade-in">
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Lightbulb size={18} className="seed-lightbulb-icon" color="var(--color-forest)" />
            DID YOU KNOW?
          </div>

          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--color-forest)',
            marginBottom: '8px',
            lineHeight: 1.4
          }}>
            {currentRecord && currentRecord.isCorrect 
              ? `Correct! Option (${correctDisplayLabel}) is the right answer.` 
              : `Key Concept: Option (${correctDisplayLabel}) is correct.`}
          </h4>

          <p style={{
            fontSize: '0.96rem',
            color: 'var(--text-body)',
            lineHeight: 1.6
          }}>
            {question.explanation 
              ? question.explanation 
              : `Correct Answer: "${question.options[question.correct]}".`}
          </p>
        </div>
      )}

      {/* BOTTOM ACTION BUTTONS: PREVIOUS & NEXT */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '40px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => {
            clearAutoAdvance();
            soundManager.playClick();
            onPrev();
          }}
          disabled={currentIndex === 0}
          className="seed-btn-secondary"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <span style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: 'var(--color-forest)',
          letterSpacing: '0.02em'
        }}>
          {currentIndex + 1} of {totalQuestions}
        </span>

        <button
          onClick={() => {
            clearAutoAdvance();
            soundManager.playClick();
            onNext();
          }}
          className={`seed-btn-continue ${isAnswered ? 'ready-pulse' : ''}`}
        >
          {currentIndex < totalQuestions - 1 ? (
            <>
              Next <ArrowRight size={18} />
            </>
          ) : (
            'Complete Quiz'
          )}
        </button>
      </div>
    </div>
  );
}
