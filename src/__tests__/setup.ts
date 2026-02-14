import React from 'react';
import { beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

if (!globalThis.window) {
  Object.defineProperty(globalThis, 'window', {
    value: globalThis,
    configurable: true,
  });
}

Object.defineProperty(globalThis.window, 'SP_REACT', {
  value: React,
  configurable: true,
  writable: true,
});

beforeEach(() => {
  localStorage.clear();
});
