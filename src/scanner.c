/**
 * External scanner for tree-sitter-asn1.
 *
 * 1) IMPORTS AssignedIdentifier (DefinedValue form):
 *    After `FROM Modulereference`, a lowercased identifier may be either:
 *      - AssignedIdentifier (e.g. `informationFramework` then next Symbol), or
 *      - the first Symbol of the next SymbolsFromModule (e.g. `bitStringMatch,`).
 *    Reject the AssignedIdentifier token when the follower is `,` or `FROM`.
 *
 * 2) Parameter bare dummy vs ParamGovernor:
 *    Zero-width tokens decide whether a Parameter has a depth-0 `:` before
 *    `,` / `}` (governed) or not (bare DummyReference). Type stays in grammar.js.
 */

#include "tree_sitter/parser.h"

enum TokenType {
  ASSIGNED_IDENTIFIER_DEFINED_VALUE,
  BARE_PARAMETER,
  GOVERNED_PARAMETER,
  ERROR_SENTINEL,
};

static inline void advance(TSLexer *lexer) {
  lexer->advance(lexer, false);
}

static inline void skip(TSLexer *lexer) {
  lexer->advance(lexer, true);
}

static bool is_space(int32_t c) {
  return c == ' ' || c == '\t' || c == '\r' || c == '\n' || c == '\f' || c == '\v';
}

static bool is_alnum(int32_t c) {
  return (c >= 'a' && c <= 'z') ||
         (c >= 'A' && c <= 'Z') ||
         (c >= '0' && c <= '9');
}

static bool is_id_continue(int32_t c) {
  return is_alnum(c) || c == '-';
}

/**
 * Skip whitespace and ASN.1 comments.
 * before_token: skip() so leading extras are not part of the token.
 * after mark_end: advance() for peek (avoid skip-after-mark_end end-position bugs).
 */
static void skip_extras(TSLexer *lexer, bool before_token) {
  for (;;) {
    while (is_space(lexer->lookahead)) {
      if (before_token) {
        skip(lexer);
      } else {
        advance(lexer);
      }
    }

    /* Line comment: -- ... (newline or closing --) */
    if (lexer->lookahead == '-') {
      if (before_token) {
        skip(lexer);
      } else {
        advance(lexer);
      }
      if (lexer->lookahead != '-') {
        /* Lone '-': not a comment. */
        return;
      }
      if (before_token) {
        skip(lexer);
      } else {
        advance(lexer);
      }
      while (!lexer->eof(lexer) && lexer->lookahead != '\n' && lexer->lookahead != '\r') {
        if (lexer->lookahead == '-') {
          if (before_token) {
            skip(lexer);
          } else {
            advance(lexer);
          }
          if (lexer->lookahead == '-') {
            if (before_token) {
              skip(lexer);
            } else {
              advance(lexer);
            }
            break;
          }
          continue;
        }
        if (before_token) {
          skip(lexer);
        } else {
          advance(lexer);
        }
      }
      continue;
    }

    /* Block comment: slash-star ... star-slash */
    if (lexer->lookahead == '/') {
      if (before_token) {
        skip(lexer);
      } else {
        advance(lexer);
      }
      if (lexer->lookahead != '*') {
        return;
      }
      if (before_token) {
        skip(lexer);
      } else {
        advance(lexer);
      }
      while (!lexer->eof(lexer)) {
        if (lexer->lookahead == '*') {
          if (before_token) {
            skip(lexer);
          } else {
            advance(lexer);
          }
          if (lexer->lookahead == '/') {
            if (before_token) {
              skip(lexer);
            } else {
              advance(lexer);
            }
            break;
          }
          continue;
        }
        if (before_token) {
          skip(lexer);
        } else {
          advance(lexer);
        }
      }
      continue;
    }

    break;
  }
}

/** Match lowercased_identifier: [a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)* */
static bool scan_lowercased_identifier(TSLexer *lexer) {
  if (lexer->lookahead < 'a' || lexer->lookahead > 'z') {
    return false;
  }
  advance(lexer);

  for (;;) {
    while (is_alnum(lexer->lookahead)) {
      advance(lexer);
    }
    if (lexer->lookahead == '-') {
      advance(lexer);
      if (!is_alnum(lexer->lookahead)) {
        return false;
      }
      continue;
    }
    break;
  }
  return true;
}

static bool follower_is_comma_or_from(TSLexer *lexer) {
  skip_extras(lexer, false);

  if (lexer->lookahead == ',') {
    return true;
  }

  /* Keyword FROM (not an identifier that merely starts with FROM). */
  if (lexer->lookahead != 'F') {
    return false;
  }
  advance(lexer);
  if (lexer->lookahead != 'R') {
    return false;
  }
  advance(lexer);
  if (lexer->lookahead != 'O') {
    return false;
  }
  advance(lexer);
  if (lexer->lookahead != 'M') {
    return false;
  }
  advance(lexer);
  return !is_id_continue(lexer->lookahead);
}

