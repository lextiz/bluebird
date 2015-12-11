var assert = require("assert");

describe("promises chains depth limitation", function() {

    before(function() {
        Promise.enableChainDepthLimit(5);
    });

    after(function() {
        Promise.disableChainDepthLimit();
        assert(Promise._chainDepthLimit === null);
    });

    it("chain depth calculated correctly", function() {
        var A = new Promise(function(){});
        var B = A.then(function(){});
        var C = B.then(function(){});
        var D = A.then(function(){});
        assert(A.chainDepth === 0);
        assert(B.chainDepth === 1);
        assert(C.chainDepth === 2);
        assert(D.chainDepth === 1);
    });

    it("when chin depth limit is reached exception is thrown", function() {
        var exceptionCought = false;
        var promise = new Promise(function(){});
        for (var i = 0; i < 5; i++) {
            promise = promise.then(function(){});
        }
        try {
            promise.then(function(){});
        } catch (error) {
            exceptionCought = true;
            assert(error.message === "Promises chain is too long, it reached limit of 5 promises")
        } finally {
            assert(exceptionCought === true);
        }
    });
});
