# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM — Static atlas import and custody tests

"""Exercise the real integrated atlas through its public import/check API."""

from __future__ import annotations

import hashlib
import json
import re
import tempfile
import unittest
from pathlib import Path

from tools import sync_atlas

ATLAS = Path(__file__).resolve().parents[1] / "docs" / "atlas"


class AtlasSyncTests(unittest.TestCase):
    """Check complete real exports and refusal without loss of local changes."""

    def test_complete_export_replay_and_local_edits(self) -> None:
        """Replay the actual export, then preserve an independently edited asset."""
        manifest = ATLAS / "atlas-manifest.json"
        pin = hashlib.sha256(manifest.read_bytes()).hexdigest()
        with tempfile.TemporaryDirectory(prefix="atlas-replay-") as directory:
            destination = Path(directory) / "atlas"
            sync_atlas.sync(ATLAS, manifest, pin, destination)
            files = sync_atlas.check(destination)
            self.assertEqual(files, sync_atlas.check(ATLAS))
            for name in files:
                self.assertEqual((destination / name).read_bytes(), (ATLAS / name).read_bytes())
            sync_atlas.sync(ATLAS, manifest, pin, destination)
            member = destination / "reader.css"
            changed = member.read_bytes() + b"\n/* Local design edit */\n"
            member.write_bytes(changed)
            with self.assertRaisesRegex(ValueError, "asset changed"):
                sync_atlas.sync(ATLAS, manifest, pin, destination)
            self.assertEqual(member.read_bytes(), changed)

    def test_source_publication_policy_refuses_before_destination_creation(self) -> None:
        """Refuse every outward carrier with public donor content and preserve the real export."""
        policy = json.loads((ATLAS.parents[1] / "tools/atlas_publication_policy.json").read_bytes())
        cases: list[tuple[str, bytes]] = []
        library_name = "document_library_candidate.json"
        for owner in ["QPU-RESULT-PACK", "SC-NC-CORE"]:
            data = json.loads((ATLAS / library_name).read_bytes())
            donor = next(row for row in data["projects"] if row["documents"])
            if owner == "QPU-RESULT-PACK":
                hidden = next(row for row in data["projects"] if row["project_id"] == owner)
                hidden["documents"] = donor["documents"]
            else:
                donor["project_id"] = owner
            cases.append((library_name, json.dumps(data).encode()))
        atlas = json.loads((ATLAS / "public_atlas_data.json").read_bytes())
        published = next(row for row in atlas["nodes"] if row["id"] == "SC-NEUROCORE")
        direct_name = "direct_repository_sources.json"
        for key in [
            "documents",
            "declared_package_metadata",
            "boundary_declarations",
            "readme_excerpts",
            "architecture_documents",
        ]:
            data = json.loads((ATLAS / direct_name).read_bytes())
            hidden = next(row for row in data["projects"] if row["project_id"] == "QPU-RESULT-PACK")
            if key == "boundary_declarations":
                hidden[key] = {"boundary": published["boundary"]}
            else:
                donor = next(row for row in data["projects"] if row[key])
                hidden[key] = donor[key]
            cases.append((direct_name, json.dumps(data).encode()))
        technical_name = "technical_explanations_candidate.json"
        for key in ["documents", "references", "guides", "guide_source_captures"]:
            data = json.loads((ATLAS / technical_name).read_bytes())
            owner = "QPU-RESULT-PACK"
            if key == "documents":
                hidden = next(row for row in data["library"]["projects"] if row["project_id"] == owner)
                donor = next(row for row in data["library"]["projects"] if row["documents"])
                hidden["documents"] = donor["documents"]
            elif key == "references":
                data["references"][0]["project"] = owner
            elif key == "guides":
                data["guides"][0]["project_id"] = owner
            else:
                data["guide_source_captures"][owner] = data["captured_at_utc"]
            cases.append((technical_name, json.dumps(data).encode()))
        for owner in ["ANULUM-CORRESPONDENCE", "QPU-RESULT-PACK", "SCPN-PHWR-CORE"]:
            data = json.loads((ATLAS / "public_atlas_data.json").read_bytes())
            hidden = next(row for row in data["nodes"] if row["id"] == owner)
            hidden["dossier"] = published["dossier"]
            cases.append(("public_atlas_data.json", json.dumps(data).encode()))
        edge = next(row for row in atlas["edges"] if row["from"] in policy["withheld_nodes"])
        edge["payload"] = published["function"]
        cases.append(("public_atlas_data.json", json.dumps(atlas).encode()))
        data = json.loads((ATLAS / "visual_catalogue.json").read_bytes())
        data["illustrations"][0]["project"] = "QPU-RESULT-PACK"
        cases.append(("visual_catalogue.json", json.dumps(data).encode()))
        data = json.loads((ATLAS / "source_update_candidate.json").read_bytes())
        data["projects"][0]["project_id"] = "QPU-RESULT-PACK"
        cases.append(("source_update_candidate.json", json.dumps(data).encode()))
        drawing = (ATLAS / "F4_funding_blocks_outcomes_v0.4.svg").read_bytes()
        for name in [*policy["withheld_assets"], "visuals/SC-NC-CORE.svg"]:
            cases.append((name, drawing))
        for extension in ["svg", "png", "pdf"]:
            cases.append(
                (
                    "F2_complete_project_atlas_v0.6." + extension,
                    (ATLAS / ("F4_funding_blocks_outcomes_v0.4." + extension)).read_bytes(),
                )
            )
        static = (ATLAS / "atlas_full.html").read_text()
        pattern = (
            r'(<g\b(?=[^>]*data-id="QPU-RESULT-PACK")[^>]*>[\s\S]*?)'
            r"<title[^>]*>[\s\S]*?</title>"
        )
        match = re.search(pattern, static)
        assert match is not None
        for replacement in ["<title>" + published["function"] + "</title>", ""]:
            changed = static[: match.start()] + match[1] + replacement + static[match.end() :]
            self.assertNotEqual(changed, static)
            cases.append(("atlas_full.html", changed.encode()))
        label_pattern = r'(<g\b(?=[^>]*data-id="QPU-RESULT-PACK")[^>]*?)aria-label="[^"]*"'
        for replacement in ['aria-label="unapproved contents"', ""]:
            changed = re.sub(label_pattern, r"\g<1>" + replacement, static, count=1)
            self.assertNotEqual(changed, static)
            cases.append(("atlas_full.html", changed.encode()))
        with tempfile.TemporaryDirectory(prefix="atlas-publication-") as directory:
            source = Path(directory) / "source"
            selected = source / "atlas-manifest.json"
            original_manifest = ATLAS / "atlas-manifest.json"
            sync_atlas.sync(
                ATLAS, original_manifest, hashlib.sha256(original_manifest.read_bytes()).hexdigest(), source
            )
            for index, (name, content) in enumerate(cases):
                with self.subTest(index=index, carrier=name):
                    target = source / name
                    original = target.read_bytes() if target.exists() else None
                    before = selected.read_bytes()
                    current = json.loads(before)
                    current["files"][name] = hashlib.sha256(content).hexdigest()
                    target.write_bytes(content)
                    selected.write_text(json.dumps(current))
                    destination = Path(directory) / "refused"
                    try:
                        with self.assertRaisesRegex(ValueError, "Repository-internal contents are not publishable"):
                            sync_atlas.sync(
                                source, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination
                            )
                        self.assertFalse(destination.exists())
                    finally:
                        if original is None:
                            target.unlink()
                        else:
                            target.write_bytes(original)
                        selected.write_bytes(before)
            self.assertEqual(sync_atlas.check(source), sync_atlas.check(ATLAS))

    def test_manifest_pin_refuses_before_destination_creation(self) -> None:
        """A mismatched selected manifest cannot create an integrated tree."""
        with tempfile.TemporaryDirectory(prefix="atlas-pin-") as directory:
            destination = Path(directory) / "atlas"
            with self.assertRaisesRegex(ValueError, "fingerprint mismatch"):
                sync_atlas.sync(ATLAS, ATLAS / "atlas-manifest.json", "0" * 64, destination)
            self.assertFalse(destination.exists())

    def test_traversal_refused_before_destination_creation(self) -> None:
        """A manifest cannot transport a parent path outside its selected export."""
        value = json.loads((ATLAS / "atlas-manifest.json").read_text())
        value["files"]["../outside.json"] = "0" * 64
        with tempfile.TemporaryDirectory(prefix="atlas-path-") as directory:
            manifest = Path(directory) / "manifest.json"
            manifest.write_text(json.dumps(value))
            destination = Path(directory) / "atlas"
            with self.assertRaisesRegex(ValueError, "Unsafe"):
                sync_atlas.sync(ATLAS, manifest, hashlib.sha256(manifest.read_bytes()).hexdigest(), destination)
            self.assertFalse(destination.exists())

    def test_unlisted_source_material_does_not_cross_import(self) -> None:
        """Only listed real assets transfer when other source material is nearby."""
        manifest = ATLAS / "atlas-manifest.json"
        with tempfile.TemporaryDirectory(prefix="atlas-selection-") as directory:
            source = Path(directory) / "source"
            destination = Path(directory) / "destination"
            sync_atlas.sync(ATLAS, manifest, hashlib.sha256(manifest.read_bytes()).hexdigest(), source)
            (source / "coordination-note.md").write_text("Internal work note, outside the export inventory.")
            selected = source / "atlas-manifest.json"
            sync_atlas.sync(source, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination)
            self.assertFalse((destination / "coordination-note.md").exists())
            self.assertEqual(sync_atlas.check(destination), sync_atlas.check(ATLAS))

    def test_embedded_dataset_correspondence_and_internal_path_boundary(self) -> None:
        """Hash-consistent imports still refuse divergent embedded data or local paths."""
        manifest = ATLAS / "atlas-manifest.json"
        with tempfile.TemporaryDirectory(prefix="atlas-boundary-") as directory:
            source = Path(directory) / "source"
            sync_atlas.sync(ATLAS, manifest, hashlib.sha256(manifest.read_bytes()).hexdigest(), source)
            selected = source / "atlas-manifest.json"
            metadata = json.loads(selected.read_text())
            asset = source / "index.html"
            original = asset.read_bytes()
            for content, diagnostic in [
                (original.replace(b'type="application/json"', b'type="application/other"', 1), "Embedded dataset"),
                (original + b"\n<!-- /home/anulum/confidential -->", "Internal path"),
                (original + b"\n<!-- CEO Codex -->", "Internal atlas attribution"),
                (original + b"\n<!-- P-001 -->", "Internal atlas attribution"),
                (original + b"\n<!-- KYMA earlier bases -->", "Internal atlas attribution"),
            ]:
                asset.write_bytes(content)
                metadata["files"]["index.html"] = hashlib.sha256(content).hexdigest()
                selected.write_text(json.dumps(metadata))
                destination = Path(directory) / "refused"
                with self.assertRaisesRegex(ValueError, diagnostic):
                    sync_atlas.sync(source, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination)
                self.assertFalse(destination.exists())

    def test_matching_embedded_data_cannot_admit_a_changed_source_passage(self) -> None:
        """Refuse a coherent asset inventory whose actual citation no longer matches."""
        manifest = ATLAS / "atlas-manifest.json"
        with tempfile.TemporaryDirectory(prefix="atlas-source-passage-") as directory:
            source = Path(directory) / "source"
            sync_atlas.sync(ATLAS, manifest, hashlib.sha256(manifest.read_bytes()).hexdigest(), source)
            metadata = json.loads((source / "atlas-manifest.json").read_text())
            dataset = source / "technical_explanations_candidate.json"
            data = json.loads(dataset.read_text())
            data["references"][0]["excerpt"] = "Unrecorded passage"
            dataset.write_text(json.dumps(data, ensure_ascii=False, indent=2))
            index = source / "index.html"
            payload = json.dumps(data, ensure_ascii=False).replace("<", chr(92) + "u003c")
            pattern = r'(<script id="technical-data" type="application/json">)(.*?)(</script>)'
            index.write_text(
                re.sub(pattern, lambda match: match[1] + payload + match[3], index.read_text(), flags=re.DOTALL)
            )
            for name in ["technical_explanations_candidate.json", "index.html"]:
                metadata["files"][name] = hashlib.sha256((source / name).read_bytes()).hexdigest()
            selected = source / "atlas-manifest.json"
            selected.write_text(json.dumps(metadata))
            destination = Path(directory) / "refused"
            with self.assertRaisesRegex(ValueError, "Technical reference excerpt differs"):
                sync_atlas.sync(source, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination)
            self.assertFalse(destination.exists())

    def test_unmanaged_destination_retained(self) -> None:
        """An occupied directory without an atlas manifest is never overwritten."""
        manifest = ATLAS / "atlas-manifest.json"
        with tempfile.TemporaryDirectory(prefix="atlas-ownership-") as directory:
            destination = Path(directory) / "atlas"
            destination.mkdir()
            note = destination / "README.md"
            note.write_text("Existing independent content.")
            with self.assertRaisesRegex(ValueError, "not empty"):
                sync_atlas.sync(ATLAS, manifest, hashlib.sha256(manifest.read_bytes()).hexdigest(), destination)
            self.assertEqual(note.read_text(), "Existing independent content.")

    def test_destination_and_source_symlinks_refused(self) -> None:
        """Refuse redirection into unrelated storage on either side of the import."""
        manifest = ATLAS / "atlas-manifest.json"
        pin = hashlib.sha256(manifest.read_bytes()).hexdigest()
        with tempfile.TemporaryDirectory(prefix="atlas-symlinks-") as directory:
            target = Path(directory) / "unrelated"
            target.mkdir()
            sentinel = target / "retained.txt"
            sentinel.write_text("Independent content.")
            alias = Path(directory) / "alias"
            alias.symlink_to(target, target_is_directory=True)
            with self.assertRaisesRegex(ValueError, "destination must not be a symlink"):
                sync_atlas.sync(ATLAS, manifest, pin, alias)
            self.assertEqual(sentinel.read_text(), "Independent content.")
            source = Path(directory) / "source"
            sync_atlas.sync(ATLAS, manifest, pin, source)
            selected = source / "atlas-manifest.json"
            member = source / "reader.css"
            member.unlink()
            member.symlink_to(ATLAS / "reader.css")
            destination = Path(directory) / "refused"
            with self.assertRaisesRegex(ValueError, "escapes its source tree"):
                sync_atlas.sync(source, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination)
            self.assertFalse(destination.exists())

    def test_asset_retirement_and_unlisted_local_content_require_reconciliation(self) -> None:
        """Keep retired assets and detect unexpected local material before an update."""
        manifest = ATLAS / "atlas-manifest.json"
        with tempfile.TemporaryDirectory(prefix="atlas-retirement-") as directory:
            destination = Path(directory) / "atlas"
            sync_atlas.sync(ATLAS, manifest, hashlib.sha256(manifest.read_bytes()).hexdigest(), destination)
            metadata = json.loads(manifest.read_text())
            name = next(name for name in metadata["files"] if name.endswith(".png"))
            original = (destination / name).read_bytes()
            del metadata["files"][name]
            selected = Path(directory) / "selected.json"
            selected.write_text(json.dumps(metadata))
            with self.assertRaisesRegex(ValueError, "removes assets"):
                sync_atlas.sync(ATLAS, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination)
            self.assertEqual((destination / name).read_bytes(), original)
            (destination / "unlisted-note.md").write_text("Unreviewed local content.")
            with self.assertRaisesRegex(ValueError, "unlisted files"):
                sync_atlas.check(destination)

    def test_snapshot_version_required_before_import(self) -> None:
        """A complete asset inventory still needs an explicit snapshot identity."""
        metadata = json.loads((ATLAS / "atlas-manifest.json").read_text())
        del metadata["version"]
        with tempfile.TemporaryDirectory(prefix="atlas-version-") as directory:
            selected = Path(directory) / "selected.json"
            selected.write_text(json.dumps(metadata))
            destination = Path(directory) / "atlas"
            with self.assertRaisesRegex(ValueError, "version missing"):
                sync_atlas.sync(ATLAS, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination)
            self.assertFalse(destination.exists())

    def test_ownership_projection_preserves_the_original_drawing(self) -> None:
        """Ship JSON ownership records and add SVG notices without changing geometry."""
        manifest = ATLAS / "atlas-manifest.json"
        with tempfile.TemporaryDirectory(prefix="atlas-ownership-") as directory:
            source = Path(directory) / "source"
            sync_atlas.sync(ATLAS, manifest, hashlib.sha256(manifest.read_bytes()).hexdigest(), source)
            selected = source / "atlas-manifest.json"
            metadata = json.loads(selected.read_text())
            catalogue = json.loads((source / "visual_catalogue.json").read_text())
            drawing = next(row["asset"] for row in catalogue["illustrations"] if row["asset"].endswith(".svg"))
            annotated = (source / drawing).read_bytes()
            geometry = annotated[annotated.index(b"<svg") :]
            old = hashlib.sha256(annotated).hexdigest()
            original = hashlib.sha256(geometry).hexdigest()
            (source / drawing).write_bytes(geometry)
            for name in ["visual_catalogue.json", "index.html"]:
                member = source / name
                member.write_bytes(member.read_bytes().replace(old.encode(), original.encode()))
                metadata["files"][name] = hashlib.sha256(member.read_bytes()).hexdigest()
            metadata["files"][drawing] = original
            metadata.pop("ownership_projections", None)
            metadata["files"] = {
                name: digest for name, digest in metadata["files"].items() if not name.endswith(".license")
            }
            selected.write_text(json.dumps(metadata))
            destination = Path(directory) / "atlas"
            sync_atlas.sync(source, selected, hashlib.sha256(selected.read_bytes()).hexdigest(), destination)
            rendered = (destination / drawing).read_bytes()
            self.assertTrue(rendered.endswith(geometry))
            self.assertIn(b"SPDX-License-Identifier: AGPL-3.0-or-later", rendered[:1000])
            files = sync_atlas.check(destination)
            for name in [*files, "atlas-manifest.json"]:
                if name.endswith(".json"):
                    sidecar = destination / (name + ".license")
                    self.assertTrue(sidecar.is_file())
                    self.assertIn("SPDX-FileCopyrightText: 1996-2026", sidecar.read_text())
                    self.assertIn("SPDX-FileCopyrightText: 2020-2026", sidecar.read_text())
            provenance = json.loads((destination / "atlas-manifest.json").read_text())["ownership_projections"]
            catalogue = json.loads((destination / "visual_catalogue.json").read_text())
            credit = next(row["author"] for row in catalogue["illustrations"] if row["asset"] == drawing)
            self.assertIn("Arcane Sapience", credit)
            self.assertNotRegex(credit, r"(?i)codex|claude|gpt-|session")
            self.assertEqual(provenance[drawing]["source_sha256"], original)
            self.assertEqual(provenance[drawing]["projection_sha256"], hashlib.sha256(rendered).hexdigest())


if __name__ == "__main__":
    unittest.main()
