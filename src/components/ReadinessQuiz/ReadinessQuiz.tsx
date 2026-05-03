'use client';

/* ============================================================
   CivicIQ — Readiness Quiz Component
   Interactive flow to check voter eligibility and generate
   an actionable checklist based on official guidelines.
   ============================================================ */

import { useState } from 'react';
import styles from './ReadinessQuiz.module.css';

type QuizStep = 'start' | 'q1' | 'q2' | 'q3' | 'result';

export default function ReadinessQuiz() {
  const [step, setStep] = useState<QuizStep>('start');
  const [answers, setAnswers] = useState({
    citizen: false,
    age: false,
    registered: false,
  });

  const resetQuiz = () => {
    setStep('start');
    setAnswers({ citizen: false, age: false, registered: false });
  };

  const renderContent = () => {
    switch (step) {
      case 'start':
        return (
          <div className={`${styles.centerContent} ${styles.animateIn}`}>
            <span className={styles.heroIcon} aria-hidden="true">📋</span>
            <h2 className={styles.title}>Am I Eligible to Vote?</h2>
            <p className={styles.description}>
              Take this 30-second official readiness check to see your eligibility 
              and get a personalized next-steps checklist.
            </p>
            <button className={styles.btnPrimary} onClick={() => setStep('q1')}>
              Start Check
            </button>
          </div>
        );

      case 'q1':
        return (
          <div className={`${styles.questionCard} ${styles.animateIn}`}>
            <span className={styles.stepIndicator}>Question 1 of 3</span>
            <h3 className={styles.questionText}>Are you an Indian citizen?</h3>
            <div className={styles.options}>
              <button 
                className={styles.btnOption} 
                onClick={() => { setAnswers(p => ({...p, citizen: true})); setStep('q2'); }}
              >
                Yes, I am a citizen
              </button>
              <button 
                className={styles.btnOption} 
                onClick={() => { setAnswers(p => ({...p, citizen: false})); setStep('result'); }}
              >
                No, I am not
              </button>
            </div>
          </div>
        );

      case 'q2':
        return (
          <div className={`${styles.questionCard} ${styles.animateIn}`}>
            <span className={styles.stepIndicator}>Question 2 of 3</span>
            <h3 className={styles.questionText}>Are you 18 years of age or older (or turning 18 soon)?</h3>
            <div className={styles.options}>
              <button 
                className={styles.btnOption} 
                onClick={() => { setAnswers(p => ({...p, age: true})); setStep('q3'); }}
              >
                Yes, 18 or older
              </button>
              <button 
                className={styles.btnOption} 
                onClick={() => { setAnswers(p => ({...p, age: false})); setStep('result'); }}
              >
                No, younger than 18
              </button>
            </div>
          </div>
        );

      case 'q3':
        return (
          <div className={`${styles.questionCard} ${styles.animateIn}`}>
            <span className={styles.stepIndicator}>Question 3 of 3</span>
            <h3 className={styles.questionText}>Is your name currently on the Electoral Roll (Voter List)?</h3>
            <div className={styles.options}>
              <button 
                className={styles.btnOption} 
                onClick={() => { setAnswers(p => ({...p, registered: true})); setStep('result'); }}
              >
                Yes, I am registered
              </button>
              <button 
                className={styles.btnOption} 
                onClick={() => { setAnswers(p => ({...p, registered: false})); setStep('result'); }}
              >
                No / I don&apos;t know
              </button>
            </div>
          </div>
        );

      case 'result':
        const isEligibleToRegister = answers.citizen && answers.age;
        const isReadyToVote = isEligibleToRegister && answers.registered;

        return (
          <div className={`${styles.resultCard} ${styles.animateIn}`}>
            {isReadyToVote ? (
              <>
                <span className={styles.resultIconSuccess}>🎉</span>
                <h3 className={styles.title}>You are ready to vote!</h3>
                <div className={styles.checklist}>
                  <p className={styles.checklistTitle}>Your Checklist:</p>
                  <ul>
                    <li>✅ Verify your polling booth location online.</li>
                    <li>✅ Carry your EPIC (Voter ID) or an approved alternative ID on polling day.</li>
                    <li>✅ Check out our EVM Simulator to practice the voting steps!</li>
                  </ul>
                </div>
              </>
            ) : isEligibleToRegister ? (
              <>
                <span className={styles.resultIconWarning}>📝</span>
                <h3 className={styles.title}>You need to register!</h3>
                <div className={styles.checklist}>
                  <p className={styles.checklistTitle}>Your Checklist:</p>
                  <ul>
                    <li>⚠️ You meet the age and citizenship criteria, but aren&apos;t registered.</li>
                    <li>👉 Visit the <b>Voter Helpline App</b> or <b>voters.eci.gov.in</b>.</li>
                    <li>👉 Fill out <b>Form 6</b> online to get your name on the electoral roll.</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <span className={styles.resultIconError}>🛑</span>
                <h3 className={styles.title}>Not Currently Eligible</h3>
                <div className={styles.checklist}>
                  <p className={styles.checklistTitle}>Reasoning:</p>
                  <ul>
                    {!answers.citizen && <li>Only Indian citizens are eligible to vote in Indian elections.</li>}
                    {!answers.age && <li>You must be at least 18 years old on the qualifying date to register as a voter.</li>}
                  </ul>
                </div>
              </>
            )}
            <button className={styles.btnSecondary} onClick={resetQuiz} style={{ marginTop: '1rem' }}>
              Retake Check
            </button>
          </div>
        );
    }
  };

  return (
    <section className={styles.container} aria-live="polite">
      {renderContent()}
    </section>
  );
}
