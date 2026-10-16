import React from 'react';
import { AlertCircle, CheckCircle2, Flag, HelpCircle, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ExamSubmitModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  answeredCount,
  markedCount,
  timeTakenFormatted,
  examTitle
}) {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
        border: '1.5px solid var(--color-sage-border)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: unansweredCount > 0 ? '#fef3c7' : 'var(--bg-sage-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: unansweredCount > 0 ? '#d97706' : 'var(--color-forest)'
          }}>
            {unansweredCount > 0 ? <AlertCircle size={26} /> : <CheckCircle2 size={26} />}
          </div>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--color-forest)'
            }}>
              Submit Exam?
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              {examTitle || 'Applied AI Exam'}
            </p>
          </div>
        </div>

        {/* Overview Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          margin: '20px 0',
          background: 'var(--bg-organic)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid var(--color-sage-border)'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Questions</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-forest)' }}>{totalQuestions}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time Elapsed</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-forest)' }}>{timeTakenFormatted}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>Answered</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16a34a' }}>{answeredCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: unansweredCount > 0 ? '#d93025' : 'var(--text-muted)', fontWeight: 600 }}>
              Unanswered
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: unansweredCount > 0 ? '#d93025' : 'var(--text-muted)' }}>
              {unansweredCount}
            </div>
          </div>
        </div>

        {markedCount > 0 && (
          <div style={{
            fontSize: '0.85rem',
            color: '#b45309',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '10px 14px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Flag size={15} color="#d97706" />
            <span>You have <strong>{markedCount}</strong> questions marked for review.</span>
          </div>
        )}

        {unansweredCount > 0 && (
          <p style={{
            fontSize: '0.88rem',
            color: '#991b1b',
            marginBottom: '20px',
            lineHeight: 1.5
          }}>
            ⚠️ Notice: You still have <strong>{unansweredCount}</strong> unanswered questions. Unanswered questions will be scored as 0 marks.
          </p>
        )}

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Once submitted, your final score and the detailed answer key with explanations will be revealed.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="seed-btn-secondary"
            style={{ padding: '12px 22px', fontSize: '0.92rem' }}
          >
            Review Questions
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onConfirmSubmit();
            }}
            className="seed-btn-continue"
            style={{ padding: '12px 26px', fontSize: '0.92rem', minWidth: 'auto' }}
          >
            Yes, Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
