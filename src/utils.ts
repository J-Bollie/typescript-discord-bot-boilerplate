const { Collection } = require("discord.js");
const path = require("path");
const glob = require("glob");

export const getAllCommands = (commandDirectoryPath = "commands") => {
  const commandArray = [];
  commandArray.push(
    ...glob.sync(`${path.join(__dirname, commandDirectoryPath)}/**/*.js`)
  );
  return commandArray;
};

export const loadCommands = (commandDirectoryPath: string) => {
  const clientCommands = new Collection();
  const clientAliases = new Collection();

  const commandArray = getAllCommands(commandDirectoryPath);

  for (const commandItem of commandArray) {
    // Remove cached commands
    if (require.cache[require.resolve(commandItem)])
      delete require.cache[require.resolve(commandItem)];

    const command = require(commandItem);

    // Add command to commands collection and map aliases
    clientCommands.set(command.name, command);
    if (command.aliases) {
      for (const alias of command.aliases) {
        clientAliases.set(alias, command.name);
      }
    }
  }

  return {
    commands: clientCommands,
    aliases: clientAliases,
  };
};
