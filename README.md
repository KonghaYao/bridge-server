# Bridge

This is an API framework that allows for the creation of a backend API and automatically generates frontend TS code to facilitate application development.

This framework is built on the Koa framework running within a Deno runtime, and utilizes some clever techniques to seamlessly integrate the frontend and backend components.

1. ✅ Auto Frontend Fetch code generate!
2. ✅ Backend Message Validation!

## Example

1. routes/v1.ts

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

2. routes.ts

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

3. build.ts

```ts
import { buildAPI } from "../build/index.ts";
// build font-end file to any way
buildAPI(import.meta.resolve("./routes.ts"), "./dist/index.ts", {
    root: "http://localhost:8000",
});
```
