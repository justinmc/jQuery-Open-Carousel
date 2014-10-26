
/*
jQuery Open Carousel

Copyright (c) 2013 Justin McCandless (justinmccandless.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/*
This is the main coffeescript file
Include jquery.openCarousel.js and jquery.openCarousel.css in your projects
 */

(function() {
  window.Ocarousel = (function() {

    /* Initialize */
    var arrayShuffle;

    Ocarousel.prototype.ocarousel = null;

    Ocarousel.prototype.ocarousel_window = null;

    Ocarousel.prototype.ocarousel_container = null;

    Ocarousel.prototype.indicators_container = null;

    Ocarousel.prototype.frames = null;

    Ocarousel.prototype.framesPre = null;

    Ocarousel.prototype.framesPost = null;

    Ocarousel.prototype.indicators = null;

    Ocarousel.prototype.timer = null;

    Ocarousel.prototype.active = 0;


    /* Public callback */

    Ocarousel.prototype.onSlideChanged = null;


    /* Default Settings */

    Ocarousel.settings = {
      speed: .5 * 1000,
      period: 4 * 1000,
      transition: "scroll",
      perscroll: 1,
      wrapearly: 0,
      shuffle: false,
      indicator_fill: "#ffffff",
      indicator_r: 6,
      indicator_spacing: 6,
      indicator_cy: 20,
      indicator_stroke: "#afafaf",
      indicator_strokewidth: "2",
      fullwidth: false,
      vertical: false,
      cycle: false
    };

    function Ocarousel(ocarousel) {
      var children, children2, me, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      me = this;
      this.ocarousel = $(ocarousel);
      this.ocarousel_window = $(this.ocarousel).find(".ocarousel_window");
      this.frames = $(this.ocarousel_window).children().clone();
      this.indicators_container = $(this.ocarousel).find(".ocarousel_indicators");
      this.pagination_current = $(this.ocarousel).find(".ocarousel_pagination_current");
      this.pagination_total = $(this.ocarousel).find(".ocarousel_pagination_total");
      if (this.frames.length > 1) {
        this.settings = {};
        this.settings.speed = (_ref = $(this.ocarousel).data('ocarousel-speed')) != null ? _ref : Ocarousel.settings.speed;
        this.settings.period = (_ref1 = $(this.ocarousel).data('ocarousel-period')) != null ? _ref1 : Ocarousel.settings.period;
        this.settings.transition = (_ref2 = $(this.ocarousel).data('ocarousel-transition')) != null ? _ref2 : Ocarousel.settings.transition;
        this.settings.perscroll = (_ref3 = $(this.ocarousel).data('ocarousel-perscroll')) != null ? _ref3 : Ocarousel.settings.perscroll;
        this.settings.wrapearly = (_ref4 = $(this.ocarousel).data('ocarousel-wrapearly')) != null ? _ref4 : Ocarousel.settings.wrapearly;
        this.settings.shuffle = (_ref5 = $(this.ocarousel).data('ocarousel-shuffle')) != null ? _ref5 : Ocarousel.settings.shuffle;
        this.settings.indicator_fill = (_ref6 = $(this.ocarousel).data('ocarousel-indicator-fill')) != null ? _ref6 : Ocarousel.settings.indicator_fill;
        this.settings.indicator_r = (_ref7 = $(this.ocarousel).data('ocarousel-indicator-r')) != null ? _ref7 : Ocarousel.settings.indicator_r;
        this.settings.indicator_spacing = (_ref8 = $(this.ocarousel).data('ocarousel-indicator-spacing')) != null ? _ref8 : Ocarousel.settings.indicator_spacing;
        this.settings.indicator_cy = (_ref9 = $(this.ocarousel).data('ocarousel-indicator-cy')) != null ? _ref9 : Ocarousel.settings.indicator_cy;
        this.settings.indicator_stroke = (_ref10 = $(this.ocarousel).data('ocarousel-indicator-stroke')) != null ? _ref10 : Ocarousel.settings.indicator_stroke;
        this.settings.indicator_strokewidth = (_ref11 = $(this.ocarousel).data('ocarousel-indicator-strokewidth')) != null ? _ref11 : Ocarousel.settings.indicator_strokewidth;
        this.settings.fullwidth = (_ref12 = $(this.ocarousel).data('ocarousel-fullwidth')) != null ? _ref12 : Ocarousel.settings.fullwidth;
        this.settings.vertical = (_ref13 = $(this.ocarousel).data('ocarousel-vertical')) != null ? _ref13 : Ocarousel.settings.vertical;
        this.settings.cycle = (_ref14 = $(this.ocarousel).data('ocarousel-cycle')) != null ? _ref14 : Ocarousel.settings.cycle;
        if (this.settings.cycle) {
          children = $(this.ocarousel_window).children().clone();
          children2 = $(this.ocarousel_window).children().clone();
          $(this.ocarousel_window).append(children);
          $(this.ocarousel_window).append(children2);
          this.frames = $(this.ocarousel_window).children().clone();
          this.active = this.frames.length / 3;
        }
        this.ocarousel_container = document.createElement("div");
        this.ocarousel_container.className = "ocarousel_window_slides";
        $(this.ocarousel).show();
        this.timerStop();
        this.ocarousel_window.html("");
        $(this.ocarousel_window).get(0).appendChild(this.ocarousel_container);
        this.render();
        this.setContainerPos();
        this.timerStart();
      }
    }


    /* Remove and reset everything in the DOM */

    Ocarousel.prototype.render = function() {
      var cx, end, i, indicator, indicators_parent, length, link, me, start, svgWidth, _i;
      if (this.settings.shuffle && this.settings.shuffle !== "false") {
        this.frames = arrayShuffle(this.frames);
      }
      $(this.ocarousel_container).html("");
      me = this;
      $(this.frames).each(function(i) {
        if (me.settings.fullwidth && me.settings.fullwidth !== "false") {
          $(this).css("width", $(me.ocarousel_window).width());
        }
        if (me.settings.vertical) {
          $(this).addClass("ocarousel_window_slides_vertical");
        }
        return $(me.ocarousel_container).append(this);
      });
      if (this.indicators_container.length) {
        $(this.indicators_container).html("");
        if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
          indicators_parent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          indicators_parent.setAttribute("version", "1.1");
          $(this.indicators_container).get(0).appendChild(indicators_parent);
        } else {
          indicators_parent = $(this.indicators_container).get(0);
        }
        this.indicators = [];
        length = this.frames.length;
        start = 0;
        end = this.frames.length - 1;
        if (this.settings.cycle) {
          start = this.frames.length / 3;
          end = 2 * this.frames.length / 3 - 1;
          length = this.frames.length / 3;
        }
        svgWidth = this.settings.indicator_r * 2 * length + this.settings.indicator_spacing * (length + 1);
        indicators_parent.setAttribute("width", svgWidth + "px");
        cx = this.settings.indicator_r + this.settings.indicator_spacing;
        for (i = _i = start; start <= end ? _i <= end : _i >= end; i = start <= end ? ++_i : --_i) {
          link = !this.settings.cycle ? i : i % (this.frames.length / 3);
          if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
            indicator = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            indicator.className = "ocarousel_link";
            indicator.setAttribute("data-ocarousel-link", link);
            indicator.setAttribute("cx", cx);
            indicator.setAttribute("cy", this.settings.indicator_cy);
            indicator.setAttribute("r", this.settings.indicator_r);
            indicator.setAttribute("stroke", this.settings.indicator_stroke);
            indicator.setAttribute("stroke-width", this.settings.indicator_strokewidth);
            indicator.setAttribute("fill", i === this.active ? this.settings.indicator_stroke : this.settings.indicator_fill);
          } else {
            indicator = document.createElement("div");
            indicator.className = "ocarousel_link ocarousel_indicator ocarousel_indicator_" + (i === this.active ? "active" : "inactive");
            indicator.setAttribute("data-ocarousel-link", link);
          }
          indicators_parent.appendChild(indicator);
          this.indicators.push(indicator);
          $(indicator).data("ocarousel_index", i);
          cx = cx + this.settings.indicator_r * 2 + this.settings.indicator_spacing;
        }
      }
      if (this.pagination_current.length) {
        $(this.pagination_current).html(this.active + 1);
      }
      if (this.pagination_total.length) {
        $(this.pagination_total).html(this.frames.length);
      }
      $(this.ocarousel).find("[data-ocarousel-link]").unbind("click");
      $(this.ocarousel).find("[data-ocarousel-link]").bind("click", function(event) {
        var goHere;
        event.preventDefault();
        goHere = $(this).data("ocarousel-link");
        if (goHere != null) {
          if (goHere === "left" || goHere === "Left" || goHere === "l" || goHere === "L") {
            goHere = me.getPrev();
          } else if (goHere === "right" || goHere === "Right" || goHere === "r" || goHere === "R") {
            goHere = me.getNext();
          } else if (goHere === "first" || goHere === "First" || goHere === "beginning" || goHere === "Beginning") {
            goHere = me.getFirst();
          } else if (goHere === "last" || goHere === "Last" || goHere === "end" || goHere === "End") {
            goHere = me.getLast();
          } else if (me.settings.cycle) {
            goHere = goHere + me.frames.length / 3;
          }
          return me.scrollTo(goHere);
        }
      });
      if (this.settings.fullwidth) {
        return $(window).one("resize", function() {
          return me.render();
        });
      }
    };


    /* Animate a transition to the given position */

    Ocarousel.prototype.scrollTo = function(index, instant) {
      var i, indNew, indOld, indexOld, me, nextPos, perEnd, wrapEnd, _i, _j, _ref, _ref1, _ref2;
      if (instant == null) {
        instant = false;
      }
      me = this;
      if (index != null) {
        this.timerStop();
        if (index >= (this.frames.length - this.settings.wrapearly)) {
          index = 0;
        } else if (index >= (this.frames.length - this.settings.perscroll)) {
          index = this.frames.length - this.settings.perscroll;
        } else if (index < 0) {
          perEnd = this.frames.length - this.settings.perscroll;
          wrapEnd = this.frames.length - 1 - this.settings.wrapearly;
          index = Math.min(perEnd, wrapEnd);
        }
        if (this.settings.cycle) {
          if (index < this.frames.length / 3) {
            for (i = _i = _ref = this.frames.length - 1, _ref1 = 2 * (this.frames.length / 3); _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
              $(this.frames[i]).remove();
              $(this.ocarousel_container).prepend(this.frames[i]);
            }
            this.active = this.active + this.frames.length / 3;
            index = index + this.frames.length / 3;
            this.frames = $(this.ocarousel_container).children();
            this.setContainerPos();
          }
          if (index >= (this.frames.length / 3) * 2) {
            for (i = _j = 0, _ref2 = this.frames.length / 3 - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
              $(this.frames[i]).remove();
              $(this.ocarousel_container).append(this.frames[i]);
            }
            this.active = this.active - this.frames.length / 3;
            index = index - this.frames.length / 3;
            this.frames = $(this.ocarousel_container).children();
            this.setContainerPos();
          }
        }
        $(this.ocarousel_container).stop();
        nextPos = this.getPos(index);
        if (instant) {
          this.setContainerPos(nextPos);
        } else if (this.settings.transition === "fade") {
          if (this.settings.vertical) {
            $(this.ocarousel_container).fadeOut(this.settings.speed, null).animate({
              top: nextPos + "px"
            }, 0).fadeIn(me.settings.speed);
          } else {
            $(this.ocarousel_container).fadeOut(this.settings.speed, null).animate({
              right: nextPos + "px"
            }, 0).fadeIn(me.settings.speed);
          }
        } else {
          if (this.settings.vertical) {
            $(this.ocarousel_container).animate({
              bottom: nextPos + "px"
            }, this.settings.speed);
          } else {
            $(this.ocarousel_container).animate({
              right: nextPos + "px"
            }, this.settings.speed);
          }
        }
        if (this.indicators != null) {
          indOld = this.active;
          indNew = index;
          if (this.settings.cycle) {
            indOld = indOld % (this.frames.length / 3);
            indNew = indNew % (this.frames.length / 3);
          }
          if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
            $(this.indicators[indOld]).attr("fill", this.settings.indicator_fill);
            $(this.indicators[indNew]).attr("fill", this.settings.indicator_stroke);
          } else {
            $(this.indicators[indOld]).removeClass("ocarousel_indicator_active");
            $(this.indicators[indOld]).addClass("ocarousel_indicator_inactive");
            $(this.indicators[indNew]).addClass("ocarousel_indicator_active");
            $(this.indicators[indNew]).removeClass("ocarousel_indicator_inactive");
          }
        }
        indexOld = this.active;
        this.active = index;
        if (this.pagination_current.length) {
          $(this.pagination_current).html(this.active + 1);
        }
        this.timerStart();
        if (typeof this.onSlideChanged === 'function') {
          return this.onSlideChanged(index, indexOld);
        }
      }
    };


    /* Returns the distance of a frame from the beginning edge of its container */

    Ocarousel.prototype.getPos = function(index) {
      if (this.settings.vertical) {
        return $(this.frames[index]).position().top;
      } else {
        return $(this.frames[index]).position().left;
      }
    };


    /* Returns the index of the next slide that should be shown */

    Ocarousel.prototype.getNext = function() {
      var count, next;
      next = this.active + this.settings.perscroll;
      if (next > (this.frames.length - this.settings.perscroll) && next < this.frames.length) {
        next = this.frames.length - this.settings.perscroll;
      }
      count = this.frames.length;
      while (count && !$(this.frames[next]).is(":visible")) {
        next++;
        if (next > this.frames.length - 1) {
          next = 0;
        }
        count--;
      }
      return next;
    };


    /* Returns the index of the next slide that should be shown before the current position */

    Ocarousel.prototype.getPrev = function() {
      var count, prev;
      prev = this.active - this.settings.perscroll;
      if (prev < 0 && this.active !== 0) {
        prev = 0;
      }
      count = this.frames.length;
      while (count && !$(this.frames[prev]).is(":visible")) {
        prev--;
        if (prev < 0) {
          prev = this.frames.length - 1;
        }
        count--;
      }
      return prev;
    };


    /* Returns the index of the last slide */

    Ocarousel.prototype.getLast = function() {
      if (this.settings.cycle) {
        return 2 * this.frames.length / 3 - 1;
      } else {
        return this.frames.length - 1;
      }
    };


    /* Returns the index of the last slide */

    Ocarousel.prototype.getFirst = function() {
      if (this.settings.cycle) {
        return this.frames.length;
      } else {
        return 0;
      }
    };


    /* Starts or resumes the scroll timer */

    Ocarousel.prototype.timerStart = function() {
      var me;
      me = this;
      if (this.settings.period !== Infinity) {
        return this.timer = setInterval((function() {
          return me.scrollTo(me.getNext());
        }), this.settings.period);
      }
    };


    /* Stops the scroll timer */

    Ocarousel.prototype.timerStop = function() {
      if (this.timer != null) {
        clearInterval(this.timer);
        return this.timer = null;
      }
    };


    /* Starts the timer if it is stopped, stops the timer if it is running */

    Ocarousel.prototype.timerToggle = function() {
      if (this.timer != null) {
        return this.timerStop();
      } else {
        return this.timerStart();
      }
    };

    Ocarousel.prototype.setContainerPos = function(pos) {
      if (pos == null) {
        pos = this.getPos(this.active);
      }
      if (this.settings.vertical) {
        return $(this.ocarousel_container).animate({
          bottom: pos + "px"
        }, 0);
      } else {
        return $(this.ocarousel_container).animate({
          right: pos + "px"
        }, 0);
      }
    };


    /* Removes a frame, keeping the carousel in an intuitive position afterwards */

    Ocarousel.prototype.remove = function(index) {
      if (index > 0 && index < (this.frames.length - 1)) {
        this.frames.splice(index, 1);
        this.render();
        if (this.active > index) {
          return this.scrollTo(this.active - 1, true);
        }
      }
    };


    /* Adds a frame, keeping the carousel in an intuitive position afterwards */

    Ocarousel.prototype.add = function(elt, index) {
      if (index > 0 && index < (this.frames.length - 1)) {
        this.frames.splice(index, 0, elt);
        this.render();
        if (this.active >= index) {
          return this.scrollTo(this.active + 1, true);
        }
      }
    };

    arrayShuffle = function(arr) {
      var i, j, tempi, tempj;
      i = arr.length;
      if (i === 0) {
        return false;
      }
      while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = arr[i];
        tempj = arr[j];
        arr[i] = tempj;
        arr[j] = tempi;
      }
      return arr;
    };

    return Ocarousel;

  })();

  $(document).ready(function() {
    return $(".ocarousel").each(function() {
      return new Ocarousel(this);
    });
  });

}).call(this);
