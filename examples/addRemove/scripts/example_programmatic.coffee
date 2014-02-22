###
This is a demo coffeescript file for the programmatic example

The .ocarousel-example-programmatic carousel is NOT initialized automatically
in the main coffeescript file, because it does not include the .ocarousel
class.  All setup is done here.
###

# We can't create an Ocarousel object until the DOM is ready
$(document).ready ->

    # Initialize it
    ocarouselProg = new Ocarousel($(".ocarousel_example_programmatic"))

    # Click event for adding a slide
    $('button#add_submit').on 'click', () ->
        frame = document.createElement("div")
        frame.innerHTML = $("#add_content").val()
        frame.className = "example_programmatic_slide"
        index = $("#add_index").val()
        ocarouselProg.add(frame, index)

    # Click event for removing a slide
    $('button#remove_submit').on 'click', () ->
        index = $("#remove_index").val()
        ocarouselProg.remove(index)

    # Click event for starting/stopping periodic scrolling
    $('button#play_submit').on 'click', () ->
        ocarouselProg.timerToggle()

    # Callback for slide changed, just log it as a demo
    ocarouselProg.onSlideChanged = (index, indexOld) ->
        console.log 'Hey! The active slide changed.', index, indexOld

