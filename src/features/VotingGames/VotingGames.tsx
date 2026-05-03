"use client";

/* ============================================================
   VotingGames — Interactive Educational Games
   Learn voting through fun mini-games!
   ============================================================ */

import { useState, useCallback } from "react";
import styles from "./VotingGames.module.css";

type GameType = "menu" | "steporder" | "truefalse" | "idquiz" | "evmchallenge";

interface GameScore {
  game: string;
  score: number;
  total: number;
}

// --- STEP ORDER GAME ---
const VOTING_STEPS = [
  { id: "s1", text: "Check your name on voter list", order: 1 },
  { id: "s2", text: "Show ID at polling station", order: 2 },
  { id: "s3", text: "Get ink marked on finger", order: 3 },
  { id: "s4", text: "Enter voting booth", order: 4 },
  { id: "s5", text: "Press button on EVM", order: 5 },
  { id: "s6", text: "Verify vote on VVPAT", order: 6 },
];

// --- TRUE/FALSE GAME ---
const TRUE_FALSE_QUESTIONS = [
  {
    id: "q1",
    question: "You can vote without a Voter ID if you have Aadhaar?",
    answer: true,
    explanation: "Aadhaar is an approved alternative ID for voting.",
  },
  {
    id: "q2",
    question: "You can vote multiple times if you register in different constituencies?",
    answer: false,
    explanation: "Duplicate voting is illegal and punishable.",
  },
  {
    id: "q3",
    question: "Mobile phones are allowed inside the voting booth?",
    answer: false,
    explanation: "Phones must be switched off or left outside.",
  },
  {
    id: "q4",
    question: "NOTA means you reject all candidates?",
    answer: true,
    explanation: "None Of The Above is your right to reject all options.",
  },
  {
    id: "q5",
    question: "Campaigning is allowed 50 meters from polling stations?",
    answer: false,
    explanation: "No campaigning within 100 meters is allowed.",
  },
  {
    id: "q6",
    question: "You must be 18+ years old on the qualifying date to vote?",
    answer: true,
    explanation: "Age is calculated on the date set by Election Commission.",
  },
];

// --- ID QUIZ GAME ---
const ID_ITEMS = [
  { id: "id1", name: "EPIC Card", icon: "🪪", isValid: true },
  { id: "id2", name: "Aadhaar Card", icon: "📱", isValid: true },
  { id: "id3", name: "PAN Card", icon: "📋", isValid: true },
  {
    id: "id4",
    name: "Student ID",
    icon: "🎓",
    isValid: false,
    reason: "Not a government-issued photo ID",
  },
  { id: "id5", name: "Passport", icon: "🛂", isValid: true },
  { id: "id6", name: "Driving License", icon: "🚗", isValid: true },
  {
    id: "id7",
    name: "Library Card",
    icon: "📚",
    isValid: false,
    reason: "Not an official government ID",
  },
  { id: "id8", name: "Ration Card", icon: "🍚", isValid: true },
];

