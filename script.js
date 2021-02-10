'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Hamza Laroussi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (account, sort) => {
  containerMovements.innerHTML = ''; // empty the container

  const movements = sort
    ? account.movements.slice().sort((a, b) => {
      return a - b;
    })
    : account.movements;

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = account => {
  account.balance = account.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};

const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => {
      return acc - cur;
    }, 0);
  labelSumOut.textContent = `${out.toFixed(2)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsername = accounts => {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);

const updateUI = currentAccount => {
  displayMovements(currentAccount);
  calcPrintBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};
// event handler
let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); // to make the field lose it's focus when you login

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  console.log('transfer started');
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
    console.log('Transfer valid');
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  const accOwner = inputCloseUsername.value;
  const accOwnerPin = inputClosePin.value;

  if (
    accOwner === currentAccount?.username &&
    Number(accOwnerPin) === currentAccount?.pin
  ) {
    console.log(
      'account matched: ' +
      accOwner +
      ' : ' +
      currentAccount?.username +
      ' : ' +
      accOwnerPin +
      ' : ' +
      currentAccount?.pin
    );

    console.log(
      'account matched: ' +
      accOwner +
      ' : ' +
      currentAccount?.username +
      ' : ' +
      accOwnerPin +
      ' : ' +
      currentAccount?.pin
    );

    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(accounts);

    accounts.splice(index, 1);
    console.log(accounts);

    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposit = movements.filter(mov => {
  return mov > 0;
});

const withdrawal = movements.filter(mov => {
  return mov < 0;
});

const max = movements => {
  let maxAmount = movements.reduce((acc, cur) => {
    if (acc > cur) {
      return acc;
    } else return cur;
  }, movements[0]);
  return maxAmount;
};

const overallBalance = accounts
  .map(acc => acc.movements) // both map and flat can be replaced by .flatmap()
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

//console.log(max(account1.movements));

const eurToUsd = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

//console.log(totalDepositsUSD);

/////////////////////////////////////////////////
///////////////////////////////////////
// Coding Challenge #1

/*
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀


const juliaData = [3, 5, 2, 12, 7];
const kateData = [4, 1, 15, 8, 3];

const juliaData2 = [9, 16, 6, 8, 3];
const kateData2 = [10, 5, 6, 1, 4];

const checkDogs = (juliaData, kateData) => {
  const correctedJuliaData = juliaData.slice(1, -2);
  const entireDataSet = correctedJuliaData.concat(kateData);
  console.log(entireDataSet);
  entireDataSet.forEach((age, i) => {
    age > 3
      ? console.log(`Dog number ${i + 1} is an adult and is ${age} old`)
      : console.log(
          `Dog number ${i + 1} is still a puppy 🐶 and is only ${age} old`
        );
  });
};

checkDogs(juliaData, kateData);
console.log('_______________________');
checkDogs(juliaData2, kateData2);
*/

///////////////////////////////////////
// Coding Challenge #2

/*
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

const testdata1 = [5, 2, 4, 1, 15, 8, 3];
const testdata2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages => {
  const adultDogsAge = [];
  ages.forEach(age => {
    let humanAge = 0;
    if (age <= 2) {
      humanAge = 2 * age;
    } else {
      humanAge = 16 + age * 4;
    }

    if (humanAge >= 18) {
      adultDogsAge.push(humanAge);
      console.log(humanAge);
      return humanAge;
    }
  });
  console.log(adultDogsAge);

  const average =
    adultDogsAge.reduce((acc, cur) => {
      return (acc += cur);
    }, 0) / adultDogsAge.length;
  console.log(average);
};

console.log();
calcAverageHumanAge(testdata1);
calcAverageHumanAge(testdata2);
*/

///////////////////////////////////////
// Coding Challenge #3

/*
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

const testdata1 = [5, 2, 4, 1, 15, 8, 3];
const testdata2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages => {
  const average = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  return average;
};

console.log(calcAverageHumanAge(testdata1));
console.log(calcAverageHumanAge(testdata2));
*/
