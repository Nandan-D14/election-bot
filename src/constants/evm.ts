/* ============================================================
   CivicIQ — EVM Simulator Constants
   Finite State Machine steps and educational content
   ============================================================ */

import type { EvmStep } from '@/types';

export interface EvmStepInfo {
  step: EvmStep;
  title: string;
  description: string;
  instruction: string;
  icon: string; // emoji for simplicity, can be replaced with SVG
}

export const EVM_STEPS: EvmStepInfo[] = [
  {
    step: 'power_off',
    title: 'Machine Off',
    description: 'The Electronic Voting Machine is currently powered off.',
    instruction: 'Click the power button to initialize the EVM.',
    icon: '⏻',
  },
  {
    step: 'power_on',
    title: 'System Ready',
    description: 'The EVM and VVPAT unit are powered on and ready.',
    instruction: 'The Presiding Officer verifies that all systems are functional. Click "Begin Voting" to proceed.',
    icon: '✅',
  },
  {
    step: 'voter_verification',
    title: 'Voter Verification',
    description: 'The polling officer verifies the voter\'s identity using their Voter ID card (EPIC) and checks the electoral roll.',
    instruction: 'Present your Voter ID. After verification, the officer will enable the ballot unit. Click "Verified" to continue.',
    icon: '🪪',
  },
  {
    step: 'ballot_selection',
    title: 'Cast Your Vote',
    description: 'The ballot unit displays candidate options. Press the blue button next to your preferred candidate.',
    instruction: 'Select a candidate by pressing the button next to their symbol on the ballot unit.',
    icon: '🗳️',
  },
  {
    step: 'vote_cast',
    title: 'Confirm Vote',
    description: 'You have pressed the button. Now press the large blue button on the control unit to finalize your vote.',
    instruction: 'Press the VOTE button to confirm your selection.',
    icon: '☑️',
  },
  {
    step: 'vvpat_slip',
    title: 'VVPAT Verification',
    description: 'The VVPAT machine prints a paper slip showing your selected candidate symbol and name. The slip is visible for 7 seconds.',
    instruction: 'Verify your vote on the VVPAT slip (visible for 7 seconds). The slip will then drop into a sealed box.',
    icon: '🧾',
  },
  {
    step: 'confirmation',
    title: 'Vote Recorded',
    description: 'Your vote has been successfully recorded. The EVM beeps to confirm. Indelible ink is applied to your left index finger.',
    instruction: 'Your vote is complete. Exit the polling booth quietly. Thank you for participating in democracy!',
    icon: '🎉',
  },
];

/** Simulated candidate entries for the EVM ballot unit (neutral — no real parties) */
export const SIMULATED_CANDIDATES = [
  { id: 1, symbol: '🌸', label: 'Candidate 1' },
  { id: 2, symbol: '🌻', label: 'Candidate 2' },
  { id: 3, symbol: '🌿', label: 'Candidate 3' },
  { id: 4, symbol: '⭐', label: 'Candidate 4' },
  { id: 5, symbol: '📘', label: 'NOTA' },
];
