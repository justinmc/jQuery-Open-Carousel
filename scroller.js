/***************************************************************************
 Side Scrolling Image Bar
 JavaScript Version
 Justin McCandless
 www.justinmccandless.com
 ***************************************************************************/

// Settings
var speed = 10				// speed to change frames
var speedReset = speed * 3		// faster speed to recycle to beginning/end
var frequency = 6 * 1000  		// how often frames change, milliseconds
var width = 900  			// width of each frame to scroll, pixels

// Initialize
var i = 0;


function scrollL(obj)
{
   i = i - speed
   var div = document.getElementById(obj)
   div.scrollLeft = i
   t1 = setTimeout("scrollL('" + obj + "')",10)
   if (!(i % 900))
      clearTimeout(t1)
   if (i < 0)
   {
      fastforward(obj)
      clearTimeout(t1)
   }
   clearInterval(t2)
   autoScroll(obj)
}

function scrollR(obj)
{
   i = i + speed
   var div = document.getElementById(obj)
   div.scrollLeft = i
   t1 = setTimeout("scrollR('" + obj + "')",10)
   if (!(i % width))
      clearTimeout(t1)
   if (i > (div.scrollWidth - width))
   {
      rewind(obj)
      clearTimeout(t1)
   }
   clearInterval(t2)
   autoScroll(obj)
}

function rewind(obj)
{
   i = i - (speedReset)
   var div = document.getElementById(obj)
   div.scrollLeft = i
   t3 = setTimeout("rewind('" + obj + "')",10)
   if (i <= 0) 
   {
      clearTimeout(t3)
	  i = 0
   }
}

function fastforward(obj)
{
	i = i + (speedReset)
   var div = document.getElementById(obj)
   div.scrollLeft = i
   t3 = setTimeout("fastforward('" + obj + "')",10)
   if (i > (div.scrollWidth - width))
   {
      clearTimeout(t3)
	  i = (div.scrollWidth - width)
   }
}

function autoScroll(obj)
{
   t2 = setInterval("scrollR('" + obj + "')",frequency);
}
