var Rule = require('./lib/rule');

module.exports = {
  rule(test) {
    return new Rule(test);
  }
};
