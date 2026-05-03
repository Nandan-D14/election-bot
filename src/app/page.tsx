"use client";

/* ============================================================
   CivicIQ — Main Page
   The home page with all views: Landing, Assistant, Simulator,
   ID Verifier, Profile, and more.
   ============================================================ */

import { useState, useCallback, useEffect, lazy, Suspense, useMemo } from "react";
import type { AudioState, LanguageTag } from "@/types";
import Header from "@/shared/Header/Header";
import FeatureCards from "@/shared/FeatureCards/FeatureCards";
import { useActivityScores } from "@/features/UserProfile/UserProfile";
import styles from "./page.module.css";

// Lazy load heavy components for code splitting
const VoiceAssistant = lazy(() => import("@/features/VoiceAssistant/VoiceAssistant"));
const Chatbot = lazy(() => import("@/features/Chatbot/Chatbot"));
const EVMSimulator = lazy(() => import("@/features/EVMSimulator/EVMSimulator"));
const ReadinessQuiz = lazy(() => import("@/features/ReadinessQuiz/ReadinessQuiz"));
const MythBuster = lazy(() => import("@/features/MythBuster/MythBuster"));
const VotingRules = lazy(() => import("@/features/VotingRules/VotingRules"));
const VotingGames = lazy(() => import("@/features/VotingGames/VotingGames"));
const ElectionProcessMap = lazy(() => import("@/features/ElectionProcessMap/ElectionProcessMap"));
const ElectionMindMap = lazy(() => import("@/features/ElectionMindMap/ElectionMindMap"));
const IDVerifier = lazy(() => import("@/features/IDVerifier/IDVerifier"));
const UserProfile = lazy(() => import("@/features/UserProfile/UserProfile"));

