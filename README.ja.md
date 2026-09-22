<!--
SPDX-License-Identifier: AGPL-3.0-or-later
商用ライセンスを提供可能
© Concepts 1996–2026 Miroslav Šotek. All rights reserved.
© Code 2020–2026 Miroslav Šotek. All rights reserved.
ORCID: 0009-0009-3560-0851
連絡先：www.anulum.li | protoscience@anulum.li
GitHub 個人プロフィール概要
-->

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/profile-header-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/profile-header-light.svg">
    <img src="assets/profile-header-dark.svg" width="1200" alt="Miroslav Šotek: エビデンス、計算、制御">
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
  <a href="https://anulum.li"><img alt="ウェブサイト" src="assets/badges/website.ja.svg"></a>
  <a href="https://orcid.org/0009-0009-3560-0851"><img alt="ORCID" src="assets/badges/orcid.svg"></a>
  <a href="cv/Miroslav-Sotek-CV.pdf"><img alt="CV PDF" src="assets/badges/cv-pdf.ja.svg"></a>
  <a href="https://pypi.org/user/anulum/"><img alt="PyPI" src="assets/badges/pypi-count.ja.svg"></a>
  <a href="https://github.com/sponsors/anulum"><img alt="GitHub Sponsors" src="assets/badges/sponsors.ja.svg"></a>
  <a href="mailto:protoscience@anulum.li"><img alt="メール" src="assets/badges/email.ja.svg"></a>
</p>

<p align="center">
  <a href="#verified-work">検証済み成果</a> · <a href="#current-focus">現在の重点</a> ·
  <a href="#portfolio-ecosystem">エコシステム</a> · <a href="#engineering-practice">標準</a> ·
  <a href="#research-output">研究成果</a> · <a href="#collaboration">協力</a>
</p>

> **注記：** このページの本文は 2026-09-03 時点のスナップショットで、以後更新されません。最新の内容は [English](README.md)（または [Slovenčina](README.sk.md)、[Deutsch](README.de.md)）をご覧ください。下の最新リリースと最新の出版物は自動的に更新されます。

# Miroslav Šotek

