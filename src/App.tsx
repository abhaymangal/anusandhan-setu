import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  CircleAlert,
  CornerUpLeft,
  Lock,
  LockOpen,
  Search,
  ShieldCheck,
} from "lucide-react";
import { MotionConfig } from "motion/react";
import {
  Button,
  ExchangeDiagram,
  PageIntro,
  Panel,
  Pill,
  ScreenNav,
  Seal,
  ThemeToggle,
} from "./components";
import {
  ASSET_DETAILS,
  BRIEF_DETAILS,
  DISCOVERY_RECORDS,
  MILESTONES,
  REQUIREMENTS,
  STATUS_LABELS,
} from "./data";
import type { DiscoveryRecord, KeyValue, Requirement, Screen, Tone } from "./types";

const SCREENS: Screen[] = ["discovery", "asset", "brief", "match"];

const FILTERS = [
  { id: "software", label: "Software & AI" },
  { id: "industrial", label: "Industrial sustainability" },
  { id: "brief", label: "Funded briefs" },
  { id: "asset", label: "Research assets" },
  { id: "trl", label: "TRL 4 and above" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const STATUS_TONE: Record<Requirement["status"], Tone> = {
  met: "verified",
  partial: "warning",
  gap: "missing",
  pending: "action",
};

/* ==========================================================================
   Discovery
   ========================================================================== */

interface DiscoveryProps {
  onOpenRecord: (record: DiscoveryRecord) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

function Discovery({ onOpenRecord, searchRef }: DiscoveryProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Set<FilterId>>(() => new Set());
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const records = useMemo(() => {
    return DISCOVERY_RECORDS.filter((record) => {
      if (filters.has("software") && record.lane !== "software") return false;
      if (filters.has("industrial") && record.lane !== "industrial") return false;
      if (filters.has("brief") && record.type !== "brief") return false;
      if (filters.has("asset") && record.type !== "asset") return false;
      if (filters.has("trl") && (record.type !== "asset" || (record.trl ?? 0) < 4)) return false;
      if (!deferredQuery) return true;
      return `${record.id} ${record.title} ${record.organisation} ${record.summary} ${record.reason}`
        .toLowerCase()
        .includes(deferredQuery);
    });
  }, [deferredQuery, filters]);

  function toggleFilter(id: FilterId) {
    setFilters((current) => {
      const next = new Set(current);
      const opposites: Partial<Record<FilterId, FilterId>> = {
        software: "industrial",
        industrial: "software",
        brief: "asset",
        asset: "brief",
      };
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const opposite = opposites[id];
        if (opposite) next.delete(opposite);
      }
      return next;
    });
  }

  const fundedCount = records.filter((record) => record.type === "brief").length;

  return (
    <div className="page shell-width">
      <section className="hero">
        <div className="hero__copy">
          <span className="hero__kicker">
            <ShieldCheck aria-hidden="true" />
            Founding NIT exchange · director preview
          </span>
          <h1>
            Research should meet demand <em>before</em> it gathers dust
          </h1>
          <p>
            One exchange where institutions present evidence, industry funds the next validation
            step, and the state sees measurable outcomes. Every record states why it surfaced and
            what remains unproven.
          </p>
          <div className="stat-rail">
            <div className="stat">
              <strong>20</strong>
              <span>Deeply verified assets</span>
            </div>
            <div className="stat">
              <strong>5</strong>
              <span>Funded problem briefs</span>
            </div>
            <div className="stat">
              <strong>90</strong>
              <span>Day founding pilot</span>
            </div>
          </div>
        </div>

        <div className="exchange">
          <div className="exchange__head">
            <span>Live match</span>
            <b>RA-0417 × PB-0088</b>
          </div>
          <ExchangeDiagram />
          <div className="exchange__foot">
            <BadgeCheck aria-hidden="true" />
            <span>
              Coverage is published before money moves. Funding <b>M1</b> answers the one question
              that decides the rest.
            </span>
          </div>
        </div>
      </section>

      <div className="search-panel" role="search">
        <label className="sr-only" htmlFor="research-search">
          Search problems and research assets
        </label>
        <div className="search-field">
          <Search aria-hidden="true" />
          <input
            id="research-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Describe an operating problem, or search the exchange"
          />
          <kbd className="kbd">/</kbd>
        </div>
        <div className="filter-row" aria-label="Filter results">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              className="filter-chip"
              aria-pressed={filters.has(filter.id)}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="result-summary" aria-live="polite">
        <span>
          <strong>{records.length}</strong> {records.length === 1 ? "record" : "records"}
          {fundedCount > 0 ? ` · ${fundedCount} funded` : ""}
        </span>
        <span>Problem briefs and research assets share one evidence standard</span>
      </div>

      <div className="result-grid">
        {records.map((record) => (
          <button
            className="result-card reveal"
            data-type={record.type}
            key={record.id}
            onClick={() => onOpenRecord(record)}
          >
            <div className="result-card__top">
              <div>
                <div className="pill-row">
                  <Pill tone={record.type === "brief" ? "action" : "neutral"}>
                    {record.type === "brief" ? "Funded problem" : "Research asset"}
                  </Pill>
                  <Pill tone={record.signal.tone}>{record.signal.label}</Pill>
                </div>
                <h2>{record.title}</h2>
              </div>
              <span className="record-value">{record.value}</span>
            </div>
            <p className="record-meta">
              {record.organisation} · <code>{record.id}</code>
            </p>
            <p className="record-summary">{record.summary}</p>
            <dl className="why-match">
              <dt>Why it surfaced</dt>
              <dd>{record.reason}</dd>
            </dl>
          </button>
        ))}
        {records.length === 0 ? (
          <div className="empty-state">
            <h2>No exact match yet</h2>
            <p>
              Clear a filter, or publish a funded problem brief so a curator can source candidates
              against it. An empty result is a sourcing task, not a dead end.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ==========================================================================
   Shared detail pieces
   ========================================================================== */

function KeyValues({ items }: { items: KeyValue[] }) {
  return (
    <dl className="key-values">
      {items.map((item) => (
        <div key={item.term} style={{ display: "contents" }}>
          <dt>{item.term}</dt>
          <dd>{item.emphasis ? <strong>{item.value}</strong> : item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface DetailProps {
  recordId: string;
  onBack: () => void;
  onOpenMatch: () => void;
}

/* ==========================================================================
   Research asset
   ========================================================================== */

function ResearchAsset({ recordId, onBack, onOpenMatch }: DetailProps) {
  const asset = ASSET_DETAILS[recordId] ?? ASSET_DETAILS["RA-2026-0417"];
  const [reviewRequested, setReviewRequested] = useState(false);

  useEffect(() => setReviewRequested(false), [asset.id]);

  return (
    <div className="page shell-width">
      <button className="breadcrumb" onClick={onBack}>
        <CornerUpLeft aria-hidden="true" />
        Discovery / <code>{asset.id}</code>
      </button>

      <div className="detail-grid">
        <div className="content-stack">
          <div className="detail-hero">
            <div className="pill-row">
              {asset.tags.map((tag) => (
                <Pill key={tag.label} tone={tag.tone}>
                  {tag.label}
                </Pill>
              ))}
            </div>
            {/* Neutral wording: some records on this screen are explicitly
                unverified, and the label must not over-claim. */}
            <span className="eyebrow">Research asset record</span>
            <h1>{asset.title}</h1>
            <p>{asset.standfirst}</p>
          </div>

          <Panel
            title="Evidence"
            flush
            aside={
              <Pill>
                {asset.evidence.length} items
                {asset.gatedCount > 0 ? ` · ${asset.gatedCount} gated` : ""}
              </Pill>
            }
          >
            {asset.evidence.map((item) => (
              <div className="evidence-item" key={item.title}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.meta}</p>
                </div>
                <Pill tone={item.tag.tone}>{item.tag.label}</Pill>
              </div>
            ))}
          </Panel>

          {asset.disclosure ? (
            <div className="notice reveal">
              <span className="notice__icon" aria-hidden="true">
                <CircleAlert />
              </span>
              <strong>{asset.disclosure.headline}</strong>
              <p>{asset.disclosure.body}</p>
              {reviewRequested ? (
                <Pill tone="action">Review requested · 10 Aug 2026</Pill>
              ) : (
                <Button onClick={() => setReviewRequested(true)}>Request disclosure review</Button>
              )}
            </div>
          ) : null}

          <Panel
            title="Contributors and rights"
            aside={<Pill tone="warning">TTO review pending</Pill>}
          >
            <KeyValues items={asset.rights} />
          </Panel>
        </div>

        <aside className="side-stack">
          <div className="side-card side-card--accent">
            <span className="eyebrow">Next validation step</span>
            <h2>{asset.nextStep.heading}</h2>
            <p>{asset.nextStep.body}</p>
            <strong className="price">{asset.nextStep.price}</strong>
            {asset.matchId ? (
              <Button variant="primary" full onClick={onOpenMatch}>
                Open match room
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : (
              <Pill tone="warning">No funded brief paired yet</Pill>
            )}
          </div>

          <div className="side-card">
            <span className="eyebrow">Still needed</span>
            <ul>
              {asset.needs.map((need) => (
                <li key={need}>{need}</li>
              ))}
            </ul>
          </div>

          <div className="side-card">
            <span className="eyebrow">Version history</span>
            <ul>
              {asset.versions.map((version) => (
                <li key={version} className="mono">
                  {version}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ==========================================================================
   Problem brief
   ========================================================================== */

function ProblemBrief({ recordId, onBack, onOpenMatch }: DetailProps) {
  const brief = BRIEF_DETAILS[recordId] ?? BRIEF_DETAILS["PB-2026-0088"];

  return (
    <div className="page shell-width">
      <button className="breadcrumb" onClick={onBack}>
        <CornerUpLeft aria-hidden="true" />
        Discovery / <code>{brief.id}</code>
      </button>

      <div className="detail-grid">
        <div className="content-stack">
          <div className="detail-hero">
            <div className="pill-row">
              {brief.tags.map((tag) => (
                <Pill key={tag.label} tone={tag.tone}>
                  {tag.label}
                </Pill>
              ))}
            </div>
            <span className="eyebrow">Funded problem brief</span>
            <h1>{brief.title}</h1>
            <p>{brief.standfirst}</p>
          </div>

          <div className="metric-pair reveal">
            <div>
              <span className="eyebrow">{brief.metric.label}</span>
              <strong>{brief.metric.value}</strong>
              <span>{brief.metric.note}</span>
            </div>
            <div>
              <span className="eyebrow">{brief.owner.label}</span>
              <strong>{brief.owner.value}</strong>
              <span>{brief.owner.note}</span>
            </div>
          </div>

          <Panel title="Terms on the table">
            <KeyValues items={brief.terms} />
          </Panel>
        </div>

        <aside className="side-stack">
          <div className="side-card side-card--accent">
            <span className="eyebrow">Shortlist</span>
            <h2>{brief.shortlist.heading}</h2>
            <p>{brief.shortlist.body}</p>
            {brief.matchId ? (
              <Button variant="primary" full onClick={onOpenMatch}>
                Review top match
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : (
              <Pill tone="warning">Sourcing in progress</Pill>
            )}
          </div>

          <div className="side-card">
            <span className="eyebrow">Why this is fundable</span>
            <ul>
              {brief.fundable.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ==========================================================================
   Match room
   ========================================================================== */

function MatchRoom() {
  const [openRequirement, setOpenRequirement] = useState<string | null>("R3");
  const [ndaSigned, setNdaSigned] = useState(false);
  const [milestoneFunded, setMilestoneFunded] = useState(false);
  const [milestoneOutcome, setMilestoneOutcome] = useState<"pending" | "passed" | "failed">(
    "pending",
  );

  /* Derived, so the headline can never drift from the requirement data. */
  const counts = useMemo(() => {
    const tally: Record<Requirement["status"], number> = { met: 0, partial: 0, gap: 0, pending: 0 };
    for (const requirement of REQUIREMENTS) tally[requirement.status] += 1;
    return tally;
  }, []);

  const summary = `${counts.met} met · ${counts.partial} partial · ${counts.gap} gap · ${counts.pending} on sponsor`;

  return (
    <div className="page shell-width">
      <PageIntro eyebrow="Evidence-led match room" title="RA-2026-0417 against PB-2026-0088">
        No opaque composite score. Every requirement is connected to evidence, a named gap, and the
        party responsible for the next move.
      </PageIntro>

      <div className="detail-grid">
        <div className="content-stack">
          <div className="coverage reveal">
            <div className="coverage__top">
              <div>
                <span className="eyebrow">Requirement coverage</span>
                <h2>{summary}</h2>
                <p className="coverage__count">
                  {REQUIREMENTS.length} requirements drawn from the brief, each assessed against
                  published evidence
                </p>
              </div>
              <Pill tone="warning">Proceed with validation</Pill>
            </div>

            <div className="coverage__bar" aria-hidden="true">
              {REQUIREMENTS.map((item, index) => (
                <span
                  key={item.id}
                  className={`is-${item.status}`}
                  style={{ "--i": index } as React.CSSProperties}
                />
              ))}
            </div>

            <div className="coverage__legend">
              {(Object.keys(STATUS_LABELS) as Array<Requirement["status"]>).map((status) => (
                <span key={status}>
                  <i style={{ background: `var(--${status})` }} />
                  {STATUS_LABELS[status]} ({counts[status]})
                </span>
              ))}
            </div>
          </div>

          <Panel title="Line-by-line evidence" flush aside={<Pill>Expand any requirement</Pill>}>
            {REQUIREMENTS.map((item) => {
              const isOpen = openRequirement === item.id;
              return (
                <div
                  className={`requirement requirement--${item.status}`}
                  data-open={isOpen}
                  key={item.id}
                >
                  <button
                    aria-expanded={isOpen}
                    onClick={() => setOpenRequirement(isOpen ? null : item.id)}
                  >
                    <span className="requirement__label">
                      <strong>{item.requirement}</strong>
                      <span>{item.evidence}</span>
                    </span>
                    <span className="requirement__aside">
                      <Pill tone={STATUS_TONE[item.status]}>{STATUS_LABELS[item.status]}</Pill>
                      <ChevronDown className="requirement__chevron" aria-hidden="true" />
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="requirement__detail">
                      <p>{item.detail}</p>
                      {item.resolution ? (
                        <div className="requirement__resolution">
                          <strong>Resolution</strong>
                          <span>{item.resolution}</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </Panel>

          <Panel
            title="Confidential materials"
            aside={
              <Pill tone={ndaSigned ? "verified" : "action"}>
                {ndaSigned ? "NDA countersigned" : "NDA not signed"}
              </Pill>
            }
          >
            {ndaSigned ? (
              <div className="vault vault--open">
                <span className="vault__icon" aria-hidden="true">
                  <LockOpen />
                </span>
                <strong>Sensor mount geometry and conditioning circuit</strong>
                <p>
                  Accessible to two named sponsor recipients. Every open is logged for the research
                  team and the institution.
                </p>
                <Button>Open controlled data room</Button>
              </div>
            ) : (
              <div className="vault vault--locked">
                <span className="vault__icon" aria-hidden="true">
                  <Lock />
                </span>
                <strong>One technical dossier is gated</strong>
                <p>It unlocks only for named recipients after the mutual NDA is countersigned.</p>
                <Button variant="primary" onClick={() => setNdaSigned(true)}>
                  Countersign demo NDA
                </Button>
              </div>
            )}
          </Panel>

          <Panel title="Milestones and escrow" flush aside={<Pill>₹6,00,000 committed</Pill>}>
            {MILESTONES.map((milestone) => (
              <div className="milestone" data-active={milestone.active} key={milestone.id}>
                <span className="milestone__number">{milestone.id}</span>
                <div>
                  <strong>{milestone.title}</strong>
                  <p>{milestone.detail}</p>
                </div>
                <div className="milestone__value">
                  <strong>{milestone.value}</strong>
                  <Pill
                    tone={
                      milestone.active
                        ? milestoneOutcome === "failed"
                          ? "missing"
                          : milestoneFunded
                            ? "verified"
                            : "action"
                        : "neutral"
                    }
                  >
                    {milestone.active && milestoneOutcome === "failed"
                      ? "Criterion not met"
                      : milestone.active && milestoneOutcome === "passed"
                        ? "Accepted"
                        : milestone.active && milestoneFunded
                          ? "Funded"
                          : milestone.state}
                  </Pill>
                </div>
              </div>
            ))}
          </Panel>

          {milestoneFunded ? (
            <Panel
              title="Outcome and closure"
              aside={
                <Pill
                  tone={
                    milestoneOutcome === "passed"
                      ? "verified"
                      : milestoneOutcome === "failed"
                        ? "missing"
                        : "action"
                  }
                >
                  {milestoneOutcome === "passed"
                    ? "Success branch"
                    : milestoneOutcome === "failed"
                      ? "Failure branch"
                      : "Reviewer decision due"}
                </Pill>
              }
            >
              {milestoneOutcome === "pending" ? (
                <div className="outcome-prompt">
                  <div>
                    <strong>Frozen criterion</strong>
                    <p>
                      Detect at least 80% of held-out failures 72 hours ahead, below one false alarm
                      per machine-month, on the four named production machines.
                    </p>
                  </div>
                  <p className="outcome-prompt__rule">
                    The technical result and payment decision are separate. Accepted work is paid
                    even if the criterion is not met; unused pass-through costs return.
                  </p>
                  <div className="outcome-actions" aria-label="Record demonstration outcome">
                    <Button variant="primary" onClick={() => setMilestoneOutcome("passed")}>
                      Record criterion met
                    </Button>
                    <Button onClick={() => setMilestoneOutcome("failed")}>
                      Record criterion not met
                    </Button>
                  </div>
                </div>
              ) : milestoneOutcome === "passed" ? (
                <div className="closure-state closure-state--success" aria-live="polite">
                  <BadgeCheck aria-hidden="true" />
                  <div>
                    <strong>M1 accepted · M2 unlocked</strong>
                    <p>
                      The evidence package met the frozen criterion. ₹1,10,000 is released and the
                      blind-validation milestone may begin.
                    </p>
                    <Button onClick={() => setMilestoneOutcome("pending")}>Reset demo outcome</Button>
                  </div>
                </div>
              ) : (
                <div className="failure-closure" aria-live="polite">
                  <div className="closure-state closure-state--failure">
                    <CircleAlert aria-hidden="true" />
                    <div>
                      <strong>M1 completed; criterion not met</strong>
                      <p>
                        Detection reached 61% at 72 hours. The result does not support deployment,
                        but it establishes a reusable boundary instead of disappearing as a failed
                        pilot.
                      </p>
                    </div>
                  </div>
                  <dl className="closure-grid">
                    <div>
                      <dt>Boundary published</dt>
                      <dd>
                        Clamp-on sensing on this machine class does not meet the 72-hour threshold
                        without a damped mount or spindle-speed input.
                      </dd>
                    </div>
                    <div>
                      <dt>Evidence retained</dt>
                      <dd>Four-machine dataset · signed report · criterion version M1-v1</dd>
                    </div>
                    <div>
                      <dt>Payment allocation</dt>
                      <dd>₹82,000 accepted work released · ₹28,000 unused costs returned · ₹0 disputed</dd>
                    </div>
                    <div>
                      <dt>Workflow consequence</dt>
                      <dd>M2 blocked · match closed · asset remains discoverable with boundary</dd>
                    </div>
                  </dl>
                  <div className="outcome-actions">
                    <Button onClick={() => setMilestoneOutcome("pending")}>Reset demo outcome</Button>
                  </div>
                </div>
              )}
            </Panel>
          ) : null}
        </div>

        <aside className="side-stack">
          <div className="side-card side-card--accent">
            <span className="eyebrow">Cheapest decisive next step</span>
            <h2>Fund M1 only</h2>
            <p>
              Three weeks and ₹1,10,000 answers the question that decides everything else: does rig
              precision survive the production floor?
            </p>
            {milestoneOutcome === "failed" ? (
              <Pill tone="missing">M1 closed · M2 blocked</Pill>
            ) : milestoneOutcome === "passed" ? (
              <Pill tone="verified">M1 accepted · M2 unlocked</Pill>
            ) : milestoneFunded ? (
              <Pill tone="verified">M1 funded · outcome due</Pill>
            ) : (
              <Button
                variant="primary"
                full
                onClick={() => {
                  setMilestoneFunded(true);
                  setMilestoneOutcome("pending");
                }}
              >
                Fund milestone 1
                <ArrowUpRight aria-hidden="true" />
              </Button>
            )}
          </div>

          <div className="side-card">
            <span className="eyebrow">What would kill this match</span>
            <ul>
              <li>Institution refuses field-of-use exclusivity</li>
              <li>Model cannot fit the ARM gateway</li>
              <li>Historical logs are not labelled</li>
            </ul>
          </div>

          <div className="side-card">
            <span className="eyebrow">Open with the institution</span>
            <p>
              The exclusivity request exceeds the standing template. It blocks a licence — not the
              first validation milestone.
            </p>
            <Pill tone="warning">TTO response pending</Pill>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ==========================================================================
   Shell
   ========================================================================== */

type Theme = "light" | "dark";

interface Location {
  screen: Screen;
  recordId: string | null;
}

function parseHash(): Location {
  const [rawScreen, rawId] = window.location.hash.replace(/^#/, "").split("/");
  const screen = (SCREENS as string[]).includes(rawScreen) ? (rawScreen as Screen) : "discovery";
  return { screen, recordId: rawId ?? null };
}

function readInitialTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Runs an update inside a view transition where the browser and the user allow it. */
function withTransition(apply: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && typeof document.startViewTransition === "function") {
    document.startViewTransition(() => flushSync(apply));
  } else {
    apply();
  }
}

export default function App() {
  const initial = parseHash();
  const [screen, setScreen] = useState<Screen>(initial.screen);
  const [assetId, setAssetId] = useState(
    initial.screen === "asset" && initial.recordId ? initial.recordId : "RA-2026-0417",
  );
  const [briefId, setBriefId] = useState(
    initial.screen === "brief" && initial.recordId ? initial.recordId : "PB-2026-0088",
  );
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("setu-theme", theme);
    } catch {
      /* private browsing — the choice simply will not persist */
    }
  }, [theme]);

  const applyLocation = useCallback((location: Location) => {
    setScreen(location.screen);
    if (location.recordId) {
      if (location.screen === "asset") setAssetId(location.recordId);
      if (location.screen === "brief") setBriefId(location.recordId);
    }
    window.scrollTo({ top: 0 });
  }, []);

  const navigate = useCallback(
    (next: Screen, recordId?: string) => {
      const hash = recordId ? `#${next}/${recordId}` : `#${next}`;
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      withTransition(() => applyLocation({ screen: next, recordId: recordId ?? null }));
    },
    [applyLocation],
  );

  /* Browser back and forward stay meaningful — a director will reach for them. */
  useEffect(() => {
    function sync() {
      withTransition(() => applyLocation(parseHash()));
    }
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [applyLocation]);

  const openRecord = useCallback(
    (record: DiscoveryRecord) => navigate(record.type === "asset" ? "asset" : "brief", record.id),
    [navigate],
  );

  /* Keyboard model. Premium products are interaction-dense, not pixel-dense. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        Boolean(target?.isContentEditable);

      if ((event.key === "/" || (event.key === "k" && (event.metaKey || event.ctrlKey))) && !typing) {
        event.preventDefault();
        if (screen !== "discovery") navigate("discovery");
        requestAnimationFrame(() => searchRef.current?.focus());
        return;
      }
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < SCREENS.length) {
        navigate(SCREENS[index]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, screen]);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease: [0.2, 0, 0.38, 0.9] }}>
      <div className="app-shell">
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <div className="context-strip">
          <div className="shell-width">
            <span>
              National research-to-requirement exchange · <b>Founding NIT cohort</b>
            </span>
            <span className="context-strip__demo">Prototype · demonstration records</span>
          </div>
        </div>

        <header className="app-header">
          <div className="masthead shell-width">
            <div className="brand">
              <Seal className="brand__seal" />
              <div className="brand__text">
                <div className="brand__name">
                  Anusandhan Setu
                  <span className="brand__deva" lang="hi">
                    अनुसंधान सेतु
                  </span>
                </div>
                <span className="brand__line">
                  Verified research → funded validation → pilot, licence, payout
                </span>
              </div>
            </div>
            <div className="header-tools">
              <kbd className="kbd">1–4</kbd>
              <ThemeToggle
                theme={theme}
                onToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              />
            </div>
          </div>
          <ScreenNav active={screen} onChange={(next) => navigate(next)} />
        </header>

        <main id="main">
          {screen === "discovery" ? (
            <Discovery onOpenRecord={openRecord} searchRef={searchRef} />
          ) : null}
          {screen === "asset" ? (
            <ResearchAsset
              recordId={assetId}
              onBack={() => navigate("discovery")}
              onOpenMatch={() => navigate("match")}
            />
          ) : null}
          {screen === "brief" ? (
            <ProblemBrief
              recordId={briefId}
              onBack={() => navigate("discovery")}
              onOpenMatch={() => navigate("match")}
            />
          ) : null}
          {screen === "match" ? <MatchRoom /> : null}
        </main>

        <footer className="app-footer">
          <div className="shell-width">
            <div className="app-footer__mark">
              <Seal />
              <span>
                Anusandhan Setu
                <br />
                <span className="deva" lang="hi">
                  अनुसंधान सेतु
                </span>
              </span>
            </div>
            <p>
              <strong>Demonstration environment.</strong> Organisations, people, evidence and
              transactions shown here are illustrative. This prototype carries no government
              endorsement and is not affiliated with any ministry or institution. IP and ownership
              decisions require the institution’s own policy and qualified counsel.
            </p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
