/* global Mobify */
/* jslint maxstatements: false */
/*
 Wiretap
 -------
 A library that assists with tracking user-behavior with custom Google Analytics events

 Implicit tracking:
 * Re-orientation (landscape to portrait and visa-versa)
 * Page fully scrolled to bottom

 Explicit tracking (requires development):
 * Carousel first swipe (slide ID)
 * Carousel viewed entirely
 * Carousel slide clicked
 * Carousel arrow control clicked
 * Carousel loaded
 * Carousel slide zoomed
 * Sidebar navigation item clicked (up to 3 levels deep)
 * Header search toggled
 * Header minicart toggled
 * Breadcrumb interacted with
 * Back to top clicked
 * Newsletter interacted with
 * Footer interacted with
 * Pagination interacted with
 * Size guide opened
 * Email to friend opened
 * Email me back opened
 * Color adjustments
 * Quantity adjustments
 * Size adjustments
 * Reviews checked
 * Sidebar opened/closed
 * Accordion first clicked (item ID)
 * Accordion viewed entirely
 * Accordion items opened more than one at a time or not
 * Add to bag (success and failure)
 * Mini-Cart editing enabled/disabled
 * Mini-Cart item quantity changed
 * Mini-Cart item removed
 * PLP filters toggled

 Tracking TODO:
 * PLP filter interactions
 * Changing to different products on Multi-PDP
 */
