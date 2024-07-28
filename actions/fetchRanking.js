const axios = require('axios');

const fetchRanking = async (url) => {
    res = await axios.get(url);
    // console.log(res.data.data);
    rawPlayerData = res.data.data;
    playerdata = rawPlayerData.map((player) => {
        return {
            rank: player.rank,
            name: player.name,
            gamesPlayed: player.gamesPlayed.toLocaleString(),
            totalScore: (Math.round(player.totalScore * 10) / 10).toLocaleString(),
        };
    });
    // console.log(rawPlayerData);
    // console.log(playerdata);
    replyString = "排名    场数    名字    分数    \n\n";
    playerdata.forEach((player) => {
        replyString += `${player.rank}          ${player.gamesPlayed}        ${player.name}        ${player.totalScore}\n`;
    });

    return replyString;
}

module.exports = fetchRanking;