export default function VotingGames() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu");
  const [scores, setScores] = useState<GameScore[]>([]);

  const addScore = useCallback((game: string, score: number, total: number) => {
    setScores((prev) => [...prev.filter((s) => s.game !== game), { game, score, total }]);
  }, []);

  const scoreMap = scores.reduce(
    (acc, s) => {
      acc[s.game] = s;
      return acc;
    },
    {} as Record<string, GameScore>
  );

  const getScore = (game: string) => scoreMap[game];

  const totalScore = scores.reduce((acc, s) => acc + s.score, 0);
  const maxPossible = scores.reduce((acc, s) => acc + s.total, 0);

  if (currentGame === "menu") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🎮 Voting Games</h1>
          <p className={styles.subtitle}>Learn about voting through fun interactive games!</p>
          {scores.length > 0 && (
            <div className={styles.totalScore}>
              <span className={styles.scoreBadge}>
                🏆 Total: {totalScore}/{maxPossible}
              </span>
            </div>
          )}
        </div>

        <div className={styles.gameGrid}>
          <GameCard
            icon="🪜"
            title="Step Order Challenge"
            description="Arrange the voting steps in correct order"
            score={getScore("steporder")}
            onClick={() => setCurrentGame("steporder")}
            color="blue"
          />
          <GameCard
            icon="✅"
            title="True or False"
            description="Test your knowledge with quick facts"
            score={getScore("truefalse")}
            onClick={() => setCurrentGame("truefalse")}
            color="green"
          />
          <GameCard
            icon="🪪"
            title="ID Detective"
            description="Identify valid voter ID documents"
            score={getScore("idquiz")}
            onClick={() => setCurrentGame("idquiz")}
            color="purple"
          />
          <GameCard
            icon="🖲️"
            title="EVM Simulator"
            description="Practice using the Electronic Voting Machine"
            score={getScore("evmchallenge")}
            onClick={() => setCurrentGame("evmchallenge")}
            color="orange"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => setCurrentGame("menu")}>
        ← Back to Games
      </button>

      {currentGame === "steporder" && <StepOrderGame onComplete={addScore} />}
      {currentGame === "truefalse" && <TrueFalseGame onComplete={addScore} />}
      {currentGame === "idquiz" && <IDQuizGame onComplete={addScore} />}
      {currentGame === "evmchallenge" && <EVMChallengeGame onComplete={addScore} />}
    </div>
  );
}

// --- GAME CARD COMPONENT ---
function GameCard({
  icon,
  title,
  description,
  score,
  onClick,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  score?: GameScore;
  onClick: () => void;
  color: "blue" | "green" | "purple" | "orange";
}) {
  return (
    <button className={`${styles.gameCard} ${styles[`card${color}`]}`} onClick={onClick}>
      <div className={styles.gameIcon}>{icon}</div>
      <h3 className={styles.gameTitle}>{title}</h3>
      <p className={styles.gameDescription}>{description}</p>
      {score && (
        <div className={styles.gameScoreBadge}>
          Best: {score.score}/{score.total}
        </div>
      )}
    </button>
  );
}

// --- STEP ORDER GAME ---
function StepOrderGame({
  onComplete,
}: {
  onComplete: (game: string, score: number, total: number) => void;
}) {
  const [items, setItems] = useState(() => shuffleArray([...VOTING_STEPS]));
  const [showResult, setShowResult] = useState(false);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (showResult) return;
    const newItems = [...items];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setItems(newItems);
  };

  const checkAnswer = () => {
    setShowResult(true);
    const correct = items.filter((item, idx) => item.order === idx + 1).length;
    onComplete("steporder", correct, items.length);
  };

  const reset = () => {
    setItems(shuffleArray([...VOTING_STEPS]));
    setShowResult(false);
  };

  const score = items.filter((item, idx) => item.order === idx + 1).length;

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.gameHeading}>🪜 Step Order Challenge</h2>
      <p className={styles.gameInstructions}>
        Arrange these voting steps in the correct order using the arrow buttons.
      </p>

      <div className={styles.stepList}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.stepItem} ${
              showResult ? (item.order === index + 1 ? styles.stepCorrect : styles.stepWrong) : ""
            }`}
          >
            <span className={styles.stepNumber}>{index + 1}</span>
            <span className={styles.stepText}>{item.text}</span>
            {!showResult && (
              <div className={styles.stepControls}>
                <button onClick={() => moveItem(index, "up")} disabled={index === 0}>
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showResult ? (
        <div className={styles.resultBox}>
          <div className={styles.resultScore}>
            Score: {score}/{items.length}
          </div>
          <p className={styles.resultMessage}>
            {score === items.length
              ? "🎉 Perfect! You know the voting process!"
              : "Keep practicing to learn the correct order!"}
          </p>
          <button className={styles.playAgainButton} onClick={reset}>
            Play Again
          </button>
        </div>
      ) : (
        <button className={styles.checkButton} onClick={checkAnswer}>
          Check Answer
        </button>
      )}
    </div>
  );
}

// --- TRUE/FALSE GAME ---
function TrueFalseGame({
  onComplete,
}: {
  onComplete: (game: string, score: number, total: number) => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  const answer = (val: boolean) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (newAnswers.length === TRUE_FALSE_QUESTIONS.length) {
      setShowResult(true);
      const correct = newAnswers.filter((a, i) => a === TRUE_FALSE_QUESTIONS[i].answer).length;
      onComplete("truefalse", correct, TRUE_FALSE_QUESTIONS.length);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const score = answers.filter((a, i) => a === TRUE_FALSE_QUESTIONS[i].answer).length;
    return (
      <div className={styles.gameContainer}>
        <h2 className={styles.gameHeading}>✅ Results</h2>
        <div className={styles.resultBox}>
          <div className={styles.resultScore}>
            Score: {score}/{TRUE_FALSE_QUESTIONS.length}
          </div>
          <div className={styles.tfSummary}>
            {TRUE_FALSE_QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                className={`${styles.tfItem} ${answers[i] === q.answer ? styles.tfCorrect : styles.tfWrong}`}
              >
                <span>
                  {i + 1}. {q.question}
                </span>
                <span>{answers[i] === q.answer ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
          <button className={styles.playAgainButton} onClick={reset}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const q = TRUE_FALSE_QUESTIONS[currentQ];

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.gameHeading}>✅ True or False</h2>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(currentQ / TRUE_FALSE_QUESTIONS.length) * 100}%` }}
        />
      </div>
      <div className={styles.tfQuestionBox}>
        <p className={styles.tfQuestion}>{q.question}</p>
        <div className={styles.tfButtons}>
          <button className={`${styles.tfButton} ${styles.tfTrue}`} onClick={() => answer(true)}>
            TRUE
          </button>
          <button className={`${styles.tfButton} ${styles.tfFalse}`} onClick={() => answer(false)}>
            FALSE
          </button>
        </div>
      </div>
      <p className={styles.questionCounter}>
        Question {currentQ + 1} of {TRUE_FALSE_QUESTIONS.length}
      </p>
    </div>
  );
}

