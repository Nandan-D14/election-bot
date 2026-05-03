'use client';

/* ============================================================
   ElectionProcessMap — Visual Election Timeline & Flow
   Interactive process map showing election phases
   ============================================================ */

import { useState, useRef } from 'react';
import styles from './ElectionProcessMap.module.css';

type ViewMode = 'timeline' | 'flowchart' | 'cycle';

interface ProcessPhase {
  id: string;
  title: string;
  icon: string;
  description: string;
  substeps: string[];
  duration: string;
  color: string;
  position: { x: number; y: number };
}

const ELECTION_PHASES: ProcessPhase[] = [
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: '📝',
    description: 'Citizens register to become eligible voters',
    substeps: ['Fill Form 6', 'Submit documents', 'BLO verification', 'Get EPIC card'],
    duration: 'Continuous + Updates',
    color: '#4f8aff',
    position: { x: 10, y: 50 },
  },
  {
    id: 'notification',
    title: 'Election Notification',
    icon: '📢',
    description: 'ECI announces election schedule',
    substeps: ['Schedule announcement', 'Model Code of Conduct', 'Press conference'],
    duration: 'Day 0',
    color: '#feca57',
    position: { x: 25, y: 30 },
  },
  {
    id: 'nomination',
    title: 'Nomination Filing',
    icon: '📋',
    description: 'Candidates file nomination papers',
    substeps: ['Get forms', 'Fill affidavits', 'Submit deposit', 'Scrutiny'],
    duration: 'Days 1-7',
    color: '#a78bfa',
    position: { x: 40, y: 50 },
  },
  {
    id: 'campaign',
    title: 'Campaign Period',
    icon: '📣',
    description: 'Candidates campaign for votes',
    substeps: ['Rallies', 'Manifesto release', 'Media debates', 'Door-to-door'],
    duration: 'Days 8-25',
    color: '#f472b6',
    position: { x: 55, y: 30 },
  },
  {
    id: 'polling',
    title: 'Polling Day',
    icon: '🗳️',
    description: 'Voters cast their votes',
    substeps: ['Queue up', 'ID verification', 'Vote casting', 'VVPAT check'],
    duration: 'Day E',
    color: '#22d3ee',
    position: { x: 70, y: 50 },
  },
  {
    id: 'counting',
    title: 'Vote Counting',
    icon: '📊',
    description: 'Votes are counted and results declared',
    substeps: ['EVM counting', 'VVPAT verification', 'Result compilation', 'Winner declaration'],
    duration: 'Day E+3',
    color: '#34d399',
    position: { x: 85, y: 30 },
  },
  {
    id: 'gazette',
    title: 'Gazette Notification',
    icon: '📜',
    description: 'Official gazette notification of winners',
    substeps: ['Official notification', 'Constituency-wise results', 'Winner credentials'],
    duration: 'Day E+7',
    color: '#fb923c',
    position: { x: 95, y: 50 },
  },
];

const CONNECTING_LINES = [
  { from: 'registration', to: 'notification' },
  { from: 'notification', to: 'nomination' },
  { from: 'nomination', to: 'campaign' },
  { from: 'campaign', to: 'polling' },
  { from: 'polling', to: 'counting' },
  { from: 'counting', to: 'gazette' },
];

