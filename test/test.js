var assert = require('assert');
var fs = require('fs');
var jsdom = require('jsdom').jsdom;

var html = fs.readFileSync('examples/addRemove/index.html', 'utf-8');

// Runs the given function in the test environment
var runEnv = function(test) {
    jsdom.env(
        html,
        ['http://code.jquery.com/jquery-1.9.1.min.js', '../src/jquery.openCarousel.js'],
        function (errors, window) {
            // Move these off of window like normal
            var $ = window.$;
            var Ocarousel = window.Ocarousel;

            // Create ocarousel
            var ocarousel = new Ocarousel($(".ocarousel_example_programmatic"));

            // Run the test code with these variables available via closure
            test(window, $, ocarousel);
        }
    );
}

describe('Ocarousel Tests', function() {
    describe('Setup', function() {
        it('should have created frames', function(done) {
            runEnv(function(window, $, ocarousel) {
                assert.equal(ocarousel.frames.length > 0, true);
                done();
            });
        });

        it('should have picked up the same number of slides in the dom', function(done) {
            runEnv(function(window, $, ocarousel) {
                var slidesInDOM = $('.example_programmatic_slide').length;
                var slidesInOC = ocarousel.frames.length;

                assert.equal(slidesInDOM > 0, true);
                assert.equal(slidesInOC > 0, true);
                assert.equal(slidesInDOM, slidesInOC);
                done();
            });
        });
    });

    describe('Programmatic', function() {
        it('should have one new slide after adding', function(done) {
            runEnv(function(window, $, ocarousel) {
                var slidesOriginal = ocarousel.frames.length;

                var frame = window.document.createElement("div");
                frame.innerHTML = 'lol ima slide';
                frame.className = "example_programmatic_slide";
                var index = 5;
                ocarousel.add(frame, index);

                var slidesNow = ocarousel.frames.length;

                assert.equal(slidesOriginal + 1, slidesNow);
                done();
            });
        });

        it('should have one fewer slide after removing', function(done) {
            runEnv(function(window, $, ocarousel) {
                var slidesOriginal = ocarousel.frames.length;
                ocarousel.remove(5);
                var slidesNow = ocarousel.frames.length;
                
                assert.equal(slidesOriginal - 1, slidesNow);
                done();
            });
        });
    });
});
