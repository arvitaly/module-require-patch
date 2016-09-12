var resolvePaths = require('./paths');
var scan = require('node-require-transform');
var infoResolver = require('./info-resolver');
var transform = require('./transform');
module.exports = function (content, modulePath) {
    var paths = resolvePaths(modulePath);
    var resolveInfo = infoResolver(paths.root, paths.packageRoot).resolve;
    return scan(content, transform(resolveInfo));
}