// Case study pages: one slide shows at a time, at the same address. The
// slide number is kept in the hash (#2), so a reload or a link returns to it

const slides = [...document.querySelectorAll(".slide")];
const dots = document.querySelector(".slide-dots");
let current = 0;

// A dot for each slide
for (const [i, slide] of slides.entries()) {
  const dot = document.createElement("button");
  const title = slide.querySelector(".slide-title").textContent.trim();
  dot.setAttribute("aria-label", `Slide ${i + 1}: ${title}`);
  dot.addEventListener("click", () => show(i));
  dots.append(dot);
}

function show(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  const last = slides.length - 1;

  for (const [i, slide] of slides.entries()) slide.hidden = i !== current;
  for (const [i, dot] of [...dots.children].entries()) {
    if (i === current) dot.setAttribute("aria-current", "step");
    else dot.removeAttribute("aria-current");
  }
  for (const count of document.querySelectorAll(".slide-count")) {
    count.textContent = `${current + 1}/${slides.length}`;
  }
  for (const arrow of document.querySelectorAll(".arrow-prev")) {
    arrow.setAttribute("aria-disabled", current === 0);
  }
  for (const arrow of document.querySelectorAll(".arrow-next")) {
    arrow.setAttribute("aria-disabled", current === last);
  }

  // The next case study, on the last slide
  const nextCase = document.querySelector(".next-case");
  if (nextCase) nextCase.hidden = current !== last;

  // The arrows at the foot of the new slide's panel, which starts at the top
  const panel = slides[current].querySelector(".slide-panel");
  panel.append(document.querySelector(".slide-step-foot"));
  panel.scrollTo(0, 0);

  const hash = current === 0 ? "" : `#${current + 1}`;
  if (location.hash !== hash) {
    history.replaceState(null, "", location.pathname + location.search + hash);
  }
}

// The slide the address asks for, or the first
function fromHash() {
  const n = parseInt(location.hash.slice(1), 10);
  return Number.isInteger(n) ? n - 1 : 0;
}

for (const arrow of document.querySelectorAll(".arrow-prev")) {
  arrow.addEventListener("click", () => show(current - 1));
}
for (const arrow of document.querySelectorAll(".arrow-next")) {
  arrow.addEventListener("click", () => show(current + 1));
}
addEventListener("hashchange", () => show(fromHash()));

show(fromHash());

function toggleGrid() {
  const gridDisplay = document.querySelector(".grid-display");
  const gridIcon = document.querySelector(".grid-icon");
  gridDisplay.classList.toggle("hidden");
  gridIcon.classList.toggle("grid-active");
}

function changeTheme() {
  const htmlElement = document.documentElement;
  let theme =
    htmlElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  htmlElement.setAttribute("data-theme", theme);
  // Remember it for later visits and the other pages
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

// Keyboard shortcuts: the arrow keys change slides, G toggles the grid and
// T the theme
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.closest?.("input, textarea, select, [contenteditable]")) {
    return;
  }
  if (event.key === "ArrowLeft") show(current - 1);
  if (event.key === "ArrowRight") show(current + 1);
  if (event.key === "g" || event.key === "G") toggleGrid();
  if (event.key === "t" || event.key === "T") changeTheme();
});
