Hora.js
=====

[![Bower version](https://badge.fury.io/bo/hora.js.svg)](http://badge.fury.io/bo/hora.js)
[![Circle CI](https://circleci.com/gh/mobify/hora.js.svg?style=svg)](https://circleci.com/gh/mobify/hora.js)

Hora.js is a convenient and simple wrapper for sending Mobify Analytics events (which are custom Google Analytics events). Everything you need to get started and figure out Hora is here. Because creepers gonna creep. Prepare yourself.

| ![Creeper](https://s3.amazonaws.com/uploads.hipchat.com/15359/425065/PbAANygwM20lNpS/hora.png) |
|-----|

## Table of Contents
**1. [Getting Started]]**

* 1.1. [Installation](https://github.com/mobify/hora.js/wiki/Getting-Started#11-installation)
* 1.2. [Adding to Project](https://github.com/mobify/hora.js/wiki/Getting-Started#12-adding-to-project)
* 1.3. [Supported Features](https://github.com/mobify/hora.js/wiki/Getting-Started#13-supported-features)

**2. [Interactions](https://github.com/mobify/hora.js/wiki/Interactions)**

* 2.1. [Basic Interactions](https://github.com/mobify/hora.js/wiki/Interactions#21-basic-interactions)
* 2.2. [Tracking Sidebar Open/Close](https://github.com/mobify/hora.js/wiki/Interactions#22-tracking-sidebar-openclose)
* 2.3. [Tracking Carousel Interactions](https://github.com/mobify/hora.js/wiki/Interactions#23-tracking-carousel-interactions)
* 2.4. [Tracking Accordion Interactions](https://github.com/mobify/hora.js/wiki/Interactions#24-tracking-accordion-interactions)

**3. [Transactions](https://github.com/mobify/hora.js/wiki/Transactions)**

* 3.1. [Sending Transactions](https://github.com/mobify/hora.js/wiki/Transactions#sending-transactions)
* 3.2. [Verifying Transaction Requests (using DevTools)](https://github.com/mobify/hora.js/wiki/Transactions#32-verifying-transaction-requests-using-devtools)

**4. [Analytics](https://github.com/mobify/hora.js/wiki/Analytics)**

* 4.1. [Getting Started](https://github.com/mobify/hora.js/wiki/Analytics#current-events)
* 4.2. [Download Package](https://github.com/mobify/hora.js/wiki/Analytics#download)
* 4.3. [Dashboard](https://github.com/mobify/hora.js/wiki/Analytics#dashboard)
* 4.4. [Current Events](https://github.com/mobify/hora.js/wiki/Analytics#current-events)
* 4.5. [Current Segments](https://github.com/mobify/hora.js/wiki/Analytics#current-segments)

**5. [Insights](https://github.com/mobify/hora.js/wiki/Insights)**

* 5.1. [Questions](https://github.com/mobify/hora.js/wiki/Insights#questions)

| Have a UX question? [Submit it here](https://github.com/mobify/hora.js/wiki/Submit-an-Insight) and we'll give you our insight |
|-----|

**6. [API](https://github.com/mobify/hora.js/wiki/API)**

* 6.1. [init](https://github.com/mobify/hora.js/wiki/API#horainit)
* 6.2. [send](https://github.com/mobify/hora.js/wiki/API#horasend)
* 6.3. [proxyClassicAnalytics](https://github.com/mobify/hora.js/wiki/API#horaproxyclassicanalytics)
* 6.4. [proxyUniversalAnalytics](https://github.com/mobify/hora.js/wiki/API#horaproxyuniversalanalytics)
* 6.5. [orientation](https://github.com/mobify/hora.js/wiki/API#horaorientation)
 * 6.5.1. [change](https://github.com/mobify/hora.js/wiki/API#horaorientationchange)
* 6.6. [carousel](https://github.com/mobify/hora.js/wiki/API#horacarousel)
 * 6.6.1. [load](https://github.com/mobify/hora.js/wiki/API#horacarouselload)
 * 6.6.2. [swipe](https://github.com/mobify/hora.js/wiki/API#horacarouselswipe)
 * 6.6.3. [zoom](https://github.com/mobify/hora.js/wiki/API#horacarouselzoom)
 * 6.6.4. [slideClick](https://github.com/mobify/hora.js/wiki/API#horacarouselslideClick)
 * 6.6.5. [arrowClick](https://github.com/mobify/hora.js/wiki/API#horacarouselarrowClick)
* 6.7. [accordion](https://github.com/mobify/hora.js/wiki/API#horaaccordion)
 * 6.7.1. [load](https://github.com/mobify/hora.js/wiki/API#horaaccordionload)
 * 6.7.2. [open](https://github.com/mobify/hora.js/wiki/API#horaaccordionopen)
 * 6.7.3. [close](https://github.com/mobify/hora.js/wiki/API#horaaccordionclose)
* 6.8. [cart](https://github.com/mobify/hora.js/wiki/API#horacart)
 * 6.8.1. [addItem](https://github.com/mobify/hora.js/wiki/API#horacartadditem)
 * 6.8.2. [removeItem](https://github.com/mobify/hora.js/wiki/API#horacartremoveitem)
* 6.9. [minicart](https://github.com/mobify/hora.js/wiki/API#horaminicart)
 * 6.9.1. [enableEdit](https://github.com/mobify/hora.js/wiki/API#horaminicartenableedit)
 * 6.9.2. [disableEdit](https://github.com/mobify/hora.js/wiki/API#horaminicartdisableedit)
 * 6.9.2. [changeQuantity](https://github.com/mobify/hora.js/wiki/API#horaminicartchangequantity)
* 6.10. [search](https://github.com/mobify/hora.js/wiki/API#horasearch)
 * 6.10.1. [toggle](https://github.com/mobify/hora.js/wiki/API#horasearchtoggle)
* 6.11. [newsletter](https://github.com/mobify/hora.js/wiki/API#horanewsletter)
 * 6.11.1. [interact](https://github.com/mobify/hora.js/wiki/API#horanewsletterinteract)
* 6.12. [pagination](https://github.com/mobify/hora.js/wiki/API#horapagination)
 * 6.12.1. [interact](https://github.com/mobify/hora.js/wiki/API#horapaginationinteract)
* 6.13. [footer](https://github.com/mobify/hora.js/wiki/API#horafooter)
 * 6.13.1. [interact](https://github.com/mobify/hora.js/wiki/API#horafooterinteract)
* 6.14. [breadcrumb](https://github.com/mobify/hora.js/wiki/API#horabreadcrumb)
 * 6.14.1. [interact](https://github.com/mobify/hora.js/wiki/API#horabreadcrumbinteract)
* 6.15. [backToTop](https://github.com/mobify/hora.js/wiki/API#horabacktotop)
 * 6.15.1. [click](https://github.com/mobify/hora.js/wiki/API#horabacktotopclick)
* 6.16. [sidebar](https://github.com/mobify/hora.js/wiki/API#horasidebar)
 * 6.16.1. [open](https://github.com/mobify/hora.js/wiki/API#horasidebaropen)
 * 6.16.2. [close](https://github.com/mobify/hora.js/wiki/API#horasidebarclose)
* 6.17. [sideGuide](https://github.com/mobify/hora.js/wiki/API#horasideguide)
 * 6.17.1. [open](https://github.com/mobify/hora.js/wiki/API#horasideguideopen)
* 6.18. [filters](https://github.com/mobify/hora.js/wiki/API#horafilters)
 * 6.18.1. [toggle](https://github.com/mobify/hora.js/wiki/API#horafilterstoggle)
* 6.19. [pagination](https://github.com/mobify/hora.js/wiki/API#horapagination)
 * 6.19.1. [interact](https://github.com/mobify/hora.js/wiki/API#horapaginationinteract)
* 6.20. [error](https://github.com/mobify/hora.js/wiki/API#horaerror)
 * 6.20.1. [unsuccessfulAddToCart](https://github.com/mobify/hora.js/wiki/API#horaerrorunsuccessfuladdtocart)
 * 6.20.2. [unsuccessfulPlaceOrder](https://github.com/mobify/hora.js/wiki/API#horaerrorunsuccessfulplaceorder)
 * 6.20.3. [console](https://github.com/mobify/hora.js/wiki/API#horaerrorconsole)
 * 6.20.4. [error](https://github.com/mobify/hora.js/wiki/API#horaerrorerror)
* 6.21. [scroll](https://github.com/mobify/hora.js/wiki/API#horascroll)
 * 6.21.1. [up](https://github.com/mobify/hora.js/wiki/API#horascrollup)
 * 6.21.2. [down](https://github.com/mobify/hora.js/wiki/API#horascrolldown)
 * 6.21.3. [top](https://github.com/mobify/hora.js/wiki/API#horascrolltop)
 * 6.21.4. [bottom](https://github.com/mobify/hora.js/wiki/API#horascrollbottom)
* 6.22. [color](https://github.com/mobify/hora.js/wiki/API#horacolor)
 * 6.22.1. [change](https://github.com/mobify/hora.js/wiki/API#horacolorchange)
* 6.23. [quantity](https://github.com/mobify/hora.js/wiki/API#horaquantity)
 * 6.23.1. [change](https://github.com/mobify/hora.js/wiki/API#horaquantitychange)
* 6.24. [size](https://github.com/mobify/hora.js/wiki/API#horasize)
 * 6.24.1. [change](https://github.com/mobify/hora.js/wiki/API#horasizechange)
* 6.25. [navigation](https://github.com/mobify/hora.js/wiki/API#horanavigation)
 * 6.25.1. [click](https://github.com/mobify/hora.js/wiki/API#horanavigationclick)
* 6.26. [emailFriend](https://github.com/mobify/hora.js/wiki/API#horaemailfriend)
 * 6.26.1. [open](https://github.com/mobify/hora.js/wiki/API#horaemailfriendopen)
* 6.27. [emailMeBack](https://github.com/mobify/hora.js/wiki/API#horaemailmeback)
 * 6.27.1. [open](https://github.com/mobify/hora.js/wiki/API#horaemailmebackopen)
* 6.28. [reviews](https://github.com/mobify/hora.js/wiki/API#horareviews)
 * 6.28.1. [read](https://github.com/mobify/hora.js/wiki/API#horareviewsread)
