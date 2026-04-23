export type DomainId =
  | 'words'
  | 'space'
  | 'puzzles'
  | 'holding'
  | 'quick'
  | 'focus'
  | 'planning'
  | 'reading'
  | 'writing'
  | 'numbers';

export type Citation = {
  text: string;
  url?: string;
};

export type Domain = {
  id: DomainId;
  label: string;
  clinicalTerm: string;
  description: string;
  extendedDescription: string;
  citations: Citation[];
};

export type InstrumentCategory =
  | 'digital-prosthetic'
  | 'mind-body'
  | 'relational'
  | 'space-making';

export type ToolLinePosition = 'accepted' | 'contested' | 'stigmatised';

export type Instrument = {
  id: string;
  name: string;
  category: InstrumentCategory;
  description: string;
  lifts: Partial<Record<DomainId, number>>;
  toolLine: ToolLinePosition;
  externalLink?: string;
};

export type CognitionProfile = Record<DomainId, number>;
