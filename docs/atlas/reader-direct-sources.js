// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Direct repository document and static source context

import {
  requireRecord,
  link as R_link,
  el,
  facts,
  disclosure,
  list,
} from "@atlas/reader-core";
import {
  documentHref as R_documentHref,
  documentProjects as R_documentProjects,
} from "@atlas/reader-documents";

/** @type {import('../../types/atlas.js').DirectData} */
const data = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (
      document.getElementById("direct-source-data")
    ).textContent
  ),
);
const records = new Map(data.projects.map((row) => [row.project_id, row]));

/**
 * Display captured documents, source excerpts and static declarations without claiming runtime acceptance.
 * @param {import('../../types/atlas.js').AtlasNode} node - Atlas entry linked to its captured source context.
 * @returns {HTMLElement} Detached source-context panel.
 */
function directSourcePanel(node) {
  const row = requireRecord(records.get(node.id)),
    root = el("section", undefined, "passport-section direct-source-panel");
  root.dataset.directSource = node.id;
  root.append(
    el("h2", "Direct repository source context"),
    el("p", data.state, "notice"),
    facts([
      ["Capture time (UTC)", data.captured_at_utc],
      ["Source lookup", row.lookup_state],
    ]),
    el("p", data.read_scope, "caption"),
  );
  if (!row.documents.length) {
    root.append(
      el(
        "p",
        "This bounded lookup supplies no selected repository document for the entry. It may be a package component, shared instrument or programme record with sources elsewhere. The existing dossier remains available.",
        "missing",
      ),
    );
    return root;
  }
  root.append(
    R_link(
      "Read the complete dated documentation →",
      R_documentHref(node.id),
      "brief-link",
    ),
  );
  for (const [file, metadata] of Object.entries(row.declared_package_metadata))
    root.append(
      disclosure("Declared package metadata · " + file, [
        el("pre", JSON.stringify(metadata, null, 2), "source-excerpt"),
      ]),
    );
  if (Object.keys(row.boundary_declarations).length)
    root.append(
      disclosure("Machine-readable boundary declarations", [
        el(
          "pre",
          JSON.stringify(row.boundary_declarations, null, 2),
          "source-excerpt",
        ),
      ]),
    );
  if (row.readme_excerpts.length)
    root.append(
      disclosure(
        "README excerpts from the dated capture",
        row.readme_excerpts.map((text) => el("p", text, "preserve-lines")),
      ),
    );
  for (const document of row.architecture_documents) {
    const sections = document.sections.map((section) =>
      disclosure(section.heading, [
        el("pre", section.excerpt, "source-excerpt"),
        ...(section.excerpt_truncated
          ? [
              el(
                "p",
                "Selected excerpt is truncated. The complete original is retained in the private source intake; this is not a complete specification or an acceptance verdict.",
                "caption",
              ),
            ]
          : []),
      ]),
    );
    root.append(
      disclosure(
        "Architecture source sections · " + document.document,
        sections,
      ),
    );
  }
  const files = row.documents.map((document) => {
    const box = el("div"),
      title = el("p");
    if (
      requireRecord(R_documentProjects.get(node.id)).documents.some(
        (item) => item.label === document.label,
      )
    )
      title.append(
        R_link(document.label, R_documentHref(node.id, document.label)),
      );
    else title.append(document.label);
    title.append(" · " + document.bytes + " bytes");
    box.append(title, el("p", document.sha256, "fingerprint"));
    if (document.static_top_level_declarations?.length)
      box.append(
        el(
          "p",
          "Static top-level source declarations; no execution or installed API acceptance inferred.",
          "caption",
        ),
        list(
          document.static_top_level_declarations.map(
            (item) => item.kind + " " + item.name + " · line " + item.line,
          ),
        ),
      );
    if (document.static_parse_state)
      box.append(el("p", document.static_parse_state, "caption"));
    return box;
  });
  root.append(
    disclosure(
      "Captured document and entry-source fingerprints · " +
        row.documents.length,
      files,
    ),
    el(
      "p",
      "Direct file presence and source declarations do not prove operational, scientific, native, hardware, release or public acceptance. Source-content reconciliation remains pending.",
      "caption",
    ),
  );
  return root;
}

export { directSourcePanel, records as directSourceRecords };
