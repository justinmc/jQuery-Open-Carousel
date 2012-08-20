/***************************************************************************
 Side Scrolling Image Bar
***************************************************************************/

// Default Settings
var speed = .5 * 1000;			// how long each transition is, milliseconds
var frequency = 4 * 1000;  		// how often frames change, milliseconds
var transition = 'scroll';		// type of transition animation

// Dynamic Settings
if ($('.imagebar_window_slides').data('imagebar-speed'))
	speed = $('.imagebar_window_slides').data('imagebar-speed');
if ($('.imagebar_window_slides').data('imagebar-freq'))
	frequency = $('.imagebar_window_slides').data('imagebar-freq');
if ($('.imagebar_window_slides').data('imagebar-transition'))
	transition = $('.imagebar_window_slides').data('imagebar-transition');

// Initialize
var active = 0;
var frames;

$(document).ready(function() {
	
	// figure out how many frames there are
	frames = $('.imagebar_window_slide').length;
	
	// set up listeners
	$('#imagebar_indicators_circle'+active).attr('fill', '#afafaf');
	 
	$('.imagebar_button_left').click(function() {
    	scrollTo(active-1, transition);
    });
    $('.imagebar_button_right').click(function() {
    	scrollTo(active+1, transition);
    });
    $('.imagebar_indicators_circle').click(function() {
    	// get the number from the id
    	var clicked = $(this).attr('id');
    	clicked = parseInt(clicked.substring(26, clicked.length));
    	scrollTo(clicked, transition);
    });
	
    // start the timer that will cause the transition every so often
	timer = setInterval(function() {scrollTo((active + 1), transition)},frequency);
});

function scrollTo(i, animation)
{
	// reset the timer
    clearInterval(timer);
	
	if (i >= frames)
		i = 0;
	else if (i < 0)
		i = frames - 1;

	// animate to the next frame
	if (animation == 'fade') {
		$('.imagebar_window_slides').fadeOut(speed, null, function() {
			$('.imagebar_window_slides').animate({right:getPos(i)+'px'},0);
			$('.imagebar_window_slides').fadeIn(speed);
		});
	}
	else {
		$('.imagebar_window_slides').animate({right:getPos(i)+'px'},speed);
	}
	
	// make correct indicator light up
	$('#imagebar_indicators_circle'+active).attr('fill', '#ffffff');
	active = i;
	$('#imagebar_indicators_circle'+active).attr('fill', '#afafaf');

    timer = setInterval(function() {scrollTo((active + 1), transition)}, frequency);
}

// get the x coordinate of the given frame
function getPos(which)
{
	var pos = 0;
	for (i = 0; i < which; i++)
		pos = pos + parseInt($('#imagebar_window_slide'+which).css('width'));
	return pos;
}