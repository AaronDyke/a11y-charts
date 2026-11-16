// Strict SemVer 2.0.0 without build metadata (npm drops "+build", so tags and versions would disagree).
// Numeric parts and numeric prerelease identifiers have no leading zeros; identifiers are non-empty.
const NUMERIC = '0|[1-9]\\d*';
const IDENTIFIER = `(?:${NUMERIC}|\\d*[A-Za-z-][0-9A-Za-z-]*)`;
const VERSION = new RegExp(`^(?:${NUMERIC})\\.(?:${NUMERIC})\\.(?:${NUMERIC})(?:-${IDENTIFIER}(?:\\.${IDENTIFIER})*)?$`);

export function isReleaseVersion(value) {
  return typeof value === 'string' && VERSION.test(value);
}
