// admin.js

document.addEventListener("DOMContentLoaded", () => {
  fetchReports();
});

// Fetch all reports from backend
function fetchReports() {
  fetch("http://localhost:5000/api/reports")
    .then((res) => res.json())
    .then((data) => {
      displayReports(data);
    })
    .catch((err) => console.error("Error fetching reports:", err));
}

// Render reports in admin table
function displayReports(reports) {
  const table = document.getElementById("adminReportTableBody");
  table.innerHTML = "";

  reports.forEach((report) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${report.name}</td>
      <td>${report.location}</td>
      <td>${report.issueType}</td>
      <td>${report.description}</td>
      <td>${new Date(report.date).toLocaleDateString()}</td>
      <td>
        <button onclick="deactivateReport('${report._id}')" class="btn btn-warning">Deactivate</button>
        <button onclick="deleteReport('${report._id}')" class="btn btn-danger">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });
}

// DELETE report
function deleteReport(id) {
  if (!confirm("Are you sure you want to delete this report?")) return;

  fetch(`http://localhost:5000/api/reports/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        alert("Report deleted successfully!");
        fetchReports();
      } else {
        alert("Failed to delete report.");
      }
    })
    .catch((err) => console.error("Delete error:", err));
}

// PATCH (deactivate) report
function deactivateReport(id) {
  fetch(`http://localhost:5000/api/reports/${id}/deactivate`, {
    method: "PATCH",
  })
    .then((res) => {
      if (res.ok) {
        alert("Report deactivated!");
        fetchReports();
      } else {
        alert("Failed to deactivate report.");
      }
    })
    .catch((err) => console.error("Deactivate error:", err));
}
// admin.js

function deleteReport(id) {
  fetch(`/api/reports/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (res.ok) {
        // Remove the deleted report from DOM
        document.getElementById(`report-${id}`).remove();
      } else {
        alert("Failed to delete report.");
      }
    })
    .catch((err) => console.error("Error deleting report:", err));
}
