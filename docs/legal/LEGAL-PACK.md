# Anusandhan Setu — legal working pack v0.1

Status: **working draft for qualified Indian counsel**. This is not legal advice and must not be executed without review for the participating institution, counterparty, applicable IP policy, tax treatment, procurement route, the Digital Personal Data Protection Act, 2023 and rules then in force.

## 1. Document set and routing

| ID | Instrument | Parties | Used when | Must be settled before |
| --- | --- | --- | --- | --- |
| LP-01 | Institution Participation Agreement | Platform + institution | Institution joins the exchange | Any institutional record is transactable |
| LP-02 | Contributor and Rights Declaration | Contributors + institution | A research asset is submitted | Asset is shown to a sponsor |
| LP-03 | Disclosure Clearance | Institution rights authority | Evidence may be disclosed | Public, gated or NDA release |
| LP-04 | Mutual NDA and Data Room Schedule | Sponsor + institution/team | Confidential material is exchanged | Gated evidence opens |
| LP-05 | Validation SOW and Milestone Schedule | Sponsor + institution/team | A next validation step is funded | Money is committed |
| LP-06 | Data Sharing and Processing Schedule | Data provider + recipient/platform | Operational or personal data is used | Data is transferred or accessed |
| LP-07 | Pilot/Licence heads of terms | Rights owner + sponsor | Validation succeeds | Pilot or field-of-use licence begins |
| LP-08 | Failure and Closure Certificate | SOW parties | A milestone does not meet its criterion | Final payment, return and publication |

## 2. LP-01 — Institution Participation Agreement term sheet

1. **Authority.** The institution names an authorised signatory and a rights-clearance office. The platform may rely only on decisions recorded by those named roles.
2. **Service level.** Disclosure and ownership questions receive a decision within `[10]` working days; silence is never approval.
3. **Record authority.** Institution attestation confirms identity and the stated evidence only. It does not imply deployment fitness, endorsement or warranty.
4. **IP policy.** The institution supplies the policy version and clause used for each ownership decision. Conflicts are blocking states.
5. **Contributor protection.** Contributor shares and attribution cannot be changed without a versioned, signed amendment visible to affected contributors.
6. **Platform role.** The platform records provenance, access and decisions; it is not the research owner, employer, legal adviser, escrow bank or procurement authority.
7. **Fees.** `[subscription / success fee / no-fee pilot]`, taxes extra as applicable. No fee is netted from contributor proceeds unless expressly authorised.
8. **Records and audit.** Decision-relevant versions and controlled-access events are retained for `[seven]` years, subject to lawful deletion obligations.
9. **Security incident.** Notice to the other party without undue delay and within `[24]` hours of confirmed material impact.
10. **Term/exit.** Exit stops new transactions but preserves executed SOWs, audit history, confidentiality and accrued payment rights.
11. **Law/disputes.** India; escalation to authorised officers, then `[arbitration/courts]` at `[city]` after counsel review.

## 3. LP-02 — Contributor and Rights Declaration

Asset ID: `______`  Record version: `______`

- Contributors, roles and proposed shares: `______`
- Employment/student status when created: `______`
- Institutional facilities, funds or supervision used: `______`
- External sponsor, grant and prior agreement: `______`
- Third-party code, data, material and licence: `______`
- Prior public disclosure, including thesis, abstract, demo, repository and date: `______`
- Patent/design/copyright filing or review: `______`
- Known dispute, obligation or restriction: `______`
- Authority requested: `[public metadata / public evidence / NDA evidence / validation / licence]`

Declaration: each signatory confirms the statement is complete to their knowledge, will notify the institution of a material error, and understands that the institution—not the platform—makes the ownership and disclosure decision.

Signatures: contributor(s) `______`; faculty/PI `______`; institution authority `______`; dates `______`.

## 4. LP-03 — Disclosure Clearance

For each evidence item record exactly one state: `unreviewed`, `under_review`, `public_cleared`, `nda_only`, `embargoed_until`, or `blocked`.

