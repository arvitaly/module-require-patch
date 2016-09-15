import info = require("node-module-info");
declare function ModuleRequirePatch(content: string, modulePath: string): {
    code: string,
    info: info.Info,
    dependencies: Array<{
        rawRequest: string
        request: string,
        info: info.Info
    }>
};
declare namespace ModuleRequirePatch {
    type Info = info.Info;
}
export = ModuleRequirePatch;
