import React, { useState } from 'react';
import { Search, X, ArrowRight, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function SearchModal({
  isOpen,
  onClose,
  weeksData,
  onSelectQuestion
}) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  // Flatten and search
  let results = [];
  if (query.trim().length > 1) {
    const qLower = query.toLowerCase();
    weeksData.forEach((w) => {
      w.questions.forEach((q) => {
        const matchesQuestion = q.question.toLowerCase().includes(qLower);
        const matchesExp = q.explanation && q.explanation.toLowerCase().includes(qLower);
        const matchesOpts = Object.values(q.options).some(optText => optText.toLowerCase().includes(qLower));

        if (matchesQuestion || matchesExp || matchesOpts) {
          results.push({
            ...q,
            weekNum: w.week,
            weekTitle: w.title
          });
        }
      });
    });
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: 'rgba(7, 9, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '80px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Search Header Input */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Search size={22} color="var(--accent-purple)" />
          <input
            type="text"
            placeholder="Search keywords (e.g., 'Docker', 'Memory Wall', 'Tensor', 'SIMD', 'GPU')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1.1rem',
              fontFamily: 'var(--font-body)',
              outline: 'none'
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {query.trim().length < 2 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Type at least 2 characters to search across all 150 questions.
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No questions found matching "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Found {results.length} matching questions:
              </div>

              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectQuestion(item);
                    onClose();
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#c084fc', fontWeight: 700 }}>
                      Week {item.weekNum} • Question {item.q_num}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                      Ans: ({item.correct})
                    </span>
                  </div>

                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.98rem', lineHeight: 1.4 }}>
                    {item.question}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
