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

    Tracking TODO:
    * Add to bag (success and failure)
    * PLP filter interactions
    * Minicart quantity change
    * Whether bellows is being opened one at a time or multiple without closing previous
*/
define([
    '$'
],
    function($) {
        var Wiretap = {};

        var carousels = {};
        var swiping = false;

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

        var fullCarouselViewEventFired = false;

        // Wiretap.carouselSwipe
        // title = Home, PDP, Related Images
        // slide = 1, 2, 3, 4, 5, 6
        // eg. Wiretap.carouselSwipe('PDP', 1);
        Wiretap.carouselSwipe = function(title, currentSlide) {
            var currentCarousel = carousels[title];

            if (swiping && !currentCarousel.swipes.length) {
                Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'first-swipe', currentSlide + '');
            }

            currentCarousel.swipes.push(currentSlide);

            // If the user has swiped as much as there swipes, maybe they've been to every slide?
            if (!fullCarouselViewEventFired && currentCarousel.swipes.length >= currentCarousel.totalSlides) {
                var fullCarouselView = true;

                // Iterate the amount of slides,
                // By default lets say they have seen all slides
                // But if we find a slide we haven't visited, we bail
                // Rather than firing the event
                for (var i = 0, l = currentCarousel.totalSlides; i <= l; ++i) {
                    if (!currentCarousel.swipes.indexOf(i + 1)) {
                        fullCarouselView = false;
                        break;
                    }
                }

                if (fullCarouselView) {
                    Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'completeView', currentSlide + '');

                    fullCarouselViewEventFired = true;
                }
            }
        };

        // Wiretap.carouselInteraction
        Wiretap.carouselInteraction = function(title, currentSlide) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'interaction', currentSlide + '');
        };

        // Wiretap.carouselLoad
        Wiretap.carouselLoad = function(title, totalSlides) {
            // If the carousel hasn't been initialized, set it up
            if (!carousels.hasOwnProperty(title)) {
                carousels[title] = {
                    totalSlides: totalSlides,
                    swipes: []
                };
            }

            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'load', totalSlides + '', {'nonInteraction': 1});
        };

        // Wiretap.carouselZoom
        Wiretap.carouselZoom = function(title, currentSlide) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'zoom', currentSlide + '');
        };

        // Wiretap.carouselSlideClick
        Wiretap.carouselSlideClick = function(title, currentSlide) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'click', currentSlide + '');
        };

        // Wiretap.carouselArrowClick
        Wiretap.carouselArrowClick = function(title, currentSlide, direction) {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Carousel - ' + title, 'arrowClick', currentSlide + '-' + direction);
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

        Wiretap.filtersToggle = function() {
            Mobify.analytics.ua('mobifyTracker.send', 'event', 'Filters', 'toggle', 'OK');
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

        return Wiretap;
    });
