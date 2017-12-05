'use strict';

Object.assign(evtbus, evtbus());
function evtbus() {
  const _byTopic = new Map();
  const _bySink = new WeakMap();

  return { topic, sink };

  function topic(topic_) {
    return {
      emit(name, evt) {
        const ns = byTopic(topic_),
              l1 = ns[name],
              l2 = ns['*'];
        if (l1) {
          for (const fn of l1) {
            fn(evt, topic_);
          }
        }
        if (l2) {
          for (const fn of l2) {
            fn(evt, name, topic_);
          }
        }
      },

      clear(expunge) {
        const ns = _byTopic.get(topic_);
        if (!ns) {
          return;
        }
        if (expunge) {
          _byTopic.delete(topic_);
        }
        clear_ns(ns);
      } };
  }

  function byTopic(topic_, name) {
    if (null == topic_) {
      throw new TypeError('Invalid topic');
    }

    let ns = _byTopic.get(topic_);
    if (undefined === ns) {
      const obj = _bySink.get(topic_);
      if (undefined !== obj) {
        ns = obj.ns || (obj.ns = create_ns());
      } else {
        _byTopic.set(topic_, ns = create_ns());
      }
    }
    if (name) {
      return ns[name] || (ns[name] = []);
    }
    return ns;
  }

  function create_ns() {
    return Object.create(null);
  }
  function clear_ns(ns) {
    for (const [name, lst] of Object.entries(ns)) {
      delete ns[name];
      for (const ea of lst) {
        ea.fn = ea.lst = null;
      }
    }
  }

  function sink(sink_) {
    return Object.assign(sink, { subscribe: sink, clear, on, emit });

    function clear() {
      const funcs = _bySink.get(sink_);
      if (funcs) {
        _bySink.delete(sink_);
        for (const { lst, fn } of funcs) {
          // from https://github.com/developit/mitt/blob/e911aacbec17f3aea33d465637a11ff6738f50b2/src/index.js#L44
          if (lst) {
            lst.splice(lst.indexOf(fn) >>> 0, 1);
          }
        }
        funcs.clear();
        if (funcs.ns) {
          clear_ns(funcs.ns);
        }
      }
      return sink;
    }

    function emit(name, evt) {
      const funcs = _bySink.get(sink_);
      if (funcs && funcs.ns) {
        topic(sink_).emit(name, evt);
      }
      return sink;
    }

    function on(name, fn) {
      return sink(sink_, name, fn);
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

      if (topic) {
        const lst = byTopic(topic, name);
        funcs.add({ fn, lst });
        lst.push(fn);
      }
      return sink;
    }
  }
}

