# Anusandhan Setu — product requirements document v0.1

Status: alpha baseline. Product hypotheses must be revised after five industry conversations.

## Product decision

Build a narrow research-to-requirement exchange that lets a sponsor fund the smallest decisive validation step against a versioned problem brief and research asset. The system is not a universal repository, grant marketplace, patent service or automated procurement system.

## Users and jobs

- **Sponsor decision owner:** convert an operating problem into a fixed criterion; see evidence and gaps; fund a bounded step; receive a useful result even on failure.
- **Institution rights authority:** control disclosure and ownership decisions without becoming a catalogue bottleneck.
- **Research contributor/faculty:** present claims with evidence, declare rights, price the next step, retain attribution and record validation boundaries.
- **Platform operator:** curate records, enforce gates, route actions and measure conversion without making legal or scientific decisions.

## Alpha scope

1. Identity and institution authority.
2. Versioned problem briefs and research assets.
3. Per-item evidence provenance and disclosure state.
4. Contributor/rights ledger.
5. Requirement-to-evidence coverage with no opaque score.
6. Priced next validation step with sponsor inputs, frozen criterion and failure meaning.
7. Controlled data room and access log.
8. Milestone funding record—not custody of funds unless separately authorised.
9. Success and failure closure, including payment allocation and a published validation boundary.
10. Append-only audit events and outcome analytics.

## Primary workflow and gates

`Brief accepted → candidates sourced → rights/disclosure cleared → coverage reviewed → next step quoted → sponsor inputs cleared → milestone funded → result reviewed → success or failure closure → pilot/licence or archived boundary.`

Blocking states are first-class. A missing sponsor input is not attributed to the research team; `unreviewed` disclosure cannot transact; a failed criterion does not erase completed work.

## Functional acceptance criteria

- Every result card routes to its own stable URL and browser back/forward restores state.
- A transaction button is unavailable while disclosure, ownership or required sponsor inputs are blocking.
- Funding freezes the brief, asset, criterion, price and failure rule versions.
- A reviewer can record `met` or `not met` with an evidence reference; `not met` requires a validation boundary.
- Closure shows released, returned and disputed amounts whose sum equals committed funds.
- Negative results remain discoverable to authorised users and affect later coverage assessments.
- Demonstration data is visibly labelled and cannot be mistaken for an endorsement or executed transaction.

## Metrics

| Metric | Definition | Alpha target |
| --- | --- | ---: |
| Brief authoring active hours | Sum of timed author/reviewer work | Measure; initial hypothesis ≤8 h |
| Brief acceptance elapsed days | First interview to owner acceptance | Measure; hypothesis ≤10 days |
| Candidate-to-cleared rate | Institution-cleared assets / contacted candidates | Measure baseline |
| Match-to-funded rate | Funded first steps / sponsor-reviewed matches | ≥20% directional |
| Median first-step value | Committed amount for M1 | Must exceed delivery cost |
| Sponsor-input delay | Days blocked on required sponsor inputs | Visible, not blended with team time |
| Failure usefulness | Failed steps with accepted boundary / failed steps | 100% |
| Closure integrity | Closures where allocation equals committed amount | 100% |

## Non-functional requirements

- WCAG 2.2 AA target; keyboard and reduced-motion support.
- India-region deployment decision documented; encrypt transit and storage; least privilege.
- No public object URL for NDA-only evidence; signed, expiring access with audit.
- Append-only decision events; reconstruct any transaction from frozen versions.
- Money stored in integer minor units; dates and timestamps typed and validated.
- Recovery objectives for alpha: RPO 24 hours, RTO 8 hours; tighten before production.

## Explicitly deferred

Automated escrow/banking, royalty payouts, patent filing, general grant discovery, universal crawling, black-box match scores, complex procurement automation, and production personal-data ingestion.

## Release gates

- Five WTP conversations meet the discovery exit rule.
- Three real briefs accepted with measured hours.
- At least 15 candidates and five institution-cleared assets.
- Counsel approves the legal pack and money-flow representation.
- Threat model and data protection review complete.
- One sponsor and one institution complete the failure branch usability test.
