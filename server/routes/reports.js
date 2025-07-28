const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");

// ================================
// POST /api/reports
// ================================
// Create a new report (user or admin)
router.post("/", auth(["user", "admin"]), async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      user: req.session.user.id,
      status: "Pending",
      createdAt: new Date()
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);

  } catch (err) {
    console.error("❌ Failed to create report:", err);
    res.status(500).json({ error: "Failed to create report" });
  }
});

// ================================
// GET /api/reports
// ================================
// Fetch all reports (admin sees all, user sees only their own)
router.get("/", auth(["user", "admin"]), async (req, res) => {
  try {
    const userRole = req.session.user.role;
    const userId = req.session.user.id;

    const filter = userRole === "admin" ? {} : { user: userId };
    const reports = await Report.find(filter).sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {
    console.error("❌ Failed to fetch reports:", err);
    res.status(500).json({ error: "Failed to load reports" });
  }
});

// ================================
// DELETE /api/reports/:id
// ================================
// Delete a report (admin only)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted successfully" });

  } catch (err) {
    console.error("❌ Failed to delete report:", err);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

// ================================
// PATCH /api/reports/:id/status
// ================================
// Update report status (admin only)
router.patch("/:id/status", auth(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("❌ Failed to update report status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
