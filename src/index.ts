import { type GoogleLanguageModelOptions } from "@ai-sdk/google";
import { vertex } from "@ai-sdk/google-vertex";
import { type SharedV3ProviderOptions } from "@ai-sdk/provider";
import pLimit from "p-limit";

const model = vertex("gemini-3-flash-preview");
const providerOptions: SharedV3ProviderOptions = {
  google: {
    thinkingConfig: {
      thinkingLevel: "high",
      includeThoughts: true,
    },
    serviceTier: "flex",
  } satisfies GoogleLanguageModelOptions,
};
const concurrency = 4;
const limit = pLimit(concurrency);

async function main() {
  console.log("=".repeat(80));
  console.log("LongCoT Agent Run");
  console.log("-".repeat(80));
  console.log(`- Model: ${model.modelId}`);
  console.log(`- Provider: ${model.provider}`);
  console.log(`- Concurrency: ${concurrency}`);
  console.log("=".repeat(80));
}

main();
