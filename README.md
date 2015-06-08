Hora.js
=====

[![Bower version](https://badge.fury.io/bo/hora.js.svg)](http://badge.fury.io/bo/hora.js)
[![Circle CI](https://circleci.com/gh/mobify/hora.js.svg?style=shield)](https://circleci.com/gh/mobify/hora.js)

Hora.js is a convenient and simple wrapper for sending Mobify Analytics events (which are custom Google Analytics events). Everything you need to get started and figure out Hora.js.

| ![Hora](https://s3.amazonaws.com/uploads.hipchat.com/15359/425065/PbAANygwM20lNpS/hora.png) |
|-----|

## Table of Contents
**1. [Getting Started](https://github.com/mobify/hora.js/wiki/Getting-Started)**

* 1.1. [Installation](https://github.com/mobify/hora.js/wiki/Getting-Started#11-installation)
* 1.2. [Adding to Project](https://github.com/mobify/hora.js/wiki/Getting-Started#12-adding-to-project)
* 1.3. [Supported Features](https://github.com/mobify/hora.js/wiki/Getting-Started#13-supported-features)

**2. [Interactions](https://github.com/mobify/hora.js/wiki/Interactions)**

* 2.1. [Basic Interactions](https://github.com/mobify/hora.js/wiki/Interactions#21-basic-interactions)
* 2.2. [Tracking Carousel Interactions](https://github.com/mobify/hora.js/wiki/Interactions#23-tracking-carousel-interactions)
* 2.3. [Tracking Accordion Interactions](https://github.com/mobify/hora.js/wiki/Interactions#24-tracking-accordion-interactions)

**3. [Insights](https://github.com/mobify/hora.js/wiki/Insights)**

* 3.1. [Questions](https://github.com/mobify/hora.js/wiki/Insights#questions)

| Have a UX question? [Submit it here](https://github.com/mobify/hora.js/wiki/Submit-an-Insight) and we'll give you our insight |
|-----|

**4. [API](https://github.com/mobify/hora.js/wiki/API)**

* 4.1. [init](https://github.com/mobify/hora.js/wiki/API#horainit)
* 4.2. [send](https://github.com/mobify/hora.js/wiki/API#horasend)
* 4.3. [proxyClassicAnalytics](https://github.com/mobify/hora.js/wiki/API#horaproxyclassicanalytics)
* 4.4. [proxyUniversalAnalytics](https://github.com/mobify/hora.js/wiki/API#horaproxyuniversalanalytics)
* 4.5. [orientation](https://github.com/mobify/hora.js/wiki/API#horaorientation)
 * 4.5.1. [change](https://github.com/mobify/hora.js/wiki/API#horaorientationchange)
* 4.6. [carousel](https://github.com/mobify/hora.js/wiki/API#horacarousel)
 * 4.6.1. [load](https://github.com/mobify/hora.js/wiki/API#horacarouselload)
 * 4.6.2. [swipe](https://github.com/mobify/hora.js/wiki/API#horacarouselswipe)
 * 4.6.3. [zoom](https://github.com/mobify/hora.js/wiki/API#horacarouselzoom)
 * 4.6.4. [slideClick](https://github.com/mobify/hora.js/wiki/API#horacarouselslideClick)
* 4.7. [accordion](https://github.com/mobify/hora.js/wiki/API#horaaccordion)
 * 4.7.1. [load](https://github.com/mobify/hora.js/wiki/API#horaaccordionload)
 * 4.7.2. [open](https://github.com/mobify/hora.js/wiki/API#horaaccordionopen)
 * 4.7.3. [close](https://github.com/mobify/hora.js/wiki/API#horaaccordionclose)
* 4.8. [error](https://github.com/mobify/hora.js/wiki/API#horaerror)
 * 4.8.1. [generic](https://github.com/mobify/hora.js/wiki/API#horaerrorgeneric)
 * 4.8.2. [console](https://github.com/mobify/hora.js/wiki/API#horaerrorconsole)
* 4.9. [scroll](https://github.com/mobify/hora.js/wiki/API#horascroll)
 * 4.9.1. [up](https://github.com/mobify/hora.js/wiki/API#horascrollup)
 * 4.9.2. [down](https://github.com/mobify/hora.js/wiki/API#horascrolldown)
 * 4.9.3. [top](https://github.com/mobify/hora.js/wiki/API#horascrolltop)
 * 4.9.4. [bottom](https://github.com/mobify/hora.js/wiki/API#horascrollbottom)
