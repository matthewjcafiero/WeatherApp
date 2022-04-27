/* *** Script Overview *******************************************************
 * [search.js] holds helper functions for the "search" form and "curLoc" button 
 * in index.html.  These helper functions help clean up messy code in the html
 * file.
 * ************************************************************************** */

/* *** Functions ************************************************************ */

/** [locHelper()] is a helper function used by "search" and "curLoc" elements in
 *  index.html that clears the page displayed to the user in order to prepare it
 *  for new data to be presented.  */
function locHelper() {
  destroySuggestions();
  destroyForecasts();
  destroyData();
}