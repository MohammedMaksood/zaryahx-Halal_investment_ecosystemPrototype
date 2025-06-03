/**
 * Type definitions for Ethereum provider
 * @typedef {Object} EthereumProvider
 * @property {boolean} [isMetaMask] - Whether the provider is MetaMask
 * @property {function(Object): Promise<any>} request - Method to make requests to the provider
 * @property {function(string, function): void} on - Method to subscribe to events
 * @property {function(string, function): void} removeListener - Method to unsubscribe from events
 * @property {string} [selectedAddress] - The currently selected address
 * @property {string} [chainId] - The current chain ID
 * @property {string} [networkVersion] - The current network version
 * @property {function(): boolean} isConnected - Method to check if connected to the network
 */

/**
 * This file provides JSDoc type definitions for the Ethereum provider
 * that would be available on the window object in a browser environment.
 * 
 * In TypeScript, this would be:
 * interface Window {
 *   ethereum?: {
 *     isMetaMask?: boolean;
 *     request: (request: { method: string; params?: Array<any> }) => Promise<any>;
 *     on: (eventName: string, callback: (...args: any[]) => void) => void;
 *     removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
 *     selectedAddress: string | undefined;
 *     chainId: string | undefined;
 *     networkVersion: string | undefined;
 *     isConnected: () => boolean;
 *   };
 * }
 */

// No actual code in this file - it's just for JSDoc type definitions
