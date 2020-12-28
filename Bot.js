const Discord = require("discord.js");

const Bot = new Discord.Client();

const Prefix = '!';

const Products = require("./Products.json");

const EmbedColor = "#F2792E";

var CurrentMessage = new Discord.Message();
var CurrentMessageArgs = [];

Bot.login("NTQxNTg1OTI3NTU5MTg0Mzg1.XLIrpQ.figCPZrlal9acmLHAADV79Sjbr0");
// I reset the token - the above token is inactive so as not to pose a security risk

var Commands =
{
    CompareHeadsets: "compareheadsets",
    CompareMice: "comparemice",
    CompareKeyboards: "comparekeyboards",
    Bug: "bug"
}


Bot.on("message", async message =>
{
    if(message.author.bot)
        return;

    if(!message.content.startsWith(Prefix))
        return;


    const args = message.content.slice(Prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    CurrentMessage = args;
    CurrentMessage = message;

    if(Object.keys(Products).includes(command))
    {
        await CommandsFunctions.ShowProduct(command);
        return;
    }

    switch(command)
    {
        case Commands.CompareHeadsets:
             CommandsFunctions.CompareHeadsets();
             break;
        
        case Commands.CompareMice:
             CommandsFunctions.CompareMice();
             break;

        case Commands.CompareKeyboards:
             CommandsFunctions.CompareKeyboards();
             break;

        case Commands.Bug:
             CommandsFunctions.Bug();
             break;
    }
});

var AwaitingReports = [];

class CommandsFunctions
{
    static async ShowProduct(product)
    {
        var message = CurrentMessage;
        var keys = Object.keys(Products);
        for(let i = 0; i < keys.length; i++)
        {
            if(keys[i] == product)
            {
                var embed = new Discord.RichEmbed()
                .setImage(Products[keys[i]])
                .setColor(EmbedColor);
                await message.channel.send(embed);
                return;
            } 
        }
    }

    static async CompareHeadsets()
    {
        var message = CurrentMessage;
        const url = "https://cdn.discordapp.com/attachments/565212804064346115/565980055990435841/Screenshot_2019-04-11_at_21.08.29.png";
        var embed = new Discord.RichEmbed()
        .setImage(url)
        .setColor(EmbedColor);
        await message.channel.send(embed);
    }
    
    static async CompareMice()
    {
        var message = CurrentMessage;
        const url = "https://cdn.discordapp.com/attachments/565212804064346115/565980051737149441/Screenshot_2019-04-11_at_21.06.05.png";
        var embed = new Discord.RichEmbed()
        .setImage(url)
        .setColor(EmbedColor);
        await message.channel.send(embed);
    }
    
    static async CompareKeyboards()
    {
        var message = CurrentMessage;
        const url = "https://cdn.discordapp.com/attachments/565212804064346115/565980061560209408/Screenshot_2019-04-11_at_21.09.21.png";
        var embed = new Discord.RichEmbed()
        .setImage(url)
        .setColor(EmbedColor);
        await message.channel.send(embed);
    }

    static async Bug()
    {
        var questions = 
        [   
            "**Give me a short description of the bug (1 sentence)**",
            "**When did you first experience this bug?**",
            "**Thank you, now please give me the full description of the bug incl. instructions on how to make it happen. You can include screenshots or videos in the next step.**",
            "**Feel free to attach a single photo or video showing the bug.**",
            "**That was helpful. Could you also provide me with your system specs and browser (incl. version)?**",
            "**Thank you for helping us with your report. Before I submit it to our developers, could you please let me know what your Aim Master username is?**",
        ];
        var answers = [];

        var message = CurrentMessage;
        var guild = message.guild;
        var author = message.author;
        var attachmentURL = "";
        if(AwaitingReports.includes(author.id))
        {
            return message.reply("You have already started a report in DM");
        }
        const desc = "Uh-oh, you found a bug? :bug:  Fear not! Just help me by answering the following questions and one of our developers will review and address it as quick as possible. :eyes: Please do not submit false reports or send in duplicate bugs; abuse may result in ban.";
        var embed = new Discord.RichEmbed()
        .setTitle("Aim-Master Bug Report")
        .setColor(EmbedColor)
        .setDescription(desc);
        await author.send(embed).catch(() => function() { return message.reply("I wasn't able to send you a DM! Please enable DMs to fill out the aim-master bug report form."); });
        var dm = author.dmChannel;
        for(let i = 0; i < questions.length; i++)
        {
            var gg = new Discord.RichEmbed()
            .setColor(EmbedColor)
            .setDescription(questions[i]);
            dm.send(gg);
            await dm.awaitMessages(async function(msg)
            {
                if(questions[i].includes("attach") && msg.attachments.size > 0)
                {
                    attachmentURL = msg.attachments.first().url;
                    return;
                }
                answers[i] = msg.content;
            }, {max: 2});
        }

        delete AwaitingReports[AwaitingReports.indexOf(author.id)];
        var reportChannel = guild.channels.find(c => c.name == "bug-reports");
        if(!reportChannel)
        {
            return message.reply("There is no #bug-reports channel!");
        }
        var reportEmbed = new Discord.RichEmbed()
        .setTitle(`**Aim-Master Bug Report**`)
        .setDescription(`Report by ${author.toString()}`)
        .setColor(EmbedColor)
        .setFooter(`User: ${author.tag}`, author.displayAvatarURL)
        for(let i = 0; i < answers.length; i++)
        {
            if(i == answers.length - 1 && attachmentURL != "")
            {
                reportEmbed.setImage(attachmentURL);
            }
            else
            {
                reportEmbed.addField(questions[i], answers[i]);
            }
            if(i != answers.length - 1)
            {
                reportEmbed.addBlankField();
            }
        }
        reportChannel.send(reportEmbed);
        var EndMessageEmbed = new Discord.RichEmbed()
        .setColor(EmbedColor)
        .setDescription("**:white_check_mark:    Thank you letting me know about the bug. I've posted it in #bug-reports and a developer will look at it shortly**");
        dm.send(EndMessageEmbed);
        message.delete();
        
    }
}

class Other
{
    static JsonToArray(_obj)
    {
        var result = [];
        for(var i in _obj)
        {
            result.push([_obj[i]]);
        }
        return result;
    }
}
