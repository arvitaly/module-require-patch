var scan = require('node-require-transform');
var transform = require('./transform');
var nodeModuleInfo = require('node-module-info');
module.exports = function (content, modulePath) {
    var info = nodeModuleInfo(modulePath);
    var transformer = transform(info.getFullPath());
    var code = scan(content, transformer);
    return {
        code: code,
        info: info.getFullInfo(),
        deps: transformer.getDeps()
    }
}