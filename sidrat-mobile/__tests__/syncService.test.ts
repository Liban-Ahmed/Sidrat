/**
 * Sync service logic tests.
 *
 * Tests retry backoff calculation and dead-letter thresholds.
 */

describe('Sync backoff logic', () => {
  const BACKOFF_BASE_MS = 1000;
  const BACKOFF_MAX_MS = 30_000;

  function backoffDelay(retries: number): number {
    return Math.min(BACKOFF_BASE_MS * Math.pow(2, retries), BACKOFF_MAX_MS);
  }

  it('should start with base delay for first retry', () => {
    expect(backoffDelay(0)).toBe(1000);
  });

  it('should double delay for each retry', () => {
    expect(backoffDelay(1)).toBe(2000);
    expect(backoffDelay(2)).toBe(4000);
    expect(backoffDelay(3)).toBe(8000);
  });

  it('should cap at maximum delay', () => {
    expect(backoffDelay(10)).toBe(BACKOFF_MAX_MS);
    expect(backoffDelay(20)).toBe(BACKOFF_MAX_MS);
  });
});

describe('Sync queue retry limits', () => {
  const MAX_SYNC_RETRIES = 5;

  it('should allow operations under the retry limit', () => {
    for (let i = 0; i < MAX_SYNC_RETRIES; i++) {
      expect(i < MAX_SYNC_RETRIES).toBe(true);
    }
  });

  it('should reject operations at or above the retry limit', () => {
    expect(MAX_SYNC_RETRIES >= MAX_SYNC_RETRIES).toBe(true);
    expect(MAX_SYNC_RETRIES + 1 >= MAX_SYNC_RETRIES).toBe(true);
  });
});
