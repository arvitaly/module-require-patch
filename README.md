# module-require-patch
Patching all require calls inside module, add full path and version


# Install

    npm install module-require-patch --save

# Example

    //source code
    var lib1 = require("lib1");
    var lib2 = require("lib1/lib2");
    
    //dest code
    var lib1 = require("lib1/index", "0.0.1");
    var lib2 = require("lib1/lib2", "0.0.1");