define([
        '$'
    ],
    function($) {
        var $window = $(window);
        var $doc = $(document);

        var Wiretap = {};

        var NON_INTERACTION = {'nonInteraction': 1};

        var _carousels = {};
        var _accordions = {};
        var _swiping = false;

        $.extend($, {
            isString: function(obj) {
                return Object.prototype.toString.call(obj) === '[object String]';
            }
        });

        /**
         * @description Validates whether an object contains all the required properties
         * @param name - a name for what the object represents
         * @param o - the object to test the properties of
         * @param expectedProperties - an Array containing a list of strings of the properties to check
         * @private - exposed on Wiretap for unit testing
         */
        Wiretap.__validateObjectSchema = function(name, o, expectedProperties) {
            for (var i = 0, l = expectedProperties.length; i < l; i++) {
                var expectedProperty = expectedProperties[i];

                if (!o.hasOwnProperty(expectedProperty)) {
                    throw 'The ' + name + ' object doesn\'t contain the ' + expectedProperty + ' property, which is required';
                }

                if (!o[expectedProperty]) {
                    throw 'The ' + name + ' object contains the ' + expectedProperty + ' property, but it\'s value is falsy';
                }
            }
        };

        /**
         * @description Converts the value of each property in the object into a string. Used when
         * sending ecommerce:addTransaction and ecommerce:addItem calls.
         * @param o
         * @returns {*}
         * @private - exposed on Wiretap for unit testing
         */
        Wiretap.__stringifyPropertyValues = function(o) {
            for (var prop in o) {
                if (o.hasOwnProperty(prop)) {
                    o[prop] = String(o[prop]);
                }
            }

            return o;
        };

        // Initializes Wiretap and sets up implicitly tracked events: Wiretap.orientationChange, Wiretap.scrollToBottom.
        Wiretap.init = function() {
            // Bind events
            $window
                .on('touchmove', function() {
                    _swiping = true;
                })
                .on('touchend', function() {
                    window.setTimeout(function() {
                        _swiping = false;
                    }, 50);
                })
                .on('orientationchange', Wiretap.orientationChange);

            $window.on('load', function() {
                var windowHeight = $window.height();

                $window
                    .on('scroll', function() {
                        if ($window.scrollTop() + windowHeight === $doc.height()) {
                            Wiretap.scrollToBottom();
                        }
                    });
            });

            (function patchAlerts() {
                var _alert = window.alert;

                window.alert = function(message) {
                    Wiretap.error('Alert', message);

                    _alert(message);
                };
            })();
        };

        Wiretap.send = function() {
            var args = Array.prototype.slice.call(arguments);

            args.unshift('mobifyTracker.send', 'event');

            Mobify.analytics.ua.apply(null, args);
        };

        // Proxies the classic Google Analytics call so that we capture events fired by desktop
        // We then send them through Mobify's analytics call
        // Example: _gaq.push(["_trackEvent", "product selection", "select a size", a(this.options[this.selectedIndex]).text().trim()])
        Wiretap.proxyClassicAnalytics = function() {
            if (!window._gaq) {
                return;
            }

            var originalPush = window._gaq.push;

            window._gaq.push = function(data) {
                Wiretap.send('Desktop Event: ' + data[1], data[2], data[3], NON_INTERACTION);

                return originalPush(data);
            };
        };

        Wiretap.orientationChange = function() {
            var data = window.innerHeight > window.innerWidth ? 'Landscape to Portrait' : 'Portrait to Landscape';

            Wiretap.send('Orientation Change', data, NON_INTERACTION);
        };

        Wiretap.carousel = {
            // title = Home, PDP, Related Images
            // currentSlide = 1, 2, 3, 4, 5, 6
            // eg. Wiretap.carouselSwipe('PDP', 1);
            swipe: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                if (_swiping) {
                    if (!currentCarousel.swipes.length) {
                        Wiretap.send('Carousel - ' + title, 'first-swipe', 'Slide #' + currentSlide);
                    }

                    Wiretap.send('Carousel - ' + title, 'swipe', 'Slide #' + currentSlide);

                    currentCarousel.swipes.push(currentSlide);
                }
                else {
                    if (!currentCarousel.slides.length) {
                        Wiretap.send('Carousel - ' + title, 'first-slide', 'Slide #' + currentSlide);
                    }

                    Wiretap.send('Carousel - ' + title, 'slide', 'Slide #' + currentSlide);

                    currentCarousel.slides.push(currentSlide);
                }

                currentCarousel.viewed.push(currentSlide);

                // If the user has swiped as much as there swipes, maybe they've been to every slide?
                if (!currentCarousel.fullViewFired && currentCarousel.viewed.length >= currentCarousel.totalSlides) {
                    currentCarousel.fullView = true;

                    // Iterate the amount of slides,
                    // By default lets say they have seen all slides
                    // But if we find a slide we haven't visited, we bail
                    // Rather than firing the event
                    for (var i = 1, l = currentCarousel.totalSlides; i <= l; ++i) {
                        if (currentCarousel.viewed.indexOf(i) === -1) {
                            currentCarousel.fullView = false;
                            break;
                        }
                    }

                    if (currentCarousel.fullView) {
                        Wiretap.send('Carousel - ' + title, 'complete-view', 'Slide #' + currentSlide);

                        currentCarousel.fullViewFired = true;
                    }
                }
            },

            load: function(title, totalSlides) {
                // If the carousel hasn't been initialized, set it up
                if (!_carousels.hasOwnProperty(title)) {
                    _carousels[title] = {
                        fullView: false,
                        fullViewFired: false,
                        totalSlides: totalSlides,
                        slides: [],
                        swipes: [],
                        zooms: [],
                        icons: [],
                        viewed: [],
                        clicks: []
                    };
                }

                // Initially populate the carousel with the first slide
                _carousels[title].viewed.push(1);

                Wiretap.send('Carousel - ' + title, 'load', totalSlides + '', NON_INTERACTION);
            },

            zoom: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                if (!currentCarousel.zooms.length) {
                    Wiretap.send('Carousel - ' + title, 'first-zoom', 'Slide #' + currentSlide);
                }

                Wiretap.send('Carousel - ' + title, 'zoom', 'Slide #' + currentSlide);

                currentCarousel.zooms.push(currentSlide);
            },

            slideClick: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                if (!currentCarousel.clicks.length) {
                    Wiretap.send('Carousel - ' + title, 'first-click', 'Slide #' + currentSlide);
                }

                Wiretap.send('Carousel - ' + title, 'click', 'Slide #' + currentSlide);

                currentCarousel.clicks.push(currentSlide);
            },

            arrowClick: function(title, currentSlide, direction) {
                var currentCarousel = _carousels[title];

                if (!currentCarousel.icons.length) {
                    Wiretap.send('Carousel - ' + title, 'first-icon', 'Slide #' + currentSlide);
                }

                Wiretap.send('Carousel - ' + title, 'icon', currentSlide + '-' + direction);

                currentCarousel.icons.push(currentSlide);
            }
        };

        // eg. Wiretap.navigationClick('Top Nav', 'Pants');
        Wiretap.navigationClick = function(menuTitle, itemTitle) {
            Wiretap.send('Navigation - ' + menuTitle, 'click', itemTitle);
        };

        Wiretap.searchToggle = function() {
            Wiretap.send('Search', 'toggle', 'OK');
        };

        Wiretap.breadcrumbClick = function() {
            Wiretap.send('Breadcrumb', 'interaction', 'OK');
        };

        Wiretap.backToTopClick = function() {
            Wiretap.send('Back To Top', 'click', 'OK');
        };

        Wiretap.newsletterInteraction = function() {
            Wiretap.send('Newsletter', 'interaction', 'OK');
        };

        Wiretap.footerInteraction = function() {
            Wiretap.send('Footer', 'interaction', 'OK');
        };

        Wiretap.paginationInteraction = function() {
            Wiretap.send('Pagination', 'interaction', 'OK');
        };

        Wiretap.filtersToggle = function(title) {
            Wiretap.send('Filters: ' + title, 'toggle', 'OK');
        };

        Wiretap.filtersChange = function(title, type, amount) {
            Wiretap.send('Filters: ' + title, 'Change: ' + type, amount);
        };

        Wiretap.scrollToBottom = function() {
            Wiretap.send('Scroll To Bottom', 'interaction', 'OK');
        };

        Wiretap.sizeGuideOpen = function() {
            Wiretap.send('Size Guide', 'open', 'OK');
        };

        Wiretap.emailFriend = function() {
            Wiretap.send('Email Friend', 'open', 'OK');
        };

        Wiretap.emailMeBack = function() {
            Wiretap.send('Email Me Back', 'open', 'OK');
        };

        Wiretap.adjustColor = function(title) {
            Wiretap.send(title, 'Adjust Color');
        };

        Wiretap.adjustQuantity = function(title, amount) {
            Wiretap.send(title, 'Adjust Quantity', amount + '');
        };

        Wiretap.adjustSize = function(title, amount) {
            Wiretap.send(title, 'Adjust Size', amount + '');
        };

        Wiretap.error = function(title, comment) {
            Wiretap.send('Error', title, comment);
        };

        Wiretap.checkReviews = function(title) {
            Wiretap.send(title, 'Check Reviews');
        };

        Wiretap.sidebar = {
            opened: function(title) {
                Wiretap.send(title, 'Sidebar Opened');
            },
            closed: function(title) {
                Wiretap.send(title, 'Sidebar Closed');
            }
        };

        Wiretap.cart = {
            itemAdded: function() {
                var fullCarouselView = false;

                for (var title in _carousels) {
                    if (_carousels.hasOwnProperty(title)) {
                        var carousel = _carousels[title];

                        if (carousel.fullViewFired) {
                            fullCarouselView = true;
                        }
                    }
                }

                if (fullCarouselView) {
                    Wiretap.send('Cart', 'item-added-after-full-carousel-view', 'OK');
                }
                else {
                    Wiretap.send('Cart', 'item-added', 'OK');
                }
            }
        };

        Wiretap.minicart = {
            toggle: function() {
                Wiretap.send('Mini-Cart', 'toggle', 'OK');
            },
            itemRemoved: function() {
                Wiretap.send('Mini-Cart', 'item-removed', 'OK');
            },

            editEnabled: function() {
                Wiretap.send('Mini-Cart', 'edit-enabled', 'OK');
            },

            editDisabled: function() {
                Wiretap.send('Mini-Cart', 'edit-disabled', 'OK');
            },

            quantityChanged: function() {
                Wiretap.send('Mini-Cart', 'quantity-changed', 'OK');
            }
        };

        Wiretap.accordion = {
            open: function(title, currentItem) {
                var currentAccordion = _accordions[title];

                if (!currentAccordion.opens.length) {
                    Wiretap.send('Accordion - ' + title, 'first-open', 'Item #' + currentItem);
                }

                currentAccordion.opens.push(currentItem);

                // If there's more than one accordion item opened, and we've opened more than we've closed
                // Then this user doesn't mind having multiple opened
                // Send how many are currently opened and haven't been closed
                if (currentAccordion.opens.length > 1 && currentAccordion.opens.length > currentAccordion.closes.length) {
                    Wiretap.send('Accordion - ' + title, 'multiple-opened', currentAccordion.opens.length - currentAccordion.closes.length);
                }

                // If the user has swiped as much as there swipes, maybe they've been to every slide?
                if (!currentAccordion.fullViewFired && currentAccordion.opens.length >= currentAccordion.totalItems) {
                    currentAccordion.fullView = true;

                    // Iterate the amount of slides,
                    // By default lets say they have seen all slides
                    // But if we find a slide we haven't visited, we bail
                    // Rather than firing the event
                    for (var i = 1, l = currentAccordion.totalItems; i <= l; ++i) {
                        if (currentAccordion.opens.indexOf(i) === -1) {
                            currentAccordion.fullView = false;
                            break;
                        }
                    }

                    if (currentAccordion.fullView) {
                        Wiretap.send('Accordion - ' + title, 'complete-view', 'Item #' + currentItem);

                        currentAccordion.fullViewFired = true;
                    }
                }
            },

            close: function(title, currentItem) {
                var currentAccordion = _accordions[title];

                currentAccordion.closes.push(currentItem);
            },

            load: function(title, totalItems) {
                // If the accordion hasn't been initialized, set it up
                if (!_accordions.hasOwnProperty(title)) {
                    _accordions[title] = {
                        fullView: false,
                        fullViewFired: false,
                        totalItems: totalItems,
                        opens: [],
                        closes: []
                    };
                }

                Wiretap.send('Accordion - ' + title, 'load', totalItems + '', NON_INTERACTION);
            }
        };

        /**
         * @description Provides a consistent way to fire transaction tracking in universal analytics
         * via the ecommerce plugin
         *
         * @param {string} transactionId
         * @param {string} affiliation
         * @param {object} transaction
         * @param {array} transactionItems
         *
         * @example
         *
         * Wiretap.sendTransaction('1234', 'Acme Clothing'
         * {
         *    'revenue': '11.99',               // Grand Total.
         *    'shipping': '5',                  // Shipping.
         *    'tax': '1.29'                     // Tax.
         * },
         * [
         *   {
         *      'name': 'Fluffy Pink Bunnies',    // Product name. Required.
         *      'sku': 'DD23444',                 // SKU/code.
         *      'category': 'Party Toys',         // Category or variation.
         *      'price': '11.99',                 // Unit price.
         *      'quantity': '1'                   // Quantity.
         *     }
         * ]);
         */
        Wiretap.sendTransaction = function(transactionId, affiliation, transaction, transactionItems) {
            var ECOMMERCE_PLUGIN = 'mobifyTracker.ecommerce';

            if (!transactionId || !$.isString(transactionId)) {
                throw 'Wiretap.sendTransaction requires a string containing the transaction ID, i.e. "1234"';
            }

            if (!affiliation || !$.isString(affiliation)) {
                throw 'Wiretap.sendTransaction requires a string containing the affiliation, usually the project name, i.e. "Acme Clothing"';
            }

            if (!transaction || !$.isPlainObject(transaction)) {
                throw 'Wiretap.sendTransaction requires an object literal containing the transaction details, i.e. {"revenue": "11.99","shipping": "5","tax": "1.29"}';
            }

            if (!transactionItems || !$.isArray(transactionItems)) {
                throw 'Wiretap.sendTransaction requires an Array containing the transaction item details';
            }

            transaction.id = transactionId;
            transaction.affiliation = affiliation;

            Wiretap.__stringifyPropertyValues(transaction);

            Mobify.analytics.ua(ECOMMERCE_PLUGIN + ':addTransaction', transaction);

            for (var i = 0, l = transactionItems.length; i < l; i++) {
                var transactionItem = transactionItems[i];

                // Universal Analytics requires that the transaction ID is sent for each item added.
                // This should match the parent transaction ID submitted in the transaction parameter.
                transactionItem.id = transactionId;

                Wiretap.__validateObjectSchema('item', transactionItem, ['id', 'name', 'sku']);
                Wiretap.__stringifyPropertyValues(transactionItem);

                Mobify.analytics.ua(ECOMMERCE_PLUGIN + ':addItem', transactionItem);
            }

            Mobify.analytics.ua(ECOMMERCE_PLUGIN + ':send');
        };

        return Wiretap;
    });
