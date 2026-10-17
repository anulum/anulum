<!--
SPDX-License-Identifier: AGPL-3.0-or-later
Kommerzielle Lizenz verfügbar
© Konzepte 1996–2026 Miroslav Šotek. Alle Rechte vorbehalten.
© Code 2020–2026 Miroslav Šotek. Alle Rechte vorbehalten.
ORCID: 0009-0009-3560-0851
Kontakt: www.anulum.li | protoscience@anulum.li
Persönliche GitHub-Profilübersicht
-->

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/profile-header-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/profile-header-light.svg">
    <img src="assets/profile-header-dark.svg" width="1200" alt="Miroslav Šotek: Evidenz, Berechnung, Regelung">
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
  <a href="https://anulum.li"><img alt="Website" src="assets/badges/website.de.svg"></a>
  <a href="https://orcid.org/0009-0009-3560-0851"><img alt="ORCID" src="assets/badges/orcid.svg"></a>
  <a href="cv/Miroslav-Sotek-CV.pdf"><img alt="CV PDF" src="assets/badges/cv-pdf.de.svg"></a>
  <a href="https://pypi.org/user/anulum/"><img alt="PyPI" src="assets/badges/pypi-count.de.svg"></a>
  <a href="https://github.com/sponsors/anulum"><img alt="GitHub Sponsors" src="assets/badges/sponsors.de.svg"></a>
  <a href="mailto:protoscience@anulum.li"><img alt="E-Mail" src="assets/badges/email.de.svg"></a>
</p>

<p align="center">
  <a href="#projekte">Projekte</a> ·
  <a href="#aktueller-fokus">Aktueller Fokus</a> ·
  <a href="#ökosystemkarte">Ökosystem</a> ·
  <a href="#forschungsergebnisse">Forschungsergebnisse</a> ·
  <a href="#engineering-standards">Standards</a> ·
  <a href="#zusammenarbeit">Zusammenarbeit</a>
</p>

Unabhängiger Forscher und Systemingenieur mit Sitz in der Schweiz. Unter dem Namen Anulum entwickle ich wissenschaftliche Software und eine geregelte Forschungsorganisation. Fünf aktive Gruppen arbeiten an Reaktorsystemen, Integration und Regelung, Agentenkoordination und Absicherung, neuromorphem Rechnen und Quantencomputing. Eine sechste Gruppe, Scientific Discovery and Experimentation, befindet sich im Aufbau. Veröffentlichte Software, Architekturarbeit, World Models und angestrebte Hardwareergebnisse haben getrennte Evidenzgrenzen. Forschungsinstitut und Unternehmen werden zur gemeinsamen Gründung mit Partnern angeboten.

<table>
  <tr>
    <td width="20%"><strong>Der Motor</strong><br><sub>Agentenkoordination mit Quittungen, evidenzgebundene Reviews, Verankerung von Aussagen, auditierbares Gedächtnis</sub></td>
    <td width="20%"><strong>Reaktorsysteme</strong><br><sub>Katalog von Reaktorkonzepten, 3D/CAD, Level-0-Physik, Reactor Studio</sub></td>
    <td width="20%"><strong>Integration und Regelung</strong><br><sub>Studio Hub, Regelungs-Runtime, Synchronisationsanalyse, Fail-closed-Freigabe für Hardware</sub></td>
    <td width="20%"><strong>Neuromorphes Rechnen</strong><br><sub>SNN Studio, Rust-SIMD, Verilog-RTL, FPGA-Synthese</sub></td>
    <td width="20%"><strong>Quantencomputing</strong><br><sub>Schaltungen auf Simulatoren und echter Hardware, Ergebnispakete mit Rohdaten</sub></td>
  </tr>
</table>

## Einstieg

