/* Leonida Legend — GTA VI trophy tracker. Loads app/data/trophies.json, renders the
   checklist, saves progress in localStorage, and exports/imports it. No network use:
   the only fetch is the local data file. */

const DATA_URL = "data/trophies.json";
const STORAGE_KEY = "gta6-trophy-guide-v1";
const ROADMAP_STAGES = [
  { title: "Play the story", text: "Chapters 1–4 and the final mission. Twelve story trophies come with normal play. Meditate at every spot you pass — Positive Mental Attitude is the one trophy that may be missable — and keep a separate save at the start and end of every chapter, because there is no mission replay." },
  { title: "Contacts and strangers", text: "The five contact finales (Andy, Kenton, Billy, Randy, Tyrone), Bret's unique-animal hunt, and eight stranger mission strands. Only some side questlines count toward the eight, so finish more than eight strands to be safe." },
  { title: "Activities", text: "Stunts, the shooting range, drone races, races, fishing against Cal, the arcade, and the challenge list. Sample all nine activity types once for Master of None, then go deep: 250 stunts, 42 shooting-range golds, 14 drone-race wins, 20 race wins, 50 challenges." },
  { title: "Collectibles and exploration", text: "Meditation spots, collectible card sets, WAiNK scans, vehicles, the 52 areas of Leonida, garage properties and Scooter Bros registrations. Sweep region by region so nothing is left behind." },
  { title: "Combat and heists", text: "Combat Focus, the VCIA departure, the Rhinos, the undetected jewelry robbery, five bank vaults, the armored truck, one illegal operation per gang, and the two partner trophies. Stage a fast car before every robbery — the escape is what counts." },
  { title: "Money, mysteries and the platinum", text: "Launder $250,000 in Marked Bills, spend $100,000 across shops, try the five hidden trophies whose triggers are still unconfirmed, then finish the 100% completion checklist. The platinum pops with the 54th other trophy." },
];

let allTrophies = [];
let earnedIds = new Set();
let activeFilter = "all";
let activeGrade = "all";
let spoilerFree = false;
let hideEarned = false;
let searchText = "";

const listEl = document.getElementById("trophyList");
const emptyEl = document.getElementById("emptyMsg");
const searchBox = document.getElementById("searchBox");
const gradeSelect = document.getElementById("gradeSelect");
const spoilerToggle = document.getElementById("spoilerToggle");
const hideEarnedToggle = document.getElementById("hideEarnedToggle");

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.earned)) earnedIds = new Set(parsed.earned.filter((n) => Number.isInteger(n)));
  } catch (err) {
    earnedIds = new Set();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earnedIds].sort((a, b) => a - b), savedAt: new Date().toISOString() }));
  } catch (err) {
    /* Storage may be unavailable (private mode); the tracker still works for the session. */
  }
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function isStoryHidden(trophy) {
  return spoilerFree && trophy.kind === "story" && !earnedIds.has(trophy.id);
}

function trophyMatches(trophy) {
  if (activeFilter === "story" && trophy.kind !== "story") return false;
  if (activeFilter === "missable" && !trophy.missable) return false;
  if (activeFilter === "collectibles" && trophy.kind !== "collectibles") return false;
  if (activeFilter === "activities" && trophy.kind !== "activities") return false;
  if (activeFilter === "online") return false;
  if (activeGrade !== "all" && trophy.grade !== activeGrade) return false;
  if (hideEarned && earnedIds.has(trophy.id)) return false;
  if (searchText) {
    const hay = (trophy.name + " " + trophy.description + " " + trophy.guide + " " + (trophy.steps || []).join(" ")).toLowerCase();
    if (!hay.includes(searchText)) return false;
  }
  return true;
}

function renderProgress() {
  const earned = earnedIds.size;
  const total = allTrophies.length || 55;
  const pct = total ? Math.round((earned / total) * 100) : 0;
  document.getElementById("earnedCount").textContent = String(earned);
  document.getElementById("totalCount").textContent = String(total);
  document.getElementById("progressPct").textContent = pct + "%";
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("pointsText").textContent = earned + " / " + total;
}

