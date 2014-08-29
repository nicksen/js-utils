/**
 * Adds `preventDefault`, `stopPropagation`, `addEventListener`
 * and `removeEventListener` in IE 8
 * TODO: Find a way to add for older browsers as well
 */
(function() {
"use strict";

var Event = window.Event,
    HTMLDocument = window.HTMLDocument,
    Window = window.Window;

if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault = function () {
        this.returnValue = false;
    };
}

if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation = function () {
        this.cancelBubble = true;
    };
}

if (!Element.prototype.addEventListener) {
    var eventListeners = [],
        add, remove;

    add = function(type, listener /*, useCapture (will be ignored) */) {
        var self = this;
        var wrapper = function (e) {
            e.target = e.srcElement;
            e.currentTarget = self;
            if (listener.handleEvent) {
                listener.handleEvent(e);
            } else {
                listener.call(self, e);
            }
        };

        if ("DOMContentLoaded" === type) {
            var wrapper2 = function (e) {
                if ("complete" === document.readyState) {
                    wrapper(e);
                }
            };

            document.attachEvent("onreadystatechange", wrapper2);
            eventListeners.push({
                object: this,
                type: type,
                listener: listener,
                wrapper: wrapper2
            });

            if ("complete" === document.readyState) {
                var e = new Event();
                e.srcElement = window;
                wrapper2(e);
            }
        } else {
            this.attachEvent("on" + type, wrapper);
            eventListeners.push({
                object: this,
                type: type,
                listener: listener,
                wrapper: wrapper
            });
        }
    };

    remove = function (type,listener /*, useCapture (will be ignored) */) {
        eventListeners.some(function (eventListener) {
            if (this === eventListener.object && eventListener.type === type && eventListener.listener === listener) {
                if ("DOMContentLoaded" === type) {
                    this.detachEvent("onreadystatechange", eventListener.wrapper);
                } else {
                    this.detachEvent("on" + type, eventListener.wrapper);
                }
                return true;
            }

            return false;
        });
    };

    Element.prototype.addEventListener = add;
    Element.prototype.removeEventListener = remove;

    if (HTMLDocument) {
        HTMLDocument.prototype.addEventListener = add;
        HTMLDocument.prototype.removeEventListener = remove;
    }

    if (Window) {
        Window.prototype.addEventListener = add;
        Window.prototype.removeEventListener = remove;
    }
}
})();
