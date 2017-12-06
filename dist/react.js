'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.withSubscribe = withSubscribe;
exports.bindSubscriptions = bindSubscriptions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QuanMiLCJzb3VyY2VzIjpbIi4uL2NvZGUvcmVhY3QuanN5Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB3aXRoU3Vic2NyaWJlKGV2dGJ1cywgQ29tcG9uZW50KSA6OlxuICBjb25zdCBDID0gY2xhc3MgZXh0ZW5kcyBDb21wb25lbnQgOjpcbiAgICBzdGF0ZSA9IHRoaXMuc3RhdGUgfHwge31cblxuICAgIHN1YnNjcmlwdGlvbnMocHJvcHMpIDo6XG4gICAgc2V0U3Vic2NyaXB0aW9uU3RhdGUoc3ViX3N0YXRlLCBjbGVhbnVwKSA6OlxuICAgICAgaWYgdW5kZWZpbmVkICE9PSBjbGVhbnVwIDo6XG4gICAgICAgIE9iamVjdC5hc3NpZ24gQCB0aGlzLnN0YXRlLCBzdWJfc3RhdGVcbiAgICAgICAgdGhpcy5ldnRfc2luay5vbiBAICdjbGVhbnVwJywgY2xlYW51cFxuICAgICAgZWxzZSA6OlxuICAgICAgICB0aGlzLnNldFN0YXRlKHN1Yl9zdGF0ZSlcblxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIDo6XG4gICAgICBiaW5kU3Vic2NyaXB0aW9ucyh0aGlzKVxuXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoLi4uYXJncykgOjpcbiAgICAgIHRoaXMuZXZ0X3NpbmsuZW1pdCgnY2xlYW51cCcpLmNsZWFyKClcblxuICAgIGdldCBldnRfc2luaygpIDo6IHJldHVybiBldnRidXMuc2luayh0aGlzKVxuXG4gIEMucHJvdG90eXBlLmV2dGJ1cyA9IGV2dGJ1c1xuICByZXR1cm4gQ1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kU3Vic2NyaXB0aW9ucyhjb21wb25lbnQpIDo6XG4gIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSAnZnVuY3Rpb24nID09PSB0eXBlb2YgY29tcG9uZW50LnN1YnNjcmlwdGlvbnNcbiAgICA/IGNvbXBvbmVudC5zdWJzY3JpcHRpb25zKGNvbXBvbmVudC5wcm9wcylcbiAgICA6IGNvbXBvbmVudC5zdWJzY3JpcHRpb25zXG5cbiAgaWYgbnVsbCA9PSBzdWJzY3JpcHRpb25zIDo6IHJldHVyblxuXG4gIGNvbnN0IHN1Yl9zdGF0ZT17fSwgdW53aW5kPVtdXG4gIGxldCBxID0gbnVsbFxuXG4gIGZvciBjb25zdCBbYXR0ciwgc3ViXSBvZiBPYmplY3QuZW50cmllcyBAIHN1YnNjcmlwdGlvbnMgOjpcbiAgICBpZiBudWxsID09IHN1YiB8fCAnZnVuY3Rpb24nICE9PSB0eXBlb2Ygc3ViLnN1YnNjcmliZSA6OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciBAIGBTdWJzY3JpcHRpb24gXCIke2F0dHJ9XCIgZG9lcyBub3QgaGF2ZSBhIHN1YnNjcmliZSgpIGZ1bmN0aW9uYFxuXG4gICAgdW53aW5kLnB1c2ggQFxuICAgICAgc3ViLnN1YnNjcmliZSBAIHYgPT4gOjpcbiAgICAgICAgc3ViX3N0YXRlW2F0dHJdID0gdlxuICAgICAgICBpZiBudWxsID09PSBxIDo6XG4gICAgICAgICAgcSA9IHJlc29sdmVOZXh0KClcblxuICBjb21wb25lbnQuc2V0U3Vic2NyaXB0aW9uU3RhdGUgQCBzdWJfc3RhdGUsIHVuc3Vic2NyaWJlQWxsXG5cbiAgZnVuY3Rpb24gdW5zdWJzY3JpYmVBbGwoKSA6OlxuICAgIGZvciBjb25zdCB1bnN1YiBvZiB1bndpbmQuc3BsaWNlIEAgMCwgdW53aW5kLmxlbmd0aCA6OlxuICAgICAgdW5zdWIoKVxuXG4gIC8vIHVzZSBwcm9taXNlIHJlc29sdXRpb24gdG8gZGVib3VuY2UgdXBkYXRlc1xuICBmdW5jdGlvbiByZXNvbHZlTmV4dCgpIDo6XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4gQCAoKSA9PiA6OlxuICAgICAgY29tcG9uZW50LnNldFN1YnNjcmlwdGlvblN0YXRlIEAgc3ViX3N0YXRlXG4gICAgICBxID0gbnVsbFxuIl0sIm5hbWVzIjpbIndpdGhTdWJzY3JpYmUiLCJldnRidXMiLCJDb21wb25lbnQiLCJDIiwic3RhdGUiLCJwcm9wcyIsInN1Yl9zdGF0ZSIsImNsZWFudXAiLCJ1bmRlZmluZWQiLCJhc3NpZ24iLCJldnRfc2luayIsIm9uIiwic2V0U3RhdGUiLCJhcmdzIiwiZW1pdCIsImNsZWFyIiwic2luayIsInByb3RvdHlwZSIsImJpbmRTdWJzY3JpcHRpb25zIiwiY29tcG9uZW50Iiwic3Vic2NyaXB0aW9ucyIsInVud2luZCIsInEiLCJhdHRyIiwic3ViIiwiT2JqZWN0IiwiZW50cmllcyIsInN1YnNjcmliZSIsIlR5cGVFcnJvciIsInB1c2giLCJ2IiwicmVzb2x2ZU5leHQiLCJzZXRTdWJzY3JpcHRpb25TdGF0ZSIsInVuc3Vic2NyaWJlQWxsIiwidW5zdWIiLCJzcGxpY2UiLCJsZW5ndGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBTyxTQUFTQSxhQUFULENBQXVCQyxNQUF2QixFQUErQkMsU0FBL0IsRUFBMEM7UUFDekNDLElBQUksTUFBSkEsQ0FBSSxTQUFjRCxTQUFkLENBQXdCOzs7OzBDQUNoQ0UsS0FEZ0MsR0FDeEIsS0FBS0EsS0FBTCxJQUFjLEVBRFU7OztrQkFHbEJDLEtBQWQsRUFBcUI7eUJBQ0FDLFNBQXJCLEVBQWdDQyxPQUFoQyxFQUF5QztVQUNwQ0MsY0FBY0QsT0FBakIsRUFBMkI7ZUFDbEJFLE1BQVAsQ0FBZ0IsS0FBS0wsS0FBckIsRUFBNEJFLFNBQTVCO2FBQ0tJLFFBQUwsQ0FBY0MsRUFBZCxDQUFtQixTQUFuQixFQUE4QkosT0FBOUI7T0FGRixNQUdLO2FBQ0VLLFFBQUwsQ0FBY04sU0FBZDs7Ozt5QkFFaUI7d0JBQ0QsSUFBbEI7Ozt5QkFFbUIsR0FBR08sSUFBeEIsRUFBOEI7V0FDdkJILFFBQUwsQ0FBY0ksSUFBZCxDQUFtQixTQUFuQixFQUE4QkMsS0FBOUI7OztRQUVFTCxRQUFKLEdBQWU7YUFBVVQsT0FBT2UsSUFBUCxDQUFZLElBQVosQ0FBUDs7R0FqQnBCOztJQW1CRUMsU0FBRixDQUFZaEIsTUFBWixHQUFxQkEsTUFBckI7U0FDT0UsQ0FBUDs7O0FBR0YsQUFBTyxTQUFTZSxpQkFBVCxDQUEyQkMsU0FBM0IsRUFBc0M7UUFDckNDLGdCQUFnQixlQUFlLE9BQU9ELFVBQVVDLGFBQWhDLEdBQ2xCRCxVQUFVQyxhQUFWLENBQXdCRCxVQUFVZCxLQUFsQyxDQURrQixHQUVsQmMsVUFBVUMsYUFGZDs7TUFJRyxRQUFRQSxhQUFYLEVBQTJCOzs7O1FBRXJCZCxZQUFVLEVBQWhCO1FBQW9CZSxTQUFPLEVBQTNCO01BQ0lDLElBQUksSUFBUjs7T0FFSSxNQUFNLENBQUNDLElBQUQsRUFBT0MsR0FBUCxDQUFWLElBQXlCQyxPQUFPQyxPQUFQLENBQWlCTixhQUFqQixDQUF6QixFQUEwRDtRQUNyRCxRQUFRSSxHQUFSLElBQWUsZUFBZSxPQUFPQSxJQUFJRyxTQUE1QyxFQUF3RDtZQUNoRCxJQUFJQyxTQUFKLENBQWlCLGlCQUFnQkwsSUFBSyx3Q0FBdEMsQ0FBTjs7O1dBRUtNLElBQVAsQ0FDRUwsSUFBSUcsU0FBSixDQUFnQkcsS0FBSztnQkFDVFAsSUFBVixJQUFrQk8sQ0FBbEI7VUFDRyxTQUFTUixDQUFaLEVBQWdCO1lBQ1ZTLGFBQUo7O0tBSEosQ0FERjs7O1lBTVFDLG9CQUFWLENBQWlDMUIsU0FBakMsRUFBNEMyQixjQUE1Qzs7V0FFU0EsY0FBVCxHQUEwQjtTQUNwQixNQUFNQyxLQUFWLElBQW1CYixPQUFPYyxNQUFQLENBQWdCLENBQWhCLEVBQW1CZCxPQUFPZSxNQUExQixDQUFuQixFQUFzRDs7Ozs7O1dBSS9DTCxXQUFULEdBQXVCO1dBQ2RNLFFBQVFDLE9BQVIsR0FBa0JDLElBQWxCLENBQXlCLE1BQU07Z0JBQzFCUCxvQkFBVixDQUFpQzFCLFNBQWpDO1VBQ0ksSUFBSjtLQUZLLENBQVA7Ozs7Ozs7In0=
