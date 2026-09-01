# 12 ASN.1 lexical items

## 12.1 General rules

### 12.1.1

The following subclauses specify the characters in lexical items. In each case
the name of the lexical item is given, together with the definition of the
character sequences which form the lexical item.

### 12.1.2

The lexical items specified in the subclauses of this clause 12 (except
multiple-line "comment", "bstring", "xmlbstring", "hstring", "xmlhstring",
"cstring", "xmlcstring" and "simplestring") shall not contain white-space (see
12.6, 12.10, 12.11, 12.12, 12.13, 12.14, 12.15 and 12.16). A single-line
"comment" shall not contain "new-line" characters. The "non-integerUnicodeLabel"
lexical item may include the NON-BREAKING-SPACE character.

### 12.1.3

The length of a line is not restricted.

### 12.1.4

Lexical items may be separated by one or more occurrences of white-space (see
12.1.6) or comments (see 12.6) except when the non-spacing indicator "&" (see
5.4) is used. Within an "XMLTypedValue" production (see 16.2), white-space may
appear between lexical items, but the "comment" lexical item shall not be
present.

NOTE – This is to avoid ambiguity resulting from the presence of adjacent
hyphens or asterisk and solidus within an "xmlcstring" lexical item. Such
characters never indicate the start of a "comment" lexical item when they appear
within an "XMLTypedValue" production.

### 12.1.5

A lexical item shall be separated from a following lexical item by one or more
instances of white-space or comment if the initial character (or characters) of
the following lexical item is a permitted character (or characters) for
inclusion at the end of the characters in the earlier lexical item.

### 12.1.6

This Recommendation | International Standard uses the terms "newline", and
"white-space". In representing white-space and newline (end of line) in
machine-readable specifications, any one or more of the following characters may
be used in any combination (for each character, the character name and character
code specified in The Unicode Standard are given):

For white-space:

- HORIZONTAL TABULATION (9)
- LINE FEED (10)
- VERTICAL TABULATION (11)
- FORM FEED (12)
- CARRIAGE RETURN (13)
- SPACE (32)
- NO-BREAK SPACE ({0,0,0,160})

For newline:

- LINE FEED (10)
- VERTICAL TABULATION (11)
- FORM FEED (12)
- CARRIAGE RETURN (13)

NOTE – Any character or character sequence that is a valid newline is also a valid white-space.

## 12.2 Type references

Name of lexical item – typereference

### 12.2.1

A "typereference" shall consist of an arbitrary number (one or more) of letters,
digits, and hyphens. The initial character shall be an upper-case letter. A
hyphen shall not be the last character. A hyphen shall not be immediately
followed by another hyphen.

NOTE – The rules concerning hyphen are designed to avoid ambiguity with
(possibly following) comment.

### 12.2.2

A "typereference" shall not be one of the reserved character sequences listed in
12.38.

## 12.3 Identifiers

Name of lexical item – identifier

An "identifier" shall consist of an arbitrary number (one or more) of letters,
digits, and hyphens. The initial character shall be a lower-case letter. A
hyphen shall not be the last character. A hyphen shall not be immediately
followed by another hyphen.

NOTE – The rules concerning hyphen are designed to avoid ambiguity with
(possibly following) comment.

## 12.4 Value references

Name of lexical item – valuereference

A "valuereference" shall consist of the sequence of characters specified for an
"identifier" in 12.3. In analyzing an instance of use of this notation, a
"valuereference" is distinguished from an "identifier" by the context in which
it appears.

## 12.5 Module references

Name of lexical item – modulereference

A "modulereference" shall consist of the sequence of characters specified for a
"typereference" in 12.2. In analyzing an instance of use of this notation, a
"modulereference" is distinguished from a "typereference" by the context in
which it appears.

## 12.6 Comments

Name of lexical item – comment

### 12.6.1

A "comment" is not referenced in the definition of the ASN.1 notation. It may,
however, appear at any time between other lexical items, and has no syntactic
significance.

NOTE – Nonetheless, in the context of a Recommendation | International Standard
that uses ASN.1, an ASN.1 comment may contain normative text related to the
application semantics, or constraints on the syntax.

### 12.6.2

The lexical item "comment" can have two forms:

1. One-line comments which begin with `--` as defined in 12.6.3;
2. Multiple-line comments which begin with `/*` as defined in 12.6.4.

### 12.6.3

