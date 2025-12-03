const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var DailyReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportNumber: {
        type: String,
        default: "",
        trim: true,
    },
    // Section I.1.1 - Liên quan đến An ninh Biên giới, biển đảo
    securityBorderContent: {
        type: String,
        default: "",
    },
    // Section I.1.2 - An ninh trên các lĩnh vực
    securityFieldsContent: {
        type: String,
        default: "",
    },
    // Section I.2 - Tình hình trật tự an toàn xã hội
    socialOrderContent: {
        type: String,
        default: "",
    },
    // Section II.1 - Công tác bảo vệ ANQG
    nationalSecurityWork: {
        type: String,
        default: "",
    },
    // Section II.2 - Công tác điều tra, xử lý tội phạm
    crimeInvestigationWork: {
        type: String,
        default: "",
    },
    // Section II.3 - Công tác khác
    otherWork: {
        type: String,
        default: "",
    },
    // Section II.4 - Công tác xây dựng đảng, xây dựng lực lượng  
    partyBuildingWork: {
        type: String,
        default: "",
    },
    // Section III - Kiến nghị, đề xuất
    suggestions: {
        type: String,
        default: "",
    },
    // Trạng thái báo cáo
    status: {
        type: String,
        enum: ['draft', 'submitted'],
        default: 'draft',
    },
    // Đánh dấu có phải bản nháp không
    isDraft: {
        type: Boolean,
        default: true,
    },
    // Đánh dấu đã gửi báo cáo chưa
    isSubmitted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

// Export the model
module.exports = mongoose.model('DailyReport', DailyReportSchema);