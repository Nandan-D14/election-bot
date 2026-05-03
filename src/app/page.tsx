'use client';

/* ============================================================
   CivicIQ — Main Page
   The home page with all views: Landing, Assistant, Simulator,
   ID Verifier, Profile, and more.
   ============================================================ */

import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import type { AudioState, LanguageTag } from '@/types';
import Header from '@/components/Header/Header';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import { useActivityScores } from '@/components/UserProfile/UserProfile';
import styles from './page.module.css';

// Lazy load heavy components for code splitting
const VoiceAssistant = lazy(() => import('@/components/VoiceAssistant/VoiceAssistant'));
const Chatbot = lazy(() => import('@/components/Chatbot/Chatbot'));
const EVMSimulator = lazy(() => import('@/components/EVMSimulator/EVMSimulator'));
const ReadinessQuiz = lazy(() => import('@/components/ReadinessQuiz/ReadinessQuiz'));
const MythBuster = lazy(() => import('@/components/MythBuster/MythBuster'));
const VotingRules = lazy(() => import('@/components/VotingRules/VotingRules'));
const VotingGames = lazy(() => import('@/components/VotingGames/VotingGames'));
const ElectionProcessMap = lazy(() => import('@/components/ElectionProcessMap/ElectionProcessMap'));
const ElectionMindMap = lazy(() => import('@/components/ElectionMindMap/ElectionMindMap'));
const IDVerifier = lazy(() => import('@/components/IDVerifier/IDVerifier'));
const UserProfile = lazy(() => import('@/components/UserProfile/UserProfile'));

type ActiveView = 'landing' | 'assistant' | 'simulator' | 'quiz' | 'myths' | 'chatbot' | 'rules' | 'games' | 'processmap' | 'mindmap' | 'verifyid' | 'profile';
type NavView = Exclude<ActiveView, 'landing'>;
export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [language, setLanguage] = useState<LanguageTag>('hi-IN');
  const isFullscreenView = activeView === 'simulator' || activeView === 'assistant';

  const { scores, markActivity, resetScores, totalPoints, completedCount } = useActivityScores();

  // Track view-based activities
  useEffect(() => {
    switch (activeView) {
      case 'chatbot': markActivity('chatbotUsed'); break;
      case 'assistant': markActivity('voiceAssistantUsed'); break;
      case 'myths': markActivity('mythBusterUsed'); break;
      case 'rules': markActivity('votingRulesRead'); break;
      case 'games': markActivity('votingGamesPlayed'); break;
      case 'processmap': markActivity('processMapViewed'); break;
      case 'mindmap': markActivity('mindMapViewed'); break;
      case 'quiz': markActivity('quizCompleted'); break;
      case 'simulator': markActivity('evmSimulatorCompleted'); break;
    }
  }, [activeView, markActivity]);

  const handleStartAssistant = useCallback(() => setActiveView('assistant'), []);
  const handleStartSimulator = useCallback(() => setActiveView('simulator'), []);
  const handleStartQuiz = useCallback(() => setActiveView('quiz'), []);
  const handleStartMyths = useCallback(() => setActiveView('myths'), []);
  const handleStartChatbot = useCallback(() => setActiveView('chatbot'), []);
  const handleStartRules = useCallback(() => setActiveView('rules'), []);
  const handleStartGames = useCallback(() => setActiveView('games'), []);
  const handleStartProcessMap = useCallback(() => setActiveView('processmap'), []);
  const handleStartMindMap = useCallback(() => setActiveView('mindmap'), []);
  const handleStartVerifyId = useCallback(() => setActiveView('verifyid'), []);
  const handleStartProfile = useCallback(() => setActiveView('profile'), []);
  const handleBackToLanding = useCallback(() => {
    setActiveView('landing');
    setAudioState('idle');
  }, []);
  const handleSelectNav = useCallback((v: NavView) => setActiveView(v), []);

  const handleIdVerificationComplete = useCallback(() => {
    markActivity('idVerified');
  }, [markActivity]);

  // Loading fallback for lazy-loaded components
  const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <div className={styles.app}>
      <Header
        audioState={audioState}
        language={language}
        onLanguageChange={setLanguage}
        totalPoints={totalPoints}
        onProfileClick={handleStartProfile}
        nav={
          activeView !== 'landing'
            ? {
                activeView,
                onHome: handleBackToLanding,
                onSelect: handleSelectNav,
              }
            : undefined
        }
      />

      <main className={`${styles.main} ${isFullscreenView ? styles.mainFullscreen : ''}`}>
        {/* Views */}
        <div className={styles.viewContainer}>
          {activeView === 'landing' && (
            <FeatureCards
              onStartAssistant={handleStartAssistant}
              onStartSimulator={handleStartSimulator}
              onStartQuiz={handleStartQuiz}
              onStartMyths={handleStartMyths}
              onStartChatbot={handleStartChatbot}
              onStartRules={handleStartRules}
              onStartGames={handleStartGames}
              onStartProcessMap={handleStartProcessMap}
              onStartMindMap={handleStartMindMap}
              onStartVerifyId={handleStartVerifyId}
              onStartProfile={handleStartProfile}
            />
          )}

          {activeView === 'assistant' && (
            <div
              className={`${styles.assistantView} ${
                isFullscreenView ? styles.assistantViewFullscreen : ''
              }`}
            >
              <Suspense fallback={<LoadingFallback />}>
                <VoiceAssistant
                  audioState={audioState}
                  onAudioStateChange={setAudioState}
                />
              </Suspense>
            </div>
          )}

          {activeView === 'simulator' && (
            <div
              className={`${styles.simulatorView} ${
                isFullscreenView ? styles.simulatorViewFullscreen : ''
              }`}
            >
              <Suspense fallback={<LoadingFallback />}>
                <EVMSimulator />
              </Suspense>
            </div>
          )}

          {activeView === 'quiz' && (
            <div className={styles.quizView}>
              <Suspense fallback={<LoadingFallback />}>
                <ReadinessQuiz />
              </Suspense>
            </div>
          )}

          {activeView === 'myths' && (
            <div className={styles.mythsView}>
              <Suspense fallback={<LoadingFallback />}>
                <MythBuster />
              </Suspense>
            </div>
          )}

          {activeView === 'chatbot' && (
            <div className={styles.chatbotView}>
              <Suspense fallback={<LoadingFallback />}>
                <Chatbot />
              </Suspense>
            </div>
          )}

          {activeView === 'rules' && (
            <div className={styles.rulesView}>
              <Suspense fallback={<LoadingFallback />}>
                <VotingRules />
              </Suspense>
            </div>
          )}

          {activeView === 'games' && (
            <div className={styles.gamesView}>
              <Suspense fallback={<LoadingFallback />}>
                <VotingGames />
              </Suspense>
            </div>
          )}

          {activeView === 'processmap' && (
            <div className={styles.processMapView}>
              <Suspense fallback={<LoadingFallback />}>
                <ElectionProcessMap />
              </Suspense>
            </div>
          )}

          {activeView === 'mindmap' && (
            <div className={styles.mindMapView}>
              <Suspense fallback={<LoadingFallback />}>
                <ElectionMindMap />
              </Suspense>
            </div>
          )}

          {activeView === 'verifyid' && (
            <div className={styles.verifyIdView}>
              <Suspense fallback={<LoadingFallback />}>
                <IDVerifier onVerificationComplete={handleIdVerificationComplete} />
              </Suspense>
            </div>
          )}

          {activeView === 'profile' && (
            <div className={styles.profileView}>
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
