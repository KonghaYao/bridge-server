import { koaBody, cors, Koa, logger } from "./deps.ts";
import { router } from "./routes.ts";
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

app.listen(8000, () => {
    console.log("服务启动了");
});
