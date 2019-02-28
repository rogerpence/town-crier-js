"use strict;"

import * as dom from './rp.dom.js';
import {crierStatus} from './town-crier-status.js';

export function TownCrier(options) {
    this.ensureCrierContainer();
    this.options = this.assignOptionDefaults(options)
    this.showCrier(this.options);
};

TownCrier.prototype.assignOptionDefaults = function(options) {
    const DEFAULT_STATUS_INDEX = 0;

    options.classList = options.classList || '';
    options.duration = options.duration || 8000;
    options.closeType = options.closeType || 'auto';
    options.idNumber = Math.floor(Math.random() * Math.floor(5000));

    options.align = options.align || 'right';
    options.justifySelf = (options.align === 'right') ? 'end' : 'start';

    options.progressBar = (options.progressBar === undefined) ? false : options.progressBar;
    options.shadow = (options.shadow === undefined) ? false : options.shadow;

    options.status = crierStatus.find(arr => arr.status === options.status) || crierStatus[DEFAULT_STATUS_INDEX];

    console.log(options);
    return options;
};

TownCrier.prototype.ensureCrierContainer = function() {
    if (!document.querySelector('.criers-outer-container')) {
        const html =
`<div class="criers-outer-container">
</div>`;
        document.body.insertAdjacentHTML('afterbegin', html);
    }
}

TownCrier.prototype.getManualCloseMarkup = function(options) {
    const isUserClose = (options.closeType === 'user');
    const closeIcon = (isUserClose) ? 'fas fa-window-close' : 'far fa-window-close';
    const titleText = (isUserClose) ? 'You must click to close this' : 'You can click to close this';

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
                    <div class="progress-bar">
                        <div id="pb${options.idNumber}" class="progress">
                        </div>
                    </div>
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

TownCrier.prototype.insertCrierIntoDomAsHiddenElement = function(options) {
    const crierHTML = this.getCrierHTML(options);
    document.body.insertAdjacentHTML('afterbegin', crierHTML);
    const crierElement = document.body.firstElementChild;
    const crierClientRectangle = crierElement.getBoundingClientRect();

    return {
        id: `ph${options.idNumber}`,
        element: crierElement,
        height: Math.round(crierClientRectangle.height)
    }
}

TownCrier.prototype.removeCrier = function(newCrierElement, duration = 0) {
    dom.addAndRemoveHandler(newCrierElement, 'transitionend', (event) => {
        dom.removeElement(newCrierElement);
    });

    newCrierElement.style.minHeight = 0;
    newCrierElement.style.transition = 'opacity 750ms ease, height 750ms ease, margin-bottom 765ms ease';
    newCrierElement.style.opacity = 0;
    newCrierElement.style.height = 0;
    newCrierElement.style.marginBottom = 0;
}

TownCrier.prototype.replaceCrierPlaceholderWithCrier = function(crierInfo, options) {
    const crierMainContainer = document.querySelector('.criers-outer-container');

    const crierPlaceholder = document.getElementById(crierInfo.id);
    const newCrierElement = crierInfo.element;
    newCrierElement.style.position = 'static';
    newCrierElement.style.height = `${crierInfo.height}px`;
    newCrierElement.setAttribute('data-height', `${crierInfo.height}px`);
    newCrierElement.style.justifySelf = options.justifySelf;
    if (options.shadow) {
        newCrierElement.classList.add('crier-shadow');
    }

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
        if (!options.progressBar) {
            queueCrierRemovalWithoutProgressBar(crierElement, duration);
        }
        else {
            queueCrierRemovalWithProgressBar(crierElement, duration, options);
        }
    }
}

TownCrier.prototype.queueCrierRemovalWithoutProgressBar = function(crierElement, duration) {
    window.setTimeout(()=> {
        this.removeCrier(crierElement);
    }, duration);
}

TownCrier.prototype.queueCrierRemovalWithProgressBar = function(crierElement, duration, options) {
    const progressBar = document.getElementById(`pb${options.idNumber}`);
    progressBar.parentElement.classList.add('outline');

    dom.addAndRemoveHandler(progressBar, 'transitionend', (event) => {
        this.removeCrier(crierElement);
    });

    dom.applyTransition(progressBar, (element) => {
        element.style.width = 0;
        element.style.transition = `width ${duration}ms ease`;
        element.style.width = `${progressBar.parentElement.clientWidth}px`;
    })
}

TownCrier.prototype.showCrier = function(options) {
    const crierInfo = this.insertCrierIntoDomAsHiddenElement(options);
    const crierMainContainer = document.querySelector('.criers-outer-container');
    const placeholderHTML = this.getPlaceholderHTML(crierInfo.id);

    crierMainContainer.insertAdjacentHTML('afterbegin', placeholderHTML);

    const crierTemp = crierMainContainer.firstElementChild;

    dom.addAndRemoveHandler(crierTemp, 'transitionend', (event) => {
        this.replaceCrierPlaceholderWithCrier(crierInfo, options);
    });

    dom.applyTransition(crierTemp, (element) => {
        element.style.height = `${crierInfo.height}px`;
        element.style.transition = 'height 500ms ease';
    })
}
