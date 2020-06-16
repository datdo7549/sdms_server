/**
 * Created by nguyenvantan061195@gmail.com.
 * copyright by PivisTeam
 */
let getCurrentTime = async function (req, res) {
    let serverTime = new Date();
    console.log(serverTime);
    return res.status(200).json(serverTime);
};

module.exports = {
    getCurrentTime: getCurrentTime
};