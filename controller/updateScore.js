let connection = require('../data/connection');

let updateScore= async (req,res) =>{
    try {
        connection.acquire(function (err,con) {
            let studentID=req.body.studentID;
            let semesterID=req.body.semesterID;
            let subjectID=req.body.subjectID;

            let score15=req.body.score15;
            let score15_2=req.body.score15_2;
            let score15_3=req.body.score15_3;
            let score45=req.body.score45;
            let score45_2=req.body.score45_2;
            let scoreSemester=req.body.scoreSemester;
            let scoreAverage=req.body.scoreAverage;
            let sqlUpdateScoreObject="UPDATE subjectscore SET score15= ?, score15_2=?, score15_3=?, score45=?, score45_2=?, scoreSemester=?, scoreAverage=? WHERE studentID LIKE ? and semesterID LIKE ? and subjectID LIKE ?";
            let sqlUpdateScoreParams=[];
            sqlUpdateScoreParams.push(score15);
            sqlUpdateScoreParams.push(score15_2);
            sqlUpdateScoreParams.push(score15_3);
            sqlUpdateScoreParams.push(score45);
            sqlUpdateScoreParams.push(score45_2);
            sqlUpdateScoreParams.push(scoreSemester);
            sqlUpdateScoreParams.push(scoreAverage);
            sqlUpdateScoreParams.push(studentID);
            sqlUpdateScoreParams.push(semesterID);
            sqlUpdateScoreParams.push(subjectID);
            con.query(sqlUpdateScoreObject,sqlUpdateScoreParams,function (err,result) {
                if (err){
                    return res.status(500).json({
                        status: 0,
                        message: 'Có lỗi xảy ra vui lòng thử lại sau. 1'
                    });
                }else {
                    return res.status(200).json({
                        status: 0,
                        message: result
                    });
                }
            })
        });
    }catch (e) {

    }
}

module.exports={
    updateScore:updateScore
};