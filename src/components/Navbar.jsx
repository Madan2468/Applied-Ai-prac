import React from 'react';
import { 
  ArrowLeft, 
  Layers, 
  Zap, 
  BookOpen, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Search, 
  X 
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
  onCloseQuiz
}) {
  const toggleAudio = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header style={{
      background: '#f9f9f5',
      borderBottom: '1px solid #e2e8e0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Seed Top Thin Progress Bar */}
      {(activeMode === 'practice' || activeMode === 'all_practice') && (
        <div className="seed-top-stepper">
          <div className="seed-top-stepper-fill" style={{ width: `${currentProgressPercent || 0}%` }} />
        </div>
      )}

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left: Back Button / Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {(activeMode === 'practice' || activeMode === 'all_practice') ? (
            <button
              onClick={() => { soundManager.playClick(); onCloseQuiz(); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-forest)',
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
            <div 
              onClick={() => setActiveMode('weeks')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: 'var(--color-forest)'
              }}
            >
              Applied AI <span style={{ color: 'var(--color-sage)', fontSize: '0.8rem' }}>●</span>
            </div>
          )}
        </div>

        {/* Center: Brand Mark (Seed Refero Style) */}
        {(activeMode === 'practice' || activeMode === 'all_practice') && (
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Applied AI <span style={{ color: 'var(--color-sage)', fontSize: '0.75rem' }}>●</span>
          </div>
        )}

        {/* Right Controls / Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(activeMode === 'practice' || activeMode === 'all_practice') ? (
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}>
              {currentIndex + 1} / {totalQuestions}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => { soundManager.playClick(); setActiveMode('weeks'); }}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: activeMode === 'weeks' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                  background: activeMode === 'weeks' ? 'var(--color-forest)' : '#ffffff',
                  color: activeMode === 'weeks' ? '#ffffff' : 'var(--text-body)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={14} /> Weeks
              </button>

              <button
                onClick={() => { soundManager.playClick(); setActiveMode('all_practice'); }}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: activeMode === 'all_practice' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                  background: activeMode === 'all_practice' ? 'var(--color-forest)' : '#ffffff',
                  color: activeMode === 'all_practice' ? '#ffffff' : 'var(--text-body)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={14} /> All Weeks (150)
              </button>

              <button
                onClick={() => { soundManager.playClick(); setActiveMode('flashcards'); }}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: activeMode === 'flashcards' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-sage-border)',
                  background: activeMode === 'flashcards' ? 'var(--color-forest)' : '#ffffff',
                  color: activeMode === 'flashcards' ? '#ffffff' : 'var(--text-body)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
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
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Shuffle size={14} /> {shuffleOptions ? 'Shuffle ON' : 'Shuffle OFF'}
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
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
