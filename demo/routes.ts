import * as v2 from "./routes/v2.ts";
import * as user from "./routes/user.ts";
import { APIConfig } from "../mod.ts";
export default { user, v2 } as unknown as Record<
    string,
    Record<string, APIConfig>
>;
