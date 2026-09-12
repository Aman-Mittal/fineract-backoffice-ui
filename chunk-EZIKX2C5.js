function P(t) { let r = t(o => { Error.call(o), o.stack = new Error().stack; }); return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r; }
var ce = P(t => function (r) {
    t(this), this.message = r ? `${r.length} errors occurred during unsubscription:
${r.map((o, n) => `${n + 1}) ${o.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = r;
});
function d(t) { return typeof t == "function"; }
function T(t, e) { if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
} }
var I = class t {
    constructor(e) { this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null; }
    unsubscribe() { let e; if (!this.closed) {
        this.closed = !0;
        let { _parentage: r } = this;
        if (r)
            if (this._parentage = null, Array.isArray(r))
                for (let i of r)
                    i.remove(this);
            else
                r.remove(this);
        let { initialTeardown: o } = this;
        if (d(o))
            try {
                o();
            }
            catch (i) {
                e = i instanceof ce ? i.errors : [i];
            }
        let { _finalizers: n } = this;
        if (n) {
            this._finalizers = null;
            for (let i of n)
                try {
                    ct(i);
                }
                catch (s) {
                    e = e ?? [], s instanceof ce ? e = [...e, ...s.errors] : e.push(s);
                }
        }
        if (e)
            throw new ce(e);
    } }
    add(e) { var r; if (e && e !== this)
        if (this.closed)
            ct(e);
        else {
            if (e instanceof t) {
                if (e.closed || e._hasParent(this))
                    return;
                e._addParent(this);
            }
            (this._finalizers = (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
        } }
    _hasParent(e) { let { _parentage: r } = this; return r === e || Array.isArray(r) && r.includes(e); }
    _addParent(e) { let { _parentage: r } = this; this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e; }
    _removeParent(e) { let { _parentage: r } = this; r === e ? this._parentage = null : Array.isArray(r) && T(r, e); }
    remove(e) { let { _finalizers: r } = this; r && T(r, e), e instanceof t && e._removeParent(this); }
};
I.EMPTY = (() => { let t = new I; return t.closed = !0, t; })();
var Ye = I.EMPTY;
function fe(t) { return t instanceof I || t && "closed" in t && d(t.remove) && d(t.add) && d(t.unsubscribe); }
function ct(t) { d(t) ? t() : t.unsubscribe(); }
var L = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: !1, useDeprecatedNextContext: !1 };
function _() { }
var ee = { setTimeout(t, e, ...r) { let { delegate: o } = ee; return o?.setTimeout ? o.setTimeout(t, e, ...r) : setTimeout(t, e, ...r); }, clearTimeout(t) { let { delegate: e } = ee; return (e?.clearTimeout || clearTimeout)(t); }, delegate: void 0 };
function pe(t) { ee.setTimeout(() => { let { onUnhandledError: e } = L; if (e)
    e(t);
else
    throw t; }); }
var ft = qe("C", void 0, void 0);
function pt(t) { return qe("E", void 0, t); }
function at(t) { return qe("N", t, void 0); }
function qe(t, e, r) { return { kind: t, value: e, error: r }; }
var B = null;
function te(t) { if (L.useDeprecatedSynchronousErrorHandling) {
    let e = !B;
    if (e && (B = { errorThrown: !1, error: null }), t(), e) {
        let { errorThrown: r, error: o } = B;
        if (B = null, r)
            throw o;
    }
}
else
    t(); }
function dt(t) { L.useDeprecatedSynchronousErrorHandling && B && (B.errorThrown = !0, B.error = t); }
var K = class extends I {
    constructor(e) { super(), this.isStopped = !1, e ? (this.destination = e, fe(e) && e.add(this)) : this.destination = er; }
    static create(e, r, o) { return new W(e, r, o); }
    next(e) { this.isStopped ? Ge(at(e), this) : this._next(e); }
    error(e) { this.isStopped ? Ge(pt(e), this) : (this.isStopped = !0, this._error(e)); }
    complete() { this.isStopped ? Ge(ft, this) : (this.isStopped = !0, this._complete()); }
    unsubscribe() { this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null); }
    _next(e) { this.destination.next(e); }
    _error(e) { try {
        this.destination.error(e);
    }
    finally {
        this.unsubscribe();
    } }
    _complete() { try {
        this.destination.complete();
    }
    finally {
        this.unsubscribe();
    } }
}, Ht = Function.prototype.bind;
function $e(t, e) { return Ht.call(t, e); }
var Be = class {
    constructor(e) { this.partialObserver = e; }
    next(e) { let { partialObserver: r } = this; if (r.next)
        try {
            r.next(e);
        }
        catch (o) {
            ae(o);
        } }
    error(e) { let { partialObserver: r } = this; if (r.error)
        try {
            r.error(e);
        }
        catch (o) {
            ae(o);
        }
    else
        ae(e); }
    complete() { let { partialObserver: e } = this; if (e.complete)
        try {
            e.complete();
        }
        catch (r) {
            ae(r);
        } }
}, W = class extends K {
    constructor(e, r, o) { super(); let n; if (d(e) || !e)
        n = { next: e ?? void 0, error: r ?? void 0, complete: o ?? void 0 };
    else {
        let i;
        this && L.useDeprecatedNextContext ? (i = Object.create(e), i.unsubscribe = () => this.unsubscribe(), n = { next: e.next && $e(e.next, i), error: e.error && $e(e.error, i), complete: e.complete && $e(e.complete, i) }) : n = e;
    } this.destination = new Be(n); }
};
function ae(t) { L.useDeprecatedSynchronousErrorHandling ? dt(t) : pe(t); }
function Qt(t) { throw t; }
function Ge(t, e) { let { onStoppedNotification: r } = L; r && ee.setTimeout(() => r(t, e)); }
var er = { closed: !0, next: _, error: Qt, complete: _ };
var re = typeof Symbol == "function" && Symbol.observable || "@@observable";
function g(t) { return t; }
function de(...t) { return Ke(t); }
function Ke(t) { return t.length === 0 ? g : t.length === 1 ? t[0] : function (r) { return t.reduce((o, n) => n(o), r); }; }
var v = class t {
    constructor(e) { e && (this._subscribe = e); }
    lift(e) { let r = new t; return r.source = this, r.operator = e, r; }
    subscribe(e, r, o) { let n = rr(e) ? e : new W(e, r, o); return te(() => { let { operator: i, source: s } = this; n.add(i ? i.call(n, s) : s ? this._subscribe(n) : this._trySubscribe(n)); }), n; }
    _trySubscribe(e) { try {
        return this._subscribe(e);
    }
    catch (r) {
        e.error(r);
    } }
    forEach(e, r) { return r = ht(r), new r((o, n) => { let i = new W({ next: s => { try {
            e(s);
        }
        catch (c) {
            n(c), i.unsubscribe();
        } }, error: n, complete: o }); this.subscribe(i); }); }
    _subscribe(e) { var r; return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(e); }
    [re]() { return this; }
    pipe(...e) { return Ke(e)(this); }
    toPromise(e) { return e = ht(e), new e((r, o) => { let n; this.subscribe(i => n = i, i => o(i), () => r(n)); }); }
};
v.create = t => new v(t);
function ht(t) { var e; return (e = t ?? L.Promise) !== null && e !== void 0 ? e : Promise; }
function tr(t) { return t && d(t.next) && d(t.error) && d(t.complete); }
function rr(t) { return t && t instanceof K || tr(t) && fe(t); }
function Ze(t) { return d(t?.lift); }
function u(t) { return e => { if (Ze(e))
    return e.lift(function (r) { try {
        return t(r, this);
    }
    catch (o) {
        this.error(o);
    } }); throw new TypeError("Unable to lift unknown Observable type"); }; }
