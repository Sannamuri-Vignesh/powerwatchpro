// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname;

  // Common: Highlight active link
  highlightActiveNav();

  // Report Page Logic
  if (page.includes("report.html")) {
    handleReportForm();
  }

  // Dashboard Logic
  if (page.includes("dashboard.html")) {
    loadDashboardReports();
  }

  // Admin Page Logic
  if (page.includes("admin.html")) {
    handleAdminActions();
  }

  // About Page Animation
  if (page.includes("about.html")) {
    animateTeamMembers();
  }
});

// ===== Functions =====

function highlightActiveNav() {
  const links = document.querySelectorAll("nav ul li a");
  links.forEach(link => {
    if (window.location.href.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });
}

function handleReportForm() {
  const form = document.getElementById("reportForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      location: form.location.value,
      issueType: form.issueType.value,
      description: form.description.value,
      time: form.time.value
    };
    console.log("Report Submitted:", data);
    alert("✅ Report submitted successfully!");
    form.reset();
  });
}

function loadDashboardReports() {
  const reports = [
    {
      issue: "Power Cut",
      location: "Gandhi Nagar",
      status: "Pending",
      date: "2025-07-08 08:30"
    },
    {
      issue: "Low Voltage",
      location: "JP Colony",
      status: "Resolved",
      date: "2025-07-06 22:10"
    }
  ];

  const tbody = document.querySelector("table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  reports.forEach(r => {
    const row = `
      <tr>
        <td>${r.issue}</td>
        <td>${r.location}</td>
        <td><span class="status ${r.status.toLowerCase()}">${r.status}</span></td>
        <td>${r.date}</td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function handleAdminActions() {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.textContent.trim();
      const row = btn.closest("tr");
      const statusSpan = row.querySelector(".status");
      const name = row.querySelector("td")?.textContent;

      if (action === "Deactivate") {
        statusSpan.textContent = "Inactive";
        statusSpan.className = "status inactive";
      } else if (action === "Activate") {
        statusSpan.textContent = "Active";
        statusSpan.className = "status active";
      } else if (action === "Delete") {
        row.remove();
      }

      alert(`✅ ${name} has been ${action.toLowerCase()}d`);
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;

  // Only run this code on index.html
  if (currentPage.includes("index.html") || currentPage === "/" || currentPage === "/powerwatch/") {
    console.log("🟢 Running JavaScript on index.html");

    // Example: Animate Hero Text
    const heading = document.querySelector(".hero-heading");
    if (heading) {
      heading.style.opacity = 0;
      setTimeout(() => {
        heading.style.transition = "opacity 1s ease-in";
        heading.style.opacity = 1;
      }, 300);
    }
  }
});


function animateTeamMembers() {
  const members = document.querySelectorAll(".team-member");
  members.forEach((member, i) => {
    member.style.opacity = 0;
    setTimeout(() => {
      member.style.transition = "opacity 0.8s ease";
      member.style.opacity = 1;
    }, i * 300);
  });
}
