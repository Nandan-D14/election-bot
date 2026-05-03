'use client';

/* ============================================================
   CivicIQ — User Profile & Gamification Score Component
   Tracks activity across the app and displays a progress-based
   gamification score in a profile section.
   ============================================================ */

import { useState, useEffect, useCallback } from 'react';
import styles from './UserProfile.module.css';

export interface ActivityScores {
  chatbotUsed: boolean;
  voiceAssistantUsed: boolean;
  evmSimulatorCompleted: boolean;
  quizCompleted: boolean;
  mythBusterUsed: boolean;
  votingRulesRead: boolean;
  votingGamesPlayed: boolean;
  processMapViewed: boolean;
  mindMapViewed: boolean;
  idVerified: boolean;
}

interface Activity {
  key: keyof ActivityScores;
  label: string;
  icon: string;
  points: number;
  description: string;
}

const ACTIVITIES: Activity[] = [
  { key: 'chatbotUsed', label: 'AI Chatbot', icon: '🤖', points: 10, description: 'Asked a question to the AI chatbot' },
  { key: 'voiceAssistantUsed', label: 'Voice Assistant', icon: '🎙️', points: 15, description: 'Used the voice-first assistant' },
  { key: 'evmSimulatorCompleted', label: 'EVM Simulator', icon: '🗳️', points: 20, description: 'Completed the EVM/VVPAT voting simulation' },
  { key: 'quizCompleted', label: 'Readiness Quiz', icon: '📋', points: 15, description: 'Completed the voter readiness quiz' },
  { key: 'mythBusterUsed', label: 'Myth Buster', icon: '🛡️', points: 10, description: 'Explored myth busting content' },
  { key: 'votingRulesRead', label: 'Voting Rules', icon: '📜', points: 10, description: 'Read through the voting rules' },
  { key: 'votingGamesPlayed', label: 'Voting Games', icon: '🎮', points: 15, description: 'Played educational voting games' },
  { key: 'processMapViewed', label: 'Process Map', icon: '🗺️', points: 10, description: 'Viewed the election process map' },
  { key: 'mindMapViewed', label: 'Mind Map', icon: '🧠', points: 10, description: 'Explored the election mind map' },
  { key: 'idVerified', label: 'ID Verification', icon: '🪪', points: 25, description: 'Verified a Voter ID card' },
];

const MAX_POINTS = ACTIVITIES.reduce((sum, a) => sum + a.points, 0);

const STORAGE_KEY = 'civiciq_activity_scores';

export function useActivityScores() {
  const [scores, setScores] = useState<ActivityScores>(() => {
    // Default initial scores
    const defaultScores: ActivityScores = {
      chatbotUsed: false,
      voiceAssistantUsed: false,
      evmSimulatorCompleted: false,
      quizCompleted: false,
      mythBusterUsed: false,
      votingRulesRead: false,
      votingGamesPlayed: false,
      processMapViewed: false,
      mindMapViewed: false,
      idVerified: false,
    };

    if (typeof window === 'undefined') return defaultScores;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultScores;
    } catch {
      return defaultScores;
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      // localStorage not available
    }
  }, [scores]);

  const markActivity = useCallback((key: keyof ActivityScores) => {
    setScores(prev => {
      if (prev[key]) return prev; // Already done
      return { ...prev, [key]: true };
    });
  }, []);

  const resetScores = useCallback(() => {
    const emptyScores: ActivityScores = {
      chatbotUsed: false,
      voiceAssistantUsed: false,
      evmSimulatorCompleted: false,
      quizCompleted: false,
      mythBusterUsed: false,
      votingRulesRead: false,
      votingGamesPlayed: false,
      processMapViewed: false,
      mindMapViewed: false,
      idVerified: false,
    };
    setScores(emptyScores);
  }, []);

  const totalPoints = ACTIVITIES.reduce(
    (sum, a) => sum + (scores[a.key] ? a.points : 0),
    0
  );

  const completedCount = ACTIVITIES.filter(a => scores[a.key]).length;

  return { scores, markActivity, resetScores, totalPoints, completedCount };
}

