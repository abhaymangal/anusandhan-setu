/**
 * Anusandhan Setu — canonical record schema, v0.1 (alpha)
 *
 * This file is the system of record's contract. The prototype in
 * `src/types.ts` is a presentation-layer subset of it and should
 * be regenerated from here, not maintained in parallel.
 *
 * Two design commitments drive most of what follows:
 *
 *  1. NEGATIVE RESULTS ARE FIRST-CLASS. A thing that was tried and did not work
 *     is stored as a `ValidationBoundary` — a declared edge of the validated
 *     envelope — not as an absence. The schema distinguishes "we do not know"
 *     (`unevidenced`) from "we know it does not hold" (`excluded_by_boundary`).
 *     Declaring boundaries raises an asset's standing rather than lowering it,
 *     because coverage can only be claimed where a boundary does not contradict
 *     it. See `ValidationBoundary` and `RequirementCoverage`.
 *
 *  2. THE COST AND TIME OF THE NEXT VALIDATION STEP IS A FIELD, NOT A NOTE.
 *     `NextValidationStep` carries a priced, dated, pre-registered, falsifiable
 *     unit of work, including what the counterparty must supply and what a
 *     negative outcome would establish. A step with no `failureMeaning` is not
 *     fundable, because a sponsor who can only lose by funding it will not.
 *
 * Everything else — disclosure gating, the rights ledger, milestone acceptance —
 * exists to make those two safe to publish.
 *
 * CONVENTIONS
 *  - Records are append-only. Mutation produces a new `RecordVersion`; nothing
 *    is destructively edited, because a sponsor's decision was made against a
 *    specific version and must remain reconstructible.
 *  - Money is integer paise. Never floats, never display strings.
 *  - Dates are ISO-8601 date-only strings unless a timestamp is meaningful.
 *  - Any field a counterparty relies on carries provenance: who asserted it,
 *    when, and on what evidence grade.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * 0. Primitives
 * ──────────────────────────────────────────────────────────────────────────── */

declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B };

export type AssetId = Brand<string, "AssetId">; // RA-YYYY-NNNN
export type BriefId = Brand<string, "BriefId">; // PB-YYYY-NNNN
export type MatchId = Brand<string, "MatchId">; // MX-YYYY-NNNN
export type EngagementId = Brand<string, "EngagementId">; // EN-YYYY-NNNN
export type EvidenceId = Brand<string, "EvidenceId">;
export type BoundaryId = Brand<string, "BoundaryId">;
export type RequirementId = Brand<string, "RequirementId">;
export type MilestoneId = Brand<string, "MilestoneId">;
export type PersonId = Brand<string, "PersonId">;
export type InstitutionId = Brand<string, "InstitutionId">;
export type OrganisationId = Brand<string, "OrganisationId">;
export type DocumentId = Brand<string, "DocumentId">;

/** ISO-8601 date, e.g. "2026-08-10". */
export type DateOnly = Brand<string, "DateOnly">;
/** ISO-8601 instant, e.g. "2026-08-10T06:30:00Z". */
export type Timestamp = Brand<string, "Timestamp">;

/**
 * Integer minor units. INR is stored in paise: ₹1,10,000 is
 * { currency: "INR", minor: 11_000_000 }.
 *
 * The prototype stores `price: "₹1,10,000"` as a display string, which cannot be
 * summed, compared across a shortlist, or reconciled against an invoice.
 */
export interface Money {
  currency: "INR";
  minor: number;
}

export interface Duration {
  value: number;
  unit: "day" | "week" | "month";
}

/**
 * Who asserted a fact and on what authority. Attached to anything a sponsor
 * might rely on when committing money.
 */
export interface Provenance {
  assertedBy: PersonId | InstitutionId | OrganisationId;
  assertedOn: DateOnly;
  /** Free text only where the source is outside the platform. */
  sourceNote?: string;
}

