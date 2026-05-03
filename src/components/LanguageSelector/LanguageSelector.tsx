"use client";

/* ============================================================
   CivicIQ — Language Selector Component
   A premium glass-styled dropdown for 22 Indian languages.
   ============================================================ */

import { useState, useRef, useEffect } from "react";
import type { LanguageTag } from "@/types";
import { LANGUAGES } from "@/constants/languages";
import styles from "./LanguageSelector.module.css";

interface LanguageSelectorProps {
  value: LanguageTag;
  onChange: (tag: LanguageTag) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = LANGUAGES.find((l) => l.tag === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const filtered = LANGUAGES.filter(
    (l) => l.labelEn.toLowerCase().includes(search.toLowerCase()) || l.label.includes(search)
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        id="language-selector"
      >
        <span className={styles.triggerIcon}>🌐</span>
        <span className={styles.triggerLabel}>{selected ? selected.label : "Language"}</span>
        <span className={styles.triggerLabelEn}>{selected ? selected.labelEn : ""}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox" aria-label="Languages">
          <div className={styles.searchWrap}>
            <input
              ref={searchRef}
              className={styles.search}
              type="text"
              placeholder="Search language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search languages"
            />
          </div>
          <ul className={styles.list}>
            {filtered.map((lang) => (
              <li key={lang.tag}>
                <button
                  className={`${styles.option} ${lang.tag === value ? styles.optionActive : ""}`}
                  role="option"
                  aria-selected={lang.tag === value}
                  onClick={() => {
                    onChange(lang.tag);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span className={styles.optionLabel}>{lang.label}</span>
                  <span className={styles.optionLabelEn}>{lang.labelEn}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className={styles.empty}>No languages found</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
