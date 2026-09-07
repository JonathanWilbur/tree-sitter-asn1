from pathlib import Path
from unittest import TestCase

from tree_sitter import Language, Parser
import tree_sitter_asn1

FIXTURES_DIR = Path(__file__).resolve().parents[3] / "test" / "asn1"


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            Parser(Language(tree_sitter_asn1.language()))
        except Exception:
            self.fail("Error loading ASN.1 grammar")

    def test_asn1_fixtures_parse_without_errors(self):
        parser = Parser(Language(tree_sitter_asn1.language()))
        files = sorted(
            [*FIXTURES_DIR.glob("*.asn1"), *FIXTURES_DIR.glob("*.asn")]
        )
        self.assertTrue(
            files,
            "expected at least one .asn or .asn1 file in test/asn1",
        )

        failures = []
        for path in files:
            tree = parser.parse(path.read_bytes())
            if tree.root_node.has_error:
                failures.append(path.name)

        self.assertEqual(
            failures,
            [],
            f"{len(failures)} ASN.1 fixture(s) parsed with errors: {', '.join(failures)}",
        )
