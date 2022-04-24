var run = false;
var autoUpdate = undefined;
//so in setInterval you cant put paratheses in the function name
function run() {
  if (!run) {
    document.getElementById.innerHTML = "Auto Update: On";
    autoUpdate = setInterval(myFunc, 60000);
  } else {
    document.getElementById.innerHTML = "Auto Update: Off";
    clearInterval(autoUpdate);
  }

}

function myFunc() {
  document.getElementById("refreshData").click();
}
