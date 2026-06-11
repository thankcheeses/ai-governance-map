# Changelog

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
