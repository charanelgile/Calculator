const initializeCalculatorApp = () => {
  let dateObj = new Date();
  let today = dateObj.getDay();
  let month = dateObj.getMonth();
  let date = dateObj.getDate();
  let year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();

  let btnSubmit = document.querySelector(".btnSubmit");

  // Get the nickname provided by the user upon submit
  btnSubmit.addEventListener("click", () => {
    let nickname = document.querySelector(".nickname").value;
    let greeting = document.querySelector(".greeting");
    let session = document.querySelector(".session");

    let formContainer = document.querySelector(".formContainer");
    let mainContainer = document.querySelector(".mainContainer");

    greeting.innerText = `Hello, ${nickname}`;

    formContainer.style.display = "none";
    mainContainer.style.visibility = "visible";

    session.innerText = `Session: ${determineToday(
      today
    )} - ${determineMonth(month)} ${date}, ${year} - ${determineHours(
      hours,
      minutes
    )}`;
  });
};

const determineToday = (today) => {
  switch (today) {
    case 0:
      today = "Sunday";
      break;
    case 1:
      today = "Monday";
      break;
    case 2:
      today = "Tuesday";
      break;
    case 3:
      today = "Wednesday";
      break;
    case 4:
      today = "Thursday";
      break;
    case 5:
      today = "Friday";
      break;
    case 6:
      today = "Saturday";
      break;
  }

  return today;
};

const determineMonth = (month) => {
  switch (month) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
  }

  return month;
};

const determineHours = (hours, minutes) => {
  let time = {
    hours,
    minutes,
    flagAMorPM: "AM",
  };

  if (hours > 12) {
    time.flagAMorPM = "PM";
  }

  switch (hours) {
    case 0:
      time.hours = "12";
      break;
    case 13:
      time.hours = "01";
      break;
    case 14:
      time.hours = "02";
      break;
    case 15:
      time.hours = "03";
      break;
    case 16:
      time.hours = "04";
      break;
    case 17:
      time.hours = "05";
      break;
    case 18:
      time.hours = "06";
      break;
    case 19:
      time.hours = "07";
      break;
    case 20:
      time.hours = "08";
      break;
    case 21:
      time.hours = "09";
      break;
    case 22:
      time.hours = "10";
      break;
    case 23:
      time.hours = "11";
      break;
  }

  return `${time.hours}:${time.minutes} ${time.flagAMorPM}`;
};

document.addEventListener("DOMContentLoaded", initializeCalculatorApp);
