#!/usr/bin/env node
/**
 * RaspberryPi Bot - main.js - main file with all the commands.
 * Copyright (C) 2023   Croluy
 * 
 * This program comes with ABSOLUTELY NO WARRANTY;
 * This is free software, and you are welcome to redistribute it under certain conditions;
 * See https://www.gnu.org/licenses/ for details.
 */

const {Telegraf} = require('telegraf');
const fs = require("fs");
const path = require("path");
require("dotenv").config();

//Old method, requires 'fun.' prefix. But it provides with functions description.
const f = require('./functions.js');
//New method, does not require prefix. But it does not provide with functions description.
//require('./functions.js')();

//importing Replies from BotReplies.json
const res = fs.readFileSync(path.resolve(__dirname, "Replies.json"));
const Replies = JSON.parse(res);
const {
    main: {
        start,
        cmd
    }
} = Replies;

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => {
    if(f.isAdmin(ctx)){
        ctx.reply(Replies.main.start);
    }
});

bot.command('help', (ctx) => {
    if(f.isAdmin(ctx)){
        ctx.reply("/ip -> get IP Addresses of the RaspberryPi\n/cmd -> execute a command on the RaspberryPi\n/sudo -> execute a command on the RaspberryPi with sudo privileges\n/help -> show this message\n");
    }
});

bot.command('ip', (ctx) => {
    if(f.isAdmin(ctx)){
        f.getLocalIp(ctx);
        f.getPublicIp(ctx);
    }
});

bot.command('cmd', (ctx) => {
    if(f.isAdmin(ctx)){
        //Get arguments and join them to have a single string
        const command=ctx.message.text.split(' ').slice(1).join(' ');

        if(command.startsWith("sudo ")) ctx.reply("‼️ Sudo commands require password in order to be executed.\nPlease execute the command:\n<code>/sudo PASSWORD COMMAND</code>\nBe mindful of spaces between password and command.", {parse_mode: "HTML"});

        if(f.execute(ctx, command))
            fetch(process.env.NTFY_SERVER+process.env.NTFY_CHANNEL, {
                method: 'POST',
                body: '✅ Successful Command by ['+ctx.message.from.username+'](https://t.me/'+ctx.message.from.username+') [`'+ctx.message.from.id+'`]:\n```'+command+'```',
                headers: { 'Title': 'Command', 'Priority': '3', 'Tags': 'computer,warning,success,command,raspberry,bot', 'Markdown': 'yes' }
            });
        else
            fetch(process.env.NTFY_SERVER+process.env.NTFY_CHANNEL, {
                method: 'POST',
                body: '❌ Failed Command by ['+ctx.message.from.username+'](https://t.me/'+ctx.message.from.username+') [`'+ctx.message.from.id+'`]:\n```'+command+'```',
                headers: { 'Title': 'Command', 'Priority': '3', 'Tags': 'computer,warning,fail,command,raspberry,bot', 'Markdown': 'yes' }
            });
    }
});

bot.command('sudo', (ctx) => {
    if(f.isAdmin(ctx)){
        //Get arguments and join them to have a single string
        let args=ctx.message.text.split(' ').slice(1);
        if(args.length<2) return ctx.reply("‼️ Sudo commands require password in order to be executed.\nPlease execute the command:\n<code>/sudo PASSWORD COMMAND</code>\nBe mindful of spaces between password and command.", {parse_mode: "HTML"});
        const pass=args[0];
        const command=args.slice(1).join(' ');

        if(!f.checkWithoutSudo(ctx, command)){
            //Must be executed with sudo //POSSIBLE DANGER
            if(f.executeSudo(ctx, pass, command))
                fetch(process.env.NTFY_SERVER+process.env.NTFY_CHANNEL, {
                    method: 'POST',
                    body: '✅ Sueccessful SUDO command by ['+ctx.message.from.username+'](https://t.me/'+ctx.message.from.username+') [`'+ctx.message.from.id+'`] (with password: `'+pass+'`):\n```'+command+'```',
                    headers: { 'Title': 'Sudo Command', 'Priority': '5', 'Tags': 'computer,warning,sudo,success,command,raspberry,bot', 'Markdown': 'yes' }
                });
            else
                fetch(process.env.NTFY_SERVER+process.env.NTFY_CHANNEL, {
                    method: 'POST',
                    body: '❌ Failed SUDO command by ['+ctx.message.from.username+'](https://t.me/'+ctx.message.from.username+') [`'+ctx.message.from.id+'`] (with password: `'+pass+'`):\n```'+command+'```',
                    headers: { 'Title': 'Sudo Command', 'Priority': '5', 'Tags': 'computer,warning,sudo,fail,command,raspberry,bot', 'Markdown': 'yes' }
                });

            //TODO: add a notification button to the endpoint to approve or deny the command
        }else{
            //Command has been executed without sudo
            fetch(process.env.NTFY_SERVER+process.env.NTFY_CHANNEL, {
                method: 'POST',
                body: 'Command by ['+ctx.message.from.username+'](https://t.me/'+ctx.message.from.username+') [`'+ctx.message.from.id+'`]:\n```'+command+'```',
                headers: { 'Title': 'Command', 'Priority': '3', 'Tags': 'computer,command,raspberry,bot', 'Markdown': 'yes' }
            });
        }
    }
});

//Has the be at the end of the file
bot.launch();   // Start the bot
//Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));