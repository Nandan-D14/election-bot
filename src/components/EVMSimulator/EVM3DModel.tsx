"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox, ContactShadows, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { SIMULATED_CANDIDATES } from "@/constants/evm";
import type { EvmStep } from "@/types";

interface EVM3DModelProps {
  currentStep: EvmStep;
  selectedCandidate: number | null;
  vvpatVisible: boolean;
  onCandidateSelect: (id: number) => void;
  onAdvanceStep: () => void;
}

// --------------------------------------------------------
// Common Materials
// --------------------------------------------------------
const plasticMaterial = new THREE.MeshStandardMaterial({
  color: "#e0e0e0",
  roughness: 0.6,
  metalness: 0.1,
});

const darkPlasticMaterial = new THREE.MeshStandardMaterial({
  color: "#2a2a2a",
  roughness: 0.7,
  metalness: 0.2,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",
  metalness: 0.1,
  roughness: 0.1,
  transmission: 0.9,
  thickness: 0.5,
  transparent: true,
  opacity: 1,
});

// --------------------------------------------------------
// Control Unit Component
// --------------------------------------------------------
function ControlUnit({
  currentStep,
  onAdvanceStep,
}: {
  currentStep: EvmStep;
  onAdvanceStep: () => void;
}) {
  const isOff = currentStep === "power_off";

  return (
    <group position={[-3.5, 0, 0]}>
      {/* Base */}
      <RoundedBox args={[3, 1, 4]} radius={0.1} smoothness={4}>
        <primitive object={plasticMaterial} />
      </RoundedBox>

      {/* Screen area */}
      <mesh position={[0, 0.55, -1]}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color={isOff ? "#111" : "#a1e4a1"} />
      </mesh>
      {!isOff && (
        <Html position={[0, 0.61, -1]} rotation={[-Math.PI / 2, 0, 0]} center transform>
          <div
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: "10px",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {currentStep === "confirmation" ? "VOTE RECORDED" : "READY"}
          </div>
        </Html>
      )}

      {/* Power Button */}
      <group position={[0, 0.55, 1]}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            if (currentStep === "power_off") onAdvanceStep();
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
          <meshStandardMaterial color={isOff ? "#cc0000" : "#00cc00"} />
        </mesh>
        <Html position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} center transform>
          <div style={{ color: "white", fontSize: "6px", fontWeight: "bold", userSelect: "none" }}>
            POWER
          </div>
        </Html>
      </group>

      {/* Status LEDs */}
      <mesh position={[-1, 0.51, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial
          color={!isOff ? "#00ff00" : "#222"}
          emissive={!isOff ? "#00ff00" : "#000"}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1, 0.51, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial
          color={currentStep === "ballot_selection" ? "#ffaa00" : "#222"}
          emissive={currentStep === "ballot_selection" ? "#ffaa00" : "#000"}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Html position={[-1, 0.52, 0.8]} rotation={[-Math.PI / 2, 0, 0]} center transform>
        <div style={{ color: "black", fontSize: "5px", userSelect: "none" }}>ON</div>
      </Html>
      <Html position={[1, 0.52, 0.8]} rotation={[-Math.PI / 2, 0, 0]} center transform>
        <div style={{ color: "black", fontSize: "5px", userSelect: "none" }}>BUSY</div>
      </Html>
    </group>
  );
}

// --------------------------------------------------------
// Ballot Unit Component
// --------------------------------------------------------
function BallotUnit({
  currentStep,
  selectedCandidate,
  onCandidateSelect,
  onAdvanceStep,
}: {
  currentStep: EvmStep;
  selectedCandidate: number | null;
  onCandidateSelect: (id: number) => void;
  onAdvanceStep: () => void;
}) {
  const isSelectionActive = currentStep === "ballot_selection";

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <RoundedBox args={[3.5, 0.8, 5]} radius={0.1} smoothness={4}>
        <primitive object={plasticMaterial} />
      </RoundedBox>

      {/* Buttons and Candidate rows */}
      {SIMULATED_CANDIDATES.map((c, idx) => {
        const isSelected = selectedCandidate === c.id;
        const zPos = -1.5 + idx * 0.8;
        return (
          <group key={c.id} position={[0, 0.45, zPos]}>
            {/* Candidate label area */}
            <mesh position={[-0.5, 0, 0]}>
              <boxGeometry args={[2, 0.05, 0.6]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* HTML label for crisp emoji/text rendering */}
            <Html position={[-1, 0.03, 0]} center transform rotation={[-Math.PI / 2, 0, 0]}>
              <div
                style={{
                  background: "white",
                  padding: "2px 8px",
                  fontSize: "12px",
                  width: "120px",
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "black",
                }}
              >
                <span>{c.symbol}</span> <b>{c.label}</b>
              </div>
            </Html>

            {/* LED Indicator next to button */}
            <mesh position={[0.7, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
              <meshStandardMaterial
                color={isSelected ? "#ff0000" : "#222"}
                emissive={isSelected ? "#ff0000" : "#000"}
                emissiveIntensity={isSelected ? 1 : 0}
              />
            </mesh>

            {/* Blue Button */}
            <mesh
              position={[1.2, isSelected ? -0.05 : 0, 0]} // press effect
              onClick={(e) => {
                e.stopPropagation();
                if (isSelectionActive) {
                  onCandidateSelect(c.id);
                }
              }}
              onPointerOver={() => {
                if (isSelectionActive) document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => (document.body.style.cursor = "auto")}
            >
              <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
              <meshStandardMaterial color="#0055ff" roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* VOTE confirm button (simulated as being on the ballot unit for simpler UX or could just advance) */}
      {currentStep === "vote_cast" && (
        <Html position={[0, 1.5, 0]} center>
          <div
            style={{
              background: "var(--color-accent-1)",
              padding: "8px 16px",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAdvanceStep();
            }}
          >
            CONFIRM VOTE
          </div>
        </Html>
      )}
    </group>
  );
}

// --------------------------------------------------------
// VVPAT Component
// --------------------------------------------------------
function VvpatUnit({
  vvpatVisible,
  selectedCandidate,
}: {
  vvpatVisible: boolean;
  selectedCandidate: number | null;
}) {
  const candidate = SIMULATED_CANDIDATES.find((c) => c.id === selectedCandidate);

  return (
    <group position={[3.5, 0.5, -0.5]}>
      {/* Main body */}
      <RoundedBox args={[2.5, 3, 2.5]} radius={0.1} smoothness={4} position={[0, 1, 0]}>
        <primitive object={plasticMaterial} />
      </RoundedBox>

      {/* Window Area */}
      <mesh position={[0, 1.2, 1.26]}>
        <boxGeometry args={[1.6, 1.6, 0.1]} />
        <primitive object={darkPlasticMaterial} />
      </mesh>

      {/* Glass */}
      <mesh position={[0, 1.2, 1.32]}>
        <boxGeometry args={[1.5, 1.5, 0.05]} />
        <primitive object={glassMaterial} />
      </mesh>

      {/* Slip (visible conditionally) */}
      {vvpatVisible && candidate && (
        <mesh position={[0, 1.2, 1.28]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial color="#ffffff" />
          <Html position={[0, 0, 0.01]} center transform>
            <div
              style={{
                width: "100px",
                height: "100px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                border: "1px dashed #ccc",
              }}
            >
              <div style={{ fontSize: "32px" }}>{candidate.symbol}</div>
              <div style={{ fontSize: "12px", fontWeight: "bold" }}>{candidate.label}</div>
            </div>
          </Html>
        </mesh>
      )}
    </group>
  );
}

// --------------------------------------------------------
// Main Export
// --------------------------------------------------------
export default function EVM3DModel({
  currentStep,
  selectedCandidate,
  vvpatVisible,
  onCandidateSelect,
  onAdvanceStep,
}: EVM3DModelProps) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "400px" }}>
      <Canvas camera={{ position: [0, 6, 8], fov: 45 }}>
        <Suspense
          fallback={
            <Html center>
              <div style={{ color: "white" }}>Loading 3D Scene...</div>
            </Html>
          }
        >
          <color attach="background" args={["#0a0a1a"]} />
          {/* We make background transparent via CSS if we want, but explicit color helps 3D rendering */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
          <pointLight position={[-10, 5, -10]} intensity={1} />

          {/* Removed Environment preset="city" to avoid external fetch errors */}

          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[0, -0.5, 0]}>
              <ControlUnit currentStep={currentStep} onAdvanceStep={onAdvanceStep} />
              <BallotUnit
                currentStep={currentStep}
                selectedCandidate={selectedCandidate}
                onCandidateSelect={onCandidateSelect}
                onAdvanceStep={onAdvanceStep}
              />
              <VvpatUnit vvpatVisible={vvpatVisible} selectedCandidate={selectedCandidate} />

              {/* Cables */}
              <mesh position={[-1.8, 0.2, -1]}>
                <tubeGeometry
                  args={[
                    new THREE.CatmullRomCurve3([
                      new THREE.Vector3(0, 0, 0),
                      new THREE.Vector3(-1.7, -0.2, 1),
                    ]),
                    20,
                    0.05,
                    8,
                    false,
                  ]}
                />
                <meshStandardMaterial color="#222" />
              </mesh>
              <mesh position={[1.8, 0.2, -1]}>
                <tubeGeometry
                  args={[
                    new THREE.CatmullRomCurve3([
                      new THREE.Vector3(0, 0, 0),
                      new THREE.Vector3(1.7, 0, 0.5),
                    ]),
                    20,
                    0.05,
                    8,
                    false,
                  ]}
                />
                <meshStandardMaterial color="#222" />
              </mesh>
            </group>
          </Float>

          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={15} blur={1.5} far={4.5} />
          <OrbitControls
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
            enableZoom={true}
            minDistance={4}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
