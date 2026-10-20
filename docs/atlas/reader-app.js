// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Explorer routing and page focus

import { comparisonView as R_comparisonView } from "@atlas/reader-compare";
import { mapLifecycle as R_mapLifecycle } from "@atlas/reader-core";
import { coverageView as R_coverageView } from "@atlas/reader-coverage";
import { documentsView as R_documentsView } from "@atlas/reader-documents";
import { semanticMap as R_semanticMap } from "@atlas/reader-map";
import { passport as R_passport } from "@atlas/reader-passport";
import { resourceView as R_resourceView } from "@atlas/reader-resources";
import { sourceUpdateIndex as R_sourceUpdateIndex } from "@atlas/reader-source-updates";
import { supportBrief as R_supportBrief } from "@atlas/reader-support";
import {
  technicalSourceView as R_technicalSourceView,
  technicalView as R_technicalView,
} from "@atlas/reader-technical";
import {
  group as R_group,
  guidedPaths as R_guidedPaths,
  history as R_history,
  overview as R_overview,
  searchView as R_searchView,
  unknown as R_unknown,
} from "@atlas/reader-views";
import { visualIndex as R_visualIndex } from "@atlas/reader-visuals";

/** @type {HTMLAnchorElement} */ (
  document.querySelector(".skip-link")
).addEventListener("click", (event) => {
  event.preventDefault();
  const main = /** @type {HTMLElement} */ (document.getElementById("main"));
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: "start" });
});
/**
 * Reconstruct the public route, its current navigation state and native reading focus.
 * @param {boolean} [initial] - First load preserves the browser’s initial focus.
 * @returns {void} The old map observer is released before replacing its content.
 */
function render(initial = false) {
  if (R_mapLifecycle.cleanup) {
    R_mapLifecycle.cleanup();
    R_mapLifecycle.cleanup = null;
  }
  const params = new URLSearchParams(location.hash.slice(1));
  const view = params.get("view") || "overview";
  document.body.classList.toggle("support-view", view === "support");
  if (view === "map") R_semanticMap(params);
  else if (view === "coverage") R_coverageView(params);
  else if (view === "documents") R_documentsView(params);
  else if (view === "compare") R_comparisonView(params);
  else if (view === "technical") R_technicalView(params);
  else if (view === "technical-source") R_technicalSourceView(params);
  else if (view === "support") R_supportBrief(params.get("entry") || "");
  else if (params.has("project")) R_passport(params.get("project") || "");
  else if (params.has("group")) R_group(params.get("group") || "");
  else if (view === "overview") R_overview();
  else if (view === "guides") R_guidedPaths();
  else if (view === "partners" || view === "search")
    R_searchView(
      view === "partners",
      params.get("scope") || "",
      params.get("q") || "",
    );
  else if (view === "resources") R_resourceView(params.get("resource") || "");
  else if (view === "history") R_history();
  else if (view === "source-updates") R_sourceUpdateIndex();
  else if (view === "visuals") R_visualIndex(params);
  else R_unknown();
  for (const item of /** @type {NodeListOf<HTMLElement>} */ (
    document.querySelectorAll("[data-view]")
  )) {
    if (
      (view === "map" || (!params.has("project") && !params.has("group"))) &&
      item.dataset.view === view
    )
      item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }
  const title =
    document.querySelector("#content h1")?.textContent || "Research programme";
  document.title = title + " · ANULUM";
  if (!initial) {
    /** @type {HTMLElement} */ (document.getElementById("main")).focus({
      preventScroll: true,
    });
    window.scrollTo(0, 0);
  }
  if (params.get("section") === "figures")
    requestAnimationFrame(() =>
      document.getElementById("figures")?.scrollIntoView({ block: "start" }),
    );
}
window.addEventListener("hashchange", () => render(false));
render(true);
