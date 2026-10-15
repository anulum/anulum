<!--
SPDX-License-Identifier: AGPL-3.0-or-later
Komerčná licencia je dostupná
© Koncepty 1996–2026 Miroslav Šotek. Všetky práva vyhradené.
© Kód 2020–2026 Miroslav Šotek. Všetky práva vyhradené.
ORCID: 0009-0009-3560-0851
Kontakt: www.anulum.li | protoscience@anulum.li
Prehľad osobného profilu GitHub
-->

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/profile-header-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/profile-header-light.svg">
    <img src="assets/profile-header-dark.svg" width="1200" alt="Miroslav Šotek: dôkazy, výpočty, riadenie">
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
  <a href="https://anulum.li"><img alt="Web" src="assets/badges/website.sk.svg"></a>
  <a href="https://orcid.org/0009-0009-3560-0851"><img alt="ORCID" src="assets/badges/orcid.svg"></a>
  <a href="cv/Miroslav-Sotek-CV.pdf"><img alt="CV PDF" src="assets/badges/cv-pdf.sk.svg"></a>
  <a href="https://pypi.org/user/anulum/"><img alt="PyPI" src="assets/badges/pypi-count.sk.svg"></a>
  <a href="https://github.com/sponsors/anulum"><img alt="GitHub Sponsors" src="assets/badges/sponsors.sk.svg"></a>
  <a href="mailto:protoscience@anulum.li"><img alt="E-mail" src="assets/badges/email.sk.svg"></a>
</p>

<p align="center">
  <a href="#projekty">Projekty</a> ·
  <a href="#aktuálne-zameranie">Aktuálne zameranie</a> ·
  <a href="#mapa-ekosystému">Ekosystém</a> ·
  <a href="#výskumné-výstupy">Výskumné výstupy</a> ·
  <a href="#inžinierske-štandardy">Štandardy</a> ·
  <a href="#spolupráca">Spolupráca</a>
</p>

Nezávislý výskumník a systémový inžinier pôsobiaci vo Švajčiarsku. Pod menom Anulum vyvíjam vedecký softvér a riadenú výskumnú organizáciu. Päť aktívnych skupín pokrýva reaktorové systémy, integráciu a riadenie, koordináciu a kontrolu agentov, neuromorfné a kvantové výpočty. Šiesta skupina Scientific Discovery and Experimentation sa formuje. Vydaný softvér, architektonické práce, vývoj world models a zamýšľané hardvérové výstupy majú samostatné hranice dôkazov. Výskumný inštitút a spoločnosť ponúkame na spoločné založenie s partnermi.

<table>
  <tr>
    <td width="20%"><strong>Motor</strong><br><sub>Koordinácia agentov s potvrdeniami, review viazané na dôkazy, ukotvenie tvrdení, auditovateľná pamäť</sub></td>
    <td width="20%"><strong>Reaktorové systémy</strong><br><sub>Katalóg reaktorových konceptov, 3D/CAD, fyzika úrovne 0, Reactor Studio</sub></td>
    <td width="20%"><strong>Integrácia a riadenie</strong><br><sub>Studio Hub, riadiaci runtime, analýza synchronizácie, fail-closed brána k hardvéru</sub></td>
    <td width="20%"><strong>Neuromorfné výpočty</strong><br><sub>SNN Studio, Rust SIMD, Verilog RTL, syntéza na FPGA</sub></td>
    <td width="20%"><strong>Kvantové výpočty</strong><br><sub>Obvody na simulátoroch aj skutočnom hardvéri, výsledkové balíky so surovými dátami</sub></td>
  </tr>
</table>

## Kde začať

