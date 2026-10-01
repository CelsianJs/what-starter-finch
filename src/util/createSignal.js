import { signal } from 'what-framework';

export function createSignal(initial) {
  return signal(initial);
}
