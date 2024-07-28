const axios = require('axios');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const PLAYER_URL = process.env.PLAYER_URL;

const fetchRanking = require("../../actions/fetchRanking.js");

let replyString = "";

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
                    .setEmoji('1️⃣'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('第二赛季')
                    .setValue('2')
                    .setEmoji('2️⃣'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        const response = await interaction.reply({
            content: '选择赛季',
            components: [row],
        });

        try {
            const collectorFilter = i => i.user.id === interaction.user.id;
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
    
            let res;
            if (confirmation.values[0] === '2') {
                res = await fetchRanking(PLAYER_URL);
                replyString = "第二赛季排名\n" + res;
            } else if (confirmation.values[0] === '1') {
                res = await fetchRanking(`${PLAYER_URL}/s1`);
                replyString = "第一赛季排名\n" + res;
            } else {
                throw new Error('Invalid value');
            }

            await interaction.followUp(`${replyString}`);
            replyString = "";
            await interaction.deleteReply();


        } catch (error) {
            console.error(error);
            await interaction.followUp({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
}