/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
const jwtHelper = require("../helper/tokenHelper");
// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "sdms-access-token-secret";
// Thời gian sống của refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "365d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "sdms-refresh-token-secret";
let connection = require('../data/connection');
/**
 * controller login
 * @param {*} req
 * @param {*} res
 */
let login = async (req, res) => {
    try {
        // Mình sẽ comment mô tả lại một số bước khi làm thực tế cho các bạn như sau nhé:
        // - Đầu tiên Kiểm tra xem email người dùng đã tồn tại trong hệ thống hay chưa?
        // - Nếu chưa tồn tại thì reject: User not found.
        // - Nếu tồn tại user thì sẽ lấy password mà user truyền lên, băm ra và so sánh với mật khẩu của user lưu trong Database
        // - Nếu password sai thì reject: Password is incorrect.
        // - Nếu password đúng thì chúng ta bắt đầu thực hiện tạo mã JWT và gửi về cho người dùng.
        console.log("Method = login");
        let user = null;
        try {
            // lay thong tin dang nhap cua user
            connection.acquire(function (err, con) {
                let username = req.body.username;
                let password = req.body.password;
                // let hashPassword = crypto.createHmac('sha256', secret)
                //     .update(password)
                //     .digest('hex');
                let sqlObject = "SELECT * FROM user WHERE 1 = 1 ";
                let sqlParams = [];
                sqlObject = sqlObject + " and username = ? ";
                sqlParams.push(username);
                sqlObject = sqlObject + " and password = ? ";
                sqlParams.push(password);
                sqlObject = sqlObject + " order by create_date";
                sqlObject = sqlObject + " desc limit 1";
                console.log("Login with " + username);
                try {
                    con.query(sqlObject, sqlParams, async function (err, result) {
                        con.release();
                        if (err) {
                            console.log(err.toString());
                            return res.status(500).json({
                                status: 0,
                                message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                            });
                        } else {
                            if (result.length === 0) {
                                return res.status(401).json({
                                    status: 0,
                                    message: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
                                });
                            } else {
                                user = result[0];
                                const accessToken = await jwtHelper.generateToken(result[0], accessTokenSecret, accessTokenLife);
                                const refreshToken = await jwtHelper.generateToken(result[0], refreshTokenSecret, refreshTokenLife);
                                // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
                                // Lưu vào  DB
                                try {
                                    connection.acquire(function (err, con) {
                                        try {
                                            let sqlUpdate = "UPDATE user SET access_token = ?,refresh_token = ?, last_update = now() " +
                                                "WHERE 1=1 and id= ?";
                                            let sqlUpdateParams = [];
                                            sqlUpdateParams.push(accessToken);
                                            sqlUpdateParams.push(refreshToken);
                                            sqlUpdateParams.push(result[0].id);
                                            con.query(sqlUpdate, sqlUpdateParams, function (err, result) {
                                                con.release();
                                                if (err) {
                                                    console.log(err.toString());
                                                    return res.status(500).json({
                                                        status: 0,
                                                        message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                                                    });
                                                } else {
                                                    return res.status(200).json({
                                                        'username': user.username,
                                                        'role_id': user.role_id,
                                                        'full_name': user.full_name,
                                                        accessToken,
                                                        refreshToken
                                                    });
                                                }
                                            });
                                        } catch (e) {
                                            con.release();
                                            console.log(e.message);
                                            return res.status(500).json({
                                                status: 0,
                                                message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                                            });
                                        }
                                    });
                                } catch (e) {
                                    return res.status(500).json({
                                        status: 0,
                                        message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                                    });
                                }
                            }
                        }
                    });
                } catch (e) {
                    con.release();
                    console.log(e.message);
                    return res.status(500).json({
                        status: 0,
                        message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                    });
                }
            });
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({
                status: 0,
                message: 'Có lỗi xảy ra vui lòng thử lại sau.'
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
let refreshToken = async (req, res) => {
    console.log("Method = refreshToken");
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken;
    // so sanh refresh token gui len voi refresh token trong DB
    let user = null;
    try {
        connection.acquire(function (err, con) {
            let sqlParams = [];
            let sqlObject = "SELECT * FROM user WHERE 1 = 1 ";
            sqlObject = sqlObject + " and refresh_token = ? ";
            sqlParams.push(refreshTokenFromClient);
            sqlObject = sqlObject + " order by create_date";
            sqlObject = sqlObject + " desc limit 1";
            try {
                con.query(sqlObject, sqlParams, async function (err, result) {
                    con.release();
                    if (err) {
                        console.log(err.toString());
                        res.status(403).json({
                            status: 0,
                            message: 'Không thể xác thực người dùng, vui lòng đăng nhập lại.'
                        });
                    } else {
                        if (result.length === 0) {
                            res.status(403).json({
                                status: 0,
                                message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.'
                            });
                        } else {
                            // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
                            if (result[0].refresh_token !== undefined) {
                                user = result[0];
                                try {
                                    // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
                                    const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
                                    // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
                                    // có thể mở comment dòng debug bên dưới để xem là rõ nhé.
                                    const userData = decoded.data;
                                    const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);
                                    // update token moi vao DB
                                    try {
                                        connection.acquire(function (err, con) {
                                            try {
                                                let sqlUpdate = "UPDATE user SET access_token = ?, last_update = now() " +
                                                    "WHERE 1=1 and id= ?";
                                                let sqlUpdateParams = [];
                                                sqlUpdateParams.push(accessToken);
                                                sqlUpdateParams.push(result[0].id);
                                                con.query(sqlUpdate, sqlUpdateParams, function (err, result) {
                                                    con.release();
                                                    if (err) {
                                                        console.log(err.toString());
                                                        return res.status(500).json({
                                                            status: 0,
                                                            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                                                        });
                                                    } else {
                                                        return res.status(200).json({
                                                            'username': user.username,
                                                            'role_id': user.role_id,
                                                            'full_name': user.full_name,
                                                            accessToken,
                                                            'refreshToken': user.refresh_token
                                                        });
                                                    }
                                                });
                                            } catch (e) {
                                                con.release();
                                                console.log(e.message);
                                                return res.status(500).json({
                                                    status: 0,
                                                    message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                                                });
                                            }
                                        });
                                    } catch (e) {
                                        return res.status(500).json({
                                            status: 0,
                                            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                                        });
                                    }
                                } catch (error) {
                                    return res.status(403).json({
                                        status: 0,
                                        message: 'Invalid refresh token.'
                                    });
                                }
                            } else {
                                // Không tìm thấy token trong request
                                return res.status(403).send({
                                    status: 0,
                                    message: 'No token provided.'
                                });
                            }
                        }
                    }
                });
            } catch (e) {
                con.release();
                console.log(e.message);
                return res.status(500).json({
                    status: 0,
                    message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                });
            }
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            status: 0,
            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
        });
    }
};
module.exports = {
    login: login,
    refreshToken: refreshToken,
};