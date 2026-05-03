'use client';

/* ============================================================
   CivicIQ — Main Page
   The home page with 3 views: Landing, Assistant, and Simulator.
   ============================================================ */

import { useState, useCallback } from 'react';
import type { AudioState, LanguageTag } from '@/types';
import Header from '@/components/Header/Header';
import FeatureCards from '@/components/FeatureCards/FeatureCards';
import VoiceAssistant from '@/components/VoiceAssistant/VoiceAssistant';
import Chatbot from '@/components/Chatbot/Chatbot';
import EVMSimulator from '@/components/EVMSimulator/EVMSimulator';
import ReadinessQuiz from '@/components/ReadinessQuiz/ReadinessQuiz';
import MythBuster from '@/components/MythBuster/MythBuster';
import VotingRules from '@/components/VotingRules/VotingRules';
import VotingGames from '@/components/VotingGames/VotingGames';
import ElectionProcessMap from '@/components/ElectionProcessMap/ElectionProcessMap';
import ElectionMindMap from '@/components/ElectionMindMap/ElectionMindMap';
import styles from './page.module.css';

type ActiveView = 'landing' | 'assistant' | 'simulator' | 'quiz' | 'myths' | 'chatbot' | 'rules' | 'games' | 'processmap' | 'mindmap';
type NavView = Exclude<ActiveView, 'landing'>;
export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [language, setLanguage] = useState<LanguageTag>('hi-IN');
  const isFullscreenView = activeView === 'simulator' || activeView === 'assistant';

  const handleStartAssistant = useCallback(() => setActiveView('assistant'), []);
  const handleStartSimulator = useCallback(() => setActiveView('simulator'), []);
  const handleStartQuiz = useCallback(() => setActiveView('quiz'), []);
  const handleStartMyths = useCallback(() => setActiveView('myths'), []);
  const handleStartChatbot = useCallback(() => setActiveView('chatbot'), []);
  const handleStartRules = useCallback(() => setActiveView('rules'), []);
  const handleStartGames = useCallback(() => setActiveView('games'), []);
  const handleStartProcessMap = useCallback(() => setActiveView('processmap'), []);
  const handleStartMindMap = useCallback(() => setActiveView('mindmap'), []);
  const handleBackToLanding = useCallback(() => {
    setActiveView('landing');
    setAudioState('idle');
  }, []);
  const handleSelectNav = useCallback((v: NavView) => setActiveView(v), []);

  return (
    <div className={styles.app}>
      <Header
        audioState={audioState}
        language={language}
        onLanguageChange={setLanguage}
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
            />
          )}

          {activeView === 'assistant' && (
            <div
              className={`${styles.assistantView} ${
                isFullscreenView ? styles.assistantViewFullscreen : ''
              }`}
            >
              <VoiceAssistant
                audioState={audioState}
                onAudioStateChange={setAudioState}
              />
            </div>
          )}

          {activeView === 'simulator' && (
            <div
              className={`${styles.simulatorView} ${
                isFullscreenView ? styles.simulatorViewFullscreen : ''
              }`}
            >
              <EVMSimulator />
            </div>
          )}

          {activeView === 'quiz' && (
            <div className={styles.quizView}>
              <ReadinessQuiz />
            </div>
          )}

          {activeView === 'myths' && (
            <div className={styles.mythsView}>
              <MythBuster />
            </div>
          )}

          {activeView === 'chatbot' && (
            <div className={styles.chatbotView}>
              <Chatbot />
            </div>
          )}

          {activeView === 'rules' && (
            <div className={styles.rulesView}>
              <VotingRules />
            </div>
          )}

          {activeView === 'games' && (
            <div className={styles.gamesView}>
              <VotingGames />
            </div>
          )}

          {activeView === 'processmap' && (
            <div className={styles.processMapView}>
              <ElectionProcessMap />
            </div>
          )}

          {activeView === 'mindmap' && (
            <div className={styles.mindMapView}>
              <ElectionMindMap />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
