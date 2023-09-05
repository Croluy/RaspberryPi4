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
        ip
    }
} = Replies;

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => {
    if(f.isAdmin(ctx)){
        ctx.reply(Replies.main.start);
    }
});

bot.command('ip', (ctx) => {
    if(f.isAdmin(ctx)){
        ctx.reply(Replies.main.ip);
    }
});

//Has the be at the end of the file
bot.launch();   // Start the bot
//Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));