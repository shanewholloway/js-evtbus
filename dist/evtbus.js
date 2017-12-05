'use strict';

Object.assign(evtbus, evtbus());
function evtbus() {
  const _byTopic = new Map();
  const _bySink = new WeakMap();

  return { topic, sink };

  function topic(topic_) {
    return {
      emit(name, evt) {
        const tip = byTopic(topic_),
              l1 = tip[name],
              l2 = tip['*'];
        if (undefined !== l1) {
          for (const fn of l1) {
            fn(evt);
          }
        }
        if (undefined !== l2) {
          for (const fn of l2) {
            fn(evt, name);
          }
        }
      },

      clear(expunge) {
        const tip = _byTopic.get(topic_);
        if (undefined === tip) {
          return;
        }
        if (expunge) {
          _byTopic.delete(topic_);
        }
        for (const [name, lst] of Object.entries(tip)) {
          delete tip[name];
          for (const ea of lst) {
            ea.fn = ea.lst = null;
          }
        }
      } };
  }

  function byTopic(topic_, name) {
    if (null == topic_) {
      throw new TypeError('Invalid topic');
    }

    let tip = _byTopic.get(topic_);
    if (undefined === tip) {
      tip = Object.create(null);
      _byTopic.set(topic_, tip);
    }
    if (undefined === name) {
      return tip;
    }
    return tip[name] || (tip[name] = []);
  }

  function sink(sink_) {
    sink.subscribe = sink;
    sink.clear = clear;
    return sink;

    function clear() {
      const funcs = _bySink.get(sink_);
      if (undefined !== funcs) {
        _bySink.delete(sink_);
        for (const { lst, fn } of funcs) {
          // from https://github.com/developit/mitt/blob/e911aacbec17f3aea33d465637a11ff6738f50b2/src/index.js#L44
          if (lst) {
            lst.splice(lst.indexOf(fn) >>> 0, 1);
          }
        }
        funcs.clear();
      }
    }

    function sink(topic, name, fn) {
      if ('function' !== typeof fn) {
        throw new TypeError('Expected function');
      }

      let funcs = _bySink.get(sink_);
      if (undefined === funcs) {
        funcs = new Set();
        _bySink.set(sink_, funcs);
      }

      const lst = byTopic(topic, name);
      funcs.add({ fn, lst });
      lst.push(fn);
      return sink;
    }
  }
}