// --- ID QUIZ GAME ---
function IDQuizGame({
  onComplete,
}: {
  onComplete: (game: string, score: number, total: number) => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  const toggle = (id: string) => {
    if (showResult) return;
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  const submit = () => {
    setShowResult(true);
    const correct = ID_ITEMS.filter((item) => checked.has(item.id) === item.isValid).length;
    onComplete("idquiz", correct, ID_ITEMS.length);
  };

  const reset = () => {
    setChecked(new Set());
    setShowResult(false);
  };

  const score = showResult
    ? ID_ITEMS.filter((item) => checked.has(item.id) === item.isValid).length
    : 0;

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.gameHeading}>🪪 ID Detective</h2>
      <p className={styles.gameInstructions}>Select all documents that are valid for voting:</p>

      <div className={styles.idGrid}>
        {ID_ITEMS.map((item) => {
          const isSelected = checked.has(item.id);
          const showCorrect = showResult && item.isValid;
          const showWrong = showResult && !item.isValid && isSelected;

          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`${styles.idCard} ${isSelected ? styles.idSelected : ""} ${
                showCorrect ? styles.idCorrect : ""
              } ${showWrong ? styles.idWrong : ""}`}
              disabled={showResult}
            >
              <span className={styles.idIcon}>{item.icon}</span>
              <span className={styles.idName}>{item.name}</span>
              {showResult && !item.isValid && !isSelected && (
                <span className={styles.idSkip}>✓</span>
              )}
              {showResult && item.reason && <span className={styles.idReason}>{item.reason}</span>}
            </button>
          );
        })}
      </div>

      {showResult ? (
        <div className={styles.resultBox}>
          <div className={styles.resultScore}>
            Score: {score}/{ID_ITEMS.length}
          </div>
          <button className={styles.playAgainButton} onClick={reset}>
            Play Again
          </button>
        </div>
      ) : (
        <button className={styles.checkButton} onClick={submit} disabled={checked.size === 0}>
          Submit Answer
        </button>
      )}
    </div>
  );
}

