'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(evtbus$1, evtbus$1());
function evtbus$1() {
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

function withSubscribe(evtbus, Component) {
  const C = class C extends Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.state = this.state || {}, _temp;
    }

    subscriptions(props) {}
    setSubscriptionState(sub_state, cleanup) {
      if (undefined !== cleanup) {
        Object.assign(this.state, sub_state);
        this.evt_sink.on('cleanup', cleanup);
      } else {
        this.setState(sub_state);
      }
    }

    componentWillMount() {
      bindSubscriptions(this);
    }

    componentWillUnmount(...args) {
      this.evt_sink.emit('cleanup').clear();
    }

    get evt_sink() {
      return evtbus.sink(this);
    }
  };

  C.prototype.evtbus = evtbus;
  return C;
}

function bindSubscriptions(component) {
  const subscriptions = 'function' === typeof component.subscriptions ? component.subscriptions(component.props) : component.subscriptions;

  if (null == subscriptions) {
    return;
  }

  const sub_state = {},
        unwind = [];
  let q = null;

  for (const [attr, sub] of Object.entries(subscriptions)) {
    if (null == sub || 'function' !== typeof sub.subscribe) {
      throw new TypeError(`Subscription "${attr}" does not have a subscribe() function`);
    }

    unwind.push(sub.subscribe(v => {
      sub_state[attr] = v;
      if (null === q) {
        q = resolveNext();
      }
    }));
  }

  component.setSubscriptionState(sub_state, unsubscribeAll);

  function unsubscribeAll() {
    for (const unsub of unwind.splice(0, unwind.length)) {
      unsub();
    }
  }

  // use promise resolution to debounce updates
  function resolveNext() {
    return Promise.resolve().then(() => {
      component.setSubscriptionState(sub_state);
      q = null;
    });
  }
}