/** Skip a "cstring" with "" escapes. Assumes lookahead is '"'. */
static void skip_cstring(TSLexer *lexer) {
  advance(lexer); /* opening " */
  while (!lexer->eof(lexer)) {
    if (lexer->lookahead == '"') {
      advance(lexer);
      if (lexer->lookahead == '"') {
        advance(lexer); /* escaped "" */
        continue;
      }
      return;
    }
    advance(lexer);
  }
}

/**
 * Look ahead from the start of a Parameter for a depth-0 ':'.
 * Returns true if governed (ParamGovernor ':' DummyReference), false if bare.
 */
static bool parameter_is_governed(TSLexer *lexer) {
  int brace_depth = 0;
  int bracket_depth = 0;
  int paren_depth = 0;

  while (!lexer->eof(lexer)) {
    /* Comments / whitespace during peek use advance (after mark_end). */
    if (is_space(lexer->lookahead)) {
      advance(lexer);
      continue;
    }

    if (lexer->lookahead == '-') {
      advance(lexer);
      if (lexer->lookahead == '-') {
        advance(lexer);
        while (!lexer->eof(lexer) && lexer->lookahead != '\n' && lexer->lookahead != '\r') {
          if (lexer->lookahead == '-') {
            advance(lexer);
            if (lexer->lookahead == '-') {
              advance(lexer);
              break;
            }
            continue;
          }
          advance(lexer);
        }
        continue;
      }
      /* Lone '-': treat as ordinary character (e.g. in numbers). */
      continue;
    }

    if (lexer->lookahead == '/') {
      advance(lexer);
      if (lexer->lookahead == '*') {
        advance(lexer);
        while (!lexer->eof(lexer)) {
          if (lexer->lookahead == '*') {
            advance(lexer);
            if (lexer->lookahead == '/') {
              advance(lexer);
              break;
            }
            continue;
          }
          advance(lexer);
        }
        continue;
      }
      continue;
    }

    if (lexer->lookahead == '"') {
      skip_cstring(lexer);
      continue;
    }

    if (lexer->lookahead == '{') {
      brace_depth++;
      advance(lexer);
      continue;
    }
    if (lexer->lookahead == '}') {
      if (brace_depth == 0 && bracket_depth == 0 && paren_depth == 0) {
        return false; /* end of ParameterList */
      }
      if (brace_depth > 0) {
        brace_depth--;
      }
      advance(lexer);
      continue;
    }
    if (lexer->lookahead == '[') {
      bracket_depth++;
      advance(lexer);
      continue;
    }
    if (lexer->lookahead == ']') {
      if (bracket_depth > 0) {
        bracket_depth--;
      }
      advance(lexer);
      continue;
    }
    if (lexer->lookahead == '(') {
      paren_depth++;
      advance(lexer);
      continue;
    }
    if (lexer->lookahead == ')') {
      if (paren_depth > 0) {
        paren_depth--;
      }
      advance(lexer);
      continue;
    }
    if (lexer->lookahead == ',') {
      if (brace_depth == 0 && bracket_depth == 0 && paren_depth == 0) {
        return false; /* next Parameter */
      }
      advance(lexer);
      continue;
    }
    if (lexer->lookahead == ':') {
      if (brace_depth == 0 && bracket_depth == 0 && paren_depth == 0) {
        return true; /* ParamGovernor ':' DummyReference */
      }
      advance(lexer);
      continue;
    }

    advance(lexer);
  }

  return false;
}

void *tree_sitter_asn1_external_scanner_create(void) {
  return NULL;
}

void tree_sitter_asn1_external_scanner_destroy(void *payload) {
  (void)payload;
}

unsigned tree_sitter_asn1_external_scanner_serialize(void *payload, char *buffer) {
  (void)payload;
  (void)buffer;
  return 0;
}

void tree_sitter_asn1_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  (void)payload;
  (void)buffer;
  (void)length;
}

bool tree_sitter_asn1_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  (void)payload;

  /* Error recovery offers every external token; decline. */
  if (valid_symbols[ERROR_SENTINEL]) {
    return false;
  }

  if (valid_symbols[BARE_PARAMETER] || valid_symbols[GOVERNED_PARAMETER]) {
    skip_extras(lexer, true);
    lexer->mark_end(lexer); /* zero-width */

    bool governed = parameter_is_governed(lexer);
    if (governed && valid_symbols[GOVERNED_PARAMETER]) {
      lexer->result_symbol = GOVERNED_PARAMETER;
      return true;
    }
    if (!governed && valid_symbols[BARE_PARAMETER]) {
      lexer->result_symbol = BARE_PARAMETER;
      return true;
    }
    return false;
  }

  if (!valid_symbols[ASSIGNED_IDENTIFIER_DEFINED_VALUE]) {
    return false;
  }

  skip_extras(lexer, true);

  if (!scan_lowercased_identifier(lexer)) {
    return false;
  }

  lexer->mark_end(lexer);

  if (follower_is_comma_or_from(lexer)) {
    return false;
  }

  lexer->result_symbol = ASSIGNED_IDENTIFIER_DEFINED_VALUE;
  return true;
}
