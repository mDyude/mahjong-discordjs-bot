const axios = require('axios');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const { GAME_URL, PLAYER_URL, TEST_GAME_URL, TEST_PLAYER_URL } = require('../../config.json');

let rawPlayerData;
let playerdata;
let replyString = "排名\n";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('查看当前排名'),
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('第一赛季')
                    .setValue('1')
                    .setDescription('第一赛季排名')
                    .setEmoji('1️⃣'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('第二赛季')
                    .setValue('2')
                    .setDescription('第二赛季排名')
                    .setEmoji('2️⃣'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        const response = await interaction.reply({
            content: '选择赛季',
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        try {
            let res;
            if (confirmation.values[0] === '2') {
                res = await axios.get(PLAYER_URL)
            } else {
                res = await axios.get(`${PLAYER_URL}/s1`)
            }
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
            playerdata.forEach((player) => {
                replyString += `排名: ${player.rank} 名字: ${player.name} 场数: ${player.gamesPlayed} 分数: ${player.totalScore}\n`;
            });
            await interaction.editReply(`${replyString}`);
            replyString = "排名\n";

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
}