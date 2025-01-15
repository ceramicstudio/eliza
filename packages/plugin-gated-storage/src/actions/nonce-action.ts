import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    elizaLogger as logger,
} from "@elizaos/core";
import { GateActionContent } from "../types.ts";
import { nonceProvider } from "../provider.ts";

export const nonceAction: Action = {
    name: "REQUEST_NONCE",
    description:
        "Requests a handshake to verify the wallet and address of the user",
    similes: ["REQUEST_NONCE", "VERIFY_ADDRESS"],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please provide a nonce for me to sign",
                } as GateActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Generating nonce for the handshake...",
                    action: "REQUEST_NONCE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Give me a nonce to sign",
                } as GateActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Generating nonce for the handshake...",
                    action: "REQUEST_NONCE",
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
                ["provide", "create", "give"].some((keyword) =>
                    content.text.toLowerCase().includes(keyword)
                ) &&
                content.text.toLowerCase().includes("nonce") &&
                !content.text
                    .toLowerCase()
                    .includes("here is my signed nonce:") &&
                !content.text
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
            const response = await nonceProvider.get(runtime, message, state);
            if (!response.success || !response.nonce) {
                logger.error("Failed to generate nonce for the handshake");
            }
            callback({
                text: `Here is my nonce for the handshake you'll perform: ${response.nonce}`,
            });
            return;
        } catch (error) {
            console.error("Error in handshake action:", error);
            return error;
        }
    },
};
