'use client';

/* ============================================================
   CivicIQ — Certificate Component
   A digital "I learned to vote" badge shown after the EVM simulation.
   ============================================================ */

import styles from './Certificate.module.css';

export default function Certificate() {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className={`${styles.certificateCard} ${styles.animateIn}`}>
      <div className={styles.certHeader}>
        <span className={styles.medal}>🏅</span>
        <h3 className={styles.title}>Simulation Complete!</h3>
      </div>
      
      <div className={styles.badge}>
        <div className={styles.inkFinger}>☝️</div>
        <div className={styles.badgeText}>
          <h4>Certified Voter Ready</h4>
          <p>CivicIQ Electoral Education</p>
        </div>
      </div>
      
      <p className={styles.message}>
        You have successfully completed the <strong>Interactive EVM & VVPAT Simulation</strong>. 
        You now know how to verify your details, cast your vote, and confirm it on the VVPAT.
      </p>

      <div className={styles.footer}>
        <span className={styles.date}>Issued: {currentDate}</span>
        <button className={styles.shareBtn} onClick={() => alert("Sharing functionality would open a native share sheet here!")}>
          Share Badge
        </button>
      </div>
    </div>
  );
}
