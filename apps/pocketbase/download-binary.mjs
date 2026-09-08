#!/usr/bin/env node
/**
 * Downloads the PocketBase binary for the current OS/arch into this directory.
 * Version is read from .pocketbase-version
 */
import {
	createWriteStream,
	existsSync,
	readFileSync,
	unlinkSync,
	chmodSync,
	renameSync,
	mkdtempSync,
	rmSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const versionFile = join(__dirname, '.pocketbase-version');
const binaryName = process.platform === 'win32' ? 'pocketbase.exe' : 'pocketbase';
const binaryPath = join(__dirname, binaryName);

const version = readFileSync(versionFile, 'utf8').trim();
if (!version) {
	console.error('Missing version in .pocketbase-version');
	process.exit(1);
}

function platformArch() {
	const os =
		process.platform === 'darwin' ? 'darwin'
		: process.platform === 'linux' ? 'linux'
		: process.platform === 'win32' ? 'windows'
		: null;
	if (!os) {
		throw new Error(`Unsupported platform: ${process.platform}`);
	}

	let arch = process.arch;
	// Node: arm64, x64, ia32
	if (arch === 'x64') arch = 'amd64';
	else if (arch === 'ia32') arch = '386';
	else if (arch === 'arm64') arch = 'arm64';
	else if (arch === 'arm') arch = 'armv7';
	else throw new Error(`Unsupported arch: ${process.arch}`);

	return { os, arch };
}

async function alreadyCorrectVersion() {
	if (!existsSync(binaryPath)) return false;
	try {
		const out = execFileSync(binaryPath, ['--version'], { encoding: 'utf8' }).trim();
		// e.g. "pocketbase version 0.39.8"
		return out.includes(version);
	} catch {
		return false;
	}
}

async function download() {
	if (await alreadyCorrectVersion()) {
		console.log(`PocketBase ${version} already present.`);
		return;
	}

	const { os, arch } = platformArch();
	const zipName = `pocketbase_${version}_${os}_${arch}.zip`;
	const url = `https://github.com/pocketbase/pocketbase/releases/download/v${version}/${zipName}`;
	console.log(`Downloading PocketBase ${version} (${os}/${arch})...`);
	console.log(url);

	const res = await fetch(url, { redirect: 'follow' });
	if (!res.ok) {
		throw new Error(`Download failed: ${res.status} ${res.statusText} for ${url}`);
	}

	const tmp = mkdtempSync(join(tmpdir(), 'pb-dl-'));
	const zipPath = join(tmp, zipName);
	try {
		await pipeline(res.body, createWriteStream(zipPath));

		// Unzip with system unzip (available on macOS/Linux; Windows uses tar in modern shells)
		if (process.platform === 'win32') {
			execFileSync('tar', ['-xf', zipPath, '-C', tmp], { stdio: 'inherit' });
		} else {
			execFileSync('unzip', ['-o', zipPath, '-d', tmp], { stdio: 'inherit' });
		}

		const extracted = join(tmp, binaryName);
		if (!existsSync(extracted)) {
			throw new Error(`Extracted binary not found at ${extracted}`);
		}

		// Replace existing binary
		if (existsSync(binaryPath)) {
			try {
				unlinkSync(binaryPath);
			} catch {
				/* ignore */
			}
		}
		renameSync(extracted, binaryPath);
		if (process.platform !== 'win32') {
			chmodSync(binaryPath, 0o755);
		}

		console.log(`Installed ${binaryPath}`);
	} finally {
		rmSync(tmp, { recursive: true, force: true });
	}
}

download().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
