const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: false});
bot.commands = new Discord.Collection();
let cooldown = new Set();
let cdseconds = 3;

fs.readdir("./server_commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Couldn't find commands!");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./server_commands/${f}`);
        console.log(`${f} server command loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

fs.readdir("./social_commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Couldn't find commands!");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./social_commands/${f}`);
        console.log(`${f} social command loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

fs.readdir("./bot_commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Couldn't find commands!");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./bot_commands/${f}`);
        console.log(`${f} bot command loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

fs.readdir("./discord_commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Couldn't find commands!");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./discord_commands/${f}`);
        console.log(`${f} discord command loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on("guildMemberAdd", async member => {
    let embed = new Discord.RichEmbed()
    .setColor(colors.green)
    .setDescription(`:white_check_mark: Juhú! ${member} csatlakozott a szerverhez! :white_check_mark:`);
    let joinlog = member.guild.channels.find(`name`, "join-log");
    joinlog.send(embed);
}); 

bot.on("guildMemberRemove", async member => {
    let embed = new Discord.RichEmbed()
    .setColor(colors.green)
    .setDescription(`:x: Itt egy kaland ért véget...${member} elment... :x:`);
    let joinlog = member.guild.channels.find(`name`, "join-log");
    joinlog.send(embed);
}); 


bot.on("ready", async () => {
    console.log(`${bot.user.username} is now online!`);
    bot.user.setActivity("MC Craft", {type: "PLAYING"});
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    if(cooldown.has(message.author.id)) {
		message.delete();
		return message.reply("Várnod kell 3 másodpercet,hogy tudj egy újabb parancsot lefuttatni!").then(msg => {msg.delete(3000)});
	}
	//if(!message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix)) {
            cooldown.add(message.author.id);
        }
	//}
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if (commandFile) commandFile.run(bot,message,args);

    setTimeout(() => {
		cooldown.delete(message.author.id)
	}, cdseconds* 1000)
});

bot.login(process.env.BOT_TOKEN);
