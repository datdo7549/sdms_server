let connection = require('../data/connection');

let searchStudent= async (req,res) =>{
    try{
        connection.acquire(function (err,con) {
            let id="";
            let lastname="";
            let value=req.body.value;
            if (/^[0-9-a-z]+$/.test(value)){
                id=value;
            }else {
                lastname="%"+value.split(" ")[value.split(" ").length-1];
            }
            let sqlObject="SELECT * FROM student WHERE id like ? or fullname like ?";
            let sqlParams=[];
            sqlParams.push(id);
            sqlParams.push(lastname);
            con.query(sqlObject,sqlParams,function (err,result) {
                if (err){
                    return res.status(500).json({
                        status: 0,
                        message: err
                    });
                }else {
                    return res.status(200).json({
                        status: 0,
                        message: result
                    });
                }
            });
        });
    }catch (e) {
        return res.status(500).json({
            status: 0,
            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
        });
    }
}

module.exports={
    searchStudent:searchStudent
};