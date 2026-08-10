export type Screen = "home" | "workspace" | "discovery" | "asset" | "brief" | "match" | "challenges";
export type Tone = "neutral" | "verified" | "warning" | "action" | "missing";
export type RecordType = "brief" | "asset";
export type Lane = "industrial" | "software";

export interface Tag {
  label: string;
  tone: Tone;
}

export interface DiscoveryRecord {
  id: string;
  type: RecordType;
  lane: Lane;
  trl?: number;
  title: string;
  organisation: string;
  value: string;
  summary: string;
  reason: string;
  signal: Tag;
}

export interface KeyValue {
  term: string;
  value: string;
  emphasis?: boolean;
}

export interface EvidenceEntry {
  title: string;
  meta: string;
  tag: Tag;
}

export interface AssetDetail {
  id: string;
  title: string;
  standfirst: string;
  tags: Tag[];
  evidence: EvidenceEntry[];
  gatedCount: number;
  disclosure: { headline: string; body: string } | null;
  rights: KeyValue[];
  nextStep: { heading: string; body: string; price: string };
  /** Set only where a funded brief is already paired. */
  matchId: string | null;
  needs: string[];
  versions: string[];
}

export interface BriefDetail {
  id: string;
  title: string;
  standfirst: string;
  tags: Tag[];
  metric: { label: string; value: string; note: string };
  owner: { label: string; value: string; note: string };
  terms: KeyValue[];
  shortlist: { heading: string; body: string };
  matchId: string | null;
  fundable: string[];
}

export interface Requirement {
  id: string;
  status: "met" | "partial" | "gap" | "pending";
  requirement: string;
  evidence: string;
  detail: string;
  resolution?: string;
}

export interface Milestone {
  id: string;
  title: string;
  detail: string;
  value: string;
  state: string;
  active?: boolean;
}
