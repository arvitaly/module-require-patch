# module-require-patch
Patching all require calls inside module, add full path and version

[![npm version](https://badge.fury.io/js/module-require-patch.svg)](https://badge.fury.io/js/module-require-patch)
[![Build Status](https://travis-ci.org/arvitaly/module-require-patch.svg?branch=master)](https://travis-ci.org/arvitaly/module-require-patch)
[![Coverage Status](https://coveralls.io/repos/github/arvitaly/module-require-patch/badge.svg?branch=master)](https://coveralls.io/github/arvitaly/module-require-patch?branch=master)


# Install

    npm install module-require-patch --save

#Usage

    var patch = require('module-require-patch');
    ...
    var result = patch(code, modulePath);
    //{ code: "dest code", deps: [{request:"lib1/index", file:"FULL FILE PATH", package:{name:"lib1", version:"0.0.1"} },{request:"lib1/lib2", file:"FULL FILE PATH", package:{name:"lib1", version:"0.0.1"} }] }


# Example

    //source code
    var lib1 = require("lib1");
    var lib2 = require("lib1/lib2");
    
    //dest code
    var lib1 = require("lib1/index", "0.0.1");
    var lib2 = require("lib1/lib2", "0.0.1");

