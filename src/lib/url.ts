const ALLOWED_PROTOCOLS = ['http:', 'https:'];

const SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/**
 * True when the string is a well-formed http(s) URL. Everything else —
 * javascript:, file:, data:, steam:, malformed input — is rejected so it
 * never reaches the BrowserView.
 */
export const isSafeUrl = (input: string): boolean => {
  try {
    return ALLOWED_PROTOCOLS.includes(new URL(input).protocol);
  } catch {
    return false;
  }
};

/**
 * Normalizes user-entered text into a safe http(s) URL, or null when the
 * input can't be made safe. Bare hostnames get an https:// prefix; a
 * host:port shorthand like "192.168.0.10:8096" is recognised and prefixed
 * rather than being misread as a "192.168.0.10:" scheme.
 */
export const normalizeUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  let candidate = trimmed;
  if (!SCHEME_PATTERN.test(candidate) || /^[^/:]+:\d/.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol) || !parsed.hostname) {
    return null;
  }

  return parsed.href;
};
