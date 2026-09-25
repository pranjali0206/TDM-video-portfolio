import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createCampaignCopy } from "./campaign-copy.server";

const inputSchema = z.object({
  brief: z.string().trim().min(20).max(2000),
});

export const generateCampaignCopy = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      return await createCampaignCopy(data.brief);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The AI writer could not complete this request.";
      throw new Error(message);
    }
  });