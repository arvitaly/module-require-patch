var resolvePaths = require('./paths');
var scan = require('node-require-transform');
var infoResolver = require('./info-resolver');
var transform = require('./transform');
var resolveModule = require('./resolve-module');
module.exports = function (content, modulePath) {
    var paths = resolvePaths(modulePath);
    var resolveInfo = infoResolver(paths.root, paths.packageRoot).resolve;    
    var transformer = transform(resolveInfo, resolveModule.bind(undefined, modulePath));
    var code = scan(content, transformer);
    return {
        code: code,
        deps: transformer.getDeps()
    }
}