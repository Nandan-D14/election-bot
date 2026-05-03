"use client";

/* ============================================================
   CivicIQ — Voice Assistant (Calling-style Interface)
   Minimal voice interface with orb visualizer and clean controls.
   ============================================================ */

import { useState, useCallback, useEffect, useRef } from "react";
import type { AudioState } from "@/types";
import { PCMRecorder } from "@/lib/audio/PCMRecorder";
import styles from "./VoiceAssistant.module.css";

interface VoiceAssistantProps {
  audioState: AudioState;
  onAudioStateChange: (state: AudioState) => void;
}

// Idle display levels — hoisted to avoid re-creation
const IDLE_LEVELS = [0.3, 0.3, 0.3, 0.3, 0.3];

export default function VoiceAssistant({ audioState, onAudioStateChange }: VoiceAssistantProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>(IDLE_LEVELS);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recorderRef = useRef<PCMRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Clean up recorder and socket on unmount
  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      socketRef.current?.close();
    };
  }, []);

  // Use requestAnimationFrame instead of 100ms setInterval for smoother, less CPU-heavy animation
  useEffect(() => {
    if (audioState !== "listening" && audioState !== "speaking") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAudioLevels(IDLE_LEVELS);
      return;
    }

    let rafId: number;
    let lastUpdate = 0;
    const UPDATE_INTERVAL = 100; // ms between level updates

    const animate = (timestamp: number) => {
      if (timestamp - lastUpdate >= UPDATE_INTERVAL) {
        lastUpdate = timestamp;
        setAudioLevels([
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6,
          0.2 + Math.random() * 0.6,
        ]);
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [audioState]);

  const handleStart = useCallback(async () => {
    if (audioState === "idle") {
      try {
        onAudioStateChange("listening");
        setTranscript("Listening...");

        // 1. Initialize WebSocket
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          socket.send(JSON.stringify({ type: "session.start", languageTag: "hi-IN" }));
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data as string);
            if (msg && typeof msg.type === "string") {
              if (msg.type === "stt.delta" && typeof msg.text === "string") {
                setTranscript((prev) => prev + " " + msg.text);
              } else if (msg.type === "status" && typeof msg.state === "string") {
                onAudioStateChange(msg.state as AudioState);
              }
            }
          } catch {
            console.warn("Received malformed WebSocket message.");
          }
        };

        socket.onerror = () => {
          console.error("WebSocket connection error.");
          onAudioStateChange("idle");
          setTranscript("Connection error. Please try again.");
        };

        // 2. Initialize Recorder
        recorderRef.current = new PCMRecorder((chunk) => {
          if (socket.readyState === WebSocket.OPEN) {
            // Convert Int16Array to Base64
            const buffer = chunk.buffer;
            const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
            socket.send(JSON.stringify({ type: "audio.chunk", dataB64: b64 }));
          }
        });

        await recorderRef.current.start();
      } catch (err) {
        console.error("Failed to start voice assistant:", err);
        onAudioStateChange("idle");
        setTranscript("Error starting microphone.");
      }
    }
  }, [audioState, onAudioStateChange]);

  const handleEnd = useCallback(() => {
    recorderRef.current?.stop();
    socketRef.current?.close();
    onAudioStateChange("idle");
    setTranscript("");
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
          {audioLevels.map((level, i) => (
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
      <div className={styles.statusContainer}>
        <p className={styles.statusText}>{getStatusText()}</p>
        {transcript && <p className={styles.transcript}>{transcript}</p>}
      </div>

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
