/**
 * Config constants tests
 */

import { getAgeGroup } from '../src/constants/config';

describe('getAgeGroup', () => {
  it('returns toddler for ages 2-4', () => {
    expect(getAgeGroup(2)).toBe('toddler');
    expect(getAgeGroup(3)).toBe('toddler');
    expect(getAgeGroup(4)).toBe('toddler');
  });

  it('returns early for ages 5-7', () => {
    expect(getAgeGroup(5)).toBe('early');
    expect(getAgeGroup(6)).toBe('early');
    expect(getAgeGroup(7)).toBe('early');
  });

  it('returns middle for ages 8-10', () => {
    expect(getAgeGroup(8)).toBe('middle');
    expect(getAgeGroup(10)).toBe('middle');
  });

  it('returns preteen for ages 11-14', () => {
    expect(getAgeGroup(11)).toBe('preteen');
    expect(getAgeGroup(14)).toBe('preteen');
  });
});
