import React from 'react';
import { Play, BookOpen, RotateCcw, Flame, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function WeekSelector({
  weeksData,
  onSelectWeek,
  onSelectAllWeeks,
  onSelectStudyWeek,
  userStats,
  onResetStats
}) {
  const totalQuestionsAllWeeks = weeksData.reduce((acc, w) => acc + w.questions.length, 0);

  let totalAttempted = 0;
  let totalCorrect = 0;
  Object.keys(userStats.answers || {}).forEach((qId) => {
    const record = userStats.answers[qId];
    if (record) {
      totalAttempted++;
      if (record.isCorrect) totalCorrect++;
    }
  });

  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          fontWeight: 500,
          color: 'var(--color-forest)',
          letterSpacing: '-0.02em',
          marginBottom: '10px'
        }}>
          Applied AI Practice Platform
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '620px', margin: '0 auto 24px' }}>
          Interactive NPTEL solution practice platform inspired by minimalist product recommendation design.
        </p>

        {/* Quick Stats Pill */}
        <div style={{
          display: 'inline-flex',
          gap: '24px',
          background: '#ffffff',
          border: '1.5px solid var(--color-sage-border)',
          padding: '12px 28px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--color-forest)'
        }}>
          <div>Attempted: <strong>{totalAttempted}/{totalQuestionsAllWeeks}</strong></div>
          <div style={{ color: 'var(--color-sage)' }}>•</div>
          <div>Accuracy: <strong>{overallAccuracy}%</strong></div>
          <div style={{ color: 'var(--color-sage)' }}>•</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={16} fill="var(--color-forest)" color="var(--color-forest)" /> Streak: <strong>{userStats.streak || 0}</strong>
          </div>
        </div>
      </div>

      {/* ALL WEEKS PRACTICE MARATHON BUTTON */}
      <div style={{
        background: 'var(--color-forest)',
        borderRadius: '24px',
        padding: '28px 36px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 12px 30px rgba(28, 58, 39, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={26} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600 }}>
              All Weeks Practice (Full 150 MCQ Mock Exam)
            </h3>
            <p style={{ color: '#c5d4c8', fontSize: '0.92rem', marginTop: '3px' }}>
              Practice questions across all 10 weeks with dynamic option shuffling.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onSelectAllWeeks();
          }}
          style={{
            background: '#ffffff',
            border: 'none',
            color: 'var(--color-forest)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '14px 28px',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Play size={16} fill="var(--color-forest)" /> Start Full Mock
        </button>
      </div>

      {/* WEEKS GRID */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.35rem',
          fontWeight: 600,
          color: 'var(--color-forest)'
        }}>
          Week-Wise Practice Modules
        </h3>
        {totalAttempted > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Reset all progress statistics?")) {
                onResetStats();
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={14} /> Reset Stats
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {weeksData.map((weekObj) => {
          const weekNum = weekObj.week;
          const questions = weekObj.questions;
          
          let wAttempted = 0;
          let wCorrect = 0;
          questions.forEach((q) => {
            const ans = userStats.answers[q.id];
            if (ans) {
              wAttempted++;
              if (ans.isCorrect) wCorrect++;
            }
          });

          const wAccuracy = wAttempted > 0 ? Math.round((wCorrect / wAttempted) * 100) : 0;
          const isComplete = wAttempted >= questions.length;

          return (
            <div
              key={weekNum}
              style={{
                background: '#ffffff',
                border: '1.5px solid var(--color-sage-border)',
                borderRadius: '20px',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--bg-sage-light)',
                    color: 'var(--color-forest)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    WEEK {weekNum}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    15 MCQs
                  </span>
                </div>

                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--color-forest)',
                  lineHeight: 1.4,
                  marginBottom: '18px'
                }}>
                  {weekObj.title}
                </h4>

                {/* Progress bar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '6px',
                    fontWeight: 600
                  }}>
                    <span>{wAttempted} / {questions.length} Attempted</span>
                    <span>{wAccuracy}% Accuracy</span>
                  </div>
                  <div style={{
                    height: '5px',
                    background: '#e2e8e0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(wAttempted / questions.length) * 100}%`,
                      background: isComplete ? 'var(--color-correct-border)' : 'var(--color-forest)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectWeek(weekNum);
                  }}
                  className="seed-btn-continue"
                  style={{ flex: 1, padding: '12px 20px', fontSize: '0.92rem', minWidth: 'auto' }}
                >
                  <Play size={14} fill="#ffffff" /> Practice Week {weekNum}
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectStudyWeek(weekNum);
                  }}
                  style={{
                    background: 'var(--bg-sage-light)',
                    border: '1.5px solid var(--color-sage-border)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '12px 18px',
                    cursor: 'pointer',
                    color: 'var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Flashcards Study"
                >
                  <BookOpen size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
