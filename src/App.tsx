import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  FlaskConical,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Button, PageIntro, Pill, ScreenNav, Section } from "./components";
import { DISCOVERY_RECORDS, REQUIREMENTS } from "./data";
import type { DiscoveryRecord, Requirement, Screen, Tone } from "./types";

const FILTERS = [
  { id: "software", label: "Software & AI" },
  { id: "industrial", label: "Industrial sustainability" },
  { id: "brief", label: "Funded briefs" },
  { id: "asset", label: "Research assets" },
  { id: "trl", label: "TRL 4 and above" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const STATUS_META: Record<Requirement["status"], { label: string; tone: Tone }> = {
  met: { label: "Met", tone: "verified" },
  partial: { label: "Partial", tone: "warning" },
  gap: { label: "Not evidenced", tone: "missing" },
  pending: { label: "On sponsor", tone: "action" },
};

function Discovery({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
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
      return `${record.title} ${record.organisation} ${record.summary} ${record.reason}`
        .toLowerCase()
        .includes(deferredQuery);
    });
  }, [deferredQuery, filters]);

  function toggleFilter(id: FilterId) {
    setFilters((current) => {
      const next = new Set(current);
      const mutuallyExclusive: Partial<Record<FilterId, FilterId>> = {
        software: "industrial",
        industrial: "software",
        brief: "asset",
        asset: "brief",
      };
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        const opposite = mutuallyExclusive[id];
        if (opposite) next.delete(opposite);
      }
      return next;
    });
  }

  function openRecord(record: DiscoveryRecord) {
    onNavigate(record.type === "asset" ? "asset" : "brief");
  }

  return (
    <div className="page">
      <section className="discovery-hero">
        <div className="discovery-hero__copy">
          <div className="hero-kicker"><Sparkles size={14} /> Founding NIT exchange · director preview</div>
          <p className="eyebrow">Problem-led discovery</p>
          <h1>Research should meet demand <em>before</em> it gathers dust.</h1>
          <p>One trusted exchange for institutes to present evidence, industry to fund the next validation step, and government to see measurable outcomes.</p>
          <div className="hero-signals" aria-label="Pilot signals">
            <span><strong>20</strong> deeply verified assets</span>
            <span><strong>5</strong> funded problem briefs</span>
            <span><strong>90</strong> day founding pilot</span>
          </div>
        </div>
        <ExchangeGraphic />
      </section>

      <div className="search-panel" role="search">
        <label className="sr-only" htmlFor="research-search">Search problems and research assets</label>
        <div className="search-field"><Search size={18} aria-hidden="true" /><input
            id="research-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Describe an operating problem or search the exchange"
          /></div>
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
        <span>{records.length} records</span>
        <span>Problem briefs and research assets share one evidence standard</span>
      </div>

      <div className="result-grid">
        {records.map((record, index) => {
          const hasDetail = record.id === "PB-2026-0088" || record.id === "RA-2026-0417";
          const CardElement = hasDetail ? motion.button : motion.article;
          return (
          <CardElement
            className="result-card"
            data-preview={!hasDetail}
            key={record.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.035, 0.18) }}
            {...(hasDetail ? { onClick: () => openRecord(record) } : {})}
          >
            <div className="result-card__top">
              <div>
                <div className="pill-row">
                  <Pill tone={record.type === "brief" ? "action" : "neutral"}>
                    {record.type === "brief" ? "Funded problem" : "Research asset"}
                  </Pill>
                  <Pill tone="verified">{record.signal}</Pill>
                  {!hasDetail ? <Pill>Catalogue preview</Pill> : null}
                </div>
                <h2>{record.title}</h2>
              </div>
              <span className="record-value">{record.value}</span>
            </div>
            <p className="record-meta">{record.organisation} · {record.id}</p>
            <p className="record-summary">{record.summary}</p>
            <div className="why-match"><strong>Why it surfaced</strong><span>{record.reason}</span>{hasDetail ? <ArrowUpRight size={16} aria-hidden="true" /> : null}</div>
          </CardElement>
        );})}
        {records.length === 0 ? (
          <div className="empty-state"><h2>No exact match yet</h2><p>Clear a filter or publish a funded problem brief so a curator can source candidates.</p></div>
        ) : null}
      </div>
    </div>
  );
}

