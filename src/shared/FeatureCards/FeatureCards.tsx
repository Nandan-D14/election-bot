"use client";

/* ============================================================
   CivicIQ — Feature Cards
   Landing section showcasing key features with glass cards.
   ============================================================ */

import styles from "./FeatureCards.module.css";

interface Feature {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}

const FEATURES: Feature[] = [
  {
    icon: "🎙️",
    title: "Voice-First Assistant",
    description:
      "Ask questions about the electoral process in your preferred language. Get instant, accurate responses powered by AI.",
    accentColor: "rgba(79, 138, 255, 0.15)",
  },
  {
    icon: "🗳️",
    title: "3D EVM Simulator",
    description:
      "Practice the complete voting process step by step with an interactive EVM and VVPAT simulation.",
    accentColor: "rgba(34, 211, 238, 0.15)",
  },
  {
    icon: "🪪",
    title: "AI ID Verification",
    description:
      "Upload your Voter ID card and let our AI verify its authenticity, extract details, and check for issues.",
    accentColor: "rgba(251, 191, 36, 0.15)",
  },
  {
    icon: "🔒",
    title: "Politically Neutral",
    description:
      "Strictly non-partisan. We only educate about the process — never about parties, candidates, or ideologies.",
    accentColor: "rgba(52, 211, 153, 0.15)",
  },
];

interface FeatureCardsProps {
  onStartAssistant: () => void;
  onStartSimulator: () => void;
  onStartQuiz: () => void;
  onStartMyths: () => void;
  onStartChatbot?: () => void;
  onStartRules?: () => void;
  onStartGames?: () => void;
  onStartProcessMap?: () => void;
  onStartMindMap?: () => void;
  onStartVerifyId?: () => void;
  onStartProfile?: () => void;
}

export default function FeatureCards({
  onStartAssistant,
  onStartSimulator,
  onStartQuiz,
  onStartMyths,
  onStartChatbot,
  onStartRules,
  onStartGames,
  onStartProcessMap,
  onStartMindMap,
  onStartVerifyId,
  onStartProfile,
}: FeatureCardsProps) {
  return (
    <section className={styles.section} aria-label="Features">
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>🏛️ Electoral Education Assistant</div>
        <h1 className={styles.heroTitle}>
          Learn the <span className={styles.heroGradient}>Electoral Process</span> with AI
        </h1>
        <p className={styles.heroSubtitle}>
          CivicIQ helps you understand voter registration, polling procedures, and the EVM/VVPAT
          voting process — in your language, with complete political neutrality.
        </p>
        <div className={styles.heroActions}>
          <button
            className={styles.heroPrimary}
            onClick={onStartAssistant}
            id="start-assistant-button"
          >
            <span>🎙️</span> Talk to Assistant
          </button>
          <button
            className={styles.heroSecondary}
            onClick={onStartSimulator}
            id="start-simulator-button"
          >
            <span>🗳️</span> Try EVM Simulator
          </button>
        </div>

        <div className={styles.heroSubActions}>
          <button className={styles.heroTertiary} onClick={onStartQuiz} id="start-quiz-button">
            📋 Check Eligibility
          </button>
          <button className={styles.heroTertiary} onClick={onStartMyths} id="start-myths-button">
            🛡️ Myth Buster
          </button>
          <button
            className={styles.heroTertiary}
            onClick={onStartChatbot}
            id="start-chatbot-button"
          >
            🤖 AI Chatbot
          </button>
          <button className={styles.heroTertiary} onClick={onStartRules} id="start-rules-button">
            📜 Voting Rules
          </button>
          <button
            className={`${styles.heroTertiary} ${styles.verifyIdButton}`}
            onClick={onStartVerifyId}
            id="start-verify-id-button"
          >
            🪪 Verify ID
          </button>
          <button
            className={`${styles.heroTertiary} ${styles.highlightButton}`}
            onClick={onStartGames}
            id="start-games-button"
          >
            🎮 Fun Games
          </button>
          <button
            className={`${styles.heroTertiary} ${styles.mapButton}`}
            onClick={onStartProcessMap}
            id="start-process-map-button"
          >
            🗺️ Process Map
          </button>
          <button
            className={`${styles.heroTertiary} ${styles.mindMapButton}`}
            onClick={onStartMindMap}
            id="start-mind-map-button"
          >
            🧠 Mind Map
          </button>
          <button
            className={`${styles.heroTertiary} ${styles.profileButton}`}
            onClick={onStartProfile}
            id="start-profile-button"
          >
            👤 My Profile
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={styles.card}
            style={{ "--card-accent": feature.accentColor } as React.CSSProperties}
          >
            <div className={styles.cardIcon}>{feature.icon}</div>
            <h2 className={styles.cardTitle}>{feature.title}</h2>
            <p className={styles.cardDescription}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
