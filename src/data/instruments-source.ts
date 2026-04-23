import { INSTRUMENTS } from '../instruments';
import type { Instrument } from '../types';

export interface InstrumentSource {
  getAll(): Promise<Instrument[]>;
}

export const localSource: InstrumentSource = {
  async getAll() {
    return INSTRUMENTS;
  },
};

// Adapter for a future HTTP-backed source (e.g. a neurodiversity.tools API).
// The remote shape is intentionally the same as our local Instrument type so
// callers don't need to change; swap the adapter at boot.
export function createHttpSource(url: string): InstrumentSource {
  return {
    async getAll() {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`Failed to load instruments (${res.status})`);
      return (await res.json()) as Instrument[];
    },
  };
}

let source: InstrumentSource = localSource;
export function setInstrumentSource(s: InstrumentSource) {
  source = s;
}
export function currentSource(): InstrumentSource {
  return source;
}
