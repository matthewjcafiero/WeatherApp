/* *** Script Overview *******************************************************
 * [clock.js] is a file which manages the main date and time data displayed in 
 * the "clock" element of index.html.  [getDate()] updates the "clock" element 
 * of index.html with the day and date at the time of call using a series of 
 * helper functions.  [getDate()] is automatically called upon the start of 
 * index.html, as well as called whenever the "refreshData" button is pressed.
 * ************************************************************************** */

/* *** Functions ************************************************************ */

/** [dayConvert(num)] is a helper function for [getDate()] which takes in [num] 
 * where num's range is 0..6 and returns the day of the week [num] refers to, 
 * returning undefined for any invalid [num]. */
function dayConvert(num) {
  if (num == 0) { return "Sunday"; }
  else if (num == 1) { return "Monday"; }
  else if (num == 2) { return "Tuesday"; }
  else if (num == 3) { return "Wednesday"; }
  else if (num == 4) { return "Thursday"; }
  else if (num == 5) { return "Friday"; }
  else if (num == 6) { return "Saturday"; }
  return undefined;
}

/** [monthConvert(num)] is a helper function for [getDate()] which takes in 
 * [num] where num's ranges is 1..12 and returns the month [num] refers to, 
 * returning undefined for any invalid [num]. */
function monthConvert(num) {
  if (num == 1) { return "January"; }
  else if (num == 2) { return "February"; }
  else if (num == 3) { return "March"; }
  else if (num == 4) { return "April"; }
  else if (num == 5) { return "May"; }
  else if (num == 6) { return "June"; }
  else if (num == 7) { return "July"; }
  else if (num == 8) { return "August"; }
  else if (num == 9) { return "September"; }
  else if (num == 10) { return "October"; }
  else if (num == 11) { return "November"; }
  else if (num == 12) { return "December"; }
  return undefined;
}

/** [getDate()], when called, updates the innerHTML of the "clock" element in 
 * index.html with the current day and date at the time of call, in the format 
 * "Day, Month Date, Year". */
function getDate() {
  let date = new Date();
  document.getElementById("clock").innerHTML = "It is "
    + dayConvert(date.getDay()) + ", " + monthConvert(date.getMonth()) + " "
    + date.getDate() + ", " + date.getFullYear() + ".";
}

/* *** Script ************************************************************ */

//This calls [getDate()] upon the start of index.html
getDate();
