import { Router } from "./deps.ts";
import * as V2 from "./routes/v2.ts";
import { SuperRouter } from "./utils/Modules.ts";

const router = new Router();
router.use("/api", new SuperRouter().applyToRouter(V2 as any).routes());
export { router };
