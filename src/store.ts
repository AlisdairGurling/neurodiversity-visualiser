import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { DOMAINS } from './domains';
import { currentSource } from './data/instruments-source';
import type { CognitionProfile, DomainId, Instrument } from './types';

const QUESTION_SELECTIONS_KEY = 'nv.questionSelections';

function loadQuestionSelections(): ReadonlySet<string> {
  try {
    const raw = localStorage.getItem(QUESTION_SELECTIONS_KEY);
    if (!raw) return new Set<string>();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set<string>(arr.filter((s) => typeof s === 'string'));
    return new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function persistQuestionSelections(set: ReadonlySet<string>) {
  localStorage.setItem(QUESTION_SELECTIONS_KEY, JSON.stringify([...set]));
}

const defaultProfile = Object.fromEntries(
  DOMAINS.map((d) => [d.id, 50]),
) as CognitionProfile;

export const [profile, setProfile] = createStore<CognitionProfile>(defaultProfile);

const [active, setActive] = createSignal<ReadonlySet<string>>(new Set());
export const activeInstruments = active;

// Currently-focused vertex on the radar — for the caption-area micro-description.
const [hoveredDomainSignal, setHoveredDomainSignal] = createSignal<DomainId | null>(null);
export const hoveredDomain = hoveredDomainSignal;
export function setHoveredDomain(d: DomainId | null) {
  setHoveredDomainSignal(d);
}

// User's preferred way of exploring — visual (default radar), word (auto-expanded
// text descriptions), or sound (spoken narration via SpeechSynthesis).
export type ExperienceMode = 'visual' | 'word' | 'sound';
const EXPERIENCE_KEY = 'nv.experienceMode';
function loadExperienceMode(): ExperienceMode {
  const v = localStorage.getItem(EXPERIENCE_KEY);
  return v === 'word' || v === 'sound' ? v : 'visual';
}
const [experience, setExperienceSignal] = createSignal<ExperienceMode>(loadExperienceMode());
export const experienceMode = experience;
export function setExperienceMode(m: ExperienceMode) {
  setExperienceSignal(m);
  localStorage.setItem(EXPERIENCE_KEY, m);
}

// Linear stage flow: Answer -> Reveal -> Extend. The canvas is deliberately
// hidden during Answer so users aren't tempted to shape their answers to make
// the shape prettier. Returning visitors resume where they left off.
export type Stage = 'answer' | 'reveal' | 'extend';
const STAGE_KEY = 'nv.stage';
function loadStage(): Stage {
  const v = localStorage.getItem(STAGE_KEY);
  return v === 'reveal' || v === 'extend' ? v : 'answer';
}
const [stageSignal, setStageSignal] = createSignal<Stage>(loadStage());
export const stage = stageSignal;
export function setStage(s: Stage) {
  setStageSignal(s);
  localStorage.setItem(STAGE_KEY, s);
}

const [questionSelections, setQuestionSelectionsSignal] = createSignal<ReadonlySet<string>>(
  loadQuestionSelections(),
);
export { questionSelections };

export function setQuestionSelections(next: ReadonlySet<string>) {
  setQuestionSelectionsSignal(next);
  persistQuestionSelections(next);
}

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

export function resetAll() {
  for (const d of DOMAINS) setProfile(d.id, 50);
  setActive(new Set<string>());
  setQuestionSelections(new Set<string>());
  setStage('answer');
}
