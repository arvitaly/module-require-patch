import info = require("node-module-info");
export function moduleRequirePatch(content: string, modulePath: string): {
    code: string,
    info: info.Info,
    deps: Array<{
        rawRequest: string
        request: string,
        info: info.Info
    }>
};
export type Info = info.Info;