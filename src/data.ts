import type {
  AssetDetail,
  BriefDetail,
  DiscoveryRecord,
  Milestone,
  Requirement,
} from "./types";

/* Every organisation, person, figure and transaction below is illustrative.
   The structure is the claim being demonstrated — not the content. */

export const DISCOVERY_RECORDS: DiscoveryRecord[] = [
  {
    id: "PB-2026-0088",
    type: "brief",
    lane: "industrial",
    title: "Cut unplanned spindle downtime across a 40-machine shop floor",
    organisation: "Vardhman Precision Components · Chakan",
    value: "₹6,00,000",
    summary:
      "Detect ≥80% of bearing failures 72 hours ahead with under one false alarm per machine-month.",
    reason: "Retrofit diagnostics for machines without telemetry.",
    signal: { label: "Budget confirmed · named owner", tone: "action" },
  },
  {
    id: "RA-2026-0417",
    type: "asset",
    lane: "industrial",
    trl: 4,
    title:
      "Retrofit vibration diagnostics for bearing and spindle faults on legacy CNC machines",
    organisation: "Government engineering college · Pune district",
    value: "TRL 4",
    summary:
      "Precision 0.93 on a seeded-fault test rig; code and dataset published; mount geometry gated.",
    reason: "Clamp-on sensing, three named fault classes, no PLC changes.",
    signal: { label: "Production data missing", tone: "warning" },
  },
  {
    id: "PB-2026-0112",
    type: "brief",
    lane: "industrial",
    title: "Raise post-consumer PET flake purity above 96% without adding sorting labour",
    organisation: "Reclaim Polymers · Vapi",
    value: "₹4,50,000",
    summary:
      "Existing line runs at 91–93% purity; bench proof required before a line trial.",
    reason: "Low-cost optical sorting on the existing conveyor.",
    signal: { label: "Funded validation · 14 weeks", tone: "action" },
  },
  {
    id: "RA-2026-0462",
    type: "asset",
    lane: "industrial",
    trl: 3,
    title: "Near-infrared classifier separating PET from PVC and PLA in mixed flake",
    organisation: "Institute of chemical technology · Mumbai",
    value: "TRL 3",
    summary:
      "94% bench accuracy on prepared flake; never tested on wet or contaminated feed.",
    reason: "Polymer discrimination on a moving belt.",
    signal: { label: "Disclosure review required", tone: "missing" },
  },
  {
    id: "PB-2026-0149",
    type: "brief",
    lane: "software",
    title: "Digitise 1.2 lakh handwritten land mutation records into a searchable register",
    organisation: "State directorate of land records",
    value: "₹9,00,000",
    summary:
      "On-premise Indic OCR with field-level accuracy above 97% for names and survey numbers.",
    reason: "Handwritten Devanagari OCR with field extraction.",
    signal: { label: "Public challenge · procurement route", tone: "action" },
  },
  {
    id: "RA-2026-0521",
    type: "asset",
    lane: "software",
    trl: 5,
    title: "Layout-aware handwritten Devanagari OCR for legacy registers",
    organisation: "Engineering college · Nagpur",
    value: "TRL 5",
    summary:
      "96.4% field accuracy across 8,000 pages; deployed once with a municipal archive.",
    reason: "Matches script, on-premise constraint and field extraction.",
    signal: { label: "Faculty attested · comparable pilot", tone: "verified" },
  },
];

