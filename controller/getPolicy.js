let connection = require('../data/connection');

let getPolicy=async (req,res) =>{
    try{
        connection.acquire(function (err,con) {
            let sqlObject="SELECT * FROM privacy";
            let sqlParams=[];
            con.query(sqlObject,sqlParams,function (err,result) {
                if (err){
                    return res.status(500).json({
                        status: 0,
                        message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                    });
                }else {
                    return res.status(200).json({
                        status: 1,
                        policies: result
                    });
                }
            })
        });
    }catch (e) {
        return res.status(500).json({
            status: 0,
            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
        });
    }
}
module.exports={
    getPolicy:getPolicy
};