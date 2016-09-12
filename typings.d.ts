declare module "module-require-patch" {
    function patch(content: string, modulePath: string): string;
    export = patch;
}