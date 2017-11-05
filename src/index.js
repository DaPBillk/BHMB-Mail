var MailSystem = require("./System.js");
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@bhmb/bot')) :
    typeof define === 'function' && define.amd ? define(['@bhmb/bot'], factory) :
    (factory(global['@bhmb/bot']));
}(this, (function (bot) { 'use strict';
    const MessageBot = bot.MessageBot;
    MessageBot.registerExtension("DaPersonMGN/Mail",function(ex, world){
      window.ex2 = ex; //debugging
      this.System = new MailSystem();

      world.addCommand("mail", function(player, args){
        if (args.split(" ").length < 1) {args = "CHECK";}
        switch (args.split(" ")[0].toUpperCase()) {
          case "HELP":
            if (player.isAdmin) {
              ex.bot.send([
                "",
                "/MAIL HELP - displays this message.",
                "/MAIL SEND player_name - sends a letter to the recipient.",
                "/MAIL CHECK - check how many letters you have.",
                "/MAIL VIEW mail_id - view the letter associcated with your mail_id.",
                "/MAIL BAN player_name (admin only) - bans a user from using the mail.",
                "/MAIL UNBAN player_name (admin only) - unbans a user from the mail banlist.",
                "/MAIL CHECK player_name (admin only) - checks the inbox of another player.",
                "/MAIL VIEW mail_id (admin only) - views the letter associcated with any mail_id.",
                "/MAIL REMOVE mail_id (admin only) - removes the letter associated with the mail_id.",
                "/MAIL LIST (admin only) - list up to the previous 50 letters send."
              ].join("\n"));
            } else {
              ex.bot.send([
                "",
                "/MAIL HELP - displays this message.",
                "/MAIL SEND player_name - sends a letter to the recipient.",
                "/MAIL CHECK - check how many letters you have.",
                "/MAIL VIEW mail_id - view the letter associcated with your mail_id.",
              ].join("\n"));
            }
          break;
          case "BAN":
            if (!player.isAdmin) {return}
            if (this.System.banlist.indexOf(player.name) > -1) {
              ex.bot.send(player.name+" is already banned from using the mail.");
            } else {
              this.System.banlist.push(player.name);
              ex.bot.send(player.name+" has been added to the mail banlist.");
            }
          break;
          case "UNBAN":
            if (!player.isAdmin) {return}
            if (this.System.banlist.indexOf(player.name) > -1) {
              this.System.banlist.splice(this.System.banlist.indexOf(player.name), 1);
              ex.bot.send(player.name+" has been removed from the mail banlist.");
            } else {
              ex.bot.send(player.name+" was not on the mail banlist.");
            }
          break;
          case "SEND":

          break;
          case "CHECK":
            var letters = {};
            for (var mailID in this.System.mail) {
              if (this.System.mail[mailID].target === player.name && this.System.mail[mailID].read) {
                letters[mailID] = this.System.mail[mailID];
              }
            }
            ex.bot.send("You have "+Object.keys(letters).length+" unread messages.");
          break;
          case "VIEW":
            if (!this.System.mail[Number(args)[1]]) {
              ex.bot.send("You either didn't specify a mail_id, or the mail_id specified does not exist.");
              return;
            }
            var letter = this.System.mail[Number(args)[1]];
            if (player.name === letter.target) {
              ex.bot.send(["Mail ID: "+letter.id, "To: "+letter.target, "From: "+letter.sender, "Heading: "+letter.header, "Body: "+letter.body].join("\n"));
            } else {
              if (player.isAdmin) {
                ex.bot.send(["Mail ID: "+letter.id, "To: "+letter.target, "From: "+letter.sender, "Heading: "+letter.header, "Body: "+letter.body].join("\n"));
              } else {
                ex.bot.send("You can't view this letter.");
              }
            }
          break;
          case "REMOVE":
            if (!player.isAdmin) {return}
            if (!this.System.mail[Number(args)[1]]) {
              ex.bot.send("You either didn't specify a mail_id, or the mail_id specified does not exist.");
              return;
            }
            delete this.System.mail[Number(args)[1]];
            ex.bot.send("Letter deleted.");
          break;
          case "LIST":

          break;
        }
      });

    });
})));
