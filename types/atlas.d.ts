// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Types of the actual published source records

/** Dated source entries and directed relationships; work status remains distinct from qualification. */
export type AtlasData = {
  as_of: string;
  content_state: string;
  coverage: string;
  edges: Array<{
    as_of?: string;
    caution?: string;
    evidence: string;
    from: string;
    kind: string;
    layer?: string;
    payload?: string;
    state?: string;
    to: string;
  }>;
  funding_update: {
    as_of: string;
    scope: string;
    work_status_meaning: string;
  };
  groups: Array<{
    architecture_instrument_count?: number;
    architecture_project_count?: number;
    color: string;
    formation?: string;
    height: number;
    id: string;
    inventory_summary?: string;
    name: string;
    ownership_note?: string;
    registered_project_count?: number;
    width: number;
    x: number;
    y: number;
  }>;
  layout: {
    height: number;
    positions: Record<
      string,
      {
        height: number;
        width: number;
        x: number;
        y: number;
      }
    >;
    width: number;
  };
  nodes: Array<{
    as_of: string;
    boundary: string;
    dossier: {
      acceptance?: Array<string>;
      acceptance_basis?: string;
      acceptance_note?: string;
      as_of?: string;
      category?: string;
      configuration_state?: string;
      configurations?: Array<string>;
      connection_needs?: Array<string>;
      critical_boundary?: string;
      current_surfaces: Array<{
        description?: Array<string>;
        evidence: string;
        maturity: string;
        name: string;
        verification_basis?: string;
      }>;
      evidence_state?: string;
      expected_outputs: Array<{
        acceptance: string;
        basis: string;
        deliverable: string;
        qualification_requirements?: string;
      }>;
      inputs: Array<string>;
      inputs_basis?: string;
      intended_role?: string;
      limitations?: Array<string>;
      open_fields: Array<string>;
      outputs: Array<string>;
      outputs_basis?: string;
      partner_needs: Array<string>;
      programme_basis?: string;
      programme_tracks?: Array<{ name: string; scope: string }>;
      public_sources?: string[];
      purpose?: string;
      references?: Array<{
        id: string;
        scope: string;
        source_revision: string;
        title: string;
        url: string;
      }>;
      responsibility?: Array<string>;
      review_state: string;
      scope?: Array<string>;
      source_records?: Array<{
        document: string;
        sha256: string;
      }>;
    };
    function: string;
    group: string;
    id: string;
    kind: string;
    licence: string;
    maturity?:
      | null
      | string
      | {
          source: null | string;
          value: null | string;
        };
    name: string;
    owning_groups: Array<string>;
    packages?: Array<{
      index: string;
      published: boolean;
    }>;
    partner_slots?: Array<{
      as_of: string;
      author: string;
      brings_gains: string;
      first_step: string;
      gap: string;
      group: string;
      id: string;
      profile: string;
      project_ids: Array<string>;
      project_scope: string;
      source_sha256: string;
      state: string;
    }>;
    phase: string;
    release: null | string;
    repository_record?: {
      as_of: string;
      basis: string;
      stage: string;
    };
    resource_candidates?: Array<{
      as_of: string;
      author: string;
      basis: string;
      catalogue_scope: string;
      fit_state: string;
      group: string;
      id: string;
      item: string;
      maker: string;
      need: string;
      own_or_access: string;
      price: string;
      project_ids: Array<string>;
      quantity: string;
      section?: string;
      source: string;
      source_read: boolean;
      source_sha256?: string;
      source_supplied?: boolean;
      verification_state?: string;
    }>;
    resource_needs?: Array<{
      as_of: string;
      author: string;
      basis: string;
      class_basis?: string;
      group: string;
      id: string;
      kind: string;
      need: string;
      own_or_access?: string;
      partner_slot: string;
      preliminary_price_class?: string;
      price: string;
      project: string;
      project_ids: Array<string>;
      quantity: string;
      source_sha256: string;
      state: string;
      today: string;
      unlocks: string;
      when: string;
    }>;
    source_note: string;
    source_reported_limits?: Array<{
      as_of: string;
      author: string;
      source_sha256: string;
      state: string;
      text: string;
    }>;
    sources: Array<string>;
    url: null | string;
    work_status: string;
  }>;
  version: string;
};

