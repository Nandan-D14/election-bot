"use client";

/* ============================================================
   CivicIQ — Voice Assistant (Calling-style Interface)
   Minimal voice interface with orb visualizer and clean controls.
   ============================================================ */

import { useState, useCallback, useEffect } from "react";
import type { AudioState } from "@/types";
import styles from "./VoiceAssistant.module.css";

interface VoiceAssistantProps {
  audioState: AudioState;
  onAudioStateChange: (state: AudioState) => void;
}

export default function VoiceAssistant({ audioState, onAudioStateChange }: VoiceAssistantProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>([0.3, 0.3, 0.3, 0.3, 0.3]);
  const [isPaused, setIsPaused] = useState(false);

  // Simulate audio levels when listening or speaking
  useEffect(() => {
    if (audioState !== "listening" && audioState !== "speaking") {
      return;
    }

    const interval = setInterval(() => {
      setAudioLevels((prev) => prev.map(() => 0.2 + Math.random() * 0.6));
    }, 100);

    return () => clearInterval(interval);
  }, [audioState]);

  const handleStart = useCallback(() => {
    if (audioState === "idle") {
      onAudioStateChange("listening");

      // Simulate conversation flow
      setTimeout(() => {
        onAudioStateChange("thinking");
      }, 3000);

      setTimeout(() => {
        onAudioStateChange("speaking");
      }, 5000);

      setTimeout(() => {
        onAudioStateChange("idle");
      }, 10000);
    }
  }, [audioState, onAudioStateChange]);

  const handleEnd = useCallback(() => {
    onAudioStateChange("idle");
  }, [onAudioStateChange]);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const getStatusText = () => {
    switch (audioState) {
      case "listening":
        return "Start speaking";
      case "thinking":
        return "Thinking...";
      case "speaking":
        return "Speaking";
      default:
        return "Tap to start";
    }
  };

  const getStatusDotColor = () => {
    switch (audioState) {
      case "listening":
        return "#ff6b6b";
      case "thinking":
        return "#feca57";
      case "speaking":
        return "#4facfe";
      default:
        return "transparent";
    }
  };

  // Compute display levels based on state
  const displayLevels =
    audioState === "listening" || audioState === "speaking"
      ? audioLevels
      : [0.3, 0.3, 0.3, 0.3, 0.3];

  return (
    <div className={styles.container}>
      {/* Status Dot */}
      <div className={styles.statusDot} style={{ backgroundColor: getStatusDotColor() }} />

      {/* Main Orb */}
      <div className={styles.orbContainer}>
        <div
          className={`${styles.orb} ${audioState !== "idle" ? styles.orbActive : ""}`}
          onClick={handleStart}
        >
          {audioState === "idle" && (
            <svg
              className={styles.orbIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </div>
      </div>

      {/* Audio Indicator */}
      <div className={styles.audioIndicator}>
        <svg className={styles.micIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
        <div className={styles.audioDots}>
          {displayLevels.map((level, i) => (
            <div
              key={i}
              className={styles.audioDot}
              style={{
                transform: `scale(${level})`,
                opacity: audioState === "idle" ? 0.3 : 0.8 + level * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Status Text */}
      <p className={styles.statusText}>{getStatusText()}</p>

      {/* Control Buttons */}
      <div className={styles.controls}>
        <button
          className={styles.controlButton}
          onClick={handlePauseToggle}
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
        </button>

        <button className={styles.endButton} onClick={handleEnd} aria-label="End call">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar} />
    </div>
  );
}