Whenever a "comment" begins with a pair of adjacent hyphens, it shall end with
the next pair of adjacent hyphens or at the end of the line, whichever occurs
first. A comment shall not contain a pair of adjacent hyphens other than the
pair which starts it and the pair, if any, which ends it. If a comment beginning
with `--` includes the adjacent characters `/*` or `*/`, these have no special
meaning and are considered part of the comment. The comment may include graphic
symbols which are not in the character set specified in 11.1 (see 11.3).

### 12.6.4

Whenever a "comment" begins with `/*`, it shall end with a corresponding `*/`,
whether this `*/` is on the same line or not. If another `/*` is found before a
`*/`, then the comment terminates when a matching `*/` has been found for each
`/*`. If a comment beginning with `/*` includes two adjacent hyphens `--`, these
hyphens have no special meaning and are considered part of the comment. The
comment may include graphic symbols which are not in the character set specified
in 11.1 (see 11.3).

NOTE – This allows the user to comment parts of an ASN.1 module that already
contain comments (whether they begin with `--` or `/*`) by simply inserting `/*`
at the beginning of the part to be commented and `*/` at its end, provided there
are no character string values within the part to be commented out that contain
`/*` or `*/`.

## 12.7 Empty lexical item

Name of lexical item – empty

The "empty" item contains no characters. It is used in the notation of clause 5
when alternative sets of production sequences are specified, to indicate that
absence of all alternatives is possible.

## 12.8 Numbers

Name of lexical item – number

A "number" shall consist of one or more digits. The first digit shall not be
zero unless the "number" is a single digit.

NOTE – The "number" lexical item is always mapped to an integer value by
interpreting it as decimal notation.

## 12.9 Real numbers

Name of lexical item – realnumber

A "realnumber" shall consist of an integer part that is a series of one or more
digits, and optionally a decimal point (.). The decimal point can optionally be
followed by a fractional part which is one or more digits. The integer part,
decimal point or fractional part (whichever is last present) can optionally be
followed by an `e` or `E` and an optionally-signed exponent which is one or more
digits. The leading digit of the "realnumber" shall not be zero unless it is
either the only digit or is immediately followed by a decimal point followed by
a fractional part of which at least one digit is not zero. A "number" is also a
valid instance of "realnumber". In analyzing an instance of use of this
notation, a "realnumber" is distinguished from a "number" by the context in
which it appears.

## 12.10 Binary strings

Name of lexical item – bstring

A "bstring" shall consist of an arbitrary number (possibly zero) of the
characters:

```
0 1
```

possibly intermixed with white-space, preceded by an APOSTROPHE (39) character
(`'`) and followed by the pair of characters:

```
'B
```

EXAMPLE – `'01101100'B`

Occurrences of white-space within a binary string lexical item have no
significance.

## 12.11 XML binary string item

Name of item – xmlbstring

An "xmlbstring" shall consist of an arbitrary number (possibly zero) of zeros,
ones or white-space. Any white-space characters that appear within a binary
string item have no significance.

EXAMPLE – `01101100`

This sequence of characters is also a valid instance of "xmlhstring" and
"xmlcstring". In analyzing an instance of use of this notation, an "xmlbstring"
is distinguished from an "xmlhstring" or "xmlcstring" by the context in which it
appears.

## 12.12 Hexadecimal strings

Name of lexical item – hstring

### 12.12.1

An "hstring" shall consist of an arbitrary number (possibly zero) of the characters:

```
A B C D E F 0 1 2 3 4 5 6 7 8 9
```

possibly intermixed with white-space, preceded by an APOSTROPHE (39) character
(`'`) and followed by the pair of characters:

```
'H
```

EXAMPLE – `'AB0196'H`

Occurrences of white-space within a hexadecimal string lexical item have no
significance.

### 12.12.2

Each character is used to denote the value of a semi-octet using a hexadecimal
representation.

## 12.13 XML hexadecimal string item

Name of item – xmlhstring

### 12.13.1

An "xmlhstring" shall consist of an arbitrary number (possibly zero) of the
characters:

```
0123456789ABCDEFabcdef
```

or white-space. Any white-space characters that appear within a hexadecimal
string item have no significance.

EXAMPLE – `Ab0196`

### 12.13.2

Each character is used to denote the value of a semi-octet using a hexadecimal
representation.

### 12.13.3

