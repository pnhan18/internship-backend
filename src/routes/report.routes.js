const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/report.controller");

router.post("/report", ReportController.createReport);
router.get("/reports", ReportController.getAllReports);

module.exports = router;
