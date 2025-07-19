const { GuildMember, Client, EmbedBuilder } = require("discord.js");
const { genWelcomeCard } = require("../../Structures/Systems/Welcome/profile-image");
const welcomeChannel = require("../../Structures/Schemes/welcomeChannel");

module.exports = {
    name: "guildMemberAdd",
    once: false,
    /** Welcome System
     * @param {GuildMember} member 
     * @param {Client} client 
     */
    async execute(member, client) {
        // Welcome System
        try {
            const data = await welcomeChannel.findOne({ GuildId: member.guild.id });
            if (!data || !data.ChannelId) return; // Der Server hat kein Welcome Channel eingestellt

            const channel = await client.channels.cache.get(`${data.ChannelId}`);
            if (!channel) return; // Channel gibt es nicht mehr

            const card = await genWelcomeCard(client, member);

            const rndMessage = await getRandomWelcomeMessage(member)

            channel.send({
                content: rndMessage,
                files: [card]
            });
        } catch(err) { console.log(err) }
    }
}

/**
 * @param {GuildMember} member 
 * @returns String mit der Nachricht
 */
async function getRandomWelcomeMessage(member) {
    // Zufällige Willkommens Nachrichten
    const welcomeMessages = [
        `👋 Schön, dass du da bist, **${member}**.`,
        `👋 Juhu, du hast es geschafft, **${member}**!`,
        `👋 Heißen wir **${member}** herzlich willkommen!`,
        `👋 Willkommen, **${member}**! Sag hallo!`,
        `👋 **${member}** ist grade aufgetaucht!`,
        `👋 **${member}** ist gerade auf den Server geschlittert.`,
        `👋 Schön, dich zu sehen, **${member}**.`,
        `👋 **${member}** ist der Gruppe beigetreten.`,
        `👋 Ein wildes **${member}** erscheint!`,
        `👋 Willkommen, **${member}**. Wir hoffen, du hast Pizza mitgebracht.`,
        `👋 **${member}** ist gelandet.`
    ];

    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)] ?? `👋 Schön, dass du da bist, **${member}**.`;
}