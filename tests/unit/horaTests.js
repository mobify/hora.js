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
                assert.isDefined(Hora.search);
                assert.isDefined(Hora.filters);
                assert.isDefined(Hora.color);
                assert.isDefined(Hora.quantity);
                assert.isDefined(Hora.size);
                assert.isDefined(Hora.error);
                assert.isDefined(Hora.emailFriend);
                assert.isDefined(Hora.emailMeBack);
                assert.isDefined(Hora.sidebar);
                assert.isDefined(Hora.navigation);
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
            it('correctly sends the Load event', function(done) {
                var title = 'Test 1';
                var size = 1;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Carousel - ' + title
                        && arguments[3] === 'Load'
                        && arguments[4] === 'Total ' + size) {
                        done();
                    }
                };

                Hora.carousel.load(title, size);
            });

            it('correctly sends the First Slide event', function(done) {
                var title = 'Test 2';
                var size = 1;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Carousel - ' + title
                        && arguments[3] === 'First Slide') {
                        done();
                    }
                };

                Hora.carousel.load(title, size);
                Hora.carousel.slide(title, 1);

                Hora.__carousels.clear();
            });

            it('correctly sends the View All Slides event', function(done) {
                var title = 'Test 3';
                var size = 3;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Carousel - ' + title
                        && arguments[3] === 'View All Slides') {
                        done();
                    }
                };

                Hora.carousel.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.carousel.slide(title, i);
                }

                Hora.__carousels.clear();
            });

            it('correctly sends the First Click event', function(done) {
                var title = 'Test 4';
                var size = 1;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Carousel - ' + title
                        && arguments[3] === 'First Click') {
                        done();
                    }
                };

                Hora.carousel.load(title, size);
                Hora.carousel.slideClick(title, 1);

                Hora.__carousels.clear();
            });
        });

        describe('accordion', function() {
            it('correctly sends the Load event', function(done) {
                var title = 'Test 1';
                var size = 2;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Accordion - ' + title
                        && arguments[3] === 'Load'
                        && arguments[4] === 'Total ' + size) {
                        done();
                    }
                };

                Hora.accordion.load(title, size);

                Hora.__accordions.clear();
            });

            it('correctly sends the View All Items event', function(done) {
                var title = 'Test 2';
                var size = 3;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Accordion - ' + title
                        && arguments[3] === 'View All Items') {
                        done();
                    }
                };

                Hora.accordion.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.accordion.open(title, i);
                }

                Hora.__accordions.clear();
            });

            it('correctly sends the First Open event', function(done) {
                var title = 'Test 3';
                var size = 2;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Accordion - ' + title
                        && arguments[3] === 'First Open') {
                        done();
                    }
                };

                Hora.accordion.load(title, size);
                Hora.accordion.open(title, 1);

                Hora.__accordions.clear();
            });

            it('correctly sends the Multiple Open event', function(done) {
                var title = 'Test 4';
                var size = 2;

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Accordion - ' + title
                        && arguments[3] === 'Open Multiple') {
                        done();
                    }
                };

                Hora.accordion.load(title, size);
                Hora.accordion.open(title, 1);
                Hora.accordion.open(title, 2);

                Hora.__accordions.clear();
            });
        });

        describe('orientationChange', function() {
            it('correctly sends Orientation Change data', function(done) {
                proxyUA(function() {
                    done();
                });

                Hora.init();

                $(window).trigger('orientationchange');
            });
        });

        describe('scroll', function() {
            it('correctly sends the Up event', function(done) {
                var title = 'Test 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Scroll - ' + title
                        && arguments[3] === 'Up') {
                        done();
                    }
                };

                Hora.scroll.up(title);
            });

            it('correctly sends the Down event', function(done) {
                var title = 'Test 2';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Scroll - ' + title
                        && arguments[3] === 'Down') {
                        done();
                    }
                };

                Hora.scroll.down(title);
            });

            it('correctly sends the Top event', function(done) {
                var title = 'Test 3';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Scroll - ' + title
                        && arguments[3] === 'Top') {
                        done();
                    }
                };

                Hora.scroll.top(title);
            });

            it('correctly sends the Bottom event', function(done) {
                var title = 'Test 4';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Scroll - ' + title
                        && arguments[3] === 'Bottom') {
                        done();
                    }
                };

                Hora.scroll.bottom(title);
            });
        });

        describe('search', function() {
            it('correctly sends the Toggle event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Search'
                        && arguments[3] === 'Toggle') {
                        done();
                    }
                };

                Hora.search.toggle();
            });
        });

        describe('breadcrumb', function() {
            it('correctly sends the Interact event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Breadcrumb'
                        && arguments[3] === 'Interact') {
                        done();
                    }
                };

                Hora.breadcrumb.interact();
            });
        });

        describe('newsletter', function() {
            it('correctly sends the Interact event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Newsletter'
                        && arguments[3] === 'Interact') {
                        done();
                    }
                };

                Hora.newsletter.interact();
            });
        });

        describe('backToTop', function() {
            it('correctly sends the Click event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Back To Top'
                        && arguments[3] === 'Click') {
                        done();
                    }
                };

                Hora.backToTop.click();
            });
        });

        describe('footer', function() {
            it('correctly sends the Interact event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Footer'
                        && arguments[3] === 'Interact') {
                        done();
                    }
                };

                Hora.footer.interact();
            });
        });

        describe('pagination', function() {
            it('correctly sends the Interact event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Pagination'
                        && arguments[3] === 'Interact') {
                        done();
                    }
                };

                Hora.pagination.interact();
            });
        });

        describe('filters', function() {
            it('correctly sends the Toggle event', function(done) {
                var title = 'Test 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Filters - ' + title
                        && arguments[3] === 'Toggle') {
                        done();
                    }
                };

                Hora.filters.toggle(title);
            });
        });

        describe('sizeGuide', function() {
            it('correctly sends the Open event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Size Guide'
                        && arguments[3] === 'Open') {
                        done();
                    }
                };

                Hora.sizeGuide.open();
            });
        });

        describe('emailFriend', function() {
            it('correctly sends the Open event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Email Friend'
                        && arguments[3] === 'Open') {
                        done();
                    }
                };

                Hora.emailFriend.open();
            });
        });

        describe('emailMeBack', function() {
            it('correctly sends the Open event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Email Me Back'
                        && arguments[3] === 'Open') {
                        done();
                    }
                };

                Hora.emailMeBack.open();
            });
        });

        describe('color', function() {
            it('correctly sends the Change event', function(done) {
                var title = 'Test 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Color - ' + title
                        && arguments[3] === 'Change') {
                        done();
                    }
                };

                Hora.color.change(title);
            });
        });

        describe('quantity', function() {
            it('correctly sends the Change event', function(done) {
                var title = 'Test 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Quantity - ' + title
                        && arguments[3] === 'Change') {
                        done();
                    }
                };

                Hora.quantity.change(title);
            });
        });

        describe('size', function() {
            it('correctly sends the Change event', function(done) {
                var title = 'Test 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Size - ' + title
                        && arguments[3] === 'Change') {
                        done();
                    }
                };

                Hora.size.change(title);
            });
        });

        describe('error', function() {
            it('correctly sends the Alert event', function(done) {
                var message = 'Unknown Error';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Error'
                        && arguments[3] === 'Alert'
                        && arguments[4] === message) {
                        done();
                    }
                };

                Hora.error.alert(message);
            });
        });

        describe('reviews', function() {
            it('correctly sends the Read event', function(done) {
                var title = 'Test 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Reviews - ' + title
                        && arguments[3] === 'Read') {
                        done();
                    }
                };

                Hora.reviews.read(title);
            });
        });

        describe('sidebar', function() {
            it('correctly sends the Open event', function(done) {
                var title = 'Test 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Sidebar - ' + title
                        && arguments[3] === 'Open') {
                        done();
                    }
                };

                Hora.sidebar.open(title);
            });

            it('correctly sends the Close event', function(done) {
                var title = 'Test 2';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Sidebar - ' + title
                        && arguments[3] === 'Close') {
                        done();
                    }
                };

                Hora.sidebar.close(title);
            });
        });

        describe('cart', function() {
            it('correctly sends the Add Item event', function(done) {
                var title = 'Product Title 1';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Cart'
                        && arguments[3] === 'Add Item') {
                        done();
                    }
                };

                Hora.cart.addItem(title);
            });

            it('correctly sends the Add Item After View All Carousel Items event', function(done) {
                var title = 'Product Title 2';

                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Cart'
                        && arguments[3] === 'Add Item After View All Carousel Items') {
                        done();
                    }
                };

                var carouselTitle = 'Test 5';
                var size = 2;

                Hora.carousel.load(carouselTitle, size);
                Hora.carousel.slide(carouselTitle, 1);
                Hora.carousel.slide(carouselTitle, 2);

                Hora.cart.addItem(title);

                Hora.__carousels.clear();
            });
        });

        describe('minicart', function() {
            it('correctly sends the Toggle event', function(done) {
                Mobify.analytics.ua = function() {
                    if (arguments[2] === 'Mini-Cart'
                        && arguments[3] === 'Toggle') {
                        done();
                    }
                };

                Hora.minicart.toggle();
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
