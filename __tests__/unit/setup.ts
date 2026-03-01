/**
 * This file is executed by Vitest before running any unit tests.
 * It sets up the 'jest-dom' matchers and ensures clean test environments.
 */
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extends Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Runs cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
