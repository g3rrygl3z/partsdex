import type { Vertical } from '../types';

/**
 * Returns the Tailwind badge class for a given vertical.
 */
export function getVerticalBadgeClass(vertical: Vertical | string): string {
  switch (vertical) {
    case 'plumbing':
      return 'badge-plumbing';
    case 'hvac':
      return 'badge-hvac';
    case 'boiler-heating':
      return 'badge-boiler-heating';
    default:
      return 'bg-slate-700 text-slate-300';
  }
}

/**
 * Returns the card background class for a vertical.
 */
export function getVerticalCardClass(vertical: Vertical | string): string {
  switch (vertical) {
    case 'plumbing':
      return 'card-plumbing';
    case 'hvac':
      return 'card-hvac';
    case 'boiler-heating':
      return 'card-boiler-heating';
    default:
      return 'bg-slate-800 border border-slate-700';
  }
}

/**
 * Returns a display-friendly name for a vertical.
 */
export function getVerticalDisplayName(vertical: Vertical | string): string {
  switch (vertical) {
    case 'plumbing':
      return 'Plumbing';
    case 'hvac':
      return 'HVAC';
    case 'boiler-heating':
      return 'Boiler & Heating';
    default:
      return String(vertical);
  }
}

/**
 * Returns the accent color hex for a vertical.
 */
export function getVerticalColor(vertical: Vertical | string): string {
  switch (vertical) {
    case 'plumbing':
      return '#3b82f6';
    case 'hvac':
      return '#10b981';
    case 'boiler-heating':
      return '#f59e0b';
    default:
      return '#64748b';
  }
}