function buildTrophyCard(trophy) {
  const li = document.createElement("li");
  li.className = "trophy" + (earnedIds.has(trophy.id) ? " earned" : "");
  li.dataset.trophyId = String(trophy.id);

  const head = document.createElement("div");
  head.className = "trophy-head";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "trophy-check";
  check.checked = earnedIds.has(trophy.id);
  check.setAttribute("aria-label", "Mark " + trophy.name + " as earned");
  check.addEventListener("change", () => {
    if (check.checked) earnedIds.add(trophy.id);
    else earnedIds.delete(trophy.id);
    saveProgress();
    renderProgress();
    renderList();
    renderRoadmap();
  });

  const main = document.createElement("div");
  main.className = "trophy-main";

  const name = document.createElement("h3");
  name.className = "trophy-name";
  if (isStoryHidden(trophy)) {
    name.textContent = "Hidden story trophy — earn it to reveal";
    name.classList.add("spoiler-name");
  } else {
    name.textContent = trophy.name;
  }

  const desc = document.createElement("p");
  desc.className = "trophy-desc";
  desc.textContent = isStoryHidden(trophy) ? "Story trophy — its name and description stay hidden until you earn it." : trophy.description;

  const meta = document.createElement("div");
  meta.className = "trophy-meta";
  const gradeBadge = document.createElement("span");
  gradeBadge.className = "badge " + trophy.grade;
  gradeBadge.textContent = gradeLabel(trophy.grade);
  meta.appendChild(gradeBadge);
  const kindTag = document.createElement("span");
  kindTag.className = "tag";
  kindTag.textContent = trophy.kind;
  meta.appendChild(kindTag);
  if (trophy.missable) {
    const miss = document.createElement("span");
    miss.className = "tag missable";
    miss.textContent = "Possibly missable";
    meta.appendChild(miss);
  }
  if (trophy.hidden) {
    const hid = document.createElement("span");
    hid.className = "tag hidden";
    hid.textContent = "Hidden on PS5";
    meta.appendChild(hid);
  }
  if (typeof trophy.count === "number") {
    const count = document.createElement("span");
    count.className = "tag";
    count.textContent = "Count: " + trophy.count.toLocaleString("en-US");
    meta.appendChild(count);
  }
  const stageTag = document.createElement("span");
  stageTag.className = "tag";
  stageTag.textContent = "Roadmap stage " + trophy.stage;
  meta.appendChild(stageTag);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "guide-toggle";
  toggle.textContent = "Show guide ▸";
  toggle.setAttribute("aria-expanded", "false");

  const guide = document.createElement("div");
  guide.className = "guide";
  guide.hidden = true;
  const guideText = document.createElement("p");
  guideText.textContent = trophy.guide;
  guide.appendChild(guideText);
  if (Array.isArray(trophy.steps) && trophy.steps.length) {
    const steps = document.createElement("ol");
    steps.className = "guide-steps";
    trophy.steps.forEach((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      steps.appendChild(item);
    });
    guide.appendChild(steps);
  }
  const sources = document.createElement("p");
  sources.className = "guide-sources";
  sources.innerHTML = "";
  const sourcesLabel = document.createElement("b");
  sourcesLabel.textContent = "Sources: ";
  sources.appendChild(sourcesLabel);
  sources.appendChild(document.createTextNode(trophy.sources || "Exophase · PSNProfiles"));
  guide.appendChild(sources);

  toggle.addEventListener("click", () => {
    guide.hidden = !guide.hidden;
    toggle.textContent = guide.hidden ? "Show guide ▸" : "Hide guide ▾";
    toggle.setAttribute("aria-expanded", String(!guide.hidden));
  });

  main.append(name, desc, meta, toggle, guide);
  head.append(check, main);
  li.appendChild(head);
  return li;
}

