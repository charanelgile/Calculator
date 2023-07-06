const initializeCalculatorApp = () => {
  // Variables
  let dateObj = new Date();
  let today = dateObj.getDay();
  let month = dateObj.getMonth();
  let date = dateObj.getDate();
  let year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();

  let lblNickname = document.querySelector(".lblNickname");
  let nickname = document.querySelector(".nickname");

  let greeting = document.querySelector(".greeting");
  let session = document.querySelector(".session");

  let formContainer = document.querySelector(".formContainer");
  let mainContainer = document.querySelector(".mainContainer");

  let previousValue = document.querySelector(".prevValue");
  let currentValue = document.querySelector(".currValue");
  let newValue = 0;

  let newOperator = "";
  let newNumberInput = "";
  let newNumberFlag = false;

  let stringEquation = "";

  let currentEquation = [];
  let convertEquation = {};
  let historyEquations = [];

  let recentEquation = {};

  let calculateKeyPressed = false;

  let history = document.querySelector(".history");

  // Show the Calculator App, once a Nickname has been provided **********
  const btnSubmit = document.querySelector(".btnSubmit");
  btnSubmit.addEventListener("click", () => {
    // Check if the Nickname field is empty or not
    if (nickname.value === "") {
      lblNickname.innerText = "Please enter a nickname";
      lblNickname.style.color = "rgb(150, 65, 60)";
    } else {
      greeting.innerText = `Hello, ${nickname.value}`;

      formContainer.style.display = "none";
      mainContainer.style.visibility = "visible";
    }
  });

  // Get the Session Date & Time ************************************
  session.innerText = `Session: ${determineToday(
    today
  )} - ${determineMonth(month)} ${date}, ${year} - ${determineTime(
    hours,
    minutes
  )}`;

  // Numpad Mouse Click Handler **************************
  const numberKeys = document.querySelectorAll(".number");
  numberKeys.forEach((numKey) => {
    numKey.addEventListener("click", (event) => {
      newNumberInput = event.target.innerText;

      if (newNumberFlag) {
        currentValue.value = newNumberInput;
        newNumberFlag = false;
      } else {
        currentValue.value =
          currentValue.value == 0
            ? newNumberInput.trim()
            : `${currentValue.value}${newNumberInput}`;
      }

      if (calculateKeyPressed && newValue != currentValue.value) {
        // Append the result of the last Equation Sequence with a Divider
        // to indicate a New Set of Equation Sequence in the History Panel
        let result = document.createElement("p");
        result.innerText = `${newValue}\n============\n`;

        history.appendChild(result);
        previousValue.innerText = "";
        newNumberFlag = false;

        // Prevent repetitive appending of the last result and current value, including zero
        newValue = 0;
      }

      calculateKeyPressed = false;
    });
  });

  // Clear Keyboard Press Handler ******************
  document.addEventListener("keypress", (event) => {
    // Alternative for Clear
    // Windows: (Ctrl + Backspace)
    if (event.key === "Delete") {
      currentValue.value = 0;
      previousValue.innerText = "";

      newOperator = "";
      newNumberFlag = true;

      if (calculateKeyPressed || newValue != currentValue.value) {
        // Append the result of the last Equation Sequence with a Divider
        // to indicate a New Set of Equation Sequence in the History Panel
        let result = document.createElement("p");
        result.innerText = `${newValue}\n============\n`;

        history.appendChild(result);

        // Prevent repetitive appending of the last result and current value, including zero
        // when the Clear Key is pressed repeatedly
        newValue = 0;
      }

      stringEquation = "";
      currentEquation = [];
      convertEquation = {};
    }

    calculateKeyPressed = false;
  });

  // Clear & Clear All Mouse Click Handlers ***********************
  const clearKeys = document.querySelectorAll(".allClear, .clear");
  clearKeys.forEach((clrKey) => {
    clrKey.addEventListener("click", (event) => {
      currentValue.value = 0;
      previousValue.innerText = "";

      newOperator = "";
      newNumberFlag = true;

      if (calculateKeyPressed || newValue != currentValue.value) {
        // Append the result of the last Equation Sequence with a Divider
        // to indicate a New Set of Equation Sequence in the History Panel
        let result = document.createElement("p");
        result.innerText = `${newValue}\n============\n`;

        history.appendChild(result);

        // Prevent repetitive appending of the last result and current value, including zero
        // when the Clear Key is clicked repeatedly
        newValue = 0;
      }

      stringEquation = "";
      currentEquation = [];
      convertEquation = {};

      // console.log(historyEquations);

      if (event.target.classList.contains("allClear")) {
        historyEquations = [];
        history.innerHTML = "";

        // console.log(`Current Equation\n${currentEquation}`);
        // console.log(`All Time Equation\n${historyEquations}`);
      }

      calculateKeyPressed = false;
    });
  });

  // Delete Keyboard Press Handler ****************
  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 8) {
      // Slice the last item off the series of characters
      currentValue.value = currentValue.value.slice(0, -1);
    }

    if (currentValue.value === "") {
      currentValue.value = 0;
      previousValue.innerText = "";

      newOperator = "";
      newNumberFlag = true;

      if (calculateKeyPressed || newValue != currentValue.value) {
        // Append the result of the last Equation Sequence with a Divider
        // to indicate a New Set of Equation Sequence in the History Panel
        let result = document.createElement("p");
        result.innerText = `${newValue}\n============\n`;

        history.appendChild(result);

        // Prevent repetitive appending of the last result and current value, including zero
        // when the Delete Key is pressed repeatedly
        newValue = 0;
      }

      stringEquation = "";
      currentEquation = [];
      convertEquation = {};
    }

    calculateKeyPressed = false;
  });

  // Delete Mouse Click Handler **********************
  const deleteKey = document.querySelector(".delete");
  deleteKey.addEventListener("click", () => {
    // Slice the last item off the series of characters
    currentValue.value = currentValue.value.slice(0, -1);

    if (currentValue.value === "") {
      currentValue.value = 0;
      previousValue.innerText = "";

      newOperator = "";
      newNumberFlag = true;

      if (calculateKeyPressed || newValue != currentValue.value) {
        // Append the result of the last Equation Sequence with a Divider
        // to indicate a New Set of Equation Sequence in the History Panel
        let result = document.createElement("p");
        result.innerText = `${newValue}\n============\n`;

        history.appendChild(result);

        // Prevent repetitive appending of the last result and current value, including zero
        // when the Delete Key is clicked repeatedly
        newValue = 0;
      }

      stringEquation = "";
      currentEquation = [];
      convertEquation = {};
    }

    calculateKeyPressed = false;
  });

  // Change Sign Mouse Click Handler *************************
  const changeSignKey = document.querySelector(".changeSign");
  changeSignKey.addEventListener("click", () => {
    // Ensure the series of characters is a number with parseFloat()
    // Multiply by -1 to achieve the Positive to Negative switch, and vice versa
    currentValue.value = parseFloat(currentValue.value) * -1;

    calculateKeyPressed = false;
  });

  // Operator Keys Handler ***********************************
  const operatorKeys = document.querySelectorAll(".operator");
  operatorKeys.forEach((oprtrKey) => {
    oprtrKey.addEventListener("click", (event) => {
      // Cleanup the Current Equation Array everytime a New Operator is selected
      if (newNumberFlag) {
        currentEquation = [];

        calculateKeyPressed = false;
      }

      newOperator = event.target.innerText;

      // Return last value or number, when an operator key is clicked without a first number
      if (!currentEquation.length && currentValue.value == 0) return;

      // Begin a new operation
      if (!currentEquation.length) {
        // Store the First Number and Operator into Current Equation Array
        currentEquation.push(currentValue.value, newOperator);
        previousValue.innerText = `${currentValue.value} ${newOperator}`;
        // Replace the number on the input box to avoid accidental concatination
        return (newNumberFlag = true);
      }

      // Complete the operation
      if (currentEquation.length) {
        // Store the Second Number into Current Equation Array
        currentEquation.push(currentValue.value);

        // Convert the Current Equation Array into an Object
        convertEquation = {
          fnum: parseFloat(currentEquation[0]),
          oper: currentEquation[1],
          snum: parseFloat(currentEquation[2]),
        };

        // Store the Converted Equation into the History of Equations
        historyEquations.push(convertEquation);

        // Concatinate the Equation into a single String
        stringEquation = `${convertEquation["fnum"]} ${convertEquation["oper"]} ${convertEquation["snum"]}`;

        // Calculate the New Value to be displayed
        newValue = calculate(stringEquation, currentValue);

        previousValue.innerText = `${newValue} ${newOperator}`;

        // Continuous operation using the result of the previous equation
        currentEquation = [newValue, newOperator];
        newNumberFlag = true;

        // Append the Recent Equation to the History Panel
        let previousEquation = document.createElement("p");
        previousEquation.innerText = `${convertEquation.fnum}\n${convertEquation.oper} ${convertEquation.snum}\n------------`;

        history.appendChild(previousEquation);

        // console.log(stringEquation);
        // console.log(currentEquation);
        // console.log(convertEquation);
        // console.log(historyEquations);
      }

      calculateKeyPressed = false;
    });
  });

  // Calculate Key Handler *********************************
  const calculateKey = document.querySelector(".calculate");
  calculateKey.addEventListener("click", () => {
    // Continuous evaluation when the calculate key is clicked repeatedly
    if (!currentEquation.length && historyEquations.length) {
      // When there is no Current Equation, but there is one historically stored, get the Recent Equation from the History of Equations
      recentEquation = historyEquations[historyEquations.length - 1];

      // Combine the Recent Equation and Current Value into one Object
      convertEquation = {
        fnum: parseFloat(currentValue.value),
        oper: recentEquation.oper,
        snum: recentEquation.snum,
      };
    } else if (!currentEquation.length) {
      return currentValue.value;
    } else {
      // Store the Second Number into Current Equation Array
      currentEquation.push(currentValue.value);

      // Convert the Current Equation Array into an Object
      convertEquation = {
        fnum: parseFloat(currentEquation[0]),
        oper: currentEquation[1],
        snum: parseFloat(currentEquation[2]),
      };
    }

    // Store the Converted Equation into the History of Equations
    historyEquations.push(convertEquation);

    // Concatinate the Equation into a single String
    stringEquation = `${convertEquation["fnum"]} ${convertEquation["oper"]} ${convertEquation["snum"]}`;

    // Calculate the New Value to be displayed
    newValue = calculate(stringEquation, currentValue);

    previousValue.innerText = `${stringEquation} =`;

    currentEquation = [];
    newNumberFlag = true;

    // Append the Recent Equation to the History Panel
    let previousEquation = document.createElement("p");
    previousEquation.innerText = `${convertEquation.fnum}\n${convertEquation.oper} ${convertEquation.snum}\n------------`;

    history.appendChild(previousEquation);

    calculateKeyPressed = true;

    // console.log(stringEquation);
    // console.log(currentEquation);
    // console.log(convertEquation);
    // console.log(historyEquations);
  });

  // Close the Calculator App *************************
  const btnClose = document.querySelector(".btnClose");
  btnClose.addEventListener("click", () => {
    lblNickname.innerText = "Enter your nickname:";
    lblNickname.style.color = "black";
    nickname.value = "";

    greeting.innerText = "";
    session.innerText = "";

    previousValue.innerText = "";
    currentValue.value = 0;
    newValue = 0;

    newOperator = "";
    newNumberInput = "";
    newNumberFlag = false;

    stringEquation = "";

    currentEquation = [];
    convertEquation = {};
    historyEquations = [];

    recentEquation = {};

    history.innerHTML = "";

    formContainer.style.display = "flex";
    mainContainer.style.visibility = "hidden";
  });

  // -------------------------------------------------------------------

  // Numpad Keyboard Press Handler
  document.addEventListener("keypress", (event) => {
    if (Number(event.key) >= 0 || Number(event.key) <= 9) {
      if (newNumberFlag) {
        currentValue.value = event.key;
        newNumberFlag = false;
      } else {
        currentValue.value =
          currentValue.value == 0
            ? event.key.trim()
            : `${currentValue.value}${event.key}`;
      }

      if (calculateKeyPressed && newValue != currentValue.value) {
        // Append the result of the last Equation Sequence with a Divider
        // to indicate a New Set of Equation Sequence in the History Panel
        let result = document.createElement("p");
        result.innerText = `${newValue}\n============\n`;

        history.appendChild(result);
        previousValue.innerText = "";
        newNumberFlag = false;

        // Prevent repetitive appending of the last result and current value, including zero
        newValue = 0;
      }

      calculateKeyPressed = false;
    }
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

const determineTime = (hours, minutes) => {
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
    case 1:
    case 13:
      time.hours = "01";
      break;
    case 2:
    case 14:
      time.hours = "02";
      break;
    case 3:
    case 15:
      time.hours = "03";
      break;
    case 4:
    case 16:
      time.hours = "04";
      break;
    case 5:
    case 17:
      time.hours = "05";
      break;
    case 6:
    case 18:
      time.hours = "06";
      break;
    case 7:
    case 19:
      time.hours = "07";
      break;
    case 8:
    case 20:
      time.hours = "08";
      break;
    case 9:
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

  switch (minutes) {
    case 0:
      time.minutes = "00";
      break;
    case 1:
      time.minutes = "01";
      break;
    case 2:
      time.minutes = "02";
      break;
    case 3:
      time.minutes = "03";
      break;
    case 4:
      time.minutes = "04";
      break;
    case 5:
      time.minutes = "05";
      break;
    case 6:
      time.minutes = "06";
      break;
    case 7:
      time.minutes = "07";
      break;
    case 8:
      time.minutes = "08";
      break;
    case 9:
      time.minutes = "09";
      break;
  }

  return `${time.hours}:${time.minutes} ${time.flagAMorPM}`;
};

const calculate = (stringEquation, currentValue) => {
  const regex = /(^[*/=])|(\s)/g;

  stringEquation.replace(regex, "");

  const divisionByZero = /(\/0)/.test(stringEquation);
  // console.log(divisionByZero);

  if (divisionByZero) return (currentValue.value = 0);

  if (isNaN(currentValue.value)) {
    currentValue.value = 0;
  }

  currentValue.value = eval(stringEquation);

  return currentValue.value === "Infinity"
    ? (currentValue.value = 0) // Return 0 when any number is divided by Zero ...
    : currentValue.value; // ... Otherwise, return the result of the evaluated equation
};

document.addEventListener("DOMContentLoaded", initializeCalculatorApp);
