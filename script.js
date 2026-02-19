"use strict";

/* =========================
   GAME CONFIG
========================= */

const STAKE_PER_ROUND = 10;
const HOUSE_EDGE_PERCENT = 20; // % of winnings that house takes automatically

const FIRST_GUESS_WIN = 30;
const SECOND_GUESS_WIN = 20;
const THIRD_GUESS_WIN = 15;

let secretNumber = Math.floor(Math.random() * 20) + 1;
let score = 0;
let highScore = 0;
let remainingGuesses = 3;
let guessNumber = 1; // tracks 1st, 2nd, 3rd attempt
let streak = 1; // consecutive win multiplier

/* =========================
   WALLET & HOUSE
========================= */

let currentPlayer = null;
let wallet = 0;
let houseBank = Number(localStorage.getItem("houseBank")) || 0;

function updateHouseBank(amount) {
  houseBank += amount;
  localStorage.setItem("houseBank", houseBank);
}

function saveWallet() {
  if (currentPlayer) {
    localStorage.setItem(`wallet_${currentPlayer}`, wallet);
    document.querySelector(".wallet-balance").textContent = wallet;
  }
}

function loadWallet(player) {
  currentPlayer = player;
  wallet = Number(localStorage.getItem(`wallet_${player}`)) || 100;
  document.querySelector(".wallet-balance").textContent = wallet;
}

/* =========================
   RESET GAME
========================= */

function resetGame() {
  secretNumber = Math.floor(Math.random() * 20) + 1;
  score = 0;
  remainingGuesses = 3;
  guessNumber = 1;

  document.querySelector(".score").textContent = score;
  document.querySelector(".remaining").textContent = remainingGuesses;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".guess").value = "";
  document.querySelector(".message").textContent = "Start guessing...";
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
  document.querySelector(".continue").style.display = "none";
}

/* =========================
   LOGIN
========================= */
document.querySelector(".login").addEventListener("click", async function () {
  const username = document.querySelector(".username").value.trim();

  if (!username) {
    alert("Enter a username!");
    return;
  }

  const response = await fetch(
    "https://guess-backend-uxyq.onrender.com/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    },
  );

  const data = await response.json();

  currentPlayer = username;
  wallet = data.wallet;

  document.querySelector(".wallet-balance").textContent = wallet;

  document.querySelector(".username").style.display = "none";
  document.querySelector(".login").style.display = "none";
  document.querySelector(".guess").style.display = "block";
  document.querySelector(".check").style.display = "block";

  document.querySelector(".message").textContent =
    `Welcome ${username}, start guessing!`;
});

/* =========================
   HELPER: APPLY HOUSE EDGE
========================= */

function applyHouseEdge(amount) {
  const cut = Math.ceil(amount * (HOUSE_EDGE_PERCENT / 100));
  updateHouseBank(cut);
  return amount - cut;
}

/* =========================
   CHECK BUTTON LOGIC
========================= */
document.querySelector(".check").addEventListener("click", async function () {
  const guess = Number(document.querySelector(".guess").value);

  if (!currentPlayer) {
    alert("Login first!");
    return;
  }

  const response = await fetch(
    "https://guess-backend-uxyq.onrender.com/guess",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentPlayer,
        guess,
      }),
    },
  );

  const data = await response.json();

  if (data.error) {
    document.querySelector(".message").textContent = data.error;
    return;
  }

  wallet = data.wallet;
  document.querySelector(".wallet-balance").textContent = wallet;
  if (data.remainingGuesses !== undefined) {
    document.querySelector(".remaining").textContent = data.remainingGuesses;
  }
  if (data.result === "win") {
    document.querySelector(".message").textContent =
      `🎉 You won ${data.winnings} KES!`;
    document.querySelector("body").style.background = "#60b347";
  } else if (data.result === "lose") {
    document.querySelector(".message").textContent =
      `💀 You lost! Correct number was ${secretNumber}`;
    document.querySelector("body").style.background = "red";
    document.querySelector(".number").textContent = secretNumber;
  } else if (data.result === "high") {
    document.querySelector(".message").textContent = "Too HIGH!";
  } else if (data.result === "low") {
    document.querySelector(".message").textContent = "Too LOW!";
  }

  document.querySelector(".guess").value = "";
});

/* =========================
   AGAIN BUTTON
========================= */

document.querySelector(".again").addEventListener("click", function () {
  resetGame();
  streak = 1;
});

/* =========================
   CONTINUE BUTTON
========================= */

document.querySelector(".continue").addEventListener("click", function () {
  remainingGuesses = 3;
  guessNumber = 1;
  secretNumber = Math.floor(Math.random() * 20) + 1;

  document.querySelector(".remaining").textContent = remainingGuesses;
  document.querySelector(".message").textContent =
    "Continue playing with winnings!";
  document.querySelector(".number").textContent = "?";
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
  document.querySelector(".continue").style.display = "none";
});
