"use strict;"

import * as dom from './rp.dom.js';
import {crierStatus} from './town-crier-status.js';

export function TownCrier(options) {
    this.options = this.assignOptionDefaults(options)
    this.showCrier(this.options);
};

TownCrier.prototype.assignOptionDefaults = function(options) {
    const DEFAULT_STATUS_INDEX = 0;

    options.classList = options.classList || '';
    options.duration = options.duration || 5000;
    options.closeType = options.closeType || 'auto';

    options.status = crierStatus.find(x => x.status === status);
    options.status = options.status || crierStatus[DEFAULT_STATUS_INDEX];

    return options;
};

TownCrier.prototype.getManualCloseMarkup = function(options) {
    const isManualClose = (options.closeType === 'user');
    const closeIcon = (isManualClose) ? 'fas fa-window-close' : 'far fa-window-close';
    const titleText = (isManualClose) ? 'You must click to close this' : 'You can click to close this';

    return `<div class="close-icon">
                <a class="crier-close" title="${titleText}">
                    <i class="${closeIcon}"></i>
                </a>
            </div>`;
}

TownCrier.prototype.getCrierHTML = function(options) {
    const allowManualClose = (options.closeType !== 'auto');
    const manualCloseMarkup = (allowManualClose) ? this.getManualCloseMarkup(options) : '';
    const cursorStyle = (allowManualClose) ? 'cursor: pointer;pointer-events: auto;': '';

    return (
        `<div class="crier ${options.classList}"
            style="background-color:${options.status.color};${cursorStyle}"
            data-duration="${options.duration}" data-close-type="${options.closeType}">
            <div class="icon-container dark">
                <i class="${options.status.icon}"></i>
            </div>
            <div class="text">
                <div class="headline">
                    ${options.heading}
                </div>
                <div class="detail">
                    ${options.msg}
                </div>
            </div>
            ${manualCloseMarkup}
        </div>`);
}

TownCrier.prototype.getPlaceholderHTML = function(id, height=0) {
    const  placeholderDiv =
`<div id="${id}" style="width: 175px; height: ${height}; opacity: 0;
        margin-bottom: 0;background-color: red;">
</div>`
    return placeholderDiv;
}

TownCrier.prototype.showMessage = function(e) {
    console.log(e);
}

TownCrier.prototype.insertCrierIntoDomAsHiddeElement = function(options) {
    const crierHTML = this.getCrierHTML(options);
    document.body.insertAdjacentHTML('afterbegin', crierHTML);
    const crierElement = document.body.firstElementChild;
    const crierClientRectangle = crierElement.getBoundingClientRect();

    return {
        id: `ph${Math.floor(Math.random() * Math.floor(5000))}`,
        element: crierElement,
        height: Math.round(crierClientRectangle.height)
    }
}

TownCrier.prototype.removeCrier = function(newCrierElement, duration = 0) {
    const remove = function() {
        dom.addAndRemoveHandler(newCrierElement, 'transitionend', (event) => {
            dom.removeElement(newCrierElement);
        });

        newCrierElement.style.transition = 'opacity 400ms ease, height 200ms ease';
        newCrierElement.style.opacity = 0;
        newCrierElement.style.height = 0;
    }

    if (duration > 0 ) {
        window.setTimeout(()=> {
            remove();
        }, duration);
    }
    else {
        remove();
    }
}

TownCrier.prototype.replaceCrierPlaceholderWithCrier = function(crierInfo) {
    const crierMainContainer = document.querySelector('.criers-inner-container');

    const crierPlaceholder = document.getElementById(crierInfo.id);
    const newCrierElement = crierInfo.element;
    newCrierElement.style.position = 'static';
    newCrierElement.style.height = crierInfo.height;

    crierMainContainer.replaceChild(newCrierElement, crierPlaceholder);

    dom.applyTransition(newCrierElement, (element) => {
        element.style.opacity = 1;
        element.style.transition = 'opacity 750ms ease, margin-bottom 750ms ease';
    })

    dom.addAndRemoveHandler(newCrierElement, 'click', (event) => {
        if (newCrierElement.getAttribute('closeType') !== 'auto') {
            this.removeCrier(newCrierElement);
        }
    });

    const duration = newCrierElement.getAttribute('data-duration');
    if (newCrierElement.getAttribute('data-close-type') !== 'user') {
        window.setTimeout(()=> {
            this.removeCrier(newCrierElement, duration);
        }, duration);
    }
}

TownCrier.prototype.showCrier = function(options) {
    const crierInfo = this.insertCrierIntoDomAsHiddeElement(options);
    console.log(crierInfo);

    const crierMainContainer = document.querySelector('.criers-inner-container');
    const placeholderHTML = this.getPlaceholderHTML(crierInfo.id);

    crierMainContainer.insertAdjacentHTML('afterbegin', placeholderHTML);

    const crierTemp = crierMainContainer.firstElementChild;

    dom.addAndRemoveHandler(crierTemp, 'transitionend', (event) => {
        this.replaceCrierPlaceholderWithCrier(crierInfo);
    });

    dom.applyTransition(crierTemp, (element) => {
        element.style.height = `${crierInfo.height}px`;
        element.style.transition = 'height 500ms ease, margin-bottom 500ms ease';
    })
}