スイスの [Anulum Institute](https://anulum.li) で活動する独立研究者、
システムエンジニアです。

AI システム、マルチエージェント・エンジニアリング、科学技術計算、
ニューロモーフィックハードウェア、量子シミュレーション、制御のための
**エビデンスに基づくインフラストラクチャ**を構築しています。数理モデルを
再現可能なソフトウェア、ネイティブ高速化、形式モデル、実行可能な
ハードウェア経路へ接続します。

主張の信頼性は、それを支える測定、成果物、検証によって決まります。

## 言語とプラットフォーム

**主要実装：** Python、Rust、TypeScript、JavaScript、Go。

**科学・ネイティブ・形式手法：** Julia、Mojo、C++、C、Lean 4、Jupyter、LaTeX。

**ハードウェア、Web、運用：** Verilog、SystemVerilog、WGSL/WebGPU、
HTML/CSS、Shell、Docker、Linux。

<p>
  <img alt="Python" src="assets/badges/python.svg">
  <img alt="Rust" src="assets/badges/rust.svg">
  <img alt="TypeScript" src="assets/badges/typescript.svg">
  <img alt="Go" src="assets/badges/go.svg">
  <img alt="Julia" src="assets/badges/julia.svg">
  <img alt="Mojo" src="assets/badges/mojo.svg">
  <img alt="C++" src="assets/badges/cpp.svg">
  <img alt="Lean" src="assets/badges/lean.svg">
  <img alt="Verilog" src="assets/badges/verilog.ja.svg">
  <img alt="WebGPU" src="assets/badges/webgpu.svg">
  <img alt="Jupyter" src="assets/badges/jupyter.svg">
  <img alt="Docker" src="assets/badges/docker.svg">
</p>

## はじめに

| 必要なもの | プロジェクト |
|---|---|
| 互いの作業を上書きしない並列コーディングエージェント | [Synapse Channel](https://github.com/anulum/synapse-channel) · [ドキュメント](https://anulum.github.io/synapse-channel/) |
| LLM の主張保護と事実整合性チェック | [Director-AI](https://github.com/anulum/director-ai) · [ドキュメント](https://anulum.github.io/director-ai/) |
| リポジトリ監査と修復計画 | [Rigor Foundry](https://github.com/anulum/rigor-foundry) · [ドキュメント](https://anulum.github.io/rigor-foundry/) |
| ニューロモーフィックおよび確率的コンピューティング研究 | [SC-NeuroCore](https://github.com/anulum/sc-neurocore) · [ドキュメント](https://anulum.github.io/sc-neurocore/) |
| 結合振動子と量子シミュレーションの研究 | [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control) |

各プロジェクトのドキュメントは、それぞれの Pages サイトと
[anulum.li](https://anulum.li) にも掲載されています。

<a id="verified-work"></a>
## 検証済みの成果

| 分野 | 確認可能なエビデンス |
|---|---|
| マルチエージェント協調 | [検証](https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/VALIDATION.md)、[協調仕様](https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/coordination-spec.md)、[脅威モデル](https://github.com/anulum/synapse-channel/blob/dd65c898a9693b47fad051e3baa92cef07da2e63/docs/sandbox-threat-model.md) |
| LLM 応答保証 | [検証](https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/VALIDATION.md)、[公開ベンチマーク](https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/benchmarks/PUBLIC_BENCHMARKS.md)、[機能マトリクス](https://github.com/anulum/director-ai/blob/fc155051367bb48180f2f5dc92f4120c2549cddd/docs/_generated/capability_matrix.md) |
| ニューロモーフィックから RTL | [検証](https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/VALIDATION.md)、[合成結果](https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/hardware/SYNTHESIS_RESULTS.md)、[トレーサビリティ](https://github.com/anulum/sc-neurocore/blob/4bbc27b808eef0677848c1e484f40bd41e8ce83d/docs/safety/TRACEABILITY_MATRIX.md) |
| プラズマと量子 | [核融合検証](https://github.com/anulum/scpn-fusion-core/blob/3c841fc13109c8efb49bb079d145f70683a4408d/VALIDATION.md)、[事前登録](https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/layout_relaxation_preregistration.md)、[ハードウェア結果パック](https://github.com/anulum/scpn-quantum-control/blob/2bc0f935b75ae7b85a4835caf754b2bfd8770c98/docs/hardware_result_packs.md) |

<a id="current-focus"></a>
## 現在の重点

<sub>ポートフォリオ状態は <!-- verified-at -->2026-09-22<!-- /verified-at --> に検証済みです。</sub>

- 25 の公開 Reactor リポジトリにおける共有カーネルと管理された装置情報。
- 所有権境界を保った協調、メモリ、応答保証、アクション審査、リポジトリエビデンス。
- 科学モデルからネイティブ高速化、形式検査、RTL、確認可能な結果パックまでの経路。

<!-- profile-feeds:releases:start -->
### 最新リリース

| 日付 | プロジェクト | リリース | 変更 |
|---|---|---|---|
| 2026-09-05 | SYNAPSE CHANNEL | [v0.99.26](https://github.com/anulum/synapse-channel/releases/tag/v0.99.26) | Dashboard feeds return unconfigured-store responses without starting report worker processes; configured-store reconstruction retains process isolation. |
| 2026-09-05 | SYNAPSE CHANNEL | [v0.99.25](https://github.com/anulum/synapse-channel/releases/tag/v0.99.25) | Add a repeatable JavaScript SDK integration check against an isolated, authenticated Python hub, covering delivery, claim conflicts, release, snapshots, and reconnect. |
| 2026-09-05 | SCPN-Phase-Orchestrator | [v1.4.3](https://github.com/anulum/scpn-phase-orchestrator/releases/tag/v1.4.3) | Generate identical capability inventory ordering from Git checkouts and exported source trees. |
| 2026-09-04 | SYNAPSE CHANNEL | [v0.99.24](https://github.com/anulum/synapse-channel/releases/tag/v0.99.24) | Keep managed Codex pane bridges waiter-reachable while an already-running provider is blocked by an update chooser, report the pending wake and pane compatibility state explicitly, and coalesce later routing hints until the same live pane becomes safe to… |
| 2026-09-04 | SCPN-Phase-Orchestrator | [v1.4.2](https://github.com/anulum/scpn-phase-orchestrator/releases/tag/v1.4.2) | A fourth sealed L3 request now binds only pulsed_electron_beam_icf to the exact SCPN-ICF-BEAM-CORE review. |

<sub>[anulum.li/news](https://anulum.li/news/)（各プロジェクトの CHANGELOG）と [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) から 2026-09-22 に生成。</sub>
<!-- profile-feeds:releases:end -->

<!-- profile-feeds:publication:start -->
### 最新の出版物

| 日付 | 種別 | 成果 | DOI |
|---|---|---|---|
| 2026-08-26 | Preprint | A domain-specific modal-growth detector clears a matched false-alarm bar on power-grid instability, and an eigenvalue regime map shows when its form transfers | [10.5281/zenodo.22113116](https://doi.org/10.5281/zenodo.22113116) |

<sub>[anulum.li/news](https://anulum.li/news/)（各プロジェクトの CHANGELOG）と [Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22) から 2026-09-22 に生成。</sub>
<!-- profile-feeds:publication:end -->

## タイムライン

| 期間 | 公開情報で確認できるマイルストーン |
|---|---|
| 1996 年以降 | 自己公開された概念開発の期間 |
| 1998 | 公開 ORCID に自己申告された ANULUM CH&LI 創設者役割の開始 |
| 2018 | 公開 GitHub アカウント開設 |
| 2025 | SCPN プレビューと技術報告を Zenodo に公開 |
| 2026 | AI 保証、ニューロモーフィック、プラズマ、量子システムへ公開ソフトウェア・研究ポートフォリオを拡大 |

## ラボマップ

Anulum は単一製品ではなく、ラボ全体の技術スタックです。

```text
Director-AI          モデル出力の信頼性
Rigor Foundry        エビデンスに基づく監査と修復
Synapse Channel      マルチエージェント協調、主張、受領記録
SC-NeuroCore         ニューロモーフィック / SC 計算（Python · Rust · RTL）
SCPN suite           制御、プラズマ、位相、量子の研究経路
```

### 代表的なスタック利用手順

```mermaid
flowchart LR
    A["01 · 検査<br/>Rigor Foundry"] --> B["02 · 保護<br/>Director-AI"] --> C["03 · 調整<br/>Synapse Channel"] --> D["04 · 計算<br/>SC-NeuroCore · SCPN"]
```

1. **Rigor Foundry**: 壊れているもの、未証明なもの、安全に主張できないものを特定します。
2. **Director-AI**: 信頼されるモデル出力を保護します。
3. **Synapse Channel**: 主張、メールボックス、受領記録を用いてマルチエージェント作業を運用します。
4. **SC-NeuroCore / SCPN**: ニューロモーフィック、物理、制御級の計算問題を扱います。

研究、検証、製品準備状態は分離されています。活発な開発は準備完了を
意味しません。

このプロフィールの**ピン留めリポジトリ**は、下の主要プロジェクト表と
一致します。その他の公開リポジトリは SCPN 系研究または支援ツールです。

<a id="portfolio-ecosystem"></a>
## エコシステムマップ

現在のポートフォリオは、5 つの独立したグループに属する **39 の
リポジトリ**で構成されます。内訳は公開リポジトリ 33、非公開製品領域
6 です。
[HushLine](https://github.com/anulum/HushLine) は、これらの研究・製品
ポートフォリオ外にある独立した公開プロジェクトです。

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/ecosystem-map-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/ecosystem-map-light.svg">
    <img src="assets/ecosystem-map-dark.svg" width="1200" alt="5 つの独立したリポジトリグループから成る Anulum ポートフォリオ">
  </picture>
</p>

矢印は、契約、統合、エビデンス、監査の関係を表します。リポジトリの
所有権を統合するものではなく、科学的検証、運用準備完了、アクチュエータ
制御権限を意味するものでもありません。

**ステータス：** `公開` · `公開 / アーキテクチャのみ` · `非公開` · `非公開 / プロプライエタリ`

<details>
<summary><strong>SCPN Reactor Systems: 25 リポジトリ</strong></summary>

装置ファミリーの物理、共有数値カーネル、炉モデル、構成の所有権を扱います。
リポジトリが存在するだけでは、物理モデルの検証や装置の実用準備完了を
示しません。

- [SCPN Beam Target Core](https://github.com/anulum/scpn-beam-target-core): `公開`
- [SCPN Dense Plasma Focus Core](https://github.com/anulum/scpn-dense-plasma-focus-core): `公開`
- [SCPN FRC Core](https://github.com/anulum/scpn-frc-core): `公開`
- [SCPN Fusion Core](https://github.com/anulum/scpn-fusion-core): `公開`
- [SCPN Fusion-Fission Hybrid Core](https://github.com/anulum/scpn-fusion-fission-hybrid-core): `公開`
- [SCPN ICF Beam Core](https://github.com/anulum/scpn-icf-beam-core): `公開`
- [SCPN ICF Impact Core](https://github.com/anulum/scpn-icf-impact-core): `公開`
- [SCPN ICF Laser Core](https://github.com/anulum/scpn-icf-laser-core): `公開`
- [SCPN IEC Core](https://github.com/anulum/scpn-iec-core): `公開`
- [SCPN Levitated Dipole Core](https://github.com/anulum/scpn-levitated-dipole-core): `公開`
- [SCPN Magnetic Cusp Core](https://github.com/anulum/scpn-magnetic-cusp-core): `公開`
- [SCPN MIF Core](https://github.com/anulum/scpn-mif-core): `公開`
- [SCPN MIF Liner Core](https://github.com/anulum/scpn-mif-liner-core): `公開`
- [SCPN MIF MagLIF Core](https://github.com/anulum/scpn-mif-maglif-core): `公開`
- [SCPN MIF Plasma Jet Core](https://github.com/anulum/scpn-mif-plasma-jet-core): `公開`
- [SCPN Mirror Core](https://github.com/anulum/scpn-mirror-core): `公開`
- [SCPN RFP Core](https://github.com/anulum/scpn-rfp-core): `公開`
- [SCPN Spheromak Core](https://github.com/anulum/scpn-spheromak-core): `公開`
- [SCPN Stellarator Core](https://github.com/anulum/scpn-stellarator-core): `公開`
- [SCPN Theta Pinch Core](https://github.com/anulum/scpn-theta-pinch-core): `公開`
- [SCPN Tokamak Core](https://github.com/anulum/scpn-tokamak-core): `公開`
- [SCPN Z-Pinch Core](https://github.com/anulum/scpn-z-pinch-core): `公開`
- [SCPN Reactor Kernels](https://github.com/anulum/scpn-reactor-kernels): `公開`
- [SCPN Lattice Fusion Core](https://github.com/anulum/scpn-lattice-fusion-core): `公開 / アーキテクチャのみ`
- [SCPN Muon Fusion Core](https://github.com/anulum/scpn-muon-fusion-core): `公開 / アーキテクチャのみ`

</details>

<details>
<summary><strong>SCPN Systems Integration and Control: 4 リポジトリ</strong></summary>

分野横断のセマンティクス、制御受け入れ、フェデレーション、エビデンス表示、
共有インターフェース契約を扱います。

- [SCPN Control](https://github.com/anulum/scpn-control): `公開`
- [SCPN Phase Orchestrator](https://github.com/anulum/scpn-phase-orchestrator): `公開`
- **SCPN Studio**: `非公開 / プロプライエタリ`
- **SCPN Studio Platform**: `非公開 / プロプライエタリ`

</details>

<details>
<summary><strong>Agentic Coordination, Assurance and Continuity: 8 リポジトリ</strong></summary>

エージェント協調、メモリ、応答保証、リポジトリエビデンス、アクション
ガバナンス、商用コントロールプレーンを扱います。

- [Director-AI](https://github.com/anulum/director-ai): `公開`
- **Director Class AI**: `非公開 / プロプライエタリ`
- **Director AI Cloud**: `非公開 / プロプライエタリ`
- [Rigor Foundry](https://github.com/anulum/rigor-foundry): `公開`
- [Remanentia](https://github.com/anulum/remanentia): `公開`
- **Remanentia Portal**: `非公開 / プロプライエタリ`
- [Synapse Channel](https://github.com/anulum/synapse-channel): `公開`
- **Synapse Channel Fleet**: `非公開 / プロプライエタリ`

</details>

<details>
<summary><strong>SC Neuromorphic Computing Systems: 1 リポジトリ</strong></summary>

- [SC-NeuroCore](https://github.com/anulum/sc-neurocore): `公開`

確率的コンピューティング、スパイキングシステム、超次元表現、ネイティブ
高速化、コンパイラ、RTL/FPGA 経路を扱います。

</details>

<details>
<summary><strong>SCPN Quantum Computing Systems: 1 リポジトリ</strong></summary>

- [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control): `公開`

エビデンスに基づく量子コンパイル、シミュレーション、ハードウェア実行、
ハッシュで結合された実験記録を扱います。

</details>

<details>
<summary><strong>独立ツール</strong> &nbsp; 公開リポジトリ 1</summary>

- [HushLine](https://github.com/anulum/HushLine)：stdout と stderr を
  フィルタリング、制限し、必要に応じて秘匿化する決定論的コマンドラッパー。

</details>

<a id="engineering-practice"></a>
## エンジニアリング標準

<p>
  <img alt="pytest" src="assets/badges/pytest.ja.svg">
  <img alt="Ruff" src="assets/badges/ruff.ja.svg">
  <img alt="mypy" src="assets/badges/mypy.ja.svg">
  <img alt="Cargo" src="assets/badges/cargo.ja.svg">
  <img alt="CodeQL" src="assets/badges/codeql.ja.svg">
  <img alt="REUSE" src="assets/badges/reuse.ja.svg">
</p>

具体的な実践は各リポジトリのリスクと範囲に応じて選択され、すべての
リポジトリがすべてのツールを実行するわけではありません。

| 品質領域 | ポートフォリオで使用する実践 |
|---|---|
| 正確性 | 決定論的 pytest/Cargo テスト、カバレッジゲート、同等性テスト、回帰フィクスチャ、明示的な負例 |
| 静的品質 | Ruff、宣言された範囲での strict mypy、Cargo fmt、警告を拒否する Clippy、API 契約チェック |
| 再現性 | ハッシュ固定依存関係、事前登録プロトコル、生の結果パック、コンテンツダイジェスト、再生可能な監査記録 |
| セキュリティ | 必要に応じた Bandit、CodeQL、Scorecards、脅威モデル、最小権限、依存関係レビュー |
| サプライチェーン | SPDX、REUSE 3.x、適用時の SBOM、固定 CI Actions、リリースマニフェスト |
| 多言語検証 | Python/Rust 同等性、PyO3/Maturin、Go/Julia テスト、Lean ビルド、WebAssembly、RTL、形式チェック |
| ドキュメント | strict MkDocs/Sphinx、API リファレンス、設計判断、検証記録、明示的な非主張 |

## PyPI 公開

<p align="center">
  <a href="https://pypi.org/user/anulum/"><img alt="Miroslav Sotek の PyPI プロフィール" src="assets/badges/pypi-profile.svg"></a>
</p>

検証済みの [PyPI プロフィール](https://pypi.org/user/anulum/) には現在、
Python パッケージ、Rust 高速化エンジン、ドメインカーネル、CLI ツールを
含む 19 プロジェクトが公開されています。

<a id="research-output"></a>
## 研究成果

| 領域 | 検証済み経路 |
|---|---|
| 完全な研究索引 | [出版物、プレプリント、ソフトウェアアーカイブ](PUBLICATIONS.md) |
| 出版物ハブ | [anulum.li/papers/](https://anulum.li/papers/)：Zenodo の全レコードと BibTeX |
| リリースと出版物のストリーム | [anulum.li/news/](https://anulum.li/news/) · [RSS](https://anulum.li/news/feed.xml) |
| 履歴書 | [1 ページ PDF](cv/Miroslav-Sotek-CV.pdf)、[Markdown ソース](cv/Miroslav-Sotek-CV.md)、[JSON Resume](cv/resume.json) |
| 研究者識別子 | [ORCID 0009-0009-3560-0851](https://orcid.org/0009-0009-3560-0851) |
| ソフトウェア公開 | [PyPI の 19 プロジェクト](https://pypi.org/user/anulum/) |
| Quantum Control | [DOI 10.5281/zenodo.18821929](https://doi.org/10.5281/zenodo.18821929) |
| Fusion Core | [DOI 10.5281/zenodo.18820864](https://doi.org/10.5281/zenodo.18820864) |
| 位相系プレプリント | [Matched false-alarm](https://doi.org/10.5281/zenodo.22113062)、[grid regime map](https://doi.org/10.5281/zenodo.22113116) |
| HushLine | [DOI 10.5281/zenodo.20775432](https://doi.org/10.5281/zenodo.20775432) |

## 主なプロジェクト

| プロジェクト | 役割 | 成熟度 |
|---|---|---|
| [Synapse Channel](https://github.com/anulum/synapse-channel) | コーディングエージェント群向けのローカルファースト・コントロールプレーン：主張、役割、永続メールボックス、受領記録、監査、フェデレーション | **現在利用可能**: 機能するコア、活発に開発中 |
| [Rigor Foundry](https://github.com/anulum/rigor-foundry) | エビデンスに結び付いたリポジトリ監査と修復計画 | **現在利用可能**: 強化作業を継続中 |
| [Director-AI](https://github.com/anulum/director-ai) | NLI と RAG の事実確認、任意の主張単位ストリーミング停止を備えるリアルタイム LLM ガードレール | **研究進行中**: 検証中の機能的システム |
| [SC-NeuroCore](https://github.com/anulum/sc-neurocore) | 多言語の確率的・ニューロモーフィックフレームワーク（Python、Rust SIMD、Verilog、HDC/VSA） | **研究進行中**: 継続的に開発中のプラットフォーム |
| [SCPN Quantum Control](https://github.com/anulum/scpn-quantum-control) | エビデンスに基づく結合振動子同期の量子シミュレーション | **実験的**: 事前登録された研究プログラム |

関連する制御・核融合研究は SCPN スイートにあります：
[control](https://github.com/anulum/scpn-control)、
[fusion-core](https://github.com/anulum/scpn-fusion-core)、
[phase orchestrator](https://github.com/anulum/scpn-phase-orchestrator)、
[MIF-core](https://github.com/anulum/scpn-mif-core)。

### 成熟度ラベル

| ラベル | 意味 |
|---|---|
| **現在利用可能** | インストール可能、文書化済み、CI 対応。現在も進化中 |
| **研究進行中** | 実際のコードと継続中の研究。安定性を保証するものではない |
| **実験的** | 探索段階。インターフェースや主張を固定と見なさないこと |
| **エビデンス準拠** | 公開主張が測定または成果物に結び付いている |

## スローガンではなくエビデンス

否定的結果や帰無結果も、実在する場合は公開します。公開主張はスローガン
ではなく、測定、事前登録プロトコル、生の結果パック、実行可能な検証などの
成果物に結び付けます。

例：[scpn-quantum-control](https://github.com/anulum/scpn-quantum-control)
にある事前登録済み量子制御プロトコルとハッシュ結合結果パック。

## 作業原則

- 主張より先にエビデンスを示す。
- 発表より先に再現可能な成果物を作る。
- 研究、検証、製品準備状態の境界を明確にする。
- 性能またはハードウェア統合に有用な場合は言語横断実装を行う。
- 失敗を正直に記録する。否定的結果も研究成果の一部である。

<a id="collaboration"></a>
## 共同研究・協力

### ライセンスモデル

| モデル | 代表的な境界 |
|---|---|
| Apache-2.0 | Director-AI、Rigor Foundry などの寛容な公開コア |
| AGPL-3.0-or-later | ソース共有義務を伴う公開ネットワーク・研究システム |
| Open core | 公開コアと別途ライセンスされる高度・管理製品領域 |
| BUSL-1.1 | 将来のライセンス変更が宣言された一部の非公開システム |
| 商用ライセンス | 公開ライセンスを利用できない場合の代替条件 |

| 形態 | 対象 |
|---|---|
| 研究協力 | AI 保証、ニューロモーフィック、量子シミュレーション、プラズマ物理、制御の再現可能な研究 |
| 技術協力 | アーキテクチャ審査、検証設計、形式手法・ハードウェア経路、エビデンス準拠ソフトウェア開発 |
| 商用ライセンス | [Anulum licensing](https://www.anulum.li/licensing) を通じたデュアルライセンスと管理製品 |
| 公開作業の支援 | [GitHub Sponsors](https://github.com/sponsors/anulum) による CI、計算、ハードウェア・量子実験、公開文書の支援 |

ニューロモーフィックシステム、信頼できる AI インフラストラクチャ、
科学技術計算、形式検証、制御に関する技術的根拠のある協力を歓迎します。

協力案件は選択的に受けています。公開 GitHub プロフィールは現在 hireable
ですが、即時対応可能であることを保証するものではありません。

最初の連絡には、課題、制約、関連する先行研究、成功を示すエビデンスを
含めてください。[protoscience@anulum.li](mailto:protoscience@anulum.li)
または [anulum.li](https://anulum.li) の連絡窓口をご利用ください。

技術提案には対応します。根拠のない誇大宣伝、「デモだけ」の科学演出、
検証できない主張を伴う仕事は引き受けません。

[GitHub Sponsors](https://github.com/sponsors/anulum) からの支援は、継続的な
オープンワークの CI ランナー、量子・ハードウェア実験時間、公開
ドキュメントに充てられ、マーケティングには使用しません。

> **透明性：** これらのリポジトリには、研究用ソフトウェア、開発者向け
> ツール、製品候補が含まれます。プロジェクトが明示的なエビデンスを提示
> しない限り、活発な開発は製品運用準備完了や科学的検証を意味しません。

<p align="center"><em>I AM THAT</em></p>

<p align="center">
  <img src="assets/anulum-logo-footer.jpg" width="100%" alt="Anulum">
</p>