export const ASSET_DETAILS: Record<string, AssetDetail> = {
  "RA-2026-0417": {
    id: "RA-2026-0417",
    title: "Retrofit vibration diagnostics for bearing and spindle faults",
    standfirst:
      "A clamp-on sensor and classifier for legacy CNC machines. Validated on an instrumented rig; not yet validated on a production floor.",
    tags: [
      { label: "Faculty attested", tone: "verified" },
      { label: "Gated dossier", tone: "action" },
      { label: "TRL 4", tone: "neutral" },
      { label: "Provisional filed", tone: "warning" },
    ],
    gatedCount: 1,
    evidence: [
      {
        title: "Test-rig dataset",
        meta: "42 runs · three seeded fault classes · labelled protocol",
        tag: { label: "Public", tone: "verified" },
      },
      {
        title: "Classifier code and evaluation notebook",
        meta: "MIT-licensed repository · dependency manifest attached",
        tag: { label: "Public", tone: "verified" },
      },
      {
        title: "Bench validation report",
        meta: "Precision 0.93 / recall 0.88 · signed by faculty mentor",
        tag: { label: "Attested", tone: "verified" },
      },
      {
        title: "Mount geometry and conditioning circuit",
        meta: "Held back under provisional filing",
        tag: { label: "NDA required", tone: "warning" },
      },
    ],
    disclosure: {
      headline: "Public disclosure may affect patentability.",
      body: "The mount geometry and conditioning circuit remain gated until the institution's innovation cell or counsel clears release.",
    },
    rights: [
      {
        term: "Contributors",
        value: "A. Kulkarni 55% · R. Iyer 20% · Prof. S. Deshpande 15% · workshop staff 10%",
      },
      {
        term: "Institution",
        value: "Government engineering college, Pune district · institutional identity verified",
      },
      {
        term: "Resources used",
        value: "Institutional vibration rig and department consumables; no external sponsor",
      },
      {
        term: "Ownership",
        value:
          "Institution policy may claim ownership because facilities were used. Not yet confirmed in writing for this asset.",
      },
      {
        term: "Revenue rule",
        value:
          "Draft only: inventors 40 · department 15 · institution 45, applied to net licence income after filing costs.",
      },
    ],
    nextStep: {
      heading: "Four production machines, three weeks",
      body: "Test whether rig precision survives vibration noise, coolant mist and thermal drift.",
      price: "₹1,10,000",
    },
    matchId: "PB-2026-0088",
    needs: [
      "Six months of labelled vibration logs",
      "ARM gateway with 512 MB RAM",
      "Metrology support for mount tolerances",
    ],
    versions: [
      "v3 · bench report added",
      "v2 · provisional recorded",
      "v1 · asset created",
    ],
  },
  "RA-2026-0462": {
    id: "RA-2026-0462",
    title: "Near-infrared classifier separating PET from PVC and PLA in mixed flake",
    standfirst:
      "A spectral classifier for polymer discrimination on a moving belt. Bench results only; the disclosure position is unresolved.",
    tags: [
      { label: "Disclosure review open", tone: "missing" },
      { label: "TRL 3", tone: "neutral" },
      { label: "Ownership unconfirmed", tone: "warning" },
    ],
    gatedCount: 0,
    evidence: [
      {
        title: "Bench spectra library",
        meta: "1,240 prepared flake samples · three polymer classes",
        tag: { label: "Public", tone: "verified" },
      },
      {
        title: "Classification results",
        meta: "94% accuracy on clean, dry, prepared flake",
        tag: { label: "Self-reported", tone: "warning" },
      },
      {
        title: "Faculty attestation",
        meta: "Not yet requested from the department",
        tag: { label: "Missing", tone: "missing" },
      },
    ],
    disclosure: {
      headline: "This asset cannot be shared with industry yet.",
      body: "A conference abstract is under review and the innovation cell has not confirmed whether disclosure is already public. Until that resolves, the record stays visible but the evidence stays closed.",
    },
    rights: [
      { term: "Contributors", value: "Declaration not yet submitted" },
      { term: "Institution", value: "Institute of chemical technology, Mumbai · identity verified" },
      { term: "Resources used", value: "Departmental spectrometer; sponsor involvement not declared" },
      { term: "Ownership", value: "Unconfirmed. Blocking any transaction on this record." },
    ],
    nextStep: {
      heading: "Clear disclosure before anything else",
      body: "No validation can be scoped until the innovation cell rules on the pending abstract.",
      price: "Blocked",
    },
    matchId: null,
    needs: [
      "Contributor declaration",
      "Faculty attestation",
      "Wet and contaminated feed samples",
    ],
    versions: ["v1 · asset created"],
  },
  "RA-2026-0521": {
    id: "RA-2026-0521",
    title: "Layout-aware handwritten Devanagari OCR for legacy registers",
    standfirst:
      "A field-extraction OCR pipeline for handwritten registers, already deployed once with a municipal archive.",
    tags: [
      { label: "Faculty attested", tone: "verified" },
      { label: "TRL 5", tone: "neutral" },
      { label: "Comparable pilot", tone: "verified" },
      { label: "Open licence", tone: "action" },
    ],
    gatedCount: 0,
    evidence: [
      {
        title: "Municipal archive deployment report",
        meta: "8,000 pages · 96.4% field accuracy · countersigned by the archive",
        tag: { label: "Attested", tone: "verified" },
      },
      {
        title: "Annotated training corpus",
        meta: "22,000 line images · Devanagari · CC BY-SA",
        tag: { label: "Public", tone: "verified" },
      },
      {
        title: "Inference pipeline and model weights",
        meta: "Apache-2.0 · runs fully on-premise, no network calls",
        tag: { label: "Public", tone: "verified" },
      },
      {
        title: "Error analysis by field type",
        meta: "Survey numbers 98.1% · names 94.7% · dates 97.2%",
        tag: { label: "Attested", tone: "verified" },
      },
    ],
    disclosure: null,
    rights: [
      { term: "Contributors", value: "M. Bhosale 45% · P. Raut 30% · Prof. N. Kale 25%" },
      { term: "Institution", value: "Engineering college, Nagpur · institutional identity verified" },
      { term: "Resources used", value: "Institutional GPU cluster under a departmental allocation" },
      {
        term: "Ownership",
        value: "Institution confirmed in writing on 12 June 2026. Open licence approved for the model.",
        emphasis: true,
      },
      { term: "Revenue rule", value: "Not applicable — released under an open licence; revenue accrues from services." },
    ],
    nextStep: {
      heading: "Accuracy audit on the directorate's own sample",
      body: "Run the pipeline against 2,000 pages of the actual register to confirm the 97% field threshold holds on this handwriting.",
      price: "₹85,000",
    },
    matchId: null,
    needs: ["2,000-page representative sample", "On-premise hardware specification"],
    versions: [
      "v4 · error analysis by field type",
      "v3 · ownership confirmed in writing",
      "v2 · deployment report added",
      "v1 · asset created",
    ],
  },
};

