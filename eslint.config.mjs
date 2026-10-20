// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Browser and validation JavaScript checks

import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import noUnsanitized from "eslint-plugin-no-unsanitized";

/** Browser globals used by the static reader; Node globals are confined to tests. */
const browser = Object.fromEntries(
  [
    "window",
    "document",
    "location",
    "history",
    "navigator",
    "console",
    "URL",
    "URLSearchParams",
    "Blob",
    "ResizeObserver",
    "requestAnimationFrame",
    "setTimeout",
    "clearTimeout",
    "fetch",
    "HTMLElement",
    "SVGElement",
    "TextEncoder",
    "crypto",
    "performance",
    "atob",
    "DOMPoint",
  ].map((name) => [name, "readonly"]),
);

export default [
  { ignores: ["node_modules/**", "coverage/**"] },
  js.configs.recommended,
  jsdoc.configs["flat/recommended-typescript-flavor-error"],
  {
    files: ["docs/atlas/*.js", "tests/*.mjs", "tools/*.mjs", "*.config.mjs"],
    plugins: { "no-unsanitized": noUnsanitized },
    rules: {
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error",
      "no-eval": "error",
      "no-new-func": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",
    },
  },
  {
    files: ["docs/atlas/*.js"],
    languageOptions: { globals: browser },
    rules: {
      eqeqeq: ["error", "always"],
      "no-throw-literal": "error",
      "prefer-const": "error",
      "jsdoc/require-description": "error",
    },
  },
  {
    files: ["tests/*.mjs", "tools/*.mjs", "*.config.mjs"],
    languageOptions: {
      globals: {
        ...browser,
        innerWidth: "readonly",
        process: "readonly",
        Buffer: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
      },
    },
  },
];
