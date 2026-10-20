import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Zap, 
  BookOpen, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Search, 
  ClipboardCheck,
  Clock,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Brain,
  Home
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Navbar({
  activeMode,
  setActiveMode,
  shuffleOptions,
  setShuffleOptions,
  isMuted,
  setIsMuted,
  onOpenSearch,
  currentIndex,
  totalQuestions,
  currentProgressPercent,
  onCloseQuiz,
  onStartExam,
  examTimerSeconds,
  onSubmitExam,
  subjectId = 'applied-ai',
  subjectName = 'Applied AI',
  onNavigateHome,
  onSwitchSubject
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleAudio = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const isExam = activeMode === 'exam';
  const isPractice = activeMode === 'practice' || activeMode === 'all_practice';
  const isFundamentals = subjectId === 'fundamentals';

  const formatTimer = (secs = 0) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header style={{
      background: '#f9f9f5',
      borderBottom: '1px solid #e2e8e0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Top Thin Progress Bar */}
      {(isPractice || isExam) && (
        <div className="seed-top-stepper">
          <div 
            className="seed-top-stepper-fill" 
            style={{ 
              width: `${currentProgressPercent || 0}%`,
              background: isExam 
                ? 'linear-gradient(90deg, #d97706, #16a34a)' 
                : isFundamentals
                  ? 'linear-gradient(90deg, #4338ca, #6366f1)'
                  : undefined
            }} 
          />
        </div>
      )}

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left: Back Button / Brand / Course Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(isPractice || isExam || activeMode === 'exam_results') ? (
            <button
              onClick={() => {
                soundManager.playClick();
                if (isExam) {
                  if (window.confirm("Are you sure you want to exit the exam? Your current exam progress will be cancelled.")) {
                    onCloseQuiz();
                  }
                } else {
                  onCloseQuiz();
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: isFundamentals ? '#4338ca' : 'var(--color-forest)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title="Back to Weeks"
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
              {/* Home Icon button */}
              {onNavigateHome && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigateHome();
                  }}
                  title="Return to Course Selection"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-sage-border)',
                    borderRadius: '8px',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-forest)',
                    transition: 'all 0.15s'
                  }}
                >
                  <Home size={16} />
                </button>
              )}

              {/* Course Selector Dropdown Button */}
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  color: isFundamentals ? '#1e1b4b' : 'var(--color-forest)',
                  background: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-sage-border)',
                  userSelect: 'none'
                }}
              >
                {isFundamentals ? (
                  <Brain size={18} color="#4338ca" />
                ) : (
                  <Cpu size={18} color="var(--color-forest)" />
                )}
                <span>{subjectName}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>

              {/* Course Switcher Menu */}
              {isDropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '115%',
                    left: 0,
                    width: '260px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8e0',
                    padding: '8px',
                    zIndex: 200
                  }}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div style={{
                    padding: '6px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em'
                  }}>
                    Switch NPTEL Course
                  </div>

                  <div
                    onClick={() => {
                      soundManager.playClick();
                      setIsDropdownOpen(false);
                      if (onSwitchSubject) onSwitchSubject('applied-ai');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: subjectId === 'applied-ai' ? '#edf7ee' : 'transparent',
                      color: subjectId === 'applied-ai' ? '#166534' : 'var(--text-dark)',
                      fontWeight: subjectId === 'applied-ai' ? 700 : 500,
                      fontSize: '0.88rem'
                    }}
                  >
                    <Cpu size={16} color="#166534" />
                    <div>
                      <div>Applied Artificial Intelligence</div>
                      <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>12 Weeks • 168 MCQs</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      soundManager.playClick();
                      setIsDropdownOpen(false);
                      if (onSwitchSubject) onSwitchSubject('fundamentals');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: subjectId === 'fundamentals' ? '#eef2ff' : 'transparent',
                      color: subjectId === 'fundamentals' ? '#4338ca' : 'var(--text-dark)',
                      fontWeight: subjectId === 'fundamentals' ? 700 : 500,
                      fontSize: '0.88rem',
                      marginTop: '4px'
                    }}
                  >
                    <Brain size={16} color="#4338ca" />
                    <div>
                      <div>Language Acquisition</div>
                      <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>12 Weeks • 300 MCQs</div>
                    </div>
                  </div>

                  {onNavigateHome && (
                    <div
                      onClick={() => {
                        soundManager.playClick();
                        setIsDropdownOpen(false);
                        onNavigateHome();
                      }}
                      style={{
                        borderTop: '1px solid #f1f5f9',
                        marginTop: '6px',
                        padding: '8px 10px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-forest)',
                        cursor: 'pointer'
                      }}
                    >
                      <Home size={14} /> Back to Courses Hub
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Brand Mark or Active Exam Badge */}
        {isExam ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              background: '#fef3c7',
              border: '1px solid #d97706',
              color: '#92400e',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706', animation: 'gentlePulse 1.5s infinite' }} />
              EXAM MODE
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: 'var(--color-forest)',
              background: '#ffffff',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-sage-border)'
            }}>
              <Clock size={14} color="#d97706" />
              {formatTimer(examTimerSeconds)}
            </div>
          </div>
        ) : isPractice ? (
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: isFundamentals ? '#1e1b4b' : 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isFundamentals ? <Brain size={16} color="#4338ca" /> : <Cpu size={16} color="var(--color-forest)" />}
            {subjectName} <span style={{ color: 'var(--color-sage)', fontSize: '0.75rem' }}>●</span>
          </div>
        ) : null}

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {isExam ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: 'var(--text-muted)'
              }}>
                Q{currentIndex + 1} of {totalQuestions}
              </div>

              {onSubmitExam && (
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
                    padding: '6px 16px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={15} /> Submit
                </button>
              )}
            </div>
          ) : isPractice ? (
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}>
              {currentIndex + 1} / {totalQuestions}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => { soundManager.playClick(); setActiveMode('weeks'); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: activeMode === 'weeks' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                  background: activeMode === 'weeks' ? 'var(--color-forest)' : '#ffffff',
                  color: activeMode === 'weeks' ? '#ffffff' : 'var(--text-body)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Layers size={14} /> Modules
              </button>

              <button
                onClick={() => { soundManager.playClick(); onStartExam && onStartExam(); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid #d97706',
                  background: '#fffbeb',
                  color: '#b45309',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Start 168 MCQ Mock Exam"
              >
                <ClipboardCheck size={14} /> Exam Mode
              </button>

              <button
                onClick={() => { soundManager.playClick(); setActiveMode('all_practice'); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: activeMode === 'all_practice' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                  background: activeMode === 'all_practice' ? 'var(--color-forest)' : '#ffffff',
                  color: activeMode === 'all_practice' ? '#ffffff' : 'var(--text-body)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Zap size={14} /> All Practice
              </button>

              <button
                onClick={() => { soundManager.playClick(); setActiveMode('flashcards'); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: activeMode === 'flashcards' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                  background: activeMode === 'flashcards' ? 'var(--color-forest)' : '#ffffff',
                  color: activeMode === 'flashcards' ? '#ffffff' : 'var(--text-body)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <BookOpen size={14} /> Study
              </button>
            </div>
          )}

          {/* Option Shuffle Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShuffleOptions(!shuffleOptions);
            }}
            title={shuffleOptions ? "Shuffle Options: Enabled" : "Shuffle Options: Disabled"}
            style={{
              background: shuffleOptions ? 'var(--bg-sage-light)' : '#ffffff',
              border: '1px solid var(--color-sage-border)',
              color: shuffleOptions ? 'var(--color-forest)' : 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Shuffle size={13} /> {shuffleOptions ? 'Shuffle ON' : 'Shuffle OFF'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            style={{
              background: 'transparent',
              border: 'none',
              color: isMuted ? 'var(--text-muted)' : 'var(--color-forest)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-forest)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Search MCQs"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