type ActiveView =
  | "landing"
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
type NavView = Exclude<ActiveView, "landing">;
export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("landing");
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [language, setLanguage] = useState<LanguageTag>("hi-IN");
  const isFullscreenView = activeView === "simulator" || activeView === "assistant";

  const { scores, markActivity, resetScores, totalPoints, completedCount } = useActivityScores();

  // Track view-based activities
  useEffect(() => {
    switch (activeView) {
      case "chatbot":
        markActivity("chatbotUsed");
        break;
      case "assistant":
        markActivity("voiceAssistantUsed");
        break;
      case "myths":
        markActivity("mythBusterUsed");
        break;
      case "rules":
        markActivity("votingRulesRead");
        break;
      case "games":
        markActivity("votingGamesPlayed");
        break;
      case "processmap":
        markActivity("processMapViewed");
        break;
      case "mindmap":
        markActivity("mindMapViewed");
        break;
      case "quiz":
        markActivity("quizCompleted");
        break;
      case "simulator":
        markActivity("evmSimulatorCompleted");
        break;
    }
  }, [activeView, markActivity]);

  // Single dispatcher replaces 11 separate useCallback definitions
  const navigateTo = useCallback((view: ActiveView) => setActiveView(view), []);
  const handleBackToLanding = useCallback(() => {
    setActiveView("landing");
    setAudioState("idle");
  }, []);

  const handleIdVerificationComplete = useCallback(() => {
    markActivity("idVerified");
  }, [markActivity]);

  // Memoize nav object to prevent Header re-renders when nothing changed
  const navProp = useMemo(
    () =>
      activeView !== "landing"
        ? {
            activeView,
            onHome: handleBackToLanding,
            onSelect: navigateTo as (v: NavView) => void,
          }
        : undefined,
    [activeView, handleBackToLanding, navigateTo]
  );

  return (
    <div className={styles.app}>
      <Header
        audioState={audioState}
        language={language}
        onLanguageChange={setLanguage}
        totalPoints={totalPoints}
        onProfileClick={() => navigateTo("profile")}
        nav={navProp}
      />

      <main id="main-content" className={`${styles.main} ${isFullscreenView ? styles.mainFullscreen : ""}`}>
        {/* Views */}
        <div className={styles.viewContainer}>
          {activeView === "landing" && (
            <FeatureCards
              onStartAssistant={() => navigateTo("assistant")}
              onStartSimulator={() => navigateTo("simulator")}
              onStartQuiz={() => navigateTo("quiz")}
              onStartMyths={() => navigateTo("myths")}
              onStartChatbot={() => navigateTo("chatbot")}
              onStartRules={() => navigateTo("rules")}
              onStartGames={() => navigateTo("games")}
              onStartProcessMap={() => navigateTo("processmap")}
              onStartMindMap={() => navigateTo("mindmap")}
              onStartVerifyId={() => navigateTo("verifyid")}
              onStartProfile={() => navigateTo("profile")}
            />
          )}

          {activeView === "assistant" && (
            <div
              data-testid="assistant-view"
              className={`${styles.assistantView} ${
                isFullscreenView ? styles.assistantViewFullscreen : ""
              }`}
            >
              <Suspense fallback={<LoadingFallback />}>
                <VoiceAssistant audioState={audioState} onAudioStateChange={setAudioState} />
              </Suspense>
            </div>
          )}

          {activeView === "simulator" && (
            <div
              data-testid="simulator-view"
              className={`${styles.simulatorView} ${
                isFullscreenView ? styles.simulatorViewFullscreen : ""
              }`}
            >
              <Suspense fallback={<LoadingFallback />}>
                <EVMSimulator />
              </Suspense>
            </div>
          )}

          {activeView === "quiz" && (
            <div data-testid="quiz-view" className={styles.quizView}>
              <Suspense fallback={<LoadingFallback />}>
                <ReadinessQuiz />
              </Suspense>
            </div>
          )}

          {activeView === "myths" && (
            <div data-testid="myths-view" className={styles.mythsView}>
              <Suspense fallback={<LoadingFallback />}>
                <MythBuster />
              </Suspense>
            </div>
          )}

          {activeView === "chatbot" && (
            <div data-testid="chatbot-view" className={styles.chatbotView}>
              <Suspense fallback={<LoadingFallback />}>
                <Chatbot />
              </Suspense>
            </div>
          )}

          {activeView === "rules" && (
            <div data-testid="rules-view" className={styles.rulesView}>
              <Suspense fallback={<LoadingFallback />}>
                <VotingRules />
              </Suspense>
            </div>
          )}

          {activeView === "games" && (
            <div data-testid="games-view" className={styles.gamesView}>
              <Suspense fallback={<LoadingFallback />}>
                <VotingGames />
              </Suspense>
            </div>
          )}

          {activeView === "processmap" && (
            <div data-testid="process-map-view" className={styles.processMapView}>
              <Suspense fallback={<LoadingFallback />}>
                <ElectionProcessMap />
              </Suspense>
            </div>
          )}

          {activeView === "mindmap" && (
            <div data-testid="mind-map-view" className={styles.mindMapView}>
              <Suspense fallback={<LoadingFallback />}>
                <ElectionMindMap />
              </Suspense>
            </div>
          )}

          {activeView === "verifyid" && (
            <div data-testid="verify-id-view" className={styles.verifyIdView}>
              <Suspense fallback={<LoadingFallback />}>
                <IDVerifier onVerificationComplete={handleIdVerificationComplete} />
              </Suspense>
            </div>
          )}

          {activeView === "profile" && (
            <div data-testid="profile-view" className={styles.profileView}>
              <Suspense fallback={<LoadingFallback />}>
                <UserProfile
                  scores={scores}
                  totalPoints={totalPoints}
                  completedCount={completedCount}
                  onReset={resetScores}
                />
              </Suspense>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Hoisted style objects — avoids re-creating inline objects on every render
const loadingContainerStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "400px" } as const;
const loadingTextStyle = { textAlign: "center" as const };
const loadingLabelStyle = { fontSize: "1.5rem", color: "var(--color-text-muted)" };

function LoadingFallback() {
  return (
    <div style={loadingContainerStyle}>
      <div style={loadingTextStyle}>
        <div style={loadingLabelStyle}>Loading...</div>
      </div>
    </div>
  );
}