/** Append-only version pointer. Every top-level record carries one. */
export interface RecordVersion {
  version: number;
  createdOn: Timestamp;
  createdBy: PersonId;
  /** Null on v1. */
  supersedes: number | null;
  /** Short operator-readable reason, shown in the record's version rail. */
  changeNote: string;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 1. Parties
 * ──────────────────────────────────────────────────────────────────────────── */

export interface Person {
  id: PersonId;
  fullName: string;
  /** ORCID iD where held. Absent for most undergraduates; do not require it. */
  orcid: string | null;
  /** Verified institutional email domain, or null if only self-asserted. */
  verifiedInstitutionalEmail: string | null;
  affiliation: InstitutionId | OrganisationId | null;
  identityVerification: {
    state: "unverified" | "email_domain" | "institution_confirmed";
    confirmedBy: InstitutionId | null;
    confirmedOn: DateOnly | null;
  };
}

export interface Institution {
  id: InstitutionId;
  legalName: string;
  /** Research Organization Registry ID, where the institution is listed. */
  ror: string | null;
  /** AISHE code — the practical identifier for Indian HEIs. */
  aishe: string | null;
  /**
   * Whether this institution has executed the Institution Participation
   * Agreement (LP-01). Until it has, no asset from it can reach `funded`.
   */
  participationAgreement: {
    state: "none" | "under_negotiation" | "executed";
    executedOn: DateOnly | null;
    documentId: DocumentId | null;
  };
  /**
   * The office empowered to clear disclosure and confirm ownership. Named
   * individuals, not "the TTO" — the alpha fails if there is no one to email.
   */
  rightsClearanceAuthority: {
    officeName: string;
    contacts: PersonId[];
    /** Working days the institution commits to in the participation agreement. */
    slaWorkingDays: number | null;
  } | null;
  /** URL or document reference to the institution's IP policy as applied. */
  ipPolicyDocumentId: DocumentId | null;
}

export interface Organisation {
  id: OrganisationId;
  legalName: string;
  kind: "private_company" | "psu" | "government_department" | "other";
  /** CIN for companies; not applicable to departments. */
  cin: string | null;
  gstin: string | null;
  /**
   * Government and PSU demand must route through a compliant procurement path.
   * Recording it up front stops the alpha from producing an unawardable pilot.
   */
  procurementRoute: {
    applicable: boolean;
    description: string | null;
    /** e.g. GFR 2017 rule relied upon, or the state IT policy clause. */
    authorityReference: string | null;
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 2. Disclosure — the gate everything else sits behind
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Disclosure state governs what may leave the platform. It is deliberately not
 * a boolean and not derived from the presence of files.
 *
 * `unreviewed` and `blocked` are terminal for transacting: a record in either
 * state may be listed, but no gated evidence may be released and no match may
 * advance past `mutual_interest` (see INV-02 in validate.ts).
 *
 * India-specific: publication before the priority date destroys novelty under
 * the Patents Act, 1970. The grace period in s.31 is narrow — it covers
 * specified exhibition/learned-society situations, not general publication —
 * so the platform must never treat "a paper is out" as recoverable. Confirm the
 * exact scope with counsel before wording the in-product warning (see LP-03).
 */
export type DisclosureStateName =
  | "unreviewed" // default on creation; nothing may be released
  | "under_review" // with the institution's rights-clearance authority
  | "public" // summary and evidence marked public may be shown to anyone
  | "gated" // summary public; technical dossier released only under NDA
  | "embargoed" // withheld until `embargoUntil`, then re-evaluated
  | "private_matching" // never listed; surfaced only to curated counterparties
  | "blocked"; // a live problem prevents any release

export interface DisclosureState {
  state: DisclosureStateName;
  /** Required whenever state is `blocked`; shown verbatim to the student. */
  blockingReason: string | null;
  embargoUntil: DateOnly | null;
  clearedBy: InstitutionId | null;
  clearedOn: DateOnly | null;
  /**
   * Set when any public disclosure has already occurred, with its date. This is
   * what counsel needs to assess the patent position; "we think it might be
   * out" is not usable.
   */
  priorPublicDisclosure: {
    occurred: boolean;
    firstDisclosedOn: DateOnly | null;
    venue: string | null;
  };
  /** Dual-use / export control screening. */
  exportControl: {
    screened: boolean;
    /** SCOMET category if the screen identified one. */
    scometCategory: string | null;
    restricted: boolean;
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 3. Rights ledger
 * ──────────────────────────────────────────────────────────────────────────── */

export interface ContributionDeclaration {
  person: PersonId;
  /** Integer percent. All declarations for an asset must sum to exactly 100. */
  sharePercent: number;
  /** What they actually did — required, because "co-author" is not a claim. */
  contributionStatement: string;
  /** Signed by the person themselves, not by the record's creator. */
  signedOn: DateOnly | null;
}

export interface BackgroundIP {
  description: string;
  owner: PersonId | InstitutionId | OrganisationId | "third_party";
  /** e.g. "MIT", "CC BY-SA 4.0", "proprietary — licence held". */
  licenceTerms: string;
  /** True where the licence restricts commercial sublicensing. */
  blocksCommercialUse: boolean;
}

export type OwnershipPositionState =
  | "undeclared"
  | "student_asserted" // the student's view, unconfirmed — never sufficient
  | "institution_disputed"
  | "confirmed_in_writing"; // the only state from which money may move

export interface RightsLedger {
  contributions: ContributionDeclaration[];
  institution: InstitutionId;
  /**
   * Institutional facilities or funds used. This is usually what triggers an
   * institutional ownership claim under Indian university IP policy, so it is a
   * required declaration rather than an optional note.
   */
  resourcesUsed: {
    description: string;
    institutionalFacilities: boolean;
    externalSponsor: OrganisationId | null;
    grantReference: string | null;
  };
  backgroundIP: BackgroundIP[];
  thirdPartyMaterials: BackgroundIP[];
  ownership: {
    state: OwnershipPositionState;
    /** The clause of the institution's IP policy relied upon. */
    policyReference: string | null;
    confirmedOn: DateOnly | null;
    documentId: DocumentId | null;
    /** Present while `institution_disputed`. */
    disputeNote: string | null;
  };
  /**
   * Revenue split. `binding: false` means a draft the platform displays but
   * will not settle against — the prototype shows a draft split with no such
   * flag, which is how a student comes to believe a number that no one signed.
   */
  revenueRule: {
    binding: boolean;
    splits: { party: PersonId | InstitutionId | "department"; percent: number }[];
    /** e.g. "net licence income after filing and prosecution costs". */
    base: string;
    documentId: DocumentId | null;
  } | null;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 4. Evidence
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Evidence grade, ordered. Match coverage may only be claimed `met` on evidence
 * of grade `attested` or higher (INV-05).
 *
 * The prototype's `Tag` collapses this into display tone; grade must be a
 * comparable value or the matching engine cannot reason about it.
 */
export type EvidenceGrade =
  | "declared" // the team says so
  | "attested" // faculty mentor or institution has signed the specific claim
  | "independent" // third-party lab, certification body, or prior counterparty
  | "counterparty_verified"; // this sponsor, or a previous one, reproduced it

export const EVIDENCE_GRADE_ORDER: Record<EvidenceGrade, number> = {
  declared: 0,
  attested: 1,
  independent: 2,
  counterparty_verified: 3,
};

export type EvidenceVisibility = "public" | "nda_required" | "withheld";

export interface EvidenceItem {
  id: EvidenceId;
  title: string;
  /** Method and sample size in plain terms: "42 runs, three seeded fault classes". */
  description: string;
  grade: EvidenceGrade;
  visibility: EvidenceVisibility;
  provenance: Provenance;
  /**
   * Conditions under which this result was obtained. Required, and the reason
   * the schema can tell a rig result from a shop-floor result without a human
   * reading the prose.
   */
  conditions: OperatingEnvelope;
  /** Object-store references; immutable once attached to a funded milestone. */
  attachments: DocumentId[];
  /** Set when `visibility` is not `public`; names the gating reason. */
  withheldReason: string | null;
}

/**
 * A machine-comparable description of the conditions a claim holds under. Both
 * evidence and brief requirements use it, which is what makes `met` computable
 * and `excluded_by_boundary` detectable.
 *
 * Dimensions are open — an alpha in two lanes does not need a universal
 * ontology — but each entry must be a named dimension with a range or set, not
 * a sentence.
 */
export interface OperatingEnvelope {
  dimensions: EnvelopeDimension[];
  /** Anything not yet expressible as a dimension, for curator review. */
  unstructuredNote: string | null;
}

export type EnvelopeDimension =
  | { kind: "range"; name: string; unit: string; min: number; max: number }
  | { kind: "set"; name: string; values: string[] }
  | { kind: "boolean"; name: string; value: boolean };

/* ────────────────────────────────────────────────────────────────────────────
 * 5. Negative results — first-class
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * A declared edge of the validated envelope: something that was tried and did
 * not hold, or a condition under which performance is known to degrade.
 *
 * This is the field the prototype has no room for. Its `Requirement.status`
 * offers `gap` — "No evidence · all results are from one temperature-controlled
 * test rig" — which is *absence*. There is no way to record "we ran it at 44 °C
 * and precision fell to 0.61". To a sponsor those are opposite facts: one is
 * unknown risk, the other is a bounded, priced, known limitation.
 *
 * Boundaries are also what a failed milestone produces. Money spent on a
 * validation that failed still bought information, and that information belongs
 * to the record permanently (see `MilestoneOutcome`).
 *
 * INCENTIVE NOTE — why declaring these does not punish the student:
 *  - Coverage may not be claimed `met` outside a tested envelope, so an asset
 *    with no declared boundaries cannot claim breadth; it can only claim
 *    `unevidenced`, which reads worse to a sponsor than a stated limit.
 *  - `evidenceCompleteness` counts declared boundaries positively (INV-08).
 *  - A boundary narrows the next validation step, which lowers its price. A
 *    cheaper, sharper next step is easier to fund.
 */
export interface ValidationBoundary {
  id: BoundaryId;
  /** "Precision falls to 0.61 on wet, contaminated feed." */
  statement: string;
  /** The conditions under which the limitation was observed. */
  observedUnder: OperatingEnvelope;
  /** How it was established. A boundary is a result and carries a grade. */
  grade: EvidenceGrade;
  provenance: Provenance;
  /** Supporting evidence, if any was produced. */
  evidence: EvidenceId[];
  /**
   * Where the boundary came from. `funded_validation` entries are the durable
   * output of the failure branch and may not be retracted unilaterally.
   */
  origin:
    | "team_declared"
    | "faculty_observed"
    | "funded_validation"
    | "counterparty_reported";
  /** Set for `funded_validation`; links the milestone that produced it. */
  producedByMilestone: MilestoneId | null;
  /**
   * Whether the team believes this is addressable, and at what cost. A boundary
   * with a route out is a scope item; one without is a hard limit, and saying so
   * is more useful than implying everything is fixable.
   */
  resolution: {
    addressable: boolean;
    approach: string | null;
    estimatedCost: Money | null;
  };
  /**
   * Superseded rather than deleted when later work overturns it. Retraction
   * requires the same grade or higher than the original (INV-09).
   */
  supersededBy: BoundaryId | null;
  disputedBy: (PersonId | OrganisationId)[];
}

/* ────────────────────────────────────────────────────────────────────────────
 * 6. Next validation step — first-class economics
 * ──────────────────────────────────────────────────────────────────────────── */

export type CostBasis =
  | "team_estimate" // the team's guess — display, never quote against
  | "platform_template" // benchmarked from comparable past steps
  | "institution_quoted" // the institution has priced facility time
  | "sponsor_quoted"; // the sponsor has costed their own inputs

/**
 * A priced, dated, falsifiable unit of work. This is the "Still needed" card
 * promoted from three strings to a transaction primitive.
 *
 * The prototype models this as `nextStep: { heading, body, price: string }` plus
 * `needs: string[]`. Four things are missing and all four block a funding
 * decision:
 *
 *  1. WHOSE NUMBER IS IT. `price: "₹1,10,000"` has no author. `costBasis` and
 *     `quotedBy` make the difference between a quote and a hope legible.
 *  2. WHAT THE SPONSOR MUST SUPPLY. `needs` mixes "six months of labelled logs"
 *     (a sponsor obligation, often the real cost and the usual reason pilots
 *     stall) with "metrology support" (a facility need). `inputsRequired`
 *     separates them by obligated party.
 *  3. WHAT DECIDES IT. Without a criterion fixed before funding, acceptance is
 *     renegotiated after the result is known, which is how milestone disputes
 *     start. `preRegisteredCriterion` is frozen at funding (INV-07).
 *  4. WHAT FAILURE WOULD ESTABLISH. `failureMeaning` is the field that makes a
 *     step fundable at all: it states the information the sponsor buys even in
 *     the negative case. A step where failure teaches nothing is not a
 *     validation, it is a bet, and the platform should not price it.
 */
export interface NextValidationStep {
  /** The single falsifiable question this step answers. */
  question: string;
  /**
   * What it closes. Populated against a specific brief's requirements when the
   * step is match-scoped; against the asset's own boundaries when standalone.
   */
  resolves: {
    requirements: RequirementId[];
    boundaries: BoundaryId[];
  };
  cost: Money;
  costBasis: CostBasis;
  quotedBy: PersonId | InstitutionId | OrganisationId | null;
  quotedOn: DateOnly | null;
  duration: Duration;
  /** Real-world gates: a maintenance window, a monsoon, an exam period. */
  earliestStart: DateOnly | null;
  schedulingConstraint: string | null;
  /**
   * Obligations by party. Sponsor-side inputs are costs the sponsor bears and
   * must see before agreeing, not after.
   */
  inputsRequired: {
    from: "sponsor" | "institution" | "team" | "platform" | "third_party";
    description: string;
    /** Set where the input has a knowable cost or lead time. */
    estimatedCost: Money | null;
    leadTime: Duration | null;
    /** Blocks start until satisfied. */
    blocking: boolean;
  }[];
  /** Fixed before funding; the sole basis for acceptance. */
  preRegisteredCriterion: string;
  /**
   * What a negative result would establish. Required. See note above.
   * e.g. "Rules out clamp-on sensing for this machine class without a damped
   * mount, and tells the sponsor the retrofit path costs more than replacement
   * instrumentation."
   */
  failureMeaning: string;
  /** State the record reaches on success. */
  unlocksOnSuccess: string;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 7. Research asset
 * ──────────────────────────────────────────────────────────────────────────── */

export type Lane = "industrial" | "software";

export interface ResearchAsset {
  id: AssetId;
  recordVersion: RecordVersion;
  lane: Lane;
  title: string;
  /** Plain-language statement of what it does, for a non-specialist buyer. */
  plainLanguageSummary: string;
  /** The problem it addresses, stated independently of the method. */
  problemStatement: string;
  trl: {
    value: number; // 1–9
    /** Why this level and not the one above. Prevents inflation by assertion. */
    justification: string;
    grade: EvidenceGrade;
  };
  /** The envelope the asset's claims are asserted to hold within. */
  claimedEnvelope: OperatingEnvelope;
  evidence: EvidenceItem[];
  /** First-class. May be empty only below TRL 4 (INV-08). */
  validationBoundaries: ValidationBoundary[];
  /**
   * The asset's own next step, in the absence of a specific brief. Match-scoped
   * steps live on the Match, because the cheapest next step depends on who is
   * asking — RA-2026-0521's "audit on the directorate's own sample" is a
   * match-scoped step wrongly stored on the asset in the prototype.
   */
  nextValidationStep: NextValidationStep | null;
  rights: RightsLedger;
  disclosure: DisclosureState;
  /** Standing resource needs not tied to a specific validation step. */
  standingNeeds: string[];
  createdBy: PersonId;
  institution: InstitutionId;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 8. Problem brief
 * ──────────────────────────────────────────────────────────────────────────── */

export interface BriefRequirement {
  id: RequirementId;
  statement: string;
  /** Conditions the solution must hold under. Compared against evidence. */
  envelope: OperatingEnvelope;
  /**
   * `must` requirements can disqualify; `should` requirements shape ranking.
   * Without the distinction every gap looks fatal and no match ever advances.
   */
  necessity: "must" | "should";
  /** How the sponsor will check it. */
  verificationMethod: string;
}

export interface ProblemBrief {
  id: BriefId;
  recordVersion: RecordVersion;
  lane: Lane;
  title: string;
  /** What it costs the organisation today, in their own numbers. */
  problemStatement: string;
  successMetric: {
    statement: string;
    threshold: string;
    measuredOn: string; // "the plant's own contaminated feed, not prepared samples"
  };
  requirements: BriefRequirement[];
  /** Everything a fundable brief must have; absence blocks publication. */
  funding: {
    budget: Money;
    /** Confirmed means an allocated cost centre, not an intention. */
    state: "indicative" | "confirmed" | "committed";
    costCentre: string | null;
    confirmedBy: PersonId | null;
    confirmedOn: DateOnly | null;
  };
  decisionOwner: {
    person: PersonId;
    role: string;
    /** What they are actually empowered to sign. */
    authority: string;
  };
  timeline: {
    decisionBy: DateOnly;
    windowOpens: DateOnly | null;
    constraint: string | null;
  };
  dataAccess: {
    description: string;
    requiresNda: boolean;
    requiresDataSharingAgreement: boolean;
    /** True where data may not leave the counterparty's premises. */
    onPremiseOnly: boolean;
  };
  ipPosture: {
    /** What the sponsor wants. Not what they will get — that is negotiated. */
    sought:
      | "non_exclusive_licence"
      | "exclusive_field_of_use"
      | "assignment"
      | "option_to_licence"
      | "procurement_licence"
      | "no_ip_interest";
    fieldOfUse: string | null;
    termYears: number | null;
    backgroundIpPosition: string;
  };
  adoptionRoute: string;
  outOfScope: string[];
  organisation: OrganisationId;
  visibility: "public_challenge" | "gated" | "invite_only";
}

/* ────────────────────────────────────────────────────────────────────────────
 * 9. Match — its own entity
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * A match is an entity, not a nullable scalar on each side.
 *
 * The prototype stores `matchId` on both `AssetDetail` and `BriefDetail`, which
 * permits the two sides to disagree — and in the current data they do:
 * PB-2026-0149 claims RA-2026-0521, while RA-2026-0521 has `matchId: null`, so
 * the brief shows "Review top match" and the asset shows "No funded brief
 * paired yet" for the same pair. A `Match` record makes that state
 * unrepresentable.
 */
export type MatchStage =
  | "candidate" // engine-surfaced, unseen
  | "curated" // a human has reviewed and let it through
  | "mutual_interest" // both sides opted in — the last stage before NDA
  | "nda_executed"
  | "diligence"
  | "proposed" // a priced step is on the table
  | "funded"
  | "declined"
  | "withdrawn";

export type CoverageStatus =
  | "met"
  | "partial"
  | "unevidenced" // no evidence either way — the prototype's "gap"
  | "excluded_by_boundary" // a declared boundary says it does not hold
  | "awaiting_counterparty"; // blocked on sponsor input, not on the team

export interface RequirementCoverage {
  requirement: RequirementId;
  status: CoverageStatus;
  /** Must be non-empty and grade ≥ attested when status is `met` (INV-05). */
  supportingEvidence: EvidenceId[];
  /** Required when status is `excluded_by_boundary`. */
  contradictingBoundary: BoundaryId | null;
  /** The human-readable rationale shown in the ledger. Never a bare score. */
  rationale: string;
  /** What would move it; null where nothing short of new science would. */
  resolutionStep: NextValidationStep | null;
}

export interface Match {
  id: MatchId;
  recordVersion: RecordVersion;
  asset: AssetId;
  brief: BriefId;
  stage: MatchStage;
  coverage: RequirementCoverage[];
  /**
   * The cheapest step that resolves the largest `must` gap for THIS brief.
   * Distinct from the asset's standalone step.
   */
  nextValidationStep: NextValidationStep | null;
  /**
   * The number a sponsor actually decides on: the next step plus every
   * remaining milestone plus costed sponsor-side inputs. Computed, stored for
   * auditability at the version the decision was taken against.
   */
  totalCostToDecision: Money | null;
  /** Why the curator let it through, or why they did not. */
  curatorNote: string | null;
  curatedBy: PersonId | null;
  declineReason: string | null;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 10. Engagement — funded work, including the failure branch
 * ──────────────────────────────────────────────────────────────────────────── */

export type MilestoneState =
  | "draft"
  | "ready_to_fund"
  | "funded"
  | "in_progress"
  | "submitted"
  | "accepted"
  | "failed" // criterion not met — a real, expected outcome
  | "disputed"
  | "cancelled";

/**
 * The outcome of a milestone. `failed` is a first-class terminal state with
 * defined consequences, not an error path.
 *
 * A failed milestone must produce a `ValidationBoundary`. This is the mechanism
 * that turns a sponsor's spent money into durable information on the record,
 * and it is why the alpha is worth running even when the science does not work.
 */
export interface MilestoneOutcome {
  measuredResult: string;
  /** Assessed strictly against the frozen criterion, not a renegotiated one. */
  criterionMet: boolean;
  assessedBy: PersonId;
  assessedOn: DateOnly;
  countersignedBy: PersonId | null;
  /**
   * Required when `criterionMet` is false (INV-10). The boundary this failure
   * establishes on the asset.
   */
  producedBoundary: BoundaryId | null;
  /**
   * What happens to the money. Fixed in the sponsored validation agreement
   * (LP-05), not decided after the fact.
   */
  settlement:
    | "released_in_full" // criterion met
    | "released_on_effort" // work performed, criterion not met, effort payable
    | "partial_release"
    | "returned_to_sponsor";
  /** Whether the engagement continues, and on what changed basis. */
  continuation:
    | "proceed_to_next"
    | "rescope_and_reprice"
    | "close_negative" // closed; the boundary stands as the deliverable
    | "close_disputed";
}

export interface EngagementMilestone {
  id: MilestoneId;
  ordinal: number;
  title: string;
  description: string;
  value: Money;
  duration: Duration;
  state: MilestoneState;
  /**
   * Frozen copy of the step as funded. The live step may change afterwards;
   * acceptance is judged against this (INV-07).
   */
  fundedStep: NextValidationStep | null;
  /** Hash of `fundedStep` at funding time, recorded in the agreement. */
  criterionHash: string | null;
  fundedOn: DateOnly | null;
  outcome: MilestoneOutcome | null;
  blockedBy: MilestoneId[];
}

export interface Engagement {
  id: EngagementId;
  recordVersion: RecordVersion;
  match: MatchId;
  instrument:
    | "sponsored_validation"
    | "option_to_licence"
    | "non_exclusive_licence"
    | "exclusive_field_of_use_licence"
    | "procurement_pilot";
  /** Executed agreement backing this engagement. Required before `funded`. */
  agreementDocumentId: DocumentId | null;
  milestones: EngagementMilestone[];
  /**
   * ALPHA CONSTRAINT: the platform does not hold funds. Settlement happens
   * off-platform between the parties or via a licensed payment partner; the
   * platform records the ledger only. Holding client funds engages RBI payment
   * aggregator authorisation, which the alpha will not have. See LP-08.
   */
  settlement: {
    mode: "off_platform_recorded"; // the only permitted alpha value
    recordedPayments: {
      milestone: MilestoneId;
      amount: Money;
      paidOn: DateOnly;
      reference: string;
      evidenceDocumentId: DocumentId | null;
    }[];
  };
  state: "draft" | "executed" | "active" | "completed" | "closed_negative" | "terminated";
}

/* ────────────────────────────────────────────────────────────────────────────
 * 11. Outcome events — the north-star instrumentation
 * ──────────────────────────────────────────────────────────────────────────── */

export type OutcomeEventKind =
  | "asset_published"
  | "brief_published"
  | "match_curated"
  | "mutual_interest"
  | "nda_executed"
  | "step_proposed"
  | "engagement_funded" // north-star numerator
  | "milestone_accepted"
  | "milestone_failed" // tracked with equal weight
  | "boundary_declared"
  | "licence_executed"
  | "engagement_closed_negative"
  | "disclosure_blocked"
  | "ownership_dispute_opened";

export interface OutcomeEvent {
  kind: OutcomeEventKind;
  at: Timestamp;
  asset: AssetId | null;
  brief: BriefId | null;
  match: MatchId | null;
  engagement: EngagementId | null;
  /** Money implicated, where the event has a value. */
  value: Money | null;
  actor: PersonId;
  note: string | null;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 12. Derived views
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Completeness is scored on declared limits as well as declared results.
 * An asset at TRL 5 with zero boundaries is scored *down*, not up: it is
 * claiming maturity without stating where it stops.
 */
export interface AssetCompleteness {
  asset: AssetId;
  /** 0–100. Composition documented in docs/01-record-schema.md. */
  score: number;
  missingRequired: string[];
  boundariesDeclared: number;
  highestEvidenceGrade: EvidenceGrade | null;
  transactable: boolean;
  blockingReasons: string[];
}
