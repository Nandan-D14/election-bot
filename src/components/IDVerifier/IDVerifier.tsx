'use client';

/* ============================================================
   CivicIQ — Voter ID Verification Component
   AI-powered voter ID card verification using Gemini Vision.
   Upload front and back images of your voter ID for analysis.
   ============================================================ */

import { useState, useRef, useCallback } from 'react';
import styles from './IDVerifier.module.css';

interface VerificationDetails {
  name: string | null;
  fatherOrHusbandName: string | null;
  epicNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  age: string | null;
  address: string | null;
  assemblyConstituency: string | null;
  partNumber: string | null;
  photo: 'present' | 'missing' | 'unclear';
}

interface VerificationCheck {
  check: string;
  passed: boolean;
  note: string;
}

interface VerificationResult {
  status: 'VALID' | 'SUSPICIOUS' | 'INVALID' | 'UNREADABLE';
  confidence: number;
  details: VerificationDetails;
  checks: VerificationCheck[];
  warnings: string[];
  summary: string;
}

interface IDVerifierProps {
  onVerificationComplete?: () => void;
}

export default function IDVerifier({ onVerificationComplete }: IDVerifierProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOverFront, setDragOverFront] = useState(false);
  const [dragOverBack, setDragOverBack] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (file: File, side: 'front' | 'back') => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPG, PNG, etc.)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Please upload an image smaller than 10MB.');
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (side === 'front') setFrontImage(dataUrl);
        else setBackImage(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file, side);
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, side: 'front' | 'back') => {
      e.preventDefault();
      if (side === 'front') setDragOverFront(false);
      else setDragOverBack(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleImageUpload(file, side);
    },
    [handleImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    if (side === 'front') setDragOverFront(true);
    else setDragOverBack(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    if (side === 'front') setDragOverFront(false);
    else setDragOverBack(false);
  }, []);

  const handleVerify = useCallback(async () => {
    if (!frontImage) {
      setError('Please upload the front side of your Voter ID.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontImage,
          backImage,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Verification failed');
      }

      const data: VerificationResult = await response.json();
      setResult(data);

      // Award points for completing verification
      if (onVerificationComplete) {
        onVerificationComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [frontImage, backImage, onVerificationComplete]);

  const handleReset = useCallback(() => {
    setFrontImage(null);
    setBackImage(null);
    setResult(null);
    setError(null);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALID': return '✅';
      case 'SUSPICIOUS': return '⚠️';
      case 'INVALID': return '❌';
      case 'UNREADABLE': return '🔍';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALID': return 'var(--color-success)';
      case 'SUSPICIOUS': return 'var(--color-warning)';
      case 'INVALID': return 'var(--color-error)';
      case 'UNREADABLE': return 'var(--color-text-muted)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>🪪</div>
        <div>
          <h2 className={styles.title}>Voter ID Verification</h2>
          <p className={styles.subtitle}>
            Upload your Voter ID (EPIC card) images for AI-powered authenticity verification
          </p>
        </div>
      </div>

      {/* Upload Section */}
      {!result && (
        <div className={styles.uploadSection}>
          <div className={styles.uploadGrid}>
            {/* Front Side */}
            <div
              className={`${styles.uploadZone} ${dragOverFront ? styles.uploadZoneDragOver : ''} ${frontImage ? styles.uploadZoneHasImage : ''}`}
              onDrop={(e) => handleDrop(e, 'front')}
              onDragOver={(e) => handleDragOver(e, 'front')}
              onDragLeave={(e) => handleDragLeave(e, 'front')}
              onClick={() => frontInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload front side of Voter ID"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') frontInputRef.current?.click(); }}
            >
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'front')}
                className={styles.hiddenInput}
                aria-hidden="true"
              />
              {frontImage ? (
                <div className={styles.previewContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frontImage} alt="Front of Voter ID" className={styles.preview} />
                  <div className={styles.previewOverlay}>
                    <span>Click to change</span>
                  </div>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <div className={styles.uploadIcon}>📷</div>
                  <p className={styles.uploadLabel}>Front Side</p>
                  <p className={styles.uploadHint}>Drop image here or click to upload</p>
                  <span className={styles.uploadRequired}>Required</span>
                </div>
              )}
            </div>

            {/* Back Side */}
            <div
              className={`${styles.uploadZone} ${dragOverBack ? styles.uploadZoneDragOver : ''} ${backImage ? styles.uploadZoneHasImage : ''}`}
              onDrop={(e) => handleDrop(e, 'back')}
              onDragOver={(e) => handleDragOver(e, 'back')}
              onDragLeave={(e) => handleDragLeave(e, 'back')}
              onClick={() => backInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload back side of Voter ID"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') backInputRef.current?.click(); }}
            >
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'back')}
                className={styles.hiddenInput}
                aria-hidden="true"
              />
              {backImage ? (
                <div className={styles.previewContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={backImage} alt="Back of Voter ID" className={styles.preview} />
                  <div className={styles.previewOverlay}>
                    <span>Click to change</span>
                  </div>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <div className={styles.uploadIcon}>📷</div>
                  <p className={styles.uploadLabel}>Back Side</p>
                  <p className={styles.uploadHint}>Drop image here or click to upload</p>
                  <span className={styles.uploadOptional}>Optional</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={styles.verifyButton}
              onClick={handleVerify}
              disabled={!frontImage || isVerifying}
              id="verify-id-button"
            >
              {isVerifying ? (
                <>
                  <span className={styles.spinner} />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Verify Voter ID
                </>
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <div className={styles.privacyNotice}>
            <span className={styles.privacyIcon}>🔒</span>
            <p>Your images are processed securely and are <strong>never stored</strong>. Analysis happens in real-time and data is discarded immediately after.</p>
          </div>
        </div>
      )}

      {/* Verification Results */}
      {result && (
        <div className={styles.resultSection}>
          {/* Status Banner */}
          <div
            className={styles.statusBanner}
            style={{ borderColor: getStatusColor(result.status) }}
          >
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>{getStatusIcon(result.status)}</span>
              <div>
                <h3 className={styles.statusTitle} style={{ color: getStatusColor(result.status) }}>
                  {result.status === 'VALID' && 'Voter ID Appears Valid'}
                  {result.status === 'SUSPICIOUS' && 'Verification Inconclusive'}
                  {result.status === 'INVALID' && 'Voter ID Appears Invalid'}
                  {result.status === 'UNREADABLE' && 'Image Could Not Be Read'}
                </h3>
                <p className={styles.statusConfidence}>
                  Confidence: {result.confidence}%
                </p>
              </div>
            </div>
            <div className={styles.confidenceBar}>
              <div
                className={styles.confidenceFill}
                style={{
                  width: `${result.confidence}%`,
                  backgroundColor: getStatusColor(result.status),
                }}
              />
            </div>
            <p className={styles.statusSummary}>{result.summary}</p>
          </div>

          {/* Extracted Details */}
          {result.details && Object.values(result.details).some(v => v !== null) && (
            <div className={styles.detailsCard}>
              <h4 className={styles.sectionTitle}>📋 Extracted Details</h4>
              <div className={styles.detailsGrid}>
                {result.details.name && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Name</span>
                    <span className={styles.detailValue}>{result.details.name}</span>
                  </div>
                )}
                {result.details.epicNumber && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>EPIC Number</span>
                    <span className={`${styles.detailValue} ${styles.mono}`}>{result.details.epicNumber}</span>
                  </div>
                )}
                {result.details.fatherOrHusbandName && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Father/Husband</span>
                    <span className={styles.detailValue}>{result.details.fatherOrHusbandName}</span>
                  </div>
                )}
                {result.details.gender && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Gender</span>
                    <span className={styles.detailValue}>{result.details.gender}</span>
                  </div>
                )}
                {result.details.dateOfBirth && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date of Birth</span>
                    <span className={styles.detailValue}>{result.details.dateOfBirth}</span>
                  </div>
                )}
                {result.details.age && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Age</span>
                    <span className={styles.detailValue}>{result.details.age}</span>
                  </div>
                )}
                {result.details.address && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Address</span>
                    <span className={styles.detailValue}>{result.details.address}</span>
                  </div>
                )}
                {result.details.assemblyConstituency && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Constituency</span>
                    <span className={styles.detailValue}>{result.details.assemblyConstituency}</span>
                  </div>
                )}
                {result.details.partNumber && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Part Number</span>
                    <span className={styles.detailValue}>{result.details.partNumber}</span>
                  </div>
                )}
                {result.details.photo && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Photo</span>
                    <span className={styles.detailValue}>
                      {result.details.photo === 'present' ? '✅ Present' : result.details.photo === 'missing' ? '❌ Missing' : '🔍 Unclear'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Checks */}
          {result.checks && result.checks.length > 0 && (
            <div className={styles.checksCard}>
              <h4 className={styles.sectionTitle}>🔍 Verification Checks</h4>
              <div className={styles.checksList}>
                {result.checks.map((check, i) => (
                  <div key={i} className={styles.checkItem}>
                    <span className={styles.checkIcon}>
                      {check.passed ? '✅' : '❌'}
                    </span>
                    <div className={styles.checkContent}>
                      <span className={styles.checkName}>{check.check}</span>
                      <span className={styles.checkNote}>{check.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className={styles.warningsCard}>
              <h4 className={styles.sectionTitle}>⚠️ Warnings</h4>
              <ul className={styles.warningsList}>
                {result.warnings.map((warning, i) => (
                  <li key={i} className={styles.warningItem}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Try Again */}
          <button className={styles.resetButton} onClick={handleReset}>
            🔄 Verify Another ID
          </button>
        </div>
      )}
    </div>
  );
}
