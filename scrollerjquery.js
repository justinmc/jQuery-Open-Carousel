/***************************************************************************
 Side Scrolling Image Bar
 jQuery Version
 Justin McCandless
 www.justinmccandless.com
***************************************************************************/

// Settings
var speedJQ = 1.5 * 1000;			// how long each transition is, milliseconds
var frequencyJQ = 6 * 1000;  		// how often framesJQ change, milliseconds
var widthJQ = 900;  			// widthJQ of each frame to scroll, pixels
var framesJQ = 3;				// how many total framesJQ there are to scroll

// Initialize
var posJQ = 0;

$(document).ready(
function()
{
    $(".left").bind('click',scrollLeft);
    $(".right").bind('click',scrollRight);
}
);

timer = setInterval("scrollRight()",frequencyJQ);

function scrollLeft()
{
    if (posJQ > 0) // scroll left if you can
    {
       	$(".scrollerJQ").animate({right:(posJQ-widthJQ)+"px"},speedJQ);
	posJQ = posJQ - widthJQ;
    }
    else // otherwise go to the last frame
    {
	$(".scrollerJQ").animate({right:(widthJQ*(framesJQ-1))+"px"},speedJQ);
	posJQ = widthJQ * (framesJQ - 1);
    }
    // reset the timer
    clearInterval(timer);
    timer = setInterval("scrollRight()",frequencyJQ);
}

function scrollRight()
{
    if (posJQ < widthJQ * (framesJQ - 1)) // scroll right if you can
    {
	$(".scrollerJQ").animate({right:(posJQ+widthJQ)+"px"},speedJQ);
	posJQ = posJQ + widthJQ;
    }
    else // otherwise go to the first frame
    {
	$(".scrollerJQ").animate({right:"0px"},speedJQ);
	posJQ = 0;
    }
    // reset the timer
    clearInterval(timer);
    timer = setInterval("scrollRight()",frequencyJQ);
}