// --- EVM CHALLENGE GAME ---
function EVMChallengeGame({
  onComplete,
}: {
  onComplete: (game: string, score: number, total: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [verified, setVerified] = useState(false);
  const [finished, setFinished] = useState(false);

  const CANDIDATES = [
    { id: 1, name: "Candidate A", symbol: "🌸" },
    { id: 2, name: "Candidate B", symbol: "🚲" },
    { id: 3, name: "Candidate C", symbol: "🐘" },
  ];

  // Precompute map to avoid find() in render
  const CANDIDATES_MAP = new Map(CANDIDATES.map((c) => [c.id, c]));

  const handleVote = (id: number) => {
    setSelectedCandidate(id);
    setStep(2);
  };

  const handleVerify = () => {
    setVerified(true);
    setStep(3);
  };

  const finish = () => {
    setFinished(true);
    onComplete("evmchallenge", verified ? 2 : 1, 2);
  };

  const reset = () => {
    setStep(0);
    setSelectedCandidate(null);
    setVerified(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className={styles.gameContainer}>
        <h2 className={styles.gameHeading}>🖲️ EVM Challenge Complete!</h2>
        <div className={styles.resultBox}>
          <div className={styles.evmSuccess}>🎉</div>
          <p className={styles.resultMessage}>
            {verified
              ? "Perfect! You correctly voted and verified on VVPAT."
              : "Good! You voted but remember to always check the VVPAT slip."}
          </p>
          <div className={styles.resultScore}>Score: {verified ? 2 / 2 : 1 / 2}</div>
          <button className={styles.playAgainButton} onClick={reset}>
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.gameHeading}>🖲️ EVM Simulator</h2>
      <div className={styles.evmSteps}>
        {["Select Candidate", "Press Button", "Verify VVPAT"].map((s, i) => (
          <div key={s} className={`${styles.evmStep} ${i <= step ? styles.evmStepActive : ""}`}>
            <div className={styles.evmStepNum}>{i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className={styles.evmInstructions}>
          <p>Select your preferred candidate:</p>
        </div>
      )}

      <div className={styles.evmMachine}>
        <div className={styles.evmDisplay}>
          {CANDIDATES.map((c) => (
            <div key={c.id} className={styles.evmCandidate}>
              <div className={styles.evmCandidateInfo}>
                <span className={styles.evmSymbol}>{c.symbol}</span>
                <span className={styles.evmName}>{c.name}</span>
              </div>
              <button
                className={`${styles.evmButton} ${selectedCandidate === c.id ? styles.evmButtonPressed : ""}`}
                onClick={() => handleVote(c.id)}
                disabled={step > 1}
              >
                {selectedCandidate === c.id && <span className={styles.evmLight}>🔴</span>}
              </button>
            </div>
          ))}
        </div>

        {/* VVPAT Display */}
        <div className={styles.vvpatBox}>
          <div className={styles.vvpatScreen}>
            {verified ? (
              <div className={styles.vvpatVerified}>
                <span className={styles.vvpatCheck}>✓</span>
                <p>Vote Verified!</p>
                <small>
                  You voted for:{" "}
                  {selectedCandidate ? CANDIDATES_MAP.get(selectedCandidate)?.symbol : ""}
                </small>
              </div>
            ) : selectedCandidate ? (
              <div className={styles.vvpatPending}>
                <p>Check VVPAT to verify your vote</p>
              </div>
            ) : (
              <div className={styles.vvpatIdle}>
                <p>VVPAT Display</p>
              </div>
            )}
          </div>
          <div className={styles.vvpatWindow}>
            <div className={styles.vvpatGlass}></div>
          </div>
        </div>
      </div>

      <div className={styles.evmControls}>
        {step === 2 && !verified && (
          <button className={styles.verifyButton} onClick={handleVerify}>
            ✅ I Verified on VVPAT
          </button>
        )}
        {step === 3 && (
          <button className={styles.finishButton} onClick={finish}>
            Finish
          </button>
        )}
      </div>
    </div>
  );
}

// --- UTILITY ---
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
