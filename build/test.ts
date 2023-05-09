// 读取 routes 文件夹下的文件，构建路由文件至 /dist/routers.ts
import { generateMock } from "https://esm.sh/@anatine/zod-mock";
import { APIConfig } from "../src/Modules.ts";

/** 通过后端 API 创建前端 Fetch */
export const buildTest = async (
    /** 项目源代码的地址 */
    absPath: string,
    /** 生成接口代码的地址 */
    dist: string,
    /** 将要生成测试代码的地址 */
    targetPath: string
) => {
    let tsFile = ``;
    const modules: Record<string, Record<string, APIConfig>> =
        /** @ts-ignore ignore: 忽略绝对路径获取的代码*/
        await import(absPath);
    const keys: string[] = [];
    Object.entries(modules.default).map(([prefix, module]) => {
        Object.entries(module).map(([key, api]) => {
            console.log(key);
            tsFile +=
                "\n" +
                buildTestString(key, prefix, api, { dist, absPath }) +
                "\n";
            keys.push(key);
        });
    });

    tsFile += `\nexport  {${keys.join(",")}}\n`;
    await Deno.writeTextFile(targetPath, tsFile);
};

/** 通过一个 API 来构建 fetch 函数 */
function buildTestString(
    name: string,
    prefix: string,
    api: APIConfig,
    { dist, absPath }: Record<string, string>
) {
    return `async function ${name}(){
    const module = await import('${dist}'); 
    
    const result = await module.${name}(
        JSON.parse(\`${JSON.stringify(generateMock(api.inputSchema))}\`),
        ${
            api._header
                ? `"JSON.parse(\`${JSON.stringify(
                      generateMock(api._header)
                  )}\`)`
                : ""
        }
    )
    const source =await import('${absPath}');
    source.default.${prefix}.${name}.outputSchema.parse(result);
    return result
}
    `;
}
