import { OrbisDB } from "@useorbis/db-sdk";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";
import { type } from "os";

const db = new OrbisDB({
  ceramic: {
    gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
  },
  nodes: [
    {
      gateway: "http://localhost:7008",
    },
  ],
});

const embeddingModel = {
  name: "EmbeddingModel",
  schema: {
    type: "object",
    properties: {
      content: {
        type: "string",
      },
      is_user: {
        type: "boolean",
      },
      embedding: {
        type: "array",
        items: {
          type: "number",
        },
      },
      contenthash: {
        type: "string",
      },
    },
    additionalProperties: false,
  },
  version: "2.0",
  interface: false,
  implements: [],
  description: "Embedding model",
  accountRelation: {
    type: "list",
  },
};

const isVerifiedModel = {
    "name": "IsVerifiedModel",
    "schema": {
      "type": "object",
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "required": [
        "user_id",
        "address",
        "verified"
      ],
      "properties": {
        "address": {
          "type": "string"
        },
        "user_id": {
          "type": "string"
        },
        "verified": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "version": "2.0",
    "interface": false,
    "implements": [],
    "description": "Check to see if a user is verified",
    "accountRelation": {
      "type": "set",
      "fields": [
        "user_id"
      ]
    }
  }

const run = async () => {
  const seed = await OrbisKeyDidAuth.generateSeed();

  // Initiate the authenticator using the generated (or persisted) seed
  const auth = await OrbisKeyDidAuth.fromSeed(seed);

  // Authenticate the user
  await db.connectUser({ auth });
  const model = await db.ceramic.createModel(embeddingModel);
  const verifiedModel = await db.ceramic.createModel(isVerifiedModel);
  console.log({
    embeddingModel: model.id.toString(),
    isVerifiedModel: verifiedModel.id.toString(),
  });
};
run();
