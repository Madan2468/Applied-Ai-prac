import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Flame,
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ResultsModal({
  questions,
  userAnswers,
  onRetake,
  onRetakeMissed,
  onBackToWeeks,
  quizTitle
}) {
  let correctCount = 0;
  let missedCount = 0;
  let unattemptedCount = 0;

  questions.forEach((q) => {
    const record = userAnswers[q.id];
    if (record) {
      if (record.isCorrect) correctCount++;
      else missedCount++;
    } else {
      unattemptedCount++;
    }
  });

  const total = questions.length;
  const scorePercent = Math.round((correctCount / total) * 100);

  useEffect(() => {
    soundManager.playFanfare();
    if (scorePercent >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [scorePercent]);

  let badgeText = "📖 Practice Makes Perfect";
  let badgeColor = "var(--accent-amber)";
  if (scorePercent >= 90) {
    badgeText = "🏆 Applied AI Master";
    badgeColor = "var(--accent-green)";
  } else if (scorePercent >= 75) {
    badgeText = "⚡ High Achiever";
    badgeColor = "var(--accent-cyan)";
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        {/* Top Trophy Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '24px',
          background: `linear-gradient(135deg, ${badgeColor}, #3b82f6)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: `0 0 35px ${badgeColor}`
        }}>
          <Trophy size={38} color="#fff" />
        </div>

        <span style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: badgeColor,
          fontFamily: 'var(--font-heading)',
          display: 'inline-block',
          marginBottom: '12px'
        }}>
          {badgeText}
        </span>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.4rem',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '6px'
        }}>
          Quiz Complete!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' }}>
          {quizTitle || 'Applied AI Practice'}
        </p>

        {/* Score Radial Circle Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'conic-gradient(var(--accent-green) ' + scorePercent + '%, rgba(255,255,255,0.08) 0%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'var(--bg-dark)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
                {scorePercent}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Score
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '16px 20px',
              borderRadius: '16px',
              minWidth: '140px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} /> Correct
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {correctCount}
              </div>
            </div>

            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '16px 20px',
              borderRadius: '16px',
              minWidth: '140px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-red)', fontWeight: 700, fontSize: '0.85rem' }}>
                <XCircle size={16} /> Incorrect
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {missedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => { soundManager.playClick(); onRetake(); }}
            className="btn-primary"
          >
            <RotateCcw size={18} /> Retake Quiz
          </button>

          {missedCount > 0 && (
            <button
              onClick={() => { soundManager.playClick(); onRetakeMissed(); }}
              className="btn-secondary"
              style={{ borderColor: 'var(--accent-red)', color: '#fca5a5' }}
            >
              <Flame size={18} color="var(--accent-red)" /> Drill Missed Questions ({missedCount})
            </button>
          )}

          <button
            onClick={() => { soundManager.playClick(); onBackToWeeks(); }}
            className="btn-secondary"
          >
            <Layers size={18} /> Back to Week Selection
          </button>
        </div>

        {/* Detailed Question Review List */}
        <div style={{ textAlign: 'left', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '32px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '20px'
          }}>
            Question Answer Review
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questions.map((q, idx) => {
              const ansRecord = userAnswers[q.id];
              const isCorrect = ansRecord && ansRecord.isCorrect;

              return (
                <div
                  key={q.id}
                  style={{
                    background: isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(244, 63, 94, 0.06)',
                    border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                    borderRadius: '16px',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Q{idx + 1}.
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                        {q.question}
                      </h4>
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      {isCorrect ? (
                        <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={18} /> Correct
                        </span>
                      ) : (
                        <span style={{ color: 'var(--accent-red)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={18} /> Missed
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <div style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                      ✓ Correct Answer ({q.correct}): {q.options[q.correct]}
                    </div>

                    {ansRecord && !ansRecord.isCorrect && (
                      <div style={{ color: 'var(--accent-red)', fontWeight: 600, marginTop: '4px' }}>
                        ✕ Your Pick: {ansRecord.selectedKey ? `${ansRecord.selectedKey}) ${q.options[ansRecord.selectedKey] || ''}` : 'Skipped'}
                      </div>
                    )}

                    {q.explanation && (
                      <div style={{
                        marginTop: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        color: '#cbd5e1',
                        fontSize: '0.85rem'
                      }}>
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
