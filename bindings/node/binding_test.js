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

test("XML typed value accepts module-qualified NonParameterizedTypeName", () => {
  const parser = new Parser();
  parser.setLanguage(require("."));
  const tree = parser.parse(`Mod DEFINITIONS ::= BEGIN
v ::= <Other.Thing/>
END`);

  function find(node, type) {
    if (node.type === type) return node;
    for (const child of node.children) {
      const found = find(child, type);
      if (found) return found;
    }
    return null;
  }

  const name = find(tree.rootNode, "NonParameterizedTypeName");
  assert.ok(name, "expected NonParameterizedTypeName");
  assert.equal(name.childCount, 3);
  assert.equal(name.child(0).type, "modulereference");
  assert.equal(name.child(0).text, "Other");
  assert.equal(name.child(2).type, "typereference");
  assert.equal(name.child(2).text, "Thing");
});

test("XML OID values accept number forms and name-and-number forms", () => {
  const parser = new Parser();
  parser.setLanguage(require("."));

  function find(node, type) {
    if (node.type === type) return node;
    for (const child of node.children) {
      const found = find(child, type);
      if (found) return found;
    }
    return null;
  }

  const numeric = parser.parse(`Mod DEFINITIONS ::= BEGIN
oid ::= <OID>1.2.840</OID>
END`);
  assert.ok(
    find(numeric.rootNode, "XMLObjectIdentifierValue"),
    "expected XMLObjectIdentifierValue for 1.2.840",
  );

  const mixed = parser.parse(`Mod DEFINITIONS ::= BEGIN
oid ::= <OID>iso(1).2.840</OID>
END`);
  const oid = find(mixed.rootNode, "XMLObjectIdentifierValue");
  assert.ok(oid, "expected XMLObjectIdentifierValue for iso(1).2.840");
  assert.ok(find(oid, "XMLNameAndNumberForm"), "expected XMLNameAndNumberForm");
  assert.ok(find(oid, "XMLNumberForm"), "expected XMLNumberForm arcs");
});

