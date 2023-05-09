import { expect } from "https://esm.sh/chai";
import * as api from "../dist/test.ts";

Deno.test("get type request", async () => {
    await api.hello();
});
Deno.test("post type request", async () => {
    await api.user();
});
