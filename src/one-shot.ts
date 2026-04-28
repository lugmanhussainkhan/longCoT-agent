import { generateText, streamText } from "ai";
import fs from "fs";
import pLimit from "p-limit";
import data from "../data/math/easy.json";
import { models } from "./model";

const { model, providerOptions } = models["vertex-gemini-3-flash-preview"];
const concurrency = 5;
const limit = pLimit(concurrency);

async function main() {
  let basePath = `out/oneshot-${model.modelId}-math-easy-${Date.now()}`;
  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

  console.log("=".repeat(80));
  console.log("LongCoT One Shot Run");
  console.log("-".repeat(80));
  console.log(`- Model: ${model.modelId}`);
  console.log(`- Provider: ${model.provider}`);
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

      const result = await streamText({
        model,
        providerOptions,
        messages: [{ role: "user", content: item.prompt }],
        maxRetries: 3,
        timeout: 30 * 60 * 1000,
      });

      for await (const textPart of result.textStream) {
        console.log(textPart);
      }

      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    }),
  );
  await Promise.all(promises);

  console.log("=".repeat(80));
  console.log("LongCoT One Shot Run Complete");
  console.log("=".repeat(80));
}

main();
