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
        var Wiretap = {};
        var carousels = {};
        var accordions = {};
        var swiping = false;

        // Wiretap.setup
        // Initializes Wiretap and sets up implicitly tracked events: Wiretap.orientationChange, Wiretap.scrollToBottom.
        Wiretap.setup = function() {
            // Bind events
            $(window).on('touchmove', function() {
                swiping = true;
            });

            $(window).on('touchend', function() {
                window.setTimeout(function() {
                    swiping = false;
                }, 50);
            });

            $(window).on('orientationchange', function() {
                Wiretap.orientationChange();
            });

            $(window).scroll(function() {
                if ($(window).scrollTop() + $(window).height() === $(document).height()) {
                    Wiretap.scrollToBottom();
                }
            });

            (function patchAlerts() {
                var _alert = window.alert;

                window.alert = function(message) {
                    Wiretap.error('Alert', message);

                    _alert(message);
                };
            })();
        };

        // Wiretap.proxyClassicAnalytics
        // Proxies the classic Google Analytics call so that we capture events fired by desktop
        // We then send them through Mobify's analytics call
        // Example: _gaq.push(["_trackEvent", "product selection", "select a size", a(this.options[this.selectedIndex]).text().trim()])
        Wiretap.proxyClassicAnalytics = function() {
            if (!window._gaq) {
                return;
            }

            var originalPush = window._gaq.push;

            window._gaq.push = function(data) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Desktop Event: ' + data[1], data[2], data[3], {'nonInteraction': 1});

                return originalPush(data);
            };
        };

        // Wiretap.orientationChange
        // eg. Wiretap.orientationChange();
        Wiretap.orientationChange = function() {
            if (window.innerHeight > window.innerWidth) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Orientation Change', 'Landscape to Portrait', {'nonInteraction': 1});
            }
            else {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Orientation Change', 'Portrait to Landscape', {'nonInteraction': 1});
            }
        };

        // Wiretap.carouselSwipe
        // title = Home, PDP, Related Images
        // currentSlide = 1, 2, 3, 4, 5, 6
        // eg. Wiretap.carouselSwipe('PDP', 1);
        Wiretap.carouselSwipe = function(title, currentSlide) {
            var currentCarousel = carousels[title];

            if (swiping) {
                if (!currentCarousel.swipes.length) {
                    Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'first-swipe', currentSlide + '');
                }
                else {
                    Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'swipe', currentSlide + '');
                }

                currentCarousel.swipes.push(currentSlide);
            }
            else {
                if (!currentCarousel.slides.length) {
                    Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'first-slide', currentSlide + '');
                }
                else {
                    Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'slide', currentSlide + '');
                }

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
                for (var i = 0, l = currentCarousel.totalSlides; i <= l; ++i) {
                    if (!currentCarousel.viewed.indexOf(i + 1)) {
                        currentCarousel.fullView = false;
                        break;
                    }
                }

                if (currentCarousel.fullView) {
                    Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'completeView', currentSlide + '');

                    currentCarousel.fullViewFired = true;
                }
            }
        };

        // Wiretap.carouselLoad
        Wiretap.carouselLoad = function(title, totalSlides) {
            // If the carousel hasn't been initialized, set it up
            if (!carousels.hasOwnProperty(title)) {
                carousels[title] = {
                    fullView: false,
                    fullViewFired: false,
                    totalSlides: totalSlides,
                    slides: [],
                    swipes: [],
                    zooms: [],
                    icons: [],
                    viewed: []
                };
            }

            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'load', totalSlides + '', {'nonInteraction': 1});
        };

        // Wiretap.carouselZoom
        Wiretap.carouselZoom = function(title, currentSlide) {
            var currentCarousel = carousels[title];

            if (!currentCarousel.zooms.length) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'first-zoom', currentSlide + '');
            }
            
            currentCarousel.zooms.push(currentSlide);

            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'zoom', currentSlide + '');
        };

        // Wiretap.carouselSlideClick
        Wiretap.carouselSlideClick = function(title, currentSlide) {
            var currentCarousel = carousels[title];

            if (!currentCarousel.clicks.length) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'first-click', currentSlide + '');
            }
            
            currentCarousel.clicks.push(currentSlide);

            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'click', currentSlide + '');
        };

        // Wiretap.carouselArrowClick
        Wiretap.carouselArrowClick = function(title, currentSlide, direction) {
            var currentCarousel = carousels[title];

            if (!currentCarousel.icons.length) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'first-icon', currentSlide + '');
            }

            currentCarousel.icons.push(currentSlide);

            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'icon', currentSlide + '-' + direction);
        };

        // Wiretap.navigationClick
        // menuTitle = Top Nav, Flyout
        // itemTitle = Pants, Shoes
        // eg. Wiretap.navigationClick('Top Nav', 'Pants');
        Wiretap.navigationClick = function(menuTitle, itemTitle) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Navigation - ' + menuTitle, 'click', itemTitle);
        };

        Wiretap.searchToggle = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Search', 'toggle', 'OK');
        };

        Wiretap.minicartToggle = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Minicart', 'toggle', 'OK');
        };

        Wiretap.breadcrumbClick = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Breadcrumb', 'interaction', 'OK');
        };

        Wiretap.backToTopClick = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Back To Top', 'click', 'OK');
        };

        Wiretap.newsletterInteraction = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Newsletter', 'interaction', 'OK');
        };

        Wiretap.footerInteraction = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Footer', 'interaction', 'OK');
        };

        Wiretap.paginationInteraction = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Pagination', 'interaction', 'OK');
        };

        Wiretap.filtersToggle = function(title) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Filters: ' + title, 'toggle', 'OK');
        };

        Wiretap.filtersChange = function(title, type, amount) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Filters: ' + title, 'Change: ' + type, amount);
        };

        Wiretap.scrollToBottom = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Scroll To Bottom', 'interaction', 'OK');
        };

        Wiretap.sizeGuideOpen = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Size Guide', 'open', 'OK');
        };

        Wiretap.emailFriend = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Email Friend', 'open', 'OK');
        };

        Wiretap.emailMeBack = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Email Me Back', 'open', 'OK');
        };

        Wiretap.adjustColor = function(title) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', title, 'Adjust Color');
        };

        Wiretap.adjustQuantity = function(title, amount) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', title, 'Adjust Quantity', amount + '');
        };

        Wiretap.adjustSize = function(title, amount) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', title, 'Adjust Size', amount + '');
        };

        Wiretap.error = function(title, comment) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Error', title, comment);
        };

        Wiretap.checkReviews = function(title) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', title, 'Check Reviews');
        };

        Wiretap.sidebarOpened = function(title) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', title, 'Sidebar Opened');
        };

        Wiretap.sidebarClosed = function(title) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', title, 'Sidebar Closed');
        };

        Wiretap.cartItemAdded = function() {
            var fullCarouselView = false;

            for (var title in carousels) {
                if (carousels.hasOwnProperty(title)) {
                    var carousel = carousels[title];

                    if (carousel.fullViewFired) {
                        fullCarouselView = true;
                    }
                }
            }

            if (fullCarouselView) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Cart', 'item-added-after-full-carousel-view', 'OK');
            }
            else {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Cart', 'item-added', 'OK');
            }
        };

        Wiretap.minicartRemoveItem = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Mini-Cart', 'item-removed', 'OK');
        };

        Wiretap.minicartEditEnable = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Mini-Cart', 'edit-enabled', 'OK');
        };

        Wiretap.minicartEditDisable = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Mini-Cart', 'edit-disabled', 'OK');
        };

        Wiretap.minicartChangeQuantity = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Mini-Cart', 'quantity-changed', 'OK');
        };

        Wiretap.accordionOpen = function(title, currentItem) {
            var currentAccordion = accordions[title];

            if (!currentAccordion.opens.length) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Accordion - ' + title, 'first-open', currentItem + '');
            }

            currentAccordion.opens.push(currentItem);

            // If there's more than one accordion item opened, and we've opened more than we've closed
            // Then this user doesn't mind having multiple opened
            // Send how many are currently opened and haven't been closed
            if (currentAccordion.opens.length > 1 && currentAccordion.opens.length > currentAccordion.closes.length) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Accordion - ' + title, 'multipleOpened', currentAccordion.opens.length - currentAccordion.closes.length);
            }

            // If the user has swiped as much as there swipes, maybe they've been to every slide?
            if (!currentAccordion.fullViewFired && currentAccordion.opens.length >= currentAccordion.totalItems) {
                currentAccordion.fullView = true;

                // Iterate the amount of slides,
                // By default lets say they have seen all slides
                // But if we find a slide we haven't visited, we bail
                // Rather than firing the event
                for (var i = 0, l = currentAccordion.totalItems; i <= l; ++i) {
                    if (!currentAccordion.opens.indexOf(i + 1)) {
                        currentAccordion.fullView = false;
                        break;
                    }
                }

                if (currentAccordion.fullView) {
                    Mobify.analytics.ua('mobifyTracker.send', 'event', 'Accordion - ' + title, 'completeView', currentItem + '');

                    currentAccordion.fullViewFired = true;
                }
            }
        };

        Wiretap.accordionClose = function(title, currentItem) {
            var currentAccordion = accordions[title];

            currentAccordion.closes.push(currentItem);
        };

        // Wiretap.accordionLoad
        Wiretap.accordionLoad = function(title, totalItems) {
            // If the accordion hasn't been initialized, set it up
            if (!accordions.hasOwnProperty(title)) {
                accordions[title] = {
                    fullView: false,
                    fullViewFired: false,
                    totalItems: totalItems,
                    opens: [],
                    closes: []
                };
            }

            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Accordion - ' + title, 'load', totalItems + '', {'nonInteraction': 1});
        };

        return Wiretap;
    });