function renderList() {
  listEl.innerHTML = "";
  const shown = allTrophies.filter(trophyMatches);
  emptyEl.hidden = shown.length !== 0;
  if (activeFilter === "online") {
    emptyEl.hidden = false;
    emptyEl.textContent = "There are no online trophies in GTA VI — every trophy is single-player. All 55 are earned offline.";
  } else {
    emptyEl.textContent = "No trophies match these filters. Try clearing the search or choosing another filter.";
  }
  shown.forEach((trophy) => listEl.appendChild(buildTrophyCard(trophy)));
}

function renderRoadmap() {
  const list = document.getElementById("roadmapList");
  list.innerHTML = "";
  ROADMAP_STAGES.forEach((stage, index) => {
    const stageNo = index + 1;
    const item = document.createElement("li");
    item.className = "roadmap-stage";
    const heading = document.createElement("h3");
    heading.textContent = stage.title;
    const text = document.createElement("p");
    text.textContent = stage.text;
    const chips = document.createElement("div");
    chips.className = "stage-trophies";
    allTrophies
      .filter((trophy) => trophy.stage === stageNo)
      .forEach((trophy) => {
        const chip = document.createElement("span");
        chip.className = "stage-trophy" + (earnedIds.has(trophy.id) ? " done" : "");
        chip.textContent = (earnedIds.has(trophy.id) ? "✓ " : "") + trophy.name;
        chips.appendChild(chip);
      });
    item.append(heading, text, chips);
    list.appendChild(item);
  });
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ game: "Grand Theft Auto VI", earned: [...earnedIds].sort((a, b) => a - b) }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gta6-trophy-progress.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error("not a progress file");
      earnedIds = new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
      saveProgress();
      renderProgress();
      renderList();
      renderRoadmap();
    } catch (err) {
      window.alert("That file is not a Leonida Legend progress export.");
    }
  };
  reader.readAsText(file);
}

function switchView(name) {
  ["Tracker", "Roadmap", "Sources"].forEach((view) => {
    document.getElementById("view" + view).hidden = view !== name;
    document.getElementById("tab" + view).classList.toggle("active", view === name);
  });
}

function bindControls() {
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((other) => other.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      renderList();
    });
  });
  gradeSelect.addEventListener("change", () => {
    activeGrade = gradeSelect.value;
    renderList();
  });
  spoilerToggle.addEventListener("change", () => {
    spoilerFree = spoilerToggle.checked;
    renderList();
  });
  hideEarnedToggle.addEventListener("change", () => {
    hideEarned = hideEarnedToggle.checked;
    renderList();
  });
  searchBox.addEventListener("input", () => {
    searchText = searchBox.value.trim().toLowerCase();
    renderList();
  });
  document.getElementById("exportBtn").addEventListener("click", exportProgress);
  document.getElementById("importFile").addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) importProgress(file);
    event.target.value = "";
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (window.confirm("Clear all earned trophies?")) {
      earnedIds = new Set();
      saveProgress();
      renderProgress();
      renderList();
      renderRoadmap();
    }
  });
  document.getElementById("tabTracker").addEventListener("click", () => switchView("Tracker"));
  document.getElementById("tabRoadmap").addEventListener("click", () => switchView("Roadmap"));
  document.getElementById("tabSources").addEventListener("click", () => switchView("Sources"));
}

async function loadTrophies() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error("Could not load " + DATA_URL);
  const data = await response.json();
  allTrophies = Array.isArray(data) ? data : data.trophies;
}

async function initTracker() {
  loadProgress();
  bindControls();
  await loadTrophies();
  renderProgress();
  renderList();
  renderRoadmap();
}

initTracker().catch((err) => {
  listEl.innerHTML = "";
  emptyEl.hidden = false;
  emptyEl.textContent = "The trophy data could not be loaded. Please reload the page.";
});
