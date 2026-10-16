import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Clock, 
  Award, 
  Flame, 
  ArrowRight, 
  Filter,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  BarChart3,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ExamResults({
  questions,
  examAnswers,
  totalTimeSeconds,
  onRetakeExam,
  onDrillMissed,
  onBackToWeeks,
  examTitle,
  bookmarks,
  onToggleBookmark
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'incorrect' | 'correct' | 'skipped'
  const [selectedWeekFilter, setSelectedWeekFilter] = useState('all');
  const [expandedExplanations, setExpandedExplanations] = useState(new Set());

  // Calculate statistics
  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    const weekStatsMap = {};

    questions.forEach((q) => {
      const wNum = q.weekNum || (q.id.startsWith('w') ? parseInt(q.id.split('_')[0].replace('w', ''), 10) : 1);
      if (!weekStatsMap[wNum]) {
        weekStatsMap[wNum] = {
          weekNum: wNum,
          weekTitle: q.weekTitle || `Week ${wNum}`,
          total: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0
        };
      }
      weekStatsMap[wNum].total++;

      const ansKey = examAnswers[q.id];
      if (ansKey) {
        if (ansKey === q.correct) {
          correct++;
          weekStatsMap[wNum].correct++;
        } else {
          incorrect++;
          weekStatsMap[wNum].incorrect++;
        }
      } else {
        skipped++;
        weekStatsMap[wNum].skipped++;
      }
    });

    const total = questions.length;
    const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;

    const weekStatsList = Object.values(weekStatsMap).sort((a, b) => a.weekNum - b.weekNum);

    return {
      total,
      correct,
      incorrect,
      skipped,
      scorePercent,
      weekStatsList
    };
  }, [questions, examAnswers]);

  useEffect(() => {
    soundManager.playFanfare();
    if (stats.scorePercent >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn(e);
      }
    }
  }, [stats.scorePercent]);

  // Format time
  const formattedTime = useMemo(() => {
    const mins = Math.floor(totalTimeSeconds / 60);
    const secs = totalTimeSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }, [totalTimeSeconds]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const ansKey = examAnswers[q.id];
      const isCorrect = ansKey === q.correct;
      const isSkipped = !ansKey;

      // Filter by status
      if (filterType === 'correct' && !isCorrect) return false;
      if (filterType === 'incorrect' && (isCorrect || isSkipped)) return false;
      if (filterType === 'skipped' && !isSkipped) return false;

      // Filter by week
      if (selectedWeekFilter !== 'all') {
        const wNum = q.weekNum || (q.id.startsWith('w') ? parseInt(q.id.split('_')[0].replace('w', ''), 10) : 1);
        if (String(wNum) !== String(selectedWeekFilter)) return false;
      }

      return true;
    });
  }, [questions, examAnswers, filterType, selectedWeekFilter]);

  let gradeBadge = "Needs Practice";
  let badgeColor = "#d97706";
  let badgeBg = "#fef3c7";

  if (stats.scorePercent >= 90) {
    gradeBadge = "🏆 Master - Outstanding Performance!";
    badgeColor = "#15803d";
    badgeBg = "#dcfce7";
  } else if (stats.scorePercent >= 75) {
    gradeBadge = "⭐ Distinction - Great Job!";
    badgeColor = "#0369a1";
    badgeBg = "#e0f2fe";
  } else if (stats.scorePercent >= 50) {
    gradeBadge = "👍 Pass - Good Effort!";
    badgeColor = "#4338ca";
    badgeBg = "#e0e7ff";
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* Top Banner / Summary Card */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid var(--color-sage-border)',
        borderRadius: '24px',
        padding: '36px 32px',
        textAlign: 'center',
        boxShadow: '0 12px 36px rgba(28, 58, 39, 0.07)',
        marginBottom: '36px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: badgeBg,
          color: badgeColor,
          padding: '6px 18px',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 800,
          fontSize: '0.88rem',
          letterSpacing: '0.02em',
          marginBottom: '16px'
        }}>
          {gradeBadge}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.4rem',
          fontWeight: 600,
          color: 'var(--color-forest)',
          marginBottom: '6px'
        }}>
          Exam Results & Solution Analysis
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 28px' }}>
          {examTitle || 'Applied AI Exam Simulation'}
        </p>

        {/* Big Score Radial & Stats Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          margin: '28px 0'
        }}>
          {/* Radial score box */}
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `conic-gradient(var(--color-correct-border) ${stats.scorePercent}%, #e2e8e0 0%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            boxShadow: '0 8px 24px rgba(19, 115, 51, 0.15)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                {stats.scorePercent}%
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {stats.correct} / {stats.total} Marks
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            textAlign: 'left',
            flex: 1,
            maxWidth: '560px'
          }}>
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              padding: '14px 18px',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '0.82rem' }}>
                <CheckCircle2 size={16} /> Correct
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-forest)', marginTop: '2px' }}>
                {stats.correct}
              </div>
            </div>

            <div style={{
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              padding: '14px 18px',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 700, fontSize: '0.82rem' }}>
                <XCircle size={16} /> Incorrect
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-forest)', marginTop: '2px' }}>
                {stats.incorrect}
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              padding: '14px 18px',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>
                <HelpCircle size={16} /> Skipped
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-forest)', marginTop: '2px' }}>
                {stats.skipped}
              </div>
            </div>

            <div style={{
              background: 'var(--bg-sage-light)',
              border: '1.5px solid var(--color-sage-border)',
              padding: '14px 18px',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-sage-dark)', fontWeight: 700, fontSize: '0.82rem' }}>
                <Clock size={16} /> Time Spent
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-forest)', marginTop: '4px' }}>
                {formattedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginTop: '28px',
          borderTop: '1px solid #edf2ea',
          paddingTop: '24px'
        }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onRetakeExam();
            }}
            className="seed-btn-continue"
            style={{ padding: '12px 28px', fontSize: '0.94rem' }}
          >
            <RotateCcw size={16} /> Retake Exam
          </button>

          {stats.incorrect > 0 && (
            <button
              onClick={() => {
                soundManager.playClick();
                onDrillMissed();
              }}
              style={{
                background: '#fff',
                border: '1.5px solid #d93025',
                color: '#d93025',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.94rem',
                padding: '12px 24px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Flame size={16} color="#d93025" /> Practice {stats.incorrect} Missed Questions
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              onBackToWeeks();
            }}
            className="seed-btn-secondary"
            style={{ padding: '12px 24px', fontSize: '0.94rem' }}
          >
            <Layers size={16} /> Back to Modules
          </button>
        </div>
      </div>

      {/* WEEK-WISE BREAKDOWN TABLE (ESPECIALLY FOR OVERALL EXAM) */}
      {stats.weekStatsList.length > 1 && (
        <div style={{
          background: '#ffffff',
          border: '1.5px solid var(--color-sage-border)',
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '36px',
          boxShadow: '0 8px 24px rgba(28, 58, 39, 0.04)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BarChart3 size={20} color="var(--color-forest)" /> Week-Wise Performance Breakdown
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Track your strengths and identify specific weeks that require additional revision.
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {stats.weekStatsList.map((w) => {
              const weekPercent = w.total > 0 ? Math.round((w.correct / w.total) * 100) : 0;
              const isPerfect = weekPercent === 100;

              return (
                <div
                  key={w.weekNum}
                  onClick={() => setSelectedWeekFilter(selectedWeekFilter === String(w.weekNum) ? 'all' : String(w.weekNum))}
                  style={{
                    background: selectedWeekFilter === String(w.weekNum) ? 'var(--bg-sage-light)' : '#ffffff',
                    border: selectedWeekFilter === String(w.weekNum) ? '2px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Click to filter review questions for this week"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      color: 'var(--color-forest)'
                    }}>
                      Week {w.weekNum}
                    </span>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: weekPercent >= 75 ? '#15803d' : (weekPercent >= 50 ? '#b45309' : '#b91c1c')
                    }}>
                      {w.correct} / {w.total} ({weekPercent}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: '6px',
                    background: '#e2e8e0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${weekPercent}%`,
                      background: weekPercent >= 75 ? 'var(--color-correct-border)' : (weekPercent >= 50 ? '#d97706' : '#d93025'),
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED QUESTION & SOLUTION REVIEW */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid var(--color-sage-border)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 8px 24px rgba(28, 58, 39, 0.04)'
      }}>
        {/* Header & Filter Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid #edf2ea',
          paddingBottom: '20px'
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--color-forest)'
            }}>
              Detailed Question Solutions & Answers ({filteredQuestions.length})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Review the correct answers and in-depth explanations for every question.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterType('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: filterType === 'all' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                background: filterType === 'all' ? 'var(--color-forest)' : '#ffffff',
                color: filterType === 'all' ? '#ffffff' : 'var(--text-body)'
              }}
            >
              All ({stats.total})
            </button>

            <button
              onClick={() => setFilterType('incorrect')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: filterType === 'incorrect' ? '1.5px solid #dc2626' : '1px solid var(--color-sage-border)',
                background: filterType === 'incorrect' ? '#dc2626' : '#ffffff',
                color: filterType === 'incorrect' ? '#ffffff' : '#dc2626'
              }}
            >
              Missed ({stats.incorrect})
            </button>

            <button
              onClick={() => setFilterType('correct')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: filterType === 'correct' ? '1.5px solid #16a34a' : '1px solid var(--color-sage-border)',
                background: filterType === 'correct' ? '#16a34a' : '#ffffff',
                color: filterType === 'correct' ? '#ffffff' : '#16a34a'
              }}
            >
              Correct ({stats.correct})
            </button>

            {stats.skipped > 0 && (
              <button
                onClick={() => setFilterType('skipped')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: filterType === 'skipped' ? '1.5px solid #64748b' : '1px solid var(--color-sage-border)',
                  background: filterType === 'skipped' ? '#64748b' : '#ffffff',
                  color: filterType === 'skipped' ? '#ffffff' : '#64748b'
                }}
              >
                Skipped ({stats.skipped})
              </button>
            )}

            {stats.weekStatsList.length > 1 && (
              <select
                value={selectedWeekFilter}
                onChange={(e) => setSelectedWeekFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-sage-border)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--color-forest)',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Weeks</option>
                {stats.weekStatsList.map((w) => (
                  <option key={w.weekNum} value={w.weekNum}>
                    Week {w.weekNum} ({w.correct}/{w.total})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No questions match the selected filter.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const userAnsKey = examAnswers[q.id];
              const isCorrect = userAnsKey === q.correct;
              const isSkipped = !userAnsKey;
              const wNum = q.weekNum || (q.id.startsWith('w') ? parseInt(q.id.split('_')[0].replace('w', ''), 10) : 1);
              const isBookmarked = bookmarks && bookmarks.has(q.id);

              return (
                <div
                  key={q.id}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${isCorrect ? '#86efac' : (isSkipped ? '#cbd5e1' : '#fca5a5')}`,
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  {/* Top Bar: Week / Question Number & Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-pill)',
                        background: 'var(--bg-sage-light)',
                        color: 'var(--color-forest)'
                      }}>
                        Week {wNum} • Q{q.q_num || idx + 1}
                      </span>

                      {bookmarks && onToggleBookmark && (
                        <button
                          onClick={() => onToggleBookmark(q.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: isBookmarked ? '#d97706' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                      )}
                    </div>

                    <div>
                      {isCorrect ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: '#15803d',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          background: '#f0fdf4',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-pill)'
                        }}>
                          <CheckCircle2 size={16} /> Correct
                        </span>
                      ) : isSkipped ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: '#64748b',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          background: '#f8fafc',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-pill)'
                        }}>
                          <HelpCircle size={16} /> Skipped / Not Attempted
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: '#b91c1c',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          background: '#fef2f2',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-pill)'
                        }}>
                          <XCircle size={16} /> Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Title */}
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.18rem',
                    fontWeight: 600,
                    color: 'var(--color-forest)',
                    lineHeight: 1.4,
                    marginBottom: '18px'
                  }}>
                    {q.question}
                  </h4>

                  {/* Option List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                    {Object.keys(q.options).map((key) => {
                      const isOptionCorrect = key === q.correct;
                      const isOptionSelected = key === userAnsKey;

                      let optBg = '#ffffff';
                      let optBorder = '1px solid #e2e8e0';
                      let optColor = 'var(--text-body)';

                      if (isOptionCorrect) {
                        optBg = '#f0fdf4';
                        optBorder = '2px solid var(--color-correct-border)';
                        optColor = 'var(--color-correct-text)';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optBg = '#fef2f2';
                        optBorder = '2px solid #ef4444';
                        optColor = '#991b1b';
                      }

                      return (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 18px',
                            borderRadius: 'var(--radius-pill)',
                            background: optBg,
                            border: optBorder,
                            color: optColor,
                            fontSize: '0.94rem',
                            fontWeight: isOptionCorrect || isOptionSelected ? 600 : 400
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: isOptionCorrect ? 'var(--color-correct-border)' : (isOptionSelected ? '#ef4444' : '#edf2ea'),
                              color: isOptionCorrect || isOptionSelected ? '#ffffff' : 'var(--color-forest)',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              flexShrink: 0
                            }}>
                              {key}
                            </span>
                            <span>{q.options[key]}</span>
                          </div>

                          <div>
                            {isOptionCorrect && (
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: 'var(--color-correct-border)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <CheckCircle2 size={15} /> Correct Answer
                              </span>
                            )}
                            {isOptionSelected && !isOptionCorrect && (
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#ef4444',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <XCircle size={15} /> Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Explanation */}
                  {q.explanation && (
                    <div style={{
                      background: 'var(--bg-organic)',
                      border: '1.5px solid var(--color-sage-border)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      marginTop: '12px'
                    }}>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--color-forest)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '6px'
                      }}>
                        <Lightbulb size={16} color="var(--color-forest)" /> Concept & Explanation
                      </div>
                      <p style={{
                        fontSize: '0.92rem',
                        color: 'var(--text-body)',
                        lineHeight: 1.6
                      }}>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Back Button */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToWeeks();
            }}
            className="seed-btn-continue"
          >
            <Layers size={18} /> Return to Course Modules
          </button>
        </div>
      </div>
    </div>
  );
}
