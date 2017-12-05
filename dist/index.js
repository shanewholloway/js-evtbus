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

//import {Component, PureComponent} from 'react'
//return withSubscribe @ evtbus, @{} Component, PureComponent

function withSubscribe(evtbus, componentClasses) {
  const res = {};
  for (const [name, base] of Object.entries(componentClasses)) {
    res[name] = class extends base {

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

    res[name].prototype.evtbus = evtbus;
  }

  return res;
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

exports['default'] = evtbus$1;
exports.withSubscribe = withSubscribe;
exports.bindSubscriptions = bindSubscriptions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2NvZGUvZXZ0YnVzLmpzeSIsIi4uL2NvZGUvcmVhY3QuanN5Il0sInNvdXJjZXNDb250ZW50IjpbIk9iamVjdC5hc3NpZ24gQCBldnRidXMsIGV2dGJ1cygpXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBldnRidXMoKSA6OlxuICBjb25zdCBfYnlUb3BpYyA9IG5ldyBNYXAoKVxuICBjb25zdCBfYnlTaW5rID0gbmV3IFdlYWtNYXAoKVxuXG4gIHJldHVybiBAe30gdG9waWMsIHNpbmtcblxuICBmdW5jdGlvbiB0b3BpYyh0b3BpY18pIDo6XG4gICAgcmV0dXJuIEB7fVxuICAgICAgZW1pdChuYW1lLCBldnQpIDo6XG4gICAgICAgIGNvbnN0IG5zID0gYnlUb3BpYyh0b3BpY18pLCBsMSA9IG5zW25hbWVdLCBsMiA9IG5zWycqJ11cbiAgICAgICAgaWYgbDEgOjpcbiAgICAgICAgICBmb3IgY29uc3QgZm4gb2YgbDEgOjpcbiAgICAgICAgICAgIGZuKGV2dCwgdG9waWNfKVxuICAgICAgICBpZiBsMiA6OlxuICAgICAgICAgIGZvciBjb25zdCBmbiBvZiBsMiA6OlxuICAgICAgICAgICAgZm4oZXZ0LCBuYW1lLCB0b3BpY18pXG5cbiAgICAgIGNsZWFyKGV4cHVuZ2UpIDo6XG4gICAgICAgIGNvbnN0IG5zID0gX2J5VG9waWMuZ2V0KHRvcGljXylcbiAgICAgICAgaWYgISBucyA6OiByZXR1cm5cbiAgICAgICAgaWYgZXhwdW5nZSA6OiBfYnlUb3BpYy5kZWxldGUodG9waWNfKVxuICAgICAgICBjbGVhcl9ucyhucylcblxuXG4gIGZ1bmN0aW9uIGJ5VG9waWModG9waWNfLCBuYW1lKSA6OlxuICAgIGlmIG51bGwgPT0gdG9waWNfIDo6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHRvcGljJylcblxuICAgIGxldCBucyA9IF9ieVRvcGljLmdldCh0b3BpY18pXG4gICAgaWYgdW5kZWZpbmVkID09PSBucyA6OlxuICAgICAgY29uc3Qgb2JqID0gX2J5U2luay5nZXQodG9waWNfKVxuICAgICAgaWYgdW5kZWZpbmVkICE9PSBvYmogOjpcbiAgICAgICAgbnMgPSBvYmoubnMgfHwgQCBvYmoubnMgPSBjcmVhdGVfbnMoKVxuICAgICAgZWxzZSA6OlxuICAgICAgICBfYnlUb3BpYy5zZXQgQCB0b3BpY18sIG5zID0gY3JlYXRlX25zKClcbiAgICBpZiBuYW1lIDo6XG4gICAgICByZXR1cm4gbnNbbmFtZV0gfHwgQCBuc1tuYW1lXSA9IFtdXG4gICAgcmV0dXJuIG5zXG5cbiAgZnVuY3Rpb24gY3JlYXRlX25zKCkgOjogcmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbClcbiAgZnVuY3Rpb24gY2xlYXJfbnMobnMpIDo6XG4gICAgZm9yIGNvbnN0IFtuYW1lLCBsc3RdIG9mIE9iamVjdC5lbnRyaWVzKG5zKSA6OlxuICAgICAgZGVsZXRlIG5zW25hbWVdXG4gICAgICBmb3IgY29uc3QgZWEgb2YgbHN0IDo6XG4gICAgICAgIGVhLmZuID0gZWEubHN0ID0gbnVsbFxuXG5cbiAgZnVuY3Rpb24gc2luayhzaW5rXykgOjpcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbiBAIHNpbmssIEB7fSBzdWJzY3JpYmU6c2luaywgY2xlYXIsIG9uLCBlbWl0XG5cbiAgICBmdW5jdGlvbiBjbGVhcigpIDo6XG4gICAgICBjb25zdCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgZnVuY3MgOjpcbiAgICAgICAgX2J5U2luay5kZWxldGUoc2lua18pXG4gICAgICAgIGZvciBjb25zdCB7bHN0LCBmbn0gb2YgZnVuY3MgOjpcbiAgICAgICAgICAvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZlbG9waXQvbWl0dC9ibG9iL2U5MTFhYWNiZWMxN2YzYWVhMzNkNDY1NjM3YTExZmY2NzM4ZjUwYjIvc3JjL2luZGV4LmpzI0w0NFxuICAgICAgICAgIGlmIGxzdCA6OiBsc3Quc3BsaWNlIEAgbHN0LmluZGV4T2YoZm4pID4+PiAwLCAxXG4gICAgICAgIGZ1bmNzLmNsZWFyKClcbiAgICAgICAgaWYgZnVuY3MubnMgOjogY2xlYXJfbnMoZnVuY3MubnMpXG4gICAgICByZXR1cm4gc2lua1xuXG4gICAgZnVuY3Rpb24gZW1pdChuYW1lLCBldnQpIDo6XG4gICAgICBjb25zdCBmdW5jcyA9IF9ieVNpbmsuZ2V0KHNpbmtfKVxuICAgICAgaWYgZnVuY3MgJiYgZnVuY3MubnMgOjpcbiAgICAgICAgdG9waWMoc2lua18pLmVtaXQobmFtZSwgZXZ0KVxuICAgICAgcmV0dXJuIHNpbmtcblxuICAgIGZ1bmN0aW9uIG9uKG5hbWUsIGZuKSA6OlxuICAgICAgcmV0dXJuIHNpbmsoc2lua18sIG5hbWUsIGZuKVxuXG4gICAgZnVuY3Rpb24gc2luayh0b3BpYywgbmFtZSwgZm4pIDo6XG4gICAgICBpZiAnZnVuY3Rpb24nICE9PSB0eXBlb2YgZm4gOjpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciBAICdFeHBlY3RlZCBmdW5jdGlvbidcblxuICAgICAgbGV0IGZ1bmNzID0gX2J5U2luay5nZXQoc2lua18pXG4gICAgICBpZiB1bmRlZmluZWQgPT09IGZ1bmNzIDo6XG4gICAgICAgIGZ1bmNzID0gbmV3IFNldCgpXG4gICAgICAgIF9ieVNpbmsuc2V0KHNpbmtfLCBmdW5jcylcblxuICAgICAgaWYgdG9waWMgOjpcbiAgICAgICAgY29uc3QgbHN0ID0gYnlUb3BpYyh0b3BpYywgbmFtZSlcbiAgICAgICAgZnVuY3MuYWRkIEA6IGZuLCBsc3RcbiAgICAgICAgbHN0LnB1c2ggQCBmblxuICAgICAgcmV0dXJuIHNpbmtcblxuIiwiLy9pbXBvcnQge0NvbXBvbmVudCwgUHVyZUNvbXBvbmVudH0gZnJvbSAncmVhY3QnXG4vL3JldHVybiB3aXRoU3Vic2NyaWJlIEAgZXZ0YnVzLCBAe30gQ29tcG9uZW50LCBQdXJlQ29tcG9uZW50XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoU3Vic2NyaWJlKGV2dGJ1cywgY29tcG9uZW50Q2xhc3NlcykgOjpcbiAgY29uc3QgcmVzID0ge31cbiAgZm9yIGNvbnN0IFtuYW1lLCBiYXNlXSBvZiBPYmplY3QuZW50cmllcyBAIGNvbXBvbmVudENsYXNzZXMgOjpcbiAgICByZXNbbmFtZV0gPSBjbGFzcyBleHRlbmRzIGJhc2UgOjpcblxuICAgICAgc3Vic2NyaWJlKHByb3BzKSA6OlxuXG4gICAgICBjb21wb25lbnRXaWxsTW91bnQoKSA6OlxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsTW91bnQoKVxuICAgICAgICBiaW5kU3Vic2NyaXB0aW9ucyBAIHRoaXNcbiAgICAgICAgdGhpcy5ldnRfc2luay5lbWl0KCd3aWxsX21vdW50JylcblxuICAgICAgY29tcG9uZW50RGlkTW91bnQoKSA6OlxuICAgICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ2RpZF9tb3VudCcpXG5cbiAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkgOjpcbiAgICAgICAgdGhpcy5ldnRfc2luay5lbWl0KCd3aWxsX3VubW91bnQnKS5jbGVhcigpXG5cbiAgICAgIGdldCBldnRfc2luaygpIDo6IHJldHVybiBldnRidXMuc2luayh0aGlzKVxuXG4gICAgcmVzW25hbWVdLnByb3RvdHlwZS5ldnRidXMgPSBldnRidXNcblxuICByZXR1cm4gcmVzXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRTdWJzY3JpcHRpb25zKGNvbXBvbmVudCwgY2FsbGJhY2spIDo6XG4gIGlmIG51bGwgPT0gY29tcG9uZW50LnN0YXRlIDo6XG4gICAgY29tcG9uZW50LnN0YXRlID0ge31cblxuICBjb25zdCB1bndpbmQgPSBbXVxuICBjb21wb25lbnQuZXZ0X3NpbmtcbiAgICAub24gQCAnd2lsbF9tb3VudCcsIG1vdW50XG4gICAgLm9uIEAgJ3dpbGxfdW5tb3VudCcsIHVubW91bnRcblxuICBmdW5jdGlvbiB1bm1vdW50KCkgOjpcbiAgICBmb3IgY29uc3QgdW5zdWIgb2YgdW53aW5kLnNwbGljZSBAIDAsIHVud2luZC5sZW5ndGggOjpcbiAgICAgIHVuc3ViKClcblxuICBmdW5jdGlvbiBtb3VudCgpIDo6XG4gICAgY29uc3Qgc3ViX3N0YXRlID0gY2FsbGJhY2tcbiAgICAgID8gY2FsbGJhY2suY2FsbChjb21wb25lbnQsIGNvbXBvbmVudC5wcm9wcywgY29tcG9uZW50KVxuICAgICAgOiBjb21wb25lbnQuc3Vic2NyaWJlKGNvbXBvbmVudC5wcm9wcylcblxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSBAIHN1Yl9zdGF0ZSwgZnVuY3Rpb24oKSA6OlxuICAgICAgZm9yIGNvbnN0IFthdHRyLCBzdWJdIG9mIE9iamVjdC5lbnRyaWVzIEAgc3ViX3N0YXRlIDo6XG4gICAgICAgIGlmIG51bGwgPT0gc3ViIHx8ICdmdW5jdGlvbicgIT09IHR5cGVvZiBzdWIuc3Vic2NyaWJlIDo6XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciBAIGBTdWJzY3JpcHRpb24gXCIke2F0dHJ9XCIgZG9lcyBub3QgaGF2ZSBhIHN1YnNjcmliZSgpIGZ1bmN0aW9uYFxuXG4gICAgICAgIHVud2luZC5wdXNoIEAgc3ViLnN1YnNjcmliZSBAIGZhbHNlLCB2ID0+IDo6XG4gICAgICAgICAgY29tcG9uZW50LnNldFN0YXRlIEAgcHJldiA9PlxuICAgICAgICAgICAgdiAhPT0gcHJldlthdHRyXSA/IHtbYXR0cl06IHZ9IDogbnVsbFxuXG4iXSwibmFtZXMiOlsiT2JqZWN0IiwiYXNzaWduIiwiZXZ0YnVzIiwiX2J5VG9waWMiLCJNYXAiLCJfYnlTaW5rIiwiV2Vha01hcCIsInRvcGljIiwic2luayIsInRvcGljXyIsIm5hbWUiLCJldnQiLCJucyIsImJ5VG9waWMiLCJsMSIsImwyIiwiZm4iLCJleHB1bmdlIiwiZ2V0IiwiZGVsZXRlIiwiVHlwZUVycm9yIiwidW5kZWZpbmVkIiwib2JqIiwiY3JlYXRlX25zIiwic2V0IiwiY3JlYXRlIiwiY2xlYXJfbnMiLCJsc3QiLCJlbnRyaWVzIiwiZWEiLCJzaW5rXyIsInN1YnNjcmliZSIsImNsZWFyIiwib24iLCJlbWl0IiwiZnVuY3MiLCJzcGxpY2UiLCJpbmRleE9mIiwiU2V0IiwiYWRkIiwicHVzaCIsIndpdGhTdWJzY3JpYmUiLCJjb21wb25lbnRDbGFzc2VzIiwicmVzIiwiYmFzZSIsInByb3BzIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZXZ0X3NpbmsiLCJwcm90b3R5cGUiLCJiaW5kU3Vic2NyaXB0aW9ucyIsImNvbXBvbmVudCIsImNhbGxiYWNrIiwic3RhdGUiLCJ1bndpbmQiLCJtb3VudCIsInVubW91bnQiLCJ1bnN1YiIsImxlbmd0aCIsInN1Yl9zdGF0ZSIsImNhbGwiLCJzZXRTdGF0ZSIsImF0dHIiLCJzdWIiLCJ2IiwicHJldiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBQSxPQUFPQyxNQUFQLENBQWdCQyxRQUFoQixFQUF3QkEsVUFBeEI7QUFDQSxBQUFlLFNBQVNBLFFBQVQsR0FBa0I7UUFDekJDLFdBQVcsSUFBSUMsR0FBSixFQUFqQjtRQUNNQyxVQUFVLElBQUlDLE9BQUosRUFBaEI7O1NBRU8sRUFBSUMsS0FBSixFQUFXQyxJQUFYLEVBQVA7O1dBRVNELEtBQVQsQ0FBZUUsTUFBZixFQUF1QjtXQUNkO1dBQ0FDLElBQUwsRUFBV0MsR0FBWCxFQUFnQjtjQUNSQyxLQUFLQyxRQUFRSixNQUFSLENBQVg7Y0FBNEJLLEtBQUtGLEdBQUdGLElBQUgsQ0FBakM7Y0FBMkNLLEtBQUtILEdBQUcsR0FBSCxDQUFoRDtZQUNHRSxFQUFILEVBQVE7ZUFDRixNQUFNRSxFQUFWLElBQWdCRixFQUFoQixFQUFxQjtlQUNoQkgsR0FBSCxFQUFRRixNQUFSOzs7WUFDRE0sRUFBSCxFQUFRO2VBQ0YsTUFBTUMsRUFBVixJQUFnQkQsRUFBaEIsRUFBcUI7ZUFDaEJKLEdBQUgsRUFBUUQsSUFBUixFQUFjRCxNQUFkOzs7T0FSRDs7WUFVQ1EsT0FBTixFQUFlO2NBQ1BMLEtBQUtULFNBQVNlLEdBQVQsQ0FBYVQsTUFBYixDQUFYO1lBQ0csQ0FBRUcsRUFBTCxFQUFVOzs7WUFDUEssT0FBSCxFQUFhO21CQUFVRSxNQUFU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
