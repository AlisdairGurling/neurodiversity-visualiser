# Vertex-to-WISC/CHC mapping (design log)

An evidence-grounding audit of the ten cognitive/functional vertices used in the
visualiser. Two frameworks anchor the audit:

- **Wechsler Intelligence Scale for Children, 5th ed. (WISC-V)** — the most
  common IQ battery used in Educational Psychologist reports, with primary
  indices Verbal Comprehension (VCI), Visual-Spatial (VSI), Fluid Reasoning
  (FRI), Working Memory (WMI) and Processing Speed (PSI). Adult analogue:
  WAIS-IV. Achievement companion: **WIAT-III/IV** (reading, writing, mathematics,
  oral language).
- **Cattell-Horn-Carroll (CHC) theory** — the dominant contemporary framework
  for cognitive abilities. Names broad abilities (Gc, Gf, Gv, Gsm, Glr, Gs,
  Ga, Grw, Gq, Gkn) and narrow abilities within each.

## Design stance

The visualiser deliberately holds a *strategic fogginess* between adjacent
constructs. It is not a psychometric ranking; it is a shape for actionable
self-understanding. The mapping below identifies where a vertex is well-
anchored, where it bundles adjacent constructs on purpose, and where the
underlying construct-space is genuinely under-served by WISC-V + WIAT alone.

## Mapping table

