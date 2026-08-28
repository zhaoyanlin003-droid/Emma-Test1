const requests = [
  { id: "FR-101", title: "Add export to CSV", priority: "High", status: "Planned", owner: "Maya" },
  { id: "FR-102", title: "Improve empty state copy", priority: "Medium", status: "In Progress", owner: "Elena" },
  { id: "FR-103", title: "Add keyboard shortcuts", priority: "Low", status: "Backlog", owner: "Jordan" },
  { id: "FR-104", title: "Fix chart tooltip overlap", priority: "High", status: "In Progress", owner: "Liam" },
  { id: "FR-105", title: "Add dark mode", priority: "Medium", status: "Planned", owner: "Nina" },
];

// Preferred display order; any value not listed is appended alphabetically.
const PRIORITY_ORDER = ["High", "Medium", "Low"];
const STATUS_ORDER = ["Backlog", "Planned", "In Progress", "Done"];
const STORAGE_KEY = "feature-request-dashboard.filters";

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const clearFilters = document.querySelector("#clearFilters");
const cards = document.querySelector("#cards");
const resultCount = document.querySelector("#resultCount");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function uniqueValues(key, order) {
  const values = [...new Set(requests.map((item) => item[key]))];
  return values.sort((a, b) => {
    const rankA = order.indexOf(a);
    const rankB = order.indexOf(b);
    if (rankA === -1 && rankB === -1) return a.localeCompare(b);
    if (rankA === -1) return 1;
    if (rankB === -1) return -1;
    return rankA - rankB;
  });
}

function matches(item, priority, status) {
  return (priority === "all" || item.priority === priority) &&
    (status === "all" || item.status === status);
}

// Counts are contextual: each option shows how many requests it would show
// given the *other* filter's current value.
function buildOptions(select, key, values, otherKey, otherValue) {
  const previous = select.value;
  const inScope = requests.filter(
    (item) => otherValue === "all" || item[otherKey] === otherValue
  );

  const options = [`<option value="all">All (${inScope.length})</option>`];
  for (const value of values) {
    const count = inScope.filter((item) => item[key] === value).length;
    options.push(
      `<option value="${escapeHtml(value)}">${escapeHtml(value)} (${count})</option>`
    );
  }

  select.innerHTML = options.join("");
  select.value = previous || "all";
  if (!select.value) select.value = "all";
}

function saveFilters(priority, status) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ priority, status }));
  } catch {
    // Storage can be unavailable (private mode, file:// restrictions) — ignore.
  }
}

function loadFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      priority: typeof saved.priority === "string" ? saved.priority : "all",
      status: typeof saved.status === "string" ? saved.status : "all",
    };
  } catch {
    return { priority: "all", status: "all" };
  }
}

function render() {
  const priority = priorityFilter.value;
  const status = statusFilter.value;

  buildOptions(priorityFilter, "priority", priorities, "status", status);
  buildOptions(statusFilter, "status", statuses, "priority", priority);

  const visible = requests.filter((item) => matches(item, priority, status));

  resultCount.textContent =
    visible.length + " of " + requests.length + " requests";

  clearFilters.disabled = priority === "all" && status === "all";
  saveFilters(priority, status);

  if (visible.length === 0) {
    cards.innerHTML = '<p class="empty">No requests match these filters.</p>';
    return;
  }

  cards.innerHTML = visible.map((item) => `
    <article class="card">
      <h2>${escapeHtml(item.id)}</h2>
      <p>${escapeHtml(item.title)}</p>
      <p class="meta">Priority: ${escapeHtml(item.priority)}</p>
      <p class="meta">Status: <span class="badge badge-${slug(item.status)}">${escapeHtml(item.status)}</span></p>
      <p class="meta">Owner: ${escapeHtml(item.owner)}</p>
    </article>
  `).join("");
}

const priorities = uniqueValues("priority", PRIORITY_ORDER);
const statuses = uniqueValues("status", STATUS_ORDER);

const saved = loadFilters();
buildOptions(priorityFilter, "priority", priorities, "status", "all");
buildOptions(statusFilter, "status", statuses, "priority", "all");
priorityFilter.value = priorities.includes(saved.priority) ? saved.priority : "all";
statusFilter.value = statuses.includes(saved.status) ? saved.status : "all";

priorityFilter.addEventListener("change", render);
statusFilter.addEventListener("change", render);
clearFilters.addEventListener("click", () => {
  priorityFilter.value = "all";
  statusFilter.value = "all";
  render();
});

render();
