(function () {
  "use strict";

  var STORAGE_KEY = "team-launch-checklist-v1";

  var DEFAULTS = [
    {
      id: "planning",
      title: "Planning",
      icon: "🗺️",
      items: [
        "Define launch goals and success metrics",
        "Set the target launch date",
        "Identify stakeholders and owners",
        "Agree on scope and non-goals",
        "Build the project timeline",
        "Assess risks and mitigation plans"
      ]
    },
    {
      id: "content",
      title: "Content",
      icon: "✍️",
      items: [
        "Draft announcement / blog post",
        "Prepare product screenshots and demo",
        "Write release notes and docs",
        "Create social media assets",
        "Prepare email campaign",
        "Proofread all copy"
      ]
    },
    {
      id: "approvals",
      title: "Approvals",
      icon: "✅",
      items: [
        "Legal and compliance sign-off",
        "Security review complete",
        "Brand and design review",
        "Leadership / exec approval",
        "Pricing and packaging confirmed",
        "Support team briefed"
      ]
    },
    {
      id: "launch-day",
      title: "Launch Day",
      icon: "🎉",
      items: [
        "Deploy to production",
        "Smoke test critical flows",
        "Publish announcement and assets",
        "Monitor dashboards and error rates",
        "Share launch in team channels",
        "Capture feedback and log issues"
      ]
    }
  ];

  var state = load();

  var board = document.getElementById("board");
  var overallFill = document.getElementById("overallFill");
  var overallLabel = document.getElementById("overallLabel");

  function uid() {
    return "i" + Math.random().toString(36).slice(2, 9);
  }

  function makeDefaultState() {
    return DEFAULTS.map(function (section) {
      return {
        id: section.id,
        title: section.title,
        icon: section.icon,
        items: section.items.map(function (text) {
          return { id: uid(), text: text, done: false };
        })
      };
    });
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return makeDefaultState();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return makeDefaultState();
      return parsed;
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

  function render() {
    board.innerHTML = "";

    state.forEach(function (section) {
      var done = section.items.filter(function (i) { return i.done; }).length;
      var total = section.items.length;
      var p = pct(done, total);

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

      section.items.forEach(function (item) {
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
        li.appendChild(remove);
        list.appendChild(li);
      });

      el.appendChild(list);

      var form = document.createElement("form");
      form.className = "add-form";
      var input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Add a task…";
      var addBtn = document.createElement("button");
      addBtn.type = "submit";
      addBtn.textContent = "+";
      form.appendChild(input);
      form.appendChild(addBtn);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        section.items.push({ id: uid(), text: text, done: false });
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
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

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
