### 
jQuery Open Carousel

Copyright (c) 2013 Justin McCandless (justinmccandless.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###


###
This is the main coffeescript file
Include jquery.openCarousel.js and jquery.openCarousel.css in your projects
###
class Ocarousel
    ### Initialize ###
    ocarousel: null
    ocarousel_window: null
    ocarousel_container: null
    frames: null
    indicators: null
    timer: null
    active: 0

    ### Default Settings ###
    @settings:
        speed: .5 * 1000                # how long each transition is, milliseconds
        period: 4 * 1000                # time between frame changes, milliseconds (Infinity will prevent autoscrolling)
        transition: "scroll"            # type of transition animation
        perscroll: 1                    # number of slides to pass over for each scroll
        wrapearly: 0                    # scroll to the beginning when reaching this many slides before the end
        shuffle: false					# setting to true will randomize the order of slides, false will keep the order given in html
        indicator_fill: "#ffffff"       # inactive fill color of indicator circles
        indicator_r: 6                  # radius of indicator circles
        indicator_spacing: 6            # spacing between indicators
        indicator_cy: 20                # y position of indicator circles
        indicator_stroke: "#afafaf"     # stroke color of indicator cirlces
        indicator_strokewidth: "2"      # stroke width of indicator circles

    constructor: (ocarousel) ->
        me = @
        
        # get ocarousel divs
        @ocarousel = $(ocarousel)
        @ocarousel_window = $(@ocarousel).children(".ocarousel_window")
        @frames = $(@ocarousel_window).children()
        indicators_container = $(@ocarousel).children(".ocarousel_indicators")
        @pagination_current = $(@ocarousel).children(".ocarousel_pagination_current")
        @pagination_total = $(@ocarousel).children(".ocarousel_pagination_total")

        # if there are 0 or 1 frames, then the carousel should not do anything!
        if @frames.length > 1
            # get dynamic settings from data attributes
            @settings = {}
            @settings.speed = $(@ocarousel).data('ocarousel-speed') ? Ocarousel.settings.speed
            @settings.period = $(@ocarousel).data('ocarousel-period') ? Ocarousel.settings.period
            @settings.transition = $(@ocarousel).data('ocarousel-transition') ? Ocarousel.settings.transition
            @settings.perscroll = $(@ocarousel).data('ocarousel-perscroll') ? Ocarousel.settings.perscroll
            @settings.wrapearly = $(@ocarousel).data('ocarousel-wrapearly') ? Ocarousel.settings.wrapearly
            @settings.shuffle = $(@ocarousel).data('ocarousel-shuffle') ? Ocarousel.settings.shuffle
            @settings.indicator_fill = $(@ocarousel).data('ocarousel-indicator-fill') ? Ocarousel.settings.indicator_fill
            @settings.indicator_r = $(@ocarousel).data('ocarousel-indicator-r') ? Ocarousel.settings.indicator_r
            @settings.indicator_spacing = $(@ocarousel).data('ocarousel-indicator-spacing') ? Ocarousel.settings.indicator_spacing
            @settings.indicator_cy = $(@ocarousel).data('ocarousel-indicator-cy') ? Ocarousel.settings.indicator_cy
            @settings.indicator_stroke = $(@ocarousel).data('ocarousel-indicator-stroke') ? Ocarousel.settings.indicator_stroke
            @settings.indicator_strokewidth = $(@ocarousel).data('ocarousel-indicator-strokewidth') ? Ocarousel.settings.indicator_strokewidth
            
            # add container for the slides
            @ocarousel_container = document.createElement("div")
            @ocarousel_container.className =  "ocarousel_window_slides"
            if @settings.shuffle is true
                @frames.sort () ->
	                return Math.round( Math.random() ) - 0.5
            $(@frames).each (i) ->
                me.ocarousel_container.appendChild(this)
            @ocarousel_window.html("")
            $(@ocarousel_window).get(0).appendChild(@ocarousel_container)
            
            # let everything be visible
            $(@ocarousel).show()

            # setup indicators if the user provided a div
            if indicators_container.length && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
                # setup the svg itself
                indicators_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                indicators_svg.setAttribute("version", "1.1")
                $(indicators_container).get(0).appendChild(indicators_svg)

                # setup the circle indicators
                @indicators = []
                cx = $(indicators_container).width() / 2 - @settings.indicator_r * @frames.length - @settings.indicator_spacing * @frames.length / 2
                for i in [0..@frames.length - 1]
                    # create an indicator
                    indicator = document.createElementNS("http://www.w3.org/2000/svg", "circle")
                    indicator.className = "ocarousel_link"
                    indicator.setAttribute("data-ocarousel-link", i)
                    indicator.setAttribute("cx", cx)
                    indicator.setAttribute("cy", @settings.indicator_cy)
                    indicator.setAttribute("r", @settings.indicator_r)
                    indicator.setAttribute("stroke", @settings.indicator_stroke)
                    indicator.setAttribute("stroke-width", @settings.indicator_strokewidth)
                    indicator.setAttribute("fill", if i is 0 then @settings.indicator_stroke else @settings.indicator_fill)

                    # append it to the DOM and our array
                    indicators_svg.appendChild(indicator)
                    @indicators.push(indicator)

                    # set its index as a data setAttribute
                    $(indicator).data("ocarousel_index", i)

                    # setup the next cx
                    cx = cx + @settings.indicator_r * 2 + @settings.indicator_spacing

                # setup the pagination current page
                if @pagination_current.length
                    $(@pagination_current).html("1")

                # setup the pagination total pages
                if @pagination_total.length
                    $(@pagination_total).html(@frames.length)
             
            # click event
            $(@ocarousel).find("[data-ocarousel-link]").click (event) ->
                event.preventDefault()
                goHere = $(this).data("ocarousel-link")
                if goHere?
                    if goHere == "left" || goHere == "Left" || goHere == "l" || goHere == "L"
                        goHere = me.getPrev()
                    else if goHere == "right" || goHere == "Right" || goHere == "r" || goHere == "R"
                        goHere = me.getNext()
                    else if goHere == "first" || goHere == "First" || goHere == "beginning" || goHere == "Beginning"
                        goHere = 0
                    else if goHere == "last" || goHere == "Last" || goHere == "end" || goHere == "End"
                        goHere = me.frames.length - 1

                    me.scrollTo goHere

            # start the scroll timer
            @timerStart()

    ### Animate a transition to the given position ###
    scrollTo: (i) ->
        me = @

        if i?
            clearInterval @timer

            # wrap to beginning/end if necessary
            if i >= (@frames.length - @settings.wrapearly)
                i = 0
            else if i >= (@frames.length - @settings.perscroll)
                i = @frames.length - @settings.perscroll
            else if i < 0
                perEnd = @frames.length - @settings.perscroll
                wrapEnd = @frames.length - 1 - @settings.wrapearly
                i = Math.min(perEnd, wrapEnd)

            # animate the slides
            $(@ocarousel_container).stop()
            if @settings.transition == "fade"
                nextPos = me.getPos i
                $(@ocarousel_container).fadeOut @settings.speed, null, ->
                    $(me.ocarousel_container).animate {right: nextPos + "px"}, 0
                    $(me.ocarousel_container).fadeIn me.settings.speed
            else
                $(@ocarousel_container).animate {right: (@getPos i) + "px"}, @settings.speed

            # update the indicators if they exist
            if @indicators?
                $(@indicators[@active]).attr "fill", @settings.indicator_fill
                $(@indicators[i]).attr "fill", @settings.indicator_stroke

            # update the active variable
            @active = i

            # update the current pagination number if it exists
            if @pagination_current.length
                $(@pagination_current).html(@active + 1)

            # resume the scroll timer
            @timerStart()

    ### Returns the distance of a frame from the left edge of its container ###
    getPos: (which) ->
        return $(@frames[which]).position().left

    ### Returns the index of the next slide that should be shown ###
    getNext: ->
        next = @active + @settings.perscroll
        if next > (@frames.length - @settings.perscroll) && next < @frames.length
            next = @frames.length - @settings.perscroll
        return next

    ### Returns the index of the next slide that should be shown before the current position ###
    getPrev: ->
        prev = @active - @settings.perscroll
        if prev < 0 && @active != 0
            prev = 0
        return prev

    ### Starts or resumes the scroll timer ###
    timerStart: ->
        me = @
        if @settings.period != Infinity
            @timer = setInterval (() -> me.scrollTo (me.getNext())), @settings.period

$(document).ready ->
    $(".ocarousel").each ->
        new Ocarousel(this)

