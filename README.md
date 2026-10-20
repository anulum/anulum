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
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/profile-header-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/profile-header-light.svg">
    <img src="assets/profile-header-dark.svg" width="1200" alt="Miroslav Šotek: evidence, computation, control">
  </picture>
</p>

<p align="center">
  <a href="README.md"><img alt="English" src="assets/badges/lang-en.svg"></a>
  <a href="README.de.md"><img alt="Deutsch" src="assets/badges/lang-de.svg"></a>
  <a href="README.sk.md"><img alt="Slovenčina" src="assets/badges/lang-sk.svg"></a>
  <a href="README.zh-CN.md"><img alt="中文" src="assets/badges/lang-zh.svg"></a>
  <a href="README.ja.md"><img alt="日本語" src="assets/badges/lang-ja.svg"></a>
</p>

<p align="center">
  <a href="https://anulum.li"><img alt="Website" src="assets/badges/website.en.svg"></a>
  <a href="https://orcid.org/0009-0009-3560-0851"><img alt="ORCID" src="assets/badges/orcid.svg"></a>
  <a href="cv/Miroslav-Sotek-CV.pdf"><img alt="CV PDF" src="assets/badges/cv-pdf.en.svg"></a>
  <a href="https://pypi.org/user/anulum/"><img alt="PyPI" src="assets/badges/pypi-count.en.svg"></a>
  <a href="https://github.com/sponsors/anulum"><img alt="GitHub Sponsors" src="assets/badges/sponsors.en.svg"></a>
  <a href="mailto:protoscience@anulum.li"><img alt="Email" src="assets/badges/email.en.svg"></a>
</p>

<p align="center">
  <a href="#projects">Projects</a> ·
  <a href="#current-focus">Current focus</a> ·
  <a href="#portfolio-ecosystem">Ecosystem</a> ·
  <a href="#research-output">Research output</a> ·
  <a href="#engineering-practice">Standards</a> ·
  <a href="#collaboration">Collaboration</a>
</p>

Independent researcher and systems engineer based in Switzerland, developing scientific software and a governed research organisation under the Anulum name. Five active groups cover reactor systems, integration and control, agentic coordination and assurance, neuromorphic computing, and quantum computing. A sixth group, Scientific Discovery and Experimentation, is in formation. Released software, architecture work, world-model development and intended hardware outputs have separate evidence boundaries. The research institute and company are offered for joint founding with partners.

<table>
  <tr>
    <td width="20%"><strong>The engine</strong><br><sub>Agent coordination with receipts, evidence-bound review, claim grounding, auditable memory</sub></td>
    <td width="20%"><strong>Reactor systems</strong><br><sub>Reactor concept catalogue, 3D/CAD, level-0 physics, Reactor Studio</sub></td>
    <td width="20%"><strong>Integration and control</strong><br><sub>Studio Hub, control runtime, synchronisation analysis, fail-closed hardware gating</sub></td>
    <td width="20%"><strong>Neuromorphic computing</strong><br><sub>SNN Studio, Rust SIMD, Verilog RTL, FPGA synthesis</sub></td>
    <td width="20%"><strong>Quantum computing</strong><br><sub>Circuits on simulators and real hardware, result packs with raw counts</sub></td>
  </tr>
</table>

## Start here

