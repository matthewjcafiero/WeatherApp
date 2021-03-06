/* *** Script Overview *******************************************************
 * [actions.js] is a file which manages automatic interactions between the 
 * program and the running html executable.  Specifically, the functions 
 * [startAutoUpdate()] and [update()] allow the weather data of a given city to 
 * be updated every minute, providing the user with live weather data, by 
 * pressing the update data button on a timed interval.  This auto update 
 * feature can be toggled on and off using the "autoUpdate" button in the header
 * of index.html.  By default, upon loading of the site, auto update is on.
 * ************************************************************************** */

/* *** Global Variables ***************************************************** */

/** [run] is a boolean that controls whether or not the autoUpdate is running.  
 * It's value is determined by the "autouUpdate" button in index.html. */
var run = false;
/** [storeUpdate] stores the value returned by the call to setInterval().  */
var storeUpdate = undefined;

/* *** Functions ************************************************************ */

/** [update()] is a helper function for [autoUpdate()], which when called 
 * refreshes the data displayed on the page while maintaining the selected city
 * by clicking the "refreshData" buttton in index.html. */
 function update() {
  document.getElementById("refreshData").click();
}

/** [autoUpdate()], when called, checks the value of global variable [run].  
 * If [run] if false, this implies that auto update is not running, and 
 * therefore we start autoUpdate.  If [run] is true, this implies that auto 
 * update is already running, prompting us to end autoUpdate.  Both cases update
 * the innerHTML text of the "autoUpdate" button in index.html. */
function autoUpdate() {
  if (!run) {
    document.getElementById("autoUpdate").innerHTML = "Auto Update: On";
    run = true;
    storeUpdate = setInterval(update, 60000);
  } else {
    document.getElementById("autoUpdate").innerHTML = "Auto Update: Off";
    run = false;
    clearInterval(storeUpdate);
  }
}

/* *** Script ************************************************************ */

// This starts auto update automatically upon loading index.html.
autoUpdate();