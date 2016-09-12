declare module "module-require-patch" {
    function patch(content: string, modulePath: string): {
        code: string,
        deps: Array<{
            file: string,
            request: string,
            package: {
                name: string,
                version: string
            }
        }>
    };
    export = patch;
}