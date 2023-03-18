"use strict";

/////////////////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////////////////

const accounts = [
	{
		owner: "Marufur Rahman",
		movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
		interestRate: 1.5, // %
		password: 1234,
		// movementsDates: [
		//   "2021-11-18T21:31:17.178Z",
		//   "2021-12-23T07:42:02.383Z",
		//   "2022-01-28T09:15:04.904Z",
		//   "2022-04-01T10:17:24.185Z",
		//   "2022-07-08T14:11:59.604Z",
		//   "2022-09-18T17:01:17.194Z",
		//   "2022-09-21T23:36:17.929Z",
		//   "2022-09-25T12:51:31.398Z",
		//   "2022-09-28T06:41:26.190Z",
		//   "2022-09-29T08:11:36.678Z",
		// ],
		// currency: "USD",
		// locale: "en-US",
	},
	{
		owner: "Bakibillah Rohan",
		movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
		interestRate: 1.3, // %
		password: 5678,
		// movementsDates: [
		//   "2021-12-11T21:31:17.671Z",
		//   "2021-12-27T07:42:02.184Z",
		//   "2022-01-05T09:15:04.805Z",
		//   "2022-02-14T10:17:24.687Z",
		//   "2022-03-12T14:11:59.203Z",
		//   "2022-05-19T17:01:17.392Z",
		//   "2022-08-22T23:36:17.522Z",
		//   "2022-09-25T12:51:31.491Z",
		//   "2022-09-28T06:41:26.394Z",
		//   "2022-09-29T08:11:36.276Z",
		// ],
		// currency: "EUR",
		// locale: "en-GB",
	},
];

