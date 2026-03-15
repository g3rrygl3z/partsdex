import { useEffect } from "react";
import SmartSearch   from "./SmartSearch";
import styles        from "./SearchOverlay.module.css";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logo}>PartsDex</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="4" y1="4" x2="16" y2="16"/>
              <line x1="16" y1="4" x2="4" y2="16"/>
            </svg>
          </button>
        </div>

        {/* Search component */}
        <div className={styles.searchWrap}>
          <SmartSearch autoFocus={true} onClose={onClose} />
        </div>

        {/* Hint pills */}
        <div className={styles.hints}>
          <span className={styles.hintLabel}>Try:</span>
          {[
            "press 90 elbow",
            "push fit no solder",
            "grey boiler tank",
            "repair coupling",
            "water heater expansion",
          ].map((hint) => (
            <button
              key={hint}
              className={styles.hintPill}
              // Clicking a hint pre-fills the search — handled by a custom event
              onClick={() => {
                window.dispatchEvent(new CustomEvent("partsdex:search", { detail: hint }));
              }}
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
