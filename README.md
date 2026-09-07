# Tree Sitter Grammar for ASN.1

This is a complete and working ASN.1 grammar for
[tree-sitter](https://tree-sitter.github.io/tree-sitter/). It is based off of
the BNF provided in the ITU-T Recommendations X.680 through X.683.

It fully supports parameterization, XML values, information objects, defined
syntax, encoding control notation (ECN), etc.

The queries `highlights.scm` and `folds.scm` works with `nvim-treesitter` to
provide highlighting and folding. Indents are currently experimental with
`nvim-treesitter`, and didn't work quite right from my experience, and I don't
think `textobjects.scm` is really used anywhere.

## Building and testing

Install Node.js dependencies (this also compiles the Node addon):

```sh
npm install
```

After changing `grammar.js` (or `src/scanner.c`), regenerate the parser and
rebuild the Node addon. `tree-sitter test` uses the CLI parser; the Node tests
in `bindings/node` load `build/Release/tree_sitter_asn1_binding.node`, which is
not updated by `tree-sitter generate` alone.

```sh
npx tree-sitter generate
npx node-gyp rebuild
```

There are three overlapping test entry points:

| Command | What it runs |
| --- | --- |
| `npx tree-sitter test` | Corpus only: each example in `test/corpus` must parse to the expected syntax tree. |
| `make test` | Corpus, then `tree-sitter parse --quiet --stat` on every `test/asn1/*.asn1` and `*.asn` file (must parse with no errors; trees are not checked). Uses `tree-sitter` from `PATH`, or `TS=...`. |
| `npm test` | Corpus, then the Node tests in `bindings/node/*_test.js`: load the native addon, a few CST assertions, and the same `test/asn1` fixtures parsed through Node. |

`make test` and `npx tree-sitter test` both use the CLI parser. `npm test` uses that CLI for the corpus, then the Node addon for everything else, so regenerate **and** `npx node-gyp rebuild` after grammar changes before relying on `npm test`.

CMake’s `ts-test` target matches `make test`. Other language bindings have their own tests (`cargo test`, `go test`, and so on).

The playground is `npm start` (`tree-sitter build --wasm` then
`tree-sitter playground`).

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

## Releasing a new Version

Run

```bash
# Set the version
npx tree-sitter version $DESIRED_VERSION
# Re-generate the C files, because the version number is incorporate into them.
npx tree-sitter generate
# Apparently needed for the Rust crate to publish
cargo update
```

## Publishing to Various Package Repositories

- [x] ~~Maven Central~~ (I would have to create the bindings myself, and I have not used Java in 10 years.)
- [x] ~~`jsr.io`~~ The NodeJS bindings currently use CommonJS, but JSR requires ESM.
- [x] NPM
- [x] PyPI
- [x] Crates
