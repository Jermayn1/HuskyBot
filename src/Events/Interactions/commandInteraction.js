const { ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const response = new EmbedBuilder()
        .setColor(client.config.color.normal);

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({
            ephemeral: true,
            embeds: [response.setDescription("🧙  This command is outdated.")]
        });

        if (command.developer && client.config.developer[interaction.user.id]) return interaction.reply({
            ephemeral: true,
            embeds: [response.setDescription("👨‍🚀  This command is only available to developers.")]
        });

        const subCommand = interaction.options.getSubcommand(false);
        if(subCommand) {
            const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
            if (!subCommandFile) return interaction.reply({
                ephemeral: true,
                embeds: [response.setDescription("🕵️‍♂️  This sub-command is outdated.")]
            });

            // Discord doesnt allow you to set for each subCommand the permissions
            if (subCommandFile.permission && !interaction.member.permissions.has(subCommandFile.permission)) return interaction.reply({
                ephemeral: true,
                embeds: [response.setDescription("😵‍💫  You don't have the required permissions to use this subCommand.")]
            });
            subCommandFile.execute(interaction, client);
        } else command.execute(interaction, client);
    }
}