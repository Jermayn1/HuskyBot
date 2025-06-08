require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const si = require('systeminformation');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function updateStatus() {
  try {
    const load = await si.currentLoad();
    const tempData = await si.cpuTemperature();

    // Discord-Format: vollständiges Datum + Uhrzeit
    const lastUpdate = `<t:${timestamp}:R>`;

    const cpuLoad = load.currentLoad.toFixed(1);
    const temp = tempData.main ? tempData.main.toFixed(1) : 'N/A';

    const status = `🖥️: ${cpuLoad}% | 🌡️: ${temp}°C - ${lastUpdate}`;

    client.user.setPresence({
        activities: [{ name: status, type: ActivityType.Watching }],
        status: 'dnd',
    });
    console.log(`Status aktualisiert: ${status}`);
  } catch (error) {
    console.error('Fehler beim Status-Update:', error);
  }
}

client.once('ready', () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
  updateStatus();

  // Alle 30 Sekunden Status aktualisieren
  setInterval(updateStatus, 30000);
});

client.login(process.env.DISCORD_TOKEN);