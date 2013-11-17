(function (global) {
    'use strict';

    var canvas,
        ctx,
        touchHandlers,
        drawer,
        touches = {},
        isDrawing = false;

    drawer = {
        startDrawing: function (x, y) {
            isDrawing = true;
            ctx.beginPath();
            drawer.continueDrawingAt(x, y);
        },

        endDrawing: function () {
            isDrawing = false;
        },

        draw: function (x, y) {
            if (!isDrawing) {
                return;
            }

            ctx.lineTo(x, y);
            ctx.stroke();
        },

        continueDrawingAt: function (x, y) {
            if (!isDrawing) {
                return;
            }

            ctx.moveTo(x, y);
        }
    };

    touchHandlers = {
        onTouchStart: function (ev) {
            if (ev.targetTouches.length) {
                ev.preventDefault();
                touches = {};
                forEachEl(ev.targetTouches, function (el) {
                    touches[el.identifier] = {
                        pageX: el.pageX,
                        pageY: el.pageY
                    };
                });
                drawer.startDrawing();
            }
        },
        onTouchEnd: function (ev) {
            forEachEl(ev.changedTouches, function (el) {
                delete touches[el.identifier];
            });

            if (ev.targetTouches.length === 0) {
                drawer.endDrawing();
            }
        },
        onTouchMove: function (ev) {
            if (ev.targetTouches.length) {
                ev.preventDefault();
                forEachEl(ev.targetTouches, function (el) {
                    var currPos = touches[el.identifier];
                    drawer.continueDrawingAt(currPos.pageX, currPos.pageY);
                    drawer.draw(el.pageX, el.pageY);

                    touches[el.identifier] = {
                        pageX: el.pageX,
                        pageY: el.pageY
                    };
                });
            }
        }
    };

    function setSize () {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 4;
        }
    }

    function initEvents () {
        document.body.addEventListener('touchmove', function (ev) { ev.preventDefault(); }, false);

        window.addEventListeners(canvas, 'touchstart', touchHandlers.onTouchStart);
        window.addEventListeners(canvas, 'touchend', touchHandlers.onTouchEnd);
        window.addEventListeners(canvas, 'touchmove', touchHandlers.onTouchMove);
    }

    global.touchEventsDrawing = {
        onLoad: function onLoad () {
            canvas = $('canvas')[0];
            setSize();
            ctx = canvas.getContext('2d');
            initEvents();
        }
    };
}(window));