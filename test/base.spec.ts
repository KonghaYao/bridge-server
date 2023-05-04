import { expect } from "https://esm.sh/chai";
import * as api from "../dist/index.ts";

Deno.test("get type request", async () => {
    const data = await api.hello({ data: "hello" });
    const { hello } = await import("../demo/routes/v2.ts");
    expect(hello.outputSchema.safeParse(data).success, true);
});
Deno.test("post type request", async () => {
    const data = await api.user({ data: "hello" });
    const { user } = await import("../demo/routes/user.ts");
    expect(user.outputSchema.safeParse(data).success, true);
});