All instances of "xmlhstring" are also valid instances of "xmlcstring", and some
instances are also valid instances of "xmlbstring". In analyzing an instance of
use of this notation, an "xmlhstring" is distinguished from an "xmlbstring" or
"xmlcstring" by the context in which it appears.

## 12.14 Character strings

Name of lexical item – cstring

### 12.14.1

A "cstring" shall consist of an arbitrary number (possibly zero) of graphic
symbols and spacing characters from the character set referenced by the
character string type, preceded and followed by a QUOTATION MARK (34) character
(`"`). If the character set includes a QUOTATION MARK (34) character, this
character (if present in the character string being represented by the
"cstring") shall be represented in the "cstring" by a pair of QUOTATION MARK
(34) characters on the same line with no intervening spacing character. The
"cstring" may span more than one line of text, in which case the character
string being represented shall not include spacing characters in the position
prior to or following the end of line in the "cstring". Any spacing characters
that appear immediately prior to or following the end of line in the "cstring"
have no significance.

NOTE 1 – The "cstring" can only be used to unambiguously represent (on a printed
page) character strings for which every character in the string being
represented has either been assigned a graphic symbol, or is a spacing
character. Where a character string containing control characters needs to be
denoted in a printed representation, alternative ASN.1 syntax is available (see
clause 39).

NOTE 2 – The character string represented by a "cstring" consists of the
characters associated with the graphic symbols and spacing characters. Spacing
characters immediately preceding or following any end of line in the "cstring"
are not part of the character string being represented (they are ignored). Where
spacing characters are included in the "cstring", or where the graphic symbols
in the character repertoire are not unambiguous in a printed representation, the
character string denoted by "cstring" may be ambiguous in that printed
representation.

EXAMPLE 1 –

```
"
"
```

EXAMPLE 2 – The "cstring":

```
"ABCDE
FGH
IJK""XYZ"
```

can be used to represent a character string value of type IA5String. The value
represented consists of the characters:

```
ABCDE
FGHIJK"XYZ
```

where the precise number of spaces intended between E and F can be ambiguous in
a printed representation if a proportional spacing font (such as is used above)
is used in the printed specification, or if the character repertoire contains
multiple spacing characters of different widths.

### 12.14.2

When a character is a combining character (see Annex H) it shall be denoted in a
printed representation of the "cstring" as an individual character. It shall not
be overprinted with the characters with which it combines. (This ensures that
the order of combining characters in the string value is unambiguously defined
in the printed version.)

EXAMPLE – Lower-case "e" and the accent combining character are two characters
in ISO/IEC 10646, and thus a corresponding "cstring" should be printed as two
characters and not as the single character é.

## 12.15 XML character string item

Name of item – xmlcstring

### 12.15.1

An "xmlcstring" shall consist of an arbitrary number (possibly zero) of the
following ISO/IEC 10646 characters:

1. HORIZONTAL TABULATION (9);
2. LINE FEED (10);
3. CARRIAGE RETURN (13);
4. any character whose ISO/IEC 10646 character code is in the range 32 (20 hex)
   to 55295 (D7FF hex), inclusive;
5. any character whose ISO/IEC 10646 character code is in the range 57344 (E000
   hex) to 65533 (FFFD hex), inclusive;
6. any character whose ISO/IEC 10646 character code is in the range 65536 (10000
   hex) to 1114111 (10FFFF hex), inclusive.

NOTE – Additional restrictions are imposed by the requirement that the
"xmlcstring", in an instance of use, shall contain only characters permitted by
the governing character string type.

### 12.15.2

The characters `&` (AMPERSAND), `<` (LESS-THAN SIGN) or `>` (GREATER-THAN SIGN)
shall appear only as part of one of the character sequences specified in 12.15.4
or 12.15.5.

### 12.15.3

An "xmlcstring" is used to represent the value of a restricted character string
(see 41.9), and can be used to represent all combinations of ISO/IEC 10646
characters, either directly, or by using the escape sequences specified below.

NOTE 1 – An "xmlcstring" cannot be used to represent characters that are not
present in ISO/IEC 10646, such as some of the control characters which can
appear in GeneralString, nor can it represent characters which might be defined
with ISO/IEC 10646 character codes above 10FFFF hex.

NOTE 2 – The characters LINE FEED (10) and CARRIAGE RETURN (13) and the pair
CARRIAGE RETURN + LINE FEED are not distinguished when processed by conforming
XML processors.

