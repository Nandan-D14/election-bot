"use client";

/* ============================================================
   ElectionMindMap — Interactive Concept Map
   Visual knowledge map of election-related concepts
   ============================================================ */

import { useState } from "react";
import styles from "./ElectionMindMap.module.css";

interface MindNode {
  id: string;
  label: string;
  icon: string;
  category: "core" | "process" | "actors" | "rights" | "tech";
  description: string;
  related: string[];
  x: number;
  y: number;
}

const MIND_NODES: MindNode[] = [
  // Core
  {
    id: "election",
    label: "Election",
    icon: "🗳️",
    category: "core",
    description: "The formal process of choosing representatives through voting",
    related: ["eci", "voter", "candidate", "evm", "result"],
    x: 50,
    y: 50,
  },
  {
    id: "eci",
    label: "Election Commission",
    icon: "🏛️",
    category: "core",
    description: "Constitutional body conducting free and fair elections in India",
    related: ["election", "evm", "observer", "mcc"],
    x: 25,
    y: 25,
  },
  {
    id: "constitution",
    label: "Constitution",
    icon: "📜",
    category: "core",
    description: "Article 324 vests superintendence of elections in ECI",
    related: ["eci", "rights", "laws"],
    x: 15,
    y: 50,
  },

  // Process
  {
    id: "registration",
    label: "Registration",
    icon: "📝",
    category: "process",
    description: "Process of enrolling eligible citizens as voters",
    related: ["voter", "epic", "form6", "ero"],
    x: 75,
    y: 25,
  },
  {
    id: "campaign",
    label: "Campaign",
    icon: "📣",
    category: "process",
    description: "Period when candidates seek votes from electorate",
    related: ["candidate", "mcc", "expenses", "manifesto"],
    x: 80,
    y: 50,
  },
  {
    id: "polling",
    label: "Polling",
    icon: "🏫",
    category: "process",
    description: "Day when registered voters cast their votes",
    related: ["election", "voter", "evm", "vvpat", "official"],
    x: 85,
    y: 75,
  },
  {
    id: "counting",
    label: "Counting",
    icon: "📊",
    category: "process",
    description: "Process of tallying votes to determine winners",
    related: ["polling", "evm", "result", "observer"],
    x: 70,
    y: 85,
  },

  // Actors
  {
    id: "voter",
    label: "Voter",
    icon: "👤",
    category: "actors",
    description: "Citizen aged 18+ registered to vote in elections",
    related: ["registration", "rights", "polling", "epic"],
    x: 50,
    y: 20,
  },
  {
    id: "candidate",
    label: "Candidate",
    icon: "🎯",
    category: "actors",
    description: "Person contesting election for a position",
    related: ["nomination", "campaign", "expenses", "affidavit"],
    x: 65,
    y: 35,
  },
  {
    id: "official",
    label: "Polling Official",
    icon: "👮",
    category: "actors",
    description: "Government staff managing polling stations",
    related: ["polling", "evm", "voter", "form17"],
    x: 35,
    y: 70,
  },
  {
    id: "observer",
    label: "Observer",
    icon: "👁️",
    category: "actors",
    description: "ECI appointed official monitoring election fairness",
    related: ["eci", "counting", "mcc", "complaint"],
    x: 30,
    y: 80,
  },

  // Rights
  {
    id: "rights",
    label: "Voter Rights",
    icon: "⚖️",
    category: "rights",
    description: "Fundamental rights of voters in democratic elections",
    related: ["voter", "nota", "tender", "complaint"],
    x: 20,
    y: 65,
  },
  {
    id: "nota",
    label: "NOTA",
    icon: "✗",
    category: "rights",
    description: "None Of The Above - right to reject all candidates",
    related: ["rights", "evm", "voter"],
    x: 15,
    y: 80,
  },
  {
    id: "tender",
    label: "Tender Vote",
    icon: "📨",
    category: "rights",
    description: "Vote when someone else has already voted under your name",
    related: ["rights", "polling", "complaint"],
    x: 10,
    y: 65,
  },

  // Tech
  {
    id: "evm",
    label: "EVM",
    icon: "💻",
    category: "tech",
    description: "Electronic Voting Machine for casting votes electronically",
    related: ["polling", "vvpat", "counting", "eci"],
    x: 60,
    y: 65,
  },
  {
    id: "vvpat",
    label: "VVPAT",
    icon: "🧾",
    category: "tech",
    description: "Voter Verifiable Paper Audit Trail for vote verification",
    related: ["evm", "polling", "counting"],
    x: 75,
    y: 60,
  },
  {
    id: "epic",
    label: "EPIC Card",
    icon: "🪪",
    category: "tech",
    description: "Electoral Photo Identity Card - voter ID document",
    related: ["voter", "registration", "polling"],
    x: 40,
    y: 30,
  },
  {
    id: "nvsp",
    label: "NVSP Portal",
    icon: "🌐",
    category: "tech",
    description: "National Voters' Services Portal for online services",
    related: ["registration", "voter", "form6"],
    x: 90,
    y: 35,
  },

  // Additional nodes
  {
    id: "mcc",
    label: "MCC",
    icon: "📋",
    category: "process",
    description: "Model Code of Conduct - guidelines for parties and candidates",
    related: ["eci", "campaign", "candidate"],
    x: 25,
    y: 40,
  },
  {
    id: "form6",
    label: "Form 6",
    icon: "📄",
    category: "process",
    description: "Application form for new voter registration",
    related: ["registration", "nvsp", "ero"],
    x: 85,
    y: 15,
  },
  {
    id: "ero",
    label: "ERO",
    icon: "🏢",
    category: "actors",
    description: "Electoral Registration Officer - verifies voter applications",
    related: ["registration", "form6", "eci"],
    x: 95,
    y: 20,
  },
  {
    id: "result",
    label: "Results",
    icon: "🏆",
    category: "process",
    description: "Declaration of winning candidates after counting",
    related: ["counting", "election", "gazette"],
    x: 55,
    y: 85,
  },
  {
    id: "laws",
    label: "RPA 1951",
    icon: "⚖️",
    category: "core",
    description: "Representation of the People Act - governs elections",
    related: ["constitution", "eci", "offenses"],
    x: 5,
    y: 40,
  },
];

