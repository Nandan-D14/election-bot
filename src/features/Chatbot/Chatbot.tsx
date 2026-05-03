"use client";

/* ============================================================
   Chatbot — Gemini-style conversational interface
   ============================================================ */

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Chatbot.module.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SuggestionChip {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

const SUGGESTION_CHIPS: SuggestionChip[] = [
  {
    id: "1",
    label: "Voter Registration",
    icon: "🗳️",
    prompt: "How do I register to vote in India?",
  },
  { id: "2", label: "EVM Process", icon: "🖲️", prompt: "How does the EVM voting machine work?" },
  { id: "3", label: "Voter ID", icon: "🆔", prompt: "How do I apply for a Voter ID card?" },
  { id: "4", label: "Election Day", icon: "📅", prompt: "What should I bring on election day?" },
  { id: "5", label: "Eligibility", icon: "✅", prompt: "Who is eligible to vote in India?" },
];

const MODELS = [
  { id: "gemini 3.1 flash", name: "gemini 3.1 flash 4.6", label: "fast" },
  { id: "gemini 3 flash", name: "gemini 3 flash", label: "thinking" },
  { id: "gemini 3.1 pro", name: "gemini 3.1 pro", label: "high" },
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Ref to accumulate streamed content without triggering re-renders per chunk
  const streamBufferRef = useRef("");
  const rafIdRef = useRef<number | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Build full messages payload BEFORE mutating state to avoid stale closure
    const apiMessages = [
      ...messages,
      { role: "user" as const, content: inputValue.trim() },
    ];

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel.id,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Add an empty assistant message to stream into
      const assistantMessageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      setIsLoading(false); // Typing indicator off, streaming starts

      if (response.body) {
        const reader = response.body.getReader();
        // Create decoder once, outside the loop
        const decoder = new TextDecoder();
        let done = false;
        streamBufferRef.current = "";

        // Batched UI update via rAF — avoids re-render per chunk
        const scheduleUpdate = () => {
          if (rafIdRef.current !== null) return; // Already scheduled
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            const buffered = streamBufferRef.current;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? { ...msg, content: buffered } : msg
              )
            );
          });
        };

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            streamBufferRef.current += chunk;
            scheduleUpdate();
          }
        }

        // Final flush — ensure last chunk is committed
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        const finalContent = streamBufferRef.current;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: finalContent } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting to my servers right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, selectedModel.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (chip: SuggestionChip) => {
    setInputValue(chip.prompt);
    inputRef.current?.focus();
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={styles.chatbotContainer}>
      {/* Header */}
      {!hasMessages && (
        <div className={styles.welcomeSection}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🗳️</span>
            <h1 className={styles.logoText}>
              <span className={styles.logoGemini}>CivicIQ</span>
              <span className={styles.logoReturns}>Election Assistant</span>
            </h1>
          </div>
          <p className={styles.welcomeSubtitle}>
            Ask about voter registration, EVM voting, eligibility, and more
          </p>
        </div>
      )}

      {/* Messages Area */}
      {hasMessages && (
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === "user" ? styles.messageUser : styles.messageAssistant
              }`}
            >
              <div className={styles.messageAvatar}>
                {message.role === "assistant" ? (
                  <span className={styles.assistantAvatar}>✷</span>
                ) : (
                  <span className={styles.userAvatar}>U</span>
                )}
              </div>
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{message.content}</p>
                <span className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={styles.message}>
              <div className={styles.messageAvatar}>
                <span className={styles.assistantAvatar}>✷</span>
              </div>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className={styles.inputSection}>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <button className={styles.attachButton} aria-label="Attach file">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasMessages ? "Message GEMINI..." : "Type / for skills"}
              className={styles.input}
              rows={1}
            />
          </div>

          <div className={styles.inputFooter}>
            <div className={styles.modelSelector}>
              <button
                className={styles.modelButton}
                onClick={() => setShowModelDropdown(!showModelDropdown)}
              >
                <span className={styles.modelName}>{selectedModel.name}</span>
                <span className={styles.modelLabel}>{selectedModel.label}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showModelDropdown && (
                <div className={styles.modelDropdown}>
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      className={`${styles.modelOption} ${
                        selectedModel.id === model.id ? styles.modelOptionActive : ""
                      }`}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelDropdown(false);
                      }}
                    >
                      <span className={styles.modelOptionName}>{model.name}</span>
                      <span className={styles.modelOptionLabel}>{model.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        {!hasMessages && (
          <div className={styles.suggestionChips}>
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip.id}
                className={styles.chip}
                onClick={() => handleSuggestionClick(chip)}
              >
                <span className={styles.chipIcon}>{chip.icon}</span>
                <span className={styles.chipLabel}>{chip.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
