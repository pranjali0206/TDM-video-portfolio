import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayRunIdFetch } from "./ai-run-id.server.ts";

const responseSchema = z.object({
  headlines: z.array(z.string()),
  quotes: z.array(z.string()),
});

export type CampaignCopy = z.infer<typeof responseSchema>;

function parseCampaignCopy(text: string): CampaignCopy {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const parsed = responseSchema.parse(JSON.parse(cleaned));
  return {
    headlines: parsed.headlines.slice(0, 5),
    quotes: parsed.quotes.slice(0, 5),
  };
}

export async function createCampaignCopy(brief: string): Promise<CampaignCopy> {
  const lovableApiKey = process.env["LOVABLE_API_KEY"];
  if (!lovableApiKey) {
    throw new Error("The AI writer is not configured yet.");
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: lovableApiKey,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system:
      "You are Framehaus, a sharp digital marketing creative director. Write concise, bold, specific campaign language. Avoid clichés, hype without substance, exclamation marks, and invented performance claims. Return only valid JSON with exactly two keys: headlines and quotes. Each value must be an array of exactly five strings. Headlines should be 3–9 words. Quotes should be one confident sentence suitable for a pitch deck, ad, or campaign manifesto.",
    prompt: `Campaign brief:\n${brief}`,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return parseCampaignCopy(await result.text);
}