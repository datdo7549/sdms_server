/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */

const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/authMiddleware");
const AuthController = require("../controller/authController");
const ServerController = require("../controller/serverController");
const InsertUser =require("../controller/insertUser");
const GetListTeacher=require("../controller/getListTeacher");
const UpdatePassword=require("../controller/updatePassword");
const InsertStudent=require("../controller/inseretStudent");
const GetListStudentByAge=require("../controller/getListStudentByAge");
const GetListStudentByClass=require("../controller/getListStudentByClass");
const SaveListStudentToClass=require("../controller/saveListStudentToClass");
const GetListStudentNotHaveClass=require("../controller/getListStudentNotHaveClass");
const UpdateScore=require("../controller/updateScore");
const SearchStudent=require("../controller/searchStudent");
const UpdatePolicy=require("../controller/updatePolicy");
const GetPolicies=require("../controller/getPolicy");
const StatisticBySubject=require("../controller/statisticBySubject")
/**
 * Init all APIs on your application
 * @param {*} app from express
 */
let initAPIs = (app) => {
    // các api không cần jwt authenticate
    router.get('/sdms/getCurentTime', ServerController.getCurrentTime);
    router.post('/sdms/login', AuthController.login);
    router.post('/sdms/refreshToken', AuthController.refreshToken);
    router.post('/sdms/insertUser',InsertUser.insertUser);
    router.post('/sdms/updatePassword',UpdatePassword.updatePassword);


    // các api cần authenticate với jwt
    router.use(AuthMiddleWare.isAuth);
    // TODO create api with jwt authentication

    router.post('/sdms/insertStudent',InsertStudent.insertStudent);
    router.get('/sdms/getListTeacher',GetListTeacher.getListTeacher);
    router.get('/sdms/getListStudentByAge',GetListStudentByAge.getListStudentByAge)
    router.get('/sdms/getListStudentByClass',GetListStudentByClass.getListStudentByClass)
    router.post('/sdms/saveListStudentToClass',SaveListStudentToClass.saveListStudentToClass)
    router.get('/sdms/getListStudentNotHaveClass',GetListStudentNotHaveClass.getListStudentNotHaveClass)
    router.post('/sdms/updateScore',UpdateScore.updateScore)
    router.get('/sdms/searchStudent',SearchStudent.searchStudent)
    router.post('/sdms/updatePolicy',UpdatePolicy.updatePolicy)
    router.get('/sdms/getPolicies',GetPolicies.getPolicy)
    router.get('/sdms/statisticBySubject',StatisticBySubject.statisticBySubject)

    // return routing
    return app.use("/", router);
};
module.exports = initAPIs;