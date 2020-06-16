/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */

const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/authMiddleware");
const AuthController = require("../controller/authController");
const ServerController = require("../controller/serverController");

/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initAPIs = (app) => {
    // các api không cần jwt authenticate
    router.get('/sdms/getCurentTime', ServerController.getCurrentTime);
    router.post('/sdms/login', AuthController.login);
    router.post('/sdms/refreshToken', AuthController.refreshToken);

    // các api cần authenticate với jwt
    router.use(AuthMiddleWare.isAuth);
    // TODO create api with jwt authentication


    // return routing
    return app.use("/", router);
};
module.exports = initAPIs;