var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DomHelpers;
(function (DomHelpers) {
    /**
     * Creates and returns a blob from a data URL (either base64 encoded or not).
     * https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
     *
     * @param {string} dataURL The data URL to convert.
     * @return {Blob} A blob representing the array buffer data.
     */
    function dataURLToBlob(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    }
    DomHelpers.dataURLToBlob = dataURLToBlob;
    function initErrorHandler(logger) {
        window.onerror = function (msg, file, line, col, error) {
            try {
                var callback = function (stackframes) {
                    try {
                        var data = {
                            message: msg,
                            file: file,
                            line: line,
                            col: col,
                            stack: stackframes
                        };
                        logger(data);
                    }
                    catch (err) {
                        console.error("Failed to log error", err);
                    }
                };
                var errback = function (err) {
                    console.error("Failed to log error", err);
                };
                if (typeof error === "string") {
                    error = new Error(error);
                }
                var asError = typeof error === "string"
                    ? new Error(error)
                    : error;
                var stack = StackTrace.fromError(asError)
                    .then(callback)
                    .catch(errback);
            }
            catch (ex) {
                console.error("failed to log error", ex);
            }
        };
    }
    DomHelpers.initErrorHandler = initErrorHandler;
    DomHelpers.KeyCodes = {
        BackSpace: 8,
        Tab: 9,
        Enter: 13,
        Shift: 16,
        Ctrl: 17,
        Alt: 18,
        PauseBreak: 19,
        CapsLock: 20,
        Esc: 27,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        ArrowLeft: 37,
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        Insert: 45,
        Delete: 46,
        Digit0: 48,
        Digit1: 49,
        Digit2: 50,
        Digit3: 51,
        Digit4: 52,
        Digit5: 53,
        Digit6: 54,
        Digit7: 55,
        Digit8: 56,
        Digit9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        WindowLeft: 91,
        WindowRight: 92,
        SelectKey: 93,
        Numpad0: 96,
        Numpad1: 97,
        Numpad2: 98,
        Numpad3: 99,
        Numpad4: 100,
        Numpad5: 101,
        Numpad6: 102,
        Numpad7: 103,
        Numpad8: 104,
        Numpad9: 105,
        Multiply: 106,
        Add: 107,
        Subtract: 109,
        DecimalPoint: 110,
        Divide: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NumLock: 144,
        ScrollLock: 145,
        SemiColon: 186,
        Equal: 187,
        Comma: 188,
        Dash: 189,
        Period: 190,
        ForwardSlash: 191,
        GraveAccent: 192,
        BracketOpen: 219,
        BackSlash: 220,
        BracketClose: 221,
        SingleQuote: 222
    };
})(DomHelpers || (DomHelpers = {}));
var FontHelpers;
(function (FontHelpers) {
    function getCssStyle(family, variant, size) {
        var style = { fontFamily: family };
        if (variant && variant.indexOf("italic") >= 0) {
            style.fontStyle = "italic";
        }
        var numeric = variant && variant.replace(/[^\d]/g, "");
        if (numeric && numeric.length) {
            style.fontWeight = numeric.toString();
        }
        if (size) {
            style.fontSize = size;
        }
        return style;
    }
    FontHelpers.getCssStyle = getCssStyle;
    function getStyleString(family, variant, size) {
        var styleObj = getCssStyle(family, variant, size);
        var parts = [];
        if (styleObj.fontFamily) {
            parts.push("font-family:'" + styleObj.fontFamily + "'");
        }
        if (styleObj.fontWeight) {
            parts.push("font-weight:" + styleObj.fontWeight);
        }
        if (styleObj.fontStyle) {
            parts.push("font-style:" + styleObj.fontStyle);
        }
        if (styleObj.fontSize) {
            parts.push("font-size:" + styleObj.fontSize);
        }
        return parts.join("; ");
    }
    FontHelpers.getStyleString = getStyleString;
})(FontHelpers || (FontHelpers = {}));
function logtap(message, stream) {
    return stream.tap(function (t) { return console.log(message, t); });
}
function newid() {
    return (new Date().getTime() + Math.random())
        .toString(36).replace('.', '');
}
var TypedChannel;
(function (TypedChannel) {
    var ChannelTopic = (function () {
        function ChannelTopic(channel, type) {
            this.channel = channel;
            this.type = type;
        }
        ChannelTopic.prototype.subscribe = function (observer) {
            this.observe().subscribe(observer);
        };
        ChannelTopic.prototype.sub = function (observer) {
            this.observe().subscribe(function (m) { return observer(m.data); });
        };
        ChannelTopic.prototype.dispatch = function (data) {
            this.channel.onNext({
                type: this.type,
                data: data
            });
        };
        ChannelTopic.prototype.observe = function () {
            var _this = this;
            return this.channel.filter(function (m) { return m.type === _this.type; });
        };
        ChannelTopic.prototype.observeData = function () {
            return this.observe().map(function (m) { return m.data; });
        };
        ChannelTopic.prototype.forward = function (channel) {
            this.subscribe(function (m) { return channel.dispatch(m.data); });
        };
        return ChannelTopic;
    }());
    TypedChannel.ChannelTopic = ChannelTopic;
    var Channel = (function () {
        function Channel(subject, type) {
            this.subject = subject || new Rx.Subject();
            this.type = type;
        }
        Channel.prototype.subscribe = function (onNext) {
            return this.subject.subscribe(onNext);
        };
        Channel.prototype.observe = function () {
            return this.subject.asObservable();
        };
        Channel.prototype.topic = function (type) {
            return new ChannelTopic(this.subject, this.type ? this.type + '.' + type : type);
        };
        Channel.prototype.mergeTyped = function () {
            var topics = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                topics[_i - 0] = arguments[_i];
            }
            var types = topics.map(function (t) { return t.type; });
            return this.subject.filter(function (m) { return types.indexOf(m.type) >= 0; });
        };
        Channel.prototype.merge = function () {
            var topics = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                topics[_i - 0] = arguments[_i];
            }
            var types = topics.map(function (t) { return t.type; });
            return this.subject.filter(function (m) { return types.indexOf(m.type) >= 0; });
        };
        return Channel;
    }());
    TypedChannel.Channel = Channel;
})(TypedChannel || (TypedChannel = {}));
var ObservableEvent = (function () {
    function ObservableEvent() {
        this._subscribers = [];
    }
    /**
     * Subscribe for notification. Returns unsubscribe function.
     */
    ObservableEvent.prototype.subscribe = function (handler) {
        var _this = this;
        if (this._subscribers.indexOf(handler) < 0) {
            this._subscribers.push(handler);
        }
        return function () { return _this.unsubscribe(handler); };
    };
    ObservableEvent.prototype.unsubscribe = function (callback) {
        var index = this._subscribers.indexOf(callback, 0);
        if (index > -1) {
            this._subscribers.splice(index, 1);
        }
    };
    ObservableEvent.prototype.observe = function () {
        var _this = this;
        var unsub;
        return Rx.Observable.fromEventPattern(function (handlerToAdd) { return _this.subscribe(handlerToAdd); }, function (handlerToRemove) { return _this.unsubscribe(handlerToRemove); });
    };
    /**
     * Subscribe for one notification.
     */
    ObservableEvent.prototype.subscribeOne = function (callback) {
        var unsub = this.subscribe(function (t) {
            unsub();
            callback(t);
        });
    };
    ObservableEvent.prototype.notify = function (eventArg) {
        for (var _i = 0, _a = this._subscribers; _i < _a.length; _i++) {
            var subscriber = _a[_i];
            subscriber.call(this, eventArg);
        }
    };
    /**
     * Removes all subscribers.
     */
    ObservableEvent.prototype.clear = function () {
        this._subscribers.length = 0;
    };
    return ObservableEvent;
}());
var BootScript;
(function (BootScript) {
    function dropdown(args) {
        return h("div.dropdown", [
            h("button.btn.btn-default.dropdown-toggle", {
                "attrs": {
                    id: args.id,
                    type: "button",
                    "data-toggle": "dropdown",
                    className: "btn btn-default dropdown-toggle"
                },
            }, [
                args.content,
                h("span.caret")
            ]),
            h("ul.dropdown-menu", {}, args.items.map(function (item) {
                return h("li", {}, [
                    h('a', item.options || {}, [item.content])
                ]);
            }))
        ]);
    }
    BootScript.dropdown = dropdown;
})(BootScript || (BootScript = {}));
var PaperNotify;
(function (PaperNotify) {
    (function (ChangeFlag) {
        // Anything affecting the appearance of an item, including GEOMETRY,
        // STROKE, STYLE and ATTRIBUTE (except for the invisible ones: locked, name)
        ChangeFlag[ChangeFlag["APPEARANCE"] = 1] = "APPEARANCE";
        // A change in the item's children
        ChangeFlag[ChangeFlag["CHILDREN"] = 2] = "CHILDREN";
        // A change of the item's place in the scene graph (removed, inserted,
        // moved).
        ChangeFlag[ChangeFlag["INSERTION"] = 4] = "INSERTION";
        // Item geometry (path, bounds)
        ChangeFlag[ChangeFlag["GEOMETRY"] = 8] = "GEOMETRY";
        // Only segment(s) have changed, and affected curves have already been
        // notified. This is to implement an optimization in _changed() calls.
        ChangeFlag[ChangeFlag["SEGMENTS"] = 16] = "SEGMENTS";
        // Stroke geometry (excluding color)
        ChangeFlag[ChangeFlag["STROKE"] = 32] = "STROKE";
        // Fill style or stroke color / dash
        ChangeFlag[ChangeFlag["STYLE"] = 64] = "STYLE";
        // Item attributes: visible, blendMode, locked, name, opacity, clipMask ...
        ChangeFlag[ChangeFlag["ATTRIBUTE"] = 128] = "ATTRIBUTE";
        // Text content
        ChangeFlag[ChangeFlag["CONTENT"] = 256] = "CONTENT";
        // Raster pixels
        ChangeFlag[ChangeFlag["PIXELS"] = 512] = "PIXELS";
        // Clipping in one of the child items
        ChangeFlag[ChangeFlag["CLIPPING"] = 1024] = "CLIPPING";
        // The view has been transformed
        ChangeFlag[ChangeFlag["VIEW"] = 2048] = "VIEW";
    })(PaperNotify.ChangeFlag || (PaperNotify.ChangeFlag = {}));
    var ChangeFlag = PaperNotify.ChangeFlag;
    // Shortcuts to often used ChangeFlag values including APPEARANCE
    (function (Changes) {
        // CHILDREN also changes GEOMETRY, since removing children from groups
        // changes bounds.
        Changes[Changes["CHILDREN"] = 11] = "CHILDREN";
        // Changing the insertion can change the appearance through parent's matrix.
        Changes[Changes["INSERTION"] = 5] = "INSERTION";
        Changes[Changes["GEOMETRY"] = 9] = "GEOMETRY";
        Changes[Changes["SEGMENTS"] = 25] = "SEGMENTS";
        Changes[Changes["STROKE"] = 97] = "STROKE";
        Changes[Changes["STYLE"] = 65] = "STYLE";
        Changes[Changes["ATTRIBUTE"] = 129] = "ATTRIBUTE";
        Changes[Changes["CONTENT"] = 265] = "CONTENT";
        Changes[Changes["PIXELS"] = 513] = "PIXELS";
        Changes[Changes["VIEW"] = 2049] = "VIEW";
    })(PaperNotify.Changes || (PaperNotify.Changes = {}));
    var Changes = PaperNotify.Changes;
    ;
    function initialize() {
        // Inject Item.subscribe
        var itemProto = paper.Item.prototype;
        itemProto.subscribe = function (handler) {
            var _this = this;
            if (!this._subscribers) {
                this._subscribers = [];
            }
            if (this._subscribers.indexOf(handler) < 0) {
                this._subscribers.push(handler);
            }
            return function () {
                var index = _this._subscribers.indexOf(handler, 0);
                if (index > -1) {
                    _this._subscribers.splice(index, 1);
                }
            };
        };
        // Wrap Item.remove
        var itemRemove = itemProto.remove;
        itemProto.remove = function () {
            itemRemove.apply(this, arguments);
            this._subscribers = null;
        };
        // Wrap Project._changed
        var projectProto = paper.Project.prototype;
        var projectChanged = projectProto._changed;
        projectProto._changed = function (flags, item) {
            projectChanged.apply(this, arguments);
            if (item) {
                var subs = item._subscribers;
                if (subs) {
                    for (var _i = 0, subs_1 = subs; _i < subs_1.length; _i++) {
                        var s = subs_1[_i];
                        s.call(item, flags);
                    }
                }
            }
        };
    }
    PaperNotify.initialize = initialize;
    function describe(flags) {
        var flagList = [];
        _.forOwn(ChangeFlag, function (value, key) {
            if ((typeof value) === "number" && (value & flags)) {
                flagList.push(key);
            }
        });
        return flagList.join(' | ');
    }
    PaperNotify.describe = describe;
    function observe(item, flags) {
        var unsub;
        return Rx.Observable.fromEventPattern(function (addHandler) {
            unsub = item.subscribe(function (f) {
                if (f & flags) {
                    addHandler(f);
                }
            });
        }, function (removeHandler) {
            if (unsub) {
                unsub();
            }
        });
    }
    PaperNotify.observe = observe;
})(PaperNotify || (PaperNotify = {}));
PaperNotify.initialize();
var paperExt;
(function (paperExt) {
    var ViewZoom = (function () {
        function ViewZoom(project) {
            var _this = this;
            this.factor = 1.25;
            this._viewChanged = new ObservableEvent();
            this.project = project;
            var view = this.project.view;
            $(view.element).mousewheel(function (event) {
                var mousePosition = new paper.Point(event.offsetX, event.offsetY);
                _this.changeZoomCentered(event.deltaY, mousePosition);
            });
            var didDrag = false;
            view.on(paper.EventType.mouseDrag, function (ev) {
                var hit = project.hitTest(ev.point);
                if (!_this._viewCenterStart) {
                    if (hit) {
                        // don't start dragging
                        return;
                    }
                    _this._viewCenterStart = view.center;
                    // Have to use native mouse offset, because ev.delta 
                    //  changes as the view is scrolled.
                    _this._mouseNativeStart = new paper.Point(ev.event.offsetX, ev.event.offsetY);
                    view.emit(paperExt.EventType.mouseDragStart, ev);
                }
                else {
                    var nativeDelta = new paper.Point(ev.event.offsetX - _this._mouseNativeStart.x, ev.event.offsetY - _this._mouseNativeStart.y);
                    // Move into view coordinates to subract delta,
                    //  then back into project coords.
                    view.center = view.viewToProject(view.projectToView(_this._viewCenterStart)
                        .subtract(nativeDelta));
                    didDrag = true;
                }
            });
            view.on(paper.EventType.mouseUp, function (ev) {
                if (_this._mouseNativeStart) {
                    _this._mouseNativeStart = null;
                    _this._viewCenterStart = null;
                    view.emit(paperExt.EventType.mouseDragEnd, ev);
                    if (didDrag) {
                        _this._viewChanged.notify(view.bounds);
                        didDrag = false;
                    }
                }
            });
        }
        Object.defineProperty(ViewZoom.prototype, "viewChanged", {
            get: function () {
                return this._viewChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewZoom.prototype, "zoom", {
            get: function () {
                return this.project.view.zoom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewZoom.prototype, "zoomRange", {
            get: function () {
                return [this._minZoom, this._maxZoom];
            },
            enumerable: true,
            configurable: true
        });
        ViewZoom.prototype.setZoomRange = function (range) {
            var view = this.project.view;
            var aSize = range.shift();
            var bSize = range.shift();
            var a = aSize && Math.min(view.bounds.height / aSize.height, view.bounds.width / aSize.width);
            var b = bSize && Math.min(view.bounds.height / bSize.height, view.bounds.width / bSize.width);
            var min = Math.min(a, b);
            if (min) {
                this._minZoom = min;
            }
            var max = Math.max(a, b);
            if (max) {
                this._maxZoom = max;
            }
            return [this._minZoom, this._maxZoom];
        };
        ViewZoom.prototype.zoomTo = function (rect) {
            var view = this.project.view;
            view.center = rect.center;
            view.zoom = Math.min(view.viewSize.height / rect.height, view.viewSize.width / rect.width);
            this._viewChanged.notify(view.bounds);
        };
        ViewZoom.prototype.changeZoomCentered = function (delta, mousePos) {
            if (!delta) {
                return;
            }
            var view = this.project.view;
            var oldZoom = view.zoom;
            var oldCenter = view.center;
            var viewPos = view.viewToProject(mousePos);
            var newZoom = delta > 0
                ? view.zoom * this.factor
                : view.zoom / this.factor;
            newZoom = this.setZoomConstrained(newZoom);
            if (!newZoom) {
                return;
            }
            var zoomScale = oldZoom / newZoom;
            var centerAdjust = viewPos.subtract(oldCenter);
            var offset = viewPos.subtract(centerAdjust.multiply(zoomScale))
                .subtract(oldCenter);
            view.center = view.center.add(offset);
            this._viewChanged.notify(view.bounds);
        };
        ;
        /**
         * Set zoom level.
         * @returns zoom level that was set, or null if it was not changed
         */
        ViewZoom.prototype.setZoomConstrained = function (zoom) {
            if (this._minZoom) {
                zoom = Math.max(zoom, this._minZoom);
            }
            if (this._maxZoom) {
                zoom = Math.min(zoom, this._maxZoom);
            }
            var view = this.project.view;
            if (zoom != view.zoom) {
                view.zoom = zoom;
                return zoom;
            }
            return null;
        };
        return ViewZoom;
    }());
    paperExt.ViewZoom = ViewZoom;
})(paperExt || (paperExt = {}));
var paperExt;
(function (paperExt) {
    /**
     * Use of these events requires first calling extendMouseEvents
     *   on the item.
     */
    paperExt.EventType = {
        mouseDragStart: "mouseDragStart",
        mouseDragEnd: "mouseDragEnd"
    };
    function extendMouseEvents(item) {
        var dragging = false;
        item.on(paper.EventType.mouseDrag, function (ev) {
            if (!dragging) {
                dragging = true;
                item.emit(paperExt.EventType.mouseDragStart, ev);
            }
        });
        item.on(paper.EventType.mouseUp, function (ev) {
            if (dragging) {
                dragging = false;
                item.emit(paperExt.EventType.mouseDragEnd, ev);
                // prevent click
                ev.stop();
            }
        });
    }
    paperExt.extendMouseEvents = extendMouseEvents;
})(paperExt || (paperExt = {}));
var paper;
(function (paper) {
    paper.EventType = {
        frame: "frame",
        mouseDown: "mousedown",
        mouseUp: "mouseup",
        mouseDrag: "mousedrag",
        click: "click",
        doubleClick: "doubleclick",
        mouseMove: "mousemove",
        mouseEnter: "mouseenter",
        mouseLeave: "mouseleave",
        keyup: "keyup",
        keydown: "keydown"
    };
})(paper || (paper = {}));
var Component = (function () {
    function Component() {
    }
    return Component;
}());
var VDomHelpers;
(function (VDomHelpers) {
    function renderAsChild(container, vnode) {
        var child = document.createElement("div");
        var patched = patch(child, vnode);
        container.appendChild(patched.elm);
    }
    VDomHelpers.renderAsChild = renderAsChild;
})(VDomHelpers || (VDomHelpers = {}));
var ReactiveDom = (function () {
    function ReactiveDom() {
    }
    /**
     * Render a reactive component within container.
     */
    ReactiveDom.renderStream = function (dom$, container) {
        var id = container.id;
        var current = container;
        var sink = new Rx.Subject();
        dom$.subscribe(function (dom) {
            if (!dom)
                return;
            //console.warn('rendering dom', dom);
            // retain ID
            var patched = patch(current, dom);
            if (id && !patched.elm.id) {
                patched.elm.id = id;
            }
            current = patched;
            sink.onNext(current);
        });
        return sink;
    };
    /**
     * Render a reactive component within container.
     */
    ReactiveDom.renderComponent = function (component, container) {
        var current = container;
        var sink = new Rx.Subject();
        component.dom$.subscribe(function (dom) {
            if (!dom)
                return;
            current = patch(current, dom);
            sink.onNext(current);
        });
        return sink;
    };
    /**
     * Render within container whenever source changes.
     */
    ReactiveDom.liveRender = function (container, source, render) {
        var current = container;
        var sink = new Rx.Subject();
        source.subscribe(function (data) {
            var node = render(data);
            if (!node)
                return;
            current = patch(current, node);
            sink.onNext(current);
        });
        return sink;
    };
    return ReactiveDom;
}());
var App;
(function (App) {
    var AppCookies = (function () {
        function AppCookies() {
        }
        Object.defineProperty(AppCookies.prototype, "lastSavedSketchId", {
            get: function () {
                return Cookies.get(AppCookies.LAST_SAVED_SKETCH_ID_KEY);
            },
            set: function (value) {
                Cookies.set(AppCookies.LAST_SAVED_SKETCH_ID_KEY, value, { expires: AppCookies.YEAR });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppCookies.prototype, "browserId", {
            get: function () {
                return Cookies.get(AppCookies.BROWSER_ID_KEY);
            },
            set: function (value) {
                Cookies.set(AppCookies.BROWSER_ID_KEY, value, { expires: AppCookies.YEAR });
            },
            enumerable: true,
            configurable: true
        });
        AppCookies.YEAR = 365;
        AppCookies.BROWSER_ID_KEY = "browserId";
        AppCookies.LAST_SAVED_SKETCH_ID_KEY = "lastSavedSketchId";
        return AppCookies;
    }());
    App.AppCookies = AppCookies;
})(App || (App = {}));
var App;
(function (App) {
    var AppModule = (function () {
        function AppModule() {
            PaperHelpers.shouldLogInfo = false;
            this.store = new App.Store();
            this.editorModule = new SketchEditor.SketchEditorModule(this.store);
        }
        AppModule.prototype.start = function () {
            this.editorModule.start();
        };
        return AppModule;
    }());
    App.AppModule = AppModule;
})(App || (App = {}));
var App;
(function (App) {
    var AppRouter = (function (_super) {
        __extends(AppRouter, _super);
        function AppRouter() {
            _super.call(this, [
                new RouteNode("home", "/"),
                new RouteNode("sketch", "/sketch/:sketchId"),
            ], {
                useHash: false,
                defaultRoute: "home"
            });
            //this.usePlugin(loggerPlugin())
            this.usePlugin(listenersPlugin.default())
                .usePlugin(historyPlugin.default());
        }
        AppRouter.prototype.toSketchEditor = function (sketchId) {
            this.navigate("sketch", { sketchId: sketchId });
        };
        Object.defineProperty(AppRouter.prototype, "state", {
            get: function () {
                // could do route validation somewhere
                return this.getState();
            },
            enumerable: true,
            configurable: true
        });
        return AppRouter;
    }(Router5));
    App.AppRouter = AppRouter;
})(App || (App = {}));
var App;
(function (App) {
    var Store = (function () {
        function Store() {
            this.router = new App.AppRouter();
            this.actions = new Actions();
            this.events = new Events();
            this.cookies = new App.AppCookies();
            this.startRouter();
            this.initState();
            this.initActionHandlers();
        }
        Store.prototype.initState = function () {
            this.state = new AppState(this.cookies, this.router);
        };
        Store.prototype.initActionHandlers = function () {
            var _this = this;
            this.actions.editorLoadedSketch.sub(function (sketchId) {
                _this.router.navigate("sketch", { sketchId: sketchId });
            });
            this.actions.editorSavedSketch.sub(function (id) {
                _this.cookies.lastSavedSketchId = id;
            });
        };
        Store.prototype.startRouter = function () {
            var _this = this;
            this.router.start(function (err, state) {
                _this.events.routeChanged.dispatch(state);
                if (err) {
                    console.warn("router error", err);
                    _this.router.navigate("home");
                }
            });
        };
        return Store;
    }());
    App.Store = Store;
    var AppState = (function () {
        function AppState(cookies, router) {
            this.cookies = cookies;
            this.router = router;
            var browserId = this.cookies.browserId || newid();
            // init or refresh cookie
            this.cookies.browserId = browserId;
        }
        Object.defineProperty(AppState.prototype, "lastSavedSketchId", {
            get: function () {
                return this.cookies.lastSavedSketchId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppState.prototype, "browserId", {
            get: function () {
                return this.cookies.browserId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppState.prototype, "route", {
            get: function () {
                return this.router.state;
            },
            enumerable: true,
            configurable: true
        });
        return AppState;
    }());
    App.AppState = AppState;
    var Actions = (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            _super.apply(this, arguments);
            this.editorLoadedSketch = this.topic("editorLoadedSketch");
            this.editorSavedSketch = this.topic("editorSavedSketch");
        }
        return Actions;
    }(TypedChannel.Channel));
    App.Actions = Actions;
    var Events = (function (_super) {
        __extends(Events, _super);
        function Events() {
            _super.apply(this, arguments);
            this.routeChanged = this.topic("routeChanged");
        }
        return Events;
    }(TypedChannel.Channel));
    App.Events = Events;
})(App || (App = {}));
var Demo;
(function (Demo) {
    var DemoModule = (function () {
        function DemoModule(canvas) {
            paper.setup(canvas);
        }
        DemoModule.prototype.start = function () {
            var view = paper.view;
            var parsedFonts = new FontShape.ParsedFonts(function () { });
            parsedFonts.get("fonts/Roboto-500.ttf").then(function (parsed) {
                var pathData = parsed.font.getPath("SNAP", 0, 0, 128).toPathData();
                var content = new paper.CompoundPath(pathData);
                content.position = content.position.add(50);
                content.fillColor = "lightgray";
                var region = paper.Path.Ellipse(new paper.Rectangle(new paper.Point(0, 0), new paper.Size(600, 300)));
                region.rotate(30);
                region.bounds.center = view.center;
                region.strokeColor = "lightgray";
                region.strokeWidth = 3;
                var snapPath = new FontShape.SnapPath(region, content);
                snapPath.corners = [0, 0.4, 0.45, 0.95];
                view.onFrame = function () {
                    snapPath.slide(0.001);
                    snapPath.updatePath();
                };
                view.draw();
            });
        };
        return DemoModule;
    }());
    Demo.DemoModule = DemoModule;
})(Demo || (Demo = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Builder = (function () {
        function Builder(container, store) {
            var context = {
                renderDesign: function (design, callback) {
                    store.render({
                        design: design,
                        callback: callback
                    });
                }
            };
            var controls$ = store.template$.map(function (t) {
                var controls = t.createUI(context);
                for (var _i = 0, controls_1 = controls; _i < controls_1.length; _i++) {
                    var c = controls_1[_i];
                    c.output$.subscribe(function (d) { return store.updateDesign(d); });
                }
                return controls;
            });
            var dom$ = Rx.Observable.combineLatest(controls$, store.design$, function (controls, design) {
                return { controls: controls, design: design };
            })
                .map(function (_a) {
                var controls = _a.controls, design = _a.design;
                var nodes = controls.map(function (c) { return c.createNode(design); });
                var vnode = h("div#templateControls", {}, nodes);
                return vnode;
            });
            ReactiveDom.renderStream(dom$, container);
        }
        Builder.defaultFontUrl = "fonts/Roboto-500.ttf";
        return Builder;
    }());
    SketchBuilder.Builder = Builder;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Module = (function () {
        function Module(builderContainer, previewCanvas, renderCanvas) {
            this.store = new SketchBuilder.Store();
            this.builder = new SketchBuilder.Builder(builderContainer, this.store);
            //new RenderCanvas(renderCanvas, this.store);
            new SketchBuilder.PreviewCanvas(previewCanvas, this.store);
            this.store.design$.subscribe(function (d) { return console.log("design", d); });
            this.store.template$.subscribe(function (t) { return console.log("template", t); });
        }
        Module.prototype.start = function () {
            this.store.setTemplate("Dickens");
            this.store.design = {
                text: "The rain in spain falls mainly in the drain",
                palette: ["green"]
            };
        };
        return Module;
    }());
    SketchBuilder.Module = Module;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var PreviewCanvas = (function () {
        function PreviewCanvas(canvas, store) {
            var _this = this;
            this.rendering = false;
            this.store = store;
            paper.setup(canvas);
            var parsedFonts = new FontShape.ParsedFonts(function () { });
            var fontFamilies = new FontShape.FontFamilies("fonts/google-fonts.json");
            this.context = {
                getFont: function (specifier) {
                    var url;
                    if (!specifier || !specifier.family) {
                        url = SketchBuilder.Builder.defaultFontUrl;
                    }
                    else {
                        url = fontFamilies.getUrl(specifier.family, specifier.variant)
                            || SketchBuilder.Builder.defaultFontUrl;
                    }
                    return parsedFonts.get(url)
                        .then(function (result) { return result.font; });
                }
            };
            store.design$.subscribe(function (received) {
                // only process one request at a time
                if (_this.rendering) {
                    // always process the last received
                    _this.lastReceived = received;
                    return;
                }
                _this.render(received);
            });
        }
        PreviewCanvas.prototype.renderLastReceived = function () {
            if (this.lastReceived) {
                var rendering = this.lastReceived;
                this.lastReceived = null;
                this.render(rendering);
            }
        };
        PreviewCanvas.prototype.render = function (design) {
            var _this = this;
            if (this.rendering) {
                throw new Error("render is in progress");
            }
            this.rendering = true;
            paper.project.activeLayer.removeChildren();
            return this.store.template.build(design, this.context).then(function (item) {
                if (!item) {
                    return;
                }
                paper.view.viewSize = item.bounds.size.multiply(1.1);
                paper.view.center = item.bounds.center;
                _this.rendering = false;
                // handle any received while rendering 
                _this.renderLastReceived();
            }, function (err) {
                _this.rendering = false;
            });
        };
        return PreviewCanvas;
    }());
    SketchBuilder.PreviewCanvas = PreviewCanvas;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var RenderCanvas = (function () {
        function RenderCanvas(canvas, store) {
            var _this = this;
            this.store = store;
            paper.setup(canvas);
            var parsedFonts = new FontShape.ParsedFonts(function () { });
            var fontFamilies = new FontShape.FontFamilies("fonts/google-fonts.json");
            var context = {
                getFont: function (specifier) {
                    var url;
                    if (!specifier || !specifier.family) {
                        url = SketchBuilder.Builder.defaultFontUrl;
                    }
                    else {
                        url = fontFamilies.getUrl(specifier.family, specifier.variant)
                            || SketchBuilder.Builder.defaultFontUrl;
                    }
                    return parsedFonts.get(url)
                        .then(function (result) { return result.font; });
                }
            };
            var controlled = store.render$.controlled();
            controlled.subscribe(function (request) {
                var design = _.clone(_this.store.design);
                design = _.merge(design, request.design);
                paper.project.activeLayer.removeChildren();
                _this.store.template.build(design, context).then(function (item) {
                    var raster = paper.project.activeLayer.rasterize(72, false);
                    item.remove();
                    request.callback(raster.toDataURL());
                    controlled.request(1);
                }, function (err) {
                    console.warn("error on template.build", err);
                    controlled.request(1);
                });
            });
            controlled.request(1);
        }
        return RenderCanvas;
    }());
    SketchBuilder.RenderCanvas = RenderCanvas;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Store = (function () {
        function Store() {
            this._template$ = new Rx.Subject();
            this._design$ = new Rx.Subject();
            this._render$ = new Rx.Subject();
            this._state = {};
        }
        Object.defineProperty(Store.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "design$", {
            get: function () {
                return this._design$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "template$", {
            get: function () {
                return this._template$;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "render$", {
            get: function () {
                return this._render$; //.observeOn(Rx.Scheduler.default);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Store.prototype, "template", {
            get: function () {
                return this.state.template;
            },
            enumerable: true,
            configurable: true
        });
        Store.prototype.setTemplate = function (name) {
            var template;
            if (/Dickens/i.test(name)) {
                template = new SketchBuilder.Templates.Dickens();
            }
            if (!template) {
                throw new Error("Invalid template " + name);
            }
            this.state.template = template;
            this._template$.onNext(template);
        };
        Object.defineProperty(Store.prototype, "design", {
            set: function (value) {
                this.state.design = value;
                this._design$.onNext(value);
            },
            enumerable: true,
            configurable: true
        });
        Store.prototype.updateDesign = function (update) {
            _.merge(this.state.design, update);
            this._design$.onNext(this.state.design);
        };
        Store.prototype.render = function (request) {
            this._render$.onNext(request);
        };
        return Store;
    }());
    SketchBuilder.Store = Store;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Chooser = (function () {
        function Chooser() {
            this._chosen$ = new Rx.Subject();
        }
        Chooser.prototype.createNode = function (choices, chosenKey) {
            var _this = this;
            return h("ul.chooser", {}, choices.map(function (c) {
                return h("li.choice", {
                    class: {
                        chosen: chosenKey && c.key === chosenKey
                    },
                    on: {
                        click: function (ev) { return _this._chosen$.onNext(c); }
                    }
                }, [c]);
            }));
        };
        Object.defineProperty(Chooser.prototype, "chosen$", {
            get: function () {
                return this._chosen$;
            },
            enumerable: true,
            configurable: true
        });
        return Chooser;
    }());
    SketchBuilder.Chooser = Chooser;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var ImageChooser = (function () {
        function ImageChooser() {
            this._chosen$ = new Rx.Subject();
        }
        ImageChooser.prototype.createNode = function (options) {
            var _this = this;
            var choiceNodes = options.choices.map(function (c) {
                var img;
                var onClick = function () {
                    _this._chosen$.onNext(c);
                };
                var selector = options.chosen === c.value
                    ? "img.chosen"
                    : "img";
                if (c.loadImage) {
                    var imgElm = void 0;
                    img = h(selector, {
                        on: {
                            click: onClick
                        },
                        hook: {
                            // kick off image load
                            insert: function (vnode) { return c.loadImage(vnode.elm); }
                        },
                    }, []);
                }
                else {
                    img = h(selector, {
                        attrs: {
                            href: c.imageUrl
                        },
                        on: {
                            click: onClick
                        },
                    });
                }
                return h("li", {}, [
                    img
                ]);
            });
            return h("ul.chooser", {}, choiceNodes);
        };
        Object.defineProperty(ImageChooser.prototype, "chosen$", {
            get: function () {
                return this._chosen$;
            },
            enumerable: true,
            configurable: true
        });
        return ImageChooser;
    }());
    SketchBuilder.ImageChooser = ImageChooser;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var TextInput = (function () {
        function TextInput() {
            this._value$ = new Rx.Subject();
        }
        TextInput.prototype.createNode = function (value, placeholder) {
            var _this = this;
            return h("input", {
                attrs: {
                    type: "text",
                    placeholder: placeholder
                },
                props: {
                    value: value
                },
                on: {
                    keypress: function (ev) {
                        if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                            ev.preventDefault();
                            var input = ev.target;
                            input.blur();
                        }
                    },
                    change: function (ev) {
                        _this._value$.onNext(ev.target.value);
                    }
                }
            }, []);
        };
        Object.defineProperty(TextInput.prototype, "value$", {
            get: function () {
                return this._value$;
            },
            enumerable: true,
            configurable: true
        });
        return TextInput;
    }());
    SketchBuilder.TextInput = TextInput;
})(SketchBuilder || (SketchBuilder = {}));
var SketchBuilder;
(function (SketchBuilder) {
    var Templates;
    (function (Templates) {
        var Dickens = (function () {
            function Dickens() {
                this.name = "Dickens";
                this.lineHeightVariation = 0.8;
            }
            Dickens.prototype.createUI = function (context) {
                return [
                    this.createTextEntry(),
                    this.createShapeChooser(context),
                ];
            };
            Dickens.prototype.build = function (design, context) {
                var _this = this;
                if (!design.text) {
                    return null;
                }
                return context.getFont(design.font).then(function (font) {
                    var words = design.text.toLocaleUpperCase().split(/\s/);
                    var lines;
                    switch (design.shape) {
                        case "narrow":
                            lines = _this.splitWordsNarrow(words);
                            break;
                        case "wide":
                            lines = _this.splitWordsWide(words);
                            break;
                        default:
                            lines = _this.splitWordsNarrow(words);
                            break;
                    }
                    var box = new paper.Group();
                    var blocks = lines.map(function (l) {
                        var pathData = font.getPath(l, 0, 0, 24).toPathData();
                        return new paper.CompoundPath(pathData);
                    });
                    var fillColor = (design && design.palette[0]) || "red";
                    var maxWidth = _.max(blocks.map(function (b) { return b.bounds.width; }));
                    var lineHeight = blocks[0].bounds.height;
                    var upper = new paper.Path([
                        new paper.Point(0, 0),
                        new paper.Point(maxWidth, 0)
                    ]);
                    var lower;
                    var remaining = blocks.length;
                    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
                        var block = blocks_1[_i];
                        if (--remaining <= 0) {
                            var mid = upper.bounds.center;
                            // last lower line is level
                            lower = new paper.Path([
                                new paper.Point(0, mid.y + lineHeight),
                                new paper.Point(maxWidth, mid.y + lineHeight)
                            ]);
                        }
                        else {
                            lower = _this.randomLowerPathFor(upper, lineHeight);
                        }
                        var stretch = new FontShape.VerticalBoundsStretchPath(block, { upper: upper, lower: lower });
                        stretch.fillColor = fillColor;
                        box.addChild(stretch);
                        upper = lower;
                        lower = null;
                    }
                    return box;
                });
            };
            Dickens.prototype.randomLowerPathFor = function (upper, avgHeight) {
                var points = [];
                var upperCenter = upper.bounds.center;
                var x = 0;
                var numPoints = 4;
                for (var i = 0; i < numPoints; i++) {
                    var y = upperCenter.y + (Math.random() - 0.5) * this.lineHeightVariation * avgHeight;
                    points.push(new paper.Point(x, y));
                    x += upper.bounds.width / (numPoints - 1);
                }
                var path = new paper.Path(points);
                path.smooth();
                path.bounds.center = upper.bounds.center.add(new paper.Point(0, avgHeight));
                return path;
            };
            Dickens.prototype.splitWordsNarrow = function (words) {
                var lines = [];
                var ideal = _.max(words.map(function (w) { return w.length; }));
                var calcScore = function (text) {
                    return Math.pow(Math.abs(ideal - text.length), 2);
                };
                var currentLine = null;
                var currentScore = 10000;
                while (words.length) {
                    var word = words.shift();
                    var newLine = currentLine + " " + word;
                    var newScore = calcScore(newLine);
                    if (currentLine && newScore <= currentScore) {
                        // append
                        currentLine += " " + word;
                        currentScore = newScore;
                    }
                    else {
                        // new line
                        if (currentLine) {
                            lines.push(currentLine);
                        }
                        currentLine = word;
                        currentScore = calcScore(currentLine);
                    }
                }
                lines.push(currentLine);
                return lines;
            };
            Dickens.prototype.splitWordsWide = function (words) {
                var targetLength = _.sum(words.map(function (w) { return w.length + 1; })) / 2;
                var firstLine = words;
                var secondLine = [];
                var secondLineLength = 0;
                while (secondLineLength < targetLength) {
                    var word = words.pop();
                    secondLine.unshift(word);
                    secondLineLength += word.length + 1;
                }
                return [
                    firstLine.join(" "),
                    secondLine.join(" ")
                ];
            };
            Dickens.prototype.createTextEntry = function () {
                var textInput = new SketchBuilder.TextInput();
                return {
                    createNode: function (design) {
                        return textInput.createNode(design.text, "What do you want to say?");
                    },
                    output$: textInput.value$.map(function (v) {
                        return { text: v };
                    })
                };
            };
            Dickens.prototype.createShapeChooser = function (context) {
                var createChoice = function (shape) {
                    return h("div", {
                        key: shape
                    }, [shape]);
                };
                var chooser = new SketchBuilder.Chooser();
                return {
                    createNode: function (design) {
                        var choices = ["narrow", "wide"].map(createChoice);
                        var chooserNode = chooser.createNode(choices, design.shape);
                        return chooserNode;
                    },
                    output$: chooser.chosen$.map(function (choice) {
                        return { shape: choice.key };
                    })
                };
            };
            return Dickens;
        }());
        Templates.Dickens = Dickens;
    })(Templates = SketchBuilder.Templates || (SketchBuilder.Templates = {}));
})(SketchBuilder || (SketchBuilder = {}));
var SketchEditor;
(function (SketchEditor) {
    var DocumentKeyHandler = (function () {
        function DocumentKeyHandler(store) {
            // note: undisposed event subscription
            $(document).keyup(function (e) {
                if (e.keyCode == DomHelpers.KeyCodes.Esc) {
                    store.actions.sketch.setSelection.dispatch(null);
                }
            });
        }
        return DocumentKeyHandler;
    }());
    SketchEditor.DocumentKeyHandler = DocumentKeyHandler;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var SketchEditorModule = (function () {
        function SketchEditorModule(appStore) {
            this.appStore = appStore;
            DomHelpers.initErrorHandler(function (errorData) {
                var content = JSON.stringify(errorData);
                $.ajax({
                    url: "/api/client-errors",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    data: content
                });
            });
            this.store = new SketchEditor.Store(appStore);
            var bar = new SketchEditor.EditorBar(document.getElementById('designer'), this.store);
            var selectedItemEditor = new SketchEditor.SelectedItemEditor(document.getElementById("editorOverlay"), this.store);
            var helpDialog = new SketchEditor.HelpDialog(document.getElementById("help-dialog"), this.store);
            // events.subscribe(m => console.log("event", m.type, m.data));
            // actions.subscribe(m => console.log("action", m.type, m.data));
        }
        SketchEditorModule.prototype.start = function () {
            var _this = this;
            this.store.events.editor.fontLoaded.observe().first().subscribe(function (m) {
                _this.workspaceController = new SketchEditor.WorkspaceController(_this.store, m.data);
                _this.store.actions.editor.initWorkspace.dispatch();
                _this.store.events.editor.workspaceInitialized.sub(function () {
                    $(window).on("beforeunload", function () {
                        if (_this.store.state.sketchIsDirty) {
                            return "Your latest changes are not saved yet.";
                        }
                    });
                });
            });
        };
        SketchEditorModule.prototype.openSketch = function (id) {
            this.store.actions.sketch.open.dispatch(id);
        };
        return SketchEditorModule;
    }());
    SketchEditor.SketchEditorModule = SketchEditorModule;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var SketchHelpers = (function () {
        function SketchHelpers() {
        }
        SketchHelpers.colorsInUse = function (sketch) {
            var colors = [sketch.backgroundColor];
            for (var _i = 0, _a = sketch.textBlocks; _i < _a.length; _i++) {
                var block = _a[_i];
                colors.push(block.backgroundColor);
                colors.push(block.textColor);
            }
            colors = _.uniq(colors.filter(function (c) { return c != null; }));
            colors.sort();
            return colors;
        };
        SketchHelpers.getSketchFileName = function (sketch, length, extension) {
            var name = "";
            outer: for (var _i = 0, _a = sketch.textBlocks; _i < _a.length; _i++) {
                var block = _a[_i];
                for (var _b = 0, _c = block.text.split(/\s/); _b < _c.length; _b++) {
                    var word = _c[_b];
                    var trim = word.replace(/\W/g, '').trim();
                    if (trim.length) {
                        if (name.length)
                            name += " ";
                        name += trim;
                    }
                    if (name.length >= length) {
                        break outer;
                    }
                }
            }
            if (!name.length) {
                name = "fiddle";
            }
            return name + "." + extension;
        };
        return SketchHelpers;
    }());
    SketchEditor.SketchHelpers = SketchHelpers;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    /**
     * The singleton Store controls all application state.
     * No parts outside of the Store modify application state.
     * Communication with the Store is done through message Channels:
     *   - Actions channel to send into the Store,
     *   - Events channel to receive notification from the Store.
     * Only the Store can receive action messages.
     * Only the Store can send event messages.
     * The Store cannot send actions or listen to events (to avoid loops).
     * Messages are to be treated as immutable.
     * All mentions of the Store can be assumed to mean, of course,
     *   "The Store and its sub-components."
     */
    var Store = (function () {
        function Store(appStore) {
            var _this = this;
            this.state = {};
            this.resources = {
                fallbackFont: opentype.Font,
                fontFamilies: new FontShape.FontFamilies("fonts/google-fonts.json"),
                parsedFonts: new FontShape.ParsedFonts(function (parsed) {
                    return _this.events.editor.fontLoaded.dispatch(parsed.font);
                })
            };
            this.actions = new SketchEditor.Actions();
            this.events = new SketchEditor.Events();
            this.appStore = appStore;
            this.setupState();
            this.setupSubscriptions();
            this.loadResources();
        }
        Store.prototype.setupState = function () {
            this.state.browserId = Cookies.get(Store.BROWSER_ID_KEY);
            if (!this.state.browserId) {
                this.state.browserId = newid();
                Cookies.set(Store.BROWSER_ID_KEY, this.state.browserId, { expires: 2 * 365 });
            }
        };
        Store.prototype.setupSubscriptions = function () {
            var _this = this;
            var actions = this.actions, events = this.events;
            // ----- App -----
            this.appStore.events.routeChanged.sub(function (route) {
                var routeSketchId = route.params.sketchId;
                if (route.name === "sketch" && routeSketchId !== _this.state.sketch._id) {
                    _this.openSketch(routeSketchId);
                }
            });
            // ----- Editor -----
            actions.editor.initWorkspace.observe()
                .pausableBuffered(events.editor.resourcesReady.observe().map(function (m) { return m.data; }))
                .subscribe(function (m) {
                _this.setSelection(null, true);
                _this.setEditingItem(null, true);
                var sketchId = _this.appStore.state.route.params.sketchId
                    || _this.appStore.state.lastSavedSketchId;
                var promise;
                if (sketchId) {
                    promise = _this.openSketch(sketchId);
                }
                else {
                    promise = _this.loadGreetingSketch();
                }
                promise.then(function () { return events.editor.workspaceInitialized.dispatch(); });
                // on any action, update save delay timer
                _this.actions.observe().debounce(Store.SERVER_SAVE_DELAY_MS)
                    .subscribe(function () {
                    var sketch = _this.state.sketch;
                    if (!_this.state.loadingSketch
                        && _this.state.sketchIsDirty
                        && sketch._id
                        && sketch.textBlocks.length) {
                        _this.saveSketch(sketch);
                    }
                });
            });
            actions.editor.loadFont.subscribe(function (m) {
                return _this.resources.parsedFonts.get(m.data);
            });
            actions.editor.zoomToFit.forward(events.editor.zoomToFitRequested);
            actions.editor.exportPNG.subscribe(function (m) {
                _this.setSelection(null);
                _this.setEditingItem(null);
                events.editor.exportPNGRequested.dispatch(m.data);
            });
            actions.editor.exportSVG.subscribe(function (m) {
                _this.setSelection(null);
                _this.setEditingItem(null);
                events.editor.exportSVGRequested.dispatch(m.data);
            });
            actions.editor.viewChanged.subscribe(function (m) {
                events.editor.viewChanged.dispatch(m.data);
            });
            actions.editor.updateSnapshot.sub(function (_a) {
                var sketchId = _a.sketchId, pngDataUrl = _a.pngDataUrl;
                if (sketchId === _this.state.sketch._id) {
                    var fileName = sketchId + ".png";
                    var blob = DomHelpers.dataURLToBlob(pngDataUrl);
                    SketchEditor.S3Access.putFile(fileName, "image/png", blob);
                }
            });
            actions.editor.toggleHelp.subscribe(function () {
                _this.state.showHelp = !_this.state.showHelp;
                events.editor.showHelpChanged.dispatch(_this.state.showHelp);
            });
            actions.editor.openSample.sub(function () { return _this.loadGreetingSketch(); });
            // ----- Sketch -----
            actions.sketch.open.sub(function (id) {
                _this.openSketch(id);
            });
            actions.sketch.create.sub(function (attr) {
                _this.newSketch(attr);
            });
            actions.sketch.clear.sub(function () {
                _this.clearSketch();
            });
            actions.sketch.clone.subscribe(function () {
                var clone = _.clone(_this.state.sketch);
                clone._id = newid();
                clone.browserId = _this.state.browserId;
                clone.savedAt = null;
                _this.loadSketch(clone);
                _this.state.sketchIsDirty = false;
                _this.events.sketch.cloned.dispatch(clone);
                _this.pulseUserMessage("Duplicated sketch. Address of this page has been updated.");
            });
            actions.sketch.attrUpdate.subscribe(function (ev) {
                _this.merge(_this.state.sketch, ev.data);
                events.sketch.attrChanged.dispatch(_this.state.sketch);
                _this.changedSketchContent();
            });
            actions.sketch.setSelection.subscribe(function (m) {
                _this.setSelection(m.data);
                _this.setEditingItem(m.data);
            });
            // ----- TextBlock -----
            actions.textBlock.add
                .subscribe(function (ev) {
                _this.setEditingItem(null);
                var patch = ev.data;
                if (!patch.text || !patch.text.length) {
                    return;
                }
                var block = { _id: newid() };
                _this.merge(block, patch);
                block.textColor = _this.state.sketch.defaultTextBlockAttr.textColor;
                block.backgroundColor = _this.state.sketch.defaultTextBlockAttr.backgroundColor;
                if (!block.fontFamily) {
                    block.fontFamily = _this.state.sketch.defaultTextBlockAttr.fontFamily;
                    block.fontVariant = _this.state.sketch.defaultTextBlockAttr.fontVariant;
                }
                _this.state.sketch.textBlocks.push(block);
                events.textblock.added.dispatch(block);
                _this.changedSketchContent();
                _this.loadTextBlockFont(block);
            });
            actions.textBlock.updateAttr
                .subscribe(function (ev) {
                var block = _this.getBlock(ev.data._id);
                if (block) {
                    var patch_1 = {
                        text: ev.data.text,
                        backgroundColor: ev.data.backgroundColor,
                        textColor: ev.data.textColor,
                        fontFamily: ev.data.fontFamily,
                        fontVariant: ev.data.fontVariant
                    };
                    var fontChanged = patch_1.fontFamily !== block.fontFamily
                        || patch_1.fontVariant !== block.fontVariant;
                    _this.merge(block, patch_1);
                    if (block.fontFamily && !block.fontVariant) {
                        var famDef = _this.resources.fontFamilies.get(block.fontFamily);
                        if (famDef) {
                            // regular or else first variant
                            block.fontVariant = _this.resources.fontFamilies.defaultVariant(famDef);
                        }
                    }
                    _this.state.sketch.defaultTextBlockAttr = {
                        textColor: block.textColor,
                        backgroundColor: block.backgroundColor,
                        fontFamily: block.fontFamily,
                        fontVariant: block.fontVariant
                    };
                    events.textblock.attrChanged.dispatch(block);
                    _this.changedSketchContent();
                    if (fontChanged) {
                        _this.loadTextBlockFont(block);
                    }
                }
            });
            actions.textBlock.remove
                .subscribe(function (ev) {
                var didDelete = false;
                _.remove(_this.state.sketch.textBlocks, function (tb) {
                    if (tb._id === ev.data._id) {
                        didDelete = true;
                        return true;
                    }
                });
                if (didDelete) {
                    events.textblock.removed.dispatch({ _id: ev.data._id });
                    _this.changedSketchContent();
                    _this.setEditingItem(null);
                }
            });
            actions.textBlock.updateArrange
                .subscribe(function (ev) {
                var block = _this.getBlock(ev.data._id);
                if (block) {
                    block.position = ev.data.position;
                    block.outline = ev.data.outline;
                    events.textblock.arrangeChanged.dispatch(block);
                    _this.changedSketchContent();
                }
            });
        };
        Store.prototype.openSketch = function (id) {
            var _this = this;
            if (!id || !id.length) {
                return;
            }
            return SketchEditor.S3Access.getJson(id + ".json")
                .then(function (sketch) {
                _this.loadSketch(sketch);
                console.log("Retrieved sketch", sketch._id);
                if (sketch.browserId === _this.state.browserId) {
                    console.log('Sketch was created in this browser');
                }
                else {
                    console.log('Sketch was created in a different browser');
                }
                return sketch;
            }, function (err) {
                console.warn("error getting remote sketch", err);
                _this.loadGreetingSketch();
            });
        };
        Store.prototype.loadSketch = function (sketch) {
            this.state.loadingSketch = true;
            this.state.sketch = sketch;
            this.state.sketchIsDirty = false;
            this.setDefaultUserMessage();
            this.events.sketch.loaded.dispatch(this.state.sketch);
            this.appStore.actions.editorLoadedSketch.dispatch(sketch._id);
            for (var _i = 0, _a = this.state.sketch.textBlocks; _i < _a.length; _i++) {
                var tb = _a[_i];
                this.events.textblock.loaded.dispatch(tb);
                this.loadTextBlockFont(tb);
            }
            this.events.editor.zoomToFitRequested.dispatch();
            this.state.loadingSketch = false;
        };
        Store.prototype.loadGreetingSketch = function () {
            var _this = this;
            return SketchEditor.S3Access.getJson(Store.GREETING_SKETCH_ID + ".json")
                .done(function (sketch) {
                sketch._id = newid();
                sketch.browserId = _this.state.browserId;
                _this.loadSketch(sketch);
            });
        };
        Store.prototype.clearSketch = function () {
            var sketch = this.defaultSketchAttr();
            sketch._id = this.state.sketch._id;
            this.loadSketch(sketch);
        };
        Store.prototype.loadResources = function () {
            var _this = this;
            this.resources.fontFamilies.loadCatalogLocal(function (families) {
                // load fonts into browser for preview
                _this.resources.fontFamilies.loadPreviewSubsets(families.map(function (f) { return f.family; }));
                _this.resources.parsedFonts.get(Store.FALLBACK_FONT_URL).then(function (_a) {
                    var font = _a.font;
                    return _this.resources.fallbackFont = font;
                });
                _this.events.editor.resourcesReady.dispatch(true);
            });
        };
        Store.prototype.setUserMessage = function (message) {
            if (this.state.userMessage !== message) {
                this.state.userMessage = message;
                this.events.editor.userMessageChanged.dispatch(message);
            }
        };
        Store.prototype.pulseUserMessage = function (message) {
            var _this = this;
            this.setUserMessage(message);
            setTimeout(function () { return _this.setDefaultUserMessage(); }, 4000);
        };
        Store.prototype.setDefaultUserMessage = function () {
            // if not the last saved sketch, or sketch is dirty, show "Unsaved"
            var message = (this.state.sketchIsDirty
                || !this.state.sketch.savedAt)
                ? "Unsaved"
                : "Saved";
            this.setUserMessage(message);
        };
        Store.prototype.loadTextBlockFont = function (block) {
            var _this = this;
            this.resources.parsedFonts.get(this.resources.fontFamilies.getUrl(block.fontFamily, block.fontVariant))
                .then(function (_a) {
                var font = _a.font;
                return _this.events.textblock.fontReady.dispatch({ textBlockId: block._id, font: font });
            });
        };
        Store.prototype.changedSketchContent = function () {
            this.state.sketchIsDirty = true;
            this.events.sketch.contentChanged.dispatch(this.state.sketch);
            this.setDefaultUserMessage();
        };
        Store.prototype.merge = function (dest, source) {
            _.merge(dest, source);
        };
        Store.prototype.newSketch = function (attr) {
            var sketch = this.defaultSketchAttr();
            sketch._id = newid();
            if (attr) {
                this.merge(sketch, attr);
            }
            this.loadSketch(sketch);
            return sketch;
        };
        Store.prototype.defaultSketchAttr = function () {
            return {
                browserId: this.state.browserId,
                defaultTextBlockAttr: {
                    fontFamily: "Roboto",
                    fontVariant: "regular",
                    textColor: "gray"
                },
                backgroundColor: "white",
                textBlocks: []
            };
        };
        Store.prototype.saveSketch = function (sketch) {
            var _this = this;
            var saving = _.clone(sketch);
            var now = new Date();
            saving.savedAt = now;
            this.setUserMessage("Saving");
            SketchEditor.S3Access.putFile(sketch._id + ".json", "application/json", JSON.stringify(saving))
                .then(function () {
                _this.state.sketchIsDirty = false;
                _this.state.sketch.savedAt = now;
                _this.setDefaultUserMessage();
                _this.appStore.actions.editorSavedSketch.dispatch(sketch._id);
                _this.events.editor.snapshotExpired.dispatch(sketch);
            }, function () {
                _this.setUserMessage("Unable to save");
            });
        };
        Store.prototype.setSelection = function (item, force) {
            if (force === void 0) { force = true; }
            if (!force) {
                // early exit on no change
                if (item) {
                    if (this.state.selection
                        && this.state.selection.itemId === item.itemId) {
                        return;
                    }
                }
                else {
                    if (!this.state.selection) {
                        return;
                    }
                }
            }
            this.state.selection = item;
            this.events.sketch.selectionChanged.dispatch(item);
        };
        Store.prototype.setEditingItem = function (item, force) {
            if (!force) {
                // early exit on no change
                if (item) {
                    if (this.state.editingItem
                        && this.state.editingItem.itemId === item.itemId) {
                        return;
                    }
                }
                else {
                    if (!this.state.editingItem) {
                        return;
                    }
                }
            }
            if (this.state.editingItem) {
                // signal closing editor for item
                if (this.state.editingItem.itemType === "TextBlock") {
                    var currentEditingBlock = this.getBlock(this.state.editingItem.itemId);
                    if (currentEditingBlock) {
                        this.events.textblock.editorClosed.dispatch(currentEditingBlock);
                    }
                }
            }
            if (item) {
                // editing item should be selected item
                this.setSelection(item);
            }
            this.state.editingItem = item;
            this.events.sketch.editingItemChanged.dispatch(item);
        };
        Store.prototype.getBlock = function (id) {
            return _.find(this.state.sketch.textBlocks, function (tb) { return tb._id === id; });
        };
        Store.BROWSER_ID_KEY = "browserId";
        Store.FALLBACK_FONT_URL = "/fonts/Roboto-500.ttf";
        Store.DEFAULT_FONT_NAME = "Roboto";
        Store.SKETCH_LOCAL_CACHE_KEY = "fiddlesticks.io.lastSketch";
        Store.LOCAL_CACHE_DELAY_MS = 1000;
        Store.SERVER_SAVE_DELAY_MS = 10000;
        Store.GREETING_SKETCH_ID = "im2ba92i1714i";
        return Store;
    }());
    SketchEditor.Store = Store;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var WorkspaceController = (function () {
        function WorkspaceController(store, fallbackFont) {
            var _this = this;
            this.defaultSize = new paper.Size(50000, 40000);
            this.defaultScale = 0.02;
            this._textBlockItems = {};
            this.store = store;
            this.fallbackFont = fallbackFont;
            paper.settings.handleSize = 1;
            this.canvas = document.getElementById('mainCanvas');
            paper.setup(this.canvas);
            this.project = paper.project;
            window.onresize = function () { return _this.project.view.draw(); };
            var canvasSel = $(this.canvas);
            store.events.mergeTyped(store.events.sketch.loaded, store.events.sketch.attrChanged).subscribe(function (ev) {
                return canvasSel.css("background-color", ev.data.backgroundColor);
            });
            this.viewZoom = new paperExt.ViewZoom(this.project);
            this.viewZoom.setZoomRange([
                this.defaultSize.multiply(this.defaultScale * 0.1),
                this.defaultSize.multiply(0.5)]);
            this.viewZoom.viewChanged.subscribe(function (bounds) {
                store.actions.editor.viewChanged.dispatch(bounds);
            });
            var clearSelection = function (ev) {
                if (store.state.selection) {
                    store.actions.sketch.setSelection.dispatch(null);
                }
            };
            paper.view.on(paper.EventType.click, function (ev) {
                if (!_this.project.hitTest(ev.point)) {
                    clearSelection(ev);
                }
            });
            paper.view.on(paperExt.EventType.mouseDragStart, clearSelection);
            var keyHandler = new SketchEditor.DocumentKeyHandler(store);
            // ----- Designer -----
            store.events.editor.workspaceInitialized.sub(function () {
                _this.project.view.draw();
            });
            store.events.editor.zoomToFitRequested.subscribe(function () {
                _this.zoomToFit();
            });
            store.events.editor.exportSVGRequested.subscribe(function () {
                _this.downloadSVG();
            });
            store.events.editor.exportPNGRequested.sub(function () {
                _this.downloadPNG();
            });
            store.events.editor.snapshotExpired.sub(function () {
                var data = _this.getSnapshotPNG(72);
                store.actions.editor.updateSnapshot.dispatch({
                    sketchId: _this.store.state.sketch._id, pngDataUrl: data
                });
            });
            // ----- Sketch -----
            store.events.sketch.loaded.subscribe(function (ev) {
                _this._sketch = ev.data;
                _this.project.clear();
                _this.project.deselectAll();
                _this._textBlockItems = {};
            });
            store.events.sketch.selectionChanged.subscribe(function (m) {
                _this.project.deselectAll();
                if (m.data) {
                    var block = m.data.itemId && _this._textBlockItems[m.data.itemId];
                    if (block && !block.selected) {
                        block.selected = true;
                    }
                }
            });
            // ----- TextBlock -----
            store.events.mergeTyped(store.events.textblock.added, store.events.textblock.loaded).subscribe(function (ev) { return _this.addBlock(ev.data); });
            store.events.textblock.attrChanged
                .observe()
                .throttle(WorkspaceController.TEXT_CHANGE_RENDER_THROTTLE_MS)
                .subscribe(function (m) {
                var item = _this._textBlockItems[m.data._id];
                if (item) {
                    var textBlock = m.data;
                    item.text = textBlock.text;
                    item.customStyle = {
                        fillColor: textBlock.textColor,
                        backgroundColor: textBlock.backgroundColor
                    };
                }
            });
            store.events.textblock.fontReady.sub(function (data) {
                var item = _this._textBlockItems[data.textBlockId];
                if (item) {
                    item.font = data.font;
                }
            });
            store.events.textblock.removed.subscribe(function (m) {
                var item = _this._textBlockItems[m.data._id];
                if (item) {
                    item.remove();
                    delete _this._textBlockItems[m.data._id];
                }
            });
            store.events.textblock.editorClosed.subscribe(function (m) {
                var item = _this._textBlockItems[m.data._id];
                if (item) {
                    item.updateTextPath();
                }
            });
        }
        WorkspaceController.prototype.zoomToFit = function () {
            var bounds = this.getViewableBounds();
            this.viewZoom.zoomTo(bounds.scale(1.2));
        };
        WorkspaceController.prototype.getViewableBounds = function () {
            var bounds;
            _.forOwn(this._textBlockItems, function (item) {
                bounds = bounds
                    ? bounds.unite(item.bounds)
                    : item.bounds;
            });
            if (!bounds) {
                bounds = new paper.Rectangle(new paper.Point(0, 0), this.defaultSize.multiply(this.defaultScale));
            }
            return bounds;
        };
        /**
         * @returns data URL
         */
        WorkspaceController.prototype.getSnapshotPNG = function (dpi) {
            var background = this.insertBackground();
            var raster = this.project.activeLayer.rasterize(dpi, false);
            var data = raster.toDataURL();
            background.remove();
            return data;
        };
        WorkspaceController.prototype.downloadPNG = function () {
            // Half of max DPI produces approx 4200x4200.
            var dpi = 0.5 * PaperHelpers.getMaxExportDpi(this.project.activeLayer.bounds.size);
            var data = this.getSnapshotPNG(dpi);
            var fileName = SketchEditor.SketchHelpers.getSketchFileName(this.store.state.sketch, 40, "png");
            var blob = DomHelpers.dataURLToBlob(data);
            saveAs(blob, fileName);
        };
        WorkspaceController.prototype.downloadSVG = function () {
            var background;
            if (this.store.state.sketch.backgroundColor) {
                background = this.insertBackground();
            }
            var dataUrl = "data:image/svg+xml;utf8," + encodeURIComponent(this.project.exportSVG({ asString: true }));
            var blob = DomHelpers.dataURLToBlob(dataUrl);
            var fileName = SketchEditor.SketchHelpers.getSketchFileName(this.store.state.sketch, 40, "svg");
            saveAs(blob, fileName);
            if (background) {
                background.remove();
            }
        };
        /**
         * Insert sketch background to provide background fill (if necessary)
         *   and add margin around edges.
         */
        WorkspaceController.prototype.insertBackground = function () {
            var bounds = this.getViewableBounds();
            var margin = Math.max(bounds.width, bounds.height) * 0.02;
            var background = paper.Shape.Rectangle(bounds.topLeft.subtract(margin), bounds.bottomRight.add(margin));
            background.fillColor = this.store.state.sketch.backgroundColor;
            background.sendToBack();
            return background;
        };
        WorkspaceController.prototype.addBlock = function (textBlock) {
            var _this = this;
            if (!textBlock) {
                return;
            }
            if (!textBlock._id) {
                console.error('received block without id', textBlock);
            }
            var item = this._textBlockItems[textBlock._id];
            if (item) {
                console.error("Received addBlock for block that is already loaded");
                return;
            }
            var bounds;
            if (textBlock.outline) {
                var loadSegment = function (record) {
                    var point = record[0];
                    if (point instanceof Array) {
                        return new paper.Segment(new paper.Point(record[0]), record[1] && new paper.Point(record[1]), record[2] && new paper.Point(record[2]));
                    }
                    // Single-point segments are stored as number[2]
                    return new paper.Segment(new paper.Point(record));
                };
                bounds = {
                    upper: textBlock.outline.top.segments.map(loadSegment),
                    lower: textBlock.outline.bottom.segments.map(loadSegment)
                };
            }
            item = new SketchEditor.TextWarp(this.fallbackFont, textBlock.text, bounds, null, {
                fillColor: textBlock.textColor || "red",
                backgroundColor: textBlock.backgroundColor
            });
            paperExt.extendMouseEvents(item);
            if (!textBlock.outline && textBlock.position) {
                item.position = new paper.Point(textBlock.position);
            }
            item.on(paper.EventType.click, function (ev) {
                if (item.selected) {
                    // select next item behind
                    var otherHits = _.values(_this._textBlockItems)
                        .filter(function (i) { return i.id !== item.id && !!i.hitTest(ev.point); });
                    var otherItem_1 = _.sortBy(otherHits, function (i) { return i.index; })[0];
                    if (otherItem_1) {
                        otherItem_1.bringToFront();
                        var otherId = _.findKey(_this._textBlockItems, function (i) { return i === otherItem_1; });
                        if (otherId) {
                            _this.store.actions.sketch.setSelection.dispatch({ itemId: otherId, itemType: "TextBlock" });
                        }
                    }
                }
                else {
                    item.bringToFront();
                    if (!item.selected) {
                        _this.store.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
                    }
                }
            });
            item.on(paperExt.EventType.mouseDragStart, function (ev) {
                item.bringToFront();
            });
            item.on(paper.EventType.mouseDrag, function (ev) {
                item.translate(ev.delta);
            });
            item.on(paperExt.EventType.mouseDragEnd, function (ev) {
                var block = _this.getBlockArrangement(item);
                block._id = textBlock._id;
                _this.store.actions.textBlock.updateArrange.dispatch(block);
                if (!item.selected) {
                    _this.store.actions.sketch.setSelection.dispatch({ itemId: textBlock._id, itemType: "TextBlock" });
                }
            });
            var itemChange$ = PaperNotify.observe(item, PaperNotify.ChangeFlag.GEOMETRY);
            itemChange$
                .debounce(WorkspaceController.BLOCK_BOUNDS_CHANGE_THROTTLE_MS)
                .subscribe(function () {
                var block = _this.getBlockArrangement(item);
                block._id = textBlock._id;
                _this.store.actions.textBlock.updateArrange.dispatch(block);
            });
            item.data = textBlock._id;
            if (!textBlock.position) {
                item.position = this.project.view.bounds.point.add(new paper.Point(item.bounds.width / 2, item.bounds.height / 2)
                    .add(50));
            }
            this._textBlockItems[textBlock._id] = item;
        };
        WorkspaceController.prototype.getBlockArrangement = function (item) {
            // export returns an array with item type and serialized object:
            //   ["Path", PathRecord]
            var top = item.upper.exportJSON({ asString: false })[1];
            var bottom = item.lower.exportJSON({ asString: false })[1];
            return {
                position: [item.position.x, item.position.y],
                outline: { top: top, bottom: bottom }
            };
        };
        WorkspaceController.TEXT_CHANGE_RENDER_THROTTLE_MS = 500;
        WorkspaceController.BLOCK_BOUNDS_CHANGE_THROTTLE_MS = 500;
        return WorkspaceController;
    }());
    SketchEditor.WorkspaceController = WorkspaceController;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var Actions = (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            _super.apply(this, arguments);
            this.editor = {
                initWorkspace: this.topic("designer.initWorkspace"),
                loadFont: this.topic("designer.loadFont"),
                zoomToFit: this.topic("designer.zoomToFit"),
                exportingImage: this.topic("designer.exportImage"),
                exportPNG: this.topic("designer.exportPNG"),
                exportSVG: this.topic("designer.exportSVG"),
                viewChanged: this.topic("designer.viewChanged"),
                updateSnapshot: this.topic("designer.updateSnapshot"),
                toggleHelp: this.topic("designer.toggleHelp"),
                openSample: this.topic("designer.openSample"),
            };
            this.sketch = {
                create: this.topic("sketch.create"),
                clear: this.topic("sketch.clear"),
                clone: this.topic("sketch.clone"),
                open: this.topic("sketch.open"),
                attrUpdate: this.topic("sketch.attrUpdate"),
                setSelection: this.topic("sketch.setSelection"),
            };
            this.textBlock = {
                add: this.topic("textBlock.add"),
                updateAttr: this.topic("textBlock.updateAttr"),
                updateArrange: this.topic("textBlock.updateArrange"),
                remove: this.topic("textBlock.remove")
            };
        }
        return Actions;
    }(TypedChannel.Channel));
    SketchEditor.Actions = Actions;
    var Events = (function (_super) {
        __extends(Events, _super);
        function Events() {
            _super.apply(this, arguments);
            this.editor = {
                resourcesReady: this.topic("app.resourcesReady"),
                workspaceInitialized: this.topic("app.workspaceInitialized"),
                fontLoaded: this.topic("app.fontLoaded"),
                zoomToFitRequested: this.topic("designer.zoomToFitRequested"),
                exportPNGRequested: this.topic("designer.exportPNGRequested"),
                exportSVGRequested: this.topic("designer.exportSVGRequested"),
                viewChanged: this.topic("designer.viewChanged"),
                snapshotExpired: this.topic("designer.snapshotExpired"),
                userMessageChanged: this.topic("designer.userMessageChanged"),
                showHelpChanged: this.topic("designer.showHelpChanged")
            };
            this.sketch = {
                loaded: this.topic("sketch.loaded"),
                attrChanged: this.topic("sketch.attrChanged"),
                contentChanged: this.topic("sketch.contentChanged"),
                editingItemChanged: this.topic("sketch.editingItemChanged"),
                selectionChanged: this.topic("sketch.selectionChanged"),
                saveLocalRequested: this.topic("sketch.savelocal.saveLocalRequested"),
                cloned: this.topic("sketch.cloned"),
            };
            this.textblock = {
                added: this.topic("textblock.added"),
                attrChanged: this.topic("textblock.attrChanged"),
                fontReady: this.topic("textblock.fontReady"),
                arrangeChanged: this.topic("textblock.arrangeChanged"),
                removed: this.topic("textblock.removed"),
                loaded: this.topic("textblock.loaded"),
                editorClosed: this.topic("textblock.editorClosed"),
            };
        }
        return Events;
    }(TypedChannel.Channel));
    SketchEditor.Events = Events;
    var Channels = (function () {
        function Channels() {
            this.actions = new Actions();
            this.events = new Events();
        }
        return Channels;
    }());
    SketchEditor.Channels = Channels;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    function getFontDescription(family, variant) {
        var url;
        url = family.files[variant || "regular"];
        if (!url) {
            url = family.files[0];
        }
        return {
            family: family.family,
            category: family.category,
            variant: variant,
            url: url
        };
    }
    SketchEditor.getFontDescription = getFontDescription;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var S3Access = (function () {
        function S3Access() {
        }
        /**
         * Upload file to application S3 bucket.
         * Returns upload URL as a promise.
         */
        S3Access.putFile = function (fileName, fileType, data) {
            // https://github.com/aws/aws-sdk-js/issues/190   
            if (navigator.userAgent.match(/Firefox/) && !fileType.match(/;/)) {
                var charset = '; charset=UTF-8';
                fileType += charset;
            }
            var signUrl = "/api/storage/access?fileName=" + fileName + "&fileType=" + fileType;
            // get signed URL
            return $.getJSON(signUrl)
                .then(function (signResponse) {
                // PUT file
                var putRequest = {
                    method: "PUT",
                    cache: false,
                    url: signResponse.signedRequest,
                    headers: {
                        "x-amz-acl": "public-read"
                    },
                    data: data,
                    processData: false,
                    contentType: fileType,
                    accept: "application/json"
                };
                return $.ajax(putRequest)
                    .then(function (putResponse) {
                    console.log("uploaded file", signResponse.url);
                    return signResponse.url;
                }, function (err) {
                    console.error("error uploading to S3", err);
                });
            }, function (err) {
                console.error("error on /api/storage/access", err);
            });
        };
        /**
         * Download file from bucket
         */
        S3Access.getJson = function (fileName) {
            return this.getFileUrl(fileName)
                .then(function (response) {
                console.log("downloading", response.url);
                return $.ajax({
                    url: response.url,
                    dataType: "json",
                    cache: false
                });
            });
        };
        S3Access.getFileUrl = function (fileName) {
            return $.ajax({
                url: "/api/storage/url?fileName=" + fileName,
                dataType: "json",
                cache: false
            });
        };
        return S3Access;
    }());
    SketchEditor.S3Access = S3Access;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var ColorPicker = (function () {
        function ColorPicker() {
        }
        ColorPicker.setup = function (elem, featuredColors, onChange) {
            var featuredGroups = _.chunk(featuredColors, 5);
            // for each palette group
            var defaultPaletteGroups = ColorPicker.DEFAULT_PALETTE_GROUPS.map(function (group) {
                var parsedGroup = group.map(function (c) { return new paper.Color(c); });
                // create light variants of darkest three
                var addColors = _.sortBy(parsedGroup, function (c) { return c.lightness; })
                    .slice(0, 3)
                    .map(function (c) {
                    var c2 = c.clone();
                    c2.lightness = 0.85;
                    return c2;
                });
                parsedGroup = parsedGroup.concat(addColors);
                parsedGroup = _.sortBy(parsedGroup, function (c) { return c.lightness; });
                return parsedGroup.map(function (c) { return c.toCSS(true); });
            });
            var palette = featuredGroups.concat(defaultPaletteGroups);
            palette.push(ColorPicker.MONO_PALETTE);
            var sel = $(elem);
            $(elem).spectrum({
                showInput: true,
                allowEmpty: true,
                preferredFormat: "hex",
                showButtons: false,
                showAlpha: true,
                showPalette: true,
                showSelectionPalette: false,
                palette: palette,
                localStorageKey: "sketchtext",
                change: onChange
            });
        };
        ;
        ColorPicker.set = function (elem, value) {
            $(elem).spectrum("set", value);
        };
        ColorPicker.destroy = function (elem) {
            $(elem).spectrum("destroy");
        };
        ColorPicker.DEFAULT_PALETTE_GROUPS = [
            [
                // http://www.color-hex.com/color-palette/807
                "#ee4035",
                "#f37736",
                "#fdf498",
                "#7bc043",
                "#0392cf",
            ],
            [
                // http://www.color-hex.com/color-palette/894
                "#edc951",
                "#eb6841",
                "#cc2a36",
                "#4f372d",
                "#00a0b0",
            ],
            [
                // http://www.color-hex.com/color-palette/164
                "#1b85b8",
                "#5a5255",
                "#559e83",
                "#ae5a41",
                "#c3cb71",
            ],
            [
                // http://www.color-hex.com/color-palette/389
                "#4b3832",
                "#854442",
                "#fff4e6",
                "#3c2f2f",
                "#be9b7b",
            ],
            [
                // http://www.color-hex.com/color-palette/455
                "#ff4e50",
                "#fc913a",
                "#f9d62e",
                "#eae374",
                "#e2f4c7",
            ],
            [
                // http://www.color-hex.com/color-palette/700
                "#d11141",
                "#00b159",
                "#00aedb",
                "#f37735",
                "#ffc425",
            ],
            [
                // http://www.color-hex.com/color-palette/826
                "#e8d174",
                "#e39e54",
                "#d64d4d",
                "#4d7358",
                "#9ed670",
            ],
        ];
        ColorPicker.MONO_PALETTE = ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"];
        return ColorPicker;
    }());
    SketchEditor.ColorPicker = ColorPicker;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var EditorBar = (function (_super) {
        __extends(EditorBar, _super);
        function EditorBar(container, store) {
            var _this = this;
            _super.call(this);
            this.store = store;
            var sketchDom$ = store.events.merge(store.events.sketch.loaded, store.events.sketch.attrChanged, store.events.editor.userMessageChanged)
                .map(function (m) { return _this.render(store.state); });
            ReactiveDom.renderStream(sketchDom$, container);
        }
        EditorBar.prototype.render = function (state) {
            var _this = this;
            var sketch = state.sketch;
            var self = this;
            return h("div", [
                h("label", "Add text: "),
                h("input.add-text", {
                    on: {
                        keypress: function (ev) {
                            if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                                var text = ev.target && ev.target.value;
                                if (text.length) {
                                    _this.store.actions.textBlock.add.dispatch({ text: text });
                                    ev.target.value = '';
                                }
                            }
                        }
                    },
                    attrs: {
                        type: "text",
                    },
                    props: {
                        placeholder: "Press [Enter] to add"
                    },
                    style: {}
                }),
                h("label", "Background: "),
                h("input.background-color", {
                    props: {
                        type: "text",
                        value: sketch.backgroundColor
                    },
                    hook: {
                        insert: function (vnode) {
                            return SketchEditor.ColorPicker.setup(vnode.elm, SketchEditor.SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) {
                                _this.store.actions.sketch.attrUpdate.dispatch({ backgroundColor: color && color.toHexString() });
                            });
                        },
                        update: function (oldVnode, vnode) {
                            SketchEditor.ColorPicker.set(vnode.elm, sketch.backgroundColor);
                        },
                        destroy: function (vnode) { return SketchEditor.ColorPicker.destroy(vnode.elm); }
                    }
                }),
                BootScript.dropdown({
                    id: "sketchMenu",
                    content: "Actions",
                    items: [
                        {
                            content: "New",
                            options: {
                                attrs: {
                                    title: "Create new sketch"
                                },
                                on: {
                                    click: function () { return _this.store.actions.sketch.create.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Clear all",
                            options: {
                                attrs: {
                                    title: "Clear sketch contents"
                                },
                                on: {
                                    click: function () { return _this.store.actions.sketch.clear.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Zoom to fit",
                            options: {
                                attrs: {
                                    title: "Fit contents in view"
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.zoomToFit.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Export image",
                            options: {
                                attrs: {
                                    title: "Export sketch as PNG",
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.exportPNG.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Export SVG",
                            options: {
                                attrs: {
                                    title: "Export sketch as vector graphics"
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.exportSVG.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Duplicate sketch",
                            options: {
                                attrs: {
                                    title: "Copy contents into a sketch with a new address"
                                },
                                on: {
                                    click: function () { return _this.store.actions.sketch.clone.dispatch(); }
                                }
                            }
                        },
                        {
                            content: "Open sample sketch",
                            options: {
                                attrs: {
                                    title: "Open a sample sketch to play with"
                                },
                                on: {
                                    click: function () { return _this.store.actions.editor.openSample.dispatch(); }
                                }
                            }
                        },
                    ]
                }),
                h("div#rightSide", {}, [
                    h("div#user-message", {}, [state.userMessage || ""]),
                    h("div#show-help.glyphicon.glyphicon-question-sign", {
                        on: {
                            click: function () {
                                _this.store.actions.editor.toggleHelp.dispatch();
                            }
                        }
                    }),
                ])
            ]);
        };
        return EditorBar;
    }(Component));
    SketchEditor.EditorBar = EditorBar;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var FontPicker = (function () {
        function FontPicker(container, store, block) {
            var _this = this;
            this.defaultFontFamily = "Roboto";
            this.previewFontSize = "28px";
            this.store = store;
            var dom$ = Rx.Observable.just(block)
                .merge(store.events.textblock.attrChanged.observe()
                .filter(function (m) { return m.data._id === block._id; })
                .map(function (m) { return m.data; }))
                .map(function (tb) { return _this.render(tb); });
            ReactiveDom.renderStream(dom$, container);
        }
        FontPicker.prototype.render = function (block) {
            var _this = this;
            var update = function (patch) {
                patch._id = block._id;
                _this.store.actions.textBlock.updateAttr.dispatch(patch);
            };
            var elements = [];
            elements.push(h("select", {
                key: "selectPicker",
                class: {
                    "family-picker": true
                },
                attrs: {},
                hook: {
                    insert: function (vnode) {
                        $(vnode.elm).selectpicker();
                    },
                    destroy: function (vnode) {
                        $(vnode.elm).selectpicker("destroy");
                    }
                },
                on: {
                    change: function (ev) { return update({
                        fontFamily: ev.target.value,
                        fontVariant: _this.store.resources.fontFamilies.defaultVariant(_this.store.resources.fontFamilies.get(ev.target.value))
                    }); }
                }
            }, this.store.resources.fontFamilies.catalog
                .map(function (ff) { return h("option", {
                attrs: {
                    selected: ff.family === block.fontFamily,
                    "data-content": "<span style=\"" + FontHelpers.getStyleString(ff.family, null, _this.previewFontSize) + "\">" + ff.family + "</span>"
                },
            }, [ff.family]); })));
            var selectedFamily = this.store.resources.fontFamilies.get(block.fontFamily);
            if (selectedFamily && selectedFamily.variants
                && selectedFamily.variants.length > 1) {
                elements.push(h("select", {
                    key: "variantPicker",
                    class: {
                        "variant-picker": true
                    },
                    attrs: {},
                    hook: {
                        insert: function (vnode) {
                            $(vnode.elm).selectpicker();
                        },
                        destroy: function (vnode) {
                            $(vnode.elm).selectpicker("destroy");
                        },
                        postpatch: function (oldVnode, vnode) {
                            setTimeout(function () {
                                // Q: why can't we just do selectpicker(refresh) here?
                                // A: selectpicker has mental problems
                                $(vnode.elm).selectpicker("destroy");
                                $(vnode.elm).selectpicker();
                            });
                        }
                    },
                    on: {
                        change: function (ev) { return update({ fontVariant: ev.target.value }); }
                    }
                }, selectedFamily.variants.map(function (v) {
                    return h("option", {
                        attrs: {
                            selected: v === block.fontVariant,
                            value: v,
                            "data-container": "body",
                            "data-content": "<span style=\"" + FontHelpers.getStyleString(selectedFamily.family, v, _this.previewFontSize) + "\">" + v + "</span>"
                        }
                    }, [v]);
                })));
            }
            return h("div", {
                class: { "font-picker": true }
            }, elements);
        };
        return FontPicker;
    }());
    SketchEditor.FontPicker = FontPicker;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var HelpDialog = (function () {
        function HelpDialog(container, store) {
            var _this = this;
            this.store = store;
            var outer = $(container);
            outer.append("<h3>Getting started</h3>");
            store.state.showHelp ? outer.show() : outer.hide();
            $.get("content/help.html", function (d) {
                var close = $("<button class='btn btn-default'> Close </button>");
                close.on("click", function (ev) {
                    _this.store.actions.editor.toggleHelp.dispatch();
                });
                outer.append($(d))
                    .append(close)
                    .append("<a class='right' href='mailto:fiddlesticks@codeflight.io'>Email us</a>");
            });
            store.events.editor.showHelpChanged.sub(function (show) {
                show ? outer.show() : outer.hide();
            });
        }
        return HelpDialog;
    }());
    SketchEditor.HelpDialog = HelpDialog;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var SelectedItemEditor = (function () {
        function SelectedItemEditor(container, store) {
            var dom$ = store.events.sketch.editingItemChanged.observe()
                .map(function (i) {
                var posItem = i.data;
                var block = posItem
                    && posItem.itemType === 'TextBlock'
                    && _.find(store.state.sketch.textBlocks, function (b) { return b._id === posItem.itemId; });
                if (!block) {
                    return h('div#editorOverlay', {
                        style: {
                            display: "none"
                        }
                    });
                }
                return h('div#editorOverlay', {
                    style: {
                        // left: posItem.clientX + "px",
                        // top: posItem.clientY + "px",
                        "z-index": 1
                    }
                }, [
                    new SketchEditor.TextBlockEditor(store).render(block)
                ]);
            });
            ReactiveDom.renderStream(dom$, container);
        }
        return SelectedItemEditor;
    }());
    SketchEditor.SelectedItemEditor = SelectedItemEditor;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var TextBlockEditor = (function (_super) {
        __extends(TextBlockEditor, _super);
        function TextBlockEditor(store) {
            _super.call(this);
            this.store = store;
        }
        TextBlockEditor.prototype.render = function (textBlock) {
            var _this = this;
            var update = function (tb) {
                tb._id = textBlock._id;
                _this.store.actions.textBlock.updateAttr.dispatch(tb);
            };
            return h("div.text-block-editor", {
                key: textBlock._id
            }, [
                h("textarea", {
                    attrs: {},
                    props: {
                        value: textBlock.text
                    },
                    on: {
                        keypress: function (ev) {
                            if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                                ev.preventDefault();
                                update({ text: ev.target.value });
                            }
                        },
                        change: function (ev) { return update({ text: ev.target.value }); }
                    }
                }),
                h("div", {}, [
                    h("div.font-color-icon.fore", {}, "A"),
                    h("input.text-color", {
                        attrs: {
                            type: "text"
                        },
                        props: {
                            title: "Text color",
                            value: textBlock.textColor
                        },
                        hook: {
                            insert: function (vnode) {
                                return SketchEditor.ColorPicker.setup(vnode.elm, SketchEditor.SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) { return update({ textColor: color && color.toHexString() }); });
                            },
                            destroy: function (vnode) { return SketchEditor.ColorPicker.destroy(vnode.elm); }
                        }
                    })
                ]),
                h("div", {}, [
                    h("div.font-color-icon.back", {}, "A"),
                    h("input.background-color", {
                        attrs: {
                            type: "text"
                        },
                        props: {
                            title: "Background color",
                            value: textBlock.backgroundColor
                        },
                        hook: {
                            insert: function (vnode) {
                                return SketchEditor.ColorPicker.setup(vnode.elm, SketchEditor.SketchHelpers.colorsInUse(_this.store.state.sketch), function (color) { return update({ backgroundColor: color && color.toHexString() }); });
                            },
                            destroy: function (vnode) { return SketchEditor.ColorPicker.destroy(vnode.elm); }
                        }
                    })
                ]),
                h("button.delete-textblock.btn.btn-danger", {
                    type: "button",
                    props: {
                        title: "Delete"
                    },
                    on: {
                        click: function (e) { return _this.store.actions.textBlock.remove.dispatch(textBlock); }
                    }
                }, [
                    h("span.glyphicon.glyphicon-trash")
                ]),
                h("div.font-picker-container", {
                    hook: {
                        insert: function (vnode) {
                            return new SketchEditor.FontPicker(vnode.elm, _this.store, textBlock);
                        }
                    }
                }, []),
            ]);
        };
        return TextBlockEditor;
    }(Component));
    SketchEditor.TextBlockEditor = TextBlockEditor;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var DualBoundsPathWarp = (function (_super) {
        __extends(DualBoundsPathWarp, _super);
        function DualBoundsPathWarp(source, bounds, customStyle) {
            var _this = this;
            _super.call(this);
            // -- build children --
            this._source = source;
            this._source.remove();
            if (bounds) {
                this._upper = new SketchEditor.StretchPath(bounds.upper);
                this._lower = new SketchEditor.StretchPath(bounds.lower);
            }
            else {
                this._upper = new SketchEditor.StretchPath([
                    new paper.Segment(source.bounds.topLeft),
                    new paper.Segment(source.bounds.topRight)
                ]);
                this._lower = new SketchEditor.StretchPath([
                    new paper.Segment(source.bounds.bottomLeft),
                    new paper.Segment(source.bounds.bottomRight)
                ]);
            }
            this.controlBoundsOpacity = 0.75;
            this._upper.visible = this.selected;
            this._lower.visible = this.selected;
            this._outline = new paper.Path({ closed: true });
            this.updateOutlineShape();
            this._warped = new paper.CompoundPath(source.pathData);
            this.updateWarped();
            // -- add children --
            this.addChildren([this._outline, this._warped, this._upper, this._lower]);
            // -- assign style --
            this.customStyle = customStyle || {
                strokeColor: "gray"
            };
            // -- set up observers --
            Rx.Observable.merge(this._upper.pathChanged.observe(), this._lower.pathChanged.observe())
                .debounce(DualBoundsPathWarp.UPDATE_DEBOUNCE)
                .subscribe(function (path) {
                _this.updateOutlineShape();
                _this.updateWarped();
                _this._changed(PaperNotify.ChangeFlag.GEOMETRY);
            });
            this.subscribe(function (flags) {
                if (flags & PaperNotify.ChangeFlag.ATTRIBUTE) {
                    if (_this._upper.visible !== _this.selected) {
                        _this._upper.visible = _this.selected;
                        _this._lower.visible = _this.selected;
                    }
                }
            });
        }
        Object.defineProperty(DualBoundsPathWarp.prototype, "upper", {
            get: function () {
                return this._upper.path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DualBoundsPathWarp.prototype, "lower", {
            get: function () {
                return this._lower.path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DualBoundsPathWarp.prototype, "source", {
            set: function (value) {
                if (value) {
                    this._source && this._source.remove();
                    this._source = value;
                    this.updateWarped();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DualBoundsPathWarp.prototype, "customStyle", {
            get: function () {
                return this._customStyle;
            },
            set: function (value) {
                this._customStyle = value;
                this._warped.style = value;
                if (value.backgroundColor) {
                    this._outline.fillColor = value.backgroundColor;
                    this._outline.opacity = 1;
                }
                else {
                    this._outline.fillColor = "white";
                    this._outline.opacity = 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DualBoundsPathWarp.prototype, "controlBoundsOpacity", {
            set: function (value) {
                this._upper.opacity = this._lower.opacity = value;
            },
            enumerable: true,
            configurable: true
        });
        DualBoundsPathWarp.prototype.outlineContains = function (point) {
            return this._outline.contains(point);
        };
        DualBoundsPathWarp.prototype.updateWarped = function () {
            var orthOrigin = this._source.bounds.topLeft;
            var orthWidth = this._source.bounds.width;
            var orthHeight = this._source.bounds.height;
            var projection = PaperHelpers.dualBoundsPathProjection(this._upper.path, this._lower.path);
            var transform = new FontShape.PathTransform(function (point) {
                if (!point) {
                    return point;
                }
                var relative = point.subtract(orthOrigin);
                var unit = new paper.Point(relative.x / orthWidth, relative.y / orthHeight);
                var projected = projection(unit);
                return projected;
            });
            var newPaths = this._source.children
                .map(function (item) {
                var path = item;
                var xPoints = PaperHelpers.tracePathAsPoints(path, DualBoundsPathWarp.POINTS_PER_PATH)
                    .map(function (p) { return transform.transformPoint(p); });
                var xPath = new paper.Path({
                    segments: xPoints,
                    closed: true,
                    clockwise: path.clockwise
                });
                //xPath.simplify();
                return xPath;
            });
            this._warped.removeChildren();
            this._warped.addChildren(newPaths);
        };
        DualBoundsPathWarp.prototype.updateOutlineShape = function () {
            var lower = new paper.Path(this._lower.path.segments);
            lower.reverse();
            this._outline.segments = this._upper.path.segments.concat(lower.segments);
            lower.remove();
        };
        DualBoundsPathWarp.POINTS_PER_PATH = 200;
        DualBoundsPathWarp.UPDATE_DEBOUNCE = 150;
        return DualBoundsPathWarp;
    }(paper.Group));
    SketchEditor.DualBoundsPathWarp = DualBoundsPathWarp;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var PathHandle = (function (_super) {
        __extends(PathHandle, _super);
        function PathHandle(attach) {
            var _this = this;
            _super.call(this);
            this._curveSplit = new ObservableEvent();
            var position;
            var path;
            if (attach instanceof paper.Segment) {
                this._segment = attach;
                position = this._segment.point;
                path = this._segment.path;
            }
            else if (attach instanceof paper.Curve) {
                this._curve = attach;
                position = this._curve.getPointAt(this._curve.length * 0.5);
                path = this._curve.path;
            }
            else {
                throw "attach must be Segment or Curve";
            }
            this._marker = paper.Shape.Circle(position, PathHandle.SEGMENT_MARKER_RADIUS);
            this._marker.strokeColor = "blue";
            this._marker.fillColor = "white";
            this._marker.selectedColor = new paper.Color(0, 0);
            this.addChild(this._marker);
            if (this._segment) {
                this.styleAsSegment();
            }
            else {
                this.styleAsCurve();
            }
            paperExt.extendMouseEvents(this);
            this.on(paperExt.EventType.mouseDragStart, function (ev) {
                if (_this._curve) {
                    // split the curve, pupate to segment handle
                    _this._curveChangeUnsub();
                    _this._segment = new paper.Segment(_this.center);
                    var curveIdx = _this._curve.index;
                    _this._curve.path.insert(curveIdx + 1, _this._segment);
                    _this._curve = null;
                    _this.styleAsSegment();
                    _this.curveSplit.notify(curveIdx);
                }
            });
            this.on(paper.EventType.mouseDrag, function (ev) {
                if (_this._segment) {
                    _this._segment.point = _this.center;
                    if (_this._smoothed) {
                        _this._segment.smooth();
                    }
                }
                _this.translate(ev.delta);
                ev.stop();
            });
            this.on(paper.EventType.click, function (ev) {
                if (_this._segment) {
                    _this.smoothed = !_this.smoothed;
                }
                ev.stop();
            });
            this._curveChangeUnsub = path.subscribe(function (flags) {
                if (_this._curve && !_this._segment
                    && (flags & PaperNotify.ChangeFlag.SEGMENTS)) {
                    _this.center = _this._curve.getPointAt(_this._curve.length * 0.5);
                }
            });
        }
        Object.defineProperty(PathHandle.prototype, "smoothed", {
            get: function () {
                return this._smoothed;
            },
            set: function (value) {
                this._smoothed = value;
                if (value) {
                    this._segment.smooth();
                }
                else {
                    this._segment.handleIn = null;
                    this._segment.handleOut = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathHandle.prototype, "curveSplit", {
            get: function () {
                return this._curveSplit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathHandle.prototype, "center", {
            get: function () {
                return this.position;
            },
            set: function (point) {
                this.position = point;
            },
            enumerable: true,
            configurable: true
        });
        PathHandle.prototype.styleAsSegment = function () {
            this._marker.opacity = 0.8;
            this._marker.dashArray = null;
            this._marker.radius = PathHandle.SEGMENT_MARKER_RADIUS;
        };
        PathHandle.prototype.styleAsCurve = function () {
            this._marker.opacity = 0.8;
            this._marker.dashArray = [2, 2];
            this._marker.radius = PathHandle.CURVE_MARKER_RADIUS;
        };
        PathHandle.SEGMENT_MARKER_RADIUS = 10;
        PathHandle.CURVE_MARKER_RADIUS = 6;
        PathHandle.DRAG_THRESHOLD = 3;
        return PathHandle;
    }(paper.Group));
    SketchEditor.PathHandle = PathHandle;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var StretchPath = (function (_super) {
        __extends(StretchPath, _super);
        function StretchPath(segments, style) {
            _super.call(this);
            this._pathChanged = new ObservableEvent();
            this._path = new paper.Path(segments);
            this.addChild(this._path);
            if (style) {
                this._path.style = style;
            }
            else {
                this._path.strokeColor = "lightgray";
                this._path.strokeWidth = 6;
            }
            for (var _i = 0, _a = this._path.segments; _i < _a.length; _i++) {
                var s = _a[_i];
                this.addSegmentHandle(s);
            }
            for (var _b = 0, _c = this._path.curves; _b < _c.length; _b++) {
                var c = _c[_b];
                this.addCurveHandle(c);
            }
        }
        Object.defineProperty(StretchPath.prototype, "path", {
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StretchPath.prototype, "pathChanged", {
            get: function () {
                return this._pathChanged;
            },
            enumerable: true,
            configurable: true
        });
        StretchPath.prototype.addSegmentHandle = function (segment) {
            this.addHandle(new SketchEditor.PathHandle(segment));
        };
        StretchPath.prototype.addCurveHandle = function (curve) {
            var _this = this;
            var handle = new SketchEditor.PathHandle(curve);
            handle.curveSplit.subscribeOne(function (curveIdx) {
                _this.addCurveHandle(_this._path.curves[curveIdx]);
                _this.addCurveHandle(_this._path.curves[curveIdx + 1]);
            });
            this.addHandle(handle);
        };
        StretchPath.prototype.addHandle = function (handle) {
            var _this = this;
            handle.visible = this.visible;
            handle.on(paper.EventType.mouseDrag, function (ev) {
                _this._pathChanged.notify(_this._path);
            });
            handle.on(paper.EventType.click, function (ev) {
                _this._pathChanged.notify(_this._path);
            });
            this.addChild(handle);
        };
        return StretchPath;
    }(paper.Group));
    SketchEditor.StretchPath = StretchPath;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    /**
     * Measures offsets of text glyphs.
     */
    var TextRuler = (function () {
        function TextRuler() {
        }
        TextRuler.prototype.createPointText = function (text) {
            var pointText = new paper.PointText();
            pointText.content = text;
            pointText.justification = "center";
            if (this.fontFamily) {
                pointText.fontFamily = this.fontFamily;
            }
            if (this.fontWeight) {
                pointText.fontWeight = this.fontWeight;
            }
            if (this.fontSize) {
                pointText.fontSize = this.fontSize;
            }
            return pointText;
        };
        TextRuler.prototype.getTextOffsets = function (text) {
            // Measure glyphs in pairs to capture white space.
            // Pairs are characters i and i+1.
            var glyphPairs = [];
            for (var i = 0; i < text.length; i++) {
                glyphPairs[i] = this.createPointText(text.substring(i, i + 1));
            }
            // For each character, find center offset.
            var xOffsets = [0];
            for (var i = 1; i < text.length; i++) {
                // Measure three characters at a time to get the appropriate 
                //   space before and after the glyph.
                var triadText = this.createPointText(text.substring(i - 1, i + 1));
                triadText.remove();
                // Subtract out half of prior glyph pair 
                //   and half of current glyph pair.
                // Must be right, because it works.
                var offsetWidth = triadText.bounds.width
                    - glyphPairs[i - 1].bounds.width / 2
                    - glyphPairs[i].bounds.width / 2;
                // Add offset width to prior offset. 
                xOffsets[i] = xOffsets[i - 1] + offsetWidth;
            }
            for (var _i = 0, glyphPairs_1 = glyphPairs; _i < glyphPairs_1.length; _i++) {
                var glyphPair = glyphPairs_1[_i];
                glyphPair.remove();
            }
            return xOffsets;
        };
        return TextRuler;
    }());
    SketchEditor.TextRuler = TextRuler;
})(SketchEditor || (SketchEditor = {}));
var SketchEditor;
(function (SketchEditor) {
    var TextWarp = (function (_super) {
        __extends(TextWarp, _super);
        function TextWarp(font, text, bounds, fontSize, style) {
            if (!fontSize) {
                fontSize = TextWarp.DEFAULT_FONT_SIZE;
            }
            var pathData = TextWarp.getPathData(font, text, fontSize);
            var path = new paper.CompoundPath(pathData);
            _super.call(this, path, bounds, style);
            this._font = font;
            this._text = text;
        }
        Object.defineProperty(TextWarp.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                this.updateTextPath();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextWarp.prototype, "fontSize", {
            get: function () {
                return this._fontSize;
            },
            set: function (value) {
                if (!value) {
                    return;
                }
                this._fontSize = value;
                this.updateTextPath();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextWarp.prototype, "font", {
            set: function (value) {
                if (value !== this._font) {
                    this._font = value;
                    this.updateTextPath();
                }
            },
            enumerable: true,
            configurable: true
        });
        TextWarp.prototype.updateTextPath = function () {
            var pathData = TextWarp.getPathData(this._font, this._text, this._fontSize);
            this.source = new paper.CompoundPath(pathData);
        };
        TextWarp.getPathData = function (font, text, fontSize) {
            var openTypePath = font.getPath(text, 0, 0, Number(fontSize) || TextWarp.DEFAULT_FONT_SIZE);
            return openTypePath.toPathData();
        };
        TextWarp.DEFAULT_FONT_SIZE = 128;
        return TextWarp;
    }(SketchEditor.DualBoundsPathWarp));
    SketchEditor.TextWarp = TextWarp;
})(SketchEditor || (SketchEditor = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9Eb21IZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0ZvbnRIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL0hlbHBlcnMudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvVHlwZWRDaGFubmVsLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2NvbGxlY3Rpb25zLnRzIiwiLi4vLi4vY2xpZW50L19fZnJhbWV3b3JrL2V2ZW50cy50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9ib290c2NyaXB0L2Jvb3RzY3JpcHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvUGFwZXJOb3RpZnkudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvVmlld1pvb20udHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvcGFwZXIvbW91c2VFdmVudEV4dC50cyIsIi4uLy4uL2NsaWVudC9fX2ZyYW1ld29yay9wYXBlci9wYXBlci1leHQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9Db21wb25lbnQudHMiLCIuLi8uLi9jbGllbnQvX19mcmFtZXdvcmsvdmRvbS9WRG9tSGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwQ29va2llcy50cyIsIi4uLy4uL2NsaWVudC9hcHAvQXBwTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L2FwcC9BcHBSb3V0ZXIudHMiLCIuLi8uLi9jbGllbnQvYXBwL1N0b3JlLnRzIiwiLi4vLi4vY2xpZW50L2RlbW8vRGVtb01vZHVsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hCdWlsZGVyL0J1aWxkZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9Nb2R1bGUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9QcmV2aWV3Q2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvUmVuZGVyQ2FudmFzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvU3RvcmUudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9tb2RlbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoQnVpbGRlci9jb250cm9scy9DaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvSW1hZ2VDaG9vc2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvY29udHJvbHMvVGV4dElucHV0LnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEJ1aWxkZXIvdGVtcGxhdGVzL0RpY2tlbnMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL0RvY3VtZW50S2V5SGFuZGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvU2tldGNoRWRpdG9yTW9kdWxlLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9Ta2V0Y2hIZWxwZXJzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9TdG9yZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvV29ya3NwYWNlQ29udHJvbGxlci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvY2hhbm5lbHMudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL2NvbnN0YW50cy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3IvbW9kZWxzLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci9zZXJ2aWNlcy9Gb250SGVscGVycy50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivc2VydmljZXMvUzNBY2Nlc3MudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0NvbG9yUGlja2VyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci92aWV3cy9FZGl0b3JCYXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0ZvbnRQaWNrZXIudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL0hlbHBEaWFsb2cudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3ZpZXdzL1NlbGVjdGVkSXRlbUVkaXRvci50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivdmlld3MvVGV4dEJsb2NrRWRpdG9yLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvRHVhbEJvdW5kc1BhdGhXYXJwLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvUGF0aEhhbmRsZS50cyIsIi4uLy4uL2NsaWVudC9za2V0Y2hFZGl0b3Ivd29ya3NwYWNlL1N0cmV0Y2hQYXRoLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvVGV4dFJ1bGVyLnRzIiwiLi4vLi4vY2xpZW50L3NrZXRjaEVkaXRvci93b3Jrc3BhY2UvVGV4dFdhcnAudHMiLCIuLi8uLi9jbGllbnQvc2tldGNoRWRpdG9yL3dvcmtzcGFjZS9pbnRlcmZhY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsSUFBVSxVQUFVLENBd0xuQjtBQXhMRCxXQUFVLFVBQVUsRUFBQyxDQUFDO0lBRWxCOzs7Ozs7T0FNRztJQUNILHVCQUE4QixPQUFPO1FBQ2pDLElBQUksYUFBYSxHQUFHLFVBQVUsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxHQUFHLEdBQUcs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RSxDQUFDO1FBQ1osR0FBRyxFQUFFLENBQUM7UUFDTixLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxFQUFFO1FBQ1QsSUFBSSxFQUFFLEVBQUU7UUFDUixHQUFHLEVBQUUsRUFBRTtRQUNQLFVBQVUsRUFBRSxFQUFFO1FBQ2QsUUFBUSxFQUFFLEVBQUU7UUFDWixHQUFHLEVBQUUsRUFBRTtRQUNQLE1BQU0sRUFBRSxFQUFFO1FBQ1YsUUFBUSxFQUFFLEVBQUU7UUFDWixHQUFHLEVBQUUsRUFBRTtRQUNQLElBQUksRUFBRSxFQUFFO1FBQ1IsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsRUFBRTtRQUNYLFVBQVUsRUFBRSxFQUFFO1FBQ2QsU0FBUyxFQUFFLEVBQUU7UUFDYixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7UUFDVixDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxFQUFFO1FBQ0wsQ0FBQyxFQUFFLEVBQUU7UUFDTCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFB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QUMsRUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDckMsQ0FBQztRQWpFTSwwQkFBaUIsR0FBRyxHQUFHLENBQUM7UUFrRW5DLGVBQUM7SUFBRCxDQUFDLEFBcEVELENBQThCLCtCQUFrQixHQW9FL0M7SUFwRVkscUJBQVEsV0FvRXBCLENBQUE7QUFFTCxDQUFDLEVBeEVTLFlBQVksS0FBWixZQUFZLFFBd0VyQjtBQ2xFQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5uYW1lc3BhY2UgRG9tSGVscGVycyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgYmxvYiBmcm9tIGEgZGF0YSBVUkwgKGVpdGhlciBiYXNlNjQgZW5jb2RlZCBvciBub3QpLlxyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2ViaWRlbC9maWxlci5qcy9ibG9iL21hc3Rlci9zcmMvZmlsZXIuanMjTDEzN1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhVVJMIFRoZSBkYXRhIFVSTCB0byBjb252ZXJ0LlxyXG4gICAgICogQHJldHVybiB7QmxvYn0gQSBibG9iIHJlcHJlc2VudGluZyB0aGUgYXJyYXkgYnVmZmVyIGRhdGEuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkYXRhVVJMVG9CbG9iKGRhdGFVUkwpOiBCbG9iIHtcclxuICAgICAgICB2YXIgQkFTRTY0X01BUktFUiA9ICc7YmFzZTY0LCc7XHJcbiAgICAgICAgaWYgKGRhdGFVUkwuaW5kZXhPZihCQVNFNjRfTUFSS0VSKSA9PSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgcGFydHMgPSBkYXRhVVJMLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHBhcnRzWzBdLnNwbGl0KCc6JylbMV07XHJcbiAgICAgICAgICAgIHZhciByYXcgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCbG9iKFtyYXddLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdChCQVNFNjRfTUFSS0VSKTtcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBwYXJ0c1swXS5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgIHZhciByYXcgPSB3aW5kb3cuYXRvYihwYXJ0c1sxXSk7XHJcbiAgICAgICAgdmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHZhciB1SW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB1SW50OEFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoW3VJbnQ4QXJyYXldLCB7IHR5cGU6IGNvbnRlbnRUeXBlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0RXJyb3JIYW5kbGVyKGxvZ2dlcjogKGVycm9yRGF0YTogT2JqZWN0KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbmVycm9yID0gZnVuY3Rpb24obXNnLCBmaWxlLCBsaW5lLCBjb2wsIGVycm9yOiBFcnJvciB8IHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHN0YWNrZnJhbWVzID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBtc2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiBmaWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogY29sLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IHN0YWNrZnJhbWVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIoZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gbG9nIGVycm9yXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyYmFjayA9IGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKDxzdHJpbmc+ZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFzRXJyb3IgPSB0eXBlb2YgZXJyb3IgPT09IFwic3RyaW5nXCJcclxuICAgICAgICAgICAgICAgICAgICA/IG5ldyBFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgICAgICAgICA6IGVycm9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tUcmFjZS5mcm9tRXJyb3IoYXNFcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyYmFjayk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZhaWxlZCB0byBsb2cgZXJyb3JcIiwgZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjb25zdCBLZXlDb2RlcyA9IHtcclxuICAgICAgICBCYWNrU3BhY2U6IDgsXHJcbiAgICAgICAgVGFiOiA5LFxyXG4gICAgICAgIEVudGVyOiAxMyxcclxuICAgICAgICBTaGlmdDogMTYsXHJcbiAgICAgICAgQ3RybDogMTcsXHJcbiAgICAgICAgQWx0OiAxOCxcclxuICAgICAgICBQYXVzZUJyZWFrOiAxOSxcclxuICAgICAgICBDYXBzTG9jazogMjAsXHJcbiAgICAgICAgRXNjOiAyNyxcclxuICAgICAgICBQYWdlVXA6IDMzLFxyXG4gICAgICAgIFBhZ2VEb3duOiAzNCxcclxuICAgICAgICBFbmQ6IDM1LFxyXG4gICAgICAgIEhvbWU6IDM2LFxyXG4gICAgICAgIEFycm93TGVmdDogMzcsXHJcbiAgICAgICAgQXJyb3dVcDogMzgsXHJcbiAgICAgICAgQXJyb3dSaWdodDogMzksXHJcbiAgICAgICAgQXJyb3dEb3duOiA0MCxcclxuICAgICAgICBJbnNlcnQ6IDQ1LFxyXG4gICAgICAgIERlbGV0ZTogNDYsXHJcbiAgICAgICAgRGlnaXQwOiA0OCxcclxuICAgICAgICBEaWdpdDE6IDQ5LFxyXG4gICAgICAgIERpZ2l0MjogNTAsXHJcbiAgICAgICAgRGlnaXQzOiA1MSxcclxuICAgICAgICBEaWdpdDQ6IDUyLFxyXG4gICAgICAgIERpZ2l0NTogNTMsXHJcbiAgICAgICAgRGlnaXQ2OiA1NCxcclxuICAgICAgICBEaWdpdDc6IDU1LFxyXG4gICAgICAgIERpZ2l0ODogNTYsXHJcbiAgICAgICAgRGlnaXQ5OiA1NyxcclxuICAgICAgICBBOiA2NSxcclxuICAgICAgICBCOiA2NixcclxuICAgICAgICBDOiA2NyxcclxuICAgICAgICBEOiA2OCxcclxuICAgICAgICBFOiA2OSxcclxuICAgICAgICBGOiA3MCxcclxuICAgICAgICBHOiA3MSxcclxuICAgICAgICBIOiA3MixcclxuICAgICAgICBJOiA3MyxcclxuICAgICAgICBKOiA3NCxcclxuICAgICAgICBLOiA3NSxcclxuICAgICAgICBMOiA3NixcclxuICAgICAgICBNOiA3NyxcclxuICAgICAgICBOOiA3OCxcclxuICAgICAgICBPOiA3OSxcclxuICAgICAgICBQOiA4MCxcclxuICAgICAgICBROiA4MSxcclxuICAgICAgICBSOiA4MixcclxuICAgICAgICBTOiA4MyxcclxuICAgICAgICBUOiA4NCxcclxuICAgICAgICBVOiA4NSxcclxuICAgICAgICBWOiA4NixcclxuICAgICAgICBXOiA4NyxcclxuICAgICAgICBYOiA4OCxcclxuICAgICAgICBZOiA4OSxcclxuICAgICAgICBaOiA5MCxcclxuICAgICAgICBXaW5kb3dMZWZ0OiA5MSxcclxuICAgICAgICBXaW5kb3dSaWdodDogOTIsXHJcbiAgICAgICAgU2VsZWN0S2V5OiA5MyxcclxuICAgICAgICBOdW1wYWQwOiA5NixcclxuICAgICAgICBOdW1wYWQxOiA5NyxcclxuICAgICAgICBOdW1wYWQyOiA5OCxcclxuICAgICAgICBOdW1wYWQzOiA5OSxcclxuICAgICAgICBOdW1wYWQ0OiAxMDAsXHJcbiAgICAgICAgTnVtcGFkNTogMTAxLFxyXG4gICAgICAgIE51bXBhZDY6IDEwMixcclxuICAgICAgICBOdW1wYWQ3OiAxMDMsXHJcbiAgICAgICAgTnVtcGFkODogMTA0LFxyXG4gICAgICAgIE51bXBhZDk6IDEwNSxcclxuICAgICAgICBNdWx0aXBseTogMTA2LFxyXG4gICAgICAgIEFkZDogMTA3LFxyXG4gICAgICAgIFN1YnRyYWN0OiAxMDksXHJcbiAgICAgICAgRGVjaW1hbFBvaW50OiAxMTAsXHJcbiAgICAgICAgRGl2aWRlOiAxMTEsXHJcbiAgICAgICAgRjE6IDExMixcclxuICAgICAgICBGMjogMTEzLFxyXG4gICAgICAgIEYzOiAxMTQsXHJcbiAgICAgICAgRjQ6IDExNSxcclxuICAgICAgICBGNTogMTE2LFxyXG4gICAgICAgIEY2OiAxMTcsXHJcbiAgICAgICAgRjc6IDExOCxcclxuICAgICAgICBGODogMTE5LFxyXG4gICAgICAgIEY5OiAxMjAsXHJcbiAgICAgICAgRjEwOiAxMjEsXHJcbiAgICAgICAgRjExOiAxMjIsXHJcbiAgICAgICAgRjEyOiAxMjMsXHJcbiAgICAgICAgTnVtTG9jazogMTQ0LFxyXG4gICAgICAgIFNjcm9sbExvY2s6IDE0NSxcclxuICAgICAgICBTZW1pQ29sb246IDE4NixcclxuICAgICAgICBFcXVhbDogMTg3LFxyXG4gICAgICAgIENvbW1hOiAxODgsXHJcbiAgICAgICAgRGFzaDogMTg5LFxyXG4gICAgICAgIFBlcmlvZDogMTkwLFxyXG4gICAgICAgIEZvcndhcmRTbGFzaDogMTkxLFxyXG4gICAgICAgIEdyYXZlQWNjZW50OiAxOTIsXHJcbiAgICAgICAgQnJhY2tldE9wZW46IDIxOSxcclxuICAgICAgICBCYWNrU2xhc2g6IDIyMCxcclxuICAgICAgICBCcmFja2V0Q2xvc2U6IDIyMSxcclxuICAgICAgICBTaW5nbGVRdW90ZTogMjIyXHJcbiAgICB9O1xyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgRm9udEhlbHBlcnMge1xyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVsZW1lbnRGb250U3R5bGUge1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFdlaWdodD86IHN0cmluZztcclxuICAgICAgICBmb250U3R5bGU/OiBzdHJpbmc7IFxyXG4gICAgICAgIGZvbnRTaXplPzogc3RyaW5nOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENzc1N0eWxlKGZhbWlseTogc3RyaW5nLCB2YXJpYW50OiBzdHJpbmcsIHNpemU/OiBzdHJpbmcpe1xyXG4gICAgICAgIGxldCBzdHlsZSA9IDxFbGVtZW50Rm9udFN0eWxlPnsgZm9udEZhbWlseTogZmFtaWx5IH07XHJcbiAgICAgICAgaWYodmFyaWFudCAmJiB2YXJpYW50LmluZGV4T2YoXCJpdGFsaWNcIikgPj0gMCl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBudW1lcmljID0gdmFyaWFudCAmJiB2YXJpYW50LnJlcGxhY2UoL1teXFxkXS9nLCBcIlwiKTtcclxuICAgICAgICBpZihudW1lcmljICYmIG51bWVyaWMubGVuZ3RoKXtcclxuICAgICAgICAgICAgc3R5bGUuZm9udFdlaWdodCA9IG51bWVyaWMudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2l6ZSl7XHJcbiAgICAgICAgICAgIHN0eWxlLmZvbnRTaXplID0gc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVTdHJpbmcoZmFtaWx5OiBzdHJpbmcsIHZhcmlhbnQ6IHN0cmluZywgc2l6ZT86IHN0cmluZykge1xyXG4gICAgICAgIGxldCBzdHlsZU9iaiA9IGdldENzc1N0eWxlKGZhbWlseSwgdmFyaWFudCwgc2l6ZSk7XHJcbiAgICAgICAgbGV0IHBhcnRzID0gW107XHJcbiAgICAgICAgaWYoc3R5bGVPYmouZm9udEZhbWlseSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtZmFtaWx5Oicke3N0eWxlT2JqLmZvbnRGYW1pbHl9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250V2VpZ2h0KXtcclxuICAgICAgICAgICAgcGFydHMucHVzaChgZm9udC13ZWlnaHQ6JHtzdHlsZU9iai5mb250V2VpZ2h0fWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250U3R5bGUpe1xyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGBmb250LXN0eWxlOiR7c3R5bGVPYmouZm9udFN0eWxlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdHlsZU9iai5mb250U2l6ZSl7XHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goYGZvbnQtc2l6ZToke3N0eWxlT2JqLmZvbnRTaXplfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIjsgXCIpO1xyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcclxuZnVuY3Rpb24gbG9ndGFwPFQ+KG1lc3NhZ2U6IHN0cmluZywgc3RyZWFtOiBSeC5PYnNlcnZhYmxlPFQ+KTogUnguT2JzZXJ2YWJsZTxUPntcclxuICAgIHJldHVybiBzdHJlYW0udGFwKHQgPT4gY29uc29sZS5sb2cobWVzc2FnZSwgdCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXdpZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpLmdldFRpbWUoKSArIE1hdGgucmFuZG9tKCkpXHJcbiAgICAgICAgLnRvU3RyaW5nKDM2KS5yZXBsYWNlKCcuJywgJycpO1xyXG59XHJcbiIsIlxyXG5uYW1lc3BhY2UgVHlwZWRDaGFubmVsIHtcclxuXHJcbiAgICAvLyAtLS0gQ29yZSB0eXBlcyAtLS1cclxuXHJcbiAgICB0eXBlIFNlcmlhbGl6YWJsZSA9IE9iamVjdCB8IEFycmF5PGFueT4gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFuIHwgRGF0ZSB8IHZvaWQ7XHJcblxyXG4gICAgdHlwZSBWYWx1ZSA9IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW4gfCBEYXRlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZTxURGF0YSBleHRlbmRzIFNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBkYXRhPzogVERhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZSBJU3ViamVjdDxUPiA9IFJ4Lk9ic2VydmVyPFQ+ICYgUnguT2JzZXJ2YWJsZTxUPjtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbFRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIGNoYW5uZWw6IElTdWJqZWN0PE1lc3NhZ2U8VERhdGE+PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY2hhbm5lbDogSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1YnNjcmliZShvYnNlcnZlcjogKG1lc3NhZ2U6IE1lc3NhZ2U8VERhdGE+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSgpLnN1YnNjcmliZShvYnNlcnZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdWIob2JzZXJ2ZXI6IChkYXRhOiBURGF0YSkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoKS5zdWJzY3JpYmUobSA9PiBvYnNlcnZlcihtLmRhdGEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGlzcGF0Y2goZGF0YT86IFREYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbk5leHQoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9ic2VydmUoKTogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsLmZpbHRlcihtID0+IG0udHlwZSA9PT0gdGhpcy50eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgb2JzZXJ2ZURhdGEoKTogUnguT2JzZXJ2YWJsZTxURGF0YT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yd2FyZChjaGFubmVsOiBDaGFubmVsVG9waWM8VERhdGE+KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlKG0gPT4gY2hhbm5lbC5kaXNwYXRjaChtLmRhdGEpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENoYW5uZWwge1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHN1YmplY3Q6IElTdWJqZWN0PE1lc3NhZ2U8U2VyaWFsaXphYmxlPj47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN1YmplY3Q/OiBJU3ViamVjdDxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+LCB0eXBlPzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3QgfHwgbmV3IFJ4LlN1YmplY3Q8TWVzc2FnZTxTZXJpYWxpemFibGU+PigpO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3Vic2NyaWJlKG9uTmV4dD86ICh2YWx1ZTogTWVzc2FnZTxTZXJpYWxpemFibGU+KSA9PiB2b2lkKTogUnguSURpc3Bvc2FibGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LnN1YnNjcmliZShvbk5leHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb2JzZXJ2ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvcGljPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPih0eXBlOiBzdHJpbmcpIDogQ2hhbm5lbFRvcGljPFREYXRhPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2hhbm5lbFRvcGljPFREYXRhPih0aGlzLnN1YmplY3QgYXMgSVN1YmplY3Q8TWVzc2FnZTxURGF0YT4+LFxyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlID8gdGhpcy50eXBlICsgJy4nICsgdHlwZSA6IHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBtZXJnZVR5cGVkPFREYXRhIGV4dGVuZHMgU2VyaWFsaXphYmxlPiguLi50b3BpY3M6IENoYW5uZWxUb3BpYzxURGF0YT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRvcGljcy5tYXAodCA9PiB0LnR5cGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmZpbHRlcihtID0+IHR5cGVzLmluZGV4T2YobS50eXBlKSA+PSAwICkgYXMgUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFREYXRhPj47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIG1lcmdlKC4uLnRvcGljczogQ2hhbm5lbFRvcGljPFNlcmlhbGl6YWJsZT5bXSkgXHJcbiAgICAgICAgICAgIDogUnguT2JzZXJ2YWJsZTxNZXNzYWdlPFNlcmlhbGl6YWJsZT4+IHtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0b3BpY3MubWFwKHQgPT4gdC50eXBlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ViamVjdC5maWx0ZXIobSA9PiB0eXBlcy5pbmRleE9mKG0udHlwZSkgPj0gMCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiXHJcbnR5cGUgRGljdGlvbmFyeTxUPiA9IF8uRGljdGlvbmFyeTxUPjtcclxuIiwiXHJcbmNsYXNzIE9ic2VydmFibGVFdmVudDxUPiB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3N1YnNjcmliZXJzOiAoKGV2ZW50QXJnOiBUKSA9PiB2b2lkKVtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWJzY3JpYmUgZm9yIG5vdGlmaWNhdGlvbi4gUmV0dXJucyB1bnN1YnNjcmliZSBmdW5jdGlvbi5cclxuICAgICAqLyAgICBcclxuICAgIHN1YnNjcmliZShoYW5kbGVyOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpOiAoKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmKHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKXtcclxuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMudW5zdWJzY3JpYmUoaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVuc3Vic2NyaWJlKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGNhbGxiYWNrLCAwKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvYnNlcnZlKCk6IFJ4Lk9ic2VydmFibGU8VD4ge1xyXG4gICAgICAgIGxldCB1bnN1YjogYW55O1xyXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm48VD4oXHJcbiAgICAgICAgICAgIChoYW5kbGVyVG9BZGQpID0+IHRoaXMuc3Vic2NyaWJlKDwoZXZlbnRBcmc6IFQpID0+IHZvaWQ+aGFuZGxlclRvQWRkKSxcclxuICAgICAgICAgICAgKGhhbmRsZXJUb1JlbW92ZSkgPT4gdGhpcy51bnN1YnNjcmliZSg8KGV2ZW50QXJnOiBUKSA9PiB2b2lkPmhhbmRsZXJUb1JlbW92ZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmb3Igb25lIG5vdGlmaWNhdGlvbi5cclxuICAgICAqL1xyXG4gICAgc3Vic2NyaWJlT25lKGNhbGxiYWNrOiAoZXZlbnRBcmc6IFQpID0+IHZvaWQpe1xyXG4gICAgICAgIGxldCB1bnN1YiA9IHRoaXMuc3Vic2NyaWJlKHQgPT4ge1xyXG4gICAgICAgICAgICB1bnN1YigpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayh0KTsgICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbm90aWZ5KGV2ZW50QXJnOiBUKXtcclxuICAgICAgICBmb3IobGV0IHN1YnNjcmliZXIgb2YgdGhpcy5fc3Vic2NyaWJlcnMpe1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNhbGwodGhpcywgZXZlbnRBcmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBzdWJzY3JpYmVycy5cclxuICAgICAqL1xyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufSIsIlxyXG5uYW1lc3BhY2UgQm9vdFNjcmlwdCB7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNZW51SXRlbSB7XHJcbiAgICAgICAgY29udGVudDogYW55LFxyXG4gICAgICAgIG9wdGlvbnM/OiBPYmplY3RcclxuICAgICAgICAvL29uQ2xpY2s/OiAoKSA9PiB2b2lkXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRyb3Bkb3duKFxyXG4gICAgICAgIGFyZ3M6IHtcclxuICAgICAgICAgICAgaWQ6IHN0cmluZyxcclxuICAgICAgICAgICAgY29udGVudDogYW55LFxyXG4gICAgICAgICAgICBpdGVtczogTWVudUl0ZW1bXVxyXG4gICAgICAgIH0pOiBWTm9kZSB7XHJcblxyXG4gICAgICAgIHJldHVybiBoKFwiZGl2LmRyb3Bkb3duXCIsIFtcclxuICAgICAgICAgICAgaChcImJ1dHRvbi5idG4uYnRuLWRlZmF1bHQuZHJvcGRvd24tdG9nZ2xlXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhdHRyc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhcmdzLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtdG9nZ2xlXCI6IFwiZHJvcGRvd25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuY29udGVudCxcclxuICAgICAgICAgICAgICAgICAgICBoKFwic3Bhbi5jYXJldFwiKVxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgIGgoXCJ1bC5kcm9wZG93bi1tZW51XCIsXHJcbiAgICAgICAgICAgICAgICB7fSxcclxuICAgICAgICAgICAgICAgIGFyZ3MuaXRlbXMubWFwKGl0ZW0gPT5cclxuICAgICAgICAgICAgICAgICAgICBoKFwibGlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKCdhJywgaXRlbS5vcHRpb25zIHx8IHt9LCBbaXRlbS5jb250ZW50XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxudHlwZSBJdGVtQ2hhbmdlSGFuZGxlciA9IChmbGFnczogUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZykgPT4gdm9pZDtcclxudHlwZSBDYWxsYmFjayA9ICgpID0+IHZvaWQ7XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBwYXBlciB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEl0ZW0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFN1YnNjcmliZSB0byBhbGwgY2hhbmdlcyBpbiBpdGVtLiBSZXR1cm5zIHVuLXN1YnNjcmliZSBmdW5jdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdWJzY3JpYmUoaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjaztcclxuICAgICAgICBcclxuICAgICAgICBfY2hhbmdlZChmbGFnczogUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZyk6IHZvaWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBQYXBlck5vdGlmeSB7XHJcblxyXG4gICAgZXhwb3J0IGVudW0gQ2hhbmdlRmxhZyB7XHJcbiAgICAgICAgLy8gQW55dGhpbmcgYWZmZWN0aW5nIHRoZSBhcHBlYXJhbmNlIG9mIGFuIGl0ZW0sIGluY2x1ZGluZyBHRU9NRVRSWSxcclxuICAgICAgICAvLyBTVFJPS0UsIFNUWUxFIGFuZCBBVFRSSUJVVEUgKGV4Y2VwdCBmb3IgdGhlIGludmlzaWJsZSBvbmVzOiBsb2NrZWQsIG5hbWUpXHJcbiAgICAgICAgQVBQRUFSQU5DRSA9IDB4MSxcclxuICAgICAgICAvLyBBIGNoYW5nZSBpbiB0aGUgaXRlbSdzIGNoaWxkcmVuXHJcbiAgICAgICAgQ0hJTERSRU4gPSAweDIsXHJcbiAgICAgICAgLy8gQSBjaGFuZ2Ugb2YgdGhlIGl0ZW0ncyBwbGFjZSBpbiB0aGUgc2NlbmUgZ3JhcGggKHJlbW92ZWQsIGluc2VydGVkLFxyXG4gICAgICAgIC8vIG1vdmVkKS5cclxuICAgICAgICBJTlNFUlRJT04gPSAweDQsXHJcbiAgICAgICAgLy8gSXRlbSBnZW9tZXRyeSAocGF0aCwgYm91bmRzKVxyXG4gICAgICAgIEdFT01FVFJZID0gMHg4LFxyXG4gICAgICAgIC8vIE9ubHkgc2VnbWVudChzKSBoYXZlIGNoYW5nZWQsIGFuZCBhZmZlY3RlZCBjdXJ2ZXMgaGF2ZSBhbHJlYWR5IGJlZW5cclxuICAgICAgICAvLyBub3RpZmllZC4gVGhpcyBpcyB0byBpbXBsZW1lbnQgYW4gb3B0aW1pemF0aW9uIGluIF9jaGFuZ2VkKCkgY2FsbHMuXHJcbiAgICAgICAgU0VHTUVOVFMgPSAweDEwLFxyXG4gICAgICAgIC8vIFN0cm9rZSBnZW9tZXRyeSAoZXhjbHVkaW5nIGNvbG9yKVxyXG4gICAgICAgIFNUUk9LRSA9IDB4MjAsXHJcbiAgICAgICAgLy8gRmlsbCBzdHlsZSBvciBzdHJva2UgY29sb3IgLyBkYXNoXHJcbiAgICAgICAgU1RZTEUgPSAweDQwLFxyXG4gICAgICAgIC8vIEl0ZW0gYXR0cmlidXRlczogdmlzaWJsZSwgYmxlbmRNb2RlLCBsb2NrZWQsIG5hbWUsIG9wYWNpdHksIGNsaXBNYXNrIC4uLlxyXG4gICAgICAgIEFUVFJJQlVURSA9IDB4ODAsXHJcbiAgICAgICAgLy8gVGV4dCBjb250ZW50XHJcbiAgICAgICAgQ09OVEVOVCA9IDB4MTAwLFxyXG4gICAgICAgIC8vIFJhc3RlciBwaXhlbHNcclxuICAgICAgICBQSVhFTFMgPSAweDIwMCxcclxuICAgICAgICAvLyBDbGlwcGluZyBpbiBvbmUgb2YgdGhlIGNoaWxkIGl0ZW1zXHJcbiAgICAgICAgQ0xJUFBJTkcgPSAweDQwMCxcclxuICAgICAgICAvLyBUaGUgdmlldyBoYXMgYmVlbiB0cmFuc2Zvcm1lZFxyXG4gICAgICAgIFZJRVcgPSAweDgwMFxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3J0Y3V0cyB0byBvZnRlbiB1c2VkIENoYW5nZUZsYWcgdmFsdWVzIGluY2x1ZGluZyBBUFBFQVJBTkNFXHJcbiAgICBleHBvcnQgZW51bSBDaGFuZ2VzIHtcclxuICAgICAgICAvLyBDSElMRFJFTiBhbHNvIGNoYW5nZXMgR0VPTUVUUlksIHNpbmNlIHJlbW92aW5nIGNoaWxkcmVuIGZyb20gZ3JvdXBzXHJcbiAgICAgICAgLy8gY2hhbmdlcyBib3VuZHMuXHJcbiAgICAgICAgQ0hJTERSRU4gPSBDaGFuZ2VGbGFnLkNISUxEUkVOIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICAvLyBDaGFuZ2luZyB0aGUgaW5zZXJ0aW9uIGNhbiBjaGFuZ2UgdGhlIGFwcGVhcmFuY2UgdGhyb3VnaCBwYXJlbnQncyBtYXRyaXguXHJcbiAgICAgICAgSU5TRVJUSU9OID0gQ2hhbmdlRmxhZy5JTlNFUlRJT04gfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgR0VPTUVUUlkgPSBDaGFuZ2VGbGFnLkdFT01FVFJZIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNFR01FTlRTID0gQ2hhbmdlRmxhZy5TRUdNRU5UUyB8IENoYW5nZUZsYWcuR0VPTUVUUlkgfCBDaGFuZ2VGbGFnLkFQUEVBUkFOQ0UsXHJcbiAgICAgICAgU1RST0tFID0gQ2hhbmdlRmxhZy5TVFJPS0UgfCBDaGFuZ2VGbGFnLlNUWUxFIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFLFxyXG4gICAgICAgIFNUWUxFID0gQ2hhbmdlRmxhZy5TVFlMRSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBBVFRSSUJVVEUgPSBDaGFuZ2VGbGFnLkFUVFJJQlVURSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBDT05URU5UID0gQ2hhbmdlRmxhZy5DT05URU5UIHwgQ2hhbmdlRmxhZy5HRU9NRVRSWSB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBQSVhFTFMgPSBDaGFuZ2VGbGFnLlBJWEVMUyB8IENoYW5nZUZsYWcuQVBQRUFSQU5DRSxcclxuICAgICAgICBWSUVXID0gQ2hhbmdlRmxhZy5WSUVXIHwgQ2hhbmdlRmxhZy5BUFBFQVJBTkNFXHJcbiAgICB9O1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEluamVjdCBJdGVtLnN1YnNjcmliZVxyXG4gICAgICAgIGNvbnN0IGl0ZW1Qcm90byA9ICg8YW55PnBhcGVyKS5JdGVtLnByb3RvdHlwZTtcclxuICAgICAgICBpdGVtUHJvdG8uc3Vic2NyaWJlID0gZnVuY3Rpb24oaGFuZGxlcjogSXRlbUNoYW5nZUhhbmRsZXIpOiBDYWxsYmFjayB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc3Vic2NyaWJlcnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N1YnNjcmliZXJzLmluZGV4T2YoaGFuZGxlcikgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9zdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIsIDApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXcmFwIEl0ZW0ucmVtb3ZlXHJcbiAgICAgICAgY29uc3QgaXRlbVJlbW92ZSA9IGl0ZW1Qcm90by5yZW1vdmU7XHJcbiAgICAgICAgaXRlbVByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdGVtUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdyYXAgUHJvamVjdC5fY2hhbmdlZFxyXG4gICAgICAgIGNvbnN0IHByb2plY3RQcm90byA9IDxhbnk+cGFwZXIuUHJvamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgY29uc3QgcHJvamVjdENoYW5nZWQgPSBwcm9qZWN0UHJvdG8uX2NoYW5nZWQ7XHJcbiAgICAgICAgcHJvamVjdFByb3RvLl9jaGFuZ2VkID0gZnVuY3Rpb24oZmxhZ3M6IENoYW5nZUZsYWcsIGl0ZW06IHBhcGVyLkl0ZW0pIHtcclxuICAgICAgICAgICAgcHJvamVjdENoYW5nZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnMgPSAoPGFueT5pdGVtKS5fc3Vic2NyaWJlcnM7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3Vicykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHMgb2Ygc3Vicykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzLmNhbGwoaXRlbSwgZmxhZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVzY3JpYmUoZmxhZ3M6IENoYW5nZUZsYWcpIHtcclxuICAgICAgICBsZXQgZmxhZ0xpc3Q6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgXy5mb3JPd24oQ2hhbmdlRmxhZywgKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdmFsdWUpID09PSBcIm51bWJlclwiICYmICh2YWx1ZSAmIGZsYWdzKSkge1xyXG4gICAgICAgICAgICAgICAgZmxhZ0xpc3QucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZsYWdMaXN0LmpvaW4oJyB8ICcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZShpdGVtOiBwYXBlci5JdGVtLCBmbGFnczogQ2hhbmdlRmxhZyk6IFxyXG4gICAgICAgIFJ4Lk9ic2VydmFibGU8Q2hhbmdlRmxhZz4gXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHVuc3ViOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm48Q2hhbmdlRmxhZz4oXHJcbiAgICAgICAgICAgIGFkZEhhbmRsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgdW5zdWIgPSBpdGVtLnN1YnNjcmliZShmID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZihmICYgZmxhZ3Mpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRIYW5kbGVyKGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgcmVtb3ZlSGFuZGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih1bnN1Yil7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5zdWIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5QYXBlck5vdGlmeS5pbml0aWFsaXplKCk7XHJcbiIsImRlY2xhcmUgbW9kdWxlIHBhcGVyIHtcclxuICAgIGludGVyZmFjZSBWaWV3IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbnRlcm5hbCBtZXRob2QgZm9yIGluaXRpYXRpbmcgbW91c2UgZXZlbnRzIG9uIHZpZXcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZW1pdE1vdXNlRXZlbnRzKHZpZXc6IHBhcGVyLlZpZXcsIGl0ZW06IHBhcGVyLkl0ZW0sIHR5cGU6IHN0cmluZyxcclxuICAgICAgICAgICAgZXZlbnQ6IGFueSwgcG9pbnQ6IHBhcGVyLlBvaW50LCBwcmV2UG9pbnQ6IHBhcGVyLlBvaW50KTtcclxuICAgIH1cclxufVxyXG5cclxubmFtZXNwYWNlIHBhcGVyRXh0IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVmlld1pvb20ge1xyXG5cclxuICAgICAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgICAgIGZhY3RvciA9IDEuMjU7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX21pblpvb206IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIF9tYXhab29tOiBudW1iZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBfbW91c2VOYXRpdmVTdGFydDogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfdmlld0NlbnRlclN0YXJ0OiBwYXBlci5Qb2ludDtcclxuICAgICAgICBwcml2YXRlIF92aWV3Q2hhbmdlZCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8cGFwZXIuUmVjdGFuZ2xlPigpO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9qZWN0OiBwYXBlci5Qcm9qZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcblxyXG4gICAgICAgICAgICAoPGFueT4kKHZpZXcuZWxlbWVudCkpLm1vdXNld2hlZWwoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gbmV3IHBhcGVyLlBvaW50KGV2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2Vab29tQ2VudGVyZWQoZXZlbnQuZGVsdGFZLCBtb3VzZVBvc2l0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgZGlkRHJhZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdmlldy5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoaXQgPSBwcm9qZWN0LmhpdFRlc3QoZXYucG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl92aWV3Q2VudGVyU3RhcnQpIHsgIC8vIG5vdCBhbHJlYWR5IGRyYWdnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkb24ndCBzdGFydCBkcmFnZ2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDZW50ZXJTdGFydCA9IHZpZXcuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhdmUgdG8gdXNlIG5hdGl2ZSBtb3VzZSBvZmZzZXQsIGJlY2F1c2UgZXYuZGVsdGEgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gIGNoYW5nZXMgYXMgdGhlIHZpZXcgaXMgc2Nyb2xsZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG5ldyBwYXBlci5Qb2ludChldi5ldmVudC5vZmZzZXRYLCBldi5ldmVudC5vZmZzZXRZKTtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ1N0YXJ0LCBldik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZURlbHRhID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRYIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldi5ldmVudC5vZmZzZXRZIC0gdGhpcy5fbW91c2VOYXRpdmVTdGFydC55XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIGludG8gdmlldyBjb29yZGluYXRlcyB0byBzdWJyYWN0IGRlbHRhLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICB0aGVuIGJhY2sgaW50byBwcm9qZWN0IGNvb3Jkcy5cclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmNlbnRlciA9IHZpZXcudmlld1RvUHJvamVjdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5wcm9qZWN0VG9WaWV3KHRoaXMuX3ZpZXdDZW50ZXJTdGFydClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJ0cmFjdChuYXRpdmVEZWx0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpZERyYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZpZXcub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlVXAsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tb3VzZU5hdGl2ZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW91c2VOYXRpdmVTdGFydCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlld0NlbnRlclN0YXJ0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LmVtaXQocGFwZXJFeHQuRXZlbnRUeXBlLm1vdXNlRHJhZ0VuZCwgZXYpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWREcmFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDaGFuZ2VkLm5vdGlmeSh2aWV3LmJvdW5kcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZERyYWcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHZpZXdDaGFuZ2VkKCk6IE9ic2VydmFibGVFdmVudDxwYXBlci5SZWN0YW5nbGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdDaGFuZ2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHpvb20oKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdC52aWV3Lnpvb207XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgem9vbVJhbmdlKCk6IG51bWJlcltdIHtcclxuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLl9taW5ab29tLCB0aGlzLl9tYXhab29tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFpvb21SYW5nZShyYW5nZTogcGFwZXIuU2l6ZVtdKTogbnVtYmVyW10ge1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgIGNvbnN0IGFTaXplID0gcmFuZ2Uuc2hpZnQoKTtcclxuICAgICAgICAgICAgY29uc3QgYlNpemUgPSByYW5nZS5zaGlmdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBhID0gYVNpemUgJiYgTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy5oZWlnaHQgLyBhU2l6ZS5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB2aWV3LmJvdW5kcy53aWR0aCAvIGFTaXplLndpZHRoKTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IGJTaXplICYmIE1hdGgubWluKFxyXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMuaGVpZ2h0IC8gYlNpemUuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdmlldy5ib3VuZHMud2lkdGggLyBiU2l6ZS53aWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKGEsIGIpO1xyXG4gICAgICAgICAgICBpZiAobWluKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5ab29tID0gbWluO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KGEsIGIpO1xyXG4gICAgICAgICAgICBpZiAobWF4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXhab29tID0gbWF4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5fbWluWm9vbSwgdGhpcy5fbWF4Wm9vbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB6b29tVG8ocmVjdDogcGFwZXIuUmVjdGFuZ2xlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnByb2plY3QudmlldztcclxuICAgICAgICAgICAgdmlldy5jZW50ZXIgPSByZWN0LmNlbnRlcjtcclxuICAgICAgICAgICAgdmlldy56b29tID0gTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICB2aWV3LnZpZXdTaXplLmhlaWdodCAvIHJlY3QuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdmlldy52aWV3U2l6ZS53aWR0aCAvIHJlY3Qud2lkdGgpO1xyXG4gICAgICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hhbmdlWm9vbUNlbnRlcmVkKGRlbHRhOiBudW1iZXIsIG1vdXNlUG9zOiBwYXBlci5Qb2ludCkge1xyXG4gICAgICAgICAgICBpZiAoIWRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHRoaXMucHJvamVjdC52aWV3O1xyXG4gICAgICAgICAgICBjb25zdCBvbGRab29tID0gdmlldy56b29tO1xyXG4gICAgICAgICAgICBjb25zdCBvbGRDZW50ZXIgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICAgICAgY29uc3Qgdmlld1BvcyA9IHZpZXcudmlld1RvUHJvamVjdChtb3VzZVBvcyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgbmV3Wm9vbSA9IGRlbHRhID4gMFxyXG4gICAgICAgICAgICAgICAgPyB2aWV3Lnpvb20gKiB0aGlzLmZhY3RvclxyXG4gICAgICAgICAgICAgICAgOiB2aWV3Lnpvb20gLyB0aGlzLmZhY3RvcjtcclxuICAgICAgICAgICAgbmV3Wm9vbSA9IHRoaXMuc2V0Wm9vbUNvbnN0cmFpbmVkKG5ld1pvb20pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFuZXdab29tKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHpvb21TY2FsZSA9IG9sZFpvb20gLyBuZXdab29tO1xyXG4gICAgICAgICAgICBjb25zdCBjZW50ZXJBZGp1c3QgPSB2aWV3UG9zLnN1YnRyYWN0KG9sZENlbnRlcik7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHZpZXdQb3Muc3VidHJhY3QoY2VudGVyQWRqdXN0Lm11bHRpcGx5KHpvb21TY2FsZSkpXHJcbiAgICAgICAgICAgICAgICAuc3VidHJhY3Qob2xkQ2VudGVyKTtcclxuXHJcbiAgICAgICAgICAgIHZpZXcuY2VudGVyID0gdmlldy5jZW50ZXIuYWRkKG9mZnNldCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl92aWV3Q2hhbmdlZC5ub3RpZnkodmlldy5ib3VuZHMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldCB6b29tIGxldmVsLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHpvb20gbGV2ZWwgdGhhdCB3YXMgc2V0LCBvciBudWxsIGlmIGl0IHdhcyBub3QgY2hhbmdlZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc2V0Wm9vbUNvbnN0cmFpbmVkKHpvb206IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9taW5ab29tKSB7XHJcbiAgICAgICAgICAgICAgICB6b29tID0gTWF0aC5tYXgoem9vbSwgdGhpcy5fbWluWm9vbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX21heFpvb20pIHtcclxuICAgICAgICAgICAgICAgIHpvb20gPSBNYXRoLm1pbih6b29tLCB0aGlzLl9tYXhab29tKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5wcm9qZWN0LnZpZXc7XHJcbiAgICAgICAgICAgIGlmICh6b29tICE9IHZpZXcuem9vbSkge1xyXG4gICAgICAgICAgICAgICAgdmlldy56b29tID0gem9vbTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB6b29tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgcGFwZXJFeHQge1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFVzZSBvZiB0aGVzZSBldmVudHMgcmVxdWlyZXMgZmlyc3QgY2FsbGluZyBleHRlbmRNb3VzZUV2ZW50c1xyXG4gICAgICogICBvbiB0aGUgaXRlbS4gXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB2YXIgRXZlbnRUeXBlID0ge1xyXG4gICAgICAgIG1vdXNlRHJhZ1N0YXJ0OiBcIm1vdXNlRHJhZ1N0YXJ0XCIsXHJcbiAgICAgICAgbW91c2VEcmFnRW5kOiBcIm1vdXNlRHJhZ0VuZFwiXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZE1vdXNlRXZlbnRzKGl0ZW06IHBhcGVyLkl0ZW0pe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGl0ZW0ub24ocGFwZXIuRXZlbnRUeXBlLm1vdXNlRHJhZywgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZighZHJhZ2dpbmcpe1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5lbWl0KHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdTdGFydCwgZXYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VVcCwgZXYgPT4ge1xyXG4gICAgICAgICAgICBpZihkcmFnZ2luZyl7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5lbWl0KHBhcGVyRXh0LkV2ZW50VHlwZS5tb3VzZURyYWdFbmQsIGV2KTtcclxuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgY2xpY2tcclxuICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiXHJcbm1vZHVsZSBwYXBlciB7XHJcblxyXG4gICAgZXhwb3J0IHZhciBFdmVudFR5cGUgPSB7XHJcbiAgICAgICAgZnJhbWU6IFwiZnJhbWVcIixcclxuICAgICAgICBtb3VzZURvd246IFwibW91c2Vkb3duXCIsXHJcbiAgICAgICAgbW91c2VVcDogXCJtb3VzZXVwXCIsXHJcbiAgICAgICAgbW91c2VEcmFnOiBcIm1vdXNlZHJhZ1wiLFxyXG4gICAgICAgIGNsaWNrOiBcImNsaWNrXCIsXHJcbiAgICAgICAgZG91YmxlQ2xpY2s6IFwiZG91YmxlY2xpY2tcIixcclxuICAgICAgICBtb3VzZU1vdmU6IFwibW91c2Vtb3ZlXCIsXHJcbiAgICAgICAgbW91c2VFbnRlcjogXCJtb3VzZWVudGVyXCIsXHJcbiAgICAgICAgbW91c2VMZWF2ZTogXCJtb3VzZWxlYXZlXCIsXHJcbiAgICAgICAga2V5dXA6IFwia2V5dXBcIixcclxuICAgICAgICBrZXlkb3duOiBcImtleWRvd25cIlxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5hYnN0cmFjdCBjbGFzcyBDb21wb25lbnQ8VD4ge1xyXG4gICAgYWJzdHJhY3QgcmVuZGVyKGRhdGE6IFQpOiBWTm9kZTtcclxufSIsIlxyXG5pbnRlcmZhY2UgUmVhY3RpdmVEb21Db21wb25lbnQge1xyXG4gICAgZG9tJDogUnguT2JzZXJ2YWJsZTxWTm9kZT47XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBWRG9tSGVscGVycyB7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVuZGVyQXNDaGlsZChjb250YWluZXI6IEhUTUxFbGVtZW50LCB2bm9kZTogVk5vZGUpe1xyXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBjb25zdCBwYXRjaGVkID0gcGF0Y2goY2hpbGQsIHZub2RlKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGF0Y2hlZC5lbG0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdGl2ZURvbSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSByZWFjdGl2ZSBjb21wb25lbnQgd2l0aGluIGNvbnRhaW5lci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlclN0cmVhbShcclxuICAgICAgICBkb20kOiBSeC5PYnNlcnZhYmxlPFZOb2RlPixcclxuICAgICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50XHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBjb250YWluZXIuaWQ7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQ6IEhUTUxFbGVtZW50IHwgVk5vZGUgPSBjb250YWluZXI7XHJcbiAgICAgICAgY29uc3Qgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIGRvbSQuc3Vic2NyaWJlKGRvbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb20pIHJldHVybjtcclxuLy9jb25zb2xlLndhcm4oJ3JlbmRlcmluZyBkb20nLCBkb20pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gcmV0YWluIElEXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoZWQgPSBwYXRjaChjdXJyZW50LCBkb20pO1xyXG4gICAgICAgICAgICBpZihpZCAmJiAhcGF0Y2hlZC5lbG0uaWQpe1xyXG4gICAgICAgICAgICAgICAgcGF0Y2hlZC5lbG0uaWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3VycmVudCA9IHBhdGNoZWQ7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHJlYWN0aXZlIGNvbXBvbmVudCB3aXRoaW4gY29udGFpbmVyLlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyQ29tcG9uZW50KFxyXG4gICAgICAgIGNvbXBvbmVudDogUmVhY3RpdmVEb21Db21wb25lbnQsXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IFZOb2RlXHJcbiAgICApOiBSeC5PYnNlcnZhYmxlPFZOb2RlPiB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgbGV0IHNpbmsgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuICAgICAgICBjb21wb25lbnQuZG9tJC5zdWJzY3JpYmUoZG9tID0+IHtcclxuICAgICAgICAgICAgaWYoIWRvbSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgZG9tKTtcclxuICAgICAgICAgICAgc2luay5vbk5leHQoPFZOb2RlPmN1cnJlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHdpdGhpbiBjb250YWluZXIgd2hlbmV2ZXIgc291cmNlIGNoYW5nZXMuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXZlUmVuZGVyPFQ+KFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBWTm9kZSxcclxuICAgICAgICBzb3VyY2U6IFJ4Lk9ic2VydmFibGU8VD4sXHJcbiAgICAgICAgcmVuZGVyOiAobmV4dDogVCkgPT4gVk5vZGVcclxuICAgICk6IFJ4Lk9ic2VydmFibGU8Vk5vZGU+IHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBsZXQgc2luayA9IG5ldyBSeC5TdWJqZWN0PFZOb2RlPigpO1xyXG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gcmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBpZighbm9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBjdXJyZW50ID0gcGF0Y2goY3VycmVudCwgbm9kZSk7XHJcbiAgICAgICAgICAgIHNpbmsub25OZXh0KDxWTm9kZT5jdXJyZW50KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gc2luaztcclxuICAgIH1cclxuXHJcbn0iLCJcclxubmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcENvb2tpZXMge1xyXG5cclxuICAgICAgICBzdGF0aWMgWUVBUiA9IDM2NTtcclxuICAgICAgICBzdGF0aWMgQlJPV1NFUl9JRF9LRVkgPSBcImJyb3dzZXJJZFwiO1xyXG4gICAgICAgIHN0YXRpYyBMQVNUX1NBVkVEX1NLRVRDSF9JRF9LRVkgPSBcImxhc3RTYXZlZFNrZXRjaElkXCI7XHJcblxyXG4gICAgICAgIGdldCBsYXN0U2F2ZWRTa2V0Y2hJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvb2tpZXMuZ2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldCBsYXN0U2F2ZWRTa2V0Y2hJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIENvb2tpZXMuc2V0KEFwcENvb2tpZXMuTEFTVF9TQVZFRF9TS0VUQ0hfSURfS0VZLCB2YWx1ZSwgeyBleHBpcmVzOiBBcHBDb29raWVzLllFQVIgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgYnJvd3NlcklkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29va2llcy5nZXQoQXBwQ29va2llcy5CUk9XU0VSX0lEX0tFWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgYnJvd3NlcklkKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgQ29va2llcy5zZXQoQXBwQ29va2llcy5CUk9XU0VSX0lEX0tFWSwgdmFsdWUsIHsgZXhwaXJlczogQXBwQ29va2llcy5ZRUFSIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIEFwcCB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XHJcblxyXG4gICAgICAgIHN0b3JlOiBTdG9yZTtcclxuICAgICAgICBlZGl0b3JNb2R1bGU6IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICAgICAgUGFwZXJIZWxwZXJzLnNob3VsZExvZ0luZm8gPSBmYWxzZTsgICAgICAgXHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlID0gbmV3IFNrZXRjaEVkaXRvci5Ta2V0Y2hFZGl0b3JNb2R1bGUodGhpcy5zdG9yZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHN0YXJ0KCkgeyAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kdWxlLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgYXBwOiBBcHAuQXBwTW9kdWxlO1xyXG59IiwiXHJcbm5hbWVzcGFjZSBBcHAge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBcHBSb3V0ZXIgZXh0ZW5kcyBSb3V0ZXI1IHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFtcclxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJob21lXCIsIFwiL1wiKSxcclxuICAgICAgICAgICAgICAgIG5ldyBSb3V0ZU5vZGUoXCJza2V0Y2hcIiwgXCIvc2tldGNoLzpza2V0Y2hJZFwiKSwgLy8gPFthLWZBLUYwLTldezE0fT5cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VIYXNoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Um91dGU6IFwiaG9tZVwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy51c2VQbHVnaW4obG9nZ2VyUGx1Z2luKCkpXHJcbiAgICAgICAgICAgIHRoaXMudXNlUGx1Z2luKGxpc3RlbmVyc1BsdWdpbi5kZWZhdWx0KCkpXHJcbiAgICAgICAgICAgICAgICAudXNlUGx1Z2luKGhpc3RvcnlQbHVnaW4uZGVmYXVsdCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRvU2tldGNoRWRpdG9yKHNrZXRjaElkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShcInNrZXRjaFwiLCB7IHNrZXRjaElkOiBza2V0Y2hJZCB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzdGF0ZSgpIHtcclxuICAgICAgICAgICAgLy8gY291bGQgZG8gcm91dGUgdmFsaWRhdGlvbiBzb21ld2hlcmVcclxuICAgICAgICAgICAgcmV0dXJuIDxBcHBSb3V0ZVN0YXRlPjxhbnk+dGhpcy5nZXRTdGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEFwcFJvdXRlU3RhdGUge1xyXG4gICAgICAgIG5hbWU6IFwiaG9tZVwifFwic2tldGNoXCIsXHJcbiAgICAgICAgcGFyYW1zPzoge1xyXG4gICAgICAgICAgICBza2V0Y2hJZD86IHN0cmluZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGF0aD86IHN0cmluZ1xyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgQXBwIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3RvcmUge1xyXG5cclxuICAgICAgICBzdGF0ZTogQXBwU3RhdGU7XHJcbiAgICAgICAgYWN0aW9uczogQWN0aW9ucztcclxuICAgICAgICBldmVudHM6IEV2ZW50cztcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IEFwcFJvdXRlcjtcclxuICAgICAgICBwcml2YXRlIGNvb2tpZXM6IEFwcENvb2tpZXM7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdXRlciA9IG5ldyBBcHBSb3V0ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gbmV3IEFjdGlvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29va2llcyA9IG5ldyBBcHBDb29raWVzKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Um91dGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEFjdGlvbkhhbmRsZXJzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbml0U3RhdGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgQXBwU3RhdGUodGhpcy5jb29raWVzLCB0aGlzLnJvdXRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGluaXRBY3Rpb25IYW5kbGVycygpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmVkaXRvckxvYWRlZFNrZXRjaC5zdWIoc2tldGNoSWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoXCJza2V0Y2hcIiwgeyBza2V0Y2hJZCB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMuZWRpdG9yU2F2ZWRTa2V0Y2guc3ViKGlkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29va2llcy5sYXN0U2F2ZWRTa2V0Y2hJZCA9IGlkO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGFydFJvdXRlcigpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIuc3RhcnQoKGVyciwgc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnJvdXRlQ2hhbmdlZC5kaXNwYXRjaChzdGF0ZSk7IFxyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInJvdXRlciBlcnJvclwiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiaG9tZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQXBwU3RhdGUge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgY29va2llczogQXBwQ29va2llcztcclxuICAgICAgICBwcml2YXRlIHJvdXRlcjogQXBwUm91dGVyOyBcclxuICAgICAgICBcclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb29raWVzOiBBcHBDb29raWVzLCByb3V0ZXI6IEFwcFJvdXRlcil7XHJcbiAgICAgICAgICAgIHRoaXMuY29va2llcyA9IGNvb2tpZXM7XHJcbiAgICAgICAgICAgIHRoaXMucm91dGVyID0gcm91dGVyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYnJvd3NlcklkID0gdGhpcy5jb29raWVzLmJyb3dzZXJJZCB8fCBuZXdpZCgpO1xyXG4gICAgICAgICAgICAvLyBpbml0IG9yIHJlZnJlc2ggY29va2llXHJcbiAgICAgICAgICAgIHRoaXMuY29va2llcy5icm93c2VySWQgPSBicm93c2VySWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCBsYXN0U2F2ZWRTa2V0Y2hJZCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29va2llcy5sYXN0U2F2ZWRTa2V0Y2hJZDsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldCBicm93c2VySWQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvb2tpZXMuYnJvd3NlcklkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBnZXQgcm91dGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvdXRlci5zdGF0ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFjdGlvbnMgZXh0ZW5kcyBUeXBlZENoYW5uZWwuQ2hhbm5lbCB7XHJcbiAgICAgICAgZWRpdG9yTG9hZGVkU2tldGNoID0gdGhpcy50b3BpYzxzdHJpbmc+KFwiZWRpdG9yTG9hZGVkU2tldGNoXCIpO1xyXG4gICAgICAgIGVkaXRvclNhdmVkU2tldGNoID0gdGhpcy50b3BpYzxzdHJpbmc+KFwiZWRpdG9yU2F2ZWRTa2V0Y2hcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50cyBleHRlbmRzIFR5cGVkQ2hhbm5lbC5DaGFubmVsIHtcclxuICAgICAgICByb3V0ZUNoYW5nZWQgPSB0aGlzLnRvcGljPEFwcFJvdXRlU3RhdGU+KFwicm91dGVDaGFuZ2VkXCIpO1xyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBEZW1vIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRGVtb01vZHVsZSB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgIHBhcGVyLnNldHVwKGNhbnZhcyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhcnQoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBwYXBlci52aWV3O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKCgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIHBhcnNlZEZvbnRzLmdldChcImZvbnRzL1JvYm90by01MDAudHRmXCIpLnRoZW4oIHBhcnNlZCA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gcGFyc2VkLmZvbnQuZ2V0UGF0aChcIlNOQVBcIiwgMCwgMCwgMTI4KS50b1BhdGhEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRlbnQucG9zaXRpb24gPSBjb250ZW50LnBvc2l0aW9uLmFkZCg1MCk7XHJcbiAgICAgICAgICAgICAgICAgY29udGVudC5maWxsQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IHBhcGVyLlBhdGguRWxsaXBzZShuZXcgcGFwZXIuUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLDApLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5TaXplKDYwMCwgMzAwKVxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICByZWdpb24ucm90YXRlKDMwKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uLmJvdW5kcy5jZW50ZXIgPSB2aWV3LmNlbnRlcjtcclxuICAgICAgICAgICAgICAgIHJlZ2lvbi5zdHJva2VDb2xvciA9IFwibGlnaHRncmF5XCI7XHJcbiAgICAgICAgICAgICAgICByZWdpb24uc3Ryb2tlV2lkdGggPSAzO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBQYXRoID0gbmV3IEZvbnRTaGFwZS5TbmFwUGF0aChyZWdpb24sIGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgc25hcFBhdGguY29ybmVycyA9IFswLCAwLjQsIDAuNDUsIDAuOTVdO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2aWV3Lm9uRnJhbWUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc25hcFBhdGguc2xpZGUoMC4wMDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNuYXBQYXRoLnVwZGF0ZVBhdGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmlldy5kcmF3KCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQnVpbGRlciB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBkZWZhdWx0Rm9udFVybCA9IFwiZm9udHMvUm9ib3RvLTUwMC50dGZcIjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gPFRlbXBsYXRlVUlDb250ZXh0PntcclxuICAgICAgICAgICAgICAgIHJlbmRlckRlc2lnbjogKGRlc2lnbiwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5yZW5kZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNpZ246IGRlc2lnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY29udHJvbHMkID0gc3RvcmUudGVtcGxhdGUkLm1hcCh0ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xzID0gdC5jcmVhdGVVSShjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjb250cm9scykge1xyXG4gICAgICAgICAgICAgICAgICAgIGMub3V0cHV0JC5zdWJzY3JpYmUoZCA9PiBzdG9yZS51cGRhdGVEZXNpZ24oZCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoXHJcbiAgICAgICAgICAgICAgICBjb250cm9scyQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5kZXNpZ24kLFxyXG4gICAgICAgICAgICAgICAgKGNvbnRyb2xzLCBkZXNpZ24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBjb250cm9scywgZGVzaWduIH07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm1hcCgoe2NvbnRyb2xzLCBkZXNpZ259KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBjb250cm9scy5tYXAoYyA9PiBjLmNyZWF0ZU5vZGUoZGVzaWduKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdm5vZGUgPSBoKFwiZGl2I3RlbXBsYXRlQ29udHJvbHNcIiwge30sIG5vZGVzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm5vZGU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgTW9kdWxlIHtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgYnVpbGRlcjogQnVpbGRlcjtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgYnVpbGRlckNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgICAgIHByZXZpZXdDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBcclxuICAgICAgICAgICAgcmVuZGVyQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gbmV3IFN0b3JlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRlciA9IG5ldyBCdWlsZGVyKGJ1aWxkZXJDb250YWluZXIsIHRoaXMuc3RvcmUpO1xyXG4gICAgICAgICBcclxuICAgICAgICAgICAgLy9uZXcgUmVuZGVyQ2FudmFzKHJlbmRlckNhbnZhcywgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgICAgIG5ldyBQcmV2aWV3Q2FudmFzKHByZXZpZXdDYW52YXMsIHRoaXMuc3RvcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxudGhpcy5zdG9yZS5kZXNpZ24kLnN1YnNjcmliZShkID0+IGNvbnNvbGUubG9nKFwiZGVzaWduXCIsIGQpKTtcclxudGhpcy5zdG9yZS50ZW1wbGF0ZSQuc3Vic2NyaWJlKHQgPT4gY29uc29sZS5sb2coXCJ0ZW1wbGF0ZVwiLCB0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHN0YXJ0KCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnNldFRlbXBsYXRlKFwiRGlja2Vuc1wiKTtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZS5kZXNpZ24gPSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIlRoZSByYWluIGluIHNwYWluIGZhbGxzIG1haW5seSBpbiB0aGUgZHJhaW5cIixcclxuICAgICAgICAgICAgICAgIHBhbGV0dGU6IFtcImdyZWVuXCJdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuIiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQcmV2aWV3Q2FudmFzIHtcclxuXHJcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgYnVpbHREZXNpZ246IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBsYXN0UmVjZWl2ZWQ6IERlc2lnbjtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xyXG5cclxuICAgICAgICAgICAgcGFwZXIuc2V0dXAoY2FudmFzKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZEZvbnRzID0gbmV3IEZvbnRTaGFwZS5QYXJzZWRGb250cygoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICBjb25zdCBmb250RmFtaWxpZXMgPSBuZXcgRm9udFNoYXBlLkZvbnRGYW1pbGllcyhcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgZ2V0Rm9udDogc3BlY2lmaWVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzcGVjaWZpZXIgfHwgIXNwZWNpZmllci5mYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBmb250RmFtaWxpZXMuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEZvbnRzLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5kZXNpZ24kLnN1YnNjcmliZShyZWNlaXZlZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBvbmx5IHByb2Nlc3Mgb25lIHJlcXVlc3QgYXQgYSB0aW1lXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbHdheXMgcHJvY2VzcyB0aGUgbGFzdCByZWNlaXZlZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFJlY2VpdmVkID0gcmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlY2VpdmVkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlbmRlckxhc3RSZWNlaXZlZCgpIHtcclxuICAgICAgICAgICAgaWYodGhpcy5sYXN0UmVjZWl2ZWQpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyaW5nID0gdGhpcy5sYXN0UmVjZWl2ZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RSZWNlaXZlZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJpbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlbmRlcihkZXNpZ246IERlc2lnbik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLnJlbmRlcmluZyl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZW5kZXIgaXMgaW4gcHJvZ3Jlc3NcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBwYXBlci5wcm9qZWN0LmFjdGl2ZUxheWVyLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlLnRlbXBsYXRlLmJ1aWxkKGRlc2lnbiwgdGhpcy5jb250ZXh0KS50aGVuKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoIWl0ZW0pe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcGFwZXIudmlldy52aWV3U2l6ZSA9IGl0ZW0uYm91bmRzLnNpemUubXVsdGlwbHkoMS4xKTtcclxuICAgICAgICAgICAgICAgIHBhcGVyLnZpZXcuY2VudGVyID0gaXRlbS5ib3VuZHMuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIGFueSByZWNlaXZlZCB3aGlsZSByZW5kZXJpbmcgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckxhc3RSZWNlaXZlZCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVuZGVyQ2FudmFzIHtcclxuXHJcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgYnVpbHREZXNpZ246IHBhcGVyLkl0ZW07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcblxyXG4gICAgICAgICAgICBwYXBlci5zZXR1cChjYW52YXMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFyc2VkRm9udHMgPSBuZXcgRm9udFNoYXBlLlBhcnNlZEZvbnRzKCgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRGYW1pbGllcyA9IG5ldyBGb250U2hhcGUuRm9udEZhbWlsaWVzKFwiZm9udHMvZ29vZ2xlLWZvbnRzLmpzb25cIik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgZ2V0Rm9udDogc3BlY2lmaWVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzcGVjaWZpZXIgfHwgIXNwZWNpZmllci5mYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBmb250RmFtaWxpZXMuZ2V0VXJsKHNwZWNpZmllci5mYW1pbHksIHNwZWNpZmllci52YXJpYW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgQnVpbGRlci5kZWZhdWx0Rm9udFVybDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEZvbnRzLmdldCh1cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQuZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVkID0gc3RvcmUucmVuZGVyJC5jb250cm9sbGVkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZWQuc3Vic2NyaWJlKHJlcXVlc3QgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRlc2lnbiA9IDxEZXNpZ24+Xy5jbG9uZSh0aGlzLnN0b3JlLmRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICBkZXNpZ24gPSBfLm1lcmdlKGRlc2lnbiwgcmVxdWVzdC5kZXNpZ24pO1xyXG4gICAgICAgICAgICAgICAgcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yZW1vdmVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS50ZW1wbGF0ZS5idWlsZChkZXNpZ24sIGNvbnRleHQpLnRoZW4oaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFzdGVyID0gcGFwZXIucHJvamVjdC5hY3RpdmVMYXllci5yYXN0ZXJpemUoNzIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuY2FsbGJhY2socmFzdGVyLnRvRGF0YVVSTCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImVycm9yIG9uIHRlbXBsYXRlLmJ1aWxkXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlZC5yZXF1ZXN0KDEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sbGVkLnJlcXVlc3QoMSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN0b3JlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGUkID0gbmV3IFJ4LlN1YmplY3Q8VGVtcGxhdGU+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBfZGVzaWduJCA9IG5ldyBSeC5TdWJqZWN0PERlc2lnbj4oKTtcclxuICAgICAgICBwcml2YXRlIF9yZW5kZXIkID0gbmV3IFJ4LlN1YmplY3Q8UmVuZGVyUmVxdWVzdD4oKTtcclxuICAgICAgICBwcml2YXRlIF9zdGF0ZToge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZT86IFRlbXBsYXRlO1xyXG4gICAgICAgICAgICBkZXNpZ24/OiBEZXNpZ247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB7fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHN0YXRlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgZGVzaWduJCgpOiBSeC5PYnNlcnZhYmxlPERlc2lnbj4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVzaWduJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZW1wbGF0ZSQoKSA6IFJ4Lk9ic2VydmFibGU8VGVtcGxhdGU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlJDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCByZW5kZXIkKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXIkOy8vLm9ic2VydmVPbihSeC5TY2hlZHVsZXIuZGVmYXVsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnRlbXBsYXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGVtcGxhdGUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTtcclxuICAgICAgICAgICAgaWYoL0RpY2tlbnMvaS50ZXN0KG5hbWUpKXtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gbmV3IFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGVzLkRpY2tlbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighdGVtcGxhdGUpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRlbXBsYXRlICR7bmFtZX1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRlbXBsYXRlID0gdGVtcGxhdGU7XHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlJC5vbk5leHQodGVtcGxhdGUpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0IGRlc2lnbih2YWx1ZTogRGVzaWduKXtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5kZXNpZ24gPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduJC5vbk5leHQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB1cGRhdGVEZXNpZ24odXBkYXRlOiBEZXNpZ24pe1xyXG4gICAgICAgICAgICBfLm1lcmdlKHRoaXMuc3RhdGUuZGVzaWduLCB1cGRhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ24kLm9uTmV4dCh0aGlzLnN0YXRlLmRlc2lnbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJlbmRlcihyZXF1ZXN0OiBSZW5kZXJSZXF1ZXN0KXtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyJC5vbk5leHQocmVxdWVzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZSB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgICAgICAgaW1hZ2U6IHN0cmluZztcclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IERlc2lnbkNvbnRyb2xbXTtcclxuICAgICAgICBidWlsZChkZXNpZ246IERlc2lnbiwgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQpOiBQcm9taXNlPHBhcGVyLkl0ZW0+O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVVSUNvbnRleHQge1xyXG4gICAgICAgIHJlbmRlckRlc2lnbihkZXNpZ246IERlc2lnbiwgY2FsbGJhY2s6IChpbWFnZURhdGFVcmw6IHN0cmluZykgPT4gdm9pZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVCdWlsZENvbnRleHQge1xyXG4gICAgICAgIGdldEZvbnQoZGVzYzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXIpOiBQcm9taXNlPG9wZW50eXBlLkZvbnQ+O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERlc2lnbiB7XHJcbiAgICAgICAgdGV4dD86IHN0cmluZztcclxuICAgICAgICBzaGFwZT86IHN0cmluZztcclxuICAgICAgICBmb250PzogRm9udFNoYXBlLkZvbnRTcGVjaWZpZXI7XHJcbiAgICAgICAgcGFsZXR0ZT86IE9iamVjdDtcclxuICAgICAgICBzZWVkPzogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlbmRlclJlcXVlc3Qge1xyXG4gICAgICAgIGRlc2lnbjogRGVzaWduO1xyXG4gICAgICAgIGFyZWE/OiBudW1iZXI7XHJcbiAgICAgICAgY2FsbGJhY2s6IChpbWFnZURhdGFVcmw6IHN0cmluZykgPT4gdm9pZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEZXNpZ25Db250cm9sIHtcclxuICAgICAgICBvdXRwdXQkOiBSeC5PYnNlcnZhYmxlPERlc2lnbj47XHJcbiAgICAgICAgY3JlYXRlTm9kZShkZXNpZ246IERlc2lnbik6IFZOb2RlOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBWRG9tQ29tcG9uZW50IHtcclxuICAgICAgICBjcmVhdGVOb2RlKGNob2ljZXM6IFZOb2RlW10sIGNob3NlbktleTogc3RyaW5nKTogVk5vZGU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVkRvbUNvbnRyb2wge1xyXG4gICAgICAgIHZhbHVlJDogUnguT2JzZXJ2YWJsZTxzdHJpbmc+O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFZEb21DaG9vc2VyIGV4dGVuZHMgVkRvbUNvbXBvbmVudCB7XHJcbiAgICAgICAgY2hvc2VuJDogUnguT2JzZXJ2YWJsZTxWTm9kZT47XHJcbiAgICB9XHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENob29zZXIgaW1wbGVtZW50cyBWRG9tQ2hvb3NlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2Nob3NlbiQgPSBuZXcgUnguU3ViamVjdDxWTm9kZT4oKTtcclxuXHJcbiAgICAgICAgY3JlYXRlTm9kZShjaG9pY2VzOiBWTm9kZVtdLCBjaG9zZW5LZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gaChcInVsLmNob29zZXJcIixcclxuICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlcy5tYXAoYyA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJsaS5jaG9pY2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaG9zZW46IGNob3NlbktleSAmJiBjLmtleSA9PT0gY2hvc2VuS2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZXYgPT4gdGhpcy5fY2hvc2VuJC5vbk5leHQoYylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW2NdKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNob3NlbiQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaG9zZW4kO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoQnVpbGRlciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEltYWdlQ2hvb3NlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2Nob3NlbiQgPSBuZXcgUnguU3ViamVjdDxJbWFnZUNob2ljZT4oKTtcclxuXHJcbiAgICAgICAgY3JlYXRlTm9kZShvcHRpb25zOiBJbWFnZUNob29zZXJPcHRpb25zKTogVk5vZGUge1xyXG4gICAgICAgICAgICBjb25zdCBjaG9pY2VOb2RlcyA9IG9wdGlvbnMuY2hvaWNlcy5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW1nOiBWTm9kZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hvc2VuJC5vbk5leHQoYyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RvciA9IG9wdGlvbnMuY2hvc2VuID09PSBjLnZhbHVlIFxyXG4gICAgICAgICAgICAgICAgICAgID8gXCJpbWcuY2hvc2VuXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgOiBcImltZ1wiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGMubG9hZEltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltZ0VsbTtcclxuICAgICAgICAgICAgICAgICAgICBpbWcgPSBoKHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBvbkNsaWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGtpY2sgb2ZmIGltYWdlIGxvYWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IHZub2RlID0+IGMubG9hZEltYWdlKHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtdXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZyA9IGgoc2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogYy5pbWFnZVVybFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IG9uQ2xpY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaChcImxpXCIsIHt9LCBbXHJcbiAgICAgICAgICAgICAgICAgICAgaW1nXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGgoXCJ1bC5jaG9vc2VyXCIsIHt9LCBjaG9pY2VOb2Rlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY2hvc2VuJCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Nob3NlbiQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEltYWdlQ2hvb3Nlck9wdGlvbnMge1xyXG4gICAgICAgIGNob2ljZXM6IEltYWdlQ2hvaWNlW10sXHJcbiAgICAgICAgY2hvc2VuPzogc3RyaW5nXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbWFnZUNob2ljZSB7XHJcbiAgICAgICAgdmFsdWU6IHN0cmluZztcclxuICAgICAgICBsYWJlbDogc3RyaW5nO1xyXG4gICAgICAgIGltYWdlVXJsPzogc3RyaW5nO1xyXG4gICAgICAgIGxvYWRJbWFnZT86IChlbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB2b2lkO1xyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hCdWlsZGVyIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dElucHV0IGltcGxlbWVudHMgVkRvbUNvbnRyb2wge1xyXG5cclxuICAgICAgICBwcml2YXRlIF92YWx1ZSQgPSBuZXcgUnguU3ViamVjdDxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNyZWF0ZU5vZGUodmFsdWU/OiBzdHJpbmcsIHBsYWNlaG9sZGVyPzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXByZXNzOiAoZXY6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXYudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlJC5vbk5leHQoZXYudGFyZ2V0LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHZhbHVlJCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlJDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGVzIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRGlja2VucyBpbXBsZW1lbnRzIFNrZXRjaEJ1aWxkZXIuVGVtcGxhdGUge1xyXG5cclxuICAgICAgICBuYW1lID0gXCJEaWNrZW5zXCI7XHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU3RhY2sgYmxvY2tzIG9mIHRleHQgaW4gdGhlIGZvcm0gb2YgYSBjcmF6eSBsYWRkZXIuXCI7XHJcbiAgICAgICAgaW1hZ2U6IHN0cmluZztcclxuICAgICAgICBsaW5lSGVpZ2h0VmFyaWF0aW9uID0gMC44O1xyXG5cclxuICAgICAgICBjcmVhdGVVSShjb250ZXh0OiBUZW1wbGF0ZVVJQ29udGV4dCk6IERlc2lnbkNvbnRyb2xbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRleHRFbnRyeSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFwZUNob29zZXIoY29udGV4dCksXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBidWlsZChkZXNpZ246IERlc2lnbiwgY29udGV4dDogVGVtcGxhdGVCdWlsZENvbnRleHQpOiBQcm9taXNlPHBhcGVyLkl0ZW0+IHtcclxuICAgICAgICAgICAgaWYgKCFkZXNpZ24udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmdldEZvbnQoZGVzaWduLmZvbnQpLnRoZW4oZm9udCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JkcyA9IGRlc2lnbi50ZXh0LnRvTG9jYWxlVXBwZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaW5lczogc3RyaW5nW107XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlc2lnbi5zaGFwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYXJyb3dcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMgPSB0aGlzLnNwbGl0V29yZHNOYXJyb3cod29yZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwid2lkZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMuc3BsaXRXb3Jkc1dpZGUod29yZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMuc3BsaXRXb3Jkc05hcnJvdyh3b3Jkcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJveCA9IG5ldyBwYXBlci5Hcm91cCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrcyA9IGxpbmVzLm1hcChsID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IGZvbnQuZ2V0UGF0aChsLCAwLCAwLCAyNCkudG9QYXRoRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgcGFwZXIuQ29tcG91bmRQYXRoKHBhdGhEYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGxDb2xvciA9IChkZXNpZ24gJiYgZGVzaWduLnBhbGV0dGVbMF0pIHx8IFwicmVkXCI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhXaWR0aCA9IF8ubWF4KGJsb2Nrcy5tYXAoYiA9PiBiLmJvdW5kcy53aWR0aCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IGJsb2Nrc1swXS5ib3VuZHMuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB1cHBlciA9IG5ldyBwYXBlci5QYXRoKFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuUG9pbnQoMCwgMCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KG1heFdpZHRoLCAwKVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbG93ZXI6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVtYWluaW5nID0gYmxvY2tzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgtLXJlbWFpbmluZyA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pZCA9IHVwcGVyLmJvdW5kcy5jZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhc3QgbG93ZXIgbGluZSBpcyBsZXZlbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb3dlciA9IG5ldyBwYXBlci5QYXRoKFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBwYXBlci5Qb2ludCgwLCBtaWQueSArIGxpbmVIZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KG1heFdpZHRoLCBtaWQueSArIGxpbmVIZWlnaHQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VyID0gdGhpcy5yYW5kb21Mb3dlclBhdGhGb3IodXBwZXIsIGxpbmVIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJldGNoID0gbmV3IEZvbnRTaGFwZS5WZXJ0aWNhbEJvdW5kc1N0cmV0Y2hQYXRoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jaywgeyB1cHBlciwgbG93ZXIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZXRjaC5maWxsQ29sb3IgPSBmaWxsQ29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LmFkZENoaWxkKHN0cmV0Y2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVwcGVyID0gbG93ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbG93ZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBib3g7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByYW5kb21Mb3dlclBhdGhGb3IodXBwZXI6IHBhcGVyLlBhdGgsIGF2Z0hlaWdodDogbnVtYmVyKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50czogcGFwZXIuUG9pbnRbXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgdXBwZXJDZW50ZXIgPSB1cHBlci5ib3VuZHMuY2VudGVyO1xyXG4gICAgICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IG51bVBvaW50cyA9IDQ7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdXBwZXJDZW50ZXIueSArIChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMubGluZUhlaWdodFZhcmlhdGlvbiAqIGF2Z0hlaWdodDtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ldyBwYXBlci5Qb2ludCh4LCB5KSk7XHJcbiAgICAgICAgICAgICAgICB4ICs9IHVwcGVyLmJvdW5kcy53aWR0aCAvIChudW1Qb2ludHMgLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLlBhdGgocG9pbnRzKTtcclxuICAgICAgICAgICAgcGF0aC5zbW9vdGgoKTtcclxuICAgICAgICAgICAgcGF0aC5ib3VuZHMuY2VudGVyID0gdXBwZXIuYm91bmRzLmNlbnRlci5hZGQobmV3IHBhcGVyLlBvaW50KDAsIGF2Z0hlaWdodCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3BsaXRXb3Jkc05hcnJvdyh3b3Jkczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBpZGVhbCA9IF8ubWF4KHdvcmRzLm1hcCh3ID0+IHcubGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbGNTY29yZSA9ICh0ZXh0OiBzdHJpbmcpID0+XHJcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhNYXRoLmFicyhpZGVhbCAtIHRleHQubGVuZ3RoKSwgMik7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3VycmVudExpbmUgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFNjb3JlID0gMTAwMDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAod29yZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JkID0gd29yZHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpbmUgPSBjdXJyZW50TGluZSArIFwiIFwiICsgd29yZDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Njb3JlID0gY2FsY1Njb3JlKG5ld0xpbmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMaW5lICYmIG5ld1Njb3JlIDw9IGN1cnJlbnRTY29yZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFwcGVuZFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lICs9IFwiIFwiICsgd29yZDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBuZXdTY29yZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbmV3IGxpbmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudExpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaChjdXJyZW50TGluZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gd29yZDtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2NvcmUgPSBjYWxjU2NvcmUoY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbGluZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNwbGl0V29yZHNXaWRlKHdvcmRzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRMZW5ndGggPSBfLnN1bSh3b3Jkcy5tYXAodyA9PiB3Lmxlbmd0aCArIDEpKSAvIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0TGluZSA9IHdvcmRzO1xyXG4gICAgICAgICAgICBjb25zdCBzZWNvbmRMaW5lID0gW107XHJcbiAgICAgICAgICAgIGxldCBzZWNvbmRMaW5lTGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHNlY29uZExpbmVMZW5ndGggPCB0YXJnZXRMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSB3b3Jkcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZExpbmUudW5zaGlmdCh3b3JkKTtcclxuICAgICAgICAgICAgICAgIHNlY29uZExpbmVMZW5ndGggKz0gd29yZC5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICBmaXJzdExpbmUuam9pbihcIiBcIiksXHJcbiAgICAgICAgICAgICAgICBzZWNvbmRMaW5lLmpvaW4oXCIgXCIpXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVRleHRFbnRyeSgpIHtcclxuICAgICAgICAgICAgY29uc3QgdGV4dElucHV0ID0gbmV3IFRleHRJbnB1dCgpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogZGVzaWduID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGV4dElucHV0LmNyZWF0ZU5vZGUoZGVzaWduLnRleHQsIFwiV2hhdCBkbyB5b3Ugd2FudCB0byBzYXk/XCIpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG91dHB1dCQ6IHRleHRJbnB1dC52YWx1ZSQubWFwKHYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8RGVzaWduPnsgdGV4dDogdiB9O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVTaGFwZUNob29zZXIoY29udGV4dDogVGVtcGxhdGVVSUNvbnRleHQpOiBEZXNpZ25Db250cm9sIHtcclxuICAgICAgICAgICAgY29uc3QgY3JlYXRlQ2hvaWNlID0gKHNoYXBlOiBzdHJpbmcpID0+XHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHNoYXBlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBbc2hhcGVdKTtcclxuICAgICAgICAgICAgdmFyIGNob29zZXIgPSBuZXcgQ2hvb3NlcigpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTm9kZTogZGVzaWduID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VzID0gW1wibmFycm93XCIsIFwid2lkZVwiXS5tYXAoY3JlYXRlQ2hvaWNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaG9vc2VyTm9kZSA9IGNob29zZXIuY3JlYXRlTm9kZShjaG9pY2VzLCBkZXNpZ24uc2hhcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaG9vc2VyTm9kZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvdXRwdXQkOiBjaG9vc2VyLmNob3NlbiQubWFwKGNob2ljZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxEZXNpZ24+eyBzaGFwZTogY2hvaWNlLmtleSB9O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRG9jdW1lbnRLZXlIYW5kbGVyIHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBub3RlOiB1bmRpc3Bvc2VkIGV2ZW50IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5rZXl1cChmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IERvbUhlbHBlcnMuS2V5Q29kZXMuRXNjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuYWN0aW9ucy5za2V0Y2guc2V0U2VsZWN0aW9uLmRpc3BhdGNoKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU2tldGNoRWRpdG9yTW9kdWxlIHtcclxuXHJcbiAgICAgICAgYXBwU3RvcmU6IEFwcC5TdG9yZTtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcbiAgICAgICAgd29ya3NwYWNlQ29udHJvbGxlcjogV29ya3NwYWNlQ29udHJvbGxlcjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXBwU3RvcmU6IEFwcC5TdG9yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlID0gYXBwU3RvcmU7XHJcblxyXG4gICAgICAgICAgICBEb21IZWxwZXJzLmluaXRFcnJvckhhbmRsZXIoZXJyb3JEYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShlcnJvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS9jbGllbnQtZXJyb3JzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjb250ZW50XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoYXBwU3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYmFyID0gbmV3IEVkaXRvckJhcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzaWduZXInKSwgdGhpcy5zdG9yZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUVkaXRvciA9IG5ldyBTZWxlY3RlZEl0ZW1FZGl0b3IoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0b3JPdmVybGF5XCIpLCB0aGlzLnN0b3JlKTtcclxuICAgICAgICAgICAgY29uc3QgaGVscERpYWxvZyA9IG5ldyBIZWxwRGlhbG9nKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVscC1kaWFsb2dcIiksIHRoaXMuc3RvcmUpO1xyXG5cclxuICAgICAgICAgICAgLy8gZXZlbnRzLnN1YnNjcmliZShtID0+IGNvbnNvbGUubG9nKFwiZXZlbnRcIiwgbS50eXBlLCBtLmRhdGEpKTtcclxuICAgICAgICAgICAgLy8gYWN0aW9ucy5zdWJzY3JpYmUobSA9PiBjb25zb2xlLmxvZyhcImFjdGlvblwiLCBtLnR5cGUsIG0uZGF0YSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhcnQoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3IuZm9udExvYWRlZC5vYnNlcnZlKCkuZmlyc3QoKS5zdWJzY3JpYmUobSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy53b3Jrc3BhY2VDb250cm9sbGVyID0gbmV3IFdvcmtzcGFjZUNvbnRyb2xsZXIodGhpcy5zdG9yZSwgbS5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmluaXRXb3Jrc3BhY2UuZGlzcGF0Y2goKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmV2ZW50cy5lZGl0b3Iud29ya3NwYWNlSW5pdGlhbGl6ZWQuc3ViKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwiYmVmb3JldW5sb2FkXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoSXNEaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiWW91ciBsYXRlc3QgY2hhbmdlcyBhcmUgbm90IHNhdmVkIHlldC5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9wZW5Ta2V0Y2goaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLm9wZW4uZGlzcGF0Y2goaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTa2V0Y2hIZWxwZXJzIHtcclxuXHJcbiAgICAgICAgc3RhdGljIGNvbG9yc0luVXNlKHNrZXRjaDogU2tldGNoKTogc3RyaW5nW10ge1xyXG4gICAgICAgICAgICBsZXQgY29sb3JzID0gW3NrZXRjaC5iYWNrZ3JvdW5kQ29sb3JdO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHNrZXRjaC50ZXh0QmxvY2tzKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChibG9jay5iYWNrZ3JvdW5kQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goYmxvY2sudGV4dENvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb2xvcnMgPSBfLnVuaXEoY29sb3JzLmZpbHRlcihjID0+IGMgIT0gbnVsbCkpO1xyXG4gICAgICAgICAgICBjb2xvcnMuc29ydCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBzdGF0aWMgZ2V0U2tldGNoRmlsZU5hbWUoc2tldGNoOiBTa2V0Y2gsIGxlbmd0aDogbnVtYmVyLCBleHRlbnNpb246IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gXCJcIjtcclxuICAgICAgICAgICAgb3V0ZXI6XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2Ygc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBibG9jay50ZXh0LnNwbGl0KC9cXHMvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyaW0gPSB3b3JkLnJlcGxhY2UoL1xcVy9nLCAnJykudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmltLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIG5hbWUgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKz0gdHJpbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID49IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFuYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IFwiZmlkZGxlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgKyBcIi5cIiArIGV4dGVuc2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIlxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzaW5nbGV0b24gU3RvcmUgY29udHJvbHMgYWxsIGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogTm8gcGFydHMgb3V0c2lkZSBvZiB0aGUgU3RvcmUgbW9kaWZ5IGFwcGxpY2F0aW9uIHN0YXRlLlxyXG4gICAgICogQ29tbXVuaWNhdGlvbiB3aXRoIHRoZSBTdG9yZSBpcyBkb25lIHRocm91Z2ggbWVzc2FnZSBDaGFubmVsczogXHJcbiAgICAgKiAgIC0gQWN0aW9ucyBjaGFubmVsIHRvIHNlbmQgaW50byB0aGUgU3RvcmUsXHJcbiAgICAgKiAgIC0gRXZlbnRzIGNoYW5uZWwgdG8gcmVjZWl2ZSBub3RpZmljYXRpb24gZnJvbSB0aGUgU3RvcmUuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gcmVjZWl2ZSBhY3Rpb24gbWVzc2FnZXMuXHJcbiAgICAgKiBPbmx5IHRoZSBTdG9yZSBjYW4gc2VuZCBldmVudCBtZXNzYWdlcy5cclxuICAgICAqIFRoZSBTdG9yZSBjYW5ub3Qgc2VuZCBhY3Rpb25zIG9yIGxpc3RlbiB0byBldmVudHMgKHRvIGF2b2lkIGxvb3BzKS5cclxuICAgICAqIE1lc3NhZ2VzIGFyZSB0byBiZSB0cmVhdGVkIGFzIGltbXV0YWJsZS5cclxuICAgICAqIEFsbCBtZW50aW9ucyBvZiB0aGUgU3RvcmUgY2FuIGJlIGFzc3VtZWQgdG8gbWVhbiwgb2YgY291cnNlLFxyXG4gICAgICogICBcIlRoZSBTdG9yZSBhbmQgaXRzIHN1Yi1jb21wb25lbnRzLlwiXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTdG9yZSB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBCUk9XU0VSX0lEX0tFWSA9IFwiYnJvd3NlcklkXCI7XHJcbiAgICAgICAgc3RhdGljIEZBTExCQUNLX0ZPTlRfVVJMID0gXCIvZm9udHMvUm9ib3RvLTUwMC50dGZcIjtcclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX05BTUUgPSBcIlJvYm90b1wiO1xyXG4gICAgICAgIHN0YXRpYyBTS0VUQ0hfTE9DQUxfQ0FDSEVfS0VZID0gXCJmaWRkbGVzdGlja3MuaW8ubGFzdFNrZXRjaFwiO1xyXG4gICAgICAgIHN0YXRpYyBMT0NBTF9DQUNIRV9ERUxBWV9NUyA9IDEwMDA7XHJcbiAgICAgICAgc3RhdGljIFNFUlZFUl9TQVZFX0RFTEFZX01TID0gMTAwMDA7XHJcbiAgICAgICAgc3RhdGljIEdSRUVUSU5HX1NLRVRDSF9JRCA9IFwiaW0yYmE5MmkxNzE0aVwiO1xyXG5cclxuICAgICAgICBzdGF0ZTogRWRpdG9yU3RhdGUgPSB7fTtcclxuICAgICAgICByZXNvdXJjZXMgPSB7XHJcbiAgICAgICAgICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udCxcclxuICAgICAgICAgICAgZm9udEZhbWlsaWVzOiBuZXcgRm9udFNoYXBlLkZvbnRGYW1pbGllcyhcImZvbnRzL2dvb2dsZS1mb250cy5qc29uXCIpLFxyXG4gICAgICAgICAgICBwYXJzZWRGb250czogbmV3IEZvbnRTaGFwZS5QYXJzZWRGb250cyhwYXJzZWQgPT5cclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci5mb250TG9hZGVkLmRpc3BhdGNoKHBhcnNlZC5mb250KSlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xyXG4gICAgICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhcHBTdG9yZTogQXBwLlN0b3JlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihhcHBTdG9yZTogQXBwLlN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUgPSBhcHBTdG9yZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXBTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXR1cFN1YnNjcmlwdGlvbnMoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubG9hZFJlc291cmNlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0dXBTdGF0ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5icm93c2VySWQgPSBDb29raWVzLmdldChTdG9yZS5CUk9XU0VSX0lEX0tFWSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5icm93c2VySWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuYnJvd3NlcklkID0gbmV3aWQoKTtcclxuICAgICAgICAgICAgICAgIENvb2tpZXMuc2V0KFN0b3JlLkJST1dTRVJfSURfS0VZLCB0aGlzLnN0YXRlLmJyb3dzZXJJZCwgeyBleHBpcmVzOiAyICogMzY1IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXR1cFN1YnNjcmlwdGlvbnMoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmFjdGlvbnMsIGV2ZW50cyA9IHRoaXMuZXZlbnRzO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gQXBwIC0tLS0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmV2ZW50cy5yb3V0ZUNoYW5nZWQuc3ViKHJvdXRlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlU2tldGNoSWQgPSByb3V0ZS5wYXJhbXMuc2tldGNoSWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGUubmFtZSA9PT0gXCJza2V0Y2hcIiAmJiByb3V0ZVNrZXRjaElkICE9PSB0aGlzLnN0YXRlLnNrZXRjaC5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ta2V0Y2gocm91dGVTa2V0Y2hJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gRWRpdG9yIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5pbml0V29ya3NwYWNlLm9ic2VydmUoKVxyXG4gICAgICAgICAgICAgICAgLnBhdXNhYmxlQnVmZmVyZWQoZXZlbnRzLmVkaXRvci5yZXNvdXJjZXNSZWFkeS5vYnNlcnZlKCkubWFwKG0gPT4gbS5kYXRhKSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2tldGNoSWQgPSB0aGlzLmFwcFN0b3JlLnN0YXRlLnJvdXRlLnBhcmFtcy5za2V0Y2hJZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCB0aGlzLmFwcFN0b3JlLnN0YXRlLmxhc3RTYXZlZFNrZXRjaElkO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9taXNlOiBKUXVlcnlQcm9taXNlPGFueT47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNrZXRjaElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLm9wZW5Ta2V0Y2goc2tldGNoSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLmxvYWRHcmVldGluZ1NrZXRjaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4gZXZlbnRzLmVkaXRvci53b3Jrc3BhY2VJbml0aWFsaXplZC5kaXNwYXRjaCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb24gYW55IGFjdGlvbiwgdXBkYXRlIHNhdmUgZGVsYXkgdGltZXJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbnMub2JzZXJ2ZSgpLmRlYm91bmNlKFN0b3JlLlNFUlZFUl9TQVZFX0RFTEFZX01TKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IHRoaXMuc3RhdGUuc2tldGNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmxvYWRpbmdTa2V0Y2hcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBza2V0Y2guX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgc2tldGNoLnRleHRCbG9ja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5sb2FkRm9udC5zdWJzY3JpYmUobSA9PlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KG0uZGF0YSkpO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3Iuem9vbVRvRml0LmZvcndhcmQoXHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnpvb21Ub0ZpdFJlcXVlc3RlZCk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5leHBvcnRQTkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5leHBvcnRQTkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci5leHBvcnRTVkcuc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRpbmdJdGVtKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVkaXRvci5leHBvcnRTVkdSZXF1ZXN0ZWQuZGlzcGF0Y2gobS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLmVkaXRvci52aWV3Q2hhbmdlZC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuZWRpdG9yLnZpZXdDaGFuZ2VkLmRpc3BhdGNoKG0uZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5lZGl0b3IudXBkYXRlU25hcHNob3Quc3ViKCh7c2tldGNoSWQsIHBuZ0RhdGFVcmx9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2tldGNoSWQgPT09IHRoaXMuc3RhdGUuc2tldGNoLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gc2tldGNoSWQgKyBcIi5wbmdcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKHBuZ0RhdGFVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIFMzQWNjZXNzLnB1dEZpbGUoZmlsZU5hbWUsIFwiaW1hZ2UvcG5nXCIsIGJsb2IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2hvd0hlbHAgPSAhdGhpcy5zdGF0ZS5zaG93SGVscDtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lZGl0b3Iuc2hvd0hlbHBDaGFuZ2VkLmRpc3BhdGNoKHRoaXMuc3RhdGUuc2hvd0hlbHApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuZWRpdG9yLm9wZW5TYW1wbGUuc3ViKCgpID0+IHRoaXMubG9hZEdyZWV0aW5nU2tldGNoKCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5vcGVuLnN1YihpZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ta2V0Y2goaWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNyZWF0ZS5zdWIoKGF0dHIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3U2tldGNoKGF0dHIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMuc2tldGNoLmNsZWFyLnN1YigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyU2tldGNoKCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5jbG9uZS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBfLmNsb25lKHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIGNsb25lLl9pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgICAgICAgICBjbG9uZS5icm93c2VySWQgPSB0aGlzLnN0YXRlLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgICAgIGNsb25lLnNhdmVkQXQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKGNsb25lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoSXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmNsb25lZC5kaXNwYXRjaChjbG9uZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnB1bHNlVXNlck1lc3NhZ2UoXCJEdXBsaWNhdGVkIHNrZXRjaC4gQWRkcmVzcyBvZiB0aGlzIHBhZ2UgaGFzIGJlZW4gdXBkYXRlZC5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9ucy5za2V0Y2guYXR0clVwZGF0ZS5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZSh0aGlzLnN0YXRlLnNrZXRjaCwgZXYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkLmRpc3BhdGNoKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uc3Vic2NyaWJlKG0gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24obS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obS5kYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gVGV4dEJsb2NrIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5hZGRcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdGluZ0l0ZW0obnVsbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXRjaCA9IGV2LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXRjaC50ZXh0IHx8ICFwYXRjaC50ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHsgX2lkOiBuZXdpZCgpIH0gYXMgVGV4dEJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVyZ2UoYmxvY2ssIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sudGV4dENvbG9yID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIudGV4dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmJhY2tncm91bmRDb2xvciA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJsb2NrLmZvbnRGYW1pbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2suZm9udEZhbWlseSA9IHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyLmZvbnRGYW1pbHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gdGhpcy5zdGF0ZS5za2V0Y2guZGVmYXVsdFRleHRCbG9ja0F0dHIuZm9udFZhcmlhbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYWRkZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udChibG9jayk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUF0dHJcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0Y2ggPSA8VGV4dEJsb2NrPntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGV2LmRhdGEudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZXYuZGF0YS5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IGV2LmRhdGEudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogZXYuZGF0YS5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFZhcmlhbnQ6IGV2LmRhdGEuZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9udENoYW5nZWQgPSBwYXRjaC5mb250RmFtaWx5ICE9PSBibG9jay5mb250RmFtaWx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBwYXRjaC5mb250VmFyaWFudCAhPT0gYmxvY2suZm9udFZhcmlhbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVyZ2UoYmxvY2ssIHBhdGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5mb250RmFtaWx5ICYmICFibG9jay5mb250VmFyaWFudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFtRGVmID0gdGhpcy5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmdldChibG9jay5mb250RmFtaWx5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmYW1EZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWd1bGFyIG9yIGVsc2UgZmlyc3QgdmFyaWFudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLmZvbnRWYXJpYW50ID0gdGhpcy5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmRlZmF1bHRWYXJpYW50KGZhbURlZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoLmRlZmF1bHRUZXh0QmxvY2tBdHRyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBibG9jay50ZXh0Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJsb2NrLmJhY2tncm91bmRDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGJsb2NrLmZvbnRGYW1pbHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogYmxvY2suZm9udFZhcmlhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9udENoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFRleHRCbG9ja0ZvbnQoYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhY3Rpb25zLnRleHRCbG9jay5yZW1vdmVcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaWREZWxldGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLnN0YXRlLnNrZXRjaC50ZXh0QmxvY2tzLCB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0Yi5faWQgPT09IGV2LmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWREZWxldGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2sucmVtb3ZlZC5kaXNwYXRjaCh7IF9pZDogZXYuZGF0YS5faWQgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFNrZXRjaENvbnRlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0aW5nSXRlbShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2VcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IHRoaXMuZ2V0QmxvY2soZXYuZGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5wb3NpdGlvbiA9IGV2LmRhdGEucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLm91dGxpbmUgPSBldi5kYXRhLm91dGxpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy50ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWQuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWRTa2V0Y2hDb250ZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIG9wZW5Ta2V0Y2goaWQ6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8U2tldGNoPiB7XHJcbiAgICAgICAgICAgIGlmICghaWQgfHwgIWlkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBTM0FjY2Vzcy5nZXRKc29uKGlkICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAoc2tldGNoOiBTa2V0Y2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTa2V0Y2goc2tldGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXRyaWV2ZWQgc2tldGNoXCIsIHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChza2V0Y2guYnJvd3NlcklkID09PSB0aGlzLnN0YXRlLmJyb3dzZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2tldGNoIHdhcyBjcmVhdGVkIGluIHRoaXMgYnJvd3NlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NrZXRjaCB3YXMgY3JlYXRlZCBpbiBhIGRpZmZlcmVudCBicm93c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2tldGNoO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZXJyb3IgZ2V0dGluZyByZW1vdGUgc2tldGNoXCIsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkR3JlZXRpbmdTa2V0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkU2tldGNoKHNrZXRjaDogU2tldGNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoID0gc2tldGNoO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VXNlck1lc3NhZ2UoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5sb2FkZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcFN0b3JlLmFjdGlvbnMuZWRpdG9yTG9hZGVkU2tldGNoLmRpc3BhdGNoKHNrZXRjaC5faWQpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRiIG9mIHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5sb2FkZWQuZGlzcGF0Y2godGIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVGV4dEJsb2NrRm9udCh0Yik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci56b29tVG9GaXRSZXF1ZXN0ZWQuZGlzcGF0Y2goKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubG9hZGluZ1NrZXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkR3JlZXRpbmdTa2V0Y2goKTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFMzQWNjZXNzLmdldEpzb24oU3RvcmUuR1JFRVRJTkdfU0tFVENIX0lEICsgXCIuanNvblwiKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKHNrZXRjaDogU2tldGNoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLl9pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoLmJyb3dzZXJJZCA9IHRoaXMuc3RhdGUuYnJvd3NlcklkO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFNrZXRjaChza2V0Y2gpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNsZWFyU2tldGNoKCkge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKTtcclxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IHRoaXMuc3RhdGUuc2tldGNoLl9pZDtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRSZXNvdXJjZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5sb2FkQ2F0YWxvZ0xvY2FsKGZhbWlsaWVzID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGxvYWQgZm9udHMgaW50byBicm93c2VyIGZvciBwcmV2aWV3XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlcy5mb250RmFtaWxpZXMubG9hZFByZXZpZXdTdWJzZXRzKGZhbWlsaWVzLm1hcChmID0+IGYuZmFtaWx5KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFN0b3JlLkZBTExCQUNLX0ZPTlRfVVJMKS50aGVuKCh7Zm9udH0pID0+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZmFsbGJhY2tGb250ID0gZm9udCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuZWRpdG9yLnJlc291cmNlc1JlYWR5LmRpc3BhdGNoKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0VXNlck1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnVzZXJNZXNzYWdlICE9PSBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnVzZXJNZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVkaXRvci51c2VyTWVzc2FnZUNoYW5nZWQuZGlzcGF0Y2gobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcHVsc2VVc2VyTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpLCA0MDAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0RGVmYXVsdFVzZXJNZXNzYWdlKCkge1xyXG4gICAgICAgICAgICAvLyBpZiBub3QgdGhlIGxhc3Qgc2F2ZWQgc2tldGNoLCBvciBza2V0Y2ggaXMgZGlydHksIHNob3cgXCJVbnNhdmVkXCJcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICh0aGlzLnN0YXRlLnNrZXRjaElzRGlydHlcclxuICAgICAgICAgICAgICAgIHx8ICF0aGlzLnN0YXRlLnNrZXRjaC5zYXZlZEF0KVxyXG4gICAgICAgICAgICAgICAgPyBcIlVuc2F2ZWRcIlxyXG4gICAgICAgICAgICAgICAgOiBcIlNhdmVkXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRUZXh0QmxvY2tGb250KGJsb2NrOiBUZXh0QmxvY2spIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMucGFyc2VkRm9udHMuZ2V0KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmdldFVybChibG9jay5mb250RmFtaWx5LCBibG9jay5mb250VmFyaWFudCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoe2ZvbnR9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLnRleHRibG9jay5mb250UmVhZHkuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dEJsb2NrSWQ6IGJsb2NrLl9pZCwgZm9udCB9KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGNoYW5nZWRTa2V0Y2hDb250ZW50KCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaElzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5za2V0Y2guY29udGVudENoYW5nZWQuZGlzcGF0Y2godGhpcy5zdGF0ZS5za2V0Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBtZXJnZTxUPihkZXN0OiBULCBzb3VyY2U6IFQpIHtcclxuICAgICAgICAgICAgXy5tZXJnZShkZXN0LCBzb3VyY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBuZXdTa2V0Y2goYXR0cj86IFNrZXRjaEF0dHIpOiBTa2V0Y2gge1xyXG4gICAgICAgICAgICBjb25zdCBza2V0Y2ggPSA8U2tldGNoPnRoaXMuZGVmYXVsdFNrZXRjaEF0dHIoKTtcclxuICAgICAgICAgICAgc2tldGNoLl9pZCA9IG5ld2lkKCk7XHJcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lcmdlKHNrZXRjaCwgYXR0cik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5sb2FkU2tldGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBza2V0Y2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRlZmF1bHRTa2V0Y2hBdHRyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFNrZXRjaEF0dHI+e1xyXG4gICAgICAgICAgICAgICAgYnJvd3NlcklkOiB0aGlzLnN0YXRlLmJyb3dzZXJJZCxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJSb2JvdG9cIixcclxuICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogXCJyZWd1bGFyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dENvbG9yOiBcImdyYXlcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICAgICAgICAgICAgdGV4dEJsb2NrczogPFRleHRCbG9ja1tdPltdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNhdmVTa2V0Y2goc2tldGNoOiBTa2V0Y2gpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2F2aW5nID0gXy5jbG9uZShza2V0Y2gpO1xyXG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBzYXZpbmcuc2F2ZWRBdCA9IG5vdztcclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VyTWVzc2FnZShcIlNhdmluZ1wiKTtcclxuICAgICAgICAgICAgUzNBY2Nlc3MucHV0RmlsZShza2V0Y2guX2lkICsgXCIuanNvblwiLFxyXG4gICAgICAgICAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCIsIEpTT04uc3RyaW5naWZ5KHNhdmluZykpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hJc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2guc2F2ZWRBdCA9IG5vdztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERlZmF1bHRVc2VyTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RvcmUuYWN0aW9ucy5lZGl0b3JTYXZlZFNrZXRjaC5kaXNwYXRjaChza2V0Y2guX2lkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5lZGl0b3Iuc25hcHNob3RFeHBpcmVkLmRpc3BhdGNoKHNrZXRjaCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlck1lc3NhZ2UoXCJVbmFibGUgdG8gc2F2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRTZWxlY3Rpb24oaXRlbTogV29ya3NwYWNlT2JqZWN0UmVmLCBmb3JjZTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHRoaXMuc3RhdGUuc2VsZWN0aW9uLml0ZW1JZCA9PT0gaXRlbS5pdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNlbGVjdGlvbiA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLmRpc3BhdGNoKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRFZGl0aW5nSXRlbShpdGVtOiBQb3NpdGlvbmVkT2JqZWN0UmVmLCBmb3JjZT86IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCFmb3JjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZWFybHkgZXhpdCBvbiBubyBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbS5pdGVtSWQgPT09IGl0ZW0uaXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2lnbmFsIGNsb3NpbmcgZWRpdG9yIGZvciBpdGVtXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ0l0ZW0uaXRlbVR5cGUgPT09IFwiVGV4dEJsb2NrXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RWRpdGluZ0Jsb2NrID0gdGhpcy5nZXRCbG9jayh0aGlzLnN0YXRlLmVkaXRpbmdJdGVtLml0ZW1JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFZGl0aW5nQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHMudGV4dGJsb2NrLmVkaXRvckNsb3NlZC5kaXNwYXRjaChjdXJyZW50RWRpdGluZ0Jsb2NrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlZGl0aW5nIGl0ZW0gc2hvdWxkIGJlIHNlbGVjdGVkIGl0ZW1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmVkaXRpbmdJdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5kaXNwYXRjaChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0QmxvY2soaWQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsIHRiID0+IHRiLl9pZCA9PT0gaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFdvcmtzcGFjZUNvbnRyb2xsZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgVEVYVF9DSEFOR0VfUkVOREVSX1RIUk9UVExFX01TID0gNTAwO1xyXG4gICAgICAgIHN0YXRpYyBCTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TID0gNTAwO1xyXG5cclxuICAgICAgICBkZWZhdWx0U2l6ZSA9IG5ldyBwYXBlci5TaXplKDUwMDAwLCA0MDAwMCk7XHJcbiAgICAgICAgZGVmYXVsdFNjYWxlID0gMC4wMjtcclxuXHJcbiAgICAgICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICBwcm9qZWN0OiBwYXBlci5Qcm9qZWN0O1xyXG4gICAgICAgIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udDtcclxuICAgICAgICB2aWV3Wm9vbTogcGFwZXJFeHQuVmlld1pvb207XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlO1xyXG4gICAgICAgIHByaXZhdGUgX3NrZXRjaDogU2tldGNoO1xyXG4gICAgICAgIHByaXZhdGUgX3RleHRCbG9ja0l0ZW1zOiB7IFt0ZXh0QmxvY2tJZDogc3RyaW5nXTogVGV4dFdhcnAgfSA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihzdG9yZTogU3RvcmUsIGZhbGxiYWNrRm9udDogb3BlbnR5cGUuRm9udCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgICAgIHRoaXMuZmFsbGJhY2tGb250ID0gZmFsbGJhY2tGb250O1xyXG4gICAgICAgICAgICBwYXBlci5zZXR0aW5ncy5oYW5kbGVTaXplID0gMTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluQ2FudmFzJyk7XHJcbiAgICAgICAgICAgIHBhcGVyLnNldHVwKHRoaXMuY2FudmFzKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0ID0gcGFwZXIucHJvamVjdDtcclxuICAgICAgICAgICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4gdGhpcy5wcm9qZWN0LnZpZXcuZHJhdygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2FudmFzU2VsID0gJCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5tZXJnZVR5cGVkKFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5sb2FkZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmF0dHJDaGFuZ2VkXHJcbiAgICAgICAgICAgICkuc3Vic2NyaWJlKGV2ID0+XHJcbiAgICAgICAgICAgICAgICBjYW52YXNTZWwuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBldi5kYXRhLmJhY2tncm91bmRDb2xvcilcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZpZXdab29tID0gbmV3IHBhcGVyRXh0LlZpZXdab29tKHRoaXMucHJvamVjdCk7XHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20uc2V0Wm9vbVJhbmdlKFtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkodGhpcy5kZWZhdWx0U2NhbGUgKiAwLjEpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2l6ZS5tdWx0aXBseSgwLjUpXSk7XHJcbiAgICAgICAgICAgIHRoaXMudmlld1pvb20udmlld0NoYW5nZWQuc3Vic2NyaWJlKGJvdW5kcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLmVkaXRvci52aWV3Q2hhbmdlZC5kaXNwYXRjaChib3VuZHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNsZWFyU2VsZWN0aW9uID0gKGV2OiBwYXBlci5QYXBlck1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChzdG9yZS5zdGF0ZS5zZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2gobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGFwZXIudmlldy5vbihwYXBlci5FdmVudFR5cGUuY2xpY2ssIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wcm9qZWN0LmhpdFRlc3QoZXYucG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJTZWxlY3Rpb24oZXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcGFwZXIudmlldy5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGNsZWFyU2VsZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGtleUhhbmRsZXIgPSBuZXcgRG9jdW1lbnRLZXlIYW5kbGVyKHN0b3JlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIERlc2lnbmVyIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLndvcmtzcGFjZUluaXRpYWxpemVkLnN1YigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3Qudmlldy5kcmF3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci56b29tVG9GaXRSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuem9vbVRvRml0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5leHBvcnRTVkdSZXF1ZXN0ZWQuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG93bmxvYWRTVkcoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLmV4cG9ydFBOR1JlcXVlc3RlZC5zdWIoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZFBORygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5lZGl0b3Iuc25hcHNob3RFeHBpcmVkLnN1YigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRTbmFwc2hvdFBORyg3Mik7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5hY3Rpb25zLmVkaXRvci51cGRhdGVTbmFwc2hvdC5kaXNwYXRjaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tldGNoSWQ6IHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLl9pZCwgcG5nRGF0YVVybDogZGF0YVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0tLS0gU2tldGNoIC0tLS0tXHJcblxyXG4gICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2tldGNoID0gZXYuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2plY3QuZGVzZWxlY3RBbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZXh0QmxvY2tJdGVtcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdC5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG0uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBibG9jayA9IG0uZGF0YS5pdGVtSWQgJiYgdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLml0ZW1JZF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrICYmICFibG9jay5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jay5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIC0tLS0tIFRleHRCbG9jayAtLS0tLVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLm1lcmdlVHlwZWQoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmFkZGVkLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5sb2FkZWRcclxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICAgICBldiA9PiB0aGlzLmFkZEJsb2NrKGV2LmRhdGEpKTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suYXR0ckNoYW5nZWRcclxuICAgICAgICAgICAgICAgIC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC50aHJvdHRsZShXb3Jrc3BhY2VDb250cm9sbGVyLlRFWFRfQ0hBTkdFX1JFTkRFUl9USFJPVFRMRV9NUylcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUobSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1ttLmRhdGEuX2lkXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0QmxvY2sgPSBtLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHRleHRCbG9jay50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmN1c3RvbVN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiB0ZXh0QmxvY2sudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0ZXh0QmxvY2suYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suZm9udFJlYWR5LnN1YihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl90ZXh0QmxvY2tJdGVtc1tkYXRhLnRleHRCbG9ja0lkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5mb250ID0gZGF0YS5mb250O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLnRleHRibG9jay5yZW1vdmVkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3RleHRCbG9ja0l0ZW1zW20uZGF0YS5faWRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLmV2ZW50cy50ZXh0YmxvY2suZWRpdG9yQ2xvc2VkLnN1YnNjcmliZShtID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdGV4dEJsb2NrSXRlbXNbbS5kYXRhLl9pZF07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHpvb21Ub0ZpdCgpIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdab29tLnpvb21Ubyhib3VuZHMuc2NhbGUoMS4yKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldFZpZXdhYmxlQm91bmRzKCk6IHBhcGVyLlJlY3RhbmdsZSB7XHJcbiAgICAgICAgICAgIGxldCBib3VuZHM6IHBhcGVyLlJlY3RhbmdsZTtcclxuICAgICAgICAgICAgXy5mb3JPd24odGhpcy5fdGV4dEJsb2NrSXRlbXMsIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMgPSBib3VuZHNcclxuICAgICAgICAgICAgICAgICAgICA/IGJvdW5kcy51bml0ZShpdGVtLmJvdW5kcylcclxuICAgICAgICAgICAgICAgICAgICA6IGl0ZW0uYm91bmRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKCFib3VuZHMpIHtcclxuICAgICAgICAgICAgICAgIGJvdW5kcyA9IG5ldyBwYXBlci5SZWN0YW5nbGUobmV3IHBhcGVyLlBvaW50KDAsIDApLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNpemUubXVsdGlwbHkodGhpcy5kZWZhdWx0U2NhbGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYm91bmRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHJldHVybnMgZGF0YSBVUkxcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIGdldFNuYXBzaG90UE5HKGRwaTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuaW5zZXJ0QmFja2dyb3VuZCgpO1xyXG4gICAgICAgICAgICBjb25zdCByYXN0ZXIgPSB0aGlzLnByb2plY3QuYWN0aXZlTGF5ZXIucmFzdGVyaXplKGRwaSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gcmFzdGVyLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZG93bmxvYWRQTkcoKSB7XHJcbiAgICAgICAgICAgIC8vIEhhbGYgb2YgbWF4IERQSSBwcm9kdWNlcyBhcHByb3ggNDIwMHg0MjAwLlxyXG4gICAgICAgICAgICBjb25zdCBkcGkgPSAwLjUgKiBQYXBlckhlbHBlcnMuZ2V0TWF4RXhwb3J0RHBpKHRoaXMucHJvamVjdC5hY3RpdmVMYXllci5ib3VuZHMuc2l6ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldFNuYXBzaG90UE5HKGRwaSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IFNrZXRjaEhlbHBlcnMuZ2V0U2tldGNoRmlsZU5hbWUoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCwgNDAsIFwicG5nXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGEpO1xyXG4gICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3dubG9hZFNWRygpIHtcclxuICAgICAgICAgICAgbGV0IGJhY2tncm91bmQ6IHBhcGVyLkl0ZW07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaC5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQgPSB0aGlzLmluc2VydEJhY2tncm91bmQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGFVcmwgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgICAgICAgPHN0cmluZz50aGlzLnByb2plY3QuZXhwb3J0U1ZHKHsgYXNTdHJpbmc6IHRydWUgfSkpO1xyXG4gICAgICAgICAgICBjb25zdCBibG9iID0gRG9tSGVscGVycy5kYXRhVVJMVG9CbG9iKGRhdGFVcmwpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IFNrZXRjaEhlbHBlcnMuZ2V0U2tldGNoRmlsZU5hbWUoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnN0YXRlLnNrZXRjaCwgNDAsIFwic3ZnXCIpO1xyXG4gICAgICAgICAgICBzYXZlQXMoYmxvYiwgZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJhY2tncm91bmQpIHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc2VydCBza2V0Y2ggYmFja2dyb3VuZCB0byBwcm92aWRlIGJhY2tncm91bmQgZmlsbCAoaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgICAqICAgYW5kIGFkZCBtYXJnaW4gYXJvdW5kIGVkZ2VzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgaW5zZXJ0QmFja2dyb3VuZCgpOiBwYXBlci5JdGVtIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRWaWV3YWJsZUJvdW5kcygpO1xyXG4gICAgICAgICAgICBjb25zdCBtYXJnaW4gPSBNYXRoLm1heChib3VuZHMud2lkdGgsIGJvdW5kcy5oZWlnaHQpICogMC4wMjtcclxuICAgICAgICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHBhcGVyLlNoYXBlLlJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3BMZWZ0LnN1YnRyYWN0KG1hcmdpbiksXHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tUmlnaHQuYWRkKG1hcmdpbikpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLmZpbGxDb2xvciA9IHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC5zZW5kVG9CYWNrKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhZGRCbG9jayh0ZXh0QmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5faWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlY2VpdmVkIGJsb2NrIHdpdGhvdXQgaWQnLCB0ZXh0QmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlJlY2VpdmVkIGFkZEJsb2NrIGZvciBibG9jayB0aGF0IGlzIGFscmVhZHkgbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgYm91bmRzOiB7IHVwcGVyOiBwYXBlci5TZWdtZW50W10sIGxvd2VyOiBwYXBlci5TZWdtZW50W10gfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZXh0QmxvY2sub3V0bGluZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZFNlZ21lbnQgPSAocmVjb3JkOiBTZWdtZW50UmVjb3JkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSByZWNvcmRbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwYXBlci5TZWdtZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KHJlY29yZFswXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbMV0gJiYgbmV3IHBhcGVyLlBvaW50KHJlY29yZFsxXSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbMl0gJiYgbmV3IHBhcGVyLlBvaW50KHJlY29yZFsyXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5nbGUtcG9pbnQgc2VnbWVudHMgYXJlIHN0b3JlZCBhcyBudW1iZXJbMl1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBhcGVyLlNlZ21lbnQobmV3IHBhcGVyLlBvaW50KHJlY29yZCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB1cHBlcjogdGV4dEJsb2NrLm91dGxpbmUudG9wLnNlZ21lbnRzLm1hcChsb2FkU2VnbWVudCksXHJcbiAgICAgICAgICAgICAgICAgICAgbG93ZXI6IHRleHRCbG9jay5vdXRsaW5lLmJvdHRvbS5zZWdtZW50cy5tYXAobG9hZFNlZ21lbnQpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdGVtID0gbmV3IFRleHRXYXJwKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYWxsYmFja0ZvbnQsXHJcbiAgICAgICAgICAgICAgICB0ZXh0QmxvY2sudGV4dCxcclxuICAgICAgICAgICAgICAgIGJvdW5kcyxcclxuICAgICAgICAgICAgICAgIG51bGwsIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHRleHRCbG9jay50ZXh0Q29sb3IgfHwgXCJyZWRcIiwgICAgLy8gdGV4dENvbG9yIHNob3VsZCBoYXZlIGJlZW4gc2V0IGVsc2V3aGVyZSBcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRleHRCbG9jay5iYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcGFwZXJFeHQuZXh0ZW5kTW91c2VFdmVudHMoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5vdXRsaW5lICYmIHRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IG5ldyBwYXBlci5Qb2ludCh0ZXh0QmxvY2sucG9zaXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpdGVtLm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZWxlY3QgbmV4dCBpdGVtIGJlaGluZFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvdGhlckhpdHMgPSAoPFRleHRXYXJwW10+Xy52YWx1ZXModGhpcy5fdGV4dEJsb2NrSXRlbXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGkgPT4gaS5pZCAhPT0gaXRlbS5pZCAmJiAhIWkuaGl0VGVzdChldi5wb2ludCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG90aGVySXRlbSA9IF8uc29ydEJ5KG90aGVySGl0cywgaSA9PiBpLmluZGV4KVswXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVySXRlbS5icmluZ1RvRnJvbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJJZCA9IF8uZmluZEtleSh0aGlzLl90ZXh0QmxvY2tJdGVtcywgaSA9PiBpID09PSBvdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpdGVtSWQ6IG90aGVySWQsIGl0ZW1UeXBlOiBcIlRleHRCbG9ja1wiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmJyaW5nVG9Gcm9udCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLnNldFNlbGVjdGlvbi5kaXNwYXRjaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYnJpbmdUb0Zyb250KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnRyYW5zbGF0ZShldi5kZWx0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaXRlbS5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnRW5kLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSA8VGV4dEJsb2NrPnRoaXMuZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLl9pZCA9IHRleHRCbG9jay5faWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5zZXRTZWxlY3Rpb24uZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaXRlbUlkOiB0ZXh0QmxvY2suX2lkLCBpdGVtVHlwZTogXCJUZXh0QmxvY2tcIiB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtQ2hhbmdlJCA9IFBhcGVyTm90aWZ5Lm9ic2VydmUoaXRlbSwgUGFwZXJOb3RpZnkuQ2hhbmdlRmxhZy5HRU9NRVRSWSk7XHJcbiAgICAgICAgICAgIGl0ZW1DaGFuZ2UkXHJcbiAgICAgICAgICAgICAgICAuZGVib3VuY2UoV29ya3NwYWNlQ29udHJvbGxlci5CTE9DS19CT1VORFNfQ0hBTkdFX1RIUk9UVExFX01TKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gPFRleHRCbG9jaz50aGlzLmdldEJsb2NrQXJyYW5nZW1lbnQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suX2lkID0gdGV4dEJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnVwZGF0ZUFycmFuZ2UuZGlzcGF0Y2goYmxvY2spO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdGVtLmRhdGEgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICBpZiAoIXRleHRCbG9jay5wb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5wb3NpdGlvbiA9IHRoaXMucHJvamVjdC52aWV3LmJvdW5kcy5wb2ludC5hZGQoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlBvaW50KGl0ZW0uYm91bmRzLndpZHRoIC8gMiwgaXRlbS5ib3VuZHMuaGVpZ2h0IC8gMilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZCg1MCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRCbG9ja0l0ZW1zW3RleHRCbG9jay5faWRdID0gaXRlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0QmxvY2tBcnJhbmdlbWVudChpdGVtOiBUZXh0V2FycCk6IEJsb2NrQXJyYW5nZW1lbnQge1xyXG4gICAgICAgICAgICAvLyBleHBvcnQgcmV0dXJucyBhbiBhcnJheSB3aXRoIGl0ZW0gdHlwZSBhbmQgc2VyaWFsaXplZCBvYmplY3Q6XHJcbiAgICAgICAgICAgIC8vICAgW1wiUGF0aFwiLCBQYXRoUmVjb3JkXVxyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSA8UGF0aFJlY29yZD5pdGVtLnVwcGVyLmV4cG9ydEpTT04oeyBhc1N0cmluZzogZmFsc2UgfSlbMV07XHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IDxQYXRoUmVjb3JkPml0ZW0ubG93ZXIuZXhwb3J0SlNPTih7IGFzU3RyaW5nOiBmYWxzZSB9KVsxXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogW2l0ZW0ucG9zaXRpb24ueCwgaXRlbS5wb3NpdGlvbi55XSxcclxuICAgICAgICAgICAgICAgIG91dGxpbmU6IHsgdG9wLCBib3R0b20gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBY3Rpb25zIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG5cclxuICAgICAgICBlZGl0b3IgPSB7XHJcbiAgICAgICAgICAgIGluaXRXb3Jrc3BhY2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5pbml0V29ya3NwYWNlXCIpLFxyXG4gICAgICAgICAgICBsb2FkRm9udDogdGhpcy50b3BpYzxzdHJpbmc+KFwiZGVzaWduZXIubG9hZEZvbnRcIiksXHJcbiAgICAgICAgICAgIHpvb21Ub0ZpdDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnpvb21Ub0ZpdFwiKSxcclxuICAgICAgICAgICAgZXhwb3J0aW5nSW1hZ2U6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRJbWFnZVwiKSxcclxuICAgICAgICAgICAgZXhwb3J0UE5HOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0UE5HXCIpLFxyXG4gICAgICAgICAgICBleHBvcnRTVkc6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5leHBvcnRTVkdcIiksXHJcbiAgICAgICAgICAgIHZpZXdDaGFuZ2VkOiB0aGlzLnRvcGljPHBhcGVyLlJlY3RhbmdsZT4oXCJkZXNpZ25lci52aWV3Q2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgdXBkYXRlU25hcHNob3Q6IHRoaXMudG9waWM8eyBza2V0Y2hJZDogc3RyaW5nLCBwbmdEYXRhVXJsOiBzdHJpbmcgfT4oXCJkZXNpZ25lci51cGRhdGVTbmFwc2hvdFwiKSxcclxuICAgICAgICAgICAgdG9nZ2xlSGVscDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLnRvZ2dsZUhlbHBcIiksXHJcbiAgICAgICAgICAgIG9wZW5TYW1wbGU6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci5vcGVuU2FtcGxlXCIpLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2tldGNoID0ge1xyXG4gICAgICAgICAgICBjcmVhdGU6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guY3JlYXRlXCIpLFxyXG4gICAgICAgICAgICBjbGVhcjogdGhpcy50b3BpYzx2b2lkPihcInNrZXRjaC5jbGVhclwiKSxcclxuICAgICAgICAgICAgY2xvbmU6IHRoaXMudG9waWM8U2tldGNoQXR0cj4oXCJza2V0Y2guY2xvbmVcIiksXHJcbiAgICAgICAgICAgIG9wZW46IHRoaXMudG9waWM8c3RyaW5nPihcInNrZXRjaC5vcGVuXCIpLFxyXG4gICAgICAgICAgICBhdHRyVXBkYXRlOiB0aGlzLnRvcGljPFNrZXRjaEF0dHI+KFwic2tldGNoLmF0dHJVcGRhdGVcIiksXHJcbiAgICAgICAgICAgIHNldFNlbGVjdGlvbjogdGhpcy50b3BpYzxXb3Jrc3BhY2VPYmplY3RSZWY+KFwic2tldGNoLnNldFNlbGVjdGlvblwiKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0ZXh0QmxvY2sgPSB7XHJcbiAgICAgICAgICAgIGFkZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLmFkZFwiKSxcclxuICAgICAgICAgICAgdXBkYXRlQXR0cjogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dEJsb2NrLnVwZGF0ZUF0dHJcIiksXHJcbiAgICAgICAgICAgIHVwZGF0ZUFycmFuZ2U6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay51cGRhdGVBcnJhbmdlXCIpLFxyXG4gICAgICAgICAgICByZW1vdmU6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRCbG9jay5yZW1vdmVcIilcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZlbnRzIGV4dGVuZHMgVHlwZWRDaGFubmVsLkNoYW5uZWwge1xyXG5cclxuICAgICAgICBlZGl0b3IgPSB7XHJcbiAgICAgICAgICAgIHJlc291cmNlc1JlYWR5OiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiYXBwLnJlc291cmNlc1JlYWR5XCIpLFxyXG4gICAgICAgICAgICB3b3Jrc3BhY2VJbml0aWFsaXplZDogdGhpcy50b3BpYzx2b2lkPihcImFwcC53b3Jrc3BhY2VJbml0aWFsaXplZFwiKSxcclxuICAgICAgICAgICAgZm9udExvYWRlZDogdGhpcy50b3BpYzxvcGVudHlwZS5Gb250PihcImFwcC5mb250TG9hZGVkXCIpLFxyXG4gICAgICAgICAgICB6b29tVG9GaXRSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJkZXNpZ25lci56b29tVG9GaXRSZXF1ZXN0ZWRcIiksXHJcbiAgICAgICAgICAgIGV4cG9ydFBOR1JlcXVlc3RlZDogdGhpcy50b3BpYzx2b2lkPihcImRlc2lnbmVyLmV4cG9ydFBOR1JlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgZXhwb3J0U1ZHUmVxdWVzdGVkOiB0aGlzLnRvcGljPHZvaWQ+KFwiZGVzaWduZXIuZXhwb3J0U1ZHUmVxdWVzdGVkXCIpLFxyXG4gICAgICAgICAgICB2aWV3Q2hhbmdlZDogdGhpcy50b3BpYzxwYXBlci5SZWN0YW5nbGU+KFwiZGVzaWduZXIudmlld0NoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNuYXBzaG90RXhwaXJlZDogdGhpcy50b3BpYzxTa2V0Y2g+KFwiZGVzaWduZXIuc25hcHNob3RFeHBpcmVkXCIpLFxyXG4gICAgICAgICAgICB1c2VyTWVzc2FnZUNoYW5nZWQ6IHRoaXMudG9waWM8c3RyaW5nPihcImRlc2lnbmVyLnVzZXJNZXNzYWdlQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgc2hvd0hlbHBDaGFuZ2VkOiB0aGlzLnRvcGljPGJvb2xlYW4+KFwiZGVzaWduZXIuc2hvd0hlbHBDaGFuZ2VkXCIpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2tldGNoID0ge1xyXG4gICAgICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8U2tldGNoPihcInNrZXRjaC5sb2FkZWRcIiksXHJcbiAgICAgICAgICAgIGF0dHJDaGFuZ2VkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guYXR0ckNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIGNvbnRlbnRDaGFuZ2VkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guY29udGVudENoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIGVkaXRpbmdJdGVtQ2hhbmdlZDogdGhpcy50b3BpYzxQb3NpdGlvbmVkT2JqZWN0UmVmPihcInNrZXRjaC5lZGl0aW5nSXRlbUNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQ6IHRoaXMudG9waWM8V29ya3NwYWNlT2JqZWN0UmVmPihcInNrZXRjaC5zZWxlY3Rpb25DaGFuZ2VkXCIpLFxyXG4gICAgICAgICAgICBzYXZlTG9jYWxSZXF1ZXN0ZWQ6IHRoaXMudG9waWM8dm9pZD4oXCJza2V0Y2guc2F2ZWxvY2FsLnNhdmVMb2NhbFJlcXVlc3RlZFwiKSxcclxuICAgICAgICAgICAgY2xvbmVkOiB0aGlzLnRvcGljPFNrZXRjaD4oXCJza2V0Y2guY2xvbmVkXCIpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRleHRibG9jayA9IHtcclxuICAgICAgICAgICAgYWRkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hZGRlZFwiKSxcclxuICAgICAgICAgICAgYXR0ckNoYW5nZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5hdHRyQ2hhbmdlZFwiKSxcclxuICAgICAgICAgICAgZm9udFJlYWR5OiB0aGlzLnRvcGljPHsgdGV4dEJsb2NrSWQ6IHN0cmluZywgZm9udDogb3BlbnR5cGUuRm9udCB9PihcInRleHRibG9jay5mb250UmVhZHlcIiksXHJcbiAgICAgICAgICAgIGFycmFuZ2VDaGFuZ2VkOiB0aGlzLnRvcGljPFRleHRCbG9jaz4oXCJ0ZXh0YmxvY2suYXJyYW5nZUNoYW5nZWRcIiksXHJcbiAgICAgICAgICAgIHJlbW92ZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5yZW1vdmVkXCIpLFxyXG4gICAgICAgICAgICBsb2FkZWQ6IHRoaXMudG9waWM8VGV4dEJsb2NrPihcInRleHRibG9jay5sb2FkZWRcIiksXHJcbiAgICAgICAgICAgIGVkaXRvckNsb3NlZDogdGhpcy50b3BpYzxUZXh0QmxvY2s+KFwidGV4dGJsb2NrLmVkaXRvckNsb3NlZFwiKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ2hhbm5lbHMge1xyXG4gICAgICAgIGFjdGlvbnM6IEFjdGlvbnMgPSBuZXcgQWN0aW9ucygpO1xyXG4gICAgICAgIGV2ZW50czogRXZlbnRzID0gbmV3IEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIHR5cGUgQWN0aW9uVHlwZXMgPVxyXG4gICAgICAgIFwic2tldGNoLmNyZWF0ZVwiXHJcbiAgICAgICAgfCBcInNrZXRjaC51cGRhdGVcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2suYWRkXCJcclxuICAgICAgICB8IFwidGV4dGJsb2NrLnVwZGF0ZVwiO1xyXG5cclxuICAgIHR5cGUgRXZlbnRUeXBlcyA9XHJcbiAgICAgICAgXCJza2V0Y2gubG9hZGVkXCJcclxuICAgICAgICB8IFwic2tldGNoLmNoYW5nZWRcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2suYWRkZWRcIlxyXG4gICAgICAgIHwgXCJ0ZXh0YmxvY2suY2hhbmdlZFwiO1xyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRWRpdG9yU3RhdGUge1xyXG4gICAgICAgIGJyb3dzZXJJZD86IHN0cmluZztcclxuICAgICAgICBlZGl0aW5nSXRlbT86IFBvc2l0aW9uZWRPYmplY3RSZWY7XHJcbiAgICAgICAgc2VsZWN0aW9uPzogV29ya3NwYWNlT2JqZWN0UmVmO1xyXG4gICAgICAgIGxvYWRpbmdTa2V0Y2g/OiBib29sZWFuO1xyXG4gICAgICAgIHVzZXJNZXNzYWdlPzogc3RyaW5nO1xyXG4gICAgICAgIHNrZXRjaD86IFNrZXRjaDtcclxuICAgICAgICBzaG93SGVscD86IGJvb2xlYW47XHJcbiAgICAgICAgc2tldGNoSXNEaXJ0eT86IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2ggZXh0ZW5kcyBTa2V0Y2hBdHRyIHtcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICBicm93c2VySWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgc2F2ZWRBdD86IERhdGU7XHJcbiAgICAgICAgdGV4dEJsb2Nrcz86IFRleHRCbG9ja1tdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2tldGNoQXR0ciB7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGRlZmF1bHRUZXh0QmxvY2tBdHRyPzogVGV4dEJsb2NrO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBmYW1pbHk6IHN0cmluZztcclxuICAgICAgICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gICAgICAgIHZhcmlhbnQ6IHN0cmluZztcclxuICAgICAgICB1cmw6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFdvcmtzcGFjZU9iamVjdFJlZiB7XHJcbiAgICAgICAgaXRlbUlkOiBzdHJpbmc7XHJcbiAgICAgICAgaXRlbVR5cGU/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQb3NpdGlvbmVkT2JqZWN0UmVmIGV4dGVuZHMgV29ya3NwYWNlT2JqZWN0UmVmIHtcclxuICAgICAgICBjbGllbnRYPzogbnVtYmVyO1xyXG4gICAgICAgIGNsaWVudFk/OiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUZXh0QmxvY2sgZXh0ZW5kcyBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICBfaWQ/OiBzdHJpbmc7XHJcbiAgICAgICAgdGV4dD86IHN0cmluZztcclxuICAgICAgICB0ZXh0Q29sb3I/OiBzdHJpbmc7XHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRGYW1pbHk/OiBzdHJpbmc7XHJcbiAgICAgICAgZm9udFZhcmlhbnQ/OiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCbG9ja0FycmFuZ2VtZW50IHtcclxuICAgICAgICBwb3NpdGlvbj86IG51bWJlcltdLFxyXG4gICAgICAgIG91dGxpbmU/OiB7XHJcbiAgICAgICAgICAgIHRvcDogUGF0aFJlY29yZCxcclxuICAgICAgICAgICAgYm90dG9tOiBQYXRoUmVjb3JkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFja2dyb3VuZEFjdGlvblN0YXR1cyB7XHJcbiAgICAgICAgYWN0aW9uPzogT2JqZWN0O1xyXG4gICAgICAgIHJlamVjdGVkPzogYm9vbGVhbjtcclxuICAgICAgICBlcnJvcj86IGJvb2xlYW5cclxuICAgICAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGF0aFJlY29yZCB7XHJcbiAgICAgICAgc2VnbWVudHM6IFNlZ21lbnRSZWNvcmRbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNpbmdsZS1wb2ludCBzZWdtZW50cyBhcmUgc3RvcmVkIGFzIG51bWJlclsyXVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBTZWdtZW50UmVjb3JkID0gQXJyYXk8UG9pbnRSZWNvcmQ+IHwgQXJyYXk8bnVtYmVyPjtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBQb2ludFJlY29yZCA9IEFycmF5PG51bWJlcj47XHJcblxyXG59IiwiICAgIFxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuICAgIFxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldEZvbnREZXNjcmlwdGlvbihmYW1pbHk6IEZvbnRTaGFwZS5Gb250RmFtaWx5LCB2YXJpYW50Pzogc3RyaW5nKTogRm9udERlc2NyaXB0aW9uIHtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmc7XHJcbiAgICAgICAgdXJsID0gZmFtaWx5LmZpbGVzW3ZhcmlhbnQgfHwgXCJyZWd1bGFyXCJdO1xyXG4gICAgICAgIGlmKCF1cmwpe1xyXG4gICAgICAgICAgICB1cmwgPSBmYW1pbHkuZmlsZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZhbWlseTogZmFtaWx5LmZhbWlseSxcclxuICAgICAgICAgICAgY2F0ZWdvcnk6IGZhbWlseS5jYXRlZ29yeSxcclxuICAgICAgICAgICAgdmFyaWFudDogdmFyaWFudCxcclxuICAgICAgICAgICAgdXJsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUzNBY2Nlc3Mge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVcGxvYWQgZmlsZSB0byBhcHBsaWNhdGlvbiBTMyBidWNrZXQuXHJcbiAgICAgICAgICogUmV0dXJucyB1cGxvYWQgVVJMIGFzIGEgcHJvbWlzZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgcHV0RmlsZShmaWxlTmFtZTogc3RyaW5nLCBmaWxlVHlwZTogc3RyaW5nLCBkYXRhOiBCbG9iIHwgc3RyaW5nKVxyXG4gICAgICAgICAgICA6IEpRdWVyeVByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMvaXNzdWVzLzE5MCAgIFxyXG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRmlyZWZveC8pICYmICFmaWxlVHlwZS5tYXRjaCgvOy8pKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hhcnNldCA9ICc7IGNoYXJzZXQ9VVRGLTgnO1xyXG4gICAgICAgICAgICAgICAgZmlsZVR5cGUgKz0gY2hhcnNldDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2lnblVybCA9IGAvYXBpL3N0b3JhZ2UvYWNjZXNzP2ZpbGVOYW1lPSR7ZmlsZU5hbWV9JmZpbGVUeXBlPSR7ZmlsZVR5cGV9YDtcclxuICAgICAgICAgICAgLy8gZ2V0IHNpZ25lZCBVUkxcclxuICAgICAgICAgICAgcmV0dXJuICQuZ2V0SlNPTihzaWduVXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBzaWduUmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBQVVQgZmlsZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1dFJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHNpZ25SZXNwb25zZS5zaWduZWRSZXF1ZXN0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIngtYW16LWFjbFwiOiBcInB1YmxpYy1yZWFkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmlsZVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5hamF4KHB1dFJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXRSZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwbG9hZGVkIGZpbGVcIiwgc2lnblJlc3BvbnNlLnVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2lnblJlc3BvbnNlLnVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciB1cGxvYWRpbmcgdG8gUzNcIiwgZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igb24gL2FwaS9zdG9yYWdlL2FjY2Vzc1wiLCBlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEb3dubG9hZCBmaWxlIGZyb20gYnVja2V0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldEpzb24oZmlsZU5hbWU6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8T2JqZWN0PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZpbGVVcmwoZmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb3dubG9hZGluZ1wiLCByZXNwb25zZS51cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJlc3BvbnNlLnVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGdldEZpbGVVcmwoZmlsZU5hbWU6IHN0cmluZyk6IEpRdWVyeVByb21pc2U8eyB1cmw6IHN0cmluZyB9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBgL2FwaS9zdG9yYWdlL3VybD9maWxlTmFtZT0ke2ZpbGVOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ29sb3JQaWNrZXIge1xyXG5cclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9QQUxFVFRFX0dST1VQUyA9IFtcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODA3XHJcbiAgICAgICAgICAgICAgICBcIiNlZTQwMzVcIixcclxuICAgICAgICAgICAgICAgIFwiI2YzNzczNlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmRmNDk4XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM3YmMwNDNcIixcclxuICAgICAgICAgICAgICAgIFwiIzAzOTJjZlwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS84OTRcclxuICAgICAgICAgICAgICAgIFwiI2VkYzk1MVwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZWI2ODQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNjYzJhMzZcIixcclxuICAgICAgICAgICAgICAgIFwiIzRmMzcyZFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjMDBhMGIwXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzE2NFxyXG4gICAgICAgICAgICAgICAgXCIjMWI4NWI4XCIsXHJcbiAgICAgICAgICAgICAgICBcIiM1YTUyNTVcIixcclxuICAgICAgICAgICAgICAgIFwiIzU1OWU4M1wiLFxyXG4gICAgICAgICAgICAgICAgXCIjYWU1YTQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNjM2NiNzFcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvMzg5XHJcbiAgICAgICAgICAgICAgICBcIiM0YjM4MzJcIixcclxuICAgICAgICAgICAgICAgIFwiIzg1NDQ0MlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmZmNGU2XCIsXHJcbiAgICAgICAgICAgICAgICBcIiMzYzJmMmZcIixcclxuICAgICAgICAgICAgICAgIFwiI2JlOWI3YlwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vd3d3LmNvbG9yLWhleC5jb20vY29sb3ItcGFsZXR0ZS80NTVcclxuICAgICAgICAgICAgICAgIFwiI2ZmNGU1MFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZmM5MTNhXCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmOWQ2MmVcIixcclxuICAgICAgICAgICAgICAgIFwiI2VhZTM3NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZTJmNGM3XCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly93d3cuY29sb3ItaGV4LmNvbS9jb2xvci1wYWxldHRlLzcwMFxyXG4gICAgICAgICAgICAgICAgXCIjZDExMTQxXCIsXHJcbiAgICAgICAgICAgICAgICBcIiMwMGIxNTlcIixcclxuICAgICAgICAgICAgICAgIFwiIzAwYWVkYlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZjM3NzM1XCIsXHJcbiAgICAgICAgICAgICAgICBcIiNmZmM0MjVcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3d3dy5jb2xvci1oZXguY29tL2NvbG9yLXBhbGV0dGUvODI2XHJcbiAgICAgICAgICAgICAgICBcIiNlOGQxNzRcIixcclxuICAgICAgICAgICAgICAgIFwiI2UzOWU1NFwiLFxyXG4gICAgICAgICAgICAgICAgXCIjZDY0ZDRkXCIsXHJcbiAgICAgICAgICAgICAgICBcIiM0ZDczNThcIixcclxuICAgICAgICAgICAgICAgIFwiIzllZDY3MFwiLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHN0YXRpYyBNT05PX1BBTEVUVEUgPSBbXCIjMDAwXCIsIFwiIzQ0NFwiLCBcIiM2NjZcIiwgXCIjOTk5XCIsIFwiI2NjY1wiLCBcIiNlZWVcIiwgXCIjZjNmM2YzXCIsIFwiI2ZmZlwiXTtcclxuXHJcbiAgICAgICAgc3RhdGljIHNldHVwKGVsZW0sIGZlYXR1cmVkQ29sb3JzOiBzdHJpbmdbXSwgb25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgY29uc3QgZmVhdHVyZWRHcm91cHMgPSBfLmNodW5rKGZlYXR1cmVkQ29sb3JzLCA1KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvciBlYWNoIHBhbGV0dGUgZ3JvdXBcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBhbGV0dGVHcm91cHMgPSBDb2xvclBpY2tlci5ERUZBVUxUX1BBTEVUVEVfR1JPVVBTLm1hcChncm91cCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyc2VkR3JvdXAgPSBncm91cC5tYXAoYyA9PiBuZXcgcGFwZXIuQ29sb3IoYykpO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlIGxpZ2h0IHZhcmlhbnRzIG9mIGRhcmtlc3QgdGhyZWVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFkZENvbG9ycyA9IF8uc29ydEJ5KHBhcnNlZEdyb3VwLCBjID0+IGMubGlnaHRuZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGMyID0gYy5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjMi5saWdodG5lc3MgPSAwLjg1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYzI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRHcm91cCA9IHBhcnNlZEdyb3VwLmNvbmNhdChhZGRDb2xvcnMpO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkR3JvdXAgPSBfLnNvcnRCeShwYXJzZWRHcm91cCwgYyA9PiBjLmxpZ2h0bmVzcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkR3JvdXAubWFwKGMgPT4gYy50b0NTUyh0cnVlKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFsZXR0ZSA9IGZlYXR1cmVkR3JvdXBzLmNvbmNhdChkZWZhdWx0UGFsZXR0ZUdyb3Vwcyk7XHJcbiAgICAgICAgICAgIHBhbGV0dGUucHVzaChDb2xvclBpY2tlci5NT05PX1BBTEVUVEUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbCA9IDxhbnk+JChlbGVtKTtcclxuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oe1xyXG4gICAgICAgICAgICAgICAgc2hvd0lucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dFbXB0eTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHByZWZlcnJlZEZvcm1hdDogXCJoZXhcIixcclxuICAgICAgICAgICAgICAgIHNob3dCdXR0b25zOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNob3dBbHBoYTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNob3dQYWxldHRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2hvd1NlbGVjdGlvblBhbGV0dGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogcGFsZXR0ZSxcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUtleTogXCJza2V0Y2h0ZXh0XCIsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2U6IG9uQ2hhbmdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHN0YXRpYyBzZXQoZWxlbTogSFRNTEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgKDxhbnk+JChlbGVtKSkuc3BlY3RydW0oXCJzZXRcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGRlc3Ryb3koZWxlbSkge1xyXG4gICAgICAgICAgICAoPGFueT4kKGVsZW0pKS5zcGVjdHJ1bShcImRlc3Ryb3lcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFZGl0b3JCYXIgZXh0ZW5kcyBDb21wb25lbnQ8RWRpdG9yU3RhdGU+IHtcclxuXHJcbiAgICAgICAgc3RvcmU6IFN0b3JlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaERvbSQgPSBzdG9yZS5ldmVudHMubWVyZ2UoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuc2tldGNoLmxvYWRlZCxcclxuICAgICAgICAgICAgICAgIHN0b3JlLmV2ZW50cy5za2V0Y2guYXR0ckNoYW5nZWQsXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMuZWRpdG9yLnVzZXJNZXNzYWdlQ2hhbmdlZClcclxuICAgICAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLnJlbmRlcihzdG9yZS5zdGF0ZSkpO1xyXG4gICAgICAgICAgICBSZWFjdGl2ZURvbS5yZW5kZXJTdHJlYW0oc2tldGNoRG9tJCwgY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoc3RhdGU6IEVkaXRvclN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNrZXRjaCA9IHN0YXRlLnNrZXRjaDtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaChcImRpdlwiLCBbXHJcbiAgICAgICAgICAgICAgICBoKFwibGFiZWxcIiwgXCJBZGQgdGV4dDogXCIpLFxyXG4gICAgICAgICAgICAgICAgaChcImlucHV0LmFkZC10ZXh0XCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGV2LndoaWNoIHx8IGV2LmtleUNvZGUpID09PSBEb21IZWxwZXJzLktleUNvZGVzLkVudGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2suYWRkLmRpc3BhdGNoKHsgdGV4dDogdGV4dCB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlByZXNzIFtFbnRlcl0gdG8gYWRkXCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgaChcImxhYmVsXCIsIFwiQmFja2dyb3VuZDogXCIpLFxyXG4gICAgICAgICAgICAgICAgaChcImlucHV0LmJhY2tncm91bmQtY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBza2V0Y2guYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmF0dHJVcGRhdGUuZGlzcGF0Y2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiAob2xkVm5vZGUsIHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3JQaWNrZXIuc2V0KHZub2RlLmVsbSwgc2tldGNoLmJhY2tncm91bmRDb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG5cclxuICAgICAgICAgICAgICAgIEJvb3RTY3JpcHQuZHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiBcInNrZXRjaE1lbnVcIixcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkFjdGlvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIk5ld1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNyZWF0ZSBuZXcgc2tldGNoXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuc2tldGNoLmNyZWF0ZS5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkNsZWFyIGFsbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkNsZWFyIHNrZXRjaCBjb250ZW50c1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jbGVhci5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIlpvb20gdG8gZml0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRml0IGNvbnRlbnRzIGluIHZpZXdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuc3RvcmUuYWN0aW9ucy5lZGl0b3Iuem9vbVRvRml0LmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRXhwb3J0IGltYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRXhwb3J0IHNrZXRjaCBhcyBQTkdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLmV4cG9ydFBORy5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIkV4cG9ydCBTVkdcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFeHBvcnQgc2tldGNoIGFzIHZlY3RvciBncmFwaGljc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5leHBvcnRTVkcuZGlzcGF0Y2goKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCJEdXBsaWNhdGUgc2tldGNoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiQ29weSBjb250ZW50cyBpbnRvIGEgc2tldGNoIHdpdGggYSBuZXcgYWRkcmVzc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLnNrZXRjaC5jbG9uZS5kaXNwYXRjaCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIk9wZW4gc2FtcGxlIHNrZXRjaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIk9wZW4gYSBzYW1wbGUgc2tldGNoIHRvIHBsYXkgd2l0aFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci5vcGVuU2FtcGxlLmRpc3BhdGNoKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBoKFwiZGl2I3JpZ2h0U2lkZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaChcImRpdiN1c2VyLW1lc3NhZ2VcIiwge30sIFtzdGF0ZS51c2VyTWVzc2FnZSB8fCBcIlwiXSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2I3Nob3ctaGVscC5nbHlwaGljb24uZ2x5cGhpY29uLXF1ZXN0aW9uLXNpZ25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLmVkaXRvci50b2dnbGVIZWxwLmRpc3BhdGNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBdKVxyXG5cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHNlbGVjdHBpY2tlciguLi5hcmdzOiBhbnlbXSk7XHJcbiAgICAvL3JlcGxhY2VPcHRpb25zKG9wdGlvbnM6IEFycmF5PHt2YWx1ZTogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nfT4pO1xyXG59XHJcblxyXG5uYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRm9udFBpY2tlciB7XHJcblxyXG4gICAgICAgIGRlZmF1bHRGb250RmFtaWx5ID0gXCJSb2JvdG9cIjtcclxuICAgICAgICBwcmV2aWV3Rm9udFNpemUgPSBcIjI4cHhcIjtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHN0b3JlOiBTdG9yZSwgYmxvY2s6IFRleHRCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBSeC5PYnNlcnZhYmxlLmp1c3QoYmxvY2spXHJcbiAgICAgICAgICAgICAgICAubWVyZ2UoXHJcbiAgICAgICAgICAgICAgICBzdG9yZS5ldmVudHMudGV4dGJsb2NrLmF0dHJDaGFuZ2VkLm9ic2VydmUoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobSA9PiBtLmRhdGEuX2lkID09PSBibG9jay5faWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChtID0+IG0uZGF0YSlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIC5tYXAodGIgPT4gdGhpcy5yZW5kZXIodGIpKTtcclxuICAgICAgICAgICAgUmVhY3RpdmVEb20ucmVuZGVyU3RyZWFtKGRvbSQsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIoYmxvY2s6IFRleHRCbG9jayk6IFZOb2RlIHtcclxuICAgICAgICAgICAgbGV0IHVwZGF0ZSA9IHBhdGNoID0+IHtcclxuICAgICAgICAgICAgICAgIHBhdGNoLl9pZCA9IGJsb2NrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuYWN0aW9ucy50ZXh0QmxvY2sudXBkYXRlQXR0ci5kaXNwYXRjaChwYXRjaCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzOiBWTm9kZVtdID0gW107XHJcbiAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goXHJcbiAgICAgICAgICAgICAgICBoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwic2VsZWN0UGlja2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZhbWlseS1waWNrZXJcIjogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6IHZub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IGV2LnRhcmdldC52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250VmFyaWFudDogdGhpcy5zdG9yZS5yZXNvdXJjZXMuZm9udEZhbWlsaWVzLmRlZmF1bHRWYXJpYW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250RmFtaWxpZXMuZ2V0KGV2LnRhcmdldC52YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlc291cmNlcy5mb250RmFtaWxpZXMuY2F0YWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChmZjogRm9udFNoYXBlLkZvbnRGYW1pbHkpID0+IGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogZmYuZmFtaWx5ID09PSBibG9jay5mb250RmFtaWx5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKGZmLmZhbWlseSwgbnVsbCwgdGhpcy5wcmV2aWV3Rm9udFNpemUpfVwiPiR7ZmYuZmFtaWx5fTwvc3Bhbj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmYuZmFtaWx5XSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEZhbWlseSA9IHRoaXMuc3RvcmUucmVzb3VyY2VzLmZvbnRGYW1pbGllcy5nZXQoYmxvY2suZm9udEZhbWlseSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhbWlseSAmJiBzZWxlY3RlZEZhbWlseS52YXJpYW50c1xyXG4gICAgICAgICAgICAgICAgJiYgc2VsZWN0ZWRGYW1pbHkudmFyaWFudHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChoKFwic2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IFwidmFyaWFudFBpY2tlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYW50LXBpY2tlclwiOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogdm5vZGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXN0cm95OiB2bm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh2bm9kZS5lbG0pLnNlbGVjdHBpY2tlcihcImRlc3Ryb3lcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0cGF0Y2g6IChvbGRWbm9kZSwgdm5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUTogd2h5IGNhbid0IHdlIGp1c3QgZG8gc2VsZWN0cGlja2VyKHJlZnJlc2gpIGhlcmU/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEE6IHNlbGVjdHBpY2tlciBoYXMgbWVudGFsIHByb2JsZW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodm5vZGUuZWxtKS5zZWxlY3RwaWNrZXIoXCJkZXN0cm95XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHZub2RlLmVsbSkuc2VsZWN0cGlja2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyBmb250VmFyaWFudDogZXYudGFyZ2V0LnZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmFtaWx5LnZhcmlhbnRzLm1hcCh2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoXCJvcHRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZDogdiA9PT0gYmxvY2suZm9udFZhcmlhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGFpbmVyXCI6IFwiYm9keVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGEtY29udGVudFwiOiBgPHNwYW4gc3R5bGU9XCIke0ZvbnRIZWxwZXJzLmdldFN0eWxlU3RyaW5nKHNlbGVjdGVkRmFtaWx5LmZhbWlseSwgdiwgdGhpcy5wcmV2aWV3Rm9udFNpemUpfVwiPiR7dn08L3NwYW4+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdl0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHsgXCJmb250LXBpY2tlclwiOiB0cnVlIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50c1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEhlbHBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgc3RvcmU6IFN0b3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcclxuICAgICAgICAgICAgY29uc3Qgb3V0ZXIgPSAkKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG91dGVyLmFwcGVuZChcIjxoMz5HZXR0aW5nIHN0YXJ0ZWQ8L2gzPlwiKTtcclxuICAgICAgICAgICAgc3RvcmUuc3RhdGUuc2hvd0hlbHAgPyBvdXRlci5zaG93KCkgOiBvdXRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgICQuZ2V0KFwiY29udGVudC9oZWxwLmh0bWxcIiwgZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZSA9ICQoXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLWRlZmF1bHQnPiBDbG9zZSA8L2J1dHRvbj5cIik7XHJcbiAgICAgICAgICAgICAgICBjbG9zZS5vbihcImNsaWNrXCIsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFjdGlvbnMuZWRpdG9yLnRvZ2dsZUhlbHAuZGlzcGF0Y2goKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgb3V0ZXIuYXBwZW5kKCQoZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoY2xvc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoXCI8YSBjbGFzcz0ncmlnaHQnIGhyZWY9J21haWx0bzpmaWRkbGVzdGlja3NAY29kZWZsaWdodC5pbyc+RW1haWwgdXM8L2E+XCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3RvcmUuZXZlbnRzLmVkaXRvci5zaG93SGVscENoYW5nZWQuc3ViKHNob3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2hvdyA/IG91dGVyLnNob3coKSA6IG91dGVyLmhpZGUoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTZWxlY3RlZEl0ZW1FZGl0b3Ige1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50LCBzdG9yZTogU3RvcmUpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbSQgPSBzdG9yZS5ldmVudHMuc2tldGNoLmVkaXRpbmdJdGVtQ2hhbmdlZC5vYnNlcnZlKClcclxuICAgICAgICAgICAgICAgIC5tYXAoaSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc0l0ZW0gPSA8UG9zaXRpb25lZE9iamVjdFJlZj5pLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gcG9zSXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwb3NJdGVtLml0ZW1UeXBlID09PSAnVGV4dEJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBfLmZpbmQoc3RvcmUuc3RhdGUuc2tldGNoLnRleHRCbG9ja3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiID0+IGIuX2lkID09PSBwb3NJdGVtLml0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdiNlZGl0b3JPdmVybGF5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0OiBwb3NJdGVtLmNsaWVudFggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9wOiBwb3NJdGVtLmNsaWVudFkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRleHRCbG9ja0VkaXRvcihzdG9yZSkucmVuZGVyKGJsb2NrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIFJlYWN0aXZlRG9tLnJlbmRlclN0cmVhbShkb20kLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRCbG9ja0VkaXRvciBleHRlbmRzIENvbXBvbmVudDxUZXh0QmxvY2s+IHtcclxuICAgICAgICBzdG9yZTogU3RvcmU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHN0b3JlOiBTdG9yZSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZW5kZXIodGV4dEJsb2NrOiBUZXh0QmxvY2spOiBWTm9kZSB7XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGUgPSB0YiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0Yi5faWQgPSB0ZXh0QmxvY2suX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5hY3Rpb25zLnRleHRCbG9jay51cGRhdGVBdHRyLmRpc3BhdGNoKHRiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBoKFwiZGl2LnRleHQtYmxvY2stZWRpdG9yXCIsXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB0ZXh0QmxvY2suX2lkXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJ0ZXh0YXJlYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRleHRCbG9jay50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlwcmVzczogKGV2OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZXYud2hpY2ggfHwgZXYua2V5Q29kZSkgPT09IERvbUhlbHBlcnMuS2V5Q29kZXMuRW50ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoeyB0ZXh0OiAoPEhUTUxUZXh0QXJlYUVsZW1lbnQ+ZXYudGFyZ2V0KS52YWx1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiBldiA9PiB1cGRhdGUoeyB0ZXh0OiBldi50YXJnZXQudmFsdWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXZcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAge30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1jb2xvci1pY29uLmZvcmVcIiwge30sIFwiQVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJpbnB1dC50ZXh0LWNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlRleHQgY29sb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0ZXh0QmxvY2sudGV4dENvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydDogKHZub2RlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbG9yUGlja2VyLnNldHVwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bm9kZS5lbG0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNrZXRjaEhlbHBlcnMuY29sb3JzSW5Vc2UodGhpcy5zdG9yZS5zdGF0ZS5za2V0Y2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9PiB1cGRhdGUoeyB0ZXh0Q29sb3I6IGNvbG9yICYmIGNvbG9yLnRvSGV4U3RyaW5nKCkgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveTogKHZub2RlKSA9PiBDb2xvclBpY2tlci5kZXN0cm95KHZub2RlLmVsbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBoKFwiZGl2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiZGl2LmZvbnQtY29sb3ItaWNvbi5iYWNrXCIsIHt9LCBcIkFcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoKFwiaW5wdXQuYmFja2dyb3VuZC1jb2xvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCYWNrZ3JvdW5kIGNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGV4dEJsb2NrLmJhY2tncm91bmRDb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xvclBpY2tlci5zZXR1cChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5vZGUuZWxtLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTa2V0Y2hIZWxwZXJzLmNvbG9yc0luVXNlKHRoaXMuc3RvcmUuc3RhdGUuc2tldGNoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3IgPT4gdXBkYXRlKHsgYmFja2dyb3VuZENvbG9yOiBjb2xvciAmJiBjb2xvci50b0hleFN0cmluZygpIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3k6ICh2bm9kZSkgPT4gQ29sb3JQaWNrZXIuZGVzdHJveSh2bm9kZS5lbG0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaChcImJ1dHRvbi5kZWxldGUtdGV4dGJsb2NrLmJ0bi5idG4tZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZSA9PiB0aGlzLnN0b3JlLmFjdGlvbnMudGV4dEJsb2NrLnJlbW92ZS5kaXNwYXRjaCh0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGgoXCJzcGFuLmdseXBoaWNvbi5nbHlwaGljb24tdHJhc2hcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGgoXCJkaXYuZm9udC1waWNrZXItY29udGFpbmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnQ6ICh2bm9kZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZvbnRQaWNrZXIodm5vZGUuZWxtLCB0aGlzLnN0b3JlLCB0ZXh0QmxvY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaG9vazoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGluc2VydDogKHZub2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHByb3BzOiBGb250UGlja2VyUHJvcHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdGlvbjogdGV4dEJsb2NrLmZvbnREZXNjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZDogKGZvbnREZXNjKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXBkYXRlKHsgZm9udERlc2MgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihyaChGb250UGlja2VyLCBwcm9wcyksIHZub2RlLmVsbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBEdWFsQm91bmRzUGF0aFdhcnAgZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBQT0lOVFNfUEVSX1BBVEggPSAyMDA7XHJcbiAgICAgICAgc3RhdGljIFVQREFURV9ERUJPVU5DRSA9IDE1MDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc291cmNlOiBwYXBlci5Db21wb3VuZFBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfdXBwZXI6IFN0cmV0Y2hQYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2xvd2VyOiBTdHJldGNoUGF0aDtcclxuICAgICAgICBwcml2YXRlIF93YXJwZWQ6IHBhcGVyLkNvbXBvdW5kUGF0aDtcclxuICAgICAgICBwcml2YXRlIF9vdXRsaW5lOiBwYXBlci5QYXRoO1xyXG4gICAgICAgIHByaXZhdGUgX2N1c3RvbVN0eWxlOiBTa2V0Y2hJdGVtU3R5bGU7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBzb3VyY2U6IHBhcGVyLkNvbXBvdW5kUGF0aCxcclxuICAgICAgICAgICAgYm91bmRzPzogeyB1cHBlcjogcGFwZXIuU2VnbWVudFtdLCBsb3dlcjogcGFwZXIuU2VnbWVudFtdIH0sXHJcbiAgICAgICAgICAgIGN1c3RvbVN0eWxlPzogU2tldGNoSXRlbVN0eWxlKSB7XHJcblxyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYnVpbGQgY2hpbGRyZW4gLS1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJvdW5kcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIgPSBuZXcgU3RyZXRjaFBhdGgoYm91bmRzLnVwcGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvd2VyID0gbmV3IFN0cmV0Y2hQYXRoKGJvdW5kcy5sb3dlcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91cHBlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy50b3BMZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLnRvcFJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb3dlciA9IG5ldyBTdHJldGNoUGF0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHBhcGVyLlNlZ21lbnQoc291cmNlLmJvdW5kcy5ib3R0b21MZWZ0KSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgcGFwZXIuU2VnbWVudChzb3VyY2UuYm91bmRzLmJvdHRvbVJpZ2h0KVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbEJvdW5kc09wYWNpdHkgPSAwLjc1O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIudmlzaWJsZSA9IHRoaXMuc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvd2VyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb3V0bGluZSA9IG5ldyBwYXBlci5QYXRoKHsgY2xvc2VkOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVTaGFwZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChzb3VyY2UucGF0aERhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYWRkIGNoaWxkcmVuIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKFt0aGlzLl9vdXRsaW5lLCB0aGlzLl93YXJwZWQsIHRoaXMuX3VwcGVyLCB0aGlzLl9sb3dlcl0pO1xyXG5cclxuICAgICAgICAgICAgLy8gLS0gYXNzaWduIHN0eWxlIC0tXHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVN0eWxlID0gY3VzdG9tU3R5bGUgfHwge1xyXG4gICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IFwiZ3JheVwiXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyAtLSBzZXQgdXAgb2JzZXJ2ZXJzIC0tXHJcblxyXG4gICAgICAgICAgICBSeC5PYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBwZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG93ZXIucGF0aENoYW5nZWQub2JzZXJ2ZSgpKVxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlKER1YWxCb3VuZHNQYXRoV2FycC5VUERBVEVfREVCT1VOQ0UpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZVNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVXYXJwZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VkKFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuR0VPTUVUUlkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShmbGFncyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmxhZ3MgJiBQYXBlck5vdGlmeS5DaGFuZ2VGbGFnLkFUVFJJQlVURSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl91cHBlci52aXNpYmxlICE9PSB0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnZpc2libGUgPSB0aGlzLnNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb3dlci52aXNpYmxlID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHVwcGVyKCk6IHBhcGVyLlBhdGgge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdXBwZXIucGF0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBsb3dlcigpOiBwYXBlci5QYXRoIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvd2VyLnBhdGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgc291cmNlKHZhbHVlOiBwYXBlci5Db21wb3VuZFBhdGgpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zb3VyY2UgJiYgdGhpcy5fc291cmNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVdhcnBlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXQgY3VzdG9tU3R5bGUoKTogU2tldGNoSXRlbVN0eWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1c3RvbVN0eWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGN1c3RvbVN0eWxlKHZhbHVlOiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VzdG9tU3R5bGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnN0eWxlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5iYWNrZ3JvdW5kQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gdmFsdWUuYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX291dGxpbmUuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3V0bGluZS5vcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNvbnRyb2xCb3VuZHNPcGFjaXR5KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBwZXIub3BhY2l0eSA9IHRoaXMuX2xvd2VyLm9wYWNpdHkgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dGxpbmVDb250YWlucyhwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX291dGxpbmUuY29udGFpbnMocG9pbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVXYXJwZWQoKSB7XHJcbiAgICAgICAgICAgIGxldCBvcnRoT3JpZ2luID0gdGhpcy5fc291cmNlLmJvdW5kcy50b3BMZWZ0O1xyXG4gICAgICAgICAgICBsZXQgb3J0aFdpZHRoID0gdGhpcy5fc291cmNlLmJvdW5kcy53aWR0aDtcclxuICAgICAgICAgICAgbGV0IG9ydGhIZWlnaHQgPSB0aGlzLl9zb3VyY2UuYm91bmRzLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0aW9uID0gUGFwZXJIZWxwZXJzLmR1YWxCb3VuZHNQYXRoUHJvamVjdGlvbihcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwcGVyLnBhdGgsIHRoaXMuX2xvd2VyLnBhdGgpO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gbmV3IEZvbnRTaGFwZS5QYXRoVHJhbnNmb3JtKHBvaW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBwb2ludC5zdWJ0cmFjdChvcnRoT3JpZ2luKTtcclxuICAgICAgICAgICAgICAgIGxldCB1bml0ID0gbmV3IHBhcGVyLlBvaW50KFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLnggLyBvcnRoV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUueSAvIG9ydGhIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RlZCA9IHByb2plY3Rpb24odW5pdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdGVkO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGhzID0gdGhpcy5fc291cmNlLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSA8cGFwZXIuUGF0aD5pdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhQb2ludHMgPSBQYXBlckhlbHBlcnMudHJhY2VQYXRoQXNQb2ludHMocGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgRHVhbEJvdW5kc1BhdGhXYXJwLlBPSU5UU19QRVJfUEFUSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChwID0+IHRyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludChwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFBhdGggPSBuZXcgcGFwZXIuUGF0aCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiB4UG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2Nrd2lzZTogcGF0aC5jbG9ja3dpc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3hQYXRoLnNpbXBsaWZ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhQYXRoO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5fd2FycGVkLnJlbW92ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dhcnBlZC5hZGRDaGlsZHJlbihuZXdQYXRocyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZU91dGxpbmVTaGFwZSgpIHtcclxuICAgICAgICAgICAgY29uc3QgbG93ZXIgPSBuZXcgcGFwZXIuUGF0aCh0aGlzLl9sb3dlci5wYXRoLnNlZ21lbnRzKTtcclxuICAgICAgICAgICAgbG93ZXIucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRsaW5lLnNlZ21lbnRzID0gdGhpcy5fdXBwZXIucGF0aC5zZWdtZW50cy5jb25jYXQobG93ZXIuc2VnbWVudHMpO1xyXG4gICAgICAgICAgICBsb3dlci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIm5hbWVzcGFjZSBTa2V0Y2hFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQYXRoSGFuZGxlIGV4dGVuZHMgcGFwZXIuR3JvdXAge1xyXG5cclxuICAgICAgICBzdGF0aWMgU0VHTUVOVF9NQVJLRVJfUkFESVVTID0gMTA7XHJcbiAgICAgICAgc3RhdGljIENVUlZFX01BUktFUl9SQURJVVMgPSA2O1xyXG4gICAgICAgIHN0YXRpYyBEUkFHX1RIUkVTSE9MRCA9IDM7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX21hcmtlcjogcGFwZXIuU2hhcGU7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2VnbWVudDogcGFwZXIuU2VnbWVudDtcclxuICAgICAgICBwcml2YXRlIF9jdXJ2ZTogcGFwZXIuQ3VydmU7XHJcbiAgICAgICAgcHJpdmF0ZSBfc21vb3RoZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBfY3VydmVTcGxpdCA9IG5ldyBPYnNlcnZhYmxlRXZlbnQ8bnVtYmVyPigpO1xyXG4gICAgICAgIHByaXZhdGUgX2N1cnZlQ2hhbmdlVW5zdWI6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHJpdmF0ZSBkcmFnZ2luZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoYXR0YWNoOiBwYXBlci5TZWdtZW50IHwgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbjogcGFwZXIuUG9pbnQ7XHJcbiAgICAgICAgICAgIGxldCBwYXRoOiBwYXBlci5QYXRoO1xyXG4gICAgICAgICAgICBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudCA9IDxwYXBlci5TZWdtZW50PmF0dGFjaDtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fc2VnbWVudC5wb2ludDtcclxuICAgICAgICAgICAgICAgIHBhdGggPSB0aGlzLl9zZWdtZW50LnBhdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0YWNoIGluc3RhbmNlb2YgcGFwZXIuQ3VydmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlID0gPHBhcGVyLkN1cnZlPmF0dGFjaDtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5fY3VydmUuZ2V0UG9pbnRBdCh0aGlzLl9jdXJ2ZS5sZW5ndGggKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHRoaXMuX2N1cnZlLnBhdGg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcImF0dGFjaCBtdXN0IGJlIFNlZ21lbnQgb3IgQ3VydmVcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyID0gcGFwZXIuU2hhcGUuQ2lyY2xlKHBvc2l0aW9uLCBQYXRoSGFuZGxlLlNFR01FTlRfTUFSS0VSX1JBRElVUyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5zdHJva2VDb2xvciA9IFwiYmx1ZVwiO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuZmlsbENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIuc2VsZWN0ZWRDb2xvciA9IG5ldyBwYXBlci5Db2xvcigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9tYXJrZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc0N1cnZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBhcGVyRXh0LmV4dGVuZE1vdXNlRXZlbnRzKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbihwYXBlckV4dC5FdmVudFR5cGUubW91c2VEcmFnU3RhcnQsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGl0IHRoZSBjdXJ2ZSwgcHVwYXRlIHRvIHNlZ21lbnQgaGFuZGxlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnZlQ2hhbmdlVW5zdWIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50ID0gbmV3IHBhcGVyLlNlZ21lbnQodGhpcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlSWR4ID0gdGhpcy5fY3VydmUuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUucGF0aC5pbnNlcnQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnZlSWR4ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VydmUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGVBc1NlZ21lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnZlU3BsaXQubm90aWZ5KGN1cnZlSWR4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyLkV2ZW50VHlwZS5tb3VzZURyYWcsIGV2ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZWdtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudC5wb2ludCA9IHRoaXMuY2VudGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zbW9vdGhlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LnNtb290aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlKGV2LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgIGV2LnN0b3AoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uKHBhcGVyLkV2ZW50VHlwZS5jbGljaywgZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NlZ21lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNtb290aGVkID0gIXRoaXMuc21vb3RoZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBldi5zdG9wKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY3VydmVDaGFuZ2VVbnN1YiA9IHBhdGguc3Vic2NyaWJlKGZsYWdzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJ2ZSAmJiAhdGhpcy5fc2VnbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICYmIChmbGFncyAmIFBhcGVyTm90aWZ5LkNoYW5nZUZsYWcuU0VHTUVOVFMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLl9jdXJ2ZS5nZXRQb2ludEF0KHRoaXMuX2N1cnZlLmxlbmd0aCAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBzbW9vdGhlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ntb290aGVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IHNtb290aGVkKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Ntb290aGVkID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuc21vb3RoKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWdtZW50LmhhbmRsZUluID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlZ21lbnQuaGFuZGxlT3V0ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGN1cnZlU3BsaXQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZVNwbGl0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IGNlbnRlcigpOiBwYXBlci5Qb2ludCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGNlbnRlcihwb2ludDogcGFwZXIuUG9pbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvaW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdHlsZUFzU2VnbWVudCgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5kYXNoQXJyYXkgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXJrZXIucmFkaXVzID0gUGF0aEhhbmRsZS5TRUdNRU5UX01BUktFUl9SQURJVVM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0eWxlQXNDdXJ2ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFya2VyLm9wYWNpdHkgPSAwLjg7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5kYXNoQXJyYXkgPSBbMiwgMl07XHJcbiAgICAgICAgICAgIHRoaXMuX21hcmtlci5yYWRpdXMgPSBQYXRoSGFuZGxlLkNVUlZFX01BUktFUl9SQURJVVM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3RyZXRjaFBhdGggZXh0ZW5kcyBwYXBlci5Hcm91cCB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3BhdGg6IHBhcGVyLlBhdGg7XHJcbiAgICAgICAgcHJpdmF0ZSBfcGF0aENoYW5nZWQgPSBuZXcgT2JzZXJ2YWJsZUV2ZW50PHBhcGVyLlBhdGg+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHNlZ21lbnRzOiBwYXBlci5TZWdtZW50W10sIHN0eWxlPzogcGFwZXIuU3R5bGUpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3BhdGggPSBuZXcgcGFwZXIuUGF0aChzZWdtZW50cyk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fcGF0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3R5bGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3R5bGUgPSBzdHlsZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhdGguc3Ryb2tlQ29sb3IgPSBcImxpZ2h0Z3JheVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGF0aC5zdHJva2VXaWR0aCA9IDY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcyBvZiB0aGlzLl9wYXRoLnNlZ21lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFNlZ21lbnRIYW5kbGUocyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiB0aGlzLl9wYXRoLmN1cnZlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZShjKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhdGgoKTogcGFwZXIuUGF0aCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0IHBhdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGF0aENoYW5nZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZFNlZ21lbnRIYW5kbGUoc2VnbWVudDogcGFwZXIuU2VnbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEhhbmRsZShuZXcgUGF0aEhhbmRsZShzZWdtZW50KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEN1cnZlSGFuZGxlKGN1cnZlOiBwYXBlci5DdXJ2ZSkge1xyXG4gICAgICAgICAgICBsZXQgaGFuZGxlID0gbmV3IFBhdGhIYW5kbGUoY3VydmUpO1xyXG4gICAgICAgICAgICBoYW5kbGUuY3VydmVTcGxpdC5zdWJzY3JpYmVPbmUoY3VydmVJZHggPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDdXJ2ZUhhbmRsZSh0aGlzLl9wYXRoLmN1cnZlc1tjdXJ2ZUlkeCArIDFdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFkZEhhbmRsZShoYW5kbGU6IFBhdGhIYW5kbGUpIHtcclxuICAgICAgICAgICAgaGFuZGxlLnZpc2libGUgPSB0aGlzLnZpc2libGU7XHJcbiAgICAgICAgICAgIGhhbmRsZS5vbihwYXBlci5FdmVudFR5cGUubW91c2VEcmFnLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBoYW5kbGUub24ocGFwZXIuRXZlbnRUeXBlLmNsaWNrLCBldiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXRoQ2hhbmdlZC5ub3RpZnkodGhpcy5fcGF0aCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoaGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNZWFzdXJlcyBvZmZzZXRzIG9mIHRleHQgZ2x5cGhzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFJ1bGVyIHtcclxuXHJcbiAgICAgICAgZm9udEZhbWlseTogc3RyaW5nO1xyXG4gICAgICAgIGZvbnRXZWlnaHQ6IG51bWJlcjtcclxuICAgICAgICBmb250U2l6ZTogbnVtYmVyO1xyXG5cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVBvaW50VGV4dCh0ZXh0KTogcGFwZXIuSXRlbSB7XHJcbiAgICAgICAgICAgIHZhciBwb2ludFRleHQgPSBuZXcgcGFwZXIuUG9pbnRUZXh0KCk7XHJcbiAgICAgICAgICAgIHBvaW50VGV4dC5jb250ZW50ID0gdGV4dDtcclxuICAgICAgICAgICAgcG9pbnRUZXh0Lmp1c3RpZmljYXRpb24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250RmFtaWx5KSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250V2VpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludFRleHQuZm9udFdlaWdodCA9IHRoaXMuZm9udFdlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5mb250U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRUZXh0LmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBvaW50VGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFRleHRPZmZzZXRzKHRleHQpIHtcclxuICAgICAgICAgICAgLy8gTWVhc3VyZSBnbHlwaHMgaW4gcGFpcnMgdG8gY2FwdHVyZSB3aGl0ZSBzcGFjZS5cclxuICAgICAgICAgICAgLy8gUGFpcnMgYXJlIGNoYXJhY3RlcnMgaSBhbmQgaSsxLlxyXG4gICAgICAgICAgICB2YXIgZ2x5cGhQYWlycyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpcnNbaV0gPSB0aGlzLmNyZWF0ZVBvaW50VGV4dCh0ZXh0LnN1YnN0cmluZyhpLCBpICsgMSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBGb3IgZWFjaCBjaGFyYWN0ZXIsIGZpbmQgY2VudGVyIG9mZnNldC5cclxuICAgICAgICAgICAgdmFyIHhPZmZzZXRzID0gWzBdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNZWFzdXJlIHRocmVlIGNoYXJhY3RlcnMgYXQgYSB0aW1lIHRvIGdldCB0aGUgYXBwcm9wcmlhdGUgXHJcbiAgICAgICAgICAgICAgICAvLyAgIHNwYWNlIGJlZm9yZSBhbmQgYWZ0ZXIgdGhlIGdseXBoLlxyXG4gICAgICAgICAgICAgICAgdmFyIHRyaWFkVGV4dCA9IHRoaXMuY3JlYXRlUG9pbnRUZXh0KHRleHQuc3Vic3RyaW5nKGkgLSAxLCBpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdHJpYWRUZXh0LnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IG91dCBoYWxmIG9mIHByaW9yIGdseXBoIHBhaXIgXHJcbiAgICAgICAgICAgICAgICAvLyAgIGFuZCBoYWxmIG9mIGN1cnJlbnQgZ2x5cGggcGFpci5cclxuICAgICAgICAgICAgICAgIC8vIE11c3QgYmUgcmlnaHQsIGJlY2F1c2UgaXQgd29ya3MuXHJcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0V2lkdGggPSB0cmlhZFRleHQuYm91bmRzLndpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2kgLSAxXS5ib3VuZHMud2lkdGggLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgLSBnbHlwaFBhaXJzW2ldLmJvdW5kcy53aWR0aCAvIDI7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQWRkIG9mZnNldCB3aWR0aCB0byBwcmlvciBvZmZzZXQuIFxyXG4gICAgICAgICAgICAgICAgeE9mZnNldHNbaV0gPSB4T2Zmc2V0c1tpIC0gMV0gKyBvZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgZ2x5cGhQYWlyIG9mIGdseXBoUGFpcnMpIHtcclxuICAgICAgICAgICAgICAgIGdseXBoUGFpci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHhPZmZzZXRzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgU2tldGNoRWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFdhcnAgZXh0ZW5kcyBEdWFsQm91bmRzUGF0aFdhcnAge1xyXG5cclxuICAgICAgICBzdGF0aWMgREVGQVVMVF9GT05UX1NJWkUgPSAxMjg7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2ZvbnQ6IG9wZW50eXBlLkZvbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgX2ZvbnRTaXplOiBudW1iZXI7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBmb250OiBvcGVudHlwZS5Gb250LFxyXG4gICAgICAgICAgICB0ZXh0OiBzdHJpbmcsXHJcbiAgICAgICAgICAgIGJvdW5kcz86IHsgdXBwZXI6IHBhcGVyLlNlZ21lbnRbXSwgbG93ZXI6IHBhcGVyLlNlZ21lbnRbXSB9LFxyXG4gICAgICAgICAgICBmb250U2l6ZT86IG51bWJlcixcclxuICAgICAgICAgICAgc3R5bGU/OiBTa2V0Y2hJdGVtU3R5bGUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghZm9udFNpemUpIHtcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplID0gVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gVGV4dFdhcnAuZ2V0UGF0aERhdGEoZm9udCwgdGV4dCwgZm9udFNpemUpO1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gbmV3IHBhcGVyLkNvbXBvdW5kUGF0aChwYXRoRGF0YSk7XHJcblxyXG4gICAgICAgICAgICBzdXBlcihwYXRoLCBib3VuZHMsIHN0eWxlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZvbnQgPSBmb250O1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dFBhdGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXQgZm9udFNpemUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZm9udFNpemUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUZXh0UGF0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0IGZvbnQodmFsdWU6IG9wZW50eXBlLkZvbnQpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mb250KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mb250ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRQYXRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVwZGF0ZVRleHRQYXRoKCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRoRGF0YSA9IFRleHRXYXJwLmdldFBhdGhEYXRhKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udCwgdGhpcy5fdGV4dCwgdGhpcy5fZm9udFNpemUpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBwYXBlci5Db21wb3VuZFBhdGgocGF0aERhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGF0aERhdGEoZm9udDogb3BlbnR5cGUuRm9udCxcclxuICAgICAgICAgICAgdGV4dDogc3RyaW5nLCBmb250U2l6ZT86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBvcGVuVHlwZVBhdGggPSBmb250LmdldFBhdGgodGV4dCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIE51bWJlcihmb250U2l6ZSkgfHwgVGV4dFdhcnAuREVGQVVMVF9GT05UX1NJWkUpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3BlblR5cGVQYXRoLnRvUGF0aERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibmFtZXNwYWNlIFNrZXRjaEVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBTa2V0Y2hJdGVtU3R5bGUgZXh0ZW5kcyBwYXBlci5JU3R5bGUge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcclxuICAgIH1cclxuXHJcbn0iXX0=