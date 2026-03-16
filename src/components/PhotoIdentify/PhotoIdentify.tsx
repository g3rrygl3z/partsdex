import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePhotoIdentify } from "../../hooks/usePhotoIdentify";
import type { NormalizedPart } from "../../utils/search";
import type { PhotoMatch } from "../../hooks/usePhotoIdentify";
import styles from "./PhotoIdentify.module.css";

// -- Confidence bar ------------------------------------------------------------
function ConfidenceBar({ value }: { value: number }) {
  const pct  = Math.round(value * 100);
  const cls  = pct >= 80 ? styles.confHigh : pct >= 50 ? styles.confMed : styles.confLow;
  const label= pct >= 80 ? "High confidence" : pct >= 50 ? "Possible match" : "Low confidence";
  return (
    <div className={styles.confWrap}>
      <div className={styles.confTrack}>
        <div className={`${styles.confFill} ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`${styles.confLabel} ${cls}`}>{label} · {pct}%</span>
    </div>
  );
}

// -- Category badge ------------------------------------------------------------
function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, [string, string]> = {
    plumbing:        ["Plumbing",  styles.badgePlumbing],
    "boiler-heating":["Heating",   styles.badgeHeating],
    hvac:            ["HVAC",      styles.badgeHvac],
  };
  const [label, cls] = map[category] || [category, styles.badgePlumbing];
  return <span className={`${styles.badge} ${cls}`}>{label}</span>;
}

// -- Match card ----------------------------------------------------------------
interface MatchCardProps {
  match: PhotoMatch;
  rank: number;
  onSelect: (part: NormalizedPart) => void;
}

function MatchCard({ match, rank, onSelect }: MatchCardProps) {
  const { part, confidence, reasoning } = match;
  if (!part) return null;

  return (
    <div
      className={`${styles.matchCard} ${rank === 0 ? styles.matchCardTop : ""}`}
      onClick={() => onSelect(part)}
    >
      {rank === 0 && <div className={styles.bestMatchBadge}>Best match</div>}

      <div className={styles.matchRow}>
        {/* Part image */}
        <div className={styles.matchImg}>
          <img
            src={part.images?.[0] || `/images/parts/${part.id}.jpg`}
            alt={part.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextSibling as HTMLDivElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div className={styles.matchImgFallback} style={{ display: "none" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="8" x2="12" y2="13"/>
              <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Part info */}
        <div className={styles.matchInfo}>
          <div className={styles.matchName}>{part.name}</div>
          <div className={styles.matchMeta}>
            <code className={styles.sku}>{part.modelNumber}</code>
            <CategoryBadge category={part.vertical} />
            <span className={styles.mfr}>{part.manufacturer}</span>
          </div>
          <ConfidenceBar value={confidence} />
          <p className={styles.reasoning}>{reasoning}</p>
        </div>

        <div className={styles.matchArrow}>›</div>
      </div>
    </div>
  );
}

// -- Camera viewfinder ---------------------------------------------------------
interface CameraViewProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

function CameraView({ onCapture, onClose }: CameraViewProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const startCamera = useCallback(async (facing: "environment" | "user") => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, startCamera]);

  const capture = () => {
    const video  = videoRef.current;
    if (!video || !ready) return;
    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
          }
        }
      }, "image/jpeg", 0.92);
    }
  };

  const toggleCamera = () => {
    setReady(false);
    setFacingMode((f) => (f === "environment" ? "user" : "environment"));
  };

  return (
    <div className={styles.cameraWrap}>
      <video
        ref={videoRef}
        className={styles.cameraFeed}
        autoPlay
        playsInline
        muted
      />

      <div className={styles.viewfinder}>
        <div className={`${styles.corner} ${styles.cornerTL}`} />
        <div className={`${styles.corner} ${styles.cornerTR}`} />
        <div className={`${styles.corner} ${styles.cornerBL}`} />
        <div className={`${styles.corner} ${styles.cornerBR}`} />
      </div>

      <div className={styles.cameraHint}>
        Center the part in the frame
      </div>

      <div className={styles.cameraControls}>
        <button className={styles.cameraBtn} onClick={onClose} aria-label="Cancel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <line x1="5" y1="5" x2="19" y2="19"/>
            <line x1="19" y1="5" x2="5" y2="19"/>
          </svg>
        </button>

        <button
          className={`${styles.captureBtn} ${!ready ? styles.captureBtnDisabled : ""}`}
          onClick={capture}
          disabled={!ready}
          aria-label="Take photo"
        >
          <div className={styles.captureBtnInner} />
        </button>

        <button className={styles.cameraBtn} onClick={toggleCamera} aria-label="Flip camera">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M1 4v6h6"/>
            <path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// -- Processing overlay --------------------------------------------------------
function ProcessingView({ preview }: { preview: string | null }) {
  return (
    <div className={styles.processingWrap}>
      <div className={styles.processingImgWrap}>
        {preview && (
          <img src={preview} alt="Captured part" className={styles.processingImg} />
        )}
        <div className={styles.processingOverlay}>
          <div className={styles.scanLine} />
        </div>
      </div>
      <div className={styles.processingText}>
        <div className={styles.processingSpinner} />
        <p className={styles.processingLabel}>Identifying part…</p>
        <p className={styles.processingHint}>Claude is analyzing your photo</p>
      </div>
    </div>
  );
}

// -- Main component ------------------------------------------------------------
export default function PhotoIdentify({ onClose }: { onClose?: () => void }) {
  const navigate  = useNavigate();
  const fileRef   = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const {
    status, preview, matches, visualDesc, idNotes,
    isConfident, error,
    handleFileInput, handleCapture, reset,
    isProcessing, isSuccess, isError,
  } = usePhotoIdentify();

  const handleSelect = (part: NormalizedPart) => {
    reset();
    navigate(`/part/${part.id}`);
    if (onClose) onClose();
  };

  const handleCameraCapture = (blob: Blob) => {
    setCameraOpen(false);
    handleCapture(blob);
  };

  const handleTryAgain = () => {
    reset();
    setCameraOpen(false);
  };

  if (cameraOpen) {
    return (
      <CameraView
        onCapture={handleCameraCapture}
        onClose={() => setCameraOpen(false)}
      />
    );
  }

  if (isProcessing) {
    return <ProcessingView preview={preview} />;
  }

  if (isSuccess) {
    return (
      <div className={styles.resultsWrap}>
        {preview && (
          <div className={styles.resultPreviewRow}>
            <img src={preview} alt="Your photo" className={styles.resultPreview} />
            <div className={styles.resultPreviewMeta}>
              <p className={styles.resultPreviewLabel}>Your photo</p>
              {visualDesc && (
                <p className={styles.visualDesc}>"{visualDesc}"</p>
              )}
            </div>
          </div>
        )}

        {!isConfident && (
          <div className={styles.uncertaintyBar}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            <span>Image may be unclear — verify the match before ordering</span>
          </div>
        )}

        {matches.length > 0 ? (
          <div className={styles.matchList}>
            {matches.map((match, i) => (
              <MatchCard
                key={match.id}
                match={match}
                rank={i}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noMatch}>
            <p className={styles.noMatchTitle}>Part not identified</p>
            <p className={styles.noMatchHint}>
              {idNotes || "Try a clearer photo with better lighting, closer to the part."}
            </p>
          </div>
        )}

        {idNotes && matches.length > 0 && (
          <p className={styles.idNotes}>{idNotes}</p>
        )}

        <div className={styles.resultActions}>
          <button className={styles.retryBtn} onClick={handleTryAgain}>
            Take another photo
          </button>
          {onClose && (
            <button className={styles.closeResultBtn} onClick={onClose}>
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorWrap}>
        {preview && <img src={preview} alt="Your photo" className={styles.errorImg} />}
        <p className={styles.errorTitle}>Identification failed</p>
        <p className={styles.errorMsg}>{error}</p>
        <button className={styles.retryBtn} onClick={handleTryAgain}>Try again</button>
      </div>
    );
  }

  return (
    <div className={styles.idleWrap}>
      <div className={styles.idleIcon}>
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
          <rect x="8" y="14" width="48" height="36" rx="4"/>
          <circle cx="32" cy="32" r="10"/>
          <circle cx="32" cy="32" r="6"/>
          <rect x="24" y="8" width="16" height="6" rx="2"/>
          <circle cx="50" cy="20" r="2" fill="currentColor"/>
        </svg>
      </div>

      <h2 className={styles.idleTitle}>Identify a part</h2>
      <p className={styles.idleDesc}>
        Take a photo or upload an image of any plumbing, HVAC, or heating part —
        Claude will identify it instantly.
      </p>

      <button
        className={styles.cameraLaunchBtn}
        onClick={() => setCameraOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Take a photo
      </button>

      <button
        className={styles.uploadBtn}
        onClick={() => fileRef.current?.click()}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Upload from library
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        style={{ display: "none" }}
      />

      <div className={styles.tips}>
        <p className={styles.tipsTitle}>For best results</p>
        <ul className={styles.tipsList}>
          <li>Get close — fill the frame with the part</li>
          <li>Good lighting — avoid shadows across the part</li>
          <li>Show the connection ends if possible</li>
          <li>Any visible labels or markings help</li>
        </ul>
      </div>
    </div>
  );
}
