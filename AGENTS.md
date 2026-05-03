# CivicIQ — Multilingual Electoral Process Education Assistant

## Product scope

**CivicIQ** is a multilingual assistant that educates voters on the electoral process (eligibility, registration, deadlines, polling-day procedure, EVM + VVPAT flow) with **strict political neutrality**.

- **Neutrality constraint**: Never mention parties, candidates, ideologies, or persuasion.
- **Grounding constraint**: Answers must be based on retrieved RAG context; if missing, say so and provide safe next steps (e.g., “check official election portal/helpline”) without guessing.
- **Latency constraint**: Sentences must be concise to reduce TTS latency.
- **Language constraint**: Respond in the **exact language of the user’s input**.

---

## Repository layout (target)

```
/
  frontend/                 # Next.js (App Router) client
  backend/                  # Node/TS backend (ADK + Live proxy)
  agent.md                  # This document
  README.md
```

---

## Frontend (Next.js) requirements

### UI: “Liquid Glass”
- Heavy glassmorphism: translucent cards, **strong backdrop-blur**, high-saturation gradient mesh background.
- Apple-native aesthetic: large radii, subtle borders, depth shadows, soft highlights.
- Motion: slow parallax mesh background + micro-interactions on controls.

### Audio capture (WebRTC/MediaRecorder)
- Capture microphone audio via `navigator.mediaDevices.getUserMedia({ audio: true })`.
- Record using `MediaRecorder` **or** process raw PCM via WebAudio for lower latency.
- Stream audio to backend continuously (chunked) while user speaks.

**Recommended low-latency path**
- Use WebAudio (`AudioWorklet` or `ScriptProcessor` fallback) to produce **16-bit PCM, 16kHz, little-endian** chunks, because Gemini Live commonly expects that for realtime audio input.

### Language selector (22 scheduled Indian languages)
Dropdown must include the Eighth Schedule languages (22). Use BCP‑47 language tags that are widely supported:

- Assamese — `as-IN`
- Bengali — `bn-IN`
- Bodo — `brx-IN`
- Dogri — `doi-IN`
- Gujarati — `gu-IN`
- Hindi — `hi-IN`
- Kannada — `kn-IN`
- Kashmiri — `ks-IN`
- Konkani — `kok-IN`
- Malayalam — `ml-IN`
- Manipuri (Meitei) — `mni-IN` (often `mni-Mtei` in some systems)
- Marathi — `mr-IN`
- Maithili — `mai-IN`
- Nepali — `ne-IN`
- Odia — `or-IN`
- Punjabi — `pa-IN`
- Sanskrit — `sa-IN`
- Santali — `sat-IN`
- Sindhi — `sd-IN`
- Tamil — `ta-IN`
- Telugu — `te-IN`
- Urdu — `ur-IN`

Notes:
- Keep a separate internal mapping layer so you can adjust tags per provider without changing UI labels.
- The Live API can be instructed to **restrict output language** via system instructions even if the model can code-switch.

### Streaming UI: audio buffer + translated text simultaneously
During response streaming:
- Play streamed audio (buffered) as it arrives.
- Render text transcript incrementally (model output transcription).

UI must show:
- **Input transcript** (optional, live STT)
- **Output transcript** (live)
- **Audio state** (listening / thinking / speaking)

### 3D EVM + VVPAT simulator (Three.js)
Interactive model that:
- Renders EVM unit(s) and VVPAT with “glass” UI overlays.
- Allows clicking buttons.
- Procedurally guides the **full polling day sequence** in steps (chronological).

Minimum interactions:
- Power on / readiness
- Voter verification step
- Ballot unit selection
- Vote cast button press
- VVPAT slip view (simulated)
- Final confirmation / next voter

Implementation notes:
- Use `three` + `@react-three/fiber` + `@react-three/drei`.
- Make each control a mesh with hit-testing; on click, advance a finite-state machine (FSM) representing the procedure.
- The simulator should be educational, not “gamey”; present neutral instructions.

---

## Backend (TypeScript) — Google ADK + Gemini Live

### High-level architecture

**Runtime split**
- **Frontend**: captures audio and talks to backend via WebSocket/SSE.
- **Backend**: holds API keys, performs RAG + ADK routing, and proxies streaming to/from Gemini Live.

**Core services**
- `LiveSessionService`: manages Gemini Live WebSocket session.
- `RagService`: vector DB retrieval (jurisdiction-specific docs, procedures, FAQs).
- `AgentOrchestrator`: ADK multi-agent system (router + specialists).
- `StreamingGateway`: websocket endpoint for the frontend.

### Multi-agent architecture (ADK)

