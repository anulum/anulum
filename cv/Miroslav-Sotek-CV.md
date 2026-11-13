---
title: "Miroslav Šotek"
subtitle: "Independent researcher · Founder · ML and systems engineer"
---

**Switzerland** · [anulum.li](https://anulum.li) ·
[GitHub](https://github.com/anulum) ·
[ORCID 0009-0009-3560-0851](https://orcid.org/0009-0009-3560-0851) ·
[PyPI](https://pypi.org/user/anulum/) ·
[Hugging Face](https://huggingface.co/anulum) ·
[protoscience@anulum.li](mailto:protoscience@anulum.li)

## Profile

Founder and engineering lead of ANULUM CH&LI, an independent research lab. I
build world models, ML evaluation systems and accelerated scientific software,
and I bind every claim to a replayable record. The lab runs on one engine: an
autonomous coding and verification system that builds, tests and reviews each
project. It is applied in four domains: reactor systems, systems integration
and control, neuromorphic computing, and quantum computing. Work runs from
mathematical models through reproducible software, native and GPU acceleration,
formal checks and hardware-facing paths. Long-standing research interest in
lasers, masers and electromagnetic systems.

## Experience

- **1999–present, self-employed:** independent consulting, development and
  research; founder of ANULUM CH&LI.
- Consulting and development in embedded control electronics and real-time
  systems for industrial clients (under NDA); early work on pulsed
  electromagnetic acceleration and switching control.

## Education

- **SOŠ elektrotechnická, 1994–1998:** electrical and electromechanical
  engineering; electrical engineering with a focus on computing. Self-directed,
  lifelong study since, including daily work with LLM-assisted research tools.

## Technical Scope

**ML and evaluation:** training, fine-tuning and distillation (DeBERTa,
ModernBERT, LoRA), world models and neural surrogates, evaluation harnesses
with reference solutions and automated graders, benchmark design under
matched false-alarm protocols, hallucination detection and NLI/RAG grounding.

**Inference and acceleration:** GPU inference with ONNX Runtime (CUDA) and
PyTorch FP16/FP32, batched and sequential serving, profiling and regression
tracking, Rust hot paths via PyO3/Maturin, SIMD, WebGPU/WGSL, WebAssembly,
FPGA RTL.

**Languages:** Python, Rust, TypeScript, JavaScript, Go, Julia, Mojo, C/C++,
Lean 4, Verilog, SystemVerilog, WGSL, Shell and LaTeX.

**Quality:** deterministic tests, coverage gates, strict typing, Ruff, Cargo
fmt/Clippy, CodeQL, Bandit, SPDX/REUSE, SBOMs, hash-pinned dependencies,
protocols committed before the run and replayable result packs.

## Selected Work

**ML, inference and evaluation**

- **Director-AI:** response-level LLM factual-consistency and contradiction
  guardrail with NLI/RAG evidence. Benchmarked GPU inference across ONNX CUDA
  and PyTorch: 16 pairs in 233 ms batched on GPU, against 1042 ms sequential on
  GPU and 6124 ms batched on CPU. Native Rust paths reach 10–21x over Python on
  index-heavy workloads (Criterion). Evaluated on AggreFact, RAGTruth and
  HaluEval.
- **Released models:** DeBERTa-v3 large and base hallucination classifiers, a
  lightweight NLI model and a ModernBERT token-level RAGTruth detector, with a
  training dataset and a demo Space on Hugging Face.
- **Sieving:** denoising-robust fine-tuning for NLI
  ([10.5281/zenodo.18985467](https://doi.org/10.5281/zenodo.18985467)).
- **Fusion Equilibrium Challenge (NeurIPS 2026):** tokamak equilibrium
  reconstruction without magnetic measurements; code, weights, study and the
  full experiment record are public.

**World models: reactor systems**

- **SCPN Reactor Systems:** 55 repositories of physics-based world models
  covering fusion, fission, chemical and hybrid reactor families, with shared
  kernels, geometry and a source-and-rights library (ATLAS-REACTORUM).
- **SCPN Fusion Core:** plasma physics, solvers, control and validation.

**The engine**

- **Synapse Channel:** local-first coordination bus for agent fleets with
  claims, durable messaging, receipts, audit and federation.
- **Rigor Foundry:** evidence-bound repository inventory, audit-candidate
  generation and remediation planning.
- **Remanentia:** auditable memory for AI agents with hybrid retrieval and
  consolidation.

**Further domains**

- **Systems integration and control:** SCPN Control, a control-grade runtime
  with fail-closed admission; SCPN Phase Orchestrator for synchronisation
  analysis; KYMA, trainable oscillator abstractions for verifiable reasoning
  and planning.
- **Neuromorphic computing:** SC-NeuroCore, a stochastic and neuromorphic stack
  spanning Python, Rust SIMD, HDC/VSA and RTL generation.
- **Quantum computing:** SCPN Quantum Control, coupled-oscillator experiments on
  IQM and IBM Quantum hardware with protocols committed before the run and
  hash-bound result packs; preregistered parity-leakage and layout-transfer
  experiments on IQM Garnet
  ([10.5281/zenodo.23298119](https://doi.org/10.5281/zenodo.23298119)). A
  hardware abstraction layer connects to IBM Quantum (Qiskit), IQM, Amazon
  Braket, Azure Quantum, Google Cirq, IonQ, Quantinuum, Rigetti, OQC, Pasqal,
  QuEra, Quandela, D-Wave, PennyLane, qBraid and Strangeworks. IQM granted
  extended IQM Resonance access for this research.

## Portfolio And Research Output

A mapped ecosystem of **97 portfolio repositories** across Reactor, Systems
Integration and Control, Agentic Assurance, Neuromorphic Computing and Quantum
Computing, of which 37 are public. **20 packages** on PyPI and **7 models,
datasets and Spaces** on Hugging Face, verified 2026-10-20.

- 31 ORCID-linked Zenodo records as of 2026-10-20: technical notes, preprints
  and software archives. See the
  [publication index](https://github.com/anulum/anulum/blob/main/PUBLICATIONS.md).
- SCPN Framework v1.0 technical specification:
  [10.5281/zenodo.18507639](https://doi.org/10.5281/zenodo.18507639).
- Phase-system matched-false-alarm and grid regime-map preprints:
  [10.5281/zenodo.22113062](https://doi.org/10.5281/zenodo.22113062) and
  [10.5281/zenodo.22113116](https://doi.org/10.5281/zenodo.22113116).

## Collaboration

Open to selective research, engineering and partnership work under written
agreements with direct invoicing; AGPL projects are available under commercial
licences.