/** Source-reported needs and acquisition alternatives; records are not purchased holdings. */
export type ResourceData = {
  as_of: string;
  candidates: Array<{
    as_of: string;
    author: string;
    basis: string;
    catalogue_scope: string;
    fit_state: string;
    group: string;
    id: string;
    item: string;
    maker: string;
    need: string;
    own_or_access: string;
    price: string;
    project_ids: Array<string>;
    quantity: string;
    section?: string;
    source: string;
    source_read: boolean;
    source_sha256?: string;
    source_supplied?: boolean;
    verification_state?: string;
  }>;
  format: string;
  groups: Array<{
    id: string;
    name: string;
    resource_inventory_state: string;
    starting_priorities?: {
      as_of: string;
      author: string;
      items: Array<string>;
      state: string;
    };
  }>;
  needs: Array<{
    as_of: string;
    author: string;
    basis: string;
    class_basis?: string;
    group: string;
    id: string;
    kind: string;
    need: string;
    own_or_access?: string;
    partner_slot: string;
    preliminary_price_class?: string;
    price: string;
    project: string;
    project_ids: Array<string>;
    quantity: string;
    source_sha256: string;
    state: string;
    today: string;
    unlocks: string;
    when: string;
  }>;
  owner_policy: string;
  people_and_spaces: string;
  planning_estimates: Array<{
    as_of: string;
    author: string;
    basis: string;
    group: string;
    id: string;
    kind: string;
    project_ids: Array<string>;
    source_sha256: string;
    state: string;
    title: string;
    values: {
      "Answers for (areas of the map)"?: string;
      Area?: string;
      "Area (estimate)"?: string;
      "Building services"?: string;
      Core?: string;
      Count?: string;
      For?: string;
      "From stage"?: string;
      "From which stage"?: string;
      Full?: string;
      Number?: string;
      "On site or remote"?: string;
      "On site or remote, and why"?: string;
      "On site?"?: string;
      Post?: string;
      Posts?: string;
      Purpose?: string;
      Reason?: string;
      Reasoning?: string;
      Role?: string;
      Room?: string;
      "What the post is for"?: string;
      Where?: string;
      "Where, and why"?: string;
      Why?: string;
      "With one cryostat"?: string;
      "Without a device"?: string;
    };
  }>;
  scope: string;
  source_fingerprints: Array<string>;
};

