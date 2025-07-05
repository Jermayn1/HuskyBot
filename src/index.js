require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType, REST, Routes, SlashCommandBuilder, InteractionType } = require('discord.js');
const si = require('systeminformation');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// === SLASH COMMAND REGISTRIERUNG ===
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Antwortet mit Pong!')
    .toJSON()
];

client.once('ready', async () => {
  console.log(`Eingeloggt als ${client.user.tag}`);

  // Slash Command global registrieren (kann bis zu 1 Stunde dauern)
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Slash Commands erfolgreich registriert.');
  } catch (error) {
    console.error('Fehler bei der Command-Registrierung:', error);
  }

  updateStatus();
  setInterval(updateStatus, 30000);
});

// === SLASH COMMAND HANDLER ===
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

async function updateStatus() {
  try {
    const load = await si.currentLoad();
    const tempData = await si.cpuTemperature();

    const now = new Date();
    const time = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const cpuLoad = load.currentLoad.toFixed(1);
    const temp = tempData.main ? tempData.main.toFixed(1) : 'N/A';

    const status = `🖥️: ${cpuLoad}% | 🌡️: ${temp}°C - 🕒: ${time} 420!`;

    client.user.setPresence({
      activities: [{ name: status, type: ActivityType.Watching }],
      status: 'dnd',
    });
    console.log(`Status aktualisiert: ${status}`);
  } catch (error) {
    console.error('Fehler beim Status-Update:', error);
  }
}

client.login(process.env.DISCORD_TOKEN);
