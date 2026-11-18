// ---------- Album-Sortierung ----------
const grid = document.getElementById("albumGrid");
const sortButtons = document.querySelectorAll("[data-sort]");

function sortAlbums(direction) {
  const cards = [...grid.children];
  cards.sort((a, b) =>
    direction === "asc"
      ? a.dataset.year - b.dataset.year
      : b.dataset.year - a.dataset.year
  );
  cards.forEach((card) => grid.appendChild(card));
  sortButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.sort === direction)
  );
}

sortButtons.forEach((btn) =>
  btn.addEventListener("click", () => sortAlbums(btn.dataset.sort))
);

// ---------- Zufälliges Album ----------
document.getElementById("shuffleBtn").addEventListener("click", () => {
  const cards = [...grid.children];
  const pick = cards[Math.floor(Math.random() * cards.length)];
  pick.scrollIntoView({ behavior: "smooth", block: "center" });
  pick.classList.add("flash");
  setTimeout(() => pick.classList.remove("flash"), 1200);
});

// ---------- Overlay (Album-Details + Foto) ----------
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const starsBox = document.getElementById("stars");
const starHint = document.getElementById("starHint");
let currentKey = null;

function loadRating(key) {
  try {
    return Number(localStorage.getItem("rating:" + key)) || 0;
  } catch (e) {
    return 0;
  }
}

function saveRating(key, value) {
  try {
    localStorage.setItem("rating:" + key, value);
  } catch (e) {}
}

function drawStars(value) {
  starsBox.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    if (i <= value) star.classList.add("on");
    star.addEventListener("click", () => {
      // nochmal auf dieselbe Zahl klicken = Bewertung löschen
      const next = loadRating(currentKey) === i ? 0 : i;
      saveRating(currentKey, next);
      drawStars(next);
      starHint.textContent = next ? "Your rating: " + next + " / 5" : "";
    });
    starsBox.appendChild(star);
  }
}

function openModal(src, title, year, rateable) {
  modalImg.src = src;
  modalImg.alt = title;
  modalTitle.textContent = title;
  modalYear.textContent = year || "";
  starsBox.style.display = rateable ? "" : "none";
  starHint.textContent = "";
  if (rateable) {
    currentKey = title;
    const value = loadRating(title);
    drawStars(value);
    if (value) starHint.textContent = "Your rating: " + value + " / 5";
  }
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".album-card");
  if (card) openModal(card.dataset.img, card.dataset.title, card.dataset.year, true);
});

document.getElementById("willImg").addEventListener("click", (e) => {
  openModal(e.target.src, "Will Ramos", "", false);
});

document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---------- Vinyl pausieren / abspielen ----------
const vinyl = document.getElementById("vinyl");
vinyl.addEventListener("click", () => vinyl.classList.toggle("paused"));

// ---------- Song-Links (YouTube-Suche) ----------
document.querySelectorAll("#songList li").forEach((li) => {
  const name = li.textContent.split(" - ")[0].trim();
  const link = document.createElement("a");
  link.href =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent("Lorna Shore " + name);
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "▶";
  link.title = "Search on YouTube";
  li.appendChild(link);
});

// ---------- Schwebender Back-to-top ----------
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTop.hidden = window.scrollY < 400;
});
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);