/////////////////////////////////////////////////////////////
// Elements
/////////////////////////////////////////////////////////////

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balanceValue");
const labelSumIn = document.querySelector(".summaryValueIn");
const labelSumOut = document.querySelector(".summaryValueOut");
const labelSumInterest = document.querySelector(".summaryValueInterest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".loginBtn");
const btnTransfer = document.querySelector(".formBtnTransfer");
const btnLoan = document.querySelector(".formBtnLoan");
const btnClose = document.querySelector(".formBtnClose");
const btnSort = document.querySelector(".btnSort");

const inputLoginUsername = document.querySelector(".loginInputUsername");
const inputLoginPassword = document.querySelector(".loginInputPassword");
const inputTransferTo = document.querySelector(".formInputTo");
const inputTransferAmount = document.querySelector(".formInputAmount");
const inputLoanAmount = document.querySelector(".formLoanAmount");
const inputCloseUsername = document.querySelector(".formInputUsername");
const inputClosePassword = document.querySelector(".formInputPassword");

// update UI===========================================================
function updateUI(currentAccount) {
	displayMovements(currentAccount);
	displaySummary(currentAccount);
	displayBalance(currentAccount);
}

//  Movements here ======================================================

function displayMovements(account, sort = false) {
	containerMovements.innerHTML = "";

	const moves = sort
		? account.movements.slice(0).sort((a, b) => a - b)
		: account.movements;
	moves.forEach((move, i) => {
		// console.log(move);
		const type = move > 0 ? "Deposit" : "Withdrawal";
		const html = `<div class="movementsRow">
		<div class="movementType movementType${type}">${i + 1} ${type}</div>
		<div class="movementsDate">5 Days ago</div>
		<div class="movementValue">${move}$</div>
		</div>`;

		containerMovements.insertAdjacentHTML("afterbegin", html);
	});
}

//  Summary here =======================================================

function displaySummary(account) {
	// Income
	const income = account.movements
		.filter((move) => move > 0)
		.reduce((acc, deposit) => acc + deposit, 0);
	labelSumIn.textContent = `${income}$`;
	// Outcome
	const outcome = account.movements
		.filter((move) => move < 0)
		.reduce((acc, withdrawal) => acc + withdrawal, 0);
	labelSumOut.textContent = `${Math.abs(outcome)}$`;
	// Interest
	const interest = account.movements
		.filter((move) => move > 0)
		.map((deposit) => (deposit * account.interestRate) / 100)
		.filter((interest) => interest >= 1)
		.reduce((acc, interest) => acc + interest);
	labelSumInterest.textContent = `${interest}$`;
}

// Balance =============================================================

function displayBalance(account) {
	account.balance = account.movements.reduce((acc, move) => acc + move, 0);
	labelBalance.textContent = `${account.balance}$`;
}

// Username ============================================================

function createUser(accounts) {
	accounts.forEach((account) => {
		account.userName = account.owner
			.toLowerCase()
			.split(" ")
			.map((word) => word.at(0))
			.join("");
		// console.log(account.userName);
	});
}
createUser(accounts);

// Login user ===========================================================

let currentAccount;

btnLogin.addEventListener("click", function (e) {
	e.preventDefault();

	currentAccount = accounts.find(
		(account) => account.userName === inputLoginUsername.value,
	);

	if (currentAccount.password === Number(inputLoginPassword.value)) {
		// Display UI and welcome user
		labelWelcome.textContent = `Welcome back, ${currentAccount.owner
			.split(" ")
			.at(0)}`;
		containerApp.style.opacity = 1;

		// update UI ________
		updateUI(currentAccount);
	} else {
		// Hide UI and wrong pass
		labelWelcome.textContent = `Login Failed!`;
		containerApp.style.opacity = 0;
	}

	// clear field
	inputLoginPassword.value = inputLoginUsername.value = "";
	inputLoginPassword.blur();
});

// Transfer balance ===================================================

btnTransfer.addEventListener("click", function (e) {
	e.preventDefault();

	const receiverUser = accounts.find(
		(account) => account.userName === inputTransferTo.value,
	);
	const amount = Number(inputTransferAmount.value);

	// clear field
	inputTransferTo.value = inputTransferAmount.value = "";
	inputTransferAmount.blur();

	if (
		amount > 0 &&
		amount <= currentAccount.balance &&
		currentAccount.userName !== receiverUser.userName &&
		receiverUser
	) {
		// Transfer Money
		currentAccount.movements.push(-amount);
		receiverUser.movements.push(amount);

		// Update UI
		updateUI(currentAccount);

		// show massage
		labelWelcome.textContent = `Transaction Successful to ${receiverUser.userName}`;
	} else {
		labelWelcome.textContent = `Transaction Failed`;
	}
});

// Loan Amount=======================================================================

btnLoan.addEventListener("click", function (e) {
	e.preventDefault();

	const amount = Number(inputLoanAmount.value);
	if (
		amount > 0 &&
		currentAccount.movements.some((move) => move >= amount * 0.1)
	) {
		// add loan in current balance
		currentAccount.movements.push(amount);
		// update ui
		updateUI(currentAccount);
		// message
		labelWelcome.textContent = `Loan Successfully `;
	} else {
		labelWelcome.textContent = `Loan Failed `;
	}

	inputLoanAmount.value = "";
	inputLoanAmount.blur();
});

// close account ====================================================================

btnClose.addEventListener("click", function (e) {
	e.preventDefault();

	if (
		currentAccount.userName === inputCloseUsername.value &&
		currentAccount.password === Number(inputClosePassword.value)
	) {
		const index = accounts.findIndex(
			(account) => account.userName === currentAccount.userName,
		);

		// hide ui
		containerApp.style.opacity = 0;

		// delete
		accounts.splice(index, 1);

		labelWelcome.textContent = "Account delete";
	} else {
		labelWelcome.textContent = "delete can not be done";
	}

	//clear field
	inputCloseUsername.value = inputClosePassword.value = "";
	inputClosePassword.blur();
});

// sorted ===========================================================================

let sortedMove = false;

btnSort.addEventListener("click", function (e) {
	e.preventDefault();

	displayMovements(currentAccount, !sortedMove);
	sortedMove = !sortedMove;
});
