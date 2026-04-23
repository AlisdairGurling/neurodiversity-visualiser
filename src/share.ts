import { DOMAINS } from './domains';
import type { CognitionProfile, DomainId } from './types';

const DOMAIN_ORDER: DomainId[] = DOMAINS.map((d) => d.id);

export function encodeShare(profile: CognitionProfile, active: Iterable<string>): string {
  const scores = DOMAIN_ORDER.map((id) => profile[id] ?? 0).join(',');
  const ids = [...active].join(',');
  const params = new URLSearchParams();
  params.set('p', scores);
  if (ids) params.set('i', ids);
  return params.toString();
}

export function decodeShare(
  hash: string,
): { profile: Partial<CognitionProfile>; active: string[] } | null {
  const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!cleaned) return null;
  const params = new URLSearchParams(cleaned);
  const p = params.get('p');
  const i = params.get('i');
  const profile: Partial<CognitionProfile> = {};
  if (p) {
    const parts = p.split(',').map((v) => parseInt(v, 10));
    DOMAIN_ORDER.forEach((id, idx) => {
      const v = parts[idx];
      if (Number.isFinite(v)) profile[id] = Math.max(0, Math.min(100, v));
    });
  }
  const active = i ? i.split(',').filter(Boolean) : [];
  return { profile, active };
}

export function buildShareUrl(profile: CognitionProfile, active: Iterable<string>): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#${encodeShare(profile, active)}`;
}
