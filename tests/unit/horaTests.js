define([
    '$',
    'src/js/hora'
], function($, Hora) {
    window.Mobify = {};
    window.Mobify.analytics = {};
    window.Mobify.analytics.ua = function() {};

    var proxyUA = function(callback) {
        window.Mobify.analytics.ua = callback;
    };

    describe('Hora', function() {
        describe('Object', function() {
            it('is correctly returned from hora module', function() {
                assert.isDefined(Hora);
                assert.isObject(Hora);
            });

            it('correctly includes sub-objects', function() {
                assert.isDefined(Hora.carousel);
                assert.isDefined(Hora.sidebar);
                assert.isDefined(Hora.cart);
                assert.isDefined(Hora.minicart);
                assert.isDefined(Hora.accordion);
            });
        });

        describe('send', function() {
            it('correctly passes through default parameters when no parameters passed', function(done) {
                Mobify.analytics.ua = function() {
                    assert.lengthOf(arguments, 2);
                    done();
                };

                Hora.send();
            });

            it('correctly passes through correct parameters including defaults', function(done) {
                Mobify.analytics.ua = function() {
                    assert.lengthOf(arguments, 5);
                    done();
                };

                Hora.send('one', 'two', 'three');
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

                Hora.carousel.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.carousel.swipe(title, i);
                }
            });

            it('correctly sends slide click event', function(done) {
                var title = 'Test 1';
                var size = 1;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Carousel - ' + title
                        && arguments[3] === 'first-click') {
                        done();
                    }
                };

                Hora.carousel.load(title, size);
                Hora.carousel.slideClick(title, 1);
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

                Hora.accordion.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.accordion.open(title, i);
                }
            });
        });

        describe('orientationChange', function() {
            it('correctly sends orientationChange data', function(done) {
                proxyUA(function() {
                    done();
                });

                Hora.init();

                $(window).trigger('orientationchange');
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

        describe('sendTransaction', function() {
            describe('validate parameters', function() {
                it('throws an error when transactionId is not present', function() {
                    assert.throws(function() { Hora.sendTransaction(); });
                });

                it('throws an error when transactionId is not a string', function() {
                    assert.throws(function() { Hora.sendTransaction(true); });
                });

                it('throws an error when affiliation is not present', function() {
                    assert.throws(function() { Hora.sendTransaction('1234'); });
                });

                it('throws an error when affiliation is not a string', function() {
                    assert.throws(function() { Hora.sendTransaction('1234', true); });
                });

                it('throws an error when transaction is not present', function() {
                    assert.throws(function() { Hora.sendTransaction('1234', 'Acme Clothing'); });
                });

                it('throws an error when transaction is not an object', function() {
                    assert.throws(function() { Hora.sendTransaction('1234', 'Acme Clothing', true); });
                });

                it('throws an error when transactionItems is not present', function() {
                    assert.throws(function() { Hora.sendTransaction('1234', 'Acme Clothing', {}); });
                });

                it('throws an error when transactionItems is not an array', function() {
                    assert.throws(function() { Hora.sendTransaction('1234', 'Acme Clothing', {}, true); });
                });

                it('correctly calls ecommerce:addTransaction with the correct parameters', function(done) {
                    var callCount = 0;

                    proxyUA(function(type, transaction) {
                        callCount++;

                        if (callCount === 1) {
                            assert.equal(type, 'mobifyTracker.ecommerce:addTransaction');
                            assert.deepEqual(transaction, {
                                id: '1234',
                                affiliation: 'Acme Clothing',
                                revenue: '11.99',
                                shipping: '5',
                                tax: '1.29'
                            });
                        }

                        if (callCount === 2) {
                            done();
                        }
                    });

                    Hora.sendTransaction('1234', 'Acme Clothing', {
                        revenue: '11.99',
                        shipping: '5',
                        tax: '1.29'
                    }, []);
                });

                it('correctly stringifies ecommerce:addTransaction parameters', function(done) {
                    var callCount = 0;

                    proxyUA(function(type, transaction) {
                        callCount++;

                        if (callCount === 1) {
                            assert.equal(type, 'mobifyTracker.ecommerce:addTransaction');
                            assert.deepEqual(transaction, {
                                id: '1234',
                                affiliation: 'Acme Clothing',
                                revenue: '11.99',
                                shipping: '5',
                                tax: '1.29'
                            });
                        }

                        if (callCount === 2) {
                            done();
                        }
                    });

                    Hora.sendTransaction('1234', 'Acme Clothing', {
                        revenue: 11.99,
                        shipping: 5,
                        tax: 1.29
                    }, []);
                });

                it('correctly calls ecommerce:addItem with the correct parameters', function(done) {
                    var callCount = 0;

                    proxyUA(function(type, transactionItem) {
                        callCount++;

                        if (callCount === 2) {
                            assert.equal(type, 'mobifyTracker.ecommerce:addItem');
                            assert.deepEqual(transactionItem, {
                                id: '1234',
                                name: 'Fluffy Pink Bunnies',
                                sku: 'DD23444',
                                category: 'Party Toys',
                                price: '11.99',
                                quantity: '1'
                            });
                        }

                        if (callCount === 3) {
                            done();
                        }
                    });

                    Hora.sendTransaction(
                        '1234',
                        'Acme Clothing',
                        {
                            revenue: 11.99,
                            shipping: 5,
                            tax: 1.29
                        },
                        [
                            {
                                name: 'Fluffy Pink Bunnies',
                                sku: 'DD23444',
                                category: 'Party Toys',
                                price: '11.99',
                                quantity: '1'
                            }
                        ]);
                });

                it('correctly stringifies ecommerce:addItem parameters', function(done) {
                    var callCount = 0;

                    proxyUA(function(type, transactionItem) {
                        callCount++;

                        if (callCount === 2) {
                            assert.equal(type, 'mobifyTracker.ecommerce:addItem');
                            assert.deepEqual(transactionItem, {
                                id: '1234',
                                name: 'Fluffy Pink Bunnies',
                                sku: 'DD23444',
                                category: 'Party Toys',
                                price: '11.99',
                                quantity: '1'
                            });
                        }

                        if (callCount === 3) {
                            done();
                        }
                    });

                    Hora.sendTransaction(
                        '1234',
                        'Acme Clothing',
                        {
                            revenue: 11.99,
                            shipping: 5,
                            tax: 1.29
                        },
                        [
                            {
                                name: 'Fluffy Pink Bunnies',
                                sku: 'DD23444',
                                category: 'Party Toys',
                                price: 11.99,
                                quantity: 1
                            }
                        ]);
                });
            });

            describe('ensure calls', function() {
                it('correctly calls ecommerce:addItem for each item', function(done) {
                    var callCount = 0;
                    var items = [];

                    proxyUA(function(type, transactionItem) {
                        if (type === 'mobifyTracker.ecommerce:addItem') {
                            callCount++;

                            items.push(transactionItem);

                            if (callCount === 3) {
                                assert.equal(items.length, 3);
                                done();
                            }
                        }
                    });

                    Hora.sendTransaction(
                        '1234',
                        'Acme Clothing',
                        {
                            revenue: 11.99,
                            shipping: 5,
                            tax: 1.29
                        },
                        [
                            {
                                name: 'Fluffy Pink Bunnies',
                                sku: 'DD23444',
                                category: 'Party Toys',
                                price: 11.99,
                                quantity: 1
                            },
                            {
                                name: 'Fluffy Ducks',
                                sku: 'DD23445',
                                category: 'Party Toys',
                                price: 11.99,
                                quantity: 1
                            },
                            {
                                name: 'Fluffy Snails',
                                sku: 'DD23446',
                                category: 'Party Toys',
                                price: 11.99,
                                quantity: 1
                            }
                        ]);
                });

                it('correctly calls send with the right method name', function() {
                    var callCount = 0;

                    proxyUA(function(type) {
                        callCount++;

                        if (callCount === 3) {
                            assert.equal(type, 'mobifyTracker.ecommerce:send');
                        }
                    });

                    Hora.sendTransaction(
                        '1234',
                        'Acme Clothing',
                        {
                            revenue: 11.99,
                            shipping: 5,
                            tax: 1.29
                        },
                        [
                            {
                                name: 'Fluffy Pink Bunnies',
                                sku: 'DD23444',
                                category: 'Party Toys',
                                price: 11.99,
                                quantity: 1
                            }
                        ]);
                });
            });
        });
    });
});
