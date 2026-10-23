<!--
SPDX-License-Identifier: AGPL-3.0-or-later
Commercial license available
© Concepts 1996–2026 Miroslav Šotek. All rights reserved.
© Code 2020–2026 Miroslav Šotek. All rights reserved.
ORCID: 0009-0009-3560-0851
Contact: www.anulum.li | protoscience@anulum.li
ANULUM — Research atlas
-->

# Research atlas

Explore the research programmes, project connections, expected outputs,
partner contributions, material needs and preliminary resource scenarios.
The map and detailed explanations are being developed. Active work, released
software and qualified results have separate evidence.

The version and exact asset fingerprints are in [atlas-manifest.json](atlas-manifest.json).
Individual source documents retain their own capture dates and fingerprints.
A newer atlas snapshot does not make an older source document current.

The 23 October portfolio refresh checks the published main revisions of the
35 registered public repositories. Refreshed reading documents carry their
own capture dates and fingerprints; independently cited technical documents
retain their earlier captures. Local changes and unpublished experiments
are separate from these published-source observations.

The Control and Phase Orchestrator passports now reuse their existing cited
technical explanations. Other updated passports distinguish source-described
inputs, results and acceptance requirements from completed qualification.
Director-AI's bounded Core wording has source-owner approval. Quantum Control
links to its public repository and documentation; its detailed passport and
later local research remain separately qualified.

The component-source reconciliation also checks Atlas Reactorum, the Synapse
Policy Check Action and two packages within Quantum Control against published
source revisions. Their reading views show the original parent paths and exact
revision scope. Remanentia has source-owner-approved descriptive metadata for
its locally documented result-custody contract; custody acknowledgement,
release evidence and complete workflow success remain separately qualified.

All six groups now have detailed resource records. Discovery adds 28 dated
preliminary needs, 25 acquisition categories and 17 role/space records from its
content-approved projection. These are requirements and alternative scenarios,
not equipment purchases, staff appointments or leased premises. Its 13 October
source assumptions retain their date; the 22 October content review supplies no
measured workload, current holdings or scientific qualification.

Structured project passports also retain the concrete inputs, result
representations and qualification boundaries from their existing cited
technical explanations. Original programme deliverables, partner requirements
and source-owner review states remain visible. Technical guide captures retain
their dates; documentary reconciliation supplies no new execution result or
completed acceptance. Quantum passport fields awaiting owner approval remain
open.

The current registry also identifies the account Pages root. Its public
source synopsis is included with its exact revision; a public repository
does not establish delivered hosting behaviour. Static illustrations retain
their dated inventories. New registry entries and passport details are
available through the interactive data and project views.

The CONTROL and Phase Orchestrator passports incorporate their project
source owners’ dated published-source responses. Pinned revisions and file
fingerprints distinguish software interfaces and review artefacts from physical
acceptance. Missing hardware sizing, facilities, partner agreements and delivery
commitments remain explicit.

Repository documents marked as withheld are excluded from the public reading
view. Their project identities may remain in the map. The generator rejects
restored source text, excerpts and declarations for these restricted entries.

GitHub displays HTML files as source. To use the interactive explorer locally,
run this from the repository root:

```sh
python3 -m http.server --bind 127.0.0.1 --directory docs/atlas 8000
```

