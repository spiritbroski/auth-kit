/// <reference types="node" />
import { ethers } from 'ethers';
import EventEmitter from 'events';
import { SafeAuthClient, SafeAuthConfig, SafeAuthProviderType, SafeAuthSignInData, SafeAuthEvents } from './types';
/**
 * SafeAuthKit provides a simple interface for web2 logins
 */
export default class SafeAuthKit extends EventEmitter {
    #private;
    safeAuthData?: SafeAuthSignInData;
    /**
     * Initialize the SafeAuthKit
     * @constructor
     * @param client The client implementing the SafeAuthClient interface
     * @param config The configuration options
     */
    constructor(client: SafeAuthClient, config: SafeAuthConfig);
    /**
     * The static method allows to initialize the SafeAuthKit asynchronously
     * @param providerType Choose the provider service to use
     * @param config The configuration including the one for the specific provider
     * @returns A SafeAuthKit instance
     * @throws Error if the provider type is not supported
     */
    static init(providerType: SafeAuthProviderType, config: SafeAuthConfig): Promise<SafeAuthKit | undefined>;
    /**
     * Authenticate the user
     * @returns the derived external owned account and the safes associated with the user if the txServiceUrl is provided
     * @throws Error if the provider was not created
     * @throws Error if there was an error while trying to get the safes for the current user using the provided txServiceUrl
     */
    signIn(): Promise<SafeAuthSignInData>;
    /**
     * Sign out the user
     */
    signOut(): Promise<void>;
    /**
     *
     * @returns The Ethereum provider
     */
    getProvider(): ethers.providers.ExternalProvider | null;
    /**
     * Subscribe to an event
     * @param eventName The event name to subscribe to. Choose from SafeAuthEvents type
     * @param listener The callback function to be called when the event is emitted
     */
    subscribe(eventName: typeof SafeAuthEvents, listener: (...args: any[]) => void): void;
    /**
     * Unsubscribe from an event
     * @param eventName The event name to unsubscribe from. Choose from SafeAuthEvents type
     * @param listener The callback function to unsubscribe
     */
    unsubscribe(eventName: typeof SafeAuthEvents, listener: (...args: any[]) => void): void;
}