export const BRIEF_DETAILS: Record<string, BriefDetail> = {
  "PB-2026-0088": {
    id: "PB-2026-0088",
    title: "Cut unplanned spindle downtime across a 40-machine shop floor",
    standfirst:
      "Failures are discovered after parts move out of tolerance, costing approximately 11 machine-days each quarter in scrap and rework.",
    tags: [
      { label: "Budget confirmed", tone: "verified" },
      { label: "6 teams invited", tone: "action" },
      { label: "Pilot → procurement", tone: "neutral" },
    ],
    metric: {
      label: "Success metric",
      value: "≥80% detection at least 72 hours ahead",
      note: "Below one false alarm per machine-month",
    },
    owner: {
      label: "Decision owner",
      value: "Head of Maintenance Engineering",
      note: "Accepts milestones and signs the pilot decision",
    },
    terms: [
      { term: "Budget", value: "₹6,00,000 across three acceptance-based milestones", emphasis: true },
      { term: "Timeline", value: "10 weeks to pilot decision · window opens 1 September 2026" },
      {
        term: "Data access",
        value: "Historical logs under NDA, on-site only; live access requires a data-sharing agreement",
      },
      { term: "Operating context", value: "Two shifts · 38–44 °C · ARM gateways · no cloud egress" },
      {
        term: "IP posture",
        value: "Three-year field-of-use exclusivity requested; background IP remains with its current owner",
      },
      { term: "Out of scope", value: "Machine replacement, PLC firmware changes and spindle teardown" },
    ],
    shortlist: {
      heading: "3 of 6 teams responded",
      body: "One candidate has evidence for the mechanical constraints but needs production-floor validation.",
    },
    matchId: "RA-2026-0417",
    fundable: [
      "Named decision owner",
      "Allocated cost centre",
      "Validation path under six months",
      "Adoption route stated up front",
    ],
  },
  "PB-2026-0112": {
    id: "PB-2026-0112",
    title: "Raise post-consumer PET flake purity above 96% without adding sorting labour",
    standfirst:
      "The existing wash line delivers 91–93% purity. Every point below 96% is rejected by the buyer and reprocessed at the plant's cost.",
    tags: [
      { label: "Budget confirmed", tone: "verified" },
      { label: "Sourcing candidates", tone: "action" },
      { label: "Bench proof first", tone: "neutral" },
    ],
    metric: {
      label: "Success metric",
      value: "≥96% flake purity at 1.4 tonnes per hour",
      note: "Measured on the plant's own contaminated feed, not prepared samples",
    },
    owner: {
      label: "Decision owner",
      value: "Plant Manager, Vapi facility",
      note: "Controls the line trial window and the capital request",
    },
    terms: [
      { term: "Budget", value: "₹4,50,000 for bench proof and one line trial", emphasis: true },
      { term: "Timeline", value: "14 weeks · line trial limited to scheduled maintenance windows" },
      { term: "Data access", value: "Feed samples shipped on request; no line telemetry available" },
      { term: "Operating context", value: "Wet flake · variable contamination · existing conveyor retained" },
      { term: "IP posture", value: "Non-exclusive licence acceptable; plant wants supply continuity, not ownership" },
      { term: "Out of scope", value: "Replacing the wash line or adding a second sorting stage" },
    ],
    shortlist: {
      heading: "No candidate cleared yet",
      body: "One nearby asset matches the physics but its disclosure position is unresolved, so it cannot be put in front of the sponsor.",
    },
    matchId: null,
    fundable: [
      "Named decision owner",
      "Buyer specification already fixed at 96%",
      "Bench stage before any capital commitment",
    ],
  },
  "PB-2026-0149": {
    id: "PB-2026-0149",
    title: "Digitise 1.2 lakh handwritten land mutation records into a searchable register",
    standfirst:
      "Mutation records from 1974 onward exist only on paper. Citizen requests currently take three weeks because each search is manual.",
    tags: [
      { label: "Public challenge", tone: "action" },
      { label: "Procurement route defined", tone: "verified" },
      { label: "On-premise only", tone: "warning" },
    ],
    metric: {
      label: "Success metric",
      value: "≥97% field accuracy on names and survey numbers",
      note: "Measured against a 2,000-page manually verified sample",
    },
    owner: {
      label: "Decision owner",
      value: "Joint Director, Land Records",
      note: "Chairs the technical evaluation committee",
    },
    terms: [
      { term: "Budget", value: "₹9,00,000 for the pilot phase; scale phase tendered separately", emphasis: true },
      { term: "Timeline", value: "16 weeks to evaluation · procurement follows the state IT policy" },
      { term: "Data access", value: "Records may not leave the directorate's premises under any circumstances" },
      { term: "Operating context", value: "Air-gapped hardware · no cloud inference · Devanagari and Modi script mixed" },
      { term: "IP posture", value: "Government retains a perpetual, irrevocable licence to the deployed pipeline" },
      { term: "Out of scope", value: "Physical scanning, which is already contracted separately" },
    ],
    shortlist: {
      heading: "1 strong candidate identified",
      body: "An attested asset with a comparable municipal deployment matches the script, the accuracy target and the on-premise constraint.",
    },
    matchId: "RA-2026-0521",
    fundable: [
      "Named decision owner and evaluation committee",
      "Procurement route defined before the pilot",
      "Accuracy threshold fixed in advance",
    ],
  },
};

