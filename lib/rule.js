var timeMap = {
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
  weeks: 7 * 24 * 60 * 60 * 1000,
};

function Rule(test) {
  this.test = test;
  this.countRequired = 0;
  this.remarks = [];
}

Rule.prototype = {
  remarkWith(remark) {
    this.remarks.push(remark);

    return this;
  }
  splitBy(splitFn) {
    this.throttleKeyGen = splitFn;

    return this;
  },
  atMostEvery(timeStr) {
    var [count, dur] = timeStr.split(' ');

    var multiplier = timeMap[dur] || timeMap[dur + 's'];

    this.throttleTime = parseFloat(count) * multiplier;

    return this;
  },
  withOdds(odds) {
    this.probability = odds;

    return this;
  },
  atCount(num) {
    this.countRequired = num;

    return this;
  },

  // Testing methods
  throttleKey() {
    var key;
    if (this.throttleKeyGen) {
      key = this.throttleKeyGen.apply(null, arguments);
    } else {
      key = 'global';
    }

    return key;
  },
  enoughTimeHasPassed(key) {
    if (this.throttleTime) {
      return this.state.enoughTimeHasPassed(key, this.throttleTime);
    } else {
      return true;
    }
  },
  happenedEnoughTimes(key) {
    if (this.countRequired === 0) {
      return true;
    } else {
      var countHappend = this.state.count(key);
      return countHappend === key;
    }
  },
  rollTheDice() {
    if (this.probability === 0) {
      return false;
    } else if (this.probability) {
      return Math.random() <= this.probability;
    } else {
      return true;
    }
  },
  shouldRespond() {
    var key = this.throttleKey.apply(this, arguments);

    this.state.attemptBy(key);

    if (!this.test.apply(null, arguments)) {
      return false;
    }

    this.state.testPassed(key);

    if (!this.enoughTimeHasPassed(key)) {
      return false;
    }

    if (!this.rollTheDice()) {
      return false;
    }

    if (!this.happenedEnoughTimes(key)) {
      return false;
    }

    this.state.respondBy(key);

    return true;
  },
  test() {
    if (this.shouldRespond.apply(this,arguments)) {
      var response = this.remarks[Math.floor(Math.random()*this.remarks.length)];

      return response;
    } else {
      return null;
    }
  }
};

module.exports = Rule;
