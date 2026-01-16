/**
 * GitHub Action Types
 *
 * Shared types for lockfile parsing, API client, and output formatting.
 */
export interface ParsedDependency {
    name: string;
    version: string;
    integrity?: string;
}
export type LockfileFormat = 'npm-v2' | 'npm-v3' | 'yarn-v1' | 'pnpm-v6' | 'pnpm-v9';
export interface LockfileParseError {
    message: string;
    line?: number;
    column?: number;
}
export interface LockfileParseResult {
    dependencies: ParsedDependency[];
    format: LockfileFormat;
    errors: LockfileParseError[];
}
export interface LockfileParser {
    parse(content: string): LockfileParseResult;
    detectFormat(content: string): LockfileFormat | null;
}
export interface ApiClientConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
    maxRetries?: number;
}
export interface ScanRequestDependency {
    name: string;
    version: string;
    hash?: string;
}
export interface ScanRequest {
    dependencies: ScanRequestDependency[];
}
export interface Finding {
    id: string;
    type: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    cvss: number;
    sourcePackage: string;
    sinkPackage: string;
    description: string;
    pocSnippet?: string;
    shimUrl?: string;
    wafRule?: string;
}
export interface SkeletonKeyMatch {
    skeletonKeyId: string;
    prop: string;
    context: string;
    impactType: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    cvss: number;
    matchedPackages: string[];
    pocFull?: string;
    shimUrl?: string;
}
export interface CompositionalRisk {
    sourcePackages: string[];
    sinkPackages: string[];
    spawnPackages: string[];
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    enabledAttacks: string[];
}
export interface ZombieWarning {
    packageName: string;
    zombieScore: number;
    factors: {
        maintainerCount: number;
        daysSincePublish: number;
        ownershipChanged: boolean;
        downloadsWeekly: number;
    };
}
export interface IntegrityAlert {
    packageName: string;
    version: string;
    status: 'MATCH' | 'MISMATCH' | 'UNKNOWN' | 'MALICIOUS';
    officialHash?: string;
    seenCount?: number;
    firstSeen?: string;
}
export interface ScanResponseMeta {
    packagesScanned: number;
    durationMs: number;
    tier: string;
}
export interface ScanResponse {
    findings: Finding[];
    skeletonKeyMatches: SkeletonKeyMatch[];
    compositionalRisk: CompositionalRisk;
    zombieWarnings: ZombieWarning[];
    integrityAlerts: IntegrityAlert[];
    meta: ScanResponseMeta;
}
export interface ApiClient {
    scan(request: ScanRequest): Promise<ScanResponse>;
}
export interface ApiError extends Error {
    statusCode?: number;
    retryable: boolean;
}
export interface SarifMessage {
    text: string;
}
export interface SarifArtifactLocation {
    uri: string;
}
export interface SarifPhysicalLocation {
    artifactLocation: SarifArtifactLocation;
}
export interface SarifLocation {
    physicalLocation: SarifPhysicalLocation;
}
export interface SarifResult {
    ruleId: string;
    level: 'error' | 'warning' | 'note' | 'none';
    message: SarifMessage;
    locations: SarifLocation[];
}
export interface SarifRule {
    id: string;
    name: string;
    shortDescription: SarifMessage;
    fullDescription: SarifMessage;
    defaultConfiguration: {
        level: 'error' | 'warning' | 'note' | 'none';
    };
}
export interface SarifDriver {
    name: string;
    version: string;
    informationUri: string;
    rules: SarifRule[];
}
export interface SarifTool {
    driver: SarifDriver;
}
export interface SarifRun {
    tool: SarifTool;
    results: SarifResult[];
}
export interface SarifOutput {
    version: '2.1.0';
    $schema: string;
    runs: SarifRun[];
}
export interface OutputFormatter {
    formatPRComment(response: ScanResponse): string;
    formatSARIF(response: ScanResponse, repo: string): SarifOutput;
    formatCheckSummary(response: ScanResponse): string;
}
export interface ActionInputs {
    apiKey: string;
    failOnCritical: boolean;
    failOnHigh: boolean;
    commentOnPr: boolean;
    uploadSarif: boolean;
}
export interface ActionOutputs {
    criticalCount: number;
    highCount: number;
    totalCount: number;
    sarifFile?: string;
}
