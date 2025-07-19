const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);

        const response = new EmbedBuilder()
        .setColor(client.config.color.normal)

        if (!button || button == undefined) return interaction.reply({
            ephemeral: true,
            embeds: [response.setDescription("🧙  This button is outdated.")]
        });

        if (button.developer && client.config.developer[interaction.user.id]) return interaction.reply({
            ephemeral: true,
            embeds: [response.setDescription("👨‍🚀  This button is only available to developers.")]
        });

        if (button.permission && !interaction.member.permissions.has(button.permission)) return interaction.reply({
            ephemeral: true,
            embeds: [ embed.setDescription( `😵‍💫  You don't have the required permissions to use this button.`) ]
        });

        button.execute(interaction, client);
    }
}