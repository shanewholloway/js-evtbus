'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.withSubscribe = withSubscribe;
exports.bindSubscriptions = bindSubscriptions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QuanMiLCJzb3VyY2VzIjpbIi4uL2NvZGUvcmVhY3QuanN5Il0sInNvdXJjZXNDb250ZW50IjpbIi8vaW1wb3J0IHtDb21wb25lbnQsIFB1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0J1xuLy9yZXR1cm4gd2l0aFN1YnNjcmliZSBAIGV2dGJ1cywgQHt9IENvbXBvbmVudCwgUHVyZUNvbXBvbmVudFxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFN1YnNjcmliZShldnRidXMsIENvbXBvbmVudCkgOjpcbiAgaWYgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIENvbXBvbmVudCA6OlxuICAgIGlmIEFycmF5LmlzQXJyYXkgQCBDb21wb25lbnQgOjpcbiAgICAgIHJldHVybiBDb21wb25lbnQubWFwIEAgQ29tcCA9PlxuICAgICAgICB3aXRoU3Vic2NyaWJlIEAgZXZ0YnVzLCBDb21wXG4gICAgZWxzZSA6OlxuICAgICAgY29uc3QgcmVzID0ge31cbiAgICAgIGZvciBjb25zdCBbbmFtZSwgQ29tcF0gb2YgT2JqZWN0LmVudHJpZXMgQCBDb21wb25lbnQgOjpcbiAgICAgICAgaWYgJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIENvbXAgOjpcbiAgICAgICAgICByZXNbbmFtZV0gPSB3aXRoU3Vic2NyaWJlIEAgZXZ0YnVzLCBDb21wXG4gICAgICByZXR1cm4gcmVzXG5cbiAgY29uc3QgQyA9IGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IDo6XG4gICAgc3Vic2NyaWJlKHByb3BzKSA6OlxuXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkgOjpcbiAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxNb3VudCgpXG4gICAgICBiaW5kU3Vic2NyaXB0aW9ucyBAIHRoaXNcbiAgICAgIHRoaXMuZXZ0X3NpbmsuZW1pdCgnd2lsbF9tb3VudCcpXG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIDo6XG4gICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ2RpZF9tb3VudCcpXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIDo6XG4gICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ3dpbGxfdW5tb3VudCcpLmNsZWFyKClcblxuICAgIGdldCBldnRfc2luaygpIDo6IHJldHVybiBldnRidXMuc2luayh0aGlzKVxuXG4gIEMucHJvdG90eXBlLmV2dGJ1cyA9IGV2dGJ1c1xuICByZXR1cm4gQ1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kU3Vic2NyaXB0aW9ucyhjb21wb25lbnQsIGNhbGxiYWNrKSA6OlxuICBpZiBudWxsID09IGNvbXBvbmVudC5zdGF0ZSA6OlxuICAgIGNvbXBvbmVudC5zdGF0ZSA9IHt9XG5cbiAgY29uc3QgdW53aW5kID0gW11cbiAgY29tcG9uZW50LmV2dF9zaW5rXG4gICAgLm9uIEAgJ3dpbGxfbW91bnQnLCBtb3VudFxuICAgIC5vbiBAICd3aWxsX3VubW91bnQnLCB1bm1vdW50XG5cbiAgZnVuY3Rpb24gdW5tb3VudCgpIDo6XG4gICAgZm9yIGNvbnN0IHVuc3ViIG9mIHVud2luZC5zcGxpY2UgQCAwLCB1bndpbmQubGVuZ3RoIDo6XG4gICAgICB1bnN1YigpXG5cbiAgZnVuY3Rpb24gbW91bnQoKSA6OlxuICAgIGNvbnN0IHN1Yl9zdGF0ZSA9IGNhbGxiYWNrXG4gICAgICA/IGNhbGxiYWNrLmNhbGwoY29tcG9uZW50LCBjb21wb25lbnQucHJvcHMsIGNvbXBvbmVudClcbiAgICAgIDogY29tcG9uZW50LnN1YnNjcmliZShjb21wb25lbnQucHJvcHMpXG5cbiAgICBjb21wb25lbnQuc2V0U3RhdGUgQCBzdWJfc3RhdGUsIGZ1bmN0aW9uKCkgOjpcbiAgICAgIGZvciBjb25zdCBbYXR0ciwgc3ViXSBvZiBPYmplY3QuZW50cmllcyBAIHN1Yl9zdGF0ZSA6OlxuICAgICAgICBpZiBudWxsID09IHN1YiB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3ViLnN1YnNjcmliZSA6OlxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IgQCBgU3Vic2NyaXB0aW9uIFwiJHthdHRyfVwiIGRvZXMgbm90IGhhdmUgYSBzdWJzY3JpYmUoKSBmdW5jdGlvbmBcblxuICAgICAgICB1bndpbmQucHVzaCBAIHN1Yi5zdWJzY3JpYmUgQCBmYWxzZSwgdiA9PiA6OlxuICAgICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSBAIHByZXYgPT5cbiAgICAgICAgICAgIHYgIT09IHByZXZbYXR0cl0gPyB7W2F0dHJdOiB2fSA6IG51bGxcblxuIl0sIm5hbWVzIjpbIndpdGhTdWJzY3JpYmUiLCJldnRidXMiLCJDb21wb25lbnQiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJDb21wIiwicmVzIiwibmFtZSIsIk9iamVjdCIsImVudHJpZXMiLCJDIiwicHJvcHMiLCJjb21wb25lbnRXaWxsTW91bnQiLCJldnRfc2luayIsImVtaXQiLCJjbGVhciIsInNpbmsiLCJwcm90b3R5cGUiLCJiaW5kU3Vic2NyaXB0aW9ucyIsImNvbXBvbmVudCIsImNhbGxiYWNrIiwic3RhdGUiLCJ1bndpbmQiLCJvbiIsIm1vdW50IiwidW5tb3VudCIsInVuc3ViIiwic3BsaWNlIiwibGVuZ3RoIiwic3ViX3N0YXRlIiwiY2FsbCIsInN1YnNjcmliZSIsInNldFN0YXRlIiwiYXR0ciIsInN1YiIsIlR5cGVFcnJvciIsInB1c2giLCJ2IiwicHJldiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7QUFHQSxBQUFPLFNBQVNBLGFBQVQsQ0FBdUJDLE1BQXZCLEVBQStCQyxTQUEvQixFQUEwQztNQUM1QyxlQUFlLE9BQU9BLFNBQXpCLEVBQXFDO1FBQ2hDQyxNQUFNQyxPQUFOLENBQWdCRixTQUFoQixDQUFILEVBQStCO2FBQ3RCQSxVQUFVRyxHQUFWLENBQWdCQyxRQUNyQk4sY0FBZ0JDLE1BQWhCLEVBQXdCSyxJQUF4QixDQURLLENBQVA7S0FERixNQUdLO1lBQ0dDLE1BQU0sRUFBWjtXQUNJLE1BQU0sQ0FBQ0MsSUFBRCxFQUFPRixJQUFQLENBQVYsSUFBMEJHLE9BQU9DLE9BQVAsQ0FBaUJSLFNBQWpCLENBQTFCLEVBQXVEO1lBQ2xELGVBQWUsT0FBT0ksSUFBekIsRUFBZ0M7Y0FDMUJFLElBQUosSUFBWVIsY0FBZ0JDLE1BQWhCLEVBQXdCSyxJQUF4QixDQUFaOzs7YUFDR0MsR0FBUDs7OztRQUVFSSxJQUFJLGNBQWNULFNBQWQsQ0FBd0I7Y0FDdEJVLEtBQVYsRUFBaUI7O3lCQUVJO1lBQ2JDLGtCQUFOO3dCQUNvQixJQUFwQjtXQUNLQyxRQUFMLENBQWNDLElBQWQsQ0FBbUIsWUFBbkI7Ozt3QkFFa0I7V0FDYkQsUUFBTCxDQUFjQyxJQUFkLENBQW1CLFdBQW5COzs7MkJBRXFCO1dBQ2hCRCxRQUFMLENBQWNDLElBQWQsQ0FBbUIsY0FBbkIsRUFBbUNDLEtBQW5DOzs7UUFFRUYsUUFBSixHQUFlO2FBQVViLE9BQU9nQixJQUFQLENBQVksSUFBWixDQUFQOztHQWRwQjs7SUFnQkVDLFNBQUYsQ0FBWWpCLE1BQVosR0FBcUJBLE1BQXJCO1NBQ09VLENBQVA7OztBQUdGLEFBQU8sU0FBU1EsaUJBQVQsQ0FBMkJDLFNBQTNCLEVBQXNDQyxRQUF0QyxFQUFnRDtNQUNsRCxRQUFRRCxVQUFVRSxLQUFyQixFQUE2QjtjQUNqQkEsS0FBVixHQUFrQixFQUFsQjs7O1FBRUlDLFNBQVMsRUFBZjtZQUNVVCxRQUFWLENBQ0dVLEVBREgsQ0FDUSxZQURSLEVBQ3NCQyxLQUR0QixFQUVHRCxFQUZILENBRVEsY0FGUixFQUV3QkUsT0FGeEI7O1dBSVNBLE9BQVQsR0FBbUI7U0FDYixNQUFNQyxLQUFWLElBQW1CSixPQUFPSyxNQUFQLENBQWdCLENBQWhCLEVBQW1CTCxPQUFPTSxNQUExQixDQUFuQixFQUFzRDs7Ozs7V0FHL0NKLEtBQVQsR0FBaUI7VUFDVEssWUFBWVQsV0FDZEEsU0FBU1UsSUFBVCxDQUFjWCxTQUFkLEVBQXlCQSxVQUFVUixLQUFuQyxFQUEwQ1EsU0FBMUMsQ0FEYyxHQUVkQSxVQUFVWSxTQUFWLENBQW9CWixVQUFVUixLQUE5QixDQUZKOztjQUlVcUIsUUFBVixDQUFxQkgsU0FBckIsRUFBZ0MsWUFBVztXQUNyQyxNQUFNLENBQUNJLElBQUQsRUFBT0MsR0FBUCxDQUFWLElBQXlCMUIsT0FBT0MsT0FBUCxDQUFpQm9CLFNBQWpCLENBQXpCLEVBQXNEO1lBQ2pELFFBQVFLLEdBQVIsSUFBZSxlQUFlLE9BQU9BLElBQUlILFNBQTVDLEVBQXdEO2dCQUNoRCxJQUFJSSxTQUFKLENBQWlCLGlCQUFnQkYsSUFBSyx3Q0FBdEMsQ0FBTjs7O2VBRUtHLElBQVAsQ0FBY0YsSUFBSUgsU0FBSixDQUFnQixLQUFoQixFQUF1Qk0sS0FBSztvQkFDOUJMLFFBQVYsQ0FBcUJNLFFBQ25CRCxNQUFNQyxLQUFLTCxJQUFMLENBQU4sR0FBbUIsRUFBQyxDQUFDQSxJQUFELEdBQVFJLENBQVQsRUFBbkIsR0FBaUMsSUFEbkM7U0FEWSxDQUFkOztLQUxKOzs7Ozs7OyJ9
