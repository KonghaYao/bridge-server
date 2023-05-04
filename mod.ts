import { Router, koaBody, cors, Koa, logger } from "./deps.ts";
import { APIConfig, SuperRouter } from "./utils/Modules.ts";

/** 直接初始化服务器 */
export const ServerInit = (
    modules: Record<string, Record<string, APIConfig>>
) => {
    const router = new Router();
    const subRouter = new Router();

    Object.entries(modules).forEach(([key, module]) => {
        subRouter.use(
            "/" + key,
            new SuperRouter().applyToRouter(module).routes()
        );
    });

    router.use("/api", subRouter.routes());
    const app = new Koa();
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
            ctx.app.emit("error", err, ctx);
        }
    })
        .use(logger())
        .use(
            cors({
                origin: "*",
            })
        )
        .use(
            koaBody({
                multipart: true,
            })
        )
        .use(router.routes())
        .use(router.allowedMethods());

    return app.listen(8000, () => {
        console.log("服务启动了");
    });
};
