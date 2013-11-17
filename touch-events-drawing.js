(function (global) {
    'use strict';

    var canvas,
        ctx,
        touchHandlers,
        drawer,
        touches = {},
        randomColor = false,
        isDrawing = false,
        offset = {
            x: 0,
            y: 0
        };

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
        },

        setColor: function (color) {
            if (color === 'random') {
                randomColor = setInterval(function () {
                    ctx.beginPath();
                    ctx.strokeStyle = getRandomColor();
                }, 100);
            } else {
                clearInterval(randomColor);
                randomColor = false;
                ctx.strokeStyle = color;
            }
        }
    };

    touchHandlers = {
        onTouchStart: function (ev) {
            if (ev.targetTouches.length) {
                ev.preventDefault();
                touches = {};
                forEachEl(ev.targetTouches, function (el) {
                    touches[el.identifier] = {
                        pageX: el.pageX + offset.x,
                        pageY: el.pageY - offset.y
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
                    drawer.draw(el.pageX + offset.x, el.pageY - offset.y);

                    touches[el.identifier] = {
                        pageX: el.pageX + offset.x,
                        pageY: el.pageY - offset.y
                    };
                });
            }
        },

        setCanvasOffset: function (x, y) {
            offset.x = x || 0;
            offset.y = y || 0;
        }
    };

    function setSize () {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 4 - 45;
            canvas.style.marginTop = '45px';
            touchHandlers.setCanvasOffset(0, 45);
        }
    }

    function initEvents () {
        document.body.addEventListener('touchmove', function (ev) { ev.preventDefault(); }, false);

        addEventListeners(canvas, 'touchstart', touchHandlers.onTouchStart);
        addEventListeners(canvas, 'touchend', touchHandlers.onTouchEnd);
        addEventListeners(canvas, 'touchmove', touchHandlers.onTouchMove);
    }

    function createControls () {
        var buttons = document.createElement('div');
        buttons.class = 'buttons';
        buttons.style.height = '40px';
        buttons.style.position = 'absolute';
        buttons.style.right = '0';
        document.body.insertBefore(buttons, canvas);

        ['black', 'red', 'green', 'blue', 'random'].forEach(function (color) {
            var b = document.createElement('button');
            b.class = color;
            b.style.backgroundColor = color;
            b.style.width = b.style.height = '40px';
            b.style.margin = '0 10px';

            buttons.appendChild(b);

            b.addEventListener('click', function () {
                drawer.setColor(color);
            });
        });
    }

    global.touchEventsDrawing = {
        onLoad: function onLoad () {
            canvas = $('canvas')[0];
            setSize();
            ctx = canvas.getContext('2d');
            initEvents();
            createControls();
        }
    };
}(window));