### 12.15.4

If the characters `&` (AMPERSAND), `<` (LESS-THAN SIGN) or `>` (GREATER-THAN
SIGN) are present in an abstract character string value being represented by
"xmlcstring" (see 41.9), they shall be represented in the "xmlcstring" by either

1. the escape sequences specified in 12.15.8; or
2. the escape sequences `&amp;`, `&lt;` or `&gt;` respectively. These escape
   sequences shall not contain white-space (see 12.1.6).

### 12.15.5

If a character with an ISO/IEC 10646 character code in column 1 of Table 3 is
present in the abstract character string value being represented by the
"xmlcstring" (see 41.9), it shall be represented by the character sequence in
column 2 of Table 3. These character sequences shall not contain white-space
(see 12.1.6).

NOTE – This does not include characters with decimal character codes 9, 10, and
13, and all the letters in these character sequences are lower-case.

#### Table 3 – Escape sequences for control characters in an "xmlcstring"

| ISO/IEC 10646 character code | "xmlcstring" representation | ISO/IEC 10646 character code | "xmlcstring" representation |
| --- | --- | --- | --- |
| 0 (0 hex) | `<nul/>` | 17 (11 hex) | `<dc1/>` |
| 1 (1 hex) | `<soh/>` | 18 (12 hex) | `<dc2/>` |
| 2 (2 hex) | `<stx/>` | 19 (13 hex) | `<dc3/>` |
| 3 (3 hex) | `<etx/>` | 20 (14 hex) | `<dc4/>` |
| 4 (4 hex) | `<eot/>` | 21 (15 hex) | `<nak/>` |
| 5 (5 hex) | `<enq/>` | 22 (16 hex) | `<syn/>` |
| 6 (6 hex) | `<ack/>` | 23 (17 hex) | `<etb/>` |
| 7 (7 hex) | `<bel/>` | 24 (18 hex) | `<can/>` |
| 8 (8 hex) | `<bs/>` | 25 (19 hex) | `<em/>` |
| 11 (B hex) | `<vt/>` | 26 (1A hex) | `<sub/>` |
| 12 (C hex) | `<ff/>` | 27 (1B hex) | `<esc/>` |
| 14 (E hex) | `<so/>` | 28 (1C hex) | `<is4/>` |
| 15 (F hex) | `<si/>` | 29 (1D hex) | `<is3/>` |
| 16 (10 hex) | `<dle/>` | 30 (1E hex) | `<is2/>` |
| 31 (1F hex) | `<is1/>` | | |

### 12.15.6

When "xmlcstring" is used within an "XMLTypedValue" (see 16.2) forming part of
an XER encoding (see Rec. ITU-T X.693 | ISO/IEC 8825-4), it may contain adjacent
HYPHEN-MINUS (45) characters. When used within an instance of XML value notation
in an ASN.1 module, it shall not contain two adjacent HYPHEN-MINUS characters.
If this character sequence is present in an abstract character string value
being represented by the "xmlcstring" in an ASN.1 module, then at least one of
the adjacent HYPHEN-MINUS characters shall be represented by the escape
sequences specified in 12.15.8.

### 12.15.7

When "xmlcstring" is used within an "XMLTypedValue" forming part of an XER
encoding (see Rec. ITU-T X.693 | ISO/IEC 8825-4), it may contain adjacent
ASTERISK (42) and SOLIDUS (47) characters in any order. When used within an
instance of XML value notation in an ASN.1 module, it shall not contain adjacent
ASTERISK and SOLIDUS characters (in any order). If this character sequence is
present in an abstract character string value being represented by the
"xmlcstring", then at least one of the adjacent ASTERISK and SOLIDUS characters
shall be represented by the escape sequences specified in 12.15.8.

### 12.15.8

Any character that can appear directly in an "xmlcstring" can also be
represented in the "xmlcstring" by an escape sequence of the form `&#n;` (where
n is the ISO/IEC 10646 character code in decimal notation) or of the form
`&#xn;` (where n is the ISO/IEC 10646 character code in hexadecimal notation).
These escape sequences shall not contain white-space (see 12.1.6).

NOTE 1 – Leading zeros are permitted in the decimal and hexadecimal values of
"n" and both lower-case and upper-case letters "A"-"F" can be used in the
hexadecimal value.

