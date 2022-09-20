module.exports = {
  name: "name",
  aliases: [],
  description: "description",
  enabled: false,
  execute(client, message, args) {
    message.channel.send("Reply");
  },
};
