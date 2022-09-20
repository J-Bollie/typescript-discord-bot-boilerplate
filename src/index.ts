import "dotenv/config";

const { Client, Intents } = require("discord.js");

const config = require("./config.json");
const { admins } = require("./config.json");

import { loadCommands } from "./utils";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const { commands, aliases } = loadCommands("commands");

client.commands = commands;
client.aliases = aliases;

client.on("ready", () => {
  console.log("Bot is ready");
  client.user.setActivity("Genshin Impact");
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const messageSplit = message.content
    .substr(config.prefix.length, message.content.length)
    .split(/\s+/g);
  const cmd = messageSplit[0];
  const args = messageSplit.slice(1);

  try {
    let command;
    if (client.commands.has(cmd)) {
      command = client.commands.get(cmd);
    } else if (client.aliases.has(cmd)) {
      command = client.commands.get(client.aliases.get(cmd));
    } else return;
    if (
      (command.isAdmin && admins.includes(message.author.id)) ||
      !command.isAdmin
    ) {
      !command.enabled
        ? message.channel.send("This command has been temporarily disabled.")
        : command.execute(client, message, args);
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.DISCORD_TOKEN);
