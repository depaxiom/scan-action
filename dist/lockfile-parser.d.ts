/**
 * Lockfile Parser
 *
 * Parses npm, yarn, and pnpm lockfiles to extract dependency information.
 */
import type { ParsedDependency, LockfileFormat, LockfileParseResult } from './types.js';
/**
 * Detect the format of a lockfile from its content
 */
export declare function detectLockfileFormat(content: string): LockfileFormat | null;
/**
 * Parse a single lockfile
 */
export declare function parseLockfile(content: string, filename?: string): LockfileParseResult;
/**
 * Parse multiple lockfiles and merge dependencies
 */
export declare function parseLockfiles(files: {
    name: string;
    content: string;
}[]): ParsedDependency[];
