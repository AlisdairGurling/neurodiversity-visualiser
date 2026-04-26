import type { DomainId } from './types';

export type QuestionOption = {
  id: string;
  label: string;
  lifts: Partial<Record<DomainId, number>>;
};

export type Question = {
  id: string;
  prompt: string;
  hint?: string;
  options: QuestionOption[];
};

export type QuestionCitation = {
  text: string;
  url?: string;
};

// Research the question set draws on. The framing is strengths-based first
// (Armstrong; Eide & Eide; Mottron) with effort areas surfaced gently rather
// than via deficit language (Crespi; White & Shah on ADHD divergent thinking).
export const QUESTION_CITATIONS: QuestionCitation[] = [
  {
    text: 'Armstrong, T. (2010). The Power of Neurodiversity: Discovering the Extraordinary Gifts of Autism, ADHD, Dyslexia, and Other Brain Differences. Da Capo Lifelong Books.',
  },
  {
    text: 'Eide, B. L., & Eide, F. F. (2011). The Dyslexic Advantage: Unlocking the Hidden Potential of the Dyslexic Brain. Hudson Street Press.',
  },
  {
    text: 'Mottron, L., Dawson, M., Soulières, I., Hubert, B., & Burack, J. (2006). Enhanced perceptual functioning in autism: An update, and eight principles of autistic perception. Journal of Autism and Developmental Disorders, 36(1), 27–43.',
    url: 'https://doi.org/10.1007/s10803-005-0040-7',
  },
  {
    text: 'White, H. A., & Shah, P. (2011). Creative style and achievement in adults with attention-deficit/hyperactivity disorder. Personality and Individual Differences, 50(5), 673–677.',
    url: 'https://doi.org/10.1016/j.paid.2010.12.015',
  },
  {
    text: 'Crespi, B. J. (2016). Autism as a disorder of high intelligence. Frontiers in Neuroscience, 10, 300.',
    url: 'https://doi.org/10.3389/fnins.2016.00300',
  },
  {
    text: 'Baron-Cohen, S. (2002). The extreme male brain theory of autism. Trends in Cognitive Sciences, 6(6), 248–254.',
    url: 'https://doi.org/10.1016/S1364-6613(02)01904-6',
  },
  {
    text: 'Logan, J. (2009). Dyslexic entrepreneurs: The incidence; their coping strategies and their business skills. Dyslexia, 15(4), 328–346.',
    url: 'https://doi.org/10.1002/dys.388',
  },
];