Then open [the explorer](http://127.0.0.1:8000/index.html).
The static tree also supports hosting beneath a path such as `/atlas/`;
its assets and navigation use relative URLs.

Useful entry points after serving the tree:

| View                        | Relative address                                                      |
| --------------------------- | --------------------------------------------------------------------- |
| Programme overview          | `index.html#view=overview`                                            |
| Interactive map             | `index.html#view=map`                                                 |
| Technical explanations      | `index.html#view=technical`                                           |
| Project detail              | `index.html#project=SCPN-QC-SIM`                                      |
| Component comparison        | `index.html#view=compare&entries=SCPN-QC-CORE,SCPN-QC-AD,SCPN-QC-SIM` |
| Partner contributions       | `index.html#view=partners`                                            |
| Material and resource needs | `index.html#view=resources`                                           |
| Source documents            | `index.html#view=documents`                                           |

The [equipment and resource inventory](resources.html) has separate views for
needs, acquisition candidates, people and spaces. Its selection link retains
the view, group, project/group scope, search and applicable verification filters.
For example, `resources.html#view=candidates&verification=independent`
opens the dated candidates whose primary pages were independently read.

Use **Download records as CSV** to export the current selection. Each row keeps
its source date, author, supplied fingerprint and source URL where available;
the original source record is also retained in a JSON column. Staffing and room
estimates keep their original values and units. These are source records and
acquisition alternatives, not a reconciled purchase total.

For a static reading view, open the [complete SVG map](F2_complete_project_atlas_v0.6.svg)
or [technical atlas](atlas_full.html). JSON downloads are linked in the explorer.

Verify the integrated snapshot from the repository root:

```sh
python3 tools/sync_atlas.py --check
```

A subsequent selected export can be imported with `--source`, `--manifest`
and `--expected-manifest-sha256`. The importer verifies every selected asset,
checks all eight embedded datasets, and refuses changed local assets or an
unmanaged destination. Only manifest-listed files transfer. Import does not
deploy a website or change source-content, scientific or release qualification.

The explorer and its original assets retain their copyright and licence statements.
The [AGPL-3.0-or-later licence text](LICENSE) is included; source documents retain their own notices.

The resource-selection tests require Node.js as well as Python:

```sh
python3 -m unittest discover -s tests -p test_resource_inventory.py -v
```

The browser modules have no runtime package dependencies. The pinned development
toolchain uses Node.js 26.10 and the repository's integrity-locked npm dependencies.
After `npm ci --ignore-scripts`, `node tools/render_atlas.mjs --check` verifies the
entry pages, module content versions and complete asset inventory. Use `--write`
to regenerate derived files after an intentional source change.

The Atlas validation workflow checks complete source types, lint, formatting,
licences and dependency security. Its real-browser tests exercise reading routes,
keyboard and pointer controls, native downloads, accessibility and deliberately
damaged copies of the complete source artefact. Per-file statement and branch
coverage is a blocking check; a source snapshot does not imply a passing run.

The native tests use the actual inventory and Python's CSV reader.
`tests/test_resource_explorer.mjs` supplies a real Playwright Page check for
all four views, downloaded files, restored selections, browser history and
mobile layouts. Its `--browser-code` output supplies the Page callback; callers
provide `baseUrl` and an owned `downloadDirectory`. After saving its returned
report as JSON, `node tests/test_resource_explorer.mjs --verify REPORT.json`
independently reads the downloaded CSV files and checks the original records.

## Profile and website assets

GitHub renders the five profile READMEs and their local images directly.
The profile links here through `docs/atlas/README.md`; it does not load the
interactive HTML or the atlas datasets. Its dated catalogue provenance is
[assets/catalogue-source.json](../../assets/catalogue-source.json), a compact
projection of project identities, purposes, status, licences and repository
observations, independent of resource and budget data.

| Surface                                  | Required local content                                             |     Uncompressed bytes |
| ---------------------------------------- | ------------------------------------------------------------------ | ---------------------: |
| Profile images across all five languages | Four generated header/map SVGs, 91 badge SVGs and the footer image |                621,868 |
| Dated catalogue provenance               | `assets/catalogue-source.json`, plus its ownership sidecar         | 114,267 before sidecar |
| Interactive site snapshot                | 77 manifest-listed assets                                          |             33,508,072 |
| Main interactive entry page              | `index.html`, including its eight embedded datasets                |             10,336,860 |

The HTML, JavaScript modules, source-document JSON, illustrations and figure
downloads belong to the separately hosted explorer. The full snapshot repeats
datasets in the standalone downloads and HTML views; its byte count is not the
size of a GitHub profile page or a compressed network transfer. Hosting
`index.html` alone would omit linked modules, inventory views and downloads.
The complete manifest is the supported site asset set.

Public presentation uses role names for internal authorship. Literal product,
API, dependency and reproducibility identifiers inside dated project source
documents retain their technical meaning. The internal proposal budget history
is excluded. Scenario amounts remain preliminary, separately sourced estimates.
Experiment labels in the map and SVG/PDF/PNG figures use outward descriptions.
These presentation changes do not refresh the underlying source capture dates.

The NeuroCore and Quantum Control guides include source-inspected implementation
workflows and diagrams. Their shared local neural bridge explicitly returns
scaled binary spike outputs from software statevector processing. Package,
source-checkout, RTL and QPU routes keep separate scopes and evidence. Older
scientific and architecture references retain their original capture dates.

The Reactor Kernels explanation now follows geometry and CAD representations
through their exact source contracts: canonical meshes, precision-aware STL/GLB,
native-unit STEP and tetrahedral meshing. Device models, physical properties,
consumer adoption and scientific qualification remain separately owned. Earlier
source captures and source-described project connections retain their own dates.

The CONTROL workflow explanation distinguishes Petri-net compilation, configured
controller artefacts, observation-to-action ticks and the separately bound
stateful exact-current neuron profile. Runtime-bound proofs, host timing admission
and non-actionable semantic review retain their own evidence requirements.
Existing project connections and older source captures keep their original dates.

The Phase Orchestrator explanation distinguishes domain binding and signal
extraction from the generic seeded model loop. Phase/amplitude evolution,
projected model-only feedback and audit records keep their declared origins;
reactor-semantic review retains separate producer and CONTROL admission roles.
Existing connections and earlier source captures preserve their original dates.

The Fusion Core explanation follows declared equilibrium problems, radial
transport and synthetic/inverse diagnostics. Its 3D surface export and reduced
Fourier force-balance calculation retain distinct inputs, outputs and checks;
case-level scientific evidence and downstream consumer admission remain separate.
Earlier project links and captured sources keep their original dates.

The MIF explanation follows typed merge decisions and the separately bound
Fusion-to-Fire software chain. Stateless stochastic admission and the stateful
exact-current AER diagnostic keep distinct model and authority scopes. Local RTL
cycles, FUSION model outputs, replay provenance and physical timing qualification
remain separate; source inspection here performs no new domain execution.

The Timing Witness explanation follows original fabric event ticks through loss-aware
buffering, manifest-bound run records and scoped latency, jitter and tracking reports.
Power windows, emulated plant/controller models and physical instrument acceptance
retain separate meanings. Current fabric documentation includes unfinished neural
work; reused architecture references preserve their earlier source date. Concrete
board, integration and instrumentation roles are requirements, not acquisitions.

Both resource views show coverage of the complete dated inventory before filters,
including groups with no supplied detail and explicitly unresolved quantity fields.
Their links open each group and inventory view. Record counts and acquisition
alternatives do not establish equipment counts, staffing, floor area or a budget.

The real-Page check in `tests/test_resource_coverage.mjs` exercises coverage on
both resource routes, native group navigation, missing-source handling, filtered
record correspondence and mobile layout. It uses the supplied local atlas data.

Resource entrypoints and their shared component/style use content-bound asset
URLs. Their real-browser check verifies those versions against served bytes,
including the existing user browser after a source update.

Funding routes now carry a separate 20 October application-state update.
Submitted, preparing and identified opportunities remain distinct from the
programme’s ongoing work. Official source links and checked deadlines are
shown where available; unsourced terms and draft-programme assumptions remain
explicit. The Advanced Innovation Challenge’s restricted second stage is
distinguished from an open application opportunity. Other source capture dates,
preliminary scenarios and project records retain their original scope.

Project cards and reading views use each entry’s reported state. Funding-route
labels distinguish identified opportunities, partner search, historical access
and programme-specific categories. Research access is separated from a cash
award, current quota and any new scientific validation.

The repository-owned `tools/atlas_publication_policy.json` identifies cleared source
owners, approved public identities and selected illustration bytes. Both the
generator and importer refuse withheld document text, technical quotations,
implementation dossiers, restored private images and stale map descriptions
before writing output. Changing an input export cannot remove these checks.
Approved SVG ownership-notice variants preserve the exact drawing contents.
