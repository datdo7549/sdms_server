/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
const jwtHelper = require("../helper/tokenHelper");
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "sdms-access-token-secret";
/**
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let isAuth = async (req, res, next) => {
    // Lấy token được gửi lên từ phía client qua header
    const tokenFromClient = req.headers["x-access-token"];
    if (tokenFromClient) {
        // Nếu tồn tại token
        try {
            // Thực hiện giải mã token xem có hợp lệ hay không?
            // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
            req.jwtDecoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            // Cho phép req đi tiếp sang controller.
            next();
        } catch (error) {
            // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
            return res.status(401).json({
                status: 0,
                message: 'Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại.'
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            status: 0,
            message: 'Không thể xác thực người dùng vui lòng kiểm tra thông tin đăng nhập.'
        });
    }
};
module.exports = {
    isAuth: isAuth,
};