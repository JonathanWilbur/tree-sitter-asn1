const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const Parser = require("tree-sitter");

const language = require(".");
const fixturesDir = path.join(__dirname, "..", "..", "test", "asn1");

function listAsn1Fixtures(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".asn1") || name.endsWith(".asn"))
    .sort();
}

function collectParseProblems(node, problems = []) {
  if (node.type === "ERROR" || node.isMissing()) {
    const { row, column } = node.startPosition;
    const label = node.isMissing() ? `MISSING ${node.type}` : "ERROR";
    problems.push(`${label} at ${row + 1}:${column + 1}`);
    return problems;
  }

  for (let i = 0; i < node.childCount; i++) {
    collectParseProblems(node.child(i), problems);
  }

  return problems;
}

const fixtures = listAsn1Fixtures(fixturesDir);

test("test/asn1 contains ASN.1 fixtures", () => {
  assert.ok(
    fs.existsSync(fixturesDir),
    `expected fixture directory ${fixturesDir}`,
  );
  assert.ok(
    fixtures.length > 0,
    "expected at least one .asn or .asn1 file in test/asn1",
  );
});

for (const file of fixtures) {
  test(`parses ${file} without errors`, () => {
    const parser = new Parser();
    parser.setLanguage(language);

    const source = fs.readFileSync(path.join(fixturesDir, file), "utf8");
    const tree = parser.parse(source);
    const problems = collectParseProblems(tree.rootNode);

    assert.equal(
      problems.length,
      0,
      `${file} parsed with errors:\n  ${problems.join("\n  ")}`,
    );
  });
}
