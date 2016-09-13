var path = require('path');
var resolvePaths = require('./paths');
var scan = require('node-require-transform');
var infoResolver = require('./info-resolver');
var transform = require('./transform');
var resolveModule = require('./resolve-module');
module.exports = function (content, modulePath) {
    modulePath = path.resolve(modulePath);
    var paths = resolvePaths(modulePath);
    var resolveInfo = infoResolver(paths.root, paths.packageRoot).resolve;
    var transformer = transform(resolveInfo, resolveModule.bind(undefined, modulePath));
    var code = scan(content, transformer);
    return {
        code: code,
        file: modulePath,
        root: paths.root,
        package: {
            path: paths.packageRoot
        },
        deps: transformer.getDeps()
    }
}