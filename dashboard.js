// client/js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  fetchReports();
});

// Fetch reports from the backend API
async function fetchReports() {
  try {
    const response = await fetch("http://localhost:5000/api/reports");
    const reports = await response.json();

    const reportContainer = document.getElementById("report-list");
    reportContainer.innerHTML = ""; // Clear previous content

    if (reports.length === 0) {
      reportContainer.innerHTML = "<p>No reports submitted yet.</p>";
      return;
    }

    reports.forEach((report, index) => {
      const reportCard = document.createElement("div");
      reportCard.className = "report-card";
      reportCard.innerHTML = `
        <h3>Report #${index + 1}</h3>
        <p><strong>Name:</strong> ${report.name}</p>
        <p><strong>Location:</strong> ${report.location}</p>
        <p><strong>Issue Type:</strong> ${report.issueType}</p>
        <p><strong>Description:</strong> ${report.description}</p>
        <p><strong>Date:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
        <hr>
      `;
      reportContainer.appendChild(reportCard);
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    document.getElementById("report-list").innerHTML = "<p>Error loading reports.</p>";
  }
}
router.get("/", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const reportCount = await Report.countDocuments();
    const activeAreas = await Report.distinct("location");

    res.json({
      totalUsers: userCount,
      totalReports: reportCount,
      activeAreas: activeAreas.length
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});
async function loadDashboardStats() {
  try {
    const response = await fetch("/api/dashboard");
    const data = await response.json();

    document.getElementById("totalUsers").innerText = data.totalUsers;
    document.getElementById("totalReports").innerText = data.totalReports;
    document.getElementById("activeAreas").innerText = data.activeAreas;
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/reports')
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById('report-table-body');
      tableBody.innerHTML = ''; // Clear old content

      data.forEach(report => {
        const row = `
          <tr>
            <td>${report.title || 'N/A'}</td>
            <td>${report.location || 'N/A'}</td>
            <td>${report.status || 'Pending'}</td>
            <td>${new Date(report.createdAt).toLocaleString()}</td>
          </tr>`;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error('Error loading reports:', error);
    });
});


loadDashboardStats();

