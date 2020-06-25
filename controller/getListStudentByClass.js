let connection = require('../data/connection');

let getListStudentByClass=async (req,res) =>{
    try {
        connection.acquire(function (er,con) {
            let classID=req.body.classID;
            let sqlObject="SELECT * FROM student WHERE classID like ?";
            let sqlParams=[];
            sqlParams.push(classID);
            try {
                con.query(sqlObject,sqlParams,function (err,result) {
                    con.release();
                    if (err){
                        return res.status(500).json({
                            status: 0,
                            message: err
                        });
                    }else {
                        let students=[];
                        for (let i=0;i<result.length;i++)
                        {
                            let student = {
                                id : result[i].id,
                                fullname: result[i].fullname,
                                sex: result[i].sex,
                                address: result[i].address,
                                email: result[i].email,
                                classID : result[i].classID,
                                dob: result[i].dob,
                            };
                            students.push(student);
                        }
                        return res.status(200).json({
                            "students": students
                        });
                    }
                });
            }catch (e) {
                return res.status(500).json({
                    status: 0,
                    message: 'Có lỗi xảy ra vui lòng thử lại sau.'
                });
            }

        });
    }catch (e) {
        return res.status(500).json({
            status: 0,
            message: 'Có lỗi xảy ra vui lòng thử lại sau.'
        });
    }
}

module.exports = {
    getListStudentByClass:getListStudentByClass
};