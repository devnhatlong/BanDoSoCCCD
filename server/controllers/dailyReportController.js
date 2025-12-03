require('dotenv').config();
const DailyReportService = require("../services/dailyReportService");
const asyncHandler = require("express-async-handler");

const createDailyReport = asyncHandler(async (req, res) => {
    const { 
        reportNumber,
        securityBorderContent,
        securityFieldsContent,
        socialOrderContent,
        nationalSecurityWork,
        crimeInvestigationWork,
        otherWork,
        partyBuildingWork,
        suggestions,
        status,
        isDraft,
        isSubmitted
    } = req.body;
    const { _id: userId, departmentId } = req.user;

    // Kiểm tra thông tin bắt buộc
    if (!userId) {
        throw new Error("Thiếu thông tin bắt buộc (userId)");
    }

    // Lưu báo cáo vào cơ sở dữ liệu
    const reportData = {
        userId,
        departmentId,
        reportNumber,
        securityBorderContent,
        securityFieldsContent,
        socialOrderContent,
        nationalSecurityWork,
        crimeInvestigationWork,
        otherWork,
        partyBuildingWork,
        suggestions,
        status: status || 'draft',
        isDraft: isDraft !== undefined ? isDraft : true,
        isSubmitted: isSubmitted || false
    };

    const savedReport = await DailyReportService.createDailyReport(reportData);

    res.status(201).json({
        success: true,
        data: savedReport,
        message: "Lưu báo cáo ngày thành công",
    });
});

const getDailyReports = asyncHandler(async (req, res) => {
    const { page = 1, limit, sort, ...fields } = req.query;

    const response = await DailyReportService.getDailyReports(req.user, page, limit, fields, sort);

    res.status(200).json({
        success: true,
        data: response.forms,
        total: response.total,
        message: "Lấy danh sách báo cáo ngày thành công",
    });
});

const getDailyReportById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await DailyReportService.getDailyReportById(id);

    res.status(response ? 200 : 404).json({
        success: !!response,
        data: response || null,
        message: response
            ? "Lấy thông tin báo cáo ngày thành công"
            : "Không tìm thấy báo cáo ngày",
    });
});

const getDailyReportsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const response = await DailyReportService.getDailyReportsByUser(userId);

    res.status(200).json({
        success: true,
        data: response || [],
        message: "Lấy danh sách báo cáo ngày thành công",
    });
});

const updateDailyReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        reportNumber,
        securityBorderContent,
        securityFieldsContent,
        socialOrderContent,
        nationalSecurityWork,
        crimeInvestigationWork,
        otherWork,
        partyBuildingWork,
        suggestions,
        status,
        isDraft,
        isSubmitted
    } = req.body;

    // Chuẩn bị dữ liệu để cập nhật
    const updateData = {
        reportNumber,
        securityBorderContent,
        securityFieldsContent,
        socialOrderContent,
        nationalSecurityWork,
        crimeInvestigationWork,
        otherWork,
        partyBuildingWork,
        suggestions,
        status,
        isDraft,
        isSubmitted
    };

    const response = await DailyReportService.updateDailyReport(id, updateData);

    res.status(response ? 200 : 400).json({
        success: !!response,
        data: response || null,
        message: response
            ? "Cập nhật báo cáo ngày thành công"
            : "Không thể cập nhật báo cáo ngày",
    });
});

const deleteDailyReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await DailyReportService.deleteDailyReport(id);

    res.status(response ? 200 : 400).json({
        success: !!response,
        message: response
            ? "Xóa báo cáo ngày thành công"
            : "Không thể xóa báo cáo ngày",
    });
});

const deleteMultipleDailyReports = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids) throw new Error("Thiếu id");

    const response = await DailyReportService.deleteMultipleDailyReports(ids);

    res.status(response.success ? 200 : 400).json({
        success: response.success,
        message: response.message,
        deletedCount: response.deletedCount,
    });
});

module.exports = {
    createDailyReport,
    getDailyReports,
    getDailyReportById,
    getDailyReportsByUser,
    updateDailyReport,
    deleteDailyReport,
    deleteMultipleDailyReports
};