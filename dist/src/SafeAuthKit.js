"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _SafeAuthKit_instances, _SafeAuthKit_client, _SafeAuthKit_config, _SafeAuthKit_getSafeCoreClient;
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const events_1 = __importDefault(require("events"));
const safe_ethers_lib_1 = __importDefault(require("@safe-global/safe-ethers-lib"));
const safe_service_client_1 = __importDefault(require("@safe-global/safe-service-client"));
const Web3AuthAdapter_1 = __importDefault(require("./adapters/Web3AuthAdapter"));
const types_1 = require("./types");
/**
 * SafeAuthKit provides a simple interface for web2 logins
 */
class SafeAuthKit extends events_1.default {
    /**
     * Initialize the SafeAuthKit
     * @constructor
     * @param client The client implementing the SafeAuthClient interface
     * @param config The configuration options
     */
    constructor(client, config) {
        super();
        _SafeAuthKit_instances.add(this);
        _SafeAuthKit_client.set(this, void 0);
        _SafeAuthKit_config.set(this, void 0);
        __classPrivateFieldSet(this, _SafeAuthKit_client, client, "f");
        __classPrivateFieldSet(this, _SafeAuthKit_config, config, "f");
    }
    /**
     * The static method allows to initialize the SafeAuthKit asynchronously
     * @param providerType Choose the provider service to use
     * @param config The configuration including the one for the specific provider
     * @returns A SafeAuthKit instance
     * @throws Error if the provider type is not supported
     */
    static async init(providerType, config) {
        let client;
        switch (providerType) {
            case types_1.SafeAuthProviderType.Web3Auth:
                client = new Web3AuthAdapter_1.default(config.chainId, config.authProviderConfig);
                break;
            default:
                throw new Error('Provider type not supported');
        }
        await client.init();
        return new SafeAuthKit(client, config);
    }
    /**
     * Authenticate the user
     * @returns the derived external owned account and the safes associated with the user if the txServiceUrl is provided
     * @throws Error if the provider was not created
     * @throws Error if there was an error while trying to get the safes for the current user using the provided txServiceUrl
     */
    async signIn() {
        await __classPrivateFieldGet(this, _SafeAuthKit_client, "f").signIn();
        if (!__classPrivateFieldGet(this, _SafeAuthKit_client, "f").provider) {
            throw new Error('Provider is not defined');
        }
        const ethersProvider = new ethers_1.ethers.providers.Web3Provider(__classPrivateFieldGet(this, _SafeAuthKit_client, "f").provider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        let safes;
        // Retrieve safes if txServiceUrl is provided
        if (__classPrivateFieldGet(this, _SafeAuthKit_config, "f").txServiceUrl) {
            try {
                const safesByOwner = await __classPrivateFieldGet(this, _SafeAuthKit_instances, "m", _SafeAuthKit_getSafeCoreClient).call(this).getSafesByOwner(address);
                safes = safesByOwner.safes;
            }
            catch (e) {
                throw new Error('There was an error while trying to get the safes for the current user');
            }
        }
        this.emit(types_1.SafeAuthEvents.SIGNED_IN);
        this.safeAuthData = {
            chainId: __classPrivateFieldGet(this, _SafeAuthKit_config, "f").chainId,
            eoa: address,
            safes
        };
        return this.safeAuthData;
    }
    /**
     * Sign out the user
     */
    async signOut() {
        var _a;
        await ((_a = __classPrivateFieldGet(this, _SafeAuthKit_client, "f")) === null || _a === void 0 ? void 0 : _a.signOut());
        this.safeAuthData = undefined;
        this.emit(types_1.SafeAuthEvents.SIGNED_OUT);
    }
    /**
     *
     * @returns The Ethereum provider
     */
    getProvider() {
        var _a;
        if (!__classPrivateFieldGet(this, _SafeAuthKit_client, "f"))
            return null;
        return (_a = __classPrivateFieldGet(this, _SafeAuthKit_client, "f")) === null || _a === void 0 ? void 0 : _a.provider;
    }
    /**
     * Subscribe to an event
     * @param eventName The event name to subscribe to. Choose from SafeAuthEvents type
     * @param listener The callback function to be called when the event is emitted
     */
    subscribe(eventName, listener) {
        this.on(eventName.toString(), listener);
    }
    /**
     * Unsubscribe from an event
     * @param eventName The event name to unsubscribe from. Choose from SafeAuthEvents type
     * @param listener The callback function to unsubscribe
     */
    unsubscribe(eventName, listener) {
        this.off(eventName.toString(), listener);
    }
}
exports.default = SafeAuthKit;
_SafeAuthKit_client = new WeakMap(), _SafeAuthKit_config = new WeakMap(), _SafeAuthKit_instances = new WeakSet(), _SafeAuthKit_getSafeCoreClient = function _SafeAuthKit_getSafeCoreClient() {
    var _a, _b;
    if (!((_a = __classPrivateFieldGet(this, _SafeAuthKit_client, "f")) === null || _a === void 0 ? void 0 : _a.provider)) {
        throw new Error('Provider is not defined');
    }
    if (!__classPrivateFieldGet(this, _SafeAuthKit_config, "f").txServiceUrl) {
        throw new Error('txServiceUrl is not defined');
    }
    const provider = new ethers_1.ethers.providers.Web3Provider((_b = __classPrivateFieldGet(this, _SafeAuthKit_client, "f")) === null || _b === void 0 ? void 0 : _b.provider);
    const safeOwner = provider.getSigner(0);
    const adapter = new safe_ethers_lib_1.default({
        ethers: ethers_1.ethers,
        signerOrProvider: safeOwner
    });
    return new safe_service_client_1.default({
        txServiceUrl: __classPrivateFieldGet(this, _SafeAuthKit_config, "f").txServiceUrl,
        ethAdapter: adapter
    });
};
//# sourceMappingURL=SafeAuthKit.js.map