/** Preliminary scenario alternatives, supplied units, provenance and overlap qualifications. */
export type BudgetData = {
  additional_shared_room_proposals: Array<{
    area: string;
    as_of: string;
    author: string;
    name: string;
    scope: string;
    source_sha256: string;
    state: string;
  }>;
  as_of: string;
  dedicated_facilities: Array<{
    as_of: string;
    author: string;
    basis: string;
    group: string;
    need: string;
    need_id: string;
    need_ids?: Array<string>;
    project_ids: Array<string>;
    source_sha256: string;
    state: string;
  }>;
  external_user_service_scope: string;
  external_user_services: Array<{
    as_of: string;
    author: string;
    group: string;
    id: string;
    need: string;
    project_ids: Array<string>;
  }>;
  hardware_basis: Array<{
    item: string;
    purchase_estimate_eur: number | string;
    state: string;
    author: string;
    as_of: string;
  }>;
  open_items: Array<string>;
  overlap: {
    scope: string;
  };
  partner_slots: Array<{
    as_of: string;
    author: string;
    brings_gains: string;
    first_step: string;
    gap: string;
    group: string;
    id: string;
    profile: string;
    project_ids: Array<string>;
    project_scope: string;
    source_sha256: string;
    state: string;
  }>;
  scenarios: Array<{
    source_date?: string;
    hardware_cash_eur?: number | string;
    hardware_allocated_eur?: number | string;
    commissioning_note?: string;
    annualised_eur: string;
    as_of: string;
    author: string;
    blocks: Array<{
      start?: number | string;
      end?: number | string;
      name: string;
      total_eur: string;
    }>;
    categories: {
      "Indirect costs": string;
      Personnel: string;
      Purchases: string;
      Subcontracting: string;
    };
    effort_profile?: Array<{
      fte: string;
      months: string;
      scope: string;
    }>;
    effort_profile_basis?: string;
    family: string;
    hardware_slices: Array<{
      item: string;
      payment_month?: number | string;
      purchase_month?: number | string;
      commissioned_month?: number | string;
      wp: string;
      use_start: number | string;
      use_end: number | string;
      eligible_depreciation_EUR: number | string;
    }>;
    id: string;
    limits: string;
    lines: Array<{
      block: string;
      category: string;
      line: string;
      quantity: number;
      total_eur: number;
      unit_cost_eur: number;
    }>;
    milestone_basis?: string;
    milestone_source_sha256?: string;
    milestones?: Array<string>;
    months: number;
    person_months: number;
    source_sha256: string;
    state: string;
    title: string;
    total_eur: string;
  }>;
  scope: string;
  shared: Array<{
    as_of: string;
    author: string;
    candidate_budget_lines: Array<{
      line: string;
      scenario_id: string;
      total_eur: string;
    }>;
    conditional_groups?: Array<string>;
    groups: Array<string>;
    id: string;
    name: string;
    optional_groups?: Array<string>;
    owner_feedback: Array<{
      acceptance_criterion: string;
      as_of: string;
      author: string;
      dedication_access: string;
      first_expected_output: string;
      group: string;
      need_ids: Array<string>;
      project_scope: string;
      quantity_basis: string;
      source_need_references?: string;
      source_sha256: string;
      state: string;
      timing: string;
    }>;
    owner_scope_notes?: Array<{
      as_of: string;
      author: string;
      group: string;
      source_sha256: string;
      state: string;
    }>;
    quantity: string;
    related_needs: Array<{
      id: string;
      need: string;
      project_ids: Array<string>;
    }>;
    scope_notes?: Array<string>;
    source_sha256: string;
    state: string;
  }>;
  source_fingerprints: Array<string>;
  version: string;
};

/** Dated reading projections with exact source fingerprints and chapters. */
export type DocumentData = {
  captured_at_utc: string;
  documentation_bindings: number;
  entries_with_documents: number;
  projects: Array<{
    documents: Array<{
      chapters: Array<{
        level: number;
        line: number;
        title: string;
      }>;
      format: string;
      label: string;
      lines: Array<string>;
      private_references_withheld: number;
      projection_sha256: string;
      source_bytes: number;
      source_sha256: string;
    }>;
    project_id: string;
  }>;
  scope: string;
  source_index_sha256: string;
  state: string;
  version: string;
};

/** Source-backed technical guides and their separate captured document library. */
export type TechnicalData = {
  base_candidate_sha256: string;
  captured_at_utc: string;
  editorial_base_candidate_sha256: string;
  guide_source_captures: Record<string, string>;
  guides: Array<{
    components: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
    connections: Array<{
      project_id: string;
      references: Array<string>;
      text: string;
    }>;
    external_roles?: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
    implementation?: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
    inputs: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
    limits: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
    model_layers?: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
    outputs: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
    project_id: string;
    purpose: {
      references: Array<string>;
      text: string;
    };
    scope: {
      references: Array<string>;
      text: string;
    };
    source_notes?: Array<{
      references: Array<string>;
      text: string;
      title: string;
    }>;
  }>;
  interpretation_scope: string;
  library: {
    captured_at_utc: string;
    projects: Array<{
      documents: Array<{
        captured_at_utc: string;
        chapters: Array<{
          level: number;
          line: number;
          title: string;
        }>;
        format: string;
        label: string;
        lines: Array<string>;
        private_references_withheld: number;
        projection_sha256: string;
        source_bytes: number;
        source_label?: string;
        source_sha256: string;
        source_state?: string;
      }>;
      project_id: string;
    }>;
    scope: string;
    state: string;
  };
  references: Array<{
    captured_at_utc: string;
    document: string;
    end: number;
    excerpt: string;
    id: string;
    project: string;
    projection_sha256: string;
    source_sha256: string;
    start: number;
  }>;
  state: string;
  version: string;
};