Agents:
- **Router Agent**
  - Classifies intent (registration vs polling-day procedure vs general lifecycle).
  - Outputs `{ intent, confidence, required_slots }`.
- **Registrar Agent**
  - Voter ID, forms, deadlines, eligibility, corrections, enrollment.
- **Polling Officer Agent**
  - Booth location guidance (from RAG), polling-day rules, EVM/VVPAT procedure, do’s/don’ts.

All agents share the same **system prompt** (see below) and must:
- use retrieved context snippets
- produce numbered steps for procedures
- keep short sentences

### Per-request pipeline (streaming session)

1. **Receive audio chunks** from client (`audio/pcm;rate=16000` preferred).
2. **Gemini Live** performs multilingual understanding and provides:
   - input transcription events (optional)
   - audio output stream
   - output transcription events (text)
3. **Normalize internally to English** for RAG + routing:
   - either: ask the model to produce an English normalization as a tool call / hidden channel
   - or: do a parallel text-only Gemini call for deterministic normalized query text
4. **RAG retrieval** using normalized English query.
5. **Router Agent** chooses specialist agent.
6. **Specialist agent generation** produces:
   - a short structured plan + final answer grounded in RAG
7. **Gemini Live streams** the final response back as:
   - **audio** (native)
   - **output transcript** (text), in the user’s original language
8. **Backend streams to frontend** both:
   - audio buffer chunks
   - transcript deltas

### Streaming contracts (backend ↔ frontend)

Use a single WebSocket between frontend and backend.

**Client → Server**
- `session.start`: `{ languageTag, uiContext?, jurisdiction?, consent }`
- `audio.chunk`: `{ mimeType: "audio/pcm;rate=16000", dataB64 }`
- `audio.end`: `{}` (user stopped speaking)
- `session.stop`: `{}`

**Server → Client**
- `stt.delta`: `{ text, isFinal? }`
- `tts.audio`: `{ mimeType: "audio/pcm;rate=24000", dataB64 }`
- `tts.delta`: `{ text, isFinal? }` (output transcript)
- `status`: `{ state: "listening" | "thinking" | "speaking" | "idle" }`
- `error`: `{ code, message, retryable }`

Notes:
- Don’t assume strict ordering between audio and transcript messages; the Live API notes concurrent streams can be unordered.
- The frontend should handle partials and re-render deltas.

### Gemini Live session configuration (key points)

When establishing the Live session:
- Enable **output audio transcription** so you can show text while audio plays.
- Optionally enable **input audio transcription** for live captions.
- Use system instruction to **force response language** to match the user’s language selection.

Implementation detail:
- Gemini Live is a **stateful WebSocket** session. You send an initial setup message, then stream realtime audio messages, and receive server events containing audio + transcription.

---

## RAG (Vector DB) requirements

### Data sources (examples)
- Official election commission procedures, voter guides, polling-day instructions.
- “How to register”, “How to correct details”, “What to bring”, “Do’s and don’ts”.
- EVM/VVPAT educational material.

### Retrieval policy
- Retrieve top‑K snippets with citations/IDs.
- Include those snippets (or a compressed citation form) in the specialist agent’s context.
- If retrieval yields insufficient coverage, the agent must say:
  - “This is not in my official reference material right now.”
  - Provide safe next steps (official portals/helplines) without inventing facts.

---

## Shared system prompt (ALL agents)

Use the following as the **system instruction** for Router + Specialists (and as a constraint for any Live session that produces user-facing output):

```
You are the Official Electoral Process Educator.
Explain the election lifecycle, voter eligibility, and polling procedures accurately and neutrally.

Rules:
- Absolute political neutrality. Never mention parties, candidates, or ideologies.
- Ground answers strictly in retrieved reference context. If something is not in the provided context, say so.
- Break procedures into numbered chronological steps.
- Keep sentences concise to reduce speech latency.
- Respond in the exact language of the user's input.
```

---

## Security + privacy
- Never expose long-lived API keys to the browser.
- Prefer ephemeral credentials if enabling client-direct Live connections; otherwise proxy through backend.
- Audio is sensitive data: log only minimal metadata; avoid storing raw audio by default.
- Add abuse safeguards (rate limiting, session caps, profanity/harassment filters if needed) while remaining neutral.

---

## Acceptance criteria (MVP)

- Frontend can capture mic audio and stream to backend.
- Backend opens a Gemini Live session and returns:
  - streaming audio + output transcript in the same language as input
  - optional input transcript
- Router selects between Registrar vs Polling Officer intents.
- Specialist responses contain numbered steps and are grounded in RAG context.
- 3D EVM + VVPAT simulator runs and supports a procedural polling-day sequence via clickable controls.

