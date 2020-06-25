/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
let connection = require('../data/connection');

let updatePassword=async (req,res) =>{
    try {
        connection.acquire(function(err,con){
            let id=req.body.id;
            let password=req.body.password;
            let Sjcl=require("sjcl");

            const myBitArray = Sjcl.hash.sha256.hash(password)
            const myHash = Sjcl.codec.hex.fromBits(myBitArray)

            let sqlObject = "UPDATE user SET password=? WHERE id=?";
            let sqlParams=[];
            sqlParams.push(myHash);
            sqlParams.push(id);
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
    updatePassword:updatePassword
}