const initializeCalculatorApp = () => {
  // Session Date & Time Variables
  let dateObj = new Date();
  let today = dateObj.getDay();
  let month = dateObj.getMonth();
  let date = dateObj.getDate();
  let year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();

  let previousValue = document.querySelector(".prevValue");
  let currentValue = document.querySelector(".currValue");
  let history = document.querySelector(".history");

  let itemsArr = [];
  let equationArr = [];

  let newNumberFlag = false;

  // Display the nickname provided by the user and the session date and time
  const btnSubmit = document.querySelector(".btnSubmit");
  btnSubmit.addEventListener("click", () => {
    let nickname = document.querySelector(".nickname").value;
    let lblNickname = document.querySelector(".lblNickname");
    let session = document.querySelector(".session");

    // Check if the nickname field is empty or not
    checkNickname(nickname, lblNickname);

    session.innerText = `Session: ${determineToday(today)} - ${determineMonth(
      month
    )} ${date}, ${year} - ${determineTime(hours, minutes)}`;
  });

  // Numpad Press Handler
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
    }
  });

  // Numpad Click Handler
  const numberKeys = document.querySelectorAll(".number");
  numberKeys.forEach((key) => {
    key.addEventListener("click", (event) => {
      const newInput = event.target.innerText;

      if (newNumberFlag) {
        currentValue.value = newInput;
        newNumberFlag = false;
      } else {
        currentValue.value =
          currentValue.value == 0
            ? newInput.trim()
            : `${currentValue.value}${newInput}`;
      }
    });
  });

  // Clear Press Handler
  document.addEventListener("keypress", (event) => {
    // Alternative for Clear
    if (event.key === "Delete") {
      currentValue.value = 0;
    }
  });

  // Clear / Clear All Click Handler
  const clearKeys = document.querySelectorAll(".allClear, .clear");
  clearKeys.forEach((key) => {
    key.addEventListener("click", (event) => {
      currentValue.value = 0;

      if (event.target.classList.contains("allClear")) {
        previousValue.innerText = "";
        itemsArr = [];
      }
    });
  });

  // Delete Press Handler
  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 8) {
      currentValue.value = currentValue.value.slice(0, -1);
    }
  });

  // Delete Click Handler
  const deleteKey = document.querySelector(".delete");
  deleteKey.addEventListener("click", () => {
    // Slice the last item off the series of characters
    currentValue.value = currentValue.value.slice(0, -1);
  });

  // Sign Change Key Handler
  const changeSignKey = document.querySelector(".changeSign");
  changeSignKey.addEventListener("click", () => {
    // Ensure the series of characters is a number with parseFloat()
    // Multiply by -1 to achieve the Negative Sign
    currentValue.value = parseFloat(currentValue.value) * -1;
  });

  // Operator Keys Handler
  const operatorKeys = document.querySelectorAll(".operator");
  operatorKeys.forEach((key) => {
    key.addEventListener("click", (event) => {
      // Replace the result on the input box (when an operation was just evaluated)
      // upon click of a new number key
      if (newNumberFlag) {
        previousValue.innerText = "";
        itemsArr = [];
      }

      const newOperator = event.target.innerText;
      const currentVal = currentValue.value;

      // Return last value or number, when an operator key is clicked without a first number
      if (!itemsArr.length && currentVal == 0) return;

      // Begin a new operation
      if (!itemsArr.length) {
        itemsArr.push(currentVal, newOperator); // First Number and Operator
        previousValue.innerText = `${currentVal} ${newOperator}`;
        // Replace the number on the input box to avoid accidental concatination
        return (newNumberFlag = true);
      }

      // Complete the operation
      if (itemsArr.length) {
        itemsArr.push(currentVal); // Second Number

        // Equation - Recent
        const equationObj = {
          num1: parseFloat(itemsArr[0]),
          num2: parseFloat(currentVal),
          oper: itemsArr[1],
        };

        // Equations - Historical
        equationArr.push(equationObj);

        // Equation - Concatinated
        const equationStr = `${equationObj["num1"]} ${equationObj["oper"]} ${equationObj["num2"]}`;

        const newValue = calculate(equationStr, currentValue);

        previousValue.innerText = `${newValue} ${newOperator}`;

        // Continuous operation using the result of the previous equation
        itemsArr = [newValue, newOperator];
        newNumberFlag = true;
        // console.log(equationArr);

        // Append to History Panel
        let lastEquation = document.createElement("p");

        lastEquation.innerText = `${equationArr.at(-1).num1}\n${
          equationArr.at(-1).oper
        } ${equationArr.at(-1).num2}\n--------`;

        history.appendChild(lastEquation);
      }
    });
  });

  // Calculate Key Handler
  const calculateKey = document.querySelector(".calculate");
  calculateKey.addEventListener("click", () => {
    const currentVal = currentValue.value;

    let equationObj;

    // Continuous operation when the calculate key is clicked repeatedly
    if (!itemsArr.length && equationArr.length) {
      const lastEquation = equationArr[equationArr.length - 1];

      equationObj = {
        num1: parseFloat(currentVal),
        num2: lastEquation.num2,
        oper: lastEquation.oper,
      };
    } else if (!itemsArr.length) {
      return currentVal;
    } else {
      itemsArr.push(currentVal);

      // Equation - Recent
      equationObj = {
        num1: parseFloat(itemsArr[0]),
        num2: parseFloat(currentVal),
        oper: itemsArr[1],
      };
    }

    // Equations - Historical
    equationArr.push(equationObj);

    // Equation - Concatinated
    const equationStr = `${equationObj["num1"]} ${equationObj["oper"]} ${equationObj["num2"]}`;

    calculate(equationStr, currentValue);

    previousValue.innerText = `${equationStr} =`;

    itemsArr = [];
    newNumberFlag = true;
    // console.log(equationArr);

    // Append to History Panel
    let lastEquation = document.createElement("p");

    lastEquation.innerText = `${equationArr.at(-1).num1}\n${
      equationArr.at(-1).oper
    } ${equationArr.at(-1).num2}\n--------`;

    history.appendChild(lastEquation);
  });
};

const checkNickname = (nickname, lblNickname) => {
  if (nickname) {
    let greeting = document.querySelector(".greeting");
    let formContainer = document.querySelector(".formContainer");
    let mainContainer = document.querySelector(".mainContainer");

    greeting.innerText = `Hello, ${nickname}`;

    formContainer.style.display = "none";
    mainContainer.style.visibility = "visible";
  } else {
    lblNickname.innerText = "Please enter a nickname";
    lblNickname.style.color = "rgb(150, 65, 60)";
  }
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

const calculate = (equation, currentValue) => {
  const regex = /(^[*/=])|(\s)/g;

  equation.replace(regex, "");

  const divisionByZero = /(\/0)/.test(equation);

  // Return 0 when any number is divided by Zero
  if (divisionByZero) return (currentValue.value = 0);

  // Otherwise, return the result of the evaluated equation
  return (currentValue.value = eval(equation));
};

document.addEventListener("DOMContentLoaded", initializeCalculatorApp);
