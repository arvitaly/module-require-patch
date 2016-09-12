module.exports = function (resolveInfo) {
    var dependencies = {};
    return function (requests) {
        if (dependencies[requests[0]]) {
            return dependencies[requests[0]];
        }
        var isRelative = requests[0].substr(0, 1) === ".";
        if (isRelative) {
            dependencies[requests[0]] = requests;
            return requests;
        }
        var packageName = requests[0].split("/").shift();
        var packageInfo = resolveInfo(packageName);
        if (!packageInfo) {
            dependencies[requests[0]] = requests;
            return requests;
        }
        var isMainFile = requests[0].indexOf("/") === -1;
        if (isMainFile) {
            dependencies[requests[0]] = [packageName + "/" + (packageInfo.main ? packageInfo.main.substr(-3) == ".js" ? packageInfo.main.slice(0, -3) : packageInfo.main : "index"), packageInfo.version];
        } else {
            dependencies[requests[0]] = [requests[0], packageInfo.version];
        }
        return dependencies[requests[0]];
    }
} 
