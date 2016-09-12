module.exports = function (resolveInfo, resolveModule) {
    var dependencies = {};
    var transformer = function (requests) {
        if (dependencies[requests[0]]) {
            return dependencies[requests[0]].requests;
        }
        dependencies[requests[0]] = {
            requests: requests,
            rawRequests: requests,
            file: resolveModule(requests[0])
        };
        var isRelative = requests[0].substr(0, 1) === ".";
        if (isRelative) {
            return requests;
        }
        var packageName = requests[0].split("/").shift();
        var packageInfo = resolveInfo(packageName);
        if (!packageInfo) {
            return requests;
        }
        dependencies[requests[0]].package = {
            name: packageInfo.name,
            version: packageInfo.version
        }
        var isMainFile = requests[0].indexOf("/") === -1;
        if (isMainFile) {
            dependencies[requests[0]].requests = [packageName + "/" + (packageInfo.main ? packageInfo.main.substr(-3) == ".js" ? packageInfo.main.slice(0, -3) : packageInfo.main : "index"), packageInfo.version];
        } else {
            dependencies[requests[0]].requests = [requests[0], packageInfo.version];
        }
        return dependencies[requests[0]].requests;
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
