import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
} from "@elizaos/core";
import { GateActionContent } from "../types.ts";
// import { nonceProvider } from "../provider.ts";
import { WalletHandshake } from "../services/wallet.service.ts";

export const signAction: Action = {
    name: "SIGN_NONCE",
    description: "Signs a nonce to verify the wallet and address of the user",
    similes: ["SIGN_NONCE", "SIGN_MESSAGE"],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Here is my nonce for the handshake you'll perform: ee60e5b6a159c1cbf0b4",
                } as GateActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Signing nonce ee60e5b6a159c1cbf0b4 for the handshake...",
                    action: "SIGN_NONCE",
                },
            },
        ],
    ],

    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        _state?: State
    ): Promise<boolean> => {
        try {
            const content = message.content as GateActionContent;
            return (
                typeof content.text === "string" &&
                content.text
                    .toLowerCase()
                    .includes(
                        "here is my nonce for the handshake you'll perform:"
                    )
            );
        } catch {
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ): Promise<void | Error> => {
        try {
            console.log("Signing nonce for the handshake...");
            const wallet = new WalletHandshake();
            const nonceSeparated = message.content.text.split(":");
            const signedMessage = await wallet.signMessage(
                nonceSeparated[1].trim()
            );
            const addedNonce = {
                ...signedMessage,
                nonce: nonceSeparated[1].trim(),
            };
            callback({
                text: `Here is my signed nonce: ${JSON.stringify(addedNonce)}`,
            });
            return;
        } catch (error) {
            console.error("Error in handshake action:", error);
            return error;
        }
    },
};
