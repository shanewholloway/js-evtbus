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

export default evtbus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZ0YnVzLm1qcyIsInNvdXJjZXMiOlsiLi4vY29kZS9ldnRidXMuanN5Il0sInNvdXJjZXNDb250ZW50IjpbIk9iamVjdC5hc3NpZ24gQCBldnRidXMsIGV2dGJ1cygpXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldnRidXMoKSA6OlxuICBjb25zdCBfYnlUb3BpYyA9IG5ldyBNYXAoKVxuICBjb25zdCBfYnlTaW5rID0gbmV3IFdlYWtNYXAoKVxuXG4gIHJldHVybiBAe30gdG9waWMsIHNpbmtcblxuICBmdW5jdGlvbiB0b3BpYyh0b3BpY18pIDo6XG4gICAgcmV0dXJuIEB7fVxuICAgICAgZW1pdChuYW1lLCBldnQpIDo6XG4gICAgICAgIGNvbnN0IG5zID0gYnlUb3BpYyh0b3BpY18pLCBsMSA9IG5zW25hbWVdLCBsMiA9IG5zWycqJ11cbiAgICAgICAgaWYgbDEgOjpcbiAgICAgICAgICBmb3IgY29uc3QgZm4gb2YgbDEgOjpcbiAgICAgICAgICAgIGZuKGV2dCwgdG9waWNfKVxuICAgICAgICBpZiBsMiA6OlxuICAgICAgICAgIGZvciBjb25zdCBmbiBvZiBsMiA6OlxuICAgICAgICAgICAgZm4oZXZ0LCBuYW1lLCB0b3BpY18pXG5cbiAgICAgIGNsZWFyKGV4cHVuZ2UpIDo6XG4gICAgICAgIGNvbnN0IG5zID0gX2J5VG9waWMuZ2V0KHRvcGljXylcbiAgICAgICAgaWYgISBucyA6OiByZXR1cm5cbiAgICAgICAgaWYgZXhwdW5nZSA6OiBfYnlUb3BpYy5kZWxldGUodG9waWNfKVxuICAgICAgICBjbGVhcl9ucyhucylcblxuXG4gIGZ1bmN0aW9uIGJ5VG9waWModG9waWNfLCBuYW1lKSA6OlxuICAgIGlmIG51bGwgPT0gdG9waWNfIDo6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHRvcGljJylcblxuICAgIGxldCBucyA9IF9ieVRvcGljLmdldCh0b3BpY18pXG4gICAgaWYgdW5kZWZpbmVkID09PSBucyA6OlxuICAgICAgY29uc3Qgb2JqID0gX2J5U2luay5nZXQodG9waWNfKVxuICAgICAgaWYgdW5kZWZpbmVkICE9PSBvYmogOjpcbiAgICAgICAgbnMgPSBvYmoubnMgfHwgQCBvYmoubnMgPSBjcmVhdGVfbnMoKVxuICAgICAgZWxzZSA6OlxuICAgICAgICBfYnlUb3BpYy5zZXQgQCB0b3BpY18sIG5zID0gY3JlYXRlX25zKClcbiAgICBpZiBuYW1lIDo6XG4gICAgICByZXR1cm4gbnNbbmFtZV0gfHwgQCBuc1tuYW1lXSA9IFtdXG4gICAgcmV0dXJuIG5zXG5cbiAgZnVuY3Rpb24gY3JlYXRlX25zKCkgOjogcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbClcbiAgZnVuY3Rpb24gY2xlYXJfbnMobnMpIDo6XG4gICAgZm9yIGNvbnN0IFtuYW1lLCBsc3RdIG9mIE9iamVjdC5lbnRyaWVzKG5zKSA6OlxuICAgICAgZGVsZXRlIG5zW25hbWVdXG4gICAgICBmb3IgY29uc3QgZWEgb2YgbHN0IDo6XG4gICAgICAgIGVhLmZuID0gZWEubHN0ID0gbnVsbFxuXG5cbiAgZnVuY3Rpb24gc2luayhzaW5rXykgOjpcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiBAIHNpbmssIEB7fSBzdWJzY3JpYmU6c2luaywgY2xlYXIsIG9uLCBlbWl0XG5cbiAgICBmdW5jdGlvbiBjbGVhcigpIDo6XG4gICAgICBjb25zdCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgZnVuY3MgOjpcbiAgICAgICAgX2J5U2luay5kZWxldGUoc2lua18pXG4gICAgICAgIGZvciBjb25zdCB7bHN0LCBmbn0gb2YgZnVuY3MgOjpcbiAgICAgICAgICAvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZlbG9waXQvbWl0dC9ibG9iL2U5MTFhYWNiZWMxN2YzYWVhMzNkNDY1NjM3YTExZmY2NzM4ZjUwYjIvc3JjL2luZGV4LmpzI0w0NFxuICAgICAgICAgIGlmIGxzdCA6OiBsc3Quc3BsaWNlIEAgbHN0LmluZGV4T2YoZm4pID4+PiAwLCAxXG4gICAgICAgIGZ1bmNzLmNsZWFyKClcbiAgICAgICAgaWYgZnVuY3MubnMgOjogY2xlYXJfbnMoZnVuY3MubnMpXG4gICAgICByZXR1cm4gc2lua1xuXG4gICAgZnVuY3Rpb24gZW1pdChuYW1lLCBldnQpIDo6XG4gICAgICBjb25zdCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgZnVuY3MgJiYgZnVuY3MubnMgOjpcbiAgICAgICAgdG9waWMoc2lua18pLmVtaXQobmFtZSwgZXZ0KVxuICAgICAgcmV0dXJuIHNpbmtcblxuICAgIGZ1bmN0aW9uIG9uKG5hbWUsIGZuKSA6OlxuICAgICAgcmV0dXJuIHNpbmsoc2lua18sIG5hbWUsIGZuKVxuXG4gICAgZnVuY3Rpb24gc2luayh0b3BpYywgbmFtZSwgZm4pIDo6XG4gICAgICBpZiAnZnVuY3Rpb24nICE9PSB0eXBlb2YgZm4gOjpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciBAICdFeHBlY3RlZCBmdW5jdGlvbidcblxuICAgICAgbGV0IGZ1bmNzID0gX2J5U2luay5nZXQoc2lua18pXG4gICAgICBpZiB1bmRlZmluZWQgPT09IGZ1bmNzIDo6XG4gICAgICAgIGZ1bmNzID0gbmV3IFNldCgpXG4gICAgICAgIF9ieVNpbmsuc2V0KHNpbmtfLCBmdW5jcylcblxuICAgICAgaWYgdG9waWMgOjpcbiAgICAgICAgY29uc3QgbHN0ID0gYnlUb3BpYyh0b3BpYywgbmFtZSlcbiAgICAgICAgZnVuY3MuYWRkIEA6IGZuLCBsc3RcbiAgICAgICAgbHN0LnB1c2ggQCBmblxuICAgICAgcmV0dXJuIHNpbmtcblxuIl0sIm5hbWVzIjpbIk9iamVjdCIsImFzc2lnbiIsImV2dGJ1cyIsIl9ieVRvcGljIiwiTWFwIiwiX2J5U2luayIsIldlYWtNYXAiLCJ0b3BpYyIsInNpbmsiLCJ0b3BpY18iLCJuYW1lIiwiZXZ0IiwibnMiLCJieVRvcGljIiwibDEiLCJsMiIsImZuIiwiZXhwdW5nZSIsImdldCIsImRlbGV0ZSIsIlR5cGVFcnJvciIsInVuZGVmaW5lZCIsIm9iaiIsImNyZWF0ZV9ucyIsInNldCIsImNyZWF0ZSIsImNsZWFyX25zIiwibHN0IiwiZW50cmllcyIsImVhIiwic2lua18iLCJzdWJzY3JpYmUiLCJjbGVhciIsIm9uIiwiZW1pdCIsImZ1bmNzIiwic3BsaWNlIiwiaW5kZXhPZiIsIlNldCIsImFkZCIsInB1c2giXSwibWFwcGluZ3MiOiJBQUFBQSxPQUFPQyxNQUFQLENBQWdCQyxNQUFoQixFQUF3QkEsUUFBeEI7QUFDQSxBQUFlLFNBQVNBLE1BQVQsR0FBa0I7UUFDekJDLFdBQVcsSUFBSUMsR0FBSixFQUFqQjtRQUNNQyxVQUFVLElBQUlDLE9BQUosRUFBaEI7O1NBRU8sRUFBSUMsS0FBSixFQUFXQyxJQUFYLEVBQVA7O1dBRVNELEtBQVQsQ0FBZUUsTUFBZixFQUF1QjtXQUNkO1dBQ0FDLElBQUwsRUFBV0MsR0FBWCxFQUFnQjtjQUNSQyxLQUFLQyxRQUFRSixNQUFSLENBQVg7Y0FBNEJLLEtBQUtGLEdBQUdGLElBQUgsQ0FBakM7Y0FBMkNLLEtBQUtILEdBQUcsR0FBSCxDQUFoRDtZQUNHRSxFQUFILEVBQVE7ZUFDRixNQUFNRSxFQUFWLElBQWdCRixFQUFoQixFQUFxQjtlQUNoQkgsR0FBSCxFQUFRRixNQUFSOzs7WUFDRE0sRUFBSCxFQUFRO2VBQ0YsTUFBTUMsRUFBVixJQUFnQkQsRUFBaEIsRUFBcUI7ZUFDaEJKLEdBQUgsRUFBUUQsSUFBUixFQUFjRCxNQUFkOzs7T0FSRDs7WUFVQ1EsT0FBTixFQUFlO2NBQ1BMLEtBQUtULFNBQVNlLEdBQVQsQ0FBYVQsTUFBYixDQUFYO1lBQ0csQ0FBRUcsRUFBTCxFQUFVOzs7WUFDUEssT0FBSCxFQUFhO21CQUFVRSxNQUFULENBQWdCVixNQUFoQjs7aUJBQ0xHLEVBQVQ7T0FkRyxFQUFQOzs7V0FpQk9DLE9BQVQsQ0FBaUJKLE1BQWpCLEVBQXlCQyxJQUF6QixFQUErQjtRQUMxQixRQUFRRCxNQUFYLEVBQW9CO1lBQ1osSUFBSVcsU0FBSixDQUFjLGVBQWQsQ0FBTjs7O1FBRUVS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
