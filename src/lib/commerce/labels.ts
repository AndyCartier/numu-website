// Kept separate from catalogue.ts so client components can use the labels
// without bundling the full product data.
// Development stage is shown on every card so a prototype is never read as stock.
export type DevelopmentStage = 'made_to_order' | 'prototype' | 'unique_works' | 'commission' | 'concept' | 'service'
export const STAGE_LABEL: Record<DevelopmentStage, string> = {
  made_to_order: 'Made to order',
  prototype: 'Prototype · project inquiries',
  unique_works: 'Unique works',
  commission: 'Bespoke commission',
  concept: 'In development',
  service: 'Bookable session',
}

// Evidence level for a specification line. Targets and internal data are labelled on the page.
export type SpecEvidence = 'confirmed' | 'internal' | 'target' | 'on_request'
export const EVIDENCE_LABEL: Record<SpecEvidence, string> = {
  confirmed: 'Confirmed',
  internal: 'Internal data',
  target: 'Design target, testing in progress',
  on_request: 'Confirmed per project',
}
