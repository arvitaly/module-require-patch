var mock = require('mock2');
var fixtures = require('fixture2');
describe("Patch code", () => {
    var patcher, transform, infoResolver, infoResolve, resolvePaths, transformer, f;
    beforeEach(() => {
        f = fixtures();
        transform = jasmine.createSpy();
        infoResolver = jasmine.createSpy();
        infoResolve = jasmine.createSpy();
        resolvePaths = jasmine.createSpy();
        transformer = jasmine.createSpy();
        infoResolver.and.returnValue({
            resolve: infoResolve
        });
        patcher = mock.require('./../index', {
            "node-require-transform": transform,
            "./../info-resolver": infoResolver,
            "./../paths": resolvePaths,
            "./../transform": transformer
        })
    })
    it("when call, should create resolver, transformer, start transform and return transform result", () => {
        resolvePaths.and.returnValue({
            root: f("rootDir"),
            packageRoot: f("packageRoot")
        })
        transformer.and.returnValue(f("transformer"))
        transform.and.returnValue(f("destCode"));
        expect(patcher(f("sourceCode"), f("modulePath"))).toBe(f("destCode"));
        expect(resolvePaths.calls.allArgs()).toEqual([[f("modulePath")]]);
        expect(infoResolver.calls.allArgs()).toEqual([[f("rootDir"), f("packageRoot")]]);
        expect(transformer.calls.allArgs()).toEqual([[infoResolve]]);
        expect(transform.calls.allArgs()).toEqual([[f("sourceCode"), f("transformer")]]);
    })
})