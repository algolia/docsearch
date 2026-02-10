/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Much like `path.join`, but much better. Takes an array of URL segments, and
 * joins them into a reasonable URL.
 *
 * - `["file:", "/home", "/user/", "website"]` => `file:///home/user/website`
 * - `["file://", "home", "/user/", "website"]` => `file://home/user/website` (relative!)
 * - Remove trailing slash before parameters or hash.
 * - Replace `?` in query parameters with `&`.
 * - Dedupe forward slashes in the entire path, avoiding protocol slashes.
 *
 * @throws {TypeError} If any of the URL segment is not a string, this throws.
 */
export declare function normalizeUrl(rawUrls: string[]): string;
