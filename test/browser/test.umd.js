(function () {
  'use strict';

  const obj_fn = window['object-functional'];

  const ts0 = Date.now();
  class Example extends obj_fn.ObjectFunctional {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.asAction = this.init, this.asAction = this.assign, this.asAction = this.inc, _temp;
    }

    init() {
      this.counter = 0;
      this.ts = 0;
      return this;
    }

    autoinc(d, ms) {
      ms = Math.max(1000, ms);
      setInterval(() => this.inc(d), ms);
      return this.assign({ interval: ms });
    }

    format() {
      return `Instance Counter "${this.name}": ${this.counter} at ${this.ts} every ${this.interval / 1000.}s`;
    }
    assign(ns) {
      if (null != ns) {
        Object.assign(this, ns);
      }
      return this;
    }
    inc(d = 1) {
      this.counter += d;
      this.ts = Date.now() - ts0 | 0;
    }
  }

  function createInstaceExample() {
    return new Example().init();
  }

  const obj_fn$1 = window['object-functional'];

  const ts0$1 = Date.now();
  const createProtoExample = obj_fn$1.asFunctionalProto({
    counter: 0, ts: 0,

    autoinc(d, ms) {
      ms = Math.max(1000, ms);
      setInterval(() => this.inc(d), ms);
      return this.assign({ interval: ms });
    },

    format() {
      return `Proto Counter "${this.name}": ${this.counter} at ${this.ts} every ${this.interval / 1000.}s`;
    },

    asAction: {
      assign(ns) {
        return Object.assign(this, ns);
      },

      inc(d = 1) {
        this.counter += d;
        this.ts = Date.now() - ts0$1 | 0;
      } } });

  const React = window.React;
  const h = React.createElement;
  const h_fragment = h.bind(React, React.Fragment, {});

  const eb_react = window['evtbus-all'];
  const EvtBusSubscription = eb_react.withSubscribe(eb_react.evtbus, React.PureComponent);

  class App extends EvtBusSubscription {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.subscriptions = {
        a: this.props.a,
        b: this.props.b,
        c: this.props.c }, _temp;
    }

    render() {
      const { a, b, c } = this.state;
      return h_fragment(h('ul', null, h('li', {}, a.format()), h('li', {}, b.format()), h('li', {}, c.format())));
    }
  }

  {
    const obs_a = createProtoExample().assign({ name: 'a' });
    const obs_b = createInstaceExample().assign({ name: 'b' });
    const obs_c = createProtoExample().assign({ name: 'c', counter: 100000 });

    obs_a.autoinc(1, 1000);
    obs_b.autoinc(10, 1300);
    obs_c.autoinc(100, 1700);

    ReactDOM.render(h(App, { a: obs_a, b: obs_b, c: obs_c }), window.main);
  }

}());
