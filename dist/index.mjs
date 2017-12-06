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

//import {Component, PureComponent} from 'react'
//return withSubscribe @ evtbus, @{} Component, PureComponent

function withSubscribe(evtbus, Component) {
  if ('function' !== typeof Component) {
    if (Array.isArray(Component)) {
      return Component.map(Comp => withSubscribe(evtbus, Comp));
    } else {
      const res = {};
      for (const [name, Comp] of Object.entries(Component)) {
        if ('function' === typeof Comp) {
          res[name] = withSubscribe(evtbus, Comp);
        }
      }
      return res;
    }
  }

  const C = class extends Component {
    subscribe(props) {}

    componentWillMount() {
      super.componentWillMount();
      bindSubscriptions(this);
      this.evt_sink.emit('will_mount');
    }

    componentDidMount() {
      this.evt_sink.emit('did_mount');
    }

    componentWillUnmount() {
      this.evt_sink.emit('will_unmount').clear();
    }

    get evt_sink() {
      return evtbus.sink(this);
    }
  };

  C.prototype.evtbus = evtbus;
  return C;
}

function bindSubscriptions(component, callback) {
  if (null == component.state) {
    component.state = {};
  }

  const unwind = [];
  component.evt_sink.on('will_mount', mount).on('will_unmount', unmount);

  function unmount() {
    for (const unsub of unwind.splice(0, unwind.length)) {
      unsub();
    }
  }

  function mount() {
    const sub_state = callback ? callback.call(component, component.props, component) : component.subscribe(component.props);

    component.setState(sub_state, function () {
      for (const [attr, sub] of Object.entries(sub_state)) {
        if (null == sub || 'function' !== typeof sub.subscribe) {
          throw new TypeError(`Subscription "${attr}" does not have a subscribe() function`);
        }

        unwind.push(sub.subscribe(false, v => {
          component.setState(prev => v !== prev[attr] ? { [attr]: v } : null);
        }));
      }
    });
  }
}

