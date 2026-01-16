# Depaxiom Scan Action

Scan your dependencies for compositional vulnerabilities that npm audit misses.

## What is Compositional Vulnerability Detection?

Traditional scanners evaluate packages atomically—they check if lodash has a CVE. Depaxiom analyzes combinations: when your lodash version plus your yaml parser plus your templating engine create an exploitable chain that no individual CVE covers.

## Features

- **Compositional Detection** - Finds vulnerabilities across package boundaries
- **Skeleton Key Detection** - Identifies universal exploit primitives (env, shell, code)
- **Zombie Package Warnings** - Flags abandoned packages with supply chain risk
- **SARIF Output** - Integrates with GitHub Code Scanning
- **PR Comments** - Get findings directly in your pull requests

## Usage

### Basic Usage

```yaml
name: Security Scan

on:
  pull_request:
  push:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest

    # Required permissions for this action
    permissions:
      contents: read          # Read lockfiles
      pull-requests: write    # Post PR comments
      security-events: write  # Upload SARIF (optional)

    steps:
      - uses: actions/checkout@v4

      - name: Depaxiom Scan
        uses: depaxiom/scan-action@v1
        with:
          api-key: ${{ secrets.DEPAXIOM_API_KEY }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Required Permissions

This action requires certain GitHub token permissions depending on which features you enable:

| Permission | Required When | Purpose |
|------------|---------------|---------|
| `contents: read` | Always | Read lockfiles from repository |
| `pull-requests: write` | `comment-on-pr: true` | Post scan results as PR comment |
| `security-events: write` | `upload-sarif: true` | Upload SARIF to Code Scanning |

**Security Note:** For fork PRs, the action automatically skips PR comments to prevent abuse. Forks should be manually reviewed before scanning.

### Fail on Critical Vulnerabilities

```yaml
- name: Depaxiom Scan
  uses: depaxiom/scan-action@v1
  with:
    api-key: ${{ secrets.DEPAXIOM_API_KEY }}
    fail-on-critical: 'true'
    fail-on-high: 'false'
```

### With PR Comments and SARIF Upload

```yaml
jobs:
  scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      security-events: write

    steps:
      - uses: actions/checkout@v4

      - name: Depaxiom Scan
        uses: depaxiom/scan-action@v1
        with:
          api-key: ${{ secrets.DEPAXIOM_API_KEY }}
          comment-on-pr: 'true'
          upload-sarif: 'true'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # Upload SARIF to GitHub Code Scanning
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: depaxiom-results.sarif
```

### Monorepo Support

```yaml
- name: Depaxiom Scan
  uses: depaxiom/scan-action@v1
  with:
    api-key: ${{ secrets.DEPAXIOM_API_KEY }}
    working-directory: './packages/api'
```

The action automatically detects lockfiles in subdirectories for monorepo setups.

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `api-key` | Depaxiom API key | Yes | - |
| `fail-on-critical` | Fail workflow on critical vulnerabilities | No | `true` |
| `fail-on-high` | Fail workflow on high severity vulnerabilities | No | `false` |
| `comment-on-pr` | Post results as PR comment | No | `true` |
| `upload-sarif` | Generate SARIF file for Code Scanning | No | `false` |
| `working-directory` | Directory containing lockfiles | No | `.` |

## Outputs

| Output | Description |
|--------|-------------|
| `critical-count` | Number of critical vulnerabilities found |
| `high-count` | Number of high severity vulnerabilities found |
| `total-count` | Total vulnerabilities found |
| `sarif-file` | Path to SARIF file (if `upload-sarif` is true) |

## Supported Lockfiles

- `package-lock.json` (npm v2/v3)
- `yarn.lock` (v1)
- `pnpm-lock.yaml` (v6/v9)

## Getting an API Key

Depaxiom is currently in private beta. To request access:

1. Contact the Depaxiom team for a beta API key
2. Add it as a repository secret named `DEPAXIOM_API_KEY`
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DEPAXIOM_API_KEY`
   - Value: Your API key

## Example PR Comment

When vulnerabilities are found, you'll see a comment like this:

```
## Depaxiom Scan Results

### Summary

🔴 **2 Critical** | 🟠 **1 High** | 📦 847 packages scanned

### Skeleton Key Matches

🔴 **CRITICAL** - Universal key `env` in child_process
- Impact: RCE
- Matched packages: lodash, execa
- CVSS: 9.8

### Findings

🔴 **CRITICAL** - Prototype pollution in lodash enables RCE via execa
- Source: `lodash`
- Sink: `execa`
- CVSS: 9.8
```

## Pricing

| Tier | Scans/Day | Features |
|------|-----------|----------|
| Free | 50 | Basic scanning, compositional risk |
| Pro | 500 | + Sanitized POCs, zombie warnings |
| Business | 10,000 | + Full POCs, WAF rules, SARIF export |

## Support

- [Report an Issue](https://github.com/depaxiom/scan-action/issues)

## License

This action is proprietary software. Usage requires an active Depaxiom subscription.
