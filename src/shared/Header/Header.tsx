"use client";

/* ============================================================
   CivicIQ — Header Component
   Sticky glass header with logo, status indicator, and language selector.
   ============================================================ */

import type { AudioState, LanguageTag } from "@/types";
import LanguageSelector from "@/shared/LanguageSelector/LanguageSelector";
import styles from "./Header.module.css";

type NavView =
  | "assistant"
  | "simulator"
  | "quiz"
  | "myths"
  | "chatbot"
  | "rules"
  | "games"
  | "processmap"
  | "mindmap"
  | "verifyid"
  | "profile";

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
  idle: "Ready",
  listening: "Listening...",
  thinking: "Processing...",
  speaking: "Speaking...",
};

export default function Header({
  audioState,
  language,
  onLanguageChange,
  totalPoints,
  onProfileClick,
  nav,
}: HeaderProps) {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.topRow}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏛️</span>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>CivicIQ</span>
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
            <div className={styles.tabs} role="tablist">
              <button
                className={`${styles.tab} ${nav.activeView === "assistant" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("assistant")}
                id="tab-assistant"
                role="tab"
                aria-selected={nav.activeView === "assistant"}
              >
                <span role="img" aria-label="assistant">
                  💬
                </span>{" "}
                Assistant
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "simulator" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("simulator")}
                id="tab-simulator"
                role="tab"
                aria-selected={nav.activeView === "simulator"}
              >
                <span role="img" aria-label="simulator">
                  🗳️
                </span>{" "}
                Simulator
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "quiz" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("quiz")}
                id="tab-quiz"
                role="tab"
                aria-selected={nav.activeView === "quiz"}
              >
                <span role="img" aria-label="quiz">
                  📋
                </span>{" "}
                Check Eligibility
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "myths" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("myths")}
                id="tab-myths"
                role="tab"
                aria-selected={nav.activeView === "myths"}
              >
                <span role="img" aria-label="myths">
                  🛡️
                </span>{" "}
                Myth Buster
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "chatbot" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("chatbot")}
                id="tab-chatbot"
                role="tab"
                aria-selected={nav.activeView === "chatbot"}
              >
                <span role="img" aria-label="chatbot">
                  🤖
                </span>{" "}
                Chatbot
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "rules" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("rules")}
                id="tab-rules"
                role="tab"
                aria-selected={nav.activeView === "rules"}
              >
                <span role="img" aria-label="rules">
                  📜
                </span>{" "}
                Rules
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "verifyid" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("verifyid")}
                id="tab-verifyid"
                role="tab"
                aria-selected={nav.activeView === "verifyid"}
              >
                <span role="img" aria-label="verify id">
                  🪪
                </span>{" "}
                Verify ID
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "games" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("games")}
                id="tab-games"
                role="tab"
                aria-selected={nav.activeView === "games"}
              >
                <span role="img" aria-label="games">
                  🎮
                </span>{" "}
                Games
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "processmap" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("processmap")}
                id="tab-processmap"
                role="tab"
                aria-selected={nav.activeView === "processmap"}
              >
                <span role="img" aria-label="process map">
                  🗺️
                </span>{" "}
                Process
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "mindmap" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("mindmap")}
                id="tab-mindmap"
                role="tab"
                aria-selected={nav.activeView === "mindmap"}
              >
                <span role="img" aria-label="mind map">
                  🧠
                </span>{" "}
                MindMap
              </button>
              <button
                className={`${styles.tab} ${nav.activeView === "profile" ? styles.tabActive : ""}`}
                onClick={() => nav.onSelect("profile")}
                id="tab-profile"
                role="tab"
                aria-selected={nav.activeView === "profile"}
              >
                <span role="img" aria-label="profile">
                  👤
                </span>{" "}
                Profile
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
