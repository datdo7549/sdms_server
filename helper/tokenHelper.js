/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
const jwt = require("jsonwebtoken");
/**
 * private function generateToken
 * @param user
 * @param secretSignature
 * @param tokenLife
 */
let generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
        const userData = {
            id: user.id,
            name: user.username,
            role: user.role_id,
        };
        // Thực hiện ký và tạo token
        jwt.sign(
            {data: userData},
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    });
};

let generateTokenRole = (role, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
        // Thực hiện ký và tạo token
        jwt.sign(
            {data: role},
            secretSignature,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    });
};

/**
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} secretKey
 */
let verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
};


module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    generateTokenRole:generateTokenRole,
};