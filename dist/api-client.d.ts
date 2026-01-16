/**
 * API Client
 *
 * HTTP client for the Depaxiom API with retry logic and security hardening.
 */
import type { ApiClient, ApiClientConfig } from './types.js';
/**
 * Create an API client with retry logic and security hardening
 */
export declare function createApiClient(config: ApiClientConfig): ApiClient;
