var mock = require('mock2');
var fixtures = require('fixture2');
describe("Transform require", () => {
    var transform, f;
    beforeEach(() => {
        f = fixtures();
        f("version", fixtures.float());
        transform = mock.require('./../transform', {
            "node-module-info": f("getInfo", jasmine.createSpy()).and.returnValue({
                getFullPath: f("getFullPath", jasmine.createSpy()),
                isRelative: f("isRelative", jasmine.createSpy()),
                getPackageInfo: f("getPackageInfo", jasmine.createSpy()),
                getFullInfo: f("getFullInfo", jasmine.createSpy())
            })
        })(f("parent"));
    })
    it("when request is relative, should return as is", () => {
        f("isRelative").and.returnValue(true);
        expect(transform([toAst(f("request", "./path"))])).toEqual([toAst(f("request"))]);
    })
    it("when resolve info is null, return as is", () => {
        f("getPackageInfo").and.returnValue(null);
        expect(transform([f("request", toAst("/path"))])).toEqual([f("request")]);
    })
    it("when request is main file and resolve info get main-name and name contains .js, should return packageName + mainName(-.js) and version", () => {
        f("getPackageInfo").and.returnValue(f("info", {
            name: "m",
            main: "test.js",
            version: f("version")
        }))
        expect(transform([f("request", toAst("m"))])).toEqual([toAst("m/test"), toAst(f("version"))]);
    })
    it("when request is main file and resolve info get main-name and name not contains .js, should return packageName + mainName and version", () => {
        f("getPackageInfo").and.returnValue(f("info", {
            name: "m",
            main: "test.xxx",
            version: f("version")
        }))
        expect(transform([toAst(f("request", "m"))])).toEqual([toAst(f("request") + "/" + f("info").main), toAst(f("version"))]);
    })
    it("when request is main file and resolve info not have main, should return packageName + index and version", () => {
        f("getPackageInfo").and.returnValue(f("info", {
            name: "m",
            version: f("version")
        }))
        expect(transform([toAst(f("request", "m"))])).toEqual([toAst(f("request") + "/index"), toAst(f("version"))]);
    })
    it("when request is non-main file, should return file and version", () => {
        f("getPackageInfo").and.returnValue(f("info", {
            main: "test.js",
            version: f("version")
        }))
        expect(transform([toAst(f("request", "m/a"))])).toEqual([toAst(f("request")), toAst(f("version"))]);
    })
    it("when request already resolved, should return saved", () => {
        f("getPackageInfo").and.returnValue(f("info", {
            version: f("version")
        }))
        transform([toAst(f("request", "path/a"))]);
        f("getPackageInfo").and.returnValue(f("info", {
            version: f("version2")
        }))
        expect(transform([toAst(f("request"))])).toEqual([toAst(f("request")), toAst(f("version"))]);
    })
    it("get deps", () => {
        f("getPackageInfo").and.returnValue(f("info", {
            name: f("packageName"),
            version: f("version")
        }))
        f("getFullPath").and.returnValue(f("file"));
        f("getFullInfo").and.returnValue("fullInfo1");
        transform([toAst(f("request", f("packageName") + "/a"))]);
        f("getFullPath").and.returnValue(f("file2"));
        f("getPackageInfo").and.returnValue(null);
        f("getFullInfo").and.returnValue("fullInfo2");
        transform([toAst(f("request2", f("relativePath", "./x")))]);
        expect(transform.getDeps()).toEqual([{ request: f("request"), rawRequest: f("request"), info: f("fullInfo1") }, { rawRequest: f("request2"), request: f("request2"), info: f("fullInfo2") }]);
    })
})
function toAst(value) {
    return { type: "Literal", value: value, raw: "'" + value + "'" };
}