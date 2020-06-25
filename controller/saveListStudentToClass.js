let connection = require('../data/connection');

let saveListStudentToClass=async (req,res) =>{
    try {
        connection.acquire(function (err,con) {
            let classID=req.body.classID;
            let arrayID=req.body.listStudent;
            for (let i=0;i<arrayID.length;i++){
                let sqlObject="UPDATE student SET classID= ? WHERE id= ?";
                let sqlParams=[];
                sqlParams.push(classID);
                sqlParams.push(arrayID[i]);
                try {
                    con.query(sqlObject,sqlParams,function (err,result) {
                        return res.status(200).json({
                            status: 0,
                            message: result
                        });
                    });
                }catch (e) {
                    return res.status(500).json({
                        status: 0,
                        message: e
                    });
                }

            }
        });
    }catch (e) {
        return res.status(500).json({
            status: 0,
            message: e
        });
    }
}

module.exports={
    saveListStudentToClass:saveListStudentToClass
};