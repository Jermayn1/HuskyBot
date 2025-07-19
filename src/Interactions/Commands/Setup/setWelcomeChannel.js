const welcomeChannel = require("../../../Structures/Schemes/welcomeChannel");

const { SlashCommandBuilder ,ChatInputCommandInteraction, Client, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ChannelType } = require("discord.js");
module.exports = {
    developer: true,
    data:  new SlashCommandBuilder()
    .setName("setwelcomechannel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Setzt den Channel, wo die Welcome Nachricht gesendet werden")
    .addChannelOption((option) => option
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setName("channel")
        .setDescription("Channel indem die Nachrichten gesendet werden soll")
        .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const channel = interaction.options.getChannel("channel");

        const embed = new EmbedBuilder()
        .setColor(client.config.color.normal);

        let data = await welcomeChannel.findOne({
            GuildId: interaction.guild.id
        });

        if (!data) data = await welcomeChannel.create({
            GuildId: interaction.guild.id,
            ChannelId: channel.id
        });
        else await data.updateOne({ "$set": { ChannelId: channel.id }});

        embed.setDescription(`Der Channel für die Welcome Nachricht wurde erfolgreich auf ${channel} gesetzt!`);

        interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral]
        });
    }
}