| # | Vertex (visualiser) | WISC-V / WIAT anchor | CHC broad | CHC narrow (representative) | Coverage & gaps |
|---|---------------------|----------------------|-----------|-----------------------------|-----------------|
| 0 | **Reading** | WIAT Reading composites (Word Reading, Reading Comprehension, Pseudoword Decoding) | **Grw** | Reading Decoding (RD), Reading Comprehension (RC) | *Well-anchored to WIAT.* Bundles decoding and comprehension deliberately; strengths-based framing is agnostic. Gap: does not distinguish fluent-decoder-poor-comprehender from the opposite. |
| 1 | **Words & language** | WISC-V VCI (Similarities, Vocabulary; supplemental Information, Comprehension) | **Gc** | Language Development (LD), Lexical Knowledge (VL), Verbal Reasoning | *Well-anchored to VCI/Gc.* Gap: does not separate receptive from expressive language, nor written from spoken. Oral-language achievement lives in WIAT beyond WISC. |
| 2 | **Writing** | WIAT Written Expression (Alphabet Writing Fluency, Sentence Composition, Essay Composition, Spelling) | **Grw** (with **Gp** for handwriting motor) | Writing Ability (WA), Spelling Ability (SG), English Usage (EU) | Bundles transcription (handwriting, spelling — a *motor* + orthographic construct) with composition (a *language* construct). Dyspraxic writing struggles despite strong composition are hidden by this bundling. |
| 3 | **Staying with it** *(sustained attention)* | *Not a WISC-V index.* Ancillary measures: Conners CPT-3, TEA-Ch, BRIEF Attention subscale | **No direct CHC broad** — treated as attentional control cross-cutting Gs, Gsm and executive control models | Sustained Attention (SA), Selective Attention, Vigilance | *Weakly-anchored to WISC.* Needs supplementary tests or clinical interview to quantify. Populates a construct WISC does not measure. |
| 4 | **Planning & self-steering** *(executive function)* | *Not a WISC-V index.* Measures: D-KEFS (Trail Making, Verbal Fluency, Tower Test), BRIEF-2, NEPSY-II | **Multi-factor; cross-cuts CHC.** Sometimes placed under attentional control or metacognition | Set-Shifting, Inhibition, Planning, Cognitive Flexibility, Monitoring | *Weakly-anchored to WISC.* WMI + PSI touch EF but don't measure planning, inhibition, or flexibility directly. |
| 5 | **Numbers** | WIAT Mathematics (Numerical Operations, Math Problem Solving, Math Fluency) | **Gq** | Mathematical Knowledge (KM), Mathematical Achievement (A3) | *Well-anchored to WIAT.* Related: Gf (mathematical reasoning), Gsm (holding partial results), Gv (spatial for geometry). Gap: number-sense / subitising (the core of dyscalculia) requires specialised tests (Dyscalculia Screener, TEMA). |
| 6 | **Space & pattern** | WISC-V VSI (Block Design, Visual Puzzles) | **Gv** | Visualisation (Vz), Spatial Relations (SR), Closure Speed (CS), Serial Perceptual Integration (PI) | *Well-anchored to VSI/Gv.* Gap: **static-vs-motion imagery** (the tester's insight) is not a standard WISC-V distinction; some Gv narrows touch it (Speed of Closure, Perceptual Integration) but the construct is genuinely under-served. |
| 7 | **Puzzles & reasoning** | WISC-V FRI (Matrix Reasoning, Figure Weights; supplemental Picture Concepts, Arithmetic) | **Gf** | Induction (I), General Sequential Reasoning (RG), Quantitative Reasoning (RQ) | *Well-anchored to FRI/Gf.* Solid mapping. |
| 8 | **Quick thinking** | WISC-V PSI (Coding, Symbol Search; supplemental Cancellation) | **Gs** | Perceptual Speed (P), Rate of Test-Taking (R9) | Gap: PSI is heavily paper-and-pencil / motor-loaded; captures psychomotor speed as well as cognitive speed. Doesn't cleanly measure pure cognitive-only processing speed. |
| 9 | **Holding in mind** | WISC-V WMI (Digit Span, Picture Span; supplemental Letter-Number Sequencing) | **Gsm** | Memory Span (MS), Working Memory Capacity (MW) | Bundles verbal and visuospatial working memory. WISC-V's Picture Span extends coverage to visuospatial, but the two dissociate in some profiles (Corsi-tapping vs Digit Span). |

## Coverage analysis

Vertices with **strong** WISC/WIAT/CHC anchoring: Reading, Words, Numbers, Space,
Puzzles, Holding, Quick.

Vertices that are **loosely anchored** to WISC and rely on supplementary
measures: **Focus** and **Planning**. WISC-V doesn't measure sustained attention
or executive function directly. When an EP report lacks these numbers, the
question flow becomes the primary route to populating them — which is the design
argument for the question-flow-first approach.

Vertices that bundle constructs on purpose (fogginess as design stance):

- **Writing** conflates transcription (Gp motor + Grw orthographic) with
  composition (Gc + Grw language).
- **Reading** conflates decoding (Grw + Ga phonological) with comprehension
  (Grw + Gc).
- **Space** conflates static imagery with motion imagery — a genuine
  construct-gap in the underlying batteries, not just in this instrument.
- **Numbers** conflates number sense with arithmetic achievement.

## Rhetorical positioning

This mapping supports the exegesis argument that the visualiser is not a
percentile rank but a *felt sense of one's cognition*. Where WISC-V would report
a Verbal Comprehension standard score of 108 with a 95% confidence interval,
the visualiser holds "Words & language" as a shape you can drag. The
psychometric mapping shows the visualiser is not naive to the underlying test
literature; it is deliberately choosing a different unit of representation.

## Gaps to address in future iterations

1. **Static vs motion imagery** — added to question set as a strengths-based
   prompt; consider whether it should also modify the Space vertex's
   visualisation.
2. **Sustained attention and executive function** — currently weakly-anchored
   to WISC; the question flow is doing most of the work here. A separate
   BRIEF-style self-report path could strengthen the mapping.
3. **Auditory processing (Ga)** — not currently a vertex. Absent from the
   ten-domain set; relevant for phonological aspects of reading and for some
   autistic profiles. Consider adding, or subsuming under Reading + Words.
4. **Long-term retrieval (Glr)** — not currently a vertex. Retrieval fluency
   is relevant for word-finding and dyslexic profiles. Currently subsumed
   under Words.

## References

- Wechsler, D. (2014). *WISC-V Technical and Interpretive Manual*. Pearson.
- Wechsler, D. (2020). *WIAT-4 Technical and Interpretive Manual*. Pearson.
- Schneider, W. J., & McGrew, K. S. (2018). The Cattell–Horn–Carroll theory of
  cognitive abilities. In D. P. Flanagan & E. M. McDonough (Eds.),
  *Contemporary Intellectual Assessment: Theories, Tests, and Issues*
  (4th ed., pp. 73–163). Guilford Press.
- Diamond, A. (2013). Executive functions. *Annual Review of Psychology*, 64,
  135–168.
- Baddeley, A. (2012). Working memory: Theories, models, and controversies.
  *Annual Review of Psychology*, 63, 1–29.
- Butterworth, B. (2010). Foundational numerical capacities and the origins of
  dyscalculia. *Trends in Cognitive Sciences*, 14(12), 534–541.
- Snowling, M. J., & Hulme, C. (2011). Evidence-based interventions for reading
  and language difficulties. *British Journal of Educational Psychology*,
  81(1), 1–23.
