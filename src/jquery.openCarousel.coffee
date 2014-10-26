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

# Create the Ocarousel class in the global namespace
class window.Ocarousel
    ### Initialize ###
    ocarousel: null
    ocarousel_window: null
    ocarousel_container: null
    indicators_container: null
    frames: null
    framesPre: null
    framesPost: null
    indicators: null
    timer: null
    active: 0

    ### Public callback ###
    onSlideChanged: null

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
        fullwidth: false                # dynamically sets width of slides to width of the window div
        vertical: false                 # positions and scrolls slides vertically instead of horizontally
        cycle: false                    # scrolled slides are appended to the end of the container to create a continuous carousel

    constructor: (ocarousel) ->
        me = @

        # Get ocarousel divs
        @ocarousel = $(ocarousel)
        @ocarousel_window = $(@ocarousel).find(".ocarousel_window")
        @frames = $(@ocarousel_window).children().clone()
        @indicators_container = $(@ocarousel).find(".ocarousel_indicators")
        @pagination_current = $(@ocarousel).find(".ocarousel_pagination_current")
        @pagination_total = $(@ocarousel).find(".ocarousel_pagination_total")

        # If there are 0 or 1 frames, then the carousel should not do anything!
        if @frames.length > 1
            # Get dynamic settings from data attributes
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
            @settings.fullwidth = $(@ocarousel).data('ocarousel-fullwidth') ? Ocarousel.settings.fullwidth
            @settings.vertical = $(@ocarousel).data('ocarousel-vertical') ? Ocarousel.settings.vertical
            @settings.cycle = $(@ocarousel).data('ocarousel-cycle') ? Ocarousel.settings.cycle

            # Set up for cycle if needed
            if @settings.cycle
                # We need 3 copies of the children
                children = $(@ocarousel_window).children().clone()
                children2 = $(@ocarousel_window).children().clone()
                $(@ocarousel_window).append(children)
                $(@ocarousel_window).append(children2)
                @frames = $(@ocarousel_window).children().clone()

                # Start at the middle copy of children
                @active = @frames.length / 3

            # Add the container for the slides
            @ocarousel_container = document.createElement("div")
            @ocarousel_container.className = "ocarousel_window_slides"

            # Let everything be visible
            $(@ocarousel).show()

            # Stop the scroll timer
            @timerStop()

            # Remove the old frames from their original location outside of the container
            @ocarousel_window.html("")

            # Insert our container with all of the frames into the DOM
            $(@ocarousel_window).get(0).appendChild(@ocarousel_container)

            # Render the frames and supporting elements from data into the DOM
            @render()

            # Make sure the container is scrolled to the correct position
            @setContainerPos()

            # Start the scroll timer
            @timerStart()

    ### Remove and reset everything in the DOM ###
    render: () ->
        # Shuffle the frames if shuffle is configured
        if @settings.shuffle and @settings.shuffle != "false"
            @frames = arrayShuffle(@frames)

        # Clear the frames in the DOM and then inserts all frame from data into the DOM
        $(@ocarousel_container).html("")
        me = @
        $(@frames).each (i) ->
            # Dynamically set the width of the frames if fullwidth enabled
            if me.settings.fullwidth and me.settings.fullwidth != "false"
                $(this).css("width", $(me.ocarousel_window).width())

            # Set slides to be vertical if vertical enabled
            if me.settings.vertical
                $(this).addClass("ocarousel_window_slides_vertical")

            # Insert the frame
            $(me.ocarousel_container).append(this)

        # Render indicators if the user provided a div
        if @indicators_container.length
            # Clear the container
            $(@indicators_container).html("")

            # Setup the svg itself if supported
            if document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
                indicators_parent = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                indicators_parent.setAttribute("version", "1.1")
                $(@indicators_container).get(0).appendChild(indicators_parent)
            # If SVG isn't supported, we'll insert images directly into the container div
            else
                indicators_parent = $(@indicators_container).get(0)

            # Reset and setup the circle indicators
            @indicators = []
            length = @frames.length
            start = 0
            end = @frames.length - 1
            if @settings.cycle
                start = @frames.length / 3
                end = 2 * @frames.length / 3 - 1
                length = @frames.length / 3
            svgWidth = @settings.indicator_r * 2 * length + @settings.indicator_spacing * (length + 1);
            indicators_parent.setAttribute("width", svgWidth + "px")
            cx = @settings.indicator_r + @settings.indicator_spacing
            for i in [start..end]
                # Create an indicator as SVG if supported
                link = if !@settings.cycle then i else i % (@frames.length / 3)
                if document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
                    indicator = document.createElementNS("http://www.w3.org/2000/svg", "circle")
                    indicator.className = "ocarousel_link"
                    indicator.setAttribute("data-ocarousel-link", link)
                    indicator.setAttribute("cx", cx)
                    indicator.setAttribute("cy", @settings.indicator_cy)
                    indicator.setAttribute("r", @settings.indicator_r)
                    indicator.setAttribute("stroke", @settings.indicator_stroke)
                    indicator.setAttribute("stroke-width", @settings.indicator_strokewidth)
                    indicator.setAttribute("fill", if i is @active then @settings.indicator_stroke else @settings.indicator_fill)
                # Otherwise create an indicator image
                else
                    indicator = document.createElement("div")
                    indicator.className = "ocarousel_link ocarousel_indicator ocarousel_indicator_" + if i is @active then "active" else "inactive"
                    indicator.setAttribute("data-ocarousel-link", link)

                # Append it to the DOM and our array
                indicators_parent.appendChild(indicator)
                @indicators.push(indicator)

                # Set its index as a data setAttribute
                $(indicator).data("ocarousel_index", i)

                # Setup the next cx
                cx = cx + @settings.indicator_r * 2 + @settings.indicator_spacing

        # Setup the pagination current page
        if @pagination_current.length
            $(@pagination_current).html(@active + 1)

        # Setup the pagination total pages
        if @pagination_total.length
            $(@pagination_total).html(@frames.length)

        # Reset and set the click event for scroll links
        $(@ocarousel).find("[data-ocarousel-link]").unbind("click")
        $(@ocarousel).find("[data-ocarousel-link]").bind "click", (event) ->
            event.preventDefault()
            goHere = $(this).data("ocarousel-link")
            if goHere?
                if goHere == "left" || goHere == "Left" || goHere == "l" || goHere == "L"
                    goHere = me.getPrev()
                else if goHere == "right" || goHere == "Right" || goHere == "r" || goHere == "R"
                    goHere = me.getNext()
                else if goHere == "first" || goHere == "First" || goHere == "beginning" || goHere == "Beginning"
                    goHere = me.getFirst()
                else if goHere == "last" || goHere == "Last" || goHere == "end" || goHere == "End"
                    goHere = me.getLast()
                else if me.settings.cycle
                    goHere = goHere + me.frames.length / 3

                me.scrollTo goHere

        # Set the screen resize event if fullwidth
        if @settings.fullwidth
            $(window).one "resize", () ->
                me.render()

    ### Animate a transition to the given position ###
    scrollTo: (index, instant = false) ->
        me = @

        if index?
            @timerStop()

            # Wrap to beginning/end if necessary
            if index >= (@frames.length - @settings.wrapearly)
                index = 0
            else if index >= (@frames.length - @settings.perscroll)
                index = @frames.length - @settings.perscroll
            else if index < 0
                perEnd = @frames.length - @settings.perscroll
                wrapEnd = @frames.length - 1 - @settings.wrapearly
                index = Math.min(perEnd, wrapEnd)

            # If we're in cycle mode
            if @settings.cycle
                # If we're less than the middle set, move the end set to the beginning
                if index < @frames.length / 3
                    for i in [@frames.length - 1..2 * (@frames.length / 3)]
                        $(@frames[i]).remove()
                        $(@ocarousel_container).prepend(@frames[i])
                    @active = @active + @frames.length / 3
                    index = index + @frames.length / 3
                    @frames = $(@ocarousel_container).children()
                    @setContainerPos()

                # If we're greater than the end set, move the beginning set to the end
                if index >= (@frames.length / 3) * 2
                    for i in [0..@frames.length / 3 - 1]
                        $(@frames[i]).remove()
                        $(@ocarousel_container).append(@frames[i])
                    @active = @active - @frames.length / 3
                    index = index - @frames.length / 3
                    @frames = $(@ocarousel_container).children()
                    @setContainerPos()

            # Move the slides
            $(@ocarousel_container).stop()
            nextPos = @getPos index
            # No animation
            if instant
                @setContainerPos(nextPos)
            # Fade animation
            else if @settings.transition == "fade"
                if @settings.vertical
                    $(@ocarousel_container).fadeOut(@settings.speed, null)
                    .animate({top: nextPos + "px"}, 0)
                    .fadeIn(me.settings.speed)
                else
                    $(@ocarousel_container).fadeOut(@settings.speed, null)
                    .animate({right: nextPos + "px"}, 0)
                    .fadeIn(me.settings.speed)
            # Slide animation
            else
                if @settings.vertical
                    $(@ocarousel_container).animate {bottom: nextPos + "px"}, @settings.speed
                else
                    $(@ocarousel_container).animate {right: nextPos + "px"}, @settings.speed

            # Update the indicators if they exist
            if @indicators?
                indOld = @active
                indNew = index
                if @settings.cycle
                    indOld = indOld % (@frames.length / 3)
                    indNew = indNew % (@frames.length / 3)
                # If SVG
                if document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
                    $(@indicators[indOld]).attr "fill", @settings.indicator_fill
                    $(@indicators[indNew]).attr "fill", @settings.indicator_stroke
                # Otherwise images
                else
                    $(@indicators[indOld]).removeClass("ocarousel_indicator_active")
                    $(@indicators[indOld]).addClass("ocarousel_indicator_inactive")
                    $(@indicators[indNew]).addClass("ocarousel_indicator_active")
                    $(@indicators[indNew]).removeClass("ocarousel_indicator_inactive")

            # Update the active variable
            indexOld = @active
            @active = index

            # Update the current pagination number if it exists
            if @pagination_current.length
                $(@pagination_current).html(@active + 1)

            # Resume the scroll timer
            @timerStart()

            # Call the provided callback if it exists
            if typeof @onSlideChanged is 'function'
                @onSlideChanged(index, indexOld)

    ### Returns the distance of a frame from the beginning edge of its container ###
    getPos: (index) ->
        if @settings.vertical
            return $(@frames[index]).position().top
        else
            return $(@frames[index]).position().left

    ### Returns the index of the next slide that should be shown ###
    getNext: () ->
        next = @active + @settings.perscroll
        if next > (@frames.length - @settings.perscroll) && next < @frames.length
            next = @frames.length - @settings.perscroll

        # If the choosen frame is hidden, choose the next visible one
        count = @frames.length
        while count && !$(@frames[next]).is(":visible")
            next++
            if next > @frames.length - 1
                next = 0
            count--

        return next

    ### Returns the index of the next slide that should be shown before the current position ###
    getPrev: () ->
        prev = @active - @settings.perscroll
        if prev < 0 && @active != 0
            prev = 0

        # If the chosen frame is hidden, choose the previous visible one
        count = @frames.length
        while count && !$(@frames[prev]).is(":visible")
            prev--
            if prev < 0
                prev = @frames.length - 1
            count--

        return prev

    ### Returns the index of the last slide ###
    getLast: () ->
        if @settings.cycle
            return 2 * @frames.length / 3 - 1
        else
            return @frames.length - 1

    ### Returns the index of the last slide ###
    getFirst: () ->
        if @settings.cycle
            return @frames.length
        else
            return 0

    ### Starts or resumes the scroll timer ###
    timerStart: () ->
        me = @
        if @settings.period != Infinity
            @timer = setInterval (() -> me.scrollTo (me.getNext())), @settings.period

    ### Stops the scroll timer ###
    timerStop: () ->
        if @timer?
            clearInterval @timer
            @timer = null

    ### Starts the timer if it is stopped, stops the timer if it is running ###
    timerToggle: () ->
        if @timer?
            @timerStop()
        else
            @timerStart()

    # Move ocarousel_container to the current active div instantly
    setContainerPos: (pos = @getPos(@active)) ->
        if @settings.vertical
            $(@ocarousel_container).animate({bottom: pos + "px"}, 0)
        else
            $(@ocarousel_container).animate({right: pos + "px"}, 0)

    ### Removes a frame, keeping the carousel in an intuitive position afterwards ###
    remove: (index) ->
        if index > 0 and index < (@frames.length - 1)
            # Remove from data and rerender
            @frames.splice(index,1)
            @render()

            # If the carousel is ahead of the frame being removed, prevent it from jumping forward
            if @active > index
                @scrollTo(@active - 1, true)

    ### Adds a frame, keeping the carousel in an intuitive position afterwards ###
    add: (elt, index) ->
        if index > 0 and index < (@frames.length - 1)
            @frames.splice(index, 0, elt)
            @render()

            # If the carousel is ahead of or at the frame being added, prevent it from jumping backward
            if @active >= index
                @scrollTo(@active + 1, true)

    # Randomizes the order of elements in the passed in array in place.
    # Adapted from http://sedition.com/perl/javascript-fy.html and https://gist.github.com/ddgromit/859699
    arrayShuffle = (arr) ->
        i = arr.length
        if i == 0 then return false

        while --i
            j = Math.floor(Math.random() * (i+1))
            tempi = arr[i]
            tempj = arr[j]
            arr[i] = tempj
            arr[j] = tempi

        return arr

$(document).ready ->
    $(".ocarousel").each ->
        new Ocarousel(this)

