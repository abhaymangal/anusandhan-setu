# Source-backed candidate asset register

This register supplies **18 publicly sourced candidates** against the three demonstration brief themes. It satisfies the 15–20 sourcing target, not institutional transaction clearance. “Open evidence” is used only where the primary source states a public licence; rows marked for terms review have not passed that test. Neither state proves that a university can sign a validation SOW or license improvements. That final state requires LP-02 and LP-03.

| ID | Brief theme | Candidate asset | Provider/source | Public-release evidence | Initial fit question | State |
| --- | --- | --- | --- | --- | --- | --- |
| CA-001 | Spindle downtime | Case Western Reserve bearing datasets | [CWRU Bearing Data Center](https://engineering.case.edu/bearingdatacenter/download-data-file) | Primary university dataset page | Do seeded faults transfer to spindle geometry? | Source-backed; attestation required |
| CA-002 | Spindle downtime | IMS bearing run-to-failure dataset | [NASA Prognostics repository](https://www.nasa.gov/content/prognostics-center-of-excellence-data-set-repository) | Public agency repository terms | Can failure lead time be estimated from run-to-failure traces? | Source-backed; terms review required |
| CA-003 | Spindle downtime | Paderborn bearing dataset | [Paderborn University KAt Data Center](https://mb.uni-paderborn.de/en/kat/research/bearing-datacenter/data-sets-and-download) | Primary university publication | Does it cover operating-condition variation? | Source-backed; terms review required |
| CA-004 | Spindle downtime | pyVib vibration-analysis toolkit | [pyVib repository](https://github.com/ElsevierSoftwareX/SOFTX-D-16-00072) | Public source repository; licence file | Which features run within ARM memory? | Open evidence; owner attestation required |
| CA-005 | Spindle downtime | EdgeML compact edge inference methods | [Microsoft EdgeML](https://github.com/microsoft/EdgeML) | Public source repository; licence file | Can the classifier be compressed below the gateway limit? | Open evidence; owner attestation required |
| CA-006 | Spindle downtime | SciPy signal processing stack | [SciPy repository](https://github.com/scipy/scipy) | BSD-licensed public source | Which reference pipeline establishes a reproducible baseline? | Open evidence; dependency review required |
| CA-007 | PET purity | TACO waste image dataset | [TACO repository](https://github.com/pedropro/TACO) | Public dataset/source licence | Does it contain enough polymer-level labels for transfer? | Open evidence; label-gap review |
| CA-008 | PET purity | TrashNet material classification dataset | [TrashNet repository](https://github.com/garythung/trashnet) | Public research repository | Can RGB classification pre-screen contaminants? | Source-backed; licence review required |
| CA-009 | PET purity | WaDaBa waste database | [WaDaBa project](http://www.wadaba.pcz.pl/) | Primary academic project page | Are PET/PVC/PLA spectra or images separable? | Source-backed; terms review required |
| CA-010 | PET purity | Spectral Python hyperspectral toolkit | [Spectral Python repository](https://github.com/spectralpython/spectral) | BSD-licensed public source | Can inference meet conveyor latency? | Open evidence; owner attestation required |
| CA-011 | PET purity | USGS spectral library | [USGS Spectral Library](https://www.usgs.gov/labs/spec-lab/capabilities/spectral-library) | Primary public-agency source | Are relevant polymers represented under useful wavelengths? | Source-backed; scope review required |
| CA-012 | PET purity | OpenCV vision pipeline | [OpenCV repository](https://github.com/opencv/opencv) | Apache-2.0 public source | Can belt tracking and ROI extraction run on existing compute? | Open evidence; dependency review required |
| CA-013 | Devanagari records | Tesseract OCR with Devanagari models | [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) | Apache-2.0 public source | What baseline field accuracy is achievable without retraining? | Open evidence; model-data terms review |
| CA-014 | Devanagari records | Indic NLP Library | [Indic NLP Library](https://github.com/anoopkunchukuttan/indic_nlp_library) | MIT-licensed public source | Which normalisation/tokenisation errors affect names and survey IDs? | Open evidence; owner attestation required |
| CA-015 | Devanagari records | IndicXlit models | [AI4Bharat IndicXlit](https://github.com/AI4Bharat/IndicXlit) | MIT-licensed code/models stated by provider | Can transliteration improve human review and lookup? | Open evidence; owner attestation required |
| CA-016 | Devanagari records | IndicTrans models | [AI4Bharat IndicTrans](https://github.com/AI4Bharat/indicTrans) | MIT-licensed code/models stated by provider | Is translation needed, or would it add avoidable error? | Open evidence; owner attestation required |
| CA-017 | Devanagari records | IndicNLP Suite benchmarks | [AI4Bharat IndicNLP Suite](https://github.com/AI4Bharat/indicnlp_suite) | Primary research repository | Which named-field evaluation sets can be reused? | Source-backed; component licences review |
| CA-018 | Devanagari records | Government open-data resources | [Open Government Data Platform India](https://www.data.gov.in/) | Government Open Data Licence–India applies to published datasets | Is a non-personal register sample available for evaluation? | Licence-backed; privacy/content review required |

## Clearance workflow

1. Re-open the primary source and capture version/commit, licence and retrieval date.
2. Identify the actual contributor/owner; a GitHub organisation name is insufficient.
3. Record third-party data/model licences separately from code.
4. Obtain LP-02 contributor/rights declaration and LP-03 institution decision for any candidate represented as an institutional asset.
5. Preserve required attribution and non-endorsement wording.
6. Move to `public_cleared` or `nda_only` only after the named authority signs; otherwise it remains a candidate.

Shortlist target: retain the best five or six per accepted real brief, then contact owners. Do not import all 18 into the alpha as if verified.
