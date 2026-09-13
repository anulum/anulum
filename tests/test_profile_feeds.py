# SPDX-License-Identifier: AGPL-3.0-or-later

import json
import sys
import unittest
from pathlib import Path
from typing import Any, ClassVar

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import profile_feeds as feeds  # noqa: E402
import render_publications as publications  # noqa: E402

FEED = b"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>t</title>
<item><title>Alpha v1.2.0 \xe2\x80\x94 Older change.</title><link>https://example.org/a/1.2.0</link>
<pubDate>Mon, 01 Sep 2026 00:00:00 +0000</pubDate></item>
<item><title>Beta 0.9 \xe2\x80\x94 Newer change with \xe2\x80\x9cquotes\xe2\x80\x9d.</title><link>https://example.org/b/0.9</link>
<pubDate>Sat, 05 Sep 2026 00:00:00 +0000</pubDate></item>
<item><title>Not a release item</title><link>https://example.org/x</link>
<pubDate>Sun, 06 Sep 2026 00:00:00 +0000</pubDate></item>
</channel></rss>"""


class FeedParsingTests(unittest.TestCase):
    def test_parse_feed_orders_newest_first_and_skips_non_release_titles(self) -> None:
        items = feeds.parse_feed(FEED, 5)
        self.assertEqual([item["project"] for item in items], ["Beta", "Alpha"])
        self.assertEqual(items[0]["version"], "0.9")
        self.assertEqual(items[0]["date"], "2026-09-05")
        self.assertEqual(items[1]["headline"], "Older change.")
        self.assertEqual(items[1]["link"], "https://example.org/a/1.2.0")

    def test_parse_feed_honours_the_limit(self) -> None:
        self.assertEqual(len(feeds.parse_feed(FEED, 1)), 1)

    def test_fetched_prose_is_made_table_safe(self) -> None:
        self.assertEqual(feeds.plain(" A \u2014 B | C "), "A - B / C")
        cache = {
            "fetched_at": "2026-09-13",
            "releases": [
                {"date": "2026-09-13", "project": "P", "version": "1", "link": "https://x", "headline": "x \u2014 y"}
            ],
            "zenodo": [{"type": "publication/preprint", "date": "2026-09-13", "title": "t \u2014 u", "doi": "10.1/z"}],
        }
        for name in feeds.BLOCKS:
            self.assertNotIn("\u2014", feeds.render_block(name, "README.md", cache, {}))

    def test_resource_labels(self) -> None:
        self.assertEqual(feeds.resource_label({"type": "publication/preprint"}), "Preprint")
        self.assertEqual(feeds.resource_label({"type": "publication/"}), "Publication")
        self.assertEqual(feeds.resource_label({"type": "software/"}), "Software archive")
        self.assertEqual(feeds.resource_label({"type": "other/thing"}), "other/thing")


class BlockReplacementTests(unittest.TestCase):
    def test_replace_block_replaces_the_whole_block_once(self) -> None:
        text = "a\n<!-- profile-feeds:releases:start -->\nold\n<!-- profile-feeds:releases:end -->\nb"
        out = feeds.replace_block(text, "releases", "new", "x")
        self.assertEqual(out, "a\n<!-- profile-feeds:releases:start -->\nnew\n<!-- profile-feeds:releases:end -->\nb")
        self.assertEqual(feeds.replace_block(out, "releases", "new", "x"), out)

    def test_replace_block_rejects_missing_or_duplicated_markers(self) -> None:
        with self.assertRaises(ValueError):
            feeds.replace_block("no markers", "releases", "new", "x")
        doubled = (
            "<!-- profile-feeds:releases:start -->\n<!-- profile-feeds:releases:end -->\n"
            "<!-- profile-feeds:releases:start -->\n<!-- profile-feeds:releases:end -->"
        )
        with self.assertRaises(ValueError):
            feeds.replace_block(doubled, "releases", "new", "x")

    def test_replace_verified_changes_only_marked_dates(self) -> None:
        text = "<!-- verified-at -->2026-09-03<!-- /verified-at --> and 2026-09-03 elsewhere"
        out = feeds.replace_verified(text, "2026-09-13", "x")
        self.assertEqual(out, "<!-- verified-at -->2026-09-13<!-- /verified-at --> and 2026-09-03 elsewhere")
        with self.assertRaises(ValueError):
            feeds.replace_verified("no marker", "2026-09-13", "x")


class CheckedInStateTests(unittest.TestCase):
    data: ClassVar[dict[str, Any]]
    cache: ClassVar[dict[str, Any]]

    @classmethod
    def setUpClass(cls) -> None:
        cls.data = json.loads((ROOT / "profile-data.json").read_text(encoding="utf-8"))
        cls.cache = json.loads(feeds.CACHE.read_text(encoding="utf-8"))

    def test_cache_shape(self) -> None:
        self.assertRegex(self.cache["fetched_at"], r"^\d{4}-\d{2}-\d{2}$")
        self.assertEqual(len(self.cache["releases"]), self.data["feeds"]["releases_shown"])
        self.assertGreater(len(self.cache["zenodo"]), 20)
        dates = [record["date"] for record in self.cache["zenodo"]]
        self.assertEqual(dates, sorted(dates, reverse=True))

    def test_readme_blocks_are_current_and_idempotent(self) -> None:
        rendered = feeds.render_readmes(self.data, self.cache)
        for path, text in rendered.items():
            self.assertEqual(path.read_text(encoding="utf-8"), text, path.name)
        self.assertEqual(feeds.render_readmes(self.data, self.cache), rendered)

    def test_every_readme_carries_each_block_once(self) -> None:
        for readme in self.data["translations"]:
            text = (ROOT / readme).read_text(encoding="utf-8")
            for name in feeds.BLOCKS:
                self.assertEqual(text.count(feeds.marker(name, "start")), 1, readme)
                self.assertEqual(text.count(feeds.marker(name, "end")), 1, readme)
                self.assertIn(f"### {feeds.HEADINGS[readme][name]}", text, readme)
            self.assertIn(f"<!-- verified-at -->{self.data['verified_at']}<!-- /verified-at -->", text, readme)

    def test_publications_page_is_current_and_lists_every_record(self) -> None:
        text = publications.render(self.data, self.cache)
        self.assertEqual((ROOT / "PUBLICATIONS.md").read_text(encoding="utf-8"), text)
        for record in self.cache["zenodo"]:
            self.assertIn(f"https://doi.org/{record['doi']}", text, record["doi"])
        self.assertIn(f"{len(self.cache['zenodo'])} records", text)

    def test_publications_render_rejects_records_without_a_project(self) -> None:
        mutated = json.loads(json.dumps(self.data))
        mutated["record_projects"].pop(str(self.cache["zenodo"][0]["id"]))
        with self.assertRaises(ValueError):
            publications.render(mutated, self.cache)


if __name__ == "__main__":
    unittest.main()
