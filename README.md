# evtbus

Combination of an in-process "event bus" and a streamlined event emitter (e.g. [mitt](https://www.npmjs.com/package/mitt))


#### Example

```javascript
import eb from 'evtbus'

eb.sink(this).subscribe('topic', 'event', evt => console.log('on topic event', evt))
eb.sink(this).clear()

const topic = eb.topic('my-topic')
topic.emit('event', {info: 1942})
topic.clear()

```
