# Weather Me Up Buttercup
By Matthew Cafiero


*** About ***

Weather Me Up Buttercup is a weather application created by Matthew Cafiero that
will display current weather conditions as well as a serious of forecasts for a
given location inputed by the user.  This location can either be inputed by
name, or the user can use their current location if they given such permissions.
Locations are obtained via use of the OpenWeather's Geocoding API, and weather
conditions and data are obtained via use of OpenWeather's One Call API.  Links
to the API docs can be found below:

OpenWeather's Geocoding API: https://openweathermap.org/api/geocoding-api#direct
OpenWeather's One Call API: https://openweathermap.org/api/one-call-api

NOTE: The name "Weather Me Up Buttercup" is a play on words of the song "Build
Me Up Buttercup."  I was listening to this song when I first started this 
project, and I thought it a fun name for it.


*** Process ***

A basic run down of how this program works; the user provides a location, either
by name or by current location.  If by name, the Geocoding API searches for
locations with said names, returning 1 or more locations if valid matches can be
found.  If there are more than one match, the user is prompted to select from a 
select list of results.  This allows them to select a location.  If there was
only 1 location returned, or if current location was used, the location is
selected automatically.  If no matches are found, the user is prompted to enter
a different location.

Now that we have a location selected, we use latitude and longitude to call to
the One Call API, which returns a data structure of weather data about current
conditions for said location as well as forecast data.  This data is then 
written to index.html in order to be displayed to the user.  

Other features of the program include automatic updating of a city's weather
data on 1 minute intervals and updating the site tab to display weather data for
ease of use for users when on other sites.

NOTE: Current Location calls seem to take longer than inputted calls, so please
wait for data to load.


*** How to Run ***

To run this program, ensure that the following files are downloaded to your pc 
in a shared folder:

  "index.html"  
  "generalStyle.css"
  "clock.js"
  "data.js"
  "actions.js"

Then, run index.html, which will run the program accordingly in your default
browser.


*** My Reflections on this Project ***

I thought this was a great learning experience for me on HTML, CSS (just a bit),
and JavaScript.  I have had no experience with HTML, and found it to be a really
interesting language to work with that feels really different than anything I
have had experence with before.  I really enjoyed teaching myself it as I went
along, and would like to work more with HTML in the future.  I won't speak much
in regards to CSS as I did very little CSS work on this project, however I can
see how powerful CSS can be based on my experience with is here.  Finally, in
terms of JavaScript, I had worked with TypeScript before at a previous 
internship, but had never built my own project from scratch in JS, and I really
enjoyed learning about many different features  I taught myself and implemented 
(for example; date objects, intervals, promises, etc).  I am walking away from 
this project excited to learn more and build my skills even further.

In terms of the project itself; I am proud of what I was able to put together in
a few days.  Some features I am particularly proud of are the multiple 
suggestions for locations and auto updating data, as they combine multiple HTML
and JS features to come together into one feature.  I would've loved to 
implement more advanced features, such as forecasting maps or this cool idea I
had for a feature which when given a destination would provide a driving route
that had weather updates implemented within it (so you could see when on a drive
rain would start for example), however these were outside the potential scope
given the amount of time of this project.  Further, I would've loved to learn
more and implement more advance CSS features.  Nonetheless, I am proud of what
I accomplished, what I learned, and how this project can serve as a stepping
stone towards more complicated projects in the future.  