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

1. When a user shares a link we create a new subscription `judgeframework1.0/{group-id}` and append it to the url.
2. When a user visit the link and clicks on a voting card the `decision` is published to the subscription in (Step 1) and all participants will receive the event to be up-to-date.
3. In order to redeliver the latest state of the voting to clients which are out of sync we use the `retain` mechanism in the MQTT protocol. It allows to mark a published message as `retain`. A retain message is automatically published to all new and existing clients. The message contains the complete state of the latest voting. After each vote, the retain message gets overwritten and all following clients will receive the latest voting state.
4. A user can't vote twice we persist the current vote in the local storage.
