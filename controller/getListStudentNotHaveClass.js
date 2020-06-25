/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
let connection = require('../data/connection');

let getListStudentNotHaveClass = async (req, res) => {
    try {
        connection.acquire(function (err, con) {
            let sqlObject = "SELECT * FROM student WHERE classID is NULL";
            let sqlParams = [];
            try {
                con.query(sqlObject, sqlParams, function (err, result) {
                    con.release();
                    if (err) {
                        return res.status(500).json({
                            status: 0,
                            message: err
                        });
                    } else {
                        let students = [];
                        for (let i = 0; i < result.length; i++) {
                            let student = {
                                id: result[i].id,
                                fullname: result[i].fullname,
                                sex: result[i].sex,
                                address: result[i].address,
                                dob: result[i].dob,
                            };
                            students.push(student);
                        }
                        return res.status(200).json({
                            "students": students
                        });
                    }
                });
            } catch (e) {

            }
        });
    } catch (error) {

    }
}

module.exports = {
    getListStudentNotHaveClass: getListStudentNotHaveClass
};