/* ---- The flagship match: RA-2026-0417 against PB-2026-0088 ---- */

export const REQUIREMENTS: Requirement[] = [
  {
    id: "R1",
    status: "met",
    requirement: "Clamp-on sensing, no spindle teardown and no PLC changes",
    evidence: "Mount design + rig photographs · asset v3",
    detail:
      "The sensor reads externally and the classifier runs on a separate gateway. The machine controller remains untouched.",
  },
  {
    id: "R2",
    status: "met",
    requirement: "Covers bearing faults, not only generic anomaly detection",
    evidence: "Bench report · three named fault classes",
    detail:
      "Outer-race, inner-race and cage defects are classified separately. Evidence is from seeded faults only.",
  },
  {
    id: "R3",
    status: "partial",
    requirement: "≥80% detection 72 hours ahead, below one false alarm per machine-month",
    evidence: "Have: 0.93 precision on 42 rig runs · Missing: lead-time measurement",
    detail:
      "The rig established whether a fault was present, not how early it became detectable.",
    resolution: "M1 baseline on four machines with historical logs, three weeks.",
  },
  {
    id: "R4",
    status: "partial",
    requirement: "Runs on an ARM edge gateway with 512 MB RAM and no cloud egress",
    evidence: "Have: 180 MB model and CPU inference · Missing: target-hardware run",
    detail:
      "Offline execution is supported in principle, but memory headroom has not been measured on the sponsor gateway.",
    resolution: "Sponsor provides one gateway for a two-day port test.",
  },
  {
    id: "R5",
    status: "gap",
    requirement: "Performance on production machines under two-shift load at 38–44 °C",
    evidence: "No evidence · all results are from one temperature-controlled test rig",
    detail:
      "Shop-floor noise, coolant mist and thermal drift are absent from the current dataset.",
    resolution: "Fund M1 and run on the production floor.",
  },
  {
    id: "R6",
    status: "pending",
    requirement: "Six months of labelled historical vibration logs",
    evidence: "Waiting on sponsor · blocked by NDA and data-sharing agreement",
    detail:
      "The sponsor has confirmed that logs exist for six machines, but failure labels are not yet confirmed.",
    resolution: "Sponsor countersigns the NDA and confirms labelling before M1.",
  },
];

export const MILESTONES: Milestone[] = [
  {
    id: "M1",
    title: "Shop-floor baseline",
    detail: "4 machines · 3 weeks · baseline false-alarm rate",
    value: "₹1,10,000",
    state: "Ready to fund",
    active: true,
  },
  {
    id: "M2",
    title: "Blind validation",
    detail: "72-hour target on held-out failures",
    value: "₹2,40,000",
    state: "Pending M1",
  },
  {
    id: "M3",
    title: "12-machine pilot",
    detail: "Maintenance team runs it unassisted for 4 weeks",
    value: "₹2,50,000",
    state: "Pending M2",
  },
];

export const STATUS_LABELS = {
  met: "Met",
  partial: "Partial",
  gap: "Not evidenced",
  pending: "On sponsor",
} as const;
