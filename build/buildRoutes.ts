// 读取 routes 文件夹下的文件，构建路由文件至 /dist/routers.ts
import { zodToTs, printNode } from "https://esm.sh/zod-to-ts@1.1.4";
import { APIConfig } from "../utils/Modules.ts";
const files = Deno.readDir("./routes");

let tsFile = "import qs from 'qs';\nconst root = 'http://localhost:8000'\n";
const keys = [];
for await (const iterator of files) {
    const module = await import("../routes/" + iterator.name);
    Object.entries<APIConfig>(module).map(([key, api]) => {
        console.log(key);
        tsFile += "\n" + buildFetch(key, api) + "\n";
        keys.push(key);
    });
}
tsFile += `\nexport  {${keys.join(",")}}\n`;
await Deno.writeTextFile("./dist/index.ts", tsFile);
function buildFetch(name: string, api: APIConfig) {
    const inputType = printNode(zodToTs(api.inputSchema, "User").node);
    const outputType = printNode(zodToTs(api.outputSchema, "User").node);

    return `function ${name}(input:${inputType}):Promise<${outputType}>{
    const body = ${api.method === "get" ? "null" : "JSON.stringify(input)"}
    const query = ${api.method === "get" ? "'?'+qs.stringify(input)" : "''"}
    return fetch(root+"/api/${name}"+query,{
        method:"${api.method}",
        headers:JSON.parse('${JSON.stringify({})}'),
        body
    }).then(res=>res.json())
}`;
}
