import type { ReviewItem } from '../hooks/useReviewQueue';

/**
 * Groups a pre-sorted review queue by urgency tier, preserving order.
 * Returns an array of sections, each with an urgency label and its items.
 */
export function groupReviewsByUrgency(
  queue: ReviewItem[],
): { urgency: ReviewItem['urgency']; items: ReviewItem[] }[] {
  const groups: { urgency: ReviewItem['urgency']; items: ReviewItem[] }[] = [];
  let current: (typeof groups)[number] | null = null;

  for (const item of queue) {
    if (!current || current.urgency !== item.urgency) {
      current = { urgency: item.urgency, items: [] };
      groups.push(current);
    }
    current.items.push(item);
  }

  return groups;
}
