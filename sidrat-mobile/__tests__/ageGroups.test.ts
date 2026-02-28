/**
 * Curriculum types + age group tests.
 */

import { ageToGroup, AGE_GROUP_RANGES } from '../src/types/curriculum';
import type { AgeGroup } from '../src/types/curriculum';

describe('ageToGroup', () => {
  it('should return toddler for ages 2-4', () => {
    expect(ageToGroup(2)).toBe('toddler');
    expect(ageToGroup(3)).toBe('toddler');
    expect(ageToGroup(4)).toBe('toddler');
  });

  it('should return early for ages 5-7', () => {
    expect(ageToGroup(5)).toBe('early');
    expect(ageToGroup(6)).toBe('early');
    expect(ageToGroup(7)).toBe('early');
  });

  it('should return middle for ages 8-10', () => {
    expect(ageToGroup(8)).toBe('middle');
    expect(ageToGroup(9)).toBe('middle');
    expect(ageToGroup(10)).toBe('middle');
  });

  it('should return preteen for ages 11-14', () => {
    expect(ageToGroup(11)).toBe('preteen');
    expect(ageToGroup(12)).toBe('preteen');
    expect(ageToGroup(13)).toBe('preteen');
    expect(ageToGroup(14)).toBe('preteen');
  });

  it('should return toddler for ages below 2', () => {
    expect(ageToGroup(1)).toBe('toddler');
    expect(ageToGroup(0)).toBe('toddler');
  });

  it('should return preteen for ages above 14', () => {
    expect(ageToGroup(15)).toBe('preteen');
    expect(ageToGroup(18)).toBe('preteen');
  });
});

describe('AGE_GROUP_RANGES', () => {
  it('should have all 4 age groups', () => {
    const groups: AgeGroup[] = ['toddler', 'early', 'middle', 'preteen'];
    for (const g of groups) {
      expect(AGE_GROUP_RANGES[g]).toBeDefined();
      expect(AGE_GROUP_RANGES[g].label).toBeTruthy();
      expect(AGE_GROUP_RANGES[g].min).toBeLessThanOrEqual(AGE_GROUP_RANGES[g].max);
    }
  });

  it('age ranges should be contiguous without gaps', () => {
    expect(AGE_GROUP_RANGES.toddler.max + 1).toBe(AGE_GROUP_RANGES.early.min);
    expect(AGE_GROUP_RANGES.early.max + 1).toBe(AGE_GROUP_RANGES.middle.min);
    expect(AGE_GROUP_RANGES.middle.max + 1).toBe(AGE_GROUP_RANGES.preteen.min);
  });
});
