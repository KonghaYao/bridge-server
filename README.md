# Bridge

> Developing now!😂

This is an API framework that allows for the creation of a backend API and automatically generates frontend TS code to facilitate application development.

This framework is built on the Koa framework running within a Deno runtime, and utilizes some clever techniques to seamlessly integrate the frontend and backend components.

1. ✅ Auto-generate frontend API code!
2. ✅ Auto-generate API Mocking check code!
3. ✅ Ensure data safety with backend message validation!

## Example

> [Simple Demo /demo folder](./demo/)

1. routes/v1.ts:😄 write your api in a simple way

```ts
// we use zod to validate many data!
import { z, APIConfig } from "https://esm.sh/bridge";

// You must keep the api safe using zod
export const hello = new APIConfig(
    // input Type validation
    z.object({ data: z.string() }),
    // output Type validation
    z.object({
        input: z.string(),
    })
)
    // create an api handle function to response data
    .api((input) => {
        return { input: input.data };
    });
```

2. routes.ts:🚥 combine your module in a routes file

> routes.ts is an independent module that needs to be used by the auto-generation script.

```ts
import * as v2 from "./routes/v2.ts";
import * as user from "./routes/user.ts";
import { APIConfig } from "../mod.ts";

// pick your routes in one ts file
export default { user, v2 } as unknown as Record<
    string,
    Record<string, APIConfig>
>;
```

3. main.ts:🚀 start your api！

```ts
import { ServerInit } from "./deps.ts";
import modules from "./routes.ts";
ServerInit(modules as any);
```

4. build.ts:🤖 create a build script to generate code!

```ts
import { buildAPI, buildTest } from "https://esm.sh/bridge/build/index.ts";

buildAPI(import.meta.resolve("./routes.ts"), "./dist/index.ts", {
    root: "http://localhost:8000",
    // for test, we need to replace package qs to Deno CDN
    qs: "https://esm.sh/qs@6.11.1",
});

// buildTest for auto Test Check!😍
buildTest(
    import.meta.resolve("./routes.ts"),
    import.meta.resolve("./dist/index.ts"),
    "./dist/test.ts"
);
```

5. deno.jsonc:✒️ make it easy to start project!

```jsonc
{
    "tasks": {
        "dev": "deno run --watch --allow-all --unstable main.ts",
        "dev:build": "deno run --watch --allow-all --unstable build.ts"
    }
}
```
