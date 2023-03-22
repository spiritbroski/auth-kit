"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("@web3auth/base");
const modal_1 = require("@web3auth/modal");
const openlogin_adapter_1 = require("@web3auth/openlogin-adapter");
/**
 * Web3AuthAdapter implements the SafeAuthClient interface for adapting the Web3Auth service provider
 * @class
 */
class Web3AuthAdapter {
    /**
     *
     * @param chainId Chain Id
     * @param config Web3Auth configuration
     */
    constructor(chainId, config) {
        this.config = config;
        this.chainId = chainId;
        this.provider = null;
    }
    /**
     * Initialize the Web3Auth service provider {@link https://web3auth.io/docs/sdk/web/modal/initialize}
     * @throws Error if there was an error initializing Web3Auth
     */
    async init() {
        try {
            const web3auth = new modal_1.Web3Auth({
                clientId: this.config.clientId,
                web3AuthNetwork: this.config.network,
                chainConfig: {
                    chainNamespace: base_1.CHAIN_NAMESPACES.EIP155,
                    chainId: this.chainId,
                    rpcTarget: this.config.rpcTarget
                },
                uiConfig: {
                    theme: this.config.theme,
                    loginMethodsOrder: ['google', 'facebook']
                }
            });
            const openloginAdapter = new openlogin_adapter_1.OpenloginAdapter({
                loginSettings: {
                    mfaLevel: 'none'
                },
                adapterSettings: {
                    uxMode: 'popup',
                    whiteLabel: {
                        name: 'Safe'
                    }
                }
            });
            web3auth.configureAdapter(openloginAdapter);
            await web3auth.initModal({
                modalConfig: {
                    [base_1.WALLET_ADAPTERS.OPENLOGIN]: {
                        label: "openlogin",
                        showOnModal: true,
                    },
                    [base_1.WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
                        label: "walletconnectv1",
                        showOnModal: true,
                    },
                    [base_1.WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
                        label: "walletconnectv2",
                        showOnModal: true,
                    },
                    [base_1.WALLET_ADAPTERS.TORUS_EVM]: {
                        label: "walletconnectv1",
                        showOnModal: false,
                        showOnDesktop: false,
                        showOnMobile: false
                    },
                    [base_1.WALLET_ADAPTERS.METAMASK]: {
                        label: "metamask",
                        showOnModal: true,
                    },
                    [base_1.WALLET_ADAPTERS.COINBASE]: {
                        label: "coinbase",
                        showOnModal: true,
                    },
                },
            });
            this.provider = web3auth.provider;
            this.web3authInstance = web3auth;
        }
        catch {
            throw new Error('There was an error initializing Web3Auth');
        }
    }
    /**
     * Connect to the Web3Auth service provider
     * @returns
     */
    async signIn() {
        if (!this.web3authInstance)
            return;
        this.provider = await this.web3authInstance.connect();
    }
    /**
     * Disconnect from the Web3Auth service provider
     */
    async signOut() {
        var _a;
        if (!this.web3authInstance)
            return;
        return await ((_a = this.web3authInstance) === null || _a === void 0 ? void 0 : _a.logout());
    }
}
exports.default = Web3AuthAdapter;
//# sourceMappingURL=Web3AuthAdapter.js.map