"use strict";

var tooltip = document.querySelectorAll(".tooltip__informations")[0];

if (document.querySelectorAll(".footer__informations") && document.querySelectorAll(".footer__informations").length > 0) {
    document.querySelectorAll(".footer__informations")[0]
        .addEventListener("click", function () {
            tooltip.style.top = /^0(px)?$/.test(tooltip.style.top) ? '-100vh' : '0';
            this.style.backgroundImage = /^0(px)?$/.test(tooltip.style.top) ? 'url(../img/svg/close.svg)' : 'url(../img/svg/info.svg)';
        });
}

if (document.querySelectorAll(".content") && document.querySelectorAll(".content").length > 0) {
    document.querySelectorAll(".content")[0]
        .addEventListener("click", function () {
            tooltip.style.top = '-100vh';
        });
}

if (document.querySelectorAll(".tooltip__informations__list__element") && document.querySelectorAll(".tooltip__informations__list__element").length > 0) {
    document.querySelectorAll(".tooltip__informations__list__element")[0]
        .addEventListener('click', function () {
            browser.runtime.sendMessage({name: 'uninstall'});
        });
}

if (document.querySelectorAll(".tooltip__informations__list__element") && document.querySelectorAll(".tooltip__informations__list__element").length > 0) {
    document.querySelectorAll(".tooltip__informations__list__element")[1]
        .addEventListener("click", function () {
            closePopup();
        });
}
