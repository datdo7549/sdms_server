/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
const jwtHelper = require("../helper/tokenHelper");
//Mã secret hash password
const hashPasswordSecret="sdms-hash-password-secret"
let connection = require('../data/connection');




let insertUser=async (req,res) =>{
    try {
        connection.acquire(function(err,con){
            let username=req.body.username;
            let password=req.body.password;
            let Sjcl=require("sjcl");

            const myBitArray = Sjcl.hash.sha256.hash(password)
            const myHash = Sjcl.codec.hex.fromBits(myBitArray)

            let sqlObject = "INSERT INTO user (username,password) VALUES (?,?)";
            let sqlParams = [];
            sqlParams.push(username);
            sqlParams.push(myHash);
            try {
                con.query(sqlObject,sqlParams,async function(err,result){
                    con.release();
                    if (err) {
                        console.log(err.toString());
                        return res.status(500).json({
                            status: 0,
                            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                        });
                    }else{
                        return res.status(200).json({
                            status: 0,
                            message: result
                        });
                    }
                });
            } catch (error) {
                return res.status(500).json({
                    status: 0,
                    message: error.toString()
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
        });
    }
}
module.exports = {
    insertUser:insertUser
};