/** Dated source-update candidates with qualification boundaries. */
export type UpdateData = {
  baseline_change: boolean;
  baseline_nodes: number;
  format: string;
  graph_change: boolean;
  held_contexts: Array<{
    name: string;
    state: string;
  }>;
  matched_rows: number;
  note: string;
  projects: Array<{
    project_id: string;
    record: {
      commercial_licence_available?: null | boolean;
      declared_evidence_maturity?: {
        source: null | string;
        value: null | string;
      };
      device?: null | {
        configurations: Array<string>;
        confinement_family: string;
        device_family: string;
        implemented_capabilities: number;
      };
      family?: string;
      function?: string;
      kind: string;
      licence: string;
      listed_by: string;
      maturity?:
        | string
        | {
            source: null | string;
            value: null | string;
          };
      name: string;
      owning_groups: Array<string>;
      packages?: Array<{
        index: string;
        published: boolean;
      }>;
      primary_group: null | string;
      status: string;
      status_source?: {
        date: string;
        where: string;
      };
      version?:
        | string
        | {
            source: null | string;
            value: null | string;
          };
    };
    repository_visibility_reported: null | string;
    source_record_date: string;
    source_reported_public_url: null | string;
    state: string;
  }>;
  source_date: string;
  source_document: string;
  source_rows: number;
  source_sha256: string;
  state: string;
};

/** Owned illustrations and their representation limits. */
export type VisualData = {
  illustrations: Array<{
    asset: string;
    asset_sha256: string;
    author: string;
    description: string;
    downloads: Array<{
      label: string;
      path: string;
    }>;
    id: string;
    licence: string;
    limits: Array<string>;
    profile: string;
    project: string;
    representation: string;
    representation_label: string;
    review: {
      fingerprint: string;
      independent: boolean;
      scope: string;
      summary: string;
    };
    source_version: string;
    title: string;
  }>;
  new_scientific_or_model_execution: boolean;
  project_nodes_added: boolean;
  source_reviews_independent: boolean;
  source_snapshot_date: string;
  state: string;
  updated_at_utc: string;
  version: string;
};

