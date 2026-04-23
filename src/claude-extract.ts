import { DOMAINS } from './domains';
import type { CognitionProfile, DomainId } from './types';

const API_KEY_STORAGE = 'nv.anthropic.apiKey';

export function getStoredApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) ?? '';
}

export function setStoredApiKey(key: string) {
  if (key) localStorage.setItem(API_KEY_STORAGE, key);
  else localStorage.removeItem(API_KEY_STORAGE);
}

function buildPrompt(description: string): string {
  const domainLines = DOMAINS.map(
    (d) => `- ${d.id} — ${d.label} (${d.clinicalTerm}): ${d.description}`,
  ).join('\n');
  return `You are translating a description of a neurodivergent learner's cognition into a strengths-based profile on a 0–100 scale, where 50 is "average for their age" and values above 50 are relative strengths.

Do not invent information. If a domain isn't mentioned, omit it from the output.

Domains:
${domainLines}

Description:
"""
${description}
"""

Return ONLY a JSON object whose keys are the domain ids above (omit any not mentioned) and whose values are integers 0–100. Example shape: {"words": 72, "focus": 35}. No prose, no markdown.`;
}

export type ClaudeExtractResult = {
  scores: Partial<CognitionProfile>;
  rawText: string;
};

export async function extractFromDescription(
  apiKey: string,
  description: string,
): Promise<ClaudeExtractResult> {
  if (!apiKey) throw new Error('Missing API key');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: buildPrompt(description) }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Claude API error ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const textBlock = data.content?.find((b) => b.type === 'text');
  const rawText = textBlock?.text ?? '';
  const scores = parseScoreJson(rawText);
  return { scores, rawText };
}

const VALID_IDS = new Set<DomainId>(DOMAINS.map((d) => d.id));

function parseScoreJson(text: string): Partial<CognitionProfile> {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return {};
  try {
    const obj = JSON.parse(match[0]) as Record<string, unknown>;
    const scores: Partial<CognitionProfile> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (VALID_IDS.has(k as DomainId) && typeof v === 'number' && Number.isFinite(v)) {
        scores[k as DomainId] = Math.max(0, Math.min(100, Math.round(v)));
      }
    }
    return scores;
  } catch {
    return {};
  }
}
