# Changelog

## [Unreleased]

### Sources for the remaining rows
- Ten more obligations now cite a source: GDPR (2), South Korea (3), Viet Nam (2), IEEE 7000 (2) and the second CHAI row. Coverage is 71 of 75 obligations and 16 of 16 timeline events. The four ISO/IEC 42001 rows stay marked "no source recorded": the standard is paywalled and its clause titles could not be confirmed from ISO's free pages.
- Each of these rows says in its note what was actually read: an unofficial mirror for GDPR, an unofficial English translation for the Korean Act, a Government Portal summary for the Vietnamese Law, the abstract only for IEEE 7000, and passages of CHAI's draft guide.
- Corrections: the Korean domestic-representative thresholds are set by Presidential Decree, not the Act, so the KRW figures are removed, as is a grace period for fines that the Act does not contain. The Vietnamese rows drop details the official summary does not state. The NHID-Auth layer description no longer mentions DPoP, which its repository does not.

### Sources for the register
- 47 obligations and 4 timeline events that had no source now cite one, each reconciled against the document on 14 November 2026. Coverage is 61 of 75 obligations and 16 of 16 timeline events. Fourteen obligations stay marked "no source recorded" because their text could not be read (ISO/IEC 42001, IEEE 7000, the Korean and Vietnamese statutes, GDPR, one CHAI row).
- Corrections found while reconciling:
  - Council of Europe AI Convention (CETS 225) is **not in force**: two of the five required ratifications were recorded as of 13 November 2026. It was listed as in force since 1 November 2025.
  - HIPAA Security Rule compliance date is 20 April 2005, not 21 April. Two rows no longer say NHID-Auth "satisfies" an encryption specification, and wording added to the regulation's text ("AI agent", "at rest") is removed. Each row now says whether it is a standard, required or addressable.
  - Texas TRAIGA: the biometric-identification restriction binds governmental entities, not all developers and deployers.
  - India IT Rules: the three-hour removal limit applies to unlawful information on actual knowledge, not to unlabelled synthetic content as such.
  - China Interim Measures: the filing and security-assessment duty covers services with public-opinion attributes or social-mobilisation capability, not every public-facing service.
  - California AI Transparency Act: no separate visible-disclosure duty in the section as amended; the tool is a disclosure verification tool.
  - NYC Local Law 144: candidates may request an alternative selection process or accommodation; there is no general opt-out.
  - Utah: the on-request disclosure duty falls on suppliers in consumer transactions; the regulated-occupation duty is for high-risk interactions.
  - FCC AI-voice ruling: the opt-out mechanism is required for advertising and telemarketing messages, not every artificial-voice call.
  - Tennessee ELVIS Act: rows now describe civil liability for the specific knowing uses in the text.
  - FDA PCCP guidance was first issued 4 December 2024, not 3 December. Singapore's generative-AI framework is not a "2nd edition". OWASP entries use the 2025 names. CHAI documents are drafts. NHID-Auth row no longer mentions DPoP, which its repository does not.
- The page description no longer says "every entry traced to a cited source". It now says each entry shows the source it was checked against and that entries with no source recorded are marked.

### Repository and site clean-up
- Removed the site-builder plugins and debug collector that were being published with the site; the built `index.html` drops from 372 kB to under 6 kB and ships no third-party script.
- Fixed the bold Sora face (it pointed at a font file that did not exist) and dark-mode contrast for badges and links in the register panels. Framework cards are top-aligned.
- NHID-Clinical module brought in line with the current project: the Call Authorization Score is withdrawn and no score replaces it, so the badge and the trace field are gone; the five controls use their published names and rules; the example trace ends in the engine's decision (`CONTINUE_AI` / `DENY_DATA`); impersonation latency is defined as turns between connect and disclosure.
- EU AI Act references corrected to the final numbering of Regulation (EU) 2024/1689: transparency is Article 50, GPAI is Chapter V, and three control mappings that pointed at unrelated articles (28, 61, 84) were removed.
- MIT `LICENSE` added; README names the author and the licence. Author card filled in.
- Archive and design notes moved to `docs/`; unused template files, a second lockfile and a disabled workflow removed. `package.json` version now matches this changelog (3.0.0).
- The not-found page uses the site's own colours in light and dark.

