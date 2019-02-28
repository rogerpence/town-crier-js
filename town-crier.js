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

TownCrier.prototype.removeCrier = function(crierElement, duration = 0) {
    dom.applyElementTransition(crierElement, (element) => {
        crierElement.style.transition = 'opacity 750ms ease, height 750ms ease, margin-bottom 765ms ease';
        // Setting minHeight ensures crier fully collapses.
        crierElement.style.minHeight = 0;
        crierElement.style.opacity = 0;
        crierElement.style.height = 0;
        crierElement.style.marginBottom = 0;
    })
    .then(() => {
        dom.removeElement(crierElement);
    });
}

TownCrier.prototype.applyCrierAttributes = function(crierElement, crierInfo, options) {
    crierElement.style.position = 'static';
    crierElement.style.height = `${crierInfo.height}px`;
    crierElement.setAttribute('data-height', `${crierInfo.height}px`);
    crierElement.style.justifySelf = options.justifySelf;
    if (options.shadow) {
        crierElement.classList.add('crier-shadow');
    }

    dom.addAndRemoveHandler(crierElement, 'click', (event) => {
        if (crierElement.getAttribute('closeType') !== 'auto') {
           this.removeCrier(crierElement);
        }
    });
}

TownCrier.prototype.replaceCrierPlaceholderWithCrier = function(crierInfo, options) {
    const crierMainContainer = document.querySelector('.criers-outer-container');

    const crierPlaceholder = document.getElementById(crierInfo.id);
    const newCrierElement = crierInfo.element;

    this.applyCrierAttributes(newCrierElement, crierInfo, options);

    crierMainContainer.replaceChild(newCrierElement, crierPlaceholder);

    dom.applyElementTransition(newCrierElement, (element) => {
         element.style.opacity = 1;
         element.style.transition = 'opacity 750ms ease, margin-bottom 750ms ease';
    });
    //.then(() => {
    //});

    const duration = newCrierElement.getAttribute('data-duration');

    if (newCrierElement.getAttribute('data-close-type') !== 'user') {
        if (!options.progressBar) {
            this.queueCrierRemovalWithoutProgressBar(newCrierElement, duration);
        }
        else {
            this.queueCrierRemovalWithProgressBar(newCrierElement, duration, options);
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

    dom.applyElementTransition(progressBar, (element) => {
        element.style.width = `${progressBar.parentElement.clientWidth}px`;
        element.style.transition = `width ${duration}ms ease`;
    })
    .then(() => {
        this.removeCrier(crierElement);
    });
}

TownCrier.prototype.showCrier = function(options) {
    const crierInfo = this.insertCrierIntoDomAsHiddenElement(options);
    const crierMainContainer = document.querySelector('.criers-outer-container');
    const placeholderHTML = this.getPlaceholderHTML(crierInfo.id);

    crierMainContainer.insertAdjacentHTML('afterbegin', placeholderHTML);

    const crierTemp = crierMainContainer.firstElementChild;

    dom.applyElementTransition(crierTemp, (element) => {
        element.style.height = `${crierInfo.height}px`;
        element.style.transition = 'height 500ms ease';
    })
    .then(() => {
        this.replaceCrierPlaceholderWithCrier(crierInfo, options);
    });
}
