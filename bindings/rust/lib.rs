//! This crate provides Asn1 language support for the [tree-sitter] parsing library.
//!
//! Typically, you will use the [`LANGUAGE`] constant to add this language to a
//! tree-sitter [`Parser`], and then use the parser to parse some code:
//!
//! ```
//! let code = r#"
//! "#;
//! let mut parser = tree_sitter::Parser::new();
//! let language = tree_sitter_asn1::LANGUAGE;
//! parser
//!     .set_language(&language.into())
//!     .expect("Error loading ASN.1 parser");
//! let tree = parser.parse(code, None).unwrap();
//! assert!(!tree.root_node().has_error());
//! ```
//!
//! [`Parser`]: https://docs.rs/tree-sitter/0.25.5/tree_sitter/struct.Parser.html
//! [tree-sitter]: https://tree-sitter.github.io/

use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_asn1() -> *const ();
}

/// The tree-sitter [`LanguageFn`] for this grammar.
pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_asn1) };

/// The content of the [`node-types.json`] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types
pub const NODE_TYPES: &str = include_str!("../../src/node-types.json");

// NOTE: uncomment these to include any queries that this grammar contains:

// pub const HIGHLIGHTS_QUERY: &str = include_str!("../../queries/highlights.scm");
// pub const INJECTIONS_QUERY: &str = include_str!("../../queries/injections.scm");
// pub const LOCALS_QUERY: &str = include_str!("../../queries/locals.scm");
// pub const TAGS_QUERY: &str = include_str!("../../queries/tags.scm");

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;

    fn fixtures_dir() -> PathBuf {
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("test/asn1")
    }

    fn asn1_fixtures() -> Vec<PathBuf> {
        let mut files: Vec<PathBuf> = fs::read_dir(fixtures_dir())
            .expect("test/asn1 should exist")
            .filter_map(|entry| entry.ok().map(|e| e.path()))
            .filter(|path| {
                matches!(
                    path.extension().and_then(|ext| ext.to_str()),
                    Some("asn1") | Some("asn")
                )
            })
            .collect();
        files.sort();
        files
    }

    fn collect_parse_problems(node: tree_sitter::Node, problems: &mut Vec<String>) {
        if node.is_error() || node.is_missing() {
            let start = node.start_position();
            let label = if node.is_missing() {
                format!("MISSING {}", node.kind())
            } else {
                "ERROR".to_string()
            };
            problems.push(format!(
                "{} at {}:{}",
                label,
                start.row + 1,
                start.column + 1
            ));
            return;
        }

        let mut cursor = node.walk();
        for child in node.children(&mut cursor) {
            collect_parse_problems(child, problems);
        }
    }

    #[test]
    fn test_can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE.into())
            .expect("Error loading ASN.1 parser");
    }

    #[test]
    fn test_asn1_fixtures_parse_without_errors() {
        let dir = fixtures_dir();
        if !dir.is_dir() {
            // Fixture modules live in the git repo, not the published crate.
            return;
        }

        let files = asn1_fixtures();
        assert!(
            !files.is_empty(),
            "expected at least one .asn or .asn1 file in test/asn1"
        );

        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE.into())
            .expect("Error loading ASN.1 parser");

        let mut failures = Vec::new();
        for path in files {
            let source = fs::read_to_string(&path)
                .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));
            let tree = parser.parse(&source, None).expect("parser returned None");
            let mut problems = Vec::new();
            collect_parse_problems(tree.root_node(), &mut problems);
            if !problems.is_empty() {
                failures.push(format!(
                    "{}:\n  {}",
                    path.file_name().unwrap().to_string_lossy(),
                    problems.join("\n  ")
                ));
            }
        }

        assert!(
            failures.is_empty(),
            "{} ASN.1 fixture(s) parsed with errors:\n{}",
            failures.len(),
            failures.join("\n")
        );
    }
}
