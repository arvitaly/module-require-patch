var paths = require('./../paths');
var path = require('path');
describe("Paths", () => {
    it("when module inside sub-packages, should resolve package root", () => {
        expect(paths("path/node_modules/module1/node_modules/module2/path3/test.js")).toEqual({
            root: "path",
            packageRoot: "path/node_modules/module1/node_modules/module2".replace(/\//gi, path.sep)
        });
    })
})