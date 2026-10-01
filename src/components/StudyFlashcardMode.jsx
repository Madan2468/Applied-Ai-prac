import React, { useState } from 'react';
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Bookmark, 
  Sparkles, 
  Filter,
  Layers
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function StudyFlashcardMode({
  weeksData,
  bookmarks,
  onToggleBookmark
}) {
  const [selectedWeekFilter, setSelectedWeekFilter] = useState('all');
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  // Flatten questions
  let allQuestions = [];
  weeksData.forEach((w) => {
    if (selectedWeekFilter === 'all' || selectedWeekFilter === String(w.week)) {
      w.questions.forEach((q) => {
        allQuestions.push({
          ...q,
          weekNum: w.week,
          weekTitle: w.title
        });
      });
    }
  });

  if (onlyBookmarks) {
    allQuestions = allQuestions.filter((q) => bookmarks.has(q.id));
  }

  const toggleReveal = (id) => {
    soundManager.playClick();
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const revealAll = () => {
    soundManager.playClick();
    const next = new Set(allQuestions.map(q => q.id));
    setRevealedIds(next);
  };

  const hideAll = () => {
    soundManager.playClick();
    setRevealedIds(new Set());
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Controls */}
      <div className="glass-panel" style={{ padding: '24px 32px', marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <BookOpen color="var(--accent-green)" size={28} />
              Study & Revision Flashcards
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
              Review questions, correct answers, and detailed explanations for rapid revision.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Week Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={selectedWeekFilter}
                onChange={(e) => setSelectedWeekFilter(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{ background: '#0f172a' }}>All Weeks (150 MCQs)</option>
                {weeksData.map((w) => (
                  <option key={w.week} value={w.week} style={{ background: '#0f172a' }}>
                    Week {w.week} ({w.questions.length} MCQs)
                  </option>
                ))}
              </select>
            </div>

            {/* Bookmark Filter */}
            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              style={{
                background: onlyBookmarks ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: onlyBookmarks ? '1px solid var(--accent-amber)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: onlyBookmarks ? 'var(--accent-amber)' : 'var(--text-muted)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Bookmark size={15} /> Bookmarked Only ({bookmarks.size})
            </button>

            {/* Reveal/Hide All */}
            <button onClick={revealAll} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Eye size={15} /> Reveal All
            </button>
            <button onClick={hideAll} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <EyeOff size={15} /> Hide All
            </button>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {allQuestions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No questions found matching the selected filter.
          </div>
        ) : (
          allQuestions.map((q, idx) => {
            const isRevealed = revealedIds.has(q.id);
            const isBookmarked = bookmarks.has(q.id);

            return (
              <div
                key={q.id}
                className="glass-panel"
                style={{
                  padding: '28px',
                  position: 'relative',
                  borderLeft: '4px solid var(--accent-purple)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#c084fc',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    Week {q.weekNum} • Q{q.q_num}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isBookmarked ? 'var(--accent-amber)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <Bookmark size={18} fill={isBookmarked ? 'var(--accent-amber)' : 'none'} />
                    </button>

                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      {isRevealed ? 'Hide Answer' : 'Show Answer'}
                    </button>
                  </div>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '20px',
                  lineHeight: 1.5
                }}>
                  {q.question}
                </h3>

                {/* Options List */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  {Object.keys(q.options).map((key) => {
                    const isCorrect = key === q.correct;
                    let style = {
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.92rem',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    };

                    if (isRevealed && isCorrect) {
                      style.background = 'rgba(16, 185, 129, 0.18)';
                      style.borderColor = 'var(--accent-green)';
                      style.color = '#fff';
                      style.fontWeight = '700';
                    }

                    return (
                      <div key={key} style={style}>
                        <span style={{
                          fontWeight: 700,
                          color: isRevealed && isCorrect ? 'var(--accent-green)' : 'var(--accent-cyan)'
                        }}>
                          {key})
                        </span>
                        <span style={{ flex: 1 }}>{q.options[key]}</span>
                        {isRevealed && isCorrect && <CheckCircle2 size={16} color="var(--accent-green)" />}
                      </div>
                    );
                  })}
                </div>

                {/* Solution Explanation if revealed */}
                {isRevealed && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px 20px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} /> Solution Explanation
                    </div>
                    <p style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {q.explanation ? q.explanation : `The correct option is (${q.correct}): "${q.options[q.correct]}".`}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
