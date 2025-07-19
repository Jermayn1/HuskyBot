const { loadFiles } = require("../Functions/fileLoader");

async function loadCommands(client) {
    console.time("Commands Loaded");

    await client.commands.clear();
    await client.subCommands.clear();

    const commands = [];
    const commandsArray = [];

    const files = await loadFiles("Interactions/Commands");

    for (const file of files) {
        try {
            const command = require(file);

            if (command.subCommand) {
                client.subCommands.set(command.subCommand, command);
                commands.push({ Command: command.subCommand, Status: "✅" });
            } else {
                client.commands.set(command.data.name, command);
                commands.push({ Command: command.data.name, Status: "✅" });
                commandsArray.push(command.data.toJSON());
            }
        } catch (error) {
            console.log(error)
            commands.push({ Command: file.split("/").pop().slice(0, -3), Status: "❌", Error: error.toString() });
        }
    }

    await client.application.commands.set(commandsArray);

    console.table(commands, ["Command", "Status", "Error"]);
    console.info("\n\x1b[36m%s\x1b[0m", "Commands loaded.");
    console.timeEnd("Commands Loaded");
}

module.exports = { loadCommands };