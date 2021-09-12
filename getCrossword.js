// for the Newsday Crossword
function getCrossword(date)
{
	// Supply date "MMDDYYYY"
	// Oldest is 06/04/2017

	let M = date.slice(0, 2);
	let D = date.slice(2, 4);
	let Y = date.slice(4, 8);

	document.location.href = "https://cdn2.amuselabs.com/pmm/crossword?id=Creators_WEB_" + Y + M + D + "&set=creatorsweb&picker=date-picker";
}

getCrossword("");