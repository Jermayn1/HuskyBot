const { GuildMember, Client } = require("discord.js");
const { genWelcomeCard } = require("../../Structures/Systems/Welcome/profile-image");
const welcomeChannel = require("../../Structures/Schemes/welcomeChannel");

module.exports = {
    name: "guildMemberAdd",
    once: false,
    /**
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

            channel.send({
                files: [card]
            });
        } catch(err) { console.log(err) }
    }
}