"use strict";
/* =========================
   GAME CONFIG
========================= */

let currentPlayer = null;
let wallet = 0;

/* =========================
   LOGIN
========================= */

document.querySelector(".login").addEventListener("click", async function () {
  const username = document.querySelector(".username").value.trim();

  if (!username) {
    alert("Enter a username!");
    return;
  }

  try {
    const response = await fetch(
      "https://guess-backend-uxyq.onrender.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    currentPlayer = username;
    wallet = data.wallet;

    document.querySelector(".wallet-balance").textContent = wallet;

    document.querySelector(".username").style.display = "none";
    document.querySelector(".login").style.display = "none";
    document.querySelector(".guess").style.display = "block";
    document.querySelector(".check").style.display = "block";
    document.querySelector(".deposit").style.display = "block";
    document.querySelector(".withdraw").style.display = "block";

    document.querySelector(".message").textContent =
      `Welcome ${username}, start guessing!`;
  } catch (err) {
    alert("Server error. Try again.");
  }
});

/* =========================
   CHECK GUESS
========================= */

document.querySelector(".check").addEventListener("click", async function () {
  if (!currentPlayer) {
    alert("Login first!");
    return;
  }

  const guess = Number(document.querySelector(".guess").value);

  if (!guess || guess < 1 || guess > 20) {
    alert("Enter a number between 1 and 20");
    return;
  }

  try {
    const response = await fetch(
      "https://guess-backend-uxyq.onrender.com/guess",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    document.querySelector(".remaining").textContent = data.remainingGuesses;

    if (data.result === "win") {
      document.querySelector(".message").textContent =
        `🎉 You won ${data.winnings} KES!`;
      document.querySelector("body").style.background = "#60b347";
    } else if (data.result === "lose") {
      document.querySelector(".message").textContent =
        `💀 You lost! Correct number was ${data.correctNumber}`;
      document.querySelector("body").style.background = "red";
      document.querySelector(".number").textContent = data.correctNumber;
    } else if (data.result === "high") {
      document.querySelector(".message").textContent = "Too HIGH!";
    } else if (data.result === "low") {
      document.querySelector(".message").textContent = "Too LOW!";
    }

    document.querySelector(".guess").value = "";
  } catch (err) {
    alert("Server error.");
  }
});

/* =========================
   AGAIN BUTTON
========================= */

document.querySelector(".again").addEventListener("click", async function () {
  if (!currentPlayer) return;

  await fetch("https://guess-backend-uxyq.onrender.com/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentPlayer }),
  });

  document.querySelector(".message").textContent = "New round started!";
  document.querySelector(".number").textContent = "?";
  document.querySelector("body").style.background = "#222";
  document.querySelector(".remaining").textContent = 3;
});

/* =========================
   DEPOSIT
========================= */

document.querySelector(".deposit").addEventListener("click", async function () {
  const phone = prompt("Enter your phone number (2547xxxxxxx):");
  const amount = Number(prompt("Enter amount to deposit:"));

  if (!phone || !amount || amount < 1) return alert("Invalid input");

  try {
    const response = await fetch(
      "https://guess-backend-uxyq.onrender.com/pay",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentPlayer,
          phone,
          amount,
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("✅ STK Push sent. Complete payment on your phone.");
    }
  } catch (err) {
    alert("Deposit failed.");
  }
});

/* =========================
   WITHDRAW
========================= */

document
  .querySelector(".withdraw")
  .addEventListener("click", async function () {
    const amount = Number(prompt("Enter amount to withdraw:"));

    if (!amount || amount < 1) return alert("Invalid input");

    try {
      const response = await fetch(
        "https://guess-backend-uxyq.onrender.com/withdraw",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: currentPlayer,
            amount,
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        wallet = data.wallet;
        document.querySelector(".wallet-balance").textContent = wallet;
        alert("✅ Withdrawal successful!");
      }
    } catch (err) {
      alert("Withdrawal failed.");
    }
  });

// let currentPlayer = null;
// let wallet = 0;

// /* =========================
//    LOGIN
// ========================= */
// document.querySelector(".login").addEventListener("click", async function () {
//   const username = document.querySelector(".username").value.trim();
//   if (!username) return alert("Enter a username!");

//   try {
//     const response = await fetch("https://guess-backend-uxyq.onrender.com/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username }),
//     });

//     const data = await response.json();
//     if (data.error) return alert(data.error);

//     currentPlayer = username;
//     wallet = data.wallet;
//     document.querySelector(".wallet-balance").textContent = wallet;

//     // Show game elements
//     document.querySelector(".username").style.display = "none";
//     document.querySelector(".login").style.display = "none";
//     document.querySelector(".guess").style.display = "block";
//     document.querySelector(".check").style.display = "block";
//     document.querySelector(".deposit-amount").style.display = "block";
//     document.querySelector(".deposit").style.display = "block";
//     document.querySelector(".withdraw").style.display = "block";

//     document.querySelector(".message").textContent =
//       `Welcome ${username}, start guessing!`;
//   } catch (err) {
//     alert("Server error. Try again.");
//   }
// });

// /* =========================
//    CHECK GUESS
// ========================= */
// document.querySelector(".check").addEventListener("click", async function () {
//   if (!currentPlayer) return alert("Login first!");

//   const guess = Number(document.querySelector(".guess").value);
//   if (!guess || guess < 1 || guess > 20) return alert("Enter a number between 1 and 20");

//   try {
//     const response = await fetch("https://guess-backend-uxyq.onrender.com/guess", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username: currentPlayer, guess }),
//     });

//     const data = await response.json();
//     if (data.error) {
//       document.querySelector(".message").textContent = data.error;
//       return;
//     }

//     wallet = data.wallet;
//     document.querySelector(".wallet-balance").textContent = wallet;
//     document.querySelector(".remaining").textContent = data.remainingGuesses;

//     if (data.result === "win") {
//       document.querySelector(".message").textContent =
//         `🎉 You won ${data.winnings} KES!`;
//       document.querySelector("body").style.background = "#60b347";
//     } else if (data.result === "lose") {
//       document.querySelector(".message").textContent =
//         `💀 You lost! Correct number was ${data.correctNumber}`;
//       document.querySelector("body").style.background = "red";
//       document.querySelector(".number").textContent = data.correctNumber;
//     } else if (data.result === "high") {
//       document.querySelector(".message").textContent = "Too HIGH!";
//     } else if (data.result === "low") {
//       document.querySelector(".message").textContent = "Too LOW!";
//     }

//     document.querySelector(".guess").value = "";
//   } catch (err) {
//     alert("Server error.");
//   }
// });

// /* =========================
//    AGAIN BUTTON
// ========================= */
// document.querySelector(".again").addEventListener("click", async function () {
//   if (!currentPlayer) return;
//   await fetch("https://guess-backend-uxyq.onrender.com/reset", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username: currentPlayer }),
//   });

//   document.querySelector(".message").textContent = "New round started!";
//   document.querySelector(".number").textContent = "?";
//   document.querySelector("body").style.background = "#222";
//   document.querySelector(".remaining").textContent = 3;
// });

// /* =========================
//    DEPOSIT
// ========================= */
// document.querySelector(".deposit").addEventListener("click", async function () {
//   if (!currentPlayer) return alert("Login first!");
//   const amount = Number(document.querySelector(".deposit-amount").value);
//   if (!amount || amount < 10) return alert("Deposit at least 10 KES");

//   try {
//     const response = await fetch("https://guess-backend-uxyq.onrender.com/pay", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username: currentPlayer, phone: prompt("Enter phone"), amount }),
//     });
//     const data = await response.json();
//     if (data.error) return alert(data.error);
//     alert("STK Push initiated. Complete payment on your phone.");
//   } catch (err) {
//     alert("Server error.");
//   }
// });

// /* =========================
//    WITHDRAW
// ========================= */
// document.querySelector(".withdraw").addEventListener("click", function () {
//   if (!currentPlayer) return alert("Login first!");
//   if (wallet < 50) return alert("Need at least 50 KES profit to withdraw");
//   wallet -= 50;
//   document.querySelector(".wallet-balance").textContent = wallet;
//   fetch("https://guess-backend-uxyq.onrender.com/reset", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username: currentPlayer, wallet }),
//   });
//   alert("50 KES withdrawn!");
// });
//
//
//
//
//
//
//
/* =========================
   GAME CONFIG
========================= */

// let currentPlayer = null;
// let wallet = 0;

// /* =========================
//    LOGIN
// ========================= */

// document.querySelector(".login").addEventListener("click", async function () {
//   const username = document.querySelector(".username").value.trim();

//   if (!username) {
//     alert("Enter a username!");
//     return;
//   }

//   try {
//     const response = await fetch("https://guess-backend-uxyq.onrender.com/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username }),
//     });

//     const data = await response.json();

//     if (data.error) {
//       alert(data.error);
//       return;
//     }

//     currentPlayer = username;
//     wallet = data.wallet;

//     document.querySelector(".wallet-balance").textContent = wallet;

//     document.querySelector(".username").style.display = "none";
//     document.querySelector(".login").style.display = "none";
//     document.querySelector(".guess").style.display = "block";
//     document.querySelector(".check").style.display = "block";

//     document.querySelector(".message").textContent =
//       `Welcome ${username}, start guessing!`;

//   } catch (err) {
//     alert("Server error. Try again.");
//   }
// });

// /* =========================
//    CHECK GUESS
// ========================= */

// document.querySelector(".check").addEventListener("click", async function () {
//   if (!currentPlayer) {
//     alert("Login first!");
//     return;
//   }

//   const guess = Number(document.querySelector(".guess").value);

//   if (!guess || guess < 1 || guess > 20) {
//     alert("Enter a number between 1 and 20");
//     return;
//   }

//   try {
//     const response = await fetch("https://guess-backend-uxyq.onrender.com/guess", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         username: currentPlayer,
//         guess,
//       }),
//     });

//     const data = await response.json();

//     if (data.error) {
//       document.querySelector(".message").textContent = data.error;
//       return;
//     }

//     wallet = data.wallet;
//     document.querySelector(".wallet-balance").textContent = wallet;
//     document.querySelector(".remaining").textContent = data.remainingGuesses;

//     if (data.result === "win") {
//       document.querySelector(".message").textContent =
//         `🎉 You won ${data.winnings} KES!`;
//       document.querySelector("body").style.background = "#60b347";
//     }

//     else if (data.result === "lose") {
//       document.querySelector(".message").textContent =
//         `💀 You lost! Correct number was ${data.correctNumber}`;
//       document.querySelector("body").style.background = "red";
//       document.querySelector(".number").textContent = data.correctNumber;
//     }

//     else if (data.result === "high") {
//       document.querySelector(".message").textContent = "Too HIGH!";
//     }

//     else if (data.result === "low") {
//       document.querySelector(".message").textContent = "Too LOW!";
//     }

//     document.querySelector(".guess").value = "";

//   } catch (err) {
//     alert("Server error.");
//   }
// });

// /* =========================
//    AGAIN BUTTON
// ========================= */

// document.querySelector(".again").addEventListener("click", async function () {
//   if (!currentPlayer) return;

//   await fetch("https://guess-backend-uxyq.onrender.com/reset", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username: currentPlayer }),
//   });

//   document.querySelector(".message").textContent = "New round started!";
//   document.querySelector(".number").textContent = "?";
//   document.querySelector("body").style.background = "#222";
//   document.querySelector(".remaining").textContent = 3;
// });