function l(t, e, r, o, n) { return new Z(t, e, r, o, n); }
var Z = class extends K {
    constructor(e, r, o, n, i, s) { super(e), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = r ? function (c) { try {
        r(c);
    }
    catch (m) {
        e.error(m);
    } } : super._next, this._error = n ? function (c) { try {
        n(c);
    }
    catch (m) {
        e.error(m);
    }
    finally {
        this.unsubscribe();
    } } : super._error, this._complete = o ? function () { try {
        o();
    }
    catch (c) {
        e.error(c);
    }
    finally {
        this.unsubscribe();
    } } : super._complete; }
    unsubscribe() { var e; if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        let { closed: r } = this;
        super.unsubscribe(), !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    } }
};
function bt() { return u((t, e) => { let r = null; t._refCount++; let o = l(e, void 0, void 0, void 0, () => { if (!t || t._refCount <= 0 || 0 < --t._refCount) {
    r = null;
    return;
} let n = t._connection, i = r; r = null, n && (!i || n === i) && n.unsubscribe(), e.unsubscribe(); }); t.subscribe(o), o.closed || (r = t.connect()); }); }
var z = class extends v {
    constructor(e, r) { super(), this.source = e, this.subjectFactory = r, this._subject = null, this._refCount = 0, this._connection = null, Ze(e) && (this.lift = e.lift); }
    _subscribe(e) { return this.getSubject().subscribe(e); }
    getSubject() { let e = this._subject; return (!e || e.isStopped) && (this._subject = this.subjectFactory()), this._subject; }
    _teardown() { this._refCount = 0; let { _connection: e } = this; this._subject = this._connection = null, e?.unsubscribe(); }
    connect() { let e = this._connection; if (!e) {
        e = this._connection = new I;
        let r = this.getSubject();
        e.add(this.source.subscribe(l(r, void 0, () => { this._teardown(), r.complete(); }, o => { this._teardown(), r.error(o); }, () => this._teardown()))), e.closed && (this._connection = null, e = I.EMPTY);
    } return e; }
    refCount() { return bt()(this); }
};
var xt = P(t => function () { t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"; });
var S = class extends v {
    constructor() { super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null; }
    lift(e) { let r = new he(this, this); return r.operator = e, r; }
    _throwIfClosed() { if (this.closed)
        throw new xt; }
    next(e) { te(() => { if (this._throwIfClosed(), !this.isStopped) {
        this.currentObservers || (this.currentObservers = Array.from(this.observers));
        for (let r of this.currentObservers)
            r.next(e);
    } }); }
    error(e) { te(() => { if (this._throwIfClosed(), !this.isStopped) {
        this.hasError = this.isStopped = !0, this.thrownError = e;
        let { observers: r } = this;
        for (; r.length;)
            r.shift().error(e);
    } }); }
    complete() { te(() => { if (this._throwIfClosed(), !this.isStopped) {
        this.isStopped = !0;
        let { observers: e } = this;
        for (; e.length;)
            e.shift().complete();
    } }); }
    unsubscribe() { this.isStopped = this.closed = !0, this.observers = this.currentObservers = null; }
    get observed() { var e; return ((e = this.observers) === null || e === void 0 ? void 0 : e.length) > 0; }
    _trySubscribe(e) { return this._throwIfClosed(), super._trySubscribe(e); }
    _subscribe(e) { return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e); }
    _innerSubscribe(e) { let { hasError: r, isStopped: o, observers: n } = this; return r || o ? Ye : (this.currentObservers = null, n.push(e), new I(() => { this.currentObservers = null, T(n, e); })); }
    _checkFinalizedStatuses(e) { let { hasError: r, thrownError: o, isStopped: n } = this; r ? e.error(o) : n && e.complete(); }
    asObservable() { let e = new v; return e.source = this, e; }
};
S.create = (t, e) => new he(t, e);
var he = class extends S {
    constructor(e, r) { super(), this.destination = e, this.source = r; }
    next(e) { var r, o; (o = (r = this.destination) === null || r === void 0 ? void 0 : r.next) === null || o === void 0 || o.call(r, e); }
    error(e) { var r, o; (o = (r = this.destination) === null || r === void 0 ? void 0 : r.error) === null || o === void 0 || o.call(r, e); }
    complete() { var e, r; (r = (e = this.destination) === null || e === void 0 ? void 0 : e.complete) === null || r === void 0 || r.call(e); }
    _subscribe(e) { var r, o; return (o = (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(e)) !== null && o !== void 0 ? o : Ye; }
};
var be = class extends S {
    constructor(e) { super(), this._value = e; }
    get value() { return this.getValue(); }
    _subscribe(e) { let r = super._subscribe(e); return !r.closed && e.next(this._value), r; }
    getValue() { let { hasError: e, thrownError: r, _value: o } = this; if (e)
        throw r; return this._throwIfClosed(), o; }
    next(e) { super.next(this._value = e); }
};
var J = { now() { return (J.delegate || Date).now(); }, delegate: void 0 };
var oe = class extends S {
    constructor(e = 1 / 0, r = 1 / 0, o = J) { super(), this._bufferSize = e, this._windowTime = r, this._timestampProvider = o, this._buffer = [], this._infiniteTimeWindow = !0, this._infiniteTimeWindow = r === 1 / 0, this._bufferSize = Math.max(1, e), this._windowTime = Math.max(1, r); }
    next(e) { let { isStopped: r, _buffer: o, _infiniteTimeWindow: n, _timestampProvider: i, _windowTime: s } = this; r || (o.push(e), !n && o.push(i.now() + s)), this._trimBuffer(), super.next(e); }
    _subscribe(e) { this._throwIfClosed(), this._trimBuffer(); let r = this._innerSubscribe(e), { _infiniteTimeWindow: o, _buffer: n } = this, i = n.slice(); for (let s = 0; s < i.length && !e.closed; s += o ? 1 : 2)
        e.next(i[s]); return this._checkFinalizedStatuses(e), r; }
    _trimBuffer() { let { _bufferSize: e, _timestampProvider: r, _buffer: o, _infiniteTimeWindow: n } = this, i = (n ? 1 : 2) * e; if (e < 1 / 0 && i < o.length && o.splice(0, o.length - i), !n) {
        let s = r.now(), c = 0;
        for (let m = 1; m < o.length && o[m] <= s; m += 2)
            c = m;
        c && o.splice(0, c + 1);
    } }
};
var xe = class extends S {
    constructor() { super(...arguments), this._value = null, this._hasValue = !1, this._isComplete = !1; }
    _checkFinalizedStatuses(e) { let { hasError: r, _hasValue: o, _value: n, thrownError: i, isStopped: s, _isComplete: c } = this; r ? e.error(i) : (s || c) && (o && e.next(n), e.complete()); }
    next(e) { this.isStopped || (this._value = e, this._hasValue = !0); }
    complete() { let { _hasValue: e, _value: r, _isComplete: o } = this; o || (this._isComplete = !0, e && super.next(r), super.complete()); }
};
var Je = (() => { class t {
    constructor(r, o = t.now) { this.schedulerActionCtor = r, this.now = o; }
    schedule(r, o = 0, n) { return new this.schedulerActionCtor(this, r).schedule(n, o); }
} return t.now = J.now, t; })();
var ve = class extends I {
    constructor(e, r) { super(); }
    schedule(e, r = 0) { return this; }
};
var le = { setInterval(t, e, ...r) { let { delegate: o } = le; return o?.setInterval ? o.setInterval(t, e, ...r) : setInterval(t, e, ...r); }, clearInterval(t) { let { delegate: e } = le; return (e?.clearInterval || clearInterval)(t); }, delegate: void 0 };
var ye = class extends ve {
    constructor(e, r) { super(e, r), this.scheduler = e, this.work = r, this.pending = !1; }
    schedule(e, r = 0) { var o; if (this.closed)
        return this; this.state = e; let n = this.id, i = this.scheduler; return n != null && (this.id = this.recycleAsyncId(i, n, r)), this.pending = !0, this.delay = r, this.id = (o = this.id) !== null && o !== void 0 ? o : this.requestAsyncId(i, this.id, r), this; }
    requestAsyncId(e, r, o = 0) { return le.setInterval(e.flush.bind(e, this), o); }
    recycleAsyncId(e, r, o = 0) { if (o != null && this.delay === o && this.pending === !1)
        return r; r != null && le.clearInterval(r); }
    execute(e, r) { if (this.closed)
        return new Error("executing a cancelled action"); this.pending = !1; let o = this._execute(e, r); if (o)
        return o; this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null)); }
    _execute(e, r) { let o = !1, n; try {
        this.work(e);
    }
    catch (i) {
        o = !0, n = i || new Error("Scheduled action threw falsy error");
    } if (o)
        return this.unsubscribe(), n; }
    unsubscribe() { if (!this.closed) {
        let { id: e, scheduler: r } = this, { actions: o } = r;
        this.work = this.state = this.scheduler = null, this.pending = !1, T(o, this), e != null && (this.id = this.recycleAsyncId(r, e, null)), this.delay = null, super.unsubscribe();
    } }
};
var we = class extends Je {
    constructor(e, r = Je.now) { super(e, r), this.actions = [], this._active = !1; }
    flush(e) { let { actions: r } = this; if (this._active) {
        r.push(e);
        return;
    } let o; this._active = !0; do
        if (o = e.execute(e.state, e.delay))
            break;
    while (e = r.shift()); if (this._active = !1, o) {
        for (; e = r.shift();)
            e.unsubscribe();
        throw o;
    } }
};
var A = new we(ye), Se = A;
var V = new v(t => t.complete());
function un(t) { return t ? or(t) : V; }
function or(t) { return new v(e => t.schedule(() => e.complete())); }
function F(t, e, r, o = 0, n = !1) { let i = e.schedule(function () { r(), n ? t.add(this.schedule(null, o)) : this.unsubscribe(); }, o); if (t.add(i), !n)
    return i; }