module.exports = evtbus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZ0YnVzLmpzIiwic291cmNlcyI6WyIuLi9jb2RlL2V2dGJ1cy5qc3kiXSwic291cmNlc0NvbnRlbnQiOlsiT2JqZWN0LmFzc2lnbiBAIGV2dGJ1cywgZXZ0YnVzKClcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV2dGJ1cygpIDo6XG4gIGNvbnN0IF9ieVRvcGljID0gbmV3IE1hcCgpXG4gIGNvbnN0IF9ieVNpbmsgPSBuZXcgV2Vha01hcCgpXG5cbiAgcmV0dXJuIEB7fSB0b3BpYywgc2lua1xuXG4gIGZ1bmN0aW9uIHRvcGljKHRvcGljXykgOjpcbiAgICByZXR1cm4gQHt9XG4gICAgICBlbWl0KG5hbWUsIGV2dCkgOjpcbiAgICAgICAgY29uc3QgbnMgPSBieVRvcGljKHRvcGljXyksIGwxID0gbnNbbmFtZV0sIGwyID0gbnNbJyonXVxuICAgICAgICBpZiBsMSA6OlxuICAgICAgICAgIGZvciBjb25zdCBmbiBvZiBsMSA6OlxuICAgICAgICAgICAgZm4oZXZ0LCB0b3BpY18pXG4gICAgICAgIGlmIGwyIDo6XG4gICAgICAgICAgZm9yIGNvbnN0IGZuIG9mIGwyIDo6XG4gICAgICAgICAgICBmbihldnQsIG5hbWUsIHRvcGljXylcblxuICAgICAgY2xlYXIoZXhwdW5nZSkgOjpcbiAgICAgICAgY29uc3QgbnMgPSBfYnlUb3BpYy5nZXQodG9waWNfKVxuICAgICAgICBpZiAhIG5zIDo6IHJldHVyblxuICAgICAgICBpZiBleHB1bmdlIDo6IF9ieVRvcGljLmRlbGV0ZSh0b3BpY18pXG4gICAgICAgIGNsZWFyX25zKG5zKVxuXG5cbiAgZnVuY3Rpb24gYnlUb3BpYyh0b3BpY18sIG5hbWUpIDo6XG4gICAgaWYgbnVsbCA9PSB0b3BpY18gOjpcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdG9waWMnKVxuXG4gICAgbGV0IG5zID0gX2J5VG9waWMuZ2V0KHRvcGljXylcbiAgICBpZiB1bmRlZmluZWQgPT09IG5zIDo6XG4gICAgICBjb25zdCBvYmogPSBfYnlTaW5rLmdldCh0b3BpY18pXG4gICAgICBpZiB1bmRlZmluZWQgIT09IG9iaiA6OlxuICAgICAgICBucyA9IG9iai5ucyB8fCBAIG9iai5ucyA9IGNyZWF0ZV9ucygpXG4gICAgICBlbHNlIDo6XG4gICAgICAgIF9ieVRvcGljLnNldCBAIHRvcGljXywgbnMgPSBjcmVhdGVfbnMoKVxuICAgIGlmIG5hbWUgOjpcbiAgICAgIHJldHVybiBuc1tuYW1lXSB8fCBAIG5zW25hbWVdID0gW11cbiAgICByZXR1cm4gbnNcblxuICBmdW5jdGlvbiBjcmVhdGVfbnMoKSA6OiByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKVxuICBmdW5jdGlvbiBjbGVhcl9ucyhucykgOjpcbiAgICBmb3IgY29uc3QgW25hbWUsIGxzdF0gb2YgT2JqZWN0LmVudHJpZXMobnMpIDo6XG4gICAgICBkZWxldGUgbnNbbmFtZV1cbiAgICAgIGZvciBjb25zdCBlYSBvZiBsc3QgOjpcbiAgICAgICAgZWEuZm4gPSBlYS5sc3QgPSBudWxsXG5cblxuICBmdW5jdGlvbiBzaW5rKHNpbmtfKSA6OlxuICAgIHJldHVybiBPYmplY3QuYXNzaWduIEAgc2luaywgQHt9IHN1YnNjcmliZTpzaW5rLCBjbGVhciwgb24sIGVtaXRcblxuICAgIGZ1bmN0aW9uIGNsZWFyKCkgOjpcbiAgICAgIGNvbnN0IGZ1bmNzID0gX2J5U2luay5nZXQoc2lua18pXG4gICAgICBpZiBmdW5jcyA6OlxuICAgICAgICBfYnlTaW5rLmRlbGV0ZShzaW5rXylcbiAgICAgICAgZm9yIGNvbnN0IHtsc3QsIGZufSBvZiBmdW5jcyA6OlxuICAgICAgICAgIC8vIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RldmVsb3BpdC9taXR0L2Jsb2IvZTkxMWFhY2JlYzE3ZjNhZWEzM2Q0NjU2MzdhMTFmZjY3MzhmNTBiMi9zcmMvaW5kZXguanMjTDQ0XG4gICAgICAgICAgaWYgbHN0IDo6IGxzdC5zcGxpY2UgQCBsc3QuaW5kZXhPZihmbikgPj4+IDAsIDFcbiAgICAgICAgZnVuY3MuY2xlYXIoKVxuICAgICAgICBpZiBmdW5jcy5ucyA6OiBjbGVhcl9ucyhmdW5jcy5ucylcbiAgICAgIHJldHVybiBzaW5rXG5cbiAgICBmdW5jdGlvbiBlbWl0KG5hbWUsIGV2dCkgOjpcbiAgICAgIGNvbnN0IGZ1bmNzID0gX2J5U2luay5nZXQoc2lua18pXG4gICAgICBpZiBmdW5jcyAmJiBmdW5jcy5ucyA6OlxuICAgICAgICB0b3BpYyhzaW5rXykuZW1pdChuYW1lLCBldnQpXG4gICAgICByZXR1cm4gc2lua1xuXG4gICAgZnVuY3Rpb24gb24obmFtZSwgZm4pIDo6XG4gICAgICByZXR1cm4gc2luayhzaW5rXywgbmFtZSwgZm4pXG5cbiAgICBmdW5jdGlvbiBzaW5rKHRvcGljLCBuYW1lLCBmbikgOjpcbiAgICAgIGlmICdmdW5jdGlvbicgIT09IHR5cGVvZiBmbiA6OlxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yIEAgJ0V4cGVjdGVkIGZ1bmN0aW9uJ1xuXG4gICAgICBsZXQgZnVuY3MgPSBfYnlTaW5rLmdldChzaW5rXylcbiAgICAgIGlmIHVuZGVmaW5lZCA9PT0gZnVuY3MgOjpcbiAgICAgICAgZnVuY3MgPSBuZXcgU2V0KClcbiAgICAgICAgX2J5U2luay5zZXQoc2lua18sIGZ1bmNzKVxuXG4gICAgICBpZiB0b3BpYyA6OlxuICAgICAgICBjb25zdCBsc3QgPSBieVRvcGljKHRvcGljLCBuYW1lKVxuICAgICAgICBmdW5jcy5hZGQgQDogZm4sIGxzdFxuICAgICAgICBsc3QucHVzaCBAIGZuXG4gICAgICByZXR1cm4gc2lua1xuXG4iXSwibmFtZXMiOlsiT2JqZWN0IiwiYXNzaWduIiwiZXZ0YnVzIiwiX2J5VG9waWMiLCJNYXAiLCJfYnlTaW5rIiwiV2Vha01hcCIsInRvcGljIiwic2luayIsInRvcGljXyIsIm5hbWUiLCJldnQiLCJucyIsImJ5VG9waWMiLCJsMSIsImwyIiwiZm4iLCJleHB1bmdlIiwiZ2V0IiwiZGVsZXRlIiwiVHlwZUVycm9yIiwidW5kZWZpbmVkIiwib2JqIiwiY3JlYXRlX25zIiwic2V0IiwiY3JlYXRlIiwiY2xlYXJfbnMiLCJsc3QiLCJlbnRyaWVzIiwiZWEiLCJzaW5rXyIsInN1YnNjcmliZSIsImNsZWFyIiwib24iLCJlbWl0IiwiZnVuY3MiLCJzcGxpY2UiLCJpbmRleE9mIiwiU2V0IiwiYWRkIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBT0MsTUFBUCxDQUFnQkMsTUFBaEIsRUFBd0JBLFFBQXhCO0FBQ0EsQUFBZSxTQUFTQSxNQUFULEdBQWtCO1FBQ3pCQyxXQUFXLElBQUlDLEdBQUosRUFBakI7UUFDTUMsVUFBVSxJQUFJQyxPQUFKLEVBQWhCOztTQUVPLEVBQUlDLEtBQUosRUFBV0MsSUFBWCxFQUFQOztXQUVTRCxLQUFULENBQWVFLE1BQWYsRUFBdUI7V0FDZDtXQUNBQyxJQUFMLEVBQVdDLEdBQVgsRUFBZ0I7Y0FDUkMsS0FBS0MsUUFBUUosTUFBUixDQUFYO2NBQTRCSyxLQUFLRixHQUFHRixJQUFILENBQWpDO2NBQTJDSyxLQUFLSCxHQUFHLEdBQUgsQ0FBaEQ7WUFDR0UsRUFBSCxFQUFRO2VBQ0YsTUFBTUUsRUFBVixJQUFnQkYsRUFBaEIsRUFBcUI7ZUFDaEJILEdBQUgsRUFBUUYsTUFBUjs7O1lBQ0RNLEVBQUgsRUFBUTtlQUNGLE1BQU1DLEVBQVYsSUFBZ0JELEVBQWhCLEVBQXFCO2VBQ2hCSixHQUFILEVBQVFELElBQVIsRUFBY0QsTUFBZDs7O09BUkQ7O1lBVUNRLE9BQU4sRUFBZTtjQUNQTCxLQUFLVCxTQUFTZSxHQUFULENBQWFULE1BQWIsQ0FBWDtZQUNHLENBQUVHLEVBQUwsRUFBVTs7O1lBQ1BLLE9BQUgsRUFBYTttQkFBVUUsTUFBVCxDQUFnQlYsTUFBaEI7O2lCQUNMRyxFQUFUO09BZEcsRUFBUDs7O1dBaUJPQyxPQUFULENBQWlCSixNQUFqQixFQUF5QkMsSUFBekIsRUFBK0I7UUFDMUIsUUFBUUQsTUFBWCxFQUFvQjtZQUNaLElBQUlXLFNBQUosQ0FBYyxlQUFkLENBQU47OztRQUVF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