### NIST AI RMF Playbook layer
- New **NIST AI RMF Playbook** section (Full register and GRC views): the 72 subcategories grouped by function, each opening to NIST's outcome statement, suggested actions and Transparency & Documentation questions. Search, function filter, and a "Not mapped by any control" filter that shows coverage gaps. Text is verbatim from NIST; the Playbook's not-a-checklist / voluntary framing is shown with a source link.
- NIST subcategory chips in **Controls** now open the cited subcategory in a side sheet.
- Corrected the NIST AI RMF mappings of all 27 controls against the official subcategory statements, normalised ids to NIST's form (`GOVERN 1.1`, not `GOV 1.1`), and replaced the crosswalk topic matrix's function-level NIST cells with subcategory citations. CTRL-IPY-001 (portability) now cites no NIST subcategory because none fits. Evidence: `docs/nist-playbook-mapping-review.md`.
- Playbook data generated by `scripts/generate-nist-playbook.mjs` and lazy-loaded as its own chunk.
- Test: every NIST reference in the data must resolve to a real subcategory; the Playbook data must hold 72 (GOVERN 19, MAP 18, MEASURE 22, MANAGE 13).

## [3.0.0] - 1 October 2026

### Decision desk
- Overview now opens on in-force obligations, the next clock, and unscored critical controls.
- Working views: Full register, Executive, GRC, Risk. Hidden sections stay in the sidebar targets when that view includes them.

### Obligations clock
- Article 50 transparency marked past / in force (applied 2 August 2026; not deferred by Regulation (EU) 2026/1744).
- Added 2 December 2026 marking-grace end and Omnibus Article 5 prohibition date.
- Annex III high-risk dated 2 December 2027; product-integrated high-risk dated 2 August 2028.
- Added the marking-grace obligation to the register.

---

## [2.0.0] - June 11, 2026

### Major Features

#### 🔐 NHID-Clinical v2 Integration
- **AUTH-01 Control**: Cryptographic caller authorization verification via NHID-Auth v2
  - Ed25519 delegation chains with NPI binding
  - DPoP (Demonstration of Proof-of-Possession) call-nonce binding
  - Real-time revocation checking and scope narrowing
  - Closes Layer 3 security gap preventing NPI spoofing attacks
  - Integrated with Layer 4 FHIR AuditEvent logging

#### ⏰ Live Deadline Countdown
- Dynamic calculation of days remaining to regulatory deadlines
- Automatic sorting by urgency
- Next deadline prominently displayed in dashboard stats bar
- Currently tracking:
  - EU Transparency Rules (Aug 2, 2026)
  - Human oversight for high-risk (Dec 2, 2027)
  - Logging & traceability (Dec 2, 2027)

#### 📊 Enhanced Dashboard
- Updated control count: 22 (added AUTH-01)
- Version badge now shows: "v2 · June 2026 · CCM v4.1.0 + NHID-Clinical v2"
- CSV exports now use filename: `ai-governance-assessment-v2.csv`

### Changes

#### Control Updates
- **Control #22 (NEW)**: Caller Authorization Verification (AUTH-01)
  - Risk Tier: Autonomous Agents
  - Priority: Critical
  - CCM Domain: IAM
  - Indicator: Cryptographic Authorization Verification Rate (100% of production calls)
  - Implementation: NHID-Auth v2 reference layer with Ed25519 signatures, scoped delegation, TTL, and revocation

#### NHID Manifest (v2)
- Updated all 8 behavioral controls to reference "NHID-Clinical v2" and layer designations
- Added AUTH-01 as Layer 3 Security control
- Clarified Layer 2 (Behavioral) vs Layer 3 (Cryptographic) separation

#### Documentation
- README updated to reflect v2 launch and NHID-Clinical v2 alignment
- Removed "upcoming/in scope for" language
- v2 is now the active production version

### Technical Improvements

- Live deadline countdown function: `calculateDaysRemaining(targetDate: string): number`
- Next deadline useMemo calculation with filtering and sorting
- Deadline display card in stats bar with conditional rendering
- All version references updated from v1.3/v3.0 to v2

### Breaking Changes

- CSV export filename changed from `ai-governance-assessment-v24.csv` to `ai-governance-assessment-v2.csv`
- Version badge format updated (now includes NHID-Clinical v2)

### Compliance Updates

- EU AI Act Annex III high-risk compliance deadline extended to Dec 2, 2027 per Digital Omnibus agreement (May 7, 2026)
- All controls now aligned with CCM v4.1.0 (verified Jan 13, 2026)
- NHID-Clinical v2 controls now fully integrated into compliance framework

---

## [1.0.0] - Initial Release

- 21 core AI governance controls
- CCM v4.1.0 mapping
- NIST AI RMF alignment
- EU AI Act framework
- NHID-Clinical v1.3 behavioral controls
- Gap analysis tool
- Posture radar visualization
