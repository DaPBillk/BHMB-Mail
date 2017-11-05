module.exports = function(id, to, from, head, body) {
  this.sender = from;
  this.target = to;
  this.header = head;
  this.body = body;
  this.read = false;
};