function _e(t, e = 0) { return u((r, o) => { r.subscribe(l(o, n => F(o, t, () => o.next(n), e), () => F(o, t, () => o.complete(), e), n => F(o, t, () => o.error(n), e))); }); }
function ge(t, e = 0) { return u((r, o) => { o.add(t.schedule(() => r.subscribe(o), e)); }); }
import { __asyncValues as sr, __awaiter as mr } from "tslib";
var Ee = (t => t && typeof t.length == "number" && typeof t != "function");
function Oe(t) { return d(t?.then); }
function Ie(t) { return d(t[re]); }
function Fe(t) { return Symbol.asyncIterator && d(t?.[Symbol.asyncIterator]); }
function Ae(t) { return new TypeError(`You provided ${t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`); }
function nr() { return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator; }
var Te = nr();
function Ce(t) { return d(t?.[Te]); }
import { __asyncGenerator as ir, __await as Xe } from "tslib";
function Re(t) { return ir(this, arguments, function* () { let r = t.getReader(); try {
    for (;;) {
        let { value: o, done: n } = yield Xe(r.read());
        if (n)
            return yield Xe(void 0);
        yield yield Xe(o);
    }
}
finally {
    r.releaseLock();
} }); }
function Pe(t) { return d(t?.getReader); }
function p(t) { if (t instanceof v)
    return t; if (t != null) {
    if (Ie(t))
        return ur(t);
    if (Ee(t))
        return lr(t);
    if (Oe(t))
        return cr(t);
    if (Fe(t))
        return vt(t);
    if (Ce(t))
        return fr(t);
    if (Pe(t))
        return pr(t);
} throw Ae(t); }
function ur(t) { return new v(e => { let r = t[re](); if (d(r.subscribe))
    return r.subscribe(e); throw new TypeError("Provided object does not correctly implement Symbol.observable"); }); }
function lr(t) { return new v(e => { for (let r = 0; r < t.length && !e.closed; r++)
    e.next(t[r]); e.complete(); }); }
function cr(t) { return new v(e => { t.then(r => { e.closed || (e.next(r), e.complete()); }, r => e.error(r)).then(null, pe); }); }
function fr(t) { return new v(e => { for (let r of t)
    if (e.next(r), e.closed)
        return; e.complete(); }); }
function vt(t) { return new v(e => { ar(t, e).catch(r => e.error(r)); }); }
function pr(t) { return vt(Re(t)); }
function ar(t, e) { var r, o, n, i; return mr(this, void 0, void 0, function* () { try {
    for (r = sr(t); o = yield r.next(), !o.done;) {
        let s = o.value;
        if (e.next(s), e.closed)
            return;
    }
}
catch (s) {
    n = { error: s };
}
finally {
    try {
        o && !o.done && (i = r.return) && (yield i.call(r));
    }
    finally {
        if (n)
            throw n.error;
    }
} e.complete(); }); }
function yt(t, e) { return p(t).pipe(ge(e), _e(e)); }
function wt(t, e) { return p(t).pipe(ge(e), _e(e)); }
function St(t, e) { return new v(r => { let o = 0; return e.schedule(function () { o === t.length ? r.complete() : (r.next(t[o++]), r.closed || this.schedule()); }); }); }
function _t(t, e) { return new v(r => { let o; return F(r, e, () => { o = t[Te](), F(r, e, () => { let n, i; try {
    ({ value: n, done: i } = o.next());
}
catch (s) {
    r.error(s);
    return;
} i ? r.complete() : r.next(n); }, 0, !0); }), () => d(o?.return) && o.return(); }); }
function ke(t, e) { if (!t)
    throw new Error("Iterable cannot be null"); return new v(r => { F(r, e, () => { let o = t[Symbol.asyncIterator](); F(r, e, () => { o.next().then(n => { n.done ? r.complete() : r.next(n.value); }); }, 0, !0); }); }); }
