import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { GateActionContent } from "../types.ts";
import { gateDataProvider } from "../provider.ts";

export const unlockDataAction: Action = {
    name: "UNLOCK_DATA",
    description:
        "Decrypts important data using a secret key and retrieves it from a decentralized database",
    similes: ["UNLOCK_DATA", "DECRYPT_DATA"],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please unlock the data you have on DeFi strategies",
                } as GateActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Checking your ability to access my gated data...",
                    action: "UNLOCK_DATA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please decrypt the data you have on NFT trading",
                } as GateActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Checking your ability to access my gated data...",
                    action: "UNLOCK_DATA",
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
                ["unlock", "decrypt"].some((keyword) =>
                    content.text.toLowerCase().includes(keyword)
                ) &&
                content.text.toLowerCase().includes("data")
            );
        } catch {
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        try {
            const user_id = message.userId;
            const provider = await gateDataProvider.get(
                runtime,
                message,
                state
            );
            const verified = await provider.provider.checkIsVerified(user_id);
            if (!verified) {
                console.log("User is not authorized to access this data");
                callback({
                    text: "You are not authorized to access this data",
                });
                return;
            } else {
                console.log("User is authorized to access this data");
                const data = await provider.provider.getConversation();
                callback({
                    text: `Here is the decrypted data: ${data}`,
                });
                return;
            }
        } catch (error) {
            console.error("Error in GATE_DATA action", error);
            return error;
        }
    },
};
