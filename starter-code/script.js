const lengthInput = document.querySelector("#password-length");
const lengthValue = document.querySelector("#length-value");

function updateLength() {
  const value = Number(lengthInput.value);
  const min = Number(lengthInput.min);
  const max = Number(lengthInput.max);

  const percentage = ((value - min) / (max - min)) * 100;

  lengthValue.textContent = value;

  lengthInput.style.background = `linear-gradient(
    to right,
    #a4ffaf ${percentage}%,
    #18171f ${percentage}%
  )`;
}

lengthInput.addEventListener("input", updateLength);

updateLength();

const passwordForm = document.querySelector("#password-form");
const passwordOutput = document.querySelector("#password");
const uppercaseInput = document.querySelector("#uppercase");
const lowercaseInput = document.querySelector("#lowercase");
const numbersInput = document.querySelector("#numbers");
const symbolsInput = document.querySelector("#symbols");

function getRandomIndex(max) {
  const randomValue = new Uint32Array(1);
  const limit = Math.floor(4294967296 / max) * max;

  do {
    crypto.getRandomValues(randomValue);
  } while (randomValue[0] >= limit);

  return randomValue[0] % max;
}

const strengthText = document.querySelector("#strength-text");
const strengthBars = document.querySelectorAll(".strength-bar");
function updateStrength(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  const typesCount =
  Number(hasUppercase) +
  Number(hasLowercase) +
  Number(hasNumbers) +
  Number(hasSymbols);

let level = 1;

if (password.length >= 12 && typesCount >= 3) {
  level = 4;
} else if (password.length >= 10 && typesCount >= 2) {
  level = 3;
} else if (password.length >= 8) {
  level = 2;
}

const labels = ["Too weak!", "Weak", "Medium", "Strong"];

strengthText.textContent = labels[level - 1];
const colors = ["#f64a4a", "#fb7c58", "#f8cd65", "#a4ffaf"];
const color = colors[level - 1];

strengthBars.forEach((bar, index) => {
  const isActive = index < level;

  bar.style.backgroundColor = isActive ? color : "transparent";
  bar.style.borderColor = isActive ? color : "#e6e5ea";
});
}

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

    const selectedGroups = [];

if (uppercaseInput.checked) {
  selectedGroups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
}

if (lowercaseInput.checked) {
  selectedGroups.push("abcdefghijklmnopqrstuvwxyz");
}

if (numbersInput.checked) {
  selectedGroups.push("0123456789");
}

if (symbolsInput.checked) {
  selectedGroups.push("!@#$%^&*()_+-=[]{};:,.?");
}

const characters = selectedGroups.join("");
if (selectedGroups.length === 0) {
  alert("Select at least one character type.");
  return;
}

const passwordLength = Number(lengthInput.value);
let password = "";

selectedGroups.forEach((group) => {
  const index = getRandomIndex(group.length);
  password += group[index];
});

while (password.length < passwordLength) {
  const index = getRandomIndex(characters.length);
  password += characters[index];
}

const passwordCharacters = password.split("");

for (let i = passwordCharacters.length - 1; i > 0; i--) {
  const randomIndex = getRandomIndex(i + 1);

  const temporary = passwordCharacters[i];
  passwordCharacters[i] = passwordCharacters[randomIndex];
  passwordCharacters[randomIndex] = temporary;
}

password = passwordCharacters.join("");

passwordOutput.textContent = password;
copyButton.disabled = false;
clearTimeout(copyTimeout);
copyMessage.textContent = "";
updateStrength(password);
  });

const copyButton = document.querySelector(".password-output button");
const copyMessage = document.querySelector("#copy-message");
let copyTimeout;

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(passwordOutput.textContent);
    clearTimeout(copyTimeout);
copyMessage.textContent = "COPIED";

copyTimeout = setTimeout(() => {
  copyMessage.textContent = "";
}, 2000);
  } catch (error) {
    alert("Could not copy the password. Please try again.");
  }
});