const fs = require("fs");
const path = require("path");
require("dotenv").config();

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

//Old method, requires 'fun.' prefix. But it provides with functions description.
module.exports = {
    s,
    isAdmin,
}

/*//New method, does not require prefix. But it does not provide with functions description.
module.exports = function (){
    this.checkExpiredToken=checkExpiredToken;
}
*/