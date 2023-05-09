// 读取 routes 文件夹下的文件，构建路由文件至 /dist/routers.ts

import { zodToTs, printNode } from "https://esm.sh/zod-to-ts@1.1.4";
import { APIConfig } from "../utils/Modules.ts";
import { z } from "../deps.ts";

/** 通过后端 API 创建前端 Fetch */
export const buildAPI = async (
    absPath: string,
    targetPath: string,
    config: { root: string; qs?: string }
) => {
    let tsFile = `import qs from '${config.qs ?? "qs"}';\nconst root = '${
        config.root
    }'\n`;
    const modules: Record<string, Record<string, APIConfig>> =
        /** @ts-ignore ignore: 忽略绝对路径获取的代码*/
        await import(absPath);
    const keys: string[] = [];
    Object.entries(modules.default).map(([prefix, module]) => {
        Object.entries(module).map(([key, api]) => {
            console.log(key);
            tsFile += "\n" + buildFetch(key, prefix, api) + "\n";
            keys.push(key);
        });
    });

    tsFile += `\nexport  {${keys.join(",")}}\n`;
    await Deno.writeTextFile(targetPath, tsFile);
};

function schemaToString(schema: z.Schema): string {
    /** @ts-ignore */
    return printNode(zodToTs(schema, "User").node);
}

/** 通过一个 API 来构建 fetch 函数 */
function buildFetch(name: string, prefix: string, api: APIConfig) {
    const inputType = schemaToString(api.inputSchema);

    const headerType = api._header
        ? ":" + schemaToString(api._header)
        : "?:undefined";
    const outputType = schemaToString(api.outputSchema);

    return `function ${name}(input:${inputType},_headers${headerType}):Promise<${outputType}>{
    const headers = Object.assign(JSON.parse('${JSON.stringify(
        api._default_header
    )}'),_headers??{})
    const body = ${api.method === "get" ? "null" : "JSON.stringify(input)"}
    const query = ${api.method === "get" ? "'?'+qs.stringify(input)" : "''"}
    return fetch(root+"/api/${prefix}/${name}"+query,{
        method:"${api.method}",
        headers,
        body
    }).then(res=>res.json())
}`;
}
