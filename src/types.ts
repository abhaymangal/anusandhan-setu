export type Screen = "discovery" | "asset" | "brief" | "match";
export type Tone = "neutral" | "verified" | "warning" | "action" | "missing";
export type RecordType = "brief" | "asset";

export interface DiscoveryRecord {
  id: string;
  type: RecordType;
  lane: "industrial" | "software";
  trl?: number;
  title: string;
  organisation: string;
  value: string;
  summary: string;
  reason: string;
  signal: string;
}

export interface Requirement {
  id: string;
  status: "met" | "partial" | "gap" | "pending";
  requirement: string;
  evidence: string;
  detail: string;
  resolution?: string;
}
