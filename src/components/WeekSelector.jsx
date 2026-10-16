import React, { useState } from 'react';
import { Play, BookOpen, RotateCcw, Flame, Zap, ClipboardCheck, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function WeekSelector({
  weeksData,
  onSelectWeek,
  onSelectAllWeeks,
  onSelectWeekExam,
  onSelectAllWeeksExam,
  onSelectStudyWeek,
  userStats,
  onResetStats
}) {
  const [selectedHomeTab, setSelectedHomeTab] = useState('all'); // 'all' | 'practice' | 'exam'
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-sage-light)',
          border: '1px solid var(--color-sage-border)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px 14px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--color-forest)',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} color="var(--color-forest)" /> All 12 Weeks Complete Collection • 168 NPTEL MCQs
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          fontWeight: 500,
          color: 'var(--color-forest)',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}>
          Applied AI Practice & Mock Exam Platform
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '640px', margin: '0 auto 20px' }}>
          Prepare with instant-feedback Practice Mode, or simulate real exams with <strong>Exam Mode</strong> where answers and detailed solutions are revealed at the end!
        </p>

        {/* Quick Stats Pill */}
        <div style={{
          display: 'inline-flex',
          gap: '24px',
          background: '#ffffff',
          border: '1.5px solid var(--color-sage-border)',
          padding: '10px 26px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--color-forest)',
          boxShadow: '0 4px 12px rgba(28, 58, 39, 0.04)',
          flexWrap: 'wrap',
          justifyContent: 'center'
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

      {/* OVERALL MODES BANNER (FULL 12 WEEKS: PRACTICE VS EXAM) */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-forest) 0%, #152d1e 100%)',
        borderRadius: '24px',
        padding: '28px 32px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '36px',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 12px 30px rgba(28, 58, 39, 0.16)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', maxWidth: '580px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ClipboardCheck size={28} color="#fff" />
          </div>
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#86efac',
              marginBottom: '3px'
            }}>
              Grand Full-Length Mock Exam
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>
              All 12 Weeks Grand Marathon ({totalQuestionsAllWeeks} MCQs)
            </h3>
            <p style={{ color: '#d1fae5', fontSize: '0.88rem', marginTop: '4px', lineHeight: 1.4 }}>
              Take a comprehensive exam covering all 12 modules. Answers and deep explanations are revealed at the end with a full week-wise report card.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectAllWeeksExam();
            }}
            style={{
              background: '#ffffff',
              border: 'none',
              color: 'var(--color-forest)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.96rem',
              padding: '13px 26px',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <ClipboardCheck size={18} color="var(--color-forest)" /> Take Full 12-Week Exam
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onSelectAllWeeks();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.96rem',
              padding: '13px 22px',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Play size={16} fill="#ffffff" /> Practice Marathon
          </button>
        </div>
      </div>

      {/* FILTER TABS & RESET */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '22px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 600,
            color: 'var(--color-forest)',
            marginRight: '8px'
          }}>
            Week Modules (1 to 12)
          </h3>

          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-sage-light)',
            padding: '4px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-sage-border)',
            gap: '4px'
          }}>
            <button
              onClick={() => setSelectedHomeTab('all')}
              style={{
                background: selectedHomeTab === 'all' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: selectedHomeTab === 'all' ? 'var(--color-forest)' : 'var(--text-muted)',
                cursor: 'pointer',
                boxShadow: selectedHomeTab === 'all' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              All Actions
            </button>
            <button
              onClick={() => setSelectedHomeTab('exam')}
              style={{
                background: selectedHomeTab === 'exam' ? 'var(--color-forest)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: selectedHomeTab === 'exam' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <ClipboardCheck size={13} /> Exam Mode Only
            </button>
            <button
              onClick={() => setSelectedHomeTab('practice')}
              style={{
                background: selectedHomeTab === 'practice' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: selectedHomeTab === 'practice' ? 'var(--color-forest)' : 'var(--text-muted)',
                cursor: 'pointer',
                boxShadow: selectedHomeTab === 'practice' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Practice Mode Only
            </button>
          </div>
        </div>

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

      {/* WEEKS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: '22px'
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
                borderRadius: '22px',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(28, 58, 39, 0.03)'
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
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--bg-sage-light)',
                    color: 'var(--color-forest)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    WEEK {weekNum}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {questions.length} MCQs
                  </span>
                </div>

                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--color-forest)',
                  lineHeight: 1.4,
                  marginBottom: '16px'
                }}>
                  {weekObj.title}
                </h4>

                {/* Progress bar */}
                <div style={{ marginBottom: '22px' }}>
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

              {/* ACTION BUTTONS (EXAM MODE + PRACTICE + STUDY) */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(selectedHomeTab === 'all' || selectedHomeTab === 'exam') && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectWeekExam(weekNum);
                    }}
                    style={{
                      flex: 1,
                      padding: '11px 16px',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid var(--color-forest)',
                      background: selectedHomeTab === 'exam' ? 'var(--color-forest)' : '#f0fdf4',
                      color: selectedHomeTab === 'exam' ? '#ffffff' : 'var(--color-forest)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    title="Take Week Exam (answers and solutions revealed at the end)"
                  >
                    <ClipboardCheck size={16} /> Take Exam
                  </button>
                )}

                {(selectedHomeTab === 'all' || selectedHomeTab === 'practice') && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectWeek(weekNum);
                    }}
                    className={selectedHomeTab === 'exam' ? 'seed-btn-secondary' : 'seed-btn-continue'}
                    style={{
                      flex: 1,
                      padding: '11px 16px',
                      fontSize: '0.88rem',
                      minWidth: 'auto',
                      fontWeight: 700
                    }}
                    title="Practice with instant feedback & explanations"
                  >
                    <Play size={14} fill={selectedHomeTab === 'exam' ? 'currentColor' : '#ffffff'} /> Practice
                  </button>
                )}

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectStudyWeek(weekNum);
                  }}
                  style={{
                    background: 'var(--bg-sage-light)',
                    border: '1.5px solid var(--color-sage-border)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '11px 15px',
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