function getBadge(points: number): { title: string; icon: string; color: string } {
  if (points >= 120) return { title: 'Master Voter', icon: '🏆', color: '#d4af37' };
  if (points >= 90) return { title: 'Expert Citizen', icon: '🥇', color: '#c0c0c0' };
  if (points >= 60) return { title: 'Active Learner', icon: '🥈', color: '#cd7f32' };
  if (points >= 30) return { title: 'Curious Citizen', icon: '🎖️', color: 'var(--color-accent-1)' };
  return { title: 'Newcomer', icon: '🌱', color: 'var(--color-accent-green)' };
}

interface UserProfileProps {
  scores: ActivityScores;
  totalPoints: number;
  completedCount: number;
  onReset: () => void;
}

export default function UserProfile({ scores, totalPoints, completedCount, onReset }: UserProfileProps) {
  const badge = getBadge(totalPoints);
  const progressPct = Math.round((totalPoints / MAX_POINTS) * 100);

  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar} style={{ borderColor: badge.color }}>
            <span className={styles.avatarIcon}>{badge.icon}</span>
          </div>
          <div className={styles.badgeTag} style={{ background: badge.color }}>
            {badge.title}
          </div>
        </div>

        <div className={styles.scoreOverview}>
          <div className={styles.totalScore}>
            <span className={styles.scoreValue}>{totalPoints}</span>
            <span className={styles.scoreMax}>/ {MAX_POINTS} pts</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%`, background: badge.color }}
            />
          </div>
          <p className={styles.progressText}>
            {completedCount} of {ACTIVITIES.length} activities completed ({progressPct}%)
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div className={styles.activityCard}>
        <h3 className={styles.sectionTitle}>📊 Your Activities</h3>
        <div className={styles.activityList}>
          {ACTIVITIES.map((activity) => {
            const isCompleted = scores[activity.key];
            return (
              <div
                key={activity.key}
                className={`${styles.activityItem} ${isCompleted ? styles.activityCompleted : ''}`}
              >
                <div className={styles.activityLeft}>
                  <span className={styles.activityIcon}>{activity.icon}</span>
                  <div className={styles.activityInfo}>
                    <span className={styles.activityLabel}>{activity.label}</span>
                    <span className={styles.activityDesc}>{activity.description}</span>
                  </div>
                </div>
                <div className={styles.activityRight}>
                  <span className={`${styles.activityPoints} ${isCompleted ? styles.activityPointsEarned : ''}`}>
                    {isCompleted ? '+' : ''}{activity.points} pts
                  </span>
                  <span className={styles.activityStatus}>
                    {isCompleted ? '✅' : '⬜'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div className={styles.badgesCard}>
        <h3 className={styles.sectionTitle}>🏅 Badge Levels</h3>
        <div className={styles.badgeGrid}>
          {[
            { min: 0, title: 'Newcomer', icon: '🌱', color: 'var(--color-accent-green)' },
            { min: 30, title: 'Curious Citizen', icon: '🎖️', color: 'var(--color-accent-1)' },
            { min: 60, title: 'Active Learner', icon: '🥈', color: '#cd7f32' },
            { min: 90, title: 'Expert Citizen', icon: '🥇', color: '#c0c0c0' },
            { min: 120, title: 'Master Voter', icon: '🏆', color: '#d4af37' },
          ].map((b) => (
            <div
              key={b.title}
              className={`${styles.badgeItem} ${totalPoints >= b.min ? styles.badgeUnlocked : styles.badgeLocked}`}
            >
              <span className={styles.badgeEmoji}>{b.icon}</span>
              <span className={styles.badgeName}>{b.title}</span>
              <span className={styles.badgeReq}>{b.min}+ pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className={styles.resetSection}>
        <button className={styles.resetButton} onClick={onReset}>
          🔄 Reset Progress
        </button>
        <p className={styles.resetHint}>This will clear all your activity progress</p>
      </div>
    </div>
  );
}
