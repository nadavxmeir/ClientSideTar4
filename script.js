let balance = 1000;
let userNumbers = [];
let userStrong = null;

const form = document.getElementById("lottoForm");

function initBoard() {
  const grid = document.getElementById("numbers-grid");
  for (let i = 1; i <= 37; i++) {
    let div = document.createElement("div");
    div.className = "cell";
    div.innerText = i;
    div.onclick = () => selectNumber(i, div);
    grid.appendChild(div);
  }

  const strongGrid = document.getElementById("strong-number-section");
  for (let i = 1; i <= 7; i++) {
    let div = document.createElement("div");
    div.className = "cell";
    div.innerText = i;
    div.onclick = () => selectStrong(i, div);
    strongGrid.appendChild(div);
  }
}

function selectNumber(num, el) {
  if (userNumbers.includes(num)) {
    userNumbers = userNumbers.filter((n) => n !== num);
    el.classList.remove("selected");
  } else if (userNumbers.length < 6) {
    userNumbers.push(num);
    el.classList.add("selected");
  }
}

function selectStrong(num, el) {
  let StrongCells = document.querySelectorAll("#strong-number-section .cell");
  StrongCells.forEach((c) => c.classList.remove("strong-selected"));
  userStrong = num;
  el.classList.add("strong-selected");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (balance < 300) {
    alert("אין לך מספיק כסף להגרלה נוספת!");
    return;
  }
  if (userNumbers.length < 6 || !userStrong) {
    alert("עליך להשלים את הטופס: בחר 6 מספרים ומספר חזק.");
    return;
  }

  playGame();
});

function playGame() {
  balance -= 300;

  let winNums = [];
  while (winNums.length < 6) {
    let r = Math.floor(Math.random() * 37) + 1;
    if (!winNums.includes(r)) winNums.push(r);
  }
  let winStrong = Math.floor(Math.random() * 7) + 1;

  let matches = userNumbers.filter((n) => winNums.includes(n)).length;
  let strongMatch = userStrong === winStrong;
  let prize = 0;

  if (matches === 6 && strongMatch) prize = 1000;
  else if (matches === 6) prize = 600;
  else if (matches === 4 && strongMatch) prize = 400;

  balance += prize;
  const resDiv = null;
  const btn = document.querySelector("#check-btn");
  btn.addEventListener("click", () => {

  });
  resDiv = document.createElement("div");
  resDiv.className = "results-box";
  displayResults(winNums, winStrong, matches, strongMatch, prize, resDiv);
  resetForm();
}

function displayResults(winNums, winStrong, matches, strongMatch, prize, resDiv) {
  let status = prize > 0 ? `זכייה! זכית ב-${prize} ש"ח` : "לא זכית הפעם";
  resDiv.innerHTML = `
        <h3>תוצאות ההגרלה:</h3>
        <p>מספרים שעלו: ${winNums
          .sort((a, b) => a - b)
          .join(", ")} | חזק: ${winStrong}</p>
        <p>הבחירה שלך: ${userNumbers
          .sort((a, b) => a - b)
          .join(", ")} | חזק: ${userStrong}</p>
        <p><strong>${status}</strong></p>
    `;
  document.getElementById("balance").innerText = balance;
  if (balance < 300) finishGame();
}

function resetForm() {
  userNumbers = [];
  userStrong = null;
  document.querySelectorAll(".cell").forEach((c) => {
    c.classList.remove("selected");
    c.classList.remove("strong-selected");
  });
}

function finishGame() {
  alert(`המשחק הסתיים. יתרה סופית: ${balance} ש"ח.`);
  document
    .getElementById("lottoForm")
    .querySelectorAll("button, .cell")
    .forEach((el) => {
      el.style.pointerEvents = "none";
      if (el.tagName === "BUTTON") el.disabled = true;
    });
}

initBoard();
