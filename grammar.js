/**
 * @file Abstract Syntax Notation
 * @author Jonathan M. Wilbur <jonathan@wilbur.space>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "asn1",

  // Keyword extraction matches this token first, then checks whether the
  // captured text is a keyword. It must consume a complete mixed-case
  // identifier (Tail, BMPString). All-caps keywords such as SEQUENCE do not
  // match this pattern, so they stay ordinary string tokens and do not collide
  // with yellcased_identifier (objectclassreference).
  word: $ => $.uppercased_identifier,

  inline: $ => [
    $.modulereference,
    $.valuereference,
    $._upper_name,
  ],

  // AssignedIdentifier DefinedValue vs next Symbol needs comma/FROM peek.
  // Parameter bare dummy vs ParamGovernor needs ':' peek (brace-aware).
  // foreign_lexical_item covers encoding control section notation that is not
  // built from X.680 lexical items. Keep this order in sync with the TokenType
  // enum in src/scanner.c.
  externals: $ => [
    $._assigned_identifier_defined_value,
    $._bare_parameter,
    $._governed_parameter,
    $.foreign_lexical_item,
    $.error_sentinel,
  ],

  // TODO: Is this going to slow down the parser a lot or cause errors?
  conflicts: $ => [
    [$.UsefulType, $.DefinedType],
    // All-caps names can be types, modules, or object classes; mixed-case names
    // share the word token. Disambiguate those overlapping non-terminals here.
    [$.DefinedObjectClass, $.DefinedType, $.UsefulType],
    // [$.ObjIdComponents, $.DefinedValue, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.DefinedType],
    [$.Literal, $.objectsetreference, $.DefinedType, $.UsefulType],
    [$.Literal, $.DefinedType, $.UsefulType],
    // [$.DefinedValue, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.DefinedType],
    // [$.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.DefinedType],
    [$.NameForm, $.ObjIdComponents],
    // [$.NameForm, $.ObjIdComponents, $.DefinedValue],
    [$.ObjIdComponents, $.DefinedValue, $.objectreference],
    // [$.NameForm, $.ObjIdComponents, $.DefinedValue, $.objectreference],
    [$.DefinedValue, $.objectreference],
    [$.DefinedObjectClass, $.objectsetreference, $.DefinedType],
    // [$.ExternalObjectClassReference, $.objectsetreference, $.DefinedType],
    [$.DefinedObjectClass, $.objectsetreference, $.DefinedType, $.UsefulType],
    // [$.DefinedValue, $.DefinedObjectClass, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.DefinedType],
    // [$.DefinedObjectClass, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.DefinedType],
    // [$.ObjIdComponents, $.DefinedValue, $.DefinedObjectClass, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.DefinedType],
    [$.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference],
    // [$.ExternalObjectClassReference, $.DefinedType],
    [$.ExternalObjectClassReference, $.objectsetreference],
    [$.objectsetreference, $.ExternalTypeReference],
    [$.objectsetreference, $.DefinedType, $.UsefulType],
    [$.BitStringValue, $.SequenceValue, $.SequenceOfValue, $.SetValue, $.SetOfValue],
    [$.ObjIdComponents, $.SignedNumber, $.NumberForm],
    [$.SignedNumber, $.Group, $.TableColumn],
    [$.RestrictedCharacterStringValue, $.CharsDefn], // TODO: I feel like this can be fixed.
    [$.EnumeratedValue, $.NamedValue],
    [$.EnumeratedValue, $.IdentifierList],

    // TODO: AI generated these. Review if these are needed.
    [$.ReferencedValue, $.CharsDefn],
    [$.ValueList, $.Setting],
    [$.ValueFromObject, $.ObjectSetFromObjects, $.ObjectFromObject, $.TypeFromObject],
    [$.ComponentValueList, $.NamedValueList],
    [$.ObjectSetElements, $.Setting],
    [$.BitStringValue, $.OctetStringValue],
    [$.Setting, $.TypeConstraint],
    [$.ObjectSetElements, $.Setting],
    [$.ObjectSetElements, $.ComponentRelationConstraint],
    [$.ElementSetSpecs, $.ObjectSetSpec],
    [$.ObjIdComponents, $.NumberForm],
    [$.ExtensionAdditions, $.ExtensionAdditionList],
    [$.BitStringType],
    [$.SequenceValue, $.SetValue],
    [$.SequenceOfValue, $.SetOfValue],
    [$.ValueList, $.Setting],
    [$.SingleValue, $.Setting, $.ValueList],
    [$.ValueFromObject, $.ObjectFromObject, $.TypeFromObject],
    [$.ValueFromObject, $.TypeFromObject],
    [$.Group, $.TableColumn],
    [$.ValueFromObject, $.ObjectFromObject],
    [$.ReferencedValue, $.RelativeOIDComponents, $.NumberForm, $.CharsDefn],
    [$.ReferencedValue, $.RelativeOIDComponents, $.NumberForm],
    // [$.SignedNumber, $.NumberForm],
    [$.RelativeOIDComponents, $.NumberForm],
    [$.ObjIdComponents, $.ExternalValueReference],
    [$.ObjIdComponents, $.DefinedValue],
    [$.ReferencedObjects, $.Object],
    [$.objectsetreference, $.DefinedType],
    [$.XMLTypedValue, $.XMLValueOrEmpty],
    [$.XMLValueList],
    [$.XMLNamedValue, $.XMLValueOrEmpty, $.XMLChoiceValue],
    [$.XMLTypedValue, $.XMLValueOrEmpty, $.XMLDelimitedItem],
    [$.XMLNamedValue, $.XMLValueOrEmpty],
    [$.XMLValueOrEmpty, $.XMLDelimitedItem],
    [$.XMLNamedValue, $.XMLChoiceValue],
    [$.XMLTypedValue, $.XMLDelimitedItem],

    // Comma after a list item can continue the list or start "...".
    // prec.right always continued the list and rejected valid extension markers.
    [$.ComponentTypeList],
    [$.Enumeration],
    [$.AlternativeTypeList],

    [$.identifier, $.DefinedValue, $.objectreference],
    [$.identifier, $.DefinedValue],
    [$.identifier, $.NameForm, $.ObjIdComponents, $.DefinedValue, $.objectreference],
    [$.identifier, $.ObjIdComponents, $.DefinedValue, $.objectreference],
    [$.identifier, $.NameForm],
    [$.identifier, $.NameForm, $.ObjIdComponents, $.DefinedValue],

    [$.DefinedObjectClass, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.DefinedValue, $.DefinedObjectClass, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.DefinedObjectClass, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.DefinedValue, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.ExternalObjectClassReference, $.ExternalTypeReference],
    [$.ObjIdComponents, $.DefinedValue, $.DefinedObjectClass, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.ObjIdComponents, $.DefinedValue, $.ExternalObjectClassReference, $.ExternalObjectReference, $.ExternalObjectSetReference, $.objectsetreference, $.ExternalTypeReference],
    [$.DefinedType],
    [$.ExternalObjectClassReference, $.objectsetreference, $.ExternalTypeReference],
  ],

  extras: $ => [
    /\s+/,
    $.line_comment,
    $.block_comment,
  ],

  rules: {
    source_file: $ => repeat($.ModuleDefinition),

    // TODO: This should prevent terminal hyphens. Apply it to other identifiers.
    // All-caps identifiers: object class names, WITH SYNTAX words, and type or
    // module names that happen to be all-caps.
    yellcased_identifier: $ => /[A-Z][A-Z0-9]*(-[A-Z0-9]+)*/,

    // Mixed-case identifiers (at least one lowercase letter). Used as `word` so
    // Tail is not split into T + ail during keyword extraction. Each hyphen must
    // be followed by an alphanumeric, which rules out both a trailing hyphen and
    // `--`, so INTEGER--comment is not one token. The segment before the first
    // lowercase letter is restricted to uppercase and digits; that is what keeps
    // this disjoint from yellcased_identifier.
    uppercased_identifier: $ => /[A-Z](-?[A-Z0-9])*-?[a-z](-?[A-Za-z0-9])*/,

    // Type and module names may be all-caps or mixed-case; object class names
    // may only be all-caps (yellcased_identifier).
    _upper_name: $ => choice($.yellcased_identifier, $.uppercased_identifier),
    lowercased_identifier: $ => /[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,

    uppercased_field_ref: $ => /&[A-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,
    lowercased_field_ref: $ => /&[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,
    anycased_field_ref: $ => /&[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,
    any_identifier: $ => /[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*/,
    identifier: $ => $.lowercased_identifier,
    // identifier: $ => alias($.lowercased_identifier, $.identifier),
    // identifier: $ => /[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*/,

    DEFINITIONS: $ => 'DEFINITIONS',
    BEGIN: $ => 'BEGIN',
    // No token(prec(...)) here: lexical precedence outranks match length, so a
    // raised precedence would cut ENDING into END + ING. At equal length these
    // string tokens already beat yellcased_identifier on match specificity.
    END: $ => 'END',
    ENCODING_CONTROL: $ => 'ENCODING-CONTROL',
    EXPORTS: $ => 'EXPORTS',
    IMPORTS: $ => 'IMPORTS',
    CLASS: $ => 'CLASS',
    WITH: $ => 'WITH',
    SUCCESSORS: $ => 'SUCCESSORS',
    DESCENDANTS: $ => 'DESCENDANTS',
    INSTRUCTIONS: $ => 'INSTRUCTIONS',
    AUTOMATIC: $ => 'AUTOMATIC',
    IMPLIED: $ => 'IMPLIED',
    EXPLICIT: $ => 'EXPLICIT',
    IMPLICIT: $ => 'IMPLICIT',
    ALL: $ => 'ALL',
    TAGS: $ => 'TAGS',
    EXTENSIBILITY: $ => 'EXTENSIBILITY',
    TYPE_IDENTIFIER: $ => 'TYPE-IDENTIFIER',
    ABSTRACT_SYNTAX: $ => 'ABSTRACT-SYNTAX',
    UNIQUE: $ => 'UNIQUE',
    FROM: $ => 'FROM',
    SYNTAX: $ => 'SYNTAX',
    CONTAINING: $ => 'CONTAINING',
    NULL: $ => 'NULL',
    TRUE: $ => 'TRUE',
    FALSE: $ => 'FALSE',
    OCTET: $ => 'OCTET',
    STRING: $ => 'STRING',
    BIT: $ => 'BIT',
    SEQUENCE: $ => 'SEQUENCE',
    SET: $ => 'SET',
    OF: $ => 'OF',
    DEFAULT: $ => 'DEFAULT',
    OPTIONAL: $ => 'OPTIONAL',
    PLUS_INFINITY: $ => 'PLUS-INFINITY',
    MINUS_INFINITY: $ => 'MINUS-INFINITY',
    NOT_A_NUMBER: $ => 'NOT-A-NUMBER',
    CHOICE: $ => 'CHOICE',
    COMPONENTS: $ => 'COMPONENTS',
    INTEGER: $ => 'INTEGER',
    ENUMERATED: $ => 'ENUMERATED',
    REAL: $ => 'REAL',
    BMPString: $ => 'BMPString',
    GeneralString: $ => 'GeneralString',
    GraphicString: $ => 'GraphicString',
    IA5String: $ => 'IA5String',
    ISO646String: $ => 'ISO646String',
    NumericString: $ => 'NumericString',
    PrintableString: $ => 'PrintableString',
    TeletexString: $ => 'TeletexString',
    T61String: $ => 'T61String',
    UniversalString: $ => 'UniversalString',
    UTF8String: $ => 'UTF8String',
    VideotexString: $ => 'VideotexString',
    VisibleString: $ => 'VisibleString',
    UNIVERSAL: $ => 'UNIVERSAL',
    APPLICATION: $ => 'APPLICATION',
    PRIVATE: $ => 'PRIVATE',
    CHARACTER: $ => 'CHARACTER',
    EMBEDDED: $ => 'EMBEDDED',
    PDV: $ => 'PDV',
    MIN: $ => 'MIN',
    MAX: $ => 'MAX',
    EXCEPT: $ => 'EXCEPT',
    INTERSECTION: $ => 'INTERSECTION',
    INCLUDES: $ => 'INCLUDES',
    INSTANCE: $ => 'INSTANCE',
    OBJECT: $ => 'OBJECT',
    IDENTIFIER: $ => 'IDENTIFIER',
    UNION: $ => 'UNION',
    PRESENT: $ => 'PRESENT',
    ABSENT: $ => 'ABSENT',
    PATTERN: $ => 'PATTERN',
    SETTINGS: $ => 'SETTINGS',
    ENCODED: $ => 'ENCODED',
    BY: $ => 'BY',
    CONSTRAINED: $ => 'CONSTRAINED',
    SIZE: $ => 'SIZE',
    true: $ => 'true',
    false: $ => 'false',
    xmltrue: $ => '<true/>',
    xmlfalse: $ => '<false/>',
    xmlplusinfinity: $ => '<PLUS-INFINITY/>',
    xmlminusinfinity: $ => '<MINUS-INFINITY/>',
    xmlnotanumber: $ => '<NOT-A-NUMBER/>',
    INF: $ => 'INF',
    NaN: $ => 'NaN',
    BOOLEAN: $ => 'BOOLEAN',
    RELATIVE_OID: $ => 'RELATIVE-OID',
    OID_IRI: $ => 'OID-IRI',
    RELATIVE_OID_IRI: $ => 'RELATIVE-OID-IRI',
    EXTERNAL: $ => 'EXTERNAL',
    TIME: $ => 'TIME',
    DATE: $ => 'DATE',
    DATE_TIME: $ => 'DATE-TIME',
    DURATION: $ => 'DURATION',
    TIME_OF_DAY: $ => 'TIME-OF-DAY',
    COMPONENT: $ => 'COMPONENT',
    ANY: $ => 'ANY',
    DEFINED: $ => 'DEFINED',

    ModuleDefinition: $ => seq(
      $.ModuleIdentifier,
      $.DEFINITIONS,
      optional($.EncodingReferenceDefault),
      optional($.TagDefault),
      optional($.ExtensionDefault),
      '::=',
      $.BEGIN,
      optional($.ModuleBody),
      optional($.EncodingControlSections),
      $.END,
    ),

    EncodingReferenceDefault: $ => seq(
      $.INSTRUCTIONS,
      $.encodingreference,
    ),

    encodingreference: $ => /[A-Z][A-Z0-9\-]+/,

    ModuleIdentifier: $ => prec.right(seq(
      $.modulereference,
      optional($.DefinitiveIdentification),
    )),

    DefinitiveIdentification: $ => prec.right(seq(
      $.DefinitiveOID,
      optional($.IRIValue),
    )),

    DefinitiveOID: $ => seq('{', $.DefinitiveObjIdComponentList, '}'),

    DefinitiveObjIdComponentList: $ => repeat1($.DefinitiveObjIdComponent),

    DefinitiveObjIdComponent: $ => choice(
      // $.NameForm,
      $.DefinitiveNumberForm,
      $.DefinitiveNameAndNumberForm,
    ),

    NameForm: $ => $.lowercased_identifier,
    DefinitiveNumberForm: $ => $.number,
    DefinitiveNameAndNumberForm: $ => prec.right(seq(
      $.lowercased_identifier,
      optional(seq(
        '(',
        $.DefinitiveNumberForm,
        ')',
      )),
    )),

    IRIValue: $ => seq(
      '"',
      /[^"]+/,
      '"',
    ),

    FirstArcIdentifier: $ => seq('/', $.ArcIdentifier),

    modulereference: $ => alias($._upper_name, $.modulereference),
    valuereference: $ => alias($.lowercased_identifier, $.valuereference),

    TagDefault: $ => choice(
      seq($.EXPLICIT, $.TAGS),
      seq($.IMPLICIT, $.TAGS),
      seq($.AUTOMATIC, $.TAGS),
    ),

    ExtensionDefault: $ => seq($.EXTENSIBILITY, $.IMPLIED),

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
      $.EXPORTS,
      choice(
        $.ALL,
        optional($.SymbolsExported),
      ),
      ';',
    ),

    SymbolsExported: $ => $.SymbolList,

    SymbolList: $ => seq(
      $.Symbol,
      repeat(seq(',', $.Symbol))
    ),

    Symbol: $ => $.PossiblyParameterizedReference,

    PossiblyParameterizedReference: $ => seq(
      $.Reference,
      optional(seq('{', '}')),
    ),

    // Reference as a token() with high precedence steals WITH (next import
    // Symbol is also valid). Keep a plain regex; Parameter avoids opening
    // DefinedType so DummyReference does not fight typereference tokens.
    Reference: $ => /[a-zA-Z][a-zA-Z0-9\-]*/,
  
    Imports: $ => prec.right(seq(
      $.IMPORTS,
      repeat($.SymbolsFromModule),
      ';',
    )),

    SymbolsFromModule: $ => seq(
      $.SymbolList,
      $.FROM,
      $.GlobalModuleReference,
      optional($.SelectionOption),
    ),

    SelectionOption: $ => seq(
      $.WITH,
      choice(
        $.SUCCESSORS,
        $.DESCENDANTS,
      ),
    ),

    GlobalModuleReference: $ => seq(
      $.modulereference,
      optional($.AssignedIdentifier),
    ),

    // DefinedValue form is an external token: accept only when the following
    // token is not "," or FROM (those start the next SymbolsFromModule).
    AssignedIdentifier: $ => choice(
      $.ObjectIdentifierValue,
      alias($._assigned_identifier_defined_value, $.DefinedValue),
    ),

    ObjectIdentifierValue: $ => seq('{', $.ObjIdComponentsList, '}'),

    ObjIdComponentsList: $ => repeat1($.ObjIdComponents),

    ObjIdComponents: $ => choice(
      $.number,
      seq($.NameForm, optional(seq('(', $.NumberForm, ')'))),
      seq($.modulereference, '.', $.valuereference, optional($.ActualParameterList)),
      seq($.valuereference, optional($.ActualParameterList)),
    ),

    DefinedValue: $ => prec.right(seq(
      optional(seq($.modulereference, '.')),
      $.valuereference,
      optional($.ActualParameterList),
    )),

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
      $.ObjectClassAssignment,
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

    // Scanner gates bare vs governed so Governor→Type does not steal {ToBeSigned}.
    // _bare_parameter / _governed_parameter are zero-width lookahead tokens.
    Parameter: $ => choice(
      seq($._governed_parameter, $.ParamGovernor, ':', $.DummyReference),
      seq($._bare_parameter, $.DummyReference),
    ),

    ParamGovernor: $ => choice(
      $.Governor,
      alias($.DummyReference, 'DummyGovernor'),
    ),

    Governor: $ => choice(
      $.DefinedObjectClass,
      $.Type,
    ),

    ObjectClass: $ => choice(
      seq($.DefinedObjectClass, optional($.ActualParameterList)),
      $.ObjectClassDefn,
    ),

    DefinedObjectClass: $ => choice(
      prec(1, $.UsefulObjectClassReference),
      $.ExternalObjectClassReference,
      alias($.yellcased_identifier, 'objectclassreference'),
    ),

    UsefulObjectClassReference: $ => choice(
      $.TYPE_IDENTIFIER,
      $.ABSTRACT_SYNTAX,
    ),

    ExternalObjectClassReference: $ => seq(
      $.modulereference,
      '.',
      alias($.yellcased_identifier, 'objectclassreference'),
    ),

    ObjectClassDefn: $ => seq(
      $.CLASS,
      '{',
      $.FieldSpec,
      repeat(seq(',', $.FieldSpec)),
      '}',
      optional($.WithSyntaxSpec),
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
      optional($.UNIQUE),
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
      $.OPTIONAL,
      seq($.DEFAULT, $.Type),
    ),

    ValueOptionalitySpec: $ => choice(
      $.OPTIONAL,
      seq($.DEFAULT, $.Value),
    ),

    ValueSetOptionalitySpec: $ => choice(
      $.OPTIONAL,
      seq($.DEFAULT, $.ValueSet),
    ),

    ObjectOptionalitySpec: $ => choice(
      $.OPTIONAL,
      seq($.DEFAULT, $.Object),
    ),

    ObjectSetOptionalitySpec: $ => choice(
      $.OPTIONAL,
      seq($.DEFAULT, $.ObjectSet),
    ),

    FieldName: $ => seq(
      alias($.anycased_field_ref, 'PrimitiveFieldName'),
      repeat(seq(
        '.',
        alias($.anycased_field_ref, 'PrimitiveFieldName'),
      )),
    ),

    WithSyntaxSpec: $ => seq(
      $.WITH,
      $.SYNTAX,
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
      alias($.anycased_field_ref, 'PrimitiveFieldName'),
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

    // TypeAssignment: $ => seq(
    //   alias($._upper_name, 'typereference'),
    //   optional($.ParameterList),
    //   '::=',
    //   $.Type,
    // ),
    TypeAssignment: $ => choice(
      seq(
        alias($._upper_name, 'typereference'),
        $.ParameterList,
        '::=',
        $.Type,
      ),
      seq(
        alias($._upper_name, 'typereference'),
        '::=',
        $.Type,
      ),
    ),

    ValueSetTypeAssignment: $ => seq(
      alias($._upper_name, 'typereference'),
      optional($.ParameterList),
      $.Type,
      '::=',
      $.ValueSet,
    ),

    ObjectSetAssignment: $ => seq(
      alias($._upper_name, 'objectreference'),
      optional($.ParameterList),
      $.DefinedObjectClass,
      '::=',
      $.ObjectSet,
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
      $.ENCODING_CONTROL,
      $.encodingreference,
      optional($.EncodingInstructionAssignmentList),
    ),

    // The syntax of an encoding control section belongs to whichever
    // specification the encodingreference names (X.691, X.692, X.693, ...), so
    // this grammar only constrains it lexically: anything at all may appear
    // apart from END, which terminates the module, and ENCODING-CONTROL, which
    // starts the next section. Neither is listed below, so both end the list;
    // as string tokens they outrank yellcased_identifier on that same text.
    //
    // The X.680 lexical items (clause 12, transcribed in doc/lexical-items.md)
    // are spelled out so that they keep their own node types here. Notation
    // that X.680 does not describe, such as the `#Outer` encoding class
    // references of X.692, arrives as foreign_lexical_item from the external
    // scanner.
    EncodingInstructionAssignmentList: $ => repeat1(choice(
      $._encoding_instruction_lexical_item,
      $._encoding_instruction_reserved_word,
      $.foreign_lexical_item,
    )),

    // Names (12.2-12.5, 12.25), literals (12.8-12.17) and the single- and
    // multi-character items (12.20-12.24, 12.28, 12.29, 12.37). typereference,
    // modulereference, encodingreference, objectclassreference and psname are
    // all spellings of yellcased_identifier or uppercased_identifier;
    // identifier and valuereference are lowercased_identifier; simplestring
    // and tstring are shapes of cstring.
    _encoding_instruction_lexical_item: $ => choice(
      $.yellcased_identifier,
      $.uppercased_identifier,
      $.lowercased_identifier,
      $.anycased_field_ref,
      $.number,
      $.realnumber,
      $.bstring,
      $.hstring,
      $.cstring,
      '::=',
      '...',
      '..',
      '[[',
      ']]',
      '</',
      '/>',
      '{',
      '}',
      '<',
      '>',
      ',',
      '.',
      '/',
      '(',
      ')',
      '[',
      ']',
      '-',
      ':',
      '=',
      '"',
      "'",
      ';',
      '@',
      '|',
      '!',
      '^',
    ),

    // The reserved words of 12.38, minus END and ENCODING-CONTROL. Words that
    // are not reserved (ANY, DEFINED, INF, NaN, true, false) are deliberately
    // absent: inside an encoding control section they are ordinary names.
    // GeneralizedTime, ObjectDescriptor and UTCTime have no token of their own
    // in this grammar; they lex as uppercased_identifier.
    _encoding_instruction_reserved_word: $ => choice(
      $.ABSENT,
      $.ABSTRACT_SYNTAX,
      $.ALL,
      $.APPLICATION,
      $.AUTOMATIC,
      $.BEGIN,
      $.BIT,
      $.BMPString,
      $.BOOLEAN,
      $.BY,
      $.CHARACTER,
      $.CHOICE,
      $.CLASS,
      $.COMPONENT,
      $.COMPONENTS,
      $.CONSTRAINED,
      $.CONTAINING,
      $.DATE,
      $.DATE_TIME,
      $.DEFAULT,
      $.DEFINITIONS,
      $.DURATION,
      $.EMBEDDED,
      $.ENCODED,
      $.ENUMERATED,
      $.EXCEPT,
      $.EXPLICIT,
      $.EXPORTS,
      $.EXTENSIBILITY,
      $.EXTERNAL,
      $.FALSE,
      $.FROM,
      $.GeneralString,
      $.GraphicString,
      $.IA5String,
      $.IDENTIFIER,
      $.IMPLICIT,
      $.IMPLIED,
      $.IMPORTS,
      $.INCLUDES,
      $.INSTANCE,
      $.INSTRUCTIONS,
      $.INTEGER,
      $.INTERSECTION,
      $.ISO646String,
      $.MAX,
      $.MIN,
      $.MINUS_INFINITY,
      $.NOT_A_NUMBER,
      $.NULL,
      $.NumericString,
      $.OBJECT,
      $.OCTET,
      $.OF,
      $.OID_IRI,
      $.OPTIONAL,
      $.PATTERN,
      $.PDV,
      $.PLUS_INFINITY,
      $.PRESENT,
      $.PrintableString,
      $.PRIVATE,
      $.REAL,
      $.RELATIVE_OID,
      $.RELATIVE_OID_IRI,
      $.SEQUENCE,
      $.SET,
      $.SETTINGS,
      $.SIZE,
      $.STRING,
      $.SYNTAX,
      $.T61String,
      $.TAGS,
      $.TeletexString,
      $.TIME,
      $.TIME_OF_DAY,
      $.TRUE,
      $.TYPE_IDENTIFIER,
      $.UNION,
      $.UNIQUE,
      $.UNIVERSAL,
      $.UniversalString,
      $.UTF8String,
      $.VideotexString,
      $.VisibleString,
      $.WITH,
    ),

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
      $.TRUE,
      $.FALSE
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
    
    number: $ => choice(
      '0',
      /[1-9][0-9]*/,
    ),
    
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
      $.PLUS_INFINITY,
      $.MINUS_INFINITY,
      $.NOT_A_NUMBER
    ),
    
    BitStringValue: $ => choice(
      prec(1, $.bstring),
      prec(1, $.hstring),
      seq('{', $.IdentifierList, '}'),
      seq('{', '}'),
      seq($.CONTAINING, $.Value)
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
      seq($.CONTAINING, $.Value)
    ),
    
    NullValue: $ => prec(1, $.NULL),
    
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
      seq($.DefinedObject, optional($.ActualParameterList)),
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
    
    DefinedObjectSet: $ => choice(
      prec(1, $.ExternalObjectSetReference),
      $.objectsetreference
    ),
    
    ExternalObjectSetReference: $ => seq(
      $.modulereference,
      '.',
      $.objectsetreference
    ),
    
    objectsetreference: $ => $._upper_name,
    
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
      $.DefinedValue,
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
    
    cstring: $ => /"([^"]|"")*"/,
    
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

    Type: $ => prec.right(seq(
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
      $.TimeOfDayType,
      $.AnyType, // From ITU X.680, 1997 edition and earlier.
    ),

    // From ITU X.680, 1997 edition and earlier.
    AnyType: $ => choice(
      $.ANY,
      seq($.ANY, $.DEFINED, $.BY, $.identifier),
    ),

    BooleanType: $ => $.BOOLEAN,

    IntegerType: $ => choice(
      $.INTEGER,
      prec(1, seq($.INTEGER, '{', $.NamedNumberList, '}')),
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
      $.ENUMERATED,
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

    Enumeration: $ => seq(
      $.EnumerationItem,
      repeat(seq(',', $.EnumerationItem))
    ),

    EnumerationItem: $ => choice(
      $.identifier,
      $.NamedNumber
    ),

    RealType: $ => $.REAL,

    BitStringType: $ => choice(
      seq($.BIT, $.STRING),
      seq($.BIT, $.STRING, '{', $.NamedBitList, '}')
    ),

    NamedBitList: $ => seq(
      $.NamedBit,
      repeat(seq(',', $.NamedBit))
    ),

    NamedBit: $ => choice(
      seq($.identifier, '(', $.number, ')'),
      seq($.identifier, '(', $.DefinedValue, ')')
    ),

    OctetStringType: $ => seq($.OCTET, $.STRING),

    NullType: $ => $.NULL,

    SequenceType: $ => choice(
      seq($.SEQUENCE, '{', '}'),
      prec(1,seq($.SEQUENCE, '{', $.ExtensionAndException, optional($.OptionalExtensionMarker), '}')),
      seq($.SEQUENCE, '{', $.ComponentTypeLists, '}')
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

    ComponentTypeList: $ => seq(
      $.ComponentType,
      repeat(seq(',', $.ComponentType)),
    ),

    ComponentType: $ => choice(
      $.NamedType,
      seq($.NamedType, $.OPTIONAL),
      seq($.NamedType, $.DEFAULT, $.Value),
      seq($.COMPONENTS, $.OF, $.Type)
    ),

    NamedType: $ => seq(
      $.identifier,
      $.Type
    ),

    SequenceOfType: $ => choice(
      seq($.SEQUENCE, $.OF, $.Type),
      seq($.SEQUENCE, $.OF, $.NamedType)
    ),

    SetType: $ => choice(
      seq($.SET, '{', '}'),
      seq($.SET, '{', $.ExtensionAndException, optional($.OptionalExtensionMarker), '}'),
      seq($.SET, '{', $.ComponentTypeLists, '}')
    ),

    SetOfType: $ => choice(
      seq($.SET, $.OF, $.Type),
      seq($.SET, $.OF, $.NamedType)
    ),

    ChoiceType: $ => seq(
      $.CHOICE,
      '{',
      $.AlternativeTypeLists,
      '}'
    ),

    AlternativeTypeLists: $ => choice(
      $.RootAlternativeTypeList,
      prec(1, seq($.RootAlternativeTypeList, ',', $.ExtensionAndException, optional($.ExtensionAdditionAlternatives), optional($.OptionalExtensionMarker)))
    ),

    RootAlternativeTypeList: $ => $.AlternativeTypeList,

    ExtensionAdditionAlternatives: $ => seq(',', $.ExtensionAdditionAlternativesList),

    ExtensionAdditionAlternativesList: $ => prec.right(seq(
      $.ExtensionAdditionAlternative,
      repeat(seq(',', $.ExtensionAdditionAlternative)),
    )),

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

    AlternativeTypeList: $ => seq(
      $.NamedType,
      repeat(seq(',', $.NamedType)),
    ),

    ObjectIdentifierType: $ => seq($.OBJECT, $.IDENTIFIER),

    RelativeOIDType: $ => $.RELATIVE_OID,

    IRIType: $ => $.OID_IRI,

    RelativeIRIType: $ => $.RELATIVE_OID_IRI,

    EmbeddedPDVType: $ => seq($.EMBEDDED, $.PDV),

    ExternalType: $ => $.EXTERNAL,

    TimeType: $ => $.TIME,

    DateType: $ => $.DATE,

    TimeOfDayType: $ => $.TIME_OF_DAY,

    DateTimeType: $ => $.DATE_TIME,

    DurationType: $ => $.DURATION,

    CharacterStringType: $ => choice(
      $.RestrictedCharacterStringType,
      $.UnrestrictedCharacterStringType
    ),

    RestrictedCharacterStringType: $ => choice(
      $.BMPString,
      $.GeneralString,
      $.GraphicString,
      $.IA5String,
      $.ISO646String,
      $.NumericString,
      $.PrintableString,
      $.TeletexString,
      $.T61String,
      $.UniversalString,
      $.UTF8String,
      $.VideotexString,
      $.VisibleString
    ),

    UnrestrictedCharacterStringType: $ => seq($.CHARACTER, $.STRING),

    PrefixedType: $ => choice(
      $.TaggedType,
      $.EncodingPrefixedType
    ),

    TaggedType: $ => choice(
      seq($.Tag, $.Type),
      seq($.Tag, $.IMPLICIT, $.Type),
      seq($.Tag, $.EXPLICIT, $.Type)
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
      $.UNIVERSAL,
      $.APPLICATION,
      $.PRIVATE
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

    InstanceOfType: $ => seq($.INSTANCE, $.OF, $.DefinedObjectClass),

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
      seq($.ALL, $.Exclusions)
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

    Exclusions: $ => seq($.EXCEPT, $.Elements),

    UnionMark: $ => choice('|', $.UNION),

    IntersectionMark: $ => choice('^', $.INTERSECTION),

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
      $.INCLUDES, // Non-optional is already handled in SubtypeElements
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
      $.MIN
    ),

    UpperEndValue: $ => choice(
      $.Value,
      $.MAX
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
      seq($.DefinedObject, optional($.ActualParameterList)),
      $.ObjectDefn,
      $.ObjectFromObject,
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
      $.FROM,
      $.Constraint
    ),

    SizeConstraint: $ => seq(
      $.SIZE,
      $.Constraint
    ),

    TypeConstraint: $ => $.Type,

    InnerTypeConstraints: $ => choice(
      seq($.WITH, $.COMPONENT, $.SingleTypeConstraint),
      seq($.WITH, $.COMPONENTS, $.MultipleTypeConstraints)
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
      $.PRESENT,
      $.ABSENT,
      $.OPTIONAL
    ),

    PatternConstraint: $ => seq(
      $.PATTERN,
      $.Value
    ),

    PropertySettings: $ => seq(
      $.SETTINGS,
      /\"[^\"]*\"/
    ),

    TypeWithConstraint: $ => choice(
      seq($.SET, $.Constraint, 'OF', $.Type),
      seq($.SET, $.SizeConstraint, 'OF', $.Type),
      seq($.SEQUENCE, $.Constraint, 'OF', $.Type),
      seq($.SEQUENCE, $.SizeConstraint, 'OF', $.Type),
      seq($.SET, $.Constraint, 'OF', $.NamedType),
      seq($.SET, $.SizeConstraint, 'OF', $.NamedType),
      seq($.SEQUENCE, $.Constraint, 'OF', $.NamedType),
      seq($.SEQUENCE, $.SizeConstraint, 'OF', $.NamedType)
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
      $.CONSTRAINED,
      $.BY,
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
      prec(1, $.ComponentRelationConstraint),
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
      repeat(seq('.', $.identifier))
    ),

    ContentsConstraint: $ => choice(
      seq($.CONTAINING, $.Type),
      seq($.ENCODED, $.BY, $.Value),
      seq($.CONTAINING, $.Type, $.ENCODED, $.BY, $.Value)
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

    // `--` comments end at the next `--` or at end of line, whichever is first.
    line_comment: $ => token(seq('--', /([^-\n]|-[^-\n])*/, optional('--'))),

    XMLTypedValue: $ => choice(
      seq('<', $.NonParameterizedTypeName, '>', $.XMLValue, '</', $.NonParameterizedTypeName, '>'),
      seq('<', $.NonParameterizedTypeName, '/>')
    ),

    // TODO: Convert to choice. optional prefixes don't work.
    NonParameterizedTypeName: $ => seq(
      optional(seq($.modulereference, '.')),
      alias($._upper_name, 'typereference'),
    ),

    XMLValue: $ => choice(
      $.XMLBuiltinValue,
      $.XMLObjectClassFieldValue
    ),

    XMLBuiltinValue: $ => choice(
      $.XMLBitStringValue,
      $.XMLBooleanValue,
      $.XMLCharacterStringValue,
      $.XMLChoiceValue,
      // $.XMLEmbeddedPDVValue,
      // $.XMLEnumeratedValue,
      // $.XMLExternalValue,
      // $.XMLInstanceOfValue,
      $.XMLIntegerValue,
      $.XMLIRIValue,
      $.XMLNullValue,
      $.XMLObjectIdentifierValue,
      $.XMLOctetStringValue,
      $.XMLRealValue,
      $.XMLRelativeIRIValue,
      // $.XMLRelativeOIDValue,
      $.XMLSequenceValue,
      $.XMLSequenceOfValue,
      // $.XMLSetValue,
      // $.XMLSetOfValue,
      // $.XMLPrefixedValue,
      $.XMLTimeValue
    ),

    XMLBooleanValue: $ => choice(
      $.EmptyElementBoolean,
      $.TextBoolean
    ),

    EmptyElementBoolean: $ => choice(
      $.xmltrue,
      $.xmlfalse
    ),

    TextBoolean: $ => choice(
      $.true,
      $.false
    ),

    XMLIntegerValue: $ => choice(
      $.XMLSignedNumber,
      // $.EmptyElementInteger,
      // $.TextInteger
    ),

    XMLSignedNumber: $ => choice(
      // $.number,
      seq('-', $.number)
    ),

    EmptyElementInteger: $ => seq('<', $.identifier, '/>'),

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
      $.xmlplusinfinity,
      $.xmlminusinfinity,
      $.xmlnotanumber
    ),

    TextReal: $ => choice(
      $.INF,
      seq('-', $.INF),
      $.NaN
    ),

    XMLBitStringValue: $ => choice(
      // $.XMLTypedValue,
      $.xmlbstring,
      $.XMLIdentifierList,
    ),

    xmlbstring: $ => /[01]*/,

    XMLIdentifierList: $ => choice(
      $.EmptyElementList,
      $.TextList
    ),

    EmptyElementList: $ => prec.right(repeat1(seq('<', $.identifier, '/>'))),

    TextList: $ => prec.right(repeat1($.identifier)),

    XMLOctetStringValue: $ => choice(
      // $.XMLTypedValue,
      $.xmlhstring
    ),

    xmlhstring: $ => /[0-9A-Fa-f]*/,

    XMLNullValue: $ => '$$$$$BLING_BLING_MISTER_MONEY_BAG$$$$$',

    XMLSequenceValue: $ => choice(
      $.XMLComponentValueList,
    ),

    XMLComponentValueList: $ => prec.right(repeat1($.XMLNamedValue)),

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

    XMLDelimitedItemList: $ => prec.right(repeat1($.XMLDelimitedItem)),

    XMLDelimitedItem: $ => choice(
      seq('<', $.NonParameterizedTypeName, '>', $.XMLValue, '</', $.NonParameterizedTypeName, '>'),
      // seq('<', $.identifier, '>', $.XMLValue, '</', $.identifier, '>')
    ),

    XMLChoiceValue: $ => seq(
      '<', $.identifier, '>', $.XMLValue, '</', $.identifier, '>'
    ),

    XMLObjectClassFieldValue: $ => choice(
      $.XMLOpenTypeFieldVal,
      // $.XMLFixedTypeFieldVal
    ),

    XMLOpenTypeFieldVal: $ => choice(
      $.XMLTypedValue,
      // $.xmlhstring
    ),

    XMLObjectIdentifierValue: $ => $.XMLObjIdComponentList,

    XMLObjIdComponentList: $ => prec.right(seq(
      $.XMLObjIdComponent,
      repeat(seq('.', $.XMLObjIdComponentList))
    )),

    XMLObjIdComponent: $ => choice(
      // $.identifier,
      // $.XMLNumberForm,
      $.XMLNameAndNumberForm
    ),

    XMLNumberForm: $ => $.number,

    XMLNameAndNumberForm: $ => seq(
      $.identifier, '(', $.XMLNumberForm, ')'
    ),

    XMLIRIValue: $ => prec.right(seq(
      $.FirstArcIdentifier, 
      repeat(seq(
        '/',
        $.ArcIdentifier
      )),
    )),

    XMLRelativeIRIValue: $ => prec.right(seq(
      $.FirstRelativeArcIdentifier,
      repeat(seq(
        '/',
        $.ArcIdentifier
      )),
    )),

    XMLTimeValue: $ => $.xmltstring,

    xmltstring: $ => /[0-9:.+\-ZT][0-9:.+\-ZT]*/,

    XMLCharacterStringValue: $ => choice(
      $.XMLRestrictedCharacterStringValue,
      // $.XMLUnrestrictedCharacterStringValue
    ),

    XMLRestrictedCharacterStringValue: $ => $.xmlcstring,

    xmlcstring: $ => /[^<&]*/,  // Simplified, should exclude XML reserved chars

    ReferencedType: $ => choice(
      $.DefinedType,
      $.UsefulType,
      $.SelectionType,
      prec(1, $.TypeFromObject),
    ),

    // DefinedType: $ => prec.right(seq(
    //   optional(seq($.modulereference, '.')),
    //   alias($._upper_name, 'typereference'),
    //   optional($.ActualParameterList),
    // )),
    DefinedType: $ => choice(
      seq(
        $.ExternalTypeReference,
        optional($.ActualParameterList),
      ),
      seq(
        alias($._upper_name, 'typereference'),
        optional($.ActualParameterList),
      ),
    ),

    ExternalTypeReference: $ => seq(
      $.modulereference,
      '.',
      alias($._upper_name, 'typereference')
    ),

    UsefulType: $ => alias($._upper_name, 'typereference'),

    DummyReference: $ => $.Reference,
  },

});
