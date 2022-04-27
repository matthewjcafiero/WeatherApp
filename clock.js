/* *** Script Overview *******************************************************
 * [clock.js] is a file which manages the main date and time data displayed in 
 * the "clock" element of index.html.  [getDate()] updates the "clock" element 
 * of index.html with the day and date at the time of call using a series of 
 * helper functions.  [getDate()] is automatically called upon the start of 
 * index.html, as well as called whenever the "refreshData" button is pressed.
 * ************************************************************************** */

/* *** Global Variables ***************************************************** */

/** [days[i]] represents the day of the week, given i's range is [0,6]. */
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
  "Saturday"];

/** [months[i]] represents the month of the yearr, given i's range is [1,12]. */
let months = [undefined, "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

/* *** Functions ************************************************************ */

/** [getDate()], when called, updates the innerHTML of the "clock" element in 
 * index.html with the current day and date at the time of call, in the format 
 * "Day, Month Date, Year". */
function getDate() {
  let date = new Date();
  document.getElementById("clock").innerHTML = "It is "
    + days[date.getDay()] + ", " + months[date.getMonth()] + " "
    + date.getDate() + ", " + date.getFullYear() + ".";
}

/* *** Script ************************************************************ */

//This calls [getDate()] upon the start of index.html
getDate();
