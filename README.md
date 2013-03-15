# jQuery Open Carousel

<table>
  <tr>
    <td>Author:</td>
    <td>Justin McCandless (www.justinmccandless.com)</td>
  </tr>
  <tr>
    <td>Demo:</td>
    <td>http://www.justinmccandless.com/demos/jQuery-Open-Carousel/index.html</td>
  </tr>
  <tr>
    <td>Latest Blog Post:</td>
    <td>http://www.justinmccandless.com/blog/Open+Source+jQuery+Carousel</td>
  </tr>
  <tr>
    <td>Contact:</td>
    <td>justinjmccandless@gmail.com</td>
  </tr>
</table>

## Overview

This project is an open and easy to implement carousel display made using jQuery.  It supports linking to scroll to any slide, automatic generation of indicator circles, and pretty much any content will work inside of it.  Multiple carousels can exist on one page without conflict.  Many configuration options can be set dynamically using data attributes.

## Setup

Be sure to include jQuery, the Open Carousel javascript file (jQuery.openCarousel.js), and the Open Carousel CSS file (jQuery.openCarousel.css) in every HTML page that you want to use an instance of Open Carousel in.

## Basic Usage

In its most simplest case, this carousel will just automatically rotate the position of different objects placed within a div.  A setup of this might look like:

```html
<div class="ocarousel">
    <div class="ocarousel_window">
    
    <!--
        Your content here
        Anything that can be displayed as inline-block will work as slides (divs, img tags, etc.)
    -->
    
    </div>
</div>
```

This simple setup will immediately start working (don't forget to include the Open Carousel files!).  The ".ocarousel" div is just a wrapper to separate different instances of Open Carousel.  The ".ocarousel_window" is the view inside of which your slides are moved.  You should style this to match your content in a way you find attractive!

## Features

Open Carousel has a few basic features that many users will find themselves needing.

### Links to Slides

Many people will want to include forward/back buttons to allow their users to navigate, or even more advanced things like first/last buttons or links to specific slides (like if you want linked thumbnails representing each slide).  This is all easily possible using the link system.

Simply include the "data-ocarousel-link" attribute on any clickable navigation element you want.  Set it equal to the index of the slide you want to link to (starting from 0), or one of the following:

* left
* right
* first
* last

### Indicator Bubbles

You can also very easily create a line of SVG circles that fill up to represent which slide is currently active, all linked to their corresponding slide.  Simply include the following div within the parent ".ocarousel" div, and everything will be set up for you automatically:

```html
<div class="ocarousel_indicators"></div>
```

### Pagination

Open Carouesel can also allow you to display numbers showing the total number of slides and the current slide.  Just add the class `ocarousel_pagination_current` and/or `ocarousel_pagination_total` to the element whose html you want replaced with the current and total page numbers, respectively.  So an implementation might look like this:

```html
<span class="ocarousel_pagination_current"></span>
/
<span class="ocarousel_pagination_total"></span>
```

## Configuration

Open Carousel is also highly configurable using just data attributes.  Here are all of the possible settings, with their default values and descriptions.

<table>
  <tr>
    <th>Data Attribute</th>
    <th>Default Value</th>
    <th>Definition</th>
  </tr>
  <tr>
    <td>speed</td>
    <td>.5 * 1000</td>
    <td>how long each transition is, milliseconds</td>
  </tr>
  <tr>
    <td>period</td>
    <td>4 * 1000</td>
    <td>time between frame changes, milliseconds (Infinity will prevent autoscrolling altogether)</td>
  </tr>
  <tr>
    <td>transition</td>
    <td>scroll</td>
    <td>type of transition animation ("scroll" or "fade")</td>
  </tr>
  <tr>
    <td>perscroll</td>
    <td>1</td>
    <td>number of slides to pass over for each scroll</td>
  </tr>
  <tr>
    <td>wrapearly</td>
    <td>0</td>
    <td>scroll to the beginning when reaching this many slides before the end</td>
  </tr>
  <tr>
    <td>shuffle</td>
    <td>false</td>
    <td>setting to true will randomize the order of slides, false will keep the order given in html</td>
  </tr>
  <tr>
    <td>indicator-fill</td>
    <td>#ffffff</td>
    <td>inactive fill color of indicator circles</td>
  </tr>
  <tr>
    <td>indicator-r</td>
    <td>6</td>
    <td>radius of indicator circles</td>
  </tr>
  <tr>
    <td>indicator-spacing</td>
    <td>6</td>
    <td>spacing between indicators</td>
  </tr>
  <tr>
    <td>indicator-cy</td>
    <td>20</td>
    <td>y position of indicator circles</td>
  </tr>
  <tr>
    <td>indicator-stroke</td>
    <td>#afafaf</td>
    <td>stroke color of indicator cirlces</td>
  </tr>
  <tr>
    <td>indicator-strokewidth</td>
    <td>2</td>
    <td>stroke width of indicator circles</td>
  </tr>
</table>

To use them, pass a data attribute on the parent ".ocarousel" div with the form: "data-ocarousel-name".  So if I wanted to set the indicator fill to red, my main div would look like

```html
<div class="ocarousel" data-ocarousel-indicator-fill="red">

...

</div>
```

## Hacking

Open Carousel was written to be extendible to fit many different applications.  The coffeescript is pretty simply written and brief, and I encourage anyone looking for a bit of different functionality to hack away.  Don't forget about all of the resources at the top of this README, and I hope you enjoy the project!

### License

This project is licensed under the MIT license as seen at the top of jquery.openCarousel.coffee, jquery.openCarousel.js, and jquery.openCarousel.css.