// Strengths-based, non-numeric prompts. Each option carries small lifts to one
// or more cognitive/functional domains. Multi-select; nothing is right or wrong.
// The set is sized to surface neurodivergent cognitive shapes — dyslexic
// narrative/spatial reasoning (Eide & Eide), autistic enhanced perception and
// systemising (Mottron, Baron-Cohen), ADHD divergent thinking and hyperfocus
// (White & Shah) — without using diagnostic labels.
export const QUESTIONS: Question[] = [
  {
    id: 'pulls',
    prompt: 'What pulls you in like a magnet?',
    hint: 'Pick everything that fits.',
    options: [
      { id: 'words', label: 'Word puzzles, conversations, ideas', lifts: { words: 18, puzzles: 6 } },
      { id: 'spaces', label: 'Spaces, maps, building things', lifts: { space: 20 } },
      { id: 'systems', label: 'Numbers, systems, logic', lifts: { puzzles: 16, numbers: 12 } },
      { id: 'stories', label: 'Stories, characters, what people are feeling', lifts: { words: 16, focus: 6 } },
      { id: 'patterns', label: 'Patterns hidden in messy data', lifts: { puzzles: 18, space: 6 } },
    ],
  },
  {
    id: 'time-disappeared',
    prompt: 'When did time last disappear on you?',
    hint: 'A flow state — choose any that ring true.',
    options: [
      { id: 'reading', label: 'Reading something compelling', lifts: { reading: 22, focus: 12 } },
      { id: 'designing', label: 'Drawing, designing, or making', lifts: { space: 18, focus: 8 } },
      { id: 'conversation', label: 'A conversation that mattered', lifts: { words: 18 } },
      { id: 'problem', label: 'Working out a hard problem', lifts: { puzzles: 22, focus: 16 } },
      { id: 'hands', label: 'Making something with my hands', lifts: { space: 14, focus: 8 } },
    ],
  },
  {
    id: 'memory',
    prompt: 'Where does your memory feel sharp?',
    options: [
      { id: 'faces', label: 'Faces and places', lifts: { space: 16, holding: 10 } },
      { id: 'lines', label: 'Lines from books, songs, films', lifts: { words: 18, holding: 12 } },
      { id: 'procedures', label: 'How to do something, step by step', lifts: { planning: 16, holding: 12 } },
      { id: 'numbers', label: 'Numbers, dates, prices', lifts: { numbers: 18, holding: 14 } },
      { id: 'relations', label: 'Patterns and how things relate', lifts: { puzzles: 18 } },
    ],
  },
  {
    id: 'helping',
    prompt: 'What do other people often ask for your help with?',
    options: [
      { id: 'wordy', label: 'Writing emails, articles, anything wordy', lifts: { writing: 22, words: 16 } },
      { id: 'maths', label: 'Maths, calculations, spreadsheets', lifts: { numbers: 24 } },
      { id: 'critique', label: 'Spotting what is wrong with their plan', lifts: { puzzles: 20, planning: 8 } },
      { id: 'organising', label: 'Organising a project or schedule', lifts: { planning: 24 } },
      { id: 'visual', label: 'Designing a space or visual', lifts: { space: 22 } },
    ],
  },
  {
    id: 'flow',
    prompt: 'What does flow feel like for you?',
    options: [
      { id: 'words-fast', label: 'Words coming faster than I can catch them', lifts: { words: 20, writing: 14 } },
      { id: 'see-answer', label: 'Seeing the answer before I have worked it out', lifts: { puzzles: 20, quick: 12 } },
      { id: 'all-in-mind', label: 'Holding it all in mind without notes', lifts: { holding: 22, planning: 8 } },
      { id: 'smooth-switch', label: 'Moving smoothly between tasks', lifts: { planning: 20, focus: 12 } },
      { id: 'hands-lead', label: 'Letting my hands lead the thinking', lifts: { space: 16 } },
    ],
  },
  {
    id: 'noticing',
    prompt: 'What do you notice that other people seem to miss?',
    hint: 'Enhanced perception is a real strength — name yours.',
    options: [
      { id: 'mood', label: 'Subtle shifts in mood or tone', lifts: { words: 14, focus: 8 } },
      { id: 'pattern-systems', label: 'Patterns underneath a system', lifts: { puzzles: 20, space: 8 } },
      { id: 'inconsistency', label: 'Inconsistencies in numbers or text', lifts: { numbers: 14, words: 8 } },
      { id: 'detail', label: 'Tiny visual details', lifts: { space: 18, focus: 8 } },
      { id: 'better-way', label: 'A better way to do something', lifts: { puzzles: 14, planning: 14 } },
    ],
  },
  {
    id: 'coming-back',
    prompt: 'Which kind of work do you keep coming back to?',
    options: [
      { id: 'deep', label: 'Solo, deep, methodical work', lifts: { focus: 18, planning: 10 } },
      { id: 'lively', label: 'Fast back-and-forth with people', lifts: { words: 16, quick: 16 } },
      { id: 'invent', label: 'Inventing new approaches', lifts: { puzzles: 20 } },
      { id: 'improve', label: 'Improving an existing system', lifts: { planning: 18, puzzles: 8 } },
    ],
  },
  {
    id: 'hyperfocus',
    prompt: 'What do you do for hours when no one is asking?',
    hint: 'Where intrinsic interest pulls you deep.',
    options: [
      { id: 'one-topic', label: 'Lose myself in a single topic, deeper than seems useful', lifts: { focus: 16, holding: 8 } },
      { id: 'projects', label: 'Plan and re-plan projects I might never start', lifts: { planning: 14, puzzles: 10 } },
      { id: 'wide-reading', label: 'Read across many fields, sideways from the day', lifts: { reading: 18, words: 10 } },
      { id: 'making', label: 'Build, draw, design something for the joy of it', lifts: { space: 18, focus: 6 } },
      { id: 'writing-out', label: 'Write, journal, work ideas out in text', lifts: { writing: 18, words: 12 } },
      { id: 'abstract', label: 'Play with numbers, codes, music, abstract systems', lifts: { numbers: 14, puzzles: 14 } },
    ],
  },
  {
    id: 'connections',
    prompt: 'How do you make connections between unrelated things?',
    hint: 'Lateral thinking has many shapes.',
    options: [
      { id: 'metaphors', label: 'Through metaphors and stories that bridge fields', lifts: { words: 14, puzzles: 10 } },
      { id: 'visual-parallels', label: 'I see visual or spatial parallels', lifts: { space: 16 } },
      { id: 'system-pattern', label: 'I notice the same pattern in different systems', lifts: { puzzles: 18 } },
      { id: 'echoes', label: 'I feel echoes of past situations in new ones', lifts: { holding: 14, planning: 8 } },
      { id: 'leaps', label: 'I make leaps that surprise even me', lifts: { puzzles: 14, quick: 10 } },
    ],
  },
  {
    id: 'reading-good-day',
    prompt: 'What does reading look like for you on a good day?',
    options: [
      { id: 'devour', label: 'I devour long-form text and remember it', lifts: { reading: 20, holding: 12 } },
      { id: 'skim', label: 'I read fast and skim well', lifts: { reading: 16, quick: 14 } },
      { id: 'ear', label: 'My ear is sharper than my eye — audiobooks unlock more', lifts: { words: 16 } },
      { id: 'close', label: 'I read closely; I notice every word', lifts: { reading: 14, focus: 14 } },
      { id: 'sketch', label: 'I sketch or note as I read; the pen carries the meaning', lifts: { space: 12, reading: 8 } },
    ],
  },
  {
    id: 'writing-easiest',
    prompt: 'When does writing feel easiest?',
    options: [
      { id: 'capture', label: 'When I am chasing a thought I want to capture', lifts: { writing: 22, words: 16 } },
      { id: 'voice', label: 'When I can speak it out and tidy later', lifts: { writing: 14, words: 14 } },
      { id: 'scaffold', label: 'When someone hands me a clear structure', lifts: { writing: 14, planning: 10 } },
      { id: 'sketch-first', label: 'When I can sketch or mind-map before words', lifts: { writing: 14, space: 14 } },
    ],
  },
  {
    id: 'pace',
    prompt: 'What does your pace look like in your work?',
    options: [
      { id: 'familiar-fast', label: 'Fastest when familiar; takes time when new', lifts: { quick: 18, planning: 8 } },
      { id: 'bursts', label: 'I think in bursts — fast, then a long pause', lifts: { quick: 14, focus: 8 } },
      { id: 'slow-right', label: 'I prefer to be slow and right', lifts: { focus: 14, planning: 12 } },
      { id: 'aloud', label: 'I think fastest by talking aloud', lifts: { words: 14, quick: 10 } },
    ],
  },
  {
    id: 'sensory',
    prompt: 'How does the world come at you through your senses?',
    hint: 'Sensory profile shapes when and how you can think.',
    options: [
      { id: 'quiet-best', label: 'I do my best work somewhere quiet', lifts: { focus: 14 } },
      { id: 'movement-helps', label: 'I think faster when I can move', lifts: { focus: 12, quick: 8 } },
      { id: 'fine-detail', label: 'I notice fine sensory detail others miss', lifts: { space: 14, focus: 6 } },
      { id: 'crowded-drains', label: 'Loud or crowded settings drain me quickly', lifts: { focus: -10 } },
      { id: 'social-cues', label: 'I pick up on subtle social cues', lifts: { words: 12 } },
    ],
  },
  {
    id: 'energy',
    prompt: 'What tends to take more energy than people might guess?',
    hint: 'Knowing where you ration energy is a strength too.',
    options: [
      { id: 'dense-text', label: 'Reading dense or long text', lifts: { reading: -16 } },
      { id: 'many-threads', label: 'Holding many threads at once', lifts: { holding: -16 } },
      { id: 'verbal-instructions', label: 'Following long verbal instructions', lifts: { words: -10, holding: -10 } },
      { id: 'first-drafts', label: 'Writing first drafts', lifts: { writing: -16 } },
      { id: 'mental-arithmetic', label: 'Mental arithmetic on the fly', lifts: { numbers: -14, quick: -8 } },
      { id: 'still-detail', label: 'Sitting still through repetitive detail', lifts: { focus: -16 } },
      { id: 'handwriting', label: 'Handwriting at length', lifts: { writing: -14 } },
      { id: 'unstructured-time', label: 'Open-ended, unstructured time', lifts: { planning: -14, focus: -8 } },
    ],
  },
];