NOTE 2 – If the escape sequences `&#n` and `&#xn` are used for ISO/IEC 10646
characters which are not in the Basic Multilingual Plane (BMP), the value of "n"
will be greater than 65535 (FFFF hex).

EXAMPLE – The "xmlcstring":

```
ABCD&#233; FGH&#xEE;JK&amp;XYZ
```

can be used to represent a character string value of type UTF8String. The value
represented consists of the characters:

```
ABCDé FGHîJK&XYZ
```

where the precise space characters between é and F can be ambiguous in print
media if a proportional spacing font (such as above) is used in the
specification.

## 12.16 The simple character string lexical item

Name of item – simplestring

A "simplestring" shall consist of one or more ISO/IEC 10646 characters whose
character code is in the range 32 to 126, preceded and followed by a QUOTATION
MARK (34) character (`"`). It shall not contain a QUOTATION MARK (34) character
(`"`). The "simplestring" may span more than one line of text, in which case any
characters representing end-of-line shall be treated as spacing characters. In
analyzing an instance of use of this notation, a "simplestring" is distinguished
from a "cstring" by the context in which it appears.

NOTE – The "simplestring" lexical item is only used in the subtype notation of
the time type.

## 12.17 Time value character strings

Name of item – tstring

A "tstring" shall consist of one or more of the characters:

```
0 1 2 3 4 5 6 7 8 9 + - : . , / C D H M R P S T W Y Z
```

preceded and followed by a QUOTATION MARK (34) character (`"`).

NOTE – The "tstring" lexical item is only used in the value notation for the
time type.

## 12.18 XML time value character string item

Name of item – xmltstring

An "xmltstring" shall consist of one or more of the characters:

```
0 1 2 3 4 5 6 7 8 9 + - : . , / C D H M R P S T W Y Z
```

NOTE – The "xmltstring" lexical item is only used in the XML value notation of
the time type.

## 12.19 The property and setting names lexical item

Name of item – psname

A "psname" shall consist of an arbitrary number (one or more) of letters, digits
and hyphens. The initial character shall be an upper-case letter. A hyphen shall
not be the last character. A hyphen shall not be immediately followed by another
hyphen.

NOTE – The "psname" lexical item is only used in the contents of the
"simplestring" used in the subtype notation for the time type.

## 12.20 Assignment lexical item

Name of lexical item – `::=`

This lexical item shall consist of the sequence of characters:

```
::=
```

NOTE – This sequence does not contain white-space (see 12.1.2).

## 12.21 Range separator

Name of lexical item – `..`

This lexical item shall consist of the sequence of characters:

```
..
```

NOTE – This sequence does not contain white-space (see 12.1.2).

## 12.22 Ellipsis

Name of lexical item – `...`

This lexical item shall consist of the sequence of characters:

```
...
```

NOTE – This sequence does not contain white-space (see 12.1.2).

## 12.23 Left version brackets

Name of lexical item – `[[`

This lexical item shall consist of the sequence of characters:

```
[[
```

NOTE – This sequence does not contain white-space (see 12.1.2).

## 12.24 Right version brackets

Name of lexical item – `]]`

This lexical item shall consist of the sequence of characters:

```
]]
```

NOTE – This sequence does not contain white-space (see 12.1.2).

## 12.25 Encoding references

Name of item – encodingreference

An "encodingreference" shall consist of a sequence of characters as specified
for a "typereference" in 12.2, except that no lower-case letters shall be
included.

NOTE – Currently defined encoding references are listed in Annex E with the
Recommendation | International Standard that specifies the syntax and semantics
of the corresponding encoding instructions. The "encodingreference" shall
consist only of the sequences listed in Annex E in this or in future versions of
this Recommendation | International Standard.

## 12.26 Integer-valued Unicode labels

Name of lexical item – integerUnicodeLabel

This lexical item shall consist of an arbitrarily long sequence of ISO/IEC 10646
characters in the range 0 (DIGIT ZERO) to 9 (DIGIT NINE) that identify an arc of
the International Object Identifier tree. It shall not commence with a 0 (DIGIT
ZERO) character unless it has only a single character and the primary integer
value of the associated arc of the International Object Identifier tree is zero.

## 12.27 Non-integer Unicode labels

Name of lexical item – non-integerUnicodeLabel

