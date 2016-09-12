var path = require('path');
module.exports = function (modulePath) {
    modulePath = modulePath.replace(/\\/gi, "/").replace(/\//gi, path.sep);
    var rootPath = path.dirname(modulePath).split(path.sep + 'node_modules').shift();
    var pp = path.dirname(modulePath).split(path.sep + 'node_modules');
    var rd = pp.pop();
    var fp = rd.split(path.sep);
    var packageRoot = pp.join(path.sep + 'node_modules') + path.sep + 'node_modules' + path.sep + fp[1];
    return {
        root: rootPath,
        packageRoot: packageRoot
    }
}