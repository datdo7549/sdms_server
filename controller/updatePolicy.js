let connection = require('../data/connection');
let flag=true;
let updatePolicy=async (req,res) =>{
    try {
        connection.acquire(function (err,con) {
            let value_1=req.body.value_1;
            let value_2=req.body.value_2;
            let value_3=req.body.value_3;
            let value_4=req.body.value_4;
            let value_5=req.body.value_5;

            let sqlParams=[];
            sqlParams.push(value_1);
            sqlParams.push(value_2);
            sqlParams.push(value_3);
            sqlParams.push(value_4);
            sqlParams.push(value_5);
            for (let i=1;i<=5;i++)
            {
                let sqlObject= "UPDATE privacy SET value=? where id="+i;
                con.query(sqlObject,sqlParams[i-1],function (err,result) {
                    if (err){
                        flag=false;
                    }else {

                    }
                });
            }
            if (flag){
                return res.status(200).json({
                    status: 0,
                    message: 'Success'
                });
            }else {
                return res.status(500).json({
                    status: 0,
                    message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                });
            }

        })
    }catch (e) {
        return res.status(500).json({
            status: 0,
            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
        });
    }
}

module.exports={
    updatePolicy:updatePolicy
};