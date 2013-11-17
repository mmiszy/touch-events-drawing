(function (global) {
    'use strict';

    var canvas,
        ctx,
        touchHandlers,
        drawer,
        isDrawing = false;

    drawer = {
        startDrawing: function (x, y) {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(x, y);
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
        }
    };

    touchHandlers = {
        onTouchStart: function (ev) {
            if (ev.targetTouches.length) {
                ev.preventDefault();
                drawer.startDrawing(ev.targetTouches[0].pageX, ev.targetTouches[0].pageY);
            }
        },
        onTouchEnd: function (ev) {
            drawer.endDrawing(ev.targetTouches[0].pageX, ev.targetTouches[0].pageY);
        },
        onTouchMove: function (ev) {
            if (ev.targetTouches.length) {
                ev.preventDefault();
                drawer.draw(ev.targetTouches[0].pageX, ev.targetTouches[0].pageY);
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