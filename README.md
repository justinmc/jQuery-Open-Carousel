# jQuery Open Carousel

This project is an open and easy to implement carousel display made using jQuery.  It supports linking to scroll to any slide, automatic generation of indicator circles, and pretty much any content will work inside of it.  Multiple carousels can exist on one page without conflict.  Many configuration options can be set dynamically using data attributes.

<table>
  <tr>
    <td>Author:</td>
    <td>Justin McCandless (www.justinmccandless.com)</td>
  </tr>
  <tr>
    <td>Demo:</td>
    <td>http://www.justinmccandless.com/demos/jQuery-Open-Carousel/examples/main/index.html</td>
  </tr>
  <tr>
    <td>Latest Blog Post:</td>
    <td>http://www.justinmccandless.com/blog/Open+Source+jQuery+Carousel</td>
  </tr>
  <tr>
    <td>Contact:</td>
    <td>justinjmccandless@gmail.com</td>
  </tr>
  <tr>
    <td>jQuery Version:</td>
    <td>1.4.3+</td>
  </tr>
</table>

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

### Responsive

Open Carousel works nicely with any responsive layout you might throw it in.  Check out the responsive example at examples/responsive for more, or the fullwidth example if you want slides that fill their container at any screen size.

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

#### Fallback for no SVG Support
SVG was choosen for the indicators because of how easy it is to programmatically change things like size and color (see the Configuration section for how to do this with configuration parameters).  However, older versions of IE don't support SVG.  In this case, ocarousel will fallback to using the indicatorsSVGFallback.png image included in the project (include this in your images folder by default).  If you want to include a different image fallback, override the .ocarousel_indicator styles in jquery.openCarousel.css.

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
    <td>fullwidth</td>
    <td>false</td>
    <td>setting to true responsively sets the size of the slides to the width of the carousel window div</td>
  </tr>
  <tr>
    <td>vertical</td>
    <td>false</td>
    <td>setting to true positions slides vertically and scrolls vertically</td>
  </tr>
  <tr>
    <td>cycle</td>
    <td>false</td>
    <td>setting to true sets up an infinitely scrolling carousel instead of jumping back to the beginning/end</td>
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

Open Carousel was written to be extendible to fit many different applications.  By following the setup above you get something that just starts working right out of the box, but if your requirements are more specific then it's worth getting a bit more familiar with Open Carousel.

Check out the programmatic example at examples/addRemove/ to see all of this stuff in action, and pull requests are always welcome if you think you've added some functionality that could be of use to others in the main project!

### Startup

In the provided CoffeeScript, you'll notice a small piece of code at the very bottom that creates all the needed Open Carousel objects:

    $(document).ready ->
        $(".ocarousel").each ->
            new Ocarousel(this)

This simply creates a new Ocarousel object for every .ocarousel class on the page.  If you want to control when and where Open Carousel is started (say due to a complex bootstrap process like with Requirejs), then just remove these lines and create a new Ocarousel object where you need it.  Just make sure you do this after the DOM is ready and jQuery is loaded.

### The Ocarousel Object

Your application might have a need to programmatically access the Ocarousel object after it's initial creation, and if so, you should save a reference to it!  This will allow you to easily do things like programmatic scrolling or adding and removing slides while the carousel is running.

#### Public Attribute onSlideChanged

This attribute is one of the most powerful ways to add custom behavior to Ocarousel.  `onSlideChanged` is an attribute on each ocarousel instance, and if set to a function, it will be called at each slide changed.  The parameters passed to it will be `index, indexOld`, indicating the indices of the slides involved.

    ocarousel.onSlideChanged = (index, indexOld) ->
        console.log 'Hello, the carousel just finished changing from slide', indexOld, 'to slide', index

#### Public Methods

If you've got an instance of Ocarousel that you'd like to interface with programmatically, these public methods are the best way to do it.

##### scrollTo(index, instant)

This method scrolls the carousel to the slide at the given index.  If instant is set to true, then it transitions immediately with no animation.  Otherwise it uses the animation set by the transtion configuration parameter.

##### getNext() and getPrev()

These two methods return the index of the slide in the next or previous position from the current slide, respectively.  The perscroll configuration parameter is taken into consideration for scrolling by multiple slides at a time, and the methods will wrap around to the beginning/end if going out of bounds.  Hidden slides are not included.

##### remove(index)

This removes the slide at the given index from the data and rerenders the carousel.

##### add(elt, index)

This adds a DOM element, that you pass in as elt, to the carousel at the given index and rerenders.

##### timerStop()

Stops the timer that handles periodic scrolling.

##### timerStart()

Starts the timer that handles periodic scrolling, according to the current configuration.

##### timerToggle()

Toggles the status of the timer; if stopped it starts it, if it's running then it stops it.

#### Programmatically Changing Configuration Parameters

You can simply access the `settings` parameter of your oCarousel instance and change any of the configuration parameters detailed above at any time.  Some will change the behavior of the carousel immediately (e.g. `period`), but be aware that most require you to rerender by calling `render()`.

## License

This project is licensed under the MIT license as seen at the top of jquery.openCarousel.coffee, jquery.openCarousel.js, and jquery.openCarousel.css.

