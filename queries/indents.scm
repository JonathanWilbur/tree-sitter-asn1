; Brace-delimited types and information-object syntax. Single-line nodes are a no-op.
(ModuleIdentifier) @indent.zero
[
  (Assignment)
  (Imports)
  (Exports)
] @indent.zero

[
  (SequenceType)
  (SetType)
  (ChoiceType)
  (EnumeratedType)
  (ObjectClassDefn)
  (DefaultSyntax)
  (DefinedSyntax)
  (ExtensionAdditionGroup)
  (ObjectSet)
  (ValueSet)
  (SequenceValue)
  (SetValue)
  (SequenceOfValue)
  (SetOfValue)
  (ObjectIdentifierValue)
  (DefinitiveOID)
  (ParameterList)
  (ActualParameterList)
  (FullSpecification)
  (Constraint)
] @indent.begin

; Only the named-list forms, not bare INTEGER / BIT STRING.
(IntegerType
  (NamedNumberList)) @indent.begin

(BitStringType
  (NamedBitList)) @indent.begin

; WITH SYNTAX sits at the CLASS indent, not inside the field list.
(ObjectClassDefn
  (WithSyntaxSpec) @indent.branch @indent.dedent)

; FROM-module lines hang one step under the imported symbols.
(SymbolList) @indent.begin

; Branch/outdent only when the closer is first on the line.
[
  "}"
  "]"
  "]]"
] @indent.branch

[
  (line_comment)
  (block_comment)
] @indent.auto
