# Tree Sitter Grammar for ASN.1

Work in progress, but almost done.

## Why did you have to include an external parser?

This custom parser exists to deal with a very specific issue. If the
`AssignedIdentifier` is not used in the `GlobalModuleReference` production, and
the `GlobalModuleReference` production is followed by another
`SymbolsFromModule` production that starts with an imported symbol that starts
with a lowercased letter, said symbol may be interpreted as the `DefinedValue`
alternative of the `AssignedIdentifier` production. Then the parser would read a
comma or FROM after the symbol and fail, because it expected another symbol.

The solution to this is to read ahead and check if the next non-whitespace token
is a comma or `FROM`. If either of these cases are true, we know that we just
read a symbol from the subsequent `SymbolsFromModule` production rather than a
`DefinedValue` for the `AssignedIdentifier` production.

## To Do

- [ ] Encoding Control Notation
- [ ] Line comments
- [ ] Clean up conflicts
- [ ] Tests
- [ ] Documentation
