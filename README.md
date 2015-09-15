# Pithy Talk
Pithy talk is a library for making lighthearted responses based on criteria.

## Usage

Create a rule

```js
var rule = pithy.rule((pr) => pr.branchName.length > 20).atMostEvery('120 minutes').withOdds(1/10).splitBy((pr, callerMsg) => callerMsg.userName);
```

This rule will only return anything if the pr's branch name is more than 20 characters long.
And even then it'll only be triggered 10% of the time. But the throttling is unique
to each username. So each user triggering can only get it once every 2 hours.

Next you add in some phrases for it to say back.

```js
rule.remark("woah, that's a long branch name, did @paul write it?");
```

If you add multiple phrases it'll randomly pick one to respond with.

```js
rule.remark((pr, callerMsg) => {
  return `@${callerMsg.userName} are you sure you want such a long pull request message?`;
})
```

To actually run the test you do

```js
var response = rule.test(pr, callerMsg);
if (response) {
  callerMsg.reply(response);
}
```

## Limits

There are different ways to limit when a message goes out:

- `atMostEvery(timeString)` this throttles the message, so it can't be said too frequently, when combined with
`splitBy(fn)` you can have a different timer for various users/event types.
- `withOdds(float)` this just adds some random chance in, so it only can happen every so often.
- `atCount(int)` this will trigger the event only after the rule has returned true a specified number of times,
this also respects the `splitBy(fn)` differntiator so you can have a sperate count per user/event
- `splitBy((args) => str)` splits the throttling by the key string returned from the passed in function
