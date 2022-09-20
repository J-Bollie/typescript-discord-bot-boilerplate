import { MessageEmbed } from "discord.js";
import { getAllCommands } from "../utils";

const { prefix } = require("../config.json");

module.exports = {
  name: "help",
  aliases: [],
  description: "Shows this help menu",
  enabled: true,
  execute(client, message, args) {
    const newEmbed = new MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle("Help Menu")
      .setDescription("Here's a list of all commands")
      .addFields(
        ...getAllCommands()
          .filter((commandItem) => {
            const cmd = require(commandItem);
            return !cmd.isAdmin && cmd.enabled;
          })
          .map((commandItem, i) => {
            const cmd = require(commandItem);
            return {
              name: `${prefix}${cmd.name}`,
              value: cmd.description,
              inline: i % 2 != 0,
            };
          })
      )
      .setTimestamp();

    message.channel.send({ embeds: [newEmbed] });
  },
};