This lexical item shall consist of an arbitrarily long sequence of ISO/IEC 10646
characters that satisfies the constraints specified in Rec. ITU-T X.660 | ISO
9834-1, 7.5 and identifies an arc of the International Object Identifier tree.
For lexical parsing purposes, it shall not consist only of characters that would
enable it to be identified as an "integerUnicodeLabel".

## 12.28 XML end tag start item

Name of item – `</`

This item shall consist of the sequence of characters:

```
</
```

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.29 XML single tag end item

Name of item – `/>`

This item shall consist of the sequence of characters:

```
/>
```

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.30 XML boolean true item

Name of item – `"true"`

### 12.30.1

This item shall consist of the sequence of characters:

```
true
```

### 12.30.2

In analyzing an instance of use of this notation, a "true" is distinguished from
a "valuereference" or an "identifier" or an instance of XML boolean
"extended-true" by the context in which it appears.

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.31 XML boolean extended-true item

Name of item – extended-true

### 12.31.1

This item shall consist of either the sequence of characters:

```
true
```

or of the single character:

```
1
```

(DIGIT ONE)

### 12.31.2

In analyzing an instance of use of this notation, an "extended-true" is
distinguished from a "valuereference" or an "identifier" or an instance of XML
boolean "true" by the context in which it appears.

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.32 XML boolean false item

Name of item – `"false"`

### 12.32.1

This item shall consist of the sequence of characters:

```
false
```

### 12.32.2

In analyzing an instance of use of this notation, a "false" is distinguished
from a "valuereference" or an "identifier" or an instance of XML boolean
"extended-false" by the context in which it appears.

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.33 XML boolean extended-false item

Name of item – extended-false

### 12.33.1

This item shall consist of either the sequence of characters:

```
false
```

or of the single character:

```
0
```

(DIGIT ZERO)

### 12.33.2

In analyzing an instance of use of this notation, a "false" is distinguished
from a "valuereference" or an "identifier" or an instance of XML boolean "false"
by the context in which it appears.

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.34 XML real not-a-number item

Name of item – `"NaN"`

### 12.34.1

This item shall consist of the sequence of characters:

```
NaN
```

### 12.34.2

In analyzing an instance of use of this notation, a "NaN" is distinguished from
any other lexical item commencing with an upper-case letter by the context in
which it appears.

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.35 XML real infinity item

Name of item – `"INF"`

### 12.35.1

This item shall consist of the sequence of characters:

```
INF
```

### 12.35.2

In analyzing an instance of use of this notation, an "INF" is distinguished from
any other lexical item commencing with an upper-case letter by the context in
which it appears.

NOTE – This sequence does not contain any white-space characters (see 12.1.2).

## 12.36 XML tag names for ASN.1 types

Name of item – xmlasn1typename

### 12.36.1

This Recommendation | International Standard uses the item "xmlasn1typename"
when ASN.1 built-in types are to be used as XML tag names.

### 12.36.2

Table 4 lists the character sequences that are to form the "xmlasn1typename" for
each of the ASN.1 built-in types listed in 17.2. The ASN.1 built-in type is
identified in column 1 of Table 4 by its production name. The character sequence
which shall be used for "xmlasn1typename" is identified in column 2 of Table 4,
with no white-space before or after these character sequences.

### 12.36.3

The "xmlasn1typename" for the "UsefulType"s (see 45.1) shall be the
"typereference" used in their definition.

### 12.36.4

The character sequence in the "xmlasn1typename" item for the
"ObjectClassFieldType" and for the "InstanceOfType" are specified in Rec. ITU-T
X.681 | ISO/IEC 8824-2, 14.1 and Annex C.

### 12.36.5

If the ASN.1 built-in type is a "PrefixedType" then the type which determines
the "xmlasn1typename" shall be "Type" in the "PrefixedType" (see 31.1.5). If
this is itself a "PrefixedType", then this subclause 12.36.5 shall be
recursively applied.

NOTE – The subclauses of 26.10 specify the "Type" to be used for a
"SelectionType" and a "ConstrainedType".

#### Table 4 – Characters in xmlasn1typename