**[Projects](#projects)** for the software and its evidence ·
**[Papers](https://anulum.li/papers/)** for every publication and software
archive with BibTeX · **[Contact](mailto:protoscience@anulum.li)** for a
technical proposal. Cold readers: [anulum.li/start/](https://anulum.li/start/)
picks an entry point by profile. Every registered project, filterable by group,
reactor family and evidence, with a clickable map:
[anulum.li/portfolio/](https://anulum.li/portfolio/).

## Projects

Each card links to inspectable artefacts, not summary claims. Evidence links
are pinned to the commit they were verified at. Release and CI badges report
registry and workflow state; they are operational signals, not scientific-quality
scores.

<table>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/synapse-channel">Synapse Channel</a></strong> · <sub><strong>Usable now</strong></sub><br><sub>Control plane for coding-agent fleets: claims, roles, durable mailboxes, receipts, audit, and federation.</sub><br><sub><a href="https://anulum.github.io/synapse-channel/">Documentation</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/VALIDATION.md">Validation</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/coordination-spec.md">Coordination specification</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/sandbox-threat-model.md">Threat model</a></sub><br><a href="https://pypi.org/project/synapse-channel/"><img alt="PyPI" src="https://img.shields.io/pypi/v/synapse-channel?style=flat-square"></a> <a href="https://github.com/anulum/synapse-channel/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/synapse-channel/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/director-ai">Director-AI</a></strong> · <sub><strong>Research active</strong></sub><br><sub>Real-time LLM guardrail: NLI/RAG grounding, claim review, native acceleration, optional claim-level streaming halt, declared capability boundaries.</sub><br><sub><a href="https://anulum.github.io/director-ai/">Documentation</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/VALIDATION.md">Validation</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/benchmarks/PUBLIC_BENCHMARKS.md">Public benchmarks</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/docs/_generated/capability_matrix.md">Capability matrix</a></sub><br><a href="https://pypi.org/project/director-ai/"><img alt="PyPI" src="https://img.shields.io/pypi/v/director-ai?style=flat-square"></a> <a href="https://github.com/anulum/director-ai/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/director-ai/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/rigor-foundry">Rigor Foundry</a></strong> · <sub><strong>Usable now</strong></sub><br><sub>Evidence-bound repository inventory, audit candidates, review binding, and remediation planning.</sub><br><sub><a href="https://anulum.github.io/rigor-foundry/">Documentation</a></sub><br><a href="https://pypi.org/project/rigor-foundry/"><img alt="PyPI" src="https://img.shields.io/pypi/v/rigor-foundry?style=flat-square"></a> <a href="https://github.com/anulum/rigor-foundry/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/rigor-foundry/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/remanentia">Remanentia</a></strong> · <sub><strong>Usable now</strong></sub><br><sub>Auditable memory for AI agents and knowledge systems: hybrid retrieval, graphs, consolidation, CLI, MCP, and API surfaces.</sub><br><sub><a href="https://github.com/anulum/remanentia#readme">Documentation</a></sub><br><a href="https://pypi.org/project/remanentia/"><img alt="PyPI" src="https://img.shields.io/pypi/v/remanentia?style=flat-square"></a> <a href="https://github.com/anulum/remanentia/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/remanentia/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/sc-neurocore">SC-NeuroCore</a></strong> · <sub><strong>Research active</strong></sub><br><sub>Stochastic and neuromorphic framework: Python models, Rust SIMD paths, Verilog RTL, HDC/VSA, compiler surfaces, and hardware evidence.</sub><br><sub><a href="https://anulum.github.io/sc-neurocore/">Documentation</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/VALIDATION.md">Validation</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/hardware/SYNTHESIS_RESULTS.md">Synthesis results</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/safety/TRACEABILITY_MATRIX.md">Traceability matrix</a></sub><br><a href="https://pypi.org/project/sc-neurocore/"><img alt="PyPI" src="https://img.shields.io/pypi/v/sc-neurocore?style=flat-square"></a> <a href="https://github.com/anulum/sc-neurocore/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/sc-neurocore/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-fusion-core">SCPN Fusion Core</a> · <a href="https://github.com/anulum/scpn-control">SCPN Control</a></strong> · <sub><strong>Research active</strong></sub><br><sub>Tokamak physics, solvers, and validation campaigns with real-data paths (Fusion Core); control-grade runtime with fail-closed admission and replay evidence (Control).</sub><br><sub><a href="https://github.com/anulum/scpn-fusion-core/blob/3c841fc13109c8efb49bb079d145f70683a4408d/VALIDATION.md">Validation</a> · <a href="https://github.com/anulum/scpn-fusion-core/blob/3c841fc13109c8efb49bb079d145f70683a4408d/docs/VALIDATION_REAL_DIIID_145419.md">DIII-D validation record</a> · <a href="https://doi.org/10.5281/zenodo.18820864">Software DOI</a></sub><br><a href="https://pypi.org/project/scpn-fusion/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-fusion?style=flat-square"></a> <a href="https://pypi.org/project/scpn-control/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-control?style=flat-square"></a> <a href="https://github.com/anulum/scpn-fusion-core/actions/workflows/ci-python-tests.yml"><img alt="CI" src="https://github.com/anulum/scpn-fusion-core/actions/workflows/ci-python-tests.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-quantum-control">SCPN Quantum Control</a></strong> · <sub><strong>Experimental</strong></sub><br><sub>Evidence-governed quantum simulation of coupled-oscillator synchronisation: protocols committed before the run, hardware result packs, raw counts, and explicit non-advantage boundaries.</sub><br><sub><a href="https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/layout_relaxation_preregistration.md">Layout-relaxation protocol</a> · <a href="https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/hardware_result_packs.md">Result-pack contract</a> · <a href="https://doi.org/10.5281/zenodo.18821929">Software DOI</a></sub><br><a href="https://pypi.org/project/scpn-quantum-control/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-quantum-control?style=flat-square"></a> <a href="https://github.com/anulum/scpn-quantum-control/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/scpn-quantum-control/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-phase-orchestrator">SCPN Phase Orchestrator</a></strong> · <sub><strong>Research active</strong></sub><br><sub>Evidence-first synchronisation analysis and review-only control proposals for coupled rhythmic systems; matched-false-alarm evaluation, negative results, and bounded transfer claims.</sub><br><sub><a href="https://github.com/anulum/scpn-phase-orchestrator/blob/1e9eea39fa6681dde2cfbdf074c08ff03a528b58/papers/submissions/README.md">Submission index</a> · <a href="https://doi.org/10.5281/zenodo.22113062">Negative-result preprint</a> · <a href="https://doi.org/10.5281/zenodo.22113116">Grid regime-map preprint</a></sub><br><a href="https://pypi.org/project/scpn-phase-orchestrator/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-phase-orchestrator?style=flat-square"></a> <a href="https://github.com/anulum/scpn-phase-orchestrator/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/scpn-phase-orchestrator/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
</table>

| Label | Meaning |
|---|---|
| **Usable now** | Installable, documented, and CI-backed; still evolving |
| **Research active** | Real code and ongoing science; not a stability promise |
| **Experimental** | Exploratory; interfaces and claims are not fixed |
| **Evidence-bound** | Public claims are tied to measurements or artefacts |

## Current focus

<sub>Portfolio state verified <!-- verified-at -->2026-10-19<!-- /verified-at -->.</sub>

<table>
  <tr>
    <td width="33%"><strong>Reactor portfolio</strong><br><sub>Consolidating shared kernels and governed device truth across 26 public reactor repositories.</sub></td>
    <td width="33%"><strong>Agentic assurance</strong><br><sub>Joining coordination, memory, response assurance, action review, and repository evidence without collapsing ownership boundaries.</sub></td>
    <td width="33%"><strong>Research to hardware</strong><br><sub>Carrying scientific models through native acceleration, formal checks, RTL, hardware runs, and inspectable result packs.</sub></td>
  </tr>
</table>

<!-- profile-feeds:releases:start -->
### Latest releases

| Date | Project | Release | Change |
|---|---|---|---|
| 2026-10-13 | Synapse Channel | [v0.99.38](https://doi.org/10.5281/zenodo.23328518) | published software archive |
| 2026-10-13 | SYNAPSE CHANNEL | [v0.99.38](https://github.com/anulum/synapse-channel/releases/tag/v0.99.38) | Read-only delivery receipt projection joining the aggregate to its exact source event in one snapshot, with message/state binding, optional row MAC verification and SQLCipher key support. |
| 2026-10-02 | Synapse Channel | [v0.99.37](https://doi.org/10.5281/zenodo.23095056) | published software archive |
| 2026-10-02 | SYNAPSE CHANNEL | [v0.99.37](https://github.com/anulum/synapse-channel/releases/tag/v0.99.37) | Bind durable delivery decisions to the receiving hub, preserving the immutable request origin. Forwarded requests can expire and resolve replaced sessions; forwarded-only journals refuse startup under another hub identity. |
| 2026-10-01 | Loop Timing Witness | [v0.1.0](https://doi.org/10.5281/zenodo.23092361) | published host software |

<sub>Rendered from [anulum.li/news](https://anulum.li/news/) (the projects' CHANGELOG files) and [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) on 2026-10-19.</sub>
<!-- profile-feeds:releases:end -->

<!-- profile-feeds:publication:start -->
### Latest publication

| Date | Type | Output | DOI |
|---|---|---|---|
| 2026-10-11 | Preprint | The calibration epoch as the unit of evidence: preregistered parity-leakage and layout-transfer experiments on IQM Garnet | [10.5281/zenodo.23298119](https://doi.org/10.5281/zenodo.23298119) |

<sub>Rendered from [anulum.li/news](https://anulum.li/news/) (the projects' CHANGELOG files) and [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) on 2026-10-19.</sub>
<!-- profile-feeds:publication:end -->

## Timeline

| Period | Publicly supported milestone |
|---|---|
| 1996 onward | Self-published concept-development horizon across the broader research programme |
| 1998 | Founder role at ANULUM CH&LI begins in the self-entered public ORCID record |
| 2018 | Public GitHub account established |
| 2025 | Public SCPN previews, framework indexes, and technical reports deposited on Zenodo |
| 2026 | Public software and research portfolio expands across AI assurance, agent infrastructure, neuromorphic computing, plasma control, and quantum simulation |

Timeline entries distinguish registry facts from self-published chronology. They
do not imply academic affiliation, external validation, funding, or awards.

## How the stack is used

```mermaid
flowchart LR
    Q["SCPN Quantum Control"] -. "optional SNN adapter" .-> N["SC-NeuroCore"]
    Q -. "optional studio" .-> S["Studio Platform package"]
    N -. "optional federation" .-> S
    D["Director-AI"] -. "optional honesty extra" .-> S
    C["SCPN Control"] -. "optional fusion extra" .-> F["SCPN Fusion Core"]
    R["Rigor Foundry · repository analysis"]
```

These arrows are declared optional software interfaces from the group architecture records, not a tested end-to-end scientific loop. Rigor Foundry provides repository analysis; it is shown without an invented runtime dependency. Each domain keeps model and hardware authority. Studio Platform is a published package with a private repository. The Phase Orchestrator grid modal-damping benchmark was withdrawn on 12 October 2026; this profile makes no real-grid or quantum-advantage claim.

## Portfolio ecosystem

<!-- profile-catalogue:inventory:start -->
**Dated inventory: 2026-10-15**

97 portfolio repositories: 37 public, 6 private, 54 locally initialised and unpublished. A further 42 catalogue entries describe packages, modules, workspaces or architecture destinations. All work is in progress.

Group declarations are dated 12–13 October; repository presence and public visibility were checked on 15 October 2026. Licence statements are source declarations, not a legal audit. Package publication and hardware qualification are separate.

<p align="center">
  <img alt="Portfolio repositories" src="assets/badges/mapped-repositories.svg">
  <img alt="Research groups" src="assets/badges/portfolios.svg">
  <img alt="Public repositories" src="assets/badges/public-projects.svg">
  <img alt="Private repositories" src="assets/badges/private-systems.svg">
</p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/ecosystem-map-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/ecosystem-map-light.svg">
  <img src="assets/ecosystem-map-dark.svg" width="1200" alt="Anulum: six research groups">
</picture></p>

The detailed atlas is integrated in this repository. Its 196 entries also include programmes, company needs, partner roles and funding routes; they are not 196 repositories. Use the atlas preview instructions for the interactive view. The existing website portfolio is maintained separately.

[Detailed atlas source and local preview](docs/atlas/README.md) · [anulum.li/portfolio/](https://anulum.li/portfolio/)

Technical scope descriptions below quote the English source records. A named destination is not a separately released capability. Shared items are counted once under their primary group.

<details>
<summary><strong>01 · SCPN Reactor Systems</strong> · 55 repositories · 55 catalogue entries</summary>

55 owning repositories, including ATLAS-REACTORUM: 26 public and 29 locally initialised but unpublished. Fusion, fission, chemical and hybrid models, shared kernels, geometry and reactor evidence. World models, 3D simulations and device designs are programme outputs under development; a design is not a validated reactor.

[Group architecture maps](https://github.com/anulum/atlas-reactorum/blob/main/docs/ecosystem.md)

| Project / component | Role and development stage | Repository / availability | Declared licence | Source date |
|---|---|---|---|---|
| [ATLAS-REACTORUM](https://github.com/anulum/atlas-reactorum)<br><sub>Source and rights library with historical reactor taxonomy and interactive citation views.</sub> | In progress · tool · Implementation and integration | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-ADS-CORE<br><sub>Subcritical blanket plus typed external source/beam-target interface.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Beam Target Core](https://github.com/anulum/scpn-beam-target-core)<br><sub>Beam/target design and source-scoped reaction/stopping/yield.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BIOCHEM-CORE<br><sub>Source-specific enzyme/fermentation kinetics and reactor transport.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BREED-BURN-CORE<br><sub>Source-bounded breed-and-burn fuel-management concept.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BWR-CORE<br><sub>Boiling-channel thermal-spectrum family and void-feedback boundary.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CATALYTIC-BED-CORE<br><sub>Fixed-bed catalyst/transport/pressure-drop coupling.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHANNEL-CORE<br><sub>Graphite-moderated channel reactor only; exclusive from PHWR pressure tubes.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHEM-KINETICS-CORE<br><sub>Ideal gas batch/CSTR/PFR named kinetics and thermo models.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHEM-PROCESS-HYBRID-CORE<br><sub>Chemical process/recycle/separation and carbon-capture composition.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Dense Plasma Focus Core](https://github.com/anulum/scpn-dense-plasma-focus-core)<br><sub>Focus device/bank/axial/radial/pinch and source-scoped neutron estimates.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-ELECTROCHEM-CORE<br><sub>Electrode/cell transport and charge/reaction interface.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN FRC Core](https://github.com/anulum/scpn-frc-core)<br><sub>Field-reversed configuration, radial pressure-balance and kinetic-scale model.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Fusion Core](https://github.com/anulum/scpn-fusion-core)<br><sub>Canonical plasma solver mathematics, transport/equilibrium and existing research pipeline.</sub> | In progress · package · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Fusion-Fission Hybrid Core](https://github.com/anulum/scpn-fusion-fission-hybrid-core)<br><sub>Existing source-owned fusion/fission blanket device and proposed typed member couplings.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-FUSION-PROCESS-HEAT-CORE<br><sub>Fusion-source to chemical-process heat/material composition.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-GFR-CORE<br><sub>Gas-cooled fast-spectrum family with high-temperature heat-removal boundary.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HEAT-PIPE-CORE<br><sub>Solid-core heat-pipe microreactor and source-defined transport limits.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HTGR-CORE<br><sub>Graphite/TRISO helium-cooled design and distinct process-heat interface.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HYBRID-ENERGY-CORE<br><sub>Fission/renewable/storage electrical and thermal composition.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HYDROGEN-PROCESS-CORE<br><sub>HTSE and named thermochemical hydrogen process routes.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Beam Core](https://github.com/anulum/scpn-icf-beam-core)<br><sub>Particle-beam illumination/capsule design with explicit coupling.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Impact Core](https://github.com/anulum/scpn-icf-impact-core)<br><sub>Impact/projectile/fuel/compression design and source-limited energy relations.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Laser Core](https://github.com/anulum/scpn-icf-laser-core)<br><sub>Laser-driven capsule/implosion design and source-scoped ignition/gain criteria.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN IEC Core](https://github.com/anulum/scpn-iec-core)<br><sub>Gridded electrostatic device and distinct nonthermal loss/recirculation models.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Lattice Fusion Core](https://github.com/anulum/scpn-lattice-fusion-core)<br><sub>Source-bounded lattice-confinement fusion research and modelling.</sub> | In progress · component · Architecture and qualification | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Levitated Dipole Core](https://github.com/anulum/scpn-levitated-dipole-core)<br><sub>Dipole coil/levitation/charging and anisotropic plasma model.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-LFR-CORE<br><sub>Lead/LBE fast-spectrum family with materials/corrosion boundary.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Magnetic Cusp Core](https://github.com/anulum/scpn-magnetic-cusp-core)<br><sub>Cusp coil/configuration ownership and source-specific field/particle-loss model proposal.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-MEMBRANE-CORE<br><sub>Reaction-separation with explicit membrane transport.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-METHANE-REFORMER-CORE<br><sub>Steam-methane reforming kinetics and process train.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Core](https://github.com/anulum/scpn-mif-core)<br><sub>Existing magneto-inertial dynamics/runtime with maintained multi-language/RTL chain.</sub> | In progress · package · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Liner Core](https://github.com/anulum/scpn-mif-liner-core)<br><sub>Mechanical/magnetic liner compression and target-energy coupling.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF MagLIF Core](https://github.com/anulum/scpn-mif-maglif-core)<br><sub>Magnetised liner drive/preheat/compression family.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Plasma Jet Core](https://github.com/anulum/scpn-mif-plasma-jet-core)<br><sub>Discrete plasma-jet array and spherical liner convergence.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Mirror Core](https://github.com/anulum/scpn-mirror-core)<br><sub>Mirror/tandem confinement and source-specific flux-tube geometry.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-MSR-CORE<br><sub>Liquid-fuel molten-salt family with chemistry, circulation and depletion.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Muon Fusion Core](https://github.com/anulum/scpn-muon-fusion-core)<br><sub>Muon-catalysed reaction models and complete energy accounting.</sub> | In progress · component · Architecture and qualification | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NTP-CORE<br><sub>Reactor-side thermal propulsion and typed heat/flow interface.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NUCLEAR-DESALINATION-CORE<br><sub>Fission-to-desalination thermal/material composition.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NUCLEAR-HYDROGEN-CORE<br><sub>Typed fission-to-hydrogen thermal/electrical/material composition.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PHOTOCATALYTIC-CORE<br><sub>Photon-flux-driven reaction and optical/source coupling.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PHWR-CORE<br><sub>Heavy-water pressure-tube family with on-power fuel management.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PWR-CORE<br><sub>Light-water moderated/cooled vessel and primary-circuit design.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-REACTOR-CATALOGUE<br><sub>Evidence-labelled source-authority catalogue, candidate revision/history and vocabulary.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Reactor Kernels](https://github.com/anulum/scpn-reactor-kernels)<br><sub>Shared equations, numerical primitives and geometry/CAD/export substrate.</sub> | In progress · package · Implementation and integration | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-RESEARCH-REACTOR-CORE<br><sub>Research/isotope-production core including separately supported pulse operation.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN RFP Core](https://github.com/anulum/scpn-rfp-core)<br><sub>Reversed-field pinch relaxation/profile and toroidal device design.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-SCWR-CORE<br><sub>Supercritical-water family with explicit thermophysical transition support.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-SFR-CORE<br><sub>Sodium-cooled fast-spectrum family and fuel/material/heat-removal boundary.</sub> | In progress · component · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Spheromak Core](https://github.com/anulum/scpn-spheromak-core)<br><sub>Relaxed compact-torus configuration, flux conserver and formation criteria.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Stellarator Core](https://github.com/anulum/scpn-stellarator-core)<br><sub>Three-dimensional magnetic-confinement configuration and coil/design ownership.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Theta Pinch Core](https://github.com/anulum/scpn-theta-pinch-core)<br><sub>Axial-field compression and pinch configuration with sharp-boundary model.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Tokamak Core](https://github.com/anulum/scpn-tokamak-core)<br><sub>Own tokamak physical modelling and reactor-design geometry, with explicitly qualified canonical plasma-solver dependencies.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Z-Pinch Core](https://github.com/anulum/scpn-z-pinch-core)<br><sub>Current-driven pinch, sheared-flow model and pulsed device design.</sub> | In progress · component · Computational prototypes and continued development | Public | AGPL-3.0-or-later | 2026-10-12 |

**Reactor family portals**: [reactor-systems](https://anulum.li/reactor-systems/) · [compare.html](https://anulum.li/reactor-systems/compare.html) · [closed-magnetic](https://anulum.li/reactor-systems/closed-magnetic/) · [open-magnetic](https://anulum.li/reactor-systems/open-magnetic/) · [pinches](https://anulum.li/reactor-systems/pinches/) · [inertial](https://anulum.li/reactor-systems/inertial/) · [magneto-inertial](https://anulum.li/reactor-systems/magneto-inertial/) · [electrostatic-hybrid](https://anulum.li/reactor-systems/electrostatic-hybrid/)

</details>

<details>
<summary><strong>02 · SCPN Systems Integration and Control</strong> · 4 repositories · 4 catalogue entries</summary>

Four products of equal standing. Control and Phase Orchestrator are public; Studio Hub and the Studio Platform repository are private. The public scpn-studio-platform package is available separately. Declared Studio interfaces do not prove tested federation.

| Project / component | Role and development stage | Repository / availability | Declared licence | Source date |
|---|---|---|---|---|
| [SCPN Phase Orchestrator](https://github.com/anulum/scpn-phase-orchestrator)<br><sub>Synchronisation analysis and evaluation of early-warning detectors on coupled phase-oscillator dynamics, with a Rust kernel.</sub> | In progress · package · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-13 |
| [SCPN Control](https://github.com/anulum/scpn-control)<br><sub>Compiler from stochastic Petri nets to controllers with runtime contracts, and plasma-control research paths.</sub> | In progress · package · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-13 |
| SCPN Studio Platform<br><sub>Domain-neutral SDK for studios: evidence bundles, capability manifests, bounded jobs and tenant-aware identity.</sub> | In progress · package · Released software · ongoing development | Private | AGPL-3.0-or-later | 2026-10-13 |
| SCPN Studio<br><sub>The hub that federates studios over the platform contract: registry, cross-studio evidence audit, rendering and federation gating.</sub> | In progress · service · Implementation and integration | Private | AGPL-3.0-or-later | 2026-10-13 |

</details>

<details>
<summary><strong>03 · Agentic Coordination, Assurance and Continuity</strong> · 10 repositories · 10 catalogue entries</summary>

Ten repositories covering coordination, assurance, memory and governed action. HushLine is a group tool; SYNAPSE-POLICY-CHECK-ACTION is included. Each product keeps its own licence and capability boundary.

[Group architecture maps](https://github.com/anulum/synapse-channel/blob/main/docs/ecosystem.md)

| Project / component | Role and development stage | Repository / availability | Declared licence | Source date |
|---|---|---|---|---|
| [Synapse Channel](https://github.com/anulum/synapse-channel)<br><sub>Local-first coordination bus for AI agents: presence, file-scope work claims, messages, task status, receipts and an audit journal on one hub.</sub> | In progress · package · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-11 |
| Synapse Channel Fleet<br><sub>Multi-machine operation of the bus: durable follower daemon, per-peer trust and configuration, claim forwarding and diagnostics.</sub> | In progress · package · Implementation and integration | Private | LicenseRef-SYNAPSE-Enterprise | 2026-10-11 |
| [SYNAPSE-POLICY-CHECK-ACTION](https://github.com/anulum/synapse-policy-check-action)<br><sub>GitHub Action that checks a SYNAPSE CHANNEL release receipt against a policy file in CI.</sub> | In progress · tool · Implementation and integration | Public | AGPL-3.0-or-later | 2026-10-11 |
| [Director-AI](https://github.com/anulum/director-ai)<br><sub>Response-level guardrail for LLM output: NLI and retrieval grounding, sealed evidence packets and an optional streaming contradiction halt.</sub> | In progress · package · Released software · ongoing development | Public | Apache-2.0 AND BUSL-1.1 | 2026-10-11 |
| Director Class AI<br><sub>Action control between an autonomous agent and its effectors: action-policy checks, human approvals, gateway enforcement and tamper-evident action evidence.</sub> | In progress · package · Implementation and integration | Private | BUSL-1.1 | 2026-10-11 |
| Director AI Cloud<br><sub>Control plane for a hosted Director-AI API: accounts, API-key lifecycle, usage metering, plan quotas and operator exports.</sub> | In progress · service · Implementation and integration | Private | BUSL-1.1 | 2026-10-11 |
| [Rigor Foundry](https://github.com/anulum/rigor-foundry)<br><sub>Evidence-bound repository auditing: inventories Git-tracked content, emits reproducible audit candidates, binds review decisions to exact evidence and prepares remediation inputs.</sub> | In progress · package · Released software · ongoing development | Public | Apache-2.0 | 2026-10-11 |
| [Remanentia](https://github.com/anulum/remanentia)<br><sub>Local-first, auditable memory for AI agents and knowledge-intensive software: project-file indexing, hybrid retrieval, consolidation and an entity graph, through a CLI, an MCP server and an HTTP API.</sub> | In progress · package · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-11 |
| Remanentia Portal<br><sub>Account and billing or licence-request portal for the product family. It runs no customer workload.</sub> | In progress · service · Implementation and integration | Private | AGPL-3.0-or-later | 2026-10-11 |
| [HushLine](https://github.com/anulum/HushLine)<br><sub>Local command-output filter: runs a command, then limits, shapes and redacts its output before it reaches a caller. Four independent cores: Go, Rust, Python and Node.</sub> | In progress · tool · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-11 |

</details>

<details>
<summary><strong>04 · SC Neuromorphic Computing Systems</strong> · 4 repositories · 42 catalogue entries</summary>

The core inventory has 40 named entries including the permanent SC-NeuroCore workbench and its supporting tools; two additional module/conditional destinations bring the catalogue to 42 entries. LOOP-TIMING-WITNESS has a public host package; physical board qualification remains pending. EVIDENCE-MANIFEST-TOOLKIT is unpublished. Named modules and deferred destinations are labelled separately.

[Group architecture maps](https://github.com/anulum/sc-neurocore/blob/main/docs/ecosystem.md)

| Project / component | Role and development stage | Repository / availability | Declared licence | Source date |
|---|---|---|---|---|
| [SC-NeuroCore](https://github.com/anulum/sc-neurocore)<br><sub>Permanent public development, composition and integration workbench for stochastic and spiking neural modelling, encoding, learning, simulation, selected hardware compilation and evidence inspection.</sub> | In progress · workbench · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-13 |
| [Loop Timing Witness](https://github.com/anulum/loop-timing-witness)<br><sub>Fabric-clock instrument for complete control-loop and selected accelerator timing, with simulation/host analysis separated from eventual board timing, fault response and rail-energy evidence.</sub> | In progress · tool · Architecture and qualification | Public | AGPL-3.0-or-later | 2026-10-13 |
| EVIDENCE-MANIFEST-TOOLKIT<br><sub>Canonicalises, references, seals and verifies evidence with explicit schemas, bounded sources and independently selected policy.</sub> | In progress · shared · Architecture and qualification | Local, unpublished | AGPL-3.0-or-later | 2026-10-13 |
| RANDOMNESS-WITNESS<br><sub>Assesses number-source suitability for a declared stochastic-computing use; it does not certify randomness for every purpose.</sub> | In progress · shared · Design and preparation | Destination / module / package | undecided | 2026-10-13 |
| EXPERIMENT-LEDGER<br><sub>Records experiment lineage across tools without owning their raw evidence or running their computations.</sub> | In progress · shared · Design and preparation | Destination / module / package | undecided | 2026-10-13 |
| SC-NC-CORE<br><sub>Neuron/synapse primitives, network graph, simulation loop, fixed-point semantics, constants and exceptions.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-CATALOGUE<br><sub>Neuron models, model zoo and topology/connectome generators.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-ENGINE<br><sub>Accelerated execution and its maintained language/native interfaces.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-BRIDGES<br><sub>Interchange and cross-domain adapters including NIR, quantum, HDC/VSA and neuro-symbolic routes.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-LEARN<br><sub>Training and adaptation, including surrogate gradients, plasticity, online learning, quantisation-aware training and distillation.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-DATA<br><sub>Datasets, signal/event encoding, augmentation, codecs, sources and recording adapters.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-ANALYSIS<br><sub>Spike-train analysis, visualisation and explainability.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-COMPILER<br><sub>Equation/IR lowering and hardware collateral for supported numerical models.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-HARDWARE<br><sub>Target profiles, mapping, deployment, drivers and power/thermal integration.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-VERIFY<br><sub>Formal, fault, resilience and safety-readiness verification within explicit proof scopes.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-STUDIO<br><sub>Visual composition, inspection and evidence presentation workflows.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-RESEARCH<br><sub>Retained experimental paths, including evolutionary, biological and world-model directions.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-NC-BENCH<br><sub>Catalogue/workload suites and immutable source-bound benchmark records.</sub> | In progress · component · Workbench transition | Destination / module / package | Undecided for independent release | 2026-10-13 |
| MODEL-PROVENANCE-PACK<br><sub>Binds a model's data, training, conversion, quantisation, encoding and supporting evidence into a verifiable provenance pack.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SPIKE-LOG<br><sub>Records, indexes, verifies, slices and replays event streams without losing their provenance or timebase identity.</sub> | In progress · tool · Design and implementation | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SPIKE-FORMAT-BRIDGE<br><sub>Converts event recordings between declared formats and reports every permitted loss rather than hiding timestamp, polarity or side-stream changes.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SPIKE-CODEC-BENCH<br><sub>Measures compression of existing spike trains, comparing payload ratio, distortion, encode/decode latency and memory.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SPIKE-ENCODER-CHARACTERISER<br><sub>Measures the information, spike-rate and latency trade-offs of sensor-to-spike encoders.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SPIKE-QUALITY-GATE<br><sub>Checks event data against a named quality policy for timestamp, noise, sensor-health, rate, gap and spatial defects.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SPIKE-GROUNDTRUTH<br><sub>Generates reproducible event-vision, audio, sensor and control stimuli with ground truth defined by the generator.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SNN-DIVERGENCE-HARNESS<br><sub>Compares the same network and input across implementations under bit-exact, tolerance or statistical oracles.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-STREAM-PROVER<br><sub>Compares realised stochastic-computing arithmetic error with a declared bound for a specific circuit, source and stream-length regime.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| MUTATION-SNN<br><sub>Measures test adequacy by generating declared semantic mutants and recording what the suite detects.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| NIR-CONFORMANCE<br><sub>Tests importer/exporter behaviour against the known semantics of a pinned Neuromorphic Intermediate Representation version.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| NEURO-EVIDENCE-BENCH<br><sub>Executes declared neuromorphic benchmark plans and traces each scoped result back to its raw evidence.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SPIKE-CALIBRATOR<br><sub>Measures classifier confidence against correctness under declared signal definitions, shifts and placements.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| BITSTREAM-EVIDENCE-CI<br><sub>Captures pinned FPGA build inputs, reports and bitstream identity in a reproducibility-aware chained build ledger.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| PLASTICITY-WITNESS<br><sub>Compares observed learning-rule updates with an independently defined fixed-point or statistical oracle under stated spike/load/fault protocols.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| AER-LINK-WITNESS<br><sub>Measures event-link behaviour under load, including loss, reordering, fairness, starvation and forward progress.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| RELIABILITY-WITNESS<br><sub>Characterises reliability within a declared physical or explicitly simulated exposure, retaining conditions, gaps and rare-event uncertainty.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SIM-REAL-WITNESS<br><sub>Quantifies simulation-to-fabric differences for the same model, input and observable population.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| DEPLOY-PACK<br><sub>Composes validated deployment evidence with bitstream/driver identity into a verifiable install/update package.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| FIELD-OPS-WITNESS<br><sub>Aggregates compact field health and drift evidence against deployment-time envelopes without actuating devices.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| FLIGHT-RECORDER<br><sub>Retains a bounded per-device event/state history for gap-honest incident reconstruction.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| NEURO-SAFETY-CASE<br><sub>Composes scoped evidence and open gaps into an assessor-facing assurance argument; it certifies nothing itself.</sub> | In progress · tool · Design and implementation | Destination / module / package | Undecided for independent release | 2026-10-13 |
| SC-COMPUTE-ADAPTERS<br><sub>Owns the SC-NeuroCore-side wrappers and numerical/register/handshake contracts needed to put selected generated peripherals into the independent LOOP-TIMING-WITNESS DUT/capture path.</sub> | In progress · workbench module · Architecture and interface work | Destination / module / package | Independent distribution terms being defined | 2026-10-13 |
| SC-NC-BIO<br><sub>Conditional destination for separately owned biological/biohybrid work if its independent release lifecycle is accepted; current experimental bioware remains in the developmental parent.</sub> | In progress · conditional architecture destination · Architecture and interface work | Destination / module / package | Independent distribution terms being defined | 2026-10-13 |

</details>

<details>
<summary><strong>05 · SCPN Quantum Computing Systems</strong> · 24 repositories · 28 catalogue entries</summary>

Permanent SCPN-QUANTUM-CONTROL workbench; oscillatools and SCPN-QUANTUM-ENGINE are separate distributions, not extra workbenches. Sixteen component destinations and eight tool destinations are being developed; QUANTUM_LAB is a workspace. Independent package licences and releases remain separate from the parent.

[Group architecture maps](https://github.com/anulum/scpn-quantum-control/blob/main/docs/ecosystem.md)

| Project / component | Role and development stage | Repository / availability | Declared licence | Source date |
|---|---|---|---|---|
| [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control)<br><sub>Integrated modelling, simulation, compilation, gradients, control, provider workflows, analysis and Quantum Studio.</sub> | In progress · workbench · Released software · ongoing development | Public | AGPL-3.0-or-later | 2026-10-13 |
| oscillatools<br><sub>Classical coupled-phase-oscillator dynamics, observables, sensitivities and control-oriented numerical tools.</sub> | In progress · package · Released software · ongoing development | Destination / module / package | AGPL-3.0-or-later | 2026-10-13 |
| scpn-quantum-engine<br><sub>Optional Rust/PyO3 numerical acceleration and native computation used by supported workbench paths.</sub> | In progress · package · Released software · ongoing development | Destination / module / package | AGPL-3.0-or-later | 2026-10-13 |
| QPU-RESULT-PACK<br><sub>Preserve raw results and their provenance, derivations and reviewable presentation.</sub> | In progress · tool · Implementation and integration | Local, unpublished | not stated | 2026-10-13 |
| TRANSPILE-WITNESS<br><sub>Retain scoped observations about compilation semantics, layout, global phase and replay.</sub> | In progress · tool · Implementation and integration | Destination / module / package | AGPL-3.0-or-later by file headers; no licence field in packaging | 2026-10-13 |
| MITIGATION-WITNESS<br><sub>Evaluate mitigation on declared measurement panels with retained inputs and uncertainty.</sub> | In progress · tool · Implementation and integration | Local, unpublished | AGPL-3.0-or-later | 2026-10-13 |
| SCPN-QC-CONTRACTS<br><sub>Versioned parameter, result, semantic and evidence interface contracts shared by components.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-CORE<br><sub>Configuration, logging, resource budgets and generic Kuramoto-XY problem foundations, separated from paper-specific research assumptions.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-AD<br><sub>Whole-program automatic differentiation, derivative transforms, batching, optimisation and explicit supported-path contracts.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-SIM<br><sub>Classical and quantum oscillator dynamics, XY/Kuramoto solvers, open-system simulation, tensor-network paths and co-simulation.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-COMPILER<br><sub>Model and circuit frontends, intermediate representations, interchange and code generation.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-QNODE<br><sub>Quantum tapes, gradient execution and framework bridges for supported Qiskit, PennyLane, JAX, PyTorch and TensorFlow paths.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-HAL<br><sub>Provider-neutral workloads, capabilities, job/result contracts and optional provider adapters.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-MITIGATION<br><sub>Error-mitigation implementations and their method taxonomy.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-QEC<br><sub>Quantum error-correction analysis and fault-tolerant resource-reporting surfaces.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-CONTROL<br><sub>Feedback and co-design, chimera and topology-aware control, and DLA-constrained control paths.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-ANALYSIS<br><sub>Observables, synchronisation witnesses, result analysis and the open-data DLA-parity pathway.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-LEARN<br><sub>Forecasting, quantum neural models, surrogate models, kernels and variational learning paths.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-APPS<br><sub>Domain application adapters, quantum randomness, cryptography and sensing workflows, with explicit claim boundaries.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-BENCH<br><sub>Workload-specific benchmark suites, comparison harnesses, campaign reproduction and retained run evidence.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-STUDIO<br><sub>Quantum Studio's visual workflows, inspectors and evidence presentation through the shared Studio platform contract.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| SCPN-QC-RESEARCH<br><sub>Experimental SCPN theory, paper-specific assumptions and research adapters whose contracts are not stable.</sub> | In progress · component · Workbench transition | Local, unpublished | Undecided for independent release | 2026-10-13 |
| NOISE-MODEL-WITNESS<br><sub>Compare model predictions and replay observations for the same circuit and shot identities, with uncertainty, shot floors, calibration epochs and declared tolerances.</sub> | In progress · tool · Design and implementation | Local, unpublished | Undecided for independent release | 2026-10-13 |
| VENDOR-CLAIM-RECOMPUTER<br><sub>Recompute released-data quantum-volume, error-per-layer-gate and logical-error claims against fixed definitions, original inputs and declared computation budgets.</sub> | In progress · tool · Design and implementation | Local, unpublished | Undecided for independent release | 2026-10-13 |
| DECODER-WITNESS<br><sub>Compare real decoder engines on released shot data with lossless adapters, declared noise conditions and uncertainty-aware reports.</sub> | In progress · tool · Design and implementation | Local, unpublished | Undecided for independent release | 2026-10-13 |
| GRADIENT-WITNESS<br><sub>Check software derivatives against declared analytic, parameter-shift and finite-difference references, including complex, finite-shot and cross-framework cases.</sub> | In progress · tool · Design and implementation | Local, unpublished | Undecided for independent release | 2026-10-13 |
| CONFORMANCE-WITNESS<br><sub>Check versioned OpenQASM 3, adapter behaviour, provenance fields and repository-evidence criteria against their normative clauses and actual entry points.</sub> | In progress · tool · Design and implementation | Local, unpublished | Undecided for independent release | 2026-10-13 |
| QUANTUM_LAB<br><sub>Reserved research workspace name; implementation role is not assigned in the group map.</sub> | In progress · workspace · Workspace definition | Destination / module / package | Not stated | 2026-10-13 |

↔ EVIDENCE-MANIFEST-TOOLKIT · RANDOMNESS-WITNESS · EXPERIMENT-LEDGER

</details>

<details>
<summary><strong>06 · Scientific Discovery and Experimentation</strong> · 0 repositories · 0 catalogue entries</summary>

Registered 12 October 2026; in formation; zero registered projects and repositories. Owns hypothesis → experiment → check → record → model-update proposals and the shared benchmark/report format. Domain models, hardware and execution authority remain with the owning groups. No completed discovery loop is claimed.


</details>

**Additional public research record**

Fusion Equilibrium Challenge is a public reproduction package created on 14 October 2026, after the group inventory. It is listed separately to preserve the dated group totals. Results and limitations belong to its own record.

- [Fusion Equilibrium Challenge](https://github.com/anulum/fusion-equilibrium-challenge) · In progress · AGPL-3.0-or-later · 2026-10-15
<!-- profile-catalogue:inventory:end -->

## Sponsorship goals

Open work here is funded through [GitHub Sponsors](https://github.com/sponsors/anulum).
About **USD 25,000 a month** is the minimum that keeps the lab running without
interruption: compute, GPU, QPU and FPGA time, hardware, CI and tooling. This is
lab cost, not a salary. Above that minimum the work scales, because the engine
turns additional compute directly into more built and verified work.
Sponsorship pays for the lab; it does not buy results, and findings are
published whichever way they fall.

To direct your support, name the engine or one domain when you sponsor; the
money is spent there and reported in the quarterly note. The hardware the lab
needs is listed item by item in [LAB_EQUIPMENT.md](LAB_EQUIPMENT.md), and
equipment can also be given in kind.

### The engine

**03 · Agentic Coordination, Assurance and Continuity.** The autonomous coding
and verification system that builds and checks every project on this page,
taken to 1.0 as open infrastructure. It combines [SYNAPSE CHANNEL](https://github.com/anulum/synapse-channel)
(agent coordination with receipts), [Rigor Foundry](https://github.com/anulum/rigor-foundry) (evidence-bound
review), [Director-AI](https://github.com/anulum/director-ai) (grounding of claims) and
[Remanentia](https://github.com/anulum/remanentia) (auditable memory). Sponsorship pays for model and GPU
time for the agent fleet, evaluation benchmarks and CI.

### Four domains

| Domain | Goal | Sponsorship pays for |
|---|---|---|
| **01 · Reactor Systems** | 55 owning repositories, including ATLAS-REACTORUM: 26 public and 29 locally initialised but unpublished. Fusion, fission, chemical and hybrid models, shared kernels, geometry and reactor evidence. World models, 3D simulations and device designs are programme outputs under development; a design is not a validated reactor. | simulation compute, CAD tooling, documentation |
| **02 · Systems Integration and Control** | The **SCPN Studio Hub**, which federates the studios of all groups: a studio catalogue, evidence audited across domains, every claim shown at its true boundary, and fail-closed gating of anything that could touch hardware. The group also maintains [scpn-control](https://github.com/anulum/scpn-control) and [scpn-phase-orchestrator](https://github.com/anulum/scpn-phase-orchestrator). | CI, hardware-in-the-loop replay, documentation |
| **04 · SC Neuromorphic Computing** | **SNN Studio 1.0**, the browser IDE for the whole spiking-network lifecycle: design neuron models, build networks, train with surrogate gradients, compile to SystemVerilog and synthesise to FPGA, with an exportable evidence record for every run. Built on [sc-neurocore](https://github.com/anulum/sc-neurocore); a development preview today. | FPGA boards and synthesis time, measurement bench, CI |
| **05 · SCPN Quantum Computing** | **Quantum Studio**, a workbench on [scpn-quantum-control](https://github.com/anulum/scpn-quantum-control): a map of what exists and how it connects, circuits designed and run on simulators and real quantum hardware, and every result packaged with raw counts, hashes and a written protocol and decision rule, negative results included.  | QPU time, GPU simulation, documentation |

### For organisations

- **Research agreement.** An organisation can fund a defined piece of work
  under a written research agreement, invoiced directly, instead of a
  sponsorship. Scope and deliverables are agreed first; findings are
  published under the same rule as above.
- **Commercial licence.** Projects under AGPL-3.0-or-later can be licensed
  on commercial terms for proprietary or closed use, for example [SYNAPSE CHANNEL](https://anulum.li/synapse/pricing.html), [SC-NeuroCore](https://anulum.li/sc-neurocore/pricing.html), [SCPN Control](https://anulum.li/scpn-control/pricing.html), [SCPN Fusion Core](https://anulum.li/scpn-fusion-core/pricing.html), [SCPN Phase Orchestrator](https://anulum.li/scpn-phase-orchestrator/pricing.html), [SCPN Quantum Control](https://anulum.li/scpn-quantum-control/pricing.html).
  Apache-2.0 projects such as Director-AI and Rigor Foundry need no licence;
  [Director-AI Pro](https://anulum.li/director-ai/pricing.html) is a commercial self-hosted edition, and support
  and integration can be contracted for any project. The LICENSE file of each
  repository states which licence applies.
- **Contact:** [protoscience@anulum.li](mailto:protoscience@anulum.li), with "research agreement" or "commercial licence"
  and the project name in the subject.

## Research output

| Surface | Verified route |
|---|---|
| Complete research index | [Publications, preprints, software archives, and evidence boundaries](PUBLICATIONS.md) |
| Publications hub | [anulum.li/papers/](https://anulum.li/papers/): every Zenodo record with BibTeX |
| Releases and publications stream | [anulum.li/news/](https://anulum.li/news/) · [RSS](https://anulum.li/news/feed.xml) |
| Curriculum vitae | [One-page PDF](cv/Miroslav-Sotek-CV.pdf) · [Markdown source](cv/Miroslav-Sotek-CV.md) · [JSON Resume](cv/resume.json) |
| Research identity | [ORCID 0009-0009-3560-0851](https://orcid.org/0009-0009-3560-0851) |
| Software publication | [20 listed distributions on PyPI](https://pypi.org/user/anulum/) |
| Quantum-control software | [Zenodo DOI 10.5281/zenodo.18821929](https://doi.org/10.5281/zenodo.18821929) |
| Fusion software | [Zenodo DOI 10.5281/zenodo.18820864](https://doi.org/10.5281/zenodo.18820864) |
| Phase-system preprints | [Matched false-alarm study](https://doi.org/10.5281/zenodo.22113062) and [grid regime-map study](https://doi.org/10.5281/zenodo.22113116) |
| HushLine software | [Zenodo DOI 10.5281/zenodo.20775432](https://doi.org/10.5281/zenodo.20775432) |

## PyPI publication

[PyPI](https://pypi.org/user/anulum/)

<!-- profile-catalogue:packages:start -->
20 named distributions checked individually against the PyPI JSON API on 2026-10-15. This is a verified list, not a claim that the entire account has been exhaustively indexed. Versions are package metadata, not scientific validation or matched historical DOI releases.

<details>
<summary><strong>Published distributions</strong> · 20</summary>

| PyPI | Version |
|---|---|
| [synapse-channel](https://pypi.org/project/synapse-channel/) | 0.99.38 |
| [scpn-phase-orchestrator](https://pypi.org/project/scpn-phase-orchestrator/) | 1.4.3 |
| [spo-kernel](https://pypi.org/project/spo-kernel/) | 0.5.10 |
| [director-ai](https://pypi.org/project/director-ai/) | 3.21.0 |
| [director-ai-lite](https://pypi.org/project/director-ai-lite/) | 3.21.0 |
| [scpn-quantum-control](https://pypi.org/project/scpn-quantum-control/) | 1.2.0 |
| [scpn-fusion-rs](https://pypi.org/project/scpn-fusion-rs/) | 4.0.0 |
| [scpn-fusion](https://pypi.org/project/scpn-fusion/) | 4.0.0 |
| [rigor-foundry](https://pypi.org/project/rigor-foundry/) | 1.0.0 |
| [scpn-control](https://pypi.org/project/scpn-control/) | 0.23.0 |
| [oscillatools](https://pypi.org/project/oscillatools/) | 0.1.0 |
| [scpn-quantum-engine](https://pypi.org/project/scpn-quantum-engine/) | 0.2.0 |
| [scpn-studio-platform](https://pypi.org/project/scpn-studio-platform/) | 0.11.2 |
| [sc-neurocore-engine](https://pypi.org/project/sc-neurocore-engine/) | 3.16.0 |
| [sc-neurocore](https://pypi.org/project/sc-neurocore/) | 3.16.0 |
| [scpn-mif-core](https://pypi.org/project/scpn-mif-core/) | 0.1.1 |
| [remanentia](https://pypi.org/project/remanentia/) | 0.5.0 |
| [backfire-kernel](https://pypi.org/project/backfire-kernel/) | 0.1.3 |
| [hushline](https://pypi.org/project/hushline/) | 0.1.5 |
| [loop-timing-witness](https://pypi.org/project/loop-timing-witness/) | 0.1.0 |

</details>
<!-- profile-catalogue:packages:end -->

## Languages and platforms

**Primary implementation**

<p>
  <img alt="Python" src="assets/badges/python.svg">
  <img alt="Rust" src="assets/badges/rust.svg">
  <img alt="TypeScript" src="assets/badges/typescript.svg">
  <img alt="JavaScript" src="assets/badges/javascript.svg">
  <img alt="Go" src="assets/badges/go.svg">
</p>

<details>
<summary><strong>Extended scientific, formal, hardware, and operations stack</strong></summary>

**Scientific, native, and formal work**

<p>
  <img alt="Julia" src="assets/badges/julia.svg">
  <img alt="Mojo" src="assets/badges/mojo.svg">
  <img alt="C++" src="assets/badges/cpp.svg">
  <img alt="C" src="assets/badges/c.svg">
  <img alt="Lean" src="assets/badges/lean.svg">
  <img alt="Jupyter" src="assets/badges/jupyter.svg">
  <img alt="LaTeX" src="assets/badges/latex.svg">
</p>

**Hardware, web, and operations**

<p>
  <img alt="Verilog" src="assets/badges/verilog.en.svg">
  <img alt="SystemVerilog" src="assets/badges/systemverilog.svg">
  <img alt="WGSL" src="assets/badges/wgsl.svg">
  <img alt="HTML5" src="assets/badges/html5.svg">
  <img alt="CSS3" src="assets/badges/css3.svg">
  <img alt="Shell" src="assets/badges/shell.svg">
  <img alt="Docker" src="assets/badges/docker.svg">
  <img alt="Linux" src="assets/badges/linux.svg">
</p>

The portfolio also contains maintained protobuf/gRPC contracts, Python-Rust
bridges built with PyO3 and Maturin, WebAssembly targets, native SIMD paths,
scientific notebooks, and multi-language API documentation.

</details>

## Engineering practice

<p>
  <img alt="pytest" src="assets/badges/pytest.en.svg">
  <img alt="Ruff" src="assets/badges/ruff.en.svg">
  <img alt="mypy" src="assets/badges/mypy.en.svg">
  <img alt="Cargo" src="assets/badges/cargo.en.svg">
  <img alt="CodeQL" src="assets/badges/codeql.en.svg">
  <img alt="REUSE" src="assets/badges/reuse.en.svg">
  <img alt="GitHub Actions" src="assets/badges/github-actions.svg">
</p>

Practices are applied according to each repository's risk and scope. Not every
repository runs every tool.

| Quality dimension | Practices used across the portfolio |
|---|---|
| Correctness | Deterministic pytest and Cargo suites, branch-aware coverage gates, parity tests, regression fixtures, and explicit negative cases |
| Static quality | Ruff formatting and linting, strict mypy where declared, Cargo fmt, Clippy with warnings denied, and API-contract checks |
| Reproducibility | Hash-pinned dependency locks, protocols committed before the run, raw result packs, content digests, benchmark metadata, and replayable audit records |
| Security | Bandit, CodeQL and scorecards where enabled, threat models, least-authority execution, secret boundaries, and dependency review |
| Supply chain | SPDX headers, REUSE 3.x checks, SBOM generation where applicable, pinned CI actions, signed or digest-bound evidence, and release manifests |
| Polyglot verification | Python/Rust parity, PyO3 and Maturin bridges, Go and Julia tests, Lean builds, WebAssembly targets, and RTL/formal checks where relevant |
| Documentation | Warning-fatal or strict MkDocs/Sphinx builds, generated API references, architecture decisions, validation records, and explicit non-claims |
| Delivery | Repository-local preflight gates, CI workflows, PyPI packages, wheels and source distributions, containers, and benchmark harnesses |

## Evidence, not slogans

Negative and null results are published when they are real. Public claims stay
tied to measurements, protocols committed before the run, raw packs, source-bound reviews,
or executable verification.

Example: SCPN Quantum Control publishes protocols committed before the run and hash-bound
result packs rather than converting experimental activity into a readiness or
advantage claim.

## Working principles

- Evidence before claims.
- Reproducible artefacts before presentation.
- Clear boundaries between research, validation, and product readiness.
- Cross-language implementations where performance or hardware integration
  justifies them.
- Fail closed when provenance, authority, or evidence is incomplete.
- Negative results and failure records remain part of the research output.

## Collaboration

<!-- profile-catalogue:partner:start -->
### Founding and research partners

We seek pre-seed backing and partners to jointly found a research institute, a company and a non-profit research company. The programme currently belongs to one individual; these vehicles and sites are proposals, not established institutions. The initial geographic picture is Switzerland or Liechtenstein, Czechia or Slovakia, and a third site in the Middle East whose location is open. We bring the software, research programme and governed agent organisation. Partners can bring capital, independent replication, measured domain data, chip design and fabrication, laboratories, instrumentation or hardware-in-the-loop facilities. A first engagement should specify one problem, one deliverable and the evidence that will decide success. No partner commitment or funding award is implied.
<!-- profile-catalogue:partner:end -->

### Licensing model

| Model | Typical boundary |
|---|---|
| Apache-2.0 | Permissive public cores such as Director-AI and Rigor Foundry |
| AGPL-3.0-or-later | Public network-facing and research systems with source-sharing obligations |
| Open core | Public core with separately licensed advanced or managed product surfaces |
| BUSL-1.1 | Selected private commercial systems with a declared future change licence |
| Commercial licence | Alternative terms for organisations that cannot use the public licence |

| Mode | Scope |
|---|---|
| Research collaboration | Reproducible studies in AI assurance, neuromorphic systems, quantum simulation, plasma physics, and control |
| Technical collaboration | Architecture review, validation design, formal or hardware paths, and evidence-bound software engineering |
| Commercial licensing | Dual-licensed and managed product surfaces through the [Anulum licensing route](#for-organisations) |
| Open-work sponsorship | CI, compute, hardware and quantum experiment time, and public documentation through [GitHub Sponsors](https://github.com/sponsors/anulum) |

I welcome technically grounded collaboration in reliable AI infrastructure,
multi-agent systems, neuromorphic computing, scientific software, formal
verification, quantum simulation, plasma physics, and control.

Engagements are taken selectively. The public GitHub profile currently marks
the account as hireable; this is not a guarantee of immediate capacity.

A useful first message includes the problem, constraints, relevant prior art,
and what evidence would count as success. Contact me through
[protoscience@anulum.li](mailto:protoscience@anulum.li) or
[anulum.li](https://anulum.li).

I respond to technical proposals. I do not take on ungrounded hype work,
demo-only science theatre, or claims that cannot be checked.

For sustained open work, [GitHub Sponsors](https://github.com/sponsors/anulum)
funds CI runners, compute, hardware and quantum experiment time, and public
documentation rather than marketing.

> **Transparency:** These repositories span research software, developer tools,
> private systems, and product candidates. Active development does not imply
> production readiness or scientific validation unless a project provides
> explicit evidence.

## Text and data mining reservation

The rightsholder, Miroslav Šotek (ANULUM), expressly reserves the use of the
works in this repository for text and data mining, including the collection of
this content for, and its use in, training, fine-tuning or evaluating machine
learning and artificial intelligence models, in accordance with Article 4(3) of
Directive (EU) 2019/790 and the national provisions transposing it.

No permission for such use has been granted beyond what the licence in
`LICENSE` grants. This reservation does not change that licence: uses the
licence permits remain permitted on its terms, including its attribution and
share-alike conditions.

Reservation made on 2026-10-20. Requests for permission: contact the
rightsholder through the contact listed in this repository.

<p align="center"><em>I AM THAT</em></p>

<p align="center">
  <img src="assets/anulum-logo-footer.jpg" width="100%" alt="Anulum">
</p>
