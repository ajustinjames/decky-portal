import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useAutoHide } from './use-auto-hide';

describe('useAutoHide', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts expanded', () => {
    const { result } = renderHook(() => useAutoHide());

    expect(result.current.expanded).toBe(true);
  });

  it('collapses after default timeout (3000ms)', () => {
    const { result } = renderHook(() => useAutoHide());

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.expanded).toBe(false);
  });

  it('collapses after custom timeout', () => {
    const { result } = renderHook(() => useAutoHide(1000));

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current.expanded).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.expanded).toBe(false);
  });

  it('resets timer on onInteraction()', () => {
    const { result } = renderHook(() => useAutoHide());

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.expanded).toBe(true);

    act(() => {
      result.current.onInteraction();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.expanded).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.expanded).toBe(false);
  });

  it('show() expands and resets timer', () => {
    const { result } = renderHook(() => useAutoHide());

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.expanded).toBe(false);

    act(() => {
      result.current.show();
    });
    expect(result.current.expanded).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(result.current.expanded).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.expanded).toBe(false);
  });

  it('cleans up timeout on unmount', () => {
    const { result, unmount } = renderHook(() => useAutoHide());

    unmount();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should still be true since the timer was cleaned up before it could fire
    expect(result.current.expanded).toBe(true);
  });
});
