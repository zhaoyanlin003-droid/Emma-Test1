// Single source of truth is data/feature-requests.csv. When the page is served
// over http(s) we fetch that file directly; when it is opened straight from
// disk (file://) browsers block fetch, so we fall back to this embedded copy of
// the same CSV. Keep the two in sync if you edit the data.
const EMBEDDED_CSV = `id,title,priority,status,owner
FR-101,Add export to CSV,High,Planned,Maya
FR-102,Improve empty state copy,Medium,In Progress,Elena
FR-103,Add keyboard shortcuts,Low,Backlog,Jordan
FR-104,Fix chart tooltip overlap,High,In Progress,Liam
FR-105,Add dark mode,Medium,Planned,Nina
`;

// Preferred display order for known values; anything else is appended A–Z.
const PRIORITY_ORDER = ["High", "Medium", "Low"];
const STATUS_ORDER = ["Backlog", "Planned", "In Progress", "Done"];

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const cards = document.querySelector("#cards");
const resultCount = document.querySelector("#resultCount");

let requests = [];

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map((h) => h.trim());
  return lines.map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, i) => {
      row[header] = (values[i] ?? "").trim();
    });
    return row;
  });
}

async function loadRequests() {
  try {
    const response = await fetch("../data/feature-requests.csv", { cache: "no-store" });
    if (response.ok) {
      return parseCsv(await response.text());
    }
  } catch (err) {
    // file:// or network blocked — fall back to the embedded copy below.
  }
  return parseCsv(EMBEDDED_CSV);
}

function sortByPreferred(values, order) {
  const unique = [...new Set(values)];
  return unique.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

function populateFilter(select, values, order) {
  const current = select.value;
  const options = sortByPreferred(values, order)
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
  select.innerHTML = `<option value="all">All</option>${options}`;
  // Keep the current selection if it still exists in the data.
  select.value = [...select.options].some((o) => o.value === current) ? current : "all";
}

function render() {
  const priority = priorityFilter.value;
  const status = statusFilter.value;

  const visible = requests.filter((item) =>
    (priority === "all" || item.priority === priority) &&
    (status === "all" || item.status === status)
  );

  resultCount.textContent =
    visible.length + " of " + requests.length + " requests";

  if (visible.length === 0) {
    cards.innerHTML = '<p class="empty">No requests match these filters.</p>';
    return;
  }

  cards.innerHTML = visible.map((item) => `
    <article class="card">
      <h2>${item.id}</h2>
      <p>${item.title}</p>
      <p class="meta">Priority: ${item.priority}</p>
      <p class="meta">Status: ${item.status}</p>
      <p class="meta">Owner: ${item.owner}</p>
    </article>
  `).join("");
}

priorityFilter.addEventListener("change", render);
statusFilter.addEventListener("change", render);

async function init() {
  requests = await loadRequests();
  populateFilter(priorityFilter, requests.map((r) => r.priority), PRIORITY_ORDER);
  populateFilter(statusFilter, requests.map((r) => r.status), STATUS_ORDER);
  render();
}

init();