| Field | Required value |
| --- | --- |
| Evidence item/version | `______` |
| Prior public disclosure and date | `______` |
| IP filing/reference | `______` |
| Third-party restrictions | `______` |
| Permitted audience and purpose | `______` |
| Redactions | `______` |
| Embargo expiry | `______` |
| Decision and reason | `______` |
| Authority, signature, date | `______` |

Warnings shown in-product must be approved by counsel. A platform operator cannot convert an unresolved state into clearance.

## 5. LP-04 — Mutual NDA and data-room schedule

- Mutual definition of confidential information with oral disclosure confirmation.
- Exclusions: independently known/developed, lawfully received, public without breach, compelled disclosure with permitted notice.
- Purpose limited to evaluating named asset/brief/match.
- Named recipients, least privilege, no credential sharing, download policy and access log.
- No licence or reverse engineering except the evaluation expressly described.
- Term `[3]` years; trade-secret duties while legally protected.
- Return/deletion certificate, subject to one archival legal copy.
- Injunctive relief and liability position to be settled by counsel.

Data-room schedule: recipients `______`; permitted files `______`; view/download `______`; expiry `______`; watermark `______`.

## 6. LP-05 — Validation SOW and milestone schedule

Every funded step must specify:

1. one falsifiable question;
2. baseline and test environment;
3. sponsor, institution, team and third-party inputs with due dates;
4. price basis, taxes and payment timing;
5. acceptance criterion frozen before funding;
6. evidence package and independent reviewer, if any;
7. success unlock;
8. **failure meaning and failure payment rule**;
9. background IP, validation outputs and improvement ownership;
10. publication, confidentiality, safety, access and stop-work rules.

Default demonstration rule—not a legal recommendation: accepted work is paid for even when the technical criterion fails; unperformed work and unused pass-through costs return to the sponsor. Replace with counsel-approved language in each SOW.

## 7. LP-06 — Data sharing and processing schedule

Record data categories, purpose, lawful basis/authority, data principals, controller/data fiduciary roles, processors, location, access, retention, deletion, cross-border transfer, security measures, incident contacts and whether automated decisions affect a person. Operational telemetry and personal data must not be mixed merely because both arrive from the sponsor.

No production personal data enters the demonstration environment. Use minimised, de-identified samples where feasible and prohibit re-identification.

## 8. LP-07 — Pilot/licence heads of terms

Non-binding except confidentiality, exclusivity during negotiation, costs and governing law if counsel so specifies. Define field, territory, term, background IP, improvements, source/model access, support, evaluation-to-production transition, fees/royalties, audit, sublicensing, warranties, indemnities, termination and post-termination rights. Procurement approval remains the sponsor's responsibility.

## 9. LP-08 — Failure and Closure Certificate

| Field | Entry |
| --- | --- |
| Engagement / milestone / frozen criterion | `______` |
| Evidence package hash and reviewer | `______` |
| Criterion met? | `yes / no` |
| If no, validated boundary established | `______` |
| Work accepted | `______` |
| Amount released / returned / disputed | `______` |
| Confidential/public result wording | `______` |
| Asset and match state after closure | `______` |
| Follow-on prohibited or permitted | `______` |
| Signatures and timestamps | `______` |

The negative result is append-only. A party may dispute its interpretation, but the platform does not erase that the test occurred or replace the frozen criterion after seeing the outcome.

## 10. Counsel decision log

| Question | Owner | Decision | Evidence/version | Date |
| --- | --- | --- | --- | --- |
| Platform regulatory role and money flow | Counsel | Open |  |  |
| Enforceability of milestone acceptance/failure rule | Counsel | Open |  |  |
| Institution/student IP policy conflicts | Institution counsel | Open |  |  |
| DPDP roles, notice and retention | Privacy counsel | Open |  |  |
| Tax/GST and withholding | Tax counsel | Open |  |  |
| Public-sector procurement constraints | Procurement counsel | Open |  |  |
