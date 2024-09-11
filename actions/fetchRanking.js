const axios = require('axios');
var { AsciiTable3, AlignmentEnum } = require('ascii-table3');

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
    console.log(rawPlayerData);
    console.log(playerdata);

    var row = [];
    for (let i = 0; i < playerdata.length; i++) {
        let player = playerdata[i];
        row.push([player.rank, player.name, player.gamesPlayed, player.totalScore]);
    }

    // create table
    var table =
        new AsciiTable3()
            .setHeading('排名', '玩家', '场数', '分数')
            .setAligns([AlignmentEnum.LEFT, AlignmentEnum.CENTER, AlignmentEnum.CENTER, AlignmentEnum.RIGHT])
            .addRowMatrix(row);

    console.log(table.toString());

    // replyString = "```排名    玩家    场数    分数\n";
    // playerdata.forEach((player) => {
    //     replyString += player.rank + "      " + player.name + "    " + player.gamesPlayed + "    " + player.totalScore + "\n";
    // });

    replyString = "```";
    replyString += table.toString();
    replyString += "```";
    return replyString;
}

module.exports = fetchRanking;