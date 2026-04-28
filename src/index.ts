import fs from "fs";
import pLimit from "p-limit";
import data from "../data/math/easy.json";
import { agent } from "./agent";
import { models } from "./model";

const { model, providerOptions } = models["bedrock-kimi-k2.5"];
const concurrency = 10;
const limit = pLimit(concurrency);
const maxIterations = 24;

async function main() {
  let basePath = `out/agentic-${model.modelId}-math-easy-${Date.now()}`;
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

  console.log("=".repeat(80));
  console.log("LongCoT Agent Run");
  console.log("-".repeat(80));
  console.log(`- Model: ${model.modelId}`);
  console.log(`- Provider: ${model.provider}`);
  console.log(`- Max Iterations: ${maxIterations}`);
  console.log(`- Concurrency: ${concurrency}`);
  console.log(`- Items: ${data.questions.length}`);
  console.log("=".repeat(80));

  const promises = data.questions.map((item) =>
    limit(async () => {
      const filePath = `${basePath}/${item.question_id}-${item.problem.template}.json`;
      if (fs.existsSync(filePath)) {
        console.log(`Skipping ${item.question_id} as it already exists`);
        return;
      }

      const result = await agent(
        model,
        providerOptions,
        maxIterations,
        item.prompt,
        item.question_id,
      );
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    }),
  );
  await Promise.all(promises);

  console.log("=".repeat(80));
  console.log("LongCoT Agent Run Complete");
  console.log("=".repeat(80));
}

main();
