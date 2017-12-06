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

export { withSubscribe, bindSubscriptions };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QubWpzIiwic291cmNlcyI6WyIuLi9jb2RlL3JlYWN0LmpzeSJdLCJzb3VyY2VzQ29udGVudCI6WyIvL2ltcG9ydCB7Q29tcG9uZW50LCBQdXJlQ29tcG9uZW50fSBmcm9tICdyZWFjdCdcbi8vcmV0dXJuIHdpdGhTdWJzY3JpYmUgQCBldnRidXMsIEB7fSBDb21wb25lbnQsIFB1cmVDb21wb25lbnRcblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhTdWJzY3JpYmUoZXZ0YnVzLCBDb21wb25lbnQpIDo6XG4gIGlmICdmdW5jdGlvbicgIT09IHR5cGVvZiBDb21wb25lbnQgOjpcbiAgICBpZiBBcnJheS5pc0FycmF5IEAgQ29tcG9uZW50IDo6XG4gICAgICByZXR1cm4gQ29tcG9uZW50Lm1hcCBAIENvbXAgPT5cbiAgICAgICAgd2l0aFN1YnNjcmliZSBAIGV2dGJ1cywgQ29tcFxuICAgIGVsc2UgOjpcbiAgICAgIGNvbnN0IHJlcyA9IHt9XG4gICAgICBmb3IgY29uc3QgW25hbWUsIENvbXBdIG9mIE9iamVjdC5lbnRyaWVzIEAgQ29tcG9uZW50IDo6XG4gICAgICAgIGlmICdmdW5jdGlvbicgPT09IHR5cGVvZiBDb21wIDo6XG4gICAgICAgICAgcmVzW25hbWVdID0gd2l0aFN1YnNjcmliZSBAIGV2dGJ1cywgQ29tcFxuICAgICAgcmV0dXJuIHJlc1xuXG4gIGNvbnN0IEMgPSBjbGFzcyBleHRlbmRzIENvbXBvbmVudCA6OlxuICAgIHN1YnNjcmliZShwcm9wcykgOjpcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIDo6XG4gICAgICBzdXBlci5jb21wb25lbnRXaWxsTW91bnQoKVxuICAgICAgYmluZFN1YnNjcmlwdGlvbnMgQCB0aGlzXG4gICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ3dpbGxfbW91bnQnKVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSA6OlxuICAgICAgdGhpcy5ldnRfc2luay5lbWl0KCdkaWRfbW91bnQnKVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSA6OlxuICAgICAgdGhpcy5ldnRfc2luay5lbWl0KCd3aWxsX3VubW91bnQnKS5jbGVhcigpXG5cbiAgICBnZXQgZXZ0X3NpbmsoKSA6OiByZXR1cm4gZXZ0YnVzLnNpbmsodGhpcylcblxuICBDLnByb3RvdHlwZS5ldnRidXMgPSBldnRidXNcbiAgcmV0dXJuIENcblxuXG5leHBvcnQgZnVuY3Rpb24gYmluZFN1YnNjcmlwdGlvbnMoY29tcG9uZW50LCBjYWxsYmFjaykgOjpcbiAgaWYgbnVsbCA9PSBjb21wb25lbnQuc3RhdGUgOjpcbiAgICBjb21wb25lbnQuc3RhdGUgPSB7fVxuXG4gIGNvbnN0IHVud2luZCA9IFtdXG4gIGNvbXBvbmVudC5ldnRfc2lua1xuICAgIC5vbiBAICd3aWxsX21vdW50JywgbW91bnRcbiAgICAub24gQCAnd2lsbF91bm1vdW50JywgdW5tb3VudFxuXG4gIGZ1bmN0aW9uIHVubW91bnQoKSA6OlxuICAgIGZvciBjb25zdCB1bnN1YiBvZiB1bndpbmQuc3BsaWNlIEAgMCwgdW53aW5kLmxlbmd0aCA6OlxuICAgICAgdW5zdWIoKVxuXG4gIGZ1bmN0aW9uIG1vdW50KCkgOjpcbiAgICBjb25zdCBzdWJfc3RhdGUgPSBjYWxsYmFja1xuICAgICAgPyBjYWxsYmFjay5jYWxsKGNvbXBvbmVudCwgY29tcG9uZW50LnByb3BzLCBjb21wb25lbnQpXG4gICAgICA6IGNvbXBvbmVudC5zdWJzY3JpYmUoY29tcG9uZW50LnByb3BzKVxuXG4gICAgY29tcG9uZW50LnNldFN0YXRlIEAgc3ViX3N0YXRlLCBmdW5jdGlvbigpIDo6XG4gICAgICBmb3IgY29uc3QgW2F0dHIsIHN1Yl0gb2YgT2JqZWN0LmVudHJpZXMgQCBzdWJfc3RhdGUgOjpcbiAgICAgICAgaWYgbnVsbCA9PSBzdWIgfHwgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHN1Yi5zdWJzY3JpYmUgOjpcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yIEAgYFN1YnNjcmlwdGlvbiBcIiR7YXR0cn1cIiBkb2VzIG5vdCBoYXZlIGEgc3Vic2NyaWJlKCkgZnVuY3Rpb25gXG5cbiAgICAgICAgdW53aW5kLnB1c2ggQCBzdWIuc3Vic2NyaWJlIEAgZmFsc2UsIHYgPT4gOjpcbiAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUgQCBwcmV2ID0+XG4gICAgICAgICAgICB2ICE9PSBwcmV2W2F0dHJdID8ge1thdHRyXTogdn0gOiBudWxsXG5cbiJdLCJuYW1lcyI6WyJ3aXRoU3Vic2NyaWJlIiwiZXZ0YnVzIiwiQ29tcG9uZW50IiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiQ29tcCIsInJlcyIsIm5hbWUiLCJPYmplY3QiLCJlbnRyaWVzIiwiQyIsInByb3BzIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZXZ0X3NpbmsiLCJlbWl0IiwiY2xlYXIiLCJzaW5rIiwicHJvdG90eXBlIiwiYmluZFN1YnNjcmlwdGlvbnMiLCJjb21wb25lbnQiLCJjYWxsYmFjayIsInN0YXRlIiwidW53aW5kIiwib24iLCJtb3VudCIsInVubW91bnQiLCJ1bnN1YiIsInNwbGljZSIsImxlbmd0aCIsInN1Yl9zdGF0ZSIsImNhbGwiLCJzdWJzY3JpYmUiLCJzZXRTdGF0ZSIsImF0dHIiLCJzdWIiLCJUeXBlRXJyb3IiLCJwdXNoIiwidiIsInByZXYiXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFHQSxBQUFPLFNBQVNBLGFBQVQsQ0FBdUJDLE1BQXZCLEVBQStCQyxTQUEvQixFQUEwQztNQUM1QyxlQUFlLE9BQU9BLFNBQXpCLEVBQXFDO1FBQ2hDQyxNQUFNQyxPQUFOLENBQWdCRixTQUFoQixDQUFILEVBQStCO2FBQ3RCQSxVQUFVRyxHQUFWLENBQWdCQyxRQUNyQk4sY0FBZ0JDLE1BQWhCLEVBQXdCSyxJQUF4QixDQURLLENBQVA7S0FERixNQUdLO1lBQ0dDLE1BQU0sRUFBWjtXQUNJLE1BQU0sQ0FBQ0MsSUFBRCxFQUFPRixJQUFQLENBQVYsSUFBMEJHLE9BQU9DLE9BQVAsQ0FBaUJSLFNBQWpCLENBQTFCLEVBQXVEO1lBQ2xELGVBQWUsT0FBT0ksSUFBekIsRUFBZ0M7Y0FDMUJFLElBQUosSUFBWVIsY0FBZ0JDLE1BQWhCLEVBQXdCSyxJQUF4QixDQUFaOzs7YUFDR0MsR0FBUDs7OztRQUVFSSxJQUFJLGNBQWNULFNBQWQsQ0FBd0I7Y0FDdEJVLEtBQVYsRUFBaUI7O3lCQUVJO1lBQ2JDLGtCQUFOO3dCQUNvQixJQUFwQjtXQUNLQyxRQUFMLENBQWNDLElBQWQsQ0FBbUIsWUFBbkI7Ozt3QkFFa0I7V0FDYkQsUUFBTCxDQUFjQyxJQUFkLENBQW1CLFdBQW5COzs7MkJBRXFCO1dBQ2hCRCxRQUFMLENBQWNDLElBQWQsQ0FBbUIsY0FBbkIsRUFBbUNDLEtBQW5DOzs7UUFFRUYsUUFBSixHQUFlO2FBQVViLE9BQU9nQixJQUFQLENBQVksSUFBWixDQUFQOztHQWRwQjs7SUFnQkVDLFNBQUYsQ0FBWWpCLE1BQVosR0FBcUJBLE1BQXJCO1NBQ09VLENBQVA7OztBQUdGLEFBQU8sU0FBU1EsaUJBQVQsQ0FBMkJDLFNBQTNCLEVBQXNDQyxRQUF0QyxFQUFnRDtNQUNsRCxRQUFRRCxVQUFVRSxLQUFyQixFQUE2QjtjQUNqQkEsS0FBVixHQUFrQixFQUFsQjs7O1FBRUlDLFNBQVMsRUFBZjtZQUNVVCxRQUFWLENBQ0dVLEVBREgsQ0FDUSxZQURSLEVBQ3NCQyxLQUR0QixFQUVHRCxFQUZILENBRVEsY0FGUixFQUV3QkUsT0FGeEI7O1dBSVNBLE9BQVQsR0FBbUI7U0FDYixNQUFNQyxLQUFWLElBQW1CSixPQUFPSyxNQUFQLENBQWdCLENBQWhCLEVBQW1CTCxPQUFPTSxNQUExQixDQUFuQixFQUFzRDs7Ozs7V0FHL0NKLEtBQVQsR0FBaUI7VUFDVEssWUFBWVQsV0FDZEEsU0FBU1UsSUFBVCxDQUFjWCxTQUFkLEVBQXlCQSxVQUFVUixLQUFuQyxFQUEwQ1EsU0FBMUMsQ0FEYyxHQUVkQSxVQUFVWSxTQUFWLENBQW9CWixVQUFVUixLQUE5QixDQUZKOztjQUlVcUIsUUFBVixDQUFxQkgsU0FBckIsRUFBZ0MsWUFBVztXQUNyQyxNQUFNLENBQUNJLElBQUQsRUFBT0MsR0FBUCxDQUFWLElBQXlCMUIsT0FBT0MsT0FBUCxDQUFpQm9CLFNBQWpCLENBQXpCLEVBQXNEO1lBQ2pELFFBQVFLLEdBQVIsSUFBZSxlQUFlLE9BQU9BLElBQUlILFNBQTVDLEVBQXdEO2dCQUNoRCxJQUFJSSxTQUFKLENBQWlCLGlCQUFnQkYsSUFBSyx3Q0FBdEMsQ0FBTjs7O2VBRUtHLElBQVAsQ0FBY0YsSUFBSUgsU0FBSixDQUFnQixLQUFoQixFQUF1Qk0sS0FBSztvQkFDOUJMLFFBQVYsQ0FBcUJNLFFBQ25CRCxNQUFNQyxLQUFLTCxJQUFMLENBQU4sR0FBbUIsRUFBQyxDQUFDQSxJQUFELEdBQVFJLENBQVQsRUFBbkIsR0FBaUMsSUFEbkM7U0FEWSxDQUFkOztLQUxKOzs7Ozs7In0=
