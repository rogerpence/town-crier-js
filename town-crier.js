"use strict;"

import * as dom from './rp.dom.js';
import {crierStatus} from './town-crier-status.js';

export function TownCrier(options) {
    this.options = options;
};

TownCrier.prototype.showMessage = function() {
    console.log(this.options.name);
}

TownCrier.prototype.assignOptionDefaults = function() {
    const DEFAULT_STATUS_INDEX = 0;

    options.classList = options.classList || '';
    options.duration = options.duration || 5000;
    options.closeType = options.closeType || 'auto';

    options.status = crierStatus.find(x => x.status === status);
    options.status = options.status || crierStatus[DEFAULT_STATUS_INDEX];
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

TownCrier.prototype.getCrierMarkup = function(options) {
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

TownCrier.prototype.getHTML = function() {
    const  placeholderDiv =
`<div id="crier-placeholder" style="width: 175px; height: 0; opacity: 1;
       background-color: red; margin-bottom: 0;">
</div>`
    return placeholderDiv;
}

TownCrier.prototype.showMessage = function(e) {
    console.log(e);
}

TownCrier.prototype.addCrier = function(html) {
    const crierMainContainer = document.querySelector('.criers-inner-container');

    crierMainContainer.insertAdjacentHTML('afterbegin', html);

    const crierTemp = crierMainContainer.firstElementChild;

    dom.addAndRemoveHandler(crierTemp, 'transitionend', (event) => {
        console.log(event);
    });

    dom.applyTransition(crierTemp, (element) => {
        element.style.height = '25px';
        element.style.marginBottom = '.5rem';
        element.style.transition = 'height 750ms ease, margin-bottom 500ms ease';
    })
}