export { evtbus$1 as evtbus, withSubscribe, bindSubscriptions };
export default evtbus$1;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgubWpzIiwic291cmNlcyI6WyIuLi9jb2RlL2V2dGJ1cy5qc3kiLCIuLi9jb2RlL3JlYWN0LmpzeSJdLCJzb3VyY2VzQ29udGVudCI6WyJPYmplY3QuYXNzaWduIEAgZXZ0YnVzLCBldnRidXMoKVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXZ0YnVzKCkgOjpcbiAgY29uc3QgX2J5VG9waWMgPSBuZXcgTWFwKClcbiAgY29uc3QgX2J5U2luayA9IG5ldyBXZWFrTWFwKClcblxuICByZXR1cm4gQHt9IHRvcGljLCBzaW5rXG5cbiAgZnVuY3Rpb24gdG9waWModG9waWNfKSA6OlxuICAgIHJldHVybiBAe31cbiAgICAgIGVtaXQobmFtZSwgZXZ0KSA6OlxuICAgICAgICBjb25zdCBucyA9IGJ5VG9waWModG9waWNfKSwgbDEgPSBuc1tuYW1lXSwgbDIgPSBuc1snKiddXG4gICAgICAgIGlmIGwxIDo6XG4gICAgICAgICAgZm9yIGNvbnN0IGZuIG9mIGwxIDo6XG4gICAgICAgICAgICBmbihldnQsIHRvcGljXylcbiAgICAgICAgaWYgbDIgOjpcbiAgICAgICAgICBmb3IgY29uc3QgZm4gb2YgbDIgOjpcbiAgICAgICAgICAgIGZuKGV2dCwgbmFtZSwgdG9waWNfKVxuXG4gICAgICBjbGVhcihleHB1bmdlKSA6OlxuICAgICAgICBjb25zdCBucyA9IF9ieVRvcGljLmdldCh0b3BpY18pXG4gICAgICAgIGlmICEgbnMgOjogcmV0dXJuXG4gICAgICAgIGlmIGV4cHVuZ2UgOjogX2J5VG9waWMuZGVsZXRlKHRvcGljXylcbiAgICAgICAgY2xlYXJfbnMobnMpXG5cblxuICBmdW5jdGlvbiBieVRvcGljKHRvcGljXywgbmFtZSkgOjpcbiAgICBpZiBudWxsID09IHRvcGljXyA6OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB0b3BpYycpXG5cbiAgICBsZXQgbnMgPSBfYnlUb3BpYy5nZXQodG9waWNfKVxuICAgIGlmIHVuZGVmaW5lZCA9PT0gbnMgOjpcbiAgICAgIGNvbnN0IG9iaiA9IF9ieVNpbmsuZ2V0KHRvcGljXylcbiAgICAgIGlmIHVuZGVmaW5lZCAhPT0gb2JqIDo6XG4gICAgICAgIG5zID0gb2JqLm5zIHx8IEAgb2JqLm5zID0gY3JlYXRlX25zKClcbiAgICAgIGVsc2UgOjpcbiAgICAgICAgX2J5VG9waWMuc2V0IEAgdG9waWNfLCBucyA9IGNyZWF0ZV9ucygpXG4gICAgaWYgbmFtZSA6OlxuICAgICAgcmV0dXJuIG5zW25hbWVdIHx8IEAgbnNbbmFtZV0gPSBbXVxuICAgIHJldHVybiBuc1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZV9ucygpIDo6IHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpXG4gIGZ1bmN0aW9uIGNsZWFyX25zKG5zKSA6OlxuICAgIGZvciBjb25zdCBbbmFtZSwgbHN0XSBvZiBPYmplY3QuZW50cmllcyhucykgOjpcbiAgICAgIGRlbGV0ZSBuc1tuYW1lXVxuICAgICAgZm9yIGNvbnN0IGVhIG9mIGxzdCA6OlxuICAgICAgICBlYS5mbiA9IGVhLmxzdCA9IG51bGxcblxuXG4gIGZ1bmN0aW9uIHNpbmsoc2lua18pIDo6XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24gQCBzaW5rLCBAe30gc3Vic2NyaWJlOnNpbmssIGNsZWFyLCBvbiwgZW1pdFxuXG4gICAgZnVuY3Rpb24gY2xlYXIoKSA6OlxuICAgICAgY29uc3QgZnVuY3MgPSBfYnlTaW5rLmdldChzaW5rXylcbiAgICAgIGlmIGZ1bmNzIDo6XG4gICAgICAgIF9ieVNpbmsuZGVsZXRlKHNpbmtfKVxuICAgICAgICBmb3IgY29uc3Qge2xzdCwgZm59IG9mIGZ1bmNzIDo6XG4gICAgICAgICAgLy8gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZGV2ZWxvcGl0L21pdHQvYmxvYi9lOTExYWFjYmVjMTdmM2FlYTMzZDQ2NTYzN2ExMWZmNjczOGY1MGIyL3NyYy9pbmRleC5qcyNMNDRcbiAgICAgICAgICBpZiBsc3QgOjogbHN0LnNwbGljZSBAIGxzdC5pbmRleE9mKGZuKSA+Pj4gMCwgMVxuICAgICAgICBmdW5jcy5jbGVhcigpXG4gICAgICAgIGlmIGZ1bmNzLm5zIDo6IGNsZWFyX25zKGZ1bmNzLm5zKVxuICAgICAgcmV0dXJuIHNpbmtcblxuICAgIGZ1bmN0aW9uIGVtaXQobmFtZSwgZXZ0KSA6OlxuICAgICAgY29uc3QgZnVuY3MgPSBfYnlTaW5rLmdldChzaW5rXylcbiAgICAgIGlmIGZ1bmNzICYmIGZ1bmNzLm5zIDo6XG4gICAgICAgIHRvcGljKHNpbmtfKS5lbWl0KG5hbWUsIGV2dClcbiAgICAgIHJldHVybiBzaW5rXG5cbiAgICBmdW5jdGlvbiBvbihuYW1lLCBmbikgOjpcbiAgICAgIHJldHVybiBzaW5rKHNpbmtfLCBuYW1lLCBmbilcblxuICAgIGZ1bmN0aW9uIHNpbmsodG9waWMsIG5hbWUsIGZuKSA6OlxuICAgICAgaWYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGZuIDo6XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IgQCAnRXhwZWN0ZWQgZnVuY3Rpb24nXG5cbiAgICAgIGxldCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgdW5kZWZpbmVkID09PSBmdW5jcyA6OlxuICAgICAgICBmdW5jcyA9IG5ldyBTZXQoKVxuICAgICAgICBfYnlTaW5rLnNldChzaW5rXywgZnVuY3MpXG5cbiAgICAgIGlmIHRvcGljIDo6XG4gICAgICAgIGNvbnN0IGxzdCA9IGJ5VG9waWModG9waWMsIG5hbWUpXG4gICAgICAgIGZ1bmNzLmFkZCBAOiBmbiwgbHN0XG4gICAgICAgIGxzdC5wdXNoIEAgZm5cbiAgICAgIHJldHVybiBzaW5rXG5cbiIsIi8vaW1wb3J0IHtDb21wb25lbnQsIFB1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0J1xuLy9yZXR1cm4gd2l0aFN1YnNjcmliZSBAIGV2dGJ1cywgQHt9IENvbXBvbmVudCwgUHVyZUNvbXBvbmVudFxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFN1YnNjcmliZShldnRidXMsIENvbXBvbmVudCkgOjpcbiAgaWYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIENvbXBvbmVudCA6OlxuICAgIGlmIEFycmF5LmlzQXJyYXkgQCBDb21wb25lbnQgOjpcbiAgICAgIHJldHVybiBDb21wb25lbnQubWFwIEAgQ29tcCA9PlxuICAgICAgICB3aXRoU3Vic2NyaWJlIEAgZXZ0YnVzLCBDb21wXG4gICAgZWxzZSA6OlxuICAgICAgY29uc3QgcmVzID0ge31cbiAgICAgIGZvciBjb25zdCBbbmFtZSwgQ29tcF0gb2YgT2JqZWN0LmVudHJpZXMgQCBDb21wb25lbnQgOjpcbiAgICAgICAgaWYgJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIENvbXAgOjpcbiAgICAgICAgICByZXNbbmFtZV0gPSB3aXRoU3Vic2NyaWJlIEAgZXZ0YnVzLCBDb21wXG4gICAgICByZXR1cm4gcmVzXG5cbiAgY29uc3QgQyA9IGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IDo6XG4gICAgc3Vic2NyaWJlKHByb3BzKSA6OlxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkgOjpcbiAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxNb3VudCgpXG4gICAgICBiaW5kU3Vic2NyaXB0aW9ucyBAIHRoaXNcbiAgICAgIHRoaXMuZXZ0X3NpbmsuZW1pdCgnd2lsbF9tb3VudCcpXG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIDo6XG4gICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ2RpZF9tb3VudCcpXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIDo6XG4gICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ3dpbGxfdW5tb3VudCcpLmNsZWFyKClcblxuICAgIGdldCBldnRfc2luaygpIDo6IHJldHVybiBldnRidXMuc2luayh0aGlzKVxuXG4gIEMucHJvdG90eXBlLmV2dGJ1cyA9IGV2dGJ1c1xuICByZXR1cm4gQ1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kU3Vic2NyaXB0aW9ucyhjb21wb25lbnQsIGNhbGxiYWNrKSA6OlxuICBpZiBudWxsID09IGNvbXBvbmVudC5zdGF0ZSA6OlxuICAgIGNvbXBvbmVudC5zdGF0ZSA9IHt9XG5cbiAgY29uc3QgdW53aW5kID0gW11cbiAgY29tcG9uZW50LmV2dF9zaW5rXG4gICAgLm9uIEAgJ3dpbGxfbW91bnQnLCBtb3VudFxuICAgIC5vbiBAICd3aWxsX3VubW91bnQnLCB1bm1vdW50XG5cbiAgZnVuY3Rpb24gdW5tb3VudCgpIDo6XG4gICAgZm9yIGNvbnN0IHVuc3ViIG9mIHVud2luZC5zcGxpY2UgQCAwLCB1bndpbmQubGVuZ3RoIDo6XG4gICAgICB1bnN1YigpXG5cbiAgZnVuY3Rpb24gbW91bnQoKSA6OlxuICAgIGNvbnN0IHN1Yl9zdGF0ZSA9IGNhbGxiYWNrXG4gICAgICA/IGNhbGxiYWNrLmNhbGwoY29tcG9uZW50LCBjb21wb25lbnQucHJvcHMsIGNvbXBvbmVudClcbiAgICAgIDogY29tcG9uZW50LnN1YnNjcmliZShjb21wb25lbnQucHJvcHMpXG5cbiAgICBjb21wb25lbnQuc2V0U3RhdGUgQCBzdWJfc3RhdGUsIGZ1bmN0aW9uKCkgOjpcbiAgICAgIGZvciBjb25zdCBbYXR0ciwgc3ViXSBvZiBPYmplY3QuZW50cmllcyBAIHN1Yl9zdGF0ZSA6OlxuICAgICAgICBpZiBudWxsID09IHN1YiB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3ViLnN1YnNjcmliZSA6OlxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IgQCBgU3Vic2NyaXB0aW9uIFwiJHthdHRyfVwiIGRvZXMgbm90IGhhdmUgYSBzdWJzY3JpYmUoKSBmdW5jdGlvbmBcblxuICAgICAgICB1bndpbmQucHVzaCBAIHN1Yi5zdWJzY3JpYmUgQCBmYWxzZSwgdiA9PiA6OlxuICAgICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSBAIHByZXYgPT5cbiAgICAgICAgICAgIHYgIT09IHByZXZbYXR0cl0gPyB7W2F0dHJdOiB2fSA6IG51bGxcblxuIl0sIm5hbWVzIjpbIk9iamVjdCIsImFzc2lnbiIsImV2dGJ1cyIsIl9ieVRvcGljIiwiTWFwIiwiX2J5U2luayIsIldlYWtNYXAiLCJ0b3BpYyIsInNpbmsiLCJ0b3BpY18iLCJuYW1lIiwiZXZ0IiwibnMiLCJieVRvcGljIiwibDEiLCJsMiIsImZuIiwiZXhwdW5nZSIsImdldCIsImRlbGV0ZSIsIlR5cGVFcnJvciIsInVuZGVmaW5lZCIsIm9iaiIsImNyZWF0ZV9ucyIsInNldCIsImNyZWF0ZSIsImNsZWFyX25zIiwibHN0IiwiZW50cmllcyIsImVhIiwic2lua18iLCJzdWJzY3JpYmUiLCJjbGVhciIsIm9uIiwiZW1pdCIsImZ1bmNzIiwic3BsaWNlIiwiaW5kZXhPZiIsIlNldCIsImFkZCIsInB1c2giLCJ3aXRoU3Vic2NyaWJlIiwiQ29tcG9uZW50IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiQ29tcCIsInJlcyIsIkMiLCJwcm9wcyIsImNvbXBvbmVudFdpbGxNb3VudCIsImV2dF9zaW5rIiwicHJvdG90eXBlIiwiYmluZFN1YnNjcmlwdGlvbnMiLCJjb21wb25lbnQiLCJjYWxsYmFjayIsInN0YXRlIiwidW53aW5kIiwibW91bnQiLCJ1bm1vdW50IiwidW5zdWIiLCJsZW5ndGgiLCJzdWJfc3RhdGUiLCJjYWxsIiwic2V0U3RhdGUiLCJhdHRyIiwic3ViIiwidiIsInByZXYiXSwibWFwcGluZ3MiOiJBQUFBQSxPQUFPQyxNQUFQLENBQWdCQyxRQUFoQixFQUF3QkEsVUFBeEI7QUFDQSxBQUFlLFNBQVNBLFFBQVQsR0FBa0I7UUFDekJDLFdBQVcsSUFBSUMsR0FBSixFQUFqQjtRQUNNQyxVQUFVLElBQUlDLE9BQUosRUFBaEI7O1NBRU8sRUFBSUMsS0FBSixFQUFXQyxJQUFYLEVBQVA7O1dBRVNELEtBQVQsQ0FBZUUsTUFBZixFQUF1QjtXQUNkO1dBQ0FDLElBQUwsRUFBV0MsR0FBWCxFQUFnQjtjQUNSQyxLQUFLQyxRQUFRSixNQUFSLENBQVg7Y0FBNEJLLEtBQUtGLEdBQUdGLElBQUgsQ0FBakM7Y0FBMkNLLEtBQUtILEdBQUcsR0FBSCxDQUFoRDtZQUNHRSxFQUFILEVBQVE7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
