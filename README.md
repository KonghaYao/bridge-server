# Edge-API

This is an API framework that allows for the creation of a backend API and automatically generates frontend TS code to facilitate application development.

This framework is built on the Koa framework running within a Deno runtime, and utilizes some clever techniques to seamlessly integrate the frontend and backend components.

1. ✅ Auto Frontend Fetch code generate!
2. ✅ Backend Message Validation!

## Example

```ts
// we use zod to validate many data!
import { z, APIConfig } from "https://esm.sh/edge-api";

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
