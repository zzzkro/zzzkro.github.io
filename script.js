const $ = (id) => document.getElementById(id);

const inputs = [
  "treasureChance",
  "greatBonus",
  "fishingSpeed",
  "speedCap",
  "lureReduction",
  "extraTime",
  "itemChance"
];

inputs.forEach(id => {
  $(id).addEventListener("input", update);
});

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// average base ticks from uniform distribution
function getAverageBaseTicks(lureReduction) {
  const min = 200;
  const max = 400 - 200 * lureReduction;
  return (min + max) / 2;
}

function getAverageBiteTimeSeconds(speed, cap, lureReduction) {
  const baseTicks = getAverageBaseTicks(lureReduction);

  const speedFactor = clamp(speed / cap, 0, 1);

  const finalTicks = baseTicks * (1 - speedFactor);

  return finalTicks / 20; // 20 ticks per second
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return "--";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function update() {
  const treasureChance = clamp(parseFloat($( "treasureChance").value) || 0, 0, 100) / 100;
  const greatBonus = (parseFloat($( "greatBonus").value) || 0) / 100;

  const fishingSpeed = parseFloat($( "fishingSpeed").value) || 0;
  const speedCap = parseFloat($( "speedCap").value) || 300;

  const lureReduction = clamp(parseFloat($( "lureReduction").value) || 0, 0, 1);
  const extraTime = parseFloat($( "extraTime").value) || 0;

  const itemChance = parseFloat($( "itemChance").value) || 1;

  // fishing mechanics
  const biteTime = getAverageBiteTimeSeconds(fishingSpeed, speedCap, lureReduction) + extraTime;

  // chance breakdown
  const treasurePerCast = treasureChance;

  const normalChance = treasurePerCast * (1 - greatBonus);
  const greatChance = treasurePerCast * greatBonus;

  // expected casts for item
  const itemPerCast = treasurePerCast * (1 / itemChance);

  const avgCasts = itemPerCast > 0 ? 1 / itemPerCast : Infinity;

  const avgSeconds = avgCasts * biteTime;

  const treasuresPerHour = (3600 / biteTime) * treasurePerCast;

  // output
  $("biteTime").innerText = biteTime.toFixed(2) + " s";
  $("castTime").innerText = formatTime(biteTime);

  $("treasuresHour").innerText = treasuresPerHour.toFixed(2);

  $("avgCasts").innerText = isFinite(avgCasts) ? avgCasts.toFixed(0) : "∞";

  $("avgTime").innerText = formatTime(avgSeconds);
}

update();
