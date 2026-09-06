const assert = require("node:assert");
const { test } = require("node:test");

const Parser = require("tree-sitter");

test("can load grammar", () => {
  const parser = new Parser();
  assert.doesNotThrow(() => parser.setLanguage(require(".")));
});

test("ObjectSetAssignment names use objectsetreference", () => {
  const parser = new Parser();
  parser.setLanguage(require("."));
  const tree = parser.parse(`Mod DEFINITIONS ::= BEGIN
MySet TYPE-IDENTIFIER ::= { { &id { 1 2 3 }, &Type INTEGER } }
END`);

  function find(node, type) {
    if (node.type === type) return node;
    for (const child of node.children) {
      const found = find(child, type);
      if (found) return found;
    }
    return null;
  }

  const assignment = find(tree.rootNode, "ObjectSetAssignment");
  assert.ok(assignment, "expected ObjectSetAssignment");
  const name = assignment.child(0);
  assert.equal(name.type, "objectsetreference");
  assert.equal(name.text, "MySet");
});
