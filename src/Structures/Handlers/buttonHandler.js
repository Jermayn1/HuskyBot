const { loadFiles } = require("../Functions/fileLoader");

async function loadButtons(client) {
    console.time("Buttons Loaded");

    await client.buttons.clear();

    const buttons = new Array();

    const files = await loadFiles("Interactions/Buttons");

    for (const file of files) {
        try {
            const button = require(file);

            if(!button.id) return buttons.push({ Button: file.split("/").pop().slice(0, -3), Status: "❌", Error: "Missing Button Id"});
            client.buttons.set(button.id, button);
            buttons.push({ Button: button.id || file.split("/").pop().slice(0, -3), Status: "✅" })
        } catch (error) {
            buttons.push({ Button: button.id || file.split("/").pop().slice(0, -3), Status: "❌", Error: error.toString() });
        }
    }

    console.table(buttons, ["Button", "Status", "Error"]);
    console.info("\n\x1b[36m%s\x1b[0m", "Buttons loaded.");
    console.timeEnd("Buttons Loaded");
}

module.exports = { loadButtons };