/** Direct repository observations and source provenance. */
export type DirectData = {
  captured_at_utc: string;
  changed_after_read: Array<never>;
  entries_with_documents: number;
  project_entries: number;
  projects: Array<{
    architecture_documents: Array<{
      document: string;
      sections: Array<{
        excerpt: string;
        excerpt_truncated: boolean;
        heading: string;
      }>;
      sha256: string;
    }>;
    boundary_declarations: {
      active_configuration_id?: null;
      boundary?: string;
      category?: string;
      evidence_maturity?: string;
      project_id?: string;
      proposed_configuration_id?: null | string;
      public_capabilities?: Array<never>;
      public_claims?: Array<never>;
      registry_state?: string;
    };
    declared_package_metadata: {
      "Cargo.toml"?: {
        description?: string;
        name: string;
        version: string;
      };
      "pyproject.toml"?: {
        declared_scripts?: {
          "anulum-correspondence"?: string;
          "director-ai"?: string;
          "director-ai-cloud"?: string;
          "director-class-ai-act-evidence"?: string;
          "director-class-approve"?: string;
          "director-class-attest"?: string;
          "director-class-guard"?: string;
          "director-class-halt-sidecar"?: string;
          "director-class-mcp-gateway"?: string;
          "director-class-mcp-scan"?: string;
          "director-class-policy"?: string;
          "director-class-siem-export"?: string;
          emt?: string;
          "install-differentiable-framework-overlay"?: string;
          "loop-timing-witness-analyze"?: string;
          "mitigation-witness"?: string;
          remanentia?: string;
          "remanentia-benchmark-manifest"?: string;
          "remanentia-benchmark-report"?: string;
          "remanentia-claim-schema"?: string;
          "remanentia-efficiency-frontier"?: string;
          "remanentia-feed-ingest"?: string;
          "remanentia-full-s-diagnostics"?: string;
          "remanentia-portal"?: string;
          "remanentia-portal-admin"?: string;
          "remanentia-portal-mail"?: string;
          "remanentia-provenance-export"?: string;
          "remanentia-public-projection"?: string;
          "remanentia-recall-calibration"?: string;
          "remanentia-scorecard"?: string;
          "remanentia-snn-cue-materializer"?: string;
          "remanentia-snn-memory"?: string;
          "remanentia-snn-source-universe"?: string;
          "remanentia-store-manifest"?: string;
          "remanentia-store-sources"?: string;
          "remanentia-write-discipline"?: string;
          rigor?: string;
          "sc-neurocore"?: string;
          "sc-neurocore-if-benchmark"?: string;
          scpn?: string;
          "scpn-bench"?: string;
          "scpn-biological-qec-report"?: string;
          "scpn-control"?: string;
          "scpn-dashboard"?: string;
          "scpn-emit-studio-manifest"?: string;
          "scpn-fusion"?: string;
          "scpn-generate-hardware-pack-evidence"?: string;
          "scpn-meta"?: string;
          "scpn-mif"?: string;
          "scpn-provider-certification"?: string;
          "scpn-provider-smoke"?: string;
          "scpn-studio-run"?: string;
          "scpn-studio-workflow"?: string;
          "scpn-verify-hardware-packs"?: string;
          spo?: string;
          syn?: string;
          "syn-ack"?: string;
          "syn-ask"?: string;
          "syn-board"?: string;
          "syn-commit"?: string;
          "syn-inbox"?: string;
          "syn-locks"?: string;
          "syn-name"?: string;
          "syn-reap"?: string;
          "syn-say"?: string;
          "syn-wait"?: string;
          synapse?: string;
          "synapse-channel"?: string;
          "synapse-fleet"?: string;
        };
        description: string;
        name: string;
        "requires-python": string;
        version?: string;
      };
    };
    documents: Array<{
      bytes: number;
      label: string;
      sha256: string;
      static_parse_state?: string;
      static_top_level_declarations?: Array<{
        kind: string;
        line: number;
        name: string;
      }>;
    }>;
    git_marker_present: boolean;
    identity_basis: string;
    lookup_state: string;
    project_id: string;
    readme_excerpts: Array<string>;
  }>;
  read_scope: string;
  source_documents_captured: number;
  state: string;
  version: string;
};

/** One source project or programme entry. */
export type AtlasNode = AtlasData["nodes"][number];

/** A directed relationship retaining its source evidence layer. */
export type AtlasEdge = AtlasData["edges"][number];

/** Programme identity and navigation colour. */
export type AtlasGroup = AtlasData["groups"][number];

/** Inputs, outputs, components and bounded claims for one project. */
export type TechnicalGuide = TechnicalData["guides"][number];

/** An owning-group material or capability need. */
export type ResourceNeed = ResourceData["needs"][number];

/** A candidate alternative with its own verification state. */
export type ResourceCandidate = ResourceData["candidates"][number];

/** A preliminary people or space estimate retaining original values. */
export type ResourceEstimate = ResourceData["planning_estimates"][number];

/** An owning-group partner gap, proposed scope and first step. */
export type BudgetPartner = BudgetData["partner_slots"][number];

/** Shared resource proposal without inferring availability. */
export type BudgetShared = BudgetData["shared"][number];

/** One captured repository-document reading projection. */
export type SourceDocument =
  DocumentData["projects"][number]["documents"][number];

/** Source paragraph used in purpose, component, interface and limitation sections. */
export type ExplanationRecord = {
  text: string;
  references: string[];
  title?: string;
  project_id?: string;
};
/** Common reading projection with optional original-source labels and state. */
export type ReadingDocument = SourceDocument & {
  source_label?: string;
  source_state?: string;
  captured_at_utc?: string;
};
