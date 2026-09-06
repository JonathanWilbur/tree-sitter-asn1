; Assignments are the main definition unit. `.inner`/`.outer` is
; nvim-treesitter-textobjects; `.inside`/`.around` is Helix/Zed.

(Assignment) @function.outer @function.around @statement.outer

(TypeAssignment
  (Type) @function.inner @function.inside @assignment.inner @assignment.rhs) @assignment.outer @assignment.around

(ValueAssignment
  (Value) @function.inner @function.inside @assignment.inner @assignment.rhs) @assignment.outer @assignment.around

(ObjectClassAssignment
  (ObjectClass) @function.inner @function.inside @assignment.inner @assignment.rhs) @assignment.outer @assignment.around

(ObjectAssignment
  (Object) @function.inner @function.inside @assignment.inner @assignment.rhs) @assignment.outer @assignment.around

(ObjectSetAssignment
  (ObjectSet) @function.inner @function.inside @assignment.inner @assignment.rhs) @assignment.outer @assignment.around

(ValueSetTypeAssignment
  (ValueSet) @function.inner @function.inside @assignment.inner @assignment.rhs) @assignment.outer @assignment.around

(XMLValueAssignment
  (XMLTypedValue) @function.inner @function.inside @assignment.inner @assignment.rhs) @assignment.outer @assignment.around

; Structured types and modules behave like "class" textobjects.

(ModuleDefinition) @class.outer @class.around

(ModuleDefinition
  (ModuleBody) @class.inner @class.inside)

(ObjectClassDefn) @class.outer @class.around @block.outer @block.around

(SequenceType) @class.outer @class.around @block.outer @block.around

(SequenceType
  (ComponentTypeLists) @class.inner @class.inside @block.inner @block.inside)

(SetType) @class.outer @class.around @block.outer @block.around

(SetType
  (ComponentTypeLists) @class.inner @class.inside @block.inner @block.inside)

(ChoiceType) @class.outer @class.around @block.outer @block.around

(ChoiceType
  (AlternativeTypeLists) @class.inner @class.inside @block.inner @block.inside)

(EnumeratedType) @class.outer @class.around @block.outer @block.around

(EnumeratedType
  (Enumerations) @class.inner @class.inside @block.inner @block.inside)

(IntegerType
  (NamedNumberList) @class.inner @class.inside @block.inner @block.inside) @class.outer @class.around @block.outer @block.around

(BitStringType
  (NamedBitList) @class.inner @class.inside @block.inner @block.inside) @class.outer @class.around @block.outer @block.around

(SyntaxList) @block.outer @block.around

(DefaultSyntax) @block.outer @block.around

(DefinedSyntax) @block.outer @block.around

; Comma-separated members: SEQUENCE/SET components, CHOICE alternatives,
; CLASS fields, named numbers/bits, enumerations, parameters, object fields.

(ComponentType) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(AlternativeTypeList
  (NamedType) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around)

(FieldSpec) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(NamedNumber) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(NamedBit) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(EnumerationItem) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(Parameter) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(FieldSetting) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(Symbol) @parameter.inner @parameter.outer @parameter.inside @parameter.around @entry.around

(Assignment) @entry.around

[
  (line_comment)
  (block_comment)
] @comment.inner @comment.outer @comment.inside @comment.around

(number) @number.inner @number.inside
