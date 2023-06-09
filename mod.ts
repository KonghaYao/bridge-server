import type { KoaBodyMiddlewareOptions } from "koa-body";
import Koa from "koa";
import Router from "@koa/router";
import koaBody from "koa-body";
import cors from "@koa/cors";
import logger from "koa-logger";
import { APIConfig, SuperRouter } from "./src/Modules.ts";
export * from "./src/Modules.ts";
export * from "zod";
export { Koa, Router };

/** 直接初始化服务器 */
export const ServerInit = (
    modules: Record<string, Record<string, APIConfig>>,
    config?: {
        /** 用于使用 koa 的中间件 */
        extends?: (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => void;
        cors?: cors.Options;
        body?: Partial<KoaBodyMiddlewareOptions>;
        apiPrefix?: string;
    }
) => {
    const router = new Router();
    const subRouter = new Router();

    Object.entries(modules).forEach(([key, module]) => {
        subRouter.use(
            "/" + key,
            new SuperRouter().applyToRouter(module).routes()
        );
    });

    router.use(config?.apiPrefix ?? "/api", subRouter.routes());
    const app = new Koa();
    config && config.extends && config.extends(app);
    app.use(
        // 错误拦截
        async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                ctx.status = err.status || 500;
                ctx.body = { status: err.status, error: err.message };
                ctx.app.emit("error", err, ctx);
            }
        }
    )
        .use(logger())
        .use(
            cors(
                Object.assign(
                    {
                        origin: "*",
                    },
                    config?.cors
                )
            )
        )
        .use(
            koaBody(
                Object.assign(
                    {
                        multipart: true,
                    },
                    config?.body
                )
            )
        )
        .use(router.routes())
        .use(router.allowedMethods());

    return app.listen(8000, () => {
        console.log("服务启动了");
    });
};