function ExchangeGraphic() {
  return (
    <div className="exchange-graphic" aria-label="Research, evidence and demand connected through Anusandhan Setu">
      <div className="exchange-graphic__mesh" aria-hidden="true" />
      <div className="exchange-node exchange-node--research"><FlaskConical size={20} /><span>Research</span><strong>Institution verified</strong></div>
      <div className="exchange-node exchange-node--evidence"><ShieldCheck size={22} /><span>Evidence</span><strong>Gaps made explicit</strong></div>
      <div className="exchange-node exchange-node--demand"><Building2 size={20} /><span>Demand</span><strong>Budget attached</strong></div>
      <svg viewBox="0 0 520 300" aria-hidden="true">
        <motion.path d="M118 94 C210 18 298 18 397 94" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, delay: .2 }} />
        <motion.path d="M118 101 C194 187 300 190 397 101" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, delay: .32 }} />
      </svg>
      <div className="exchange-proof"><CheckCircle2 size={16} /><span><strong>₹1.10L</strong> cheapest decisive next step</span></div>
    </div>
  );
}

function ResearchAsset({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [reviewRequested, setReviewRequested] = useState(false);

  return (
    <div className="page">
      <button className="breadcrumb" onClick={() => onNavigate("discovery")}>← Discovery / RA-2026-0417 · v3</button>
      <div className="detail-grid">
        <div className="content-stack">
          <div className="detail-hero">
            <div className="pill-row">
              <Pill tone="verified">Faculty attested</Pill><Pill tone="action">Gated dossier</Pill>
              <Pill>TRL 4</Pill><Pill tone="warning">Provisional filed</Pill>
            </div>
            <p className="eyebrow">Verified research asset</p>
            <h1>Retrofit vibration diagnostics for bearing and spindle faults</h1>
            <p>A clamp-on sensor and classifier for legacy CNC machines. Validated on an instrumented rig; not yet validated on a production floor.</p>
          </div>

          <Section title="Evidence" aside={<Pill>4 items · 1 gated</Pill>}>
            <div className="evidence-list">
              <EvidenceItem title="Test-rig dataset" meta="42 runs · three seeded fault classes · labelled protocol" tag="Public" />
              <EvidenceItem title="Classifier code and evaluation notebook" meta="MIT-licensed repository · dependency manifest attached" tag="Public" />
              <EvidenceItem title="Bench validation report" meta="Precision 0.93 / recall 0.88 · signed by faculty mentor" tag="Attested" />
              <EvidenceItem title="Mount geometry and conditioning circuit" meta="Held back under provisional filing" tag="NDA required" warning />
            </div>
          </Section>

          <div className="notice notice--warning">
            <span aria-hidden="true">!</span>
            <div>
              <strong>Public disclosure may affect patentability.</strong>
              <p>The mount geometry and conditioning circuit remain gated until the institution’s innovation cell or counsel clears release.</p>
              {reviewRequested ? <Pill tone="action">Review requested · 10 Aug 2026</Pill> : <Button onClick={() => setReviewRequested(true)}>Request disclosure review</Button>}
            </div>
          </div>

          <Section title="Contributors and rights" aside={<Pill tone="warning">TTO review pending</Pill>}>
            <dl className="key-values">
              <dt>Contributors</dt><dd>A. Kulkarni 55% · R. Iyer 20% · Prof. S. Deshpande 15% · workshop staff 10%</dd>
              <dt>Institution</dt><dd>Government engineering college, Pune district · institutional identity verified</dd>
              <dt>Resources used</dt><dd>Institutional vibration rig and department consumables; no external sponsor</dd>
              <dt>Ownership</dt><dd>Institution policy may claim ownership because facilities were used. Not yet confirmed in writing for this asset.</dd>
              <dt>Revenue rule</dt><dd>Draft only: inventors 40 · department 15 · institution 45, applied to net licence income after filing costs.</dd>
            </dl>
          </Section>
        </div>

        <aside className="side-stack">
          <div className="side-card side-card--accent">
            <div className="side-card__icon"><CircleDollarSign size={18} /></div>
            <p className="eyebrow">Next validation step</p>
            <h2>Four production machines, three weeks</h2>
            <p>Test whether rig precision survives vibration noise, coolant mist and thermal drift.</p>
            <strong className="price">₹1,10,000</strong>
            <Button variant="primary" onClick={() => onNavigate("match")}>Open match room →</Button>
          </div>
          <div className="side-card">
            <p className="eyebrow">Still needed</p>
            <ul><li>Six months of labelled logs</li><li>ARM gateway with 512 MB RAM</li><li>Metrology support</li></ul>
          </div>
          <div className="side-card">
            <p className="eyebrow">Version history</p>
            <p className="mono">v3 · bench report added<br />v2 · provisional recorded<br />v1 · asset created</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EvidenceItem({ title, meta, tag, warning = false }: { title: string; meta: string; tag: string; warning?: boolean }) {
  return <div className="evidence-item"><div><strong>{title}</strong><p>{meta}</p></div><Pill tone={warning ? "warning" : "verified"}>{tag}</Pill></div>;
}

function ProblemBrief({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="page">
      <button className="breadcrumb" onClick={() => onNavigate("discovery")}>← Discovery / PB-2026-0088</button>
      <div className="detail-grid">
        <div className="content-stack">
          <div className="detail-hero">
            <div className="pill-row"><Pill tone="verified">Budget confirmed</Pill><Pill tone="action">6 teams invited</Pill><Pill>Pilot → procurement</Pill></div>
            <p className="eyebrow">Funded problem brief</p>
            <h1>Cut unplanned spindle downtime across a 40-machine shop floor</h1>
            <p>Failures are discovered after parts move out of tolerance, costing approximately 11 machine-days each quarter in scrap and rework.</p>
          </div>

          <div className="metric-pair">
            <div><p className="eyebrow">Success metric</p><strong>≥80% detection at least 72 hours ahead</strong><span>Below one false alarm per machine-month</span></div>
            <div><p className="eyebrow">Decision owner</p><strong>Head of Maintenance Engineering</strong><span>Accepts milestones and signs the pilot decision</span></div>
          </div>

          <Section title="Terms on the table">
            <dl className="key-values">
              <dt>Budget</dt><dd><strong>₹6,00,000</strong> across three acceptance-based milestones</dd>
              <dt>Timeline</dt><dd>10 weeks to pilot decision · window opens 1 September 2026</dd>
              <dt>Data access</dt><dd>Historical logs under NDA, on-site only; live access requires a data-sharing agreement</dd>
              <dt>Operating context</dt><dd>Two shifts · 38–44 °C · ARM gateways · no cloud egress</dd>
              <dt>IP posture</dt><dd>Three-year field-of-use exclusivity requested; background IP remains with its current owner</dd>
              <dt>Out of scope</dt><dd>Machine replacement, PLC firmware changes and spindle teardown</dd>
            </dl>
          </Section>
        </div>

        <aside className="side-stack">
          <div className="side-card side-card--accent">
            <div className="side-card__icon"><FileCheck2 size={18} /></div>
            <p className="eyebrow">Shortlist</p><h2>3 of 6 teams responded</h2>
            <p>One candidate has evidence for the mechanical constraints but needs production-floor validation.</p>
            <Button variant="primary" onClick={() => onNavigate("match")}>Review top match →</Button>
          </div>
          <div className="side-card"><p className="eyebrow">Why this is fundable</p><ul><li>Named decision owner</li><li>Allocated cost centre</li><li>Validation path under six months</li><li>Adoption route stated up front</li></ul></div>
        </aside>
      </div>
    </div>
  );
}

function MatchRoom() {
  const [openRequirement, setOpenRequirement] = useState<string | null>("R3");
  const [ndaSigned, setNdaSigned] = useState(false);
  const [milestoneFunded, setMilestoneFunded] = useState(false);
  const coverage = useMemo(() => {
    const counts = { met: 0, partial: 0, gap: 0, pending: 0 };
    for (const requirement of REQUIREMENTS) counts[requirement.status] += 1;
    return counts;
  }, []);

  return (
    <div className="page">
      <PageIntro eyebrow="Evidence-led match room" title="RA-2026-0417 against PB-2026-0088">
        No opaque composite score. Every requirement is connected to evidence, a gap and the party responsible for the next move.
      </PageIntro>
      <div className="detail-grid">
        <div className="content-stack">
          <div className="coverage-card">
            <div className="coverage-card__top"><div><p className="eyebrow">Requirement coverage</p><h2>{coverage.met} met · {coverage.partial} partial · {coverage.gap} gap · {coverage.pending} on sponsor</h2></div><Pill tone="warning">Proceed with validation</Pill></div>
            <div className="coverage-bar" aria-label="Two requirements met, two partial, one not evidenced, one waiting on sponsor">
              {REQUIREMENTS.map((item, index) => <motion.span key={item.id} className={`coverage-bar__${item.status}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .18 + index * .055 }} />)}
            </div>
          </div>

          <Section title="Line-by-line evidence" aside={<Pill>Expand any requirement</Pill>}>
            <div className="requirements">
              {REQUIREMENTS.map((item) => {
                const isOpen = openRequirement === item.id;
                const meta = STATUS_META[item.status];
                return (
                  <div className={`requirement requirement--${item.status}`} key={item.id}>
                    <button aria-expanded={isOpen} onClick={() => setOpenRequirement(isOpen ? null : item.id)}>
                      <div><strong>{item.requirement}</strong><span>{item.evidence}</span></div>
                      <div><Pill tone={meta.tone}>{meta.label}</Pill><span aria-hidden="true">{isOpen ? "−" : "+"}</span></div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen ? <motion.div className="requirement__detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{item.detail}</p>{item.resolution ? <p><strong>Resolution:</strong> {item.resolution}</p> : null}</motion.div> : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="Confidential materials" aside={<Pill tone={ndaSigned ? "verified" : "action"}>{ndaSigned ? "NDA countersigned" : "NDA not signed"}</Pill>}>
            <AnimatePresence mode="wait" initial={false}>
              {ndaSigned ? (
                <motion.div key="unlocked" className="unlocked" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><CheckCircle2 size={20} /><strong>Sensor mount geometry and conditioning circuit</strong><p>Accessible to two named sponsor recipients. Every open is logged for the research team and institution.</p><Button>Open controlled data room</Button></motion.div>
              ) : (
                <motion.div key="locked" className="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LockKeyhole size={20} /><strong>One technical dossier is gated</strong><p>It unlocks only for named recipients after the mutual NDA is countersigned.</p><Button variant="primary" onClick={() => setNdaSigned(true)}>Countersign demo NDA</Button></motion.div>
              )}
            </AnimatePresence>
          </Section>

          <Section title="Milestones and escrow" aside={<Pill>₹6,00,000 committed</Pill>}>
            <div className="milestones">
              <Milestone number="M1" title="Shop-floor baseline" detail="4 machines · 3 weeks · baseline false-alarm rate" value="₹1,10,000" state={milestoneFunded ? "Funded" : "Ready to fund"} active />
              <Milestone number="M2" title="Blind validation" detail="72-hour target on held-out failures" value="₹2,40,000" state="Pending M1" />
              <Milestone number="M3" title="12-machine pilot" detail="Maintenance team runs it unassisted for 4 weeks" value="₹2,50,000" state="Pending M2" />
            </div>
          </Section>
        </div>

        <aside className="side-stack">
          <div className="side-card side-card--accent">
            <div className="side-card__icon"><CircleDollarSign size={18} /></div>
            <p className="eyebrow">Cheapest decisive next step</p>
            <h2>Fund M1 only</h2>
            <p>Three weeks and ₹1,10,000 answers the question that decides everything else: does rig precision survive the production floor?</p>
            {milestoneFunded ? <Pill tone="verified">M1 funded in demo escrow</Pill> : <Button variant="primary" onClick={() => setMilestoneFunded(true)}>Fund milestone 1</Button>}
          </div>
          <div className="side-card"><p className="eyebrow">What would kill this match</p><ul><li>Institution refuses field-of-use exclusivity</li><li>Model cannot fit the ARM gateway</li><li>Historical logs are not labelled</li></ul></div>
          <div className="side-card"><p className="eyebrow">Open with the institution</p><p>The exclusivity request exceeds the standing template. It blocks a licence—not the first validation milestone.</p><Pill tone="warning">TTO response pending</Pill></div>
        </aside>
      </div>
    </div>
  );
}

function Milestone({ number, title, detail, value, state, active = false }: { number: string; title: string; detail: string; value: string; state: string; active?: boolean }) {
  return <div className="milestone"><span className="milestone__number">{number}</span><div><strong>{title}</strong><p>{detail}</p></div><div className="milestone__value"><strong>{value}</strong><Pill tone={active ? "verified" : "neutral"}>{state}</Pill></div></div>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const candidate = window.location.hash.slice(1) as Screen;
    return ["discovery", "asset", "brief", "match"].includes(candidate) ? candidate : "discovery";
  });

  function navigate(next: Screen) {
    setScreen(next);
    window.history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: .28, ease: [0.2, 0, 0.38, 0.9] }}>
      <div className="app-shell">
        <header className="app-header">
          <div className="institution-bar"><span>National research-to-requirement exchange</span><span><Landmark size={13} /> Founding NIT cohort · director demonstration</span></div>
          <div className="masthead">
            <div className="brand"><span className="brand__mark"><svg viewBox="0 0 44 44" aria-hidden="true"><path d="M7 28c5-14 25-14 30 0"/><circle cx="10" cy="26" r="3"/><circle cx="22" cy="19" r="3"/><circle cx="34" cy="26" r="3"/></svg></span><div><strong>Anusandhan Setu</strong><span>Verified research → funded validation → pilot, licence, payout</span></div></div>
            <div className="header-status"><span className="live-dot" /> Pilot environment <Pill tone="warning">Illustrative records</Pill></div>
          </div>
          <ScreenNav active={screen} onChange={navigate} />
        </header>
        <main>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={screen} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {screen === "discovery" ? <Discovery onNavigate={navigate} /> : null}
              {screen === "asset" ? <ResearchAsset onNavigate={navigate} /> : null}
              {screen === "brief" ? <ProblemBrief onNavigate={navigate} /> : null}
              {screen === "match" ? <MatchRoom /> : null}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="app-footer"><div><svg viewBox="0 0 44 24" aria-hidden="true"><path d="M2 21c6-23 34-23 40 0"/><circle cx="6" cy="17" r="2"/><circle cx="22" cy="6" r="2"/><circle cx="38" cy="17" r="2"/></svg><strong>Anusandhan Setu</strong></div><p><strong>Demonstration environment.</strong> Organisations, people, evidence and transactions are illustrative. IP and ownership decisions require the institution’s policy and qualified counsel.</p></footer>
      </div>
    </MotionConfig>
  );
}
