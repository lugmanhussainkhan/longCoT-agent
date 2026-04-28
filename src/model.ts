import {
  bedrock,
  type AmazonBedrockLanguageModelOptions,
} from "@ai-sdk/amazon-bedrock";
import { azure, type OpenAILanguageModelResponsesOptions } from "@ai-sdk/azure";
import { type GoogleLanguageModelOptions } from "@ai-sdk/google";
import { vertex } from "@ai-sdk/google-vertex";
import { openai } from "@ai-sdk/openai";

export const models = {
  "bedrock-kimi-k2.5": {
    model: bedrock("moonshotai.kimi-k2.5"),
    providerOptions: {
      bedrock: {
        serviceTier: "flex",
      } satisfies AmazonBedrockLanguageModelOptions,
    },
  },

  "openai-gpt-5.4-mini": {
    model: openai("gpt-5.4-mini"),
    providerOptions: {
      openai: {
        reasoningEffort: "high",
        // serviceTier: "flex",
      } satisfies OpenAILanguageModelResponsesOptions,
    },
  },
  "azure-kimi-k2.6": {
    model: azure.chat("kimi-k2.6"),
    providerOptions: {},
  },
  "azure-gpt-5.4-mini": {
    model: azure("gpt-5.4-mini"),
    providerOptions: {
      openai: {
        reasoningEffort: "high",
        serviceTier: "flex",
      } satisfies OpenAILanguageModelResponsesOptions,
    },
  },
  "vertex-gemini-3-flash-preview": {
    model: vertex("gemini-3-flash-preview"),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingLevel: "high",
          includeThoughts: true,
        },
        serviceTier: "flex",
      } satisfies GoogleLanguageModelOptions,
    },
  },
};