**[Projekte](#projekte)** für die Software und ihre Evidenz ·
**[Publikationen](https://anulum.li/papers/)** für jede Veröffentlichung und
jedes Softwarearchiv mit BibTeX · **[Kontakt](mailto:protoscience@anulum.li)**
für einen technischen Vorschlag. Für neue Leser wählt
[anulum.li/start/](https://anulum.li/start/) einen Einstieg nach Profil. Jedes
registrierte Projekt, filterbar nach Gruppe, Reaktorfamilie und Evidenz, mit
klickbarer Karte: [anulum.li/portfolio/](https://anulum.li/portfolio/).

## Projekte

Jede Karte verweist auf prüfbare Artefakte, nicht auf zusammenfassende
Aussagen. Evidenzlinks sind an den Commit gebunden, bei dem sie verifiziert
wurden. Release- und CI-Badges melden den Zustand von Registry und Workflow;
sie sind Betriebssignale, keine Bewertung wissenschaftlicher Qualität.

<table>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/synapse-channel">Synapse Channel</a></strong> · <sub><strong>Jetzt nutzbar</strong></sub><br><sub>Control Plane für Coding-Agentenflotten: Claims, Rollen, dauerhafte Mailboxen, Quittungen, Audit und Föderation.</sub><br><sub><a href="https://anulum.github.io/synapse-channel/">Dokumentation</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/VALIDATION.md">Validierung</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/coordination-spec.md">Koordinationsspezifikation</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/sandbox-threat-model.md">Bedrohungsmodell</a></sub><br><a href="https://pypi.org/project/synapse-channel/"><img alt="PyPI" src="https://img.shields.io/pypi/v/synapse-channel?style=flat-square"></a> <a href="https://github.com/anulum/synapse-channel/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/synapse-channel/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/director-ai">Director-AI</a></strong> · <sub><strong>Aktive Forschung</strong></sub><br><sub>Echtzeit-LLM-Schutz: NLI/RAG-Verankerung, Claim-Prüfung, native Beschleunigung, optionaler Streaming-Stopp auf Claim-Ebene, deklarierte Fähigkeitsgrenzen.</sub><br><sub><a href="https://anulum.github.io/director-ai/">Dokumentation</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/VALIDATION.md">Validierung</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/benchmarks/PUBLIC_BENCHMARKS.md">Öffentliche Benchmarks</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/docs/_generated/capability_matrix.md">Fähigkeitsmatrix</a></sub><br><a href="https://pypi.org/project/director-ai/"><img alt="PyPI" src="https://img.shields.io/pypi/v/director-ai?style=flat-square"></a> <a href="https://github.com/anulum/director-ai/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/director-ai/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/rigor-foundry">Rigor Foundry</a></strong> · <sub><strong>Jetzt nutzbar</strong></sub><br><sub>Evidenzgebundenes Repository-Inventar, Auditkandidaten, Review-Bindung und Sanierungsplanung.</sub><br><sub><a href="https://anulum.github.io/rigor-foundry/">Dokumentation</a></sub><br><a href="https://pypi.org/project/rigor-foundry/"><img alt="PyPI" src="https://img.shields.io/pypi/v/rigor-foundry?style=flat-square"></a> <a href="https://github.com/anulum/rigor-foundry/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/rigor-foundry/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/remanentia">Remanentia</a></strong> · <sub><strong>Jetzt nutzbar</strong></sub><br><sub>Auditierbares Gedächtnis für KI-Agenten und Wissenssysteme: hybrides Retrieval, Graphen, Konsolidierung, CLI, MCP und API.</sub><br><sub><a href="https://github.com/anulum/remanentia#readme">Dokumentation</a></sub><br><a href="https://pypi.org/project/remanentia/"><img alt="PyPI" src="https://img.shields.io/pypi/v/remanentia?style=flat-square"></a> <a href="https://github.com/anulum/remanentia/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/remanentia/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/sc-neurocore">SC-NeuroCore</a></strong> · <sub><strong>Aktive Forschung</strong></sub><br><sub>Stochastisches und neuromorphes Framework: Python-Modelle, Rust-SIMD-Pfade, Verilog-RTL, HDC/VSA, Compiler-Oberflächen und Hardwarenachweise.</sub><br><sub><a href="https://anulum.github.io/sc-neurocore/">Dokumentation</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/VALIDATION.md">Validierung</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/hardware/SYNTHESIS_RESULTS.md">Syntheseergebnisse</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/safety/TRACEABILITY_MATRIX.md">Rückverfolgbarkeitsmatrix</a></sub><br><a href="https://pypi.org/project/sc-neurocore/"><img alt="PyPI" src="https://img.shields.io/pypi/v/sc-neurocore?style=flat-square"></a> <a href="https://github.com/anulum/sc-neurocore/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/sc-neurocore/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-fusion-core">SCPN Fusion Core</a> · <a href="https://github.com/anulum/scpn-control">SCPN Control</a></strong> · <sub><strong>Aktive Forschung</strong></sub><br><sub>Tokamakphysik, Löser und Validierungskampagnen mit Pfaden zu realen Daten (Fusion Core); regelungstaugliche Laufzeit mit Fail-closed-Zulassung und Replay-Evidenz (Control).</sub><br><sub><a href="https://github.com/anulum/scpn-fusion-core/blob/3c841fc13109c8efb49bb079d145f70683a4408d/VALIDATION.md">Validierung</a> · <a href="https://github.com/anulum/scpn-fusion-core/blob/3c841fc13109c8efb49bb079d145f70683a4408d/docs/VALIDATION_REAL_DIIID_145419.md">DIII-D-Validierungsakte</a> · <a href="https://doi.org/10.5281/zenodo.18820864">Software-DOI</a></sub><br><a href="https://pypi.org/project/scpn-fusion/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-fusion?style=flat-square"></a> <a href="https://pypi.org/project/scpn-control/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-control?style=flat-square"></a> <a href="https://github.com/anulum/scpn-fusion-core/actions/workflows/ci-python-tests.yml"><img alt="CI" src="https://github.com/anulum/scpn-fusion-core/actions/workflows/ci-python-tests.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-quantum-control">SCPN Quantum Control</a></strong> · <sub><strong>Experimentell</strong></sub><br><sub>Evidenzbasierte Quantensimulation der Synchronisation gekoppelter Oszillatoren: vor dem Lauf festgeschriebene Protokolle, Hardware-Ergebnispakete, Rohzählungen und ausdrückliche Grenzen ohne Vorteilsbehauptung.</sub><br><sub><a href="https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/layout_relaxation_preregistration.md">Layout-Relaxation-Protokoll</a> · <a href="https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/hardware_result_packs.md">Ergebnispaket-Vertrag</a> · <a href="https://doi.org/10.5281/zenodo.18821929">Software-DOI</a></sub><br><a href="https://pypi.org/project/scpn-quantum-control/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-quantum-control?style=flat-square"></a> <a href="https://github.com/anulum/scpn-quantum-control/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/scpn-quantum-control/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-phase-orchestrator">SCPN Phase Orchestrator</a></strong> · <sub><strong>Aktive Forschung</strong></sub><br><sub>Evidenzgeführte Synchronisationsanalyse und ausschliesslich zur Prüfung bestimmte Regelungsvorschläge für gekoppelte rhythmische Systeme; Bewertung mit angeglichener Fehlalarmrate, negative Ergebnisse und begrenzte Übertragungsaussagen.</sub><br><sub><a href="https://github.com/anulum/scpn-phase-orchestrator/blob/1e9eea39fa6681dde2cfbdf074c08ff03a528b58/papers/submissions/README.md">Einreichungsindex</a> · <a href="https://doi.org/10.5281/zenodo.22113062">Preprint mit Negativergebnis</a> · <a href="https://doi.org/10.5281/zenodo.22113116">Preprint zur Netz-Regimekarte</a></sub><br><a href="https://pypi.org/project/scpn-phase-orchestrator/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-phase-orchestrator?style=flat-square"></a> <a href="https://github.com/anulum/scpn-phase-orchestrator/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/scpn-phase-orchestrator/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
</table>

| Bezeichnung | Bedeutung |
|---|---|
| **Jetzt nutzbar** | Installierbar, dokumentiert und CI-gestützt; entwickelt sich weiter |
| **Aktive Forschung** | Realer Code und laufende Forschung; kein Stabilitätsversprechen |
| **Experimentell** | Explorativ; Schnittstellen und Aussagen sind nicht als fest zu betrachten |
| **Evidenzgebunden** | Öffentliche Aussagen sind an Messungen oder Artefakte gebunden |

## Aktueller Fokus

<sub>Portfoliostand verifiziert am <!-- verified-at -->2026-10-17<!-- /verified-at -->.</sub>

<table>
  <tr>
    <td width="33%"><strong>Reaktorportfolio</strong><br><sub>Konsolidierung gemeinsamer Kerne und kontrollierter Gerätedaten in 26 öffentlichen Reaktor-Repositories.</sub></td>
    <td width="33%"><strong>Agentensicherung</strong><br><sub>Verbindung von Koordination, Gedächtnis, Antwortsicherung, Aktionsprüfung und Repository-Evidenz ohne Auflösung der Eigentumsgrenzen.</sub></td>
    <td width="33%"><strong>Von der Forschung zur Hardware</strong><br><sub>Wissenschaftliche Modelle bis zu nativer Beschleunigung, formalen Prüfungen, RTL, Hardwareläufen und prüfbaren Ergebnispaketen.</sub></td>
  </tr>
</table>

<!-- profile-feeds:releases:start -->
### Neueste Releases

| Datum | Projekt | Release | Änderung |
|---|---|---|---|
| 2026-10-02 | Synapse Channel | [v0.99.37](https://doi.org/10.5281/zenodo.23095056) | published software archive |
| 2026-10-01 | Loop Timing Witness | [v0.1.0](https://doi.org/10.5281/zenodo.23092361) | published host software |
| 2026-10-01 | Synapse Channel | [v0.99.36](https://doi.org/10.5281/zenodo.23088472) | historical software archive |
| 2026-09-30 | SYNAPSE CHANNEL | [v0.99.35](https://github.com/anulum/synapse-channel/releases/tag/v0.99.35) | Shared-pool reservations with one authoritative owner (F02, not yet enforced). |
| 2026-09-30 | SYNAPSE CHANNEL | [v0.99.34](https://github.com/anulum/synapse-channel/releases/tag/v0.99.34) | Signed peers behind a TLS-terminating proxy were admitted but served nothing. 0.99.33 said a peer hub's or Fleet follower's signed log pull works behind such a proxy. It did not. |

<sub>Gerendert aus [anulum.li/news](https://anulum.li/news/) (den CHANGELOG-Dateien der Projekte) und [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) am 2026-10-17.</sub>
<!-- profile-feeds:releases:end -->

<!-- profile-feeds:publication:start -->
### Neueste Publikation

| Datum | Typ | Ergebnis | DOI |
|---|---|---|---|
| 2026-10-11 | Preprint | The calibration epoch as the unit of evidence: preregistered parity-leakage and layout-transfer experiments on IQM Garnet | [10.5281/zenodo.23298119](https://doi.org/10.5281/zenodo.23298119) |

<sub>Gerendert aus [anulum.li/news](https://anulum.li/news/) (den CHANGELOG-Dateien der Projekte) und [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) am 2026-10-17.</sub>
<!-- profile-feeds:publication:end -->

## Zeitleiste

| Zeitraum | Öffentlich belegter Meilenstein |
|---|---|
| ab 1996 | Selbst veröffentlichter Horizont der Konzeptentwicklung im breiteren Forschungsprogramm |
| 1998 | Beginn der selbst eingetragenen Gründerrolle bei ANULUM CH&LI im öffentlichen ORCID-Datensatz |
| 2018 | Öffentliches GitHub-Konto eingerichtet |
| 2025 | Öffentliche SCPN-Vorschauen, Framework-Indizes und technische Berichte auf Zenodo hinterlegt |
| 2026 | Ausbau des öffentlichen Software- und Forschungsportfolios in KI-Sicherung, Agenteninfrastruktur, neuromorphem Rechnen, Plasmaregelung und Quantensimulation |

Die Einträge der Zeitleiste unterscheiden Registerfakten von selbst
veröffentlichter Chronologie. Sie implizieren weder akademische Zugehörigkeit
noch externe Validierung, Förderung oder Auszeichnungen.

## Wie der Stack genutzt wird

```mermaid
flowchart LR
    Q["SCPN Quantum Control"] -. "optional SNN adapter" .-> N["SC-NeuroCore"]
    Q -. "optional studio" .-> S["Studio Platform package"]
    N -. "optional federation" .-> S
    D["Director-AI"] -. "optional honesty extra" .-> S
    C["SCPN Control"] -. "optional fusion extra" .-> F["SCPN Fusion Core"]
    R["Rigor Foundry · repository analysis"]
```

Die Pfeile zeigen deklarierte optionale Softwareschnittstellen aus den Architekturunterlagen, keinen getesteten wissenschaftlichen Gesamtzyklus. Rigor Foundry analysiert Repositories und erhält hier keine erfundene Runtime-Abhängigkeit. Jede Domäne behält Modelle und Hardwarebefugnisse. Studio Platform ist ein veröffentlichtes Paket mit privatem Repository. Der Netz-Dämpfungsbenchmark des Phase Orchestrator wurde am 12. Oktober 2026 zurückgezogen; weder ein Ergebnis an einem realen Stromnetz noch ein Quantenvorteil wird behauptet.

## Ökosystemkarte

<!-- profile-catalogue:inventory:start -->
**Datierter Bestand: 2026-10-15**

97 Portfolio-Repositories: 37 öffentlich, 6 privat, 54 lokal initialisiert und unveröffentlicht. Weitere 42 Katalogeinträge beschreiben Pakete, Module, Arbeitsbereiche oder Architekturziele. Sämtliche Arbeiten laufen.

Gruppendeklarationen stammen vom 12.–13. Oktober; Repository-Präsenz und öffentliche Sichtbarkeit wurden am 15. Oktober 2026 geprüft. Lizenzangaben sind Quelldeklarationen, kein Rechtsaudit. Paketveröffentlichung und Hardwarequalifikation bleiben getrennt.

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

Der detaillierte Atlas ist in dieses Repository integriert. Seine 196 Einträge enthalten auch Programme, Unternehmensbedarf, Partnerrollen und Finanzierungswege; es sind keine 196 Repositories. Die Vorschauanleitung öffnet die interaktive Ansicht. Das bestehende Website-Portfolio wird separat gepflegt.

[Quelle des detaillierten Atlas und lokale Vorschau](docs/atlas/README.md) · [anulum.li/portfolio/](https://anulum.li/portfolio/)

Die technischen Beschreibungen zitieren die englischen Quelldatensätze. Ein benanntes Ziel ist keine separat veröffentlichte Fähigkeit. Gemeinsame Einträge werden einmal in ihrer Hauptgruppe gezählt.

<details>
<summary><strong>01 · SCPN Reactor Systems</strong> · 55 Repositories · 55 Katalogeinträge</summary>

55 zugeordnete Repositories einschliesslich ATLAS-REACTORUM: 26 öffentlich und 29 lokal initialisiert, unveröffentlicht. Fusions-, Spaltungs-, chemische und hybride Modelle, gemeinsame Kerne, Geometrie und Reaktornachweise. World Models, 3D-Simulationen und Geräteentwürfe sind laufende Programmziele; ein Entwurf ist kein validierter Reaktor.

[Architekturkarten der Gruppen](https://github.com/anulum/atlas-reactorum/blob/main/docs/ecosystem.md)

| Projekt / Komponente | Aufgabe und Entwicklungsstand | Repository / Verfügbarkeit | Deklarierte Lizenz | Quelldatum |
|---|---|---|---|---|
| [ATLAS-REACTORUM](https://github.com/anulum/atlas-reactorum)<br><sub>Source and rights library with historical reactor taxonomy and interactive citation views.</sub> | In Arbeit · tool · Implementation and integration | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-ADS-CORE<br><sub>Subcritical blanket plus typed external source/beam-target interface.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Beam Target Core](https://github.com/anulum/scpn-beam-target-core)<br><sub>Beam/target design and source-scoped reaction/stopping/yield.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BIOCHEM-CORE<br><sub>Source-specific enzyme/fermentation kinetics and reactor transport.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BREED-BURN-CORE<br><sub>Source-bounded breed-and-burn fuel-management concept.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BWR-CORE<br><sub>Boiling-channel thermal-spectrum family and void-feedback boundary.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CATALYTIC-BED-CORE<br><sub>Fixed-bed catalyst/transport/pressure-drop coupling.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHANNEL-CORE<br><sub>Graphite-moderated channel reactor only; exclusive from PHWR pressure tubes.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHEM-KINETICS-CORE<br><sub>Ideal gas batch/CSTR/PFR named kinetics and thermo models.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHEM-PROCESS-HYBRID-CORE<br><sub>Chemical process/recycle/separation and carbon-capture composition.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Dense Plasma Focus Core](https://github.com/anulum/scpn-dense-plasma-focus-core)<br><sub>Focus device/bank/axial/radial/pinch and source-scoped neutron estimates.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-ELECTROCHEM-CORE<br><sub>Electrode/cell transport and charge/reaction interface.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN FRC Core](https://github.com/anulum/scpn-frc-core)<br><sub>Field-reversed configuration, radial pressure-balance and kinetic-scale model.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Fusion Core](https://github.com/anulum/scpn-fusion-core)<br><sub>Canonical plasma solver mathematics, transport/equilibrium and existing research pipeline.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Fusion-Fission Hybrid Core](https://github.com/anulum/scpn-fusion-fission-hybrid-core)<br><sub>Existing source-owned fusion/fission blanket device and proposed typed member couplings.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-FUSION-PROCESS-HEAT-CORE<br><sub>Fusion-source to chemical-process heat/material composition.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-GFR-CORE<br><sub>Gas-cooled fast-spectrum family with high-temperature heat-removal boundary.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HEAT-PIPE-CORE<br><sub>Solid-core heat-pipe microreactor and source-defined transport limits.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HTGR-CORE<br><sub>Graphite/TRISO helium-cooled design and distinct process-heat interface.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HYBRID-ENERGY-CORE<br><sub>Fission/renewable/storage electrical and thermal composition.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HYDROGEN-PROCESS-CORE<br><sub>HTSE and named thermochemical hydrogen process routes.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Beam Core](https://github.com/anulum/scpn-icf-beam-core)<br><sub>Particle-beam illumination/capsule design with explicit coupling.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Impact Core](https://github.com/anulum/scpn-icf-impact-core)<br><sub>Impact/projectile/fuel/compression design and source-limited energy relations.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Laser Core](https://github.com/anulum/scpn-icf-laser-core)<br><sub>Laser-driven capsule/implosion design and source-scoped ignition/gain criteria.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN IEC Core](https://github.com/anulum/scpn-iec-core)<br><sub>Gridded electrostatic device and distinct nonthermal loss/recirculation models.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Lattice Fusion Core](https://github.com/anulum/scpn-lattice-fusion-core)<br><sub>Source-bounded lattice-confinement fusion research and modelling.</sub> | In Arbeit · component · Architecture and qualification | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Levitated Dipole Core](https://github.com/anulum/scpn-levitated-dipole-core)<br><sub>Dipole coil/levitation/charging and anisotropic plasma model.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-LFR-CORE<br><sub>Lead/LBE fast-spectrum family with materials/corrosion boundary.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Magnetic Cusp Core](https://github.com/anulum/scpn-magnetic-cusp-core)<br><sub>Cusp coil/configuration ownership and source-specific field/particle-loss model proposal.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-MEMBRANE-CORE<br><sub>Reaction-separation with explicit membrane transport.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-METHANE-REFORMER-CORE<br><sub>Steam-methane reforming kinetics and process train.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Core](https://github.com/anulum/scpn-mif-core)<br><sub>Existing magneto-inertial dynamics/runtime with maintained multi-language/RTL chain.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Liner Core](https://github.com/anulum/scpn-mif-liner-core)<br><sub>Mechanical/magnetic liner compression and target-energy coupling.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF MagLIF Core](https://github.com/anulum/scpn-mif-maglif-core)<br><sub>Magnetised liner drive/preheat/compression family.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Plasma Jet Core](https://github.com/anulum/scpn-mif-plasma-jet-core)<br><sub>Discrete plasma-jet array and spherical liner convergence.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Mirror Core](https://github.com/anulum/scpn-mirror-core)<br><sub>Mirror/tandem confinement and source-specific flux-tube geometry.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-MSR-CORE<br><sub>Liquid-fuel molten-salt family with chemistry, circulation and depletion.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Muon Fusion Core](https://github.com/anulum/scpn-muon-fusion-core)<br><sub>Muon-catalysed reaction models and complete energy accounting.</sub> | In Arbeit · component · Architecture and qualification | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NTP-CORE<br><sub>Reactor-side thermal propulsion and typed heat/flow interface.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NUCLEAR-DESALINATION-CORE<br><sub>Fission-to-desalination thermal/material composition.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NUCLEAR-HYDROGEN-CORE<br><sub>Typed fission-to-hydrogen thermal/electrical/material composition.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PHOTOCATALYTIC-CORE<br><sub>Photon-flux-driven reaction and optical/source coupling.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PHWR-CORE<br><sub>Heavy-water pressure-tube family with on-power fuel management.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PWR-CORE<br><sub>Light-water moderated/cooled vessel and primary-circuit design.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-REACTOR-CATALOGUE<br><sub>Evidence-labelled source-authority catalogue, candidate revision/history and vocabulary.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Reactor Kernels](https://github.com/anulum/scpn-reactor-kernels)<br><sub>Shared equations, numerical primitives and geometry/CAD/export substrate.</sub> | In Arbeit · package · Implementation and integration | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-RESEARCH-REACTOR-CORE<br><sub>Research/isotope-production core including separately supported pulse operation.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN RFP Core](https://github.com/anulum/scpn-rfp-core)<br><sub>Reversed-field pinch relaxation/profile and toroidal device design.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-SCWR-CORE<br><sub>Supercritical-water family with explicit thermophysical transition support.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-SFR-CORE<br><sub>Sodium-cooled fast-spectrum family and fuel/material/heat-removal boundary.</sub> | In Arbeit · component · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Spheromak Core](https://github.com/anulum/scpn-spheromak-core)<br><sub>Relaxed compact-torus configuration, flux conserver and formation criteria.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Stellarator Core](https://github.com/anulum/scpn-stellarator-core)<br><sub>Three-dimensional magnetic-confinement configuration and coil/design ownership.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Theta Pinch Core](https://github.com/anulum/scpn-theta-pinch-core)<br><sub>Axial-field compression and pinch configuration with sharp-boundary model.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Tokamak Core](https://github.com/anulum/scpn-tokamak-core)<br><sub>Own tokamak physical modelling and reactor-design geometry, with explicitly qualified canonical plasma-solver dependencies.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Z-Pinch Core](https://github.com/anulum/scpn-z-pinch-core)<br><sub>Current-driven pinch, sheared-flow model and pulsed device design.</sub> | In Arbeit · component · Computational prototypes and continued development | Öffentlich | AGPL-3.0-or-later | 2026-10-12 |

**Portale der Reaktorfamilien**: [reactor-systems](https://anulum.li/reactor-systems/) · [compare.html](https://anulum.li/reactor-systems/compare.html) · [closed-magnetic](https://anulum.li/reactor-systems/closed-magnetic/) · [open-magnetic](https://anulum.li/reactor-systems/open-magnetic/) · [pinches](https://anulum.li/reactor-systems/pinches/) · [inertial](https://anulum.li/reactor-systems/inertial/) · [magneto-inertial](https://anulum.li/reactor-systems/magneto-inertial/) · [electrostatic-hybrid](https://anulum.li/reactor-systems/electrostatic-hybrid/)

</details>

<details>
<summary><strong>02 · SCPN Systems Integration and Control</strong> · 4 Repositories · 4 Katalogeinträge</summary>

Vier gleichrangige Produkte. Control und Phase Orchestrator sind öffentlich; Studio Hub und das Studio-Platform-Repository sind privat. Das öffentliche Paket scpn-studio-platform ist separat verfügbar. Deklarierte Studio-Schnittstellen belegen keine getestete Föderation.

| Projekt / Komponente | Aufgabe und Entwicklungsstand | Repository / Verfügbarkeit | Deklarierte Lizenz | Quelldatum |
|---|---|---|---|---|
| [SCPN Phase Orchestrator](https://github.com/anulum/scpn-phase-orchestrator)<br><sub>Synchronisation analysis and evaluation of early-warning detectors on coupled phase-oscillator dynamics, with a Rust kernel.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-13 |
| [SCPN Control](https://github.com/anulum/scpn-control)<br><sub>Compiler from stochastic Petri nets to controllers with runtime contracts, and plasma-control research paths.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-13 |
| SCPN Studio Platform<br><sub>Domain-neutral SDK for studios: evidence bundles, capability manifests, bounded jobs and tenant-aware identity.</sub> | In Arbeit · package · Released software · ongoing development | Privat | AGPL-3.0-or-later | 2026-10-13 |
| SCPN Studio<br><sub>The hub that federates studios over the platform contract: registry, cross-studio evidence audit, rendering and federation gating.</sub> | In Arbeit · service · Implementation and integration | Privat | AGPL-3.0-or-later | 2026-10-13 |

</details>

<details>
<summary><strong>03 · Agentic Coordination, Assurance and Continuity</strong> · 10 Repositories · 10 Katalogeinträge</summary>

Zehn Repositories für Koordination, Absicherung, Gedächtnis und geregelte Aktionen. HushLine gehört zu den Gruppenwerkzeugen; SYNAPSE-POLICY-CHECK-ACTION ist enthalten. Jedes Produkt behält seine Lizenz und Fähigkeitsgrenzen.

[Architekturkarten der Gruppen](https://github.com/anulum/synapse-channel/blob/main/docs/ecosystem.md)

| Projekt / Komponente | Aufgabe und Entwicklungsstand | Repository / Verfügbarkeit | Deklarierte Lizenz | Quelldatum |
|---|---|---|---|---|
| [Synapse Channel](https://github.com/anulum/synapse-channel)<br><sub>Local-first coordination bus for AI agents: presence, file-scope work claims, messages, task status, receipts and an audit journal on one hub.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-11 |
| Synapse Channel Fleet<br><sub>Multi-machine operation of the bus: durable follower daemon, per-peer trust and configuration, claim forwarding and diagnostics.</sub> | In Arbeit · package · Implementation and integration | Privat | LicenseRef-SYNAPSE-Enterprise | 2026-10-11 |
| [SYNAPSE-POLICY-CHECK-ACTION](https://github.com/anulum/synapse-policy-check-action)<br><sub>GitHub Action that checks a SYNAPSE CHANNEL release receipt against a policy file in CI.</sub> | In Arbeit · tool · Implementation and integration | Öffentlich | AGPL-3.0-or-later | 2026-10-11 |
| [Director-AI](https://github.com/anulum/director-ai)<br><sub>Response-level guardrail for LLM output: NLI and retrieval grounding, sealed evidence packets and an optional streaming contradiction halt.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | Apache-2.0 AND BUSL-1.1 | 2026-10-11 |
| Director Class AI<br><sub>Action control between an autonomous agent and its effectors: action-policy checks, human approvals, gateway enforcement and tamper-evident action evidence.</sub> | In Arbeit · package · Implementation and integration | Privat | BUSL-1.1 | 2026-10-11 |
| Director AI Cloud<br><sub>Control plane for a hosted Director-AI API: accounts, API-key lifecycle, usage metering, plan quotas and operator exports.</sub> | In Arbeit · service · Implementation and integration | Privat | BUSL-1.1 | 2026-10-11 |
| [Rigor Foundry](https://github.com/anulum/rigor-foundry)<br><sub>Evidence-bound repository auditing: inventories Git-tracked content, emits reproducible audit candidates, binds review decisions to exact evidence and prepares remediation inputs.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | Apache-2.0 | 2026-10-11 |
| [Remanentia](https://github.com/anulum/remanentia)<br><sub>Local-first, auditable memory for AI agents and knowledge-intensive software: project-file indexing, hybrid retrieval, consolidation and an entity graph, through a CLI, an MCP server and an HTTP API.</sub> | In Arbeit · package · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-11 |
| Remanentia Portal<br><sub>Account and billing or licence-request portal for the product family. It runs no customer workload.</sub> | In Arbeit · service · Implementation and integration | Privat | AGPL-3.0-or-later | 2026-10-11 |
| [HushLine](https://github.com/anulum/HushLine)<br><sub>Local command-output filter: runs a command, then limits, shapes and redacts its output before it reaches a caller. Four independent cores: Go, Rust, Python and Node.</sub> | In Arbeit · tool · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-11 |

</details>

<details>
<summary><strong>04 · SC Neuromorphic Computing Systems</strong> · 4 Repositories · 42 Katalogeinträge</summary>

Der Kernbestand umfasst 40 benannte Einträge einschliesslich der permanenten SC-NeuroCore-Werkbank und Hilfswerkzeuge; zwei weitere Modul-/bedingte Ziele ergeben 42 Katalogeinträge. LOOP-TIMING-WITNESS besitzt ein öffentliches Host-Paket; die physische Boardqualifikation steht aus. EVIDENCE-MANIFEST-TOOLKIT ist unveröffentlicht. Module und zurückgestellte Ziele sind separat gekennzeichnet.

[Architekturkarten der Gruppen](https://github.com/anulum/sc-neurocore/blob/main/docs/ecosystem.md)

| Projekt / Komponente | Aufgabe und Entwicklungsstand | Repository / Verfügbarkeit | Deklarierte Lizenz | Quelldatum |
|---|---|---|---|---|
| [SC-NeuroCore](https://github.com/anulum/sc-neurocore)<br><sub>Permanent public development, composition and integration workbench for stochastic and spiking neural modelling, encoding, learning, simulation, selected hardware compilation and evidence inspection.</sub> | In Arbeit · workbench · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-13 |
| [Loop Timing Witness](https://github.com/anulum/loop-timing-witness)<br><sub>Fabric-clock instrument for complete control-loop and selected accelerator timing, with simulation/host analysis separated from eventual board timing, fault response and rail-energy evidence.</sub> | In Arbeit · tool · Architecture and qualification | Öffentlich | AGPL-3.0-or-later | 2026-10-13 |
| EVIDENCE-MANIFEST-TOOLKIT<br><sub>Canonicalises, references, seals and verifies evidence with explicit schemas, bounded sources and independently selected policy.</sub> | In Arbeit · shared · Architecture and qualification | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-13 |
| RANDOMNESS-WITNESS<br><sub>Assesses number-source suitability for a declared stochastic-computing use; it does not certify randomness for every purpose.</sub> | In Arbeit · shared · Design and preparation | Ziel / Modul / Paket | undecided | 2026-10-13 |
| EXPERIMENT-LEDGER<br><sub>Records experiment lineage across tools without owning their raw evidence or running their computations.</sub> | In Arbeit · shared · Design and preparation | Ziel / Modul / Paket | undecided | 2026-10-13 |
| SC-NC-CORE<br><sub>Neuron/synapse primitives, network graph, simulation loop, fixed-point semantics, constants and exceptions.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-CATALOGUE<br><sub>Neuron models, model zoo and topology/connectome generators.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-ENGINE<br><sub>Accelerated execution and its maintained language/native interfaces.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-BRIDGES<br><sub>Interchange and cross-domain adapters including NIR, quantum, HDC/VSA and neuro-symbolic routes.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-LEARN<br><sub>Training and adaptation, including surrogate gradients, plasticity, online learning, quantisation-aware training and distillation.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-DATA<br><sub>Datasets, signal/event encoding, augmentation, codecs, sources and recording adapters.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-ANALYSIS<br><sub>Spike-train analysis, visualisation and explainability.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-COMPILER<br><sub>Equation/IR lowering and hardware collateral for supported numerical models.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-HARDWARE<br><sub>Target profiles, mapping, deployment, drivers and power/thermal integration.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-VERIFY<br><sub>Formal, fault, resilience and safety-readiness verification within explicit proof scopes.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-STUDIO<br><sub>Visual composition, inspection and evidence presentation workflows.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-RESEARCH<br><sub>Retained experimental paths, including evolutionary, biological and world-model directions.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-NC-BENCH<br><sub>Catalogue/workload suites and immutable source-bound benchmark records.</sub> | In Arbeit · component · Workbench transition | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| MODEL-PROVENANCE-PACK<br><sub>Binds a model's data, training, conversion, quantisation, encoding and supporting evidence into a verifiable provenance pack.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SPIKE-LOG<br><sub>Records, indexes, verifies, slices and replays event streams without losing their provenance or timebase identity.</sub> | In Arbeit · tool · Design and implementation | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SPIKE-FORMAT-BRIDGE<br><sub>Converts event recordings between declared formats and reports every permitted loss rather than hiding timestamp, polarity or side-stream changes.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SPIKE-CODEC-BENCH<br><sub>Measures compression of existing spike trains, comparing payload ratio, distortion, encode/decode latency and memory.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SPIKE-ENCODER-CHARACTERISER<br><sub>Measures the information, spike-rate and latency trade-offs of sensor-to-spike encoders.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SPIKE-QUALITY-GATE<br><sub>Checks event data against a named quality policy for timestamp, noise, sensor-health, rate, gap and spatial defects.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SPIKE-GROUNDTRUTH<br><sub>Generates reproducible event-vision, audio, sensor and control stimuli with ground truth defined by the generator.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SNN-DIVERGENCE-HARNESS<br><sub>Compares the same network and input across implementations under bit-exact, tolerance or statistical oracles.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-STREAM-PROVER<br><sub>Compares realised stochastic-computing arithmetic error with a declared bound for a specific circuit, source and stream-length regime.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| MUTATION-SNN<br><sub>Measures test adequacy by generating declared semantic mutants and recording what the suite detects.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| NIR-CONFORMANCE<br><sub>Tests importer/exporter behaviour against the known semantics of a pinned Neuromorphic Intermediate Representation version.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| NEURO-EVIDENCE-BENCH<br><sub>Executes declared neuromorphic benchmark plans and traces each scoped result back to its raw evidence.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SPIKE-CALIBRATOR<br><sub>Measures classifier confidence against correctness under declared signal definitions, shifts and placements.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| BITSTREAM-EVIDENCE-CI<br><sub>Captures pinned FPGA build inputs, reports and bitstream identity in a reproducibility-aware chained build ledger.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| PLASTICITY-WITNESS<br><sub>Compares observed learning-rule updates with an independently defined fixed-point or statistical oracle under stated spike/load/fault protocols.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| AER-LINK-WITNESS<br><sub>Measures event-link behaviour under load, including loss, reordering, fairness, starvation and forward progress.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| RELIABILITY-WITNESS<br><sub>Characterises reliability within a declared physical or explicitly simulated exposure, retaining conditions, gaps and rare-event uncertainty.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SIM-REAL-WITNESS<br><sub>Quantifies simulation-to-fabric differences for the same model, input and observable population.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| DEPLOY-PACK<br><sub>Composes validated deployment evidence with bitstream/driver identity into a verifiable install/update package.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| FIELD-OPS-WITNESS<br><sub>Aggregates compact field health and drift evidence against deployment-time envelopes without actuating devices.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| FLIGHT-RECORDER<br><sub>Retains a bounded per-device event/state history for gap-honest incident reconstruction.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| NEURO-SAFETY-CASE<br><sub>Composes scoped evidence and open gaps into an assessor-facing assurance argument; it certifies nothing itself.</sub> | In Arbeit · tool · Design and implementation | Ziel / Modul / Paket | Undecided for independent release | 2026-10-13 |
| SC-COMPUTE-ADAPTERS<br><sub>Owns the SC-NeuroCore-side wrappers and numerical/register/handshake contracts needed to put selected generated peripherals into the independent LOOP-TIMING-WITNESS DUT/capture path.</sub> | In Arbeit · workbench module · Architecture and interface work | Ziel / Modul / Paket | Independent distribution terms being defined | 2026-10-13 |
| SC-NC-BIO<br><sub>Conditional destination for separately owned biological/biohybrid work if its independent release lifecycle is accepted; current experimental bioware remains in the developmental parent.</sub> | In Arbeit · conditional architecture destination · Architecture and interface work | Ziel / Modul / Paket | Independent distribution terms being defined | 2026-10-13 |

</details>

<details>
<summary><strong>05 · SCPN Quantum Computing Systems</strong> · 24 Repositories · 28 Katalogeinträge</summary>

Permanente SCPN-QUANTUM-CONTROL-Werkbank; oscillatools und SCPN-QUANTUM-ENGINE sind separate Distributionen, keine zusätzlichen Werkbänke. Sechzehn Komponentenziele und acht Werkzeugziele entstehen; QUANTUM_LAB ist ein Arbeitsbereich. Unabhängige Paketlizenzen und Veröffentlichungen bleiben vom Elternprojekt getrennt.

[Architekturkarten der Gruppen](https://github.com/anulum/scpn-quantum-control/blob/main/docs/ecosystem.md)

| Projekt / Komponente | Aufgabe und Entwicklungsstand | Repository / Verfügbarkeit | Deklarierte Lizenz | Quelldatum |
|---|---|---|---|---|
| [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control)<br><sub>Integrated modelling, simulation, compilation, gradients, control, provider workflows, analysis and Quantum Studio.</sub> | In Arbeit · workbench · Released software · ongoing development | Öffentlich | AGPL-3.0-or-later | 2026-10-13 |
| oscillatools<br><sub>Classical coupled-phase-oscillator dynamics, observables, sensitivities and control-oriented numerical tools.</sub> | In Arbeit · package · Released software · ongoing development | Ziel / Modul / Paket | AGPL-3.0-or-later | 2026-10-13 |
| scpn-quantum-engine<br><sub>Optional Rust/PyO3 numerical acceleration and native computation used by supported workbench paths.</sub> | In Arbeit · package · Released software · ongoing development | Ziel / Modul / Paket | AGPL-3.0-or-later | 2026-10-13 |
| QPU-RESULT-PACK<br><sub>Preserve raw results and their provenance, derivations and reviewable presentation.</sub> | In Arbeit · tool · Implementation and integration | Lokal, unveröffentlicht | not stated | 2026-10-13 |
| TRANSPILE-WITNESS<br><sub>Retain scoped observations about compilation semantics, layout, global phase and replay.</sub> | In Arbeit · tool · Implementation and integration | Ziel / Modul / Paket | AGPL-3.0-or-later by file headers; no licence field in packaging | 2026-10-13 |
| MITIGATION-WITNESS<br><sub>Evaluate mitigation on declared measurement panels with retained inputs and uncertainty.</sub> | In Arbeit · tool · Implementation and integration | Lokal, unveröffentlicht | AGPL-3.0-or-later | 2026-10-13 |
| SCPN-QC-CONTRACTS<br><sub>Versioned parameter, result, semantic and evidence interface contracts shared by components.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-CORE<br><sub>Configuration, logging, resource budgets and generic Kuramoto-XY problem foundations, separated from paper-specific research assumptions.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-AD<br><sub>Whole-program automatic differentiation, derivative transforms, batching, optimisation and explicit supported-path contracts.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-SIM<br><sub>Classical and quantum oscillator dynamics, XY/Kuramoto solvers, open-system simulation, tensor-network paths and co-simulation.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-COMPILER<br><sub>Model and circuit frontends, intermediate representations, interchange and code generation.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-QNODE<br><sub>Quantum tapes, gradient execution and framework bridges for supported Qiskit, PennyLane, JAX, PyTorch and TensorFlow paths.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-HAL<br><sub>Provider-neutral workloads, capabilities, job/result contracts and optional provider adapters.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-MITIGATION<br><sub>Error-mitigation implementations and their method taxonomy.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-QEC<br><sub>Quantum error-correction analysis and fault-tolerant resource-reporting surfaces.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-CONTROL<br><sub>Feedback and co-design, chimera and topology-aware control, and DLA-constrained control paths.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-ANALYSIS<br><sub>Observables, synchronisation witnesses, result analysis and the open-data DLA-parity pathway.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-LEARN<br><sub>Forecasting, quantum neural models, surrogate models, kernels and variational learning paths.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-APPS<br><sub>Domain application adapters, quantum randomness, cryptography and sensing workflows, with explicit claim boundaries.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-BENCH<br><sub>Workload-specific benchmark suites, comparison harnesses, campaign reproduction and retained run evidence.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-STUDIO<br><sub>Quantum Studio's visual workflows, inspectors and evidence presentation through the shared Studio platform contract.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| SCPN-QC-RESEARCH<br><sub>Experimental SCPN theory, paper-specific assumptions and research adapters whose contracts are not stable.</sub> | In Arbeit · component · Workbench transition | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| NOISE-MODEL-WITNESS<br><sub>Compare model predictions and replay observations for the same circuit and shot identities, with uncertainty, shot floors, calibration epochs and declared tolerances.</sub> | In Arbeit · tool · Design and implementation | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| VENDOR-CLAIM-RECOMPUTER<br><sub>Recompute released-data quantum-volume, error-per-layer-gate and logical-error claims against fixed definitions, original inputs and declared computation budgets.</sub> | In Arbeit · tool · Design and implementation | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| DECODER-WITNESS<br><sub>Compare real decoder engines on released shot data with lossless adapters, declared noise conditions and uncertainty-aware reports.</sub> | In Arbeit · tool · Design and implementation | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| GRADIENT-WITNESS<br><sub>Check software derivatives against declared analytic, parameter-shift and finite-difference references, including complex, finite-shot and cross-framework cases.</sub> | In Arbeit · tool · Design and implementation | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| CONFORMANCE-WITNESS<br><sub>Check versioned OpenQASM 3, adapter behaviour, provenance fields and repository-evidence criteria against their normative clauses and actual entry points.</sub> | In Arbeit · tool · Design and implementation | Lokal, unveröffentlicht | Undecided for independent release | 2026-10-13 |
| QUANTUM_LAB<br><sub>Reserved research workspace name; implementation role is not assigned in the group map.</sub> | In Arbeit · workspace · Workspace definition | Ziel / Modul / Paket | Not stated | 2026-10-13 |

↔ EVIDENCE-MANIFEST-TOOLKIT · RANDOMNESS-WITNESS · EXPERIMENT-LEDGER

</details>

<details>
<summary><strong>06 · Scientific Discovery and Experimentation</strong> · 0 Repositories · 0 Katalogeinträge</summary>

Registriert am 12. Oktober 2026; im Aufbau; null registrierte Projekte und Repositories. Zuständig für Hypothese → Experiment → Prüfung → Protokoll → Modelländerungsvorschlag und das gemeinsame Benchmark-/Berichtsformat. Domänenmodelle, Hardware und Ausführungsbefugnisse verbleiben bei den zuständigen Gruppen. Kein geschlossener wissenschaftlicher Zyklus wird behauptet.


</details>

**Weiterer öffentlicher Forschungsdatensatz**

Fusion Equilibrium Challenge ist ein öffentliches Reproduktionspaket vom 14. Oktober 2026, nach dem Gruppeninventar. Es wird separat aufgeführt, damit die datierten Gruppensummen erhalten bleiben. Ergebnisse und Einschränkungen stehen im eigenen Datensatz.

- [Fusion Equilibrium Challenge](https://github.com/anulum/fusion-equilibrium-challenge) · In Arbeit · AGPL-3.0-or-later · 2026-10-15
<!-- profile-catalogue:inventory:end -->

## Sponsoring-Ziele

Die offene Arbeit wird über [GitHub Sponsors](https://github.com/sponsors/anulum) finanziert.
Rund **USD 25'000 pro Monat** sind das Minimum, mit dem das Labor ohne
Unterbrechung läuft: Rechenleistung, GPU-, QPU- und FPGA-Zeit, Hardware, CI und
Werkzeuge. Das sind Laborkosten, kein Gehalt. Über diesem Minimum skaliert die
Arbeit, weil der Motor zusätzliche Rechenleistung direkt in mehr entwickelte
und geprüfte Arbeit umsetzt. Sponsoring bezahlt das Labor, es kauft keine
Ergebnisse. Befunde werden veröffentlicht, wie immer sie ausfallen.

Wer die Unterstützung lenken will, nennt beim Sponsoring den Motor oder eine
Domäne; das Geld wird dort eingesetzt und im Quartalsbericht ausgewiesen. Die
Hardware, die das Labor braucht, steht Position für Position in
[LAB_EQUIPMENT.md](LAB_EQUIPMENT.md) (Englisch); Geräte können auch als
Sachspende gegeben werden.

### Der Motor

**03 · Agentic Coordination, Assurance and Continuity.** Das autonome
Programmier- und Verifikationssystem, das jedes Projekt auf dieser Seite
entwickelt und prüft, als offene Infrastruktur bis zur Version 1.0. Es verbindet
[SYNAPSE CHANNEL](https://github.com/anulum/synapse-channel) (Agentenkoordination mit Quittungen),
[Rigor Foundry](https://github.com/anulum/rigor-foundry) (evidenzgebundene Reviews), [Director-AI](https://github.com/anulum/director-ai)
(Verankerung von Aussagen) und [Remanentia](https://github.com/anulum/remanentia) (auditierbares Gedächtnis).
Sponsoring bezahlt Modell- und GPU-Zeit für die Agentenflotte,
Evaluations-Benchmarks und CI.

### Vier Domänen

| Domäne | Ziel | Sponsoring bezahlt |
|---|---|---|
| **01 · Reactor Systems** | 55 zugeordnete Repositories einschliesslich ATLAS-REACTORUM: 26 öffentlich und 29 lokal initialisiert, unveröffentlicht. Fusions-, Spaltungs-, chemische und hybride Modelle, gemeinsame Kerne, Geometrie und Reaktornachweise. World Models, 3D-Simulationen und Geräteentwürfe sind laufende Programmziele; ein Entwurf ist kein validierter Reaktor. | Rechenzeit für Simulationen, CAD-Werkzeuge, Dokumentation |
| **02 · Systems Integration and Control** | Der **SCPN Studio Hub**, der die Studios aller Gruppen verbindet: ein Studio-Katalog, domänenübergreifend geprüfte Evidenz, jede Aussage an ihrer tatsächlichen Grenze dargestellt und ein Fail-closed-Gate für alles, was Hardware berühren könnte. Die Gruppe pflegt auch [scpn-control](https://github.com/anulum/scpn-control) und [scpn-phase-orchestrator](https://github.com/anulum/scpn-phase-orchestrator). | CI, Hardware-in-the-Loop-Replay, Dokumentation |
| **04 · SC Neuromorphic Computing** | **SNN Studio 1.0**, die Browser-IDE für den ganzen Lebenszyklus spikender Netze: Neuronenmodelle entwerfen, Netze bauen, mit Surrogatgradienten trainieren, nach SystemVerilog kompilieren und auf FPGA synthetisieren, mit einem exportierbaren Evidenzdatensatz für jeden Lauf. Aufgebaut auf [sc-neurocore](https://github.com/anulum/sc-neurocore); heute eine Entwicklungsvorschau. | FPGA-Boards und Synthesezeit, Messplatz, CI |
| **05 · SCPN Quantum Computing** | **Quantum Studio**, eine Arbeitsumgebung auf [scpn-quantum-control](https://github.com/anulum/scpn-quantum-control): eine Karte dessen, was existiert und wie es zusammenhängt, Schaltungen, die auf Simulatoren und echter Quantenhardware entworfen und ausgeführt werden, und jedes Ergebnis mit Rohdaten, Hashes, schriftlichem Protokoll und Entscheidungsregel, negative Ergebnisse eingeschlossen. | QPU-Zeit, GPU-Simulation, Dokumentation |

### Für Organisationen

- **Forschungsvereinbarung.** Eine Organisation kann statt eines Sponsorings
  eine abgegrenzte Arbeit über eine schriftliche Forschungsvereinbarung mit
  direkter Rechnungsstellung finanzieren. Umfang und Ergebnisse werden vorab
  vereinbart; Befunde werden nach derselben Regel wie oben veröffentlicht.
- **Kommerzielle Lizenz.** Projekte unter AGPL-3.0-or-later können für
  proprietäre oder geschlossene Nutzung zu kommerziellen Bedingungen lizenziert
  werden, zum Beispiel [SYNAPSE CHANNEL](https://anulum.li/synapse/pricing.html), [SC-NeuroCore](https://anulum.li/sc-neurocore/pricing.html), [SCPN Control](https://anulum.li/scpn-control/pricing.html), [SCPN Fusion Core](https://anulum.li/scpn-fusion-core/pricing.html), [SCPN Phase Orchestrator](https://anulum.li/scpn-phase-orchestrator/pricing.html), [SCPN Quantum Control](https://anulum.li/scpn-quantum-control/pricing.html). Apache-2.0-Projekte wie Director-AI und
  Rigor Foundry brauchen keine Lizenz; [Director-AI Pro](https://anulum.li/director-ai/pricing.html) ist eine
  kommerzielle selbst gehostete Edition, und Support und Integration lassen
  sich für jedes Projekt vertraglich vereinbaren. Welche Lizenz gilt, steht in
  der LICENSE-Datei des jeweiligen Repositorys.
- **Kontakt:** [protoscience@anulum.li](mailto:protoscience@anulum.li), mit „Forschungsvereinbarung“ oder
  „kommerzielle Lizenz“ und dem Projektnamen im Betreff.

## Forschungsergebnisse

| Oberfläche | Verifizierter Weg |
|---|---|
| Vollständiger Forschungsindex | [Publikationen, Preprints und Softwarearchive](PUBLICATIONS.md) |
| Publikations-Hub | [anulum.li/papers/](https://anulum.li/papers/): jeder Zenodo-Eintrag mit BibTeX |
| Releases und Publikationen | [anulum.li/news/](https://anulum.li/news/) · [RSS](https://anulum.li/news/feed.xml) |
| Lebenslauf | [Einseitiges PDF](cv/Miroslav-Sotek-CV.pdf) · [Markdown-Quelle](cv/Miroslav-Sotek-CV.md) · [JSON Resume](cv/resume.json) |
| Forschungsidentität | [ORCID 0009-0009-3560-0851](https://orcid.org/0009-0009-3560-0851) |
| Software | [20 erfasste PyPI-Distributionen](https://pypi.org/user/anulum/) |
| Quantum Control | [DOI 10.5281/zenodo.18821929](https://doi.org/10.5281/zenodo.18821929) |
| Fusion Core | [DOI 10.5281/zenodo.18820864](https://doi.org/10.5281/zenodo.18820864) |
| Phasensystem-Preprints | [Studie mit angeglichener Fehlalarmrate](https://doi.org/10.5281/zenodo.22113062) und [Studie zur Netz-Regimekarte](https://doi.org/10.5281/zenodo.22113116) |
| HushLine | [DOI 10.5281/zenodo.20775432](https://doi.org/10.5281/zenodo.20775432) |

## PyPI-Veröffentlichungen

[PyPI](https://pypi.org/user/anulum/)

<!-- profile-catalogue:packages:start -->
20 benannte Distributionen wurden am 2026-10-15 einzeln über die PyPI-JSON-API geprüft. Dies ist eine geprüfte Liste, kein vollständiger Kontoindex. Versionen sind Paketmetadaten, keine wissenschaftliche Validierung oder Zuordnung zu historischen DOI-Versionen.

<details>
<summary><strong>Veröffentlichte Distributionen</strong> · 20</summary>

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

## Sprachen und Plattformen

**Primäre Implementierung**

<p>
  <img alt="Python" src="assets/badges/python.svg">
  <img alt="Rust" src="assets/badges/rust.svg">
  <img alt="TypeScript" src="assets/badges/typescript.svg">
  <img alt="JavaScript" src="assets/badges/javascript.svg">
  <img alt="Go" src="assets/badges/go.svg">
</p>

<details>
<summary><strong>Erweiterter wissenschaftlicher, formaler, Hardware- und Betriebsstack</strong></summary>

**Wissenschaftliche, native und formale Arbeit**

<p>
  <img alt="Julia" src="assets/badges/julia.svg">
  <img alt="Mojo" src="assets/badges/mojo.svg">
  <img alt="C++" src="assets/badges/cpp.svg">
  <img alt="C" src="assets/badges/c.svg">
  <img alt="Lean" src="assets/badges/lean.svg">
  <img alt="Jupyter" src="assets/badges/jupyter.svg">
  <img alt="LaTeX" src="assets/badges/latex.svg">
</p>

**Hardware, Web und Betrieb**

<p>
  <img alt="Verilog" src="assets/badges/verilog.de.svg">
  <img alt="WebGPU" src="assets/badges/webgpu.svg">
  <img alt="HTML5" src="assets/badges/html5.svg">
  <img alt="CSS3" src="assets/badges/css3.svg">
  <img alt="Shell" src="assets/badges/shell.svg">
  <img alt="Docker" src="assets/badges/docker.svg">
  <img alt="Linux" src="assets/badges/linux.svg">
</p>

Das Portfolio enthält ausserdem gepflegte protobuf/gRPC-Verträge, mit PyO3 und
Maturin gebaute Python-Rust-Brücken, WebAssembly-Ziele, native SIMD-Pfade,
wissenschaftliche Notebooks und mehrsprachige API-Dokumentation.

</details>

## Engineering-Standards

<p>
  <img alt="pytest" src="assets/badges/pytest.de.svg">
  <img alt="Ruff" src="assets/badges/ruff.de.svg">
  <img alt="mypy" src="assets/badges/mypy.de.svg">
  <img alt="Cargo" src="assets/badges/cargo.de.svg">
  <img alt="CodeQL" src="assets/badges/codeql.de.svg">
  <img alt="REUSE" src="assets/badges/reuse.de.svg">
  <img alt="GitHub Actions" src="assets/badges/github-actions.svg">
</p>

Die konkrete Auswahl richtet sich nach Risiko und Umfang des jeweiligen
Repositorys; nicht jedes Repository führt jedes Werkzeug aus.

| Qualitätsbereich | Verwendete Praktiken |
|---|---|
| Korrektheit | Deterministische pytest- und Cargo-Suiten, zweigsensitive Coverage-Gates, Paritätstests, Regressions-Fixtures und explizite Negativfälle |
| Statische Qualität | Ruff-Formatierung und -Linting, striktes mypy wo deklariert, Cargo fmt, Clippy mit verbotenen Warnungen und API-Vertragsprüfungen |
| Reproduzierbarkeit | Hash-fixierte Abhängigkeiten, vor dem Lauf festgeschriebene Protokolle, Rohdatenpakete, Inhaltsdigests, Benchmark-Metadaten und wiederholbare Auditaufzeichnungen |
| Sicherheit | Bandit, CodeQL und Scorecards wo aktiviert, Bedrohungsmodelle, minimale Autorität, Geheimnisgrenzen und Abhängigkeitsprüfung |
| Lieferkette | SPDX-Header, REUSE-3.x-Prüfungen, SBOMs wo anwendbar, fixierte CI-Actions, signierte oder digestgebundene Evidenz und Release-Manifeste |
| Polyglotte Prüfung | Python/Rust-Parität, PyO3- und Maturin-Brücken, Go- und Julia-Tests, Lean-Builds, WebAssembly-Ziele sowie RTL- und Formalprüfungen wo relevant |
| Dokumentation | Warnungsfatale oder strikte MkDocs/Sphinx-Builds, generierte API-Referenzen, Architekturentscheidungen, Validierungsakten und explizite Nicht-Claims |
| Auslieferung | Repository-lokale Preflight-Gates, CI-Workflows, PyPI-Pakete, Wheels und Quelldistributionen, Container und Benchmark-Harnische |

## Evidenz statt Schlagworte

Negative und Nullresultate werden veröffentlicht, wenn sie real sind.
Öffentliche Aussagen bleiben an Messungen, vor dem Lauf festgeschriebene Protokolle,
Rohdatenpakete, quellengebundene Reviews oder ausführbare Verifikation gebunden.

Beispiel: SCPN Quantum Control veröffentlicht vor dem Lauf festgeschriebene Protokolle und
hashgebundene Ergebnispakete, statt experimentelle Aktivität in eine Reife-
oder Vorteilsbehauptung umzudeuten.

## Arbeitsprinzipien

- Evidenz vor Aussagen.
- Reproduzierbare Artefakte vor Präsentation.
- Klare Grenzen zwischen Forschung, Validierung und Produktreife.
- Sprachübergreifende Implementierungen, wenn Leistung oder Hardwareintegration
  sie rechtfertigen.
- Fail closed, wenn Herkunft, Befugnis oder Evidenz unvollständig sind.
- Negative Ergebnisse und Fehleraufzeichnungen bleiben Teil des
  Forschungsergebnisses.

## Zusammenarbeit

<!-- profile-catalogue:partner:start -->
### Gründungs- und Forschungspartner

Wir suchen Pre-Seed-Kapital und Partner zur gemeinsamen Gründung eines Forschungsinstituts, eines Unternehmens und einer gemeinnützigen Forschungsgesellschaft. Das Programm gehört derzeit einer Einzelperson; Rechtsträger und Standorte sind Vorschläge, keine bereits gegründeten Institutionen. Das anfängliche geografische Bild umfasst die Schweiz oder Liechtenstein, Tschechien oder die Slowakei sowie einen noch offenen dritten Standort im Nahen Osten. Wir bringen Software, Forschungsprogramm und eine geregelte Agentenorganisation ein. Partner können Kapital, unabhängige Replikation, gemessene Domänendaten, Chipentwurf und Fertigung, Labore, Instrumente oder Hardware-in-the-Loop-Einrichtungen beitragen. Eine erste Zusammenarbeit sollte ein Problem, ein Ergebnis und die Erfolgskriterien festlegen. Weder eine Partnerzusage noch eine bewilligte Finanzierung wird behauptet.
<!-- profile-catalogue:partner:end -->

### Lizenzmodelle

| Modell | Typische Grenze |
|---|---|
| Apache-2.0 | Freizügige öffentliche Kerne wie Director-AI und Rigor Foundry |
| AGPL-3.0-or-later | Öffentliche Netzwerk- und Forschungssysteme mit Quellcodepflichten |
| Open Core | Öffentlicher Kern mit separat lizenzierten erweiterten oder verwalteten Bereichen |
| BUSL-1.1 | Ausgewählte private kommerzielle Systeme mit angekündigter späterer Lizenzänderung |
| Kommerzielle Lizenz | Alternative Bedingungen für Organisationen, die die öffentliche Lizenz nicht einsetzen können |

| Modus | Umfang |
|---|---|
| Forschungskooperation | Reproduzierbare Studien in KI-Sicherung, neuromorphen Systemen, Quantensimulation, Plasmaphysik und Regelung |
| Technische Kooperation | Architekturprüfung, Validierungsdesign, Formal- oder Hardwarepfade und evidenzgebundene Softwareentwicklung |
| Kommerzielle Lizenzierung | Dual lizenzierte und verwaltete Produktbereiche über den [Lizenzweg von Anulum](#für-organisationen) |
| Förderung offener Arbeit | CI, Rechenzeit, Hardware- und Quantenexperimente sowie öffentliche Dokumentation über [GitHub Sponsors](https://github.com/sponsors/anulum) |

Ich begrüsse technisch fundierte Zusammenarbeit in zuverlässiger
KI-Infrastruktur, Multi-Agenten-Systemen, neuromorphem Rechnen,
wissenschaftlicher Software, formaler Verifikation, Quantensimulation,
Plasmaphysik und Regelung.

Aufträge werden selektiv angenommen. Das öffentliche GitHub-Profil ist derzeit
als hireable markiert; dies garantiert keine sofortige Kapazität.

Eine hilfreiche erste Nachricht enthält Problem, Randbedingungen, relevante
Vorarbeiten und die Evidenz, die als Erfolg gelten würde. Kontakt über
[protoscience@anulum.li](mailto:protoscience@anulum.li) oder
[anulum.li](https://anulum.li).

Ich antworte auf technische Vorschläge. Ich übernehme keine unbelegte
Hype-Arbeit, kein Wissenschaftstheater „nur zur Demonstration“ und keine
Aussagen, die nicht überprüft werden können.

[GitHub Sponsors](https://github.com/sponsors/anulum) finanziert für dauerhafte
offene Arbeit CI-Runner, Rechenzeit, Hardware- und Quantenexperimentzeit sowie
öffentliche Dokumentation, nicht Marketing.

> **Transparenz:** Diese Repositories umfassen Forschungssoftware,
> Entwicklerwerkzeuge, private Systeme und Produktkandidaten. Aktive
> Entwicklung bedeutet weder Produktionsreife noch wissenschaftliche
> Validierung, sofern ein Projekt dafür keine ausdrückliche Evidenz vorlegt.

<p align="center"><em>I AM THAT</em></p>

<p align="center">
  <img src="assets/anulum-logo-footer.jpg" width="100%" alt="Anulum">
</p>
