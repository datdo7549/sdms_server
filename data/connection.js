/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */

const mysql = require('mysql');
module.exports = {
    init: function () {
        // database connection string
        // this.pool = mysql.createPool({
        //     connectionLimit: 10,
        //     host: 'localhost',
        //     user: 'root',
        //     password: '',
        //     database: 'sdms'
        // });

    },

    acquire: function (callback) {
        this.pool.getConnection(function (err, connection) {
            callback(err, connection);
        });
    }
};