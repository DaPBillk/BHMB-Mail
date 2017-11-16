/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var MailSystem = __webpack_require__(1);
(function (global, factory) {
     true ? factory(__webpack_require__(3)) :
    typeof define === 'function' && define.amd ? define(['@bhmb/bot'], factory) :
    (factory(global['@bhmb/bot']));
}(this, (function (bot) { 'use strict';
    const MessageBot = bot.MessageBot;
    MessageBot.registerExtension("DaPersonMGN/Mail",function(ex, world){
      window.ex2 = ex; //debugging
      ex.System = new MailSystem();

      ex.playerProgress = {};

      ex.save = function() {
        ex.storage.set("mail",{
          id: ex.System.mailID,
          mail: ex.System.mail,
          banlist: ex.System.banlist
        });
      };

      ex.load = function() {
        var data = ex.storage.get("mail",{
          id: 0,
          mail: {},
          banlist: []
        })
        ex.System.mailID = data.id;
        ex.System.mail = data.mail;
        ex.System.banlist = data.banlist;
      };

      ex.uninstall = function() {
        ex.storage.clear("mail");
        ex.remove();
      };

      ex.remove = function() {
        world.onMessage.unsub(ex.onMessage);
        world.onLeave.unsub(ex.onLeave);
        world.removeCommand("mail");
        if (ex.bot.getExports("ui")) {
          ex.bot.getExports("ui").removeTab(ex.tab);
        }
      };

      ex.onMessage = function({player, message}) {
        if (ex.System.banlist.indexOf(player.name) > -1) {return}
        if (message.startsWith("/")) {return}
        if (ex.playerProgress[player.name]) {
          if (!ex.playerProgress[player.name].heading) {
            //heading
            ex.playerProgress[player.name].heading = message;
            ex.bot.send("Please specify now the contents of the letter.");
          } else {
            //body
            ex.playerProgress[player.name].body = message;
            ex.System.send(ex.playerProgress[player.name].to, player.name, ex.playerProgress[player.name].heading, ex.playerProgress[player.name].body);
            delete ex.playerProgress[player.name];
            ex.bot.send("Letter sent!");
          }
        }
      };

      ex.onLeave = function(player) {
        if (ex.playerProgress[player.name]) {
          delete ex.playerProgress[player.name];
        }
      };

      world.addCommand("mail", function(player, args){

        if (args.length < 1) {args = "CHECK";}
        switch (args.split(" ")[0].toUpperCase()) {
          case "HELP":
            if (ex.System.banlist.indexOf(player.name) > -1) {return}
            if (player.isAdmin) {
              ex.bot.send([
                "",
                "/MAIL HELP - displays this message.",
                "/MAIL SEND player_name - sends a letter to the recipient.",
                "/MAIL CHECK - check how many letters you have.",
                "/MAIL VIEW mail_id - view the letter associcated with your mail_id.",
                "/MAIL CANCEL - stop sending a letter.",
                "/MAIL BAN player_name (admin only) - bans a user from using the mail.",
                "/MAIL UNBAN player_name (admin only) - unbans a user from the mail banlist.",
                "/MAIL CHECK player_name (admin only) - checks the inbox of another player.",
                "/MAIL VIEW mail_id (admin only) - views the letter associcated with any mail_id.",
                "/MAIL REMOVE mail_id (admin only) - removes the letter associated with the mail_id.",
                "/MAIL LIST (admin only) - list up to the previous 10 letters sent."
              ].join("\n"));
            } else {
              ex.bot.send([
                "",
                "/MAIL HELP - displays this message.",
                "/MAIL SEND player_name - sends a letter to the recipient.",
                "/MAIL CHECK - check how many letters you have.",
                "/MAIL VIEW mail_id - view the letter associcated with your mail_id.",
                "/MAIL CANCEL - stop sending a letter."
              ].join("\n"));
            }
          break;
          case "BAN":
            if (!player.isAdmin) {return}
            var target = world.getPlayer(args.split(" ").slice(1).join(" "));
            if (ex.System.banlist.indexOf(target.name) > -1) {
              ex.bot.send(target.name+" is already banned from using the mail.");
            } else {
              ex.System.banlist.push(target.name);
              ex.save();
              ex.bot.send(target.name+" has been added to the mail banlist.");
            }
          break;
          case "UNBAN":
            if (!player.isAdmin) {return}
            var target = world.getPlayer(args.split(" ").slice(1).join(" "));
            if (ex.System.banlist.indexOf(target.name) > -1) {
              ex.System.banlist.splice(ex.System.banlist.indexOf(target.name), 1);
              ex.save();
              ex.bot.send(target.name+" has been removed from the mail banlist.");
            } else {
              ex.bot.send(target.name+" was not on the mail banlist.");
            }
          break;
          case "SEND":
            if (ex.System.banlist.indexOf(player.name) > -1) {return}
            if (ex.playerProgress[player.name]) {
              delete ex.playerProgress[player.name];
            }
            var target = world.getPlayer(args.split(" ").slice(1).join(" "));
            if (!target.hasJoined) {
              ex.bot.send(target.name+" has never joined this server.");
              return;
            }
            ex.playerProgress[player.name] = {
              heading: null,
              body: null,
              to: target.name
            };
            ex.bot.send("Please type the heading of the letter in chat. Type /MAIL CANCEL to stop sending your letter.");
          break;
          case "CHECK":
            if (ex.System.banlist.indexOf(player.name) > -1) {return}
            if (args.split(" ").slice(1).join(" ").length > 0 && player.isAdmin) {
              var letters = [];
              for (var mailID in ex.System.mail) {
                if (ex.System.mail[mailID].target == world.getPlayer(args.split(" ").slice(1).join(" ")).name && !ex.System.mail[mailID].read) {
                  letters.push(mailID+" - From: "+ ex.System.mail[mailID].sender);
                }
              }
              ex.bot.send(world.getPlayer(args.split(" ").slice(1).join(" ")).name+" has "+Object.keys(letters).length+" unread messages. \n"+letters.join("\n"));
            } else {
              var letters = [];
              for (var mailID in ex.System.mail) {
                if (ex.System.mail[mailID].target === player.name && !ex.System.mail[mailID].read) {
                  letters.push(mailID+" - From: "+ ex.System.mail[mailID].sender);
                }
              }
              ex.bot.send("You have "+Object.keys(letters).length+" unread messages. \n"+letters.join("\n"));
            }
          break;
          case "VIEW":
            if (!ex.System.mail[Number(args.split(" ")[1])]) {
              ex.bot.send("You either didn't specify a mail_id, or the mail_id specified does not exist.");
              return;
            }
            var letter = ex.System.mail[Number(args.split(" ")[1])];
            if (player.name === letter.target) {
              ex.bot.send(["Mail ID: "+letter.id, "To: "+letter.target, "From: "+letter.sender, "Heading: "+letter.header, "Body: "+letter.body].join("\n"));
              letter.read = true;
              ex.save();
            } else {
              if (player.isAdmin) {
                ex.bot.send(["Mail ID: "+letter.id, "To: "+letter.target, "From: "+letter.sender, "Heading: "+letter.header, "Body: "+letter.body].join("\n"));
                ex.save();
              } else {
                ex.bot.send("You can't view this letter.");
              }
            }
          break;
          case "REMOVE":
            if (!player.isAdmin) {return}
            if (!ex.System.mail[Number(args.split(" ")[1])]) {
              ex.bot.send("You either didn't specify a mail_id, or the mail_id specified does not exist.");
              return;
            }
            delete ex.System.mail[Number(args.split(" ")[1])];
            ex.save();
            ex.bot.send("Letter deleted.");
          break;
          case "LIST":
            if (!player.isAdmin) {return}
            var mailIDs = Object.keys(ex.System.mail).slice(-10);
            var letters = [];
            for (var mailID of mailIDs) {
              letters.push(mailID+" - From: "+ex.System.mail[mailID].sender);
            }
            ex.bot.send("Previous 10 letters sent:\n"+letters.join("\n"));
          break;
          case "CANCEL":
            if (ex.System.banlist.indexOf(player.name) > -1) {return}
            if (ex.playerProgress[player.name]) {
              delete ex.playerProgress[player.name];
              ex.save();
              ex.bot.send("Canceled your letter.");
            } else {
              ex.bot.send("You aren't writing a letter.");
            }
          break;
        }
      });

      world.onMessage.sub(ex.onMessage);
      world.onLeave.sub(ex.onLeave);
      ex.load();


      //now we start da ui stuff . ugh.
      if (ex.bot.getExports("ui")) {

        var ui = ex.bot.getExports("ui");
        ex.tab = ui.addTab("Mail");
        ex.tab.innerHTML = __webpack_require__(4);
        ex.tab.addEventListener("change", function(e) {
          var el = e.target;
          var player = ex.world.getPlayer(el.value);
          ex.tab.querySelector(".letters").innerHTML = "";
          for (var mailID in ex.System.mail) {
            if (ex.System.mail[mailID].target === player.name) {
              ex.tab.querySelector(".letters").innerHTML += __webpack_require__(5).replace(/{SENDER}/gi, ex.System.mail[mailID].sender).replace(/{CONTENT}/gi, ex.System.mail[mailID].body).replace(/{HEADING}/gi, ex.System.mail[mailID].header.toUpperCase());
            }
          }
        });
      }
    });
})));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Letter = __webpack_require__(2);
module.exports = function() {
  this.mail = {};
  this.banlist = [];
  this.mailID = 0;

  this.send = function(to, from, head, body) { //TODO: "to" should be gotten from player.name
    if (this.banlist.indexOf(from) > -1) {throw new Error("Player is banned from sending mail.");}
    this.mail[this.mailID] = new Letter(this.mailID, to, from, head, body); //TODO: Is this nessecary?
    this.mailID++;
  };

};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(id, to, from, head, body) {
  this.sender = from;
  this.target = to;
  this.header = head;
  this.body = body;
  this.read = false;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = window['@bhmb/bot'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.2/awesomplete.css\"/>\r\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.2/awesomplete.js\"></script>\r\n<div class=\"container\" style=\"padding-top: 2%; height: 100%;\">\r\n  <div class=\"box\" style=\"height: 95%;\">\r\n    <h4 class=\"title\">Mail</h4>\r\n    <hr />\r\n    <label class=\"label\">\r\n      Username\r\n      <input class=\"input\" />\r\n    </label>\r\n    <hr />\r\n    <div class=\"letters\">\r\n\r\n    </div>\r\n\r\n  </div>\r\n</div>\r\n"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\r\n  <div class=\"card-header\">\r\n    <p class=\"card-header-title\">{HEADING} - FROM {SENDER}</p>\r\n  </div>\r\n  <div class=\"card-content\">\r\n    {CONTENT}\r\n  </div>\r\n</div>\r\n"

/***/ })
/******/ ]);