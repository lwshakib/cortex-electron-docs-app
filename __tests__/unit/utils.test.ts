import { describe, it, expect } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('utils/cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('p-4', 'bg-red-500')).toBe('p-4 bg-red-500');
  });

  it('should handle conditional class names', () => {
    expect(cn('p-4', true && 'bg-red-500', false && 'text-white')).toBe(
      'p-4 bg-red-500',
    );
  });

  it('should handle tailwind conflict resolution', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });
});
