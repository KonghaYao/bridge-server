import Koa from "koa";
import Router from "@koa/router";
import { z } from "zod";
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
    _header?: z.ZodObject<any>;
    _default_header: Record<string, string> = {};

    /** 校验输入数据 */
    input(receiveType: this["inputTransform"]) {
        if (receiveType !== "urlencoded") this.method = "post";
        this.inputTransform = receiveType;
        switch (receiveType) {
            case "json":
                this.defaultHeader({
                    "content-type": "application/json",
                });
                break;
        }
        return this;
    }
    /** 校验头部信息 */
    header(schema: z.ZodObject<any>) {
        if (!this._header) this._header = z.object({});
        this._header = this._header.merge(schema);
        return this;
    }
    defaultHeader(header: this["_default_header"]) {
        Object.assign(this._default_header, header);
    }
    /** 数据格式化方案 */
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
    originHandle!: ModuleHandle<z.infer<InputSchema>, z.infer<OutputSchema>>;
    api(func: this["originHandle"]) {
        this.originHandle = func;
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
