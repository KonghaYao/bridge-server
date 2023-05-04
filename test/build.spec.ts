import { buildAPI } from "../build/index.ts";
buildAPI(import.meta.resolve("../routes.ts"), "./dist/index.ts", {
    root: "http://localhost:8000",
});
