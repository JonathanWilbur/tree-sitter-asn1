import XCTest
import SwiftTreeSitter
import TreeSitterAsn1

final class TreeSitterAsn1Tests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_asn1())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading ASN.1 grammar")
    }
}
