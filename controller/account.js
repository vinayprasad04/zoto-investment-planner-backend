const { catchAsync } = require("../utils/catch-async");

module.exports.account = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: "auth"
    })
})