const { SlashCommandBuilder, Client, PermissionFlagsBits, ChatInputCommandInteraction, MessageFlags } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emittiert ein Discord-Event.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((options) => options
        .setName("event")
        .setDescription("Das Event, welches emittiert werden soll.")
        .setRequired(true)
        .setChoices(
            { name: "guildMemberAdd", value: "guildMemberAdd" },))
    .addUserOption((options) => options
        .setName("user")
        .setDescription("An welchen User soll das Event emitiert werden?")
        .setRequired(false)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const choice = interaction.options.getString("event");
        const member = await
            interaction.guild.members.cache.get(interaction.options.getUser("user").id)
            ?? interaction.member;

        switch (choice) {
            case "guildMemberAdd": client.emit("guildMemberAdd", member); break;
        }

        interaction.reply({ content: `${choice} Event wird emmitiert.`, flags: [MessageFlags.Ephemeral] });
    }
}