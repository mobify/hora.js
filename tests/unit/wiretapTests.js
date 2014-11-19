define([
    '$',
    'src/js/wiretap'
], function($, Wiretap) {
    window.Mobify = {};
    window.Mobify.analytics = {};
    window.Mobify.analytics.ua = function() {};

    var proxyUA = function(callback) {
        window.Mobify.analytics.ua = callback;
    };

    describe('Wiretap', function() {
        describe('Object', function() {
            it('is correctly returned from wiretap module', function() {
                assert.isDefined(Wiretap);
                assert.isObject(Wiretap);
            });

            it('correctly includes sub-objects', function() {
                assert.isDefined(Wiretap.carousel);
                assert.isDefined(Wiretap.sidebar);
                assert.isDefined(Wiretap.cart);
                assert.isDefined(Wiretap.minicart);
                assert.isDefined(Wiretap.accordion);
            });
        });

        describe('send', function() {
            it('correctly passes through default parameters when no parameters passed', function(done) {
                Mobify.analytics.ua = function() {
                    assert.lengthOf(arguments, 2);
                    done();
                };

                Wiretap.send();
            });

            it('correctly passes through correct parameters including defaults', function(done) {
                Mobify.analytics.ua = function() {
                    assert.lengthOf(arguments, 5);
                    done();
                };

                Wiretap.send('one', 'two', 'three');
            });
        });

        describe('carousel', function() {
            it('correctly sends the complete-view event', function(done) {
                var title = 'Test 1';
                var size = 3;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Carousel - ' + title
                        && arguments[3] === 'complete-view') {
                        done();
                    }
                };

                Wiretap.carousel.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Wiretap.carousel.swipe(title, i);
                }
            });
        });

        describe('accordion', function() {
            it('correctly sends the complete-view event', function(done) {
                var title = 'Test 1';
                var size = 3;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Accordion - ' + title
                        && arguments[3] === 'complete-view') {
                        done();
                    }
                };

                Wiretap.accordion.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Wiretap.accordion.open(title, i);
                }
            });
        });

        describe('orientationChange', function() {
            it('correctly sends orientationChange data', function(done) {
                proxyUA(function() {
                    done();
                });

                Wiretap.init();

                $(window).trigger('orientationchange');
            });
        });
    });
});
