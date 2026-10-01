import { describe, expect, it, vi } from 'vitest';
import { answerQuiz, loadProgress, progress, resetProgress, STORAGE_KEY } from '../src/state/progress.js';

describe('Finch progress state', () => {
  it('filters corrupt or stale stored lesson ids', () => {
    const storage = {
      getItem: () => JSON.stringify({ completed: ['signals', 'missing'], answers: {}, cardIndex: 99, streak: 2 }),
    };
    expect(loadProgress(storage)).toMatchObject({ completed: ['signals'], cardIndex: 3, streak: 2 });
  });

  it('marks a lesson complete only for correct answers', () => {
    resetProgress();
    expect(answerQuiz('signals', 'count.value')).toBe(false);
    expect(progress().completed).toEqual([]);
    expect(answerQuiz('signals', 'count()')).toBe(true);
    expect(progress().completed).toEqual(['signals']);
  });

  it('survives storage-denied browsers', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('denied');
      },
    });
    const { persistProgress } = await import('../src/state/progress.js');
    expect(persistProgress(globalThis.localStorage)).toBe(false);
    expect(STORAGE_KEY).toBe('what-starter-finch-v1');
    vi.unstubAllGlobals();
  });
});
