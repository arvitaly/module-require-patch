var fixtures = require('fixture2');
describe("Transform require", () => {
    var transform, f;
    beforeEach(() => {
        f = fixtures();
        f("version", fixtures.float());
        transform = require('./../transform')(f("resolveInfo", jasmine.createSpy()), f("resolveModule", jasmine.createSpy()));
    })
    it("when request is relative, should return as is", () => {
        expect(transform([f("request", "./path")])).toEqual([f("request")]);
    })
    it("when request is module, should get module name and resolve info", () => {
        expect(transform([f("request", "path/a")])).toEqual([f("request")]);
        expect(f("resolveInfo").calls.allArgs()).toEqual([["path"]]);
    })
    it("when resolve info is null, return as is", () => {
        expect(transform([f("request", "/path")])).toEqual([f("request")]);
    })
    it("when request already resolved and path is relative, should return saved", () => {
        expect(transform([f("request", "path/a")])).toEqual([f("request")]);
        expect(transform([f("request")])).toEqual([f("request")]);
    })
    it("when request is main file and resolve info get main-name and name contains .js, should return packageName + mainName(-.js) and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            main: "test.js",
            version: f("version")
        }))
        expect(transform([f("request", "m")])).toEqual(["m/test", f("version")]);
    })
    it("when request is main file and resolve info get main-name and name not contains .js, should return packageName + mainName and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            main: "test.xxx",
            version: f("version")
        }))
        expect(transform([f("request", "m")])).toEqual([f("request") + "/" + f("info").main, f("version")]);
    })
    it("when request is main file and resolve info not have main, should return packageName + index and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            version: f("version")
        }))
        expect(transform([f("request", "m")])).toEqual([f("request") + "/index", f("version")]);
    })

    it("when request is non-main file, should return file and version", () => {
        f("resolveInfo").and.returnValue(f("info", {
            main: "test.js",
            version: f("version")
        }))
        expect(transform([f("request", "m/a")])).toEqual([f("request"), f("version")]);
    })
    it("when request already resolved, should return saved", () => {
        f("resolveInfo").and.returnValue(f("info", {
            version: f("version")
        }))
        transform([f("request", "path/a")]);
        f("resolveInfo").and.returnValue(f("info", {
            version: f("version2")
        }))
        expect(transform([f("request")])).toEqual([f("request"), f("version")]);
    })
    it("get deps", () => {
        f("resolveInfo").and.returnValue(f("info", {
            name: f("packageName"),
            version: f("version")
        }))
        f("resolveModule").and.returnValue(f("file"));
        transform([f("request", f("packageName") + "/a")]);
        f("resolveModule").and.returnValue(f("file2"));
        transform([f("request2", f("relativePath", "./x"))]);
        expect(transform.getDeps()).toEqual([{ request: f("request"), rawRequest: f("request"), file: f("file"), package: { name: f("packageName"), version: f("version") } }, { rawRequest: f("request2"), request: f("request2"), file: f("file2"), package: null }]);
    })
})