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
  // TODO: Must each one be only two grammar rules?
  conflicts: $ => [
    [$.Type, $.Value, $.ValueSet, $.Object, $.ObjectSet],
    [$.FixedTypeValueSetFieldSpec, $.ObjectSetFieldSpec],
    [$.Type, $.ValueSet, $.ObjectSet],
  ],

  extras: $ => [
    $.line_comment,
    $.block_comment,
  ],

  rules: {
    source_file: $ => repeat(choice(
      $.block_comment,
      $.line_comment,
      $.keyword,
      $.identifier
    )),

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
      $.EncodingReferenceDefault,
      $.TagDefault,
      $.ExtensionDefault,
      '::=',
      'BEGIN',
      $.ModuleBody,
      $.EncodingControlSections,
      'END',
    ),

    EncodingReferenceDefault: $ => optional(seq(
      'INSTRUCTIONS',
      $.encodingreference,
    )),

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

    DefinitiveObjIdComponentList: $ => repeat($.DefinitiveObjIdComponent),

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

    TagDefault: $ => optional(choice(
      seq('EXPLICIT', 'TAGS'),
      seq('IMPLICIT', 'TAGS'),
      seq('AUTOMATIC', 'TAGS'),
    )),

    ExtensionDefault: $ => optional(seq('EXTENSIBILITY', 'IMPLIED')),

    ModuleBody: $ => optional(seq(
      $.Exports,
      $.Imports,
      $.AssignmentList,
    )),

    Exports: $ => optional(seq(
      'EXPORTS',
      choice(
        'ALL',
        $.SymbolsExported,
      ),
      ';',
    )),

    SymbolsExported: $ => optional($.SymbolList),

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
  
    Imports: $ => optional(seq(
      'IMPORTS',
      $.SymbolsImported,
      ';',
    )),

    SymbolsImported: $ => optional($.SymbolsFromModuleList),

    SymbolsFromModuleList: $ => repeat1($.SymbolsFromModule),

    SymbolsFromModule: $ => seq(
      $.SymbolList,
      'FROM',
      $.GlobalModuleReference,
      $.SelectionOption,
    ),

    SelectionOption: $ => optional(seq(
      'WITH',
      choice(
        'SUCCESSORS',
        'DESCENDANTS',
      ),
    )),

    GlobalModuleReference: $ => seq(
      $.modulereference,
      $.AssignedIdentifier,
    ),

    AssignedIdentifier: $ => optional(choice(
      $.ObjectIdentifierValue,
      $.DefinedValue,
    )),

    ObjectIdentifierValue: $ => seq(
      '{',
      optional($.DefinedValue),
      $.ObjIdComponentsList,
      '}',
    ),

    DefinedValue: $ => choice(
      $.ExternalValueReference,
      $.valuereference,
      $.ParameterizedValue,
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
      prec(1, $.ObjectClassAssignment),
      $.TypeAssignment,
      $.ObjectSetAssignment,
      $.ValueSetTypeAssignment,
      $.ValueAssignment,
      $.ObjectAssignment,
      $.XMLValueAssignment,
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

    ParameterizedObjectClass: $ => choice(
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

    VariableTypeValueFieldSpec: $ => choice(
      alias($.lowercased_field_ref, 'valuefieldreference'),
      $.FieldName,
      optional($.ValueOptionalitySpec),
    ),

    FixedTypeValueSetFieldSpec: $ => choice(
      alias($.uppercased_field_ref, 'valuesetfieldreference'),
      $.Type,
      optional($.ValueSetOptionalitySpec),
    ),

    VariableTypeValueSetFieldSpec: $ => choice(
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

    EncodingControlSections: $ => repeat($.EncodingControlSections),

    EncodingControlSection: $ => seq(
      'ENCODING-CONTROL',
      $.encodingreference,
      $.EncodingInstructionAssignmentList,
    ),

    EncodingInstructionAssignmentList: $ => choice(
      token(prec(-1, /(?:(?!\bEND\b)[^])+/)),
      token(prec(-1, /(?:(?!\bENCODING-CONTROL\b)[^])+/))
    ),

    // FIXME:
    Value: $ => choice(),
    Type: $ => choice(),
    Object: $ => choice(),
    ObjectSet: $ => choice(),
    ValueSet: $ => choice(),

    // TODO: Stuff to clean up

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

  },

});