exports.evtbus = evtbus$1;
exports['default'] = evtbus$1;
exports.withSubscribe = withSubscribe;
exports.bindSubscriptions = bindSubscriptions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2NvZGUvZXZ0YnVzLmpzeSIsIi4uL2NvZGUvcmVhY3QuanN5Il0sInNvdXJjZXNDb250ZW50IjpbIk9iamVjdC5hc3NpZ24gQCBldnRidXMsIGV2dGJ1cygpXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldnRidXMoKSA6OlxuICBjb25zdCBfYnlUb3BpYyA9IG5ldyBNYXAoKVxuICBjb25zdCBfYnlTaW5rID0gbmV3IFdlYWtNYXAoKVxuXG4gIHJldHVybiBAe30gdG9waWMsIHNpbmtcblxuICBmdW5jdGlvbiB0b3BpYyh0b3BpY18pIDo6XG4gICAgcmV0dXJuIEB7fVxuICAgICAgZW1pdChuYW1lLCBldnQpIDo6XG4gICAgICAgIGNvbnN0IG5zID0gYnlUb3BpYyh0b3BpY18pLCBsMSA9IG5zW25hbWVdLCBsMiA9IG5zWycqJ11cbiAgICAgICAgaWYgbDEgOjpcbiAgICAgICAgICBmb3IgY29uc3QgZm4gb2YgbDEgOjpcbiAgICAgICAgICAgIGZuKGV2dCwgdG9waWNfKVxuICAgICAgICBpZiBsMiA6OlxuICAgICAgICAgIGZvciBjb25zdCBmbiBvZiBsMiA6OlxuICAgICAgICAgICAgZm4oZXZ0LCBuYW1lLCB0b3BpY18pXG5cbiAgICAgIGNsZWFyKGV4cHVuZ2UpIDo6XG4gICAgICAgIGNvbnN0IG5zID0gX2J5VG9waWMuZ2V0KHRvcGljXylcbiAgICAgICAgaWYgISBucyA6OiByZXR1cm5cbiAgICAgICAgaWYgZXhwdW5nZSA6OiBfYnlUb3BpYy5kZWxldGUodG9waWNfKVxuICAgICAgICBjbGVhcl9ucyhucylcblxuXG4gIGZ1bmN0aW9uIGJ5VG9waWModG9waWNfLCBuYW1lKSA6OlxuICAgIGlmIG51bGwgPT0gdG9waWNfIDo6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHRvcGljJylcblxuICAgIGxldCBucyA9IF9ieVRvcGljLmdldCh0b3BpY18pXG4gICAgaWYgdW5kZWZpbmVkID09PSBucyA6OlxuICAgICAgY29uc3Qgb2JqID0gX2J5U2luay5nZXQodG9waWNfKVxuICAgICAgaWYgdW5kZWZpbmVkICE9PSBvYmogOjpcbiAgICAgICAgbnMgPSBvYmoubnMgfHwgQCBvYmoubnMgPSBjcmVhdGVfbnMoKVxuICAgICAgZWxzZSA6OlxuICAgICAgICBfYnlUb3BpYy5zZXQgQCB0b3BpY18sIG5zID0gY3JlYXRlX25zKClcbiAgICBpZiBuYW1lIDo6XG4gICAgICByZXR1cm4gbnNbbmFtZV0gfHwgQCBuc1tuYW1lXSA9IFtdXG4gICAgcmV0dXJuIG5zXG5cbiAgZnVuY3Rpb24gY3JlYXRlX25zKCkgOjogcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbClcbiAgZnVuY3Rpb24gY2xlYXJfbnMobnMpIDo6XG4gICAgZm9yIGNvbnN0IFtuYW1lLCBsc3RdIG9mIE9iamVjdC5lbnRyaWVzKG5zKSA6OlxuICAgICAgZGVsZXRlIG5zW25hbWVdXG4gICAgICBmb3IgY29uc3QgZWEgb2YgbHN0IDo6XG4gICAgICAgIGVhLmZuID0gZWEubHN0ID0gbnVsbFxuXG5cbiAgZnVuY3Rpb24gc2luayhzaW5rXykgOjpcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiBAIHNpbmssIEB7fSBzdWJzY3JpYmU6c2luaywgY2xlYXIsIG9uLCBlbWl0XG5cbiAgICBmdW5jdGlvbiBjbGVhcigpIDo6XG4gICAgICBjb25zdCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgZnVuY3MgOjpcbiAgICAgICAgX2J5U2luay5kZWxldGUoc2lua18pXG4gICAgICAgIGZvciBjb25zdCB7bHN0LCBmbn0gb2YgZnVuY3MgOjpcbiAgICAgICAgICAvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZlbG9waXQvbWl0dC9ibG9iL2U5MTFhYWNiZWMxN2YzYWVhMzNkNDY1NjM3YTExZmY2NzM4ZjUwYjIvc3JjL2luZGV4LmpzI0w0NFxuICAgICAgICAgIGlmIGxzdCA6OiBsc3Quc3BsaWNlIEAgbHN0LmluZGV4T2YoZm4pID4+PiAwLCAxXG4gICAgICAgIGZ1bmNzLmNsZWFyKClcbiAgICAgICAgaWYgZnVuY3MubnMgOjogY2xlYXJfbnMoZnVuY3MubnMpXG4gICAgICByZXR1cm4gc2lua1xuXG4gICAgZnVuY3Rpb24gZW1pdChuYW1lLCBldnQpIDo6XG4gICAgICBjb25zdCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgZnVuY3MgJiYgZnVuY3MubnMgOjpcbiAgICAgICAgdG9waWMoc2lua18pLmVtaXQobmFtZSwgZXZ0KVxuICAgICAgcmV0dXJuIHNpbmtcblxuICAgIGZ1bmN0aW9uIG9uKG5hbWUsIGZuKSA6OlxuICAgICAgcmV0dXJuIHNpbmsoc2lua18sIG5hbWUsIGZuKVxuXG4gICAgZnVuY3Rpb24gc2luayh0b3BpYywgbmFtZSwgZm4pIDo6XG4gICAgICBpZiAnZnVuY3Rpb24nICE9PSB0eXBlb2YgZm4gOjpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciBAICdFeHBlY3RlZCBmdW5jdGlvbidcblxuICAgICAgbGV0IGZ1bmNzID0gX2J5U2luay5nZXQoc2lua18pXG4gICAgICBpZiB1bmRlZmluZWQgPT09IGZ1bmNzIDo6XG4gICAgICAgIGZ1bmNzID0gbmV3IFNldCgpXG4gICAgICAgIF9ieVNpbmsuc2V0KHNpbmtfLCBmdW5jcylcblxuICAgICAgaWYgdG9waWMgOjpcbiAgICAgICAgY29uc3QgbHN0ID0gYnlUb3BpYyh0b3BpYywgbmFtZSlcbiAgICAgICAgZnVuY3MuYWRkIEA6IGZuLCBsc3RcbiAgICAgICAgbHN0LnB1c2ggQCBmblxuICAgICAgcmV0dXJuIHNpbmtcblxuIiwiZXhwb3J0IGZ1bmN0aW9uIHdpdGhTdWJzY3JpYmUoZXZ0YnVzLCBDb21wb25lbnQpIDo6XG4gIGNvbnN0IEMgPSBjbGFzcyBleHRlbmRzIENvbXBvbmVudCA6OlxuICAgIHN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fVxuXG4gICAgc3Vic2NyaXB0aW9ucyhwcm9wcykgOjpcbiAgICBzZXRTdWJzY3JpcHRpb25TdGF0ZShzdWJfc3RhdGUsIGNsZWFudXApIDo6XG4gICAgICBpZiB1bmRlZmluZWQgIT09IGNsZWFudXAgOjpcbiAgICAgICAgT2JqZWN0LmFzc2lnbiBAIHRoaXMuc3RhdGUsIHN1Yl9zdGF0ZVxuICAgICAgICB0aGlzLmV2dF9zaW5rLm9uIEAgJ2NsZWFudXAnLCBjbGVhbnVwXG4gICAgICBlbHNlIDo6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3ViX3N0YXRlKVxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkgOjpcbiAgICAgIGJpbmRTdWJzY3JpcHRpb25zKHRoaXMpXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCguLi5hcmdzKSA6OlxuICAgICAgdGhpcy5ldnRfc2luay5lbWl0KCdjbGVhbnVwJykuY2xlYXIoKVxuXG4gICAgZ2V0IGV2dF9zaW5rKCkgOjogcmV0dXJuIGV2dGJ1cy5zaW5rKHRoaXMpXG5cbiAgQy5wcm90b3R5cGUuZXZ0YnVzID0gZXZ0YnVzXG4gIHJldHVybiBDXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRTdWJzY3JpcHRpb25zKGNvbXBvbmVudCkgOjpcbiAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9ICdmdW5jdGlvbicgPT09IHR5cGVvZiBjb21wb25lbnQuc3Vic2NyaXB0aW9uc1xuICAgID8gY29tcG9uZW50LnN1YnNjcmlwdGlvbnMoY29tcG9uZW50LnByb3BzKVxuICAgIDogY29tcG9uZW50LnN1YnNjcmlwdGlvbnNcblxuICBpZiBudWxsID09IHN1YnNjcmlwdGlvbnMgOjogcmV0dXJuXG5cbiAgY29uc3Qgc3ViX3N0YXRlPXt9LCB1bndpbmQ9W11cbiAgbGV0IHEgPSBudWxsXG5cbiAgZm9yIGNvbnN0IFthdHRyLCBzdWJdIG9mIE9iamVjdC5lbnRyaWVzIEAgc3Vic2NyaXB0aW9ucyA6OlxuICAgIGlmIG51bGwgPT0gc3ViIHx8ICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdWIuc3Vic2NyaWJlIDo6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yIEAgYFN1YnNjcmlwdGlvbiBcIiR7YXR0cn1cIiBkb2VzIG5vdCBoYXZlIGEgc3Vic2NyaWJlKCkgZnVuY3Rpb25gXG5cbiAgICB1bndpbmQucHVzaCBAXG4gICAgICBzdWIuc3Vic2NyaWJlIEAgdiA9PiA6OlxuICAgICAgICBzdWJfc3RhdGVbYXR0cl0gPSB2XG4gICAgICAgIGlmIG51bGwgPT09IHEgOjpcbiAgICAgICAgICBxID0gcmVzb2x2ZU5leHQoKVxuXG4gIGNvbXBvbmVudC5zZXRTdWJzY3JpcHRpb25TdGF0ZSBAIHN1Yl9zdGF0ZSwgdW5zdWJzY3JpYmVBbGxcblxuICBmdW5jdGlvbiB1bnN1YnNjcmliZUFsbCgpIDo6XG4gICAgZm9yIGNvbnN0IHVuc3ViIG9mIHVud2luZC5zcGxpY2UgQCAwLCB1bndpbmQubGVuZ3RoIDo6XG4gICAgICB1bnN1YigpXG5cbiAgLy8gdXNlIHByb21pc2UgcmVzb2x1dGlvbiB0byBkZWJvdW5jZSB1cGRhdGVzXG4gIGZ1bmN0aW9uIHJlc29sdmVOZXh0KCkgOjpcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbiBAICgpID0+IDo6XG4gICAgICBjb21wb25lbnQuc2V0U3Vic2NyaXB0aW9uU3RhdGUgQCBzdWJfc3RhdGVcbiAgICAgIHEgPSBudWxsXG4iXSwibmFtZXMiOlsiT2JqZWN0IiwiYXNzaWduIiwiZXZ0YnVzIiwiX2J5VG9waWMiLCJNYXAiLCJfYnlTaW5rIiwiV2Vha01hcCIsInRvcGljIiwic2luayIsInRvcGljXyIsIm5hbWUiLCJldnQiLCJucyIsImJ5VG9waWMiLCJsMSIsImwyIiwiZm4iLCJleHB1bmdlIiwiZ2V0IiwiZGVsZXRlIiwiVHlwZUVycm9yIiwidW5kZWZpbmVkIiwib2JqIiwiY3JlYXRlX25zIiwic2V0IiwiY3JlYXRlIiwiY2xlYXJfbnMiLCJsc3QiLCJlbnRyaWVzIiwiZWEiLCJzaW5rXyIsInN1YnNjcmliZSIsImNsZWFyIiwib24iLCJlbWl0IiwiZnVuY3MiLCJzcGxpY2UiLCJpbmRleE9mIiwiU2V0IiwiYWRkIiwicHVzaCIsIndpdGhTdWJzY3JpYmUiLCJDb21wb25lbnQiLCJDIiwic3RhdGUiLCJwcm9wcyIsInN1Yl9zdGF0ZSIsImNsZWFudXAiLCJldnRfc2luayIsInNldFN0YXRlIiwiYXJncyIsInByb3RvdHlwZSIsImJpbmRTdWJzY3JpcHRpb25zIiwiY29tcG9uZW50Iiwic3Vic2NyaXB0aW9ucyIsInVud2luZCIsInEiLCJhdHRyIiwic3ViIiwidiIsInJlc29sdmVOZXh0Iiwic2V0U3Vic2NyaXB0aW9uU3RhdGUiLCJ1bnN1YnNjcmliZUFsbCIsInVuc3ViIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUFBLE9BQU9DLE1BQVAsQ0FBZ0JDLFFBQWhCLEVBQXdCQSxVQUF4QjtBQUNBLEFBQWUsU0FBU0EsUUFBVCxHQUFrQjtRQUN6QkMsV0FBVyxJQUFJQyxHQUFKLEVBQWpCO1FBQ01DLFVBQVUsSUFBSUMsT0FBSixFQUFoQjs7U0FFTyxFQUFJQyxLQUFKLEVBQVdDLElBQVgsRUFBUDs7V0FFU0QsS0FBVCxDQUFlRSxNQUFmLEVBQXVCO1dBQ2Q7V0FDQUMsSUFBTCxFQUFXQyxHQUFYLEVBQWdCO2NBQ1JDLEtBQUtDLFFBQVFKLE1BQVIsQ0FBWDtjQUE0QkssS0FBS0YsR0FBR0YsSUFBSCxDQUFqQztjQUEyQ0ssS0FBS0gsR0FBRyxHQUFILENBQWhEO1lBQ0dFLEVBQUgsRUFBUTtlQUNGLE1BQU1FLEVBQVYsSUFBZ0JGLEVBQWhCLEVBQXFCO2VBQ2hCSCxHQUFILEVBQVFGLE1BQVI7OztZQUNETSxFQUFILEVBQVE7ZUFDRixNQUFNQyxFQUFWLElBQWdCRCxFQUFoQixFQUFxQjtlQUNoQkosR0FBSCxFQUFRRCxJQUFSLEVBQWNELE1BQWQ7OztPQVJEOztZQVVDUSxPQUFOLEVBQWU7Y0FDUEwsS0FBS1QsU0FBU2UsR0FBVCxDQUFhVCxNQUFiLENBQVg7WUFDRyxDQUFFRyxFQUFMLEVBQVU7OztZQUNQSyxPQUFILEVBQWE7bUJBQVVF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
