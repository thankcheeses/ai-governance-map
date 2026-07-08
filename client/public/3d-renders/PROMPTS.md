# 3D Render Kit — drop-in slots for the AI Governance Map

**How this works:** the app ships with hand-crafted inline SVG visuals (zero external
requests). To upgrade any slot with a photoreal render, generate an image with the
prompts below, optimize it (WebP, ~1600px wide is plenty; Squoosh/ImageOptim), and
**commit it into this folder** with the exact filename listed. Assets must be
**self-hosted here — never hotlinked/CDN'd** (the app's local-only, no-external-request
ethos is contractual; the only sanctioned external fetch is the Esri basemap).

Alt text for every render must reinforce the open-proposal nature, e.g.:
*"Illustrative 3D visualization of the NHID-Clinical Five-Layer Trust Architecture —
conceptual render for clarity."* No product framing.

| Filename to commit | Used by | Status |
|---|---|---|
| `impersonation-vs-verified.webp` | NHID section — Impersonation Latency panel | slot open (SVG fallback ships) |
| `trust-stack-ziggurat.webp` | optional static feature image (the in-app ziggurat stays interactive SVG) | slot open |
| `idg-01-gate.webp` | future control-gallery cards | slot open |
| `verified-call-flow.webp` | future "how a verified call works" panel | slot open |
| `nexus-trust-bridge.webp` | future hero/marketing surfaces | slot open |

## Generation prompts (copy-paste; request 8K, cinematic lighting, PBR textures)

### Hero / Nexus (wide)
"Hyper-realistic insanely detailed 3D CGI cinematic render of an epic professional
'Governance Trust Nexus' architectural structure in a stylized digital healthcare realm.
A monumental modern-fortified archive or verification bridge spanning a subtle digital
chasm between payer and provider domains. Intricate layered shields, ornate yet technical
gates, and glowing teal energy pathways representing identity disclosure and verification
protocols. Deep navy stone and metallic silver materials with subtle gold inlays.
Volumetric god rays, dramatic cinematic lighting, high dynamic range, intricate PBR
textures, depth of field, 8K resolution. Enterprise premium aesthetic like high-end
Unreal Engine 5 architectural visualization, wide landscape composition for website hero,
no humans, no text, symbolic and authoritative."

### Five-Layer Trust Stack (ziggurat)
"Insanely detailed hyper-realistic 3D CGI cross-section render of a five-layer monumental
trust architecture ziggurat for healthcare AI voice governance. Bottom foundational layer
with intricate network protocol engravings. Successive layers: behavioral disclosure
gates, cryptographic authorization chains and NPI bindings, comprehensive audit ledger
textures, top observability spires. Each layer uniquely textured with deep navy stone,
teal energy veins, silver/gold accents. Subtle control identifiers engraved. Dramatic
side volumetric lighting, high resolution PBR, cinematic quality, angled view for
clarity, premium enterprise visualization, no text overlays, authoritative mood."

### IDG-01 Identity Disclosure Gate
"Hyper-detailed 3D CGI render of a single monumental secure gateway artifact representing
an identity-disclosure control: a glowing teal portal set in deep navy stone with silver
mechanisms and a subtle gold seal, healthcare-governance aesthetic, volumetric light
through the aperture, PBR materials, 8K, no text, authoritative and calm."

### Verified Call Flow (isometric)
"Insanely detailed isometric 3D CGI visualization of a verified AI voice call sequence in
five stations: initiation, identity disclosure gate, verification checkpoint, human
handoff junction, audit ledger archive. Connected by glowing teal energy conduits over a
deep navy platform, silver structural detail, subtle gold accents, cinematic rim
lighting, PBR textures, 8K, no humans, no text."

### Problem vs Verified Pathway (split)
"Dramatic split-scene 3D CGI render: left half shows a chaotic dark violet-tinged void
with a fragmented, uncertain call pathway dissolving into question-mark-like static
(impersonation risk, infinite trust delay); right half shows the same pathway rebuilt as
a clean, luminous teal verified route passing through a disclosure gate into a secured
receiving vault. Deep navy base world, metallic silver structures, subtle gold inlays,
volumetric lighting, PBR, 8K, no text, symbolic, authoritative."

---
*Kept alongside the app so the visual system travels with the repo. See also the
`nhid-visual-style-v2` skill for brand rules (palette, transparency, restraint).*