function gt(t, e) { return ke(Re(t), e); }
function Et(t, e) { if (t != null) {
    if (Ie(t))
        return yt(t, e);
    if (Ee(t))
        return St(t, e);
    if (Oe(t))
        return wt(t, e);
    if (Fe(t))
        return ke(t, e);
    if (Ce(t))
        return _t(t, e);
    if (Pe(t))
        return gt(t, e);
} throw Ae(t); }
function N(t, e) { return e ? Et(t, e) : p(t); }
function je(t) { return t && d(t.schedule); }
function He(t) { return t[t.length - 1]; }
function D(t) { return d(He(t)) ? t.pop() : void 0; }
function C(t) { return je(He(t)) ? t.pop() : void 0; }
function Ot(t, e) { return typeof He(t) == "number" ? t.pop() : e; }
function Me(...t) { let e = C(t); return N(t, e); }
function It(t, e) { let r = d(t) ? t : () => t, o = n => n.error(r()); return new v(e ? n => e.schedule(o, 0, n) : o); }
var dr = (function (t) { return t.NEXT = "N", t.ERROR = "E", t.COMPLETE = "C", t; })(dr || {}), Y = class t {
    constructor(e, r, o) { this.kind = e, this.value = r, this.error = o, this.hasValue = e === "N"; }
    observe(e) { return Qe(this, e); }
    do(e, r, o) { let { kind: n, value: i, error: s } = this; return n === "N" ? e?.(i) : n === "E" ? r?.(s) : o?.(); }
    accept(e, r, o) { var n; return d((n = e) === null || n === void 0 ? void 0 : n.next) ? this.observe(e) : this.do(e, r, o); }
    toObservable() { let { kind: e, value: r, error: o } = this, n = e === "N" ? Me(r) : e === "E" ? It(() => o) : e === "C" ? V : 0; if (!n)
        throw new TypeError(`Unexpected notification kind ${e}`); return n; }
    static createNext(e) { return new t("N", e); }
    static createError(e) { return new t("E", void 0, e); }
    static createComplete() { return t.completeNotification; }
};
Y.completeNotification = new Y("C");
function Qe(t, e) { var r, o, n; let { kind: i, value: s, error: c } = t; if (typeof i != "string")
    throw new TypeError('Invalid notification, missing "kind"'); i === "N" ? (r = e.next) === null || r === void 0 || r.call(e, s) : i === "E" ? (o = e.error) === null || o === void 0 || o.call(e, c) : (n = e.complete) === null || n === void 0 || n.call(e); }
