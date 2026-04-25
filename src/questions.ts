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

// Strengths-based, non-numeric prompts. Each option carries small lifts to one
// or more cognitive/functional domains. Multi-select; nothing is right or wrong.
// The final question gently surfaces effort areas via small negative lifts so the
// shape can have troughs as well as peaks without using deficit language.
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
    hint: 'A different way to ask about strengths.',
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
    id: 'energy',
    prompt: 'What tends to take more energy than people might guess?',
    hint: 'Knowing where you ration your energy is a strength too.',
    options: [
      { id: 'dense-text', label: 'Reading dense or long text', lifts: { reading: -16 } },
      { id: 'many-threads', label: 'Holding many threads at once', lifts: { holding: -16 } },
      { id: 'verbal-instructions', label: 'Following long verbal instructions', lifts: { words: -10, holding: -10 } },
      { id: 'first-drafts', label: 'Writing first drafts', lifts: { writing: -16 } },
      { id: 'mental-arithmetic', label: 'Mental arithmetic on the fly', lifts: { numbers: -14, quick: -8 } },
      { id: 'still-detail', label: 'Sitting still through repetitive detail', lifts: { focus: -16 } },
      { id: 'handwriting', label: 'Handwriting at length', lifts: { writing: -14 } },
    ],
  },
];
