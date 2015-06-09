define([
    '$',
    'src/js/hora'
], function($, Hora) {
    window.Mobify = {};
    window.Mobify.analytics = {};
    window.Mobify.analytics.ua = function() {};
    var oldLog;

    var proxyUA = function(fn) {
        window.Mobify.analytics.ua = fn;
    };

    var proxyLog = function(fn) {
        oldLog = console.log;

        console.log = fn;
    };

    /**
     * @description Helper function for validating something (usually GA event category/action) after X calls.
     *
     * @param {int} start - Which interaction to call the validator callback on
     * @param {int} finish - WHich interation to call the done callback on
     * @param {function} validator - Callback that does some checking/asserts
     * @param {function} done - Callback to when the asserting is finished
     *
     * @example
     *
     * proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
     *     assert.equal(eventCategory, 'Something');
     * }, done));
     */
    var proxyAssert = function(start, finish, validator, done) {
        var count = 0;

        return function() {
            count++;

            if (count === start) {
                validator.apply(null, arguments);
            }

            if (count === finish) {
                done();
            }
        };
    };

    describe('Hora', function() {
        Hora.init();
        Hora.config.trackInteractions = true;

        describe('Object', function() {
            it('is correctly returned from hora module', function() {
                assert.isDefined(Hora);
                assert.isObject(Hora);
            });

            it('correctly includes sub-objects', function() {
                assert.isDefined(Hora.carousel);
                assert.isDefined(Hora.accordion);
                assert.isDefined(Hora.error);
            });
        });

        describe('send', function() {
            it('correctly passes through default parameters when no parameters passed', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.lengthOf(arguments, 2);
                    done();
                });

                Hora.send();
            });

            it('correctly passes through correct parameters including defaults', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.lengthOf(arguments, 5);
                    done();
                });

                Hora.send('one', 'two', 'three');
            });

            it('correctly calls console.log in debug mode', function(done) {
                Hora.isDebug = true;


                proxyLog(function() {
                    Hora.isDebug = false;
                    console.log = oldLog;

                    done();
                });

                Hora.send('hora');
            });
        });

        describe('carousel', function() {
            it('correctly sends the Load event', function(done) {
                var title = 'Test 1';
                var size = 1;

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'Load');
                    assert.equal(eventLabel, 'Total ' + size);
                    assert.equal(eventValue, size);
                    done();
                });

                Hora.carousel.load(title, size);
            });

            it('correctly sends the Move event with the First Item metric', function(done) {
                var title = 'Test 2';
                var size = 1;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'Move');
                    assert.equal(eventLabel, 'Slide #1');
                    assert.equal(eventValue, 1);
                    assert.deepEqual(eventParams, {
                        'metric15': 1
                    });
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.slide(title, 1);

                Hora.__carousels.clear();
            });

            it('correctly sends the View All Slides event', function(done) {
                var title = 'Test 3';
                var size = 3;

                proxyUA(proxyAssert(5, 5, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'View All Slides');
                    assert.equal(eventLabel, 'Total ' + size);
                    assert.equal(eventValue, size);
                }, done));

                Hora.carousel.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.carousel.slide(title, i);
                }

                Hora.__carousels.clear();
            });

            it('correctly sends the Click event with the First Item metric', function(done) {
                var title = 'Test 4';
                var size = 1;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'Click');
                    assert.equal(eventLabel, 'Slide #1');
                    assert.equal(eventValue, 1);
                    assert.deepEqual(eventParams, {
                        'metric15': 1
                    });
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.slideClick(title, 1);

                Hora.__carousels.clear();
            });

            it('correctly sends the Icon event with the First Item metric', function(done) {
                var title = 'Test 4';
                var size = 1;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'Next Icon');
                    assert.equal(eventLabel, 'Slide #1');
                    assert.equal(eventValue, 1);
                    assert.deepEqual(eventParams, {
                        'metric15': 1
                    });
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.iconClick(title, 1);

                Hora.__carousels.clear();
            });

            it('correctly sends the Icon event without the First Item metric', function(done) {
                var title = 'Test 4';
                var size = 1;

                proxyUA(proxyAssert(3, 3, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'Previous Icon');
                    assert.equal(eventLabel, 'Slide #1');
                    assert.equal(eventValue, 1);
                    assert.deepEqual(eventParams, {
                        'metric15': 0
                    });
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.iconClick(title, 1, 1);
                Hora.carousel.iconClick(title, 1, -1);

                Hora.__carousels.clear();
            });
        });

        describe('accordion', function() {
            it('correctly sends the Load event', function(done) {
                var title = 'Test 1';
                var size = 2;

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Accordion - ' + title);
                    assert.equal(eventAction, 'Load');
                    assert.equal(eventValue, size);
                    done();
                });

                Hora.accordion.load(title, size);

                Hora.__accordions.clear();
            });

            it('correctly sends the View All Items event', function(done) {
                var title = 'Test 2';
                var size = 3;

                proxyUA(proxyAssert(7, 7, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Accordion - ' + title);
                    assert.equal(eventAction, 'View All Items');
                    assert.equal(eventLabel, 'Total ' + size);
                    assert.equal(eventValue, size);
                }, done));

                Hora.accordion.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.accordion.open(title, i);
                }

                Hora.__accordions.clear();
            });

            it('correctly sends the Open event without the First Item metric', function(done) {
                var title = 'Test 3';
                var size = 2;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Accordion - ' + title);
                    assert.equal(eventAction, 'Open');
                    assert.equal(eventLabel, 'Item #1');
                    assert.deepEqual(eventParams, {
                        'metric15': 1
                    });
                }, done));

                Hora.accordion.load(title, size);
                Hora.accordion.open(title, 1);

                Hora.__accordions.clear();
            });

            it('correctly sends the Multiple Open event', function(done) {
                var title = 'Test 4';
                var size = 2;

                proxyUA(proxyAssert(4, 4, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Accordion - ' + title);
                    assert.equal(eventAction, 'Open Multiple Items');
                    assert.equal(eventLabel, 'Total ' + size);
                    assert.equal(eventValue, size);
                }, done));

                Hora.accordion.load(title, size);
                Hora.accordion.open(title, 1);
                Hora.accordion.open(title, 2);

                Hora.__accordions.clear();
            });
        });

        describe('orientation', function() {
            it('correctly sends Change data', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    done();
                });

                $(window).trigger('orientationchange');
            });
        });

        describe('scroll', function() {
            it('correctly sends the Up event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Up');
                    done();
                });

                Hora.scroll.up(title);
            });

            it('correctly sends the Down event', function(done) {
                var title = 'Test 2';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Down');
                    done();
                });

                Hora.scroll.down(title);
            });

            it('correctly sends the Top event', function(done) {
                var title = 'Test 3';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Top');
                    done();
                });

                Hora.scroll.top(title);
            });

            it('correctly sends the Bottom event', function(done) {
                var title = 'Test 4';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Bottom');
                    done();
                });

                Hora.scroll.bottom(title);
            });
        });

        describe('error', function() {
            it('correctly sends the Generic Error event', function(done) {
                var title = 'Section 1';
                var message = 'Unknown Error';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Error');
                    assert.equal(eventAction, title);
                    assert.equal(eventLabel, message);
                    done();
                });

                Hora.error.generic(title, message);
            });

            it('correctly sends the Alert event', function(done) {
                var message = 'Unknown Error';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue, eventParams) {
                    assert.equal(eventCategory, 'Error');
                    assert.equal(eventAction, 'Alert');
                    assert.equal(eventLabel, message);
                    done();
                });

                Hora.error.alert(message);
            });
        });

        describe('__validateObjectSchema', function() {
            it('validates when object contains all specified properties', function() {
                var name = 'Valid';
                var o = {name: 'name', value: 'value'};
                var expectedProperties = ['name', 'value'];

                assert.doesNotThrow(function() { Hora.__validateObjectSchema(name, o, expectedProperties); });
            });

            it('fails to validate when object does not contain all specified properties', function() {
                var name = 'Invalid';
                var o = {name: 'name'};
                var expectedProperties = ['name', 'value'];

                assert.throws(function() { Hora.__validateObjectSchema(name, o, expectedProperties); }, /The Invalid object doesn\'t contain the value property, which is required/);
            });

            it('fails to validate when object contains properties that contain falsy values', function() {
                var name = 'Invalid';
                var o = {name: null};
                var expectedProperties = ['name', 'value'];

                assert.throws(function() { Hora.__validateObjectSchema(name, o, expectedProperties); }, /The Invalid object contains the name property, but it\'s value is falsy/);
            });
        });
    });
});
