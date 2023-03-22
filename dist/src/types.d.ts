import { ExternalProvider } from '@ethersproject/providers';
export interface SafeAuthSignInData {
    chainId: string;
    eoa: string;
    safes?: string[];
}
export interface SafeAuthClient {
    provider: ExternalProvider | null;
    init(): Promise<void>;
    signIn(): Promise<void>;
    signOut(): Promise<void>;
}
export declare enum SafeAuthProviderType {
    Web3Auth = 0
}
export interface Web3AuthProviderConfig {
    rpcTarget: string;
    clientId: string;
    network: 'mainnet' | 'aqua' | 'celeste' | 'cyan' | 'testnet';
    theme: 'light' | 'dark' | 'auto';
    appLogo?: string;
}
export interface SafeAuthConfig {
    chainId: string;
    txServiceUrl?: string;
    authProviderConfig: Web3AuthProviderConfig;
}
export declare const SafeAuthEvents: {
    SIGNED_IN: string;
    SIGNED_OUT: string;
};
