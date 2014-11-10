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
