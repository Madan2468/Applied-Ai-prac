import React from 'react';
import { 
  Cpu, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Bookmark, 
  CheckCircle2, 
  Layers, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  Search,
  Zap,
  Award
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function SubjectSelector({
  onSelectSubject,
  appliedAiStats,
  appliedAiBookmarks,
  fundamentalsStats,
  fundamentalsBookmarks,
  appliedAiTotal = 168,
  fundamentalsTotal = 300
}) {
  // Compute stats for Applied AI
  let appliedAttempted = 0;
  let appliedCorrect = 0;
  Object.keys(appliedAiStats.answers || {}).forEach((qId) => {
    const record = appliedAiStats.answers[qId];
    if (record) {
      appliedAttempted++;
      if (record.isCorrect) appliedCorrect++;
    }
  });
  const appliedAccuracy = appliedAttempted > 0 ? Math.round((appliedCorrect / appliedAttempted) * 100) : 0;

  // Compute stats for Fundamentals of Language Acquisition
  let fundAttempted = 0;
  let fundCorrect = 0;
  Object.keys(fundamentalsStats.answers || {}).forEach((qId) => {
    const record = fundamentalsStats.answers[qId];
    if (record) {
      fundAttempted++;
      if (record.isCorrect) fundCorrect++;
    }
  });
  const fundAccuracy = fundAttempted > 0 ? Math.round((fundCorrect / fundAttempted) * 100) : 0;

  const totalQuestionsBoth = appliedAiTotal + fundamentalsTotal;
  const totalAttemptedBoth = appliedAttempted + fundAttempted;
  const overallAccuracyBoth = totalAttemptedBoth > 0 
    ? Math.round(((appliedCorrect + fundCorrect) / totalAttemptedBoth) * 100) 
    : 0;

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-sage-light)',
          border: '1px solid var(--color-sage-border)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 18px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--color-forest)',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Sparkles size={15} color="var(--color-forest)" />
          NPTEL MOOC Assessment & Exam Preparation Suite
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 600,
          color: 'var(--color-forest)',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '14px'
        }}>
          Choose Your Course
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1.08rem',
          maxWidth: '680px',
          margin: '0 auto 24px',
          lineHeight: 1.6
        }}>
          Select an NPTEL MOOC below to begin practice drills, test yourself in timed full-length mock exams, or study key concepts with interactive flashcards.
        </p>

        {/* Global Combined Stats Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '20px',
          background: '#ffffff',
          border: '1.5px solid var(--color-sage-border)',
          padding: '10px 28px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--color-forest)',
          boxShadow: '0 4px 16px rgba(28, 58, 39, 0.05)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div><strong>2</strong> Courses Available</div>
          <div style={{ color: 'var(--color-sage)' }}>•</div>
          <div>Total Pool: <strong>{totalQuestionsBoth} MCQs</strong></div>
          <div style={{ color: 'var(--color-sage)' }}>•</div>
          <div>Attempted: <strong>{totalAttemptedBoth}/{totalQuestionsBoth}</strong></div>
          <div style={{ color: 'var(--color-sage)' }}>•</div>
          <div>Accuracy: <strong>{overallAccuracyBoth}%</strong></div>
        </div>
      </div>

      {/* Two Subject Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        marginBottom: '60px'
      }}>
        {/* SUBJECT 1: APPLIED ARTIFICIAL INTELLIGENCE */}
        <div 
          onClick={() => {
            soundManager.playClick();
            onSelectSubject('applied-ai');
          }}
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #e2e8e0',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(28, 58, 39, 0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = 'var(--color-forest)';
            e.currentTarget.style.boxShadow = '0 16px 36px rgba(28, 58, 39, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#e2e8e0';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(28, 58, 39, 0.04)';
          }}
        >
          {/* Top Decorative Header Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #16a34a, #1c3a27)'
          }} />

          <div>
            {/* Tag & Icon Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#edf7ee',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}>
                <Cpu size={13} /> NPTEL Computer Science
              </div>

              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#edf7ee',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu size={24} />
              </div>
            </div>

            {/* Course Title */}
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 600,
              color: 'var(--color-forest)',
              lineHeight: 1.25,
              marginBottom: '10px'
            }}>
              Applied Artificial Intelligence
            </h2>

            <p style={{
              color: 'var(--text-body)',
              fontSize: '0.94rem',
              lineHeight: 1.55,
              marginBottom: '20px'
            }}>
              Hardware architectures, Memory Wall, Roofline model, GPU kernel optimization, Triton DSL, TensorRT quantization, and distributed AI serving pipelines.
            </p>

            {/* Curriculum Highlights */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '24px'
            }}>
              {['12 Weeks', '168 MCQs', 'GPU Architecture', 'Triton DSL', 'TensorRT', 'Ray & Dask'].map((tag, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: '#f4f6f3',
                  color: '#4a5c45'
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress Bar & Quick Stats */}
            <div style={{
              background: '#f9faf8',
              borderRadius: '16px',
              padding: '14px 16px',
              border: '1px solid #e8ede7',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Course Progress</span>
                <span style={{ color: 'var(--color-forest)' }}>{appliedAttempted}/{appliedAiTotal} ({Math.round((appliedAttempted / appliedAiTotal) * 100)}%)</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: '#e2e8e0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((appliedAttempted / appliedAiTotal) * 100)}%`,
                  background: 'linear-gradient(90deg, #16a34a, #1c3a27)',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                <span>Accuracy: <strong>{appliedAccuracy}%</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Flame size={13} color="#ea580c" fill="#ea580c" /> Streak: <strong>{appliedAiStats.streak || 0}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Bookmark size={13} color="var(--color-forest)" /> Saved: <strong>{appliedAiBookmarks.size || 0}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onSelectSubject('applied-ai', 'all_practice');
                }}
                style={{
                  flex: 1,
                  background: '#f4f6f3',
                  border: '1px solid #d2dcd0',
                  color: 'var(--color-forest)',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Zap size={14} /> Practice All
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onSelectSubject('applied-ai', 'exam');
                }}
                style={{
                  flex: 1,
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Clock size={14} /> Mock Exam
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectSubject('applied-ai');
              }}
              style={{
                width: '100%',
                background: 'var(--color-forest)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '0.94rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#142a1c'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-forest)'}
            >
              Enter Applied AI <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* SUBJECT 2: FUNDAMENTALS OF LANGUAGE ACQUISITION */}
        <div 
          onClick={() => {
            soundManager.playClick();
            onSelectSubject('fundamentals');
          }}
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #e2e8e0',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(28, 58, 39, 0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = '#4338ca';
            e.currentTarget.style.boxShadow = '0 16px 36px rgba(67, 56, 202, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = '#e2e8e0';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(28, 58, 39, 0.04)';
          }}
        >
          {/* Top Decorative Header Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #6366f1, #4338ca)'
          }} />

          <div>
            {/* Tag & Icon Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#eef2ff',
                color: '#3730a3',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}>
                <Brain size={13} /> NPTEL NOC26 HS220
              </div>

              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#eef2ff',
                color: '#4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Brain size={24} />
              </div>
            </div>

            {/* Course Title */}
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 600,
              color: '#1e1b4b',
              lineHeight: 1.25,
              marginBottom: '10px'
            }}>
              Fundamentals of Language Acquisition
            </h2>

            <p style={{
              color: 'var(--text-body)',
              fontSize: '0.94rem',
              lineHeight: 1.55,
              marginBottom: '20px'
            }}>
              Language evolution, Skinner vs Chomsky, infant categorical perception, bootstrapping, dual-route morphology, syntax, second language acquisition, and brain disorders.
            </p>

            {/* Curriculum Highlights */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '24px'
            }}>
              {['12 Weeks', '300 MCQs', 'Speech Perception', 'Dual-Route Model', 'Syntax & UG', 'Brain & Disorders'].map((tag, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: '#f5f3ff',
                  color: '#4338ca'
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Progress Bar & Quick Stats */}
            <div style={{
              background: '#fbfbfe',
              borderRadius: '16px',
              padding: '14px 16px',
              border: '1px solid #e0e7ff',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Course Progress</span>
                <span style={{ color: '#4338ca' }}>{fundAttempted}/{fundamentalsTotal} ({Math.round((fundAttempted / fundamentalsTotal) * 100)}%)</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: '#e0e7ff', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((fundAttempted / fundamentalsTotal) * 100)}%`,
                  background: 'linear-gradient(90deg, #6366f1, #4338ca)',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                <span>Accuracy: <strong>{fundAccuracy}%</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Flame size={13} color="#ea580c" fill="#ea580c" /> Streak: <strong>{fundamentalsStats.streak || 0}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Bookmark size={13} color="#4338ca" /> Saved: <strong>{fundamentalsBookmarks.size || 0}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onSelectSubject('fundamentals', 'all_practice');
                }}
                style={{
                  flex: 1,
                  background: '#f5f3ff',
                  border: '1px solid #c7d2fe',
                  color: '#4338ca',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Zap size={14} /> Practice All
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onSelectSubject('fundamentals', 'exam');
                }}
                style={{
                  flex: 1,
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Clock size={14} /> Mock Exam
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectSubject('fundamentals');
              }}
              style={{
                width: '100%',
                background: '#4338ca',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '0.94rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#3730a3'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4338ca'}
            >
              Enter Language Acquisition <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        padding: '32px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid var(--color-sage-border)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--bg-sage-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={20} color="var(--color-forest)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '4px' }}>
              Instant-Feedback Practice
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Check answers immediately with detailed pedagogical explanations and option shuffling.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={20} color="#b45309" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '4px' }}>
              Timed Real Mock Exams
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Simulate actual NPTEL exams with answers hidden, question palette navigation, and Mark for Review.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#e0e7ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BookOpen size={20} color="#4338ca" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '4px' }}>
              Flashcards & Study Mode
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Review questions at your own pace with click-to-reveal answers and bookmark filtering.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Award size={20} color="#059669" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '4px' }}>
              Analytics & Missed Drills
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Track streaks, accuracy across modules, and drill down specifically into previously missed questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
