function $ () {
    return document.querySelectorAll.apply(document, Array.prototype.slice.call(arguments));
}

function addEventListeners (el, types, listener, useCapture) {
    el = (el[0]) ? el[0] : el;
    if (el && el.addEventListener) {
        types.split(' ').forEach(function (type) {
            el.addEventListener(type, listener, useCapture);
        });
    }
}

function forEachEl (query, fn) {
    if (query[0]) {
        Array.prototype.forEach.call(query, fn);
    } else {
        fn (query, 0);
    }
}