<!--
SPDX-License-Identifier: AGPL-3.0-or-later
Commercial licence available
© Concepts 1996–2026 Miroslav Šotek. All rights reserved.
© Code 2020–2026 Miroslav Šotek. All rights reserved.
ORCID: 0009-0009-3560-0851
Contact: www.anulum.li | protoscience@anulum.li
Personal GitHub profile overview
-->

<p align="center">
  <img src="assets/profile-header.svg" width="1200" alt="Miroslav Šotek — evidence, computation, control">
</p>

<p align="center">
  <a href="https://anulum.li">Website</a> ·
  <a href="https://orcid.org/0009-0009-3560-0851">ORCID</a> ·
  <a href="https://github.com/sponsors/anulum">Sponsors</a> ·
  <a href="mailto:protoscience@anulum.li">protoscience@anulum.li</a>
</p>

# Miroslav Šotek

Independent researcher and systems engineer at the
[Anulum Institute](https://anulum.li) in Switzerland.

I build **evidence-governed infrastructure** for AI systems and multi-agent
engineering: coordination with receipts, reliability guards for model output,
and research stacks that reach from mathematics into executable hardware paths.

Claims are only as good as the measurements, artefacts, or verification that
back them.

**Stack:** Python · Rust · Verilog · formal and process tooling where needed.

## Start here

| If you need… | Go to |
|---|---|
| Parallel coding agents that do not clobber each other | [Synapse Channel](https://github.com/anulum/synapse-channel) · [docs](https://anulum.github.io/synapse-channel/) |
| LLM claim guarding / factual-consistency checks | [Director-AI](https://github.com/anulum/director-ai) · [docs](https://anulum.github.io/director-ai/) |
| Repository audit and remediation planning | [Rigor Foundry](https://github.com/anulum/rigor-foundry) · [docs](https://anulum.github.io/rigor-foundry/) |
| Neuromorphic / stochastic computing research | [SC-NeuroCore](https://github.com/anulum/sc-neurocore) · [docs](https://anulum.github.io/sc-neurocore/) |
| Coupled-oscillator / quantum simulation research | [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control) |

Project documentation also lives under each repository’s Pages site and on
[anulum.li](https://anulum.li).

## Lab map

Anulum is a lab stack, not a single product:

```text
Director-AI          reliability of model output
Rigor Foundry        evidence-bound audit and remediation
Synapse Channel      multi-agent coordination, claims, receipts
SC-NeuroCore         neuromorphic / SC compute (Python · Rust · RTL)
SCPN suite           control, plasma, phase, and quantum research paths
```

### Typical stack use

1. **Rigor Foundry** — find what is broken, unproven, or unsafe to claim.
2. **Director-AI** — guard model output that will be trusted.
3. **Synapse Channel** — run multi-agent work with claims, mailboxes, and receipts.
4. **SC-NeuroCore / SCPN** — when the problem is neuromorphic, physical, or
   control-grade compute.

Research, validation, and product readiness are kept separate. Active
development is not a readiness claim.

The **pinned repositories** on this profile match the selected-work table below.
Other public repos are either SCPN-family research or supporting tooling.

## Selected work

| Project | Job | Maturity |
|---|---|---|
| [Synapse Channel](https://github.com/anulum/synapse-channel) | Local-first control plane for coding-agent fleets: claims, roles, durable mailboxes, receipts, audit, and federation | **Usable now** — functional core, active development |
| [Rigor Foundry](https://github.com/anulum/rigor-foundry) | Evidence-bound repository auditing and remediation planning | **Usable now** — active hardening |
| [Director-AI](https://github.com/anulum/director-ai) | Real-time LLM guardrails: NLI + RAG fact-checking with optional claim-level streaming halt | **Research active** — functional system under validation |
| [SC-NeuroCore](https://github.com/anulum/sc-neurocore) | Polyglot stochastic and neuromorphic framework (Python, Rust SIMD, Verilog, HDC/VSA) | **Research active** — platform under continuous development |
| [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control) | Evidence-governed quantum simulation of coupled-oscillator synchronisation | **Experimental** — preregistered research programme |

Related control and fusion research lives in the SCPN suite
([control](https://github.com/anulum/scpn-control),
[fusion-core](https://github.com/anulum/scpn-fusion-core),
[phase orchestrator](https://github.com/anulum/scpn-phase-orchestrator),
[MIF-core](https://github.com/anulum/scpn-mif-core)).

### Maturity labels

| Label | Meaning |
|---|---|
| **Usable now** | Installable, documented, CI-backed; still evolving |
| **Research active** | Real code and ongoing science; not a stability promise |
| **Experimental** | Exploratory; do not treat interfaces or claims as fixed |
| **Evidence-bound** | Public claims are tied to measurements or artefacts |

## Evidence, not slogans

Negative and null results are published when they are real. Public claims stay
tied to artefacts: measurements, preregistered protocols, raw packs, or
executable verification — not slogans.

Example: preregistered quantum-control protocols and hash-bound result packs in
[scpn-quantum-control](https://github.com/anulum/scpn-quantum-control).

## Working principles

- Evidence before claims.
- Reproducible artefacts before presentation.
- Clear boundaries between research, validation, and product readiness.
- Cross-language implementations where performance or hardware integration
  makes them useful.
- Honest failure records: negative results are part of the research output.

## Collaboration

I welcome technically grounded collaboration in neuromorphic systems, reliable
AI infrastructure, scientific computing, formal verification, and control.

A useful first message includes: problem, constraints, relevant prior art, and
what evidence would count as success. Prefer email
([protoscience@anulum.li](mailto:protoscience@anulum.li)) or the contact path on
[anulum.li](https://anulum.li).

I respond to technical proposals. I do not take on ungrounded hype work,
“demo-only” science theatre, or claims that cannot be checked.

For sustained open work, [GitHub Sponsors](https://github.com/sponsors/anulum)
funds CI runners, quantum and hardware experiment time, and public docs — not
marketing.

> **Transparency:** These repositories span research software, developer tools,
> and product candidates. Active development does not imply production readiness
> or scientific validation unless a project provides explicit evidence for it.

<p align="center"><em>I AM THAT</em></p>

<p align="center">
  <img src="assets/anulum-logo.jpg" width="100%" alt="Anulum">
</p>
