var nodeModuleInfo = require('node-module-info');
module.exports = function (parent) {
    var dependencies = {};
    var transformer = function (requests) {
        if (requests[0].type != "Literal") {
            return;
        }
        var req = requests[0].value;
        if (dependencies[req]) {
            return dependencies[req].requests.map(toAst);
        }
        var astRequests = requests;
        requests = requests.map((r) => r.value);
        dependencies[req] = {
            astRequests: astRequests,
            requests: requests,
            rawRequests: requests
        };
        var info = nodeModuleInfo(req, parent)
        dependencies[req].info = info.getFullInfo();
        dependencies[req].file = info.getFullPath();// resolveModule(req);        
        if (info.isRelative()) {
            return astRequests;
        }
        //var packageName = req.split("/").shift();
        var packageInfo = info.getPackageInfo();// resolveInfo(packageName);
        if (!packageInfo) {
            //dependencies[req].file = null;
            return astRequests;
        }

        dependencies[req].package = {
            name: packageInfo.name,
            version: packageInfo.version
        }
        var isMainFile = req.indexOf("/") === -1;
        if (isMainFile) {
            dependencies[req].requests = [packageInfo.name + "/" + (packageInfo.main ? packageInfo.main.substr(-3) == ".js" ? packageInfo.main.slice(0, -3) : packageInfo.main : "index"), packageInfo.version];
        } else {
            dependencies[req].requests = [req, packageInfo.version];
        }
        return dependencies[req].requests.map(toAst);
    }
    transformer.getDeps = function () {
        var deps = [];
        for (var i in dependencies) {
            var d = dependencies[i];
            deps.push({
                info: d.info,
                request: d.requests[0],
                rawRequest: d.rawRequests[0]
            })
        }
        return deps;
    }
    return transformer;
}
function toAst(value) {
    return { type: "Literal", value: value, raw: "'" + value + "'" };
}