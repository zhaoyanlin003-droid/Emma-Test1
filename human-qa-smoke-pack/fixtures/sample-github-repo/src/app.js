const requests = [
  { id: "FR-101", title: "Add export to CSV", priority: "High", status: "Planned", owner: "Maya" },
  { id: "FR-102", title: "Improve empty state copy", priority: "Medium", status: "In Progress", owner: "Elena" },
  { id: "FR-103", title: "Add keyboard shortcuts", priority: "Low", status: "Backlog", owner: "Jordan" },
  { id: "FR-104", title: "Fix chart tooltip overlap", priority: "High", status: "In Progress", owner: "Liam" },
  { id: "FR-105", title: "Add dark mode", priority: "Medium", status: "Planned", owner: "Nina" },
];

const priorityFilter = document.querySelector("#priorityFilter");
const statusFilter = document.querySelector("#statusFilter");
const cards = document.querySelector("#cards");
const resultCount = document.querySelector("#resultCount");

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
render();
