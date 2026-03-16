import { useRef, useEffect } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon, ArrowRight } from 'lucide-react';
import { usePhotoIdentify } from '../../hooks/usePhotoIdentify';
import { useNavigate } from 'react-router-dom';
import styles from './PhotoIdentify.module.css';

interface PhotoIdentifyProps {
  onClose?: () => void;
}

export default function PhotoIdentify({ onClose }: PhotoIdentifyProps) {
  const {
    status,
    preview,
    matches,
    visualDesc,
    idNotes,
    isConfident,
    error,
    handleFileInput,
    reset,
    isProcessing,
  } = usePhotoIdentify();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to results
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status === 'success' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [status]);

  const onPartClick = (id: string) => {
    navigate(`/part/${id}`);
    if (onClose) onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Camera className={styles.titleIcon} />
          <div>
            <h2 className={styles.title}>Visual Identifier</h2>
            <p className={styles.subtitle}>Snap a photo to identify parts instantly</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className={styles.main}>
        {/* Upload/Preview Section */}
        <div className={styles.uploadSection}>
          {!preview ? (
            <div 
              className={styles.dropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropzoneContent}>
                <div className={styles.iconCircle}>
                  <Upload className="w-6 h-6 text-blue-500" />
                </div>
                <p className={styles.droptext}>Tap to take photo or upload</p>
                <p className={styles.dropsubtext}>PNG, JPG or WEBP (Max 10MB)</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileInput} 
                accept="image/*" 
                capture="environment"
                className="hidden" 
              />
            </div>
          ) : (
            <div className={styles.previewContainer}>
              <img src={preview} alt="Preview" className={styles.previewImage} />
              <button onClick={reset} className={styles.resetBtn} disabled={isProcessing}>
                <X className="w-4 h-4 mr-1" /> Change Photo
              </button>
              {isProcessing && (
                <div className={styles.processingOverlay}>
                  <Loader2 className={styles.spinner} />
                  <span>Analyzing Image...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        {status === 'success' && (
          <div className={styles.resultsArea} ref={resultsRef}>
            <div className={styles.analysisHeader}>
              <div className={styles.analysisTitle}>AI Vision Analysis</div>
              {isConfident ? (
                <div className={styles.confidentBadge}>
                  <CheckCircle className="w-3 h-3 mr-1" /> High Confidence
                </div>
              ) : (
                <div className={styles.uncertainBadge}>
                  <AlertCircle className="w-3 h-3 mr-1" /> Uncertain Match
                </div>
              )}
            </div>

            <p className={styles.visualDesc}>
              <strong>Visual Description:</strong> {visualDesc}
            </p>

            {idNotes && (
              <div className={styles.notesBox}>
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{idNotes}</span>
              </div>
            )}

            <div className={styles.matchesList}>
              <h3 className={styles.matchesTitle}>Identified Matches</h3>
              {matches.length > 0 ? (
                matches.map((match) => (
                  <div 
                    key={match.id} 
                    className={styles.matchCard}
                    onClick={() => onPartClick(match.id)}
                  >
                    <div className={styles.matchImageWrap}>
                      {match.part.images?.[0] ? (
                        <img src={match.part.images[0]} alt={match.part.name} />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className={styles.matchInfo}>
                      <div className={styles.matchHeader}>
                        <h4 className={styles.matchName}>{match.part.name}</h4>
                        <div className={styles.matchConfidence}>
                          {Math.round(match.confidence * 100)}%
                        </div>
                      </div>
                      <p className={styles.matchReason}>{match.reasoning}</p>
                      <div className={styles.matchMeta}>
                        <span>{match.part.manufacturer}</span>
                        <span>•</span>
                        <span>{match.part.modelNumber}</span>
                      </div>
                    </div>
                    <ArrowRight className={styles.matchArrow} />
                  </div>
                ))
              ) : (
                <div className={styles.emptyResults}>
                  No direct database matches found. Try a clearer photo.
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorBox}>
            <AlertCircle className="w-5 h-5" />
            <div className={styles.errorContent}>
              <div className={styles.errorTitle}>Identification Failed</div>
              <div className={styles.errorMsg}>{error}</div>
              <button onClick={reset} className={styles.retryBtn}>Try Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
