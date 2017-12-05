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

export { withSubscribe, bindSubscriptions };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QubWpzIiwic291cmNlcyI6WyIuLi9jb2RlL3JlYWN0LmpzeSJdLCJzb3VyY2VzQ29udGVudCI6WyIvL2ltcG9ydCB7Q29tcG9uZW50LCBQdXJlQ29tcG9uZW50fSBmcm9tICdyZWFjdCdcbi8vcmV0dXJuIHdpdGhTdWJzY3JpYmUgQCBldnRidXMsIEB7fSBDb21wb25lbnQsIFB1cmVDb21wb25lbnRcblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhTdWJzY3JpYmUoZXZ0YnVzLCBjb21wb25lbnRDbGFzc2VzKSA6OlxuICBjb25zdCByZXMgPSB7fVxuICBmb3IgY29uc3QgW25hbWUsIGJhc2VdIG9mIE9iamVjdC5lbnRyaWVzIEAgY29tcG9uZW50Q2xhc3NlcyA6OlxuICAgIHJlc1tuYW1lXSA9IGNsYXNzIGV4dGVuZHMgYmFzZSA6OlxuXG4gICAgICBzdWJzY3JpYmUocHJvcHMpIDo6XG5cbiAgICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIDo6XG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxNb3VudCgpXG4gICAgICAgIGJpbmRTdWJzY3JpcHRpb25zIEAgdGhpc1xuICAgICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ3dpbGxfbW91bnQnKVxuXG4gICAgICBjb21wb25lbnREaWRNb3VudCgpIDo6XG4gICAgICAgIHRoaXMuZXZ0X3NpbmsuZW1pdCgnZGlkX21vdW50JylcblxuICAgICAgY29tcG9uZW50V2lsbFVubW91bnQoKSA6OlxuICAgICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ3dpbGxfdW5tb3VudCcpLmNsZWFyKClcblxuICAgICAgZ2V0IGV2dF9zaW5rKCkgOjogcmV0dXJuIGV2dGJ1cy5zaW5rKHRoaXMpXG5cbiAgICByZXNbbmFtZV0ucHJvdG90eXBlLmV2dGJ1cyA9IGV2dGJ1c1xuXG4gIHJldHVybiByZXNcblxuXG5leHBvcnQgZnVuY3Rpb24gYmluZFN1YnNjcmlwdGlvbnMoY29tcG9uZW50LCBjYWxsYmFjaykgOjpcbiAgaWYgbnVsbCA9PSBjb21wb25lbnQuc3RhdGUgOjpcbiAgICBjb21wb25lbnQuc3RhdGUgPSB7fVxuXG4gIGNvbnN0IHVud2luZCA9IFtdXG4gIGNvbXBvbmVudC5ldnRfc2lua1xuICAgIC5vbiBAICd3aWxsX21vdW50JywgbW91bnRcbiAgICAub24gQCAnd2lsbF91bm1vdW50JywgdW5tb3VudFxuXG4gIGZ1bmN0aW9uIHVubW91bnQoKSA6OlxuICAgIGZvciBjb25zdCB1bnN1YiBvZiB1bndpbmQuc3BsaWNlIEAgMCwgdW53aW5kLmxlbmd0aCA6OlxuICAgICAgdW5zdWIoKVxuXG4gIGZ1bmN0aW9uIG1vdW50KCkgOjpcbiAgICBjb25zdCBzdWJfc3RhdGUgPSBjYWxsYmFja1xuICAgICAgPyBjYWxsYmFjay5jYWxsKGNvbXBvbmVudCwgY29tcG9uZW50LnByb3BzLCBjb21wb25lbnQpXG4gICAgICA6IGNvbXBvbmVudC5zdWJzY3JpYmUoY29tcG9uZW50LnByb3BzKVxuXG4gICAgY29tcG9uZW50LnNldFN0YXRlIEAgc3ViX3N0YXRlLCBmdW5jdGlvbigpIDo6XG4gICAgICBmb3IgY29uc3QgW2F0dHIsIHN1Yl0gb2YgT2JqZWN0LmVudHJpZXMgQCBzdWJfc3RhdGUgOjpcbiAgICAgICAgaWYgbnVsbCA9PSBzdWIgfHwgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHN1Yi5zdWJzY3JpYmUgOjpcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yIEAgYFN1YnNjcmlwdGlvbiBcIiR7YXR0cn1cIiBkb2VzIG5vdCBoYXZlIGEgc3Vic2NyaWJlKCkgZnVuY3Rpb25gXG5cbiAgICAgICAgdW53aW5kLnB1c2ggQCBzdWIuc3Vic2NyaWJlIEAgZmFsc2UsIHYgPT4gOjpcbiAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUgQCBwcmV2ID0+XG4gICAgICAgICAgICB2ICE9PSBwcmV2W2F0dHJdID8ge1thdHRyXTogdn0gOiBudWxsXG5cbiJdLCJuYW1lcyI6WyJ3aXRoU3Vic2NyaWJlIiwiZXZ0YnVzIiwiY29tcG9uZW50Q2xhc3NlcyIsInJlcyIsIm5hbWUiLCJiYXNlIiwiT2JqZWN0IiwiZW50cmllcyIsInByb3BzIiwiY29tcG9uZW50V2lsbE1vdW50IiwiZXZ0X3NpbmsiLCJlbWl0IiwiY2xlYXIiLCJzaW5rIiwicHJvdG90eXBlIiwiYmluZFN1YnNjcmlwdGlvbnMiLCJjb21wb25lbnQiLCJjYWxsYmFjayIsInN0YXRlIiwidW53aW5kIiwib24iLCJtb3VudCIsInVubW91bnQiLCJ1bnN1YiIsInNwbGljZSIsImxlbmd0aCIsInN1Yl9zdGF0ZSIsImNhbGwiLCJzdWJzY3JpYmUiLCJzZXRTdGF0ZSIsImF0dHIiLCJzdWIiLCJUeXBlRXJyb3IiLCJwdXNoIiwidiIsInByZXYiXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFHQSxBQUFPLFNBQVNBLGFBQVQsQ0FBdUJDLE1BQXZCLEVBQStCQyxnQkFBL0IsRUFBaUQ7UUFDaERDLE1BQU0sRUFBWjtPQUNJLE1BQU0sQ0FBQ0MsSUFBRCxFQUFPQyxJQUFQLENBQVYsSUFBMEJDLE9BQU9DLE9BQVAsQ0FBaUJMLGdCQUFqQixDQUExQixFQUE4RDtRQUN4REUsSUFBSixJQUFZLGNBQWNDLElBQWQsQ0FBbUI7O2dCQUVuQkcsS0FBVixFQUFpQjs7MkJBRUk7Y0FDYkMsa0JBQU47MEJBQ29CLElBQXBCO2FBQ0tDLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixZQUFuQjs7OzBCQUVrQjthQUNiRCxRQUFMLENBQWNDLElBQWQsQ0FBbUIsV0FBbkI7Ozs2QkFFcUI7YUFDaEJELFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixjQUFuQixFQUFtQ0MsS0FBbkM7OztVQUVFRixRQUFKLEdBQWU7ZUFBVVQsT0FBT1ksSUFBUCxDQUFZLElBQVosQ0FBUDs7S0FmcEI7O1FBaUJJVCxJQUFKLEVBQVVVLFNBQVYsQ0FBb0JiLE1BQXBCLEdBQTZCQSxNQUE3Qjs7O1NBRUtFLEdBQVA7OztBQUdGLEFBQU8sU0FBU1ksaUJBQVQsQ0FBMkJDLFNBQTNCLEVBQXNDQyxRQUF0QyxFQUFnRDtNQUNsRCxRQUFRRCxVQUFVRSxLQUFyQixFQUE2QjtjQUNqQkEsS0FBVixHQUFrQixFQUFsQjs7O1FBRUlDLFNBQVMsRUFBZjtZQUNVVCxRQUFWLENBQ0dVLEVBREgsQ0FDUSxZQURSLEVBQ3NCQyxLQUR0QixFQUVHRCxFQUZILENBRVEsY0FGUixFQUV3QkUsT0FGeEI7O1dBSVNBLE9BQVQsR0FBbUI7U0FDYixNQUFNQyxLQUFWLElBQW1CSixPQUFPSyxNQUFQLENBQWdCLENBQWhCLEVBQW1CTCxPQUFPTSxNQUExQixDQUFuQixFQUFzRDs7Ozs7V0FHL0NKLEtBQVQsR0FBaUI7VUFDVEssWUFBWVQsV0FDZEEsU0FBU1UsSUFBVCxDQUFjWCxTQUFkLEVBQXlCQSxVQUFVUixLQUFuQyxFQUEwQ1EsU0FBMUMsQ0FEYyxHQUVkQSxVQUFVWSxTQUFWLENBQW9CWixVQUFVUixLQUE5QixDQUZKOztjQUlVcUIsUUFBVixDQUFxQkgsU0FBckIsRUFBZ0MsWUFBVztXQUNyQyxNQUFNLENBQUNJLElBQUQsRUFBT0MsR0FBUCxDQUFWLElBQXlCekIsT0FBT0MsT0FBUCxDQUFpQm1CLFNBQWpCLENBQXpCLEVBQXNEO1lBQ2pELFFBQVFLLEdBQVIsSUFBZSxlQUFlLE9BQU9BLElBQUlILFNBQTVDLEVBQXdEO2dCQUNoRCxJQUFJSSxTQUFKLENBQWlCLGlCQUFnQkYsSUFBSyx3Q0FBdEMsQ0FBTjs7O2VBRUtHLElBQVAsQ0FBY0YsSUFBSUgsU0FBSixDQUFnQixLQUFoQixFQUF1Qk0sS0FBSztvQkFDOUJMLFFBQVYsQ0FBcUJNLFFBQ25CRCxNQUFNQyxLQUFLTCxJQUFMLENBQU4sR0FBbUIsRUFBQyxDQUFDQSxJQUFELEdBQVFJLENBQVQsRUFBbkIsR0FBaUMsSUFEbkM7U0FEWSxDQUFkOztLQUxKOzs7Ozs7In0=
