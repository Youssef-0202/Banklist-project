"use strict";

// BANKIST APP

// Data
const account1 = {
  owner: "Ali Bahou",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-11-23T07:42:02.383Z",
    "2023-11-28T09:15:04.904Z",
    "2023-12-01T10:17:24.185Z",
    "2023-12-08T14:11:59.604Z",
    "2024-01-09T17:01:17.194Z",
    "2024-01-16T22:36:17.929Z",
    "2024-01-17T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Race James",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2023-08-01T13:15:33.035Z",
    "2023-09-15T09:48:16.867Z",
    "2023-09-25T06:04:23.907Z",
    "2023-10-25T14:18:46.235Z",
    "2023-11-05T16:33:06.386Z",
    "2023-12-10T14:43:26.374Z",
    "2024-01-16T18:49:59.371Z",
    "2024-01-17T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account3 = {
  owner: "Youssef Larabi",
  movements: [50, 300, -15, -700, -10, +1000, 8500, -30],
  interestRate: 0.5,
  pin: 3333,

  movementsDates: [
    "2023-08-01T13:15:33.035Z",
    "2023-09-15T09:48:16.867Z",
    "2023-09-25T06:04:23.907Z",
    "2023-10-25T14:18:46.235Z",
    "2023-11-05T16:33:06.386Z",
    "2023-12-13T14:43:26.374Z",
    "2024-01-16T18:49:59.371Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account4 = {
  owner: "Amine Adli",
  movements: [120, -50, 300, -15, 700, -10],
  interestRate: 2.5,
  pin: 4444,

  movementsDates: [
    "2023-08-01T13:15:33.035Z",
    "2023-09-15T09:48:16.867Z",
    "2023-09-25T06:04:23.907Z",
    "2023-10-25T14:18:46.235Z",
    "2023-11-05T16:33:06.386Z",
    "2023-12-13T14:43:26.374Z",
    "2024-01-16T18:49:59.371Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const accounts = [account1, account2, account3, account4];
let currentAccount,
  timer,
  sorted = false;
// Elements

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// methods

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}; // exemple: acc.owner = Youssef Ait bahssine => username = yab //
createUserName(accounts);

const formatMovementDate = function (date) {
  const calcDayspassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const dayspassed = calcDayspassed(new Date(), date);
  if (dayspassed === 0) return "today";
  else if (dayspassed === 1) return "Yesterday";
  else if (dayspassed <= 7) return `${dayspassed} days go`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    let displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, val) => acc + val);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  let interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, val) => acc + val);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updatUI = function (acc) {
  // display movements
  displayMovements(acc);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // display UI and message
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    // Create current date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = now.getHours();
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    // Clear the input fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updatUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receivreAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receivreAcc &&
    currentAccount.balance >= amount &&
    receivreAcc.username !== currentAccount.username
  ) {
    setTimeout(function () {
      // doint the transfert
      currentAccount.movements.push(-amount);
      receivreAcc.movements.push(amount);
      // add transfert date
      currentAccount.movementsDates.push(new Date().toISOString());
      receivreAcc.movementsDates.push(new Date().toISOString());
      // update UI
      updatUI(currentAccount);
    }, 2500);
  }
  // reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov > amount * 0.1)
  ) {
    setTimeout(function () {
      // add mov
      currentAccount.movements.push(amount);
      // add transfert date
      currentAccount.movementsDates.push(new Date().toISOString());
      // update UI
      updatUI(currentAccount);
    }, 2500);
    // reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => (acc.username = currentAccount.username)
    );
    const conf = confirm("did you want to delete this acount ? ");
    if (conf) {
      // delete account
      accounts.splice(index, 1);
      // logout
      containerApp.style.opacity = 0;
    }
  }
  inputCloseUsername.value = inputClosePin.value = "";
  labelWelcome.textContent = "Log in to get started";
});

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    // in each call,print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // when 0 s ,stop timer and log out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started `;
      containerApp.style.opacity = 0;
    }
    // decrese 1st
    time--;
  };
  // set time :
  let time = 65;
  // call the timer every seconde
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Over Balance :
// let accountMovements = accounts.map(acc => acc.movements ).flat();
// const Total_balance = accountMovements.reduce((acc,val) => acc+val,0) ;

// Convert NodeList (querySelectorAll) to a real array :
/*  labelBalance.addEventListener('click',function(){
   const movementsUI = Array.from(document.querySelectorAll('.movements__value'), ele => Number(ele.textContent.replace('€','')));
   console.log(movementsUI);
  });*/

// other application
// const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// console.log(movementsUI2);

// let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// let euroToUSD =1.1;
// let movementUSD= movements.map((mov) => mov * euroToUSD );

// Fake login
// currentAccount=account1;
// updatUI(currentAccount);
// containerApp.style.opacity=100;
