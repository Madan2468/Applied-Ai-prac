import React from 'react';
import { Grid, ChevronDown, ChevronUp } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function QuestionNavigator({
  questions,
  currentIndex,
  onSelectIndex,
  userAnswers,
  isOpen,
  setIsOpen
}) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      marginBottom: '24px'
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={18} color="var(--accent-purple)" />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
            Question Navigator ({currentIndex + 1} / {questions.length})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
              Correct
            </span>
            <span style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }} />
              Missed
            </span>
          </div>
          {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </div>
      </div>

      {isOpen && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))',
          gap: '8px',
          marginTop: '16px',
          maxHeight: '220px',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {questions.map((q, idx) => {
            const ansRecord = userAnswers[q.id];
            const isCurrent = idx === currentIndex;
            
            let bg = 'rgba(255, 255, 255, 0.05)';
            let borderColor = 'rgba(255, 255, 255, 0.1)';
            let textColor = 'var(--text-muted)';

            if (ansRecord) {
              if (ansRecord.isCorrect) {
                bg = 'rgba(16, 185, 129, 0.25)';
                borderColor = 'var(--accent-green)';
                textColor = '#fff';
              } else {
                bg = 'rgba(244, 63, 94, 0.25)';
                borderColor = 'var(--accent-red)';
                textColor = '#fff';
              }
            }

            if (isCurrent) {
              borderColor = 'var(--accent-cyan)';
              bg = isCurrent && !ansRecord ? 'rgba(6, 182, 212, 0.25)' : bg;
            }

            return (
              <button
                key={q.id || idx}
                onClick={() => {
                  soundManager.playClick();
                  onSelectIndex(idx);
                }}
                style={{
                  height: '38px',
                  borderRadius: '10px',
                  background: bg,
                  border: `1.5px solid ${borderColor}`,
                  color: textColor,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: isCurrent ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
