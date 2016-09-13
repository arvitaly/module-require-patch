module.exports = function (resolveInfo, resolveModule) {
    var dependencies = {};
    var transformer = function (requests) {
        if (requests[0].type != "Literal") {
            return;
        }
        var req = requests[0].value;
        if (dependencies[req]) {
            return dependencies[req].requests;
        }
        dependencies[req] = {
            requests: requests,
            rawRequests: requests
        };
        var isRelative = req.substr(0, 1) === ".";
        if (isRelative) {
            return requests;
        }
        var packageName = req.split("/").shift();
        var packageInfo = resolveInfo(packageName);
        if (!packageInfo) {
            return requests;
        }
        dependencies[req].file = resolveModule(req);
        dependencies[req].package = {
            name: packageInfo.name,
            version: packageInfo.version
        }
        var isMainFile = req.indexOf("/") === -1;
        if (isMainFile) {
            dependencies[req].requests = [toAst(packageName + "/" + (packageInfo.main ? packageInfo.main.substr(-3) == ".js" ? packageInfo.main.slice(0, -3) : packageInfo.main : "index")), toAst(packageInfo.version)];
        } else {
            dependencies[req].requests = [toAst(req), toAst(packageInfo.version)];
        }
        return dependencies[req].requests;
    }
    transformer.getDeps = function () {
        var deps = [];
        for (var i in dependencies) {
            var d = dependencies[i];
            deps.push({
                file: d.file,
                request: d.requests[0],
                rawRequest: d.rawRequests[0],
                package: d.package || null
            })
        }
        return deps;
    }
    return transformer;
}
function toAst(value) {
    return { type: "Literal", value: value, raw: "'" + value + "'" };
}