const MS_DELAY_APPLYING_TRANSITION = 40;



export function applyElementTransition(target, fn, eventName = 'transitionend') {
    // Very short delay before and after event to ensure DOM keeps up.
    const DELAY = 40;

    return new Promise((resolve) => {
        const onComplete = (e) => {
            setTimeout(()=>{
                target.removeEventListener(eventName, onComplete);
                resolve();
            }, DELAY);
        }

        target.addEventListener(eventName, onComplete);

        setTimeout(()=>{
            fn(target)
        }, DELAY);
    });
}


export function addAndRemoveHandler(target, eventName, fn, delay = 250) {
        const eventHandler = (event) => {
            if (fn && typeof fn === 'function') {
                setTimeout(() => {
                    fn(event);
                }, delay)
            }
            target.removeEventListener(eventName, eventHandler);
        }

        target.addEventListener(eventName, eventHandler);
    }

    export function applyTransition(target, fn, delay=40) {
        window.setTimeout(() => {
            fn(target);
        }, delay);
    }

    export function findEl(selector) {
        if (selector.startsWith('#')) {
            return document.getElementById(selector.substring(1));
        }
        else {
            return document.querySelector(selector);
        }
    }

    export function documentReady(fn) {
        if (document.attachEvent ? document.readyState === "complete" :
                                   document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    export function elementLocation(el) {
        if (typeof el == 'string') {
            el = findEl(el);
        }

        if (!el) {
            throw new Error('Element not found.');
        }

        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset ||
                     document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset ||
                    document.documentElement.scrollTop;
        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        }
    }

    export function getElementById(id) {
        let element = document.getElementById(id);

        if (!element) {
            console.error('Element not found in DOM');
            console.error('Element Id not found ===> ' + id);
        }
        else {
            throw new Error('Element not found in DOM: ' + id);
        }
    }

    export function clearElementChildren(parent) {
        let el;
        if (typeof parent == 'string') {
            el = document.getElementById(parent);
        }
        else {
            el = parent;
        }

        if (!el) {
            throw new Error('Element not found.');
        }

        let range = document.createRange();
        range.selectNodeContents(el);
    }

    export function setObjectDefaultValue(obj, key, value) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = value;
        }
    }

    export function removeElement(el) {
        if (typeof el === 'string') {
            el = document.getElementById(el);
        }

        if (!el) {
            return;
        }

        try {
            el.parentElement.removeChild(el);
        }
        catch(error) {
        }
    }

    export function rightJustifyElement() {
        let right = window.innerWidth;
        console.log(right);
        const ele = document.querySelector('div.test-right');
        const location = rp.dom.elementLocation(ele);
        document.documentElement.style.setProperty('--right', (right - location.width) + 'px');
    }


