import { describe, expect, it } from 'vitest';
import { formatDate, formatTime } from './index';

describe('Date and Time Formatting', () => {
  describe('formatDate', () => {
    it('should format a valid date string', () => {
      expect(formatDate('2024-03-15')).toBe('15/03/2024');
    });

    it('should format a Date object', () => {
      const date = new Date('2024-03-15');
      expect(formatDate(date)).toBe('15/03/2024');
    });

    it('should handle undefined input', () => {
      expect(formatDate(undefined)).toBe('No date found!');
    });

    it('should handle invalid date input', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('formatTime', () => {
    it('should format morning time correctly', () => {
      expect(formatTime('2024-03-15T09:30:00')).toBe('9:30 AM');
    });

    it('should format afternoon time correctly', () => {
      expect(formatTime('2024-03-15T14:30:00')).toBe('2:30 PM');
    });

    it('should handle midnight (12 AM)', () => {
      expect(formatTime('2024-03-15T00:00:00')).toBe('12:00 AM');
    });

    it('should handle noon (12 PM)', () => {
      expect(formatTime('2024-03-15T12:00:00')).toBe('12:00 PM');
    });

    it('should pad minutes with zero when needed', () => {
      expect(formatTime('2024-03-15T09:05:00')).toBe('9:05 AM');
    });
  });
});

