/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Escapes special characters in a string for use in a regular expression.
 * Based on escape-string-regexp package.
 */
export function escapeRegexp(string: string): string {
  // Escape characters with special meaning either inside or outside character
  // sets. Use a simple backslash escape when it's always valid, and a `\xnn`
  // escape when the simpler form would be disallowed by stricter unicodeness.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
