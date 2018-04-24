const Discord = require("discord.js");
const colors = require("../colors.json");

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.RichEmbed()
    .setColor(colors.darkaqua)
    .addField("!help", "Parancsok listája", true)
    .addField("!ip", "Szerverünk IP címe", true)
    .addField("!serverinfo", "Információk a szerverről", true)
    .addField("!staffteam", "Szerverünk Staff csapata", true)
    .addField("!stat", "A szerver statisztikái", true)
    .addField("!fb", "Facebook oldalunk", true)
    .addField("!yt", "YouTube csatornánk", true)
    .setFooter("Csatlakozz ha még nem tetted volna! !ip", message.author.displayAvatarURL);
    message.author.send(embed).then(msg => {msg.delete(15000)});
    message.delete();
    let pmEmbed = new Discord.RichEmbed()
    .setColor(colors.green)
    .setDescription(":white_check_mark: Elküldve Privát Üzenetben!");
    message.channel.send(pmEmbed).then(msg => {msg.delete(5000)});
}

module.exports.help = {
    name: "help"
}