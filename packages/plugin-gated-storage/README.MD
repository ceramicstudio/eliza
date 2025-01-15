# @elizaos/plugin-gated-storage

A plugin that uses OrbisDB for decentralized storage and Lit Protocol for token-based programmatic access control over specialized knowledge sets.

## Overview

This plugin provides functionality to:

- Allow both humans and agents to prove ownership of a wallet address
- Allow agents to perform function executions to save and encrypt specialized knowledge to OrbisDB
- Allow agents to keep individual records of the owned Eth accounts of other addresses
- Programmatically decrypt and access gated specialized knowledge based on NFT ownership

## Installation

```bash
pnpm install @elizaos/plugin-gated-storage
```

## Configuration

The plugin requires the following environment variables:

```env
CONTEXT_ID=your_orbis_context_id # Required
TABLE_ID=kjzl6hvfrbw6c9ndp1n4gyl0defbizsq1034rhaamyd6w8wzk7zibi5hmu2x66u # Required: Default table definition
VERIFIED_TABLE=kjzl6hvfrbw6c606563tm8lvxrdxk97c7vpvt7z75v600t5gjz8fni6bao4n4st # Required: Default verified table
ETHEREUM_PRIVATE_KEY=your_stringified_pk # Required
LIT_TOKEN_ID=your_lit_token # Required
ORBIS_SEED=your_orbis_seed # Required
ORBIS_GATEWAY_URL=http://localhost:7008 # Required
CERAMIC_NODE_URL=https://ceramic-orbisdb-mainnet-direct.hirenodes.io/ # Required
CONTRACT_ADDRESS=your_nft_contract_address # Required
```

## Initial Setup

To run the app locally, follow these steps:

1. In a separate terminal, clone this modified version of OrbisDB and install the dependencies

```sh
git clone https://github.com/mzkrasner/orbisdb
cd orbisdb
npm install
```

2. In your orbisdb terminal, start the database process

```sh
# Ensure that you have your Docker Daemon running in the background first
npm run dev
```

Your OrbisDB instance will need to initially be configured using the GUI running on `localhost:7008`. Navigate to this address in your browser and follow these steps:

a. For "Ceramic node URL" enter the following value: `https://ceramic-orbisdb-mainnet-direct.hirenodes.io/`

This is the default public Ceramic node that the hosted Orbis Studio uses. We will leverage this to avoid the setup of a local Ceramic node

b. For "Ceramic Seed" simply click "generate a new one" and go to the next page

c. For "Database configuration" enter the following:

```sh
User=postgres
Database=postgres
Password=postgres
Host=localhost
Port=5432
```

These are the default configurations your Docker image is using. Entering them here enables you to configure your OrbisDB instance to index Ceramic stream data using your dockerized Postgres instance.

Go to the next page

d. Click next on the presets page (do not select anything)

e. Connect with your Metamask account and click "Get started". Keep the Orbis Studio UI in your browser as we will navigate back to it later

3. Navigate to your browser running the OrbisDB UI and create a new context. You can call this anything you want. Once saved, click into your new context and copy the value prefixed with "k" into your `.env` file

```sh
CONTEXT_ID="<your-context-id>"
```

Contexts allow developers to organize their data across different applications or projects. When this application uses the Orbis SDK to write embeddings, it will leverage this context when making the write request

4. Next, we will create an OrbisDB seed to self-authenticate onto the Ceramic Network using the Orbis SDK

```sh
pnpm gen-seed
```

This is the seed the Orbis SDK will use to self-authenticate your OrbisDB client onto the Ceramic Network in order to perform writes.

Copy only the array of numbers into your `.env` file

```sh
# enter as a string like "[2, 19, 140, 10...]"
ORBIS_SEED="your-array-here"
```

Make sure the final number in your array does not contain a trailing comma

5. Choose or create a dummy Metamask address and claim Lit Protocol Testnet tokens using that address by visiting `https://chronicle-yellowstone-faucet.getlit.dev/`

6. Navigate to `https://explorer.litprotocol.com/` in your browser and sign in with the same dummy address as the previous step. Once signed in, click "Mint a new PKP". After minting, copy the value under "Token ID" into your `.env` file

```sh
LIT_TOKEN_ID="<your-token-id>"
```

7. Grab the private key from your dummy Metamask wallet (used in the two steps above) and enter it into your `.env` file

```sh
ETHEREUM_PRIVATE_KEY="<your-private-key>"
```

8. Finally, deploy your OrbisDB data model we will use to create and query via vector search

```sh
pnpm deploy-model
```

This creates a new "table" in your OrbisDB instance by creating a Ceramic model stream using the model definition found in [scripts/deploy-model.mjs](./scripts/deploy-model.mjs).

Copy the value prefixed with "k" into your `.env` file

```sh
TABLE_ID="<your-table-id>"
```

## Usage

Import and register the plugin in your Eliza configuration:

```typescript
import { gateDataPlugin } from "@elizaos/plugin-gated-storage";

export default {
    plugins: [gateDataPlugin],
    // ... other configuration
};
```

### Functionality

TODO

## License

This plugin is part of the Eliza project. See the main project repository for license information.
