"use client";

/* ============================================================
   CivicIQ — 2D EVM + VVPAT Simulator
   HTML/CSS based representation of the EVM process.
   ============================================================ */

import { EVM_STEPS, SIMULATED_CANDIDATES } from "@/constants/evm";
import type { EvmStep } from "@/types";
import styles from "./EVMSimulator.module.css";

interface EVM2DModelProps {
  currentStep: EvmStep;
  selectedCandidate: number | null;
  vvpatVisible: boolean;
  onCandidateSelect: (id: number) => void;
  onAdvanceStep: () => void;
}

export default function EVM2DModel({
  currentStep,
  selectedCandidate,
  vvpatVisible,
  onCandidateSelect,
}: EVM2DModelProps) {
  const stepIndex = EVM_STEPS.findIndex((s) => s.step === currentStep);
  const stepInfo = EVM_STEPS[stepIndex]!;

  return (
    <div className={styles.evmUnit}>
      {/* Control Unit */}
      <div
        className={`${styles.controlUnit} ${currentStep !== "power_off" ? styles.unitActive : ""}`}
      >
        <div className={styles.unitLabel}>Control Unit</div>
        <div className={styles.unitScreen}>
          {currentStep === "power_off" ? (
            <span className={styles.screenOff}>OFF</span>
          ) : (
            <div className={styles.screenContent}>
              <span className={styles.screenIcon}>{stepInfo.icon}</span>
              <span className={styles.screenStatus}>{stepInfo.title}</span>
            </div>
          )}
        </div>
        {/* LED Indicators */}
        <div className={styles.leds}>
          <div className={`${styles.led} ${currentStep !== "power_off" ? styles.ledGreen : ""}`} />
          <div
            className={`${styles.led} ${currentStep === "ballot_selection" ? styles.ledAmber : ""}`}
          />
          <div
            className={`${styles.led} ${currentStep === "vote_cast" || currentStep === "confirmation" ? styles.ledBlue : ""}`}
          />
        </div>
      </div>

      {/* Ballot Unit */}
      <div
        className={`${styles.ballotUnit} ${currentStep === "ballot_selection" ? styles.ballotActive : ""}`}
      >
        <div className={styles.unitLabel}>Ballot Unit</div>
        <div className={styles.candidateList}>
          {SIMULATED_CANDIDATES.map((c) => (
            <button
              key={c.id}
              className={`${styles.candidateRow} ${selectedCandidate === c.id ? styles.candidateSelected : ""}`}
              onClick={() => {
                if (currentStep === "ballot_selection") {
                  onCandidateSelect(c.id);
                }
              }}
              disabled={currentStep !== "ballot_selection"}
              aria-label={`Select ${c.label}`}
            >
              <span className={styles.candidateSymbol}>{c.symbol}</span>
              <span className={styles.candidateName}>{c.label}</span>
              <div
                className={`${styles.voteButton} ${selectedCandidate === c.id ? styles.voteButtonPressed : ""}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* VVPAT Unit */}
      <div className={`${styles.vvpatUnit} ${vvpatVisible ? styles.vvpatActive : ""}`}>
        <div className={styles.unitLabel}>VVPAT</div>
        <div className={styles.vvpatWindow}>
          {vvpatVisible && selectedCandidate ? (
            (() => {
              const candidateData = SIMULATED_CANDIDATES.find((c) => c.id === selectedCandidate);
              return candidateData ? (
                <div className={styles.vvpatSlip}>
                  <span className={styles.slipSymbol}>{candidateData.symbol}</span>
                  <span className={styles.slipName}>{candidateData.label}</span>
                  <div className={styles.slipTimer}>
                    <div className={styles.slipTimerBar} />
                  </div>
                </div>
              ) : null;
            })()
          ) : (
            <span className={styles.vvpatEmpty}>—</span>
          )}
        </div>
      </div>
    </div>
  );
}
