var Letter = require("./Letter.js");
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
