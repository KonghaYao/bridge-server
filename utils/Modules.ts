import { Koa } from "../deps.ts";
import { z, Router } from "../deps.ts";
export type ModuleHandle<T = null, D = string> = (
    input: T,
    headers: Record<string, string>,
    ctx: Koa.Context
) => Promise<D> | D;

export const Transformers = {
    json(input: string) {
        return JSON.stringify(input);
    },
} as const;

export class APIConfig<
    InputSchema extends z.Schema = z.ZodAny,
    OutputSchema extends z.Schema = z.ZodAny
> {
    constructor(
        public inputSchema: InputSchema,
        public outputSchema: OutputSchema
    ) {}
    method: "get" | "post" = "get";
    inputTransform: "json" | "urlencoded" = "urlencoded";
    outputTransform: keyof typeof Transformers = "json";
    _header?: z.ZodObject;

    /** 校验输入数据 */
    input(receiveType: this["inputTransform"]) {
        if (receiveType !== "urlencoded") this.method = "post";
        this.inputTransform = receiveType;
        switch (receiveType) {
            case "json":
                this.header(
                    z.object({
                        "content-type": z.literal("application/json"),
                    })
                );
        }
        return this;
    }
    /** 校验头部信息 */
    header(schema: z.ZodObject) {
        if (!this._header) this._header = z.object({});
        this._header = this._header.merge(schema);
        return this;
    }
    /** 校验输出数据 */
    output(transform: this["outputTransform"]) {
        this.outputTransform = transform;
        return this;
    }
    private checkInput(ctx: Koa.Context) {
        switch (this.inputTransform) {
            case "urlencoded":
                return this.inputSchema.parse(ctx.request.query);

            case "json":
                /** @ts-ignore */
                return this.inputSchema.parse(ctx.request.body);
        }
    }
    handle!: Koa.Middleware;
    api(func: ModuleHandle<z.infer<InputSchema>, z.infer<OutputSchema>>) {
        this.handle = async (ctx) => {
            const input = this.checkInput(ctx);
            const output = await func.call(
                null,
                input,
                /** @ts-ignore */
                ctx.request.headers,
                ctx
            );
            ctx.body = Transformers[this.outputTransform](output);
        };
        return this;
    }
}

export class SuperRouter extends Router {
    applyToRouter(routesMap: Record<string, APIConfig>) {
        Object.entries(routesMap).forEach(([key, config]) => {
            this[config.method]("/" + key, config.handle);
        });
        return this;
    }
}