export default function ElectionProcessMap() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const activePhaseData = ELECTION_PHASES.find((p) => p.id === activePhase);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🗺️ Election Process Map</h1>
        <p className={styles.subtitle}>Visual guide to the complete election lifecycle</p>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'timeline' ? styles.viewActive : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            📅 Timeline
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'flowchart' ? styles.viewActive : ''}`}
            onClick={() => setViewMode('flowchart')}
          >
            🔄 Flowchart
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'cycle' ? styles.viewActive : ''}`}
            onClick={() => setViewMode('cycle')}
          >
            ♻️ Cycle View
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Map Visualization */}
        <div className={styles.mapContainer}>
          {viewMode === 'timeline' && (
            <div className={styles.timelineView}>
              <div className={styles.timelineLine} />
              <div className={styles.timelinePhases}>
                {ELECTION_PHASES.map((phase, index) => (
                  <div
                    key={phase.id}
                    className={`${styles.timelinePhase} ${activePhase === phase.id ? styles.phaseActive : ''}`}
                    style={{ '--phase-color': phase.color } as React.CSSProperties}
                    onClick={() => setActivePhase(phase.id)}
                  >
                    <div className={styles.phaseNode}>
                      <span className={styles.phaseIcon}>{phase.icon}</span>
                    </div>
                    <div className={styles.phaseInfo}>
                      <span className={styles.phaseNumber}>Phase {index + 1}</span>
                      <h3 className={styles.phaseTitle}>{phase.title}</h3>
                      <span className={styles.phaseDuration}>{phase.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'flowchart' && (
            <div className={styles.flowchartView}>
              <svg ref={svgRef} className={styles.flowchartSvg} viewBox="0 0 1000 600">
                {/* Connection Lines */}
                {CONNECTING_LINES.map((line, idx) => {
                  const fromPhase = ELECTION_PHASES.find((p) => p.id === line.from);
                  const toPhase = ELECTION_PHASES.find((p) => p.id === line.to);
                  if (!fromPhase || !toPhase) return null;

                  return (
                    <path
                      key={idx}
                      d={`M ${fromPhase.position.x * 10} ${fromPhase.position.y * 6} 
                          Q ${(fromPhase.position.x + toPhase.position.x) * 5} ${(fromPhase.position.y + toPhase.position.y) * 3}
                          ${toPhase.position.x * 10} ${toPhase.position.y * 6}`}
                      className={styles.connectionLine}
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}

                {/* Arrow Marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                  </marker>
                </defs>

                {/* Phase Nodes */}
                {ELECTION_PHASES.map((phase) => (
                  <g
                    key={phase.id}
                    transform={`translate(${phase.position.x * 10 - 40}, ${phase.position.y * 6 - 40})`}
                    className={`${styles.flowNode} ${activePhase === phase.id ? styles.flowNodeActive : ''}`}
                    onClick={() => setActivePhase(phase.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      width="80"
                      height="80"
                      rx="12"
                      fill={activePhase === phase.id ? phase.color : 'rgba(255,255,255,0.05)'}
                      stroke={phase.color}
                      strokeWidth={activePhase === phase.id ? 3 : 1}
                      className={styles.nodeRect}
                    />
                    <text x="40" y="35" textAnchor="middle" fill="white" fontSize="24">
                      {phase.icon}
                    </text>
                    <text x="40" y="60" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
                      {phase.title}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}

          {viewMode === 'cycle' && (
            <div className={styles.cycleView}>
              <div className={styles.cycleCenter}>
                <span className={styles.cycleIcon}>🇮🇳</span>
                <span className={styles.cycleText}>Election Cycle</span>
              </div>
              {ELECTION_PHASES.map((phase, index) => {
                const angle = (index / ELECTION_PHASES.length) * 360 - 90;
                const radius = 200;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={phase.id}
                    className={`${styles.cyclePhase} ${activePhase === phase.id ? styles.cyclePhaseActive : ''}`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      '--phase-color': phase.color,
                    } as React.CSSProperties}
                    onClick={() => setActivePhase(phase.id)}
                  >
                    <span className={styles.cyclePhaseIcon}>{phase.icon}</span>
                    <span className={styles.cyclePhaseTitle}>{phase.title}</span>
                  </div>
                );
              })}
              {/* SVG Lines connecting phases */}
              <svg className={styles.cycleSvg}>
                {ELECTION_PHASES.map((phase, index) => {
                  const nextIndex = (index + 1) % ELECTION_PHASES.length;
                  const angle1 = (index / ELECTION_PHASES.length) * 360 - 90;
                  const angle2 = (nextIndex / ELECTION_PHASES.length) * 360 - 90;
                  const radius = 200;
                  const x1 = Math.cos((angle1 * Math.PI) / 180) * radius + 250;
                  const y1 = Math.sin((angle1 * Math.PI) / 180) * radius + 250;
                  const x2 = Math.cos((angle2 * Math.PI) / 180) * radius + 250;
                  const y2 = Math.sin((angle2 * Math.PI) / 180) * radius + 250;

                  return (
                    <line
                      key={`line-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className={styles.detailPanel}>
          {activePhaseData ? (
            <div className={styles.phaseDetail} style={{ '--phase-color': activePhaseData.color } as React.CSSProperties}>
              <div className={styles.detailHeader}>
                <span className={styles.detailIcon}>{activePhaseData.icon}</span>
                <h2 className={styles.detailTitle}>{activePhaseData.title}</h2>
                <span className={styles.detailDuration}>{activePhaseData.duration}</span>
              </div>
              <p className={styles.detailDescription}>{activePhaseData.description}</p>
              <div className={styles.substeps}>
                <h4>Key Steps:</h4>
                <ul>
                  {activePhaseData.substeps.map((step, idx) => (
                    <li key={idx} className={styles.substep}>
                      <span className={styles.substepNum}>{idx + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <span className={styles.emptyIcon}>🗺️</span>
              <p>Select a phase to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statNum}>7</span>
          <span className={styles.statLabel}>Phases</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>~45</span>
          <span className={styles.statLabel}>Days Total</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>90Cr+</span>
          <span className={styles.statLabel}>Voters</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>543</span>
          <span className={styles.statLabel}>LS Seats</span>
        </div>
      </div>
    </div>
  );
}
