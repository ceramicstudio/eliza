import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { GateActionContent } from "../types.ts";
import { gateDataProvider } from "../provider.ts";

export const gateDataAction: Action = {
    name: "GATE_DATA",
    description:
        "Encrypts important data using a secret key and stores it in a decentralized database",
    similes: ["GATE_DATA", "ENCRYPT_DATA", "PROTECT_DATA"],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please protect the data from our last exchange",
                } as GateActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Gating data now...",
                    action: "GATE_DATA",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Please encrypt the data from our last exchange",
                } as GateActionContent,
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Gating data now...",
                    action: "GATE_DATA",
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
                ["gate", "encrypt", "protect"].some((keyword) =>
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
            // get the conversation exchange prior to this message
            const { roomId } = message;
            console.log("roomId", roomId);

            const conversation =
                await runtime.messageManager.getMemoriesByRoomIds({
                    roomIds: [roomId],
                });
            // if conversation's length is less than 2, return an error
            if (conversation.length < 2) {
                return new Error("No conversation found");
            }
            const sliced = conversation.slice(conversation.length - 2);

            const provider = await gateDataProvider.get(
                runtime,
                message,
                state
            );
            if (provider.success) {
                const doc1 = await provider.provider.storeMessageWithEmbedding(
                    sliced[0].content.text,
                    true
                );
                const doc2 = await provider.provider.storeMessageWithEmbedding(
                    sliced[1].content.text,
                    false
                );
                callback({
                    text: `Data has been successfully encrypted and stored. Here are the references to the encrypted data: 1. + ${doc1[0].id} 2. + ${doc2[0].id}`,
                    action: "GATE_DATA",
                });
                return;
            }

            return new Error(provider.error);
        } catch (error) {
            console.error("Error in GATE_DATA action", error);
            return error;
        }
    },
};
