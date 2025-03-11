const Report = require("../models/Report.model");

class ReportService {
    async createReport(user_id, post_id, comment) {
        if (!user_id || !post_id) {
            throw new Error("Thiếu thông tin user_id hoặc post_id!");
        }
        const report = await Report.create({ user_id, post_id, comment });
        return report;
    }

    async getAllReports() {
        return await Report.findAll();
    }
}

module.exports = new ReportService();
