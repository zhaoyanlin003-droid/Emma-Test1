// Fallback data, used when the CSV can't be fetched (e.g. opening this page
// straight from disk with file://, where browsers block the request).
const FALLBACK_CSV = `id,title,priority,status,owner
FR-101,Add export to CSV,High,Planned,Maya
FR-102,Improve empty state copy,Medium,In Progress,Elena
FR-103,Add keyboard shortcuts,Low,Backlog,Jordan
FR-104,Fix chart tooltip overlap,High,In Progress,Liam
FR-105,Add dark mode,Medium,Planned,Nina`;

const CSV_URL = "../data/feature-requests.csv";
const PRIORITY_ORDER = ["High", "Medium", "Low"];
const STATUS_ORDER = ["Backlog", "Planned", "In Progress", "Done"];
const ALL = "all";

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const resetButton = document.querySelector("#resetFilters");
const activeFilters = document.querySelector("#activeFilters");
const cards = document.querySelector("#cards");
const resultCount = document.querySelector("#resultCount");
const dataSource = document.querySelector("#dataSource");

let requests = [];

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map((h) => h.trim());

  return lines
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const cells = line.split(",").map((c) => c.trim());
      return headers.reduce((row, header, i) => {
        row[header] = cells[i] ?? "";
        return row;
      }, {});
    });
}

// Known values first, in their conventional order, then anything unexpected.
function sortValues(values, order) {
  return values.slice().sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function populateFilter(select, values, order) {
  const unique = sortValues([...new Set(values.filter(Boolean))], order);
  select.innerHTML =
    '<option value="all">All</option>' +
    unique.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function renderActiveFilters(priority, status) {
  const chips = [];
  if (priority !== ALL) chips.push(`Priority: ${escapeHtml(priority)}`);
  if (status !== ALL) chips.push(`Status: ${escapeHtml(status)}`);

  const hasFilters = chips.length > 0;
  resetButton.disabled = !hasFilters;

  activeFilters.innerHTML = hasFilters
    ? chips.map((c) => `<span class="chip">${c}</span>`).join("")
    : '<span class="chip chip-muted">No filters applied</span>';
}

function render() {
  const priority = priorityFilter.value;
  const status = statusFilter.value;

  const visible = requests.filter((item) =>
    (priority === ALL || item.priority === priority) &&
    (status === ALL || item.status === status)
  );

  renderActiveFilters(priority, status);

  resultCount.textContent =
    visible.length + " of " + requests.length + " requests";

  if (visible.length === 0) {
    cards.innerHTML = '<p class="empty">No requests match these filters.</p>';
    return;
  }

  cards.innerHTML = visible.map((item) => `
    <article class="card">
      <h2>${escapeHtml(item.id)}</h2>
      <p>${escapeHtml(item.title)}</p>
      <p class="meta">Priority: ${escapeHtml(item.priority)}</p>
      <p class="meta">Status: ${escapeHtml(item.status)}</p>
      <p class="meta">Owner: ${escapeHtml(item.owner)}</p>
    </article>
  `).join("");
}

function resetFilters() {
  priorityFilter.value = ALL;
  statusFilter.value = ALL;
  render();
}

async function loadRequests() {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error("HTTP " + response.status);
    dataSource.textContent = "Data source: data/feature-requests.csv";
    return parseCsv(await response.text());
  } catch (error) {
    dataSource.textContent =
      "Data source: built-in sample (CSV unavailable over file://)";
    return parseCsv(FALLBACK_CSV);
  }
}

async function init() {
  requests = await loadRequests();
  populateFilter(priorityFilter, requests.map((r) => r.priority), PRIORITY_ORDER);
  populateFilter(statusFilter, requests.map((r) => r.status), STATUS_ORDER);
  render();
}

priorityFilter.addEventListener("change", render);
statusFilter.addEventListener("change", render);
resetButton.addEventListener("click", resetFilters);
init();
