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
     * proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
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
                assert.isDefined(Hora.filter);
                assert.isDefined(Hora.review);
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
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.lengthOf(arguments, 2);
                    done();
                });

                Hora.send();
            });

            it('correctly passes through correct parameters including defaults', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.lengthOf(arguments, 5);
                    done();
                });

                Hora.send('one', 'two', 'three');
            });
        });

        describe('init', function() {
            it('correctly initializes with the template name', function(done) {
                var templateName = 'PDP';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Init');
                    assert.equal(eventLabel, templateName);

                    done();
                });

                Hora.init(templateName);
            });
        });

        describe('carousel', function() {
            it('correctly sends the Load event', function(done) {
                var title = 'Test 1';
                var size = 1;

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'Load');
                    assert.equal(eventValue, size);
                    done();
                });

                Hora.carousel.load(title, size);
            });

            it('correctly sends the First Move event', function(done) {
                var title = 'Test 2';
                var size = 1;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'First Move Slide #1');
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.slide(title, 1);

                Hora.__carousels.clear();
            });

            it('correctly sends the View All Slides event', function(done) {
                var title = 'Test 3';
                var size = 3;

                proxyUA(proxyAssert(6, 6, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'View All Slides');
                    assert.equal(eventValue, size);
                }, done));

                Hora.carousel.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.carousel.slide(title, i);
                }

                Hora.__carousels.clear();
            });

            it('correctly sends the First Click event', function(done) {
                var title = 'Test 4';
                var size = 1;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'First Click Slide #1');
                    assert.equal(eventValue, 1);
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.slideClick(title, 1);

                Hora.__carousels.clear();
            });

            it('correctly sends the First Icon event', function(done) {
                var title = 'Test 4';
                var size = 1;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'First Icon Slide #1');
                    assert.equal(eventValue, 1);
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.iconClick(title, 1);

                Hora.__carousels.clear();
            });

            it('correctly sends the Icon event', function(done) {
                var title = 'Test 4';
                var size = 1;

                proxyUA(proxyAssert(3, 3, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Carousel - ' + title);
                    assert.equal(eventAction, 'Previous Icon Slide #1');
                    assert.equal(eventValue, 1);
                }, done));

                Hora.carousel.load(title, size);
                Hora.carousel.iconClick(title, 1, -1);

                Hora.__carousels.clear();
            });
        });

        describe('accordion', function() {
            it('correctly sends the Load event', function(done) {
                var title = 'Test 1';
                var size = 2;

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
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

                proxyUA(proxyAssert(8, 8, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Accordion - ' + title);
                    assert.equal(eventAction, 'View All Items');
                    assert.equal(eventValue, size);
                }, done));

                Hora.accordion.load(title, size);

                for (var i = 1, l = size; i <= l; i++) {
                    Hora.accordion.open(title, i);
                }

                Hora.__accordions.clear();
            });

            it('correctly sends the First Open event', function(done) {
                var title = 'Test 3';
                var size = 2;

                proxyUA(proxyAssert(2, 2, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Accordion - ' + title);
                    assert.equal(eventAction, 'First Open Item #1');
                }, done));

                Hora.accordion.load(title, size);
                Hora.accordion.open(title, 1);

                Hora.__accordions.clear();
            });

            it('correctly sends the Multiple Open event', function(done) {
                var title = 'Test 4';
                var size = 2;

                proxyUA(proxyAssert(5, 5, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Accordion - ' + title);
                    assert.equal(eventAction, 'Open Multiple Items');
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
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    done();
                });

                $(window).trigger('orientationchange');
            });
        });

        describe('scroll', function() {
            it('correctly sends the Up event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Up');
                    done();
                });

                Hora.scroll.up(title);
            });

            it('correctly sends the Down event', function(done) {
                var title = 'Test 2';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Down');
                    done();
                });

                Hora.scroll.down(title);
            });

            it('correctly sends the Top event', function(done) {
                var title = 'Test 3';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Top');
                    done();
                });

                Hora.scroll.top(title);
            });

            it('correctly sends the Bottom event', function(done) {
                var title = 'Test 4';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Scroll - ' + title);
                    assert.equal(eventAction, 'Bottom');
                    done();
                });

                Hora.scroll.bottom(title);
            });
        });

        describe('search', function() {
            it('correctly sends the Toggle event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Search');
                    assert.equal(eventAction, 'Toggle');
                    done();
                });

                Hora.search.toggle();
            });
        });

        describe('breadcrumb', function() {
            it('correctly sends the Click event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Breadcrumb');
                    assert.equal(eventAction, 'Click');
                    done();
                });

                Hora.breadcrumb.click();
            });
        });

        describe('newsletter', function() {
            it('correctly sends the Click event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Newsletter');
                    assert.equal(eventAction, 'Click');
                    done();
                });

                Hora.newsletter.click();
            });
        });

        describe('backToTop', function() {
            it('correctly sends the Click event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Back To Top');
                    assert.equal(eventAction, 'Click');
                    done();
                });

                Hora.backToTop.click();
            });
        });

        describe('footer', function() {
            it('correctly sends the Click event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Footer');
                    assert.equal(eventAction, 'Click');
                    done();
                });

                Hora.footer.click();
            });
        });

        describe('pagination', function() {
            it('correctly sends the Click event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Pagination');
                    assert.equal(eventAction, 'Click');
                    done();
                });

                Hora.pagination.click();
            });
        });

        describe('filter', function() {
            it('correctly sends the Toggle event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Filter - ' + title);
                    assert.equal(eventAction, 'Toggle');
                    done();
                });

                Hora.filter.toggle(title);
            });
        });

        describe('sizeGuide', function() {
            it('correctly sends the Open event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Size Guide - ' + title);
                    assert.equal(eventAction, 'Open');
                    done();
                });

                Hora.sizeGuide.open(title);
            });
        });

        describe('emailFriend', function() {
            it('correctly sends the Open event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Email Friend - ' + title);
                    assert.equal(eventAction, 'Open');
                    done();
                });

                Hora.emailFriend.open(title);
            });
        });

        describe('emailMeBack', function() {
            it('correctly sends the Open event', function(done) {
                var title = 'Test 1';
                
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Email Me Back - ' + title);
                    assert.equal(eventAction, 'Open');
                    done();
                });

                Hora.emailMeBack.open(title);
            });
        });

        describe('color', function() {
            it('correctly sends the Change event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Color - ' + title);
                    assert.equal(eventAction, 'Change');
                    done();
                });

                Hora.color.change(title);
            });
        });

        describe('quantity', function() {
            it('correctly sends the Change event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Quantity - ' + title);
                    assert.equal(eventAction, 'Change');
                    done();
                });

                Hora.quantity.change(title);
            });
        });

        describe('size', function() {
            it('correctly sends the Change event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Size - ' + title);
                    assert.equal(eventAction, 'Change');
                    done();
                });

                Hora.size.change(title);
            });
        });

        describe('error', function() {
            it('correctly sends the Generic Error event', function(done) {
                var title = 'Section 1';
                var message = 'Unknown Error';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Error');
                    assert.equal(eventAction, title + ': ' + message);
                    done();
                });

                Hora.error.generic(title, message);
            });

            it('correctly sends the Alert event', function(done) {
                var message = 'Unknown Error';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Error');
                    assert.equal(eventAction, 'Alert: ' + message);
                    done();
                });

                Hora.error.alert(message);
            });

            it('correctly sends the Unsuccessful Submission event', function(done) {
                var message = 'Message here';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Error');
                    assert.equal(eventAction, 'Unsuccessful Submission: ' + message);
                    done();
                });

                Hora.error.unsuccessfulSubmission(message);
            });

            it('correctly sends the Unsuccessful Add To Cart event', function(done) {
                var message = 'Message here';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Error');
                    assert.equal(eventAction, 'Unsuccessful Add To Cart: ' + message);
                    done();
                });

                Hora.error.unsuccessfulAddToCart(message);
            });

            it('correctly sends the Unsuccessful Place Order event', function(done) {
                var message = 'Message here';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Error');
                    assert.equal(eventAction, 'Unsuccessful Place Order: ' + message);
                    done();
                });

                Hora.error.unsuccessfulPlaceOrder(message);
            });
        });

        describe('review', function() {
            it('correctly sends the Read event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Review - ' + title);
                    assert.equal(eventAction, 'Read');
                    done();
                });

                Hora.review.read(title);
            });
        });

        describe('sidebar', function() {
            it('correctly sends the Open event', function(done) {
                var title = 'Test 1';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Sidebar - ' + title);
                    assert.equal(eventAction, 'Open');
                    done();
                });

                Hora.sidebar.open(title);
            });

            it('correctly sends the Close event', function(done) {
                var title = 'Test 2';

                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Sidebar - ' + title);
                    assert.equal(eventAction, 'Close');
                    done();
                });

                Hora.sidebar.close(title);
            });
        });

        describe('cart', function() {
            it('correctly sends the Add Item event', function(done) {
                var title = 'Product Title 1';

                proxyUA(proxyAssert(1, 1, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Cart');
                    assert.equal(eventAction, 'Add Item');
                }, done));

                Hora.cart.addItem(title);
            });

            it('correctly sends the Add Item After View All Carousel Items event', function(done) {
                var title = 'Product Title 2';

                proxyUA(proxyAssert(6, 6, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Cart');
                    assert.equal(eventAction, 'Add Item After View All Carousel Items');
                }, done));

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
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Mini-Cart');
                    assert.equal(eventAction, 'Toggle');
                    done();
                });

                Hora.minicart.toggle();
            });

            it('correctly sends the Enable Edit event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Mini-Cart');
                    assert.equal(eventAction, 'Enable Edit');
                    done();
                });

                Hora.minicart.enableEdit();
            });

            it('correctly sends the Disable Edit event', function(done) {
                proxyUA(function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Mini-Cart');
                    assert.equal(eventAction, 'Disable Edit');
                    done();
                });

                Hora.minicart.disableEdit();
            });
        });

        describe('checkout', function() {
            it('correctly sends the Change event', function(done) {
                var message = 'Checkout Page - PayPal Button';

                proxyUA(proxyAssert(1, 1, function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
                    assert.equal(eventCategory, 'Checkout');
                    assert.equal(eventAction, 'Start: ' + message);
                }, done));

                Hora.checkout.start(message);
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

        describe('transaction', function() {
            describe('validate Send parameters', function() {
                it('throws an error when transactionId is not present', function() {
                    assert.throws(function() { Hora.transaction.send(); });
                });

                it('throws an error when transactionId is not a string', function() {
                    assert.throws(function() { Hora.transaction.send(true); });
                });

                it('throws an error when affiliation is not present', function() {
                    assert.throws(function() { Hora.transaction.send('1234'); });
                });

                it('throws an error when affiliation is not a string', function() {
                    assert.throws(function() { Hora.transaction.send('1234', true); });
                });

                it('throws an error when transaction is not present', function() {
                    assert.throws(function() { Hora.transaction.send('1234', 'Acme Clothing'); });
                });

                it('throws an error when transaction is not an object', function() {
                    assert.throws(function() { Hora.transaction.send('1234', 'Acme Clothing', true); });
                });

                it('throws an error when transactionItems is not present', function() {
                    assert.throws(function() { Hora.transaction.send('1234', 'Acme Clothing', {}); });
                });

                it('throws an error when transactionItems is not an array', function() {
                    assert.throws(function() { Hora.transaction.send('1234', 'Acme Clothing', {}, true); });
                });

                it('correctly calls ecommerce:addTransaction with the correct parameters', function(done) {
                    var callCount = 0;

                    proxyUA(proxyAssert(1, 2, function(type, transaction) {
                        assert.equal(type, 'mobifyTracker.ecommerce:addTransaction');
                        assert.deepEqual(transaction, {
                            id: '1234',
                            affiliation: 'Acme Clothing',
                            revenue: '11.99',
                            shipping: '5',
                            tax: '1.29'
                        });
                    }, done));

                    Hora.transaction.send('1234', 'Acme Clothing', {
                        revenue: '11.99',
                        shipping: '5',
                        tax: '1.29'
                    }, []);
                });

                it('correctly stringifies ecommerce:addTransaction parameters', function(done) {
                    var callCount = 0;

                    proxyUA(proxyAssert(1, 2, function(type, transaction) {
                        assert.equal(type, 'mobifyTracker.ecommerce:addTransaction');
                        assert.deepEqual(transaction, {
                            id: '1234',
                            affiliation: 'Acme Clothing',
                            revenue: '11.99',
                            shipping: '5',
                            tax: '1.29'
                        });
                    }, done));

                    Hora.transaction.send('1234', 'Acme Clothing', {
                        revenue: 11.99,
                        shipping: 5,
                        tax: 1.29
                    }, []);
                });

                it('correctly calls ecommerce:addItem with the correct parameters', function(done) {
                    var callCount = 0;

                    proxyUA(proxyAssert(2, 3, function(type, transactionItem) {
                        assert.equal(type, 'mobifyTracker.ecommerce:addItem');
                        assert.deepEqual(transactionItem, {
                            id: '1234',
                            name: 'Fluffy Pink Bunnies',
                            sku: 'DD23444',
                            category: 'Party Toys',
                            price: '11.99',
                            quantity: '1'
                        });
                    }, done));

                    Hora.transaction.send(
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

                    proxyUA(proxyAssert(2, 3, function(type, transactionItem) {
                        assert.equal(type, 'mobifyTracker.ecommerce:addItem');
                        assert.deepEqual(transactionItem, {
                            id: '1234',
                            name: 'Fluffy Pink Bunnies',
                            sku: 'DD23444',
                            category: 'Party Toys',
                            price: '11.99',
                            quantity: '1'
                        });
                    }, done));

                    Hora.transaction.send(
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

            describe('ensure Send calls', function() {
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

                    Hora.transaction.send(
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

                it('correctly calls send with the right method name', function(done) {
                    var callCount = 0;

                    proxyUA(proxyAssert(3, 3, function(type) {
                        assert.equal(type, 'mobifyTracker.ecommerce:send');
                    }, done));

                    Hora.transaction.send(
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
