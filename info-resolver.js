var path = require('path');
module.exports = (rootDir, moduleDir) => {
    return {
        resolve: function (packageName) {
            try {
                return require(path.join(moduleDir, "node_modules", packageName, "package.json"));
            } catch (e) {
                try {
                    return require(path.join(rootDir, "node_modules", packageName, "package.json"));
                } catch (e) {
                    return null;
                }
            }
        }
    }
}