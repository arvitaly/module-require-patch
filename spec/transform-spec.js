var fixtures = require('fixture2');
describe("Transform require", () => {
    var transform, f;
    beforeEach(() => {
        f = fixtures();
        f("version", fixtures.float());
        transform = require('./../transform')(f("resolveInfo", jasmine.createSpy()), f("resolveModule", jasmine.createSpy()));
    })
    it("when request is relative, should return as is", () => {
        expect(transform([toAst(f("request", "./path"))])).toEqual([toAst(f("request"))]);
    })
    it("when request is module, should get module name and resolve info", () => {
        expect(transform([f("request", toAst("path/a"))])).toEqual([f("request")]);
        expect(f("resolveInfo").calls.allArgs()).toEqual([["path"]]);
    })
    it("when resolve info is null, return as is", () => {
        expect(transform([f("request", toAst("/path"))])).toEqual([f("request")]);
    })
    it("when request already resolved and path is relative, should return saved", () => {
        expect(transform([f("request", toAst("path/a"))])).toEqual([f("request")]);
        expect(transform([f("request")])).toEqual([f("request")]);
    })
    it("when request is main file and resolve info get main-name and name contains .js, should return packageName + mainName(-.js) and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            main: "test.js",
            version: f("version")
        }))
        expect(transform([f("request", toAst("m"))])).toEqual([toAst("m/test"), toAst(f("version"))]);
    })
    it("when request is main file and resolve info get main-name and name not contains .js, should return packageName + mainName and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            main: "test.xxx",
            version: f("version")
        }))
        expect(transform([toAst(f("request", "m"))])).toEqual([toAst(f("request") + "/" + f("info").main), toAst(f("version"))]);
    })
    it("when request is main file and resolve info not have main, should return packageName + index and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            version: f("version")
        }))
        expect(transform([toAst(f("request", "m"))])).toEqual([toAst(f("request") + "/index"), toAst(f("version"))]);
    })

    it("when request is non-main file, should return file and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            main: "test.js",
            version: f("version")
        }))
        expect(transform([toAst(f("request", "m/a"))])).toEqual([toAst(f("request")), toAst(f("version"))]);
    })
    it("when request already resolved, should return saved", () => {
        f("resolveInfo").and.returnValue(f("info", {
            version: f("version")
        }))
        transform([toAst(f("request", "path/a"))]);
        f("resolveInfo").and.returnValue(f("info", {
            version: f("version2")
        }))
        expect(transform([toAst(f("request"))])).toEqual([toAst(f("request")), toAst(f("version"))]);
    })
    it("get deps", () => {
        f("resolveInfo").and.returnValue(f("info", {
            name: f("packageName"),
            version: f("version")
        }))
        f("resolveModule").and.returnValue(f("file"));
        transform([toAst(f("request", f("packageName") + "/a"))]);
        f("resolveModule").and.returnValue(f("file2"));
        transform([toAst(f("request2", f("relativePath", "./x")))]);
        expect(transform.getDeps()).toEqual([{ request: f("request"), rawRequest: f("request"), file: f("file"), package: { name: f("packageName"), version: f("version") } }, { rawRequest: f("request2"), request: f("request2"), file: f("file2"), package: null }]);
    })
})
function toAst(value) {
    return { type: "Literal", value: value, raw: "'" + value + "'" };
}