/* global Mobify */
/* jslint maxstatements: false */
/*
 Hora.js
 -------
 Assists with tracking user-behavior with custom Google Analytics events

 */
define([
        '$'
    ],
    function($) {
        var $window = $(window);
        var $doc = $(document);

        var Hora = {
            isDebug: false
        };

        var NON_INTERACTION = {'nonInteraction': 1};

        var _carousels = {};
        var _accordions = {};
        var _swiping = false;

        $.extend($, {
            isString: function(obj) {
                return Object.prototype.toString.call(obj) === '[object String]';
            }
        });

        Hora.__carousels = {
            clear: function() {
                _carousels = [];
            }
        };

        Hora.__accordions = {
            clear: function() {
                _accordions = [];
            }
        };

        /**
         * @description Validates whether an object contains all the required properties
         * @param name - a name for what the object represents
         * @param o - the object to test the properties of
         * @param expectedProperties - an Array containing a list of strings of the properties to check
         * @private - exposed on Hora for unit testing
         */
        Hora.__validateObjectSchema = function(name, o, expectedProperties) {
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
         * @private - exposed on Hora for unit testing
         */
        Hora.__stringifyPropertyValues = function(o) {
            for (var prop in o) {
                if (o.hasOwnProperty(prop)) {
                    o[prop] = String(o[prop]);
                }
            }

            return o;
        };

        Hora.send = function() {
            var args = Array.prototype.slice.call(arguments);

            args.unshift('mobifyTracker.send', 'event');

            if (Hora.isDebug) {
                console.log('%cHora Parameters: %O', 'background: #222; color: #bada55', args);
            } else {
                Mobify.analytics.ua.apply(null, args);
            }
        };

        // Initializes Hora and sets up implicitly tracked events: Hora.orientationChange, Hora.scrollToBottom.
        Hora.init = function(isDebug) {
            Hora.isDebug = isDebug;

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
                .on('orientationchange', Hora.orientation.change);

            (function patchAlerts() {
                var _alert = window.alert;

                window.alert = function(message) {
                    Hora.error.alert(message);

                    _alert(message);
                };
            })();
        };

        /**
         * Proxies the classic Google Analytics call so that we capture events fired by desktop
         * We then send them through Mobify's analytics call
         * Example: _gaq.push(["_trackEvent", "product selection", "select a size", a(this.options[this.selectedIndex]).text().trim()])
         */
        Hora.proxyClassicAnalytics = function() {
            if (!window._gaq || Hora.isDebug) {
                return;
            }

            var originalPush = window._gaq.push;

            window._gaq.push = function(data) {
                Hora.send('Desktop Event: ' + data[1], data[2], data[3], NON_INTERACTION);

                return originalPush(data);
            };
        };

        /**
         * Proxies the Universal Google Analytics call so that we capture events fired by desktop
         * We only allow the following events: require, provide, send, ec:setAction, ec:addProduct
         * Example: ga('ec:setAction','checkout', {'step': 3, 'option': 'visa credit' });
         */
        Hora.proxyUniversalAnalytics = function(action, hitType, eventCategory, eventAction, eventLabel, eventValue) {
            if (Hora.isDebug) {
                return;
            }

            var _theirGA;

            var _ourGA = function() {
                // If their analytics.js has loaded, we have _theirGA and should pass through events
                // Then after
                if (_theirGA) {
                    _theirGA.apply(null, arguments);
                } else {
                    (window.ga.q = window.ga.q || []).push(arguments);
                }

                // Check if the first argument is an allowed command
                if (!/^(require|provide|send|ec:setAction|ec:addProduct)$/mi.exec(action)) {
                    return;
                }

                // Don't send double events
                if (action === 'send' &&
                   (hitType === 'pageview' || hitType === 'event' && eventCategory === 'mobify')) {
                    return;
                }

                // Clone the array so that we don't modify the original arguments that are passed through to the desktop window.ga
                var args = Array.prototype.slice.call(arguments, 0);

                // Add our namespace and send the event back to a.js (which should make it back to this function and return above)
                args[0] = 'mobifyTracker.' + args[0];

                Mobify.analytics.ua.apply(null, args);
            };

            // Define ga() so that any calls to ga() proxy through our function
            window.ga = _ourGA;

            // Once their analytics.js has loaded, replace their ga() with ours
            // Passing a callback to `ga` will execute after analytics.js has loaded
            // See "Pushing Functions" here: https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
            window.ga(function() {
                _theirGA = window.ga;

                window.ga = _ourGA;
            });
        };

        // Hora.orientationChange
        // eg. Hora.orientationChange();
        Hora.orientation = {
            change: function() {
                var position = (window.innerHeight > window.innerWidth) ? 'Landscape to Portrait' : 'Portrait to Landscape';

                Hora.send('Orientation', 'Change', position, NON_INTERACTION);
            }
        };

        Hora.carousel = {
            // title = Home, PDP, Related Images
            // currentSlide = 1, 2, 3, 4, 5, 6
            // eg. Hora.carousel.slide('PDP', 1);
            slide: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = 'Carousel - ' + title;

                if (_swiping) {
                    Hora.send(title, 'Swipe', 'Slide #' + currentSlide);
                }
                else {
                    Hora.send(title, 'Move', 'Slide #' + currentSlide);
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

                Hora.send('Carousel - ' + title, 'Load', 'Total ' + totalSlides, totalSlides, NON_INTERACTION);
            },

            zoom: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = 'Carousel - ' + title;

                Hora.send(title, 'Zoom', 'Slide #' + currentSlide);
            }
        };

        Hora.error = {
            generic: function(title, comment) {
                Hora.send('Error', title, comment);
            },
            alert: function(comment) {
                Hora.send('Error', 'Alert', comment);
            },
            unsuccessfulSubmission: function(comment) {
                Hora.send('Error', 'Unsuccessful Submission', comment);
            },
            unsuccessfulAddToCart: function(comment) {
                Hora.send('Error', 'Unsuccessful Add To Cart', comment);
            },
            unsuccessfulPlaceOrder: function(comment) {
                Hora.send('Error', 'Unsuccessful Place Order', comment);
            }
        };

        Hora.accordion = {
            open: function(title, currentItem) {
                Hora.send('Accordion - ' + title, 'Open', currentItem);
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

                Hora.send('Accordion - ' + title, 'Load', 'Total ' + totalItems, totalItems, NON_INTERACTION);
            }
        };

        Hora.pinny = {
            open: function (title) {
                Hora.send('Pinny', 'Open', title);
            },

            close: function (title) {
                Hora.send('Pinny', 'Close', title);
            },
            trigger: function (category, label) {
                Hora.send(category + ' Pinny', 'Trigger By', label);
            }
        };

        Hora.button = {
            click: function (title) {
                Hora.send('Button', 'Click', title);
            }
        };

        return Hora;
    });
