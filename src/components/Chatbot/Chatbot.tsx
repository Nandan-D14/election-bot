'use client';

/* ============================================================
   Chatbot — Gemini-style conversational interface
   ============================================================ */

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
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
  { id: '1', label: 'Write', icon: '✍️', prompt: 'Help me write something...' },
  { id: '2', label: 'Learn', icon: '📚', prompt: 'I want to learn about...' },
  { id: '3', label: 'Code', icon: '</>', prompt: 'Help me code...' },
  { id: '4', label: 'Life stuff', icon: '🌟', prompt: 'I need advice on...' },
  { id: '5', label: "Claude's choice", icon: '✨', prompt: 'Surprise me with something interesting!' },
];

const MODELS = [
  { id: 'sonnet', name: 'Sonnet 4.6', label: 'Adaptive' },
  { id: 'opus', name: 'Opus', label: 'Max' },
  { id: 'haiku', name: 'Haiku', label: 'Fast' },
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const generateResponse = (): string => {
    const responses = [
      "I'd be happy to help with that! Let me break this down for you...",
      "Great question! Here's what you need to know...",
      "I understand what you're looking for. Here's my take...",
      "That's an interesting topic! Let me provide some insights...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: generateResponse(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  }, [inputValue, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
            <span className={styles.logoIcon}>✷</span>
            <h1 className={styles.logoText}>
              <span className={styles.logoGemini}>GEMINI</span>
              <span className={styles.logoReturns}>returns!</span>
            </h1>
          </div>
        </div>
      )}

      {/* Messages Area */}
      {hasMessages && (
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'user' ? styles.messageUser : styles.messageAssistant
              }`}
            >
              <div className={styles.messageAvatar}>
                {message.role === 'assistant' ? (
                  <span className={styles.assistantAvatar}>✷</span>
                ) : (
                  <span className={styles.userAvatar}>U</span>
                )}
              </div>
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{message.content}</p>
                <span className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasMessages ? 'Message GEMINI...' : 'Type / for skills'}
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showModelDropdown && (
                <div className={styles.modelDropdown}>
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      className={`${styles.modelOption} ${
                        selectedModel.id === model.id ? styles.modelOptionActive : ''
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
