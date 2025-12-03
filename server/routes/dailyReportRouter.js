const router = require("express").Router();
const ctrls = require("../controllers/dailyReportController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, ctrls.createDailyReport);
router.get("/", verifyAccessToken, ctrls.getDailyReports);
router.get("/user/:userId", verifyAccessToken, ctrls.getDailyReportsByUser);
router.get("/:id", verifyAccessToken, ctrls.getDailyReportById);
router.put("/:id", verifyAccessToken, ctrls.updateDailyReport);
router.delete("/delete-multiple", verifyAccessToken, ctrls.deleteMultipleDailyReports);
router.delete("/:id", verifyAccessToken, ctrls.deleteDailyReport);

module.exports = router;