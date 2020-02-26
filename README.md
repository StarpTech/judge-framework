# judge-framework

Judge-Framework for decision making

The framework was shown first in [code.talks commerce 2018 - Agile Transformation benötigt Einhörner](https://www.youtube.com/watch?v=t4eVn_MxOUQ)

## How does it work?

We use MQTT protocol to build a pub/sub model. All messages are transfered through the public [hivemq](https://www.hivemq.com/public-mqtt-broker/) MQTT broker.
We don't collect or send any sensitive data.

### In detail:

**Challenges:**

- Share a unique link
- Distribute votings to all clients
- Sync clients which arrived later
- Protect against double votes
- Protect against duplicate and out of order messages

### Browser state

When a user shares a link we create a new unique subscription in form of `judgeframework1.0/{group-id}` and store the group id in the url.

### Distribute votes

When a user visit the link and clicks on a voting card the `decision` is published to the subscription in (Step 1) and all participants will receive the event in order to be up-to-date.

### Sync stale clients

In order to redeliver the latest state of the voting to clients which are out of sync we use the `retain` mechanism in the MQTT protocol. It allows to mark a published message as `retain`. A retain message is automatically published to all new and existing clients. The message contains the complete state of the latest voting. After each vote, the retain message gets overwritten and all following clients will receive the latest voting state.

### Double votes

A user can't vote twice we persist the latest vote in the local storage.

### Message duplicates

We maintain a map to filter duplicates.

### Message order

Due to the fact that we are only interested in messages which increase the current state we can ignore all other messages.
