import { type SharedV3ProviderOptions } from "@ai-sdk/provider";
import {
  generateText,
  stepCountIs,
  tool,
  type LanguageModel,
  type ModelMessage,
} from "ai";
import { z } from "zod";
import fs from "fs";

const workerSystem = fs.readFileSync("src/prompts/woker-system.md", "utf-8");
const orchestratorSystem = fs.readFileSync(
  "src/prompts/orchestrator-system.md",
  "utf-8",
);

export async function agent(
  model: LanguageModel,
  providerOptions: SharedV3ProviderOptions,
  maxIterations: number,
  input: string,
  referenceId: string,
) {
  console.log(`[AGENT]::Starting to process ${referenceId}`);
  const workerLogs: Awaited<ReturnType<typeof generateText>>[] = [];
  const messages: ModelMessage[] = [
    { role: "system", content: orchestratorSystem },
    { role: "user", content: input },
  ];
  try {
    const orchRes = await generateText({
      model,
      providerOptions,
      messages,
      stopWhen: stepCountIs(maxIterations),
      maxRetries: 4,
      tools: {
        spawn_worker: tool({
          description:
            "Delegate one atomic, self-contained task to a stateless Worker and return its result.",
          inputSchema: z.object({
            input: z.string(),
          }),
          execute: async ({ input }) => {
            const workerRes = await generateText({
              model,
              providerOptions,
              messages: [
                { role: "system", content: workerSystem },
                { role: "user", content: input },
              ],
              maxRetries: 4,
            });
            workerLogs.push(workerRes);
            return workerRes.text;
          },
        }),
      },
    });
    return {
      response: orchRes,
      error: null,
      messages,
      workerLogs,
    };
  } catch (error) {
    console.error(`[AGENT]::Error processing ${referenceId}`, error);
    return {
      response: null,
      error: error as Error,
      messages,
      workerLogs,
    };
  }
}
