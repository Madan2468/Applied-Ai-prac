import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Flag,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { prepareQuestionOptions } from '../utils/shuffle';
import { soundManager } from '../utils/audio';

export default function ExamCard({
  question,
  currentIndex,
  totalQuestions,
  onNext,
  onPrev,
  onSelectOption,
  onClearOption,
  selectedOptionKey,
  isMarkedForReview,
  onToggleMarkForReview,
  shuffleOptions,
  isBookmarked,
  onToggleBookmark,
  weekTitle,
  onSubmitExam
}) {
  const [internalSelectedKey, setInternalSelectedKey] = useState(selectedOptionKey || null);

  useEffect(() => {
    setInternalSelectedKey(selectedOptionKey || null);
  }, [selectedOptionKey, question.id]);

  const processedOptions = useMemo(() => {
    return prepareQuestionOptions(question, shuffleOptions);
  }, [question, shuffleOptions]);

  const handleOptionClick = (opt) => {
    soundManager.playClick();
    const newKey = opt.originalKey;
    setInternalSelectedKey(newKey);
    onSelectOption(question.id, newKey);
  };

  const handleClear = () => {
    soundManager.playClick();
    setInternalSelectedKey(null);
    onClearOption(question.id);
  };

  const isAnswered = Boolean(internalSelectedKey);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div key={question.id} className="seed-quiz-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Sub-header meta bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-forest)',
            background: 'var(--bg-sage-light)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-sage-border)'
          }}>
            {weekTitle || 'Applied AI Exam'}
          </span>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-forest)',
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)'
          }}>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mark for Review Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMarkForReview(question.id);
            }}
            style={{
              background: isMarkedForReview ? '#fef3c7' : 'transparent',
              border: isMarkedForReview ? '1.5px solid #d97706' : '1px solid var(--color-sage-border)',
              color: isMarkedForReview ? '#b45309' : 'var(--text-muted)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
          >
            <Flag size={14} fill={isMarkedForReview ? '#d97706' : 'none'} color={isMarkedForReview ? '#d97706' : 'currentColor'} />
            {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleBookmark(question.id);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isBookmarked ? '#d97706' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '4px'
            }}
            title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      {/* QUESTION STATEMENT */}
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.95rem',
        fontWeight: 600,
        color: 'var(--color-forest)',
        lineHeight: 1.35,
        letterSpacing: '-0.02em',
        marginBottom: '10px'
      }}>
        {question.question}
      </h2>

      <p style={{
        fontSize: '0.94rem',
        color: 'var(--text-muted)',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>Select one option. You can change your choice anytime before submitting.</span>
        {isAnswered && (
          <button
            onClick={handleClear}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d93025',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={13} /> Clear Choice
          </button>
        )}
      </p>

      {/* EXAM OPTIONS - NO ANSWER REVEALED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
        {processedOptions.map((opt) => {
          const isThisSelected = internalSelectedKey === opt.originalKey;

          return (
            <button
              key={`${question.id}_${opt.originalKey}`}
              onClick={() => handleOptionClick(opt)}
              className="seed-option-pill"
              style={{
                borderColor: isThisSelected ? 'var(--color-forest)' : 'var(--color-sage-border)',
                background: isThisSelected ? 'var(--bg-sage-light)' : '#ffffff',
                boxShadow: isThisSelected ? '0 4px 14px rgba(28, 58, 39, 0.12)' : '0 2px 6px rgba(28, 58, 39, 0.03)',
                fontWeight: isThisSelected ? 600 : 500
              }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: isThisSelected ? 'var(--color-forest)' : 'var(--bg-sage-light)',
                color: isThisSelected ? '#ffffff' : 'var(--color-forest)',
                fontWeight: 700,
                fontSize: '0.88rem',
                marginRight: '14px',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}>
                {opt.displayLabel}
              </span>

              <span style={{ flex: 1, paddingRight: '12px', color: 'var(--text-dark)' }}>
                {opt.text}
              </span>

              {/* Radio Indicator */}
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: isThisSelected ? '6px solid var(--color-forest)' : '2px solid #cbd5e1',
                background: '#ffffff',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }} />
            </button>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '36px',
        gap: '16px',
        flexWrap: 'wrap',
        borderTop: '1px solid #e2e8e0',
        paddingTop: '24px'
      }}>
        <button
          onClick={() => {
            soundManager.playClick();
            onPrev();
          }}
          disabled={currentIndex === 0}
          className="seed-btn-secondary"
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onSubmitExam();
            }}
            style={{
              background: '#fef3c7',
              border: '1.5px solid #d97706',
              color: '#92400e',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.94rem',
              padding: '12px 24px',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Submit Exam
          </button>

          {!isLastQuestion ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onNext();
              }}
              className="seed-btn-continue"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playClick();
                onSubmitExam();
              }}
              className="seed-btn-continue"
              style={{ background: 'var(--color-forest)' }}
            >
              <CheckCircle2 size={18} /> Finish Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
