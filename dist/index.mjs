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

export { evtbus$1 as evtbus, withSubscribe, bindSubscriptions };
export default evtbus$1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi9jb2RlL2V2dGJ1cy5qc3kiLCIuLi9jb2RlL3JlYWN0LmpzeSJdLCJzb3VyY2VzQ29udGVudCI6WyJPYmplY3QuYXNzaWduIEAgZXZ0YnVzLCBldnRidXMoKVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXZ0YnVzKCkgOjpcbiAgY29uc3QgX2J5VG9waWMgPSBuZXcgTWFwKClcbiAgY29uc3QgX2J5U2luayA9IG5ldyBXZWFrTWFwKClcblxuICByZXR1cm4gQHt9IHRvcGljLCBzaW5rXG5cbiAgZnVuY3Rpb24gdG9waWModG9waWNfKSA6OlxuICAgIHJldHVybiBAe31cbiAgICAgIGVtaXQobmFtZSwgZXZ0KSA6OlxuICAgICAgICBjb25zdCBucyA9IGJ5VG9waWModG9waWNfKSwgbDEgPSBuc1tuYW1lXSwgbDIgPSBuc1snKiddXG4gICAgICAgIGlmIGwxIDo6XG4gICAgICAgICAgZm9yIGNvbnN0IGZuIG9mIGwxIDo6XG4gICAgICAgICAgICBmbihldnQsIHRvcGljXylcbiAgICAgICAgaWYgbDIgOjpcbiAgICAgICAgICBmb3IgY29uc3QgZm4gb2YgbDIgOjpcbiAgICAgICAgICAgIGZuKGV2dCwgbmFtZSwgdG9waWNfKVxuXG4gICAgICBjbGVhcihleHB1bmdlKSA6OlxuICAgICAgICBjb25zdCBucyA9IF9ieVRvcGljLmdldCh0b3BpY18pXG4gICAgICAgIGlmICEgbnMgOjogcmV0dXJuXG4gICAgICAgIGlmIGV4cHVuZ2UgOjogX2J5VG9waWMuZGVsZXRlKHRvcGljXylcbiAgICAgICAgY2xlYXJfbnMobnMpXG5cblxuICBmdW5jdGlvbiBieVRvcGljKHRvcGljXywgbmFtZSkgOjpcbiAgICBpZiBudWxsID09IHRvcGljXyA6OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB0b3BpYycpXG5cbiAgICBsZXQgbnMgPSBfYnlUb3BpYy5nZXQodG9waWNfKVxuICAgIGlmIHVuZGVmaW5lZCA9PT0gbnMgOjpcbiAgICAgIGNvbnN0IG9iaiA9IF9ieVNpbmsuZ2V0KHRvcGljXylcbiAgICAgIGlmIHVuZGVmaW5lZCAhPT0gb2JqIDo6XG4gICAgICAgIG5zID0gb2JqLm5zIHx8IEAgb2JqLm5zID0gY3JlYXRlX25zKClcbiAgICAgIGVsc2UgOjpcbiAgICAgICAgX2J5VG9waWMuc2V0IEAgdG9waWNfLCBucyA9IGNyZWF0ZV9ucygpXG4gICAgaWYgbmFtZSA6OlxuICAgICAgcmV0dXJuIG5zW25hbWVdIHx8IEAgbnNbbmFtZV0gPSBbXVxuICAgIHJldHVybiBuc1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZV9ucygpIDo6IHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpXG4gIGZ1bmN0aW9uIGNsZWFyX25zKG5zKSA6OlxuICAgIGZvciBjb25zdCBbbmFtZSwgbHN0XSBvZiBPYmplY3QuZW50cmllcyhucykgOjpcbiAgICAgIGRlbGV0ZSBuc1tuYW1lXVxuICAgICAgZm9yIGNvbnN0IGVhIG9mIGxzdCA6OlxuICAgICAgICBlYS5mbiA9IGVhLmxzdCA9IG51bGxcblxuXG4gIGZ1bmN0aW9uIHNpbmsoc2lua18pIDo6XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24gQCBzaW5rLCBAe30gc3Vic2NyaWJlOnNpbmssIGNsZWFyLCBvbiwgZW1pdFxuXG4gICAgZnVuY3Rpb24gY2xlYXIoKSA6OlxuICAgICAgY29uc3QgZnVuY3MgPSBfYnlTaW5rLmdldChzaW5rXylcbiAgICAgIGlmIGZ1bmNzIDo6XG4gICAgICAgIF9ieVNpbmsuZGVsZXRlKHNpbmtfKVxuICAgICAgICBmb3IgY29uc3Qge2xzdCwgZm59IG9mIGZ1bmNzIDo6XG4gICAgICAgICAgLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV2ZWxvcGl0L21pdHQvYmxvYi9lOTExYWFjYmVjMTdmM2FlYTMzZDQ2NTYzN2ExMWZmNjczOGY1MGIyL3NyYy9pbmRleC5qcyNMNDRcbiAgICAgICAgICBpZiBsc3QgOjogbHN0LnNwbGljZSBAIGxzdC5pbmRleE9mKGZuKSA+Pj4gMCwgMVxuICAgICAgICBmdW5jcy5jbGVhcigpXG4gICAgICAgIGlmIGZ1bmNzLm5zIDo6IGNsZWFyX25zKGZ1bmNzLm5zKVxuICAgICAgcmV0dXJuIHNpbmtcblxuICAgIGZ1bmN0aW9uIGVtaXQobmFtZSwgZXZ0KSA6OlxuICAgICAgY29uc3QgZnVuY3MgPSBfYnlTaW5rLmdldChzaW5rXylcbiAgICAgIGlmIGZ1bmNzICYmIGZ1bmNzLm5zIDo6XG4gICAgICAgIHRvcGljKHNpbmtfKS5lbWl0KG5hbWUsIGV2dClcbiAgICAgIHJldHVybiBzaW5rXG5cbiAgICBmdW5jdGlvbiBvbihuYW1lLCBmbikgOjpcbiAgICAgIHJldHVybiBzaW5rKHNpbmtfLCBuYW1lLCBmbilcblxuICAgIGZ1bmN0aW9uIHNpbmsodG9waWMsIG5hbWUsIGZuKSA6OlxuICAgICAgaWYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGZuIDo6XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IgQCAnRXhwZWN0ZWQgZnVuY3Rpb24nXG5cbiAgICAgIGxldCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgdW5kZWZpbmVkID09PSBmdW5jcyA6OlxuICAgICAgICBmdW5jcyA9IG5ldyBTZXQoKVxuICAgICAgICBfYnlTaW5rLnNldChzaW5rXywgZnVuY3MpXG5cbiAgICAgIGlmIHRvcGljIDo6XG4gICAgICAgIGNvbnN0IGxzdCA9IGJ5VG9waWModG9waWMsIG5hbWUpXG4gICAgICAgIGZ1bmNzLmFkZCBAOiBmbiwgbHN0XG4gICAgICAgIGxzdC5wdXNoIEAgZm5cbiAgICAgIHJldHVybiBzaW5rXG5cbiIsImV4cG9ydCBmdW5jdGlvbiB3aXRoU3Vic2NyaWJlKGV2dGJ1cywgQ29tcG9uZW50KSA6OlxuICBjb25zdCBDID0gY2xhc3MgZXh0ZW5kcyBDb21wb25lbnQgOjpcbiAgICBzdGF0ZSA9IHRoaXMuc3RhdGUgfHwge31cblxuICAgIHN1YnNjcmlwdGlvbnMocHJvcHMpIDo6XG4gICAgc2V0U3Vic2NyaXB0aW9uU3RhdGUoc3ViX3N0YXRlLCBjbGVhbnVwKSA6OlxuICAgICAgaWYgdW5kZWZpbmVkICE9PSBjbGVhbnVwIDo6XG4gICAgICAgIE9iamVjdC5hc3NpZ24gQCB0aGlzLnN0YXRlLCBzdWJfc3RhdGVcbiAgICAgICAgdGhpcy5ldnRfc2luay5vbiBAICdjbGVhbnVwJywgY2xlYW51cFxuICAgICAgZWxzZSA6OlxuICAgICAgICB0aGlzLnNldFN0YXRlKHN1Yl9zdGF0ZSlcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIDo6XG4gICAgICBiaW5kU3Vic2NyaXB0aW9ucyh0aGlzKVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoLi4uYXJncykgOjpcbiAgICAgIHRoaXMuZXZ0X3NpbmsuZW1pdCgnY2xlYW51cCcpLmNsZWFyKClcblxuICAgIGdldCBldnRfc2luaygpIDo6IHJldHVybiBldnRidXMuc2luayh0aGlzKVxuXG4gIEMucHJvdG90eXBlLmV2dGJ1cyA9IGV2dGJ1c1xuICByZXR1cm4gQ1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kU3Vic2NyaXB0aW9ucyhjb21wb25lbnQpIDo6XG4gIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSAnZnVuY3Rpb24nID09PSB0eXBlb2YgY29tcG9uZW50LnN1YnNjcmlwdGlvbnNcbiAgICA/IGNvbXBvbmVudC5zdWJzY3JpcHRpb25zKGNvbXBvbmVudC5wcm9wcylcbiAgICA6IGNvbXBvbmVudC5zdWJzY3JpcHRpb25zXG5cbiAgaWYgbnVsbCA9PSBzdWJzY3JpcHRpb25zIDo6IHJldHVyblxuXG4gIGNvbnN0IHN1Yl9zdGF0ZT17fSwgdW53aW5kPVtdXG4gIGxldCBxID0gbnVsbFxuXG4gIGZvciBjb25zdCBbYXR0ciwgc3ViXSBvZiBPYmplY3QuZW50cmllcyBAIHN1YnNjcmlwdGlvbnMgOjpcbiAgICBpZiBudWxsID09IHN1YiB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3ViLnN1YnNjcmliZSA6OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciBAIGBTdWJzY3JpcHRpb24gXCIke2F0dHJ9XCIgZG9lcyBub3QgaGF2ZSBhIHN1YnNjcmliZSgpIGZ1bmN0aW9uYFxuXG4gICAgdW53aW5kLnB1c2ggQFxuICAgICAgc3ViLnN1YnNjcmliZSBAIHYgPT4gOjpcbiAgICAgICAgc3ViX3N0YXRlW2F0dHJdID0gdlxuICAgICAgICBpZiBudWxsID09PSBxIDo6XG4gICAgICAgICAgcSA9IHJlc29sdmVOZXh0KClcblxuICBjb21wb25lbnQuc2V0U3Vic2NyaXB0aW9uU3RhdGUgQCBzdWJfc3RhdGUsIHVuc3Vic2NyaWJlQWxsXG5cbiAgZnVuY3Rpb24gdW5zdWJzY3JpYmVBbGwoKSA6OlxuICAgIGZvciBjb25zdCB1bnN1YiBvZiB1bndpbmQuc3BsaWNlIEAgMCwgdW53aW5kLmxlbmd0aCA6OlxuICAgICAgdW5zdWIoKVxuXG4gIC8vIHVzZSBwcm9taXNlIHJlc29sdXRpb24gdG8gZGVib3VuY2UgdXBkYXRlc1xuICBmdW5jdGlvbiByZXNvbHZlTmV4dCgpIDo6XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gQCAoKSA9PiA6OlxuICAgICAgY29tcG9uZW50LnNldFN1YnNjcmlwdGlvblN0YXRlIEAgc3ViX3N0YXRlXG4gICAgICBxID0gbnVsbFxuIl0sIm5hbWVzIjpbIk9iamVjdCIsImFzc2lnbiIsImV2dGJ1cyIsIl9ieVRvcGljIiwiTWFwIiwiX2J5U2luayIsIldlYWtNYXAiLCJ0b3BpYyIsInNpbmsiLCJ0b3BpY18iLCJuYW1lIiwiZXZ0IiwibnMiLCJieVRvcGljIiwibDEiLCJsMiIsImZuIiwiZXhwdW5nZSIsImdldCIsImRlbGV0ZSIsIlR5cGVFcnJvciIsInVuZGVmaW5lZCIsIm9iaiIsImNyZWF0ZV9ucyIsInNldCIsImNyZWF0ZSIsImNsZWFyX25zIiwibHN0IiwiZW50cmllcyIsImVhIiwic2lua18iLCJzdWJzY3JpYmUiLCJjbGVhciIsIm9uIiwiZW1pdCIsImZ1bmNzIiwic3BsaWNlIiwiaW5kZXhPZiIsIlNldCIsImFkZCIsInB1c2giLCJ3aXRoU3Vic2NyaWJlIiwiQ29tcG9uZW50IiwiQyIsInN0YXRlIiwicHJvcHMiLCJzdWJfc3RhdGUiLCJjbGVhbnVwIiwiZXZ0X3NpbmsiLCJzZXRTdGF0ZSIsImFyZ3MiLCJwcm90b3R5cGUiLCJiaW5kU3Vic2NyaXB0aW9ucyIsImNvbXBvbmVudCIsInN1YnNjcmlwdGlvbnMiLCJ1bndpbmQiLCJxIiwiYXR0ciIsInN1YiIsInYiLCJyZXNvbHZlTmV4dCIsInNldFN1YnNjcmlwdGlvblN0YXRlIiwidW5zdWJzY3JpYmVBbGwiLCJ1bnN1YiIsImxlbmd0aCIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiJdLCJtYXBwaW5ncyI6IkFBQUFBLE9BQU9DLE1BQVAsQ0FBZ0JDLFFBQWhCLEVBQXdCQSxVQUF4QjtBQUNBLEFBQWUsU0FBU0EsUUFBVCxHQUFrQjtRQUN6QkMsV0FBVyxJQUFJQyxHQUFKLEVBQWpCO1FBQ01DLFVBQVUsSUFBSUMsT0FBSixFQUFoQjs7U0FFTyxFQUFJQyxLQUFKLEVBQVdDLElBQVgsRUFBUDs7V0FFU0QsS0FBVCxDQUFlRSxNQUFmLEVBQXVCO1dBQ2Q7V0FDQUMsSUFBTCxFQUFXQyxHQUFYLEVBQWdCO2NBQ1JDLEtBQUtDLFFBQVFKLE1BQVIsQ0FBWDtjQUE0QkssS0FBS0YsR0FBR0YsSUFBSCxDQUFqQztjQUEyQ0ssS0FBS0gsR0FBRyxHQUFILENBQWhEO1lBQ0dFLEVBQUgsRUFBUTtlQUNGLE1BQU1FLEVBQVYsSUFBZ0JGLEVBQWhCLEVBQXFCO2VBQ2hCSCxHQUFILEVBQVFGLE1BQVI7OztZQUNETSxFQUFILEVBQVE7ZUFDRixNQUFNQyxFQUFWLElBQWdCRCxFQUFoQixFQUFxQjtlQUNoQkosR0FBSCxFQUFRRCxJQUFSLEVBQWNELE1BQWQ7OztPQVJEOztZQVVDUSxPQUFOLEVBQWU7Y0FDUEwsS0FBS1QsU0FBU2UsR0FBVCxDQUFhVCxNQUFiLENBQVg7WUFDRyxDQUFFRyxFQUFMLEVBQVU7OztZQUNQSyxPQUFILEVBQWE7bUJBQVVFLE1B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
