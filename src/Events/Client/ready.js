const { Client } = require("discord.js");

// Importiert die loadHandler Funktionen
const { loadCommands } = require("../../Structures/Handlers/commandHandler");
const { loadButtons } = require("../../Structures/Handlers/buttonHandler");

// Importiert MongoDB
const { connect } = require("mongoose");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`Client logged in as ${client.user.tag}`);

        // Verbindet sich mit der Datenbank
        await connect(process.env.DB_URL, {})
        .then(() => console.log("The Client is now connected to the database"))

        // Setzt den Discord Status
        updateClientStatus(client);
        

        // Läd alle weiteren Handler (Command, Buttons, etc.)
        await loadCommands(client);
        await loadButtons(client);
    }
}

/**
 * @param {Client} client 
 */
function updateClientStatus(client) {
    const updateStatus = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        client.user.setPresence({
            activities: [{ name: `🕒 ${timeString}` }],
            status: 'online'
        });
    };

    updateStatus(); // Initiales Setzen beim Start
    setInterval(updateStatus, 60 * 1000); // Danach alle 60 Sekunden aktualisieren
}