///<reference path="node_modules/node-module-info/typings.d.ts" />
declare module "module-require-patch" {
    import info = require("node-module-info");
    function patch(content: string, modulePath: string): {
        code: string,
        info: info.Info,
        deps: Array<{
            rawRequest: string
            request: string,
            info: info.Info
        }>
    };
    export = patch;
}