| ASN.1 type production name | Characters in xmlasn1typename |
| --- | --- |
| BitStringType | BIT_STRING |
| BooleanType | BOOLEAN |
| ChoiceType | CHOICE |
| DateType | DATE |
| DateTimeType | DATE_TIME |
| DurationType | DURATION |
| EmbeddedPDVType | SEQUENCE |
| EnumeratedType | ENUMERATED |
| ExternalType | SEQUENCE |
| InstanceOfType | SEQUENCE |
| IntegerType | INTEGER |
| IRIType | OID_IRI |
| NullType | NULL |
| ObjectClassFieldType | See Rec. ITU-T X.681 \| ISO/IEC 8824-2, 14.10 and 14.11 |
| ObjectIdentifierType | OBJECT_IDENTIFIER |
| OctetStringType | OCTET_STRING |
| PrefixedType | See 12.36.5 |
| RealType | REAL |
| RelativeIRIType | RELATIVE_OID_IRI |
| RelativeOIDType | RELATIVE_OID |
| RestrictedCharacterStringType | The type name (e.g. IA5String) |
| SequenceType | SEQUENCE |
| SequenceOfType | SEQUENCE_OF |
| SetType | SET |
| SetOfType | SET_OF |
| TimeType | TIME |
| TimeOfDayType | TIME_OF_DAY |
| UnrestrictedCharacterStringType | SEQUENCE |

## 12.37 Single character lexical items

Names of lexical items –

- `{`
- `}`
- `<`
- `>`
- `,`
- `.`
- `/`
- `(`
- `)`
- `[`
- `]`
- `-` (HYPHEN-MINUS)
- `:`
- `=`
- `"` (QUOTATION MARK)
- `'` (APOSTROPHE)
- `;`
- `@`
- `|`
- `!`
- `^`

A lexical item with any of the names listed above shall consist of the single
character without the quotation marks.

## 12.38 Reserved words

Names of reserved words –

- `ABSENT`
- `ABSTRACT-SYNTAX`
- `ALL`
- `APPLICATION`
- `AUTOMATIC`
- `BEGIN`
- `BIT`
- `BMPString`
- `BOOLEAN`
- `BY`
- `CHARACTER`
- `CHOICE`
- `CLASS`
- `COMPONENT`
- `COMPONENTS`
- `CONSTRAINED`
- `CONTAINING`
- `DATE`
- `DATE-TIME`
- `DEFAULT`
- `DEFINITIONS`
- `DURATION`
- `EMBEDDED`
- `ENCODED`
- `ENCODING-CONTROL`
- `END`
- `ENUMERATED`
- `EXCEPT`
- `EXPLICIT`
- `EXPORTS`
- `EXTENSIBILITY`
- `EXTERNAL`
- `FALSE`
- `FROM`
- `GeneralizedTime`
- `GeneralString`
- `GraphicString`
- `IA5String`
- `IDENTIFIER`
- `IMPLICIT`
- `IMPLIED`
- `IMPORTS`
- `INCLUDES`
- `INSTANCE`
- `INSTRUCTIONS`
- `INTEGER`
- `INTERSECTION`
- `ISO646String`
- `MAX`
- `MIN`
- `MINUS-INFINITY`
- `NOT-A-NUMBER`
- `NULL`
- `NumericString`
- `OBJECT`
- `ObjectDescriptor`
- `OCTET`
- `OF`
- `OID-IRI`
- `OPTIONAL`
- `PATTERN`
- `PDV`
- `PLUS-INFINITY`
- `PRESENT`
- `PrintableString`
- `PRIVATE`
- `REAL`
- `RELATIVE-OID`
- `RELATIVE-OID-IRI`
- `SEQUENCE`
- `SET`
- `SETTINGS`
- `SIZE`
- `STRING`
- `SYNTAX`
- `T61String`
- `TAGS`
- `TeletexString`
- `TIME`
- `TIME-OF-DAY`
- `TRUE`
- `TYPE-IDENTIFIER`
- `UNION`
- `UNIQUE`
- `UNIVERSAL`
- `UniversalString`
- `UTCTime`
- `UTF8String`
- `VideotexString`
- `VisibleString`
- `WITH`

Lexical items with the above names shall consist of the sequence of characters
in the name, and are reserved character sequences.

NOTE 1 – White-space does not occur in these sequences.

NOTE 2 – The keywords CLASS, CONSTRAINED, CONTAINING, ENCODED, INSTANCE, SYNTAX
and UNIQUE are not used in this Recommendation | International Standard; they
are used in Rec. ITU-T X.681 | ISO/IEC 8824-2, Rec. ITU-T X.682 | ISO/IEC 8824-3
and Rec. ITU-T X.683 | ISO/IEC 8824-4.
