'use client';

/* ============================================================
   CivicIQ — Header Component
   Sticky glass header with logo, status indicator, and language selector.
   ============================================================ */

import type { AudioState, LanguageTag } from '@/types';
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector';
import styles from './Header.module.css';

type NavView = 'assistant' | 'simulator' | 'quiz' | 'myths' | 'chatbot' | 'rules' | 'games' | 'processmap' | 'mindmap' | 'verifyid' | 'profile';

interface HeaderProps {
  audioState: AudioState;
  language: LanguageTag;
  onLanguageChange: (tag: LanguageTag) => void;
  totalPoints?: number;
  onProfileClick?: () => void;
  nav?: {
    activeView: NavView;
    onHome: () => void;
    onSelect: (view: NavView) => void;
  };
}

const STATE_LABELS: Record<AudioState, string> = {
  idle: 'Ready',
  listening: 'Listening...',
  thinking: 'Processing...',
  speaking: 'Speaking...',
};

export default function Header({ audioState, language, onLanguageChange, totalPoints, onProfileClick, nav }: HeaderProps) {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.topRow}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏛️</span>
            <div className={styles.logoText}>
              <h1 className={styles.logoTitle}>CivicIQ</h1>
              <span className={styles.logoSubtitle}>Electoral Education Assistant</span>
            </div>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.statusBadge}>
            <span className={`${styles.statusDot} ${styles[`statusDot--${audioState}`]}`} />
            <span className={styles.statusLabel}>{STATE_LABELS[audioState]}</span>
          </div>
        </div>

        <div className={styles.right}>
          {/* Score Badge */}
          {totalPoints !== undefined && (
            <button
              className={styles.scoreBadge}
              onClick={onProfileClick}
              aria-label={`Your score: ${totalPoints} points. Click to view profile.`}
              title="View Profile"
            >
              <span className={styles.scoreIcon}>⭐</span>
              <span className={styles.scoreNumber}>{totalPoints}</span>
              <span className={styles.scorePts}>pts</span>
            </button>
          )}
          <LanguageSelector value={language} onChange={onLanguageChange} />
        </div>
      </div>

      {nav ? (
        <div className={styles.navRow}>
          <nav className={styles.tabBar} aria-label="Main navigation">
            <button className={styles.backButton} onClick={nav.onHome} aria-label="Back to home">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Home
            </button>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${nav.activeView === 'assistant' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('assistant')}
                id="tab-assistant"
              >
                💬 Assistant
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'simulator' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('simulator')}
                id="tab-simulator"
              >
                🗳️ Simulator
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'quiz' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('quiz')}
                id="tab-quiz"
              >
                📋 Check Eligibility
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'myths' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('myths')}
                id="tab-myths"
              >
                🛡️ Myth Buster
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'chatbot' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('chatbot')}
                id="tab-chatbot"
              >
                🤖 Chatbot
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'rules' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('rules')}
                id="tab-rules"
              >
                📜 Rules
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'verifyid' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('verifyid')}
                id="tab-verifyid"
              >
                🪪 Verify ID
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'games' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('games')}
                id="tab-games"
              >
                🎮 Games
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'processmap' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('processmap')}
                id="tab-processmap"
              >
                🗺️ Process
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'mindmap' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('mindmap')}
                id="tab-mindmap"
              >
                🧠 MindMap
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === 'profile' ? styles.tabActive : ''}`}
                onClick={() => nav.onSelect('profile')}
                id="tab-profile"
              >
                👤 Profile
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
