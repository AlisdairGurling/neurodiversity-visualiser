import type { Domain } from './types';

export const DOMAINS: Domain[] = [
  {
    id: 'words',
    label: 'Words & language',
    clinicalTerm: 'Verbal Comprehension (WISC-V)',
    description: 'Thinking in words — understanding, reasoning with, and expressing ideas through language.',
    extendedDescription:
      'Draws on crystallised knowledge of word meanings, relations between concepts, and verbal problem-solving. A relative strength here often shows up as vivid conversation, strong argument, or metaphor-making; a relative trough may show up as slower retrieval of specific words rather than any lack of thought.',
    citations: [
      { text: 'Wechsler, D. (2014). WISC-V Technical and Interpretive Manual. Pearson.' },
      {
        text: 'Cattell, R. B. (1963). Theory of fluid and crystallized intelligence. Journal of Educational Psychology, 54(1), 1–22.',
        url: 'https://doi.org/10.1037/h0046743',
      },
    ],
  },
  {
    id: 'space',
    label: 'Space & pattern',
    clinicalTerm: 'Visual-Spatial (WISC-V)',
    description: 'Thinking in images and patterns — how things fit, move, and relate in space.',
    extendedDescription:
      'Mental imagery, visualisation, and part-whole relations. Strengths here often support design, engineering, map-reading, and certain kinds of mathematics that are really about configuration rather than calculation.',
    citations: [
      { text: 'Wechsler, D. (2014). WISC-V Technical and Interpretive Manual. Pearson.' },
      {
        text: 'Lohman, D. F. (1996). Spatial ability and g. In Dennis & Tapsfield (Eds.), Human abilities: Their nature and measurement. Lawrence Erlbaum.',
      },
    ],
  },
  {
    id: 'puzzles',
    label: 'Puzzles & reasoning',
    clinicalTerm: 'Fluid Reasoning (WISC-V)',
    description: 'Meeting unfamiliar problems and working out the shape of a solution.',
    extendedDescription:
      'Inductive and deductive inference on new material — making sense of patterns you have not been taught. Often relatively preserved in neurodivergent learners even when language or speed are costly.',
    citations: [
      {
        text: 'Cattell, R. B. (1963). Theory of fluid and crystallized intelligence. Journal of Educational Psychology, 54(1), 1–22.',
        url: 'https://doi.org/10.1037/h0046743',
      },
      {
        text: 'Blair, C. (2006). How similar are fluid cognition and general intelligence? Behavioral and Brain Sciences, 29(2), 109–125.',
        url: 'https://doi.org/10.1017/S0140525X06009034',
      },
    ],
  },
  {
    id: 'holding',
    label: 'Holding in mind',
    clinicalTerm: 'Working Memory (WISC-V)',
    description: 'Keeping ideas live and available while you work with them.',
    extendedDescription:
      'Maintaining and manipulating information over short time scales. A central bottleneck in many neurodivergent profiles — and where external scaffolds (notes, lists, dictation) pay off most quickly.',
    citations: [
      {
        text: 'Baddeley, A. (2012). Working memory: Theories, models, and controversies. Annual Review of Psychology, 63, 1–29.',
        url: 'https://doi.org/10.1146/annurev-psych-120710-100422',
      },
    ],
  },
  {
    id: 'quick',
    label: 'Quick thinking',
    clinicalTerm: 'Processing Speed (WISC-V)',
    description: 'How swiftly familiar thought becomes action.',
    extendedDescription:
      'Speed of routine cognitive operations on over-learned material. A lower score does not indicate a slower mind — it often means a different route to the same destination.',
    citations: [
      {
        text: 'Kail, R., & Salthouse, T. A. (1994). Processing speed as a mental capacity. Acta Psychologica, 86(2–3), 199–225.',
        url: 'https://doi.org/10.1016/0001-6918(94)90002-7',
      },
    ],
  },
  {
    id: 'focus',
    label: 'Staying with it',
    clinicalTerm: 'Sustained Attention',
    description: 'Keeping your attention where you want it to be.',
    extendedDescription:
      'Maintaining attention over time in the face of competing pulls. Often measured via continuous performance tasks; observation and interview are at least as informative in real settings.',
    citations: [
      {
        text: 'Sarter, M., Givens, B., & Bruno, J. P. (2001). The cognitive neuroscience of sustained attention: Where top-down meets bottom-up. Brain Research Reviews, 35(2), 146–160.',
        url: 'https://doi.org/10.1016/S0165-0173(01)00044-3',
      },
    ],
  },
  {
    id: 'planning',
    label: 'Planning & self-steering',
    clinicalTerm: 'Executive Function',
    description: 'Choosing, sequencing, adjusting — steering your own cognition.',
    extendedDescription:
      'Goal-directed cognition: planning, inhibition, cognitive flexibility, and monitoring. Executive functions develop through the mid-twenties and are highly responsive to external scaffolding.',
    citations: [
      {
        text: 'Diamond, A. (2013). Executive functions. Annual Review of Psychology, 64, 135–168.',
        url: 'https://doi.org/10.1146/annurev-psych-113011-143750',
      },
    ],
  },
  {
    id: 'reading',
    label: 'Reading',
    clinicalTerm: 'WIAT Reading',
    description: 'Meeting the written word.',
    extendedDescription:
      'From decoding to comprehension. Relative troughs may reflect dyslexia; audiobooks and text-to-speech can reorder the dependencies of literacy.',
    citations: [
      {
        text: 'Snowling, M. J., & Hulme, C. (2011). Evidence-based interventions for reading and language difficulties: Creating a virtuous circle. British Journal of Educational Psychology, 81(1), 1–23.',
        url: 'https://doi.org/10.1111/j.2044-8279.2010.02014.x',
      },
    ],
  },
  {
    id: 'writing',
    label: 'Writing',
    clinicalTerm: 'WIAT Written Expression',
    description: 'Putting thought into written form, including handwriting.',
    extendedDescription:
      'Transcription (handwriting, spelling) is sometimes the bottleneck; composition may be strong but blocked by the physical act. Speech-to-text and structured templates can unpick these two processes.',
    citations: [
      {
        text: 'Graham, S., & Perin, D. (2007). Writing next: Effective strategies to improve writing of adolescents in middle and high schools. Alliance for Excellent Education.',
      },
      {
        text: 'Berninger, V. W., & Winn, W. D. (2006). Implications of advancements in brain research and technology for writing development. In MacArthur, Graham, & Fitzgerald (Eds.), Handbook of Writing Research. Guilford.',
      },
    ],
  },
  {
    id: 'numbers',
    label: 'Numbers',
    clinicalTerm: 'WIAT Mathematics',
    description: 'Working with quantities, relations, and operations.',
    extendedDescription:
      'From numerosity to numerical operations and mathematical reasoning. Dyscalculia affects a distinct circuitry around number sense; calculators and visual aids re-route cognitive load.',
    citations: [
      {
        text: 'Butterworth, B. (2010). Foundational numerical capacities and the origins of dyscalculia. Trends in Cognitive Sciences, 14(12), 534–541.',
        url: 'https://doi.org/10.1016/j.tics.2010.09.007',
      },
    ],
  },
];
