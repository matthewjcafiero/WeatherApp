function getDate() {
  let date = new Date();
  document.getElementById("clock").innerHTML = "It is " + dayConvert(date.getDay())
    + ", " + monthConvert(date.getMonth()) + " " + date.getDate() + ", " + date.getFullYear() + ".";
}
getDate();

function dayConvert(num) {
  if (num == 0) {
    return "Sunday";
  }
  else if (num == 1) {
    return "Monday";
  }
  else if (num == 2) {
    return "Tuesday";
  }
  else if (num == 3) {
    return "Wednesday";
  }
  else if (num == 4) {
    return "Thursday";
  }
  else if (num == 5) {
    return "Friday";
  }
  else if (num == 6) {
    return "Saturday";
  }
}

function monthConvert(num) {
  if (num == 1) {
    return "January";
  }
  else if (num == 2) {
    return "February";
  }
  else if (num == 3) {
    return "March";
  }
  else if (num == 4) {
    return "April";
  }
  else if (num == 5) {
    return "May";
  }
  else if (num == 6) {
    return "June";
  }
  else if (num == 7) {
    return "July";
  }
  else if (num == 8) {
    return "August";
  }
  else if (num == 9) {
    return "September";
  }
  else if (num == 10) {
    return "October";
  }
  else if (num == 11) {
    return "November";
  }
  else if (num == 12) {
    return "December";
  }
}


