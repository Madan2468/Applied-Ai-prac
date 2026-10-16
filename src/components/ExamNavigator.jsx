import React from 'react';
import { Grid, ChevronDown, ChevronUp, Flag, CheckCircle2, Circle } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ExamNavigator({
  questions,
  currentIndex,
  onSelectIndex,
  examAnswers,
  markedForReview,
  isOpen,
  setIsOpen,
  onSubmitExam
}) {
  const total = questions.length;
  const answeredCount = Object.keys(examAnswers).filter(k => Boolean(examAnswers[k])).length;
  const markedCount = markedForReview.size;
  const unansweredCount = total - answeredCount;

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid var(--color-sage-border)',
      borderRadius: '20px',
      padding: '16px 20px',
      marginBottom: '24px',
      boxShadow: '0 4px 16px rgba(28, 58, 39, 0.05)'
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'var(--bg-sage-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-forest)'
          }}>
            <Grid size={18} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-forest)' }}>
              Question Palette ({currentIndex + 1} / {total})
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {answeredCount} of {total} answered • {markedCount} marked
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'var(--color-forest)' }} />
              Answered ({answeredCount})
            </span>
            <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#d97706' }} />
              Marked ({markedCount})
            </span>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#cbd5e1' }} />
              Unanswered ({unansweredCount})
            </span>
          </div>

          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #edf2ea' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
            gap: '8px',
            maxHeight: '220px',
            overflowY: 'auto',
            paddingRight: '4px',
            paddingBottom: '8px'
          }}>
            {questions.map((q, idx) => {
              const isAnswered = Boolean(examAnswers[q.id]);
              const isMarked = markedForReview.has(q.id);
              const isCurrent = idx === currentIndex;

              let bg = '#ffffff';
              let borderColor = 'var(--color-sage-border)';
              let textColor = 'var(--text-body)';

              if (isAnswered) {
                bg = 'var(--color-forest)';
                borderColor = 'var(--color-forest)';
                textColor = '#ffffff';
              }

              if (isMarked) {
                bg = isAnswered ? '#92400e' : '#fef3c7';
                borderColor = '#d97706';
                textColor = isAnswered ? '#ffffff' : '#92400e';
              }

              if (isCurrent) {
                borderColor = '#2563eb';
                if (!isAnswered && !isMarked) {
                  bg = '#eff6ff';
                  textColor = '#1d4ed8';
                }
              }

              return (
                <button
                  key={q.id || idx}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectIndex(idx);
                  }}
                  style={{
                    height: '42px',
                    borderRadius: '10px',
                    background: bg,
                    border: `2px solid ${borderColor}`,
                    color: textColor,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    boxShadow: isCurrent ? '0 0 0 2px rgba(37, 99, 235, 0.25)' : 'none'
                  }}
                  title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}${isMarked ? ' (Marked for review)' : ''}`}
                >
                  <span>{idx + 1}</span>
                  {isMarked && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#d97706'
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid #edf2ea',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Click any question number to review or change answer.
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onSubmitExam();
              }}
              style={{
                background: 'var(--color-forest)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 20px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={15} /> Finish & Submit Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
