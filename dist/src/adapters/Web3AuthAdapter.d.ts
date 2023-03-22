import { ExternalProvider } from '@ethersproject/providers';
import type { SafeAuthClient, Web3AuthProviderConfig } from '../types';
/**
 * Web3AuthAdapter implements the SafeAuthClient interface for adapting the Web3Auth service provider
 * @class
 */
export default class Web3AuthAdapter implements SafeAuthClient {
    provider: ExternalProvider | null;
    private chainId;
    private web3authInstance?;
    private config;
    /**
     *
     * @param chainId Chain Id
     * @param config Web3Auth configuration
     */
    constructor(chainId: string, config: Web3AuthProviderConfig);
    /**
     * Initialize the Web3Auth service provider {@link https://web3auth.io/docs/sdk/web/modal/initialize}
     * @throws Error if there was an error initializing Web3Auth
     */
    init(): Promise<void>;
    /**
     * Connect to the Web3Auth service provider
     * @returns
     */
    signIn(): Promise<void>;
    /**
     * Disconnect from the Web3Auth service provider
     */
    signOut(): Promise<void>;
}