module.exports = evtbus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZ0YnVzLmpzIiwic291cmNlcyI6WyIuLi9jb2RlL2V2dGJ1cy5qc3kiXSwic291cmNlc0NvbnRlbnQiOlsiT2JqZWN0LmFzc2lnbiBAIGV2dGJ1cywgZXZ0YnVzKClcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV2dGJ1cygpIDo6XG4gIGNvbnN0IF9ieVRvcGljID0gbmV3IE1hcCgpXG4gIGNvbnN0IF9ieVNpbmsgPSBuZXcgV2Vha01hcCgpXG5cbiAgcmV0dXJuIEB7fSB0b3BpYywgc2lua1xuXG4gIGZ1bmN0aW9uIHRvcGljKHRvcGljXykgOjpcbiAgICByZXR1cm4gQHt9XG4gICAgICBlbWl0KG5hbWUsIGV2dCkgOjpcbiAgICAgICAgY29uc3QgdGlwID0gYnlUb3BpYyh0b3BpY18pLCBsMSA9IHRpcFtuYW1lXSwgbDIgPSB0aXBbJyonXVxuICAgICAgICBpZiB1bmRlZmluZWQgIT09IGwxIDo6XG4gICAgICAgICAgZm9yIGNvbnN0IGZuIG9mIGwxIDo6XG4gICAgICAgICAgICBmbihldnQpXG4gICAgICAgIGlmIHVuZGVmaW5lZCAhPT0gbDIgOjpcbiAgICAgICAgICBmb3IgY29uc3QgZm4gb2YgbDIgOjpcbiAgICAgICAgICAgIGZuKGV2dCwgbmFtZSlcblxuICAgICAgY2xlYXIoZXhwdW5nZSkgOjpcbiAgICAgICAgY29uc3QgdGlwID0gX2J5VG9waWMuZ2V0KHRvcGljXylcbiAgICAgICAgaWYgdW5kZWZpbmVkID09PSB0aXAgOjogcmV0dXJuXG4gICAgICAgIGlmIGV4cHVuZ2UgOjogX2J5VG9waWMuZGVsZXRlKHRvcGljXylcbiAgICAgICAgZm9yIGNvbnN0IFtuYW1lLCBsc3RdIG9mIE9iamVjdC5lbnRyaWVzKHRpcCkgOjpcbiAgICAgICAgICBkZWxldGUgdGlwW25hbWVdXG4gICAgICAgICAgZm9yIGNvbnN0IGVhIG9mIGxzdCA6OlxuICAgICAgICAgICAgZWEuZm4gPSBlYS5sc3QgPSBudWxsXG5cblxuICBmdW5jdGlvbiBieVRvcGljKHRvcGljXywgbmFtZSkgOjpcbiAgICBpZiBudWxsID09IHRvcGljXyA6OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB0b3BpYycpXG5cbiAgICBsZXQgdGlwID0gX2J5VG9waWMuZ2V0KHRvcGljXylcbiAgICBpZiB1bmRlZmluZWQgPT09IHRpcCA6OlxuICAgICAgdGlwID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICAgX2J5VG9waWMuc2V0KHRvcGljXywgdGlwKVxuICAgIGlmIHVuZGVmaW5lZCA9PT0gbmFtZSA6OlxuICAgICAgcmV0dXJuIHRpcFxuICAgIHJldHVybiB0aXBbbmFtZV0gfHwgQCB0aXBbbmFtZV0gPSBbXVxuXG5cbiAgZnVuY3Rpb24gc2luayhzaW5rXykgOjpcbiAgICBzaW5rLnN1YnNjcmliZSA9IHNpbmtcbiAgICBzaW5rLmNsZWFyID0gY2xlYXJcbiAgICByZXR1cm4gc2lua1xuXG4gICAgZnVuY3Rpb24gY2xlYXIoKSA6OlxuICAgICAgY29uc3QgZnVuY3MgPSBfYnlTaW5rLmdldChzaW5rXylcbiAgICAgIGlmIHVuZGVmaW5lZCAhPT0gZnVuY3MgOjpcbiAgICAgICAgX2J5U2luay5kZWxldGUoc2lua18pXG4gICAgICAgIGZvciBjb25zdCB7bHN0LCBmbn0gb2YgZnVuY3MgOjpcbiAgICAgICAgICAvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZlbG9waXQvbWl0dC9ibG9iL2U5MTFhYWNiZWMxN2YzYWVhMzNkNDY1NjM3YTExZmY2NzM4ZjUwYjIvc3JjL2luZGV4LmpzI0w0NFxuICAgICAgICAgIGlmIGxzdCA6OiBsc3Quc3BsaWNlIEAgbHN0LmluZGV4T2YoZm4pID4+PiAwLCAxXG4gICAgICAgIGZ1bmNzLmNsZWFyKClcblxuICAgIGZ1bmN0aW9uIHNpbmsodG9waWMsIG5hbWUsIGZuKSA6OlxuICAgICAgaWYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGZuIDo6XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IgQCAnRXhwZWN0ZWQgZnVuY3Rpb24nXG5cbiAgICAgIGxldCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgdW5kZWZpbmVkID09PSBmdW5jcyA6OlxuICAgICAgICBmdW5jcyA9IG5ldyBTZXQoKVxuICAgICAgICBfYnlTaW5rLnNldChzaW5rXywgZnVuY3MpXG5cbiAgICAgIGNvbnN0IGxzdCA9IGJ5VG9waWModG9waWMsIG5hbWUpXG4gICAgICBmdW5jcy5hZGQgQDogZm4sIGxzdFxuICAgICAgbHN0LnB1c2ggQCBmblxuICAgICAgcmV0dXJuIHNpbmtcblxuIl0sIm5hbWVzIjpbIk9iamVjdCIsImFzc2lnbiIsImV2dGJ1cyIsIl9ieVRvcGljIiwiTWFwIiwiX2J5U2luayIsIldlYWtNYXAiLCJ0b3BpYyIsInNpbmsiLCJ0b3BpY18iLCJuYW1lIiwiZXZ0IiwidGlwIiwiYnlUb3BpYyIsImwxIiwibDIiLCJ1bmRlZmluZWQiLCJmbiIsImV4cHVuZ2UiLCJnZXQiLCJkZWxldGUiLCJsc3QiLCJlbnRyaWVzIiwiZWEiLCJUeXBlRXJyb3IiLCJjcmVhdGUiLCJzZXQiLCJzaW5rXyIsInN1YnNjcmliZSIsImNsZWFyIiwiZnVuY3MiLCJzcGxpY2UiLCJpbmRleE9mIiwiU2V0IiwiYWRkIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsTUFBUCxDQUFnQkMsTUFBaEIsRUFBd0JBLFFBQXhCO0FBQ0EsQUFBZSxTQUFTQSxNQUFULEdBQWtCO1FBQ3pCQyxXQUFXLElBQUlDLEdBQUosRUFBakI7UUFDTUMsVUFBVSxJQUFJQyxPQUFKLEVBQWhCOztTQUVPLEVBQUlDLEtBQUosRUFBV0MsSUFBWCxFQUFQOztXQUVTRCxLQUFULENBQWVFLE1BQWYsRUFBdUI7V0FDZDtXQUNBQyxJQUFMLEVBQVdDLEdBQVgsRUFBZ0I7Y0FDUkMsTUFBTUMsUUFBUUosTUFBUixDQUFaO2NBQTZCSyxLQUFLRixJQUFJRixJQUFKLENBQWxDO2NBQTZDSyxLQUFLSCxJQUFJLEdBQUosQ0FBbEQ7WUFDR0ksY0FBY0YsRUFBakIs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
