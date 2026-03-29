import { useNavigate } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../../utils/helpers';
import type { NormalizedPart } from '../../utils/search';
import type { LinkedPart, RelationshipType } from '../../types';
import styles from './Recommendations.module.css';

// ── Relationship type badges ──────────────────────────────────────────────────
const TYPE_CONFIG: Record<RelationshipType, { label: string; className: string }> = {
  COMMONLY_PAIRED: { label: 'Paired', className: styles.typePaired },
  SAFETY:          { label: 'Safety', className: styles.typeSafety },
  MAINTENANCE_KIT: { label: 'Maintenance', className: styles.typeMaintenance },
  UPGRADE:         { label: 'Upgrade', className: styles.typeUpgrade },
  ACCESSORY:       { label: 'Accessory', className: styles.typeAccessory },
};

function RelationshipBadge({ type }: { type: RelationshipType }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.COMMONLY_PAIRED;
  return <span className={`${styles.typeBadge} ${config.className}`}>{config.label}</span>;
}

// ── Linked part card ──────────────────────────────────────────────────────────
function LinkedPartCard({ linkedPart, onClick }: { linkedPart: LinkedPart; onClick: () => void }) {
  const { part, type, reason } = linkedPart;
  const normalizedPart = part as unknown as NormalizedPart;

  return (
    <button className={styles.linkedCard} onClick={onClick} type="button">
      <div className={styles.linkedCardHeader}>
        <span className={styles.linkedCardName}>{normalizedPart.name || normalizedPart.primaryName}</span>
        <div className={styles.linkedCardBadges}>
          <RelationshipBadge type={type} />
          <span className={getVerticalBadgeClass(normalizedPart.vertical || normalizedPart.category)}>
            {getVerticalDisplayName(normalizedPart.vertical || normalizedPart.category)}
          </span>
        </div>
      </div>
      <p className={styles.linkedCardReason}>{reason}</p>
      <div className={styles.linkedCardArrow}>
        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </div>
    </button>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonLine} style={{ width: '75%' }} />
      <div className={styles.skeletonLine} style={{ width: '90%' }} />
      <div className={styles.skeletonLine} style={{ width: '60%' }} />
    </div>
  );
}

// ── Pro Tip card ──────────────────────────────────────────────────────────────
function ProTipCard({ tip, isLoading }: { tip: string | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className={styles.proTipCard}>
        <div className={styles.proTipHeader}>
          <span className={styles.proTipIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.4 5.7 21l2.3-7L2 9.4h7.6L12 2z" />
            </svg>
          </span>
          <span className={styles.proTipTitle}>Pro Tip</span>
          <span className={styles.proTipAiBadge}>AI</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!tip) return null;

  return (
    <div className={styles.proTipCard}>
      <div className={styles.proTipHeader}>
        <span className={styles.proTipIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.4 5.7 21l2.3-7L2 9.4h7.6L12 2z" />
          </svg>
        </span>
        <span className={styles.proTipTitle}>Pro Tip</span>
        <span className={styles.proTipAiBadge}>AI</span>
      </div>
      <p className={styles.proTipText}>{tip}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface RecommendationsProps {
  partId: string;
  partName: string;
  partDescription: string;
}

export default function Recommendations({ partId, partName, partDescription }: RecommendationsProps) {
  const navigate = useNavigate();
  const { linkedParts, proTip, isLoading } = useRecommendations(partId, partName, partDescription);

  // Don't render anything if no data at all and not loading
  if (!isLoading && linkedParts.length === 0 && !proTip) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <div>
          <h2 className={styles.sectionTitle}>Recommended Parts</h2>
          <p className={styles.sectionSubtitle}>Parts commonly used together on the job</p>
        </div>
      </div>

      <ProTipCard tip={proTip} isLoading={isLoading} />

      {linkedParts.length > 0 && (
        <div className={styles.linkedList}>
          {linkedParts.map((lp) => (
            <LinkedPartCard
              key={lp.part.id}
              linkedPart={lp}
              onClick={() => navigate(`/part/${lp.part.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
