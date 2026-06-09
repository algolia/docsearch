import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useRelativeFormattedDate } from '../useRelativeFormattedDate';

const NOW = new Date('2024-01-15T12:00:00.000Z').getTime();

describe('useRelativeFormattedDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns days when elapsed time is at least one day', () => {
    const start = new Date(NOW - 3 * 24 * 60 * 60 * 1000);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('3 days ago');
  });

  it('returns hours when elapsed time is at least one hour but less than a day', () => {
    const start = new Date(NOW - 5 * 60 * 60 * 1000);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('5 hours ago');
  });

  it('returns minutes when elapsed time is at least one minute but less than an hour', () => {
    const start = new Date(NOW - 42 * 60 * 1000);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('42 minutes ago');
  });

  it('returns seconds when elapsed time is at least one second but less than a minute', () => {
    const start = new Date(NOW - 30 * 1000);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('30 seconds ago');
  });

  it('falls back to seconds for sub-second differences', () => {
    const start = new Date(NOW - 500);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('0 seconds ago');
  });

  it('returns zero seconds when start and end are equal', () => {
    const start = new Date(NOW);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('0 seconds ago');
  });

  it('floors the elapsed value to the unit', () => {
    // 2 hours and 59 minutes -> 2 hours
    const start = new Date(NOW - (2 * 60 * 60 * 1000 + 59 * 60 * 1000));
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('2 hours ago');
  });

  it('uses the largest matching unit at boundaries', () => {
    // Exactly one day
    const start = new Date(NOW - 24 * 60 * 60 * 1000);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('1 day ago');
  });

  it('uses the absolute value when end is before start (future dates)', () => {
    const start = new Date(NOW + 3 * 60 * 60 * 1000);
    const { result } = renderHook(() => useRelativeFormattedDate(start));

    expect(result.current).toEqual('3 hours ago');
  });

  it('respects an explicit end value over Date.now()', () => {
    const start = new Date('2024-01-01T00:00:00.000Z');
    const end = new Date('2024-01-08T00:00:00.000Z').getTime();
    const { result } = renderHook(() => useRelativeFormattedDate(start, end));

    expect(result.current).toEqual('7 days ago');
  });

  it('returns a stable reference when inputs do not change', () => {
    const start = new Date(NOW - 60 * 60 * 1000);
    const end = NOW;
    const { result, rerender } = renderHook(() => useRelativeFormattedDate(start, end));

    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });

  it('does not recompute when inputs change', () => {
    const end = NOW;
    const { result, rerender } = renderHook(({ start }) => useRelativeFormattedDate(start, end), {
      initialProps: { start: new Date(NOW - 60 * 60 * 1000) },
    });

    const first = result.current;

    expect(result.current).toEqual('1 hour ago');

    rerender({ start: new Date(NOW - 2 * 24 * 60 * 60 * 1000) });

    expect(result.current).toBe(first);
    expect(result.current).toEqual('1 hour ago');
  });

  it('does not recompute when Date.now changes', () => {
    const start = new Date(NOW - 60 * 60 * 1000);
    const { result, rerender } = renderHook(() => useRelativeFormattedDate(start));

    const first = result.current;

    vi.setSystemTime(NOW + 2 * 24 * 60 * 60 * 1000);
    rerender();

    expect(result.current).toBe(first);
    expect(result.current).toEqual('1 hour ago');
  });
});