var q = P(t => function () { t(this), this.name = "EmptyError", this.message = "no elements in sequence"; });
var et = P(t => function () { t(this), this.name = "ArgumentOutOfRangeError", this.message = "argument out of range"; });
var Ft = P(t => function (r) { t(this), this.name = "NotFoundError", this.message = r; });
var At = P(t => function (r) { t(this), this.name = "SequenceError", this.message = r; });
function ne(t) { return t instanceof Date && !isNaN(t); }
var hr = P(t => function (r = null) { t(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = r; });
function Tt(t, e) { let { first: r, each: o, with: n = br, scheduler: i = e ?? A, meta: s = null } = ne(t) ? { first: t } : typeof t == "number" ? { each: t } : t; if (r == null && o == null)
    throw new TypeError("No timeout provided."); return u((c, m) => { let f, a, x = null, w = 0, E = b => { a = F(m, i, () => { try {
    f.unsubscribe(), p(n({ meta: s, lastValue: x, seen: w })).subscribe(m);
}
catch (h) {
    m.error(h);
} }, b); }; f = c.subscribe(l(m, b => { a?.unsubscribe(), w++, m.next(x = b), o > 0 && E(o); }, void 0, void 0, () => { a?.closed || a?.unsubscribe(), x = null; })), !w && E(r != null ? typeof r == "number" ? r : +r - i.now() : o); }); }
function br(t) { throw new hr(t); }
function k(t, e) { return u((r, o) => { let n = 0; r.subscribe(l(o, i => { o.next(t.call(e, i, n++)); })); }); }
var { isArray: xr } = Array, { getPrototypeOf: vr, prototype: yr, keys: wr } = Object;
function Ct(t) { if (t.length === 1) {
    let e = t[0];
    if (xr(e))
        return { args: e, keys: null };
    if (Sr(e)) {
        let r = wr(e);
        return { args: r.map(o => e[o]), keys: r };
    }
} return { args: t, keys: null }; }
function Sr(t) { return t && typeof t == "object" && vr(t) === yr; }
var { isArray: _r } = Array;
function gr(t, e) { return _r(e) ? t(...e) : t(e); }
function ie(t) { return k(e => gr(t, e)); }
function Rt(t, e) { return t.reduce((r, o, n) => (r[o] = e[n], r), {}); }
function kt(...t) { let e = C(t), r = D(t), { args: o, keys: n } = Ct(t); if (o.length === 0)
    return N([], e); let i = new v(tt(o, e, n ? s => Rt(n, s) : g)); return r ? i.pipe(ie(r)) : i; }
function tt(t, e, r = g) { return o => { Pt(e, () => { let { length: n } = t, i = new Array(n), s = n, c = n; for (let m = 0; m < n; m++)
    Pt(e, () => { let f = N(t[m], e), a = !1; f.subscribe(l(o, x => { i[m] = x, a || (a = !0, c--), c || o.next(r(i.slice())); }, () => { --s || o.complete(); })); }, o); }, o); }; }
function Pt(t, e, r) { t ? F(r, t, e) : e(); }
function se(t, e, r, o, n, i, s, c) { let m = [], f = 0, a = 0, x = !1, w = () => { x && !m.length && !f && e.complete(); }, E = h => f < o ? b(h) : m.push(h), b = h => { i && e.next(h), f++; let y = !1; p(r(h, a++)).subscribe(l(e, O => { n?.(O), i ? E(O) : e.next(O); }, () => { y = !0; }, void 0, () => { if (y)
    try {
        for (f--; m.length && f < o;) {
            let O = m.shift();
            s ? F(e, s, () => b(O)) : b(O);
        }
        w();
    }
    catch (O) {
        e.error(O);
    } })); }; return t.subscribe(l(e, E, () => { x = !0, w(); })), () => { c?.(); }; }
function R(t, e, r = 1 / 0) { return d(e) ? R((o, n) => k((i, s) => e(o, i, n, s))(p(t(o, n))), r) : (typeof e == "number" && (r = e), u((o, n) => se(o, n, t, r))); }
function Le(t = 1 / 0) { return R(g, t); }
function Ve() { return Le(1); }
function X(...t) { return Ve()(N(t, C(t))); }
function j(t = 0, e, r = Se) { let o = -1; return e != null && (je(e) ? r = e : o = e), new v(n => { let i = ne(t) ? +t - r.now() : t; i < 0 && (i = 0); let s = 0; return r.schedule(function () { n.closed || (n.next(s++), 0 <= o ? this.schedule(void 0, o) : n.complete()); }, i); }); }
function jt(t = 0, e = A) { return t < 0 && (t = 0), j(t, t, e); }
var { isArray: Er } = Array;
function U(t) { return t.length === 1 && Er(t[0]) ? t[0] : t; }
function Mt(...t) { let e = U(t); return new v(r => { let o = 0, n = () => { if (o < e.length) {
    let i;
    try {
        i = p(e[o++]);
    }
    catch {
        n();
        return;
    }
    let s = new Z(r, void 0, _, _);
    i.subscribe(s), s.add(n);
}
else
    r.complete(); }; n(); }); }
function $(t, e) { return u((r, o) => { let n = 0; r.subscribe(l(o, i => t.call(e, i, n++) && o.next(i))); }); }
function am(...t) { return t = U(t), t.length === 1 ? p(t[0]) : new v(rt(t)); }
function rt(t) { return e => { let r = []; for (let o = 0; r && !e.closed && o < t.length; o++)
    r.push(p(t[o]).subscribe(l(e, n => { if (r) {
        for (let i = 0; i < r.length; i++)
            i !== o && r[i].unsubscribe();
        r = null;
    } e.next(n); }))); }; }
function Ne(...t) { let e = D(t), r = U(t); return r.length ? new v(o => { let n = r.map(() => []), i = r.map(() => !1); o.add(() => { n = i = null; }); for (let s = 0; !o.closed && s < r.length; s++)
    p(r[s]).subscribe(l(o, c => { if (n[s].push(c), n.every(m => m.length)) {
        let m = n.map(f => f.shift());
        o.next(e ? e(...m) : m), n.some((f, a) => !f.length && i[a]) && o.complete();
    } }, () => { i[s] = !0, !n[s].length && o.complete(); })); return () => { n = i = null; }; }) : V; }
function Lt(t) { return u((e, r) => { let o = !1, n = null, i = null, s = !1, c = () => { if (i?.unsubscribe(), i = null, o) {
    o = !1;
    let f = n;
    n = null, r.next(f);
} s && r.complete(); }, m = () => { i = null, s && r.complete(); }; e.subscribe(l(r, f => { o = !0, n = f, i || p(t(f)).subscribe(i = l(r, c, m)); }, () => { s = !0, (!o || !i || i.closed) && r.complete(); })); }); }
function Tm(t, e = A) { return Lt(() => j(t, e)); }
function Mm(t) { return u((e, r) => { let o = []; return e.subscribe(l(r, n => o.push(n), () => { r.next(o), r.complete(); })), p(t).subscribe(l(r, () => { let n = o; o = [], r.next(n); }, _)), () => { o = null; }; }); }
function Wm(t, e = null) { return e = e ?? t, u((r, o) => { let n = [], i = 0; r.subscribe(l(o, s => { let c = null; i++ % e === 0 && n.push([]); for (let m of n)
    m.push(s), t <= m.length && (c = c ?? [], c.push(m)); if (c)
    for (let m of c)
        T(n, m), o.next(m); }, () => { for (let s of n)
    o.next(s); o.complete(); }, void 0, () => { n = null; })); }); }
function Zm(t, ...e) { var r, o; let n = (r = C(e)) !== null && r !== void 0 ? r : A, i = (o = e[0]) !== null && o !== void 0 ? o : null, s = e[1] || 1 / 0; return u((c, m) => { let f = [], a = !1, x = b => { let { buffer: h, subs: y } = b; y.unsubscribe(), T(f, b), m.next(h), a && w(); }, w = () => { if (f) {
    let b = new I;
    m.add(b);
    let y = { buffer: [], subs: b };
    f.push(y), F(b, n, () => x(y), t);
} }; i !== null && i >= 0 ? F(m, n, w, i, !0) : a = !0, w(); let E = l(m, b => { let h = f.slice(); for (let y of h) {
    let { buffer: O } = y;
    O.push(b), s <= O.length && x(y);
} }, () => { for (; f?.length;)
    m.next(f.shift().buffer); E?.unsubscribe(), m.complete(), m.unsubscribe(); }, void 0, () => f = null); c.subscribe(E); }); }
function ou(t, e) { return u((r, o) => { let n = []; p(t).subscribe(l(o, i => { let s = []; n.push(s); let c = new I, m = () => { T(n, s), o.next(s), c.unsubscribe(); }; c.add(p(e(i)).subscribe(l(o, m, _))); }, _)), r.subscribe(l(o, i => { for (let s of n)
    s.push(i); }, () => { for (; n.length > 0;)
    o.next(n.shift()); o.complete(); })); }); }
function lu(t) { return u((e, r) => { let o = null, n = null, i = () => { n?.unsubscribe(); let s = o; o = [], s && r.next(s), p(t()).subscribe(n = l(r, i, _)); }; i(), e.subscribe(l(r, s => o?.push(s), () => { o && r.next(o), r.complete(); }, void 0, () => o = n = null)); }); }
function Or(t) { return u((e, r) => { let o = null, n = !1, i; o = e.subscribe(l(r, void 0, void 0, s => { i = p(t(s, Or(t)(e))), o ? (o.unsubscribe(), o = null, i.subscribe(r)) : n = !0; })), n && (o.unsubscribe(), o = null, i.subscribe(r)); }); }
function Ue(t, e, r, o, n) { return (i, s) => { let c = r, m = e, f = 0; i.subscribe(l(s, a => { let x = f++; m = c ? t(m, a, x) : (c = !0, a), o && s.next(m); }, n && (() => { c && s.next(m), s.complete(); }))); }; }
function G(t, e) { return u(Ue(t, e, arguments.length >= 2, !1, !0)); }
var Ir = (t, e) => (t.push(e), t);
function Vt() { return u((t, e) => { G(Ir, [])(t).subscribe(e); }); }
function We(t, e) { return de(Vt(), R(r => t(r)), e ? ie(e) : g); }
function Nt(t) { return We(kt, t); }
var ku = Nt;
function ot(...t) { let e = D(t); return e ? de(ot(...t), ie(e)) : u((r, o) => { tt([r, ...U(t)])(o); }); }
function Yu(...t) { return ot(...t); }
function nt(t, e) { return d(e) ? R(t, e, 1) : R(t, 1); }
function Ju(t, e) { return d(e) ? nt(() => t, e) : nt(() => t); }
function Ut(...t) { let e = C(t); return u((r, o) => { Ve()(N([r, ...t], e)).subscribe(o); }); }
function nl(...t) { return Ut(...t); }
function Wt(t) { return new v(e => t.subscribe(e)); }
var Fr = { connector: () => new S };
function ze(t, e = Fr) { let { connector: r } = e; return u((o, n) => { let i = r(); p(t(Wt(i))).subscribe(n), n.add(o.subscribe(i)); }); }
function dl(t) { return G((e, r, o) => !t || t(r, o) ? e + 1 : e, 0); }
function wl(t) { return u((e, r) => { let o = !1, n = null, i = null, s = () => { if (i?.unsubscribe(), i = null, o) {
    o = !1;
    let c = n;
    n = null, r.next(c);
} }; e.subscribe(l(r, c => { i?.unsubscribe(), o = !0, n = c, i = l(r, s, _), p(t(c)).subscribe(i); }, () => { s(), r.complete(); }, void 0, () => { n = i = null; })); }); }
function Ol(t, e = A) { return u((r, o) => { let n = null, i = null, s = null, c = () => { if (n) {
    n.unsubscribe(), n = null;
    let f = i;
    i = null, o.next(f);
} }; function m() { let f = s + t, a = e.now(); if (a < f) {
    n = this.schedule(void 0, f - a), o.add(n);
    return;
} c(); } r.subscribe(l(o, f => { i = f, s = e.now(), n || (n = e.schedule(m, t), o.add(n)); }, () => { c(), o.complete(); }, void 0, () => { i = n = null; })); }); }
function me(t) { return u((e, r) => { let o = !1; e.subscribe(l(r, n => { o = !0, r.next(n); }, () => { o || r.next(t), r.complete(); })); }); }
function H(t) { return t <= 0 ? () => V : u((e, r) => { let o = 0; e.subscribe(l(r, n => { ++o <= t && (r.next(n), t <= o && r.complete()); })); }); }
function zt() { return u((t, e) => { t.subscribe(l(e, _)); }); }
function Dt(t) { return k(() => t); }
function it(t, e) { return e ? r => X(e.pipe(H(1), zt()), r.pipe(it(t))) : R((r, o) => p(t(r, o)).pipe(H(1), Dt(r))); }
function Jl(t, e = A) { let r = j(t, e); return it(() => r); }
function tc() { return u((t, e) => { t.subscribe(l(e, r => Qe(r, e))); }); }
function mc(t, e) { return u((r, o) => { let n = new Set; r.subscribe(l(o, i => { let s = t ? t(i) : i; n.has(s) || (n.add(s), o.next(i)); })), e && p(e).subscribe(l(o, () => n.clear(), _)); }); }
function Yt(t, e = g) { return t = t ?? Ar, u((r, o) => { let n, i = !0; r.subscribe(l(o, s => { let c = e(s); (i || !t(n, c)) && (i = !1, n = c, o.next(s)); })); }); }
function Ar(t, e) { return t === e; }
function dc(t, e) { return Yt((r, o) => e ? e(r[t], o[t]) : r[t] === o[t]); }
function ue(t = Tr) { return u((e, r) => { let o = !1; e.subscribe(l(r, n => { o = !0, r.next(n); }, () => o ? r.complete() : r.error(t()))); }); }
function Tr() { return new q; }
function Oc(t, e) { if (t < 0)
    throw new et; let r = arguments.length >= 2; return o => o.pipe($((n, i) => i === t), H(1), r ? me(e) : ue(() => new et)); }
function Tc(...t) { return e => X(e, Me(...t)); }
function kc(t, e) { return u((r, o) => { let n = 0; r.subscribe(l(o, i => { t.call(e, i, n++, r) || (o.next(!1), o.complete()); }, () => { o.next(!0), o.complete(); })); }); }
function st(t, e) { return e ? r => r.pipe(st((o, n) => p(t(o, n)).pipe(k((i, s) => e(o, i, n, s))))) : u((r, o) => { let n = 0, i = null, s = !1; r.subscribe(l(o, c => { i || (i = l(o, void 0, () => { i = null, s && o.complete(); }), p(t(c, n++)).subscribe(i)); }, () => { s = !0, !i && o.complete(); })); }); }
function qt() { return st(g); }
var qc = qt;
function Kc(t, e = 1 / 0, r) { return e = (e || 0) < 1 ? 1 / 0 : e, u((o, n) => se(o, n, t, e, void 0, !0, r)); }
function Xc(t) { return u((e, r) => { try {
    e.subscribe(r);
}
finally {
    r.add(t);
} }); }
function tf(t, e) { return u(mt(t, e, "value")); }
function mt(t, e, r) { let o = r === "index"; return (n, i) => { let s = 0; n.subscribe(l(i, c => { let m = s++; t.call(e, c, m, n) && (i.next(o ? m : c), i.complete()); }, () => { i.next(o ? -1 : void 0), i.complete(); })); }; }
function sf(t, e) { return u(mt(t, e, "index")); }
function df(t, e) { let r = arguments.length >= 2; return o => o.pipe(t ? $((n, i) => t(n, i, o)) : g, H(1), r ? me(e) : ue(() => new q)); }
function Sf(t, e, r, o) { return u((n, i) => { let s; !e || typeof e == "function" ? s = e : { duration: r, element: s, connector: o } = e; let c = new Map, m = b => { c.forEach(b), b(i); }, f = b => m(h => h.error(b)), a = 0, x = !1, w = new Z(i, b => { try {
    let h = t(b), y = c.get(h);
    if (!y) {
        c.set(h, y = o ? o() : new S);
        let O = E(h, y);
        if (i.next(O), r) {
            let M = l(y, () => { y.complete(), M?.unsubscribe(); }, void 0, void 0, () => c.delete(h));
            w.add(p(r(O)).subscribe(M));
        }
    }
    y.next(s ? s(b) : b);
}
catch (h) {
    f(h);
} }, () => m(b => b.complete()), f, () => c.clear(), () => (x = !0, a === 0)); n.subscribe(w); function E(b, h) { let y = new v(O => { a++; let M = h.subscribe(O); return () => { M.unsubscribe(), --a === 0 && x && w.unsubscribe(); }; }); return y.key = b, y; } }); }
function Of() { return u((t, e) => { t.subscribe(l(e, () => { e.next(!1), e.complete(); }, () => { e.next(!0), e.complete(); })); }); }
function $t(t) { return t <= 0 ? () => V : u((e, r) => { let o = []; e.subscribe(l(r, n => { o.push(n), t < o.length && o.shift(); }, () => { for (let n of o)
    r.next(n); r.complete(); }, void 0, () => { o = null; })); }); }
function Vf(t, e) { let r = arguments.length >= 2; return o => o.pipe(t ? $((n, i) => t(n, i, o)) : g, $t(1), r ? me(e) : ue(() => new q)); }
function Df() { return u((t, e) => { t.subscribe(l(e, r => { e.next(Y.createNext(r)); }, () => { e.next(Y.createComplete()), e.complete(); }, r => { e.next(Y.createError(r)), e.complete(); })); }); }
function Gf(t) { return G(d(t) ? (e, r) => t(e, r) > 0 ? e : r : (e, r) => e > r ? e : r); }
var Zf = R;
function Qf(t, e, r = 1 / 0) { return d(e) ? R(() => t, e, r) : (typeof e == "number" && (r = e), R(() => t, r)); }
function op(t, e, r = 1 / 0) { return u((o, n) => { let i = e; return se(o, n, (s, c) => t(i, s, c), r, s => { i = s; }, !1, void 0, () => i = null); }); }
function Gt(...t) { let e = C(t), r = Ot(t, 1 / 0); return u((o, n) => { Le(r)(N([o, ...t], e)).subscribe(n); }); }
function fp(...t) { return Gt(...t); }
function hp(t) { return G(d(t) ? (e, r) => t(e, r) < 0 ? e : r : (e, r) => e < r ? e : r); }
function De(t, e) { let r = d(t) ? t : () => t; return d(e) ? ze(e, { connector: r }) : o => new z(o, r); }
function Cr(...t) { let e = U(t); return r => Mt(r, ...e); }
var gp = Cr;
function Fp() { return u((t, e) => { let r, o = !1; t.subscribe(l(e, n => { let i = r; r = n, o && e.next([i, n]), o = !0; })); }); }
function Cp(...t) { let e = t.length; if (e === 0)
    throw new Error("list of properties cannot be empty."); return k(r => { let o = r; for (let n = 0; n < e; n++) {
    let i = o?.[t[n]];
    if (typeof i < "u")
        o = i;
    else
        return;
} return o; }); }
function Mp(t) { return t ? e => ze(t)(e) : e => De(new S)(e); }
function Up(t) { return e => { let r = new be(t); return new z(e, () => r); }; }
function Yp() { return t => { let e = new xe; return new z(t, () => e); }; }
function Kp(t, e, r, o) { r && !d(r) && (o = r); let n = d(r) ? r : void 0; return i => De(new oe(t, e, o), n)(i); }
function Qp(...t) { return t.length ? u((e, r) => { rt([e, ...t])(r); }) : g; }
function sa(t) { let e = 1 / 0, r; return t != null && (typeof t == "object" ? { count: e = 1 / 0, delay: r } = t : e = t), e <= 0 ? () => V : u((o, n) => { let i = 0, s, c = () => { if (s?.unsubscribe(), s = null, r != null) {
    let f = typeof r == "number" ? j(r) : p(r(i)), a = l(n, () => { a.unsubscribe(), m(); });
    f.subscribe(a);
}
else
    m(); }, m = () => { let f = !1; s = o.subscribe(l(n, void 0, () => { ++i < e ? s ? c() : f = !0 : n.complete(); })), f && c(); }; m(); }); }
function pa(t) { return u((e, r) => { let o, n = !1, i, s = !1, c = !1, m = () => c && s && (r.complete(), !0), f = () => (i || (i = new S, p(t(i)).subscribe(l(r, () => { o ? a() : n = !0; }, () => { s = !0, m(); }))), i), a = () => { c = !1, o = e.subscribe(l(r, void 0, () => { c = !0, !m() && f().next(); })), n && (o.unsubscribe(), o = null, n = !1, a()); }; a(); }); }
function ya(t = 1 / 0) { let e; t && typeof t == "object" ? e = t : e = { count: t }; let { count: r = 1 / 0, delay: o, resetOnSuccess: n = !1 } = e; return r <= 0 ? g : u((i, s) => { let c = 0, m, f = () => { let a = !1; m = i.subscribe(l(s, x => { n && (c = 0), s.next(x); }, void 0, x => { if (c++ < r) {
    let w = () => { m ? (m.unsubscribe(), m = null, f()) : a = !0; };
    if (o != null) {
        let E = typeof o == "number" ? j(o) : p(o(x, c)), b = l(s, () => { b.unsubscribe(), w(); }, () => { s.complete(); });
        E.subscribe(b);
    }
    else
        w();
}
else
    s.error(x); })), a && (m.unsubscribe(), m = null, f()); }; f(); }); }
function Oa(t) { return u((e, r) => { let o, n = !1, i, s = () => { o = e.subscribe(l(r, void 0, void 0, c => { i || (i = new S, p(t(i)).subscribe(l(r, () => o ? s() : n = !0))), i && i.next(c); })), n && (o.unsubscribe(), o = null, n = !1, s()); }; s(); }); }
function Bt(t) { return u((e, r) => { let o = !1, n = null; e.subscribe(l(r, i => { o = !0, n = i; })), p(t).subscribe(l(r, () => { if (o) {
    o = !1;
    let i = n;
    n = null, r.next(i);
} }, _)); }); }
function Ma(t, e = A) { return Bt(jt(t, e)); }
function Ua(t, e) { return u(Ue(t, e, arguments.length >= 2, !0)); }
function qa(t, e = (r, o) => r === o) { return u((r, o) => { let n = Kt(), i = Kt(), s = m => { o.next(m), o.complete(); }, c = (m, f) => { let a = l(o, x => { let { buffer: w, complete: E } = f; w.length === 0 ? E ? s(!1) : m.buffer.push(x) : !e(x, w.shift()) && s(!1); }, () => { m.complete = !0; let { complete: x, buffer: w } = f; x && s(w.length === 0), a?.unsubscribe(); }); return a; }; r.subscribe(c(n, i)), p(t).subscribe(c(i, n)); }); }
function Kt() { return { buffer: [], complete: !1 }; }
function Zt(t = {}) { let { connector: e = () => new S, resetOnError: r = !0, resetOnComplete: o = !0, resetOnRefCountZero: n = !0 } = t; return i => { let s, c, m, f = 0, a = !1, x = !1, w = () => { c?.unsubscribe(), c = void 0; }, E = () => { w(), s = m = void 0, a = x = !1; }, b = () => { let h = s; E(), h?.unsubscribe(); }; return u((h, y) => { f++, !x && !a && w(); let O = m = m ?? e(); y.add(() => { f--, f === 0 && !x && !a && (c = ut(b, n)); }), O.subscribe(y), !s && f > 0 && (s = new W({ next: M => O.next(M), error: M => { x = !0, w(), c = ut(E, r, M), O.error(M); }, complete: () => { a = !0, w(), c = ut(E, o), O.complete(); } }), p(h).subscribe(s)); })(i); }; }
function ut(t, e, ...r) { if (e === !0) {
    t();
    return;
} if (e === !1)
    return; let o = new W({ next: () => { o.unsubscribe(), t(); } }); return p(e(...r)).subscribe(o); }
function Qa(t, e, r) { let o, n = !1; return t && typeof t == "object" ? { bufferSize: o = 1 / 0, windowTime: e = 1 / 0, refCount: n = !1, scheduler: r } = t : o = t ?? 1 / 0, Zt({ connector: () => new oe(o, e, r), resetOnError: !0, resetOnComplete: !1, resetOnRefCountZero: n }); }
function sd(t) { return u((e, r) => { let o = !1, n, i = !1, s = 0; e.subscribe(l(r, c => { i = !0, (!t || t(c, s++, e)) && (o && r.error(new At("Too many matching values")), o = !0, n = c); }, () => { o ? (r.next(n), r.complete()) : r.error(i ? new Ft("No matching values") : new q); })); }); }
function ld(t) { return $((e, r) => t <= r); }
function dd(t) { return t <= 0 ? g : u((e, r) => { let o = new Array(t), n = 0; return e.subscribe(l(r, i => { let s = n++; if (s < t)
    o[s] = i;
else {
    let c = s % t, m = o[c];
    o[c] = i, r.next(m);
} })), () => { o = null; }; }); }
function wd(t) { return u((e, r) => { let o = !1, n = l(r, () => { n?.unsubscribe(), o = !0; }, _); p(t).subscribe(n), e.subscribe(l(r, i => o && r.next(i))); }); }
function Ed(t) { return u((e, r) => { let o = !1, n = 0; e.subscribe(l(r, i => (o || (o = !t(i, n++))) && r.next(i))); }); }
function Td(...t) { let e = C(t); return u((r, o) => { (e ? X(t, r, e) : X(t, r)).subscribe(o); }); }
function Q(t, e) { return u((r, o) => { let n = null, i = 0, s = !1, c = () => s && !n && o.complete(); r.subscribe(l(o, m => { n?.unsubscribe(); let f = 0, a = i++; p(t(m, a)).subscribe(n = l(o, x => o.next(e ? e(m, x, a, f++) : x), () => { n = null, c(); })); }, () => { s = !0, c(); })); }); }
function Vd() { return Q(g); }
function zd(t, e) { return d(e) ? Q(() => t, e) : Q(() => t); }
function $d(t, e) { return u((r, o) => { let n = e; return Q((i, s) => t(n, i, s), (i, s) => (n = s, s))(r).subscribe(o), () => { n = null; }; }); }
function Xd(t) { return u((e, r) => { p(t).subscribe(l(r, () => r.complete(), _)), !r.closed && e.subscribe(r); }); }
function th(t, e = !1) { return u((r, o) => { let n = 0; r.subscribe(l(o, i => { let s = t(i, n++); (s || e) && o.next(i), !s && o.complete(); })); }); }
function mh(t, e, r) { let o = d(t) || e || r ? { next: t, error: e, complete: r } : t; return o ? u((n, i) => { var s; (s = o.subscribe) === null || s === void 0 || s.call(o); let c = !0; n.subscribe(l(i, m => { var f; (f = o.next) === null || f === void 0 || f.call(o, m), i.next(m); }, () => { var m; c = !1, (m = o.complete) === null || m === void 0 || m.call(o), i.complete(); }, m => { var f; c = !1, (f = o.error) === null || f === void 0 || f.call(o, m), i.error(m); }, () => { var m, f; c && ((m = o.unsubscribe) === null || m === void 0 || m.call(o)), (f = o.finalize) === null || f === void 0 || f.call(o); })); }) : g; }
function Jt(t, e) { return u((r, o) => { let { leading: n = !0, trailing: i = !1 } = e ?? {}, s = !1, c = null, m = null, f = !1, a = () => { m?.unsubscribe(), m = null, i && (E(), f && o.complete()); }, x = () => { m = null, f && o.complete(); }, w = b => m = p(t(b)).subscribe(l(o, a, x)), E = () => { if (s) {
    s = !1;
    let b = c;
    c = null, o.next(b), !f && w(b);
} }; r.subscribe(l(o, b => { s = !0, c = b, !(m && !m.closed) && (n ? E() : w(b)); }, () => { f = !0, !(i && s && m && !m.closed) && o.complete(); })); }); }
function bh(t, e = A, r) { let o = j(t, e); return Jt(() => o, r); }
function Sh(t = A) { return u((e, r) => { let o = t.now(); e.subscribe(l(r, n => { let i = t.now(), s = i - o; o = i, r.next(new lt(n, s)); })); }); }
var lt = class {
    constructor(e, r) { this.value = e, this.interval = r; }
};
function Ih(t, e, r) { let o, n, i; if (r = r ?? Se, ne(t) ? o = t : typeof t == "number" && (n = t), e)
    i = () => e;
else
    throw new TypeError("No observable provided to switch to"); if (o == null && n == null)
    throw new TypeError("No timeout provided."); return Tt({ first: o, each: n, scheduler: r, with: i }); }
function Ch(t = J) { return k(e => ({ value: e, timestamp: t.now() })); }
function Vh(t) { return u((e, r) => { let o = new S; r.next(o.asObservable()); let n = i => { o.error(i), r.error(i); }; return e.subscribe(l(r, i => o?.next(i), () => { o.complete(), r.complete(); }, n)), p(t).subscribe(l(r, () => { o.complete(), r.next(o = new S); }, _, n)), () => { o?.unsubscribe(), o = null; }; }); }
function Dh(t, e = 0) { let r = e > 0 ? e : t; return u((o, n) => { let i = [new S], s = [], c = 0; n.next(i[0].asObservable()), o.subscribe(l(n, m => { for (let a of i)
    a.next(m); let f = c - t + 1; if (f >= 0 && f % r === 0 && i.shift().complete(), ++c % r === 0) {
    let a = new S;
    i.push(a), n.next(a.asObservable());
} }, () => { for (; i.length > 0;)
    i.shift().complete(); n.complete(); }, m => { for (; i.length > 0;)
    i.shift().error(m); n.error(m); }, () => { s = null, i = null; })); }); }
function Hh(t, ...e) { var r, o; let n = (r = C(e)) !== null && r !== void 0 ? r : A, i = (o = e[0]) !== null && o !== void 0 ? o : null, s = e[1] || 1 / 0; return u((c, m) => { let f = [], a = !1, x = h => { let { window: y, subs: O } = h; y.complete(), O.unsubscribe(), T(f, h), a && w(); }, w = () => { if (f) {
    let h = new I;
    m.add(h);
    let y = new S, O = { window: y, subs: h, seen: 0 };
    f.push(O), m.next(y.asObservable()), F(h, n, () => x(O), t);
} }; i !== null && i >= 0 ? F(m, n, w, i, !0) : a = !0, w(); let E = h => f.slice().forEach(h), b = h => { E(({ window: y }) => h(y)), h(m), m.unsubscribe(); }; return c.subscribe(l(m, h => { E(y => { y.window.next(h), s <= ++y.seen && x(y); }); }, () => b(h => h.complete()), h => b(y => y.error(h)))), () => { f = null; }; }); }
function mb(t, e) { return u((r, o) => { let n = [], i = s => { for (; 0 < n.length;)
    n.shift().error(s); o.error(s); }; p(t).subscribe(l(o, s => { let c = new S; n.push(c); let m = new I, f = () => { T(n, c), c.complete(), m.unsubscribe(); }, a; try {
    a = p(e(s));
}
catch (x) {
    i(x);
    return;
} o.next(c.asObservable()), m.add(a.subscribe(l(o, f, _, i))); }, _)), r.subscribe(l(o, s => { let c = n.slice(); for (let m of c)
    m.next(s); }, () => { for (; 0 < n.length;)
    n.shift().complete(); o.complete(); }, i, () => { for (; 0 < n.length;)
    n.shift().unsubscribe(); })); }); }
function ab(t) { return u((e, r) => { let o, n, i = c => { o.error(c), r.error(c); }, s = () => { n?.unsubscribe(), o?.complete(), o = new S, r.next(o.asObservable()); let c; try {
    c = p(t());
}
catch (m) {
    i(m);
    return;
} c.subscribe(n = l(r, s, s, i)); }; s(), e.subscribe(l(r, c => o.next(c), () => { o.complete(), r.complete(); }, i, () => { n?.unsubscribe(), o = null; })); }); }
function Sb(...t) { let e = D(t); return u((r, o) => { let n = t.length, i = new Array(n), s = t.map(() => !1), c = !1; for (let m = 0; m < n; m++)
    p(t[m]).subscribe(l(o, f => { i[m] = f, !c && !s[m] && (s[m] = !0, (c = s.every(g)) && (s = null)); }, _)); r.subscribe(l(o, m => { if (c) {
    let f = [m, ...i];
    o.next(e ? e(...f) : f);
} })); }); }
function Ob(t) { return We(Ne, t); }
function Xt(...t) { return u((e, r) => { Ne(e, ...t).subscribe(r); }); }
function Rb(...t) { return Xt(...t); }
function kb(t, e) { return (r, o) => !t.call(e, r, o); }
export { d as a, ce as b, I as c, L as d, _ as e, K as f, W as g, re as h, g as i, de as j, v as k, l, bt as m, z as n, xt as o, S as p, be as q, oe as r, xe as s, ye as t, Je as u, we as v, A as w, Se as x, V as y, un as z, je as A, D as B, C, Ot as D, Ee as E, p as F, _e as G, ge as H, _t as I, Et as J, N as K, Me as L, It as M, dr as N, Y as O, q as P, et as Q, Ft as R, At as S, hr as T, Tt as U, k as V, ie as W, Ct as X, Rt as Y, kt as Z, R as _, Le as $, Ve as aa, X as ba, j as ca, jt as da, U as ea, Mt as fa, kb as ga, $ as ha, am as ia, Ne as ja, Lt as ka, Tm as la, Mm as ma, Wm as na, Zm as oa, ou as pa, lu as qa, Or as ra, G as sa, Vt as ta, Nt as ua, ku as va, ot as wa, Yu as xa, nt as ya, Ju as za, Ut as Aa, nl as Ba, ze as Ca, dl as Da, wl as Ea, Ol as Fa, me as Ga, H as Ha, zt as Ia, Dt as Ja, it as Ka, Jl as La, tc as Ma, mc as Na, Yt as Oa, dc as Pa, ue as Qa, Oc as Ra, Tc as Sa, kc as Ta, st as Ua, qt as Va, qc as Wa, Kc as Xa, Xc as Ya, tf as Za, sf as _a, df as $a, Sf as ab, Of as bb, $t as cb, Vf as db, Df as eb, Gf as fb, Zf as gb, Qf as hb, op as ib, Gt as jb, fp as kb, hp as lb, De as mb, Cr as nb, gp as ob, Fp as pb, Cp as qb, Mp as rb, Up as sb, Yp as tb, Kp as ub, Qp as vb, sa as wb, pa as xb, ya as yb, Oa as zb, Bt as Ab, Ma as Bb, Ua as Cb, qa as Db, Zt as Eb, Qa as Fb, sd as Gb, ld as Hb, dd as Ib, wd as Jb, Ed as Kb, Td as Lb, Q as Mb, Vd as Nb, zd as Ob, $d as Pb, Xd as Qb, th as Rb, mh as Sb, Jt as Tb, bh as Ub, Sh as Vb, Ih as Wb, Ch as Xb, Vh as Yb, Dh as Zb, Hh as _b, mb as $b, ab as ac, Sb as bc, Ob as cc, Xt as dc, Rb as ec };
