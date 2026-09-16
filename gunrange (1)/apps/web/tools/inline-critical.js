#!/usr/bin/env node

/**
 * Inline critical CSS into the built HTML.
 *
 * This script runs AFTER `vite build`.
 *
 * It invokes the `critical` CLI (v9+ recommended) with SPA-friendly settings.
 * Install globally once:  npm i -g critical
 *
 * --engine render : lets the headless browser run the React app so we capture
 *   real above-the-fold content (hero, interactive map, search bar, etc).
 * --dimensions     : desktop + mobile viewports.
 * The script is intentionally non-fatal.
 */

import { execFileSync } from 'child_process';
import path from 'path';

const TARGET_DIR = path.resolve(process.cwd(), '../../dist/apps/web');

console.log(`Inlining critical CSS for ${TARGET_DIR}...`);

const argsRender = [
  TARGET_DIR,
  '--engine', 'render',
  '--inline',
  '--write',
  '--minify',
  '--dimensions', '1300x900,375x667'
];

const argsStatic = [
  TARGET_DIR,
  '--engine', 'static',
  '--inline',
  '--write',
  '--minify'
];

let usedEngine = 'render';

try {
  // First try render (best for SPAs - actually executes JS to find above-the-fold content)
  execFileSync('critical', argsRender, { stdio: 'inherit' });
} catch (err) {
  // Render failed (most likely missing Playwright browser)
  console.warn('Render engine failed (probably missing Playwright). Falling back to static engine...');
  usedEngine = 'static';
  try {
    execFileSync('critical', argsStatic, { stdio: 'inherit' });
  } catch (err2) {
    console.warn('⚠️  Skipping critical CSS inlining (critical CLI not found or failed)');
    process.exit(0);
  }
}

console.log(`✓ Critical CSS inlined successfully (using ${usedEngine} engine)`);
