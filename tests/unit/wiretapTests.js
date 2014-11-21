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

        describe('__validateObjectSchema', function() {
            it('validates when object contains all specified properties', function() {
                var name = 'Valid';
                var o = {name: 'name', value: 'value'};
                var expectedProperties = ['name', 'value'];

                assert.doesNotThrow(function() { Wiretap.__validateObjectSchema(name, o, expectedProperties); });
            });

            it('fails to validate when object does not contain all specified properties', function() {
                var name = 'Invalid';
                var o = {name: 'name'};
                var expectedProperties = ['name', 'value'];

                assert.throws(function() { Wiretap.__validateObjectSchema(name, o, expectedProperties); }, /The Invalid object doesn\'t contain the value property, which is required/);
            });

            it('fails to validate when object contains properties that contain falsy values', function() {
                var name = 'Invalid';
                var o = {name: null};
                var expectedProperties = ['name', 'value'];

                assert.throws(function() { Wiretap.__validateObjectSchema(name, o, expectedProperties); }, /The Invalid object contains the name property, but it\'s value is falsy/);
            });
        });

        describe('sendTransaction', function() {
            describe('validate parameters', function() {
                it('throws an error when transactionId is not present', function() {
                    assert.throws(function() { Wiretap.sendTransaction(); });
                });

                it('throws an error when transactionId is not a string', function() {
                    assert.throws(function() { Wiretap.sendTransaction(true); });
                });

                it('throws an error when affiliation is not present', function() {
                    assert.throws(function() { Wiretap.sendTransaction('1234'); });
                });

                it('throws an error when affiliation is not a string', function() {
                    assert.throws(function() { Wiretap.sendTransaction('1234', true); });
                });

                it('throws an error when transaction is not present', function() {
                    assert.throws(function() { Wiretap.sendTransaction('1234', 'Acme Clothing'); });
                });

                it('throws an error when transaction is not an object', function() {
                    assert.throws(function() { Wiretap.sendTransaction('1234', 'Acme Clothing', true); });
                });

                it('throws an error when transactionItems is not present', function() {
                    assert.throws(function() { Wiretap.sendTransaction('1234', 'Acme Clothing', {}); });
                });

                it('throws an error when transactionItems is not an array', function() {
                    assert.throws(function() { Wiretap.sendTransaction('1234', 'Acme Clothing', {}, true); });
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

                    Wiretap.sendTransaction('1234', 'Acme Clothing', {
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

                    Wiretap.sendTransaction('1234', 'Acme Clothing', {
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

                    Wiretap.sendTransaction(
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

                    Wiretap.sendTransaction(
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

                    Wiretap.sendTransaction(
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

                    Wiretap.sendTransaction(
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
