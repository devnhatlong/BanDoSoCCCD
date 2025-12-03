require('dotenv').config();
const DailyReport = require("../models/dailyReportModel");
const DailyReportAnnex = require("../models/dailyReportAnnexModel");
const Department = require("../models/departmentModel");
const User = require("../models/userModel");

const createDailyReport = async (reportData) => {
    try {
        const dailyReport = new DailyReport(reportData);
        const savedReport = await dailyReport.save();
        
        // Tìm và cập nhật DailyReportAnnex nếu đã tồn tại (dựa trên userId và cùng ngày tạo)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const existingAnnex = await DailyReportAnnex.findOne({
            userId: reportData.userId,
            createdAt: { $gte: today, $lt: tomorrow },
            dailyReportId: null
        });
        
        if (existingAnnex) {
            existingAnnex.dailyReportId = savedReport._id;
            await existingAnnex.save();
        }
        
        return savedReport;
    } catch (error) {
        console.error("Lỗi khi tạo báo cáo ngày:", error);
        throw error;
    }
};

const getDailyReports = async (user, page = 1, limit, fields, sort) => {
    try {
        const queries = {};

        // Nếu không phải admin, chỉ lấy báo cáo của chính user đó
        if (user.role !== "admin") {
            queries.userId = user._id;
        }

        // Lọc theo tên phòng ban
        if (fields?.departmentName) {
            const departments = await Department.find({
                departmentName: { $regex: fields.departmentName, $options: "i" },
            }).select("_id");

            const departmentIds = departments.map((d) => d._id);

            const users = await User.find({
                departmentId: { $in: departmentIds },
            }).select("_id");

            const userIds = users.map((u) => u._id);
            queries.userId = { $in: userIds };
        }

        // Lọc theo số báo cáo
        if (fields?.reportNumber) {
            queries.reportNumber = { $regex: fields.reportNumber, $options: "i" };
        }

        // Lọc theo ngày báo cáo
        if (fields?.reportDate) {
            const startDate = new Date(fields.reportDate);
            const endDate = new Date(fields.reportDate);
            endDate.setDate(endDate.getDate() + 1);
            
            queries.reportDate = {
                $gte: startDate,
                $lt: endDate
            };
        }

        // Lọc theo trạng thái
        if (fields?.status) {
            queries.status = fields.status;
        }

        // Nếu limit là "ALL", lấy toàn bộ dữ liệu
        if (limit === process.env.All_RECORDS) {
            const data = await DailyReport.find(queries)
                .populate({
                    path: "userId",
                    populate: {
                        path: "departmentId",
                        model: "Department",
                    },
                })
                .sort(sort || "-createdAt");
            
            // Thêm thông tin phụ lục vào mỗi báo cáo
            const reportsWithAnnex = await Promise.all(data.map(async (report) => {
                const annex = await DailyReportAnnex.findOne({
                    userId: report.userId._id,
                    reportDate: report.reportDate
                });
                return {
                    ...report.toObject(),
                    annex: annex
                };
            }));
            
            return {
                success: true,
                forms: reportsWithAnnex,
                total: reportsWithAnnex.length,
            };
        }

        // Sử dụng giá trị limit từ biến môi trường nếu không được truyền
        limit = limit || parseInt(process.env.DEFAULT_LIMIT, 10);

        // Tạo câu lệnh query
        let queryCommand = DailyReport.find(queries)
            .populate({
                path: "userId",
                populate: {
                    path: "departmentId", 
                    model: "Department",
                },
            });

        // Sorting
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            queryCommand = queryCommand.sort(sortBy);
        } else {
            queryCommand = queryCommand.sort('-createdAt');
        }

        // Pagination
        const skip = (page - 1) * limit;
        queryCommand = queryCommand.skip(skip).limit(limit);

        // Execute query
        const response = await queryCommand.exec();
        const counts = await DailyReport.countDocuments(queries);

        // Thêm thông tin phụ lục vào mỗi báo cáo
        const reportsWithAnnex = await Promise.all(response.map(async (report) => {
            const annex = await DailyReportAnnex.findOne({
                userId: report.userId._id,
                reportDate: report.reportDate
            });
            return {
                ...report.toObject(),
                annex: annex
            };
        }));

        return {
            success: true,
            forms: reportsWithAnnex,
            total: counts,
        };
    } catch (error) {
        console.error("Lỗi trong getDailyReports:", error);
        throw new Error("Không thể lấy danh sách báo cáo ngày");
    }
};

const getDailyReportById = async (id) => {
    const report = await DailyReport.findById(id)
        .populate({
            path: "userId",
            populate: {
                path: "departmentId",
                model: "Department",
            },
        });
    
    if (report) {
        // Tìm phụ lục tương ứng (dựa trên dailyReportId)
        const annex = await DailyReportAnnex.findOne({
            dailyReportId: report._id
        });
        
        return {
            ...report.toObject(),
            annex: annex
        };
    }
    
    return report;
};

const getDailyReportsByUser = async (userId) => {
    try {
        const reports = await DailyReport.find({ userId })
            .populate({
                path: "userId",
                populate: {
                    path: "departmentId",
                    model: "Department",
                },
            })
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước
        
        // Thêm thông tin phụ lục vào mỗi báo cáo
        const reportsWithAnnex = await Promise.all(reports.map(async (report) => {
            const annex = await DailyReportAnnex.findOne({
                dailyReportId: report._id
            });
            return {
                ...report.toObject(),
                annex: annex
            };
        }));
        
        return reportsWithAnnex;
    } catch (error) {
        console.error("Lỗi khi lấy báo cáo ngày theo user:", error);
        throw error;
    }
};

const updateDailyReport = async (id, updateData) => {
    try {
        const updatedReport = await DailyReport.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        return updatedReport;
    } catch (error) {
        console.error("Lỗi khi cập nhật báo cáo ngày:", error);
        return null;
    }
};

const deleteDailyReport = async (id) => {
    return await DailyReport.findByIdAndDelete(id);
};

const deleteMultipleDailyReports = async (ids) => {
    const response = await DailyReport.deleteMany({ _id: { $in: ids } });
    return {
        success: response.deletedCount > 0,
        deletedCount: response.deletedCount,
        message: response.deletedCount > 0 
            ? `Đã xóa ${response.deletedCount} báo cáo ngày thành công`
            : "Không có báo cáo ngày nào được xóa"
    };
};

module.exports = {
    createDailyReport,
    getDailyReports,
    getDailyReportById,
    getDailyReportsByUser,
    updateDailyReport,
    deleteDailyReport,
    deleteMultipleDailyReports,
};