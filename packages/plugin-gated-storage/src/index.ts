import { Plugin } from "@elizaos/core";
import { gateDataAction } from "./actions/gate-action.ts";
import { signAction } from "./actions/sign-action.ts";
import { nonceAction } from "./actions/nonce-action.ts";
import { verifyAction } from "./actions/verify-action.ts";
import { unlockDataAction } from "./actions/unlock-action.ts";
import { gateDataProvider, nonceProvider } from "./provider.ts";

export const gateDataPlugin: Plugin = {
    name: "gated",
    description: "Gate data plugin",
    actions: [
        gateDataAction,
        nonceAction,
        signAction,
        verifyAction,
        unlockDataAction,
    ],
    evaluators: [],
    providers: [gateDataProvider, nonceProvider],
};

export default gateDataPlugin;
