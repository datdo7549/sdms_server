/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */

const express = require('express');
const app = express();
const connection = require('./data/connection');
const initAPIs = require("./routes/api");
const port = process.env.PORT || 3000;
const rateLimit = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// limited DDOS (limit 30 request per 3 minutes) request from IP
// after 3 minutes server provide 30 request to client
const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 30 // limit each IP to 30 requests per windowMs
});
//  apply to all requests
app.use(limiter);
// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
app.use(express.json());
// Khởi tạo các routes cho ứng dụng
initAPIs(app);
connection.init();
const server = app.listen(port, function () {
    console.log('SDMS Services listening on ' + server.address().port);
});