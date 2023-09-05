const fs = require("fs");
const path = require("path");
require("dotenv").config();
const {exec} = require('child_process');
const shellQuote = require('shell-quote');
const axios = require('axios');

//importing Replies from BotReplies.json
const res = fs.readFileSync(path.resolve(__dirname, "Replies.json"));
const Replies = JSON.parse(res);
const {
    functions: {
        
    }
} = Replies;

/**
 * Parse template literal so it can be used in JSON elements.
 * 
 * @param {string} expression - string to interpret
 * @param {obj} variablesObj - object with variables to replace
 * @returns {string} final string with replaced variables
 */
function s(expression, variablesObj){
    const regexp = /\${\s?([^{}\s]*)\s?}/g;
    let t = expression.replace(regexp, (substring, variables, index) => {
        variables = variablesObj[variables];
        return variables;
    });
    return t;
}

/**
 * 
 * Check if the command was executed by the admin.
 * 
 * @param {obj} ctx - context of the message
 * @returns {boolean} true if the command was executed by the admin (check for both id and username), false otherwise
 * 
 */
function isAdmin(ctx){
    return (ctx.message.from.id === parseInt(process.env.CREATOR_ID) && ctx.message.from.username === process.env.CREATOR_USERNAME);
}

/**
 * Given a string checks if it starts with the word sudo
 * @param {string} s
 * @returns {boolean} true if the string starts with sudo, false otherwise
 */
function isSudo(s){
    return s.startsWith("sudo ");
}

/**
 * Function to execute command and check for errors.
 * @param {obj} ctx 
 * @param {string} command 
 */
function execute(ctx, command){
    exec(command, (error, stdout, stderr) => {
        if (error) {
            ctx.reply("❗️ Errore durante l'esecuzione del comando: '<code>"+command+"</code>'",{parse_mode: 'HTML'});
            ctx.reply(`${error}`);
            return false;
        }

        if(stderr!==""){
            ctx.reply("❗️ StdErr durante l'esecuzione del comando '<code>"+command+"</code>'",{parse_mode: 'HTML'});
            ctx.reply(`⚠️ StdErr:\n${stderr}`);
            return false;
        }
        
        if(stdout!==""){
            ctx.reply("✅ Comando '<code>"+command+"</code>' eseguito con successo.",{parse_mode: 'HTML'});
            ctx.reply(`${stdout}`);
            return true;
        }
    });
}

function executeSudo(ctx, pass, command){
    let p="echo \""+pass+"\" | sudo -S "+command;
    exec(p, (error, stdout, stderr) => {
        if (error) {
            ctx.reply("❗️ Errore durante l'esecuzione del comando: '<code>"+command+"</code>'",{parse_mode: 'HTML'});
            ctx.reply(`${error}`);
            return false;
        }

        if(stderr!==""){
            ctx.reply("❗️ StdErr durante l'esecuzione del comando '<code>"+command+"</code>'",{parse_mode: 'HTML'});
            ctx.reply(`⚠️ StdErr:\n${stderr}`);
            return false;
        }
        
        if(stdout!==""){
            ctx.reply("✅ Comando '<code>"+command+"</code>' eseguito con successo <b>SENZA sudo</b>.",{parse_mode: 'HTML'});
            ctx.reply(`${stdout}`);
            return true;
        }
    });
}

/**
 * Check if command can be executed without the sudo prefix.
 * 
 * @param {obj} ctx - telegraf context
 * @param {string} command - command to check
 * @returns {boolean} true if the command can be executed without sudo, false otherwise
 */
function checkWithoutSudo(ctx, command){
    if(isSudo(command)){
        //try to execute command without sudo prefix check if it works
        command=command.replace("sudo ", "");
        exec(command, (error, stdout, stderr) => {
            if(error) return false;
            if(stderr!=="") return false;
            if(stdout!==""){
                ctx.reply("✅ Comando '<code>"+command+"</code>' eseguito con successo <b>SENZA sudo</b>.",{parse_mode: 'HTML'});
                ctx.reply(`${stdout}`);
                return true;
            }
        });
    }
}

function getLocalIp(ctx){
    let ip = require('ip');
    ctx.reply("Local: "+ip.address());
}

async function getPublicIp(ctx){
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        const { ip } = response.data;
        console.log(ip);
        ctx.reply("Public: "+ip);
    } catch (error) {
        ctx.reply("Error while getting public ip.");
        return;
    }
}

//Old method, requires 'f.' prefix. But it provides with functions description.
module.exports = {
    s,
    isAdmin,
    isSudo,
    execute,
    executeSudo,
    checkWithoutSudo,
    getLocalIp,
    getPublicIp
}

/*//New method, does not require prefix. But it does not provide with functions description.
module.exports = function (){
    this.checkExpiredToken=checkExpiredToken;
}
*/