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

        var EVENT_TITLES = {
            accordion: 'Accordion - ',
            carousel: 'Carousel - ',
            error: 'Error',
            scroll: 'Scroll - '
        };

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
                console.log('Parameters: %O', args);
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
                .on('orientationchange', Hora.orientation.change)
                .on('load', function() {
                    var windowHeight = $window.height();

                    $window
                        .on('scroll', function() {
                            if ($window.scrollTop() + windowHeight === $doc.height()) {
                                Hora.scroll.bottom('Page');
                            }
                        });
                });

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

        Hora.scroll = {
            up: function(title) {
                Hora.send(EVENT_TITLES.scroll + title, 'Up');
            },
            down: function(title) {
                Hora.send(EVENT_TITLES.scroll + title, 'Down');
            },
            top: function(title) {
                Hora.send(EVENT_TITLES.scroll + title, 'Top');
            },
            bottom: function(title) {
                Hora.send(EVENT_TITLES.scroll + title, 'Bottom');
            }
        };

        Hora.error = {
            generic: function(title, comment) {
                Hora.send(EVENT_TITLES.error, title, comment);
            },
            alert: function(comment) {
                Hora.send(EVENT_TITLES.error, 'Alert', comment);
            }
        };

        Hora.action = {
            click: function(title) {
                Hora.send(title, 'Click');
            },
            toggle: function(title) {
                Hora.send(title, 'Toggle');
            },
            change: function(title) {
                Hora.send(title, 'Change');
            },
            open: function(title) {
                Hora.send(title, 'Open');
            },
            close: function(title) {
                Hora.send(title, 'Close');
            }
        };

        Hora.carousel = {
            // title = Home, PDP, Related Images
            // currentSlide = 1, 2, 3, 4, 5, 6
            // eg. Hora.carousel.slide('PDP', 1);
            slide: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = EVENT_TITLES.carousel + title;

                if (_swiping) {
                    // metric15 - First Item
                    //  1 - was the first item swiped
                    //  0 - was not the first item swiped
                    Hora.send(title, 'Swipe', 'Slide #' + currentSlide, currentSlide, {
                        'metric15': currentCarousel.swipes.length === 0 ? 1 : 0
                    });

                    currentCarousel.swipes.push(currentSlide);
                }
                else {
                    // metric15 - First Item
                    //  1 - was the first item moved
                    //  0 - was not the first item moved
                    Hora.send(title, 'Move', 'Slide #' + currentSlide, currentSlide, {
                        'metric15': currentCarousel.slides.length === 0 ? 1 : 0
                    });

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
                        Hora.send(title, 'View All Slides', 'Total ' + currentCarousel.totalSlides, currentCarousel.totalSlides);

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

                Hora.send(EVENT_TITLES.carousel + title, 'Load', 'Total ' + totalSlides, totalSlides, NON_INTERACTION);
            },

            zoom: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = EVENT_TITLES.carousel + title;

                // metric15 - First Item
                //  1 - was the first item zoomed
                //  0 - was not the first item zoomed
                Hora.send(title, 'Zoom', 'Slide #' + currentSlide, currentSlide, {
                    'metric15': currentCarousel.zooms.length === 0 ? 1 : 0
                });

                currentCarousel.zooms.push(currentSlide);
            },

            slideClick: function(title, currentSlide) {
                var currentCarousel = _carousels[title];

                title = EVENT_TITLES.carousel + title;

                // metric15 - First Item
                //  1 - was the first item clicked
                //  0 - was not the first item clicked
                Hora.send(title, 'Click',  'Slide #' + currentSlide, currentSlide, {
                    'metric15': currentCarousel.clicks.length === 0 ? 1 : 0
                });

                currentCarousel.clicks.push(currentSlide);
            },

            iconClick: function(title, currentSlide, direction) {
                var currentCarousel = _carousels[title];
                var directionTitle = (direction === -1) ? 'Previous' : 'Next';

                title = EVENT_TITLES.carousel + title;

                // metric15 - First Item
                //  1 - was the first item icon clicked
                //  0 - was not the first item icon clicked
                Hora.send(title, directionTitle + ' Icon', 'Slide #' + currentSlide, currentSlide, {
                    'metric15': currentCarousel.icons.length === 0 ? 1 : 0
                });

                currentCarousel.icons.push(currentSlide);
            }
        };

        Hora.accordion = {
            open: function(title, currentItem) {
                var currentAccordion = _accordions[title];

                title = EVENT_TITLES.accordion + title;

                // metric15 - First Item
                //  1 - was the first item opened
                //  0 - was not the first item opened
                Hora.send(title, 'Open', 'Item #' + currentItem, currentItem, {
                    'metric15': currentAccordion.opens.length === 0 ? 1 : 0
                });

                currentAccordion.opens.push(currentItem);

                // If there's more than one accordion item opened, and we've opened more than we've closed
                // Then this user doesn't mind having multiple opened
                // Send how many are currently opened and haven't been closed
                if (currentAccordion.opens.length > 1 && currentAccordion.opens.length > currentAccordion.closes.length) {
                    var total = currentAccordion.opens.length - currentAccordion.closes.length;

                    Hora.send(title, 'Open Multiple Items', 'Total ' + total, total);
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
                        Hora.send(title, 'View All Items', 'Total ' + currentAccordion.totalItems, currentAccordion.totalItems);

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

                Hora.send(EVENT_TITLES.accordion + title, 'Load', 'Total ' + totalItems, totalItems, NON_INTERACTION);
            }
        };

        return Hora;
    });
