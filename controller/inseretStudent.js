/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
let connection = require('../data/connection');
let studentID;
let insertStudent=async (req,res) =>{
    try{
        connection.acquire(function (err,con) {
            let fullname=req.body.fullname;
            let sex=req.body.sex;
            let address=req.body.address;
            let email=req.body.email;
            let classID=req.body.classID;
            let dob=req.body.dob;

            let sqlObjectCountStudent="SELECT COUNT(*) AS count FROM student";
            let sqlParamsCountStudent=[];
            let total_student=1;
            try {
                con.query(sqlObjectCountStudent,sqlParamsCountStudent,async function (err,result) {
                    con.release();
                    if (err){
                        return res.status(500).json({
                            status: 0,
                            message: 'Có lỗi xảy ra vui lòng thử lại sau. 1'
                        });
                    }
                    total_student=result[0].count;
                    let index=1000+total_student;
                    studentID="st"+(index+1);
                    let sqlObjectInsertStudent="INSERT INTO student VALUES(?,?,?,?,?,?,?)";
                    let sqlParamsInsertStudent=[];
                    sqlParamsInsertStudent.push(studentID);
                    sqlParamsInsertStudent.push(fullname);
                    sqlParamsInsertStudent.push(sex);
                    sqlParamsInsertStudent.push(address);
                    sqlParamsInsertStudent.push(email);
                    sqlParamsInsertStudent.push(classID);
                    sqlParamsInsertStudent.push(dob);
                    con.query(sqlObjectInsertStudent,sqlParamsInsertStudent,async function (err,result) {
                        if (err){
                            return res.status(500).json({
                                status: 0,
                                message: err
                            });
                        }else {
                            let sqlGetSubject="SELECT id FROM subject";
                            let sqlGetSubjectParams=[];
                            con.query(sqlGetSubject,sqlGetSubjectParams,function (err,result) {
                                if (err){
                                    return res.status(500).json({
                                        status: 0,
                                        message: err
                                    });
                                }else {
                                    let flag=true;
                                    for (let i=1;i<=2;i++){
                                        for (let j=0;j<result.length;j++)
                                        {
                                            let sqlInsertScoreObject="INSERT INTO subjectscore VALUES(?,?,?,NULL,NULL,NULL,NULL,NULL,NULL,NULL);"
                                            let sqlInsertScoreObjectParams=[];
                                            sqlInsertScoreObjectParams.push(studentID);
                                            sqlInsertScoreObjectParams.push("HK"+i);
                                            sqlInsertScoreObjectParams.push(result[j].id);
                                            con.query(sqlInsertScoreObject,sqlInsertScoreObjectParams,function (err,result) {
                                                if (err){
                                                    flag=false;
                                                }else {
                                                }
                                            });
                                        }
                                    }
                                    if (flag){
                                        return res.status(200).json({
                                            status: 0,
                                            message: 'SUCCESS'
                                        });
                                    }else {
                                        return res.status(500).json({
                                            status: 0,
                                            message: err
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            }catch (e) {
                return res.status(500).json({
                    status: 0,
                    message: 'Có lỗi xảy ra vui lòng thử lại sau. 2'
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

module.exports={
    insertStudent:insertStudent
};