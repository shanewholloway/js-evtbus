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

export { withSubscribe, bindSubscriptions };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QubWpzIiwic291cmNlcyI6WyIuLi9jb2RlL3JlYWN0LmpzeSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gd2l0aFN1YnNjcmliZShldnRidXMsIENvbXBvbmVudCkgOjpcbiAgY29uc3QgQyA9IGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IDo6XG4gICAgc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9XG5cbiAgICBzdWJzY3JpcHRpb25zKHByb3BzKSA6OlxuICAgIHNldFN1YnNjcmlwdGlvblN0YXRlKHN1Yl9zdGF0ZSwgY2xlYW51cCkgOjpcbiAgICAgIGlmIHVuZGVmaW5lZCAhPT0gY2xlYW51cCA6OlxuICAgICAgICBPYmplY3QuYXNzaWduIEAgdGhpcy5zdGF0ZSwgc3ViX3N0YXRlXG4gICAgICAgIHRoaXMuZXZ0X3Npbmsub24gQCAnY2xlYW51cCcsIGNsZWFudXBcbiAgICAgIGVsc2UgOjpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdWJfc3RhdGUpXG5cbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSA6OlxuICAgICAgYmluZFN1YnNjcmlwdGlvbnModGhpcylcblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KC4uLmFyZ3MpIDo6XG4gICAgICB0aGlzLmV2dF9zaW5rLmVtaXQoJ2NsZWFudXAnKS5jbGVhcigpXG5cbiAgICBnZXQgZXZ0X3NpbmsoKSA6OiByZXR1cm4gZXZ0YnVzLnNpbmsodGhpcylcblxuICBDLnByb3RvdHlwZS5ldnRidXMgPSBldnRidXNcbiAgcmV0dXJuIENcblxuXG5leHBvcnQgZnVuY3Rpb24gYmluZFN1YnNjcmlwdGlvbnMoY29tcG9uZW50KSA6OlxuICBjb25zdCBzdWJzY3JpcHRpb25zID0gJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGNvbXBvbmVudC5zdWJzY3JpcHRpb25zXG4gICAgPyBjb21wb25lbnQuc3Vic2NyaXB0aW9ucyhjb21wb25lbnQucHJvcHMpXG4gICAgOiBjb21wb25lbnQuc3Vic2NyaXB0aW9uc1xuXG4gIGlmIG51bGwgPT0gc3Vic2NyaXB0aW9ucyA6OiByZXR1cm5cblxuICBjb25zdCBzdWJfc3RhdGU9e30sIHVud2luZD1bXVxuICBsZXQgcSA9IG51bGxcblxuICBmb3IgY29uc3QgW2F0dHIsIHN1Yl0gb2YgT2JqZWN0LmVudHJpZXMgQCBzdWJzY3JpcHRpb25zIDo6XG4gICAgaWYgbnVsbCA9PSBzdWIgfHwgJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHN1Yi5zdWJzY3JpYmUgOjpcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IgQCBgU3Vic2NyaXB0aW9uIFwiJHthdHRyfVwiIGRvZXMgbm90IGhhdmUgYSBzdWJzY3JpYmUoKSBmdW5jdGlvbmBcblxuICAgIHVud2luZC5wdXNoIEBcbiAgICAgIHN1Yi5zdWJzY3JpYmUgQCB2ID0+IDo6XG4gICAgICAgIHN1Yl9zdGF0ZVthdHRyXSA9IHZcbiAgICAgICAgaWYgbnVsbCA9PT0gcSA6OlxuICAgICAgICAgIHEgPSByZXNvbHZlTmV4dCgpXG5cbiAgY29tcG9uZW50LnNldFN1YnNjcmlwdGlvblN0YXRlIEAgc3ViX3N0YXRlLCB1bnN1YnNjcmliZUFsbFxuXG4gIGZ1bmN0aW9uIHVuc3Vic2NyaWJlQWxsKCkgOjpcbiAgICBmb3IgY29uc3QgdW5zdWIgb2YgdW53aW5kLnNwbGljZSBAIDAsIHVud2luZC5sZW5ndGggOjpcbiAgICAgIHVuc3ViKClcblxuICAvLyB1c2UgcHJvbWlzZSByZXNvbHV0aW9uIHRvIGRlYm91bmNlIHVwZGF0ZXNcbiAgZnVuY3Rpb24gcmVzb2x2ZU5leHQoKSA6OlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuIEAgKCkgPT4gOjpcbiAgICAgIGNvbXBvbmVudC5zZXRTdWJzY3JpcHRpb25TdGF0ZSBAIHN1Yl9zdGF0ZVxuICAgICAgcSA9IG51bGxcbiJdLCJuYW1lcyI6WyJ3aXRoU3Vic2NyaWJlIiwiZXZ0YnVzIiwiQ29tcG9uZW50IiwiQyIsInN0YXRlIiwicHJvcHMiLCJzdWJfc3RhdGUiLCJjbGVhbnVwIiwidW5kZWZpbmVkIiwiYXNzaWduIiwiZXZ0X3NpbmsiLCJvbiIsInNldFN0YXRlIiwiYXJncyIsImVtaXQiLCJjbGVhciIsInNpbmsiLCJwcm90b3R5cGUiLCJiaW5kU3Vic2NyaXB0aW9ucyIsImNvbXBvbmVudCIsInN1YnNjcmlwdGlvbnMiLCJ1bndpbmQiLCJxIiwiYXR0ciIsInN1YiIsIk9iamVjdCIsImVudHJpZXMiLCJzdWJzY3JpYmUiLCJUeXBlRXJyb3IiLCJwdXNoIiwidiIsInJlc29sdmVOZXh0Iiwic2V0U3Vic2NyaXB0aW9uU3RhdGUiLCJ1bnN1YnNjcmliZUFsbCIsInVuc3ViIiwic3BsaWNlIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIl0sIm1hcHBpbmdzIjoiQUFBTyxTQUFTQSxhQUFULENBQXVCQyxNQUF2QixFQUErQkMsU0FBL0IsRUFBMEM7UUFDekNDLElBQUksTUFBSkEsQ0FBSSxTQUFjRCxTQUFkLENBQXdCOzs7OzBDQUNoQ0UsS0FEZ0MsR0FDeEIsS0FBS0EsS0FBTCxJQUFjLEVBRFU7OztrQkFHbEJDLEtBQWQsRUFBcUI7eUJBQ0FDLFNBQXJCLEVBQWdDQyxPQUFoQyxFQUF5QztVQUNwQ0MsY0FBY0QsT0FBakIsRUFBMkI7ZUFDbEJFLE1BQVAsQ0FBZ0IsS0FBS0wsS0FBckIsRUFBNEJFLFNBQTVCO2FBQ0tJLFFBQUwsQ0FBY0MsRUFBZCxDQUFtQixTQUFuQixFQUE4QkosT0FBOUI7T0FGRixNQUdLO2FBQ0VLLFFBQUwsQ0FBY04sU0FBZDs7Ozt5QkFFaUI7d0JBQ0QsSUFBbEI7Ozt5QkFFbUIsR0FBR08sSUFBeEIsRUFBOEI7V0FDdkJILFFBQUwsQ0FBY0ksSUFBZCxDQUFtQixTQUFuQixFQUE4QkMsS0FBOUI7OztRQUVFTCxRQUFKLEdBQWU7YUFBVVQsT0FBT2UsSUFBUCxDQUFZLElBQVosQ0FBUDs7R0FqQnBCOztJQW1CRUMsU0FBRixDQUFZaEIsTUFBWixHQUFxQkEsTUFBckI7U0FDT0UsQ0FBUDs7O0FBR0YsQUFBTyxTQUFTZSxpQkFBVCxDQUEyQkMsU0FBM0IsRUFBc0M7UUFDckNDLGdCQUFnQixlQUFlLE9BQU9ELFVBQVVDLGFBQWhDLEdBQ2xCRCxVQUFVQyxhQUFWLENBQXdCRCxVQUFVZCxLQUFsQyxDQURrQixHQUVsQmMsVUFBVUMsYUFGZDs7TUFJRyxRQUFRQSxhQUFYLEVBQTJCOzs7O1FBRXJCZCxZQUFVLEVBQWhCO1FBQW9CZSxTQUFPLEVBQTNCO01BQ0lDLElBQUksSUFBUjs7T0FFSSxNQUFNLENBQUNDLElBQUQsRUFBT0MsR0FBUCxDQUFWLElBQXlCQyxPQUFPQyxPQUFQLENBQWlCTixhQUFqQixDQUF6QixFQUEwRDtRQUNyRCxRQUFRSSxHQUFSLElBQWUsZUFBZSxPQUFPQSxJQUFJRyxTQUE1QyxFQUF3RDtZQUNoRCxJQUFJQyxTQUFKLENBQWlCLGlCQUFnQkwsSUFBSyx3Q0FBdEMsQ0FBTjs7O1dBRUtNLElBQVAsQ0FDRUwsSUFBSUcsU0FBSixDQUFnQkcsS0FBSztnQkFDVFAsSUFBVixJQUFrQk8sQ0FBbEI7VUFDRyxTQUFTUixDQUFaLEVBQWdCO1lBQ1ZTLGFBQUo7O0tBSEosQ0FERjs7O1lBTVFDLG9CQUFWLENBQWlDMUIsU0FBakMsRUFBNEMyQixjQUE1Qzs7V0FFU0EsY0FBVCxHQUEwQjtTQUNwQixNQUFNQyxLQUFWLElBQW1CYixPQUFPYyxNQUFQLENBQWdCLENBQWhCLEVBQW1CZCxPQUFPZSxNQUExQixDQUFuQixFQUFzRDs7Ozs7O1dBSS9DTCxXQUFULEdBQXVCO1dBQ2RNLFFBQVFDLE9BQVIsR0FBa0JDLElBQWxCLENBQXlCLE1BQU07Z0JBQzFCUCxvQkFBVixDQUFpQzFCLFNBQWpDO1VBQ0ksSUFBSjtLQUZLLENBQVA7Ozs7OzsifQ==