**[Projekty](#projekty)** pre softvér a jeho dôkazy ·
**[Publikácie](https://anulum.li/papers/)** pre každú publikáciu a softvérový
archív s BibTeX · **[Kontakt](mailto:protoscience@anulum.li)** pre technický
návrh. Pre nových čitateľov: [anulum.li/start/](https://anulum.li/start/)
vyberie vstupný bod podľa profilu. Každý registrovaný projekt s filtrami podľa
skupiny, reaktorovej rodiny a dôkazov a s klikateľnou mapou:
[anulum.li/portfolio/](https://anulum.li/portfolio/).

## Projekty

Každá karta odkazuje na kontrolovateľné artefakty, nie na súhrnné tvrdenia.
Dôkazové odkazy sú pripnuté na commit, pri ktorom boli overené. Badge-y vydania a
CI hlásia stav registra a workflow; sú to prevádzkové signály, nie hodnotenie
vedeckej kvality.

<table>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/synapse-channel">Synapse Channel</a></strong> · <sub><strong>Použiteľný teraz</strong></sub><br><sub>Riadiaca rovina pre flotily programovacích agentov: tvrdenia, roly, trvalé schránky, potvrdenia, audit a federácia.</sub><br><sub><a href="https://anulum.github.io/synapse-channel/">Dokumentácia</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/VALIDATION.md">Validácia</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/coordination-spec.md">Špecifikácia koordinácie</a> · <a href="https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/sandbox-threat-model.md">Model hrozieb</a></sub><br><a href="https://pypi.org/project/synapse-channel/"><img alt="PyPI" src="https://img.shields.io/pypi/v/synapse-channel?style=flat-square"></a> <a href="https://github.com/anulum/synapse-channel/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/synapse-channel/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/director-ai">Director-AI</a></strong> · <sub><strong>Aktívny výskum</strong></sub><br><sub>Ochrana LLM v reálnom čase: NLI/RAG ukotvenie, kontrola tvrdení, natívna akcelerácia, voliteľné zastavenie prúdu na úrovni tvrdení, deklarované hranice schopností.</sub><br><sub><a href="https://anulum.github.io/director-ai/">Dokumentácia</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/VALIDATION.md">Validácia</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/benchmarks/PUBLIC_BENCHMARKS.md">Verejné benchmarky</a> · <a href="https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/docs/_generated/capability_matrix.md">Matica schopností</a></sub><br><a href="https://pypi.org/project/director-ai/"><img alt="PyPI" src="https://img.shields.io/pypi/v/director-ai?style=flat-square"></a> <a href="https://github.com/anulum/director-ai/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/director-ai/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/rigor-foundry">Rigor Foundry</a></strong> · <sub><strong>Použiteľný teraz</strong></sub><br><sub>Inventár repozitárov viazaný na dôkazy, kandidáti na audit, väzba na recenzie a plánovanie nápravy.</sub><br><sub><a href="https://anulum.github.io/rigor-foundry/">Dokumentácia</a></sub><br><a href="https://pypi.org/project/rigor-foundry/"><img alt="PyPI" src="https://img.shields.io/pypi/v/rigor-foundry?style=flat-square"></a> <a href="https://github.com/anulum/rigor-foundry/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/rigor-foundry/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/remanentia">Remanentia</a></strong> · <sub><strong>Použiteľný teraz</strong></sub><br><sub>Auditovateľná pamäť pre agentov AI a znalostné systémy: hybridné vyhľadávanie, grafy, konsolidácia, CLI, MCP a API.</sub><br><sub><a href="https://github.com/anulum/remanentia#readme">Dokumentácia</a></sub><br><a href="https://pypi.org/project/remanentia/"><img alt="PyPI" src="https://img.shields.io/pypi/v/remanentia?style=flat-square"></a> <a href="https://github.com/anulum/remanentia/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/remanentia/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/sc-neurocore">SC-NeuroCore</a></strong> · <sub><strong>Aktívny výskum</strong></sub><br><sub>Stochastický a neuromorfný rámec: modely v Pythone, SIMD cesty v Ruste, Verilog RTL, HDC/VSA, kompilátorové rozhrania a hardvérové dôkazy.</sub><br><sub><a href="https://anulum.github.io/sc-neurocore/">Dokumentácia</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/VALIDATION.md">Validácia</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/hardware/SYNTHESIS_RESULTS.md">Výsledky syntézy</a> · <a href="https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/safety/TRACEABILITY_MATRIX.md">Matica sledovateľnosti</a></sub><br><a href="https://pypi.org/project/sc-neurocore/"><img alt="PyPI" src="https://img.shields.io/pypi/v/sc-neurocore?style=flat-square"></a> <a href="https://github.com/anulum/sc-neurocore/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/sc-neurocore/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-fusion-core">SCPN Fusion Core</a> · <a href="https://github.com/anulum/scpn-control">SCPN Control</a></strong> · <sub><strong>Aktívny výskum</strong></sub><br><sub>Fyzika tokamaku, riešiče a validačné kampane s cestami k reálnym dátam (Fusion Core); riadiaci runtime s fail-closed prijímaním a dôkazmi z prehrávania (Control).</sub><br><sub><a href="https://github.com/anulum/scpn-fusion-core/blob/3c841fc13109c8efb49bb079d145f70683a4408d/VALIDATION.md">Validácia</a> · <a href="https://github.com/anulum/scpn-fusion-core/blob/3c841fc13109c8efb49bb079d145f70683a4408d/docs/VALIDATION_REAL_DIIID_145419.md">Validačný záznam DIII-D</a> · <a href="https://doi.org/10.5281/zenodo.18820864">DOI softvéru</a></sub><br><a href="https://pypi.org/project/scpn-fusion/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-fusion?style=flat-square"></a> <a href="https://pypi.org/project/scpn-control/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-control?style=flat-square"></a> <a href="https://github.com/anulum/scpn-fusion-core/actions/workflows/ci-python-tests.yml"><img alt="CI" src="https://github.com/anulum/scpn-fusion-core/actions/workflows/ci-python-tests.yml/badge.svg?branch=main"></a></td>
  </tr>
  <tr>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-quantum-control">SCPN Quantum Control</a></strong> · <sub><strong>Experimentálny</strong></sub><br><sub>Kvantová simulácia synchronizácie viazaných oscilátorov riadená dôkazmi: protokoly zapísané pred behom, hardvérové balíky výsledkov, surové početnosti a výslovné hranice bez tvrdenia o výhode.</sub><br><sub><a href="https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/layout_relaxation_preregistration.md">Protokol layout relaxation</a> · <a href="https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/hardware_result_packs.md">Kontrakt balíkov výsledkov</a> · <a href="https://doi.org/10.5281/zenodo.18821929">DOI softvéru</a></sub><br><a href="https://pypi.org/project/scpn-quantum-control/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-quantum-control?style=flat-square"></a> <a href="https://github.com/anulum/scpn-quantum-control/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/scpn-quantum-control/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
    <td width="50%" valign="top"><strong><a href="https://github.com/anulum/scpn-phase-orchestrator">SCPN Phase Orchestrator</a></strong> · <sub><strong>Aktívny výskum</strong></sub><br><sub>Analýza synchronizácie viazaných rytmických systémov s dôkazmi na prvom mieste a návrhy riadenia len na posúdenie; hodnotenie s vyrovnanou mierou falošných poplachov, negatívne výsledky a ohraničené tvrdenia o prenose.</sub><br><sub><a href="https://github.com/anulum/scpn-phase-orchestrator/blob/1e9eea39fa6681dde2cfbdf074c08ff03a528b58/papers/submissions/README.md">Index podaní</a> · <a href="https://doi.org/10.5281/zenodo.22113062">Preprint s negatívnym výsledkom</a> · <a href="https://doi.org/10.5281/zenodo.22113116">Preprint o mape režimov siete</a></sub><br><a href="https://pypi.org/project/scpn-phase-orchestrator/"><img alt="PyPI" src="https://img.shields.io/pypi/v/scpn-phase-orchestrator?style=flat-square"></a> <a href="https://github.com/anulum/scpn-phase-orchestrator/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/anulum/scpn-phase-orchestrator/actions/workflows/ci.yml/badge.svg?branch=main"></a></td>
  </tr>
</table>

| Označenie | Význam |
|---|---|
| **Použiteľný teraz** | Inštalovateľný, zdokumentovaný a podporený CI; stále sa vyvíja |
| **Aktívny výskum** | Skutočný kód a prebiehajúca veda; nie prísľub stability |
| **Experimentálny** | Prieskumný; rozhrania ani tvrdenia nepovažujte za nemenné |
| **Viazaný na dôkazy** | Verejné tvrdenia sú spojené s meraniami alebo artefaktmi |

## Aktuálne zameranie

<sub>Stav portfólia overený <!-- verified-at -->2026-10-15<!-- /verified-at -->.</sub>

<table>
  <tr>
    <td width="33%"><strong>Reaktorové portfólio</strong><br><sub>Konsolidácia spoločných jadier a riadenej pravdy zariadení v 26 verejných reaktorových repozitároch.</sub></td>
    <td width="33%"><strong>Spoľahlivosť agentov</strong><br><sub>Spojenie koordinácie, pamäte, overovania odpovedí, kontroly akcií a dôkazov o repozitároch bez zotretia hraníc vlastníctva.</sub></td>
    <td width="33%"><strong>Od výskumu k hardvéru</strong><br><sub>Vedecké modely prevedené cez natívnu akceleráciu, formálne kontroly, RTL, hardvérové behy a kontrolovateľné balíky výsledkov.</sub></td>
  </tr>
</table>

<!-- profile-feeds:releases:start -->
### Najnovšie vydania

| Dátum | Projekt | Vydanie | Zmena |
|---|---|---|---|
| 2026-10-02 | Synapse Channel | [v0.99.37](https://doi.org/10.5281/zenodo.23095056) | published software archive |
| 2026-10-01 | Loop Timing Witness | [v0.1.0](https://doi.org/10.5281/zenodo.23092361) | published host software |
| 2026-10-01 | Synapse Channel | [v0.99.36](https://doi.org/10.5281/zenodo.23088472) | historical software archive |
| 2026-09-30 | SYNAPSE CHANNEL | [v0.99.35](https://github.com/anulum/synapse-channel/releases/tag/v0.99.35) | Shared-pool reservations with one authoritative owner (F02, not yet enforced). |
| 2026-09-30 | SYNAPSE CHANNEL | [v0.99.34](https://github.com/anulum/synapse-channel/releases/tag/v0.99.34) | Signed peers behind a TLS-terminating proxy were admitted but served nothing. 0.99.33 said a peer hub's or Fleet follower's signed log pull works behind such a proxy. It did not. |

<sub>Vykreslené z [anulum.li/news](https://anulum.li/news/) (súbory CHANGELOG projektov) a [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) dňa 2026-10-15.</sub>
<!-- profile-feeds:releases:end -->

<!-- profile-feeds:publication:start -->
### Najnovšia publikácia

| Dátum | Typ | Výstup | DOI |
|---|---|---|---|
| 2026-10-11 | Preprint | The calibration epoch as the unit of evidence: preregistered parity-leakage and layout-transfer experiments on IQM Garnet | [10.5281/zenodo.23298119](https://doi.org/10.5281/zenodo.23298119) |

<sub>Vykreslené z [anulum.li/news](https://anulum.li/news/) (súbory CHANGELOG projektov) a [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) dňa 2026-10-15.</sub>
<!-- profile-feeds:publication:end -->

## Časová os

| Obdobie | Verejne podložený míľnik |
|---|---|
| od 1996 | Vlastný publikovaný horizont vývoja konceptov v širšom výskumnom programe |
| 1998 | Začiatok vlastnoručne uvedenej zakladateľskej roly v ANULUM CH&LI vo verejnom ORCID zázname |
| 2018 | Založenie verejného GitHub účtu |
| 2025 | Verejné SCPN preview dokumenty, indexy rámca a technické správy uložené na Zenodo |
| 2026 | Rozšírenie verejného softvérového a výskumného portfólia v spoľahlivosti AI, agentovej infraštruktúre, neuromorfných výpočtoch, riadení plazmy a kvantovej simulácii |

Položky časovej osi rozlišujú fakty z registrov od vlastnej chronológie.
Neznamenajú akademickú afiliáciu, externú validáciu, financovanie ani ocenenia.

## Ako sa celok používa

```mermaid
flowchart LR
    Q["SCPN Quantum Control"] -. "optional SNN adapter" .-> N["SC-NeuroCore"]
    Q -. "optional studio" .-> S["Studio Platform package"]
    N -. "optional federation" .-> S
    D["Director-AI"] -. "optional honesty extra" .-> S
    C["SCPN Control"] -. "optional fusion extra" .-> F["SCPN Fusion Core"]
    R["Rigor Foundry · repository analysis"]
```

Šípky označujú deklarované voliteľné softvérové rozhrania z architektonických záznamov skupín, nie otestovaný uzavretý vedecký cyklus. Rigor Foundry analyzuje repozitáre; nezavádzame mu vymyslenú runtime závislosť. Každá doména si ponecháva modely a oprávnenie k hardvéru. Studio Platform je publikovaný balík so súkromným repozitárom. Benchmark modálneho tlmenia siete Phase Orchestrator bol stiahnutý 12. októbra 2026; tento profil nedeklaruje výsledok na reálnej sieti ani kvantovú výhodu.

## Mapa ekosystému

<!-- profile-catalogue:inventory:start -->
**Dátovaný inventár: 2026-10-15**

97 repozitárov portfólia: 37 verejných, 6 súkromných a 54 lokálne inicializovaných, nezverejnených. Ďalších 42 položiek katalógu opisuje balíky, moduly, pracoviská alebo architektonické ciele. Na všetkých sa pracuje.

Deklarácie skupín sú z 12.–13. októbra; prítomnosť repozitárov a verejnosť boli overené 15. októbra 2026. Licencie sú deklarácie zdrojov, nie právny audit. Vydanie balíka a kvalifikácia hardvéru sú samostatné veci.

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

Detailný atlas je integrovaný v tomto repozitári. Jeho 196 položiek zahŕňa aj programy, potreby spoločnosti, partnerské úlohy a možnosti financovania; nejde o 196 repozitárov. Interaktívne zobrazenie otvoríte podľa návodu k náhľadu atlasu. Existujúce webové portfólio sa spravuje samostatne.

[Zdroj detailného atlasu a lokálny náhľad](docs/atlas/README.md) · [anulum.li/portfolio/](https://anulum.li/portfolio/)

Technické opisy nižšie citujú anglické zdrojové záznamy. Pomenovaný cieľ nie je samostatne vydaná schopnosť. Spoločné položky počítame raz v hlavnej skupine.

<details>
<summary><strong>01 · SCPN Reactor Systems</strong> · 55 repozitárov · 55 položiek katalógu</summary>

55 vlastnených repozitárov vrátane ATLAS-REACTORUM: 26 verejných a 29 lokálne inicializovaných, nezverejnených. Modely fúzie, štiepenia, chemických a hybridných systémov, spoločné jadrá, geometria a dôkazy o reaktoroch. World models, 3D simulácie a návrhy zariadení sú vyvíjané výstupy programu; návrh nie je overený reaktor.

[Architektonické mapy skupín](https://github.com/anulum/atlas-reactorum/blob/main/docs/ecosystem.md)

| Projekt / komponent | Úloha a fáza vývoja | Repozitár / dostupnosť | Deklarovaná licencia | Dátum zdroja |
|---|---|---|---|---|
| [ATLAS-REACTORUM](https://github.com/anulum/atlas-reactorum)<br><sub>Source and rights library with historical reactor taxonomy and interactive citation views.</sub> | Prebieha · tool · Implementation and integration | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-ADS-CORE<br><sub>Subcritical blanket plus typed external source/beam-target interface.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Beam Target Core](https://github.com/anulum/scpn-beam-target-core)<br><sub>Beam/target design and source-scoped reaction/stopping/yield.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BIOCHEM-CORE<br><sub>Source-specific enzyme/fermentation kinetics and reactor transport.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BREED-BURN-CORE<br><sub>Source-bounded breed-and-burn fuel-management concept.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-BWR-CORE<br><sub>Boiling-channel thermal-spectrum family and void-feedback boundary.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CATALYTIC-BED-CORE<br><sub>Fixed-bed catalyst/transport/pressure-drop coupling.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHANNEL-CORE<br><sub>Graphite-moderated channel reactor only; exclusive from PHWR pressure tubes.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHEM-KINETICS-CORE<br><sub>Ideal gas batch/CSTR/PFR named kinetics and thermo models.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-CHEM-PROCESS-HYBRID-CORE<br><sub>Chemical process/recycle/separation and carbon-capture composition.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Dense Plasma Focus Core](https://github.com/anulum/scpn-dense-plasma-focus-core)<br><sub>Focus device/bank/axial/radial/pinch and source-scoped neutron estimates.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-ELECTROCHEM-CORE<br><sub>Electrode/cell transport and charge/reaction interface.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN FRC Core](https://github.com/anulum/scpn-frc-core)<br><sub>Field-reversed configuration, radial pressure-balance and kinetic-scale model.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Fusion Core](https://github.com/anulum/scpn-fusion-core)<br><sub>Canonical plasma solver mathematics, transport/equilibrium and existing research pipeline.</sub> | Prebieha · package · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Fusion-Fission Hybrid Core](https://github.com/anulum/scpn-fusion-fission-hybrid-core)<br><sub>Existing source-owned fusion/fission blanket device and proposed typed member couplings.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-FUSION-PROCESS-HEAT-CORE<br><sub>Fusion-source to chemical-process heat/material composition.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-GFR-CORE<br><sub>Gas-cooled fast-spectrum family with high-temperature heat-removal boundary.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HEAT-PIPE-CORE<br><sub>Solid-core heat-pipe microreactor and source-defined transport limits.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HTGR-CORE<br><sub>Graphite/TRISO helium-cooled design and distinct process-heat interface.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HYBRID-ENERGY-CORE<br><sub>Fission/renewable/storage electrical and thermal composition.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-HYDROGEN-PROCESS-CORE<br><sub>HTSE and named thermochemical hydrogen process routes.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Beam Core](https://github.com/anulum/scpn-icf-beam-core)<br><sub>Particle-beam illumination/capsule design with explicit coupling.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Impact Core](https://github.com/anulum/scpn-icf-impact-core)<br><sub>Impact/projectile/fuel/compression design and source-limited energy relations.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN ICF Laser Core](https://github.com/anulum/scpn-icf-laser-core)<br><sub>Laser-driven capsule/implosion design and source-scoped ignition/gain criteria.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN IEC Core](https://github.com/anulum/scpn-iec-core)<br><sub>Gridded electrostatic device and distinct nonthermal loss/recirculation models.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Lattice Fusion Core](https://github.com/anulum/scpn-lattice-fusion-core)<br><sub>Source-bounded lattice-confinement fusion research and modelling.</sub> | Prebieha · component · Architecture and qualification | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Levitated Dipole Core](https://github.com/anulum/scpn-levitated-dipole-core)<br><sub>Dipole coil/levitation/charging and anisotropic plasma model.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-LFR-CORE<br><sub>Lead/LBE fast-spectrum family with materials/corrosion boundary.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Magnetic Cusp Core](https://github.com/anulum/scpn-magnetic-cusp-core)<br><sub>Cusp coil/configuration ownership and source-specific field/particle-loss model proposal.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-MEMBRANE-CORE<br><sub>Reaction-separation with explicit membrane transport.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-METHANE-REFORMER-CORE<br><sub>Steam-methane reforming kinetics and process train.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Core](https://github.com/anulum/scpn-mif-core)<br><sub>Existing magneto-inertial dynamics/runtime with maintained multi-language/RTL chain.</sub> | Prebieha · package · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Liner Core](https://github.com/anulum/scpn-mif-liner-core)<br><sub>Mechanical/magnetic liner compression and target-energy coupling.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF MagLIF Core](https://github.com/anulum/scpn-mif-maglif-core)<br><sub>Magnetised liner drive/preheat/compression family.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN MIF Plasma Jet Core](https://github.com/anulum/scpn-mif-plasma-jet-core)<br><sub>Discrete plasma-jet array and spherical liner convergence.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Mirror Core](https://github.com/anulum/scpn-mirror-core)<br><sub>Mirror/tandem confinement and source-specific flux-tube geometry.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-MSR-CORE<br><sub>Liquid-fuel molten-salt family with chemistry, circulation and depletion.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Muon Fusion Core](https://github.com/anulum/scpn-muon-fusion-core)<br><sub>Muon-catalysed reaction models and complete energy accounting.</sub> | Prebieha · component · Architecture and qualification | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NTP-CORE<br><sub>Reactor-side thermal propulsion and typed heat/flow interface.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NUCLEAR-DESALINATION-CORE<br><sub>Fission-to-desalination thermal/material composition.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-NUCLEAR-HYDROGEN-CORE<br><sub>Typed fission-to-hydrogen thermal/electrical/material composition.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PHOTOCATALYTIC-CORE<br><sub>Photon-flux-driven reaction and optical/source coupling.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PHWR-CORE<br><sub>Heavy-water pressure-tube family with on-power fuel management.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-PWR-CORE<br><sub>Light-water moderated/cooled vessel and primary-circuit design.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-REACTOR-CATALOGUE<br><sub>Evidence-labelled source-authority catalogue, candidate revision/history and vocabulary.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Reactor Kernels](https://github.com/anulum/scpn-reactor-kernels)<br><sub>Shared equations, numerical primitives and geometry/CAD/export substrate.</sub> | Prebieha · package · Implementation and integration | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-RESEARCH-REACTOR-CORE<br><sub>Research/isotope-production core including separately supported pulse operation.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN RFP Core](https://github.com/anulum/scpn-rfp-core)<br><sub>Reversed-field pinch relaxation/profile and toroidal device design.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-SCWR-CORE<br><sub>Supercritical-water family with explicit thermophysical transition support.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| SCPN-SFR-CORE<br><sub>Sodium-cooled fast-spectrum family and fuel/material/heat-removal boundary.</sub> | Prebieha · component · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Spheromak Core](https://github.com/anulum/scpn-spheromak-core)<br><sub>Relaxed compact-torus configuration, flux conserver and formation criteria.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Stellarator Core](https://github.com/anulum/scpn-stellarator-core)<br><sub>Three-dimensional magnetic-confinement configuration and coil/design ownership.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Theta Pinch Core](https://github.com/anulum/scpn-theta-pinch-core)<br><sub>Axial-field compression and pinch configuration with sharp-boundary model.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Tokamak Core](https://github.com/anulum/scpn-tokamak-core)<br><sub>Own tokamak physical modelling and reactor-design geometry, with explicitly qualified canonical plasma-solver dependencies.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |
| [SCPN Z-Pinch Core](https://github.com/anulum/scpn-z-pinch-core)<br><sub>Current-driven pinch, sheared-flow model and pulsed device design.</sub> | Prebieha · component · Computational prototypes and continued development | Verejný | AGPL-3.0-or-later | 2026-10-12 |

**Portály reaktorových rodín**: [reactor-systems](https://anulum.li/reactor-systems/) · [compare.html](https://anulum.li/reactor-systems/compare.html) · [closed-magnetic](https://anulum.li/reactor-systems/closed-magnetic/) · [open-magnetic](https://anulum.li/reactor-systems/open-magnetic/) · [pinches](https://anulum.li/reactor-systems/pinches/) · [inertial](https://anulum.li/reactor-systems/inertial/) · [magneto-inertial](https://anulum.li/reactor-systems/magneto-inertial/) · [electrostatic-hybrid](https://anulum.li/reactor-systems/electrostatic-hybrid/)

</details>

<details>
<summary><strong>02 · SCPN Systems Integration and Control</strong> · 4 repozitárov · 4 položiek katalógu</summary>

Štyri rovnocenné produkty. Control a Phase Orchestrator sú verejné; Studio Hub aj repozitár Studio Platform sú súkromné. Verejný balík scpn-studio-platform je dostupný samostatne. Deklarované rozhrania Studio nedokazujú otestovanú federáciu.

| Projekt / komponent | Úloha a fáza vývoja | Repozitár / dostupnosť | Deklarovaná licencia | Dátum zdroja |
|---|---|---|---|---|
| [SCPN Phase Orchestrator](https://github.com/anulum/scpn-phase-orchestrator)<br><sub>Synchronisation analysis and evaluation of early-warning detectors on coupled phase-oscillator dynamics, with a Rust kernel.</sub> | Prebieha · package · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-13 |
| [SCPN Control](https://github.com/anulum/scpn-control)<br><sub>Compiler from stochastic Petri nets to controllers with runtime contracts, and plasma-control research paths.</sub> | Prebieha · package · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-13 |
| SCPN Studio Platform<br><sub>Domain-neutral SDK for studios: evidence bundles, capability manifests, bounded jobs and tenant-aware identity.</sub> | Prebieha · package · Released software · ongoing development | Súkromný | AGPL-3.0-or-later | 2026-10-13 |
| SCPN Studio<br><sub>The hub that federates studios over the platform contract: registry, cross-studio evidence audit, rendering and federation gating.</sub> | Prebieha · service · Implementation and integration | Súkromný | AGPL-3.0-or-later | 2026-10-13 |

</details>

<details>
<summary><strong>03 · Agentic Coordination, Assurance and Continuity</strong> · 10 repozitárov · 10 položiek katalógu</summary>

Desať repozitárov pre koordináciu, kontrolu, pamäť a riadené akcie. HushLine patrí medzi nástroje skupiny; zahrnutý je aj SYNAPSE-POLICY-CHECK-ACTION. Každý produkt má vlastnú licenciu a hranice schopností.

[Architektonické mapy skupín](https://github.com/anulum/synapse-channel/blob/main/docs/ecosystem.md)

| Projekt / komponent | Úloha a fáza vývoja | Repozitár / dostupnosť | Deklarovaná licencia | Dátum zdroja |
|---|---|---|---|---|
| [Synapse Channel](https://github.com/anulum/synapse-channel)<br><sub>Local-first coordination bus for AI agents: presence, file-scope work claims, messages, task status, receipts and an audit journal on one hub.</sub> | Prebieha · package · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-11 |
| Synapse Channel Fleet<br><sub>Multi-machine operation of the bus: durable follower daemon, per-peer trust and configuration, claim forwarding and diagnostics.</sub> | Prebieha · package · Implementation and integration | Súkromný | LicenseRef-SYNAPSE-Enterprise | 2026-10-11 |
| [SYNAPSE-POLICY-CHECK-ACTION](https://github.com/anulum/synapse-policy-check-action)<br><sub>GitHub Action that checks a SYNAPSE CHANNEL release receipt against a policy file in CI.</sub> | Prebieha · tool · Implementation and integration | Verejný | AGPL-3.0-or-later | 2026-10-11 |
| [Director-AI](https://github.com/anulum/director-ai)<br><sub>Response-level guardrail for LLM output: NLI and retrieval grounding, sealed evidence packets and an optional streaming contradiction halt.</sub> | Prebieha · package · Released software · ongoing development | Verejný | Apache-2.0 AND BUSL-1.1 | 2026-10-11 |
| Director Class AI<br><sub>Action control between an autonomous agent and its effectors: action-policy checks, human approvals, gateway enforcement and tamper-evident action evidence.</sub> | Prebieha · package · Implementation and integration | Súkromný | BUSL-1.1 | 2026-10-11 |
| Director AI Cloud<br><sub>Control plane for a hosted Director-AI API: accounts, API-key lifecycle, usage metering, plan quotas and operator exports.</sub> | Prebieha · service · Implementation and integration | Súkromný | BUSL-1.1 | 2026-10-11 |
| [Rigor Foundry](https://github.com/anulum/rigor-foundry)<br><sub>Evidence-bound repository auditing: inventories Git-tracked content, emits reproducible audit candidates, binds review decisions to exact evidence and prepares remediation inputs.</sub> | Prebieha · package · Released software · ongoing development | Verejný | Apache-2.0 | 2026-10-11 |
| [Remanentia](https://github.com/anulum/remanentia)<br><sub>Local-first, auditable memory for AI agents and knowledge-intensive software: project-file indexing, hybrid retrieval, consolidation and an entity graph, through a CLI, an MCP server and an HTTP API.</sub> | Prebieha · package · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-11 |
| Remanentia Portal<br><sub>Account and billing or licence-request portal for the product family. It runs no customer workload.</sub> | Prebieha · service · Implementation and integration | Súkromný | AGPL-3.0-or-later | 2026-10-11 |
| [HushLine](https://github.com/anulum/HushLine)<br><sub>Local command-output filter: runs a command, then limits, shapes and redacts its output before it reaches a caller. Four independent cores: Go, Rust, Python and Node.</sub> | Prebieha · tool · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-11 |

</details>

<details>
<summary><strong>04 · SC Neuromorphic Computing Systems</strong> · 4 repozitárov · 42 položiek katalógu</summary>

Základný inventár má 40 pomenovaných položiek vrátane trvalého pracoviska SC-NeuroCore a podporných nástrojov; dva ďalšie modulové/podmienené ciele tvoria spolu 42 položiek katalógu. LOOP-TIMING-WITNESS má verejný hostiteľský balík; kvalifikácia fyzickej dosky čaká. EVIDENCE-MANIFEST-TOOLKIT je nezverejnený. Moduly a odložené ciele sú označené samostatne.

[Architektonické mapy skupín](https://github.com/anulum/sc-neurocore/blob/main/docs/ecosystem.md)

| Projekt / komponent | Úloha a fáza vývoja | Repozitár / dostupnosť | Deklarovaná licencia | Dátum zdroja |
|---|---|---|---|---|
| [SC-NeuroCore](https://github.com/anulum/sc-neurocore)<br><sub>Permanent public development, composition and integration workbench for stochastic and spiking neural modelling, encoding, learning, simulation, selected hardware compilation and evidence inspection.</sub> | Prebieha · workbench · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-13 |
| [Loop Timing Witness](https://github.com/anulum/loop-timing-witness)<br><sub>Fabric-clock instrument for complete control-loop and selected accelerator timing, with simulation/host analysis separated from eventual board timing, fault response and rail-energy evidence.</sub> | Prebieha · tool · Architecture and qualification | Verejný | AGPL-3.0-or-later | 2026-10-13 |
| EVIDENCE-MANIFEST-TOOLKIT<br><sub>Canonicalises, references, seals and verifies evidence with explicit schemas, bounded sources and independently selected policy.</sub> | Prebieha · shared · Architecture and qualification | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-13 |
| RANDOMNESS-WITNESS<br><sub>Assesses number-source suitability for a declared stochastic-computing use; it does not certify randomness for every purpose.</sub> | Prebieha · shared · Design and preparation | Cieľ / modul / balík | undecided | 2026-10-13 |
| EXPERIMENT-LEDGER<br><sub>Records experiment lineage across tools without owning their raw evidence or running their computations.</sub> | Prebieha · shared · Design and preparation | Cieľ / modul / balík | undecided | 2026-10-13 |
| SC-NC-CORE<br><sub>Neuron/synapse primitives, network graph, simulation loop, fixed-point semantics, constants and exceptions.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-CATALOGUE<br><sub>Neuron models, model zoo and topology/connectome generators.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-ENGINE<br><sub>Accelerated execution and its maintained language/native interfaces.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-BRIDGES<br><sub>Interchange and cross-domain adapters including NIR, quantum, HDC/VSA and neuro-symbolic routes.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-LEARN<br><sub>Training and adaptation, including surrogate gradients, plasticity, online learning, quantisation-aware training and distillation.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-DATA<br><sub>Datasets, signal/event encoding, augmentation, codecs, sources and recording adapters.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-ANALYSIS<br><sub>Spike-train analysis, visualisation and explainability.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-COMPILER<br><sub>Equation/IR lowering and hardware collateral for supported numerical models.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-HARDWARE<br><sub>Target profiles, mapping, deployment, drivers and power/thermal integration.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-VERIFY<br><sub>Formal, fault, resilience and safety-readiness verification within explicit proof scopes.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-STUDIO<br><sub>Visual composition, inspection and evidence presentation workflows.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-RESEARCH<br><sub>Retained experimental paths, including evolutionary, biological and world-model directions.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-NC-BENCH<br><sub>Catalogue/workload suites and immutable source-bound benchmark records.</sub> | Prebieha · component · Workbench transition | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| MODEL-PROVENANCE-PACK<br><sub>Binds a model's data, training, conversion, quantisation, encoding and supporting evidence into a verifiable provenance pack.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SPIKE-LOG<br><sub>Records, indexes, verifies, slices and replays event streams without losing their provenance or timebase identity.</sub> | Prebieha · tool · Design and implementation | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SPIKE-FORMAT-BRIDGE<br><sub>Converts event recordings between declared formats and reports every permitted loss rather than hiding timestamp, polarity or side-stream changes.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SPIKE-CODEC-BENCH<br><sub>Measures compression of existing spike trains, comparing payload ratio, distortion, encode/decode latency and memory.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SPIKE-ENCODER-CHARACTERISER<br><sub>Measures the information, spike-rate and latency trade-offs of sensor-to-spike encoders.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SPIKE-QUALITY-GATE<br><sub>Checks event data against a named quality policy for timestamp, noise, sensor-health, rate, gap and spatial defects.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SPIKE-GROUNDTRUTH<br><sub>Generates reproducible event-vision, audio, sensor and control stimuli with ground truth defined by the generator.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SNN-DIVERGENCE-HARNESS<br><sub>Compares the same network and input across implementations under bit-exact, tolerance or statistical oracles.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-STREAM-PROVER<br><sub>Compares realised stochastic-computing arithmetic error with a declared bound for a specific circuit, source and stream-length regime.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| MUTATION-SNN<br><sub>Measures test adequacy by generating declared semantic mutants and recording what the suite detects.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| NIR-CONFORMANCE<br><sub>Tests importer/exporter behaviour against the known semantics of a pinned Neuromorphic Intermediate Representation version.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| NEURO-EVIDENCE-BENCH<br><sub>Executes declared neuromorphic benchmark plans and traces each scoped result back to its raw evidence.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SPIKE-CALIBRATOR<br><sub>Measures classifier confidence against correctness under declared signal definitions, shifts and placements.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| BITSTREAM-EVIDENCE-CI<br><sub>Captures pinned FPGA build inputs, reports and bitstream identity in a reproducibility-aware chained build ledger.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| PLASTICITY-WITNESS<br><sub>Compares observed learning-rule updates with an independently defined fixed-point or statistical oracle under stated spike/load/fault protocols.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| AER-LINK-WITNESS<br><sub>Measures event-link behaviour under load, including loss, reordering, fairness, starvation and forward progress.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| RELIABILITY-WITNESS<br><sub>Characterises reliability within a declared physical or explicitly simulated exposure, retaining conditions, gaps and rare-event uncertainty.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SIM-REAL-WITNESS<br><sub>Quantifies simulation-to-fabric differences for the same model, input and observable population.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| DEPLOY-PACK<br><sub>Composes validated deployment evidence with bitstream/driver identity into a verifiable install/update package.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| FIELD-OPS-WITNESS<br><sub>Aggregates compact field health and drift evidence against deployment-time envelopes without actuating devices.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| FLIGHT-RECORDER<br><sub>Retains a bounded per-device event/state history for gap-honest incident reconstruction.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| NEURO-SAFETY-CASE<br><sub>Composes scoped evidence and open gaps into an assessor-facing assurance argument; it certifies nothing itself.</sub> | Prebieha · tool · Design and implementation | Cieľ / modul / balík | Undecided for independent release | 2026-10-13 |
| SC-COMPUTE-ADAPTERS<br><sub>Owns the SC-NeuroCore-side wrappers and numerical/register/handshake contracts needed to put selected generated peripherals into the independent LOOP-TIMING-WITNESS DUT/capture path.</sub> | Prebieha · workbench module · Architecture and interface work | Cieľ / modul / balík | Independent distribution terms being defined | 2026-10-13 |
| SC-NC-BIO<br><sub>Conditional destination for separately owned biological/biohybrid work if its independent release lifecycle is accepted; current experimental bioware remains in the developmental parent.</sub> | Prebieha · conditional architecture destination · Architecture and interface work | Cieľ / modul / balík | Independent distribution terms being defined | 2026-10-13 |

</details>

<details>
<summary><strong>05 · SCPN Quantum Computing Systems</strong> · 24 repozitárov · 28 položiek katalógu</summary>

Trvalé pracovisko SCPN-QUANTUM-CONTROL; oscillatools a SCPN-QUANTUM-ENGINE sú samostatné distribúcie, nie ďalšie pracoviská. Vyvíja sa šestnásť komponentových a osem nástrojových cieľov; QUANTUM_LAB je pracovný priestor. Licencie a vydania samostatných balíkov sa odlišujú od rodičovského projektu.

[Architektonické mapy skupín](https://github.com/anulum/scpn-quantum-control/blob/main/docs/ecosystem.md)

| Projekt / komponent | Úloha a fáza vývoja | Repozitár / dostupnosť | Deklarovaná licencia | Dátum zdroja |
|---|---|---|---|---|
| [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control)<br><sub>Integrated modelling, simulation, compilation, gradients, control, provider workflows, analysis and Quantum Studio.</sub> | Prebieha · workbench · Released software · ongoing development | Verejný | AGPL-3.0-or-later | 2026-10-13 |
| oscillatools<br><sub>Classical coupled-phase-oscillator dynamics, observables, sensitivities and control-oriented numerical tools.</sub> | Prebieha · package · Released software · ongoing development | Cieľ / modul / balík | AGPL-3.0-or-later | 2026-10-13 |
| scpn-quantum-engine<br><sub>Optional Rust/PyO3 numerical acceleration and native computation used by supported workbench paths.</sub> | Prebieha · package · Released software · ongoing development | Cieľ / modul / balík | AGPL-3.0-or-later | 2026-10-13 |
| QPU-RESULT-PACK<br><sub>Preserve raw results and their provenance, derivations and reviewable presentation.</sub> | Prebieha · tool · Implementation and integration | Lokálny, nezverejnený | not stated | 2026-10-13 |
| TRANSPILE-WITNESS<br><sub>Retain scoped observations about compilation semantics, layout, global phase and replay.</sub> | Prebieha · tool · Implementation and integration | Cieľ / modul / balík | AGPL-3.0-or-later by file headers; no licence field in packaging | 2026-10-13 |
| MITIGATION-WITNESS<br><sub>Evaluate mitigation on declared measurement panels with retained inputs and uncertainty.</sub> | Prebieha · tool · Implementation and integration | Lokálny, nezverejnený | AGPL-3.0-or-later | 2026-10-13 |
| SCPN-QC-CONTRACTS<br><sub>Versioned parameter, result, semantic and evidence interface contracts shared by components.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-CORE<br><sub>Configuration, logging, resource budgets and generic Kuramoto-XY problem foundations, separated from paper-specific research assumptions.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-AD<br><sub>Whole-program automatic differentiation, derivative transforms, batching, optimisation and explicit supported-path contracts.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-SIM<br><sub>Classical and quantum oscillator dynamics, XY/Kuramoto solvers, open-system simulation, tensor-network paths and co-simulation.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-COMPILER<br><sub>Model and circuit frontends, intermediate representations, interchange and code generation.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-QNODE<br><sub>Quantum tapes, gradient execution and framework bridges for supported Qiskit, PennyLane, JAX, PyTorch and TensorFlow paths.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-HAL<br><sub>Provider-neutral workloads, capabilities, job/result contracts and optional provider adapters.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-MITIGATION<br><sub>Error-mitigation implementations and their method taxonomy.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-QEC<br><sub>Quantum error-correction analysis and fault-tolerant resource-reporting surfaces.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-CONTROL<br><sub>Feedback and co-design, chimera and topology-aware control, and DLA-constrained control paths.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-ANALYSIS<br><sub>Observables, synchronisation witnesses, result analysis and the open-data DLA-parity pathway.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-LEARN<br><sub>Forecasting, quantum neural models, surrogate models, kernels and variational learning paths.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-APPS<br><sub>Domain application adapters, quantum randomness, cryptography and sensing workflows, with explicit claim boundaries.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-BENCH<br><sub>Workload-specific benchmark suites, comparison harnesses, campaign reproduction and retained run evidence.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-STUDIO<br><sub>Quantum Studio's visual workflows, inspectors and evidence presentation through the shared Studio platform contract.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| SCPN-QC-RESEARCH<br><sub>Experimental SCPN theory, paper-specific assumptions and research adapters whose contracts are not stable.</sub> | Prebieha · component · Workbench transition | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| NOISE-MODEL-WITNESS<br><sub>Compare model predictions and replay observations for the same circuit and shot identities, with uncertainty, shot floors, calibration epochs and declared tolerances.</sub> | Prebieha · tool · Design and implementation | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| VENDOR-CLAIM-RECOMPUTER<br><sub>Recompute released-data quantum-volume, error-per-layer-gate and logical-error claims against fixed definitions, original inputs and declared computation budgets.</sub> | Prebieha · tool · Design and implementation | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| DECODER-WITNESS<br><sub>Compare real decoder engines on released shot data with lossless adapters, declared noise conditions and uncertainty-aware reports.</sub> | Prebieha · tool · Design and implementation | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| GRADIENT-WITNESS<br><sub>Check software derivatives against declared analytic, parameter-shift and finite-difference references, including complex, finite-shot and cross-framework cases.</sub> | Prebieha · tool · Design and implementation | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| CONFORMANCE-WITNESS<br><sub>Check versioned OpenQASM 3, adapter behaviour, provenance fields and repository-evidence criteria against their normative clauses and actual entry points.</sub> | Prebieha · tool · Design and implementation | Lokálny, nezverejnený | Undecided for independent release | 2026-10-13 |
| QUANTUM_LAB<br><sub>Reserved research workspace name; implementation role is not assigned in the group map.</sub> | Prebieha · workspace · Workspace definition | Cieľ / modul / balík | Not stated | 2026-10-13 |

↔ EVIDENCE-MANIFEST-TOOLKIT · RANDOMNESS-WITNESS · EXPERIMENT-LEDGER

</details>

<details>
<summary><strong>06 · Scientific Discovery and Experimentation</strong> · 0 repozitárov · 0 položiek katalógu</summary>

Registrovaná 12. októbra 2026; vo formovaní; nula registrovaných projektov a repozitárov. Vlastní postup hypotéza → experiment → kontrola → záznam → návrh aktualizácie modelu a spoločný formát benchmarku a správy. Doménové modely, hardvér a oprávnenie na vykonávanie zostávajú príslušným skupinám. Uzavretý vedecký cyklus sa nedeklaruje.


</details>

**Ďalší verejný výskumný záznam**

Fusion Equilibrium Challenge je verejný reprodukčný balík vytvorený 14. októbra 2026, po inventári skupín. Uvádzame ho samostatne, aby zostali zachované dátované počty skupín. Výsledky a obmedzenia sú v jeho vlastnom zázname.

- [Fusion Equilibrium Challenge](https://github.com/anulum/fusion-equilibrium-challenge) · Prebieha · AGPL-3.0-or-later · 2026-10-15
<!-- profile-catalogue:inventory:end -->

## Ciele sponzorstva

Otvorená práca je financovaná cez [GitHub Sponsors](https://github.com/sponsors/anulum).
Približne **25 000 USD mesačne** je minimum, pri ktorom lab beží bez prerušenia:
výpočty, čas na GPU, QPU a FPGA, hardvér, CI a nástroje. Sú to náklady labu,
nie plat. Nad toto minimum sa práca dá škálovať, pretože motor mení ďalší
výpočtový výkon priamo na ďalšiu vyvinutú a overenú prácu. Sponzorstvo platí
lab, nekupuje výsledky. Zistenia zverejňujeme, nech vyjdú akokoľvek.

Ak chcete podporu nasmerovať, uveďte pri sponzorovaní motor alebo jednu doménu;
peniaze sa minú tam a vykážeme ich v štvrťročnej správe. Hardvér, ktorý lab
potrebuje, je rozpísaný položku po položke v [LAB_EQUIPMENT.md](LAB_EQUIPMENT.md)
(anglicky); vybavenie možno darovať aj vecne.

### Motor

**03 · Agentic Coordination, Assurance and Continuity.** Autonómny kódovací
a overovací systém, ktorý vyvíja a overuje každý projekt na tejto stránke,
dotiahnutý do verzie 1.0 ako otvorená infraštruktúra. Tvoria ho [SYNAPSE CHANNEL](https://github.com/anulum/synapse-channel)
(koordinácia agentov s potvrdeniami), [Rigor Foundry](https://github.com/anulum/rigor-foundry) (review viazané
na dôkazy), [Director-AI](https://github.com/anulum/director-ai) (ukotvenie tvrdení) a [Remanentia](https://github.com/anulum/remanentia)
(auditovateľná pamäť). Sponzorstvo platí čas modelov a GPU pre flotilu agentov,
evaluačné benchmarky a CI.

### Štyri domény

| Doména | Cieľ | Sponzorstvo platí |
|---|---|---|
| **01 · Reactor Systems** | 55 vlastnených repozitárov vrátane ATLAS-REACTORUM: 26 verejných a 29 lokálne inicializovaných, nezverejnených. Modely fúzie, štiepenia, chemických a hybridných systémov, spoločné jadrá, geometria a dôkazy o reaktoroch. World models, 3D simulácie a návrhy zariadení sú vyvíjané výstupy programu; návrh nie je overený reaktor. | výpočty pre simulácie, CAD nástroje, dokumentácia |
| **02 · Systems Integration and Control** | **SCPN Studio Hub**, ktorý spája štúdiá všetkých skupín: katalóg štúdií, audit dôkazov naprieč doménami, každé tvrdenie zobrazené na svojej skutočnej hranici a fail-closed brána pre všetko, čo by sa mohlo dotknúť hardvéru. Skupina spravuje aj [scpn-control](https://github.com/anulum/scpn-control) a [scpn-phase-orchestrator](https://github.com/anulum/scpn-phase-orchestrator). | CI, hardware-in-the-loop replay, dokumentácia |
| **04 · SC Neuromorphic Computing** | **SNN Studio 1.0**, prehliadačové IDE pre celý životný cyklus spikových sietí: návrh modelov neurónov, stavba sietí, tréning so surogátnymi gradientmi, kompilácia do SystemVerilogu a syntéza na FPGA, s exportovateľným dôkazovým záznamom každého behu. Postavené na [sc-neurocore](https://github.com/anulum/sc-neurocore); dnes vo fáze development preview. | FPGA dosky a čas na syntézu, meracie pracovisko, CI |
| **05 · SCPN Quantum Computing** | **Quantum Studio**, pracovné prostredie nad [scpn-quantum-control](https://github.com/anulum/scpn-quantum-control): mapa toho, čo existuje a ako to súvisí, obvody navrhnuté a spustené na simulátoroch aj na skutočnom kvantovom hardvéri, a každý výsledok zabalený so surovými dátami, hashmi, písomným protokolom a rozhodovacím pravidlom, vrátane negatívnych výsledkov. | čas na QPU, GPU simulácie, dokumentácia |

### Pre organizácie

- **Výskumná dohoda.** Organizácia môže namiesto sponzorstva financovať
  vymedzenú prácu na základe písomnej výskumnej dohody s priamou fakturáciou.
  Rozsah a výstupy sa dohodnú vopred; zistenia sa zverejňujú podľa rovnakého
  pravidla ako vyššie.
- **Komerčná licencia.** Projekty pod AGPL-3.0-or-later možno licencovať za
  komerčných podmienok pre proprietárne alebo uzavreté použitie, napríklad [SYNAPSE CHANNEL](https://anulum.li/synapse/pricing.html), [SC-NeuroCore](https://anulum.li/sc-neurocore/pricing.html), [SCPN Control](https://anulum.li/scpn-control/pricing.html), [SCPN Fusion Core](https://anulum.li/scpn-fusion-core/pricing.html), [SCPN Phase Orchestrator](https://anulum.li/scpn-phase-orchestrator/pricing.html), [SCPN Quantum Control](https://anulum.li/scpn-quantum-control/pricing.html).
  Projekty pod Apache-2.0, ako Director-AI a Rigor Foundry, licenciu
  nepotrebujú; [Director-AI Pro](https://anulum.li/director-ai/pricing.html) je komerčná self-hosted edícia
  a podporu a integráciu možno zazmluvniť pre ktorýkoľvek projekt. Ktorá
  licencia platí, určuje súbor LICENSE v každom repozitári.
- **Kontakt:** [protoscience@anulum.li](mailto:protoscience@anulum.li), v predmete „výskumná dohoda“ alebo
  „komerčná licencia“ a názov projektu.

## Výskumné výstupy

| Plocha | Overená cesta |
|---|---|
| Kompletný výskumný index | [Publikácie, preprinty a softvérové archívy](PUBLICATIONS.md) |
| Hub publikácií | [anulum.li/papers/](https://anulum.li/papers/): každý záznam na Zenodo s BibTeX |
| Vydania a publikácie | [anulum.li/news/](https://anulum.li/news/) · [RSS](https://anulum.li/news/feed.xml) |
| Životopis | [Jednostranové PDF](cv/Miroslav-Sotek-CV.pdf) · [zdroj v Markdowne](cv/Miroslav-Sotek-CV.md) · [JSON Resume](cv/resume.json) |
| Výskumná identita | [ORCID 0009-0009-3560-0851](https://orcid.org/0009-0009-3560-0851) |
| Softvér | [20 uvedených distribúcií na PyPI](https://pypi.org/user/anulum/) |
| Quantum Control | [DOI 10.5281/zenodo.18821929](https://doi.org/10.5281/zenodo.18821929) |
| Fusion Core | [DOI 10.5281/zenodo.18820864](https://doi.org/10.5281/zenodo.18820864) |
| Preprinty fázových systémov | [Štúdia s vyrovnanou mierou falošných poplachov](https://doi.org/10.5281/zenodo.22113062) a [štúdia mapy režimov siete](https://doi.org/10.5281/zenodo.22113116) |
| HushLine | [DOI 10.5281/zenodo.20775432](https://doi.org/10.5281/zenodo.20775432) |

## Publikovanie na PyPI

[PyPI](https://pypi.org/user/anulum/)

<!-- profile-catalogue:packages:start -->
20 pomenovaných distribúcií bolo jednotlivo overených cez PyPI JSON API dňa 2026-10-15. Ide o overený zoznam, nie o úplný súpis celého účtu. Verzie sú metadáta balíkov, nie vedecká validácia ani zodpovedajúce historické DOI vydania.

<details>
<summary><strong>Publikované distribúcie</strong> · 20</summary>

| PyPI | Verzia |
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

## Jazyky a platformy

**Primárna implementácia**

<p>
  <img alt="Python" src="assets/badges/python.svg">
  <img alt="Rust" src="assets/badges/rust.svg">
  <img alt="TypeScript" src="assets/badges/typescript.svg">
  <img alt="JavaScript" src="assets/badges/javascript.svg">
  <img alt="Go" src="assets/badges/go.svg">
</p>

<details>
<summary><strong>Rozšírený vedecký, formálny, hardvérový a prevádzkový stack</strong></summary>

**Vedecká, natívna a formálna práca**

<p>
  <img alt="Julia" src="assets/badges/julia.svg">
  <img alt="Mojo" src="assets/badges/mojo.svg">
  <img alt="C++" src="assets/badges/cpp.svg">
  <img alt="C" src="assets/badges/c.svg">
  <img alt="Lean" src="assets/badges/lean.svg">
  <img alt="Jupyter" src="assets/badges/jupyter.svg">
  <img alt="LaTeX" src="assets/badges/latex.svg">
</p>

**Hardvér, web a prevádzka**

<p>
  <img alt="Verilog" src="assets/badges/verilog.sk.svg">
  <img alt="WebGPU" src="assets/badges/webgpu.svg">
  <img alt="HTML5" src="assets/badges/html5.svg">
  <img alt="CSS3" src="assets/badges/css3.svg">
  <img alt="Shell" src="assets/badges/shell.svg">
  <img alt="Docker" src="assets/badges/docker.svg">
  <img alt="Linux" src="assets/badges/linux.svg">
</p>

Portfólio obsahuje aj udržiavané kontrakty protobuf/gRPC, mosty Python-Rust
postavené na PyO3 a Maturin, ciele WebAssembly, natívne SIMD cesty, vedecké
notebooky a viacjazyčnú dokumentáciu API.

</details>

## Inžinierske štandardy

<p>
  <img alt="pytest" src="assets/badges/pytest.sk.svg">
  <img alt="Ruff" src="assets/badges/ruff.sk.svg">
  <img alt="mypy" src="assets/badges/mypy.sk.svg">
  <img alt="Cargo" src="assets/badges/cargo.sk.svg">
  <img alt="CodeQL" src="assets/badges/codeql.sk.svg">
  <img alt="REUSE" src="assets/badges/reuse.sk.svg">
  <img alt="GitHub Actions" src="assets/badges/github-actions.svg">
</p>

Konkrétne praktiky sa vyberajú podľa rizika a rozsahu repozitára; nie každý
repozitár používa každý nástroj.

| Oblasť kvality | Používané praktiky |
|---|---|
| Správnosť | Deterministické pytest a Cargo testy, coverage gates citlivé na vetvy, paritné testy, regresné fixtures a explicitné negatívne prípady |
| Statická kvalita | Formátovanie a lint v Ruffe, strict mypy tam, kde je deklarovaný, Cargo fmt, Clippy so zakázanými warnings a kontroly API kontraktov |
| Reprodukovateľnosť | Hash-pinned závislosti, protokoly zapísané pred behom, surové balíky výsledkov, obsahové digesty, metadáta benchmarkov a opakovateľné auditné záznamy |
| Bezpečnosť | Bandit, CodeQL a scorecards tam, kde sú zapnuté, modely hrozieb, minimálna autorita, hranice tajomstiev a kontrola závislostí |
| Dodávateľský reťazec | Hlavičky SPDX, kontroly REUSE 3.x, SBOM tam, kde je relevantný, pinned CI actions, podpísané alebo digestom viazané dôkazy a release manifesty |
| Polyglotné overovanie | Parita Python/Rust, mosty PyO3 a Maturin, testy v Go a Julii, buildy Lean, ciele WebAssembly a kontroly RTL/formálne tam, kde sú relevantné |
| Dokumentácia | Buildy MkDocs/Sphinx so zlyhaním na warning alebo strict, generované API referencie, architektonické rozhodnutia, validačné záznamy a explicitné non-claims |
| Dodávanie | Lokálne preflight gates repozitárov, CI workflowy, balíky na PyPI, wheels a zdrojové distribúcie, kontajnery a benchmarkové sady |

## Dôkazy namiesto sloganov

Negatívne a nulové výsledky sa zverejňujú, keď sú skutočné. Verejné tvrdenia
zostávajú viazané na merania, protokoly zapísané pred behom, surové balíky,
recenzie viazané na zdroj alebo vykonateľné overenie.

Príklad: SCPN Quantum Control zverejňuje protokoly zapísané pred behom a balíky
výsledkov viazané hashom namiesto toho, aby experimentálnu činnosť menil na
tvrdenie o pripravenosti alebo výhode.

## Pracovné princípy

- Dôkazy pred tvrdeniami.
- Reprodukovateľné artefakty pred prezentáciou.
- Jasné hranice medzi výskumom, validáciou a produktovou pripravenosťou.
- Viacjazyčné implementácie tam, kde ich odôvodňuje výkon alebo integrácia
  hardvéru.
- Fail closed, keď je pôvod, oprávnenie alebo dôkaz neúplný.
- Negatívne výsledky a záznamy zlyhaní zostávajú súčasťou výstupu výskumu.

## Spolupráca

<!-- profile-catalogue:partner:start -->
### Zakladajúci a výskumní partneri

Hľadáme pre-seed financovanie a partnerov na spoločné založenie výskumného inštitútu, spoločnosti a neziskovej výskumnej spoločnosti. Program dnes patrí jednej fyzickej osobe; tieto subjekty a pracoviská sú návrhmi, nie už založenými inštitúciami. Počiatočná geografická predstava zahŕňa Švajčiarsko alebo Lichtenštajnsko, Česko alebo Slovensko a tretie pracovisko na Blízkom východe, ktorého miesto zostáva otvorené. Prinášame softvér, výskumný program a riadenú organizáciu agentov. Partneri môžu priniesť kapitál, nezávislú replikáciu, merané doménové dáta, návrh a výrobu čipov, laboratóriá, prístroje či pracoviská hardware-in-the-loop. Prvá spolupráca má určiť jeden problém, jeden výstup a dôkazy úspechu. Nedeklarujeme záväzok partnera ani udelené financovanie.
<!-- profile-catalogue:partner:end -->

### Licenčné modely

| Model | Typická hranica |
|---|---|
| Apache-2.0 | Permisívne verejné jadrá, napríklad Director-AI a Rigor Foundry |
| AGPL-3.0-or-later | Verejné sieťové a výskumné systémy s povinnosťami zdieľania zdroja |
| Open core | Verejné jadro so samostatne licencovanými pokročilými alebo spravovanými plochami |
| BUSL-1.1 | Vybrané súkromné komerčné systémy s deklarovanou budúcou zmenou licencie |
| Komerčná licencia | Alternatívne podmienky pre organizácie, ktoré nemôžu použiť verejnú licenciu |

| Forma | Rozsah |
|---|---|
| Výskumná spolupráca | Reprodukovateľné štúdie v spoľahlivosti AI, neuromorfných systémoch, kvantovej simulácii, fyzike plazmy a riadení |
| Technická spolupráca | Architektonické posúdenie, návrh validácie, formálne alebo hardvérové cesty a softvérové inžinierstvo viazané na dôkazy |
| Komerčné licencovanie | Dvojito licencované a spravované produktové plochy cez [licenčnú cestu Anulum](#pre-organizácie) |
| Podpora otvorenej práce | CI, výpočty, hardvérové a kvantové experimenty a verejná dokumentácia cez [GitHub Sponsors](https://github.com/sponsors/anulum) |

Vítam technicky podloženú spoluprácu v spoľahlivej infraštruktúre AI,
multiagentových systémoch, neuromorfných výpočtoch, vedeckom softvéri,
formálnom overovaní, kvantovej simulácii, fyzike plazmy a riadení.

Spolupráce prijímam selektívne. Verejný GitHub profil je aktuálne označený ako
hireable; nejde o záruku okamžitej kapacity.

Užitočná prvá správa obsahuje problém, obmedzenia, relevantné predchádzajúce
práce a dôkazy, ktoré by predstavovali úspech. Kontaktujte ma cez
[protoscience@anulum.li](mailto:protoscience@anulum.li) alebo cez
[anulum.li](https://anulum.li).

Odpovedám na technické návrhy. Neprijímam nepodloženú reklamne ladenú prácu,
vedecké divadlo „iba na ukážku“ ani tvrdenia, ktoré sa nedajú overiť.

[GitHub Sponsors](https://github.com/sponsors/anulum) pri dlhodobej otvorenej
práci financuje CI runnery, výpočty, čas na hardvérové a kvantové experimenty a
verejnú dokumentáciu, nie marketing.

> **Transparentnosť:** Tieto repozitáre zahŕňajú výskumný softvér, vývojárske
> nástroje, súkromné systémy a produktových kandidátov. Aktívny vývoj neznamená
> pripravenosť na produkciu ani vedeckú validáciu, pokiaľ projekt neposkytuje
> explicitné dôkazy.

<p align="center"><em>I AM THAT</em></p>

<p align="center">
  <img src="assets/anulum-logo-footer.jpg" width="100%" alt="Anulum">
</p>
