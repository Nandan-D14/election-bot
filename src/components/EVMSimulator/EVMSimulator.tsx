"use client";

/* ============================================================
   CivicIQ — 3D EVM + VVPAT Simulator
   Interactive Three.js-based educational voting machine simulator.
   Uses a Finite State Machine to guide users through polling day.
   ============================================================ */

import { useState, useCallback } from "react";
import { EVM_STEPS } from "@/constants/evm";
import type { EvmStep } from "@/types";
import EVM3DModel from "./EVM3DModel";
import EVM2DModel from "./EVM2DModel";
import Certificate from "../Certificate/Certificate";
import styles from "./EVMSimulator.module.css";

/** Step progression map */
const NEXT_STEP: Record<EvmStep, EvmStep | null> = {
  power_off: "power_on",
  power_on: "voter_verification",
  voter_verification: "ballot_selection",
  ballot_selection: "vote_cast",
  vote_cast: "vvpat_slip",
  vvpat_slip: "confirmation",
  confirmation: null,
};

export default function EVMSimulator() {
  const [currentStep, setCurrentStep] = useState<EvmStep>("power_off");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [vvpatVisible, setVvpatVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"2D" | "3D">("3D");

  const stepInfo = EVM_STEPS.find((s) => s.step === currentStep)!;
  const stepIndex = EVM_STEPS.findIndex((s) => s.step === currentStep);

  const advanceStep = useCallback(() => {
    const next = NEXT_STEP[currentStep];
    if (next) {
      if (next === "vvpat_slip") {
        setVvpatVisible(true);
        // VVPAT slip visible for 7 seconds per spec
        setTimeout(() => setVvpatVisible(false), 7000);
      }
      setCurrentStep(next);
    }
  }, [currentStep]);

  const handleCandidateSelect = useCallback((id: number) => {
    setSelectedCandidate(id);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep("power_off");
    setSelectedCandidate(null);
    setVvpatVisible(false);
  }, []);

  return (
    <div className={styles.container}>
      {/* Title Bar */}
      <div className={styles.titleBar}>
        <div className={styles.titleLeft}>
          <span className={styles.titleIcon}>🗳️</span>
          <h2 className={styles.title}>EVM + VVPAT Simulator</h2>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === "2D" ? styles.toggleActive : ""}`}
              onClick={() => setViewMode("2D")}
            >
              2D View
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === "3D" ? styles.toggleActive : ""}`}
              onClick={() => setViewMode("3D")}
            >
              3D View
            </button>
          </div>
        </div>
        <span className={styles.stepCounter}>
          Step {stepIndex + 1} / {EVM_STEPS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${((stepIndex + 1) / EVM_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left: Machine Visual (2D or 3D) */}
        <div className={styles.machineVisual}>
          {viewMode === "3D" ? (
            <EVM3DModel
              currentStep={currentStep}
              selectedCandidate={selectedCandidate}
              vvpatVisible={vvpatVisible}
              onCandidateSelect={handleCandidateSelect}
              onAdvanceStep={advanceStep}
            />
          ) : (
            <EVM2DModel
              currentStep={currentStep}
              selectedCandidate={selectedCandidate}
              vvpatVisible={vvpatVisible}
              onCandidateSelect={handleCandidateSelect}
              onAdvanceStep={advanceStep}
            />
          )}
        </div>

        {/* Right: Step Info Panel */}
        <div className={styles.infoPanel}>
          <div className={styles.stepIcon}>{stepInfo.icon}</div>
          <h3 className={styles.stepTitle}>{stepInfo.title}</h3>
          <p className={styles.stepDescription}>{stepInfo.description}</p>

          <div className={styles.instructionBox}>
            <span className={styles.instructionLabel}>👉 What to do</span>
            <p className={styles.instructionText}>{stepInfo.instruction}</p>
          </div>

          {/* Certificate displayed on completion step */}
          {currentStep === "confirmation" && <Certificate />}

          {/* Action Buttons */}
          <div className={styles.actions}>
            {currentStep === "ballot_selection" ? (
              <button
                className={`${styles.actionButton} ${styles.actionPrimary}`}
                onClick={advanceStep}
                disabled={selectedCandidate === null}
                id="evm-confirm-selection"
              >
                Confirm Selection
              </button>
            ) : currentStep === "confirmation" ? (
              <button
                className={`${styles.actionButton} ${styles.actionSecondary}`}
                onClick={handleReset}
                id="evm-restart"
              >
                🔄 Restart Simulation
              </button>
            ) : (
              <button
                className={`${styles.actionButton} ${styles.actionPrimary}`}
                onClick={advanceStep}
                id="evm-next-step"
              >
                {currentStep === "power_off" ? "⏻ Power On" : "Next Step →"}
              </button>
            )}
          </div>

          {/* Step indicators */}
          <div className={styles.stepDots}>
            {EVM_STEPS.map((s, i) => (
              <div
                key={s.step}
                className={`${styles.stepDot} ${
                  i < stepIndex
                    ? styles.stepDotCompleted
                    : i === stepIndex
                      ? styles.stepDotCurrent
                      : ""
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
