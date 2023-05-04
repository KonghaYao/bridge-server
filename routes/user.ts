import { z } from "../deps.ts";
import { APIConfig } from "../utils/Modules.ts";
export const user = new APIConfig(
    z.object({ data: z.string() }),
    z.object({
        input: z.string(),
    })
)
    .input("json")
    .api((input) => {
        return { input: input.data };
    });
