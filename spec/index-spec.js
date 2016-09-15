var mock = require('mock2');
var fixtures = require('fixture2');
describe("Patch code", () => {
    var patcher, transform, transformer, f;
    beforeEach(() => {
        f = fixtures();
        transform = jasmine.createSpy(); 
        transformer = jasmine.createSpy();
        patcher = mock.require('./../index', {
            "node-require-transform": transform,
            "./../transform": transformer,
            "node-module-info": f("getInfo", jasmine.createSpy()).and.returnValue({
                getFullInfo: f("getFullInfo", jasmine.createSpy()),
                getFullPath: f("getFullPath", jasmine.createSpy())
            })
        })
    })
    it("when call, should create resolver, transformer, start transform and return transform result", () => {
        f("getFullInfo").and.returnValue(f("info"));
        f("getFullPath").and.returnValue(f("fullPath"));
        transformer.and.returnValue(f("transformer", { getDeps: () => f("deps") }));
        transform.and.returnValue(f("destCode"));
        expect(patcher(f("sourceCode"), f("modulePath"))).toEqual({
            code: f("destCode"),
            info: f("info"),
            dependencies: f("deps")
        });
        expect(transformer.calls.allArgs()).toEqual([[ f("fullPath") ]]);
        expect(transform.calls.allArgs()).toEqual([[f("sourceCode"), f("transformer")]]);
    })
})