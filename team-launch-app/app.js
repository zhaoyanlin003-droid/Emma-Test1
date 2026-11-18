(function () {
  "use strict";

  var STORAGE_KEY = "team-launch-checklist-v1";
  var PRIORITIES = ["High", "Medium", "Low"];

  var DEFAULTS = [
    {
      id: "planning",
      title: "Planning",
      icon: "🗺️",
      items: [
        ["Define launch goals and success metrics", "High"],
        ["Set the target launch date", "High"],
        ["Identify stakeholders and owners", "Medium"],
        ["Agree on scope and non-goals", "Medium"],
        ["Build the project timeline", "Medium"],
        ["Assess risks and mitigation plans", "Low"]
      ]
    },
    {
      id: "content",
      title: "Content",
      icon: "✍️",
      items: [
        ["Draft announcement / blog post", "High"],
        ["Prepare product screenshots and demo", "Medium"],
        ["Write release notes and docs", "Medium"],
        ["Create social media assets", "Low"],
        ["Prepare email campaign", "Medium"],
        ["Proofread all copy", "Low"]
      ]
    },
    {
      id: "approvals",
      title: "Approvals",
      icon: "✅",
      items: [
        ["Legal and compliance sign-off", "High"],
        ["Security review complete", "High"],
        ["Brand and design review", "Medium"],
        ["Leadership / exec approval", "High"],
        ["Pricing and packaging confirmed", "Medium"],
        ["Support team briefed", "Low"]
      ]
    },
    {
      id: "launch-day",
      title: "Launch Day",
      icon: "🎉",
      items: [
        ["Deploy to production", "High"],
        ["Smoke test critical flows", "High"],
        ["Publish announcement and assets", "High"],
        ["Monitor dashboards and error rates", "Medium"],
        ["Share launch in team channels", "Medium"],
        ["Capture feedback and log issues", "Low"]
      ]
    }
  ];

  var state = load();

  var board = document.getElementById("board");
  var overallFill = document.getElementById("overallFill");
  var overallLabel = document.getElementById("overallLabel");
  var priorityFilter = document.getElementById("priorityFilter");
  var statusFilter = document.getElementById("statusFilter");
  var filterSummary = document.getElementById("filterSummary");

  function uid() {
    return "i" + Math.random().toString(36).slice(2, 9);
  }

  function normalizePriority(value) {
    return PRIORITIES.indexOf(value) === -1 ? "Medium" : value;
  }

  function makeDefaultState() {
    return DEFAULTS.map(function (section) {
      return {
        id: section.id,
        title: section.title,
        icon: section.icon,
        items: section.items.map(function (entry) {
          return { id: uid(), text: entry[0], priority: entry[1], done: false };
        })
      };
    });
  }

  // Ensure every item has a valid priority (migrates checklists saved before
  // filters existed, where items had no priority field).
  function normalizeState(data) {
    data.forEach(function (section) {
      (section.items || []).forEach(function (item) {
        item.priority = normalizePriority(item.priority);
      });
    });
    return data;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return makeDefaultState();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return makeDefaultState();
      return normalizeState(parsed);
    } catch (e) {
      return makeDefaultState();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage unavailable (e.g. file:// in some browsers) — keep running in-memory */
    }
  }

  function counts() {
    var total = 0;
    var done = 0;
    state.forEach(function (section) {
      section.items.forEach(function (item) {
        total++;
        if (item.done) done++;
      });
    });
    return { total: total, done: done };
  }

  function pct(done, total) {
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }

  // A single source of truth for "does this item pass the active filters?".
  // render() reads both dropdowns fresh on every call, so changing either
  // filter preserves the other — they always compose.
  function matchesFilters(item, priority, status) {
    var priorityOk = priority === "all" || item.priority === priority;
    var statusOk =
      status === "all" ||
      (status === "done" && item.done) ||
      (status === "todo" && !item.done);
    return priorityOk && statusOk;
  }

  function render() {
    board.innerHTML = "";

    var priority = priorityFilter.value;
    var status = statusFilter.value;
    var visibleCount = 0;
    var totalCount = 0;

    state.forEach(function (section) {
      var done = section.items.filter(function (i) { return i.done; }).length;
      var total = section.items.length;
      var p = pct(done, total);

      var matching = section.items.filter(function (i) {
        return matchesFilters(i, priority, status);
      });
      visibleCount += matching.length;
      totalCount += total;

      var el = document.createElement("section");
      el.className = "section";

      var head = document.createElement("div");
      head.className = "section-head";
      var h2 = document.createElement("h2");
      h2.innerHTML = "<span>" + section.icon + "</span> " + escapeHtml(section.title);
      var count = document.createElement("span");
      count.className = "section-count";
      count.textContent = done + "/" + total;
      head.appendChild(h2);
      head.appendChild(count);
      el.appendChild(head);

      var bar = document.createElement("div");
      bar.className = "section-bar";
      var fill = document.createElement("div");
      fill.className = "section-fill";
      fill.style.width = p + "%";
      bar.appendChild(fill);
      el.appendChild(bar);

      var list = document.createElement("ul");
      list.className = "items";

      matching.forEach(function (item) {
        var li = document.createElement("li");
        li.className = "item" + (item.done ? " done" : "");

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = item.done;
        cb.id = item.id;
        cb.addEventListener("change", function () {
          item.done = cb.checked;
          save();
          render();
        });

        var label = document.createElement("label");
        label.htmlFor = item.id;
        label.textContent = item.text;

        var badge = document.createElement("span");
        badge.className = "badge badge-" + item.priority.toLowerCase();
        badge.textContent = item.priority;

        var remove = document.createElement("button");
        remove.className = "remove";
        remove.type = "button";
        remove.title = "Remove item";
        remove.textContent = "×";
        remove.addEventListener("click", function () {
          section.items = section.items.filter(function (i) { return i.id !== item.id; });
          save();
          render();
        });

        li.appendChild(cb);
        li.appendChild(label);
        li.appendChild(badge);
        li.appendChild(remove);
        list.appendChild(li);
      });

      el.appendChild(list);

      if (matching.length === 0) {
        var empty = document.createElement("p");
        empty.className = "section-empty";
        empty.textContent = total === 0
          ? "No tasks yet."
          : "No tasks match the current filters.";
        el.appendChild(empty);
      }

      var form = document.createElement("form");
      form.className = "add-form";
      var input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Add a task…";
      var prioritySelect = document.createElement("select");
      prioritySelect.className = "add-priority";
      prioritySelect.title = "Priority for the new task";
      PRIORITIES.forEach(function (name) {
        var opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        if (name === "Medium") opt.selected = true;
        prioritySelect.appendChild(opt);
      });
      var addBtn = document.createElement("button");
      addBtn.type = "submit";
      addBtn.textContent = "+";
      form.appendChild(input);
      form.appendChild(prioritySelect);
      form.appendChild(addBtn);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        section.items.push({
          id: uid(),
          text: text,
          priority: normalizePriority(prioritySelect.value),
          done: false
        });
        input.value = "";
        save();
        render();
      });
      el.appendChild(form);

      board.appendChild(el);
    });

    var c = counts();
    var overall = pct(c.done, c.total);
    overallFill.style.width = overall + "%";
    overallLabel.textContent = overall + "% complete";

    var filtered = priority !== "all" || status !== "all";
    filterSummary.textContent = filtered
      ? "Showing " + visibleCount + " of " + totalCount + " tasks"
      : "";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  // Filters: each one just re-renders. render() reads both dropdown values,
  // so adjusting the status filter keeps the current priority filter and vice versa.
  priorityFilter.addEventListener("change", render);
  statusFilter.addEventListener("change", render);

  // Toolbar actions
  document.getElementById("resetBtn").addEventListener("click", function () {
    if (confirm("Reset the checklist to its default items? This clears your saved progress.")) {
      state = makeDefaultState();
      save();
      render();
    }
  });

  document.getElementById("exportBtn").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "team-launch-checklist.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  var importFile = document.getElementById("importFile");
  document.getElementById("importBtn").addEventListener("click", function () {
    importFile.click();
  });
  importFile.addEventListener("change", function () {
    var file = importFile.files && importFile.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        state = parsed;
        save();
        render();
      } catch (e) {
        alert("Could not import that file — it is not a valid checklist export.");
      }
      importFile.value = "";
    };
    reader.readAsText(file);
  });

  render();
})();
