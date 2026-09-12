// No accounts, no server database. Each student's progress lives in their
// own browser under one localStorage key. Opening the same link on the
// same device later reloads the same progress automatically.

const STORAGE_KEY = "speakup_progress";

function slugToName(slug) {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Call this once at the top of every page.
// Reads ?student=NAME from the link the teacher shared (used only the
// very first time, to greet the student and label their local record).
function initStudent() {
  let progress = loadProgress();
  if (!progress) {
    const params = new URLSearchParams(window.location.search);
    const studentParam = params.get("student");
    progress = {
      name: studentParam ? slugToName(studentParam) : "Student",
      currentLevel: CURRICULUM[0].id,
      completedUnits: []
    };
    saveProgress(progress);
  }
  return progress;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getProgress() {
  return loadProgress() || initStudent();
}

function markUnitComplete(unitId, levelId) {
  const progress = getProgress();
  if (!progress.completedUnits.includes(unitId)) {
    progress.completedUnits.push(unitId);
  }

  // Auto-advance to the next level once every unit in this one is done.
  const level = CURRICULUM.find((l) => l.id === levelId);
  const allDone = level.units.every((u) => progress.completedUnits.includes(u.id));
  if (allDone) {
    const idx = CURRICULUM.findIndex((l) => l.id === levelId);
    const next = CURRICULUM[idx + 1];
    if (next) progress.currentLevel = next.id;
  }

  saveProgress(progress);
  return progress;
}

function levelIsUnlocked(levelId, progress) {
  const idx = CURRICULUM.findIndex((l) => l.id === levelId);
  const currentIdx = CURRICULUM.findIndex((l) => l.id === progress.currentLevel);
  return idx <= currentIdx;
}

function levelCompletionPct(level, progress) {
  const done = level.units.filter((u) => progress.completedUnits.includes(u.id)).length;
  return Math.round((done / level.units.length) * 100);
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = "index.html";
}
