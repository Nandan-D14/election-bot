"use client";

/* ============================================================
   VotingRules — Comprehensive Voting Rules & Guidelines
   ============================================================ */

import { useState } from "react";
import styles from "./VotingRules.module.css";

interface RuleCategory {
  id: string;
  title: string;
  icon: string;
  rules: RuleItem[];
}

interface RuleItem {
  id: string;
  title: string;
  description: string;
  important?: boolean;
}

const RULE_CATEGORIES: RuleCategory[] = [
  {
    id: "eligibility",
    title: "Voter Eligibility",
    icon: "📋",
    rules: [
      {
        id: "e1",
        title: "Age Requirement",
        description:
          "You must be at least 18 years old on the qualifying date set by the Election Commission.",
      },
      {
        id: "e2",
        title: "Citizenship",
        description: "Only Indian citizens are eligible to vote in elections.",
      },
      {
        id: "e3",
        title: "Residency",
        description: "You must be a resident in the constituency where you wish to vote.",
        important: true,
      },
      {
        id: "e4",
        title: "Not Disqualified",
        description:
          "You must not be declared mentally unsound by a court or be a convicted criminal serving sentence.",
      },
    ],
  },
  {
    id: "registration",
    title: "Registration Process",
    icon: "📝",
    rules: [
      {
        id: "r1",
        title: "Form 6",
        description:
          "Fill Form 6 for new voter registration. Available online at nvsp.in or at ERO offices.",
        important: true,
      },
      {
        id: "r2",
        title: "Documents Required",
        description:
          "Submit proof of age (birth certificate, passport, etc.) and proof of address (Aadhaar, utility bills, etc.).",
      },
      {
        id: "r3",
        title: "Photo Requirements",
        description: "Upload a recent passport-size photograph with white/light background.",
      },
      {
        id: "r4",
        title: "Verification",
        description: "Booth Level Officers (BLOs) will visit your residence for verification.",
      },
    ],
  },
  {
    id: "polling",
    title: "Polling Day Rules",
    icon: "🗳️",
    rules: [
      {
        id: "p1",
        title: "Voter ID Required",
        description:
          "Carry your EPIC (Voter ID card) or approved alternative ID proof to the polling station.",
        important: true,
      },
      {
        id: "p2",
        title: "Polling Hours",
        description: "Voting typically happens from 7:00 AM to 6:00 PM. Check your local timings.",
      },
      {
        id: "p3",
        title: "No Campaigning",
        description: "Campaigning is prohibited within 100 meters of polling stations.",
      },
      {
        id: "p4",
        title: "Mobile Phones",
        description:
          "Mobile phones are not allowed inside the polling booth. Leave them outside or switch them off.",
      },
      {
        id: "p5",
        title: "Queue Discipline",
        description:
          "Maintain queue discipline. Priority voting is available for senior citizens, PwDs, and pregnant women.",
      },
    ],
  },
  {
    id: "evm",
    title: "EVM & VVPAT Guidelines",
    icon: "💻",
    rules: [
      {
        id: "v1",
        title: "Check VVPAT",
        description: "Verify your vote on the VVPAT slip before it drops into the sealed box.",
        important: true,
      },
      {
        id: "v2",
        title: "One Button Press",
        description: "Press only ONE button on the EVM corresponding to your chosen candidate.",
      },
      {
        id: "v3",
        title: "Beep Confirmation",
        description:
          "Wait for the beep sound and red light confirmation after pressing the button.",
      },
      {
        id: "v4",
        title: "No Photography",
        description: "Photographing the EVM or your vote is strictly prohibited.",
      },
    ],
  },
  {
    id: "prohibited",
    title: "Prohibited Activities",
    icon: "🚫",
    rules: [
      {
        id: "pr1",
        title: "No Proxy Voting",
        description:
          "Proxy voting is not allowed except for specific categories with prior approval.",
      },
      {
        id: "pr2",
        title: "No Bribery",
        description:
          "Offering or accepting money/gifts for votes is a criminal offense punishable by imprisonment.",
        important: true,
      },
      {
        id: "pr3",
        title: "No Intimidation",
        description: "Using force, threat, or intimidation to influence voting is illegal.",
      },
      {
        id: "pr4",
        title: "No Duplicate Voting",
        description: "Voting multiple times or in multiple constituencies is a serious offense.",
      },
    ],
  },
  {
    id: "rights",
    title: "Voter Rights",
    icon: "⚖️",
    rules: [
      {
        id: "rt1",
        title: "Right to Information",
        description:
          "You have the right to know about candidates, their assets, and criminal records.",
      },
      {
        id: "rt2",
        title: "Right to NOTA",
        description:
          'You can choose "None of the Above" (NOTA) if you don\'t support any candidate.',
        important: true,
      },
      {
        id: "rt3",
        title: "Right to Challenge",
        description: "You can challenge an imposter trying to vote under your name.",
      },
      {
        id: "rt4",
        title: "Right to Assistance",
        description:
          "Voters with disabilities can bring an assistant or request help from polling staff.",
      },
    ],
  },
];

export default function VotingRules() {
  const [activeCategory, setActiveCategory] = useState<string>(RULE_CATEGORIES[0].id);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const activeRules = RULE_CATEGORIES.find((c) => c.id === activeCategory)?.rules || [];

  const toggleRule = (ruleId: string) => {
    setExpandedRules((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📜 Voting Rules & Guidelines</h1>
        <p className={styles.subtitle}>
          Everything you need to know about your rights and responsibilities as a voter
        </p>
      </div>

      <div className={styles.content}>
        {/* Category Sidebar */}
        <div className={styles.sidebar}>
          {RULE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                activeCategory === category.id ? styles.categoryActive : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryTitle}>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Rules Display */}
        <div className={styles.rulesPanel}>
          <div className={styles.rulesHeader}>
            <span className={styles.rulesIcon}>
              {RULE_CATEGORIES.find((c) => c.id === activeCategory)?.icon}
            </span>
            <h2 className={styles.rulesTitle}>
              {RULE_CATEGORIES.find((c) => c.id === activeCategory)?.title}
            </h2>
          </div>

          <div className={styles.rulesList}>
            {activeRules.map((rule, index) => (
              <div
                key={rule.id}
                className={`${styles.ruleCard} ${rule.important ? styles.ruleImportant : ""}`}
                onClick={() => toggleRule(rule.id)}
              >
                <div className={styles.ruleNumber}>{index + 1}</div>
                <div className={styles.ruleContent}>
                  <div className={styles.ruleHeader}>
                    <h3 className={styles.ruleTitle}>{rule.title}</h3>
                    {rule.important && <span className={styles.importantBadge}>Important</span>}
                  </div>
                  <p className={styles.ruleDescription}>{rule.description}</p>
                </div>
                <div className={styles.ruleExpand}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={expandedRules.has(rule.id) ? styles.expandIconOpen : ""}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips Box */}
          <div className={styles.tipsBox}>
            <h4 className={styles.tipsTitle}>💡 Pro Tip</h4>
            <p className={styles.tipsText}>
              Save the Election Commission helpline number <strong>1950</strong> in your phone. You
              can call for any voting-related queries or to report violations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
