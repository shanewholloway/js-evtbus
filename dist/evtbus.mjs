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

export default evtbus;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZ0YnVzLm1qcyIsInNvdXJjZXMiOlsiLi4vY29kZS9ldnRidXMuanN5Il0sInNvdXJjZXNDb250ZW50IjpbIk9iamVjdC5hc3NpZ24gQCBldnRidXMsIGV2dGJ1cygpXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldnRidXMoKSA6OlxuICBjb25zdCBfYnlUb3BpYyA9IG5ldyBNYXAoKVxuICBjb25zdCBfYnlTaW5rID0gbmV3IFdlYWtNYXAoKVxuXG4gIHJldHVybiBAe30gdG9waWMsIHNpbmtcblxuICBmdW5jdGlvbiB0b3BpYyh0b3BpY18pIDo6XG4gICAgcmV0dXJuIEB7fVxuICAgICAgZW1pdChuYW1lLCBldnQpIDo6XG4gICAgICAgIGNvbnN0IHRpcCA9IGJ5VG9waWModG9waWNfKSwgbDEgPSB0aXBbbmFtZV0sIGwyID0gdGlwWycqJ11cbiAgICAgICAgaWYgdW5kZWZpbmVkICE9PSBsMSA6OlxuICAgICAgICAgIGZvciBjb25zdCBmbiBvZiBsMSA6OlxuICAgICAgICAgICAgZm4oZXZ0KVxuICAgICAgICBpZiB1bmRlZmluZWQgIT09IGwyIDo6XG4gICAgICAgICAgZm9yIGNvbnN0IGZuIG9mIGwyIDo6XG4gICAgICAgICAgICBmbihldnQsIG5hbWUpXG5cbiAgICAgIGNsZWFyKGV4cHVuZ2UpIDo6XG4gICAgICAgIGNvbnN0IHRpcCA9IF9ieVRvcGljLmdldCh0b3BpY18pXG4gICAgICAgIGlmIHVuZGVmaW5lZCA9PT0gdGlwIDo6IHJldHVyblxuICAgICAgICBpZiBleHB1bmdlIDo6IF9ieVRvcGljLmRlbGV0ZSh0b3BpY18pXG4gICAgICAgIGZvciBjb25zdCBbbmFtZSwgbHN0XSBvZiBPYmplY3QuZW50cmllcyh0aXApIDo6XG4gICAgICAgICAgZGVsZXRlIHRpcFtuYW1lXVxuICAgICAgICAgIGZvciBjb25zdCBlYSBvZiBsc3QgOjpcbiAgICAgICAgICAgIGVhLmZuID0gZWEubHN0ID0gbnVsbFxuXG5cbiAgZnVuY3Rpb24gYnlUb3BpYyh0b3BpY18sIG5hbWUpIDo6XG4gICAgaWYgbnVsbCA9PSB0b3BpY18gOjpcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdG9waWMnKVxuXG4gICAgbGV0IHRpcCA9IF9ieVRvcGljLmdldCh0b3BpY18pXG4gICAgaWYgdW5kZWZpbmVkID09PSB0aXAgOjpcbiAgICAgIHRpcCA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgIF9ieVRvcGljLnNldCh0b3BpY18sIHRpcClcbiAgICBpZiB1bmRlZmluZWQgPT09IG5hbWUgOjpcbiAgICAgIHJldHVybiB0aXBcbiAgICByZXR1cm4gdGlwW25hbWVdIHx8IEAgdGlwW25hbWVdID0gW11cblxuXG4gIGZ1bmN0aW9uIHNpbmsoc2lua18pIDo6XG4gICAgc2luay5zdWJzY3JpYmUgPSBzaW5rXG4gICAgc2luay5jbGVhciA9IGNsZWFyXG4gICAgcmV0dXJuIHNpbmtcblxuICAgIGZ1bmN0aW9uIGNsZWFyKCkgOjpcbiAgICAgIGNvbnN0IGZ1bmNzID0gX2J5U2luay5nZXQoc2lua18pXG4gICAgICBpZiB1bmRlZmluZWQgIT09IGZ1bmNzIDo6XG4gICAgICAgIF9ieVNpbmsuZGVsZXRlKHNpbmtfKVxuICAgICAgICBmb3IgY29uc3Qge2xzdCwgZm59IG9mIGZ1bmNzIDo6XG4gICAgICAgICAgLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV2ZWxvcGl0L21pdHQvYmxvYi9lOTExYWFjYmVjMTdmM2FlYTMzZDQ2NTYzN2ExMWZmNjczOGY1MGIyL3NyYy9pbmRleC5qcyNMNDRcbiAgICAgICAgICBpZiBsc3QgOjogbHN0LnNwbGljZSBAIGxzdC5pbmRleE9mKGZuKSA+Pj4gMCwgMVxuICAgICAgICBmdW5jcy5jbGVhcigpXG5cbiAgICBmdW5jdGlvbiBzaW5rKHRvcGljLCBuYW1lLCBmbikgOjpcbiAgICAgIGlmICdmdW5jdGlvbicgIT09IHR5cGVvZiBmbiA6OlxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yIEAgJ0V4cGVjdGVkIGZ1bmN0aW9uJ1xuXG4gICAgICBsZXQgZnVuY3MgPSBfYnlTaW5rLmdldChzaW5rXylcbiAgICAgIGlmIHVuZGVmaW5lZCA9PT0gZnVuY3MgOjpcbiAgICAgICAgZnVuY3MgPSBuZXcgU2V0KClcbiAgICAgICAgX2J5U2luay5zZXQoc2lua18sIGZ1bmNzKVxuXG4gICAgICBjb25zdCBsc3QgPSBieVRvcGljKHRvcGljLCBuYW1lKVxuICAgICAgZnVuY3MuYWRkIEA6IGZuLCBsc3RcbiAgICAgIGxzdC5wdXNoIEAgZm5cbiAgICAgIHJldHVybiBzaW5rXG5cbiJdLCJuYW1lcyI6WyJPYmplY3QiLCJhc3NpZ24iLCJldnRidXMiLCJfYnlUb3BpYyIsIk1hcCIsIl9ieVNpbmsiLCJXZWFrTWFwIiwidG9waWMiLCJzaW5rIiwidG9waWNfIiwibmFtZSIsImV2dCIsInRpcCIsImJ5VG9waWMiLCJsMSIsImwyIiwidW5kZWZpbmVkIiwiZm4iLCJleHB1bmdlIiwiZ2V0IiwiZGVsZXRlIiwibHN0IiwiZW50cmllcyIsImVhIiwiVHlwZUVycm9yIiwiY3JlYXRlIiwic2V0Iiwic2lua18iLCJzdWJzY3JpYmUiLCJjbGVhciIsImZ1bmNzIiwic3BsaWNlIiwiaW5kZXhPZiIsIlNldCIsImFkZCIsInB1c2giXSwibWFwcGluZ3MiOiJBQUFBQSxPQUFPQyxNQUFQLENBQWdCQyxNQUFoQixFQUF3QkEsUUFBeEI7QUFDQSxBQUFlLFNBQVNBLE1BQVQsR0FBa0I7UUFDekJDLFdBQVcsSUFBSUMsR0FBSixFQUFqQjtRQUNNQyxVQUFVLElBQUlDLE9BQUosRUFBaEI7O1NBRU8sRUFBSUMsS0FBSixFQUFXQyxJQUFYLEVBQVA7O1dBRVNELEtBQVQsQ0FBZUUsTUFBZixFQUF1QjtXQUNkO1dBQ0FDLElBQUwsRUFBV0MsR0FBWCxFQUFnQjtjQUNSQyxNQUFNQyxRQUFRSixNQUFSLENBQVo7Y0FBNkJLLEtBQUtGLElBQUlGLElBQUosQ0FBbEM7Y0FBNkNLLEtBQUtILElBQUksR0FBSixDQUFsRDtZQUNHSSxjQUFjRixFQUFqQixF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
