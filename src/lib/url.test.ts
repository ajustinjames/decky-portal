import { describe, expect, it } from 'vitest';

import { isSafeUrl, normalizeUrl } from './url';

describe('isSafeUrl', () => {
  it('accepts http and https URLs', () => {
    expect(isSafeUrl('https://youtube.com')).toBe(true);
    expect(isSafeUrl('http://192.168.0.10:8096/web')).toBe(true);
  });

  it('rejects dangerous or unsupported schemes', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeUrl('steam://open/settings')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl('not a url')).toBe(false);
    expect(isSafeUrl('youtube.com')).toBe(false);
  });
});

describe('normalizeUrl', () => {
  it('passes through valid http(s) URLs', () => {
    expect(normalizeUrl('https://youtube.com')).toBe('https://youtube.com/');
    expect(normalizeUrl('http://example.com/watch?v=1')).toBe('http://example.com/watch?v=1');
  });

  it('prefixes https:// on bare hostnames', () => {
    expect(normalizeUrl('youtube.com')).toBe('https://youtube.com/');
    expect(normalizeUrl('www.twitch.tv/somestreamer')).toBe('https://www.twitch.tv/somestreamer');
  });

  it('recognises host:port shorthand instead of treating the host as a scheme', () => {
    expect(normalizeUrl('192.168.0.10:8096')).toBe('https://192.168.0.10:8096/');
    expect(normalizeUrl('localhost:3000/app')).toBe('https://localhost:3000/app');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeUrl('  https://youtube.com  ')).toBe('https://youtube.com/');
  });

  it('rejects dangerous schemes rather than prefixing them', () => {
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeUrl('file:///etc/passwd')).toBeNull();
    expect(normalizeUrl('data:text/html,x')).toBeNull();
    expect(normalizeUrl('steam://open/settings')).toBeNull();
  });

  it('rejects empty and unusable input', () => {
    expect(normalizeUrl('')).toBeNull();
    expect(normalizeUrl('   ')).toBeNull();
    expect(normalizeUrl('https://')).toBeNull();
  });
});
