from unittest import TestCase

import tree_sitter
import tree_sitter_asn1


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_asn1.language())
        except Exception:
            self.fail("Error loading ASN.1 grammar")
