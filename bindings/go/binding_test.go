package tree_sitter_asn1_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_asn1 "github.com/jonathanwilbur/tree-sitter-asn1/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_asn1.Language())
	if language == nil {
		t.Errorf("Error loading ASN.1 grammar")
	}
}
