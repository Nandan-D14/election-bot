'use client';

/* ============================================================
   CivicIQ — Myth Buster Component
   An interactive, accessible section for debunking election myths 
   with official, neutral facts.
   ============================================================ */

import { useState } from 'react';
import styles from './MythBuster.module.css';

interface Myth {
  id: string;
  myth: string;
  fact: string;
  category: 'Process' | 'EVM' | 'Registration';
}

const MYTHS_DATA: Myth[] = [
  {
    id: 'm1',
    category: 'EVM',
    myth: 'EVMs can be hacked remotely via Wi-Fi or Bluetooth.',
    fact: 'EVMs are standalone machines with no wireless communication capabilities. They do not have radio frequency receivers or data decoders, making remote hacking physically impossible.',
  },
  {
    id: 'm2',
    category: 'Process',
    myth: 'If I don\'t have my Voter ID card, I cannot vote.',
    fact: 'If your name is on the electoral roll, you can vote using alternative approved photo identity documents (like Aadhaar, PAN card, Passport, or Driving License) even without an EPIC (Voter ID card).',
  },
  {
    id: 'm3',
    category: 'EVM',
    myth: 'The VVPAT slip is given to the voter to take home.',
    fact: 'The VVPAT slip is visible through a glass window for 7 seconds for verification, after which it automatically drops into a sealed ballot box. It is never handed to the voter.',
  },
  {
    id: 'm4',
    category: 'Registration',
    myth: 'I can vote from anywhere in the country online.',
    fact: 'Currently, you must cast your vote in person at your designated polling station. Online or remote voting for the general public is not implemented.',
  },
];

export default function MythBuster() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles.container} aria-labelledby="myth-buster-heading">
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">🛡️</span>
        <h2 id="myth-buster-heading" className={styles.title}>Fact vs. Fiction</h2>
        <p className={styles.subtitle}>
          Get accurate, official answers to common questions about the electoral process.
        </p>
      </div>

      <div className={styles.list} role="list">
        {MYTHS_DATA.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className={`${styles.card} ${isExpanded ? styles.cardExpanded : ''}`} role="listitem">
              <button
                className={styles.cardTrigger}
                onClick={() => toggleExpand(item.id)}
                aria-expanded={isExpanded}
                aria-controls={`myth-content-${item.id}`}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{item.category}</span>
                  <h3 className={styles.mythText}>
                    <span className={styles.labelMyth} aria-hidden="true">Myth:</span>
                    {item.myth}
                  </h3>
                </div>
                <div className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>
              
              <div 
                id={`myth-content-${item.id}`} 
                className={styles.cardContent} 
                hidden={!isExpanded}
                role="region"
                aria-labelledby={`myth-heading-${item.id}`}
              >
                <div className={styles.factWrapper}>
                  <span className={styles.labelFact} aria-hidden="true">Fact:</span>
                  <p className={styles.factText}>{item.fact}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
