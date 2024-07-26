const inputSlider = document.querySelector(".slider");
const length = document.querySelector("[data-length]");
const passDisplay = document.querySelector("[password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copymsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("[generateButton]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//Initial Values

let password = "";
let passwordlength = 10;
let checkCount = 0;
handleSlider();
setindicator("#ccc");

// Functions

// set password length according to the slider
function handleSlider() {
  inputSlider.value = passwordlength;
  length.innerText = passwordlength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordlength - min) * 100) / (max - min) + "% 100%";
}

function setindicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.Checked) hasUpper = true;
  if (lowercaseCheck.Checked) hasLower = true;
  if (hasNum.checked) hasNum = true;
  if (hasSym.checked) hasSym = true;

  if (hasUpper && hasLower(hasNum || hasSym) && passwordlength >= 8) {
    setindicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordlength >= 6
  ) {
    setindicator("#ff0");
  } else {
    setindicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passDisplay.value);
    copymsg.innerHTML = "copied";
  } catch (err) {
    copymsg.innerHTML = "Failed";
  }

  copymsg.classList.add("active");

  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passDisplay.value) copyContent();
});

function CheckChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", CheckChange);
});

//Fisher Yates Method
function shuffledPass(pass) {
  console.log("Inside shuffle");
  for (let i = pass.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pass[i];
    pass[i] = pass[j];
    pass[j] = temp;
  }
  let str = "";
  pass.forEach((val) => (str += val));
  return str;
}

generateBtn.addEventListener("click", () => {
  //No checkbox is selected
  console.log("Start");
  if (checkCount <= 0) return;

  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }

  //New password
  password = "";
  //Insert checkbox content
  // if (uppercaseCheck.Checked) {
  //   password += generateUpperCase();
  // }
  // if (lowercaseCheck.Checked) {
  //   password += generateLowerCase();
  // }
  // if (numbersCheck.Checked) {
  //   password += generateRandomNumber();
  // }
  // if (symbolsCheck.Checked) {
  //   password += generateSymbols();
  // }

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbols);

  //Rquired
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log("Rquired add");

  //Additional
  for (let i = 0; i < passwordlength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  console.log("Additional add");

  //Password Shuffle
  password = shuffledPass(Array.from(password));
  console.log("shuffle done");

  //Display
  passDisplay.value = password;

  //Strength Calculate
  calcStrength();
});
