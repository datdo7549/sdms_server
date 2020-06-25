let connection = require('../data/connection');

let statisticBySubject =async (req,res) =>
{
    try {
        connection.acquire(function (err,con) {
            let subjectID=req.body.subjectID;
            let semesterID=req.body.semesterID;
            let sqlObject="SELECT SB.subjectName,L.className,L.classSize,count(*) FROM class L, student S, subjectscore SC, subject SB WHERE L.id like S.classID and S.id like SC.studentID and SC.subjectID like SB.id and SC.subjectID like ? and SC.semesterID like ? and SC.scoreAverage>5 group by L.id "
            let sqlParams=[];
            sqlParams.push(subjectID);
            sqlParams.push(semesterID);
            con.query(sqlObject,sqlParams,function (err,result) {
                if (err){
                    return res.status(500).json({
                        status: 0,
                        message: err
                    });
                }else {
                    return res.status(500).json({
                        status: 0,
                        message: result
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
    statisticBySubject:statisticBySubject
};