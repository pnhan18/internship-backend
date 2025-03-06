const ReportService = require("../services/report.service");

class ReportController {
    async createReport(req, res) {
        try {
            const { user_id, post_id, comment } = req.body;
            const report = await ReportService.createReport(user_id, post_id, comment);

            res.status(201).json({
                message: "Báo cáo bài đăng thành công!",
                report
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllReports(req, res) {
        try {
            const reports = await ReportService.getAllReports();
            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server!", error: error.message });
        }
    }
}

module.exports = new ReportController();
