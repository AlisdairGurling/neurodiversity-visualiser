import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { DOMAINS } from './domains';
import { currentSource } from './data/instruments-source';
import type { CognitionProfile, DomainId, Instrument } from './types';

const defaultProfile = Object.fromEntries(
  DOMAINS.map((d) => [d.id, 50]),
) as CognitionProfile;

export const [profile, setProfile] = createStore<CognitionProfile>(defaultProfile);

const [active, setActive] = createSignal<ReadonlySet<string>>(new Set());
export const activeInstruments = active;

const [instruments, setInstruments] = createSignal<Instrument[]>([]);
const [instrumentsStatus, setInstrumentsStatus] = createSignal<
  'idle' | 'loading' | 'ready' | 'error'
>('idle');
const [instrumentsError, setInstrumentsError] = createSignal<string | null>(null);

export const instrumentsCache = instruments;
export const instrumentsLoadStatus = instrumentsStatus;
export const instrumentsLoadError = instrumentsError;

export async function loadInstruments() {
  setInstrumentsStatus('loading');
  setInstrumentsError(null);
  try {
    const list = await currentSource().getAll();
    setInstruments(list);
    setInstrumentsStatus('ready');
  } catch (err) {
    setInstrumentsError(err instanceof Error ? err.message : String(err));
    setInstrumentsStatus('error');
  }
}

export function toggleInstrument(id: string) {
  const next = new Set(active());
  if (next.has(id)) next.delete(id);
  else next.add(id);
  setActive(next);
}

export function activateInstrument(id: string) {
  const next = new Set(active());
  next.add(id);
  setActive(next);
}

export function setDomain(id: DomainId, value: number) {
  setProfile(id, Math.max(0, Math.min(100, Math.round(value))));
}

export function applyProfilePatch(patch: Partial<CognitionProfile>) {
  for (const [k, v] of Object.entries(patch)) {
    if (typeof v === 'number') setDomain(k as DomainId, v);
  }
}

export function setActiveInstruments(ids: Iterable<string>) {
  setActive(new Set(ids));
}

export function snapshotProfile(): CognitionProfile {
  return { ...profile } as CognitionProfile;
}
