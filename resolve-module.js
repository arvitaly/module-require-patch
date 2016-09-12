var Module = require('module');
var path = require('path');
module.exports = function (parent, modulePath) {
    return Module._resolveFilename(modulePath, {
        paths: Module._nodeModulePaths(path.dirname(parent)),
        filename: parent,
        id: parent
    })
}