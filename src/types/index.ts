/* ============================================================
   CivicIQ — Shared TypeScript Types
   ============================================================ */

/** BCP-47 language tags for the 22 Eighth Schedule Indian languages */
export type LanguageTag =
  | 'as-IN' | 'bn-IN' | 'brx-IN' | 'doi-IN' | 'gu-IN'
  | 'hi-IN' | 'kn-IN' | 'ks-IN' | 'kok-IN' | 'ml-IN'
  | 'mni-IN' | 'mr-IN' | 'mai-IN' | 'ne-IN' | 'or-IN'
  | 'pa-IN' | 'sa-IN' | 'sat-IN' | 'sd-IN' | 'ta-IN'
  | 'te-IN' | 'ur-IN';

export interface LanguageOption {
  tag: LanguageTag;
  label: string;        // Native script name
  labelEn: string;      // English name
}

/** Real-time audio pipeline states */
export type AudioState = 'idle' | 'listening' | 'thinking' | 'speaking';

/** WebSocket message types — Client → Server */
export interface WsSessionStart {
  type: 'session.start';
  languageTag: LanguageTag;
  consent: boolean;
}

export interface WsAudioChunk {
  type: 'audio.chunk';
  mimeType: 'audio/pcm;rate=16000';
  dataB64: string;
}

export interface WsAudioEnd {
  type: 'audio.end';
}

export interface WsSessionStop {
  type: 'session.stop';
}

export type ClientMessage = WsSessionStart | WsAudioChunk | WsAudioEnd | WsSessionStop;

/** WebSocket message types — Server → Client */
export interface WsSttDelta {
  type: 'stt.delta';
  text: string;
  isFinal?: boolean;
}

export interface WsTtsAudio {
  type: 'tts.audio';
  mimeType: 'audio/pcm;rate=24000';
  dataB64: string;
}

export interface WsTtsDelta {
  type: 'tts.delta';
  text: string;
  isFinal?: boolean;
}

export interface WsStatus {
  type: 'status';
  state: AudioState;
}

export interface WsError {
  type: 'error';
  code: string;
  message: string;
  retryable: boolean;
}

export type ServerMessage = WsSttDelta | WsTtsAudio | WsTtsDelta | WsStatus | WsError;

/** Transcript entry for the chat display */
export interface TranscriptEntry {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

/** 3D EVM Simulator — Finite State Machine */
export type EvmStep =
  | 'power_off'
  | 'power_on'
  | 'voter_verification'
  | 'ballot_selection'
  | 'vote_cast'
  | 'vvpat_slip'
  | 'confirmation';

export interface EvmState {
  currentStep: EvmStep;
  selectedCandidate: number | null;
  isComplete: boolean;
}