// Pre-built O(1) lookup map — eliminates repeated O(n) find() calls during rendering
const NODE_MAP = new Map<string, MindNode>(MIND_NODES.map((n) => [n.id, n]));

const CATEGORIES = {
  core: { label: "Core", color: "#ff6b6b" },
  process: { label: "Process", color: "#4facfe" },
  actors: { label: "Actors", color: "#43e97b" },
  rights: { label: "Rights", color: "#feca57" },
  tech: { label: "Technology", color: "#a78bfa" },
};

export default function ElectionMindMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const activeNodeData = activeNode ? NODE_MAP.get(activeNode) : undefined;
  const relatedNodes = activeNodeData?.related || [];

  const filteredNodes = filterCategory
    ? MIND_NODES.filter((n) => n.category === filterCategory)
    : MIND_NODES;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🧠 Election Mind Map</h1>
        <p className={styles.subtitle}>Explore interconnected election concepts</p>

        <div className={styles.controls}>
          <div className={styles.categoryFilter}>
            <button
              className={`${styles.filterBtn} ${filterCategory === null ? styles.filterActive : ""}`}
              onClick={() => setFilterCategory(null)}
            >
              All
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                className={`${styles.filterBtn} ${filterCategory === key ? styles.filterActive : ""}`}
                onClick={() => setFilterCategory(key)}
                style={{ "--cat-color": cat.color } as React.CSSProperties}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.zoomControls}>
            <button className={styles.zoomBtn} onClick={handleZoomOut}>
              −
            </button>
            <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
            <button className={styles.zoomBtn} onClick={handleZoomIn}>
              +
            </button>
            <button className={styles.resetBtn} onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className={styles.mapArea}>
        <div
          className={styles.mapCanvas}
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          <svg className={styles.connectionsSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            {activeNodeData &&
              relatedNodes.map((relatedId) => {
                const relatedNode = NODE_MAP.get(relatedId);
                if (!relatedNode || !filteredNodes.find((n) => n.id === relatedId)) return null;

                return (
                  <line
                    key={`${activeNode}-${relatedId}`}
                    x1={activeNodeData.x}
                    y1={activeNodeData.y}
                    x2={relatedNode.x}
                    y2={relatedNode.y}
                    className={styles.connection}
                  />
                );
              })}

            {/* Show all connections when no node is active */}
            {!activeNode &&
              filteredNodes.map((node) =>
                node.related
                  .filter((relatedId) => {
                    const related = NODE_MAP.get(relatedId);
                    return related && filteredNodes.find((n) => n.id === relatedId);
                  })
                  .map((relatedId) => {
                    const related = NODE_MAP.get(relatedId)!;
                    // Only draw if node.id < related.id to avoid duplicates
                    if (node.id > relatedId) return null;

                    return (
                      <line
                        key={`${node.id}-${relatedId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={related.x}
                        y2={related.y}
                        className={styles.connectionDim}
                      />
                    );
                  })
              )}
          </svg>

          {filteredNodes.map((node) => {
            const isActive = activeNode === node.id;
            const isRelated = relatedNodes.includes(node.id);
            const cat = CATEGORIES[node.category];

            return (
              <div
                key={node.id}
                className={`${styles.node} ${isActive ? styles.nodeActive : ""} ${
                  isRelated ? styles.nodeRelated : ""
                }`}
                style={
                  {
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    "--node-color": cat.color,
                  } as React.CSSProperties
                }
                onClick={() => setActiveNode(isActive ? null : node.id)}
              >
                <div className={styles.nodeIcon}>{node.icon}</div>
                <div className={styles.nodeLabel}>{node.label}</div>
                {isActive && <div className={styles.nodePulse} />}
              </div>
            );
          })}
        </div>

        {/* Info Panel */}
        <div className={styles.infoPanel}>
          {activeNodeData ? (
            <div
              className={styles.nodeInfo}
              style={
                { "--node-color": CATEGORIES[activeNodeData.category].color } as React.CSSProperties
              }
            >
              <div className={styles.infoHeader}>
                <span className={styles.infoIcon}>{activeNodeData.icon}</span>
                <h3 className={styles.infoTitle}>{activeNodeData.label}</h3>
                <span
                  className={styles.infoCategory}
                  style={{ background: CATEGORIES[activeNodeData.category].color }}
                >
                  {CATEGORIES[activeNodeData.category].label}
                </span>
              </div>
              <p className={styles.infoDescription}>{activeNodeData.description}</p>

              {relatedNodes.length > 0 && (
                <div className={styles.relatedSection}>
                  <h4>Connected Concepts:</h4>
                  <div className={styles.relatedList}>
                    {relatedNodes.map((relatedId) => {
                      const related = NODE_MAP.get(relatedId);
                      if (!related) return null;
                      return (
                        <button
                          key={relatedId}
                          className={styles.relatedChip}
                          onClick={() => setActiveNode(relatedId)}
                          style={
                            {
                              "--chip-color": CATEGORIES[related.category].color,
                            } as React.CSSProperties
                          }
                        >
                          {related.icon} {related.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyInfo}>
              <span className={styles.emptyIcon}>🧠</span>
              <p>Click on any node to explore election concepts and their connections</p>
              <div className={styles.legend}>
                <h4>Categories:</h4>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <div key={key} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: cat.color }} />
                    <span>{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
