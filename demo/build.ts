import { buildAPI } from "../build/index.ts";
buildAPI(import.meta.resolve("./routes.ts"), "./dist/index.ts", {
    root: "http://localhost:8000",
    // for test, we need to replace package qs to Deno CDN
    qs: "https://esm.sh/qs@6.11.1",
});
