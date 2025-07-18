require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType, SlashCommandBuilder, Partials } = require('discord.js');
const si = require('systeminformation');

// Intents & Partials
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

// Erstellt den Client
const client = new Client({
    intents: [ Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildVoiceStates ],
    partials: [ User, Message, GuildMember, ThreadMember ]
});5

client.config = require("./config.json");


// === SLASH COMMAND REGISTRIERUNG ===
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Antwortet mit Pong!')
    .toJSON()
];

client.once('ready', async () => {
  console.log(`Eingeloggt als ${client.user.tag}`);

  const { registerFonts } = require("./Structures/Systems/Welcome/registerFonts");
  await registerFonts();

  const now = new Date();

  // Datum im Format DD.MM.YYYY
  const date = now.toLocaleDateString('de-DE');

  // Uhrzeit im Format HH:MM:SS
  const time = now.toLocaleTimeString('de-DE');

  // Komplett als String zusammenfügen
  const dateTime = `${date} ${time}`;

  client.user.setPresence({
    activities: [{
      name: dateTime,
      type: ActivityType.Watching
    }],
    status: 'dnd'
  });
});

const { genWelcomeCard } = require("./Structures/Systems/Welcome/profile-image");

client.on('guildMemberAdd', async (member) => {
  try {
    genWelcomeCard(client, member)
  } catch(err) {
    console.log(err)
  }
});

// === SLASH COMMAND HANDLER ===
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(process.env.DISCORD_TOKEN);
