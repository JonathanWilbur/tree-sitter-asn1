/**
 * @file Abstract Syntax Notation
 * @author Jonathan M. Wilbur <jonathan@wilbur.space>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "asn1",

  word: $ => $.yellcased_identifier,

  // TODO: Is this going to slow down the parser a lot or cause errors?
  conflicts: $ => [
    [$.UsefulType, $.DefinedType],
    [$.SimpleDefinedType, $.objectsetreference],
    [$.ParameterizedValueSetType, $.ParameterizedType],
    [$.objectsetreference, $.ExternalTypeReference],
    [$.objectsetreference, $.DefinedType, $.UsefulType],
    [$.objectsetreference, $.DefinedType, $.SimpleDefinedType, $.UsefulType],
    [$.NameForm, $.objectreference],
    // [$.BitStringValue, $.SequenceValue, $.SequenceOfValue, $.SetValue, $.SetOfValue, $.DefaultSyntax, $.DefinedSyntax],
    [$.BitStringValue, $.SequenceValue, $.SequenceOfValue, $.SetValue, $.SetOfValue],
    [$.ObjIdComponents, $.SignedNumber],
    [$.ObjIdComponents, $.SignedNumber, $.NumberForm],
    // [$.TableColumn, $.TableRow, $.Group, $.Plane, $.Row, $.Cell],
    [$.SignedNumber, $.Group, $.TableColumn],
    // [$.SignedNumber, $.Group, $.TableColumn, $.Plane],
    // [$.SignedNumber, $.Group, $.TableColumn, $.Plane, $.Row],
    // [$.SignedNumber, $.Group, $.TableColumn, $.Plane, $.Row, $.Cell],
    [$.RestrictedCharacterStringValue, $.CharsDefn], // TODO: I feel like this can be fixed.
    [$.EnumeratedValue, $.NamedValue],
    [$.EnumeratedValue, $.IdentifierList],
    [$.ObjectIdentifierValue, $.ReferencedValue],

    // TODO: AI generated these. Review if these are needed.
    [$.ReferencedValue, $.RelativeOIDComponents, $.NumberForm, $.CharsDefn],
    [$.ObjectIdentifierValue, $.ReferencedValue, $.RelativeOIDComponents, $.NumberForm],
    [$.ReferencedValue, $.CharsDefn],
    [$.ObjIdComponents, $.DefinedValue],
    [$.DefinedValue, $.SimpleDefinedValue],
    [$.ValueList, $.Setting],
    [$.ValueFromObject, $.ObjectSetFromObjects, $.ObjectFromObject, $.TypeFromObject],
    [$.ComponentValueList, $.NamedValueList],
    [$.ParameterizedObject, $.Object],
    [$.ObjectSetElements, $.Setting],
    [$.BitStringValue, $.OctetStringValue],
    [$.ObjIdComponents, $.RelativeOIDComponents],
    [$.Setting, $.TypeConstraint],
    [$.ObjectSetElements, $.Setting],
    [$.ObjectSetElements, $.ComponentRelationConstraint],
    [$.ElementSetSpecs, $.ObjectSetSpec],
    [$.ObjIdComponents, $.NumberForm],
    [$.ObjectIdentifierValue, $.RelativeOIDComponents, $.NumberForm],
    [$.ExtensionAdditions, $.ExtensionAdditionList],
    [$.BitStringType],
    [$.SequenceValue, $.SetValue],
    [$.SequenceOfValue, $.SetOfValue],
    [$.RelativeOIDComponents, $.NumberForm],
    [$.ValueList, $.Setting],
    [$.SingleValue, $.Setting, $.ValueList],
    [$.ValueFromObject, $.ObjectFromObject, $.TypeFromObject],
    [$.ValueFromObject, $.TypeFromObject],
    [$.Group, $.TableColumn],
    [$.ExtensionAdditionAlternatives, $.ExtensionAdditionAlternativesList],
    [$.ValueFromObject, $.ObjectFromObject]
  ],

  extras: $ => [
    /\s+/,
    $.line_comment,
    $.block_comment,
  ],

  rules: {
    source_file: $ => repeat($.ModuleDefinition),

    // TODO: This should prevent terminal hyphens. Apply it to other identifiers.
    yellcased_identifier: $ => /[A-Z][A-Z0-9]*(-[A-Z0-9]+)*/,

    uppercased_identifier: $ => /[A-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,
    lowercased_identifier: $ => /[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,

    uppercased_field_ref: $ => /&[A-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,
    lowercased_field_ref: $ => /&[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,
    anycased_field_ref: $ => /&[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,

    any_identifier: $ => /[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*/,

    ModuleDefinition: $ => seq(
      $.ModuleIdentifier,
      'DEFINITIONS',
      optional($.EncodingReferenceDefault),
      optional($.TagDefault),
      optional($.ExtensionDefault),
      '::=',
      'BEGIN',
      optional($.ModuleBody),
      optional($.EncodingControlSections),
      'END',
    ),

    EncodingReferenceDefault: $ => seq(
      'INSTRUCTIONS',
      $.encodingreference,
    ),

    encodingreference: $ => /[A-Z][A-Z0-9\-]+/,

    ModuleIdentifier: $ => seq(
      $.modulereference,
      optional($.DefinitiveIdentification),
    ),

    DefinitiveIdentification: $ => choice(
      $.DefinitiveOID,
      $.DefinitiveOIDandIRI,
    ),

    DefinitiveOID: $ => seq('{', $.DefinitiveObjIdComponentList, '}'),

    DefinitiveObjIdComponentList: $ => repeat1($.DefinitiveObjIdComponent),

    DefinitiveObjIdComponent: $ => choice(
      $.NameForm,
      $.DefinitiveNumberForm,
      $.DefinitiveNameAndNumberForm,
    ),

    NameForm: $ => $.lowercased_identifier,
    DefinitiveNumberForm: $ => choice(
      '0',
      /[1-9][0-9]*/,
    ),
    DefinitiveNameAndNumberForm: $ => seq(
      $.lowercased_identifier,
      '(',
      $.DefinitiveNumberForm,
      ')',
    ),

    DefinitiveOIDandIRI: $ => seq(
      $.DefinitiveOID,
      $.IRIValue,
    ),

    IRIValue: $ => seq(
      '"',
      /[^"]+/,
      '"',
    ),

    FirstArcIdentifier: $ => seq('/', $.ArcIdentifier),

    modulereference: $ => /[A-Z][a-zA-Z0-9-]*/,
    valuereference: $ => /[a-z][a-zA-Z0-9-]*/,

    TagDefault: $ => choice(
      seq('EXPLICIT', 'TAGS'),
      seq('IMPLICIT', 'TAGS'),
      seq('AUTOMATIC', 'TAGS'),
    ),

    ExtensionDefault: $ => seq('EXTENSIBILITY', 'IMPLIED'),

    // In the ABNF, all of these are optional, but tree-sitter does not allow that.
    // So this grammar rule requires either AssignmentList or Exports and Imports.
    ModuleBody: $ => choice(
      seq(
        optional($.Exports),
        optional($.Imports),
        $.AssignmentList,
      ),
      seq( // If the module defines nothing of its own, it must re-export things.
        $.Exports,
        $.Imports,
        optional($.AssignmentList),
      ),
    ),

    Exports: $ => seq(
      'EXPORTS',
      choice(
        'ALL',
        optional($.SymbolsExported),
      ),
      ';',
    ),

    SymbolsExported: $ => $.SymbolList,

    SymbolList: $ => seq(
      $.Symbol,
      repeat(seq(',', $.Symbol))
    ),

    Symbol: $ => choice(
      $.Reference,
      // Reference is a prefix of ParameterizedReference, but tree-sitter has a
      // look-ahead of one token, which should disambiguate.
      $.ParameterizedReference,
    ),

    // Reference ::=
    //   typereference
    //   | valuereference
    //   | objectclassreference
    //   | objectreference
    //   | objectsetreference
    Reference: $ => /[a-zA-Z][a-zA-Z0-9\-]*/,

    ParameterizedReference: $ => seq(
      $.Reference,
      '{}',
    ),
  
    Imports: $ => seq(
      'IMPORTS',
      optional($.SymbolsImported),
      ';',
    ),

    SymbolsImported: $ => $.SymbolsFromModuleList,

    SymbolsFromModuleList: $ => repeat1($.SymbolsFromModule),

    SymbolsFromModule: $ => seq(
      $.SymbolList,
      'FROM',
      $.GlobalModuleReference,
      optional($.SelectionOption),
    ),

    SelectionOption: $ => seq(
      'WITH',
      choice(
        'SUCCESSORS',
        'DESCENDANTS',
      ),
    ),

    GlobalModuleReference: $ => seq(
      $.modulereference,
      optional($.AssignedIdentifier),
    ),

    AssignedIdentifier: $ => choice(
      $.ObjectIdentifierValue,
      $.DefinedValue,
    ),

    ObjectIdentifierValue: $ => seq(
      '{',
      optional($.DefinedValue),
      $.ObjIdComponentsList,
      '}',
    ),

    ObjIdComponentsList: $ => repeat1($.ObjIdComponents),

    ObjIdComponents: $ => choice(
      $.NameForm,
      $.number,
      $.NameAndNumberForm,
      $.ExternalValueReference,
      $.ParameterizedValue,
    ),

    DefinedValue: $ => choice(
      $.ExternalValueReference,
      prec(-1, $.valuereference),
      prec(1, $.ParameterizedValue),
    ),

    ParameterizedValue: $ => seq(
      $.SimpleDefinedValue,
      $.ActualParameterList,
    ),

    SimpleDefinedValue: $ => choice(
      $.ExternalValueReference,
      $.valuereference,
    ),

    ActualParameterList: $ => seq(
      '{',
      $.ActualParameter,
      repeat(seq(',', $.ActualParameter)),
      '}',
    ),

    ActualParameter: $ => choice(
      $.Type,
      $.Value,
      $.ValueSet,
      $.DefinedObjectClass,
      $.Object,
      $.ObjectSet,
    ),

    ExternalValueReference: $ => seq(
      $.modulereference,
      '.',
      $.valuereference,
    ),
  
    AssignmentList: $ => repeat1($.Assignment),

    Assignment: $ => choice(
      prec(2, $.ObjectClassAssignment),
      $.TypeAssignment,
      $.ObjectSetAssignment,
      prec(1, $.ValueSetTypeAssignment),
      $.ValueAssignment,
      $.ObjectAssignment,
      // $.XMLValueAssignment, // TODO: Re-enable
    ),

    ObjectClassAssignment: $ => seq(
      alias($.yellcased_identifier, 'objectclassreference'),
      optional($.ParameterList),
      '::=',
      $.ObjectClass,
    ),

    ParameterList: $ => seq(
      '{',
      $.Parameter,
      repeat(seq(',', $.Parameter)),
      '}',
    ),

    Parameter: $ => choice(
      prec(1, seq($.ParamGovernor, ':', $.DummyReference)),
      $.DummyReference,
    ),

    ParamGovernor: $ => choice(
      prec(1, $.Governor),
      alias($.Reference, 'DummyGovernor'),
    ),

    Governor: $ => choice(
      prec(1, $.DefinedObjectClass),
      $.Type,
    ),

    ObjectClass: $ => choice(
      prec(1, $.ParameterizedObjectClass),
      $.DefinedObjectClass,
      $.ObjectClassDefn,
    ),

    DefinedObjectClass: $ => choice(
      prec(1, $.UsefulObjectClassReference),
      $.ExternalObjectClassReference,
      alias($.yellcased_identifier, 'objectclassreference'),
    ),

    UsefulObjectClassReference: $ => choice(
      'TYPE-IDENTIFIER',
      'ABSTRACT-SYNTAX',
    ),

    ParameterizedObjectClass: $ => seq(
      $.DefinedObjectClass,
      $.ActualParameterList,
    ),

    ExternalObjectClassReference: $ => seq(
      $.modulereference,
      '.',
      alias($.yellcased_identifier, 'objectclassreference'),
    ),

    ObjectClassDefn: $ => seq(
      'CLASS',
      '{',
      $.FieldSpec,
      repeat(seq(',', $.FieldSpec)),
      '}',
      $.WithSyntaxSpec,
    ),

    FieldSpec: $ => choice(
      $.TypeFieldSpec,
      $.FixedTypeValueFieldSpec,
      $.VariableTypeValueFieldSpec,
      $.FixedTypeValueSetFieldSpec,
      $.VariableTypeValueSetFieldSpec,
      $.ObjectFieldSpec,
      $.ObjectSetFieldSpec,
    ),

    TypeFieldSpec: $ => seq(
      alias($.uppercased_field_ref, 'typefieldreference'),
      optional($.TypeOptionalitySpec),
    ),

    FixedTypeValueFieldSpec: $ => seq(
      alias($.lowercased_field_ref, 'valuefieldreference'),
      $.Type,
      optional('UNIQUE'),
      optional($.ValueOptionalitySpec),
    ),

    VariableTypeValueFieldSpec: $ => seq(
      alias($.lowercased_field_ref, 'valuefieldreference'),
      $.FieldName,
      optional($.ValueOptionalitySpec),
    ),

    FixedTypeValueSetFieldSpec: $ => seq(
      alias($.uppercased_field_ref, 'valuesetfieldreference'),
      $.Type,
      optional($.ValueSetOptionalitySpec),
    ),

    VariableTypeValueSetFieldSpec: $ => seq(
      alias($.uppercased_field_ref, 'valuesetfieldreference'),
      $.FieldName,
      optional($.ValueSetOptionalitySpec),
    ),

    ObjectFieldSpec: $ => seq(
      alias($.lowercased_field_ref, 'objectfieldreference'),
      $.DefinedObjectClass,
      optional($.ObjectOptionalitySpec),
    ),

    ObjectSetFieldSpec: $ => seq(
      alias($.uppercased_field_ref, 'objectsetfieldreference'),
      $.DefinedObjectClass,
      optional($.ObjectSetOptionalitySpec),
    ),

    TypeOptionalitySpec: $ => choice(
      'OPTIONAL',
      seq('DEFAULT', $.Type),
    ),

    ValueOptionalitySpec: $ => choice(
      'OPTIONAL',
      seq('DEFAULT', $.Value),
    ),

    ValueSetOptionalitySpec: $ => choice(
      'OPTIONAL',
      seq('DEFAULT', $.ValueSet),
    ),

    ObjectOptionalitySpec: $ => choice(
      'OPTIONAL',
      seq('DEFAULT', $.Object),
    ),

    ObjectSetOptionalitySpec: $ => choice(
      'OPTIONAL',
      seq('DEFAULT', $.ObjectSet),
    ),

    FieldName: $ => seq(
      alias($.anycased_field_ref, 'PrimitiveFieldName'),
      repeat(seq(
        '.',
        alias($.anycased_field_ref, 'PrimitiveFieldName'),
      )),
    ),

    WithSyntaxSpec: $ => seq(
      'WITH',
      'SYNTAX',
      $.SyntaxList,
    ),

    SyntaxList: $ => seq(
      '{',
      repeat1($.TokenOrGroupSpec),
      '}',
    ),

    TokenOrGroupSpec: $ => choice(
      $.RequiredToken,
      $.OptionalGroup,
    ),

    RequiredToken: $ => choice(
      prec(1, $.Literal),
      $.any_identifier,
    ),

    Literal: $ => choice(
      alias($.yellcased_identifier, 'word'),
      ',',
    ),

    OptionalGroup: $ => seq(
      '[',
      repeat1($.TokenOrGroupSpec),
      ']',
    ),

    TypeAssignment: $ => seq(
      alias($.uppercased_identifier, 'typereference'),
      optional($.ParameterList),
      '::=',
      $.Type,
    ),

    ValueSetTypeAssignment: $ => seq(
      alias($.uppercased_identifier, 'typereference'),
      optional($.ParameterList),
      $.Type,
      '::=',
      $.ValueSet,
    ),

    ObjectSetAssignment: $ => seq(
      alias($.uppercased_identifier, 'objectreference'),
      optional($.ParameterList),
      $.DefinedObjectClass,
      '::=',
      $.Object,
    ),

    ObjectAssignment: $ => seq(
      alias($.lowercased_identifier, 'objectreference'),
      optional($.ParameterList),
      $.DefinedObjectClass,
      '::=',
      $.Object,
    ),

    ValueAssignment: $ => seq(
      alias($.lowercased_identifier, 'valuereference'),
      optional($.ParameterList),
      $.Type,
      '::=',
      $.Value,
    ),

    XMLValueAssignment: $ => seq(
      alias($.lowercased_identifier, 'valuereference'),
      '::=',
      $.XMLTypedValue,
    ),

    EncodingControlSections: $ => repeat1($.EncodingControlSection),

    EncodingControlSection: $ => seq(
      'ENCODING-CONTROL',
      $.encodingreference,
      // FIXME:
      // $.EncodingInstructionAssignmentList,
    ),

    // EncodingInstructionAssignmentList: $ => token(prec(-1, /[^E]+|E(?!ND\b|NCODING-CONTROL\b)/)),
    // EncodingInstructionAssignmentList: $ => repeat1($.EncodingInstructionAssignment),
    // EncodingInstructionAssignment: $ => /(?!END|ENCODING-CONTROL)/,

    Value: $ => choice(
      $.BuiltinValue,
      $.ReferencedValue,
      $.OpenTypeFieldVal,
    ),
    
    ReferencedValue: $ => choice(
      $.DefinedValue,
      $.ValueFromObject
    ),
    
    BuiltinValue: $ => choice(
      $.BitStringValue,
      $.BooleanValue,
      $.CharacterStringValue,
      $.ChoiceValue,
      $.EmbeddedPDVValue,
      $.EnumeratedValue,
      $.ExternalValue,
      // $.InstanceOfValue,
      $.IntegerValue,
      $.IRIValue,
      $.NullValue,
      $.ObjectIdentifierValue,
      $.OctetStringValue,
      $.RealValue,
      $.RelativeIRIValue,
      $.RelativeOIDValue,
      prec(2, $.SequenceValue),
      $.SequenceOfValue,
      $.SetValue,
      $.SetOfValue,
      // $.PrefixedValue,
      $.TimeValue,
    ),
    
    BooleanValue: $ => choice(
      'TRUE',
      'FALSE'
    ),
    
    IntegerValue: $ => choice(
      $.SignedNumber,
      // REVIEW:
      // $.identifier
    ),
    
    SignedNumber: $ => choice(
      $.number,
      seq('-', $.number)
    ),
    
    number: $ => /[0-9]+/,
    
    EnumeratedValue: $ => $.identifier,
    
    RealValue: $ => choice(
      $.NumericRealValue,
      $.SpecialRealValue
    ),
    
    NumericRealValue: $ => choice(
      $.realnumber,
      seq('-', $.realnumber),
      $.SequenceValue
    ),
    
    realnumber: $ => /[0-9]+\.[0-9]+([eE][-+]?[0-9]+)?/,
    
    SpecialRealValue: $ => choice(
      'PLUS-INFINITY',
      'MINUS-INFINITY',
      'NOT-A-NUMBER'
    ),
    
    BitStringValue: $ => choice(
      prec(1, $.bstring),
      prec(1, $.hstring),
      seq('{', $.IdentifierList, '}'),
      seq('{', '}'),
      seq('CONTAINING', $.Value)
    ),
    
    bstring: $ => /'[01]*'B/,
    
    hstring: $ => /'[0-9A-Fa-f]*'H/,
    
    IdentifierList: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier))
    ),
    
    OctetStringValue: $ => choice(
      $.bstring,
      $.hstring,
      seq('CONTAINING', $.Value)
    ),
    
    NullValue: $ => prec(1, 'NULL'),
    
    SequenceValue: $ => choice(
      seq('{', $.ComponentValueList, '}'),
      seq('{', '}')
    ),
    
    ComponentValueList: $ => seq(
      $.NamedValue,
      repeat(seq(',', $.NamedValue))
    ),
    
    NamedValue: $ => seq(
      $.identifier,
      $.Value
    ),
    
    SequenceOfValue: $ => choice(
      seq('{', $.ValueList, '}'),
      seq('{', $.NamedValueList, '}'),
      seq('{', '}')
    ),
    
    ValueList: $ => seq(
      $.Value,
      repeat(seq(',', $.Value))
    ),
    
    NamedValueList: $ => seq(
      $.NamedValue,
      repeat(seq(',', $.NamedValue))
    ),
    
    SetValue: $ => choice(
      seq('{', $.ComponentValueList, '}'),
      seq('{', '}')
    ),
    
    SetOfValue: $ => choice(
      seq('{', $.ValueList, '}'),
      seq('{', $.NamedValueList, '}'),
      seq('{', '}')
    ),
    
    ChoiceValue: $ => seq(
      $.identifier,
      ':',
      $.Value
    ),
    
    SelectionType: $ => prec(2, seq(
      $.identifier,
      '<',
      $.Type
    )),
    
    OpenTypeFieldVal: $ => seq(
      $.Type,
      ':',
      $.Value
    ),
    
    ValueFromObject: $ => seq(
      $.ReferencedObjects,
      '.',
      $.FieldName
    ),
    
    ReferencedObjects: $ => choice(
      $.DefinedObject,
      $.ParameterizedObject,
      $.DefinedObjectSet,
      $.ParameterizedObjectSet
    ),
    
    DefinedObject: $ => choice(
      $.ExternalObjectReference,
      $.objectreference
    ),
    
    ExternalObjectReference: $ => seq(
      $.modulereference,
      '.',
      $.objectreference
    ),
    
    objectreference: $ => $.lowercased_identifier,
    
    ParameterizedObject: $ => seq(
      $.DefinedObject,
      $.ActualParameterList
    ),
    
    DefinedObjectSet: $ => choice(
      prec(1, $.ExternalObjectSetReference),
      $.objectsetreference
    ),
    
    ExternalObjectSetReference: $ => seq(
      $.modulereference,
      '.',
      $.objectsetreference
    ),
    
    objectsetreference: $ => $.uppercased_identifier,
    
    ParameterizedObjectSet: $ => seq(
      $.DefinedObjectSet,
      $.ActualParameterList
    ),
    
    RelativeOIDValue: $ => seq(
      '{',
      $.RelativeOIDComponentsList,
      '}'
    ),
    
    RelativeOIDComponentsList: $ => repeat1($.RelativeOIDComponents),
    
    RelativeOIDComponents: $ => choice(
      $.NumberForm,
      $.NameAndNumberForm,
      $.DefinedValue
    ),
    
    NumberForm: $ => choice(
      $.number,
      $.DefinedValue
    ),
    
    NameAndNumberForm: $ => seq(
      $.identifier,
      '(',
      $.NumberForm,
      ')'
    ),
    
    RelativeIRIValue: $ => seq(
      '"',
      $.FirstRelativeArcIdentifier,
      repeat(seq(
        '/',
        $.ArcIdentifier
      )),
      '"'
    ),
    
    FirstRelativeArcIdentifier: $ => $.ArcIdentifier,
    
    ArcIdentifier: $ => /[a-zA-Z0-9][a-zA-Z0-9-]*/,
    
    EmbeddedPDVValue: $ => $.SequenceValue,
    
    ExternalValue: $ => $.SequenceValue,
    
    TimeValue: $ => $.tstring,
    
    tstring: $ => /"[0-9:.+\-ZT][0-9:.+\-ZT]*"/,
    
    CharacterStringValue: $ => choice(
      prec(1, $.RestrictedCharacterStringValue),
      $.UnrestrictedCharacterStringValue
    ),
    
    RestrictedCharacterStringValue: $ => choice(
      $.cstring,
      $.CharacterStringList,
      $.Quadruple,
      $.Tuple
    ),
    
    cstring: $ => /"[^"]*"/,
    
    CharacterStringList: $ => seq(
      '{',
      $.CharSyms,
      '}'
    ),
    
    CharSyms: $ => seq(
      $.CharsDefn,
      repeat(seq(',', $.CharsDefn))
    ),
    
    CharsDefn: $ => choice(
      $.cstring,
      prec(1, $.Quadruple),
      prec(2, $.Tuple),
      $.DefinedValue
    ),
    
    Quadruple: $ => seq(
      '{',
      $.Group,
      ',',
      $.Plane,
      ',',
      $.Row,
      ',',
      $.Cell,
      '}'
    ),
    
    Group: $ => $.number,
    Plane: $ => $.number,
    Row: $ => $.number,
    Cell: $ => $.number,
    
    Tuple: $ => seq(
      '{',
      $.TableColumn,
      ',',
      $.TableRow,
      '}'
    ),
    
    TableColumn: $ => $.number,
    TableRow: $ => $.number,
    
    UnrestrictedCharacterStringValue: $ => $.SequenceValue,
    
    // InstanceOfValue: $ => $.Value,

    Type: $ => prec.left(seq(
      choice(
        $.BuiltinType,
        $.ReferencedType,
        $.TypeWithConstraint
      ),
      repeat($.Constraint)
    )),

    BuiltinType: $ => choice(
      $.BitStringType,
      $.BooleanType,
      $.CharacterStringType,
      $.ChoiceType,
      $.DateType,
      $.DateTimeType,
      $.DurationType,
      $.EmbeddedPDVType,
      $.EnumeratedType,
      $.ExternalType,
      $.InstanceOfType,
      $.IntegerType,
      $.IRIType,
      $.NullType,
      $.ObjectClassFieldType,
      $.ObjectIdentifierType,
      $.OctetStringType,
      $.RealType,
      $.RelativeIRIType,
      $.RelativeOIDType,
      $.SequenceType,
      $.SequenceOfType,
      $.SetType,
      $.SetOfType,
      $.PrefixedType,
      $.TimeType,
      $.TimeOfDayType
    ),

    BooleanType: $ => 'BOOLEAN',

    IntegerType: $ => choice(
      'INTEGER',
      prec(1, seq('INTEGER', '{', $.NamedNumberList, '}')),
    ),

    NamedNumberList: $ => seq(
      $.NamedNumber,
      repeat(seq(',', $.NamedNumber))
    ),

    NamedNumber: $ => choice(
      seq($.identifier, '(', $.SignedNumber, ')'),
      seq($.identifier, '(', $.DefinedValue, ')')
    ),

    EnumeratedType: $ => seq(
      'ENUMERATED',
      '{',
      $.Enumerations,
      '}'
    ),

    Enumerations: $ => choice(
      $.RootEnumeration,
      seq($.RootEnumeration, ',', '...', optional($.ExceptionSpec)),
      seq($.RootEnumeration, ',', '...', optional($.ExceptionSpec), ',', $.AdditionalEnumeration)
    ),

    RootEnumeration: $ => $.Enumeration,

    AdditionalEnumeration: $ => $.Enumeration,

    Enumeration: $ => prec.left(choice(
      $.EnumerationItem,
      seq($.EnumerationItem, ',', $.Enumeration)
    )),

    EnumerationItem: $ => choice(
      $.identifier,
      $.NamedNumber
    ),

    RealType: $ => 'REAL',

    BitStringType: $ => choice(
      seq('BIT', 'STRING'),
      seq('BIT', 'STRING', '{', $.NamedBitList, '}')
    ),

    NamedBitList: $ => seq(
      $.NamedBit,
      repeat(seq(',', $.NamedBit))
    ),

    NamedBit: $ => choice(
      seq($.identifier, '(', $.number, ')'),
      seq($.identifier, '(', $.DefinedValue, ')')
    ),

    OctetStringType: $ => seq('OCTET', 'STRING'),

    NullType: $ => 'NULL',

    SequenceType: $ => choice(
      seq('SEQUENCE', '{', '}'),
      prec(1,seq('SEQUENCE', '{', $.ExtensionAndException, optional($.OptionalExtensionMarker), '}')),
      seq('SEQUENCE', '{', $.ComponentTypeLists, '}')
    ),

    ExtensionAndException: $ => choice(
      '...',
      seq('...', optional($.ExceptionSpec))
    ),

    OptionalExtensionMarker: $ => seq(',', '...'),

    ComponentTypeLists: $ => choice(
      $.RootComponentTypeList,
      prec.left(3, seq($.RootComponentTypeList, ',', $.ExtensionAndException, optional($.ExtensionAdditions), $.ExtensionEndMarker, ',', $.RootComponentTypeList)),
      prec.left(2, seq($.RootComponentTypeList, ',', $.ExtensionAndException, optional($.ExtensionAdditions), optional($.OptionalExtensionMarker))),
      prec.left(1, seq($.ExtensionAndException, optional($.ExtensionAdditions), $.ExtensionEndMarker, ',', $.RootComponentTypeList)),
      prec.left(0, seq($.ExtensionAndException, optional($.ExtensionAdditions), optional($.OptionalExtensionMarker)))
    ),

    RootComponentTypeList: $ => $.ComponentTypeList,

    ExtensionEndMarker: $ => seq(',', '...'),

    ExtensionAdditions: $ => seq(',', $.ExtensionAdditionList),

    ExtensionAdditionList: $ => choice(
      $.ExtensionAddition,
      seq($.ExtensionAdditionList, ',', $.ExtensionAddition)
    ),

    ExtensionAddition: $ => choice(
      $.ComponentType,
      $.ExtensionAdditionGroup
    ),

    ExtensionAdditionGroup: $ => seq(
      '[[',
      optional($.VersionNumber),
      $.ComponentTypeList,
      ']]'
    ),

    VersionNumber: $ => seq($.number, ':'),

    ComponentTypeList: $ => prec.left(seq(
      $.ComponentType,
      repeat(seq(',', $.ComponentType)),
    )),

    ComponentType: $ => choice(
      $.NamedType,
      seq($.NamedType, 'OPTIONAL'),
      seq($.NamedType, 'DEFAULT', $.Value),
      seq('COMPONENTS', 'OF', $.Type)
    ),

    NamedType: $ => seq(
      $.identifier,
      $.Type
    ),

    SequenceOfType: $ => choice(
      seq('SEQUENCE', 'OF', $.Type),
      seq('SEQUENCE', 'OF', $.NamedType)
    ),

    SetType: $ => choice(
      seq('SET', '{', '}'),
      seq('SET', '{', $.ExtensionAndException, optional($.OptionalExtensionMarker), '}'),
      seq('SET', '{', $.ComponentTypeLists, '}')
    ),

    SetOfType: $ => choice(
      seq('SET', 'OF', $.Type),
      seq('SET', 'OF', $.NamedType)
    ),

    ChoiceType: $ => seq(
      'CHOICE',
      '{',
      $.AlternativeTypeLists,
      '}'
    ),

    AlternativeTypeLists: $ => choice(
      $.RootAlternativeTypeList,
      prec(1, seq($.RootAlternativeTypeList, ',', $.ExtensionAndException, optional($.ExtensionAdditionAlternatives), optional($.OptionalExtensionMarker)))
    ),

    RootAlternativeTypeList: $ => prec.left($.AlternativeTypeList),

    ExtensionAdditionAlternatives: $ => seq(',', $.ExtensionAdditionAlternativesList),

    ExtensionAdditionAlternativesList: $ => choice(
      $.ExtensionAdditionAlternative,
      seq($.ExtensionAdditionAlternativesList, ',', $.ExtensionAdditionAlternative)
    ),

    ExtensionAdditionAlternative: $ => choice(
      $.ExtensionAdditionAlternativesGroup,
      $.NamedType
    ),

    ExtensionAdditionAlternativesGroup: $ => seq(
      '[[',
      optional($.VersionNumber),
      $.AlternativeTypeList,
      ']]'
    ),

    AlternativeTypeList: $ => choice(
      $.NamedType,
      seq($.AlternativeTypeList, ',', $.NamedType)
    ),

    ObjectIdentifierType: $ => seq('OBJECT', 'IDENTIFIER'),

    RelativeOIDType: $ => 'RELATIVE-OID',

    IRIType: $ => 'OID-IRI',

    RelativeIRIType: $ => 'RELATIVE-OID-IRI',

    EmbeddedPDVType: $ => seq('EMBEDDED', 'PDV'),

    ExternalType: $ => 'EXTERNAL',

    TimeType: $ => 'TIME',

    DateType: $ => 'DATE',

    TimeOfDayType: $ => 'TIME-OF-DAY',

    DateTimeType: $ => 'DATE-TIME',

    DurationType: $ => 'DURATION',

    CharacterStringType: $ => choice(
      $.RestrictedCharacterStringType,
      $.UnrestrictedCharacterStringType
    ),

    RestrictedCharacterStringType: $ => choice(
      'BMPString',
      'GeneralString',
      'GraphicString',
      'IA5String',
      'ISO646String',
      'NumericString',
      'PrintableString',
      'TeletexString',
      'T61String',
      'UniversalString',
      'UTF8String',
      'VideotexString',
      'VisibleString'
    ),

    UnrestrictedCharacterStringType: $ => seq('CHARACTER', 'STRING'),

    PrefixedType: $ => choice(
      $.TaggedType,
      $.EncodingPrefixedType
    ),

    TaggedType: $ => choice(
      seq($.Tag, $.Type),
      seq($.Tag, 'IMPLICIT', $.Type),
      seq($.Tag, 'EXPLICIT', $.Type)
    ),

    Tag: $ => seq(
      '[',
      optional(seq($.encodingreference, ':')),
      optional($.Class),
      $.ClassNumber,
      ']'
    ),

    ClassNumber: $ => choice(
      $.number,
      $.DefinedValue
    ),

    Class: $ => choice(
      'UNIVERSAL',
      'APPLICATION',
      'PRIVATE'
    ),

    EncodingPrefixedType: $ => seq(
      $.EncodingPrefix,
      $.Type
    ),

    EncodingPrefix: $ => seq(
      '[',
      $.encodingreference,
      $.EncodingInstruction,
      ']'
    ),

    EncodingInstruction: $ => /:[^]]*]/,

    ObjectClassFieldType: $ => seq(
      $.DefinedObjectClass,
      '.',
      $.FieldName
    ),

    InstanceOfType: $ => seq('INSTANCE', 'OF', $.DefinedObjectClass),

    ValueSet: $ => seq(
      '{',
      $.ElementSetSpecs,
      '}'
    ),

    ElementSetSpecs: $ => choice(
      $.RootElementSetSpec,
      seq($.RootElementSetSpec, ',', '...'),
      seq($.RootElementSetSpec, ',', '...', ',', $.AdditionalElementSetSpec)
    ),

    RootElementSetSpec: $ => $.ElementSetSpec,

    AdditionalElementSetSpec: $ => $.ElementSetSpec,

    ElementSetSpec: $ => choice(
      $.Unions,
      seq('ALL', $.Exclusions)
    ),

    Unions: $ => choice(
      $.Intersections,
      seq($.UElems, $.UnionMark, $.Intersections)
    ),

    UElems: $ => $.Unions,

    Intersections: $ => choice(
      $.IntersectionElements,
      seq($.IElems, $.IntersectionMark, $.IntersectionElements)
    ),

    IElems: $ => $.Intersections,

    IntersectionElements: $ => choice(
      $.Elements,
      seq($.Elems, $.Exclusions)
    ),

    Elems: $ => $.Elements,

    Exclusions: $ => seq('EXCEPT', $.Elements),

    UnionMark: $ => choice('|', 'UNION'),

    IntersectionMark: $ => choice('^', 'INTERSECTION'),

    Elements: $ => choice(
      $.SubtypeElements,
      $.ObjectSetElements,
      seq('(', $.ElementSetSpec, ')')
    ),

    SubtypeElements: $ => choice(
      prec(1, $.SingleValue),
      $.ContainedSubtype,
      prec(2, $.ValueRange),
      $.PermittedAlphabet,
      $.SizeConstraint,
      $.TypeConstraint,
      $.InnerTypeConstraints,
      $.PatternConstraint,
      $.PropertySettings,
    ),

    SingleValue: $ => $.Value,

    ContainedSubtype: $ => seq(
      'INCLUDES', // Non-optional is already handled in SubtypeElements
      $.Type
    ),

    ValueRange: $ => seq(
      $.LowerEndpoint,
      '..',
      $.UpperEndpoint
    ),

    LowerEndpoint: $ => choice(
      $.LowerEndValue,
      seq($.LowerEndValue, '<')
    ),

    UpperEndpoint: $ => choice(
      $.UpperEndValue,
      seq('<', $.UpperEndValue)
    ),

    LowerEndValue: $ => choice(
      $.Value,
      'MIN'
    ),

    UpperEndValue: $ => choice(
      $.Value,
      'MAX'
    ),

    ObjectSetElements: $ => choice(
      $.Object,
      $.DefinedObjectSet,
      $.ObjectSetFromObjects,
      $.ParameterizedObjectSet
    ),

    ObjectSetFromObjects: $ => seq(
      $.ReferencedObjects,
      '.',
      $.FieldName
    ),

    Object: $ => choice(
      $.DefinedObject,
      $.ObjectDefn,
      $.ObjectFromObject,
      $.ParameterizedObject
    ),

    ObjectDefn: $ => choice(
      $.DefaultSyntax,
      $.DefinedSyntax,
    ),

    DefaultSyntax: $ => seq(
      '{',
      optional($.FieldSetting),
      repeat(seq(',', $.FieldSetting)),
      '}'
    ),

    DefinedSyntax: $ => prec(1, seq(
      '{',
      repeat($.DefinedSyntaxToken),
      '}'
    )),

    DefinedSyntaxToken: $ => choice(
      $.Literal,
      $.Setting
    ),

    FieldSetting: $ => seq(
      alias($.anycased_field_ref, 'PrimitiveFieldName'),
      $.Setting
    ),

    Setting: $ => choice(
      $.Type,
      $.Value,
      $.ValueSet,
      $.Object,
      $.ObjectSet
    ),

    ObjectSet: $ => seq(
      '{',
      $.ObjectSetSpec,
      '}'
    ),

    ObjectSetSpec: $ => choice(
      $.RootElementSetSpec,
      seq($.RootElementSetSpec, ',', '...'),
      '...',
      seq('...', ',', $.AdditionalElementSetSpec),
      seq($.RootElementSetSpec, ',', '...', ',', $.AdditionalElementSetSpec)
    ),

    ObjectFromObject: $ => seq(
      $.ReferencedObjects,
      '.',
      $.FieldName
    ),

    TypeFromObject: $ => seq(
      $.ReferencedObjects,
      '.',
      $.FieldName
    ),

    PermittedAlphabet: $ => seq(
      'FROM',
      $.Constraint
    ),

    SizeConstraint: $ => seq(
      'SIZE',
      $.Constraint
    ),

    TypeConstraint: $ => $.Type,

    InnerTypeConstraints: $ => choice(
      seq('WITH', 'COMPONENT', $.SingleTypeConstraint),
      seq('WITH', 'COMPONENTS', $.MultipleTypeConstraints)
    ),

    SingleTypeConstraint: $ => $.Constraint,

    MultipleTypeConstraints: $ => choice(
      $.FullSpecification,
      $.PartialSpecification
    ),

    FullSpecification: $ => seq(
      '{',
      $.TypeConstraints,
      '}'
    ),

    PartialSpecification: $ => seq(
      '{',
      '...',
      ',',
      $.TypeConstraints,
      '}'
    ),

    TypeConstraints: $ => seq(
      $.NamedConstraint,
      repeat(seq(',', $.NamedConstraint))
    ),

    NamedConstraint: $ => seq(
      $.identifier,
      optional($.ValueConstraint),
      optional($.PresenceConstraint),
    ),

    ValueConstraint: $ => $.Constraint,

    PresenceConstraint: $ => choice(
      'PRESENT',
      'ABSENT',
      'OPTIONAL'
    ),

    PatternConstraint: $ => seq(
      'PATTERN',
      $.Value
    ),

    PropertySettings: $ => seq(
      'SETTINGS',
      /\"[^\"]*\"/
    ),

    TypeWithConstraint: $ => choice(
      seq('SET', $.Constraint, 'OF', $.Type),
      seq('SET', $.SizeConstraint, 'OF', $.Type),
      seq('SEQUENCE', $.Constraint, 'OF', $.Type),
      seq('SEQUENCE', $.SizeConstraint, 'OF', $.Type),
      seq('SET', $.Constraint, 'OF', $.NamedType),
      seq('SET', $.SizeConstraint, 'OF', $.NamedType),
      seq('SEQUENCE', $.Constraint, 'OF', $.NamedType),
      seq('SEQUENCE', $.SizeConstraint, 'OF', $.NamedType)
    ),

    Constraint: $ => seq(
      '(',
      $.ConstraintSpec,
      optional($.ExceptionSpec),
      ')'
    ),

    ConstraintSpec: $ => choice(
      $.SubtypeConstraint,
      $.GeneralConstraint
    ),

    SubtypeConstraint: $ => $.ElementSetSpecs,

    ExceptionSpec: $ => seq(
      '!',
      $.ExceptionIdentification
    ),

    ExceptionIdentification: $ => choice(
      $.SignedNumber,
      $.DefinedValue,
      seq($.Type, ':', $.Value)
    ),

    GeneralConstraint: $ => choice(
      $.UserDefinedConstraint,
      $.TableConstraint,
      $.ContentsConstraint
    ),

    UserDefinedConstraint: $ => seq(
      'CONSTRAINED',
      'BY',
      '{',
      optional($.UserDefinedConstraintParameter),
      repeat(seq(',', $.UserDefinedConstraintParameter)),
      '}'
    ),

    UserDefinedConstraintParameter: $ => choice(
      seq($.Type, ':', $.Value),
      seq($.Type, ':', $.Object),
      seq($.DefinedObjectClass, ':', $.Value),
      seq($.DefinedObjectClass, ':', $.Object),
      $.DefinedObjectSet,
      $.Type,
      $.DefinedObjectClass
    ),

    TableConstraint: $ => choice(
      $.SimpleTableConstraint,
      $.ComponentRelationConstraint
    ),

    SimpleTableConstraint: $ => $.ObjectSet,

    ComponentRelationConstraint: $ => seq(
      '{',
      $.DefinedObjectSet,
      '}',
      '{',
      $.AtNotation,
      repeat(seq(',', $.AtNotation)),
      '}'
    ),

    AtNotation: $ => choice(
      seq('@', $.ComponentIdList),
      seq('@.', optional($.Level), $.ComponentIdList)
    ),

    Level: $ => seq('.', optional($.Level)),

    ComponentIdList: $ => seq(
      $.identifier,
      repeat1(seq('.', $.identifier))
    ),

    ContentsConstraint: $ => choice(
      seq('CONTAINING', $.Type),
      seq('ENCODED', 'BY', $.Value),
      seq('CONTAINING', $.Type, 'ENCODED', 'BY', $.Value)
    ),

    block_comment: $ => seq(
      '/*',
      repeat(choice(
        /[^*/]+/,       // non-* and non-/ characters
        seq('*', /[^/]/), // a '*' not followed by '/'
        seq('/', /[^*]/), // a '/' not followed by '*'
      )),
      '*/'
    ),

    line_comment: $ => token(seq('--', /[^\n]*/)),

    keyword: $ => token(choice(
      'ABSENT',
      'ENCODED',
      'INTERSECTION',
      'SEQUENCE',
      'ABSTRACT-SYNTAX',
      'ENCODING-CONTROL',
      'ISO646String',
      'SET',
      'ALL',
      'END',
      'MAX',
      'SETTINGS',
      'APPLICATION',
      'ENUMERATED',
      'MIN',
      'SIZE',
      'AUTOMATIC',
      'EXCEPT',
      'MINUS-INFINITY',
      'STRING',
      'BEGIN',
      'EXPLICIT',
      'NOT-A-NUMBER',
      'SYNTAX',
      'BIT',
      'EXPORTS',
      'NULL',
      'T61String',
      'BMPString',
      'EXTENSIBILITY',
      'NumericString',
      'TAGS',
      'BOOLEAN',
      'EXTERNAL',
      'OBJECT',
      'TeletexString',
      'BY',
      'FALSE',
      'ObjectDescriptor',
      'TIME',
      'CHARACTER',
      'FROM',
      'OCTET',
      'TIME-OF-DAY',
      'CHOICE',
      'GeneralizedTime',
      'OF',
      'TRUE',
      'CLASS',
      'GeneralString',
      'OID-IRI',
      'TYPE-IDENTIFIER',
      'COMPONENT',
      'GraphicString',
      'OPTIONAL',
      'UNION',
      'COMPONENTS',
      'IA5String',
      'PATTERN',
      'UNIQUE',
      'CONSTRAINED',
      'IDENTIFIER',
      'PDV',
      'UNIVERSAL',
      'CONTAINING',
      'IMPLICIT',
      'PLUS-INFINITY',
      'UniversalString',
      'DATE',
      'IMPLIED',
      'PRESENT',
      'UTCTime',
      'DATE-TIME',
      'IMPORTS',
      'PrintableString',
      'UTF8String',
      'DEFAULT',
      'INCLUDES',
      'PRIVATE',
      'VideotexString',
      'DEFINITIONS',
      'INSTANCE',
      'REAL',
      'VisibleString',
      'DURATION',
      'INSTRUCTIONS',
      'RELATIVE-OID',
      'WITH',
      'EMBEDDED',
      'INTEGER',
      'RELATIVE-OID-IRI',
    )),

    identifier: $ => /[a-zA-Z][a-zA-Z0-9-]*/,

    XMLTypedValue: $ => choice(
      seq('<', $.NonParameterizedTypeName, '>', $.XMLValue, '</', $.NonParameterizedTypeName, '>'),
      seq('<', $.NonParameterizedTypeName, '/>')
    ),

    NonParameterizedTypeName: $ => choice(
      $.ExternalTypeReference,
      alias($.uppercased_identifier, 'typereference'),
      $.xmlasn1typename
    ),

    xmlasn1typename: $ => /[A-Za-z][A-Za-z0-9\-]*/,

    XMLValue: $ => choice(
      $.XMLBuiltinValue,
      $.XMLObjectClassFieldValue
    ),

    XMLBuiltinValue: $ => choice(
      $.XMLBitStringValue,
      $.XMLBooleanValue,
      $.XMLCharacterStringValue,
      $.XMLChoiceValue,
      $.XMLEmbeddedPDVValue,
      $.XMLEnumeratedValue,
      $.XMLExternalValue,
      $.XMLInstanceOfValue,
      $.XMLIntegerValue,
      $.XMLIRIValue,
      $.XMLNullValue,
      $.XMLObjectIdentifierValue,
      $.XMLOctetStringValue,
      $.XMLRealValue,
      $.XMLRelativeIRIValue,
      $.XMLRelativeOIDValue,
      $.XMLSequenceValue,
      $.XMLSequenceOfValue,
      $.XMLSetValue,
      $.XMLSetOfValue,
      $.XMLPrefixedValue,
      $.XMLTimeValue
    ),

    XMLBooleanValue: $ => choice(
      $.EmptyElementBoolean,
      $.TextBoolean
    ),

    EmptyElementBoolean: $ => choice(
      '<true/>',
      '<false/>'
    ),

    TextBoolean: $ => choice(
      'true',
      'false'
    ),

    XMLIntegerValue: $ => choice(
      $.XMLSignedNumber,
      $.EmptyElementInteger,
      $.TextInteger
    ),

    XMLSignedNumber: $ => choice(
      $.number,
      seq('-', $.number)
    ),

    EmptyElementInteger: $ => seq('<', $.identifier, '/>'),

    TextInteger: $ => $.identifier,

    XMLEnumeratedValue: $ => choice(
      $.EmptyElementEnumerated,
      $.TextEnumerated
    ),

    EmptyElementEnumerated: $ => seq('<', $.identifier, '/>'),

    TextEnumerated: $ => $.identifier,

    XMLRealValue: $ => choice(
      $.XMLNumericRealValue,
      $.XMLSpecialRealValue
    ),

    XMLNumericRealValue: $ => choice(
      $.realnumber,
      seq('-', $.realnumber)
    ),

    XMLSpecialRealValue: $ => choice(
      $.EmptyElementReal,
      $.TextReal
    ),

    EmptyElementReal: $ => choice(
      '<PLUS-INFINITY/>',
      '<MINUS-INFINITY/>',
      '<NOT-A-NUMBER/>'
    ),

    TextReal: $ => choice(
      'INF',
      seq('-', 'INF'),
      'NaN'
    ),

    XMLBitStringValue: $ => choice(
      $.XMLTypedValue,
      $.xmlbstring,
      $.XMLIdentifierList,
    ),

    xmlbstring: $ => /[01]*/,

    XMLIdentifierList: $ => choice(
      $.EmptyElementList,
      $.TextList
    ),

    EmptyElementList: $ => choice(
      seq('<', $.identifier, '/>'),
      seq($.EmptyElementList, '<', $.identifier, '/>')
    ),

    TextList: $ => repeat1($.identifier),

    XMLOctetStringValue: $ => choice(
      $.XMLTypedValue,
      $.xmlhstring
    ),

    xmlhstring: $ => /[0-9A-Fa-f]*/,

    XMLNullValue: $ => '$$$$$BLING_BLING_MISTER_MONEY_BAG$$$$$',

    XMLSequenceValue: $ => choice(
      $.XMLComponentValueList,
    ),

    XMLComponentValueList: $ => repeat1($.XMLNamedValue),

    XMLNamedValue: $ => seq(
      '<', $.identifier, '>', $.XMLValue, '</', $.identifier, '>'
    ),

    XMLSequenceOfValue: $ => choice(
      $.XMLValueList,
      $.XMLDelimitedItemList,
    ),

    XMLValueList: $ => repeat1($.XMLValueOrEmpty),

    XMLValueOrEmpty: $ => choice(
      $.XMLValue,
      seq('<', $.NonParameterizedTypeName, '/>')
    ),

    XMLDelimitedItemList: $ => repeat1($.XMLDelimitedItem),

    XMLDelimitedItem: $ => choice(
      seq('<', $.NonParameterizedTypeName, '>', $.XMLValue, '</', $.NonParameterizedTypeName, '>'),
      seq('<', $.identifier, '>', $.XMLValue, '</', $.identifier, '>')
    ),

    XMLSetValue: $ => $.XMLComponentValueList,

    XMLSetOfValue: $ => choice(
      $.XMLValueList,
      $.XMLDelimitedItemList,
    ),

    XMLChoiceValue: $ => seq(
      '<', $.identifier, '>', $.XMLValue, '</', $.identifier, '>'
    ),

    XMLPrefixedValue: $ => $.XMLValue,

    XMLObjectClassFieldValue: $ => choice(
      $.XMLOpenTypeFieldVal,
      $.XMLFixedTypeFieldVal
    ),

    XMLOpenTypeFieldVal: $ => choice(
      $.XMLTypedValue,
      $.xmlhstring
    ),

    XMLFixedTypeFieldVal: $ => $.XMLBuiltinValue,

    XMLObjectIdentifierValue: $ => $.XMLObjIdComponentList,

    XMLObjIdComponentList: $ => choice(
      $.XMLObjIdComponent,
      seq($.XMLObjIdComponent, '.', $.XMLObjIdComponentList)
    ),

    XMLObjIdComponent: $ => choice(
      $.identifier,  // NameForm
      $.XMLNumberForm,
      $.XMLNameAndNumberForm
    ),

    XMLNumberForm: $ => $.number,

    XMLNameAndNumberForm: $ => seq(
      $.identifier, '(', $.XMLNumberForm, ')'
    ),

    XMLRelativeOIDValue: $ => $.XMLRelativeOIDComponentList,

    XMLRelativeOIDComponentList: $ => choice(
      $.XMLRelativeOIDComponent,
      seq($.XMLRelativeOIDComponent, '.', $.XMLRelativeOIDComponentList)
    ),

    XMLRelativeOIDComponent: $ => choice(
      $.XMLNumberForm,
      $.XMLNameAndNumberForm
    ),

    XMLIRIValue: $ => seq(
      $.FirstArcIdentifier, 
      repeat(seq(
        '/',
        $.ArcIdentifier
      )),
    ),

    XMLRelativeIRIValue: $ => seq(
      $.FirstRelativeArcIdentifier,
      repeat(seq(
        '/',
        $.ArcIdentifier
      )),
    ),

    XMLEmbeddedPDVValue: $ => $.XMLSequenceValue,

    XMLExternalValue: $ => $.XMLSequenceValue,

    XMLTimeValue: $ => $.xmltstring,

    xmltstring: $ => /[0-9:.+\-ZT][0-9:.+\-ZT]*/,

    XMLCharacterStringValue: $ => choice(
      $.XMLRestrictedCharacterStringValue,
      $.XMLUnrestrictedCharacterStringValue
    ),

    XMLRestrictedCharacterStringValue: $ => $.xmlcstring,

    xmlcstring: $ => /[^<&]*/,  // Simplified, should exclude XML reserved chars

    XMLUnrestrictedCharacterStringValue: $ => $.XMLSequenceValue,

    XMLInstanceOfValue: $ => $.XMLValue,

    ReferencedType: $ => choice(
      $.DefinedType,
      $.UsefulType,
      $.SelectionType,
      prec(1, $.TypeFromObject),
    ),

    DefinedType: $ => choice(
      $.ExternalTypeReference,
      alias($.uppercased_identifier, 'typereference'),
      $.ParameterizedType,
      $.ParameterizedValueSetType
    ),

    ParameterizedType: $ => seq(
      $.SimpleDefinedType,
      $.ActualParameterList
    ),

    SimpleDefinedType: $ => choice(
      prec(1, $.ExternalTypeReference),
      alias($.uppercased_identifier, 'typereference')
    ),

    ExternalTypeReference: $ => seq(
      $.modulereference,
      '.',
      alias($.uppercased_identifier, 'typereference')
    ),

    ParameterizedValueSetType: $ => seq(
      $.SimpleDefinedType,
      $.ActualParameterList
    ),

    UsefulType: $ => alias($.uppercased_identifier, 'typereference'),

    DummyReference: $ => $.Reference,
  },

});
