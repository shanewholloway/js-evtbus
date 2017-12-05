'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.withSubscribe = withSubscribe;
exports.bindSubscriptions = bindSubscriptions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QuanMiLCJzb3VyY2VzIjpbIi4uL2NvZGUvcmVhY3QuanN5Il0sInNvdXJjZXNDb250ZW50IjpbIi8vaW1wb3J0IHtDb21wb25lbnQsIFB1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0J1xuLy9yZXR1cm4gd2l0aFN1YnNjcmliZSBAIGV2dGJ1cywgQHt9IENvbXBvbmVudCwgUHVyZUNvbXBvbmVudFxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFN1YnNjcmliZShldnRidXMsIGNvbXBvbmVudENsYXNzZXMpIDo6XG4gIGNvbnN0IHJlcyA9IHt9XG4gIGZvciBjb25zdCBbbmFtZSwgYmFzZV0gb2YgT2JqZWN0LmVudHJpZXMgQCBjb21wb25lbnRDbGFzc2VzIDo6XG4gICAgcmVzW25hbWVdID0gY2xhc3MgZXh0ZW5kcyBiYXNlIDo6XG5cbiAgICAgIHN1YnNjcmliZShwcm9wcykgOjpcblxuICAgICAgY29tcG9uZW50V2lsbE1vdW50KCkgOjpcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbE1vdW50KClcbiAgICAgICAgYmluZFN1YnNjcmlwdGlvbnMgQCB0aGlzXG4gICAgICAgIHRoaXMuZXZ0X3NpbmsuZW1pdCgnd2lsbF9tb3VudCcpXG5cbiAgICAgIGNvbXBvbmVudERpZE1vdW50KCkgOjpcbiAgICAgICAgdGhpcy5ldnRfc2luay5lbWl0KCdkaWRfbW91bnQnKVxuXG4gICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIDo6XG4gICAgICAgIHRoaXMuZXZ0X3NpbmsuZW1pdCgnd2lsbF91bm1vdW50JykuY2xlYXIoKVxuXG4gICAgICBnZXQgZXZ0X3NpbmsoKSA6OiByZXR1cm4gZXZ0YnVzLnNpbmsodGhpcylcblxuICAgIHJlc1tuYW1lXS5wcm90b3R5cGUuZXZ0YnVzID0gZXZ0YnVzXG5cbiAgcmV0dXJuIHJlc1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kU3Vic2NyaXB0aW9ucyhjb21wb25lbnQsIGNhbGxiYWNrKSA6OlxuICBpZiBudWxsID09IGNvbXBvbmVudC5zdGF0ZSA6OlxuICAgIGNvbXBvbmVudC5zdGF0ZSA9IHt9XG5cbiAgY29uc3QgdW53aW5kID0gW11cbiAgY29tcG9uZW50LmV2dF9zaW5rXG4gICAgLm9uIEAgJ3dpbGxfbW91bnQnLCBtb3VudFxuICAgIC5vbiBAICd3aWxsX3VubW91bnQnLCB1bm1vdW50XG5cbiAgZnVuY3Rpb24gdW5tb3VudCgpIDo6XG4gICAgZm9yIGNvbnN0IHVuc3ViIG9mIHVud2luZC5zcGxpY2UgQCAwLCB1bndpbmQubGVuZ3RoIDo6XG4gICAgICB1bnN1YigpXG5cbiAgZnVuY3Rpb24gbW91bnQoKSA6OlxuICAgIGNvbnN0IHN1Yl9zdGF0ZSA9IGNhbGxiYWNrXG4gICAgICA/IGNhbGxiYWNrLmNhbGwoY29tcG9uZW50LCBjb21wb25lbnQucHJvcHMsIGNvbXBvbmVudClcbiAgICAgIDogY29tcG9uZW50LnN1YnNjcmliZShjb21wb25lbnQucHJvcHMpXG5cbiAgICBjb21wb25lbnQuc2V0U3RhdGUgQCBzdWJfc3RhdGUsIGZ1bmN0aW9uKCkgOjpcbiAgICAgIGZvciBjb25zdCBbYXR0ciwgc3ViXSBvZiBPYmplY3QuZW50cmllcyBAIHN1Yl9zdGF0ZSA6OlxuICAgICAgICBpZiBudWxsID09IHN1YiB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3ViLnN1YnNjcmliZSA6OlxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IgQCBgU3Vic2NyaXB0aW9uIFwiJHthdHRyfVwiIGRvZXMgbm90IGhhdmUgYSBzdWJzY3JpYmUoKSBmdW5jdGlvbmBcblxuICAgICAgICB1bndpbmQucHVzaCBAIHN1Yi5zdWJzY3JpYmUgQCBmYWxzZSwgdiA9PiA6OlxuICAgICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSBAIHByZXYgPT5cbiAgICAgICAgICAgIHYgIT09IHByZXZbYXR0cl0gPyB7W2F0dHJdOiB2fSA6IG51bGxcblxuIl0sIm5hbWVzIjpbIndpdGhTdWJzY3JpYmUiLCJldnRidXMiLCJjb21wb25lbnRDbGFzc2VzIiwicmVzIiwibmFtZSIsImJhc2UiLCJPYmplY3QiLCJlbnRyaWVzIiwicHJvcHMiLCJjb21wb25lbnRXaWxsTW91bnQiLCJldnRfc2luayIsImVtaXQiLCJjbGVhciIsInNpbmsiLCJwcm90b3R5cGUiLCJiaW5kU3Vic2NyaXB0aW9ucyIsImNvbXBvbmVudCIsImNhbGxiYWNrIiwic3RhdGUiLCJ1bndpbmQiLCJvbiIsIm1vdW50IiwidW5tb3VudCIsInVuc3ViIiwic3BsaWNlIiwibGVuZ3RoIiwic3ViX3N0YXRlIiwiY2FsbCIsInN1YnNjcmliZSIsInNldFN0YXRlIiwiYXR0ciIsInN1YiIsIlR5cGVFcnJvciIsInB1c2giLCJ2IiwicHJldiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7QUFHQSxBQUFPLFNBQVNBLGFBQVQsQ0FBdUJDLE1BQXZCLEVBQStCQyxnQkFBL0IsRUFBaUQ7UUFDaERDLE1BQU0sRUFBWjtPQUNJLE1BQU0sQ0FBQ0MsSUFBRCxFQUFPQyxJQUFQLENBQVYsSUFBMEJDLE9BQU9DLE9BQVAsQ0FBaUJMLGdCQUFqQixDQUExQixFQUE4RDtRQUN4REUsSUFBSixJQUFZLGNBQWNDLElBQWQsQ0FBbUI7O2dCQUVuQkcsS0FBVixFQUFpQjs7MkJBRUk7Y0FDYkMsa0JBQU47MEJBQ29CLElBQXBCO2FBQ0tDLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixZQUFuQjs7OzBCQUVrQjthQUNiRCxRQUFMLENBQWNDLElBQWQsQ0FBbUIsV0FBbkI7Ozs2QkFFcUI7YUFDaEJELFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixjQUFuQixFQUFtQ0MsS0FBbkM7OztVQUVFRixRQUFKLEdBQWU7ZUFBVVQsT0FBT1ksSUFBUCxDQUFZLElBQVosQ0FBUDs7S0FmcEI7O1FBaUJJVCxJQUFKLEVBQVVVLFNBQVYsQ0FBb0JiLE1BQXBCLEdBQTZCQSxNQUE3Qjs7O1NBRUtFLEdBQVA7OztBQUdGLEFBQU8sU0FBU1ksaUJBQVQsQ0FBMkJDLFNBQTNCLEVBQXNDQyxRQUF0QyxFQUFnRDtNQUNsRCxRQUFRRCxVQUFVRSxLQUFyQixFQUE2QjtjQUNqQkEsS0FBVixHQUFrQixFQUFsQjs7O1FBRUlDLFNBQVMsRUFBZjtZQUNVVCxRQUFWLENBQ0dVLEVBREgsQ0FDUSxZQURSLEVBQ3NCQyxLQUR0QixFQUVHRCxFQUZILENBRVEsY0FGUixFQUV3QkUsT0FGeEI7O1dBSVNBLE9BQVQsR0FBbUI7U0FDYixNQUFNQyxLQUFWLElBQW1CSixPQUFPSyxNQUFQLENBQWdCLENBQWhCLEVBQW1CTCxPQUFPTSxNQUExQixDQUFuQixFQUFzRDs7Ozs7V0FHL0NKLEtBQVQsR0FBaUI7VUFDVEssWUFBWVQsV0FDZEEsU0FBU1UsSUFBVCxDQUFjWCxTQUFkLEVBQXlCQSxVQUFVUixLQUFuQyxFQUEwQ1EsU0FBMUMsQ0FEYyxHQUVkQSxVQUFVWSxTQUFWLENBQW9CWixVQUFVUixLQUE5QixDQUZKOztjQUlVcUIsUUFBVixDQUFxQkgsU0FBckIsRUFBZ0MsWUFBVztXQUNyQyxNQUFNLENBQUNJLElBQUQsRUFBT0MsR0FBUCxDQUFWLElBQXlCekIsT0FBT0MsT0FBUCxDQUFpQm1CLFNBQWpCLENBQXpCLEVBQXNEO1lBQ2pELFFBQVFLLEdBQVIsSUFBZSxlQUFlLE9BQU9BLElBQUlILFNBQTVDLEVBQXdEO2dCQUNoRCxJQUFJSSxTQUFKLENBQWlCLGlCQUFnQkYsSUFBSyx3Q0FBdEMsQ0FBTjs7O2VBRUtHLElBQVAsQ0FBY0YsSUFBSUgsU0FBSixDQUFnQixLQUFoQixFQUF1Qk0sS0FBSztvQkFDOUJMLFFBQVYsQ0FBcUJNLFFBQ25CRCxNQUFNQyxLQUFLTCxJQUFMLENBQU4sR0FBbUIsRUFBQyxDQUFDQSxJQUFELEdBQVFJLENBQVQsRUFBbkIsR0FBaUMsSUFEbkM7U0FEWSxDQUFkOztLQUxKOzs7Ozs7OyJ9
