/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
const jwtHelper = require("../helper/tokenHelper");

let connection = require('../data/connection');



let getListTeacher=async (req,res)=>{
    try{
        connection.acquire(function (err,con) {
            let role=req.body.role;
            if (role===1)
            {
                let sqlObject = "SELECT * FROM user WHERE roleID=0";
                let sqlParams=[];
                try {
                    con.query(sqlObject,sqlParams,function (err,result) {
                        con.release();
                        if (err){
                            return res.status(500).json({
                                status: 0,
                                message: err
                            });
                        }else {
                            let users=[];
                            for (let i=0;i<result.length;i++)
                            {
                                let user = {
                                    username: result[i].username,
                                    role: result[i].roleID,
                                    fullname: result[i].fullname,
                                };
                                users.push(user);
                            }
                            return res.status(200).json({
                                "user": users
                            });
                        }
                    });
                }catch (e) {

                }
            }else {
                return res.status(500).json({
                    status: 0,
                    message: 'Bạn không phải là hiệu trưởng'
                });
            }
        });
    }catch (error) {

    }
}

module.exports = {
    getListTeacher:getListTeacher
};